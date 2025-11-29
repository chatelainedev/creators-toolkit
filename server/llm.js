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

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const COWRITER_FOLDER = 'cowriter';
const ENCRYPTION_KEY = process.env.COWRITER_ENCRYPTION_KEY || 'default-dev-key-change-in-production';

// Get user's CoWriter folder structure
function getUserCoWriterFolder(userContext, subfolder = '') {
    const baseFolder = userContext.isGuest 
        ? path.join(GUEST_FOLDER, COWRITER_FOLDER)
        : path.join(USERS_FOLDER, userContext.userId, COWRITER_FOLDER);
    
    return subfolder ? path.join(baseFolder, subfolder) : baseFolder;
}

// Encryption utilities for API keys
function encryptApiKey(apiKey) {
    try {
        const algorithm = 'aes-256-cbc';
        const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(apiKey, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Prepend IV to encrypted data
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt API key');
    }
}

function decryptApiKey(encryptedKey) {
    try {
        const algorithm = 'aes-256-cbc';
        const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
        
        // Split IV and encrypted data
        const parts = encryptedKey.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted key format');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Error decrypting API key:', error);
        return null;
    }
}

async function loadProviders() {
    try {
        const providersPath = path.join(__dirname, '..', 'main', 'cowriter', 'providers.json');
        if (await fs.pathExists(providersPath)) {
            return await fs.readJson(providersPath);
        }
        return getDefaultProviders();
    } catch (error) {
        console.error('Error loading providers:', error);
        return getDefaultProviders();
    }
}

// Default configurations
// Simple prompts loader - just reads the JSON file
async function loadPrompts() {
    try {
        const promptsPath = path.join(__dirname, '..', 'main', 'cowriter', 'prompts.json');
        if (await fs.pathExists(promptsPath)) {
            return await fs.readJson(promptsPath);
        }
    } catch (error) {
        console.error('Error loading prompts in llm.js:', error);
    }
    
    // Simple fallback with just what llm.js needs
    return {
        mainPrompt: "You are a helpful creative writing assistant.",
        tones: {},
        styles: {},
        templates: {},
        quickPrompts: {}
    };
}

// Truncate chat history based on provider limits
async function truncateChatHistory(chatHistory, provider) {
    const providers = await loadProviders();
    const providerConfig = providers[provider];
    
    if (!providerConfig || !providerConfig.apiLimits) {
        // No limits configured, return last 20 messages as fallback
        return chatHistory.slice(-20);
    }
    
    const limits = providerConfig.apiLimits;
    
    // First, limit by message count
    let truncated = chatHistory.slice(-limits.maxChatHistoryMessages);
    
    // Then, limit by estimated tokens
    const estimatedTokens = truncated.reduce((sum, msg) => {
        return sum + (msg.content.length * limits.estimatedTokensPerChar);
    }, 0);
    
    // If over token limit, remove oldest messages
    if (estimatedTokens > limits.maxChatHistoryTokens) {
        while (truncated.length > 0) {
            const currentTokens = truncated.reduce((sum, msg) => {
                return sum + (msg.content.length * limits.estimatedTokensPerChar);
            }, 0);
            
            if (currentTokens <= limits.maxChatHistoryTokens) {
                break;
            }
            
            truncated.shift(); // Remove oldest message
        }
    }
    
    return truncated;
}

