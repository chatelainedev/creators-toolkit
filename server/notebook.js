const express = require('express');
const fs = require('fs-extra');
const path = require('path');

// Import everything from core.js
const {
    // Constants
    IS_LOCAL,
    USERS_FOLDER,
    GUEST_FOLDER,
    
    // Utilities
    validateUserContext,
    loadUserSettings,
    saveUserSettings,
    getDefaultSettings
} = require('./core');

const router = express.Router();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Get user's notebooks base folder (NEW)
function getUserNotebooksFolder(userContext) {
    const baseFolder = userContext.isGuest ? GUEST_FOLDER : path.join(USERS_FOLDER, userContext.userId);
    return path.join(baseFolder, 'notebooks');
}

// Get user's specific notebook folder (UPDATED)
function getUserNotebookFolder(userContext, notebookId = 'default') {
    return path.join(getUserNotebooksFolder(userContext), notebookId);
}

// Get user's notes folder (UPDATED)
function getUserNotesFolder(userContext, notebookId = 'default') {
    return path.join(getUserNotebookFolder(userContext, notebookId), 'notes');
}

// Get user's snippets folder (UPDATED)
function getUserSnippetsFolder(userContext, notebookId = 'default') {
    return path.join(getUserNotebookFolder(userContext, notebookId), 'snippets');
}

// Load notebook settings
async function loadNotebookSettings(userContext, notebookId = 'default') {
    try {
        const notebookFolder = getUserNotebookFolder(userContext, notebookId);
        const settingsPath = path.join(notebookFolder, 'settings.json');
        
        if (await fs.pathExists(settingsPath)) {
            const settings = await fs.readJson(settingsPath);
            return settings;
        }
        
        // Return default settings
        return {
            collections: ['default'],
            defaultCollection: 'default',
            autoSave: true,
            autoSaveInterval: 30000,
            wordWrap: true,
            previewMode: false
        };
    } catch (error) {
        console.error('Error loading notebook settings:', error);
        return {
            collections: ['default'],
            defaultCollection: 'default',
            autoSave: true,
            autoSaveInterval: 30000,
            wordWrap: true,
            previewMode: false
        };
    }
}

// Save notebook settings
async function saveNotebookSettings(userContext, settings, notebookId = 'default') {
    try {
        const notebookFolder = getUserNotebookFolder(userContext, notebookId);
        await fs.ensureDir(notebookFolder);
        
        const settingsPath = path.join(notebookFolder, 'settings.json');
        await fs.writeJson(settingsPath, settings, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving notebook settings:', error);
        return false;
    }
}

// =============================================================================
// NOTES MANAGEMENT
// =============================================================================

// Get all notes for user
router.post('/notebook/notes', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const notesFolder = getUserNotesFolder(userContext, notebookId);
        const notes = [];

        // Check if notes folder exists
        if (!await fs.pathExists(notesFolder)) {
            return res.json({ success: true, notes: [] });
        }
        
        const files = await fs.readdir(notesFolder);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const notePath = path.join(notesFolder, file);
                    const noteData = await fs.readJson(notePath);
                    
                    // Validate note structure
                    if (noteData.id && noteData.name && noteData.hasOwnProperty('content')) {
                        notes.push(noteData);
                    }
                } catch (error) {
                    console.warn(`Failed to load note file ${file}:`, error.message);
                }
            }
        }

        // Sort by last modified (newest first)
        notes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        console.log(`📝 Loaded ${notes.length} notes for ${userContext.isGuest ? 'guest' : userContext.username}`);
        res.json({ success: true, notes });
        
    } catch (error) {
        console.error('Error loading notes:', error);
        res.status(500).json({ error: 'Failed to load notes' });
    }
});

