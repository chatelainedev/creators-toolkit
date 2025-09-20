const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');

// Import everything from core.js
const {
    // Constants
    IS_LOCAL,
    USERS_FOLDER,
    ACCOUNTS_FILE,
    GUEST_FOLDER,
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
    
    // Multer configurations
    avatarUpload
} = require('./core');

const router = express.Router();

// =============================================================================
// USER REGISTRATION & LOGIN
// =============================================================================

// Register new user account
router.post('/auth/register', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User registration not available in hosted environment' });
    }

    try {
        const { username, email, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Load existing accounts
        const accounts = await loadAccounts();
        
        // Check if username already exists
        const existingByUsername = Object.values(accounts).find(user => 
            user.username === username
        );

        if (existingByUsername) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Check if email already exists (only if email was provided)
        if (email && email.trim()) {
            const existingByEmail = Object.values(accounts).find(user => 
                user.email === email
            );
            
            if (existingByEmail) {
                return res.status(400).json({ error: 'Email already registered' });
            }
        }

        // Create new user
        const userId = generateUserId();
        const passwordHash = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: userId,
            username: username,
            email: email || null,
            passwordHash: passwordHash,
            isPremium: false, // Add this line
            createdAt: Date.now(),
            lastLogin: Date.now()
        };

        // Save to accounts
        accounts[userId] = newUser;
        const saved = await saveAccounts(accounts);
        
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save account' });
        }

        // Create user folder structure
        const userFolder = path.join(USERS_FOLDER, userId);
        await fs.ensureDir(path.join(userFolder, 'sites'));
        await fs.ensureDir(path.join(userFolder, 'roleplays'));
        await fs.ensureDir(path.join(userFolder, 'settings'));

        // Initialize user settings
        await saveUserSettings({ userId, isGuest: false }, 'preferences', getDefaultSettings('preferences'));
        await saveUserSettings({ userId, isGuest: false }, 'usage', getDefaultSettings('usage'));

        // Add premium status to user preferences
        const defaultPreferences = getDefaultSettings('preferences');
        defaultPreferences.isPremium = false; // Default to basic user
        await saveUserSettings({ userId, isGuest: false }, 'preferences', defaultPreferences);

        console.log(`✅ Registered new user: ${username} (${userId})`);

        // Return user data (without password hash)
        res.json({
            success: true,
            user: {
                id: userId,
                username: username,
                email: email,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/auth/login', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User login not available in hosted environment' });
    }

    try {
        const { usernameOrEmail, password } = req.body;
        
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Username/email and password are required' });
        }

        // Load accounts
        const accounts = await loadAccounts();
        
        // Find user by username or email
        const user = Object.values(accounts).find(u => 
            u.username === usernameOrEmail || u.email === usernameOrEmail
        );

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Verify password
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Update last login
        user.lastLogin = Date.now();
        accounts[user.id] = user;
        await saveAccounts(accounts);

        console.log(`✅ User logged in: ${user.username} (${user.id})`);

        // Return user data (without password hash)
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// =============================================================================
// USER PROFILE MANAGEMENT
// =============================================================================

// Get user profile
router.post('/user/profile', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User profiles not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (userContext.isGuest) {
            return res.json({
                username: 'Guest',
                isGuest: true,
                avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(userContext))}`
            });
        }

        // Load user account
        const accounts = await loadAccounts();
        const user = accounts[userContext.userId];
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Load user settings
        const preferences = await loadUserSettings(userContext, 'preferences');
        const usage = await loadUserSettings(userContext, 'usage');

        // Ensure premium status is synced between accounts file and user settings
        if (user.isPremium !== preferences.isPremium) {
            // Sync the status (accounts file takes precedence)
            preferences.isPremium = user.isPremium;
            await saveUserSettings(userContext, 'preferences', preferences);
        }

        // Update the response to include premium status from preferences
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            isGuest: false,
            isPremium: preferences.isPremium, // Use from preferences instead of accounts
            avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(userContext))}`,
            preferences: preferences,
            usage: usage
        });

    } catch (error) {
        console.error('Error loading user profile:', error);
        res.status(500).json({ error: 'Failed to load profile' });
    }
});

