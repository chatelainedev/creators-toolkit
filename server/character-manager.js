const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'temp/uploads/' });
const extract = require('png-chunks-extract');
const encode = require('png-chunks-encode');
const text = require('png-chunk-text');

// Import from core.js
const {
    IS_LOCAL,
    USERS_FOLDER,
    validateUserContext,
    getUserSettingsFolder
} = require('./core');

const router = express.Router();

// =============================================================================
// CHARACTER MANAGER ROUTES
// =============================================================================

// Get character manager folder for user
function getUserCharacterManagerFolder(userContext) {
    if (userContext.isGuest) {
        return path.join(getUserSettingsFolder(userContext), 'character-manager');
    } else {
        return path.join(getUserSettingsFolder(userContext), 'character-manager');
    }
}

// Get temp folder for user
function getUserTempFolder(userContext) {
    const userId = userContext.isGuest ? 'guest' : userContext.username;
    return path.join(__dirname, 'temp', 'character-imports', userId);
}



// List user's character manager projects
router.post('/character-manager/projects', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        
        // Check if character manager folder exists
        if (!await fs.pathExists(characterManagerFolder)) {
            return res.json([]); // Return empty array if no projects yet
        }
        
        const entries = await fs.readdir(characterManagerFolder, { withFileTypes: true });
        const projects = [];
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                // New structure: project folder with project.json
                const projectJsonPath = path.join(characterManagerFolder, entry.name, 'project.json');
                if (await fs.pathExists(projectJsonPath)) {
                    projects.push(entry.name);
                }
            } else if (entry.isFile() && entry.name.endsWith('.json') && 
           entry.name !== 'folders.json' && entry.name !== 'settings.json') {
                // Old structure: single JSON files
                const projectName = entry.name.replace('.json', '');
                projects.push(projectName);
            }
        }
        
        projects.sort();
        res.json(projects);
        
    } catch (error) {
        console.error('Error reading character manager projects:', error);
        res.status(500).json({ error: 'Failed to read character manager projects' });
    }
});

// Upload avatar to temp folder
router.post('/character-manager/upload-avatar-temp', upload.single('avatar'), async (req, res) => {
    try {
        const userContext = JSON.parse(req.body.userContext);
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const characterId = req.body.characterId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const tempFolder = getUserTempFolder(userContext);
        const tempOriginalsFolder = path.join(tempFolder, 'originals');
        const tempThumbnailsFolder = path.join(tempFolder, 'thumbnails');
        
        // Ensure temp folders exist
        await fs.ensureDir(tempFolder);
        await fs.ensureDir(tempOriginalsFolder);
        await fs.ensureDir(tempThumbnailsFolder);
        
        const avatarId = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempOriginalFile = `${characterId}_${avatarId}.png`;
        const tempThumbnailFile = `${characterId}_${avatarId}_thumb.jpg`;
        const tempOriginalPath = path.join(tempOriginalsFolder, tempOriginalFile);
        const tempThumbnailPath = path.join(tempThumbnailsFolder, tempThumbnailFile);
        
        // Read uploaded file
        const uploadedBuffer = await fs.readFile(file.path);

        // Clean PNG metadata before saving
        const cleanedBuffer = await cleanPngMetadata(uploadedBuffer);

        // Save cleaned PNG to temp originals folder
        await fs.writeFile(tempOriginalPath, cleanedBuffer);

        // Delete uploaded temp file
        await fs.remove(file.path);
        
        // Generate thumbnail
        await generateThumbnailFromBuffer(await fs.readFile(tempOriginalPath), tempThumbnailPath);
        
        // Read thumbnail for immediate display
        const thumbData = await fs.readFile(tempThumbnailPath);
        const avatarThumbnail = `data:image/jpeg;base64,${thumbData.toString('base64')}`;
        
        console.log(`📁 Saved avatar to temp: ${tempOriginalFile} and ${tempThumbnailFile}`);
        
        res.json({
            success: true,
            avatarId: avatarId,  // ADD THIS LINE
            tempOriginalFile: tempOriginalFile,
            tempThumbnailFile: tempThumbnailFile,
            avatarThumbnail: avatarThumbnail,
            hasAvatar: true
        });
        
    } catch (error) {
        console.error('Error uploading avatar to temp:', error);
        res.status(500).json({ error: 'Failed to upload avatar to temp folder' });
    }
});