// Get specific note
router.post('/notebook/notes/get', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, noteId, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!noteId) {
            return res.status(400).json({ error: 'Note ID is required' });
        }

        const notesFolder = getUserNotesFolder(userContext, notebookId);
        const notePath = path.join(notesFolder, `${noteId}.json`);
        
        // Security check
        if (!notePath.startsWith(USERS_FOLDER) && !notePath.startsWith(GUEST_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!await fs.pathExists(notePath)) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const noteData = await fs.readJson(notePath);
        
        console.log(`📖 Loaded note "${noteData.name}" for ${userContext.isGuest ? 'guest' : userContext.username}`);
        res.json({ success: true, note: noteData });
        
    } catch (error) {
        console.error('Error loading note:', error);
        res.status(500).json({ error: 'Failed to load note' });
    }
});

// Save note
router.post('/notebook/notes/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, noteData, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!noteData || !noteData.id || !noteData.name) {
            return res.status(400).json({ error: 'Invalid note data' });
        }

        const notesFolder = getUserNotesFolder(userContext, notebookId);
        await fs.ensureDir(notesFolder);
        
        const notePath = path.join(notesFolder, `${noteData.id}.json`);
        
        // Security check
        if (!notePath.startsWith(USERS_FOLDER) && !notePath.startsWith(GUEST_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Ensure required fields
        const noteToSave = {
            id: noteData.id,
            name: noteData.name,
            content: noteData.content || '',
            collection: noteData.collection || 'default',
            created: noteData.created || Date.now(),
            lastModified: Date.now(),
            tags: noteData.tags || [],
            wordCount: (noteData.content || '').trim().split(/\s+/).filter(word => word.length > 0).length
        };

        await fs.writeJson(notePath, noteToSave, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved note "${noteToSave.name}" for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: 'Note saved successfully',
            note: noteToSave
        });
        
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// Delete note
router.delete('/notebook/notes/:noteId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { noteId } = req.params;
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!noteId) {
            return res.status(400).json({ error: 'Note ID is required' });
        }

        const notesFolder = getUserNotesFolder(userContext, notebookId);
        const notePath = path.join(notesFolder, `${noteId}.json`);
        
        // Security check
        if (!notePath.startsWith(USERS_FOLDER) && !notePath.startsWith(GUEST_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!await fs.pathExists(notePath)) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Read note name for logging before deletion
        let noteName = noteId;
        try {
            const noteData = await fs.readJson(notePath);
            noteName = noteData.name;
        } catch (e) {
            // Don't fail deletion if we can't read the name
        }

        await fs.remove(notePath);
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🗑️ Deleted note "${noteName}" for ${userDisplay}`);
        
        res.json({ success: true, message: 'Note deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// =============================================================================
// SNIPPETS MANAGEMENT
// =============================================================================

// Get all snippets for user
router.post('/notebook/snippets', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const snippetsFolder = getUserSnippetsFolder(userContext, notebookId);
        const snippets = [];

        // Check if snippets folder exists
        if (!await fs.pathExists(snippetsFolder)) {
            return res.json({ success: true, snippets: [] });
        }
        
        const files = await fs.readdir(snippetsFolder);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const snippetPath = path.join(snippetsFolder, file);
                    const snippetData = await fs.readJson(snippetPath);
                    
                    // Validate snippet structure
                    if (snippetData.id && snippetData.title && snippetData.hasOwnProperty('content')) {
                        snippets.push(snippetData);
                    }
                } catch (error) {
                    console.warn(`Failed to load snippet file ${file}:`, error.message);
                }
            }
        }

        // Sort by creation date (newest first)
        snippets.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        console.log(`🧩 Loaded ${snippets.length} snippets for ${userContext.isGuest ? 'guest' : userContext.username}`);
        res.json({ success: true, snippets });
        
    } catch (error) {
        console.error('Error loading snippets:', error);
        res.status(500).json({ error: 'Failed to load snippets' });
    }
});

// Save snippet
router.post('/notebook/snippets/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, snippetData, chatSessionId, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!snippetData || !snippetData.id || !snippetData.title || !snippetData.content) {
            return res.status(400).json({ error: 'Invalid snippet data' });
        }

        const snippetsFolder = getUserSnippetsFolder(userContext, notebookId);
        await fs.ensureDir(snippetsFolder);
        
        const snippetPath = path.join(snippetsFolder, `${snippetData.id}.json`);
        
        // Security check
        if (!snippetPath.startsWith(USERS_FOLDER) && !snippetPath.startsWith(GUEST_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Ensure required fields
        const snippetToSave = {
            id: snippetData.id,
            title: snippetData.title,
            content: snippetData.content,
            tags: snippetData.tags || [],
            created: snippetData.created || Date.now(),
            chatSessionId: chatSessionId || snippetData.chatSessionId || null,
            sourceType: snippetData.sourceType || 'manual' // 'manual', 'cowriter', etc.
        };

        await fs.writeJson(snippetPath, snippetToSave, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`💾 Saved snippet "${snippetToSave.title}" for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: 'Snippet saved successfully',
            snippet: snippetToSave
        });
        
    } catch (error) {
        console.error('Error saving snippet:', error);
        res.status(500).json({ error: 'Failed to save snippet' });
    }
});