function getDefaultProviders() {
    return {
        google: {
            name: "Google Gemini",
            baseUrl: "https://generativelanguage.googleapis.com",
            modelsEndpoint: "/v1/models",
            chatEndpoint: "/v1/models/{model}:generateContent",
            keyRequired: true,
            fallbackModels: [
                { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash (Experimental)" },
                { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
                { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" }
            ]
        },
        anthropic: {
            name: "Anthropic Claude",
            baseUrl: "https://api.anthropic.com",
            modelsEndpoint: null,
            chatEndpoint: "/v1/messages",
            keyRequired: true,
            enabled: true,
            fallbackModels: [
                { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
                { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" }
            ]
        },
        openai: {  // <-- Add this entire section
            name: "OpenAI GPT",
            baseUrl: "https://api.openai.com",
            modelsEndpoint: "/v1/models",
            chatEndpoint: "/v1/chat/completions",
            keyRequired: true,
            enabled: true,
            fallbackModels: [
                { value: "gpt-4o", label: "GPT-4o" },
                { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
                { value: "gpt-4", label: "GPT-4" },
                { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" }
            ]
        }
    };
}

// =============================================================================
// PROVIDER & MODEL MANAGEMENT
// =============================================================================

// Get available providers
router.get('/llm/providers', async (req, res) => {
    try {
        const providers = await loadProviders();
        
        // Return provider list (only enabled ones, without sensitive details)
        const providerList = Object.entries(providers)
            .filter(([key, provider]) => provider.enabled !== false) // Filter out disabled providers
            .map(([key, provider]) => ({
                id: key,
                name: provider.name,
                keyRequired: provider.keyRequired
            }));
        
        res.json({
            success: true,
            providers: providerList
        });
    } catch (error) {
        console.error('Error loading providers:', error);
        res.status(500).json({ error: 'Failed to load providers' });
    }
});

// Get models for a specific provider
router.get('/llm/models/:provider', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'LLM functionality not available in hosted environment' });
    }

    try {
        const { provider } = req.params;
        const { userContext } = req.query;
        
        if (!userContext) {
            return res.status(400).json({ error: 'User context required' });
        }

        const parsedUserContext = JSON.parse(userContext);
        const validation = validateUserContext(parsedUserContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const providers = await loadProviders();
        const providerConfig = providers[provider];
        
        if (!providerConfig) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        // Try to fetch models from API
        let models = [];
        try {
            models = await fetchModelsFromAPI(provider, providerConfig, parsedUserContext);
        } catch (apiError) {
            console.warn(`API fetch failed for ${provider}, using fallback:`, apiError.message);
            models = providerConfig.fallbackModels || [];
        }

        res.json({
            success: true,
            provider: provider,
            models: models,
            fromAPI: models.length > 0,
            fallback: models.length === 0
        });

    } catch (error) {
        console.error('Error getting models:', error);
        res.status(500).json({ error: 'Failed to get models' });
    }
});

// Fetch models from provider API
async function fetchModelsFromAPI(provider, providerConfig, userContext) {
    if (provider === 'google') {
        return await fetchGoogleModels(providerConfig, userContext);
    }
    if (provider === 'anthropic') {
        return await fetchAnthropicModels(providerConfig, userContext);
    }
    if (provider === 'openai') {
        return await fetchOpenAIModels(providerConfig, userContext);
    }
    if (provider === 'openrouter') {  // <-- ADD THIS
        return await fetchOpenRouterModels(providerConfig, userContext);
    }
    
    throw new Error(`Model fetching not implemented for provider: ${provider}`);
}

// Fetch Google Gemini models
// Fetch Google Gemini models
async function fetchGoogleModels(providerConfig, userContext) {
    const apiKey = await loadApiKey(userContext, 'google');
    
    if (!apiKey) {
        throw new Error('No API key configured for Google');
    }

    const url = `${providerConfig.baseUrl}${providerConfig.modelsEndpoint}?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google API error response: ${errorText}`);
        throw new Error(`Google API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse Google's model response - STRICT TEXT GENERATION ONLY
    const models = data.models
        ?.filter(model => {
            const name = model.name.toLowerCase();
            const methods = model.supportedGenerationMethods || [];
            
            // Must be a Gemini model
            if (!name.includes('gemini')) return false;
            
            // Must support generateContent (text generation)
            if (!methods.includes('generateContent')) return false;
            
            // Exclude all special-purpose models
            const excludeKeywords = [
                'vision',
                'embedding', 
                'imagen',
                'aqa',
                'image-generation', // Image gen
                'image-preview',    // Image gen preview
                '-image',           // Any image variant
                '-tts',             // Text-to-speech
                'thinking',         // Thinking models
                'robotics',         // Robotics models
                'computer-use',     // Computer use models
                '-latest',          // Aliased versions
                'exp-1206',         // Date-stamped experiments
                'exp-1219'          // Date-stamped experiments
            ];
            
            // Check if name contains any excluded keywords
            if (excludeKeywords.some(keyword => name.includes(keyword))) {
                return false;
            }
            
            return true;
        })
        ?.map(model => ({
            value: model.name.split('/').pop(),
            label: formatGoogleModelName(model.name, model.displayName)
        })) || [];

    return models;
}

// Format Google model names for display
function formatGoogleModelName(fullName, displayName) {
    if (displayName) return displayName;
    
    const modelName = fullName.split('/').pop();
    return modelName
        .replace('gemini-', 'Gemini ')
        .replace('-pro', ' Pro')
        .replace('-flash', ' Flash')
        .replace('-exp', ' (Experimental)')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Add this around line 175, after fetchGoogleModels
async function fetchAnthropicModels(providerConfig, userContext) {
    const apiKey = await loadApiKey(userContext, 'anthropic');
    
    if (!apiKey) {
        throw new Error('No API key configured for Anthropic');
    }

    try {
        // Use Anthropic's actual models endpoint
        const response = await fetch('https://api.anthropic.com/v1/models', {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            }
        });

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse Anthropic's model response
        const models = data.data?.map(model => ({
            value: model.id,
            label: formatAnthropicModelName(model.id, model.display_name)
        })) || [];

        return models;

    } catch (error) {
        console.warn('Anthropic API fetch failed, using fallback models:', error.message);
        // Fall back to the config models if API fails
        return providerConfig.fallbackModels || [];
    }
}

function formatAnthropicModelName(modelId, displayName) {
    if (displayName) return displayName;
    
    // Format the model ID into a readable name
    return modelId
        .replace('claude-', 'Claude ')
        .replace('-v', ' v')
        .replace('-sonnet', ' Sonnet')
        .replace('-opus', ' Opus')
        .replace('-haiku', ' Haiku')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Fetch OpenAI models
async function fetchOpenAIModels(providerConfig, userContext) {
    const apiKey = await loadApiKey(userContext, 'openai');
    
    if (!apiKey) {
        throw new Error('No API key configured for OpenAI');
    }

    try {
        const response = await fetch(`${providerConfig.baseUrl}${providerConfig.modelsEndpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse OpenAI's model response - filter for GPT models only
        const models = data.data
            ?.filter(model => model.id.includes('gpt') && !model.id.includes('instruct'))
            ?.map(model => ({
                value: model.id,
                label: formatOpenAIModelName(model.id)
            })) || [];

        return models;

    } catch (error) {
        console.warn('OpenAI API fetch failed, using fallback models:', error.message);
        return providerConfig.fallbackModels || [];
    }
}

// Fetch OpenRouter models
async function fetchOpenRouterModels(providerConfig, userContext) {
    const apiKey = await loadApiKey(userContext, 'openrouter');
    
    if (!apiKey) {
        throw new Error('No API key configured for OpenRouter');
    }

    try {
        const response = await fetch(`${providerConfig.baseUrl}${providerConfig.modelsEndpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse OpenRouter's model response
        const models = data.data
            ?.filter(model => model.id && !model.id.includes('moderation'))
            ?.map(model => ({
                value: model.id,
                label: formatOpenRouterModelName(model.id, model.name)
            })) || [];

        return models;

    } catch (error) {
        console.warn('OpenRouter API fetch failed, using fallback models:', error.message);
        return providerConfig.fallbackModels || [];
    }
}

function formatOpenRouterModelName(modelId, name) {
    if (name) return name;
    
    // Format model ID into readable name
    const parts = modelId.split('/');
    const modelName = parts[parts.length - 1];
    return modelName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function formatOpenAIModelName(modelId) {
    return modelId
        .replace('gpt-', 'GPT-')
        .replace('-turbo', ' Turbo')
        .replace('-preview', ' Preview')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// =============================================================================
// CHAT FUNCTIONALITY
// =============================================================================

// Send message to LLM
router.post('/llm/chat', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'LLM functionality not available in hosted environment' });
    }

    try {
        const { userContext, message, chatHistory, settings, coWriterInstance } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!settings || !settings.provider || !settings.model) {
            return res.status(400).json({ error: 'Provider and model settings required' });
        }

        // Load API key for provider
        const apiKey = await loadApiKey(userContext, settings.provider);
        if (!apiKey) {
            return res.status(400).json({ error: `No API key configured for ${settings.provider}` });
        }

        // Assemble full prompt
        const fullPrompt = await assemblePrompt(message, chatHistory, settings, coWriterInstance);
        console.log('🤖 Assembled prompt length:', fullPrompt.length);

        // Send to LLM
        const response = await sendToLLM(settings.provider, settings.model, fullPrompt, apiKey);
        
        console.log(`✅ LLM response received: ${response.length} characters`);

        res.json({
            success: true,
            response: response,
            model: settings.model,
            provider: settings.provider
        });

    } catch (error) {
        console.error('Error in LLM chat:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to process chat request' 
        });
    }
});

// Send request to LLM provider
async function sendToLLM(provider, model, prompt, apiKey) {
    if (provider === 'google') {
        return await sendToGoogle(model, prompt, apiKey);
    }
    if (provider === 'anthropic') {
        return await sendToAnthropic(model, prompt, apiKey);
    }
    if (provider === 'openai') {
        return await sendToOpenAI(model, prompt, apiKey);
    }
    if (provider === 'openrouter') {  // <-- ADD THIS
        return await sendToOpenRouter(model, prompt, apiKey);
    }
    
    throw new Error(`LLM provider not implemented: ${provider}`);
}

// Send to Google Gemini
async function sendToGoogle(model, prompt, apiKey) {
    const providers = await loadProviders();
    const googleConfig = providers.google;
    
    const endpoint = googleConfig.chatEndpoint.replace('{model}', model);
    const url = `${googleConfig.baseUrl}${endpoint}?key=${apiKey}`;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40
        }
    };

    console.log(`🤖 Sending request to Google Gemini (${model})`);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Google API Error:', response.status, errorData);
        throw new Error(`Google API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Extract response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
        throw new Error('No response text received from Google API');
    }

    return responseText;
}

// Add this around line 330, after sendToGoogle
async function sendToAnthropic(model, prompt, apiKey) {
    const providers = await loadProviders();
    const anthropicConfig = providers.anthropic;
    
    const url = `${anthropicConfig.baseUrl}${anthropicConfig.chatEndpoint}`;
    
    const requestBody = {
        model: model,
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    };

    console.log(`🤖 Sending request to Anthropic Claude (${model})`);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Anthropic API Error:', response.status, errorData);
        throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Extract response text from Claude's response format
    const responseText = data.content?.[0]?.text;
    
    if (!responseText) {
        throw new Error('No response text received from Anthropic API');
    }

    return responseText;
}

// Send to OpenAI GPT
async function sendToOpenAI(model, prompt, apiKey) {
    const providers = await loadProviders();
    const openaiConfig = providers.openai;
    
    const url = `${openaiConfig.baseUrl}${openaiConfig.chatEndpoint}`;
    
    const requestBody = {
        model: model,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 2048,
        temperature: 0.7
    };

    console.log(`🤖 Sending request to OpenAI GPT (${model})`);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API Error:', response.status, errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
        throw new Error('No response text received from OpenAI API');
    }

    return responseText;
}

// Send to OpenRouter
async function sendToOpenRouter(model, prompt, apiKey) {
    const providers = await loadProviders();
    const openrouterConfig = providers.openrouter;
    
    const url = `${openrouterConfig.baseUrl}${openrouterConfig.chatEndpoint}`;
    
    const requestBody = {
        model: model,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 2048,
        temperature: 0.7
    };

    console.log(`🤖 Sending request to OpenRouter (${model})`);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://your-app-url.com', // Optional: your site URL
            'X-Title': 'CoWriter' // Optional: your app name
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenRouter API Error:', response.status, errorData);
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
        throw new Error('No response text received from OpenRouter API');
    }

    return responseText;
}

// Test LLM connection
router.post('/llm/test-connection', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'LLM functionality not available in hosted environment' });
    }

    try {
        const { userContext, provider, model } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Load API key
        const apiKey = await loadApiKey(userContext, provider);
        if (!apiKey) {
            return res.status(400).json({ error: `No API key configured for ${provider}` });
        }

        // Send test message
        const testPrompt = "Hello! This is a connection test. Please respond with 'Connection successful!' if you receive this message.";
        const response = await sendToLLM(provider, model, testPrompt, apiKey);
        
        console.log(`✅ Connection test successful for ${provider}/${model}`);

        res.json({
            success: true,
            message: 'Connection test successful',
            response: response,
            provider: provider,
            model: model
        });

    } catch (error) {
        console.error('Connection test failed:', error);
        res.status(400).json({ 
            success: false,
            error: error.message || 'Connection test failed' 
        });
    }
});

