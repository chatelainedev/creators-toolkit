// Main JavaScript - Main Page Logic
// Add this to the top of your main.js file to prevent premature clearing
class MainPageManager {
    constructor() {
        this.currentTab = 'tools'; // Track current tab
        this.isNavigating = false; // Track if we're intentionally navigating
        this.initializeMainPage();
        this.hideAIFeaturesIfNeeded();
    }

    // Initialize main page functionality
    initializeMainPage() {
        this.setupCardInteractions();
        this.setupKeyboardShortcuts();
        this.handleImageErrors();
        this.initializeTabSystem();
    }

    // Hide AI features if setting is disabled
    async hideAIFeaturesIfNeeded() {
        try {
            // Wait for auth manager to be ready
            while (!window.authManager) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            const preferences = await window.authManager.loadUserPreferences();
            const aiToolsEnabled = preferences.aiToolsEnabled || false;
            
            // Get the elements
            const cowriterTab = document.querySelector('[data-tab="cowriter"]');
            const managersDropdown = document.querySelector('.nav-dropdown');
            
            if (!aiToolsEnabled) {
                // Hide features
                if (cowriterTab) {
                    cowriterTab.style.display = 'none';
                }
                if (managersDropdown) {
                    managersDropdown.style.display = 'none';
                }
                console.log('🚫 AI features hidden (user preference)');
            } else {
                // Actively SHOW features (in case they were hidden by previous user)
                if (cowriterTab) {
                    cowriterTab.style.display = '';
                }
                if (managersDropdown) {
                    managersDropdown.style.display = '';
                }
                console.log('✅ AI features shown (user preference)');
            }
        } catch (error) {
            console.error('Error checking AI tools setting:', error);
        }
    }

    // Show AI features (called when logging out or when setting is enabled)
    showAIFeatures() {
        // Show CoWriter tab
        const cowriterTab = document.querySelector('[data-tab="cowriter"]');
        if (cowriterTab) {
            cowriterTab.style.display = '';
        }
        
        // Show Managers dropdown
        const managersDropdown = document.querySelector('.nav-dropdown');
        if (managersDropdown) {
            managersDropdown.style.display = '';
        }
        
        console.log('✅ AI features shown');
    }

