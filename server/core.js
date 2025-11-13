// Core utilities, constants, middleware, and helper functions
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

// CONSTANTS
const IS_LOCAL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const USERS_FOLDER = path.join(__dirname, '..', 'users');
const ACCOUNTS_FILE = path.join(USERS_FOLDER, 'accounts.json');
const GUEST_FOLDER = path.join(USERS_FOLDER, 'guest');
const LEGACY_SITES_FOLDER = path.join(__dirname, 'sites'); // Keep for backward compatibility
const DEFAULT_AVATAR = 'images/default-avatar.png';

// USER CONTEXT VALIDATION
function validateUserContext(userContext) {
    if (!userContext) {
        return { valid: false, error: 'No user context provided' };
    }
    
    if (userContext.isGuest) {
        return { valid: true };
    }
    
    if (!userContext.userId || !userContext.username) {
        return { valid: false, error: 'Invalid user context' };
    }
    
    return { valid: true };
}

// FILE SYSTEM UTILITIES
function getUserSettingsFolder(userContext) {
    if (userContext.isGuest) {
        return path.join(GUEST_FOLDER, 'settings');
    } else {
        return path.join(USERS_FOLDER, userContext.userId, 'settings');
    }
}

function getUserSitesFolder(userContext) {
    if (userContext.isGuest) {
        return path.join(GUEST_FOLDER, 'sites');
    } else {
        const userFolder = path.join(USERS_FOLDER, userContext.userId, 'sites');
        fs.ensureDirSync(userFolder);
        return userFolder;
    }
}

function getUserRoleplaysFolder(userContext) {
    if (userContext.isGuest) {
        const guestRoleplaysFolder = path.join(GUEST_FOLDER, 'roleplays');
        fs.ensureDirSync(guestRoleplaysFolder);
        return guestRoleplaysFolder;
    } else {
        const userFolder = path.join(USERS_FOLDER, userContext.userId, 'roleplays');
        fs.ensureDirSync(userFolder);
        return userFolder;
    }
}

// USER ACCOUNT MANAGEMENT
async function loadAccounts() {
    try {
        if (await fs.pathExists(ACCOUNTS_FILE)) {
            return await fs.readJson(ACCOUNTS_FILE);
        }
        return {};
    } catch (error) {
        console.error('Error loading accounts:', error);
        return {};
    }
}