// =============================================================================
// SETTINGS MANAGEMENT
// =============================================================================

// Get CoWriter settings
router.post('/cowriter/settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter settings not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Load settings from user's cowriter folder
        const settingsPath = getUserCoWriterFolder(userContext, 'settings.json');
        
        let settings = {
            style: 'collaborative',
            worldContextId: '',
            provider: 'google',
            model: 'gemini-1.5-flash',
            hasApiKey: false
        };

        if (await fs.pathExists(settingsPath)) {
            const savedSettings = await fs.readJson(settingsPath);
            settings = { ...settings, ...savedSettings };
        }

        // Check if API key exists (don't send the actual key)
        const hasApiKey = await checkApiKeyExists(userContext, settings.provider);
        settings.hasApiKey = hasApiKey;

        res.json({
            success: true,
            settings: settings
        });

    } catch (error) {
        console.error('Error loading CoWriter settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});

// Get API key status for a specific provider
router.post('/cowriter/api-key', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter API keys not available in hosted environment' });
    }

    try {
        const { userContext, provider } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!provider) {
            return res.status(400).json({ error: 'Provider is required' });
        }

        // Check if API key exists for this provider
        const hasApiKey = await checkApiKeyExists(userContext, provider);

        res.json({
            success: true,
            provider: provider,
            hasApiKey: hasApiKey
        });

    } catch (error) {
        console.error('Error checking API key:', error);
        res.status(500).json({ error: 'Failed to check API key' });
    }
});

