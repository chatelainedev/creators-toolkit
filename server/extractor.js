const express = require('express');
const fs = require('fs-extra');
const path = require('path');

// Import from core.js
const {
    IS_LOCAL,
    USERS_FOLDER,
    validateUserContext,
    getUserSettingsFolder
} = require('./core');

const router = express.Router();

// =============================================================================
// EXTRACTOR ROUTES
// =============================================================================

// Get extractor folder for user
function getUserExtractorFolder(userContext) {
    if (userContext.isGuest) {
        return path.join(getUserSettingsFolder(userContext), 'extractor');
    } else {
        return path.join(getUserSettingsFolder(userContext), 'extractor');
    }
}

// List user's extractor projects
router.post('/extractor/projects', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const extractorFolder = getUserExtractorFolder(userContext);
        
        // Check if extractor folder exists
        if (!await fs.pathExists(extractorFolder)) {
            return res.json([]); // Return empty array if no projects yet
        }
        
        const files = await fs.readdir(extractorFolder);
        const projects = files
            .filter(file => file.endsWith('.json') && file !== 'categories.json' && file !== 'settings.json') // Add && file !== 'settings.json'
            .map(file => file.replace('.json', ''))
            .sort();
        
        res.json(projects);
        
    } catch (error) {
        console.error('Error reading extractor projects:', error);
        res.status(500).json({ error: 'Failed to read extractor projects' });
    }
});

// Save extractor project
router.post('/extractor/save-project', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, projectName, entries, metadata, activeCategoryIds } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName || !projectName.trim()) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ error: 'Entries array is required' });
        }

        const extractorFolder = getUserExtractorFolder(userContext);
        await fs.ensureDir(extractorFolder);
        
        const cleanProjectName = projectName.trim().replace(/[^a-zA-Z0-9-_\s]/g, '');
        const projectFile = path.join(extractorFolder, `${cleanProjectName}.json`);
        
        // Check if updating existing project
        let existingData = {};
        if (await fs.pathExists(projectFile)) {
            try {
                existingData = await fs.readJson(projectFile);
            } catch (e) {
                // If can't read existing, start fresh
            }
        }
        
        const projectData = {
            name: cleanProjectName,
            created: existingData.created || Date.now(),
            updated: Date.now(),
            entries: entries,
            entryCount: entries.length,
            activeCategoryIds: activeCategoryIds || [],
            localCategories: req.body.localCategories || [],  // ADD THIS LINE
            selectedEntryIds: req.body.selectedEntryIds || [],
            entryHelperSettings: req.body.entryHelperSettings || {},
            currentTab: req.body.currentTab || 'bulk-actions',
            currentView: req.body.currentView || 'compact',
            version: '1.0',
            metadata: metadata || existingData.metadata || {}
        };
        
        await fs.writeJson(projectFile, projectData, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved extractor project "${cleanProjectName}" for ${userDisplay} (${entries.length} entries)`);
        
        res.json({ 
            success: true, 
            message: `Project "${cleanProjectName}" saved successfully`,
            projectName: cleanProjectName,
            entryCount: entries.length
        });
        
    } catch (error) {
        console.error('Error saving extractor project:', error);
        res.status(500).json({ error: 'Failed to save extractor project' });
    }
});

// Load extractor project
router.post('/extractor/load-project', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const extractorFolder = getUserExtractorFolder(userContext);
        const projectFile = path.join(extractorFolder, `${projectName}.json`);
        
        if (!await fs.pathExists(projectFile)) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const projectData = await fs.readJson(projectFile);
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📖 Loaded extractor project "${projectName}" for ${userDisplay} (${projectData.entries?.length || 0} entries)`);
        
        res.json({
            success: true,
            projectName: projectData.name,
            entries: projectData.entries || [],
            activeCategoryIds: projectData.activeCategoryIds || [],
            localCategories: projectData.localCategories || [],  // ADD THIS LINE
            selectedEntryIds: projectData.selectedEntryIds || [],
            entryHelperSettings: projectData.entryHelperSettings || {},
            currentTab: projectData.currentTab || 'bulk-actions',
            currentView: projectData.currentView || 'compact',
            metadata: {
                created: projectData.created,
                updated: projectData.updated,
                entryCount: projectData.entryCount,
                version: projectData.version
            }
        });
        
    } catch (error) {
        console.error('Error loading extractor project:', error);
        res.status(500).json({ error: 'Failed to load extractor project' });
    }
});

