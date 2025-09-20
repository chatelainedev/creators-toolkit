/**
 * Notebook Theme Manager
 * Handles markdown themes and font size settings for the notebook
 */

class NotebookThemeManager {
    constructor() {
        this.themes = [
            { id: 'nord', name: 'Nord', description: 'Clean arctic blues and grays' },
            { id: 'catppuccin', name: 'Catppuccin', description: 'Warm pastels on dark' },
            { id: 'tokyo-night', name: 'Tokyo Night', description: 'Cyberpunk neon vibes' },
            { id: 'its', name: 'ITS (RPG)', description: 'Dark charcoal with red headers' },
            { id: 'ember', name: 'Ember', description: 'Ornate fantasy theme with warm colors' },
            { id: 'border', name: 'Border', description: 'Clean lines and structure' },
            { id: 'gruvbox', name: 'Gruvbox', description: 'Retro warm terminal colors' },
            { id: 'obsidian', name: 'Obsidian', description: 'Classic Obsidian feel' }
        ];
        
        this.currentTheme = 'nord';
        this.currentFontSize = 14;
        this.previewContent = null;
        
        this.init();
    }
    
    init() {
        this.previewContent = document.getElementById('preview-content');
        this.setupSettingsButton();
        
        // Don't load settings immediately - wait for auth to be ready
        this.checkAuthAndLoadSettings();
    }

    async checkAuthAndLoadSettings() {
        // Wait for auth manager to be available and user to be logged in
        let attempts = 0;
        while (attempts < 50) { // Wait up to 5 seconds
            if (window.authManager && window.authManager.getCurrentUser()) {
                await this.loadSettings();
                this.applyTheme();
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        // If no user logged in, just apply default theme
        if (attempts >= 50) {
            this.applyTheme();
        }
    }
    
    /**
     * Load theme settings from user preferences
     */
    async loadSettings() {
        try {
            const userContext = window.authManager?.getUserContext();
            if (!userContext || userContext.isGuest) return;
            
            const response = await fetch('/api/user/preferences/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (response.ok) {
                const data = await response.json();
                const preferences = data.preferences || {};
                
                this.currentTheme = preferences.markdownTheme || 'nord';
                this.currentFontSize = preferences.markdownFontSize || 14;
                
                console.log('Loaded theme settings:', { theme: this.currentTheme, fontSize: this.currentFontSize });
            }
        } catch (error) {
            console.error('Error loading theme settings:', error);
        }
    }
    
    /**
     * Save theme settings to user preferences
     */
    async saveSettings() {
        try {
            const userContext = window.authManager?.getUserContext();
            if (!userContext || userContext.isGuest) return;
            
            const preferences = {
                markdownTheme: this.currentTheme,
                markdownFontSize: this.currentFontSize
            };
            
            const response = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, preferences })
            });
            
