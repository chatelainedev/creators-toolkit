const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// Import from core.js
const {
    IS_LOCAL,
    USERS_FOLDER,
    validateUserContext,
    getUserSitesFolder
} = require('./core');

const router = express.Router();

// =============================================================================
// PROJECT EXPORT ROUTES
// =============================================================================

// Export a project as ZIP file
router.post('/projects/export', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Export not available in hosted environment' });
    }

    try {
        const { projectName, userContext } = req.body;
        
        // Validate user context
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName || !projectName.trim()) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const projectPath = path.join(sitesFolder, projectName);
        
        // Security check - ensure project is in user's folder
        const resolvedProjectPath = path.resolve(projectPath);
        const resolvedSitesFolder = path.resolve(sitesFolder);
        
        if (!resolvedProjectPath.startsWith(resolvedSitesFolder)) {
            console.error('🚫 Security violation: Path traversal attempt');
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if project exists
        if (!await fs.pathExists(projectPath)) {
            console.log(`📁 Project not found: ${projectPath}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if it's actually a directory
        const projectStat = await fs.stat(projectPath);
        if (!projectStat.isDirectory()) {
            return res.status(400).json({ error: 'Project path is not a directory' });
        }

        // Generate filename with current date
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const cleanProjectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const zipFilename = `${cleanProjectName}_Export_${dateStr}.zip`;
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📦 Starting export for ${userDisplay}: ${projectName}`);
        console.log(`   📁 Source: ${projectPath}`);
        console.log(`   📄 Output: ${zipFilename}`);

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
        res.setHeader('Cache-Control', 'no-cache');

        // Create archiver instance
        const archive = archiver('zip', {
            zlib: { level: 9 } // Best compression
        });

        // Handle archiver errors
        archive.on('error', (err) => {
            console.error('📦 Archive error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to create archive' });
            }
        });

        // Handle archiver warnings
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn('📦 Archive warning (file not found):', err);
            } else {
                console.error('📦 Archive warning:', err);
            }
        });

        // Track progress
        let totalFiles = 0;
        archive.on('entry', (entry) => {
            totalFiles++;
            if (totalFiles % 10 === 0) { // Log every 10 files
                console.log(`   📄 Processed ${totalFiles} files...`);
            }
        });

        // Pipe archive data to response
        archive.pipe(res);

        // Add the entire project directory to the archive
        // This will preserve the folder structure: ProjectName/info.html, ProjectName/assets/...
        archive.directory(projectPath, projectName);

        // Finalize the archive
        await archive.finalize();

        console.log(`✅ Export completed: ${zipFilename}`);
        console.log(`   📊 Total files: ${totalFiles}`);
        console.log(`   📏 Archive size: ${archive.pointer()} bytes`);

    } catch (error) {
        console.error('❌ Export error:', error);
        
        // Send error response if headers haven't been sent yet
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Failed to export project',
                details: error.message 
            });
        }
    }
});

// Get export info for a project (optional - for showing file counts, sizes, etc.)
router.post('/projects/export-info', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Export not available in hosted environment' });
    }

    try {
        const { projectName, userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const projectPath = path.join(sitesFolder, projectName);
        
        // Security check
        const resolvedProjectPath = path.resolve(projectPath);
        const resolvedSitesFolder = path.resolve(sitesFolder);
        
        if (!resolvedProjectPath.startsWith(resolvedSitesFolder)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!await fs.pathExists(projectPath)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Calculate project info
        const info = await calculateProjectInfo(projectPath);
        
        console.log(`📊 Export info for "${projectName}": ${info.fileCount} files, ${formatFileSize(info.totalSize)}`);
        
        res.json({
            projectName,
            ...info,
            formattedSize: formatFileSize(info.totalSize)
        });

    } catch (error) {
        console.error('Error getting export info:', error);
        res.status(500).json({ error: 'Failed to get export information' });
    }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Calculate total files and size in a directory
async function calculateProjectInfo(dirPath) {
    let fileCount = 0;
    let totalSize = 0;
    let hasAssets = false;
    let hasImages = false;
    
    async function scanDirectory(currentPath) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);
            
            if (entry.isDirectory()) {
                // Check for special folders
                if (entry.name === 'assets') hasAssets = true;
                if (entry.name === 'images') hasImages = true;
                
                // Recursively scan subdirectory
                await scanDirectory(entryPath);
            } else if (entry.isFile()) {
                fileCount++;
                const stat = await fs.stat(entryPath);
                totalSize += stat.size;
            }
        }
    }
    
    await scanDirectory(dirPath);
    
    return {
        fileCount,
        totalSize,
        hasAssets,
        hasImages
    };
}

// Format file size in human readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    
    return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

module.exports = router;