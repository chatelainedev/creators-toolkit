// Settings JavaScript - File-Based Settings with Avatar Uploads
// Use a consistent key that both apps will share
const SHARED_THEME_KEY = 'writingTools_currentTheme';

class SettingsManager {
    constructor() {
        this.authManager = null;
        this.apiBase = window.location.origin;
        this.initializeSettings();
        this.themes = {};
        this.currentTheme = 'default';
        
        // Initialize themes asynchronously
        this.initializeThemes();
    }

    async initializeThemes() {
        await this.loadThemes();
    }

    // Load available themes
    async loadThemes() {
        try {
            const response = await fetch('themes/themes.json');
            this.themes = await response.json();
            this.populateThemeDropdown();
            await this.loadSavedTheme(); // Make this await
        } catch (error) {
            console.error('Failed to load themes:', error);
            this.themes = { default: { name: "Default", colors: {} } };
        }
    }

    // Populate theme dropdown
    populateThemeDropdown() {
        const dropdown = document.getElementById('theme-dropdown');
        const selected = document.getElementById('theme-selected');
        const options = document.getElementById('theme-options');
        
        if (!dropdown || !selected || !options) return;
        
        // Clear existing options
        options.innerHTML = '';
        
        // Populate options
        Object.keys(this.themes).forEach(themeId => {
            const theme = this.themes[themeId];
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.dataset.value = themeId;
            
            option.innerHTML = `
                <span>${theme.name}</span>
            `;
            
            options.appendChild(option);
        });
        
        // Set up dropdown interactions
        this.setupCustomDropdown();
    }