// Update user profile
router.put('/user/profile', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User profile updates not available in hosted environment' });
    }

    try {
        const { userContext, updates } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (userContext.isGuest) {
            return res.status(400).json({ error: 'Cannot update guest profile' });
        }

        // Load accounts
        const accounts = await loadAccounts();
        const user = accounts[userContext.userId];
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate current password first if provided
        if (updates.currentPassword) {
            const passwordValid = await bcrypt.compare(updates.currentPassword, user.passwordHash);
            if (!passwordValid) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
        }

        // Validate updates
        if (updates.username && updates.username !== user.username) {
            // Check if new username is taken
            const existingUser = Object.values(accounts).find(u => 
                u.username === updates.username && u.id !== user.id
            );
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            user.username = updates.username;
        }

        if (updates.email && updates.email !== user.email) {
            // Check if new email is taken
            const existingUser = Object.values(accounts).find(u => 
                u.email === updates.email && u.id !== user.id
            );
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            user.email = updates.email;
        }

        if (updates.password) {
            user.passwordHash = await bcrypt.hash(updates.password, 10);
        }

        // Save updated account
        accounts[user.id] = user;
        const saved = await saveAccounts(accounts);
        
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save profile updates' });
        }

        console.log(`✅ Updated profile for: ${user.username} (${user.id})`);

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// =============================================================================
// AVATAR MANAGEMENT
// =============================================================================

