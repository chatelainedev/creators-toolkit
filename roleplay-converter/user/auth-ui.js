// Simplified Authentication UI for RP Archiver
// Matches the pattern from Info Converter

class AuthUI {
    constructor(userSessionManager) {
        this.userSession = userSessionManager;
        this.modalId = 'roleplay-auth-modal';
        this.currentTab = 'login';
        this.isModalOpen = false;
    }

    // Show login modal
    showLoginModal() {
        if (this.isModalOpen) return;

        this.createModal();
        this.isModalOpen = true;
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = document.querySelector(`#${this.modalId} input`);
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Create and inject modal into DOM
    createModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById(this.modalId);
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'modal-overlay auth-modal-overlay';
        modal.innerHTML = this.getModalHTML();

        document.body.appendChild(modal);
        this.attachEventListeners();
        
        // Show modal with animation
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 10);
    }

    // Generate modal HTML
    getModalHTML() {
        return `
            <div class="modal-content auth-modal-content">
                <div class="modal-header">
                    <h2>Welcome to RP Archiver</h2>
                    <button class="close-btn" id="rp-auth-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="auth-tabs">
                    <button class="auth-tab ${this.currentTab === 'login' ? 'active' : ''}" data-tab="login">
                        Login
                    </button>
                    <button class="auth-tab ${this.currentTab === 'register' ? 'active' : ''}" data-tab="register">
                        Register
                    </button>
                </div>

                <!-- Login Form -->
                <div class="auth-form ${this.currentTab === 'login' ? 'active' : ''}" id="rp-login-form">
                    <p class="auth-subtitle">Sign in to save your roleplay projects</p>
                    <form id="rp-login-form-element">
                        <div class="form-group">
                            <label for="rp-login-username">Username or Email:</label>
                            <input type="text" id="rp-login-username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="rp-login-password">Password:</label>
                            <input type="password" id="rp-login-password" name="password" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Login</button>
                        </div>
                    </form>
                </div>

                <!-- Register Form -->
                <div class="auth-form ${this.currentTab === 'register' ? 'active' : ''}" id="rp-register-form">
                    <p class="auth-subtitle">Create an account to save your roleplay projects</p>
                    <form id="rp-register-form-element">
                        <div class="form-group">
                            <label for="rp-register-username">Username:</label>
                            <input type="text" id="rp-register-username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="rp-register-email">Email:</label>
                            <input type="email" id="rp-register-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="rp-register-password">Password:</label>
                            <input type="password" id="rp-register-password" name="password" required>
                        </div>
                        <div class="form-group">
                            <label for="rp-register-confirm">Confirm Password:</label>
                            <input type="password" id="rp-register-confirm" name="confirmPassword" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Attach event listeners to modal elements
    attachEventListeners() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;

        // Close modal events
        modal.querySelector('#rp-auth-modal-close').addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Tab switching
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Form submissions
        modal.querySelector('#rp-login-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        modal.querySelector('#rp-register-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // ESC key to close
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    // Handle keyboard events
    handleKeydown(e) {
        if (e.key === 'Escape' && this.isModalOpen) {
            this.closeModal();
        }
    }

    // Switch between tabs
    switchTab(tabName) {
        this.currentTab = tabName;
        const modal = document.getElementById(this.modalId);
        if (!modal) return;

        // Update tab buttons
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        modal.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update form visibility
        modal.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        modal.querySelector(`#rp-${tabName}-form`).classList.add('active');

        // Clear any errors
        this.clearFormErrors();
    }

    // Handle login form submission
    async handleLogin() {
        const form = document.getElementById('rp-login-form-element');
        const username = document.getElementById('rp-login-username').value.trim();
        const password = document.getElementById('rp-login-password').value;

        this.clearFormErrors();

        if (!username || !password) {
            this.showFormError('rp-login-username', 'Please fill in all fields');
            return;
        }

        // Show loading state
        form.classList.add('loading');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        try {
            const result = await this.userSession.login(username, password);
            
            if (result.success) {
                this.userSession.showToast('Welcome back!', 'success');
                this.closeModal();
            } else {
                this.showFormError('rp-login-password', result.error);
            }
        } catch (error) {
            this.showFormError('rp-login-username', 'Login failed. Please try again.');
        } finally {
            form.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Handle register form submission
    async handleRegister() {
        const form = document.getElementById('rp-register-form-element');
        const username = document.getElementById('rp-register-username').value.trim();
        const email = document.getElementById('rp-register-email').value.trim();
        const password = document.getElementById('rp-register-password').value;
        const confirmPassword = document.getElementById('rp-register-confirm').value;

        this.clearFormErrors();

        // Validation
        // Validation
        if (!username || !password || !confirmPassword) {
            this.showFormError('rp-register-username', 'Please fill in all required fields');
            return;
        }

        if (username.length < 3) {
            this.showFormError('rp-register-username', 'Username must be at least 3 characters');
            return;
        }

        if (email && !this.isValidEmail(email)) {
            this.showFormError('rp-register-email', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showFormError('rp-register-password', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showFormError('rp-register-confirm', 'Passwords do not match');
            return;
        }

        // Show loading state
        form.classList.add('loading');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;

        try {
            const result = await this.userSession.register(username, email, password);
            
            if (result.success) {
                this.userSession.showToast('Account created successfully!', 'success');
                this.closeModal();
            } else {
                this.showFormError('rp-register-username', result.error);
            }
        } catch (error) {
            this.showFormError('rp-register-username', 'Registration failed. Please try again.');
        } finally {
            form.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Handle guest mode selection
    handleGuestMode() {
        this.userSession.setGuestMode();
        this.userSession.updateUserDisplay();
        this.userSession.showToast('Continuing as guest', 'info');
        this.closeModal();
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        
        this.isModalOpen = false;
        document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }

    // Show form error
    showFormError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

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

    // Clear form errors
    clearFormErrors() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;

        modal.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        modal.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show logout confirmation
    showLogoutConfirmation() {
        if (confirm('Are you sure you want to logout?')) {
            this.userSession.logout();
            this.userSession.showToast('Logged out successfully', 'info');
        }
    }
}

// Global instance
let authUI = null;

// Initialize auth UI
function initializeAuthUI(userSessionManager) {
    if (!authUI) {
        authUI = new AuthUI(userSessionManager);
    }
    return authUI;
}

// Export for use in other files
window.AuthUI = AuthUI;
window.authUI = authUI;
window.initializeAuthUI = initializeAuthUI;