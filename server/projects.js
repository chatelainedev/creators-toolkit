const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

// Import everything from core.js
const {
    // Constants
    IS_LOCAL,
    USERS_FOLDER,
    ACCOUNTS_FILE,
    GUEST_FOLDER,
    LEGACY_SITES_FOLDER,
    DEFAULT_AVATAR,
    
    // Utilities
    validateUserContext,
    getUserSettingsFolder,
    getUserSitesFolder,
    getUserRoleplaysFolder,
    loadAccounts,
    saveAccounts,
    loadUserSettings,
    saveUserSettings,
    getDefaultSettings,
    generateUserId,
    extractBannerInfo,
    
    // Multer configurations
    avatarUpload,
    roleplayImageUpload
} = require('./core');

const router = express.Router();

// List of all style assets we manage (so we can clean them up)
const MANAGED_STYLE_ASSETS = [
    'images/styles/cloudrecesses.png',
    'images/styles/mist.png', 
    'images/styles/fog.png'
    // Add any future style assets here
];

// Function to clean up unused style assets
async function cleanupUnusedStyleAssets(projectFolder, currentAssets = []) {
    console.log('🧹 Cleaning up unused style assets...');
    
    // Get list of currently needed asset destinations
    const currentDestinations = currentAssets.map(asset => asset.destination);
    console.log('  - Currently needed:', currentDestinations);
    
    let cleanedCount = 0;
    
    // Check each managed asset and remove if not currently needed
    for (const assetPath of MANAGED_STYLE_ASSETS) {
        if (!currentDestinations.includes(assetPath)) {
            const fullAssetPath = path.join(projectFolder, assetPath);
            
            try {
                if (await fs.pathExists(fullAssetPath)) {
                    await fs.remove(fullAssetPath);
                    console.log(`  ✅ Removed unused asset: ${assetPath}`);
                    cleanedCount++;
                } else {
                    console.log(`  ℹ️ Asset not found (already clean): ${assetPath}`);
                }
            } catch (error) {
                console.error(`  ❌ Failed to remove asset ${assetPath}:`, error);
            }
        } else {
            console.log(`  📌 Keeping needed asset: ${assetPath}`);
        }
    }
    
    // Clean up empty directories
    try {
        const stylesDir = path.join(projectFolder, 'images', 'styles');
        if (await fs.pathExists(stylesDir)) {
            const files = await fs.readdir(stylesDir);
            if (files.length === 0) {
                await fs.remove(stylesDir);
                console.log(`  🗑️ Removed empty styles directory`);
                cleanedCount++;
                
                // Also check if images directory is now empty
                const imagesDir = path.join(projectFolder, 'images');
                if (await fs.pathExists(imagesDir)) {
                    const imageFiles = await fs.readdir(imagesDir);
                    if (imageFiles.length === 0) {
                        await fs.remove(imagesDir);
                        console.log(`  🗑️ Removed empty images directory`);
                        cleanedCount++;
                    }
                }
            }
        }
    } catch (error) {
        console.error(`  ❌ Error cleaning up directories:`, error);
    }
    
    if (cleanedCount > 0) {
        console.log(`🧹 Cleanup complete: ${cleanedCount} items removed`);
    } else {
        console.log(`🧹 Cleanup complete: No unused assets found`);
    }
    
    return cleanedCount;
}

// =============================================================================
// LORE CODEX (INFO CONVERTER) ROUTES
// =============================================================================

// Get list of projects for a specific user (local only)
router.post('/projects', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const projects = [];

        if (!await fs.pathExists(sitesFolder)) {
            return res.json([]);
        }
        
        const entries = await fs.readdir(sitesFolder, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const projectName = entry.name;
                const projectPath = path.join(sitesFolder, projectName);
                
                // Read config to get filename
                let htmlFilename = 'info.html';
                const configPath = path.join(projectPath, 'project-config.json');
                if (await fs.pathExists(configPath)) {
                    try {
                        const config = await fs.readJson(configPath);
                        htmlFilename = config.htmlFilename || 'info.html';
                    } catch (e) {}
                }
                
                const infoPath = path.join(projectPath, htmlFilename);
                
                if (await fs.pathExists(infoPath)) {
                    const stats = await fs.stat(infoPath);
                    
                    let title = projectName;
                    try {
                        const htmlContent = await fs.readFile(infoPath, 'utf8');
                        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                        if (titleMatch && titleMatch[1]) {
                            title = titleMatch[1];
                        }
                    } catch (e) {}

                    const assetsPath = path.join(projectPath, 'assets');
                    const hasAssets = await fs.pathExists(assetsPath);

                    projects.push({
                        projectName: projectName,
                        htmlFilename: htmlFilename,  // ADD THIS
                        title: title,
                        lastModified: stats.mtime,
                        size: stats.size,
                        hasAssets: hasAssets,
                        path: projectPath,
                        userContext: userContext
                    });
                }
            }
        }

        projects.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        console.log(`📖 Found ${projects.length} projects for ${userContext.isGuest ? 'guest' : userContext.username}`);
        res.json(projects);
    } catch (error) {
        console.error('Error reading projects:', error);
        res.status(500).json({ error: 'Failed to read projects folder' });
    }
});

// Get user sites with banner information (for main page My Sites tab)
router.post('/user-sites', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const sites = [];

        // Check if sites folder exists
        if (!await fs.pathExists(sitesFolder)) {
            return res.json([]); // Return empty array if no projects yet
        }
        
        const entries = await fs.readdir(sitesFolder, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const projectName = entry.name;
                const projectPath = path.join(sitesFolder, projectName);
                
                // Read config to get filename
                let htmlFilename = 'info.html';
                const configPath = path.join(projectPath, 'project-config.json');
                if (await fs.pathExists(configPath)) {
                    try {
                        const config = await fs.readJson(configPath);
                        htmlFilename = config.htmlFilename || 'info.html';
                    } catch (e) {}
                }
                
                const infoPath = path.join(projectPath, htmlFilename);
                
                // Check if HTML file exists in this directory
                if (await fs.pathExists(infoPath)) {
                    const stats = await fs.stat(infoPath);
                    
                    // Extract title and banner info from HTML file
                    let title = projectName;
                    let bannerPath = null;
                    let bannerExists = false;
                    
                    try {
                        const htmlContent = await fs.readFile(infoPath, 'utf8');
                        
                        // Extract title
                        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                        if (titleMatch && titleMatch[1]) {
                            title = titleMatch[1];
                        }
                        
                        // Extract banner path from embedded data or HTML
                        const bannerInfo = await extractBannerInfo(htmlContent, projectPath);
                        bannerPath = bannerInfo.bannerPath;
                        bannerExists = bannerInfo.bannerExists;
                        
                    } catch (e) {
                        console.warn(`Could not parse HTML for project ${projectName}:`, e.message);
                        // Fallback to folder name if can't read
                    }

                    sites.push({
                        projectName: projectName,
                        htmlFilename: htmlFilename,  // ADD THIS
                        title: title,
                        lastModified: stats.mtime,
                        created: stats.birthtime || stats.mtime,
                        size: stats.size,
                        bannerPath: bannerPath,
                        bannerExists: bannerExists,
                        path: projectPath,
                        userContext: userContext
                    });
                }
            }
        }

        // Sort by last modified (newest first) by default
        sites.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        console.log(`🏠 Found ${sites.length} sites for ${userContext.isGuest ? 'guest' : userContext.username}`);
        res.json(sites);
    } catch (error) {
        console.error('Error reading user sites:', error);
        res.status(500).json({ error: 'Failed to read user sites' });
    }
});

