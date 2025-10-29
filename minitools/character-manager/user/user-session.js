// User Session Management for Character Manager - File-Based Avatar System
// This is a copy/adaptation of the main user-session.js for Character Manager

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
        console.log('Initializing character manager user session...');
        
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
                        avatar: userData.avatar,
                        isGuest: false
                    };
                    this.isGuest = false;
                    console.log('✅ Session validated with file-based system');
                    return true;
                }
            } catch (serverError) {
                console.warn('Server validation failed, trying localStorage fallback:', serverError);
            }

            // Fallback to localStorage validation
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
        this.updateNavigationAvatar();
        console.log(`Character Manager active user: ${this.isGuest ? 'Guest' : this.currentUser.username}`);
    }

    // Update navigation avatar display
    updateNavigationAvatar() {
        const navUserAvatar = document.getElementById('nav-user-avatar');
        const avatarImg = document.getElementById('nav-avatar-img');
        
        if (!navUserAvatar || !avatarImg) {
            console.warn('Navigation avatar elements not found');
            return;
        }
        
        if (this.currentUser) {
            avatarImg.src = this.currentUser.avatar;
            avatarImg.alt = `${this.currentUser.username} Avatar`;
            
            const displayName = this.isGuest ? 'Guest' : this.currentUser.username;
            navUserAvatar.setAttribute('data-username', displayName);
            navUserAvatar.style.display = 'flex';
            
            avatarImg.onerror = () => {
                console.warn('Avatar failed to load, using default');
                avatarImg.src = '/images/default-avatar.png';
            };
            
            console.log(`Updated avatar display for: ${displayName}`);
        } else {
            navUserAvatar.style.display = 'none';
            navUserAvatar.removeAttribute('data-username');
        }
    }

    // Login with credentials
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
                        this.saveSession(result.user.id, result.user.username);
                        
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
                
                const usersData = localStorage.getItem(this.usersKey);
                if (!usersData) {
                    throw new Error('No users found. Please register first.');
                }

                const users = JSON.parse(usersData);
                const user = Object.values(users).find(u => 
                    u.username === usernameOrEmail || u.email === usernameOrEmail
                );

                if (!user) {
                    throw new Error('User not found');
                }

                if (user.password !== password) {
                    throw new Error('Incorrect password');
                }

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

            try {
                const response = await fetch(`${this.apiBase}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        this.saveSession(result.user.id, result.user.username);
                        
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
                
                let users = {};
                const usersData = localStorage.getItem(this.usersKey);
                if (usersData) {
                    users = JSON.parse(usersData);
                }

                const existingByUsername = Object.values(users).find(u => 
                    u.username === username
                );

                if (existingByUsername) {
                    throw new Error('Username already taken');
                }

                if (email && email.trim()) {
                    const existingByEmail = Object.values(users).find(u => 
                        u.email === email
                    );
                    
                    if (existingByEmail) {
                        throw new Error('Email already registered');
                    }
                }

                const userId = this.generateUserId();
                const newUser = {
                    id: userId,
                    username: username,
                    email: email || null,
                    password: password,
                    avatar: 'images/default-avatar.png',
                    createdAt: Date.now()
                };

                users[userId] = newUser;
                localStorage.setItem(this.usersKey, JSON.stringify(users));

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
        
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('writingTools_guestMode');
        
        this.setGuestMode();
        this.updateUserDisplay();
        
        console.log('👋 User logged out, switched to guest mode');
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Utility: Show toast notification
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(type, message);
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

    // Save last project for quick access
    setLastProject(projectName) {
        if (!projectName) return;
        
        const userContext = this.getUserContext();
        const storageKey = `characterManagerLastProject_${userContext.isGuest ? 'guest' : userContext.userId}`;
        
        try {
            localStorage.setItem(storageKey, projectName);
            console.log('💾 Last project saved:', projectName);
        } catch (error) {
            console.error('Failed to save last project:', error);
        }
    }

    getLastProject() {
        const userContext = this.getUserContext();
        const storageKey = `characterManagerLastProject_${userContext.isGuest ? 'guest' : userContext.userId}`;
        
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            console.error('Failed to get last project:', error);
            return null;
        }
    }

    clearLastProject() {
        const userContext = this.getUserContext();
        const storageKey = `characterManagerLastProject_${userContext.isGuest ? 'guest' : userContext.userId}`;
        
        try {
            localStorage.removeItem(storageKey);
            console.log('🗑️ Last project cleared');
        } catch (error) {
            console.error('Failed to clear last project:', error);
        }
    }
}

// Initialize user session management
function initializeUserSession() {
    if (!window.userSessionManager) {
        window.userSessionManager = new UserSessionManager();
    }
    return window.userSessionManager;
}

// Export for use in other files
window.UserSessionManager = UserSessionManager;
window.initializeUserSession = initializeUserSession;