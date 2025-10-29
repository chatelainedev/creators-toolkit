const express = require('express');
const fs = require('fs-extra');
const path = require('path');

// Import from core.js
const {
    IS_LOCAL,
    validateUserContext,
    getUserSettingsFolder
} = require('./core');

const router = express.Router();

// =============================================================================
// ENTRY HELPER ROUTES
// =============================================================================

// Helper function to get Character Manager folder (same as character-manager.js)
function getUserCharacterManagerFolder(userContext) {
    const baseFolder = userContext.isGuest 
        ? path.join(getUserSettingsFolder(userContext), 'character-manager')
        : path.join(getUserSettingsFolder(userContext), 'character-manager');
    
    return baseFolder;
}

// Get Character Manager projects for Entry Helper dropdown
router.post('/entry-helper/character-manager/projects', async (req, res) => {
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
        
        if (!await fs.pathExists(characterManagerFolder)) {
            return res.json([]);
        }
        
        const entries = await fs.readdir(characterManagerFolder, { withFileTypes: true });
        const projects = [];
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                // New structure: project folder with project.json
                const projectJsonPath = path.join(characterManagerFolder, entry.name, 'project.json');
                if (await fs.pathExists(projectJsonPath)) {
                    projects.push({
                        name: entry.name,
                        displayName: entry.name
                    });
                }
            } else if (entry.isFile() && entry.name.endsWith('.json') && 
                      entry.name !== 'folders.json' && entry.name !== 'settings.json') {
                // Old structure: single JSON files
                const projectName = entry.name.replace('.json', '');
                projects.push({
                    name: projectName,
                    displayName: projectName
                });
            }
        }
        
        projects.sort((a, b) => a.displayName.localeCompare(b.displayName));
        res.json(projects);
        
    } catch (error) {
        console.error('Error reading character manager projects for Entry Helper:', error);
        res.status(500).json({ error: 'Failed to read character manager projects' });
    }
});

// Get characters from a specific Character Manager project
router.post('/entry-helper/character-manager/characters', async (req, res) => {
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
        
        if (!projectData.characters || !Array.isArray(projectData.characters)) {
            return res.json([]);
        }

        // Format characters for Entry Helper dropdown - just basic info needed
        const characters = projectData.characters.map(character => ({
            id: character.id,
            name: character.name,
            // Store full character data for context generation
            fullData: character
        }));

        characters.sort((a, b) => a.name.localeCompare(b.name));
        res.json(characters);
        
    } catch (error) {
        console.error('Error reading characters for Entry Helper:', error);
        res.status(500).json({ error: 'Failed to read characters' });
    }
});

// Generate character context text from character data
router.post('/entry-helper/character-context', async (req, res) => {
    try {
        const { userContext, characterData } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!characterData) {
            return res.json({ contextText: '', tokenEstimate: 0 });
        }

        // Generate comprehensive character context text
        const contextParts = [];
        
        contextParts.push(`Character: ${characterData.name}`);
        
        if (characterData.basic) {
            contextParts.push(`Basic Description: ${characterData.basic}`);
        }
        
        if (characterData.physical) {
            contextParts.push(`Physical Description: ${characterData.physical}`);
        }
        
        if (characterData.personality) {
            contextParts.push(`Personality: ${characterData.personality}`);
        }
        
        if (characterData.background) {
            contextParts.push(`Background: ${characterData.background}`);
        }
        
        if (characterData.equipment) {
            contextParts.push(`Equipment: ${characterData.equipment}`);
        }
        
        if (characterData.hobbies) {
            contextParts.push(`Hobbies: ${characterData.hobbies}`);
        }
        
        if (characterData.quirks) {
            contextParts.push(`Quirks: ${characterData.quirks}`);
        }
        
        if (characterData.sexuality) {
            contextParts.push(`Sexuality: ${characterData.sexuality}`);
        }
        
        if (characterData.fightingStyle) {
            contextParts.push(`Fighting Style: ${characterData.fightingStyle}`);
        }
        
        if (characterData.tags && characterData.tags.length > 0) {
            contextParts.push(`Tags: ${characterData.tags.join(', ')}`);
        }
        
        if (characterData.notes) {
            contextParts.push(`Notes: ${characterData.notes}`);
        }

        const contextText = contextParts.join('\n\n');

        res.json({
            contextText: contextText,
            tokenEstimate: Math.ceil(contextText.length / 4) // Rough token estimate
        });
        
    } catch (error) {
        console.error('Error generating character context for Entry Helper:', error);
        res.status(500).json({ error: 'Failed to generate character context' });
    }
});