// Load a specific project (local only) - now user-aware
router.post('/projects/load', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
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
        // Around line 266, in the load endpoint
        const projectPath = path.join(sitesFolder, projectName);

        // NEW: Read project metadata to get actual filename
        // Read project config to get actual filename
        let htmlFilename = 'info.html'; // default for backward compatibility
        const configPath = path.join(projectPath, 'project-config.json');  // <-- MATCH THE SAVE ENDPOINT
        if (await fs.pathExists(configPath)) {
            const config = await fs.readJson(configPath);
            htmlFilename = config.htmlFilename || 'info.html';  // <-- USE htmlFilename PROPERTY
        }

        const filePath = path.join(projectPath, htmlFilename); // CHANGED: use variable instead of hardcoded
        
        // Security check - ensure project is in users folder
        if (!projectPath.startsWith(USERS_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const htmlContent = await fs.readFile(filePath, 'utf8');
        console.log(`📖 Loaded project "${projectName}" for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
        res.json({ 
            projectName,
            content: htmlContent,
            userContext: userContext,
            success: true
        });
    } catch (error) {
        console.error('Error loading project:', error);
        res.status(404).json({ error: 'Project file not found' });
    }
});

// Save generated HTML to user's folder (local only)
router.post('/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { html, projectName, userContext, styleAssets = [], filename = 'info.html' } = req.body;
        
        if (!html) {
            return res.status(400).json({ error: 'No HTML content provided' });
        }
        
        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const cleanProjectName = projectName.replace(/[^a-zA-Z0-9-_\s]/g, '');
        const projectFolder = path.join(sitesFolder, cleanProjectName);
        
        // Read existing config if it exists to get current filename
        // Determine filename to use
        let htmlFilename = filename; // Use the filename from request
        if (!htmlFilename.endsWith('.html')) {
            htmlFilename += '.html'; // Ensure .html extension
        }

        // Read existing config if it exists
        const configPath = path.join(projectFolder, 'project-config.json');
        let currentFilename = htmlFilename; // Default to the new filename

        if (await fs.pathExists(configPath)) {
            try {
                const existingConfig = await fs.readJson(configPath);
                // If no new filename provided, use existing one
                if (!filename || filename === 'info' || filename === 'info.html') {
                    currentFilename = existingConfig.htmlFilename || 'info.html';
                    htmlFilename = currentFilename;
                }
            } catch (e) {
                console.warn('Could not read existing config:', e);
            }
        }

        const filePath = path.join(projectFolder, htmlFilename);
        
        // Ensure project folder exists
        await fs.ensureDir(projectFolder);
        
        // BACKUP LOGIC: Check if HTML file already exists and back it up (only if not skipping)
        const shouldSkipBackup = req.body.skipBackup || false;
        let backupMessage = '';
        
        if (!shouldSkipBackup) {
            try {
                if (await fs.pathExists(filePath)) {
                    // Create backup folder structure at user level
                    const userFolder = userContext.isGuest 
                        ? GUEST_FOLDER 
                        : path.join(USERS_FOLDER, userContext.userId);
                    const backupProjectFolder = path.join(userFolder, 'backups', 'sites', cleanProjectName);
                    await fs.ensureDir(backupProjectFolder);
                    
                    // Copy existing HTML file to backup location with same filename
                    const backupPath = path.join(backupProjectFolder, currentFilename);
                    await fs.copy(filePath, backupPath);
                    
                    console.log(`✅ Backed up existing ${currentFilename} for ${cleanProjectName} to user backups folder`);
                }
            } catch (backupError) {
                console.error('❌ Backup failed:', backupError);
                backupMessage = ' (Note: Failed to create backup of existing file)';
            }
        }
        
        // Save the new HTML file
        await fs.writeFile(filePath, html, 'utf8');
        
        // Save/update config file
        const config = {
            projectName: cleanProjectName,
            htmlFilename: htmlFilename,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };
        
        // Preserve creation date if config already exists
        if (await fs.pathExists(configPath)) {
            try {
                const existingConfig = await fs.readJson(configPath);
                config.created = existingConfig.created || config.created;
            } catch (e) {}
        }
        
        await fs.writeJson(configPath, config, { spaces: 2 });

        // Copy required style assets if any
        // Clean up unused style assets first
        let cleanedCount = 0;
        try {
            cleanedCount = await cleanupUnusedStyleAssets(projectFolder, styleAssets || []);
        } catch (error) {
            console.error('❌ Error during asset cleanup:', error);
        }
        
        // Copy required style assets if any
        let assetsCopied = [];
        if (styleAssets && styleAssets.length > 0) {
            for (const asset of styleAssets) {
                try {
                    const sourcePath = path.join(__dirname, '..', 'info-converter', asset.source);
                    const destPath = path.join(projectFolder, asset.destination);
                    
                    // Ensure destination directory exists
                    await fs.ensureDir(path.dirname(destPath));
                    
                    // Copy the asset file
                    if (await fs.pathExists(sourcePath)) {
                        await fs.copy(sourcePath, destPath);
                        assetsCopied.push(asset.destination);
                    } else {
                        console.warn(`⚠️ Style asset not found: ${asset.source}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to copy style asset ${asset.source}:`, error);
                }
            }
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved "${cleanProjectName}" for ${userDisplay}`);
        
        let responseMessage = `Project saved successfully for ${userDisplay}${backupMessage}`;
        
        if (assetsCopied.length > 0) {
            responseMessage += ` (${assetsCopied.length} style assets copied)`;
        }
        
        if (cleanedCount > 0) {
            responseMessage += ` (${cleanedCount} unused assets removed)`;
        }
        
        res.json({ 
            success: true, 
            message: responseMessage,
            projectName: cleanProjectName,
            filepath: filePath,
            assetsCopied: assetsCopied,
            assetsRemoved: cleanedCount,
            userContext: userContext
        });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ error: 'Failed to save file' });
    }
});

router.post('/projects/config', async (req, res) => {
    const { projectName, userContext } = req.body;
    const sitesFolder = getUserSitesFolder(userContext);
    const projectFolder = path.join(sitesFolder, projectName);
    const configPath = path.join(projectFolder, 'project-config.json');
    
    if (await fs.pathExists(configPath)) {
        const config = await fs.readJson(configPath);
        res.json(config);
    } else {
        res.json({ htmlFilename: 'info.html' });
    }
});

// Rename project and/or HTML file (local only)
router.post('/projects/rename', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { oldProjectName, newProjectName, oldFilename, newFilename, userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!oldProjectName || !newProjectName || !oldFilename || !newFilename) {
            return res.status(400).json({ error: 'All parameters are required' });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const oldProjectFolder = path.join(sitesFolder, oldProjectName);
        const newProjectFolder = path.join(sitesFolder, newProjectName);
        
        // Ensure old project exists
        if (!await fs.pathExists(oldProjectFolder)) {
            return res.status(404).json({ error: 'Original project not found' });
        }

        const projectNameChanged = oldProjectName !== newProjectName;
        const filenameChanged = oldFilename !== newFilename;
        
        let oldHtmlFilename = oldFilename.endsWith('.html') ? oldFilename : oldFilename + '.html';
        let newHtmlFilename = newFilename.endsWith('.html') ? newFilename : newFilename + '.html';

        // CASE 1: Only HTML filename changed
        if (!projectNameChanged && filenameChanged) {
            const oldHtmlPath = path.join(oldProjectFolder, oldHtmlFilename);
            const newHtmlPath = path.join(oldProjectFolder, newHtmlFilename);
            
            // Rename the HTML file
            await fs.rename(oldHtmlPath, newHtmlPath);
            
            // Update or create config
            const configPath = path.join(oldProjectFolder, 'project-config.json');
            let config = {};
            if (await fs.pathExists(configPath)) {
                config = await fs.readJson(configPath);
            }
            config.htmlFilename = newHtmlFilename;
            config.projectName = oldProjectName;
            await fs.writeJson(configPath, config, { spaces: 2 });
            
            console.log(`✅ Renamed HTML file: ${oldHtmlFilename} → ${newHtmlFilename}`);
            return res.json({ 
                success: true, 
                message: `HTML file renamed to ${newHtmlFilename}`,
                projectName: oldProjectName
            });
        }
        
        // CASE 2: Project name changed (with or without filename change)
        if (projectNameChanged) {
            // Check if new project name already exists
            if (await fs.pathExists(newProjectFolder)) {
                return res.status(400).json({ error: 'A project with that name already exists' });
            }
            
            // Copy entire project folder to new location
            await fs.copy(oldProjectFolder, newProjectFolder);
            
            // If filename also changed, rename the HTML file in the new folder
            if (filenameChanged) {
                const oldHtmlPath = path.join(newProjectFolder, oldHtmlFilename);
                const newHtmlPath = path.join(newProjectFolder, newHtmlFilename);
                await fs.rename(oldHtmlPath, newHtmlPath);
            }
            
            // Update config in new folder
            const configPath = path.join(newProjectFolder, 'project-config.json');
            const config = await fs.pathExists(configPath) 
                ? await fs.readJson(configPath) 
                : {};
            
            config.projectName = newProjectName;
            config.htmlFilename = newHtmlFilename;
            await fs.writeJson(configPath, config, { spaces: 2 });
            
            console.log(`✅ Created new project: ${newProjectName} (HTML: ${newHtmlFilename})`);
            return res.json({ 
                success: true, 
                message: `Project created as "${newProjectName}"${filenameChanged ? ` with HTML file "${newHtmlFilename}"` : ''}`,
                projectName: newProjectName
            });
        }
        
        // Should never reach here
        return res.status(400).json({ error: 'No changes specified' });
        
    } catch (error) {
        console.error('Error renaming project:', error);
        res.status(500).json({ error: 'Failed to rename project' });
    }
});

