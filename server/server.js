const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');

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
    roleplayImageUpload,
    
    // Initialization
    initializeUserSystem
} = require('./core');

// Import routers
const authRouter = require('./auth');
const projectsRouter = require('./projects');
const llmRouter = require('./llm'); // NEW: LLM router
const exportRouter = require('./export');
const notebookRouter = require('./notebook');
const notebookWorkspacesRouter = require('./notebook-workspaces');
const promptsRouter = require('./prompts');
const extractorRouter = require('./extractor');
const characterManagerRouter = require('./character-manager');
const entryHelperRoutes = require('./entry-helper');

const packageJson = require('./package.json');

const app = express();
const PORT = process.env.PORT || 9000;

// Generate a unique server session ID when server starts
const SERVER_SESSION_ID = 'server_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
console.log(`🆔 Server session ID: ${SERVER_SESSION_ID}`);

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =============================================================================
// ROUTERS
// =============================================================================

// Mount auth router at /api
app.use('/api', authRouter);

// Mount projects router at /api
app.use('/api', projectsRouter);

// Mount LLM router at /api (NEW)
app.use('/api', llmRouter);

// Mount export router at /api (NEW - ADD THIS LINE)
app.use('/api', exportRouter);

// Mount notebook router at /api (NEW - ADD THIS LINE)
app.use('/api', notebookRouter);

// Mount notebook workspaces router at /api (ADD THIS LINE)
app.use('/api', notebookWorkspacesRouter);

app.use('/api', promptsRouter);

app.use('/api', extractorRouter);

app.use('/api', characterManagerRouter);

app.use('/api', entryHelperRoutes);

// Serve project files (local only) - user-aware static serving
app.get('/projects/:userContext/:projectName/*', (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'File access not available in hosted environment' });
    }

    try {
        const userContextParam = req.params.userContext;
        const projectName = req.params.projectName;
        const filePath = req.params[0];
        
        let projectFolder;
        if (userContextParam === 'guest') {
            projectFolder = path.join(getUserSitesFolder({ isGuest: true }), projectName);
        } else {
            projectFolder = path.join(getUserSitesFolder({ userId: userContextParam, isGuest: false }), projectName);
        }
        
        const fullPath = path.join(projectFolder, filePath);
        
        // Security check - ensure file is in users folder
        if (!fullPath.startsWith(USERS_FOLDER)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!fs.pathExistsSync(fullPath)) {
            return res.status(404).send('File not found');
        }

        res.sendFile(fullPath);
    } catch (error) {
        console.error('Error serving project file:', error);
        res.status(500).send('Error serving file');
    }
});

// =============================================================================
// STATIC FILE SERVING
// =============================================================================

app.use('/info-converter', express.static(path.join(__dirname, '..', 'info-converter')));
app.use('/roleplay-converter', express.static(path.join(__dirname, '..', 'roleplay-converter')));
app.use('/cowriter', express.static(path.join(__dirname, '..', 'cowriter'))); // NEW: CoWriter static files
app.use('/extractor', express.static(path.join(__dirname, '..', 'minitools', 'extractor')));
app.use('/character-manager', express.static(path.join(__dirname, '..', 'minitools', 'character-manager'))); 
app.use('/', express.static(path.join(__dirname, '..', 'main')));

// =============================================================================
// BASIC ROUTE HANDLERS
// =============================================================================

app.get('/info-converter', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'info-converter', 'index.html'));
});

app.get('/roleplay-converter', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'roleplay-converter', 'index.html'));
});

app.get('/extractor', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'minitools', 'extractor', 'index.html'));
});

app.get('/character-manager', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'minitools', 'character-manager', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'main', 'index.html'));
});

// Get environment info and server session
app.get('/api/env', (req, res) => {
    res.json({
        isLocal: IS_LOCAL,
        hasFileAccess: IS_LOCAL,
        usersFolder: IS_LOCAL ? USERS_FOLDER : null,
        supportsUserContexts: true,
        hasFileBasedAuth: IS_LOCAL,
        hasCoWriter: IS_LOCAL, // NEW: Indicate CoWriter availability
        serverSessionId: SERVER_SESSION_ID
    });
});

// Add this route with your other API routes (around line 140)
app.get('/api/version', (req, res) => {
    res.json({
        version: packageJson.version,
        name: packageJson.name
    });
});

// =============================================================================
// ERROR HANDLING & 404
// =============================================================================

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// =============================================================================
// COWRITER INITIALIZATION
// =============================================================================

// Initialize CoWriter configuration files
// Initialize CoWriter configuration files
async function initializeCoWriter() {
    if (!IS_LOCAL) return;
    
    try {
        // Don't create directories - just log that CoWriter is available
        console.log('✅ CoWriter server components ready (no artifacts system yet)');
        
    } catch (error) {
        console.error('Error initializing CoWriter:', error);
    }
}

// =============================================================================
// SERVER STARTUP
// =============================================================================

// Initialize file-based user system
if (IS_LOCAL) {
    initializeUserSystem();
    initializeCoWriter(); // NEW: Initialize CoWriter
}

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 Creator\'s Toolkit Server Started!');
    console.log(`📦 Version: ${packageJson.version}`);
    console.log(`🔗 Main App: http://localhost:${PORT}`);
    console.log(`📖 Lore Codex: http://localhost:${PORT}/info-converter`);
    console.log(`🎭 RP Archiver: http://localhost:${PORT}/roleplay-converter`);
    console.log(`🤖 CoWriter: Integrated in Main App`); // NEW
     console.log(`🎭 Character Manager: http://localhost:${PORT}/character-manager`);
    console.log(`🌐 Environment: ${IS_LOCAL ? 'Local Development' : 'Production'}`);
    if (IS_LOCAL) {
        console.log(`👥 User data: File-based system`);
        console.log(`📁 Users folder: ${USERS_FOLDER}`);
        console.log(`📋 Accounts file: ${ACCOUNTS_FILE}`);
        console.log(`🤖 CoWriter: LLM integration enabled`); // NEW
    }
    console.log('\n📋 File Organization Complete:');
    console.log('  - ✅ core.js: Constants, utilities, middleware');
    console.log('  - ✅ auth.js: User auth, profiles, avatars, settings, migration');
    console.log('  - ✅ projects.js: Lore Codex + RP Archiver + assets + legacy');
    console.log('  - ✅ export.js: Project export and ZIP download');
    console.log('  - ✅ llm.js: CoWriter LLM integration + prompt handling');
    console.log('  - ✅ notebook.js: Notebook notes and snippets management'); // ADD THIS LINE
    console.log('  - ✅ server.js: Main server, routing, static files');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Creator\'s Toolkit server...');
    process.exit(0);
});

module.exports = app;