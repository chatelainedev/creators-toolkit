const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

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

const COWRITER_FOLDER = 'cowriter';

// Get user's CoWriter folder structure
function getUserCoWriterFolder(userContext, subfolder = '') {
    const baseFolder = userContext.isGuest 
        ? path.join(GUEST_FOLDER, COWRITER_FOLDER)
        : path.join(USERS_FOLDER, userContext.userId, COWRITER_FOLDER);
    
    return subfolder ? path.join(baseFolder, subfolder) : baseFolder;
}

// Load prompts configuration
async function loadPrompts() {
    try {
        const promptsPath = path.join(__dirname, '..', 'main', 'cowriter', 'prompts.json');
        if (await fs.pathExists(promptsPath)) {
            return await fs.readJson(promptsPath);
        }
        return getDefaultPrompts();
    } catch (error) {
        console.error('Error loading prompts:', error);
        return getDefaultPrompts();
    }
}

// Default prompts configuration
function getDefaultPrompts() {
    return {
        mainPrompt: "You are an experienced creative writing collaborator and brainstorming partner. Your role is to help writers develop their stories, characters, worlds, and creative ideas through thoughtful questions, suggestions, and creative exploration. You are not a personal assistant - you are a creative equal, a co-writer who brings your own insights and ideas to the collaborative process.",
        
        tones: {
            collaborative: "Engage as an equal creative partner. Ask thoughtful questions, offer suggestions, and build on ideas together. Be encouraging but also challenge concepts constructively when appropriate.",
            creative: "Be highly imaginative and full of creative energy. Offer wild ideas, unexpected connections, and push creative boundaries. Don't be afraid to suggest unconventional approaches.",
            analytical: "Focus on structure, consistency, and logical development. Help analyze plot holes, character motivations, and world-building consistency. Offer systematic approaches to creative problems.",
            casual: "Be friendly, relaxed, and conversational. Approach creative problems with enthusiasm but keep things light and fun. Use casual language and be supportive."
        },
        
        styles: {
            modern: "Write in a contemporary, conversational style with simple language.",
            literary: "Use elegant, polished prose with rich descriptions.",
            casual: "Keep it light and informal, like chatting with a friend.",
            dramatic: "Write with intensity and emotional weight."
        },
        
        templates: {},
        
        quickPrompts: {
            'character-help': 'Help me develop this character:',
            'plot-help': 'Help me work through this plot issue:',
            'world-help': 'Help me develop this aspect of my world:'
        }
    };
}

// =============================================================================
// CUSTOM PROMPT MANAGEMENT - UPDATED FOR INDIVIDUAL PROMPTS
// =============================================================================

// Get all custom prompts for a user (organized by type)
router.post('/cowriter/prompts/custom/all', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Custom prompts not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const customPromptsFolder = getUserCoWriterFolder(userContext, 'custom-prompts');
        const customPrompts = [];

        if (await fs.pathExists(customPromptsFolder)) {
            const files = await fs.readdir(customPromptsFolder);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(customPromptsFolder, file);
                        const promptData = await fs.readJson(filePath);
                        
                        // Ensure prompt has required fields
                        if (promptData.id && promptData.type && promptData.name) {
                            customPrompts.push(promptData);
                        }
                    } catch (error) {
                        console.warn(`Failed to load custom prompt file ${file}:`, error);
                    }
                }
            }
        }

        // Sort by type, then by last modified
        customPrompts.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type.localeCompare(b.type);
            }
            return (b.lastModified || 0) - (a.lastModified || 0);
        });

        res.json({
            success: true,
            customPrompts: customPrompts
        });

    } catch (error) {
        console.error('Error loading custom prompts:', error);
        res.status(500).json({ error: 'Failed to load custom prompts' });
    }
});