// Restore backup file (for auto-recovery)
router.post('/restore-backup', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName, userContext } = req.body;
        
        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const cleanProjectName = projectName.replace(/[^a-zA-Z0-9-_\s]/g, '');
        
        // Get paths
        const sitesFolder = getUserSitesFolder(userContext);
        const projectFolder = path.join(sitesFolder, cleanProjectName);
        
        // Read config to get filename
        let htmlFilename = 'info.html';
        const configPath = path.join(projectFolder, 'project-config.json');
        if (await fs.pathExists(configPath)) {
            try {
                const config = await fs.readJson(configPath);
                htmlFilename = config.htmlFilename || 'info.html';
            } catch (e) {}
        }
        
        const currentFilePath = path.join(projectFolder, htmlFilename);
        
        const userFolder = userContext.isGuest 
            ? GUEST_FOLDER 
            : path.join(USERS_FOLDER, userContext.userId);
        const backupPath = path.join(userFolder, 'backups', 'sites', cleanProjectName, htmlFilename);
        
        // Check if backup exists
        if (!(await fs.pathExists(backupPath))) {
            return res.status(404).json({ error: 'No backup found for this project' });
        }
        
        // Copy backup back to main location
        await fs.copy(backupPath, currentFilePath);
        
        res.json({ success: true, message: 'Backup restored successfully' });
        
    } catch (error) {
        console.error('Error restoring backup:', error);
        res.status(500).json({ error: 'Failed to restore backup' });
    }
});

// Generate and download HTML (fallback for hosted environment)
router.post('/generate', (req, res) => {
    try {
        const { html, filename = 'info.html' } = req.body;
        
        if (!html) {
            return res.status(400).json({ error: 'No HTML content provided' });
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        console.error('Error generating download:', error);
        res.status(500).json({ error: 'Failed to generate download' });
    }
});

// Get list of HTML files in matching roleplay folder for dropdown
router.post('/roleplay/list/:projectName', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName } = req.params;
        const { userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const projectRoleplaysPath = path.join(roleplaysFolder, projectName);
        
        console.log(`🎭 Checking for roleplay files in: ${projectRoleplaysPath}`);

        // Check if the project-specific roleplay folder exists
        if (!await fs.pathExists(projectRoleplaysPath)) {
            console.log(`📁 No roleplay folder found for project "${projectName}"`);
            return res.json([]);
        }

        // Get all HTML files in the folder
        const files = await fs.readdir(projectRoleplaysPath);
        const htmlFiles = files.filter(file => 
            file.toLowerCase().endsWith('.html') && 
            fs.statSync(path.join(projectRoleplaysPath, file)).isFile()
        );

        console.log(`🎭 Found ${htmlFiles.length} HTML files for project "${projectName}":`, htmlFiles);
        
        // Sort alphabetically for better UX
        htmlFiles.sort();
        
        res.json(htmlFiles);
    } catch (error) {
        console.error('Error listing roleplay files:', error);
        res.status(500).json({ error: 'Failed to list roleplay files' });
    }
});

// Import roleplay files to sites folder
router.post('/roleplay/import', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { filename, projectName, userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!filename || !projectName) {
            return res.status(400).json({ error: 'Filename and project name are required' });
        }

        console.log(`🎭 Import request: ${filename} for project ${projectName}`);

        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const sitesFolder = getUserSitesFolder(userContext);
        
        // Source paths (roleplay folder)
        const sourceProjectPath = path.join(roleplaysFolder, projectName);
        const sourceHtmlPath = path.join(sourceProjectPath, filename);
        const sourceCssPath = path.join(sourceProjectPath, 'generated.css');
        const sourceImagesPath = path.join(sourceProjectPath, 'images');
        
        // Destination paths (sites folder)
        const destProjectPath = path.join(sitesFolder, projectName);
        const destRoleplaysPath = path.join(destProjectPath, 'roleplays');
        const destImagesPath = path.join(destRoleplaysPath, 'images');
        const destHtmlPath = path.join(destRoleplaysPath, filename);
        const destCssPath = path.join(destRoleplaysPath, 'generated.css');

        // Security checks
        if (!sourceHtmlPath.startsWith(USERS_FOLDER) || !destHtmlPath.startsWith(USERS_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if source HTML file exists
        if (!await fs.pathExists(sourceHtmlPath)) {
            return res.status(404).json({ error: 'Source HTML file not found' });
        }

        // Create destination directories
        await fs.ensureDir(destRoleplaysPath);
        await fs.ensureDir(destImagesPath);

        let copiedFiles = [];
        let errors = [];

        // 1. Copy HTML file
        try {
            await fs.copy(sourceHtmlPath, destHtmlPath);
            copiedFiles.push(`${filename}`);
        } catch (error) {
            console.error(`❌ Failed to copy HTML file:`, error);
            errors.push(`HTML file: ${error.message}`);
        }

        // 2. Copy generated.css if it exists
        if (await fs.pathExists(sourceCssPath)) {
            try {
                await fs.copy(sourceCssPath, destCssPath);
                copiedFiles.push('generated.css');
            } catch (error) {
                console.error(`❌ Failed to copy CSS file:`, error);
                errors.push(`CSS file: ${error.message}`);
            }
        } else {
            console.log(`ℹ️ No generated.css found in source folder`);
        }

        // 3. Copy associated images (files that start with filename-)
        if (await fs.pathExists(sourceImagesPath)) {
            try {
                const sourceImages = await fs.readdir(sourceImagesPath);
                const baseFilename = filename.replace('.html', '');
                const associatedImages = sourceImages.filter(img => 
                    img.startsWith(`${baseFilename}-`) && 
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(img)
                );

                console.log(`🖼️ Found ${associatedImages.length} associated images for ${baseFilename}:`, associatedImages);

                for (const imageFile of associatedImages) {
                    try {
                        const sourceImagePath = path.join(sourceImagesPath, imageFile);
                        const destImagePath = path.join(destImagesPath, imageFile);
                        await fs.copy(sourceImagePath, destImagePath);
                        copiedFiles.push(`images/${imageFile}`);
                    } catch (error) {
                        console.error(`❌ Failed to copy image ${imageFile}:`, error);
                        errors.push(`Image ${imageFile}: ${error.message}`);
                    }
                }
            } catch (error) {
                console.error(`❌ Failed to read source images folder:`, error);
                errors.push(`Reading images folder: ${error.message}`);
            }
        } else {
            console.log(`ℹ️ No images folder found in source`);
        }

        // Prepare response
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        
        if (errors.length === 0) {
            console.log(`🎉 Successfully imported ${filename} for ${userDisplay}`);
            res.json({ 
                success: true, 
                message: `Successfully imported ${filename}`,
                copiedFiles,
                projectName,
                userContext
            });
        } else if (copiedFiles.length > 0) {
            console.log(`⚠️ Partial import success for ${filename}:`, { copiedFiles, errors });
            res.json({ 
                success: true, 
                message: `Partially imported ${filename} (some files failed)`,
                copiedFiles,
                errors,
                projectName,
                userContext
            });
        } else {
            console.log(`❌ Import failed completely for ${filename}:`, errors);
            res.status(500).json({ 
                success: false, 
                error: 'Import failed completely',
                errors
            });
        }
    } catch (error) {
        console.error('Error importing roleplay:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to import roleplay files' 
        });
    }
});

// Import image to assets folder
// Import image to assets folder - FIXED VERSION
router.post('/assets/import-image', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    // Use simple memory storage first, then handle file saving manually
    const memoryUpload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit
            files: 1
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });

    // Process the upload
    memoryUpload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Asset image upload error:', err);
            return res.status(400).json({ 
                success: false, 
                error: `Image upload failed: ${err.message}` 
            });
        }

        try {
            const { userContext: userContextStr, projectName, folderPath, filename } = req.body;
            
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No image file provided' 
                });
            }

            if (!userContextStr) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No user context provided' 
                });
            }

            const userContext = JSON.parse(userContextStr);
            const validation = validateUserContext(userContext);
            
            if (!validation.valid) {
                return res.status(400).json({ 
                    success: false, 
                    error: validation.error 
                });
            }

            if (!projectName || !folderPath || !filename) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing required fields: projectName, folderPath, or filename' 
                });
            }

            // Build the destination path manually
            const sitesFolder = getUserSitesFolder(userContext);
            const projectPath = path.join(sitesFolder, projectName);
            const destinationPath = path.join(projectPath, folderPath);
            
            // Security check
            const resolvedDestination = path.resolve(destinationPath);
            const resolvedProjectPath = path.resolve(projectPath);
            
            if (!resolvedDestination.startsWith(resolvedProjectPath)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid destination path' 
                });
            }
            
            // Create directory if it doesn't exist
            await fs.ensureDir(destinationPath);
            
            // Write the file manually
            const finalPath = path.join(destinationPath, filename);
            await fs.writeFile(finalPath, req.file.buffer);

            console.log(`📷 Asset Import Success:`);
            console.log(`  - Project: ${projectName}`);
            console.log(`  - Folder: ${folderPath}`);
            console.log(`  - Filename: ${filename}`);
            console.log(`  - Size: ${req.file.size} bytes`);

            // Build the relative path for the input field
            const relativePath = path.join(folderPath, filename).replace(/\\/g, '/');
            
            const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
            
            console.log(`✅ Successfully imported image for ${userDisplay}`);
            console.log(`  - Saved to: ${finalPath}`);
            console.log(`  - Relative path: ${relativePath}`);

            res.json({
                success: true,
                message: `Image imported successfully`,
                relativePath: relativePath,
                filename: filename,
                size: req.file.size,
                userContext: userContext
            });

        } catch (processingError) {
            console.error('Error processing asset import:', processingError);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to process image import' 
            });
        }
    });
});