// Import lorebook files
router.post('/extractor/import-lorebook', async (req, res) => {
    try {
        const { userContext, lorebookData } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!lorebookData || !Array.isArray(lorebookData)) {
            return res.status(400).json({ error: 'Lorebook data array is required' });
        }

        const extractedEntries = [];
        
        // Process each lorebook file
        for (const lorebook of lorebookData) {
            const { filename, content } = lorebook;
            
            try {
                const parsed = JSON.parse(content);
                
                // Handle SillyTavern format
                if (parsed.entries) {
                    Object.entries(parsed.entries).forEach(([originalId, entry]) => {
                        const processedEntry = {
                            ...entry, // Preserve ALL original SillyTavern fields
                            _sourceFile: filename,
                            _originalId: originalId,
                            _importId: `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            _importTimestamp: Date.now()
                        };
                        
                        // Only add defaults for truly missing required fields
                        if (!processedEntry.comment && !processedEntry.comment === '') {
                            processedEntry.comment = 'Untitled Entry';
                        }
                        if (!processedEntry.content && !processedEntry.content === '') {
                            processedEntry.content = '';
                        }
                        
                        extractedEntries.push(processedEntry);
                    });
                }
                
                console.log(`📚 Extracted ${Object.keys(parsed.entries || {}).length} entries from ${filename}`);
                
            } catch (parseError) {
                console.error(`Error parsing ${filename}:`, parseError);
                // Continue processing other files
            }
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📥 Import complete for ${userDisplay}: ${extractedEntries.length} total entries from ${lorebookData.length} files`);
        
        res.json({
            success: true,
            entries: extractedEntries,
            totalEntries: extractedEntries.length,
            filesProcessed: lorebookData.length
        });
        
    } catch (error) {
        console.error('Error importing lorebook:', error);
        res.status(500).json({ error: 'Failed to import lorebook data' });
    }
});

// Save user categories
router.post('/extractor/save-categories', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, categories } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!categories || !Array.isArray(categories)) {
            return res.status(400).json({ error: 'Categories array is required' });
        }

        const extractorFolder = getUserExtractorFolder(userContext);
        await fs.ensureDir(extractorFolder);
        
        const categoriesFile = path.join(extractorFolder, 'categories.json');
        
        const categoriesData = {
            categories: categories,
            updated: Date.now(),
            version: '1.0'
        };
        
        await fs.writeJson(categoriesFile, categoriesData, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        
        res.json({ 
            success: true, 
            message: `Saved ${categories.length} categories`,
            categoryCount: categories.length
        });
        
    } catch (error) {
        console.error('Error saving categories:', error);
        res.status(500).json({ error: 'Failed to save categories' });
    }
});

// Load user categories
router.post('/extractor/load-categories', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const extractorFolder = getUserExtractorFolder(userContext);
        const categoriesFile = path.join(extractorFolder, 'categories.json');
        
        // Check if categories file exists
        if (!await fs.pathExists(categoriesFile)) {
            return res.json({ 
                success: true,
                categories: [],
                message: 'No categories found'
            });
        }
        
        const categoriesData = await fs.readJson(categoriesFile);
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        
        res.json({
            success: true,
            categories: categoriesData.categories || [],
            metadata: {
                updated: categoriesData.updated,
                version: categoriesData.version
            }
        });
        
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});

// Delete extractor project
router.post('/extractor/delete-project', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const extractorFolder = getUserExtractorFolder(userContext);
        const projectFile = path.join(extractorFolder, `${projectName}.json`);
        
        if (!await fs.pathExists(projectFile)) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        await fs.remove(projectFile);
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🗑️ Deleted extractor project "${projectName}" for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: `Project "${projectName}" deleted successfully`
        });
        
    } catch (error) {
        console.error('Error deleting extractor project:', error);
        res.status(500).json({ error: 'Failed to delete extractor project' });
    }
});