// Save individual custom prompt
router.post('/cowriter/prompts/custom/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Custom prompts not available in hosted environment' });
    }

    try {
        const { userContext, promptData } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!promptData || !promptData.id || !promptData.type || !promptData.name) {
            return res.status(400).json({ error: 'Invalid prompt data - missing required fields (id, type, name)' });
        }

        // Validate prompt type
        const validTypes = ['main', 'tones', 'styles', 'templates', 'quickPrompts'];
        if (!validTypes.includes(promptData.type)) {
            return res.status(400).json({ error: 'Invalid prompt type' });
        }

        const customPromptsFolder = getUserCoWriterFolder(userContext, 'custom-prompts');
        await fs.ensureDir(customPromptsFolder);

        // Use a consistent filename format: {type}_{id}.json
        const fileName = `${promptData.type}_${promptData.id}.json`;
        const filePath = path.join(customPromptsFolder, fileName);
        
        // Ensure lastModified is set
        promptData.lastModified = Date.now();
        
        // Set created timestamp if not exists (new prompt)
        if (!promptData.created) {
            promptData.created = Date.now();
        }

        await fs.writeJson(filePath, promptData, { spaces: 2 });

        console.log(`✅ Saved custom ${promptData.type} prompt "${promptData.name}" for ${userContext.username || 'guest'}`);

        res.json({
            success: true,
            message: 'Custom prompt saved successfully',
            promptId: promptData.id
        });

    } catch (error) {
        console.error('Error saving custom prompt:', error);
        res.status(500).json({ error: 'Failed to save custom prompt' });
    }
});

// Delete individual custom prompt
router.delete('/cowriter/prompts/custom/:promptId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Custom prompts not available in hosted environment' });
    }

    try {
        const { promptId } = req.params;
        const { userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const customPromptsFolder = getUserCoWriterFolder(userContext, 'custom-prompts');
        
        if (!await fs.pathExists(customPromptsFolder)) {
            return res.status(404).json({ error: 'No custom prompts found' });
        }

        // Find the file with this prompt ID (we need to search since we don't know the type)
        const files = await fs.readdir(customPromptsFolder);
        let targetFile = null;
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const filePath = path.join(customPromptsFolder, file);
                    const promptData = await fs.readJson(filePath);
                    
                    if (promptData.id === promptId) {
                        targetFile = filePath;
                        break;
                    }
                } catch (error) {
                    console.warn(`Failed to check file ${file}:`, error);
                }
            }
        }
        
        if (targetFile) {
            await fs.remove(targetFile);
            console.log(`✅ Deleted custom prompt ${promptId} for ${userContext.username || 'guest'}`);
        } else {
            return res.status(404).json({ error: 'Custom prompt not found' });
        }

        res.json({
            success: true,
            message: 'Custom prompt deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting custom prompt:', error);
        res.status(500).json({ error: 'Failed to delete custom prompt' });
    }
});

// Get individual custom prompt by ID
router.get('/cowriter/prompts/custom/:promptId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Custom prompts not available in hosted environment' });
    }

    try {
        const { promptId } = req.params;
        const { userContext } = req.query;
        
        if (!userContext) {
            return res.status(400).json({ error: 'User context required' });
        }

        const parsedUserContext = JSON.parse(userContext);
        const validation = validateUserContext(parsedUserContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const customPromptsFolder = getUserCoWriterFolder(parsedUserContext, 'custom-prompts');
        
        if (!await fs.pathExists(customPromptsFolder)) {
            return res.status(404).json({ error: 'Custom prompt not found' });
        }

        // Find the file with this prompt ID
        const files = await fs.readdir(customPromptsFolder);
        let promptData = null;
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const filePath = path.join(customPromptsFolder, file);
                    const data = await fs.readJson(filePath);
                    
                    if (data.id === promptId) {
                        promptData = data;
                        break;
                    }
                } catch (error) {
                    console.warn(`Failed to check file ${file}:`, error);
                }
            }
        }
        
        if (!promptData) {
            return res.status(404).json({ error: 'Custom prompt not found' });
        }

        res.json({
            success: true,
            prompt: promptData
        });

    } catch (error) {
        console.error('Error loading custom prompt:', error);
        res.status(500).json({ error: 'Failed to load custom prompt' });
    }
});

// =============================================================================
// UPDATED DROPDOWN POPULATION ROUTES
// =============================================================================