// Save character manager project
router.post('/character-manager/upload-temp-files', upload.array('files'), async (req, res) => {
    try {
        const userContext = JSON.parse(req.body.userContext);
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const charactersData = JSON.parse(req.body.charactersData);
        const files = req.files || [];

        const tempFolder = getUserTempFolder(userContext);
        const tempOriginalsFolder = path.join(tempFolder, 'originals');
        const tempThumbnailsFolder = path.join(tempFolder, 'thumbnails');
        
        // Ensure temp folders exist
        await fs.ensureDir(tempFolder);
        await fs.ensureDir(tempOriginalsFolder);
        await fs.ensureDir(tempThumbnailsFolder);
        
        const processedCharacters = [];
        let fileIndex = 0;
        
        // Process each character and match with uploaded files
        for (const characterInfo of charactersData) {
            if (characterInfo.hasImageFile && fileIndex < files.length) {
                const file = files[fileIndex];
                const characterId = characterInfo.id;
                
                const avatarId = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const tempOriginalFile = `${characterId}_${avatarId}.png`;
                const tempThumbnailFile = `${characterId}_${avatarId}_thumb.jpg`;
                const tempOriginalPath = path.join(tempOriginalsFolder, tempOriginalFile);
                const tempThumbnailPath = path.join(tempThumbnailsFolder, tempThumbnailFile);
                
                try {
                    // Read uploaded file
                    const uploadedBuffer = await fs.readFile(file.path);
                    
                    // Clean PNG metadata before saving
                    const cleanedBuffer = await cleanPngMetadata(uploadedBuffer);
                    
                    // Save cleaned PNG to temp originals folder
                    await fs.writeFile(tempOriginalPath, cleanedBuffer);
                    
                    // Delete uploaded temp file
                    await fs.remove(file.path);
                    
                    // Generate thumbnail
                    await generateThumbnailFromBuffer(await fs.readFile(tempOriginalPath), tempThumbnailPath);
                    
                    // Read thumbnail for immediate display
                    const thumbData = await fs.readFile(tempThumbnailPath);
                    const avatarThumbnail = `data:image/jpeg;base64,${thumbData.toString('base64')}`;
                    
                    processedCharacters.push({
                        id: characterId,
                        avatarId: avatarId,  // ADD THIS LINE
                        tempOriginalFile: tempOriginalFile,
                        tempThumbnailFile: tempThumbnailFile,
                        avatarThumbnail: avatarThumbnail,
                        hasAvatar: true
                    });
                    
                    console.log(`📁 Saved to temp: ${tempOriginalFile} and ${tempThumbnailFile}`);
                } catch (error) {
                    console.error(`❌ Failed to process temp file for ${characterId}:`, error);
                    // Clean up uploaded file if processing failed
                    if (await fs.pathExists(file.path)) {
                        await fs.remove(file.path);
                    }
                }
                
                fileIndex++;
            }
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📁 Uploaded ${processedCharacters.length} files to temp folder for ${userDisplay}`);
        
        res.json({
            success: true,
            characters: processedCharacters
        });
        
    } catch (error) {
        console.error('Error uploading files to temp:', error);
        res.status(500).json({ error: 'Failed to upload files to temp folder' });
    }
});

// Upload folder cover to temp folder
router.post('/character-manager/upload-folder-cover-temp', upload.single('cover'), async (req, res) => {
    try {
        const userContext = JSON.parse(req.body.userContext);
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const folderId = req.body.folderId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const tempFolder = getUserTempFolder(userContext);
        const tempFolderCoversFolder = path.join(tempFolder, 'folder-covers');
        
        await fs.ensureDir(tempFolderCoversFolder);
        
        const tempCoverFile = `${folderId}_cover.jpg`;
        const tempCoverPath = path.join(tempFolderCoversFolder, tempCoverFile);
        
        // Read and generate thumbnail (320x200 for folder covers)
        const uploadedBuffer = await fs.readFile(file.path);
        await generateThumbnailFromBuffer(uploadedBuffer, tempCoverPath, 320, 200, 85);
        
        // Delete uploaded temp file
        await fs.remove(file.path);
        
        // Read thumbnail for immediate display
        const coverData = await fs.readFile(tempCoverPath);
        const coverThumbnail = `data:image/jpeg;base64,${coverData.toString('base64')}`;
        
        res.json({
            success: true,
            tempCoverFile: tempCoverFile,
            coverThumbnail: coverThumbnail
        });
        
    } catch (error) {
        console.error('Error uploading folder cover to temp:', error);
        res.status(500).json({ error: 'Failed to upload folder cover' });
    }
});

// Updated save-project route to handle temp files
// Updated save-project route to handle temp files
router.post('/character-manager/save-project', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, projectName, characters, folders, metadata, viewState } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!projectName || !projectName.trim()) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        if (!characters || !Array.isArray(characters)) {
            return res.status(400).json({ error: 'Characters array is required' });
        }

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        const tempFolder = getUserTempFolder(userContext);
        
        await fs.ensureDir(characterManagerFolder);
        
        const cleanProjectName = projectName.trim().replace(/[^a-zA-Z0-9-_\s]/g, '');
        const projectFolder = path.join(characterManagerFolder, cleanProjectName);
        const projectOriginalsFolder = path.join(projectFolder, 'originals');
        const projectThumbnailsFolder = path.join(projectFolder, 'avatars');
        const projectFolderCoversFolder = path.join(projectFolder, 'folder-covers');
        const projectFile = path.join(projectFolder, 'project.json');
        
        // Ensure project folders exist
        await fs.ensureDir(projectFolder);
        await fs.ensureDir(projectOriginalsFolder);
        await fs.ensureDir(projectThumbnailsFolder);
        await fs.ensureDir(projectFolderCoversFolder);
        
        // Process characters and move temp files to project
        const processedCharacters = [];

        for (const character of characters) {
            const processedCharacter = { ...character };
            
            // Ensure avatars array exists (backwards compatibility)
            if (!processedCharacter.avatars || processedCharacter.avatars.length === 0) {
                // Old format: single avatar with tempOriginalFile/tempThumbnailFile
                if (character.tempOriginalFile && character.tempThumbnailFile) {
                    processedCharacter.avatars = [{
                        id: `avatar_0_${Date.now()}`,
                        tempOriginalFile: character.tempOriginalFile,
                        tempThumbnailFile: character.tempThumbnailFile,
                        isActive: true
                    }];
                } else {
                    processedCharacter.avatars = [];
                }
            }
            
            // Process avatars array
            const processedAvatars = [];
            const characterAvatarFolder = path.join(projectOriginalsFolder, character.id);
            const characterThumbFolder = path.join(projectThumbnailsFolder, character.id);
            
            await fs.ensureDir(characterAvatarFolder);
            await fs.ensureDir(characterThumbFolder);
            
            for (const avatar of processedCharacter.avatars) {
                const processedAvatar = { ...avatar };
                
                if (avatar.tempOriginalFile && avatar.tempThumbnailFile) {
                    // Generate unique filename for this avatar
                    const avatarOriginalFile = `${avatar.id}.png`;
                    const avatarThumbnailFile = `${avatar.id}_thumb.jpg`;
                    
                    const tempOriginalPath = path.join(tempFolder, 'originals', avatar.tempOriginalFile);
                    const tempThumbnailPath = path.join(tempFolder, 'thumbnails', avatar.tempThumbnailFile);
                    
                    const finalOriginalPath = path.join(characterAvatarFolder, avatarOriginalFile);
                    const finalThumbnailPath = path.join(characterThumbFolder, avatarThumbnailFile);
                    
                    try {
                        // Move files from temp to project folder
                        if (await fs.pathExists(tempOriginalPath)) {
                            await fs.move(tempOriginalPath, finalOriginalPath, { overwrite: true });
                        }
                        if (await fs.pathExists(tempThumbnailPath)) {
                            await fs.move(tempThumbnailPath, finalThumbnailPath, { overwrite: true });
                        }
                        
                        // Update avatar references
                        processedAvatar.originalFile = avatarOriginalFile;
                        processedAvatar.thumbnailFile = avatarThumbnailFile;
                        
                        // Remove temp references and thumbnail data
                        delete processedAvatar.tempOriginalFile;
                        delete processedAvatar.tempThumbnailFile;
                        delete processedAvatar.thumbnail;
                        
                        console.log(`🚚 Moved avatar ${avatarOriginalFile} for character ${character.id}`);
                    } catch (fileError) {
                        console.error(`❌ Failed to move avatar files for ${character.id}/${avatar.id}:`, fileError);
                        processedAvatar.originalFile = null;
                        processedAvatar.thumbnailFile = null;
                    }
                }
                
                processedAvatars.push(processedAvatar);
            }
            
            processedCharacter.avatars = processedAvatars;
            
            // Update main character references from active avatar (backwards compatibility)
            const activeAvatar = processedAvatars.find(a => a.isActive) || processedAvatars[0];
            if (activeAvatar) {
                processedCharacter.originalFile = activeAvatar.originalFile;
                processedCharacter.thumbnailFile = activeAvatar.thumbnailFile;
                processedCharacter.hasAvatar = !!(activeAvatar.originalFile);
            } else {
                processedCharacter.originalFile = null;
                processedCharacter.thumbnailFile = null;
                processedCharacter.hasAvatar = false;
            }
            
            // Clean up old temp references
            delete processedCharacter.tempOriginalFile;
            delete processedCharacter.tempThumbnailFile;
            delete processedCharacter.avatarThumbnail;
            
            processedCharacters.push(processedCharacter);
        }
        
        // Process folders and move temp cover files to project
        const processedFolders = [];
        
        for (const folder of (folders || [])) {
            const processedFolder = { ...folder };
            
            // Handle temp cover files - move to project folder
            if (folder.tempCoverFile) {
                const finalCoverFile = `${folder.id}_cover.jpg`;
                
                const tempCoverPath = path.join(tempFolder, 'folder-covers', folder.tempCoverFile);
                const finalCoverPath = path.join(projectFolderCoversFolder, finalCoverFile);
                
                try {
                    if (await fs.pathExists(tempCoverPath)) {
                        await fs.move(tempCoverPath, finalCoverPath);
                        console.log(`🚚 Moved folder cover ${finalCoverFile} to project`);
                    }
                    
                    processedFolder.coverFile = finalCoverFile;
                    delete processedFolder.tempCoverFile;
                    delete processedFolder.cover; // Remove any old base64
                    delete processedFolder.coverThumbnail; // Remove base64
                    
                } catch (fileError) {
                    console.error(`❌ Failed to move cover for folder ${folder.id}:`, fileError);
                    processedFolder.coverFile = null;
                }
            } else {
                // For existing folders without new cover upload, keep coverFile reference
                // but remove any base64 data
                delete processedFolder.cover;
                delete processedFolder.coverThumbnail;
            }
            
            processedFolders.push(processedFolder);
        }
        
        // Clean up temp folder after successful move
        try {
            if (await fs.pathExists(tempFolder)) {
                await fs.remove(tempFolder);
                console.log(`🧹 Cleaned up temp folder for ${userContext.isGuest ? 'guest' : userContext.username}`);
            }
        } catch (cleanupError) {
            console.warn('Failed to cleanup temp folder:', cleanupError);
        }
        
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
            characters: processedCharacters,
            characterCount: processedCharacters.length,
            folders: processedFolders,
            viewState: viewState || {},
            version: '2.0',
            metadata: metadata || existingData.metadata || {}
        };
        
        await fs.writeJson(projectFile, projectData, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved character manager project "${cleanProjectName}" for ${userDisplay} (${processedCharacters.length} characters)`);
        
        res.json({ 
            success: true, 
            message: `Project "${cleanProjectName}" saved successfully`,
            projectName: cleanProjectName,
            characterCount: processedCharacters.length
        });
        
    } catch (error) {
        console.error('Error saving character manager project:', error);
        res.status(500).json({ error: 'Failed to save character manager project' });
    }
});