async function saveAccounts(accounts) {
    try {
        await fs.writeJson(ACCOUNTS_FILE, accounts, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving accounts:', error);
        return false;
    }
}

// USER SETTINGS MANAGEMENT
async function loadUserSettings(userContext, settingType) {
    try {
        let settingsFolder;
        if (userContext.isGuest) {
            settingsFolder = path.join(GUEST_FOLDER, 'settings');
        } else {
            settingsFolder = path.join(USERS_FOLDER, userContext.userId, 'settings');
        }
        
        const settingsFile = path.join(settingsFolder, `${settingType}.json`);
        
        if (await fs.pathExists(settingsFile)) {
            const data = await fs.readJson(settingsFile);
            
            // RECOVERY LOGIC for preferences
            if (settingType === 'preferences') {
                const needsRecovery = (!data.favorites || data.favorites.length === 0) && (!data.tags || Object.keys(data.tags).length === 0);
                
                if (needsRecovery) {
                    console.log(`🚨 Missing favorites/tags for ${userContext.isGuest ? 'guest' : userContext.username}, checking backup...`);
                    
                    const backupFile = path.join(settingsFolder, 'preferences.backup.json');
                    if (await fs.pathExists(backupFile)) {
                        const backup = await fs.readJson(backupFile);
                        const hasBackupData = (backup.favorites && backup.favorites.length > 0) || (backup.tags && Object.keys(backup.tags).length > 0);
                        
                        if (hasBackupData) {
                            console.log(`🛠️ RESTORING from backup: favorites: ${backup.favorites.length}, tags: ${Object.keys(backup.tags).length}`);
                            data.favorites = backup.favorites || [];
                            data.tags = backup.tags || {};
                            
                            // Save the recovered data back to main file
                            await fs.writeJson(settingsFile, data, { spaces: 2 });
                            console.log(`✅ Recovery complete for ${userContext.isGuest ? 'guest' : userContext.username}`);
                        }
                    }
                }
            }
            
            return data;
        }
        
        // Return defaults based on setting type
        return getDefaultSettings(settingType);
    } catch (error) {
        console.error(`Error loading ${settingType} settings:`, error);
        return getDefaultSettings(settingType);
    }
}

async function saveUserSettings(userContext, settingType, data) {
    try {
        let settingsFolder;
        if (userContext.isGuest) {
            settingsFolder = path.join(GUEST_FOLDER, 'settings');
        } else {
            settingsFolder = path.join(USERS_FOLDER, userContext.userId, 'settings');
        }
        
        // Ensure settings folder exists
        await fs.ensureDir(settingsFolder);
        
        const settingsFile = path.join(settingsFolder, `${settingType}.json`);
        await fs.writeJson(settingsFile, data, { spaces: 2 });
        
        // CREATE BACKUP for preferences that contain favorites/tags
        if (settingType === 'preferences' && (data.favorites || data.tags)) {
            const backupFile = path.join(settingsFolder, 'preferences.backup.json');
            const backupData = {
                favorites: data.favorites || [],
                tags: data.tags || {},
                timestamp: Date.now(),
                backupReason: 'auto_save'
            };
            await fs.writeJson(backupFile, backupData, { spaces: 2 });
            console.log(`💾 Created backup for ${userContext.isGuest ? 'guest' : userContext.username} - favorites: ${(data.favorites || []).length}, tags: ${Object.keys(data.tags || {}).length}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Error saving ${settingType} settings:`, error);
        return false;
    }
}

function getDefaultSettings(settingType) {
    const defaults = {
        preferences: {
            theme: 'dark',
            autoSave: true,
            defaultTemplate: 'generated.css',
            notifications: true,
            aiToolsEnabled: false 
        },
        usage: {
            toolsUsed: {},
            lastUsed: Date.now(),
            projectsCreated: 0
        }
    };
    return defaults[settingType] || {};
}

// UTILITY FUNCTIONS
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// HTML PARSING UTILITIES
async function extractBannerInfo(htmlContent, projectPath) {
    let bannerPath = null;
    let bannerExists = false;
    
    try {
        // First, try to extract from embedded fullInfoData
        const fullInfoDataMatch = htmlContent.match(/var fullInfoData = ({.*?});/s);
        if (fullInfoDataMatch) {
            try {
                const fullInfoData = JSON.parse(fullInfoDataMatch[1]);
                if (fullInfoData.basic && fullInfoData.basic.banner) {
                    bannerPath = fullInfoData.basic.banner;
                }
            } catch (e) {
                console.warn('Could not parse fullInfoData:', e.message);
            }
        }
        
        // If not found in embedded data, try to extract from banner image HTML
        if (!bannerPath) {
            const bannerImgMatch = htmlContent.match(/<img[^>]+class="banner-image"[^>]+src="([^"]+)"/i);
            if (bannerImgMatch) {
                bannerPath = bannerImgMatch[1];
            }
        }
        
        // If still not found, try alternative banner extraction methods
        if (!bannerPath) {
            const headerBannerMatch = htmlContent.match(/<img[^>]+alt="Banner"[^>]+src="([^"]+)"/i);
            if (headerBannerMatch) {
                bannerPath = headerBannerMatch[1];
            }
        }
        
        // Check if banner file actually exists
        if (bannerPath) {
            const fullBannerPath = path.join(projectPath, bannerPath);
            bannerExists = await fs.pathExists(fullBannerPath);
            
            // If the file doesn't exist, clear the banner path
            if (!bannerExists) {
                bannerPath = null;
            }
        }
        
    } catch (error) {
        console.warn('Error extracting banner info:', error.message);
    }
    
    return {
        bannerPath: bannerPath,
        bannerExists: bannerExists
    };
}