// =============================================================================
// ASSETS MANAGEMENT ROUTES
// =============================================================================

// Check if assets folder exists (local only) - now user-aware
router.post('/assets/check', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName, userContext } = req.body;
        
        if (!projectName) {
            return res.json({ 
                exists: false,
                needsProject: true,
                message: 'Select or create a project first'
            });
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const assetsPath = path.join(sitesFolder, projectName, 'assets');
        
        const exists = await fs.pathExists(assetsPath);
        res.json({ 
            exists,
            path: exists ? assetsPath : null,
            projectName,
            userContext
        });
    } catch (error) {
        console.error('Error checking assets folder:', error);
        res.status(500).json({ error: 'Failed to check assets folder' });
    }
});

// Create assets folder structure (local only) - now user-aware
router.post('/assets/create', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName, userContext } = req.body;
        
        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const projectPath = path.join(sitesFolder, projectName);
        const assetsPath = path.join(projectPath, 'assets');
        
        // Create basic folder structure
        // Create comprehensive folder structure
        const folders = [
            'assets',
            'assets/characters',
            'assets/ui',
            'assets/ui/backgrounds',
            'assets/ui/banners', 
            'assets/ui/overview',
            'assets/events',
            'assets/world',
            'assets/world/general',
            'assets/world/locations',
            'assets/world/factions',
            'assets/world/culture',
            'assets/world/cultivation',
            'assets/world/magic',
            'assets/world/concepts',
            'assets/world/creatures',
            'assets/world/plants',
            'assets/world/items'
        ];

        for (const folder of folders) {
            await fs.ensureDir(path.join(projectPath, folder));
        }

        // Create a README file
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        const readmeContent = `# Assets Folder for ${projectName}

        This folder contains all assets for the "${projectName}" project.
        Owner: ${userDisplay}

        ## Folder Structure:
        - \`characters/\` - Character images and galleries
        - Create subfolders for each character (e.g., \`characters/john-doe/\`)
        - \`ui/\` - Interface elements
        - \`backgrounds/\` - Background images for pages
        - \`banners/\` - Banner images for this world  
        - \`overview/\` - Overview section images
        - \`events/\` - Event-related images
        - \`world/\` - World-building assets
        - \`general/\` - General images
        - \`locations/\` - Images for locations
        - \`factions/\` - Images for factions
        - \`culture/\` - Cultural elements and imagery
        - \`cultivation/\` - Cultivation system images
        - \`magic/\` - Magic system images
        - \`concepts/\` - Abstract concept illustrations
        - \`creatures/\` - Images for creatures
        - \`plants/\` - Images for plants and flora
        - \`items/\` - Images for items, weapons, artifacts, etc.

        ## Usage:
        When referencing images in the Lore Codex, use relative paths like:
        - \`assets/ui/banners/my-banner.jpg\`
        - \`assets/characters/john-doe/portrait.jpg\`
        - \`assets/world/locations/castle.jpg\`
        - \`assets/events/battle-of-kings.jpg\`

        The generated info.html file will look for these assets relative to its location in the project folder.
        `;

        await fs.writeFile(path.join(assetsPath, 'README.md'), readmeContent);

        console.log(`📁 Created assets folder for "${projectName}" (${userDisplay})`);
        res.json({ 
            success: true, 
            message: `Assets folder structure created for ${projectName}`,
            path: assetsPath,
            projectName,
            userContext
        });
    } catch (error) {
        console.error('Error creating assets folder:', error);
        res.status(500).json({ error: 'Failed to create assets folder' });
    }
});

// Import general file to project (local only) - user-aware  
router.post('/assets/import-file', multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for files
}).single('file'), async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName, userContext: userContextStr, filename, folderPath } = req.body;
        
        if (!projectName || !userContextStr || !filename || !folderPath) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: projectName, userContext, filename, or folderPath' 
            });
        }

        const userContext = JSON.parse(userContextStr);
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded' 
            });
        }

        // Build the destination path manually
        const sitesFolder = getUserSitesFolder(userContext);
        const projectPath = path.join(sitesFolder, projectName);
        const destinationPath = path.join(projectPath, folderPath);
        
        // Security check
        const resolvedDestination = path.resolve(destinationPath);
        const resolvedProjectPath = path.resolve(projectPath);
        
        if (!resolvedDestination.startsWith(resolvedProjectPath)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid destination path' 
            });
        }
        
        // Create directory if it doesn't exist
        await fs.ensureDir(destinationPath);
        
        // Write the file manually
        const finalPath = path.join(destinationPath, filename);
        await fs.writeFile(finalPath, req.file.buffer);

        console.log(`📁 File Import Success:`);
        console.log(`  - Project: ${projectName}`);
        console.log(`  - Folder: ${folderPath}`);
        console.log(`  - Filename: ${filename}`);
        console.log(`  - Size: ${req.file.size} bytes`);

        // Build the relative path 
        const relativePath = path.join(folderPath, filename).replace(/\\/g, '/');
        
        const userDisplay = userContext.isGuest ? 'Guest' : userContext.username;

        res.json({
            success: true,
            message: `File imported successfully`,
            relativePath: relativePath,
            filename: filename,
            size: req.file.size,
            userContext: userContext
        });

    } catch (processingError) {
        console.error('Error processing file import:', processingError);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process file import' 
        });
    }
});

// Check for existing lorebook files (local only) - user-aware
router.post('/assets/check-lorebook', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName, userContext } = req.body;
        
        if (!projectName) {
            return res.json({ success: false, message: 'No project specified' });
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const lorebookPath = path.join(sitesFolder, projectName, 'assets', 'lorebook');
        
        if (!await fs.pathExists(lorebookPath)) {
            return res.json({ success: false, message: 'No lorebook folder found' });
        }
        
        // Get the first JSON file in the lorebook folder
        const files = await fs.readdir(lorebookPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        if (jsonFiles.length === 0) {
            return res.json({ success: false, message: 'No lorebook files found' });
        }
        
        // Return the first lorebook file found
        const lorebookFile = jsonFiles[0];
        
        res.json({ 
            success: true,
            lorebookFile: lorebookFile,
            lorebookPath: path.join(lorebookPath, lorebookFile)
        });
        
    } catch (error) {
        console.error('Error checking lorebook:', error);
        res.status(500).json({ success: false, error: 'Failed to check lorebook' });
    }
});

// =============================================================================
// RP ARCHIVER (ROLEPLAY CONVERTER) ROUTES
// =============================================================================