// Export as plain text
router.post('/extractor/export-txt', async (req, res) => {
    try {
        const { userContext, entries, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ error: 'Entries array is required' });
        }

        // Generate plain text format with new separator
        const textContent = entries.map(entry => {
            const name = entry.comment || 'Untitled Entry';
            const content = entry.content || '';
            const separator = '---'; // Use Markdown-style separator
            
            // Format each entry
            return `${name}\n${separator}\n\n${content}\n\n`;
        }).join(''); // Use an empty join to avoid extra newlines between entries
        
        // Create the simplified header
        const header = `Project: ${projectName || 'Untitled'}\n\n`;
        
        const finalContent = header + textContent;
        
        // Prepare file for download
        const timestamp = new Date().toISOString().split('T')[0];
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'extractor_export'}_${timestamp}.txt"`);
        res.send(finalContent.trim()); // Trim any trailing whitespace
        
        console.log(`📄 Exported ${entries.length} entries as plain text for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
    } catch (error) {
        console.error('Error exporting as text:', error);
        res.status(500).json({ error: 'Failed to export as text' });
    }
});

// Export as markdown
router.post('/extractor/export-md', async (req, res) => {
    try {
        const { userContext, entries, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ error: 'Entries array is required' });
        }

        // Generate markdown format
        const timestamp = new Date().toISOString().split('T')[0];
        
        let mdContent = `# ${projectName || 'Lorebook Export'}\n\n`;
        mdContent += `**Exported:** ${timestamp}  \n`;
        mdContent += `**Entries:** ${entries.length}  \n\n`;
        mdContent += `---\n\n`;
        
        entries.forEach(entry => {
            const name = entry.comment || 'Untitled Entry';
            const content = entry.content || '';
            
            mdContent += `## ${name}\n\n`;
            mdContent += `${content}\n\n`;
            mdContent += `---\n\n`;
        });
        
        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'extractor_export'}_${timestamp}.md"`);
        res.send(mdContent);
        
        console.log(`📝 Exported ${entries.length} entries as markdown for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
    } catch (error) {
        console.error('Error exporting as markdown:', error);
        res.status(500).json({ error: 'Failed to export as markdown' });
    }
});

// Export as lorebook JSON
router.post('/extractor/export-json', async (req, res) => {
    try {
        const { userContext, entries, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ error: 'Entries array is required' });
        }

        // Reconstruct SillyTavern lorebook format
        const lorebookEntries = {};
        
        entries.forEach((entry, index) => {
            // Use original ID if available, otherwise generate new one
            const id = entry._originalId || index.toString();
            
            // Create clean entry without our internal fields
            const cleanEntry = { ...entry };
            delete cleanEntry._sourceFile;
            delete cleanEntry._originalId;
            delete cleanEntry._importId;
            delete cleanEntry._internalId;
            delete cleanEntry._importTimestamp;
            
            // Only set defaults for truly missing essential fields (don't overwrite existing values)
            if (typeof cleanEntry.uid === 'undefined') cleanEntry.uid = parseInt(id) || index;
            if (typeof cleanEntry.key === 'undefined') cleanEntry.key = [];
            if (typeof cleanEntry.keysecondary === 'undefined') cleanEntry.keysecondary = [];
            if (typeof cleanEntry.comment === 'undefined') cleanEntry.comment = 'Untitled Entry';
            if (typeof cleanEntry.content === 'undefined') cleanEntry.content = '';
            
            // Only set these defaults if they don't exist (preserve original values)
            if (typeof cleanEntry.constant === 'undefined') cleanEntry.constant = false;
            if (typeof cleanEntry.selective === 'undefined') cleanEntry.selective = true;
            if (typeof cleanEntry.selectiveLogic === 'undefined') cleanEntry.selectiveLogic = 0;
            if (typeof cleanEntry.addMemo === 'undefined') cleanEntry.addMemo = true;
            if (typeof cleanEntry.order === 'undefined') cleanEntry.order = 100;
            if (typeof cleanEntry.position === 'undefined') cleanEntry.position = 0;
            if (typeof cleanEntry.disable === 'undefined') cleanEntry.disable = false;
            if (typeof cleanEntry.excludeRecursion === 'undefined') cleanEntry.excludeRecursion = false;
            if (typeof cleanEntry.probability === 'undefined') cleanEntry.probability = 100;
            if (typeof cleanEntry.useProbability === 'undefined') cleanEntry.useProbability = true;
            if (typeof cleanEntry.depth === 'undefined') cleanEntry.depth = 4;
            if (typeof cleanEntry.scanDepth === 'undefined') cleanEntry.scanDepth = null;
            if (typeof cleanEntry.caseSensitive === 'undefined') cleanEntry.caseSensitive = null;
            if (typeof cleanEntry.matchWholeWords === 'undefined') cleanEntry.matchWholeWords = null;
            if (typeof cleanEntry.useGroupScoring === 'undefined') cleanEntry.useGroupScoring = null;
            if (typeof cleanEntry.ignoreBudget === 'undefined') cleanEntry.ignoreBudget = false;
            if (typeof cleanEntry.sticky === 'undefined') cleanEntry.sticky = 0;
            if (typeof cleanEntry.cooldown === 'undefined') cleanEntry.cooldown = 0;
            if (typeof cleanEntry.delay === 'undefined') cleanEntry.delay = 0;
            if (typeof cleanEntry.group === 'undefined') cleanEntry.group = '';
            if (typeof cleanEntry.groupWeight === 'undefined') cleanEntry.groupWeight = 100;
            if (typeof cleanEntry.automationId === 'undefined') cleanEntry.automationId = '';
            if (typeof cleanEntry.characterFilter === 'undefined') {
                cleanEntry.characterFilter = { isExclude: false, names: [], tags: [] };
            }
            
            lorebookEntries[id] = cleanEntry;
        });
        
        // Create full SillyTavern lorebook structure
        const lorebook = {
            entries: lorebookEntries,
            originalData: {
                name: projectName || 'Extractor Export',
                description: 'Exported from Creator\'s Toolkit - Extractor',
                scan_depth: 100,
                token_budget: 400,
                recursive_scanning: false,
                extensions: {
                    extractor_export: true,
                    export_timestamp: Date.now(),
                    entry_count: entries.length
                }
            }
        };
        
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Format JSON with proper indentation for readability
        const formattedJson = JSON.stringify(lorebook, null, 4);
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'extractor_export'}_${timestamp}.json"`);
        res.send(formattedJson);
        
        console.log(`📦 Exported ${entries.length} entries as lorebook JSON for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
    } catch (error) {
        console.error('Error exporting as JSON:', error);
        res.status(500).json({ error: 'Failed to export as JSON' });
    }
});

// Load Extractor settings
router.post('/extractor/load-settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Settings not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'extractor');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        let settings = {};
        if (await fs.pathExists(settingsFile)) {
            settings = await fs.readJson(settingsFile);
        }
        
        res.json(settings);
        
    } catch (error) {
        console.error('Error loading extractor settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});

// Save Extractor settings
router.post('/extractor/save-settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Settings not available in hosted environment' });
    }

    try {
        const { userContext, settings } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'extractor');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        await fs.ensureDir(settingsFolder);
        await fs.writeJson(settingsFile, settings, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved extractor settings for ${userDisplay}`);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error saving extractor settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// Get SillyTavern user profiles for extractor
