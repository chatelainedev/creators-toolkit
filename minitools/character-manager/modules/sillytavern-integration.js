// SillyTavern Integration - Send characters to SillyTavern user profiles

class SillyTavernIntegration {
    constructor(characterManager) {
        this.characterManager = characterManager;
        this.currentCharacter = null;
        this.availableProfiles = [];
        this.setupModal();
    }

    // Setup the profile selection modal
    setupModal() {
        // Create modal HTML
        const modalHtml = `
            <div id="st-profile-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content folder-edit-modal">
                    <div class="modal-header">
                        <h3>Send to SillyTavern</h3>
                        <button id="st-profile-modal-close" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="st-profile-select">Select SillyTavern Profile:</label>
                            <select id="st-profile-select" class="edit-select">
                                <option value="">Loading profiles...</option>
                            </select>
                            <small style="color: var(--text-tertiary); margin-top: var(--space-xs); display: block;">
                                Character will be saved to the selected profile's characters folder
                            </small>
                        </div>

                        <!-- ADD THIS HELPER MESSAGE -->
                        <div class="st-helper-message" style="display: flex; align-items: flex-start; gap: var(--space-sm); padding: var(--space-md); background: var(--bg-tertiary); border: 1px solid var(--border-secondary); border-radius: var(--radius-sm); margin: var(--space-md) 0;">
                            <div style="color: var(--accent-primary); font-size: var(--font-size-md); margin-top: 2px;">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div style="flex: 1; font-size: var(--font-size-sm); line-height: 1.4;">
                                <strong style="color: var(--text-primary);">Note:</strong> After sending the character, you'll need to refresh SillyTavern to see the new character in your character list.
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
                        
                        <div id="st-character-info" class="form-group" style="display: none;">
                            <div style="background: var(--bg-tertiary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-secondary);">
                                <div style="display: flex; align-items: center; gap: var(--space-md);">
                                    <div id="st-character-preview" style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--bg-quaternary); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                        <i class="fas fa-user" style="color: var(--text-tertiary);"></i>
                                    </div>
                                    <div>
                                        <div id="st-character-name" style="font-weight: 500; color: var(--text-primary);"></div>
                                        <div id="st-character-filename" style="font-size: var(--font-size-sm); color: var(--text-secondary);"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button id="st-profile-cancel" class="btn-secondary-text">Cancel</button>
                        <button id="st-profile-send" class="btn-primary" disabled>
                            <i class="fas fa-paper-plane"></i> Send to SillyTavern
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('st-profile-modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('st-profile-cancel').addEventListener('click', () => this.closeModal());
        document.getElementById('st-profile-send').addEventListener('click', () => this.sendToSillyTavern());

        // Profile selection
        document.getElementById('st-profile-select').addEventListener('change', (e) => {
            const sendBtn = document.getElementById('st-profile-send');
            sendBtn.disabled = !e.target.value;
        });

        // Close on ESC or overlay click
        document.getElementById('st-profile-modal').addEventListener('click', (e) => {
            if (e.target.id === 'st-profile-modal') this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('st-profile-modal').style.display !== 'none') {
                this.closeModal();
            }
        });
    }

    // Check if ST integration is available for a character
    isAvailable(character) {
        // Must have ST path configured
        if (!this.characterManager.userSessionManager?.isLoggedIn()) return false;
        
        // Must have at least one avatar with originalFile for PNG export
        if (!character.avatars || character.avatars.length === 0) return false;
        
        const hasValidAvatar = character.avatars.some(avatar => avatar.originalFile || avatar.tempOriginalFile);
        if (!hasValidAvatar) return false;

        return true;
    }

    // Show the profile selection modal for a character
    async showProfileSelector(character) {
        this.currentCharacter = character;
        
        // Show modal
        document.getElementById('st-profile-modal').style.display = 'flex';
        
        // Update character info display
        this.updateCharacterInfo(character);
        
        // Load profiles
        await this.loadProfiles();
    }

    // Update character info in modal
    updateCharacterInfo(character) {
        const characterInfo = document.getElementById('st-character-info');
        const characterPreview = document.getElementById('st-character-preview');
        const characterName = document.getElementById('st-character-name');
        const characterFilename = document.getElementById('st-character-filename');

        // Show character info
        characterInfo.style.display = 'block';
        characterName.textContent = character.name || 'Untitled Character';
        
        // Generate filename
        const cleanName = (character.name || 'character').replace(/[^a-zA-Z0-9-_\s]/g, '_');
        characterFilename.textContent = `Will be saved as: ${cleanName}.png`;

        // Update preview image
        if (character.avatarThumbnail) {
            characterPreview.innerHTML = `<img src="${character.avatarThumbnail}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            characterPreview.innerHTML = '<i class="fas fa-user" style="color: var(--text-tertiary);"></i>';
        }
    }

    // Load available SillyTavern profiles
    async loadProfiles() {
        const profileSelect = document.getElementById('st-profile-select');
        const sendBtn = document.getElementById('st-profile-send');
        
        profileSelect.innerHTML = '<option value="">Loading profiles...</option>';
        sendBtn.disabled = true;

        try {
            const userContext = this.characterManager.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/get-st-profiles', {
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

    // Send character to selected profile
    async sendToSillyTavern() {
        const selectedProfile = document.getElementById('st-profile-select').value;
        
        if (!selectedProfile || !this.currentCharacter) {
            showToast('error', 'Please select a profile');
            return;
        }

        const sendBtn = document.getElementById('st-profile-send');
        const originalText = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;

        try {
            const userContext = this.characterManager.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/send-to-st', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    character: this.currentCharacter,
                    profile: selectedProfile,
                    projectName: this.characterManager.currentProject
                })
            });

            if (response.ok) {
                const result = await response.json();
                showToast('success', `Character sent to SillyTavern profile "${selectedProfile}"`);
                this.closeModal();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send character');
            }
        } catch (error) {
            console.error('Error sending to ST:', error);
            showToast('error', `Failed to send character: ${error.message}`);
        } finally {
            sendBtn.innerHTML = originalText;
            sendBtn.disabled = false;
        }
    }

    // Close the modal
    closeModal() {
        document.getElementById('st-profile-modal').style.display = 'none';
        this.currentCharacter = null;
        
        // Reset form
        document.getElementById('st-profile-select').innerHTML = '<option value="">Select a profile...</option>';
        document.getElementById('st-profile-send').disabled = true;
        document.getElementById('st-character-info').style.display = 'none';
    }

    // Generate context menu item for character
    getContextMenuItem(character) {
        if (!this.isAvailable(character)) {
            return null; // Don't show if not available
        }

        return {
            icon: 'fas fa-paper-plane',
            text: 'Send to SillyTavern',
            action: () => this.showProfileSelector(character)
        };
    }
}

// Initialize when character manager is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to be available
    const initST = () => {
        if (window.app) {
            window.sillyTavernIntegration = new SillyTavernIntegration(window.app);
            console.log('🚀 SillyTavern integration initialized');
        } else {
            setTimeout(initST, 100);
        }
    };
    initST();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SillyTavernIntegration;
}