// Delete snippet
router.delete('/notebook/snippets/:snippetId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { snippetId } = req.params;
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!snippetId) {
            return res.status(400).json({ error: 'Snippet ID is required' });
        }

        const snippetsFolder = getUserSnippetsFolder(userContext, notebookId);
        const snippetPath = path.join(snippetsFolder, `${snippetId}.json`);
        
        // Security check
        if (!snippetPath.startsWith(USERS_FOLDER) && !snippetPath.startsWith(GUEST_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!await fs.pathExists(snippetPath)) {
            return res.status(404).json({ error: 'Snippet not found' });
        }

        // Read snippet title for logging before deletion
        let snippetTitle = snippetId;
        try {
            const snippetData = await fs.readJson(snippetPath);
            snippetTitle = snippetData.title;
        } catch (e) {
            // Don't fail deletion if we can't read the title
        }

        await fs.remove(snippetPath);
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`🗑️ Deleted snippet "${snippetTitle}" for ${userDisplay}`);
        
        res.json({ success: true, message: 'Snippet deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting snippet:', error);
        res.status(500).json({ error: 'Failed to delete snippet' });
    }
});

// =============================================================================
// NOTEBOOK SETTINGS
// =============================================================================

// Get notebook settings
router.post('/notebook/settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const settings = await loadNotebookSettings(userContext, notebookId);
        res.json({ success: true, settings });
        
    } catch (error) {
        console.error('Error loading notebook settings:', error);
        res.status(500).json({ error: 'Failed to load notebook settings' });
    }
});

// Save notebook settings
router.put('/notebook/settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, settings, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!settings) {
            return res.status(400).json({ error: 'Settings data is required' });
        }

        const saved = await saveNotebookSettings(userContext, settings, notebookId);
        
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save notebook settings' });
        }

        res.json({ success: true, message: 'Notebook settings saved' });
        
    } catch (error) {
        console.error('Error saving notebook settings:', error);
        res.status(500).json({ error: 'Failed to save notebook settings' });
    }
});

// =============================================================================
// COLLECTIONS MANAGEMENT
// =============================================================================

// Get collections
// Get collections
router.post('/notebook/collections', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const notebookFolder = getUserNotebookFolder(userContext, notebookId);
        const collectionsPath = path.join(notebookFolder, 'collections.json');
        
        let collections = [];
        
        if (await fs.pathExists(collectionsPath)) {
            try {
                const collectionsData = await fs.readJson(collectionsPath);
                collections = collectionsData.collections || [];
            } catch (error) {
                console.warn('Error reading collections file:', error);
            }
        }

        res.json({ success: true, collections });
        
    } catch (error) {
        console.error('Error loading collections:', error);
        res.status(500).json({ error: 'Failed to load collections' });
    }
});