            if (response.ok) {
                console.log('Saved theme settings:', preferences);
            } else {
                console.error('Failed to save theme settings');
            }
        } catch (error) {
            console.error('Error saving theme settings:', error);
        }
    }
    
    /**
     * Apply the current theme to the preview content
     */
    applyTheme() {
        // Try to get preview content if we don't have it yet
        if (!this.previewContent) {
            this.previewContent = document.getElementById('preview-content');
        }
        
        if (!this.previewContent) {
            // Preview content not available yet, try again later
            setTimeout(() => this.applyTheme(), 500);
            return;
        }
        
        // Remove all existing theme classes
        this.themes.forEach(theme => {
            this.previewContent.classList.remove(`markdown-theme-${theme.id}`);
        });
        
        // Add current theme class
        this.previewContent.classList.add(`markdown-theme-${this.currentTheme}`);
        
        // Apply font size
        this.previewContent.style.setProperty('--md-font-size', `${this.currentFontSize}px`);

        // ADD THIS: Apply theme to CoWriter messages too
        const cowriterContainer = document.querySelector('.cowriter-container');
        if (cowriterContainer) {
            // Remove all existing theme classes
            this.themes.forEach(theme => {
                cowriterContainer.classList.remove(`markdown-theme-${theme.id}`);
            });
            
            // Add current theme class
            cowriterContainer.classList.add(`markdown-theme-${this.currentTheme}`);
        }
    }

    // Add this method to handle tab switching
    onNotebookTabActivated() {
        // Refresh preview content reference and reapply theme
        this.previewContent = document.getElementById('preview-content');
        this.applyTheme();
    }

    onCoWriterTabActivated() {
        // Refresh cowriter container reference and reapply theme
        this.applyTheme();
    }
    
    /**
     * Set up the settings button in the editor toolbar
     */
    setupSettingsButton() {
        const settingsBtn = document.getElementById('markdown-theme-btn');
        if (!settingsBtn) return;
        
        // Add click handler
        settingsBtn.addEventListener('click', () => this.showSettingsModal());
    }
    
    /**
     * Show the theme settings modal
     */
    showSettingsModal() {
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        
        // Focus the modal for accessibility
        modal.focus();
        
        // Handle ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    /**
     * Create the settings modal HTML
     */
    createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.tabIndex = -1;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--bg-primary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-lg);
            padding: var(--space-xl);
            min-width: 400px;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                <h3 style="margin: 0; color: var(--text-primary); font-family: 'Nunito Sans', sans-serif;">Markdown Theme Settings</h3>
                <button class="close-btn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; padding: var(--space-xs);">&times;</button>
            </div>
            
            <div style="margin-bottom: var(--space-lg);">
                <label style="display: block; margin-bottom: var(--space-sm); color: var(--text-primary); font-weight: 500;">Theme:</label>
                <select class="theme-selector" style="
                    width: 100%;
                    padding: var(--space-sm);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-md);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-family: 'Nunito Sans', sans-serif;
                ">
                    ${this.themes.map(theme => `
                        <option value="${theme.id}" ${theme.id === this.currentTheme ? 'selected' : ''}>
                            ${theme.name} - ${theme.description}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: var(--space-xl);">
                <label style="display: block; margin-bottom: var(--space-sm); color: var(--text-primary); font-weight: 500;">Font Size:</label>
                <div style="display: flex; align-items: center; gap: var(--space-md);">
                    <input type="range" class="font-size-slider" min="10" max="24" value="${this.currentFontSize}" style="
                        flex: 1;
                        height: 6px;
                        border-radius: 3px;
                        background: var(--bg-tertiary);
                        outline: none;
                    ">
                    <span class="font-size-display" style="
                        min-width: 40px;
                        text-align: center;
                        color: var(--text-primary);
                        font-weight: 500;
                    ">${this.currentFontSize}px</span>
                </div>
            </div>
            
            <div style="display: flex; gap: var(--space-md); justify-content: flex-end;">
                <button class="cancel-btn" style="
                    padding: var(--space-sm) var(--space-lg);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-md);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    cursor: pointer;
                    font-family: 'Nunito Sans', sans-serif;
                ">Cancel</button>
                <button class="apply-btn" style="
                    padding: var(--space-sm) var(--space-lg);
                    border: 1px solid var(--accent-primary);
                    border-radius: var(--radius-md);
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    cursor: pointer;
                    font-family: 'Nunito Sans', sans-serif;
                    font-weight: 500;
                ">Apply</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        
        // Set up event handlers
        this.setupModalHandlers(modal);
        
        return modal;
    }
    
    /**
     * Set up event handlers for the modal
     */
    setupModalHandlers(modal) {
        const themeSelector = modal.querySelector('.theme-selector');
        const fontSizeSlider = modal.querySelector('.font-size-slider');
        const fontSizeDisplay = modal.querySelector('.font-size-display');
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const applyBtn = modal.querySelector('.apply-btn');
        
        // Store original values for cancel functionality
        const originalTheme = this.currentTheme;
        const originalFontSize = this.currentFontSize;
        
        // Theme selection handler
        themeSelector.addEventListener('change', () => {
            this.currentTheme = themeSelector.value;
            this.applyTheme();
            this.triggerPreviewUpdate();
        });
        
        // Font size slider handler
        fontSizeSlider.addEventListener('input', () => {
            this.currentFontSize = parseInt(fontSizeSlider.value);
            fontSizeDisplay.textContent = `${this.currentFontSize}px`;
            this.applyTheme();
            this.triggerPreviewUpdate();
        });
        
        // Close button handler
        closeBtn.addEventListener('click', () => {
            this.restoreOriginalSettings(originalTheme, originalFontSize);
            this.closeModal(modal);
        });
        
        // Cancel button handler
        cancelBtn.addEventListener('click', () => {
            this.restoreOriginalSettings(originalTheme, originalFontSize);
            this.closeModal(modal);
        });
        
        // Apply button handler
        applyBtn.addEventListener('click', () => {
            this.saveSettings();
            this.closeModal(modal);
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.restoreOriginalSettings(originalTheme, originalFontSize);
                this.closeModal(modal);
            }
        });
    }
    
    /**
     * Restore original settings when canceling
     */
    restoreOriginalSettings(originalTheme, originalFontSize) {
        this.currentTheme = originalTheme;
        this.currentFontSize = originalFontSize;
        this.applyTheme();
        this.triggerPreviewUpdate();
    }
    
    /**
     * Close the modal
     */
    closeModal(modal) {
        modal.remove();
    }
    
    /**
     * Trigger a preview update in the notebook manager
     */
    triggerPreviewUpdate() {
        if (window.notebookManager && window.notebookManager.updatePreview) {
            window.notebookManager.updatePreview();
        }
    }
    
    /**
     * Called when user logs in - reload settings
     */
    onUserLoggedIn() {
        this.loadSettings().then(() => {
            this.applyTheme();
            this.triggerPreviewUpdate();
        });
    }
    
    /**
     * Called when user logs out - reset to defaults
     */
    onUserLoggedOut() {
        this.currentTheme = 'nord';
        this.currentFontSize = 14;
        this.applyTheme();
        this.triggerPreviewUpdate();
    }
    
    /**
     * Get current theme info
     */
    getCurrentTheme() {
        return this.themes.find(t => t.id === this.currentTheme) || this.themes[0];
    }
    
    /**
     * Set theme programmatically
     */
    setTheme(themeId) {
        if (this.themes.some(t => t.id === themeId)) {
            this.currentTheme = themeId;
            this.applyTheme();
            this.triggerPreviewUpdate();
            this.saveSettings();
        }
    }
    
    /**
     * Set font size programmatically
     */
    setFontSize(size) {
        if (size >= 10 && size <= 24) {
            this.currentFontSize = size;
            this.applyTheme();
            this.triggerPreviewUpdate();
            this.saveSettings();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other managers to initialize
    setTimeout(() => {
        window.notebookThemeManager = new NotebookThemeManager();
    }, 100);
});