// Generate context from selected entries
router.post('/entry-helper/selected-entries-context', async (req, res) => {
    try {
        const { userContext, selectedEntries } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!selectedEntries || !Array.isArray(selectedEntries)) {
            return res.json({ contextText: '', tokenEstimate: 0 });
        }

        // Generate context text from selected entries
        const contextParts = selectedEntries.map(entry => {
            const keys = Array.isArray(entry.key) ? entry.key.join(', ') : (entry.key || '');
            const content = entry.content || '';
            const name = entry.comment || 'Untitled Entry';
            
            return `Entry: ${name}\nKeys: ${keys}\nContent: ${content}`;
        });

        const contextText = contextParts.join('\n\n');

        res.json({
            contextText: contextText,
            tokenEstimate: Math.ceil(contextText.length / 4),
            entryCount: selectedEntries.length
        });
        
    } catch (error) {
        console.error('Error generating selected entries context for Entry Helper:', error);
        res.status(500).json({ error: 'Failed to generate entries context' });
    }
});

// Add this endpoint to your existing entry-helper.js file
router.post('/entry-helper/selected-entries', async (req, res) => {
    try {
        const { userContext, selectedEntryIds, allEntries } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!selectedEntryIds || !Array.isArray(selectedEntryIds)) {
            return res.json({ selectedEntries: [], contextText: '' });
        }

        if (!allEntries || !Array.isArray(allEntries)) {
            return res.status(400).json({ error: 'All entries array is required' });
        }

        // Filter to get only selected entries
        const selectedEntries = allEntries.filter(entry => 
            selectedEntryIds.includes(entry._internalId || entry.uid)
        );

        // Generate context text from selected entries
        let contextText = '';
        if (selectedEntries.length > 0) {
            contextText = selectedEntries.map(entry => {
                const keys = Array.isArray(entry.key) ? entry.key.join(', ') : (entry.key || '');
                const content = entry.content || '';
                const name = entry.comment || 'Untitled Entry';
                
                return `Entry: ${name}\nKeys: ${keys}\nContent: ${content}`;
            }).join('\n\n');
        }

        res.json({
            success: true,
            contextText: contextText,
            totalEntries: selectedEntries.length,
            totalTokensEstimate: Math.ceil(contextText.length / 4)
        });
        
    } catch (error) {
        console.error('Error processing selected entries for Entry Helper:', error);
        res.status(500).json({ error: 'Failed to process selected entries' });
    }
});

// Generate lorebook entries using LLM
router.post('/entry-helper/generate', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'LLM functionality not available in hosted environment' });
    }

    try {
        const { userContext, userPrompt, characterContext, selectedEntriesContext, settings } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!userPrompt || !userPrompt.trim()) {
            return res.status(400).json({ error: 'User prompt is required' });
        }

        // Get CoWriter settings to determine provider/model
        const coWriterSettings = await loadCoWriterSettings(userContext);
        if (!coWriterSettings.provider || !coWriterSettings.model) {
            return res.status(400).json({ error: 'Please configure LLM provider and model in CoWriter settings first' });
        }

        // Load API key for the provider
        const apiKey = await loadApiKey(userContext, coWriterSettings.provider);
        if (!apiKey) {
            return res.status(400).json({ error: `No API key configured for ${coWriterSettings.provider}` });
        }

        // Assemble Entry Helper specific prompt
        const fullPrompt = assembleEntryHelperPrompt(userPrompt, characterContext, selectedEntriesContext, settings);
        console.log('🎯 Entry Helper prompt assembled, length:', fullPrompt.length);

        // Send to LLM using existing infrastructure
        const { sendToLLM } = require('./llm');
        const response = await sendToLLM(coWriterSettings.provider, coWriterSettings.model, fullPrompt, apiKey);
        
        // Parse response to extract individual entries
        const parsedEntries = parseEntryHelperResponse(response);
        
        console.log(`✅ Generated ${parsedEntries.length} entries for Entry Helper`);

        res.json({
            success: true,
            entries: parsedEntries,
            rawResponse: response,
            totalEntries: parsedEntries.length
        });

    } catch (error) {
        console.error('Error in Entry Helper generation:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate entries' 
        });
    }
});