// Create new collection
router.post('/notebook/collections/create', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, collectionName } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!collectionName || !collectionName.trim()) {
            return res.status(400).json({ error: 'Collection name is required' });
        }

        const cleanName = collectionName.trim();
        const settings = await loadNotebookSettings(userContext);
        
        if (settings.collections.includes(cleanName)) {
            return res.status(400).json({ error: 'Collection already exists' });
        }

        settings.collections.push(cleanName);
        const saved = await saveNotebookSettings(userContext, settings);
        
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save collection' });
        }

        res.json({ success: true, message: 'Collection created', collections: settings.collections });
        
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ error: 'Failed to create collection' });
    }
});

// =============================================================================
// UTILITY ENDPOINTS
// =============================================================================

// Get notebook statistics
router.post('/notebook/stats', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const notesFolder = getUserNotesFolder(userContext, notebookId);
        const snippetsFolder = getUserSnippetsFolder(userContext, notebookId);
        
        let noteCount = 0;
        let snippetCount = 0;
        let totalWords = 0;
        
        // Count notes and words
        if (await fs.pathExists(notesFolder)) {
            const noteFiles = await fs.readdir(notesFolder);
            noteCount = noteFiles.filter(f => f.endsWith('.json')).length;
            
            for (const file of noteFiles) {
                if (file.endsWith('.json')) {
                    try {
                        const noteData = await fs.readJson(path.join(notesFolder, file));
                        totalWords += noteData.wordCount || 0;
                    } catch (e) {
                        // Skip corrupted files
                    }
                }
            }
        }
        
        // Count snippets
        if (await fs.pathExists(snippetsFolder)) {
            const snippetFiles = await fs.readdir(snippetsFolder);
            snippetCount = snippetFiles.filter(f => f.endsWith('.json')).length;
        }
        
        res.json({
            success: true,
            stats: {
                noteCount,
                snippetCount,
                totalWords
            }
        });
        
    } catch (error) {
        console.error('Error loading notebook stats:', error);
        res.status(500).json({ error: 'Failed to load notebook statistics' });
    }
});

// Search across notes and snippets
router.post('/notebook/search', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, query, searchIn, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!query || !query.trim()) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchTerm = query.toLowerCase();
        const results = {
            notes: [],
            snippets: []
        };

        // Search notes
        if (!searchIn || searchIn.includes('notes')) {
            const notesFolder = getUserNotesFolder(userContext, notebookId);
            if (await fs.pathExists(notesFolder)) {
                const noteFiles = await fs.readdir(notesFolder);
                
                for (const file of noteFiles) {
                    if (file.endsWith('.json')) {
                        try {
                            const noteData = await fs.readJson(path.join(notesFolder, file));
                            
                            if (noteData.name.toLowerCase().includes(searchTerm) ||
                                noteData.content.toLowerCase().includes(searchTerm)) {
                                results.notes.push({
                                    id: noteData.id,
                                    name: noteData.name,
                                    collection: noteData.collection,
                                    lastModified: noteData.lastModified,
                                    matchType: noteData.name.toLowerCase().includes(searchTerm) ? 'title' : 'content'
                                });
                            }
                        } catch (e) {
                            // Skip corrupted files
                        }
                    }
                }
            }
        }

        // Search snippets
        if (!searchIn || searchIn.includes('snippets')) {
            const snippetsFolder = getUserSnippetsFolder(userContext, notebookId);
            if (await fs.pathExists(snippetsFolder)) {
                const snippetFiles = await fs.readdir(snippetsFolder);
                
                for (const file of snippetFiles) {
                    if (file.endsWith('.json')) {
                        try {
                            const snippetData = await fs.readJson(path.join(snippetsFolder, file));
                            
                            if (snippetData.title.toLowerCase().includes(searchTerm) ||
                                snippetData.content.toLowerCase().includes(searchTerm) ||
                                snippetData.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
                                results.snippets.push({
                                    id: snippetData.id,
                                    title: snippetData.title,
                                    tags: snippetData.tags,
                                    created: snippetData.created,
                                    matchType: snippetData.title.toLowerCase().includes(searchTerm) ? 'title' : 
                                             snippetData.content.toLowerCase().includes(searchTerm) ? 'content' : 'tags'
                                });
                            }
                        } catch (e) {
                            // Skip corrupted files
                        }
                    }
                }
            }
        }

        console.log(`🔍 Search for "${query}" returned ${results.notes.length} notes, ${results.snippets.length} snippets`);
        res.json({ success: true, results });
        
    } catch (error) {
        console.error('Error searching notebook:', error);
        res.status(500).json({ error: 'Failed to search notebook' });
    }
});