// Save CoWriter settings
router.put('/cowriter/settings', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter settings not available in hosted environment' });
    }

    try {
        const { userContext, settings } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Ensure CoWriter folder exists
        const cowriterFolder = getUserCoWriterFolder(userContext);
        await fs.ensureDir(cowriterFolder);

        // Save settings (without API key - that's handled separately)
        const settingsToSave = { ...settings };
        delete settingsToSave.apiKey; // Don't save in plain text
        delete settingsToSave.hasApiKey; // This is computed

        const settingsPath = getUserCoWriterFolder(userContext, 'settings.json');
        await fs.writeJson(settingsPath, settingsToSave, { spaces: 2 });

        // Handle API key separately if provided
        if (settings.apiKey) {
            await saveApiKey(userContext, settings.provider, settings.apiKey);
        }

        console.log(`✅ Saved CoWriter settings for ${userContext.isGuest ? 'guest' : userContext.username}`);

        res.json({
            success: true,
            message: 'Settings saved successfully'
        });

    } catch (error) {
        console.error('Error saving CoWriter settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// =============================================================================
// API KEY MANAGEMENT
// =============================================================================

// Save encrypted API key
async function saveApiKey(userContext, provider, apiKey) {
    const providersFolder = getUserCoWriterFolder(userContext, 'providers');
    await fs.ensureDir(providersFolder);

    const encryptedKey = encryptApiKey(apiKey);
    const keyPath = path.join(providersFolder, `${provider}.key`);
    
    await fs.writeFile(keyPath, encryptedKey, 'utf8');
}

// Load and decrypt API key
async function loadApiKey(userContext, provider) {
    const keyPath = getUserCoWriterFolder(userContext, `providers/${provider}.key`);
    
    if (!await fs.pathExists(keyPath)) {
        return null;
    }

    const encryptedKey = await fs.readFile(keyPath, 'utf8');
    return decryptApiKey(encryptedKey);
}

// Check if API key exists
async function checkApiKeyExists(userContext, provider) {
    const keyPath = getUserCoWriterFolder(userContext, `providers/${provider}.key`);
    return await fs.pathExists(keyPath);
}

// =============================================================================
// WORLD CONTEXT MANAGEMENT
// =============================================================================

// Get saved world contexts
router.post('/cowriter/prompts', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter prompts not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const promptsFolder = getUserCoWriterFolder(userContext, 'prompts');
        const worldContexts = [];

        if (await fs.pathExists(promptsFolder)) {
            const files = await fs.readdir(promptsFolder);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(promptsFolder, file);
                        const contextData = await fs.readJson(filePath);
                        worldContexts.push(contextData);
                    } catch (error) {
                        console.warn(`Failed to load context file ${file}:`, error);
                    }
                }
            }
        }

        // Sort by last modified
        worldContexts.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

        res.json({
            success: true,
            worldContexts: worldContexts
        });

    } catch (error) {
        console.error('Error loading world contexts:', error);
        res.status(500).json({ error: 'Failed to load world contexts' });
    }
});