// Get list of roleplay projects for a specific user (local only)
router.post('/roleplay/projects', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const projects = [];

        // Check if roleplays folder exists
        if (!await fs.pathExists(roleplaysFolder)) {
            return res.json([]); // Return empty array if no projects yet
        }
        
        const universeEntries = await fs.readdir(roleplaysFolder, { withFileTypes: true });
        
        for (const universeEntry of universeEntries) {
            if (universeEntry.isDirectory()) {
                const universeName = universeEntry.name;
                const universePath = path.join(roleplaysFolder, universeName);
                
                // Look for HTML files in this universe folder
                const fileEntries = await fs.readdir(universePath, { withFileTypes: true });
                
                for (const fileEntry of fileEntries) {
                    if (fileEntry.isFile() && fileEntry.name.endsWith('.html')) {
                        const filePath = path.join(universePath, fileEntry.name);
                        const stats = await fs.stat(filePath);
                        
                        // Try to extract title from HTML file
                        let title = fileEntry.name.replace('.html', '');
                        let pairing = '';
                        try {
                            const htmlContent = await fs.readFile(filePath, 'utf8');
                            const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                            if (titleMatch && titleMatch[1]) {
                                const fullTitle = titleMatch[1];
                                // Format is usually "Title - Pairing"
                                const parts = fullTitle.split(' - ');
                                title = parts[0] || title;
                                pairing = parts[1] || '';
                            }
                        } catch (e) {
                            // Fallback to filename
                        }

                        projects.push({
                            filename: fileEntry.name,
                            title: title,
                            pairing: pairing,
                            universe: universeName,
                            lastModified: stats.mtime,
                            size: stats.size,
                            path: filePath,
                            userContext: userContext
                        });
                    }
                }
            }
        }

        // Sort by last modified (newest first)
        projects.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        console.log(`🎭 Found ${projects.length} roleplay projects for ${userContext.isGuest ? 'guest' : userContext.username}`);
        res.json(projects);
    } catch (error) {
        console.error('Error reading roleplay projects:', error);
        res.status(500).json({ error: 'Failed to read roleplay projects folder' });
    }
});