// Save entire collections structure
router.post('/notebook/collections/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Notebook not available in hosted environment' });
    }

    try {
        const { userContext, collections, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!collections || !Array.isArray(collections)) {
            return res.status(400).json({ error: 'Collections data is required' });
        }

        const notebookFolder = getUserNotebookFolder(userContext, notebookId);
        await fs.ensureDir(notebookFolder);
        
        const collectionsPath = path.join(notebookFolder, 'collections.json');
        
        // Security check
        if (!collectionsPath.startsWith(USERS_FOLDER) && !collectionsPath.startsWith(GUEST_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Save collections structure
        const collectionsData = {
            collections: collections,
            lastModified: Date.now()
        };

        await fs.writeJson(collectionsPath, collectionsData, { spaces: 2 });
        
        const userDisplay = userContext.isGuest ? 'guest' : userContext.username;
        console.log(`📁 Saved ${collections.length} collections for ${userDisplay}`);
        
        res.json({ 
            success: true, 
            message: 'Collections saved successfully'
        });
        
    } catch (error) {
        console.error('Error saving collections:', error);
        res.status(500).json({ error: 'Failed to save collections' });
    }
});

// =============================================================================
// EXPORT FUNCTIONALITY
// =============================================================================

// Export individual note as markdown
router.post('/notebook/notes/:noteId/export', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Export not available in hosted environment' });
    }

    try {
        const { noteId } = req.params;
        const { userContext, notebookId = 'default' } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Load the note
        const notesFolder = getUserNotesFolder(userContext, notebookId);
        const notePath = path.join(notesFolder, `${noteId}.json`);
        
        if (!await fs.pathExists(notePath)) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const noteData = await fs.readJson(notePath);
        const sanitizedName = sanitizeFilename(noteData.name);
        const filename = `${sanitizedName}.md`;
        
        // Convert to markdown with minimal frontmatter
        const markdown = `---
title: "${noteData.name}"
created: ${new Date(noteData.created).toISOString().split('T')[0]}
modified: ${new Date(noteData.lastModified).toISOString().split('T')[0]}
---

# ${noteData.name}

${noteData.content}`;

        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(markdown);
        
    } catch (error) {
        console.error('Error exporting note:', error);
        res.status(500).json({ error: 'Failed to export note' });
    }
});

// Export full notebook as ZIP
router.post('/notebook/:notebookId/export', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Export not available in hosted environment' });
    }

    try {
        const { notebookId } = req.params;
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const archiver = require('archiver');
        
        // Load notebook metadata, notes, snippets, collections
        const notebookFolder = getUserNotebookFolder(userContext, notebookId);
        const notesFolder = getUserNotesFolder(userContext, notebookId);
        const snippetsFolder = getUserSnippetsFolder(userContext, notebookId);
        const collectionsPath = path.join(notebookFolder, 'collections.json');
        
        // Get notebook name for filename
        let notebookName = notebookId;
        if (userContext.isGuest) {
            // For guests, try to get name from a notebooks list or use ID
            notebookName = 'Notebook';
        }
        
        const dateStr = new Date().toISOString().split('T')[0];
        const zipFilename = `${sanitizeFilename(notebookName)}_Export_${dateStr}.zip`;
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
        
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        
        // Load collections structure
        let collections = [];
        if (await fs.pathExists(collectionsPath)) {
            const collectionsData = await fs.readJson(collectionsPath);
            collections = collectionsData.collections || [];
        }
        
        // Load all notes and organize by collection
        const notes = [];
        if (await fs.pathExists(notesFolder)) {
            const noteFiles = await fs.readdir(notesFolder);
            for (const file of noteFiles) {
                if (file.endsWith('.json')) {
                    try {
                        const noteData = await fs.readJson(path.join(notesFolder, file));
                        notes.push(noteData);
                    } catch (e) { /* skip corrupted */ }
                }
            }
        }
        
        // Create folder structure and add notes
        await addNotesToArchive(archive, notes, collections);
        
        // Add snippets
        await addSnippetsToArchive(archive, snippetsFolder);
        
        // Add README
        const readme = createNotebookReadme(notebookName, notes.length, collections.length);
        archive.append(readme, { name: 'README.md' });
        
        await archive.finalize();
        
    } catch (error) {
        console.error('Error exporting notebook:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to export notebook' });
        }
    }
});