// Save world context
router.post('/cowriter/prompts/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter prompts not available in hosted environment' });
    }

    try {
        const { userContext, worldContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!worldContext || !worldContext.name || !worldContext.id) {
            return res.status(400).json({ error: 'Invalid world context data' });
        }

        const promptsFolder = getUserCoWriterFolder(userContext, 'prompts');
        await fs.ensureDir(promptsFolder);

        const fileName = `${worldContext.id}.json`;
        const filePath = path.join(promptsFolder, fileName);
        
        await fs.writeJson(filePath, worldContext, { spaces: 2 });

        console.log(`✅ Saved world context "${worldContext.name}" for ${userContext.isGuest ? 'guest' : userContext.username}`);

        res.json({
            success: true,
            message: 'World context saved successfully'
        });

    } catch (error) {
        console.error('Error saving world context:', error);
        res.status(500).json({ error: 'Failed to save world context' });
    }
});

// Delete world context
router.delete('/cowriter/prompts/:contextId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter prompts not available in hosted environment' });
    }

    try {
        const { contextId } = req.params;
        const { userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const promptsFolder = getUserCoWriterFolder(userContext, 'prompts');
        const filePath = path.join(promptsFolder, `${contextId}.json`);
        
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(`✅ Deleted world context ${contextId} for ${userContext.isGuest ? 'guest' : userContext.username}`);
        }

        res.json({
            success: true,
            message: 'World context deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting world context:', error);
        res.status(500).json({ error: 'Failed to delete world context' });
    }
});