// New route: Clean up temp folder (call when user cancels or closes)
router.post('/character-manager/cleanup-temp', async (req, res) => {
    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const tempFolder = getUserTempFolder(userContext);
        
        if (await fs.pathExists(tempFolder)) {
            await fs.remove(tempFolder);
            console.log(`🧹 Cleaned up temp folder for ${userContext.isGuest ? 'guest' : userContext.username}`);
        }
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error cleaning up temp folder:', error);
        res.status(500).json({ error: 'Failed to cleanup temp folder' });
    }
});

// Load character manager project
// Load character manager project
router.post('/character-manager/load-project', async (req, res) => {
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

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        
        // Try new structure first (project folder with project.json)
        let projectFile = path.join(characterManagerFolder, projectName, 'project.json');
        let isNewStructure = true;
        
        if (!await fs.pathExists(projectFile)) {
            // Fall back to old structure (single JSON file)
            projectFile = path.join(characterManagerFolder, `${projectName}.json`);
            isNewStructure = false;
            
            if (!await fs.pathExists(projectFile)) {
                return res.status(404).json({ error: 'Project not found' });
            }
        }
        
        const projectData = await fs.readJson(projectFile);
        
        // Load thumbnails for display (new file-based system)
        if (isNewStructure && projectData.characters) {
            const thumbnailsFolder = path.join(characterManagerFolder, projectName, 'avatars');
            const originalsFolder = path.join(characterManagerFolder, projectName, 'originals');
            
            for (const character of projectData.characters) {
                // Initialize avatars array if not present (backwards compatibility)
                if (!character.avatars || character.avatars.length === 0) {
                    // Old format: single avatar with thumbnailFile at root level
                    if (character.thumbnailFile && character.originalFile) {
                        // Check if old file structure exists and migrate to new structure
                        const oldThumbPath = path.join(thumbnailsFolder, character.thumbnailFile);
                        const oldOriginalPath = path.join(originalsFolder, character.originalFile);
                        
                        const newCharacterThumbFolder = path.join(thumbnailsFolder, character.id);
                        const newCharacterOriginalFolder = path.join(originalsFolder, character.id);
                        
                        const avatarId = `avatar_0_${Date.now()}`;
                        const newOriginalFile = `${avatarId}.png`;
                        const newThumbnailFile = `${avatarId}_thumb.jpg`;
                        
                        try {
                            // Migrate files if they exist in old location
                            if (await fs.pathExists(oldOriginalPath)) {
                                await fs.ensureDir(newCharacterOriginalFolder);
                                const newOriginalPath = path.join(newCharacterOriginalFolder, newOriginalFile);
                                await fs.copy(oldOriginalPath, newOriginalPath);
                                console.log(`📦 Migrated avatar original: ${character.originalFile} → ${character.id}/${newOriginalFile}`);
                            }
                            
                            if (await fs.pathExists(oldThumbPath)) {
                                await fs.ensureDir(newCharacterThumbFolder);
                                const newThumbPath = path.join(newCharacterThumbFolder, newThumbnailFile);
                                await fs.copy(oldThumbPath, newThumbPath);
                                console.log(`📦 Migrated avatar thumbnail: ${character.thumbnailFile} → ${character.id}/${newThumbnailFile}`);
                            }
                            
                            character.avatars = [{
                                id: avatarId,
                                originalFile: newOriginalFile,
                                thumbnailFile: newThumbnailFile,
                                thumbnail: null,
                                isActive: true
                            }];
                            
                            // Mark project as needing save to update references
                            character._needsMigration = true;
                        } catch (migrateError) {
                            console.error(`Failed to migrate avatar for ${character.id}:`, migrateError);
                            character.avatars = [];
                        }
                    } else {
                        character.avatars = [];
                    }
                }
                
                // Load thumbnails for each avatar
                if (character.avatars && character.avatars.length > 0) {
                    const characterThumbFolder = path.join(thumbnailsFolder, character.id);
                    
                    for (const avatar of character.avatars) {
                        if (avatar.thumbnailFile) {
                            const thumbnailPath = path.join(characterThumbFolder, avatar.thumbnailFile);
                            try {
                                if (await fs.pathExists(thumbnailPath)) {
                                    const thumbData = await fs.readFile(thumbnailPath);
                                    avatar.thumbnail = `data:image/jpeg;base64,${thumbData.toString('base64')}`;
                                } else {
                                    console.warn(`Avatar thumbnail not found: ${avatar.thumbnailFile}`);
                                    avatar.thumbnail = null;
                                }
                            } catch (thumbError) {
                                console.error(`Error loading avatar thumbnail ${avatar.thumbnailFile}:`, thumbError);
                                avatar.thumbnail = null;
                            }
                        }
                    }
                    
                    // Set main character thumbnail from active avatar (for grid display)
                    const activeAvatar = character.avatars.find(a => a.isActive) || character.avatars[0];
                    character.avatarThumbnail = activeAvatar ? activeAvatar.thumbnail : null;
                } else {
                    character.avatarThumbnail = null;
                }
                
                // Don't load original files for display - only when needed for export
                character.avatar = null;
            }
        }
        
        // Load folder covers
        if (isNewStructure && projectData.folders) {
            const folderCoversFolder = path.join(characterManagerFolder, projectName, 'folder-covers');
            
            for (const folder of projectData.folders) {
                if (folder.coverFile) {
                    const coverPath = path.join(folderCoversFolder, folder.coverFile);
                    try {
                        if (await fs.pathExists(coverPath)) {
                            const coverData = await fs.readFile(coverPath);
                            folder.coverThumbnail = `data:image/jpeg;base64,${coverData.toString('base64')}`;
                        } else {
                            console.warn(`Folder cover file not found: ${folder.coverFile}`);
                            folder.coverThumbnail = null;
                        }
                    } catch (coverError) {
                        console.error(`Error loading folder cover ${folder.coverFile}:`, coverError);
                        folder.coverThumbnail = null;
                    }
                }
                
                // Ensure old base64 data is removed
                delete folder.cover;
            }
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📖 Loaded character manager project "${projectName}" for ${userDisplay} (${projectData.characters?.length || 0} characters)`);
        
        res.json({
            success: true,
            projectName: projectData.name,
            characters: projectData.characters || [],
            folders: projectData.folders || [],
            viewState: projectData.viewState || {},
            metadata: {
                created: projectData.created,
                updated: projectData.updated,
                characterCount: projectData.characterCount,
                version: projectData.version
            }
        });
        
    } catch (error) {
        console.error('Error loading character manager project:', error);
        res.status(500).json({ error: 'Failed to load character manager project' });
    }
});

// Delete character manager project
router.post('/character-manager/delete-project', async (req, res) => {
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

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        
        // Try new structure first (project folder with project.json)
        const projectFolder = path.join(characterManagerFolder, projectName);
        const newProjectFile = path.join(projectFolder, 'project.json');
        
        // Try old structure (single JSON file)
        const oldProjectFile = path.join(characterManagerFolder, `${projectName}.json`);
        
        let deleted = false;
        
        if (await fs.pathExists(newProjectFile)) {
            // New structure: remove entire project folder (includes avatars)
            await fs.remove(projectFolder);
            deleted = true;
            console.log(`🗑️ Deleted project folder: ${projectFolder}`);
        } else if (await fs.pathExists(oldProjectFile)) {
            // Old structure: remove single JSON file
            await fs.remove(oldProjectFile);
            deleted = true;
            console.log(`🗑️ Deleted project file: ${oldProjectFile}`);
        }
        
        if (!deleted) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🗑️ Deleted character manager project "${projectName}" for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: `Project "${projectName}" deleted successfully`
        });
        
    } catch (error) {
        console.error('Error deleting character manager project:', error);
        res.status(500).json({ error: 'Failed to delete character manager project' });
    }
});

// Import character cards from PNG/JSON files
router.post('/character-manager/import-characters', async (req, res) => {
    try {
        const { userContext, characterData } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!characterData || !Array.isArray(characterData)) {
            return res.status(400).json({ error: 'Character data array is required' });
        }

        const extractedCharacters = [];
        
        // Process each character file
        for (const character of characterData) {
            const { filename, content } = character;
            
            try {
                const parsed = JSON.parse(content);
                
                // Process character data (handle both v2 and v3 formats)
                const processedCharacter = {
                    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    _sourceFile: filename,
                    _importTimestamp: Date.now(),
                    cardName: '', // User can set this later
                    
                    // Extract character data based on format
                    name: parsed.data?.name || parsed.name || 'Untitled Character',
                    description: parsed.data?.description || parsed.description || '',
                    personality: parsed.data?.personality || parsed.personality || '',
                    scenario: parsed.data?.scenario || parsed.scenario || '',
                    first_mes: parsed.data?.first_mes || parsed.first_mes || '',
                    mes_example: parsed.data?.mes_example || parsed.mes_example || '',
                    creator_notes: parsed.data?.creator_notes || parsed.creatorcomment || '',
                    system_prompt: parsed.data?.system_prompt || '',
                    post_history_instructions: parsed.data?.post_history_instructions || '',
                    tags: parsed.data?.tags || parsed.tags || [],
                    alternate_greetings: parsed.data?.alternate_greetings || parsed.alternate_greetings || [],
                    
                    // Character book (check both V3 and V2 locations)
                    character_book: parsed.data?.character_book || parsed.character_book || null,
                    
                    // Depth prompt info (check multiple locations)
                    depth_prompt: parsed.data?.extensions?.depth_prompt || 
                                parsed.extensions?.depth_prompt || 
                                parsed.depth_prompt || 
                                null,
                    
                    // File references instead of data
                    originalFile: null,
                    thumbnailFile: null,
                    hasAvatar: !!(parsed._fileData && parsed._fileType === 'png'),
                    
                    // Folder assignment (default to none)
                    folderId: null
                };

                // Handle file processing if it's a PNG
                if (parsed._fileData && parsed._fileType === 'png') {
                    // These will be processed during save
                    processedCharacter._fileData = parsed._fileData;
                    processedCharacter._fileType = parsed._fileType;
                }

                // Calculate total tokens for this character
                const tokenFields = [
                    processedCharacter.description,
                    processedCharacter.personality, 
                    processedCharacter.scenario,
                    processedCharacter.first_mes,
                    processedCharacter.mes_example,
                    processedCharacter.depth_prompt?.prompt || '',
                    processedCharacter.post_history_instructions
                ];

                let totalTokens = 0;
                tokenFields.forEach(field => {
                    if (field && typeof field === 'string') {
                        totalTokens += Math.ceil(field.length / 4); // Approximate token calculation
                    }
                });

                processedCharacter.totalTokens = totalTokens;

                // Set default depth prompt if none exists
                if (!processedCharacter.depth_prompt) {
                    processedCharacter.depth_prompt = {
                        prompt: processedCharacter.creator_notes || '',
                        depth: 4,
                        role: 'system'
                    };
                }
                
                extractedCharacters.push(processedCharacter);
                
            } catch (parseError) {
                console.error(`Error parsing ${filename}:`, parseError);
                // Continue processing other files
            }
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📥 Import complete for ${userDisplay}: ${extractedCharacters.length} total characters from ${characterData.length} files`);
        
        res.json({
            success: true,
            characters: extractedCharacters,
            totalCharacters: extractedCharacters.length,
            filesProcessed: characterData.length
        });
        
    } catch (error) {
        console.error('Error importing characters:', error);
        res.status(500).json({ error: 'Failed to import character data' });
    }
});

