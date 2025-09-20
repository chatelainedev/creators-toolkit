// User Session Management for Lore Codex - File-Based Avatar System
// Handles user authentication, session validation, and user context

class UserSessionManager {
    constructor() {
        this.currentUser = null;
        this.isGuest = false;
        this.sessionKey = 'writingTools_session';
        this.usersKey = 'writingTools_users';
        this.apiBase = window.location.origin;
    }

    // Initialize user session on app load
    async initializeUser() {
        console.log('Initializing user session...');
        
        try {
            const session = this.loadFromLocalStorage();
            if (session) {
                console.log('Found session data:', session);
                const isValid = await this.validateSession(session);
                if (isValid) {
                    console.log('✅ Valid user session loaded');
                    return true;
                }
            }
        } catch (error) {
            console.error('Error initializing user session:', error);
        }
        
        // If no valid session, start as guest
        console.log('🔓 No valid session, starting as guest');
        this.setGuestMode();
        return false;
    }

    // Load session data from localStorage
    loadFromLocalStorage() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            if (!sessionData) return null;

            const session = JSON.parse(sessionData);
            
            // Check if session has required fields
            if (!session.userId || !session.timestamp) {
                console.warn('Invalid session data structure');
                return null;
            }

            return session;
        } catch (error) {
            console.error('Error loading session from localStorage:', error);
            return null;
        }
    }

    // Validate session with file-based user system
    async validateSession(session) {
        try {
            // Try to load user profile from server first
            const serverUserContext = {
                userId: session.userId,
                username: session.username,
                isGuest: false
            };

            try {
                const response = await fetch(`${this.apiBase}/api/user/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userContext: serverUserContext })
                });

                if (response.ok) {
                    const userData = await response.json();
                    this.currentUser = {
                        userId: userData.id,
                        username: userData.username,
                        email: userData.email,
                        avatar: userData.avatar, // This is now the server avatar URL
                        isPremium: userData.isPremium || false, // ADD THIS LINE
                        isGuest: false
                    };
                    this.isGuest = false;
                    console.log('✅ Session validated with file-based system');
                    return true;
                }
            } catch (serverError) {
                console.warn('Server validation failed, trying localStorage fallback:', serverError);
            }

            // Fallback to localStorage validation (for transition period)
            const usersData = localStorage.getItem(this.usersKey);
            if (!usersData) {
                console.warn('No users data found');
                return false;
            }

            const users = JSON.parse(usersData);
            const user = users[session.userId];

            if (!user) {
                console.warn('User not found for session:', session.userId);
                return false;
            }

            // Session is valid, set current user with file-based avatar
            const fallbackUserContext = {
                userId: user.id,
                username: user.username,
                isGuest: false
            };

            this.currentUser = {
                userId: user.id,
                username: user.username,
                email: user.email,
                avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(fallbackUserContext))}`,
                isGuest: false
            };

            this.isGuest = false;
            return true;

        } catch (error) {
            console.error('Error validating session:', error);
            return false;
        }
    }

    // Set guest mode
    setGuestMode() {
        this.isGuest = true;
        const guestContext = { isGuest: true };
        this.currentUser = {
            username: 'Guest',
            avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(guestContext))}`,
            isGuest: true
        };
        
        // ADD THIS LINE - Store guest mode state for main app
        localStorage.setItem('writingTools_guestMode', 'true');
        
        console.log('👤 Guest mode activated');
    }

    // Get user context for API calls
    getUserContext() {
        if (this.isGuest) {
            return { isGuest: true };
        }

        return {
            userId: this.currentUser.userId,
            username: this.currentUser.username,
            isGuest: false
        };
    }

    // Get current user info for display
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in (not guest)
    isLoggedIn() {
        return !this.isGuest && this.currentUser && this.currentUser.userId;
    }

    // Update user display in UI
    updateUserDisplay() {
        const usernameElement = document.getElementById('current-username');
        const avatarElement = document.getElementById('user-avatar');
        const navAvatarElement = document.getElementById('nav-avatar-img');
        const navAvatarContainer = document.getElementById('nav-user-avatar'); // The container
        const loginBtn = document.getElementById('login-btn');

        if (usernameElement) {
            usernameElement.textContent = this.currentUser.username;
        }

        if (avatarElement) {
            avatarElement.src = this.currentUser.avatar;
            avatarElement.alt = `${this.currentUser.username} Avatar`;
            
            avatarElement.onerror = () => {
                console.warn('Avatar failed to load, using default');
                avatarElement.src = 'images/default-avatar.png';
            };
        }

        // UPDATE: Set up nav avatar with tooltip
        if (navAvatarElement && navAvatarContainer) {
            navAvatarElement.src = this.currentUser.avatar;
            navAvatarElement.alt = `${this.currentUser.username} Avatar`;
            
            // Set username for tooltip
            navAvatarContainer.setAttribute('data-username', this.currentUser.username);
            
            // Show the avatar
            navAvatarContainer.style.display = 'flex';
            
            navAvatarElement.onerror = () => {
                console.warn('Nav avatar failed to load, using default');
                navAvatarElement.src = 'images/default-avatar.png';
            };
        }

        if (loginBtn) {
            if (this.isGuest) {
                loginBtn.textContent = 'Login';
                loginBtn.style.display = 'inline-block';
                
                // Hide avatar when in guest mode
                if (navAvatarContainer) {
                    navAvatarContainer.style.display = 'none';
                }
            } else {
                loginBtn.textContent = 'Logout';
                loginBtn.style.display = 'inline-block';
                
                // Show avatar when logged in
                if (navAvatarContainer) {
                    navAvatarContainer.style.display = 'flex';
                }
            }
        }

        // Update any other UI elements that show user info
        this.updateProjectUserContext();
    }

    // Update project management UI to show user context
    updateProjectUserContext() {
        // Add user context to project displays, etc.
        const envStatus = document.getElementById('env-status');
        if (envStatus && this.currentUser) {
            const userInfo = this.isGuest ? ' (Guest Mode)' : ` (${this.currentUser.username})`;
            if (!envStatus.textContent.includes('(')) {
                envStatus.textContent += userInfo;
            }
        }
    }

    // Login with credentials (called from auth UI)
    async login(usernameOrEmail, password) {
        try {
            console.log('Attempting login for:', usernameOrEmail);

            // Try file-based login first
            try {
                const response = await fetch(`${this.apiBase}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernameOrEmail, password })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        // Save session
                        this.saveSession(result.user.id, result.user.username);
                        
                        // Load full profile
                        const profileUserContext = {
                            userId: result.user.id,
                            username: result.user.username,
                            isGuest: false
                        };
                        
                        const profileResponse = await fetch(`${this.apiBase}/api/user/profile`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userContext: profileUserContext })
                        });
                        
                        if (profileResponse.ok) {
                            const userData = await profileResponse.json();
                            this.currentUser = {
                                userId: userData.id,
                                username: userData.username,
                                email: userData.email,
                                avatar: userData.avatar,
                                isPremium: userData.isPremium || false, // ADD THIS LINE
                                isGuest: false
                            };
                            this.isGuest = false;
                            this.updateUserDisplay();

                            console.log('✅ Login successful (file-based):', result.user.username);
                            return { success: true, user: this.currentUser };
                        }
                        
                    }
                } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Server login failed');
                }
            } catch (serverError) {
                console.warn('File-based login failed, trying localStorage fallback:', serverError);
                
                // Fallback to localStorage validation
                const usersData = localStorage.getItem(this.usersKey);
                if (!usersData) {
                    throw new Error('No users found. Please register first.');
                }

                const users = JSON.parse(usersData);
                
                // Find user by username or email
                const user = Object.values(users).find(u => 
                    u.username === usernameOrEmail || u.email === usernameOrEmail
                );

                if (!user) {
                    throw new Error('User not found');
                }

                if (user.password !== password) {
                    throw new Error('Incorrect password');
                }

                // Login successful - save session
                this.saveSession(user.id, user.username);
                
                const loginUserContext = {
                    userId: user.id,
                    username: user.username,
                    isGuest: false
                };

                this.currentUser = {
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(loginUserContext))}`,
                    isPremium: user.isPremium || false, // ADD THIS LINE
                    isGuest: false
                };

                this.isGuest = false;
                this.updateUserDisplay();

                console.log('✅ Login successful (localStorage fallback):', user.username);
                return { success: true, user: this.currentUser };
            }

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Register new account
    async register(username, email, password) {
        try {
            console.log('Attempting registration for:', username);

            // Try file-based registration first
            try {
                const response = await fetch(`${this.apiBase}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        // Auto-login after registration
                        this.saveSession(result.user.id, result.user.username);
                        
                        // Load full profile
                        const regProfileUserContext = {
                            userId: result.user.id,
                            username: result.user.username,
                            isGuest: false
                        };
                        
                        const profileResponse = await fetch(`${this.apiBase}/api/user/profile`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userContext: regProfileUserContext })
                        });
                        
                        if (profileResponse.ok) {
                            const userData = await profileResponse.json();
                            this.currentUser = {
                                userId: userData.id,
                                username: userData.username,
                                email: userData.email,
                                avatar: userData.avatar,
                                isGuest: false
                            };
                            this.isGuest = false;
                            this.updateUserDisplay();

                            console.log('✅ Registration successful (file-based):', username);
                            return { success: true, user: this.currentUser };
                        }
                    }
                } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Server registration failed');
                }
            } catch (serverError) {
                console.warn('File-based registration failed, trying localStorage fallback:', serverError);
                
                // Fallback to localStorage registration
                let users = {};
                const usersData = localStorage.getItem(this.usersKey);
                if (usersData) {
                    users = JSON.parse(usersData);
                }

                // Check if username already exists
                const existingByUsername = Object.values(users).find(u => 
                    u.username === username
                );

                if (existingByUsername) {
                    throw new Error('Username already taken');
                }

                // Check if email already exists (only if email was provided)
                if (email && email.trim()) {
                    const existingByEmail = Object.values(users).find(u => 
                        u.email === email
                    );
                    
                    if (existingByEmail) {
                        throw new Error('Email already registered');
                    }
                }

                // Create new user
                const userId = this.generateUserId();
                const newUser = {
                    id: userId,
                    username: username,
                    email: email || null, // Allow null/empty email
                    password: password, // In real app, this would be hashed
                    avatar: 'images/default-avatar.png',
                    createdAt: Date.now()
                };

                // Save user
                users[userId] = newUser;
                localStorage.setItem(this.usersKey, JSON.stringify(users));

                // Auto-login after registration
                this.saveSession(userId, username);
                
                const regUserContext = {
                    userId: userId,
                    username: username,
                    isGuest: false
                };

                this.currentUser = {
                    userId: userId,
                    username: username,
                    email: email,
                    avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(regUserContext))}`,
                    isPremium: false, // ADD THIS LINE (new users start as non-premium)
                    isGuest: false
                };

                this.isGuest = false;
                this.updateUserDisplay();

                console.log('✅ Registration successful (localStorage fallback):', username);
                return { success: true, user: this.currentUser };
            }

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save session to localStorage
    saveSession(userId, username) {
        const sessionData = {
            userId: userId,
            username: username,
            timestamp: Date.now()
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        console.log('💾 Session saved for:', username);
    }

    // Logout current user
    logout() {
        console.log('Logging out user:', this.currentUser?.username);
        
        // Clear session
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('writingTools_guestMode'); // ADD THIS LINE
        
        // Reset to guest mode
        this.setGuestMode();
        this.updateUserDisplay();
        
        // Refresh projects list to show guest projects
        if (typeof updateAllContentLists === 'function') {
            updateAllContentLists();
        }
        
        console.log('👋 User logged out, switched to guest mode');
    }

    // Generate unique user ID (same format as main auth)
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Utility: Show toast notification
    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Debug: Get session info
    getSessionInfo() {
        return {
            currentUser: this.currentUser,
            isGuest: this.isGuest,
            isLoggedIn: this.isLoggedIn(),
            sessionInStorage: !!localStorage.getItem(this.sessionKey),
            usersInStorage: !!localStorage.getItem(this.usersKey),
            usingFileBasedAvatars: true
        };
    }

    // Add to userSessionManager object
    setLastProject(projectName) {
        if (!projectName) return;
        
        const userContext = this.getUserContext();
        const storageKey = `loreCodex_lastProject_${userContext.isGuest ? 'guest' : userContext.userId}`;
        
        try {
            localStorage.setItem(storageKey, projectName);
            console.log('💾 Last project saved:', projectName);
        } catch (error) {
            console.error('Failed to save last project:', error);
        }
    }

    getLastProject() {
        const userContext = this.getUserContext();
        const storageKey = `loreCodex_lastProject_${userContext.isGuest ? 'guest' : userContext.userId}`;
        
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            console.error('Failed to get last project:', error);
            return null;
        }
    }

    clearLastProject() {
        const userContext = this.getUserContext();
        const storageKey = `loreCodex_lastProject_${userContext.isGuest ? 'guest' : userContext.userId}`;
        
        try {
            localStorage.removeItem(storageKey);
            console.log('🗑️ Last project cleared');
        } catch (error) {
            console.error('Failed to clear last project:', error);
        }
    }

}

// Global instance
let userSessionManager = null;

// Initialize user session management
function initializeUserSession() {
    if (!userSessionManager) {
        userSessionManager = new UserSessionManager();
    }
    return userSessionManager;
}

// Export for use in other files
window.UserSessionManager = UserSessionManager;
window.userSessionManager = userSessionManager;
window.initializeUserSession = initializeUserSession;