// MULTER CONFIGURATIONS
const avatarStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            console.log('📁 Setting up avatar destination...');
            console.log('Request query keys:', Object.keys(req.query));
            console.log('UserContext from query:', req.query.userContext);

            const userContextStr = req.query.userContext;
            if (!userContextStr) {
                console.error('❌ No userContext in query parameters');
                return cb(new Error('No user context provided'));
            }

            let userContext;
            try {
                userContext = JSON.parse(decodeURIComponent(userContextStr));
                console.log('📋 Parsed userContext:', userContext);
            } catch (parseError) {
                console.error('❌ Failed to parse userContext:', parseError);
                return cb(new Error('Invalid user context format'));
            }
            
            let settingsFolder;
            if (userContext.isGuest) {
                settingsFolder = path.join(GUEST_FOLDER, 'settings');
                console.log('👤 Guest user - settings folder:', settingsFolder);
            } else {
                if (!userContext.userId) {
                    console.error('❌ No userId in userContext for logged-in user');
                    return cb(new Error('Missing user ID'));
                }
                settingsFolder = path.join(USERS_FOLDER, userContext.userId, 'settings');
                console.log('🔐 Logged-in user - settings folder:', settingsFolder);
            }
            
            // Ensure settings folder exists with better error handling
            try {
                await fs.ensureDir(settingsFolder);
                console.log('✅ Settings folder created/verified:', settingsFolder);
                
                // Test write permissions
                const testFile = path.join(settingsFolder, '.test');
                await fs.writeFile(testFile, 'test');
                await fs.remove(testFile);
                console.log('✅ Write permissions verified');
                
                cb(null, settingsFolder);
            } catch (dirError) {
                console.error('❌ Failed to create/access settings folder:', dirError);
                return cb(new Error(`Cannot access settings folder: ${dirError.message}`));
            }
        } catch (error) {
            console.error('❌ Avatar destination setup error:', error);
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        try {
            console.log('📝 Setting avatar filename...');
            console.log('Original filename:', file.originalname);
            
            // Always use 'avatar' as filename, with original extension
            const ext = path.extname(file.originalname);
            const filename = `avatar${ext}`;
            
            console.log('📝 Generated filename:', filename);
            cb(null, filename);
        } catch (error) {
            console.error('❌ Filename generation error:', error);
            cb(error);
        }
    }
});

const avatarUpload = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('🔍 Checking file type:', file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            console.log('✅ File type accepted');
            cb(null, true);
        } else {
            console.log('❌ File type rejected');
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Multer configuration for roleplay images
// Replace the roleplayImageStorage in your core.js with this version
const roleplayImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // This will be set dynamically in the route handler
        cb(null, req.imagesFolder);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        
        if (file.fieldname === 'backgroundImage') {
            // Use temporary name for background - will be renamed later
            cb(null, `temp-background-${Date.now()}${ext}`);
        } else if (file.fieldname.startsWith('storyImage_')) {
            // Use temporary name for story images - will be renamed later to avoid conflicts
            const tempIndex = file.fieldname.split('_')[1];
            cb(null, `temp-story-${tempIndex}-${Date.now()}${ext}`);
        } else {
            cb(new Error('Unknown file field'));
        }
    }
});

const roleplayImageUpload = multer({
    storage: roleplayImageStorage,
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

// INITIALIZATION FUNCTION
async function initializeUserSystem() {
    try {
        // Ensure users folder structure exists
        fs.ensureDirSync(USERS_FOLDER);
        fs.ensureDirSync(path.join(GUEST_FOLDER, 'sites'));
        fs.ensureDirSync(path.join(GUEST_FOLDER, 'roleplays'));
        fs.ensureDirSync(path.join(GUEST_FOLDER, 'settings'));
        
        // Initialize accounts.json if it doesn't exist
        if (!await fs.pathExists(ACCOUNTS_FILE)) {
            await fs.writeJson(ACCOUNTS_FILE, {});
            console.log('✅ Created accounts.json');
        }
        
        console.log('✅ File-based user system initialized');
        console.log(`📁 Users folder: ${USERS_FOLDER}`);
        console.log(`👥 Accounts file: ${ACCOUNTS_FILE}`);
        
    } catch (error) {
        console.error('Error initializing user system:', error);
    }
}

// EXPORTS
module.exports = {
    // Constants
    IS_LOCAL,
    USERS_FOLDER,
    ACCOUNTS_FILE,
    GUEST_FOLDER,
    LEGACY_SITES_FOLDER,
    DEFAULT_AVATAR,
    
    // Validation
    validateUserContext,
    
    // File system utilities
    getUserSettingsFolder,
    getUserSitesFolder,
    getUserRoleplaysFolder,
    
    // Account management
    loadAccounts,
    saveAccounts,
    
    // Settings management
    loadUserSettings,
    saveUserSettings,
    getDefaultSettings,
    
    // Utilities
    generateUserId,
    extractBannerInfo,
    
    // Multer configurations
    avatarUpload,
    roleplayImageUpload,
    
    // Initialization
    initializeUserSystem
};