// Load a specific roleplay project (local only)
router.post('/roleplay/load', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { universe, filename, userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!universe || !filename) {
            return res.status(400).json({ error: 'Universe and filename are required' });
        }

        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const filePath = path.join(roleplaysFolder, universe, filename);
        
        // Security check - ensure file is in users folder
        if (!filePath.startsWith(USERS_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const htmlContent = await fs.readFile(filePath, 'utf8');
        console.log(`🎭 Loaded roleplay "${filename}" from universe "${universe}" for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
        res.json({ 
            filename,
            universe,
            content: htmlContent,
            userContext: userContext,
            success: true
        });
    } catch (error) {
        console.error('Error loading roleplay project:', error);
        res.status(404).json({ error: 'Roleplay file not found' });
    }
});

// Get list of available CSS templates
// Get list of available CSS templates - ENHANCED VERSION with CSS name parsing
router.get('/roleplay/templates', async (req, res) => {
    try {
        const templatesFolder = path.join(__dirname, '..', 'roleplay-converter', 'templates');
        const mainCSSPath = path.join(__dirname, '..', 'roleplay-converter', 'generated.css');
        const templates = [];
        
        console.log('🎨 CSS Template Discovery:');
        console.log(`  - Templates folder: ${templatesFolder}`);
        console.log(`  - Main CSS file: ${mainCSSPath}`);
        
        // Helper function to extract template name from CSS file
        async function extractTemplateName(filePath, fallbackName) {
            try {
                const cssContent = await fs.readFile(filePath, 'utf8');
                
                // Look for /* Name: TemplateName */ pattern (case insensitive)
                const nameMatch = cssContent.match(/\/\*\s*Name:\s*([^*]+?)\s*\*\//i);
                
                if (nameMatch && nameMatch[1]) {
                    const extractedName = nameMatch[1].trim();
                    console.log(`  - Found name comment in ${path.basename(filePath)}: "${extractedName}"`);
                    return extractedName;
                }
                
                console.log(`  - No name comment found in ${path.basename(filePath)}, using fallback: "${fallbackName}"`);
                return fallbackName;
            } catch (error) {
                console.warn(`  - Error reading ${path.basename(filePath)}: ${error.message}`);
                return fallbackName;
            }
        }
        
        // Always add the default template (main generated.css)
        const mainCSSExists = await fs.pathExists(mainCSSPath);
        console.log(`  - Main CSS exists: ${mainCSSExists}`);
        
        let defaultName = 'Default';
        if (mainCSSExists) {
            defaultName = await extractTemplateName(mainCSSPath, 'Default');
        }
        
        templates.push({
            value: 'generated.css',
            label: defaultName,
            exists: mainCSSExists
        });
        
        // Ensure templates folder exists
        await fs.ensureDir(templatesFolder);
        console.log(`  - Templates folder ensured`);
        
        // Check if templates folder exists and read files
        if (await fs.pathExists(templatesFolder)) {
            const files = await fs.readdir(templatesFolder);
            console.log(`  - Found ${files.length} files in templates folder:`, files);
            
            // Filter for CSS files and add them to the list
            for (const file of files) {
                if (file.endsWith('.css') && file !== 'generated.css') {
                    const filePath = path.join(templatesFolder, file);
                    const fileExists = await fs.pathExists(filePath);
                    
                    // Try to extract name from CSS comment, with intelligent fallbacks
                    let templateName;
                    
                    if (fileExists) {
                        // First try to extract from CSS comment
                        templateName = await extractTemplateName(filePath, null);
                        
                        // If no name found, use intelligent fallbacks
                        if (!templateName) {
                            // Check for patterns like "generated_1.css" -> "Template 1"
                            const numberMatch = file.match(/generated[-_](\d+)\.css/);
                            if (numberMatch) {
                                templateName = `Template ${numberMatch[1]}`;
                            } else {
                                // Use filename without extension as last resort
                                templateName = file.replace('.css', '').replace(/[-_]/g, ' ');
                                // Capitalize first letter of each word
                                templateName = templateName.split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                            }
                        }
                    } else {
                        templateName = 'Missing Template';
                    }
                    
                    console.log(`    - ${file} -> "${templateName}" (exists: ${fileExists})`);
                    
                    templates.push({
                        value: file,
                        label: templateName,
                        exists: fileExists
                    });
                }
            }
        } else {
            console.log('  - Templates folder does not exist');
        }
        
        // Sort templates (keep Default first, then alphabetically)
        const defaultTemplate = templates.find(t => t.value === 'generated.css');
        const otherTemplates = templates.filter(t => t.value !== 'generated.css')
            .sort((a, b) => a.label.localeCompare(b.label));
        
        const sortedTemplates = [defaultTemplate, ...otherTemplates];
        
        console.log(`📋 Final template list: ${sortedTemplates.length} templates`);
        sortedTemplates.forEach(t => console.log(`    - ${t.label}: ${t.value} (${t.exists ? 'EXISTS' : 'MISSING'})`));
        
        res.json(sortedTemplates);
    } catch (error) {
        console.error('Error reading CSS templates:', error);
        res.status(500).json({ error: 'Failed to read templates' });
    }
});

// Save roleplay HTML to user's folder (local only) - with template support
router.post('/roleplay/save', (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    // Create a custom multer instance that handles the dynamic destination
    // Create a custom multer instance that handles files in memory first
    const memoryRoleplayUpload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
            files: 20 // Max 20 files total
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });

    // Process the upload
    memoryRoleplayUpload.any()(req, res, async (err) => {
        if (err) {
            console.error('Image upload error:', err);
            return res.status(400).json({ error: `Image upload failed: ${err.message}` });
        }

        try {
            const { html, title, universe, cssTemplate, userContext: userContextStr } = req.body;
            
            console.log('🎭 Roleplay Save Request:');
            console.log(`  - Title: ${title}`);
            console.log(`  - Universe: ${universe}`);
            console.log(`  - CSS Template: ${cssTemplate}`);
            console.log(`  - Has HTML: ${!!html}`);
            console.log(`  - Images uploaded: ${req.files?.length || 0}`);
            
            if (!html) {
                return res.status(400).json({ error: 'No HTML content provided' });
            }

            if (!title || !title.trim()) {
                return res.status(400).json({ error: 'Story title is required' });
            }

            if (!universe || !universe.trim()) {
                return res.status(400).json({ error: 'Universe is required' });
            }

            const userContext = JSON.parse(userContextStr);
            const validation = validateUserContext(userContext);
            if (!validation.valid) {
                return res.status(400).json({ error: validation.error });
            }

            // Clean title for filename - convert spaces to hyphens and make lowercase
            const cleanTitle = title.trim().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[<>:"/\\|?*',.()[\]{}]/g, '-')  // Include apostrophes, commas, and other problematic characters
                .replace(/-+/g, '-')                      // Replace multiple consecutive hyphens with single hyphen
                .replace(/^-|-$/g, '');                   // Remove leading/trailing hyphens
            // Clean universe for folder name - only remove invalid characters, keep original case and spaces
            const cleanUniverse = universe.trim().replace(/[<>:"/\\|?*]/g, '');         
            // Get existing image paths from the client (matches what downloadHTML() sends)
            const existingBackgroundPath = req.body.existingBackgroundPath;
            const existingStoryPaths = req.body.existingStoryPaths ? JSON.parse(req.body.existingStoryPaths) : [];
            const existingImageCount = parseInt(req.body.existingImageCount) || 0;
            const existingBannerPath = req.body.existingBannerPath;

            console.log('🖼️ Existing image data from client:');
            console.log('  - Background path:', existingBackgroundPath);
            console.log('  - Story paths:', existingStoryPaths);
            console.log('  - Existing image count:', existingImageCount);

            // Update HTML with correct image paths
            let updatedHtml = html;

        // Process background image - handle both new files and existing paths
        // Create directories first
        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const universePath = path.join(roleplaysFolder, cleanUniverse);
        const imagesFolder = path.join(universePath, 'images');

        // Create directories if they don't exist
        await fs.ensureDir(imagesFolder);

        // Process background image - handle both new files and existing paths
        const backgroundFile = req.files?.find(f => f.fieldname === 'backgroundImage');
        if (backgroundFile) {
            // New background file uploaded - save with proper name
            const ext = path.extname(backgroundFile.originalname);
            const finalBackgroundName = `${cleanTitle}-background${ext}`;
            const finalFilePath = path.join(imagesFolder, finalBackgroundName);
            
            try {
                await fs.writeFile(finalFilePath, backgroundFile.buffer);
                console.log(`💾 Saved background: ${finalBackgroundName}`);
            } catch (saveError) {
                console.error(`❌ Failed to save background file:`, saveError);
            }
            
            const backgroundPath = `images/${finalBackgroundName}`;
            updatedHtml = updatedHtml.replace(
                /background-image:\s*url\(['"][^'"]*['"]\)/g,
                `background-image: url('${backgroundPath}')`
            );
            console.log(`🖼️ Updated background image path (new file): ${backgroundPath}`);
        } else if (existingBackgroundPath) {
            // Preserve existing background image
            updatedHtml = updatedHtml.replace(
                /background-image:\s*url\(['"][^'"]*['"]\)/g,
                `background-image: url('${existingBackgroundPath}')`
            );
            console.log(`🖼️ Preserved existing background image: ${existingBackgroundPath}`);
        }

        // Process banner image - handle both new files and existing paths  
        const bannerFile = req.files?.find(f => f.fieldname === 'bannerImage');
        if (bannerFile) {
            // New banner file uploaded - save with proper name
            const ext = path.extname(bannerFile.originalname);
            const finalBannerName = `${cleanTitle}-banner${ext}`;
            const finalFilePath = path.join(imagesFolder, finalBannerName);
            
            try {
                await fs.writeFile(finalFilePath, bannerFile.buffer);
                console.log(`💾 Saved banner: ${finalBannerName}`);
            } catch (saveError) {
                console.error(`❌ Failed to save banner file:`, saveError);
            }
            
            const bannerPath = `images/${finalBannerName}`;
            updatedHtml = updatedHtml.replace(
                /header\s*{([^}]*?)background-image:\s*url\(['"][^'"]*['"]\)/g,
                `header {$1background-image: url('${bannerPath}')`
            );
            console.log(`🖼️ Updated banner image path (new file): ${bannerPath}`);
        } else if (existingBannerPath) {
            // Preserve existing banner image
            updatedHtml = updatedHtml.replace(
                /header\s*{([^}]*?)background-image:\s*url\(['"][^'"]*['"]\)/g,
                `header {$1background-image: url('${existingBannerPath}')`
            );
            console.log(`🖼️ Preserved existing banner image: ${existingBannerPath}`);
        }

        // Process story images - handle both new and existing with smart numbering
        const storyImages = req.files?.filter(f => f.fieldname.startsWith('storyImage_')) || [];

        // Create a complete list of image paths in the correct order
        const allImagePaths = [];

        // First, add existing images (these come first in the HTML)
        existingStoryPaths.forEach(path => {
            allImagePaths.push(path);
            console.log(`📋 Added existing image path: ${path}`);
        });

        // Then, add new uploaded images with smart numbering to avoid conflicts
        if (storyImages.length > 0) {
            // Sort by index to maintain order
            storyImages.sort((a, b) => {
                const indexA = parseInt(a.fieldname.split('_')[1]);
                const indexB = parseInt(b.fieldname.split('_')[1]);
                return indexA - indexB;
            });
            
            // Check what image files actually exist in the images folder
            let actualExistingCount = 0;
            if (await fs.pathExists(imagesFolder)) {
                const existingFiles = await fs.readdir(imagesFolder);
                const imageFiles = existingFiles.filter(file => 
                    file.startsWith(`${cleanTitle}-image-`) && 
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
                );
                actualExistingCount = imageFiles.length;
                console.log(`📊 Found ${actualExistingCount} existing image files in folder:`, imageFiles);
            } else {
                console.log(`📊 Images folder doesn't exist yet`);
            }
            
            // Use the larger of the two counts to be safe
            const safeStartingNumber = Math.max(existingImageCount, actualExistingCount) + 1;
            console.log(`🔢 Using starting number ${safeStartingNumber} (client said ${existingImageCount}, folder has ${actualExistingCount})`);
            
            for (let i = 0; i < storyImages.length; i++) {
                const img = storyImages[i];
                // Generate a safe filename that won't conflict with existing images
                let imageNumber = safeStartingNumber + i;
                let safeFilename;
                let finalFilePath;
                
                // Keep incrementing until we find a filename that doesn't exist
                do {
                    const ext = path.extname(img.originalname);
                    safeFilename = `${cleanTitle}-image-${imageNumber}${ext}`;
                    finalFilePath = path.join(imagesFolder, safeFilename);
                    
                    if (await fs.pathExists(finalFilePath)) {
                        console.log(`⚠️ File ${safeFilename} already exists, trying next number...`);
                        imageNumber++;
                    } else {
                        break;
                    }
                } while (await fs.pathExists(finalFilePath));
                
                // Save the file with the final safe filename
                try {
                    await fs.writeFile(finalFilePath, img.buffer);
                    console.log(`💾 Saved story image: ${safeFilename}`);
                } catch (saveError) {
                    console.error(`❌ Failed to save story image file:`, saveError);
                }
                
                // Create the new path
                const newPath = `images/${safeFilename}`;
                allImagePaths.push(newPath);
                console.log(`📁 Added new image path (${imageNumber}): ${newPath}`);
            }
        }

        // Replace ALL story image sources with the complete list
        if (allImagePaths.length > 0) {
            let imageIndex = 0;
            updatedHtml = updatedHtml.replace(
                /<img[^>]+src="[^"]*"[^>]*alt="Story Image"[^>]*>/g,
                (match) => {
                    if (imageIndex < allImagePaths.length) {
                        const imagePath = allImagePaths[imageIndex++];
                        console.log(`🔄 Replacing story image ${imageIndex - 1} with: ${imagePath}`);
                        return match.replace(/src="[^"]*"/, `src="${imagePath}"`);
                    }
                    console.warn(`⚠️ No path available for story image ${imageIndex}`);
                    imageIndex++;
                    return match;
                }
            );
            
            console.log(`✅ Updated ${allImagePaths.length} total story images (${existingStoryPaths.length} existing + ${storyImages.length} new)`);
            
            // Flag for response - conflicts were avoided if we had existing images and new images
            var conflictsAvoided = existingImageCount > 0 && storyImages.length > 0;
        } else {
            console.log('ℹ️ No story images to process');
            var conflictsAvoided = false;
        }
            

            const htmlFilename = `${cleanTitle}.html`;
            const htmlFilePath = path.join(universePath, htmlFilename);
            
            // Ensure universe directory exists
            await fs.ensureDir(universePath);
            console.log(`📁 Universe folder ensured: ${universePath}`);
            
            // Ensure we're writing to the users folder
            if (!htmlFilePath.startsWith(USERS_FOLDER)) {
                return res.status(403).json({ error: 'Invalid file path' });
            }

            // Save the updated HTML file
            await fs.writeFile(htmlFilePath, updatedHtml, 'utf8');
            console.log(`💾 Saved HTML file: ${htmlFilePath}`);

            // ENHANCED CSS TEMPLATE HANDLING - CORRECTED VERSION
            console.log('🎨 CSS Template Processing:');
            const selectedTemplate = cssTemplate || 'generated.css';
            console.log(`  - Selected template: ${selectedTemplate}`);

            let cssSourcePath;
            let templateFound = false;

            // FIXED: Always check templates folder first, then fallback to main folder
            const templatesFolder = path.join(__dirname, '..', 'roleplay-converter', 'templates');
            const templatePath = path.join(templatesFolder, selectedTemplate);
            const mainPath = path.join(__dirname, '..', 'roleplay-converter', selectedTemplate);

            console.log(`  - Checking template path: ${templatePath}`);
            console.log(`  - Checking main path: ${mainPath}`);

            // Check if file exists in templates folder first
            if (await fs.pathExists(templatePath)) {
                cssSourcePath = templatePath;
                console.log(`  - Found in templates folder: ${cssSourcePath}`);
            } else if (await fs.pathExists(mainPath)) {
                cssSourcePath = mainPath;
                console.log(`  - Found in main folder: ${cssSourcePath}`);
            } else {
                console.log(`  - Template not found in either location`);
                cssSourcePath = null;
            }

            const cssDestPath = path.join(universePath, 'generated.css');
            console.log(`  - Destination: ${cssDestPath}`);

            if (cssSourcePath) {
                console.log(`  - Source exists: true at ${cssSourcePath}`);
                
                try {
                    // Read source file to verify it's not empty
                    const sourceContent = await fs.readFile(cssSourcePath, 'utf8');
                    console.log(`  - Source file size: ${sourceContent.length} characters`);
                    
                    if (sourceContent.length > 0) {
                        await fs.copy(cssSourcePath, cssDestPath);
                        templateFound = true;
                        console.log(`✅ Successfully copied template "${selectedTemplate}" to universe "${cleanUniverse}"`);
                        
                        // Verify the copy worked
                        const destExists = await fs.pathExists(cssDestPath);
                        const destContent = await fs.readFile(cssDestPath, 'utf8');
                        console.log(`  - Destination exists: ${destExists}`);
                        console.log(`  - Destination file size: ${destContent.length} characters`);
                        
                        if (destContent.length !== sourceContent.length) {
                            console.warn(`⚠️ File size mismatch! Source: ${sourceContent.length}, Dest: ${destContent.length}`);
                        }
                    } else {
                        console.warn(`⚠️ Source CSS file is empty: ${cssSourcePath}`);
                    }
                } catch (copyError) {
                    console.error(`❌ Failed to copy CSS template:`, copyError);
                    templateFound = false;
                }
            } else {
                console.warn(`⚠️ CSS template "${selectedTemplate}" not found in either location`);
                
                // List available files for debugging
                if (await fs.pathExists(templatesFolder)) {
                    const files = await fs.readdir(templatesFolder);
                    console.log(`  - Available files in templates folder:`, files);
                }
                
                const mainFolder = path.join(__dirname, '..', 'roleplay-converter');
                if (await fs.pathExists(mainFolder)) {
                    const files = await fs.readdir(mainFolder);
                    const cssFiles = files.filter(f => f.endsWith('.css'));
                    console.log(`  - Available CSS files in main folder:`, cssFiles);
                }
            }

            // Fallback logic - try to find ANY CSS file if the selected one fails
            if (!templateFound) {
                console.log('🔄 Attempting fallback CSS...');
                
                // Try to find any CSS file in templates folder
                if (await fs.pathExists(templatesFolder)) {
                    const files = await fs.readdir(templatesFolder);
                    const cssFiles = files.filter(f => f.endsWith('.css'));
                    
                    if (cssFiles.length > 0) {
                        const fallbackFile = cssFiles[0]; // Use first available CSS file
                        const fallbackPath = path.join(templatesFolder, fallbackFile);
                        console.log(`  - Trying fallback: ${fallbackFile}`);
                        
                        try {
                            await fs.copy(fallbackPath, cssDestPath);
                            console.log(`✅ Fallback CSS successful: ${fallbackFile}`);
                            templateFound = true;
                        } catch (fallbackError) {
                            console.error('❌ Fallback CSS copy failed:', fallbackError);
                        }
                    }
                }
            }
            
            const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
            const totalImages = (backgroundFile ? 1 : 0) + (bannerFile ? 1 : 0) + storyImages.length;
            
            console.log(`🎭 Save completed for ${userDisplay}:`);
            console.log(`  - File: ${cleanTitle}.html`);
            console.log(`  - Universe: ${cleanUniverse}`);
            console.log(`  - Images: ${totalImages}`);
            console.log(`  - CSS Template: ${selectedTemplate} ${templateFound ? '✅' : '❌'}`);

            // ADD TEMPLATE MARKER TO HTML (WORKS WITHOUT HEAD TAGS)
            console.log(`🏷️ Template marker check: templateFound=${templateFound}, selectedTemplate=${selectedTemplate}`);

            if (templateFound) {
                try {
                    
                    const templateMarker = `<meta name="rp-archiver-template" content="${selectedTemplate}">`;
                    
                    // Read the HTML file we just saved
                    let htmlContent = await fs.readFile(htmlFilePath, 'utf8');
                    
                    // Try multiple insertion points
                    let inserted = false;
                    
                    // First try: look for </head>
                    if (htmlContent.includes('</head>')) {
                        htmlContent = htmlContent.replace('</head>', `\n${templateMarker}\n</head>`);
                        inserted = true;
                    }
                    // Second try: look for <title> tag and insert after it
                    else if (htmlContent.includes('</title>')) {
                        htmlContent = htmlContent.replace('</title>', `</title>\n${templateMarker}`);
                        inserted = true;
                    }
                    // Third try: look for first <meta> tag and insert before it
                    else if (htmlContent.includes('<meta')) {
                        htmlContent = htmlContent.replace('<meta', `${templateMarker}\n<meta`);
                        inserted = true;
                    }
                    // Fourth try: insert right after <!DOCTYPE html> and <html> tags
                    else if (htmlContent.includes('<html')) {
                        htmlContent = htmlContent.replace(/(<html[^>]*>)/i, `$1\n${templateMarker}`);
                        inserted = true;
                    }
                    
                    if (inserted) {
                        // Save the HTML with the template marker
                        await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
                        
                        // Verify it was added
                        const verifyContent = await fs.readFile(htmlFilePath, 'utf8');
                        if (verifyContent.includes('rp-archiver-template')) {
                        } else {
                            console.warn(`⚠️ Template marker not found in saved file after insertion!`);
                        }
                    } else {
                        console.warn(`⚠️ Could not find suitable insertion point for template marker`);
                        console.log(`📄 HTML structure preview: ${htmlContent.substring(0, 1000)}...`);
                    }
                } catch (markerError) {
                    console.error('❌ Error adding template marker:', markerError);
                }
            } else {
                console.log(`⚠️ Skipping template marker - templateFound is false`);
            }
            
            res.json({ 
                success: true, 
                message: `Roleplay saved successfully for ${userDisplay}`,
                conflictsAvoided: conflictsAvoided,
                title: cleanTitle,
                universe: cleanUniverse,
                filename: htmlFilename,
                filepath: htmlFilePath,
                cssTemplate: selectedTemplate,
                cssIncluded: templateFound,
                cssWarning: templateFound ? null : `CSS template "${selectedTemplate}" not found, using default`,
                imagesUploaded: totalImages,
                userContext: userContext
            });
            
        } catch (processingError) {
            console.error('Error processing roleplay save:', processingError);
            res.status(500).json({ error: 'Failed to save roleplay file' });
        }
    });
});