// Upload user avatar
router.post('/user/avatar', (req, res) => {
    console.log('📄 Avatar upload request received');
    console.log('📋 Query parameters:', req.query);
    
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Avatar uploads not available in hosted environment' });
    }

    // Use multer middleware with error handling
    avatarUpload.single('avatar')(req, res, async (err) => {
        if (err) {
            console.error('❌ Multer error:', err);
            
            // Handle specific multer errors
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File too large (max 2MB)' });
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ error: 'Unexpected file field' });
                }
                return res.status(400).json({ error: `Upload error: ${err.message}` });
            }
            
            // Handle custom errors from our storage configuration
            return res.status(500).json({ error: err.message || 'Upload failed' });
        }

        try {
            if (!req.file) {
                console.error('❌ No file in request');
                return res.status(400).json({ error: 'No avatar file provided' });
            }

            console.log('📁 File received:', {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype
            });

            // Get userContext from query parameters (already validated by multer)
            const userContextStr = req.query.userContext;
            if (!userContextStr) {
                console.error('❌ No userContext in query parameters');
                return res.status(400).json({ error: 'No user context provided' });
            }

            let userContext;
            try {
                userContext = JSON.parse(decodeURIComponent(userContextStr));
            } catch (parseError) {
                console.error('❌ Failed to parse userContext:', parseError);
                return res.status(400).json({ error: 'Invalid user context' });
            }

            const validation = validateUserContext(userContext);
            if (!validation.valid) {
                console.error('❌ Invalid user context:', validation.error);
                return res.status(400).json({ error: validation.error });
            }

            const avatarPath = req.file.path;
            const relativePath = path.relative(USERS_FOLDER, avatarPath);
            
            console.log(`✅ Avatar uploaded for ${userContext.isGuest ? 'guest' : userContext.username}: ${relativePath}`);

            res.json({
                success: true,
                message: 'Avatar uploaded successfully',
                avatarUrl: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(userContext))}&t=${Date.now()}`
            });

        } catch (error) {
            console.error('❌ Error processing avatar upload:', error);
            res.status(500).json({ error: 'Failed to process avatar upload' });
        }
    });
});

// Serve user avatar
router.get('/user/avatar', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Avatar serving not available in hosted environment' });
    }

    try {
        const userContextParam = req.query.userContext;
        let userContext;
        
        if (userContextParam) {
            userContext = JSON.parse(userContextParam);
        } else {
            // Fallback - serve default avatar
            const defaultPath = path.join(__dirname, '..', 'main', DEFAULT_AVATAR);
            return res.sendFile(defaultPath);
        }

        const validation = validateUserContext(userContext);
        if (!validation.valid) {
            const defaultPath = path.join(__dirname, '..', 'main', DEFAULT_AVATAR);
            return res.sendFile(defaultPath);
        }

        // Look for custom avatar in user's settings folder
        const settingsFolder = getUserSettingsFolder(userContext);
        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif'];
        
        for (const ext of possibleExtensions) {
            const avatarPath = path.join(settingsFolder, `avatar${ext}`);
            if (await fs.pathExists(avatarPath)) {
                return res.sendFile(avatarPath);
            }
        }

        // No custom avatar found, serve default
        const defaultPath = path.join(__dirname, '..', 'main', DEFAULT_AVATAR);
        res.sendFile(defaultPath);

    } catch (error) {
        console.error('Error serving avatar:', error);
        // Serve default on any error
        const defaultPath = path.join(__dirname, '..', 'main', DEFAULT_AVATAR);
        res.sendFile(defaultPath);
    }
});

// =============================================================================
// USER PREFERENCES & SETTINGS
// =============================================================================

// Save user preferences
router.post('/user/preferences', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User preferences not available in hosted environment' });
    }

    try {
        const { userContext, preferences } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const saved = await saveUserSettings(userContext, 'preferences', preferences);
        
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save preferences' });
        }

        res.json({ success: true, preferences });

    } catch (error) {
        console.error('Error saving preferences:', error);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
});

// Get user preferences
router.post('/user/preferences/get', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User preferences not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const preferences = await loadUserSettings(userContext, 'preferences');
        res.json({ preferences });

    } catch (error) {
        console.error('Error loading preferences:', error);
        res.status(500).json({ error: 'Failed to load preferences' });
    }
});

// Add this route after your existing routes in server-side auth.js
router.post('/auth/update-user', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'User updates not available in hosted environment' });
    }

    try {
        const { userContext, updates } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (userContext.isGuest) {
            return res.status(400).json({ error: 'Cannot update guest account' });
        }

        // Load accounts
        const accounts = await loadAccounts();
        const user = accounts[userContext.userId];
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update premium status (for now, just this field)
        if (updates.isPremium !== undefined) {
            user.isPremium = updates.isPremium;
            // Also save to user settings for persistence
            if (updates.isPremium !== undefined) {
                const userContext = { userId: user.id, username: user.username, isGuest: false };
                const preferences = await loadUserSettings(userContext, 'preferences');
                preferences.isPremium = updates.isPremium;
                await saveUserSettings(userContext, 'preferences', preferences);
            }
        }

        // Save updated account
        accounts[user.id] = user;
        const saved = await saveAccounts(accounts);
        
        if (!saved) {
            return res.status(500).json({ error: 'Failed to save user updates' });
        }

        console.log(`✅ Updated user: ${user.username} (isPremium: ${user.isPremium})`);

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isPremium: user.isPremium
            }
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// =============================================================================
// MIGRATION & LEGACY SUPPORT
// =============================================================================

// Migration endpoint - Move localStorage data to files
router.post('/migrate/localStorage', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Migration not available in hosted environment' });
    }

    try {
        const { users, session, preferences, usage } = req.body;
        let migratedCount = 0;

        // Migrate user accounts
        if (users) {
            const accounts = await loadAccounts();
            
            for (const [userId, userData] of Object.entries(users)) {
                if (!accounts[userId]) {
                    // Hash the password if it's plain text
                    let passwordHash = userData.password;
                    if (!userData.password.startsWith('$2b$')) {
                        passwordHash = await bcrypt.hash(userData.password, 10);
                    }

                    accounts[userId] = {
                        id: userId,
                        username: userData.username,
                        email: userData.email,
                        passwordHash: passwordHash,
                        createdAt: userData.createdAt || Date.now(),
                        lastLogin: Date.now()
                    };

                    // Create user folder structure
                    const userFolder = path.join(USERS_FOLDER, userId);
                    await fs.ensureDir(path.join(userFolder, 'sites'));
                    await fs.ensureDir(path.join(userFolder, 'roleplays'));
                    await fs.ensureDir(path.join(userFolder, 'settings'));

                    // Migrate avatar if it's a data URL
                    if (userData.avatar && userData.avatar.startsWith('data:')) {
                        try {
                            const base64Data = userData.avatar.split(',')[1];
                            const buffer = Buffer.from(base64Data, 'base64');
                            const avatarPath = path.join(userFolder, 'settings', 'avatar.png');
                            await fs.writeFile(avatarPath, buffer);
                        } catch (avatarError) {
                            console.warn(`Failed to migrate avatar for ${userData.username}:`, avatarError.message);
                        }
                    }

                    migratedCount++;
                }
            }

            await saveAccounts(accounts);
        }

        console.log(`✅ Migrated ${migratedCount} users from localStorage to files`);

        res.json({
            success: true,
            message: `Successfully migrated ${migratedCount} users`,
            migratedCount
        });

    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ error: 'Migration failed' });
    }
});

// =============================================================================
// DEBUG ENDPOINTS (for troubleshooting)
// =============================================================================

// Debug endpoint to test avatar folder creation
router.post('/debug/avatar-folder', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Debug endpoints not available in hosted environment' });
    }

    try {
        const { userContext } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const settingsFolder = getUserSettingsFolder(userContext);
        
        console.log('🛠 Debug info:');
        console.log('  - User context:', userContext);
        console.log('  - Settings folder:', settingsFolder);
        console.log('  - USERS_FOLDER:', USERS_FOLDER);
        
        // Check if folder exists
        const exists = await fs.pathExists(settingsFolder);
        console.log('  - Folder exists:', exists);
        
        if (!exists) {
            // Try to create it
            await fs.ensureDir(settingsFolder);
            console.log('  - Created folder successfully');
        }
        
        // Check permissions by creating a test file
        const testFile = path.join(settingsFolder, 'test.txt');
        await fs.writeFile(testFile, 'test');
        await fs.remove(testFile);
        console.log('  - Write permissions: OK');
        
        res.json({
            success: true,
            settingsFolder: settingsFolder,
            exists: await fs.pathExists(settingsFolder),
            writable: true
        });
        
    } catch (error) {
        console.error('❌ Debug error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete user account and all associated data
router.delete('/auth/delete-account', async (req, res) => {
    if (!IS_LOCAL) {
        return res.status(403).json({ error: 'Account deletion not available in hosted environment' });
    }

    try {
        const { userContext, password } = req.body;
        const validation = validateUserContext(userContext);
        
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        if (userContext.isGuest) {
            return res.status(400).json({ error: 'Cannot delete guest account' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Load accounts to verify user exists and password
        const accounts = await loadAccounts();
        const user = accounts[userContext.userId];
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        console.log(`🗑️ Starting account deletion for: ${user.username} (${user.id})`);

        // 1. Remove user from accounts
        delete accounts[user.id];
        const accountsSaved = await saveAccounts(accounts);
        
        if (!accountsSaved) {
            return res.status(500).json({ error: 'Failed to remove user from accounts' });
        }

        // 2. Delete user folder and all contents
        const userFolder = path.join(USERS_FOLDER, user.id);
        
        if (await fs.pathExists(userFolder)) {
            await fs.remove(userFolder);
            console.log(`🗑️ Deleted user folder: ${userFolder}`);
        }

        console.log(`✅ Successfully deleted account: ${user.username} (${user.id})`);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

module.exports = router;