router.post('/extractor/get-st-profiles', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'SillyTavern integration not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Load user's settings to get ST path
        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'extractor');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        if (!await fs.pathExists(settingsFile)) {
            return res.status(400).json({ error: 'SillyTavern path not configured. Please check your settings.' });
        }

        const settings = await fs.readJson(settingsFile);
        if (!settings.sillyTavernPath) {
            return res.status(400).json({ error: 'SillyTavern path not configured. Please check your settings.' });
        }

        const stDataPath = path.join(settings.sillyTavernPath, 'data');
        
        // Check if SillyTavern data folder exists
        if (!await fs.pathExists(stDataPath)) {
            return res.status(400).json({ error: 'SillyTavern data folder not found. Please check your settings.' });
        }

        // Scan for user profiles (folders without _ prefix)
        const entries = await fs.readdir(stDataPath, { withFileTypes: true });
        const profiles = [];
        
        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('_')) {
                // Check if it has a worlds folder
                const worldsPath = path.join(stDataPath, entry.name, 'worlds');
                if (await fs.pathExists(worldsPath)) {
                    profiles.push(entry.name);
                }
            }
        }

        profiles.sort();
        
        console.log(`📂 Found ${profiles.length} SillyTavern profiles for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
        res.json({ 
            success: true, 
            profiles: profiles,
            stPath: settings.sillyTavernPath
        });
        
    } catch (error) {
        console.error('Error getting ST profiles:', error);
        res.status(500).json({ error: 'Failed to scan SillyTavern profiles' });
    }
});

// Send lorebook to SillyTavern profile
router.post('/extractor/send-to-st', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'SillyTavern integration not available in hosted environment' });
    }

    try {
        const { userContext, entries, profile, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!entries || !profile || !projectName) {
            return res.status(400).json({ error: 'Entries, profile, and project name are required' });
        }

        // Load user's settings to get ST path
        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'extractor');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        if (!await fs.pathExists(settingsFile)) {
            return res.status(400).json({ error: 'SillyTavern path not configured' });
        }

        const settings = await fs.readJson(settingsFile);
        if (!settings.sillyTavernPath) {
            return res.status(400).json({ error: 'SillyTavern path not configured' });
        }

        // Validate target path
        const profileWorldsPath = path.join(settings.sillyTavernPath, 'data', profile, 'worlds');
        if (!await fs.pathExists(profileWorldsPath)) {
            return res.status(400).json({ error: `Profile "${profile}" worlds folder not found` });
        }

        // Create SillyTavern-compatible lorebook data
        const lorebookEntries = {};
        entries.forEach((entry, index) => {
            const id = `${Date.now()}_${index}`;
            
            // Handle key fields - they might be arrays or strings
            const processKeyField = (field) => {
                if (!field) return [];
                if (Array.isArray(field)) return field.filter(k => k && k.trim());
                if (typeof field === 'string') return field.split(',').map(k => k.trim()).filter(k => k);
                return [];
            };
            
            const cleanEntry = {
                uid: id,
                key: processKeyField(entry.key),
                keysecondary: processKeyField(entry.keysecondary),
                comment: entry.comment || `Entry ${index + 1}`,
                content: entry.content || '',
                constant: entry.constant || false,
                selective: entry.selective !== false,
                order: entry.order || 100,
                position: entry.position || 0,
                disable: entry.disable || false,
                addMemo: entry.addMemo || false,
                excludeRecursion: entry.excludeRecursion || false,
                delayUntilRecursion: entry.delayUntilRecursion || false,
                displayIndex: index,
                probability: entry.probability || 100,
                useProbability: entry.useProbability !== false,
                depth: entry.depth || 4,
                selectiveLogic: entry.selectiveLogic || 0,
                scanDepth: entry.scanDepth ?? null,
                caseSensitive: entry.caseSensitive ?? null,
                matchWholeWords: entry.matchWholeWords ?? null,
                useGroupScoring: entry.useGroupScoring ?? null,
                ignoreBudget: entry.ignoreBudget || false,
                sticky: entry.sticky || 0,
                cooldown: entry.cooldown || 0,
                delay: entry.delay || 0,
                group: entry.group || '',
                groupWeight: entry.groupWeight ?? 100,
                automationId: entry.automationId || '',
                characterFilter: entry.characterFilter ?? { isExclude: false, names: [], tags: [] },
            };
            
            lorebookEntries[id] = cleanEntry;
        });

        const lorebook = {
            entries: lorebookEntries,
            originalData: {
                name: projectName,
                description: 'Exported from Creator\'s Toolkit - Extractor',
                scan_depth: 100,
                token_budget: 400,
                recursive_scanning: false,
                extensions: {
                    extractor_export: true,
                    export_timestamp: Date.now(),
                    entry_count: entries.length
                }
            }
        };

        // Clean filename
        const cleanName = projectName.replace(/[^a-zA-Z0-9-_\s]/g, '_');
        const filename = `${cleanName}.json`;
        const outputPath = path.join(profileWorldsPath, filename);

        // Write lorebook file (silently overwrite)
        await fs.writeJson(outputPath, lorebook, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🌍 Sent lorebook "${projectName}" (${entries.length} entries) to SillyTavern profile "${profile}" for ${userDisplay}`);
        
        res.json({ 
            success: true,
            message: `Lorebook sent to ${profile}`,
            filename: filename,
            entryCount: entries.length
        });
        
    } catch (error) {
        console.error('Error sending lorebook to ST:', error);
        res.status(500).json({ error: 'Failed to send lorebook to SillyTavern' });
    }
});

module.exports = router;