// Helper function to load CoWriter settings
async function loadCoWriterSettings(userContext) {
    try {
        const coWriterFolder = userContext.isGuest 
            ? path.join(require('./core').GUEST_FOLDER, 'cowriter')
            : path.join(require('./core').USERS_FOLDER, userContext.userId, 'cowriter');
        
        const settingsPath = path.join(coWriterFolder, 'settings.json');
        
        if (await fs.pathExists(settingsPath)) {
            return await fs.readJson(settingsPath);
        }
        
        return { provider: 'google', model: 'gemini-1.5-flash' }; // defaults
    } catch (error) {
        console.error('Error loading CoWriter settings:', error);
        return { provider: 'google', model: 'gemini-1.5-flash' };
    }
}

// Import the loadApiKey function from llm.js
const { loadApiKey, sendToLLM } = require('./llm');

// Entry Helper specific prompt assembly
function assembleEntryHelperPrompt(userPrompt, characterContext, selectedEntriesContext, settings) {
    let prompt = '';
    
    // Base Prompt
    prompt += `You are helping User create lorebook entries using context from their existing setting and/or characters. Lorebook, aka world info, entries are brief descriptions of elements within a setting, which are triggered by keywords, and used in popular AI roleplaying programs like SillyTavern. When triggered, they provide useful information to the LLM, but only when needed, so that User can have many lorebook entries without bogging down their roleplay experience. Lorebook entries can cover locations, events (general historical events within the world, or more personal events for specific characters), characters, concepts, items, abilities, relationships...anything that may be useful for the LLM to know. They are always written in a concise way, balancing brevity with detail. When you create lorebook entries, you should take into account any information provided to you, ensuring that your suggestions fulfill the user's specific requests if provided, but also make sense within the setting. You must use a very specific format, as demonstrated by the following template:

### Template
Entry Name
Keys: keyword1, keyword2, keyword3
Content

### Lorebook Entry Example
Fallen Angels
Keys: fallen, angel, angels
Content: Fallen angels are former angels who rebelled against Heaven's hierarchy and were cast out. Retain angelic powers but have corrupted them to use them for evil. They command demons, try to corrupt human souls, and work to undermine Heaven's influence on Earth.

`;

    // Blacklisted Words
    if (settings.blacklistedWords && settings.blacklistedWords.trim()) {
        prompt += `Avoid using these words in your entries: ${settings.blacklistedWords.trim()}\n\n`;
    }

    // Context
    if (characterContext || selectedEntriesContext) {
        prompt += `Here is the context provided, to be used when creating lorebook entries:\n\n`;
        
        if (characterContext) {
            prompt += `CHARACTER CONTEXT:\n${characterContext}\n\n`;
        }
        
        if (selectedEntriesContext) {
            prompt += `EXISTING ENTRIES CONTEXT:\n${selectedEntriesContext}\n\n`;
        }
    }

    // User Prompt
    prompt += `Here is the user's specific request: ${userPrompt.trim()}\n\n`;

    // Final Prompt
    prompt += `Create a minimum of 3 unique lorebook entries. Avoid positivity bias and repetition. Write the entries in plain, simple English, avoiding unnecessary filler words or prose. Use the exact template format shown above for each entry.`;

    return prompt;
}

// Parse LLM response to extract individual entries
function parseEntryHelperResponse(response) {
    const entries = [];
    
    try {
        // Split response by entry patterns - look for entry names followed by "Keys:"
        const entryPattern = /^(.+)\s*\n\s*Keys:\s*(.+)\s*\n\s*(?:Content:?\s*)?([\s\S]*?)(?=\n\n[^\n]|\n[A-Z][^\n]*\n\s*Keys:|\n*$)/gmi;
        
        let match;
        while ((match = entryPattern.exec(response)) !== null) {
            const name = match[1].trim().replace(/^#+\s*/, ''); // Remove markdown headers
            const keysText = match[2].trim();
            let content = match[3].trim().replace(/^Content:?\s*/i, '');
            
            // Fix: Remove leading whitespace and indentation
            content = content.split('\n').map(line => line.trim()).join('\n').trim();
            
            if (name && keysText && content) {
                // Parse keys
                const keys = keysText.split(',').map(k => k.trim()).filter(k => k.length > 0);
                
                if (keys.length > 0) {
                    entries.push({
                        name: name,
                        keys: keys,
                        content: content
                    });
                }
            }
        }
        
        console.log(`📝 Parsed ${entries.length} entries from LLM response`);
        
    } catch (error) {
        console.error('Error parsing Entry Helper response:', error);
    }
    
    return entries;
}

module.exports = router;