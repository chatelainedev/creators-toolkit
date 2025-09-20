// Auth JavaScript - File-Based Authentication System

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false; 
        this.apiBase = window.location.origin; // Use current origin for API calls
        this.sessionKey = 'writingTools_session';
        this.serverSessionKey = 'writingTools_serverSession';
        this.migrationOfferedKey = 'writingTools_migrationOffered';
        this.eventListenersAttached = false; // Prevent duplicate listeners
        this.addTestingCommands();
        this.initializeAuth();
    }

    // Global loading utilities (can be used by other parts of the app)
    showGlobalLoading(message = 'Loading...', icon = null) {
        console.log(`🔄 Showing global loading: ${message}`);
        
        this.hideLoadingState(); // Hide auth loading if showing
        
        let loadingOverlay = document.getElementById('global-loading');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'global-loading';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(30, 30, 30, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                font-family: var(--font-family);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                backdrop-filter: blur(3px);
            `;
            
            document.body.appendChild(loadingOverlay);
        }
        
        // Update content
        const iconHtml = icon ? `<i class="${icon}" style="font-size: 28px; margin-bottom: 20px; color: var(--primary); animation: pulse 2s ease-in-out infinite alternate;"></i>` : 
                        `<div style="width: 36px; height: 36px; border: 3px solid rgba(255, 255, 255, 0.3); border-top: 3px solid var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px;"></div>`;
        
        loadingOverlay.innerHTML = `
            <div style="text-align: center; color: var(--text-primary); background: rgba(50, 50, 50, 0.8); padding: 40px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                ${iconHtml}
                <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">${message}</div>
                <div style="font-size: 13px; opacity: 0.6;">Please wait...</div>
            </div>
        `;
        
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            loadingOverlay.style.opacity = '1';
        }, 10);
        
        console.log('✅ Global loading overlay created and shown');
    }

    hideGlobalLoading() {
        console.log('🔄 Hiding global loading');
        const loadingOverlay = document.getElementById('global-loading');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                console.log('✅ Global loading hidden');
            }, 300);
        }
    }

    // Navigation loading specifically
    showNavigationLoading(toolName) {
        const messages = {
            'info-converter': 'Loading Lore Codex...',
            'roleplay-converter': 'Loading RP Archiver...',
            'default': 'Loading...'
        };
        
        const icons = {
            'info-converter': 'fas fa-file-alt',
            'roleplay-converter': 'fas fa-theater-masks',
        };
        
        const message = messages[toolName] || messages.default;
        const icon = icons[toolName];
        
        console.log(`🎭 Navigation loading for: ${toolName}`);
        this.showGlobalLoading(message, icon);
    }

    // Test loading function (temporary - for debugging)
    testLoading() {
        console.log('🧪 Testing loading overlay');
        this.showGlobalLoading('Test Loading...', 'fas fa-cog');
        setTimeout(() => {
            this.hideGlobalLoading();
        }, 3000);
    }

    // Initialize authentication system
    async initializeAuth() {
        // Make available globally right away
        window.authManager = this;
        
        const startTime = Date.now();
        const minLoadingTime = 500; // Minimum loading time for smooth UX
        
        // Start with loading state instead of showing login modal immediately
        this.showLoadingState();
        
        // Quick check: if no local session at all, skip server checks
        const localSession = this.loadLocalSession();
        if (!localSession) {
            console.log('No local session found');
            
            // ADD THIS BLOCK - Check for guest mode before showing login
            const wasGuestMode = localStorage.getItem('writingTools_guestMode');
            if (wasGuestMode === 'true') {
                console.log('Found guest mode flag - continuing as guest');
                await this.ensureMinimumLoadingTime(startTime, minLoadingTime);
                this.setGuestMode();
                this.showMainContent();
                this.isInitialized = true;
                return;
            }
            
            console.log('Showing login modal');
            await this.ensureMinimumLoadingTime(startTime, minLoadingTime);
            this.showAuthModal();
            this.setupEventListeners();
            return;
        }
        
        // Check if server was restarted by comparing server session IDs
        const wasServerRestarted = await this.checkServerRestart();
        
        if (wasServerRestarted) {
            console.log('🔄 Server restart detected - clearing session');
            this.clearSession();
            await this.ensureMinimumLoadingTime(startTime, minLoadingTime);
            this.showAuthModal();
            this.setupEventListeners();
            
            // Check for migration opportunity after server restart
            setTimeout(() => {
                this.checkForLocalStorageMigration();
            }, 1000);
            return;
        }
        
        // Server wasn't restarted and we have a local session, try to restore it
        console.log('Found existing session, attempting to validate...');
        
        const userContext = {
            userId: localSession.userId,
            username: localSession.username,
            isGuest: false
        };
        
        try {
            const response = await fetch(`${this.apiBase}/api/user/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (response.ok) {
                const userData = await response.json();
                this.currentUser = userData;
                await this.ensureMinimumLoadingTime(startTime, minLoadingTime);
                this.showMainContent();
                this.isInitialized = true;
                console.log('✅ Session restored successfully');
                return;
            }
        } catch (error) {
            console.warn('Session validation failed:', error);
        }
        
        // Session validation failed, show auth modal
        console.log('Session validation failed - showing login');
        this.clearSession();
        await this.ensureMinimumLoadingTime(startTime, minLoadingTime);
        this.showAuthModal();
        this.setupEventListeners();
    }

    // Ensure loading shows for minimum time for smooth UX
    async ensureMinimumLoadingTime(startTime, minTime) {
        const elapsed = Date.now() - startTime;
        if (elapsed < minTime) {
            await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
        }
    }

    // Check if server was restarted by comparing server session IDs
    async checkServerRestart() {
        try {
            // Get current server session ID
            const response = await fetch(`${this.apiBase}/api/env`);
            if (!response.ok) {
                console.warn('Could not check server session');
                return false; // Assume no restart if we can't check
            }
            
            const envData = await response.json();
            const currentServerSessionId = envData.serverSessionId;
            
            // Get stored server session ID
            const storedServerSessionId = localStorage.getItem(this.serverSessionKey);
            
            if (!storedServerSessionId) {
                // First time, store the current server session ID
                localStorage.setItem(this.serverSessionKey, currentServerSessionId);
                return false; // No restart, just first time
            }
            
            if (storedServerSessionId !== currentServerSessionId) {
                // Server session ID changed, server was restarted
                localStorage.setItem(this.serverSessionKey, currentServerSessionId);
                return true;
            }
            
            return false; // Same session, no restart
        } catch (error) {
            console.warn('Error checking server restart:', error);
            return false; // Assume no restart on error
        }
    }

    async checkForLocalStorageMigration() {
        const localUsers = localStorage.getItem('writingTools_users');
        const localPreferences = localStorage.getItem('writingTools_preferences');
        const localUsage = localStorage.getItem('writingTools_usage');
        
        // Check if we've already offered migration for this data
        const migrationOffered = localStorage.getItem(this.migrationOfferedKey);
        
        if (localUsers || localPreferences || localUsage) {
            // Only offer migration if we haven't already offered it
            if (!migrationOffered) {
                if (confirm('Would you like to migrate your old browser data to the new file-based system? This will preserve your data even if you clear your browser cache.')) {
                    const success = await this.migrateLocalStorageData();
                    if (success) {
                        // Mark migration as completed successfully
                        localStorage.setItem(this.migrationOfferedKey, 'completed');
                        // NOW we can safely clear old data
                        localStorage.removeItem('writingTools_users');
                        localStorage.removeItem('writingTools_preferences');
                        localStorage.removeItem('writingTools_usage');
                        this.showToast('Migration completed and old data cleared', 'success');
                    } else {
                        this.showToast('Migration failed - old data preserved', 'warning');
                    }
                } else {
                    // User declined migration - mark as offered but don't clear data yet
                    localStorage.setItem(this.migrationOfferedKey, 'declined');
                    this.showToast('Migration declined - your data will remain in browser storage', 'info');
                }
            } else if (migrationOffered === 'declined') {
                // Migration was previously declined, ask if they want to try again
                if (confirm('Would you like to migrate your browser data now? (You previously declined)')) {
                    const success = await this.migrateLocalStorageData();
                    if (success) {
                        localStorage.setItem(this.migrationOfferedKey, 'completed');
                        localStorage.removeItem('writingTools_users');
                        localStorage.removeItem('writingTools_preferences');
                        localStorage.removeItem('writingTools_usage');
                        this.showToast('Migration completed!', 'success');
                    }
                }
            }
            // If migrationOffered === 'completed', do nothing - data was already migrated
        }
    }

    // Migrate localStorage data to file-based system
    async migrateLocalStorageData() {
        try {
            const users = JSON.parse(localStorage.getItem('writingTools_users') || '{}');
            const preferences = JSON.parse(localStorage.getItem('writingTools_preferences') || '{}');
            const usage = JSON.parse(localStorage.getItem('writingTools_usage') || '{}');
            
            const response = await fetch(`${this.apiBase}/api/migrate/localStorage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ users, preferences, usage })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showToast(`Successfully migrated ${result.migratedCount} users to file-based system!`, 'success');
                return true; // ADD THIS LINE
            } else {
                console.error('Migration failed');
                this.showToast('Data migration failed', 'error');
                return false; // ADD THIS LINE
            }
        } catch (error) {
            console.error('Migration error:', error);
            this.showToast('Migration error occurred', 'error');
            return false; // ADD THIS LINE
        }
    }

    // Method to manually clear migration state (for testing)
    clearMigrationState() {
        localStorage.removeItem(this.migrationOfferedKey);
        console.log('Migration state cleared - migration will be offered again on next server restart');
    }

    // Load session from localStorage (temporary until fully migrated)
    loadLocalSession() {
        try {
            const session = localStorage.getItem(this.sessionKey);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            return null;
        }
    }

    // Save session to localStorage (minimal data)
    saveSession(userId, username) {
        const sessionData = {
            userId: userId,
            username: username,
            timestamp: Date.now()
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    // Clear session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        // Don't clear server session ID unless manually logging out
        this.currentUser = null;
    }

    // Clear session and server session (for manual logout)
    clearAllSessions() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.serverSessionKey);
        localStorage.removeItem('writingTools_guestMode'); // ADD THIS LINE
        this.currentUser = null;
    }

    // FIXED: Setup event listeners with better error handling and debugging
    setupEventListeners() {
        // Prevent duplicate event listeners
        if (this.eventListenersAttached) {
            console.log('⚠️ Event listeners already attached, skipping');
            return;
        }

        console.log('🎯 Setting up auth event listeners...');

        // Tab switching - FIXED: Use currentTarget and add debugging
        const authTabs = document.querySelectorAll('.auth-tab');
        console.log(`📋 Found ${authTabs.length} auth tabs`);
        
        authTabs.forEach((tab, index) => {
            console.log(`🔗 Attaching click listener to tab ${index}: ${tab.dataset.tab}`);
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabName = e.currentTarget.dataset.tab; // Use currentTarget instead of target
                console.log(`🎯 Tab clicked: ${tabName}`);
                this.switchTab(tabName);
            });

            // Also add keyboard support
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabName = e.currentTarget.dataset.tab;
                    console.log(`⌨️ Tab activated via keyboard: ${tabName}`);
                    this.switchTab(tabName);
                }
            });
        });

        // Form submissions
        const loginForm = document.getElementById('login-form-element');
        const registerForm = document.getElementById('register-form-element');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
            console.log('✅ Login form listener attached');
        } else {
            console.error('❌ Login form not found!');
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
            console.log('✅ Register form listener attached');
        } else {
            console.error('❌ Register form not found!');
        }

        // Guest mode link (add after register form listener)
        const guestLink = document.getElementById('continue-as-guest');
        if (guestLink) {
            guestLink.addEventListener('click', () => {
                this.handleGuestMode();
            });
        }

        // Mark listeners as attached
        this.eventListenersAttached = true;
        console.log('✅ All auth event listeners attached successfully');

        // Make available globally
        window.authManager = this;
    }

    // FIXED: Switch between login and register tabs with better debugging
    switchTab(tabName) {
        console.log(`🔄 Switching to tab: ${tabName}`);
        
        if (!tabName) {
            console.error('❌ No tab name provided to switchTab');
            return;
        }

        // Update tab buttons
        const allTabs = document.querySelectorAll('.auth-tab');
        const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (!targetTab) {
            console.error(`❌ Target tab not found: ${tabName}`);
            return;
        }

        console.log(`📋 Updating ${allTabs.length} tab buttons`);
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        targetTab.classList.add('active');

        // Update form visibility
        const allForms = document.querySelectorAll('.auth-form');
        const targetForm = document.getElementById(`${tabName}-form`);
        
        if (!targetForm) {
            console.error(`❌ Target form not found: ${tabName}-form`);
            return;
        }

        console.log(`📝 Updating ${allForms.length} form sections`);
        allForms.forEach(form => {
            form.classList.remove('active');
        });
        targetForm.classList.add('active');

        // Clear any previous errors
        this.clearFormErrors();
        
        console.log(`✅ Successfully switched to ${tabName} tab`);
    }

    // Handle login form submission
    async handleLogin() {
        const form = document.getElementById('login-form');
        const usernameOrEmail = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        // Clear previous errors
        this.clearFormErrors();

        // Validation
        if (!usernameOrEmail || !password) {
            this.showFormError('login-username', 'Please fill in all fields');
            return;
        }

        // Add loading state
        form.classList.add('loading');

        try {
            const response = await fetch(`${this.apiBase}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Registration successful - auto-login
                localStorage.removeItem('writingTools_guestMode'); // ADD THIS LINE
                this.saveSession(result.user.id, result.user.username);
                
                // Load full user profile
                const userContext = {
                    userId: result.user.id,
                    username: result.user.username,
                    isGuest: false
                };
                
                const profileResponse = await fetch(`${this.apiBase}/api/user/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userContext })
                });
                
                if (profileResponse.ok) {
                    this.currentUser = await profileResponse.json();
                    this.showMainContent();
                    this.showToast('Welcome back!', 'success');
                }
            } else {
                this.showFormError('login-password', result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showFormError('login-username', 'Login failed. Please try again.');
        } finally {
            form.classList.remove('loading');
        }
    }

    // Handle register form submission
    async handleRegister() {
        const form = document.getElementById('register-form');
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        // Clear previous errors
        this.clearFormErrors();

        // Validation
        if (!username || !password || !confirmPassword) {
            this.showFormError('register-username', 'Please fill in all required fields');
            return;
        }

        if (username.length < 3) {
            this.showFormError('register-username', 'Username must be at least 3 characters');
            return;
        }

        // Only validate email format if email is provided
        if (email && !this.isValidEmail(email)) {
            this.showFormError('register-email', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showFormError('register-password', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showFormError('register-confirm', 'Passwords do not match');
            return;
        }

        // Add loading state
        form.classList.add('loading');

        try {
            const response = await fetch(`${this.apiBase}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Registration successful - auto-login
                this.saveSession(result.user.id, result.user.username);
                
                // Load full user profile
                const userContext = {
                    userId: result.user.id,
                    username: result.user.username,
                    isGuest: false
                };
                
                const profileResponse = await fetch(`${this.apiBase}/api/user/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userContext })
                });
                
                if (profileResponse.ok) {
                    this.currentUser = await profileResponse.json();
                    this.showMainContent();
                    this.showToast('Account created successfully!', 'success');
                }
            } else {
                this.showFormError('register-username', result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showFormError('register-username', 'Registration failed. Please try again.');
        } finally {
            form.classList.remove('loading');
        }
    }

    // Handle guest mode selection (add after handleRegister method)
    handleGuestMode() {
        this.setGuestMode();
        this.showMainContent();
        this.showToast('Continuing as guest', 'info');
    }

    // Helper functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // UI Management
    showLoadingState() {
        // Hide both auth modal and main content immediately (no transition)
        const authModal = document.getElementById('auth-modal');
        const mainContent = document.getElementById('main-content');
        const userInfo = document.getElementById('user-info');
        
        authModal.style.display = 'none';
        mainContent.style.display = 'none';
        userInfo.style.display = 'none';
        authModal.classList.remove('show');
        mainContent.classList.remove('show');
        userInfo.classList.remove('show');
        
        // Show or create loading overlay
        let loadingOverlay = document.getElementById('auth-loading');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'auth-loading';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: var(--font-family);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `;
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: var(--text-primary);">
                    <div style="width: 32px; height: 32px; border: 2px solid var(--bg-secondary); border-top: 2px solid var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>
                    <div style="font-size: 13px; opacity: 0.6; font-weight: 400;">Loading...</div>
                </div>
            `;
            
            // Add spinner animation if not already present
            if (!document.getElementById('spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-styles';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(loadingOverlay);
            
            // Fade in the loading overlay
            setTimeout(() => {
                loadingOverlay.style.opacity = '1';
            }, 10);
        } else {
            loadingOverlay.style.display = 'flex';
            setTimeout(() => {
                loadingOverlay.style.opacity = '1';
            }, 10);
        }
    }

    hideLoadingState() {
        const loadingOverlay = document.getElementById('auth-loading');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
    }

    // Set guest mode (add after clearAllSessions method)
    setGuestMode() {
        this.currentUser = {
            username: 'Guest',
            isGuest: true,
            avatar: `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify({ isGuest: true }))}`
        };
        
        // ADD THIS LINE - Store guest mode state
        localStorage.setItem('writingTools_guestMode', 'true');
        
        console.log('👤 Guest mode activated');
    }

    // FIXED: Show auth modal with proper timing
    showAuthModal() {
        this.hideLoadingState();
        
        const authModal = document.getElementById('auth-modal');
        const mainContent = document.getElementById('main-content');
        const userInfo = document.getElementById('user-info');
        
        // Hide others immediately
        mainContent.style.display = 'none';
        userInfo.style.display = 'none';
        mainContent.classList.remove('show');
        userInfo.classList.remove('show');
        
        // Show auth modal with delay for smooth transition from loading
        setTimeout(() => {
            authModal.style.display = 'flex';
            setTimeout(() => {
                authModal.classList.add('show');

                // Load version info when modal is shown
                this.loadVersionInfo();
                
                // FIXED: Ensure event listeners are set up AFTER modal is fully visible
                setTimeout(() => {
                    if (!this.eventListenersAttached) {
                        console.log('🔧 Setting up event listeners after modal show');
                        this.setupEventListeners();
                    }
                }, 100);
                
            }, 50);
        }, 200); // Wait for loading to fade out
    }

    showMainContent() {
        this.hideLoadingState();
        
        const authModal = document.getElementById('auth-modal');
        const mainContent = document.getElementById('main-content');
        const userInfo = document.getElementById('user-info');
        
        // Hide auth modal immediately
        authModal.style.display = 'none';
        authModal.classList.remove('show');
        
        // Show main content with delay for smooth transition from loading
        setTimeout(() => {
            mainContent.style.display = 'flex';
            userInfo.style.display = 'flex';
            
            setTimeout(() => {
                mainContent.classList.add('show');
                userInfo.classList.add('show');
            }, 50);
        }, 200); // Wait for loading to fade out
        
        this.updateUserDisplay();
        
        // Refresh My Sites for the new user
        if (window.mySitesManager) {
            window.mySitesManager.refresh();
        }
    }

    // Update user display with avatar from file system
    updateUserDisplay() {
        const user = this.getCurrentUser();
        const userInfo = document.getElementById('user-info');
        const userDisplay = document.getElementById('user-display');
        const userAvatar = document.getElementById('user-avatar');

        if (user) {
            userInfo.style.display = 'flex';
            userDisplay.innerHTML = user.username;
            
            if (userAvatar) {
                userAvatar.src = user.avatar || 'images/default-avatar.png';
            }
        } else {
            userInfo.style.display = 'none';
            userDisplay.innerHTML = '';
            if (userAvatar) {
                userAvatar.src = 'images/default-avatar.png';
            }
        }
    }

    // Form error handling
    showFormError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFormErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Logout
    logout() {
        this.clearAllSessions(); // Clear both user session and server session
        
        // Clear My Sites data when logging out
        if (window.mySitesManager) {
            window.mySitesManager.clear();
        }
        
        // Reset event listeners flag so they can be reattached
        this.eventListenersAttached = false;
        
        this.showAuthModal();
        this.showToast('Logged out successfully', 'info');
        
        // Clear forms
        document.getElementById('login-form-element').reset();
        document.getElementById('register-form-element').reset();
        this.clearFormErrors();
        
        // Reset to login tab
        this.switchTab('login');
    }

    // Update user profile (called from settings)
    async updateUser(userData) {
        if (!this.currentUser || this.currentUser.isGuest) {
            return { success: false, error: 'No user logged in' };
        }

        try {
            const userContext = {
                userId: this.currentUser.id,
                username: this.currentUser.username,
                isGuest: false
            };

            const response = await fetch(`${this.apiBase}/api/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, updates: userData })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Update session if username changed
                if (userData.username) {
                    this.saveSession(result.user.id, result.user.username);
                }
                
                // Reload user profile to get updated data
                const profileResponse = await fetch(`${this.apiBase}/api/user/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userContext: { 
                        userId: result.user.id, 
                        username: result.user.username,
                        isGuest: false 
                    }})
                });
                
                if (profileResponse.ok) {
                    this.currentUser = await profileResponse.json();
                    this.updateUserDisplay();
                }

                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: 'Update failed' };
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user context for API calls
    getUserContext() {
        if (!this.currentUser) {
            return { isGuest: true };
        }
        
        if (this.currentUser.isGuest) {
            return { isGuest: true };
        }
        
        return {
            userId: this.currentUser.id,
            username: this.currentUser.username,
            isGuest: false
        };
    }

    // Save user preferences to server
    async saveUserPreferences(preferences) {
        if (!this.currentUser || this.currentUser.isGuest) {
            return false;
        }

        try {
            const response = await fetch(`${this.apiBase}/api/user/preferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    preferences: preferences
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Failed to save user preferences:', error);
            return false;
        }
    }

    // Load user preferences from server
    async loadUserPreferences() {
        if (!this.currentUser || this.currentUser.isGuest) {
            return {};
        }

        try {
            const response = await fetch(`${this.apiBase}/api/user/preferences/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            if (response.ok) {
                const result = await response.json();
                return result.preferences || {};
            }
        } catch (error) {
            console.error('Failed to load user preferences:', error);
        }
        
        return {};
    }

    // Add console command for testing
    addTestingCommands() {
        // ADD THIS NEW COMMAND
        window.clearMigrationState = () => {
            if (window.authManager) {
                window.authManager.clearMigrationState();
            }
        };
        
        console.log('Testing commands available: clearMigrationState()');
    }

    // Add this new method to the AuthManager class (around line 100, after initializeAuth)
    async loadVersionInfo() {
        try {
            const response = await fetch(`${this.apiBase}/api/version`);
            if (response.ok) {
                const versionData = await response.json();
                const versionElement = document.getElementById('version-number');
                if (versionElement) {
                    versionElement.textContent = `${versionData.version}`;
                }
            }
        } catch (error) {
            console.warn('Could not load version info:', error);
            // Fallback to hardcoded version
            const versionElement = document.getElementById('version-number');
            if (versionElement) {
                versionElement.textContent = '1.0.0 Alpha';
            }
        }
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});