// Export character as PNG or JSON
router.post('/character-manager/export-character', async (req, res) => {
    try {
        const { userContext, character, format, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!character || !format) {
            return res.status(400).json({ error: 'Character data and format are required' });
        }

        // Create SillyTavern-compatible character data structure
        const exportData = {
            name: character.name,
            description: character.description,
            personality: character.personality,
            scenario: character.scenario,
            first_mes: character.first_mes,
            mes_example: character.mes_example,
            creatorcomment: character.creator_notes,
            avatar: 'none',
            talkativeness: '0.5',
            fav: false,
            tags: character.tags || [],
            spec: 'chara_card_v2',
            spec_version: '2.0',
            data: {
                name: character.name,
                first_mes: character.first_mes,
                scenario: character.scenario,
                description: character.description,
                personality: character.personality,
                mes_example: character.mes_example,
                creator_notes: character.creator_notes,
                system_prompt: character.system_prompt || '',
                post_history_instructions: character.post_history_instructions || '',
                alternate_greetings: character.alternate_greetings || [],
                character_book: character.character_book || null,
                tags: character.tags || [],
                creator: 'Character Manager',
                character_version: '',
                extensions: {
                    depth_prompt: character.depth_prompt && character.depth_prompt.prompt ? {
                        prompt: character.depth_prompt.prompt,
                        depth: character.depth_prompt.depth || 4
                    } : {
                        prompt: '',
                        depth: 4
                    }
                }
            }
        };

        const timestamp = new Date().toISOString().split('T')[0];
        const cleanName = (character.name || 'character').replace(/[^a-zA-Z0-9-_]/g, '_');
        
        if (format === 'json') {
            const formattedJson = JSON.stringify(exportData, null, 4);
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${cleanName}_${timestamp}.json"`);
            res.send(formattedJson);
        } else if (format === 'png' && projectName) {
            // Find active avatar or use first avatar
            let activeAvatar = null;
            if (character.avatars && character.avatars.length > 0) {
                activeAvatar = character.avatars.find(a => a.isActive) || character.avatars[0];
            }
            
            if (!activeAvatar || !activeAvatar.originalFile) {
                return res.status(400).json({ error: 'Character has no avatar for PNG export' });
            }
            
            // Load active avatar's original PNG
            const characterManagerFolder = getUserCharacterManagerFolder(userContext);
            const originalsFolder = path.join(characterManagerFolder, projectName, 'originals', character.id);
            const originalPath = path.join(originalsFolder, activeAvatar.originalFile);
            
            if (await fs.pathExists(originalPath)) {
                // Read original PNG
                const originalPng = await fs.readFile(originalPath);
                
                // Update PNG metadata with new character data
                const updatedPng = await updatePngMetadata(originalPng, exportData);
                
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Disposition', `attachment; filename="${cleanName}_${timestamp}.png"`);
                res.send(updatedPng);
            } else {
                return res.status(404).json({ error: 'Active avatar PNG file not found' });
                }
            } else if (format === 'txt') {
                // Generate plain text export
                let txtContent = '';
                
                txtContent += `CHARACTER: ${character.name}\n`;
                txtContent += `${'='.repeat(50)}\n\n`;
                
                if (character.cardName) {
                    txtContent += `Display Name: ${character.cardName}\n\n`;
                }
                
                if (character.description) {
                    txtContent += `DESCRIPTION:\n${character.description}\n\n`;
                }
                
                if (character.personality) {
                    txtContent += `PERSONALITY:\n${character.personality}\n\n`;
                }
                
                if (character.scenario) {
                    txtContent += `SCENARIO:\n${character.scenario}\n\n`;
                }
                
                if (character.first_mes) {
                    txtContent += `FIRST MESSAGE:\n${character.first_mes}\n\n`;
                }
                
                if (character.alternate_greetings && character.alternate_greetings.length > 0) {
                    txtContent += `ALTERNATE GREETINGS:\n`;
                    character.alternate_greetings.forEach((greeting, i) => {
                        txtContent += `\n[${i + 1}]\n${greeting}\n`;
                    });
                    txtContent += `\n`;
                }
                
                if (character.mes_example) {
                    txtContent += `EXAMPLE MESSAGES:\n${character.mes_example}\n\n`;
                }
                
                if (character.depth_prompt && character.depth_prompt.prompt) {
                    txtContent += `CHARACTER NOTE:\n${character.depth_prompt.prompt}\n`;
                    txtContent += `Depth: ${character.depth_prompt.depth || 4}\n\n`;
                }
                
                if (character.post_history_instructions) {
                    txtContent += `POST-HISTORY INSTRUCTIONS:\n${character.post_history_instructions}\n\n`;
                }
                
                if (character.creator_notes) {
                    txtContent += `CREATOR NOTES:\n${character.creator_notes}\n\n`;
                }
                
                if (character.tags && character.tags.length > 0) {
                    txtContent += `TAGS: ${character.tags.join(', ')}\n\n`;
                }
                
                if (character.character_book && character.character_book.entries && character.character_book.entries.length > 0) {
                    txtContent += `CHARACTER BOOK ENTRIES:\n`;
                    txtContent += `${'-'.repeat(50)}\n`;
                    character.character_book.entries.forEach((entry, i) => {
                        txtContent += `\n[Entry ${i + 1}]\n`;
                        if (entry.keys && entry.keys.length > 0) {
                            txtContent += `Keys: ${entry.keys.join(', ')}\n`;
                        }
                        if (entry.content) {
                            txtContent += `Content: ${entry.content}\n`;
                        }
                    });
                    txtContent += `\n`;
                }
                
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', `attachment; filename="${cleanName}_${timestamp}.txt"`);
                res.send(txtContent);
            } else {
                res.status(400).json({ error: 'Invalid export format' });
            }
        
        console.log(`📤 Exported character "${character.name}" as ${format.toUpperCase()} for ${userContext.isGuest ? 'guest' : userContext.username}`);
        
    } catch (error) {
        console.error('Error exporting character:', error);
        res.status(500).json({ error: 'Failed to export character' });
    }
});