    // Initialize tab system
    initializeTabSystem() {
        // Set default tab to tools
        this.switchTab('tools');
        
        // Handle tab switching when My Sites loads
        if (window.mySitesManager) {
            // If My Sites tab becomes active and user is logged in, load sites
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const mySitesContent = document.getElementById('my-sites-content');
                        if (mySitesContent && mySitesContent.classList.contains('active')) {
                            if (window.authManager && window.authManager.getCurrentUser()) {
                                window.mySitesManager.refresh();
                            }
                        }
                    }
                });
            });
            
            const mySitesContent = document.getElementById('my-sites-content');
            if (mySitesContent) {
                observer.observe(mySitesContent, { attributes: true });
            }
        }
    }

    // Switch tab functionality
    switchTab(tabName) {                
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activate selected tab
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-content`);

        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeContent.classList.add('active');

            // Handle tab-specific logic
            if (tabName === 'my-sites') {
                this.handleMySitesTabActivated();
            } else if (tabName === 'cowriter') {
                this.handleCoWriterTabActivated();
            } else if (tabName === 'notebook') {
                this.handleNotebookTabActivated();
            }
        }
    }

    // Handle My Sites tab activation
    handleMySitesTabActivated() {
        // Check if user is logged in (use AuthManager)
        if (!window.authManager || !window.authManager.getCurrentUser()) {
            // Show message to log in
            if (window.mySitesManager) {
                window.mySitesManager.showEmptyState('Please log in to view your sites.');
            }
            return;
        }

        // Load sites if My Sites manager is available
        if (window.mySitesManager) {
            window.mySitesManager.refresh();
        }
    }

    // Handle Notebook tab activation
    // Handle Notebook tab activation
    handleNotebookTabActivated() {
        // Check if user is logged in
        if (!window.authManager || !window.authManager.getCurrentUser()) {
            if (window.notebookManager) {
                window.notebookManager.clearUserData();
            }
            return;
        }

        // Load notebook data if manager is available
        if (window.notebookManager) {
            window.notebookManager.onUserLoggedIn();
        }
        
        // Apply theme when notebook tab becomes active
        if (window.notebookThemeManager) {
            window.notebookThemeManager.onNotebookTabActivated();
        }
    }

    // Handle CoWriter tab activation
    handleCoWriterTabActivated() {
        // Check if user is logged in
        if (!window.authManager || !window.authManager.getCurrentUser()) {
            // For CoWriter, we can still allow guest usage, but with limited features
            if (window.coWriterManager) {
                window.coWriterManager.onGuestAccess();
            }
            return;
        }

        // Load CoWriter data if manager is available
        if (window.coWriterManager) {
            window.coWriterManager.onUserLoggedIn();
        }
        
        // ADD THIS LINE:
        if (window.notebookThemeManager) {
            window.notebookThemeManager.onCoWriterTabActivated();
        }
    }

    // Setup card click interactions
    setupCardInteractions() {
        // Handle card clicks (entire card is clickable)
        document.querySelectorAll('.tool-card, .mini-tool-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't navigate if clicking the button directly (let button handle it)
                if (e.target.closest('.card-launch-btn')) {
                    return;
                }

                // For mini-cards, handle directly since they don't have buttons
                if (card.classList.contains('mini-tool-card')) {
                    this.handleMiniToolLaunch(card);
                    return;
                }
                
                const button = card.querySelector('.card-launch-btn');
                if (button) {
                    this.handleToolLaunch(button);
                }
            });

            // Add keyboard navigation
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();

                    if (card.classList.contains('mini-tool-card')) {
                        this.handleMiniToolLaunch(card);
                        return;
                    }

                    const button = card.querySelector('.card-launch-btn');
                    if (button) {
                        this.handleToolLaunch(button);
                    }
                }
            });
        });

        // Handle direct button clicks
        document.querySelectorAll('.card-launch-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click handler
                this.handleToolLaunch(button);
            });
        });
    }

    // Handle tool launch
    async handleToolLaunch(button) {
        const card = button.closest('.tool-card');
        const url = button.dataset.url;
        const toolType = card.dataset.tool;
        
        if (!url) {
            this.showToast('Tool URL not configured', 'error');
            return;
        }

        // IMMEDIATELY set navigation flag to prevent beforeunload interference
        this.isNavigating = true;
        console.log('🚀 Starting tool launch, isNavigating set to true');

        // Special handling for info-converter (bat file)
        if (toolType === 'info-converter') {
            await this.handleInfoConverterLaunch(card, url);
            return;
        }

        // Handle other tools normally
        await this.handleRegularToolLaunch(card, url, toolType);
    }

    // Handle info converter launch (bat file + server check)
    async handleInfoConverterLaunch(card, url) {
        const toolType = 'info-converter';
        
        console.log('🚀 Starting Lore Codex launch...');
        console.log(`🏁 isNavigating flag: ${this.isNavigating}`);
        
        // Show global navigation loading FIRST and wait for it to appear
        if (window.authManager) {
            console.log('📱 Showing navigation loading for Lore Codex...');
            window.authManager.showNavigationLoading(toolType);
            
            // Wait a moment for the loading overlay to actually appear
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Add subtle card loading state
        card.classList.add('loading');

        try {
            // Check if the server is already running
            const infoConverterUrl = 'http://localhost:9000/info-converter';
            const isServerRunning = await this.checkServerStatus(infoConverterUrl);
            
            if (isServerRunning) {
                // Server is running, but wait a bit more for better UX
                console.log('✅ Server is running, waiting 2 seconds then navigating...');
                console.log(`🏁 isNavigating flag before navigation: ${this.isNavigating}`);
                
                // Wait additional time so user can see the loading
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                window.location.href = infoConverterUrl;
            } else {
                // Server not running, hide loading and show instructions
                console.log('❌ Server not running, showing instructions...');
                this.isNavigating = false; // Reset flag since we're not navigating
                if (window.authManager) {
                    window.authManager.hideGlobalLoading();
                }
                this.showServerStartInstructions(toolType);
            }
        } catch (error) {
            console.error('Error checking Lore Codex:', error);
            this.isNavigating = false; // Reset flag on error
            if (window.authManager) {
                window.authManager.hideGlobalLoading();
            }
            this.showServerStartInstructions(toolType);
        } finally {
            card.classList.remove('loading');
        }
    }

    // Show instructions for starting the server manually
    showServerStartInstructions(toolType) {
        // Create a custom modal for server start instructions
        this.showServerModal();
    }

    // Show server start modal
    showServerModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('server-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'server-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="width: 90%; max-width: 500px;">
                <div class="modal-header">
                    <h3>Start Lore Codex Server</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-xl);">
                    <p style="margin-bottom: var(--space-lg); color: var(--text-secondary);">
                        The Lore Codex server is not running. Please follow these steps:
                    </p>
                    
                    <ol style="color: var(--text-primary); margin-bottom: var(--space-xl); padding-left: var(--space-xl);">
                        <li style="margin-bottom: var(--space-sm);">Navigate to the <strong>info-converter</strong> folder</li>
                        <li style="margin-bottom: var(--space-sm);">Double-click <strong>start-server.bat</strong></li>
                        <li style="margin-bottom: var(--space-sm);">Wait for the server to start (you'll see "Server is running" message)</li>
                        <li>Click "Connect" below or try launching again</li>
                    </ol>
                    
                    <div style="display: flex; gap: var(--space-md); justify-content: center; margin-top: var(--space-xl);">
                        <button id="connect-btn" class="btn-primary">
                            <i class="fas fa-plug"></i> Connect to Server
                        </button>
                        <button id="open-folder-btn" class="btn-secondary">
                            <i class="fas fa-folder-open"></i> Open Folder
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#connect-btn').addEventListener('click', () => {
            this.tryConnectToServer();
        });

        modal.querySelector('#open-folder-btn').addEventListener('click', () => {
            // Try to open the folder (this might not work in all browsers)
            const folderPath = 'file:///' + window.location.pathname.replace('/main/', '/info-converter/').replace('index.html', '');
            window.open(folderPath, '_blank');
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Try to connect to the server
    async tryConnectToServer() {
        const connectBtn = document.getElementById('connect-btn');
        const originalText = connectBtn.innerHTML;
        
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        connectBtn.disabled = true;

        try {
            const isRunning = await this.checkServerStatus('http://localhost:9000');
            
            if (isRunning) {
                // Success! Set navigation flag and show loading
                this.isNavigating = true;
                console.log('🚀 Server found, setting navigation flag and showing loading...');
                
                if (window.authManager) {
                    window.authManager.showNavigationLoading('info-converter');
                }
                
                // Close modal
                document.getElementById('server-modal').remove();
                
                // Wait a bit for the loading to show, then navigate
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('🔗 Navigating to Lore Codex server...');
                window.location.href = 'http://localhost:9000';
            } else {
                // Still not running
                this.showToast('Server not found. Make sure start-server.bat is running.', 'warning');
                connectBtn.innerHTML = originalText;
                connectBtn.disabled = false;
            }
        } catch (error) {
            this.showToast('Connection failed. Please check if the server is running.', 'error');
            connectBtn.innerHTML = originalText;
            connectBtn.disabled = false;
        }
    }

    // Handle regular tool launch with enhanced loading
    async handleRegularToolLaunch(card, url, toolType) {
        console.log(`🚀 Launching ${toolType} - showing navigation loading`);
        console.log(`🔗 Target URL: ${url}`);
        console.log(`🏁 isNavigating flag: ${this.isNavigating}`);
        
        // Show global navigation loading IMMEDIATELY and wait for it to appear
        if (window.authManager) {
            console.log('📱 About to show navigation loading...');
            window.authManager.showNavigationLoading(toolType);
            console.log('✅ Navigation loading called');
            
            // Wait for loading overlay to appear
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Double-check that the loading overlay exists
            setTimeout(() => {
                const loadingOverlay = document.getElementById('global-loading');
                if (loadingOverlay) {
                    console.log('✅ Loading overlay confirmed present:', loadingOverlay.style.display);
                } else {
                    console.error('❌ Loading overlay not found!');
                }
            }, 50);
        } else {
            console.warn('⚠️ AuthManager not available for loading');
        }
        
        // Add subtle card loading state
        card.classList.add('loading');
        
        // Wait additional time for better UX (so user can see the loading)
        console.log('⏱️ Starting 2.5-second delay before navigation...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(`🔗 Now navigating to: ${url}`);
        console.log(`🏁 isNavigating flag at navigation time: ${this.isNavigating}`);
        
        try {
            // Navigate in same tab
            window.location.href = url;
        } catch (error) {
            console.error('Navigation error:', error);
            this.showToast('Failed to load tool', 'error');
            card.classList.remove('loading');
            this.isNavigating = false; // Reset flag on error
            
            // Hide loading on error
            if (window.authManager) {
                window.authManager.hideGlobalLoading();
            }
        }
    }

    // Handle mini-tool launch
    async handleMiniToolLaunch(card) {
        const toolType = card.dataset.tool;
        const url = card.dataset.url;
        
        if (!url) {
            this.showToast('Tool URL not configured', 'error');
            return;
        }
        
        this.isNavigating = true;
        
        if (window.authManager) {
            window.authManager.showNavigationLoading(toolType);
        }
        
        // Navigate immediately (or with minimal delay)
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }

    // Check if server is running at URL
    async checkServerStatus(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
            
            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Get display name for tool
    getToolDisplayName(toolType) {
        const names = {
            'info-converter': 'Lore Codex',
            'roleplay-converter': 'RP Archiver',
            'extractor': 'Lorebook Manager',
            'character-manager': 'Character Manager'  // ADD THIS LINE
        };
        return names[toolType] || toolType;
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check if user is typing in an input field - SKIP shortcuts if so
            const activeElement = document.activeElement;
            const isTyping = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                activeElement.contentEditable === 'true' ||
                activeElement.isContentEditable
            );
            
            // If user is typing, don't process shortcuts (except ESC)
            if (isTyping && e.key !== 'Escape') {
                return;
            }

            // ESC to close any open modals and loading states
            if (e.key === 'Escape') {
                if (window.authManager) {
                    window.authManager.hideGlobalLoading();
                }
            }
            
            // Ctrl/Cmd + K for quick access (future feature)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showToast('Quick launcher not yet implemented', 'info');
            }

            // Tab switching with number keys
            if (e.key === '1' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                this.switchTab('tools');
            } else if (e.key === '2' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                this.switchTab('my-sites');
            } else if (e.key === '3' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                this.switchTab('cowriter');
            } else if (e.key === '4' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                this.switchTab('notebook'); 
            }

            // Tool launching (only when on tools tab)
            if (this.currentTab === 'tools' && e.key >= '1' && e.key <= '2' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const toolIndex = parseInt(e.key) - 1;
                const cards = document.querySelectorAll('#tools-content .tool-card');
                
                if (cards[toolIndex]) {
                    const button = cards[toolIndex].querySelector('.card-launch-btn');
                    if (button) {
                        this.handleToolLaunch(button);
                    }
                }
            }
        });
    }

    // Handle image loading errors
    handleImageErrors() {
        document.querySelectorAll('.card-bg-image').forEach(img => {
            img.addEventListener('error', () => {
                // Create fallback gradient background
                const card = img.closest('.tool-card');
                const toolType = card.dataset.tool;
                
                let gradient;
                if (toolType === 'info-converter') {
                    gradient = 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%)';
                } else if (toolType === 'roleplay-converter') {
                    gradient = 'linear-gradient(135deg, #1a2a2a 0%, #2a3a3a 50%, #1a2a2a 100%)';
                } else {
                    gradient = 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)';
                }
                
                img.style.display = 'none';
                card.querySelector('.card-background').style.background = gradient;
                
                console.warn(`Failed to load image for ${toolType}:`, img.src);
            });

            // Also handle successful loads
            img.addEventListener('load', () => {
                console.log(`Successfully loaded image for ${img.closest('.tool-card').dataset.tool}`);
            });
        });

        // Handle avatar image errors
        document.querySelectorAll('.user-avatar, #settings-avatar-preview').forEach(img => {
            img.addEventListener('error', () => {
                img.src = 'images/default-avatar.png';
            });
        });
    }

    // Add hover sound effects (optional)
    setupSoundEffects() {
        // Could implement subtle hover sounds here
        // For now, just placeholder
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Placeholder for hover sound
            });
        });
    }

    // Utility: Show toast notification
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

    // Utility: Check if tools are accessible
    async checkToolAvailability() {
        const tools = [
            { name: 'Info Converter', url: 'info-converter/index.html' },
            { name: 'Roleplay Converter', url: 'roleplay-converter/index.html' }
        ];

        for (const tool of tools) {
            try {
                const response = await fetch(tool.url, { method: 'HEAD' });
                if (!response.ok) {
                    console.warn(`${tool.name} may not be available at ${tool.url}`);
                }
            } catch (error) {
                console.warn(`Could not check availability of ${tool.name}:`, error);
            }
        }
    }

    // Utility: Analytics/usage tracking (placeholder)
    trackToolUsage(toolName) {
        // Placeholder for analytics
        console.log(`Tool launched: ${toolName} at ${new Date().toISOString()}`);
        
        // Could store usage statistics in localStorage
        const usage = JSON.parse(localStorage.getItem('writingTools_usage') || '{}');
        usage[toolName] = (usage[toolName] || 0) + 1;
        usage.lastUsed = Date.now();
        localStorage.setItem('writingTools_usage', JSON.stringify(usage));
    }

    // Utility: Get user preferences
    getUserPreferences() {
        return JSON.parse(localStorage.getItem('writingTools_preferences') || '{}');
    }

    // Utility: Save user preferences
    saveUserPreferences(preferences) {
        const current = this.getUserPreferences();
        const updated = { ...current, ...preferences };
        localStorage.setItem('writingTools_preferences', JSON.stringify(updated));
    }

    // Method to refresh My Sites when user logs in
    onUserLoggedIn() {
        // Re-check AI features for the new user
        this.hideAIFeaturesIfNeeded();
        
        // If currently on My Sites tab, refresh it
        if (this.currentTab === 'my-sites' && window.mySitesManager) {
            window.mySitesManager.refresh();
        }
        // Refresh CoWriter data if on CoWriter tab
        if (this.currentTab === 'cowriter' && window.coWriterManager) {
            window.coWriterManager.onUserLoggedIn();
        }
        // Refresh Notebook data if on Notebook tab
        if (this.currentTab === 'notebook' && window.notebookManager) {
            window.notebookManager.onUserLoggedIn();
        }
        if (window.notebookWorkspaceManager) {
            window.notebookWorkspaceManager.onUserLoggedIn();
        }
        if (window.notebookThemeManager) {
            window.notebookThemeManager.onUserLoggedIn();
        }
        if (window.settingsManager) {
            window.settingsManager.onUserLoggedIn();
        }
    }

    // Method to clear My Sites when user logs out
    onUserLoggedOut() {
        console.log('🚪 MainPageManager.onUserLoggedOut called');
        
        // ADDED: Double-check that user is actually logged out
        setTimeout(() => {
            const user = window.authManager?.getCurrentUser();
            if (user && !user.isGuest) {
                console.log('⚠️ False logout detected - user is still logged in:', user.username);
                console.log('   Not clearing data due to false positive');
                return;
            }
            
            console.log('✅ Confirmed user logout, clearing data');
            
            // Show AI features by default when logged out (reset to visible state)
            this.showAIFeatures();
            
            // Clear My Sites if manager exists
            if (window.mySitesManager) {
                window.mySitesManager.clear('confirmed_user_logout');
            }
            // Clear CoWriter data
            if (window.coWriterManager) {
                window.coWriterManager.onUserLoggedOut();
            }
            // Clear Notebook data
            if (window.notebookManager) {
                window.notebookManager.onUserLoggedOut();
            }
            // Theme manager cleanup
            if (window.notebookThemeManager) {
                window.notebookThemeManager.onUserLoggedOut();
            }
            if (window.settingsManager) {
                window.settingsManager.onUserLoggedOut();
            }
            
            // Switch back to tools tab
            this.switchTab('tools');
        }, 100);
    }
}

// Wait for DOM and other scripts to load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure auth manager is initialized
    setTimeout(() => {
        const mainManager = new MainPageManager();
        
        // Make available globally if needed
        window.mainManager = mainManager;
        
        // Set up user session event listeners (integrate with AuthManager)
        if (window.authManager) {
            // Hook into the existing AuthManager methods
            const originalUpdateUserDisplay = window.authManager.updateUserDisplay;
            window.authManager.updateUserDisplay = function() {
                const wasLoggedIn = !!this.getCurrentUser();
                originalUpdateUserDisplay.call(this);
                
                // Check if login state changed
                const isNowLoggedIn = !!this.getCurrentUser();
                if (wasLoggedIn !== isNowLoggedIn) {
                    if (isNowLoggedIn) {
                        mainManager.onUserLoggedIn();
                    } else {
                        mainManager.onUserLoggedOut();
                    }
                }
            };
        }
        
        // Check tool availability in background
        mainManager.checkToolAvailability();
        
    }, 100);
});

// Make switchTab globally available for use by my-sites.js
window.switchToTab = function(tabName) {
    if (window.mainManager) {
        window.mainManager.switchTab(tabName);
    }
};

// Make global loading utilities available
window.showNavigationLoading = function(toolName) {
    if (window.authManager) {
        window.authManager.showNavigationLoading(toolName);
    }
};

window.hideNavigationLoading = function() {
    if (window.authManager) {
        window.authManager.hideGlobalLoading();
    }
};

// NEW: Show site loading (for My Sites navigation)
window.showSiteLoading = function(siteName) {
    if (window.authManager) {
        const message = siteName ? `Loading ${siteName}...` : 'Loading Site...';
        window.authManager.showGlobalLoading(message, 'fas fa-globe');
    }
};

// NEW: Show main page loading (for returns/back navigation)
window.showMainPageLoading = function(message = 'Loading...', duration = 500) {
    if (window.authManager) {
        window.authManager.showGlobalLoading(message, 'fas fa-home');
    }
};

// NEW: Quick flash loading for smooth transitions
window.showTransitionLoading = function(message = 'Loading...', duration = 700) {
    if (window.authManager) {
        // Use a back arrow icon for back navigation messages
        const icon = message.toLowerCase().includes('back') ? 'fas fa-arrow-left' : 'fas fa-home';
        window.authManager.showGlobalLoading(message, icon);
        setTimeout(() => {
            window.authManager.hideGlobalLoading();
        }, duration);
    }
};

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 Application back online');
    if (window.mainManager) {
        window.mainManager.isNavigating = false; // Reset state when online
    }
});

window.addEventListener('offline', () => {
    console.log('📱 Application offline');
});

// Handle page unload and back navigation properly
window.addEventListener('beforeunload', (e) => {
    const isNavigating = window.mainManager?.isNavigating || false;
    console.log('🔄 beforeunload fired, isNavigating:', isNavigating);
    
    // Only hide loading if we're NOT intentionally navigating
    if (!isNavigating) {
        console.log('⏹️ Hiding loading overlay due to unintentional navigation/refresh');
        if (window.authManager) {
            window.authManager.hideGlobalLoading();
        }
    } else {
        console.log('🚀 Keeping loading overlay visible during intentional navigation');
    }
});

// Handle when user navigates back to main page
window.addEventListener('pageshow', (e) => {
    console.log('📄 pageshow event fired, persisted:', e.persisted);
    
    // If this is a back/forward navigation (persisted = true), reset state
    if (e.persisted) {
        console.log('⬅️ User navigated back to main page');
        
        // Reset navigation state
        if (window.mainManager) {
            window.mainManager.isNavigating = false;
        }
        
        // Hide any lingering loading overlays
        if (window.authManager) {
            window.authManager.hideGlobalLoading();
        }
        
        // Simple, reliable back navigation message
        const backMessage = 'Back to Main';
        const loadingDuration = 1200; // Slightly longer duration (1.2 seconds)
        
        console.log('⬅️ Showing generic back navigation loading');
        
        // Show main page loading style briefly for smooth transition
        window.showTransitionLoading(backMessage, loadingDuration);
    }
});

// Handle visibility changes (when tab becomes active again)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('👁️ Page became visible again');
        
        // Reset navigation state in case user came back from another tab
        if (window.mainManager) {
            window.mainManager.isNavigating = false;
        }
        
        // Clear any stuck loading overlays
        setTimeout(() => {
            if (window.authManager) {
                window.authManager.hideGlobalLoading();
            }
        }, 100);
    }
});

// User context menu functionality
function initializeUserContextMenu() {
    const userAvatar = document.getElementById('user-avatar');
    const contextMenu = document.getElementById('user-context-menu');
    const settingsOption = document.getElementById('context-settings');
    const aboutOption = document.getElementById('context-about');

    if (!userAvatar || !contextMenu) return;

    // Show context menu on avatar click
    userAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Position menu below avatar
        const rect = userAvatar.getBoundingClientRect();
        contextMenu.style.left = `${rect.left - 60}px`; // Offset to center under avatar
        contextMenu.style.top = `${rect.bottom + 5}px`;
        contextMenu.style.display = 'block';
    });

    // Handle menu item clicks
    settingsOption?.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        if (window.settingsManager) {
            window.settingsManager.openSettings();
        }
    });

    aboutOption?.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        if (window.aboutManager) {
            window.aboutManager.openAbout();
        }
    });

    // Hide menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) && e.target !== userAvatar) {
            contextMenu.style.display = 'none';
        }
    });

    // Hide menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            contextMenu.style.display = 'none';
        }
    });
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add this line to your existing DOMContentLoaded handler
    initializeUserContextMenu();
});

// Wait for DOM and other scripts to load
document.addEventListener('DOMContentLoaded', () => {
    initializeUserContextMenu();
    // Small delay to ensure auth manager is initialized
    setTimeout(() => {
        const mainManager = new MainPageManager();
        
        // Make available globally if needed
        window.mainManager = mainManager;
        
        // FIXED: More robust auth state monitoring
        if (window.authManager) {
            // Hook into the existing AuthManager methods with better logic
            const originalUpdateUserDisplay = window.authManager.updateUserDisplay;
            
            // Add state tracking to prevent false positives
            let lastKnownUserId = null;
            let authCheckTimeout = null;
            
            window.authManager.updateUserDisplay = function() {
                // Clear any pending auth checks
                if (authCheckTimeout) {
                    clearTimeout(authCheckTimeout);
                }
                
                const wasLoggedIn = !!this.getCurrentUser();
                const previousUserId = lastKnownUserId;
                
                // Call the original method
                originalUpdateUserDisplay.call(this);
                
                // Get current state after update
                const currentUser = this.getCurrentUser();
                const isNowLoggedIn = !!currentUser;
                const currentUserId = currentUser ? (currentUser.isGuest ? 'guest' : currentUser.id) : null;
                
                // Only trigger state changes if the user ID actually changed
                // This prevents false positives from temporary auth issues
                if (currentUserId !== previousUserId) {
                    console.log('🔄 Auth state change detected:', { from: previousUserId, to: currentUserId });
                    
                    // Delay the state change slightly to avoid rapid toggles
                    authCheckTimeout = setTimeout(() => {
                        if (currentUserId && !previousUserId) {
                            // User logged in
                            console.log('✅ User logged in:', currentUserId);
                            mainManager.onUserLoggedIn();
                        } else if (!currentUserId && previousUserId && previousUserId !== 'guest') {
                            // Real user logged out (not just switching from/to guest)
                            console.log('👋 User logged out from:', previousUserId);
                            mainManager.onUserLoggedOut();
                        } else if (currentUserId && previousUserId && currentUserId !== previousUserId) {
                            // User switched
                            console.log('🔄 User switched:', { from: previousUserId, to: currentUserId });
                            mainManager.onUserLoggedOut();
                            setTimeout(() => mainManager.onUserLoggedIn(), 250);
                        }
                        
                        lastKnownUserId = currentUserId;
                    }, 500); // 500ms delay to avoid rapid toggles
                } else {
                    // No user change, just update the stored ID
                    lastKnownUserId = currentUserId;
                }
            };
            
            // Initialize with current user
            const currentUser = window.authManager.getCurrentUser();
            lastKnownUserId = currentUser ? (currentUser.isGuest ? 'guest' : currentUser.id) : null;
        }
        
        // Check tool availability in background
        mainManager.checkToolAvailability();
        
    }, 100);
});

// Add this function to your MainPageManager class or at the end of main.js
function initializeNavDropdown() {
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownBtn = document.querySelector('.nav-dropdown-btn');
    const dropdownMenu = document.querySelector('.nav-dropdown-menu');
    
    if (!dropdown || !dropdownBtn) return;
    
    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Handle dropdown item clicks (show loading before navigation)
    document.querySelectorAll('.nav-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const url = item.getAttribute('href');
            const toolName = item.querySelector('span').textContent;
            
            // Show loading and navigate
            if (window.mainManager) {
                window.mainManager.isNavigating = true;
            }
            
            if (window.authManager) {
                window.authManager.showNavigationLoading(toolName);
            }
            
            setTimeout(() => {
                window.location.href = url;
            }, 500);
        });
    });
}

// Call this in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeNavDropdown();
});