// Check if roleplay images exist (for import functionality)
router.post('/roleplay/check-images', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { universe, imagePaths, userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!universe || !Array.isArray(imagePaths)) {
            return res.status(400).json({ error: 'Universe and imagePaths array are required' });
        }

        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const universePath = path.join(roleplaysFolder, universe);
        
        const existingImages = [];
        const missingImages = [];
        
        for (const imagePath of imagePaths) {
            // imagePath will be like "images/story-title-background.jpg"
            const fullImagePath = path.join(universePath, imagePath);
            
            // Security check - ensure we're checking within the user's folder
            if (fullImagePath.startsWith(USERS_FOLDER) && await fs.pathExists(fullImagePath)) {
                existingImages.push(imagePath);
            } else {
                missingImages.push(imagePath);
            }
        }
        
        console.log(`🔍 Image check for "${universe}": ${existingImages.length} found, ${missingImages.length} missing`);
        
        res.json({
            existingImages,
            missingImages,
            totalChecked: imagePaths.length
        });
        
    } catch (error) {
        console.error('Error checking image existence:', error);
        res.status(500).json({ error: 'Failed to check image existence' });
    }
});

// Get list of universes (folders in roleplays directory)
router.post('/roleplay/universes', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        
        console.log(`📁 Loading universes for user:`, userContext.isGuest ? 'Guest' : userContext.username);
        
        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        
        if (!await fs.pathExists(roleplaysFolder)) {
            console.log(`📁 Roleplays folder doesn't exist: ${roleplaysFolder}`);
            return res.json([]);
        }
        
        const items = await fs.readdir(roleplaysFolder);
        
        const universes = [];
        for (const item of items) {
            const itemPath = path.join(roleplaysFolder, item);
            const stat = await fs.stat(itemPath);
            if (stat.isDirectory()) {
                universes.push(item);
            }
        }
        
        console.log(`📁 Found ${universes.length} universes: ${universes.join(', ')}`);
        
        universes.sort();
        res.json(universes);
        
    } catch (error) {
        console.error('❌ Error loading universes:', error);
        res.status(500).json({ error: 'Failed to load universes' });
    }
});