// Get character count for user (for display purposes)
router.post('/character-manager/get-character-count', async (req, res) => {
    if (!IS_LOCAL) {
        return res.json({ characterCount: 0 });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        let totalCount = 0;
        
        if (await fs.pathExists(characterManagerFolder)) {
            const files = await fs.readdir(characterManagerFolder);
            const projectFiles = files.filter(file => file.endsWith('.json') && file !== 'folders.json');
            
            for (const file of projectFiles) {
                try {
                    const projectData = await fs.readJson(path.join(characterManagerFolder, file));
                    totalCount += (projectData.characters || []).length;
                } catch (e) {
                    // Skip corrupted files
                }
            }
        }
        
        res.json({ characterCount: totalCount });
        
    } catch (error) {
        console.error('Error getting character count:', error);
        res.json({ characterCount: 0 });
    }
});

// Rename character manager project
router.post('/character-manager/rename-project', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, oldName, newName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!oldName || !newName) {
            return res.status(400).json({ error: 'Both old and new project names are required' });
        }

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        const cleanOldName = oldName.trim().replace(/[^a-zA-Z0-9-_\s]/g, '');
        const cleanNewName = newName.trim().replace(/[^a-zA-Z0-9-_\s]/g, '');
        
        const oldProjectFolder = path.join(characterManagerFolder, cleanOldName);
        const newProjectFolder = path.join(characterManagerFolder, cleanNewName);
        const oldProjectFile = path.join(oldProjectFolder, 'project.json');
        const newProjectFile = path.join(newProjectFolder, 'project.json');
        
        // Check if old project exists (try both structures)
        let oldStructureFile = path.join(characterManagerFolder, `${cleanOldName}.json`);
        let useNewStructure = await fs.pathExists(oldProjectFile);
        let useOldStructure = await fs.pathExists(oldStructureFile);
        
        if (!useNewStructure && !useOldStructure) {
            return res.status(404).json({ error: 'Original project not found' });
        }
        
        // Check if new name already exists
        const newStructureExists = await fs.pathExists(newProjectFile);
        const newOldStructureFile = path.join(characterManagerFolder, `${cleanNewName}.json`);
        const newOldStructureExists = await fs.pathExists(newOldStructureFile);
        
        if (newStructureExists || newOldStructureExists) {
            return res.status(400).json({ error: 'A project with the new name already exists' });
        }
        
        if (useNewStructure) {
            // New structure: rename the entire folder
            await fs.move(oldProjectFolder, newProjectFolder);
            
            // Update the project.json file with new name
            const projectData = await fs.readJson(newProjectFile);
            projectData.name = cleanNewName;
            projectData.updated = Date.now();
            await fs.writeJson(newProjectFile, projectData, { spaces: 2 });
            
        } else {
            // Old structure: rename the single file and update content
            const projectData = await fs.readJson(oldStructureFile);
            projectData.name = cleanNewName;
            projectData.updated = Date.now();
            
            // Write to new location and remove old
            const newOldStructureFile = path.join(characterManagerFolder, `${cleanNewName}.json`);
            await fs.writeJson(newOldStructureFile, projectData, { spaces: 2 });
            await fs.remove(oldStructureFile);
        }
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🔄 Renamed character manager project "${cleanOldName}" to "${cleanNewName}" for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: `Project renamed from "${cleanOldName}" to "${cleanNewName}"`,
            newProjectName: cleanNewName
        });
        
    } catch (error) {
        console.error('Error renaming character manager project:', error);
        res.status(500).json({ error: 'Failed to rename character manager project' });
    }
});

