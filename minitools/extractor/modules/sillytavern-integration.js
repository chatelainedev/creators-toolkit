// SillyTavern Integration for Lorebook Extractor
// Send lorebooks to SillyTavern user profiles

class ExtractorSTIntegration {
    constructor(extractorApp) {
        this.extractorApp = extractorApp;
        this.currentEntries = null;
        this.currentProjectName = null;
        this.availableProfiles = [];
        this.setupModal();
        this.setupEventListeners();
    }

    // Setup the profile selection modal
    setupModal() {
        // Create modal HTML
        const modalHtml = `
            <div id="extractor-st-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content folder-edit-modal">
                    <div class="modal-header">
                        <h3>Send to SillyTavern</h3>
                        <button id="extractor-st-modal-close" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="extractor-st-profile-select">Select SillyTavern Profile:</label>
                            <select id="extractor-st-profile-select" class="edit-select">
                                <option value="">Loading profiles...</option>
                            </select>
                            <small style="color: var(--text-tertiary); margin-top: var(--space-xs); display: block;">
                                Lorebook will be saved to the selected profile's worlds folder
                            </small>
                        </div>

                        <div class="st-helper-message" style="display: flex; align-items: flex-start; gap: var(--space-sm); padding: var(--space-md); background: var(--bg-tertiary); border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); margin: var(--space-md) 0;">
                            <div style="color: var(--accent-primary); font-size: var(--font-size-md); margin-top: 2px;">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div style="flex: 1; font-size: var(--font-size-sm); line-height: 1.4;">
                                <strong style="color: var(--text-primary);">Note:</strong> The lorebook will be saved as a .json file in the selected profile's worlds folder. If a file with the same name exists, it will be overwritten.
                            </div>
                        </div>

                        <div class="st-helper-message" style="display: flex; align-items: flex-start; gap: var(--space-sm); padding: var(--space-md); background: var(--bg-tertiary); border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); margin: var(--space-md) 0;">
                            <div style="color: var(--accent-primary); font-size: var(--font-size-md); margin-top: 2px;">
                                <i class="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <div style="flex: 1; font-size: var(--font-size-sm); line-height: 1.4;">
                                <strong style="color: var(--text-primary);">IMPORTANT!</strong> Make sure SillyTavern isn't running before sending.
                            </div>
                        </div>

                        <div id="extractor-st-project-info" class="form-group" style="display: none;">
                            <div style="background: var(--bg-tertiary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-secondary);">
                                <div style="display: flex; align-items: center; gap: var(--space-md);">
                                    <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--bg-quaternary); display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-book-open" style="color: var(--accent-primary);"></i>
                                    </div>
                                    <div>
                                        <div id="extractor-st-project-name" style="font-weight: 500; color: var(--text-primary);"></div>
                                        <div id="extractor-st-project-filename" style="font-size: var(--font-size-sm); color: var(--text-secondary);"></div>
                                        <div id="extractor-st-entry-count" style="font-size: var(--font-size-sm); color: var(--text-secondary);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button id="extractor-st-cancel" class="btn-secondary-text">Cancel</button>
                        <button id="extractor-st-send" class="btn-primary" disabled>
                            <i class="fas fa-paper-plane"></i> Send to SillyTavern
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    setupEventListeners() {
        // Wire up the existing send-st-btn
        const sendBtn = document.getElementById('send-st-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.showProfileSelector());
        }

        // Modal controls
        document.getElementById('extractor-st-modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('extractor-st-cancel').addEventListener('click', () => this.closeModal());
        document.getElementById('extractor-st-send').addEventListener('click', () => this.sendToSillyTavern());

        // Profile selection
        document.getElementById('extractor-st-profile-select').addEventListener('change', (e) => {
            const sendBtn = document.getElementById('extractor-st-send');
            sendBtn.disabled = !e.target.value;
        });

        // Close on ESC or overlay click
        document.getElementById('extractor-st-modal').addEventListener('click', (e) => {
            if (e.target.id === 'extractor-st-modal') this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('extractor-st-modal').style.display !== 'none') {
                this.closeModal();
            }
        });
    }

    // Show the profile selection modal
    async showProfileSelector() {
        // Check if ST integration is available
        if (!this.isAvailable()) {
            return;
        }

        // Get current filtered entries and project
        this.currentEntries = this.extractorApp.filteredEntries || [];
        this.currentProjectName = this.extractorApp.currentProject || 'Untitled Project';

        if (this.currentEntries.length === 0) {
            showToast('warning', 'No visible entries to export');
            return;
        }
        
        // Show modal
        document.getElementById('extractor-st-modal').style.display = 'flex';
        
        // Update project info display
        this.updateProjectInfo();
        
        // Load profiles
        await this.loadProfiles();
    }

    // Update project info in modal
    updateProjectInfo() {
        const projectInfo = document.getElementById('extractor-st-project-info');
        const projectName = document.getElementById('extractor-st-project-name');
        const projectFilename = document.getElementById('extractor-st-project-filename');
        const entryCount = document.getElementById('extractor-st-entry-count');

        // Show project info
        projectInfo.style.display = 'block';
        projectName.textContent = this.currentProjectName;
        
        // Generate filename
        const cleanName = this.currentProjectName.replace(/[^a-zA-Z0-9-_\s]/g, '_');
        projectFilename.textContent = `Will be saved as: ${cleanName}.json`;
        entryCount.textContent = `${this.currentEntries.length} entries`;
    }

    // Load available SillyTavern profiles
    async loadProfiles() {
        const profileSelect = document.getElementById('extractor-st-profile-select');
        const sendBtn = document.getElementById('extractor-st-send');
        
        profileSelect.innerHTML = '<option value="">Loading profiles...</option>';
        sendBtn.disabled = true;

        try {
            const userContext = this.extractorApp.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/get-st-profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });

            if (response.ok) {
                const result = await response.json();
                this.availableProfiles = result.profiles || [];
                
                // Populate dropdown
                if (this.availableProfiles.length === 0) {
                    profileSelect.innerHTML = '<option value="">No profiles found</option>';
                } else {
                    profileSelect.innerHTML = '<option value="">Select a profile...</option>';
                    this.availableProfiles.forEach(profile => {
                        const option = document.createElement('option');
                        option.value = profile;
                        option.textContent = profile;
                        profileSelect.appendChild(option);
                    });
                }
            } else {
                throw new Error('Failed to load profiles');
            }
        } catch (error) {
            console.error('Error loading ST profiles:', error);
            profileSelect.innerHTML = '<option value="">Error loading profiles</option>';
            showToast('error', 'Failed to load SillyTavern profiles. Check your settings.');
        }
    }

    // Send lorebook to selected profile
    async sendToSillyTavern() {
        const selectedProfile = document.getElementById('extractor-st-profile-select').value;
        
        if (!selectedProfile || !this.currentEntries || !this.currentProjectName) {
            showToast('error', 'Please select a profile');
            return;
        }

        const sendBtn = document.getElementById('extractor-st-send');
        const originalText = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;

        try {
            const userContext = this.extractorApp.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/send-to-st', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    entries: this.currentEntries,
                    profile: selectedProfile,
                    projectName: this.currentProjectName
                })
            });

            if (response.ok) {
                const result = await response.json();
                showToast('success', `Lorebook sent to SillyTavern profile "${selectedProfile}"`);
                this.closeModal();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send lorebook');
            }
        } catch (error) {
            console.error('Error sending to ST:', error);
            showToast('error', `Failed to send lorebook: ${error.message}`);
        } finally {
            sendBtn.innerHTML = originalText;
            sendBtn.disabled = false;
        }
    }

    // Close the modal
    closeModal() {
        document.getElementById('extractor-st-modal').style.display = 'none';
        this.currentEntries = null;
        this.currentProjectName = null;
        
        // Reset form
        document.getElementById('extractor-st-profile-select').innerHTML = '<option value="">Select a profile...</option>';
        document.getElementById('extractor-st-send').disabled = true;
        document.getElementById('extractor-st-project-info').style.display = 'none';
    }

    // Check if ST integration is available
    isAvailable() {
        // Must be logged in
        if (!this.extractorApp.userSessionManager?.isLoggedIn()) {
            this.extractorApp.authUI?.showLoginModal();
            return false;
        }
        
        // Must have entries to export
        if (!this.extractorApp.filteredEntries || this.extractorApp.filteredEntries.length === 0) {
            showToast('warning', 'No visible entries to export');
            return false;
        }

        // Must have project name
        if (!this.extractorApp.currentProject) {
            showToast('warning', 'Please save your project first');
            return false;
        }

        return true;
    }

    // Update button state based on availability
    updateButtonState() {
        const sendBtn = document.getElementById('send-st-btn');
        if (sendBtn) {
            const isAvailable = this.isAvailable();
            sendBtn.disabled = !isAvailable;
        }
    }
}

// Initialize when extractor app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to be available
    const initST = () => {
        if (window.extractorApp) {
            window.extractorSTIntegration = new ExtractorSTIntegration(window.extractorApp);
            console.log('🚀 Extractor SillyTavern integration initialized');
            
            // Update button state when entries change
            const originalRefreshEntryList = window.extractorApp.refreshEntryList;
            window.extractorApp.refreshEntryList = function() {
                originalRefreshEntryList.call(this);
                window.extractorSTIntegration.updateButtonState();
            };
            
            // Update button state when project changes
            const originalSetCurrentProject = window.extractorApp.setCurrentProject;
            if (originalSetCurrentProject) {
                window.extractorApp.setCurrentProject = function(projectName) {
                    originalSetCurrentProject.call(this, projectName);
                    window.extractorSTIntegration.updateButtonState();
                };
            }
            
            // Initial button state update
            window.extractorSTIntegration.updateButtonState();
        } else {
            setTimeout(initST, 100);
        }
    };
    initST();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExtractorSTIntegration;
}