// Get list of stories (HTML files) in a specific universe
router.post('/roleplay/stories', async (req, res) => {
    try {
        const { userContext, universe } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        
        if (!universe) {
            return res.status(400).json({ error: 'Universe name is required' });
        }
        
        console.log(`📄 Loading stories for universe: ${universe}`);
        
        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const universePath = path.join(roleplaysFolder, universe);
        
        if (!await fs.pathExists(universePath)) {
            console.log(`📄 Universe folder doesn't exist: ${universePath}`);
            return res.json([]);
        }
        
        const files = await fs.readdir(universePath);
        
        const stories = [];
        for (const file of files) {
            const filePath = path.join(universePath, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isFile() && /\.html?$/i.test(file)) {
                stories.push({
                    filename: file,
                    size: stat.size,
                    modified: stat.mtime
                });
            }
        }
        
        console.log(`📄 Found ${stories.length} HTML files in ${universe}`);
        
        stories.sort((a, b) => a.filename.localeCompare(b.filename));
        res.json(stories);
        
    } catch (error) {
        console.error('❌ Error loading stories:', error);
        res.status(500).json({ error: 'Failed to load stories' });
    }
});

// Load a specific story file
router.post('/roleplay/load-story', async (req, res) => {
    try {
        const { userContext, universe, storyFilename } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        
        if (!universe || !storyFilename) {
            return res.status(400).json({ error: 'Universe and story filename are required' });
        }
        
        console.log(`📖 Loading story: ${universe}/${storyFilename}`);
        
        const roleplaysFolder = getUserRoleplaysFolder(userContext);
        const storyPath = path.join(roleplaysFolder, universe, storyFilename);
        
        // Security check
        const resolvedStoryPath = path.resolve(storyPath);
        const resolvedRoleplaysFolder = path.resolve(roleplaysFolder);
        
        if (!resolvedStoryPath.startsWith(resolvedRoleplaysFolder)) {
            console.error('❌ Security violation: Path traversal attempt');
            return res.status(403).json({ error: 'Access denied' });
        }
        
        if (!await fs.pathExists(storyPath)) {
            console.log(`📖 Story file doesn't exist: ${storyPath}`);
            return res.status(404).json({ error: 'Story file not found' });
        }
        
        const stat = await fs.stat(storyPath);
        if (!stat.isFile()) {
            console.log(`📖 Path is not a file: ${storyPath}`);
            return res.status(400).json({ error: 'Path is not a file' });
        }
        
        const content = await fs.readFile(storyPath, 'utf8');
        
        console.log(`✅ Successfully loaded ${universe}/${storyFilename} (${content.length} characters)`);
        
        res.json({
            success: true,
            content,
            universe,
            filename: storyFilename,
            size: stat.size,
            modified: stat.mtime
        });
        
    } catch (error) {
        console.error('❌ Error loading story:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load story file' 
        });
    }
});

// =============================================================================
// LEGACY & MIGRATION ROUTES
// =============================================================================

// Legacy support: Get old projects from sites folder (for migration)
router.get('/legacy/projects', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const projects = [];
        
        if (await fs.pathExists(LEGACY_SITES_FOLDER)) {
            const entries = await fs.readdir(LEGACY_SITES_FOLDER, { withFileTypes: true });
            
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const projectName = entry.name;
                    const projectPath = path.join(LEGACY_SITES_FOLDER, projectName);
                    const infoPath = path.join(projectPath, 'info.html');
                    
                    if (await fs.pathExists(infoPath)) {
                        const stats = await fs.stat(infoPath);
                        
                        let title = projectName;
                        try {
                            const htmlContent = await fs.readFile(infoPath, 'utf8');
                            const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                            if (titleMatch && titleMatch[1]) {
                                title = titleMatch[1];
                            }
                        } catch (e) {
                            // Fallback to folder name
                        }

                        projects.push({
                            projectName: projectName,
                            title: title,
                            lastModified: stats.mtime,
                            path: projectPath,
                            isLegacy: true
                        });
                    }
                }
            }
        }
        
        res.json(projects);
    } catch (error) {
        console.error('Error reading legacy projects:', error);
        res.status(500).json({ error: 'Failed to read legacy projects' });
    }
});

// =============================================================================
// CUSTOM PAGES ENDPOINTS
// =============================================================================

// Create custom folder structure (local only) - user-aware
router.post('/assets/create-folder', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { projectName, folderPath, userContext } = req.body;
        
        if (!projectName || !folderPath) {
            return res.status(400).json({ error: 'Project name and folder path are required' });
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const sitesFolder = getUserSitesFolder(userContext);
        const projectPath = path.join(sitesFolder, projectName);
        const fullFolderPath = path.join(projectPath, folderPath);
        
        // Security check
        const resolvedPath = path.resolve(fullFolderPath);
        const resolvedProjectPath = path.resolve(projectPath);
        
        if (!resolvedPath.startsWith(resolvedProjectPath)) {
            return res.status(400).json({ error: 'Invalid folder path' });
        }
        
        // Create directory
        await fs.ensureDir(fullFolderPath);

        res.json({
            success: true,
            message: `Folder created: ${folderPath}`,
            path: fullFolderPath
        });
        
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ error: 'Failed to create folder' });
    }
});

// =============================================================================
// DEBUG ENDPOINTS
// =============================================================================

// Debug endpoint to test template folder structure
router.get('/debug/templates', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Debug endpoints not available in hosted environment' });
    }

    try {
        const templatesFolder = path.join(__dirname, '..', 'roleplay-converter', 'templates');
        const mainCSSPath = path.join(__dirname, '..', 'roleplay-converter', 'generated.css');
        const roleplayConverterFolder = path.join(__dirname, '..', 'roleplay-converter');
        
        const debug = {
            paths: {
                roleplayConverter: roleplayConverterFolder,
                templatesFolder: templatesFolder,
                mainCSS: mainCSSPath
            },
            exists: {
                roleplayConverter: await fs.pathExists(roleplayConverterFolder),
                templatesFolder: await fs.pathExists(templatesFolder),
                mainCSS: await fs.pathExists(mainCSSPath)
            },
            files: {}
        };
        
        // List files in roleplay-converter folder
        if (debug.exists.roleplayConverter) {
            debug.files.roleplayConverter = await fs.readdir(roleplayConverterFolder);
        }
        
        // List files in templates folder
        if (debug.exists.templatesFolder) {
            debug.files.templates = await fs.readdir(templatesFolder);
        } else {
            // Try to create templates folder
            await fs.ensureDir(templatesFolder);
            debug.exists.templatesFolder = await fs.pathExists(templatesFolder);
            debug.files.templates = debug.exists.templatesFolder ? await fs.readdir(templatesFolder) : [];
        }
        
        // Check main CSS file size
        if (debug.exists.mainCSS) {
            const stats = await fs.stat(mainCSSPath);
            debug.mainCSSSize = stats.size;
        }
        
        // Check template file sizes
        if (debug.files.templates) {
            debug.templateSizes = {};
            for (const file of debug.files.templates) {
                if (file.endsWith('.css')) {
                    const filePath = path.join(templatesFolder, file);
                    const stats = await fs.stat(filePath);
                    debug.templateSizes[file] = stats.size;
                }
            }
        }
        
        console.log('🛠️ Template Debug Info:', JSON.stringify(debug, null, 2));
        res.json(debug);
        
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to check HTML template structure
router.get('/debug/html-template', (req, res) => {
    try {
        const indexPath = path.join(__dirname, '..', 'roleplay-converter', 'index.html');
        
        if (fs.pathExistsSync(indexPath)) {
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            
            // Extract the template content
            const templateMatch = indexContent.match(/<template id="html-template">(.*?)<\/template>/s);
            
            if (templateMatch) {
                const templateContent = templateMatch[1];
                
                res.json({
                    success: true,
                    hasTemplate: true,
                    templateLength: templateContent.length,
                    hasHeadTag: templateContent.includes('<head>'),
                    hasHeadCloseTag: templateContent.includes('</head>'),
                    hasHtmlTag: templateContent.includes('<html'),
                    templatePreview: templateContent.substring(0, 1000) + '...',
                    fullTemplate: templateContent
                });
            } else {
                res.json({
                    success: false,
                    error: 'No template found in index.html',
                    indexPreview: indexContent.substring(0, 1000) + '...'
                });
            }
        } else {
            res.json({
                success: false,
                error: 'index.html not found',
                path: indexPath
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;