// =============================================================================
// CHAT HISTORY MANAGEMENT
// =============================================================================

// Get saved chats
router.post('/cowriter/chats', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter chats not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const chatsFolder = getUserCoWriterFolder(userContext, 'chats');
        const savedChats = [];

        if (await fs.pathExists(chatsFolder)) {
            const files = await fs.readdir(chatsFolder);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(chatsFolder, file);
                        const chatData = await fs.readJson(filePath);
                        
                        // Don't include full message content in list (for performance)
                        savedChats.push({
                            id: chatData.id,
                            name: chatData.name,
                            folder: chatData.folder || 'Uncategorized', // ADD THIS
                            created: chatData.created,
                            lastModified: chatData.lastModified,
                            messageCount: chatData.messages?.length || 0
                        });
                    } catch (error) {
                        console.warn(`Failed to load chat file ${file}:`, error);
                    }
                }
            }
        }

        // Sort by last modified
        savedChats.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

        res.json({
            success: true,
            chats: savedChats
        });

    } catch (error) {
        console.error('Error loading saved chats:', error);
        res.status(500).json({ error: 'Failed to load saved chats' });
    }
});

// Save chat
// Save chat
router.post('/cowriter/chats/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter chats not available in hosted environment' });
    }

    try {
        const { userContext, chatData, isOverwrite } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (!chatData || !chatData.name || !chatData.id) {
            return res.status(400).json({ error: 'Invalid chat data' });
        }

        const chatsFolder = getUserCoWriterFolder(userContext, 'chats');
        await fs.ensureDir(chatsFolder);

        const fileName = `${chatData.id}.json`;
        const filePath = path.join(chatsFolder, fileName);
        
        // Check if file exists when trying to overwrite
        if (isOverwrite && !await fs.pathExists(filePath)) {
            return res.status(404).json({ error: 'Original chat not found for overwrite' });
        }
        
        // If it's a new save, check for duplicate names (optional)
        if (!isOverwrite) {
            // You could add duplicate name checking here if desired
        }
        
        await fs.writeJson(filePath, chatData, { spaces: 2 });

        console.log(`✅ ${isOverwrite ? 'Updated' : 'Saved'} chat "${chatData.name}" for ${userContext.isGuest ? 'guest' : userContext.username}`);

        res.json({
            success: true,
            message: `Chat ${isOverwrite ? 'updated' : 'saved'} successfully`,
            isOverwrite: isOverwrite
        });

    } catch (error) {
        console.error('Error saving chat:', error);
        res.status(500).json({ error: 'Failed to save chat' });
    }
});