// Updated tones endpoint to include custom tones
router.get('/cowriter/tones', async (req, res) => {
    try {
        const { userContext } = req.query;
        const prompts = await loadPrompts();
        
        // Start with default tones
        const tones = Object.entries(prompts.tones).map(([key, description]) => ({
            value: `default_${key}`,
            label: `Default: ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            description: description,
            isDefault: true
        }));

        // Add custom tones if user is logged in
        if (userContext) {
            try {
                const parsedUserContext = JSON.parse(userContext);
                const validation = validateUserContext(parsedUserContext);
                
                if (validation.valid) {
                    const customPromptsFolder = getUserCoWriterFolder(parsedUserContext, 'custom-prompts');
                    
                    if (await fs.pathExists(customPromptsFolder)) {
                        const files = await fs.readdir(customPromptsFolder);
                        
                        for (const file of files) {
                            if (file.startsWith('tones_') && file.endsWith('.json')) {
                                try {
                                    const filePath = path.join(customPromptsFolder, file);
                                    const customTone = await fs.readJson(filePath);
                                    
                                    if (customTone.id && customTone.name && customTone.content) {
                                        tones.push({
                                            value: customTone.id,
                                            label: customTone.name,
                                            description: customTone.content.substring(0, 100) + (customTone.content.length > 100 ? '...' : ''),
                                            isDefault: false
                                        });
                                    }
                                } catch (error) {
                                    console.warn(`Failed to load custom tone ${file}:`, error);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('Error loading custom tones:', error);
            }
        }

        res.json({
            success: true,
            tones: tones
        });

    } catch (error) {
        console.error('Error loading tones:', error);
        res.status(500).json({ error: 'Failed to load writing tones' });
    }
});

// Updated styles endpoint to include custom styles
router.get('/cowriter/styles', async (req, res) => {
    try {
        const { userContext } = req.query;
        const prompts = await loadPrompts();
        
        // Start with default styles
        const styles = Object.entries(prompts.styles).map(([key, description]) => ({
            value: `default_${key}`,
            label: `Default: ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            description: description.length > 100 ? description.substring(0, 100) + '...' : description,
            isDefault: true
        }));

        // Add custom styles if user is logged in
        if (userContext) {
            try {
                const parsedUserContext = JSON.parse(userContext);
                const validation = validateUserContext(parsedUserContext);
                
                if (validation.valid) {
                    const customPromptsFolder = getUserCoWriterFolder(parsedUserContext, 'custom-prompts');
                    
                    if (await fs.pathExists(customPromptsFolder)) {
                        const files = await fs.readdir(customPromptsFolder);
                        
                        for (const file of files) {
                            if (file.startsWith('styles_') && file.endsWith('.json')) {
                                try {
                                    const filePath = path.join(customPromptsFolder, file);
                                    const customStyle = await fs.readJson(filePath);
                                    
                                    if (customStyle.id && customStyle.name && customStyle.content) {
                                        styles.push({
                                            value: customStyle.id,
                                            label: customStyle.name,
                                            description: customStyle.content.substring(0, 100) + (customStyle.content.length > 100 ? '...' : ''),
                                            isDefault: false
                                        });
                                    }
                                } catch (error) {
                                    console.warn(`Failed to load custom style ${file}:`, error);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('Error loading custom styles:', error);
            }
        }

        res.json({
            success: true,
            styles: styles
        });

    } catch (error) {
        console.error('Error loading styles:', error);
        res.status(500).json({ error: 'Failed to load writing styles' });
    }
});

// Updated templates endpoint to include custom templates
router.get('/cowriter/templates', async (req, res) => {
    try {
        const { userContext } = req.query;
        const prompts = await loadPrompts();
        
        // Start with default templates
        const templates = Object.entries(prompts.templates || {}).map(([key, template]) => ({
            id: `default_${key}`,
            name: `Default: ${template.name}`,
            description: template.basePrompt.substring(0, 100) + (template.basePrompt.length > 100 ? '...' : ''),
            isDefault: true
        }));

        // Add custom templates if user is logged in
        if (userContext) {
            try {
                const parsedUserContext = JSON.parse(userContext);
                const validation = validateUserContext(parsedUserContext);
                
                if (validation.valid) {
                    const customPromptsFolder = getUserCoWriterFolder(parsedUserContext, 'custom-prompts');
                    
                    if (await fs.pathExists(customPromptsFolder)) {
                        const files = await fs.readdir(customPromptsFolder);
                        
                        for (const file of files) {
                            if (file.startsWith('templates_') && file.endsWith('.json')) {
                                try {
                                    const filePath = path.join(customPromptsFolder, file);
                                    const customTemplate = await fs.readJson(filePath);
                                    
                                    if (customTemplate.id && customTemplate.name && customTemplate.content) {
                                        templates.push({
                                            id: customTemplate.id,
                                            name: customTemplate.name,
                                            description: customTemplate.content.substring(0, 100) + (customTemplate.content.length > 100 ? '...' : ''),
                                            isDefault: false
                                        });
                                    }
                                } catch (error) {
                                    console.warn(`Failed to load custom template ${file}:`, error);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('Error loading custom templates:', error);
            }
        }

        res.json({
            success: true,
            templates: templates
        });

    } catch (error) {
        console.error('Error loading templates:', error);
        res.status(500).json({ error: 'Failed to load templates' });
    }
});

// =============================================================================
// UPDATED PROMPT ASSEMBLY FOR INDIVIDUAL PROMPTS
// =============================================================================

// Updated assemblePrompt function to handle individual custom prompts
async function assemblePrompt(userMessage, chatHistory, settings, coWriterManager = null) {
    let prompts;
    
    // Use custom prompts if available, otherwise fallback to defaults
    if (coWriterManager && coWriterManager.promptManager) {
        // Get main prompt (could be default or custom)
        const mainPrompt = coWriterManager.promptManager.getActiveMainPrompt();
        const mainPromptContent = mainPrompt ? mainPrompt.content : (await loadPrompts()).mainPrompt;
        
        prompts = {
            mainPrompt: mainPromptContent
        };
    } else {
        prompts = await loadPrompts();
    }
    
    let fullPrompt = '';

    // 1. Main Prompt
    fullPrompt += `<main prompt>${prompts.mainPrompt}</main prompt>\n\n`;

    // 2. Tone (if selected) - handle both default and custom
    if (settings.tone && settings.tone.trim()) {
        let tonePrompt = null;
        
        if (settings.tone.startsWith('default_')) {
            // Default tone
            const toneKey = settings.tone.replace('default_', '');
            const defaultPrompts = await loadPrompts();
            tonePrompt = defaultPrompts.tones[toneKey];
        } else {
            // Custom tone - load from file
            tonePrompt = await loadCustomPromptContent(settings.tone, settings.userContext || {});
        }
        
        if (tonePrompt) {
            fullPrompt += `<tone>This is the tone you should go for: ${tonePrompt}</tone>\n\n`;
        }
    }

    // 3. Style (if selected) - handle both default and custom  
    if (settings.style && settings.style.trim()) {
        let stylePrompt = null;
        
        if (settings.style.startsWith('default_')) {
            // Default style
            const styleKey = settings.style.replace('default_', '');
            const defaultPrompts = await loadPrompts();
            stylePrompt = defaultPrompts.styles[styleKey];
        } else {
            // Custom style - load from file
            stylePrompt = await loadCustomPromptContent(settings.style, settings.userContext || {});
        }
        
        if (stylePrompt) {
            fullPrompt += `<style>You must write in the following style: ${stylePrompt}</style>\n\n`;
        }
    }

    // 4. Template (if provided) - handle both default and custom
    if (settings.templateId && settings.templateId.trim()) {
        let templatePrompt = null;
        
        if (settings.templateId.startsWith('default_')) {
            // Default template
            const templateKey = settings.templateId.replace('default_', '');
            const defaultPrompts = await loadPrompts();
            const template = defaultPrompts.templates[templateKey];
            templatePrompt = template ? template.basePrompt : null;
        } else {
            // Custom template - load from file
            templatePrompt = await loadCustomPromptContent(settings.templateId, settings.userContext || {});
        }
        
        if (templatePrompt) {
            fullPrompt += `<additional instructions>Additional instructions to take into account: ${templatePrompt.trim()}</additional instructions>\n\n`;
        }
    }
    
    // 5. World Context (if provided) - unchanged
    if (settings.worldContext && settings.worldContext.trim()) {
        fullPrompt += `<world context>Context about the setting and characters: ${settings.worldContext.trim()}</world context>\n\n`;
    }
    
    // 6. Chat History (if provided) - unchanged
    if (chatHistory && chatHistory.length > 0) {
        fullPrompt += '<chat history>Previous conversation:\n';
        chatHistory.forEach(msg => {
            const role = msg.type === 'user' ? 'User' : 'Assistant';
            fullPrompt += `${role}: ${msg.content}\n`;
        });
        fullPrompt += '</chat history>\n\n';
    }
    
    // 7. Current User Request - unchanged
    fullPrompt += `User: ${userMessage.trim()}\n\nAssistant:`;

    // Log assembly details (updated for individual prompts)
    console.log(`[AI] Prompt Assembly for ${settings.provider}/${settings.model}:`);
    console.log(`  [TXT] Main Prompt: [${prompts.mainPrompt.length} chars]`);

    if (settings.tone) {
        const toneType = settings.tone.startsWith('default_') ? 'Default' : 'Custom';
        const toneName = settings.tone.startsWith('default_') ? settings.tone.replace('default_', '') : 'Custom';
        console.log(`  [TON] Tone: ${toneType} - ${toneName}`);
    }

    if (settings.style) {
        const styleType = settings.style.startsWith('default_') ? 'Default' : 'Custom';
        const styleName = settings.style.startsWith('default_') ? settings.style.replace('default_', '') : 'Custom';
        console.log(`  [STY] Style: ${styleType} - ${styleName}`);
    }

    if (settings.templateId) {
        const templateType = settings.templateId.startsWith('default_') ? 'Default' : 'Custom';
        console.log(`  [TPL] Template: ${templateType}`);
    }

    console.log(`  [LEN] Total: ${fullPrompt.length} characters`);

    return fullPrompt;
}

// Helper function to load custom prompt content by ID
async function loadCustomPromptContent(promptId, userContext) {
    try {
        if (!userContext || userContext.isGuest) {
            return null;
        }

        const customPromptsFolder = getUserCoWriterFolder(userContext, 'custom-prompts');
        
        if (!await fs.pathExists(customPromptsFolder)) {
            return null;
        }

        const files = await fs.readdir(customPromptsFolder);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const filePath = path.join(customPromptsFolder, file);
                    const promptData = await fs.readJson(filePath);
                    
                    if (promptData.id === promptId) {
                        return promptData.content;
                    }
                } catch (error) {
                    console.warn(`Failed to check custom prompt file ${file}:`, error);
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error loading custom prompt content:', error);
        return null;
    }
}

// =============================================================================
// UPDATED DEBUG ENDPOINTS
// =============================================================================

// Updated debug endpoint for custom prompts
router.post('/debug/cowriter/custom-prompts', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Debug endpoints not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const customPromptsFolder = getUserCoWriterFolder(userContext, 'custom-prompts');
        
        const debug = {
            folder: customPromptsFolder,
            exists: await fs.pathExists(customPromptsFolder),
            files: [],
            prompts: []
        };

        if (debug.exists) {
            const files = await fs.readdir(customPromptsFolder);
            debug.files = files;
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(customPromptsFolder, file);
                        const promptData = await fs.readJson(filePath);
                        debug.prompts.push({
                            file: file,
                            id: promptData.id,
                            type: promptData.type,
                            name: promptData.name,
                            contentLength: promptData.content ? promptData.content.length : 0,
                            created: promptData.created,
                            lastModified: promptData.lastModified
                        });
                    } catch (error) {
                        debug.prompts.push({
                            file: file,
                            error: error.message
                        });
                    }
                }
            }
        }

        res.json({
            success: true,
            debug: debug
        });

    } catch (error) {
        console.error('Debug custom prompts error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get default prompts
router.get('/cowriter/prompts/defaults', async (req, res) => {
    try {
        const defaultPrompts = await loadPrompts(); // ← This loads from prompts.json!
        
        res.json({
            success: true,
            prompts: defaultPrompts
        });

    } catch (error) {
        console.error('Error loading default prompts:', error);
        res.status(500).json({ error: 'Failed to load default prompts' });
    }
});

module.exports = router;