    // Setup custom dropdown interactions
    setupCustomDropdown() {
        const dropdown = document.getElementById('theme-dropdown');
        const selected = document.getElementById('theme-selected');
        const options = document.getElementById('theme-options');
        const selectedText = selected.querySelector('.selected-text');
        
        // Toggle dropdown
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = options.classList.contains('show');
            
            // Close all dropdowns first
            document.querySelectorAll('.dropdown-options.show').forEach(opt => {
                opt.classList.remove('show');
                opt.previousElementSibling.classList.remove('open');
            });
            
            if (!isOpen) {
                options.classList.add('show');
                selected.classList.add('open');
            }
        });
        
        // Handle option selection
        options.addEventListener('click', (e) => {
            const option = e.target.closest('.dropdown-option');
            if (!option) return;
            
            const selectedThemeId = option.dataset.value;
            const selectedTheme = this.themes[selectedThemeId];
            
            // Update selected display
            selectedText.innerHTML = option.innerHTML;
            
            // Update selected state
            options.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Close dropdown
            options.classList.remove('show');
            selected.classList.remove('open');
            
            // Apply theme
            this.applyTheme(selectedThemeId, true);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                options.classList.remove('show');
                selected.classList.remove('open');
            }
        });
    }

    // Apply theme
    applyTheme(themeId, showToast = false) {
        if (!this.themes[themeId]) return;
        
        const theme = this.themes[themeId];
        const root = document.documentElement;
        
        // Apply theme colors to CSS custom properties
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
        
        this.currentTheme = themeId;
        this.saveThemePreference();
        this.updateThemePreview(theme);
        
        // Broadcast the change (this will trigger the storage event in other tabs/apps)
        localStorage.setItem('writingTools_currentTheme', themeId);
        
        // Only show toast if explicitly requested
        if (showToast) {
            this.showToast(`Theme changed to ${theme.name}`, 'success');
        }
        
        console.log('Theme change broadcasted to other apps');
    }

    // Update theme preview colors
    updateThemePreview(theme) {
        const previewColors = document.querySelectorAll('.preview-color');
        previewColors.forEach(colorDiv => {
            const colorVar = colorDiv.dataset.color;
            if (theme.colors[colorVar]) {
                colorDiv.style.backgroundColor = theme.colors[colorVar];
            }
        });
    }

    async saveThemePreference() {
        // Always save to localStorage for immediate persistence
        localStorage.setItem(SHARED_THEME_KEY, this.currentTheme);
        
        // If user is logged in, also save to server
        if (this.authManager && this.authManager.getCurrentUser() && !this.authManager.getCurrentUser().isGuest) {
            try {
                const preferences = { theme: this.currentTheme };
                await this.authManager.saveUserPreferences(preferences);
                console.log('Theme saved to server preferences');
            } catch (error) {
                console.error('Failed to save theme to server:', error);
            }
        }
    }

    // Load saved theme
    async loadSavedTheme() {
        let savedTheme = 'default';
        
        // If user is logged in, load from server preferences
        if (this.authManager && this.authManager.getCurrentUser() && !this.authManager.getCurrentUser().isGuest) {
            try {
                const serverPreferences = await this.authManager.loadUserPreferences();
                savedTheme = serverPreferences.theme || 'default';
            } catch (error) {
                console.error('Failed to load theme from server:', error);
                // Fallback to localStorage only if server fails
                savedTheme = localStorage.getItem(SHARED_THEME_KEY) || 'default';
            }
        } else {
            // For guests, use localStorage as fallback
            savedTheme = localStorage.getItem(SHARED_THEME_KEY) || 'default';
        }
        
        // Update custom dropdown selection
        const selectedText = document.querySelector('#theme-selected .selected-text');
        const option = document.querySelector(`[data-value="${savedTheme}"]`);
        
        if (selectedText && option) {
            selectedText.innerHTML = option.innerHTML;
            
            // Update selected state
            document.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        }
        
        this.applyTheme(savedTheme);
    }

    // Method called when user logs in
    async onUserLoggedIn() {
        // Existing functionality - refresh settings modal if open
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && settingsModal.style.display === 'flex') {
            console.log('🔧 Refreshing settings after login');
            this.populateSettings();
        }
        
        // NEW: Load user theme preferences
        console.log('🎨 Loading user theme preferences...');
        try {
            const serverPreferences = await this.authManager.loadUserPreferences();
            if (serverPreferences.theme && serverPreferences.theme !== this.currentTheme) {
                console.log(`Switching to user's saved theme: ${serverPreferences.theme}`);
                
                // Update dropdown
                const selectedText = document.querySelector('#theme-selected .selected-text');
                const option = document.querySelector(`[data-value="${serverPreferences.theme}"]`);
                
                if (selectedText && option) {
                    selectedText.innerHTML = option.innerHTML;
                    
                    // Update selected state
                    document.querySelectorAll('.dropdown-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                }
                
                // Apply the theme
                this.applyTheme(serverPreferences.theme, false);
            }
        } catch (error) {
            console.error('Failed to load user theme preferences:', error);
        }
    }

    // Method called when user logs out  
    onUserLoggedOut() {
        // Existing functionality - close settings modal if open
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && settingsModal.style.display === 'flex') {
            console.log('🔧 Closing settings after logout');
            this.closeSettings();
        }
        
        // NEW: Reset theme to default
        console.log('🎨 User logged out, resetting to default theme');
        const defaultTheme = 'default';
        
        // Update dropdown
        const selectedText = document.querySelector('#theme-selected .selected-text');
        const option = document.querySelector(`[data-value="${defaultTheme}"]`);
        
        if (selectedText && option) {
            selectedText.innerHTML = option.innerHTML;
            
            // Update selected state
            document.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        }
        
        // Apply default theme
        this.applyTheme(defaultTheme, false);
        
        // Clear localStorage
        localStorage.removeItem(SHARED_THEME_KEY);
    }

    // Initialize settings system
    initializeSettings() {
        this.setupEventListeners();
        
        // Wait for auth manager to be available
        const checkAuthManager = () => {
            if (window.authManager) {
                this.authManager = window.authManager;
            } else {
                setTimeout(checkAuthManager, 100);
            }
        };
        checkAuthManager();
    }

    // Setup event listeners
    setupEventListeners() {
        // Settings button (optional since we removed it)
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettings();
            });
        }

        // Close settings
        document.getElementById('close-settings').addEventListener('click', () => {
            this.closeSettings();
        });

        // Close on overlay click
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                this.closeSettings();
            }
        });

        // Account form submission
        document.getElementById('account-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAccountUpdate();
        });

        // Add new avatar click handler
        document.getElementById('settings-avatar-preview').addEventListener('click', () => {
            const user = this.authManager.getCurrentUser();
            if (user && user.isGuest) {
                this.showToast('Avatar upload available with account', 'info');
                return;
            }
            document.getElementById('avatar-upload').click();
        });
        // Add this to setupEventListeners() method after the avatar preview click handler:
        document.getElementById('avatar-upload').addEventListener('change', (e) => {
            this.handleAvatarUpload(e);
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Delete account button
        document.getElementById('delete-account-btn').addEventListener('click', () => {
            this.showDeleteConfirmation();
        });

        // ESC key to close modal
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('settings-modal');
                if (modal && modal.style.display === 'flex') {
                    this.closeSettings();
                }
            }
        });
    }

    // Open settings modal
    openSettings() {
        console.log('🔧 Settings opening...');
        
        if (!this.authManager || !this.authManager.getCurrentUser()) {
            return;
        }

        // CHANGE: Always populate fresh settings data
        this.populateSettings();
        document.getElementById('settings-modal').style.display = 'flex';
        
        // Check if this somehow affects the about modal
        const aboutModal = document.getElementById('about-modal');
        console.log('🔧 About modal display after settings opens:', aboutModal.style.display);
    }

    // Close settings modal
    closeSettings() {
        document.getElementById('settings-modal').style.display = 'none';
        this.clearFormStates();
    }

    // Populate settings with current user data
    populateSettings() {
        const user = this.authManager.getCurrentUser();
        if (!user) return;

        document.getElementById('settings-username').value = user.username || '';
        document.getElementById('settings-email').value = user.email || '';
        document.getElementById('settings-new-password').value = '';
        
        // Set avatar preview using the server URL
        const avatarPreview = document.getElementById('settings-avatar-preview');
        avatarPreview.src = user.avatar || 'images/default-avatar.png';

        // ADD THIS: Set user ID badge
        const userIdBadge = document.getElementById('user-id-badge');
        if (user.isGuest) {
            userIdBadge.textContent = 'GUEST';
            userIdBadge.className = 'user-id-badge guest-badge';
        } else {
            userIdBadge.textContent = `ID: ${user.id}`;
            userIdBadge.className = 'user-id-badge';
        }
        
        this.loadSavedTheme();

        // Guest mode adjustments
        if (user.isGuest) {
            // Disable email field
            const emailField = document.getElementById('settings-email');
            emailField.disabled = true;
            emailField.placeholder = 'Available with account';
            
            // Disable password field
            const passwordField = document.getElementById('settings-new-password');
            passwordField.disabled = true;
            passwordField.placeholder = 'Available with account';
            
            // Hide delete account section
            const deleteSection = document.querySelector('.delete-account-section');
            if (deleteSection) {
                deleteSection.style.display = 'none';
            }
            
            // Maybe make username read-only or show as "Guest"
            const usernameField = document.getElementById('settings-username');
            usernameField.value = 'Guest';
            usernameField.disabled = true;

            // Disable avatar upload
            const avatarPreview = document.getElementById('settings-avatar-preview');
            avatarPreview.style.cursor = 'not-allowed';
            avatarPreview.style.opacity = '0.6';
            avatarPreview.title = 'Avatar upload available with account';
        } else {
            // ADD THIS ELSE BLOCK - Re-enable fields for real users
            
            // Enable email field
            const emailField = document.getElementById('settings-email');
            emailField.disabled = false;
            emailField.placeholder = 'Email address';
            
            // Enable password field
            const passwordField = document.getElementById('settings-new-password');
            passwordField.disabled = false;
            passwordField.placeholder = 'New password (leave blank to keep current)';
            
            // Show delete account section
            const deleteSection = document.querySelector('.delete-account-section');
            if (deleteSection) {
                deleteSection.style.display = 'block';
            }
            
            // Enable username field
            const usernameField = document.getElementById('settings-username');
            usernameField.disabled = false;

            // Enable avatar upload
            const avatarPreview = document.getElementById('settings-avatar-preview');
            avatarPreview.style.cursor = 'pointer';
            avatarPreview.style.opacity = '1';
            avatarPreview.title = 'Click to upload new avatar';
        }
    }

    // Handle account update
    async handleAccountUpdate() {
        const user = this.authManager.getCurrentUser();
        if (!user || user.isGuest) {
            this.showFormError('settings-username', 'Cannot update guest account');
            return;
        }

        const section = document.querySelector('.settings-section');
        const username = document.getElementById('settings-username').value.trim();
        const email = document.getElementById('settings-email').value.trim();
        const newPassword = document.getElementById('settings-new-password').value;

        // Clear previous errors
        this.clearFormErrors();

        // Validation
        if (!username) {
            this.showFormError('settings-username', 'Username is required');
            return;
        }

        if (username.length < 3) {
            this.showFormError('settings-username', 'Username must be at least 3 characters');
            return;
        }

        if (!email) {
            this.showFormError('settings-email', 'Email is required');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showFormError('settings-email', 'Please enter a valid email address');
            return;
        }

        if (newPassword && newPassword.length < 6) {
            this.showFormError('settings-new-password', 'New password must be at least 6 characters');
            return;
        }

        // Check if anything actually changed
        const hasChanges = username !== user.username || 
                        email !== user.email || 
                        newPassword;

        if (!hasChanges) {
            this.showToast('No changes to save', 'info');
            return;
        }

        // Show password confirmation popup for any changes
        const currentPassword = await this.showPasswordConfirmation();
        if (!currentPassword) {
            return; // User cancelled
        }

        // Add loading state
        section.classList.add('loading');

        try {
            // Prepare updates object
            const updates = { username, email, currentPassword };
            if (newPassword) {
                updates.password = newPassword;
            }
            
            // Call the auth manager's update method
            const result = await this.authManager.updateUser(updates);

            if (result.success) {
                // Clear password fields
                document.getElementById('settings-new-password').value = '';

                let message = 'Account updated successfully!';
                if (username !== user.username) {
                    message = `Account updated! Welcome, ${username}!`;
                }

                this.showToast(message, 'success');
            } else {
                this.showFormError('settings-username', result.error || 'Update failed');
            }

        } catch (error) {
            console.error('Account update error:', error);
            this.showFormError('settings-username', 'Update failed. Please try again.');
        } finally {
            section.classList.remove('loading');
        }
    }

    // Add this new method
    async showPasswordConfirmation() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h3>Confirm Changes</h3>
                    </div>
                    <div class="modal-body">
                        <p>Please enter your current password to save changes:</p>
                        <input type="password" id="confirm-password" placeholder="Current password">
                        <div class="form-actions">
                            <button class="btn-primary" id="confirm-btn">Confirm</button>
                            <button class="btn-secondary" id="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.getElementById('confirm-password').focus();
            
            document.getElementById('confirm-btn').addEventListener('click', () => {
                const password = document.getElementById('confirm-password').value;
                if (password) {
                    modal.remove();
                    resolve(password);
                }
            });
            
            document.getElementById('cancel-btn').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
        });
    }

    // FIXED: Handle avatar upload with userContext in URL parameters
    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const user = this.authManager.getCurrentUser();
        if (!user) {
            this.showToast('Please log in to upload an avatar', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showToast('Image must be smaller than 2MB', 'error');
            return;
        }

        try {
            // Show loading state
            const avatarSection = document.querySelector('.settings-section');
            avatarSection.classList.add('loading');

            // Get user context and encode it for URL
            const userContext = this.authManager.getUserContext();
            const userContextParam = encodeURIComponent(JSON.stringify(userContext));

            // Create FormData for file upload (without userContext in body)
            const formData = new FormData();
            formData.append('avatar', file);

            // FIXED: Send userContext as URL parameter instead of form data
            const uploadUrl = `${this.apiBase}/api/user/avatar?userContext=${userContextParam}`;

            console.log('🔄 Uploading avatar with URL:', uploadUrl);

            // Upload to server with userContext in URL
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData // Only file in body, userContext in URL
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Update avatar preview with strong cache busting
                const avatarPreview = document.getElementById('settings-avatar-preview');
                const userAvatar = document.getElementById('user-avatar');
                
                // Create new URL with timestamp for cache busting
                const baseAvatarUrl = result.avatarUrl.split('&t=')[0]; // Remove any existing timestamp
                const avatarUrl = baseAvatarUrl + '&t=' + Date.now();
                
                console.log('🖼️ Updating avatar URLs to:', avatarUrl);
                
                // Update both preview and main avatar with cache busting
                avatarPreview.src = avatarUrl;
                if (userAvatar) {
                    userAvatar.src = avatarUrl;
                }

                // Update current user's avatar URL in auth manager
                if (this.authManager.currentUser) {
                    this.authManager.currentUser.avatar = baseAvatarUrl;
                    this.authManager.updateUserDisplay();
                }

                this.showToast('Avatar updated successfully!', 'success');
            } else {
                throw new Error(result.error || 'Upload failed');
            }

        } catch (error) {
            console.error('Avatar upload error:', error);
            this.showToast('Failed to upload avatar: ' + error.message, 'error');
        } finally {
            // Clear the file input
            event.target.value = '';
            
            // Remove loading state
            const avatarSection = document.querySelector('.settings-section');
            avatarSection.classList.remove('loading');
        }
    }

    // Reset avatar to default (removes custom avatar file)
    async resetAvatar() {
        const user = this.authManager.getCurrentUser();
        if (!user) return;

        try {
            // Show loading state
            const avatarSection = document.querySelector('.settings-section');
            avatarSection.classList.add('loading');

            // Get user settings folder and remove avatar file
            const userContext = this.authManager.getUserContext();
            
            // For reset, we can just call the avatar endpoint without a file
            // The server will serve the default avatar
            const avatarUrl = `/api/user/avatar?userContext=${encodeURIComponent(JSON.stringify(userContext))}`;
            
            // Update preview to default
            const avatarPreview = document.getElementById('settings-avatar-preview');
            avatarPreview.src = 'images/default-avatar.png';

            // Update current user's avatar URL
            if (this.authManager.currentUser) {
                this.authManager.currentUser.avatar = avatarUrl;
                this.authManager.updateUserDisplay();
            }

            this.showToast('Avatar reset to default', 'success');

        } catch (error) {
            console.error('Avatar reset error:', error);
            this.showToast('Failed to reset avatar', 'error');
        } finally {
            const avatarSection = document.querySelector('.settings-section');
            avatarSection.classList.remove('loading');
        }
    }

    // Handle logout
    handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            this.closeSettings();
            this.authManager.logout();
        }
    }

    // Helper functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    showFormSuccess(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('success');
        
        let successElement = formGroup.querySelector('.success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            formGroup.appendChild(successElement);
        }
        
        successElement.textContent = message;
    }

    clearFormErrors() {
        document.querySelectorAll('.settings-section .form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        document.querySelectorAll('.settings-section .error-message, .settings-section .success-message').forEach(msg => {
            msg.style.display = 'none';
        });
    }

    clearFormStates() {
        this.clearFormErrors();
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('loading');
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

    // Show delete account confirmation
    showDeleteConfirmation() {
        const user = this.authManager.getCurrentUser();
        if (!user || user.isGuest) {
            this.showToast('Cannot delete guest account', 'error');
            return;
        }

        // Create confirmation modal
        const modal = document.createElement('div');
        modal.id = 'delete-confirm-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content delete-confirm-modal">
                <div class="modal-header">
                    <h2>Delete Account</h2>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Are you absolutely sure?</h3>
                    <p><strong>This action cannot be undone.</strong></p>
                    <p>This will permanently delete your account "<strong>${user.username}</strong>" and all associated data including:</p>
                    <ul style="text-align: left; margin: var(--space-lg) 0; max-width: 400px; margin-left: auto; margin-right: auto;">
                        <li>All your Lore Codex projects</li>
                        <li>All your archived roleplays</li>
                        <li>Your custom avatar and settings</li>
                        <li>All saved data and preferences</li>
                    </ul>
                    <p style="color: var(--accent-danger); font-weight: bold;">This cannot be recovered!</p>
                    
                    <div class="form-group" style="margin-top: var(--space-xl);">
                        <label for="delete-confirm-password">Enter your password to confirm:</label>
                        <input type="password" id="delete-confirm-password" placeholder="Your current password">
                    </div>
                    
                    <div class="confirm-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                            Cancel
                        </button>
                        <button type="button" class="btn-danger" id="confirm-delete-btn">
                            <i class="fas fa-trash-alt"></i> Delete Forever
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#confirm-delete-btn').addEventListener('click', () => {
            this.handleAccountDeletion(modal);
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Focus password field
        setTimeout(() => {
            modal.querySelector('#delete-confirm-password').focus();
        }, 100);
    }

    // Handle actual account deletion
    async handleAccountDeletion(modal) {
        const user = this.authManager.getCurrentUser();
        const password = document.getElementById('delete-confirm-password').value;

        if (!password) {
            this.showFormError('delete-confirm-password', 'Password is required');
            return;
        }

        // Show loading state
        const confirmBtn = modal.querySelector('#confirm-delete-btn');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        confirmBtn.disabled = true;

        try {
            const userContext = this.authManager.getUserContext();
            
            const response = await fetch(`${this.apiBase}/api/auth/delete-account`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Account deleted successfully
                modal.remove();
                this.closeSettings();
                
                // Clear session and redirect to login
                this.authManager.logout();
                this.showToast('Account deleted successfully', 'success');
            } else {
                this.showFormError('delete-confirm-password', result.error || 'Deletion failed');
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
            }

        } catch (error) {
            console.error('Account deletion error:', error);
            this.showFormError('delete-confirm-password', 'Deletion failed. Please try again.');
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }
}

// Initialize settings system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();

    // Add this inside the DOMContentLoaded event listener, after mainManager initialization
    setTimeout(() => {
        // Load saved theme on page load
        const preferences = JSON.parse(localStorage.getItem('writingTools_preferences') || '{}');
        if (preferences.theme && preferences.theme !== 'default') {
            // Load and apply saved theme
            fetch('themes/themes.json')
                .then(response => response.json())
                .then(themes => {
                    if (themes[preferences.theme]) {
                        const theme = themes[preferences.theme];
                        const root = document.documentElement;
                        Object.entries(theme.colors).forEach(([property, value]) => {
                            root.style.setProperty(`--${property}`, value);
                        });
                    }
                })
                .catch(console.error);
        }
    }, 150);
});