// Load specific chat
router.get('/cowriter/chats/:chatId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter chats not available in hosted environment' });
    }

    try {
        const { chatId } = req.params;
        const { userContext } = req.query;
        
        if (!userContext) {
            return res.status(400).json({ error: 'User context required' });
        }

        const parsedUserContext = JSON.parse(userContext);
        const validation = validateUserContext(parsedUserContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const chatsFolder = getUserCoWriterFolder(parsedUserContext, 'chats');
        const filePath = path.join(chatsFolder, `${chatId}.json`);
        
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const chatData = await fs.readJson(filePath);

        res.json({
            success: true,
            chat: chatData
        });

    } catch (error) {
        console.error('Error loading chat:', error);
        res.status(500).json({ error: 'Failed to load chat' });
    }
});

// Delete chat
router.delete('/cowriter/chats/:chatId', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'CoWriter chats not available in hosted environment' });
    }

    try {
        const { chatId } = req.params;
        const { userContext } = req.body;
        
        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const chatsFolder = getUserCoWriterFolder(userContext, 'chats');
        const filePath = path.join(chatsFolder, `${chatId}.json`);
        
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(`✅ Deleted chat ${chatId} for ${userContext.isGuest ? 'guest' : userContext.username}`);
        }

        res.json({
            success: true,
            message: 'Chat deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ error: 'Failed to delete chat' });
    }
});

// =============================================================================
// PROMPT SYSTEM ENDPOINTS
// =============================================================================

// Get available quick prompts
router.get('/cowriter/quick-prompts', async (req, res) => {
    try {
        const prompts = await loadPrompts();
        
        res.json({
            success: true,
            quickPrompts: prompts.quickPrompts || {}
        });

    } catch (error) {
        console.error('Error loading quick prompts:', error);
        res.status(500).json({ error: 'Failed to load quick prompts' });
    }
});

// =============================================================================
// ACTIVE CHAT MANAGEMENT (for auto-save)
// =============================================================================

// Save active chat
router.post('/cowriter/active-chat/save', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Active chat not available in hosted environment' });
    }

    try {
        const { userContext, chatData } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const activeChatPath = getUserCoWriterFolder(userContext, 'active-chat.json');
        await fs.writeJson(activeChatPath, chatData, { spaces: 2 });

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving active chat:', error);
        res.status(500).json({ error: 'Failed to save active chat' });
    }
});

// Load active chat
router.get('/cowriter/active-chat', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Active chat not available in hosted environment' });
    }

    try {
        const { userContext } = req.query;
        
        if (!userContext) {
            return res.status(400).json({ error: 'User context required' });
        }

        const parsedUserContext = JSON.parse(userContext);
        const validation = validateUserContext(parsedUserContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const activeChatPath = getUserCoWriterFolder(parsedUserContext, 'active-chat.json');
        
        if (await fs.pathExists(activeChatPath)) {
            const chatData = await fs.readJson(activeChatPath);
            res.json({ success: true, chatData });
        } else {
            res.json({ success: true, chatData: null });
        }
    } catch (error) {
        console.error('Error loading active chat:', error);
        res.status(500).json({ error: 'Failed to load active chat' });
    }
});

// Clear active chat
router.post('/cowriter/active-chat/clear', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Active chat not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const activeChatPath = getUserCoWriterFolder(userContext, 'active-chat.json');
        
        if (await fs.pathExists(activeChatPath)) {
            await fs.remove(activeChatPath);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing active chat:', error);
        res.status(500).json({ error: 'Failed to clear active chat' });
    }
});

// =============================================================================
// DEBUG ENDPOINTS
// =============================================================================