// Load Character Manager settings
router.post('/character-manager/load-settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Settings not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'character-manager');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        let settings = {};
        if (await fs.pathExists(settingsFile)) {
            settings = await fs.readJson(settingsFile);
        }
        
        res.json(settings);
        
    } catch (error) {
        console.error('Error loading character manager settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});

// Save Character Manager settings
router.post('/character-manager/save-settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Settings not available in hosted environment' });
    }

    try {
        const { userContext, settings } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'character-manager');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        await fs.ensureDir(settingsFolder);
        await fs.writeJson(settingsFile, settings, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved character manager settings for ${userDisplay}`);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error saving character manager settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// Update original PNG file with new character data
router.post('/character-manager/update-original-png', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File system access not available in hosted environment' });
    }

    try {
        const { userContext, projectName, characterId, originalFile, characterData } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);

        // Find the active avatar to update
        const projectFile = path.join(characterManagerFolder, projectName, 'project.json');
        if (!await fs.pathExists(projectFile)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projectData = await fs.readJson(projectFile);
        const character = projectData.characters.find(c => c.id === characterId);

        if (!character || !character.avatars || character.avatars.length === 0) {
            return res.status(404).json({ error: 'Character or avatars not found' });
        }

        const activeAvatar = character.avatars.find(a => a.isActive) || character.avatars[0];
        if (!activeAvatar || !activeAvatar.originalFile) {
            return res.status(404).json({ error: 'Active avatar not found' });
        }

        const originalsFolder = path.join(characterManagerFolder, projectName, 'originals', characterId);
        const originalPath = path.join(originalsFolder, activeAvatar.originalFile);
        
        if (await fs.pathExists(originalPath)) {
            // Read original PNG and update metadata
            const originalPng = await fs.readFile(originalPath);
            const updatedPng = await updatePngMetadata(originalPng, characterData);
            
            // Write back to original location
            await fs.writeFile(originalPath, updatedPng);
            
            console.log(`🔄 Updated original PNG metadata for character ${characterId}`);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Original PNG file not found' });
        }
        
    } catch (error) {
        console.error('Error updating original PNG:', error);
        res.status(500).json({ error: 'Failed to update original PNG file' });
    }
});

// Get SillyTavern user profiles
router.post('/character-manager/get-st-profiles', async (req, res) => {
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
        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'character-manager');
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
                // Check if it has a characters folder
                const charactersPath = path.join(stDataPath, entry.name, 'characters');
                if (await fs.pathExists(charactersPath)) {
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

// Send character to SillyTavern profile
router.post('/character-manager/send-to-st', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'SillyTavern integration not available in hosted environment' });
    }

    try {
        const { userContext, character, profile, projectName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!character || !profile) {
            return res.status(400).json({ error: 'Character and profile are required' });
        }

        // Load user's settings to get ST path
        const settingsFolder = path.join(getUserSettingsFolder(userContext), 'character-manager');
        const settingsFile = path.join(settingsFolder, 'settings.json');
        
        if (!await fs.pathExists(settingsFile)) {
            return res.status(400).json({ error: 'SillyTavern path not configured' });
        }

        const settings = await fs.readJson(settingsFile);
        if (!settings.sillyTavernPath) {
            return res.status(400).json({ error: 'SillyTavern path not configured' });
        }

        // Validate target path
        const profileCharactersPath = path.join(settings.sillyTavernPath, 'data', profile, 'characters');
        if (!await fs.pathExists(profileCharactersPath)) {
            return res.status(400).json({ error: `Profile "${profile}" characters folder not found` });
        }

        // Create SillyTavern-compatible character data
        const exportData = {
            name: character.name,
            description: character.description,
            personality: character.personality,
            scenario: character.scenario,
            first_mes: character.first_mes,
            mes_example: character.mes_example,
            creatorcomment: character.creator_notes,
            avatar: 'none',
            talkativeness: '0.5',
            fav: false,
            tags: character.tags || [],
            spec: 'chara_card_v2',
            spec_version: '2.0',
            data: {
                name: character.name,
                first_mes: character.first_mes,
                scenario: character.scenario,
                description: character.description,
                personality: character.personality,
                mes_example: character.mes_example,
                creator_notes: character.creator_notes,
                system_prompt: character.system_prompt || '',
                post_history_instructions: character.post_history_instructions || '',
                alternate_greetings: character.alternate_greetings || [],
                character_book: character.character_book || null,
                tags: character.tags || [],
                creator: 'Character Manager',
                character_version: '',
                extensions: {
                    depth_prompt: character.depth_prompt && character.depth_prompt.prompt ? {
                        prompt: character.depth_prompt.prompt,
                        depth: character.depth_prompt.depth || 4
                    } : {
                        prompt: '',
                        depth: 4
                    }
                }
            }
        };

        // Generate clean filename
        const cleanName = (character.name || 'character').replace(/[^a-zA-Z0-9-_\s]/g, '_');
        const outputFilename = `${cleanName}.png`;
        const outputPath = path.join(profileCharactersPath, outputFilename);

        // Get active avatar PNG to use as base
        let activeAvatar = null;
        if (character.avatars && character.avatars.length > 0) {
            activeAvatar = character.avatars.find(a => a.isActive) || character.avatars[0];
        }

        if (!activeAvatar || !activeAvatar.originalFile || !projectName) {
            return res.status(400).json({ error: 'Character must have an active avatar for ST export' });
        }

        const characterManagerFolder = getUserCharacterManagerFolder(userContext);
        const originalsFolder = path.join(characterManagerFolder, projectName, 'originals', character.id);
        const originalPath = path.join(originalsFolder, activeAvatar.originalFile);

        if (await fs.pathExists(originalPath)) {
            // Read original PNG and update metadata
            const originalPng = await fs.readFile(originalPath);
            const updatedPng = await updatePngMetadata(originalPng, exportData);
            
            // Write to SillyTavern
            await fs.writeFile(outputPath, updatedPng);
        } else {
            return res.status(404).json({ error: 'Active avatar PNG file not found' });
        }

        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🚀 Sent character "${character.name}" to ST profile "${profile}" for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: `Character sent to SillyTavern profile "${profile}"`,
            filename: outputFilename,
            profile: profile
        });
        
    } catch (error) {
        console.error('Error sending character to ST:', error);
        res.status(500).json({ error: 'Failed to send character to SillyTavern' });
    }
});

async function generateThumbnailFromBuffer(pngBuffer, outputPath, maxWidth = 160, maxHeight = 200, quality = 80) {
    // This would need a proper image library like Sharp for Node.js
    // For now, we'll use a basic approach
    const sharp = require('sharp'); // You'll need to install: npm install sharp
    
    await sharp(pngBuffer)
        .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality })
        .toFile(outputPath);
}

// Helper function to update PNG metadata
async function updatePngMetadata(pngBuffer, characterData) {
    const extract = require('png-chunks-extract');
    const encode = require('png-chunks-encode');
    const text = require('png-chunk-text');
    
    try {
        // Extract existing chunks from PNG
        const chunks = extract(pngBuffer);
        
        // Remove ALL text chunks (tEXt, iTXt, zTXt) to clean slate
        const filteredChunks = chunks.filter(chunk => {
            return chunk.name !== 'tEXt' && chunk.name !== 'iTXt' && chunk.name !== 'zTXt';
        });
        
        // Create new character data chunk
        const characterJson = JSON.stringify(characterData);
        const base64Data = Buffer.from(characterJson, 'utf8').toString('base64');
        
        // Create tEXt chunk with 'chara' keyword and base64 data
        const textChunk = text.encode('chara', base64Data);
        
        // Insert the new chunk before the IEND chunk
        const iendIndex = filteredChunks.findIndex(chunk => chunk.name === 'IEND');
        if (iendIndex !== -1) {
            filteredChunks.splice(iendIndex, 0, textChunk);
        } else {
            filteredChunks.push(textChunk);
        }
        
        // Re-encode the PNG with updated metadata
        return Buffer.from(encode(filteredChunks));
        
    } catch (error) {
        console.error('Error updating PNG metadata:', error);
        // Fallback: return original PNG if metadata update fails
        return pngBuffer;
    }
}

// Add this NEW function
async function cleanPngMetadata(pngBuffer) {
    const extract = require('png-chunks-extract');
    const encode = require('png-chunks-encode');
    
    try {
        // Extract chunks
        const chunks = extract(pngBuffer);
        
        // Keep ONLY essential chunks (IHDR, IDAT, PLTE, IEND)
        // Remove ALL text chunks (tEXt, iTXt, zTXt) and other metadata
        const cleanChunks = chunks.filter(chunk => {
            const essentialChunks = ['IHDR', 'IDAT', 'PLTE', 'IEND', 'tRNS', 'gAMA', 'cHRM'];
            return essentialChunks.includes(chunk.name);
        });
        
        // Re-encode to clean PNG
        return Buffer.from(encode(cleanChunks));
        
    } catch (error) {
        console.error('Error cleaning PNG metadata:', error);
        return pngBuffer; // Fallback to original
    }
}

module.exports = router;