// Helper functions
function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-zA-Z0-9\s\-_]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}

async function addNotesToArchive(archive, notes, collections) {
    // Create a map of collection paths
    const collectionPaths = new Map();
    
    function buildCollectionPaths(collections, parentPath = '') {
        for (const collection of collections) {
            const currentPath = parentPath ? `${parentPath}/${sanitizeFilename(collection.name || 'Uncategorized')}` : sanitizeFilename(collection.name || 'Uncategorized');
            collectionPaths.set(collection.key, currentPath);
        }
    }
    
    buildCollectionPaths(collections);
    
    // Add notes to appropriate folders
    for (const note of notes) {
        const collectionKey = note.collection || '';
        const folderPath = collectionPaths.get(collectionKey) || 'Uncategorized';
        const filename = `${sanitizeFilename(note.name)}.md`;
        
        const markdown = `---
title: "${note.name}"
created: ${new Date(note.created).toISOString().split('T')[0]}
modified: ${new Date(note.lastModified).toISOString().split('T')[0]}
---

# ${note.name}

${note.content}`;
        
        archive.append(markdown, { name: `${folderPath}/${filename}` });
    }
}

async function addSnippetsToArchive(archive, snippetsFolder) {
    if (!await fs.pathExists(snippetsFolder)) return;
    
    const snippetFiles = await fs.readdir(snippetsFolder);
    const snippetsByTag = new Map();
    
    // Group snippets by tags
    for (const file of snippetFiles) {
        if (file.endsWith('.json')) {
            try {
                const snippetData = await fs.readJson(path.join(snippetsFolder, file));
                const tags = snippetData.tags || ['untagged'];
                
                for (const tag of tags) {
                    if (!snippetsByTag.has(tag)) {
                        snippetsByTag.set(tag, []);
                    }
                    snippetsByTag.get(tag).push(snippetData);
                }
            } catch (e) { /* skip corrupted */ }
        }
    }
    
    // Create one markdown file per tag
    for (const [tag, tagSnippets] of snippetsByTag) {
        const sanitizedTag = sanitizeFilename(tag);
        const filename = `${sanitizedTag}-snippets.md`;
        
        let markdown = `# ${tag} Snippets\n\n`;
        
        for (const snippet of tagSnippets) {
            markdown += `## ${snippet.title}\n\n${snippet.content}\n\n---\n\n`;
        }
        
        archive.append(markdown, { name: `Snippets/${filename}` });
    }
}

function createNotebookReadme(notebookName, noteCount, collectionCount) {
    const date = new Date().toISOString().split('T')[0];
    return `# ${notebookName} Export

Exported on: ${date}

## Contents
- **Notes**: ${noteCount}
- **Collections**: ${collectionCount}
- **Snippets**: Organized by tags in the Snippets folder

## Structure
Notes are organized by their collections in folders. Snippets are grouped by tags in the Snippets folder.

This export is compatible with Obsidian, Logseq, and other markdown-based note-taking applications.
`;
}

module.exports = router;