// Debug endpoint for testing prompt assembly
router.post('/debug/cowriter/prompt', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Debug endpoints not available in hosted environment' });
    }

    try {
        const { message, chatHistory, settings } = req.body;
        
        const assembledPrompt = await assemblePrompt(message, chatHistory, settings);
        
        res.json({
            success: true,
            prompt: assembledPrompt,
            promptLength: assembledPrompt.length,
            components: {
                hasWorldContext: !!(settings.worldContext && settings.worldContext.trim()),
                hasChatHistory: !!(chatHistory && chatHistory.length > 0),
                style: settings.style
            }
        });

    } catch (error) {
        console.error('Debug prompt assembly error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint for checking folder structure
router.post('/debug/cowriter/folders', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Debug endpoints not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const cowriterFolder = getUserCoWriterFolder(userContext);
        const subfolders = ['chats', 'prompts', 'providers'];
        
        const debug = {
            baseFolder: cowriterFolder,
            exists: await fs.pathExists(cowriterFolder),
            subfolders: {}
        };

        for (const subfolder of subfolders) {
            const subfolderPath = getUserCoWriterFolder(userContext, subfolder);
            debug.subfolders[subfolder] = {
                path: subfolderPath,
                exists: await fs.pathExists(subfolderPath),
                files: await fs.pathExists(subfolderPath) ? await fs.readdir(subfolderPath) : []
            };
        }

        res.json({
            success: true,
            debug: debug
        });

    } catch (error) {
        console.error('Debug folder check error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Updated assemblePrompt function and helper for llm.js

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

// Updated assemblePrompt function
async function assemblePrompt(userMessage, chatHistory, settings, coWriterManager = null) {
    let prompts;
    
    // Check if we have an active main prompt passed in settings (from custom prompt)
    if (settings.activeMainPrompt) {
        prompts = {
            mainPrompt: settings.activeMainPrompt
        };
        console.log('ðŸ¤– Using custom main prompt from settings');
    } else if (coWriterManager && coWriterManager.promptManager) {
        // Fallback: Get main prompt from coWriterManager (shouldn't be used now)
        const mainPrompt = coWriterManager.promptManager.getActiveMainPrompt();
        const mainPromptContent = mainPrompt ? mainPrompt.content : (await loadPrompts()).mainPrompt;
        
        prompts = {
            mainPrompt: mainPromptContent
        };
        console.log('ðŸ¤– Using main prompt from coWriterManager');
    } else {
        // Final fallback: use default prompts
        prompts = await loadPrompts();
        console.log('ðŸ¤– Using default main prompt');
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
    
    // 6. Chat History (if provided) - truncated based on provider limits
    if (chatHistory && chatHistory.length > 0) {
        const truncatedHistory = await truncateChatHistory(chatHistory, settings.provider);
        if (truncatedHistory.length > 0) {
            fullPrompt += '<chat history>Previous conversation:\n';
            truncatedHistory.forEach(msg => {
                const role = msg.type === 'user' ? 'User' : 'Assistant';
                fullPrompt += `${role}: ${msg.content}\n`;
            });
            fullPrompt += '</chat history>\n\n';
        }
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
    } else {
        console.log(`  [TON] Tone: None`);
    }

    if (settings.style) {
        const styleType = settings.style.startsWith('default_') ? 'Default' : 'Custom';
        const styleName = settings.style.startsWith('default_') ? settings.style.replace('default_', '') : 'Custom';
        console.log(`  [STY] Style: ${styleType} - ${styleName}`);
    } else {
        console.log(`  [STY] Style: None`);
    }

    if (settings.templateId) {
        const templateType = settings.templateId.startsWith('default_') ? 'Default' : 'Custom';
        console.log(`  [TPL] Template: ${templateType}`);
    } else {
        console.log(`  [TPL] Template: None`);
    }

    if (settings.worldContext && settings.worldContext.trim()) {
        const contextLength = settings.worldContext.length;
        const truncatedContext = contextLength > 60
            ? settings.worldContext.substring(0, 57) + '...'
            : settings.worldContext;
        console.log(`  [WLD] World Context: Present (${contextLength} chars) - "${truncatedContext}"`);
    } else {
        console.log(`  [WLD] World Context: None`);
    }

    if (chatHistory && chatHistory.length > 0) {
        const lastUser = [...chatHistory].reverse().find(m => m.type === 'user');
        const lastAI = [...chatHistory].reverse().find(m => m.type === 'ai');
        
        let historyPreview = '';
        if (lastUser && lastAI) {
            const truncatedUser = lastUser.content.length > 30 ? lastUser.content.substring(0, 27) + '...' : lastUser.content;
            const truncatedAI = lastAI.content.length > 30 ? lastAI.content.substring(0, 27) + '...' : lastAI.content;
            historyPreview = ` (User: "${truncatedUser}" | AI: "${truncatedAI}")`;
        }
        console.log(`  [CHT] Chat History: ${chatHistory.length} messages${historyPreview}`);
    } else {
        console.log(`  [CHT] Chat History: None`);
    }

    const truncatedMessage = userMessage.length > 60
        ? userMessage.substring(0, 57) + '...'
        : userMessage;
    console.log(`  [MSG] User Message: "${truncatedMessage}"`);
    console.log(`  [LEN] Total: ${fullPrompt.length} characters`);

    return fullPrompt;
}

module.exports = router;
module.exports.loadApiKey = loadApiKey;
module.exports.sendToLLM = sendToLLM;