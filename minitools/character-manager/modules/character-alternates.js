// Character Alternates Management
// Handles alternate versions of Description, Scenario, and Example Messages

class CharacterAlternatesManager {
    constructor(app) {
        this.app = app;
        this.currentField = null;
        this.currentCharacter = null;
        
        // Field mappings
        this.fieldMappings = {
            'description': { 
                property: 'description', 
                label: 'Description',
                element: 'edit-description'
            },
            'personality': {
                property: 'personality',
                label: 'Personality',
                element: 'edit-personality'
            },
            'scenario': { 
                property: 'scenario', 
                label: 'Scenario',
                element: 'edit-scenario'
            },
            'mes_example': { 
                property: 'mes_example', 
                label: 'Example Messages',
                element: 'edit-example-messages'
            },
            'character_note': {
                property: 'depth_prompt.prompt',
                label: 'Character Note',
                element: 'edit-character-note'
            },
            'post_history': {
                property: 'post_history_instructions',
                label: 'Post-History Instructions',
                element: 'edit-post-history'
            }
        };
        
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.elements = {
            modal: document.getElementById('alternates-modal'),
            modalClose: document.getElementById('alternates-modal-close'),
            modalTitle: document.getElementById('alternates-modal-title'),
            alternatesList: document.getElementById('alternates-list'),
            addAlternateBtn: document.getElementById('add-alternate-btn'),
            cancelBtn: document.getElementById('alternates-cancel')
        };
    }

    setupEventListeners() {
        // ALT button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('alt-btn')) {
                const fieldType = e.target.dataset.field;
                this.openAlternatesModal(fieldType);
            }
        });

        // Modal controls
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.cancelBtn.addEventListener('click', () => this.closeModal());
        this.elements.addAlternateBtn.addEventListener('click', () => this.addNewAlternate());

        // Close on overlay click
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.modal.style.display === 'flex') {
                this.closeModal();
            }
        });
    }

    openAlternatesModal(fieldType) {
        if (!this.app.currentEditCharacter) return;
        
        this.currentField = fieldType;
        this.currentCharacter = this.app.currentEditCharacter;
        
        // Initialize alternates structure if it doesn't exist
        if (!this.currentCharacter.alternates) {
            this.currentCharacter.alternates = {};
        }
        
        if (!this.currentCharacter.alternates[fieldType]) {
            this.currentCharacter.alternates[fieldType] = {
                active: 0,
                versions: [this.getCurrentFieldValue(fieldType)]
            };
        }
        
        // SYNC: Save current textarea content to active alternate before displaying
        const alternates = this.currentCharacter.alternates[fieldType];
        alternates.versions[alternates.active] = this.getCurrentFieldValue(fieldType);
        
        const mapping = this.fieldMappings[fieldType];
        this.elements.modalTitle.textContent = `Alternate ${mapping.label}`;
        
        this.renderAlternatesList();
        this.elements.modal.style.display = 'flex';
    }

    closeModal() {
        this.elements.modal.style.display = 'none';
        this.currentField = null;
        this.currentCharacter = null;
        
        // Update ALT button states
        this.updateAltButtonStates();
    }

    getCurrentFieldValue(fieldType) {
        const mapping = this.fieldMappings[fieldType];
        
        // Special handling for nested depth_prompt.prompt
        if (fieldType === 'character_note') {
            return this.currentCharacter.depth_prompt?.prompt || '';
        }
        
        return this.currentCharacter[mapping.property] || '';
    }

    setCurrentFieldValue(fieldType, value) {
        const mapping = this.fieldMappings[fieldType];
        
        // Special handling for nested depth_prompt.prompt
        if (fieldType === 'character_note') {
            if (!this.currentCharacter.depth_prompt) {
                this.currentCharacter.depth_prompt = { depth: 4, role: 'system' };
            }
            this.currentCharacter.depth_prompt.prompt = value;
        } else {
            this.currentCharacter[mapping.property] = value;
        }
        
        // Update the form field
        const element = document.getElementById(mapping.element);
        if (element) {
            element.value = value;
            // Trigger input event to update token counters
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
        }
    }

    renderAlternatesList() {
        if (!this.currentField || !this.currentCharacter.alternates[this.currentField]) return;
        
        const alternates = this.currentCharacter.alternates[this.currentField];
        const activeIndex = alternates.active || 0;
        
        let html = '';
        
        alternates.versions.forEach((content, index) => {
            const isActive = index === activeIndex;
            const isEmpty = !content || content.trim() === '';
            
            html += `
                <div class="alternate-item ${isActive ? 'active' : ''}" data-index="${index}">
                    <div class="alternate-item-header">
                        <div class="alternate-name">
                            Version ${index + 1} ${isActive ? '(Active)' : ''}
                        </div>
                        <div class="alternate-actions">
                            ${!isActive ? `<button class="btn-secondary" onclick="alternatesManager.setActiveAlternate(${index})" title="Set Active">
                                <i class="fas fa-check"></i>
                            </button>` : ''}
                            <button class="btn-secondary" onclick="alternatesManager.editAlternate(${index})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${alternates.versions.length > 1 ? `<button class="btn-danger" onclick="alternatesManager.deleteAlternate(${index})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>` : ''}
                        </div>
                    </div>
                    <div class="alternate-content ${isEmpty ? 'empty' : ''}">
                        ${isEmpty ? 'Empty' : this.formatPreview(content)}
                    </div>
                </div>
            `;
        });
        
        this.elements.alternatesList.innerHTML = html;
    }

    setActiveAlternate(index) {
        if (!this.currentField || !this.currentCharacter.alternates[this.currentField]) return;
        
        const alternates = this.currentCharacter.alternates[this.currentField];
        
        // SYNC: Save current textarea content to the currently active alternate before switching
        const oldActiveIndex = alternates.active;
        alternates.versions[oldActiveIndex] = this.getCurrentFieldValue(this.currentField);
        
        // Switch to new active
        alternates.active = index;
        
        // Update the main field
        this.setCurrentFieldValue(this.currentField, alternates.versions[index]);
        
        // Re-render
        this.renderAlternatesList();
        
        showToast('success', `Switched to Version ${index + 1}`);
    }

    // Add this new method after updateAltButtonStates()
    syncAllFieldsToAlternates() {
        if (!this.currentCharacter || !this.currentCharacter.alternates) return;
        
        Object.keys(this.fieldMappings).forEach(fieldType => {
            if (this.currentCharacter.alternates[fieldType]) {
                const alternates = this.currentCharacter.alternates[fieldType];
                const activeIndex = alternates.active || 0;
                alternates.versions[activeIndex] = this.getCurrentFieldValue(fieldType);
            }
        });
    }

    editAlternate(index) {
        if (!this.currentField || !this.currentCharacter.alternates[this.currentField]) return;
        
        const alternates = this.currentCharacter.alternates[this.currentField];
        const currentContent = alternates.versions[index] || '';
        const mapping = this.fieldMappings[this.currentField];
        
        // Create edit modal
        this.createEditAlternateModal(index, currentContent, mapping.label);
    }

    createEditAlternateModal(index, content, fieldLabel) {
        // Remove existing edit modal
        const existingModal = document.getElementById('edit-alternate-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'edit-alternate-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; width: 90%; height: 70vh; display: flex; flex-direction: column;">
                <div class="modal-header">
                    <h3>Edit ${fieldLabel} - Version ${index + 1}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="flex: 1; display: flex; flex-direction: column; padding: var(--space-lg);">
                    <textarea id="edit-alternate-textarea" 
                        style="flex: 1; resize: none; padding: var(--space-md); 
                            background: var(--bg-tertiary); color: var(--text-primary); 
                            border: 1px solid var(--border-secondary); border-radius: var(--radius-sm);
                            font-family: 'JetBrains Mono', monospace; font-size: var(--font-size-sm); line-height: 1.5;"
                        placeholder="Enter ${fieldLabel.toLowerCase()} content...">${this.escapeHtml(content)}</textarea>
                    <div style="margin-top: var(--space-sm); font-size: var(--font-size-xs); 
                                color: var(--text-secondary); text-align: right;">
                        <span id="edit-alternate-token-count">0 tokens</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary-text" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-primary" onclick="alternatesManager.saveAlternateEdit(${index})">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const textarea = modal.querySelector('#edit-alternate-textarea');
        const tokenCount = modal.querySelector('#edit-alternate-token-count');

        // Update token count
        const updateTokens = () => {
            const tokens = Math.ceil(textarea.value.length / 4);
            tokenCount.textContent = `${tokens} tokens`;
        };

        textarea.addEventListener('input', updateTokens);
        updateTokens();

        // Focus textarea
        setTimeout(() => textarea.focus(), 100);
    }

    saveAlternateEdit(index) {
        const modal = document.getElementById('edit-alternate-modal');
        const textarea = modal.querySelector('#edit-alternate-textarea');
        const newContent = textarea.value;

        if (!this.currentField || !this.currentCharacter.alternates[this.currentField]) return;

        const alternates = this.currentCharacter.alternates[this.currentField];
        alternates.versions[index] = newContent;

        // If this is the active alternate, update the main field
        if (alternates.active === index) {
            this.setCurrentFieldValue(this.currentField, newContent);
        }

        // Re-render and close
        this.renderAlternatesList();
        modal.remove();
        
        showToast('success', `Version ${index + 1} updated`);
    }

    deleteAlternate(index) {
        if (!this.currentField || !this.currentCharacter.alternates[this.currentField]) return;
        
        const alternates = this.currentCharacter.alternates[this.currentField];
        
        if (alternates.versions.length <= 1) {
            showToast('warning', 'Cannot delete the only version');
            return;
        }
        
        if (!confirm(`Delete Version ${index + 1}?`)) return;
        
        // Remove the version
        alternates.versions.splice(index, 1);
        
        // Adjust active index if necessary
        if (alternates.active === index) {
            // If we deleted the active one, make the first one active
            alternates.active = 0;
            this.setCurrentFieldValue(this.currentField, alternates.versions[0]);
        } else if (alternates.active > index) {
            // If we deleted one before the active, adjust the index
            alternates.active--;
        }
        
        this.renderAlternatesList();
        showToast('success', `Version ${index + 1} deleted`);
    }

    addNewAlternate() {
        if (!this.currentField || !this.currentCharacter.alternates[this.currentField]) return;
        
        const alternates = this.currentCharacter.alternates[this.currentField];
        const newIndex = alternates.versions.length;
        
        alternates.versions.push('');
        
        this.renderAlternatesList();
        
        // Open edit modal for the new alternate
        const mapping = this.fieldMappings[this.currentField];
        this.createEditAlternateModal(newIndex, '', mapping.label);
    }

    updateAltButtonStates() {
        if (!this.app.currentEditCharacter) return;
        
        Object.keys(this.fieldMappings).forEach(fieldType => {
            const button = document.querySelector(`.alt-btn[data-field="${fieldType}"]`);
            if (!button) return;
            
            const hasAlternates = this.app.currentEditCharacter.alternates && 
                                this.app.currentEditCharacter.alternates[fieldType] && 
                                this.app.currentEditCharacter.alternates[fieldType].versions.length > 1;
            
            button.classList.toggle('has-alternates', hasAlternates);
        });
    }

    // Initialize alternates when loading a character
    initializeCharacterAlternates(character) {
        if (!character.alternates) {
            character.alternates = {};
        }
        
        // Initialize any missing field alternates with current content
        Object.keys(this.fieldMappings).forEach(fieldType => {
            if (!character.alternates[fieldType]) {
                const mapping = this.fieldMappings[fieldType];
                character.alternates[fieldType] = {
                    active: 0,
                    versions: [character[mapping.property] || '']
                };
            }
        });
    }

    formatPreview(content) {
        if (!content) return 'Empty';
        
        // Trim overall whitespace 
        const trimmed = content.trim();
        if (!trimmed) return 'Empty';
        
        // Split into lines, trim each line to remove indents, and filter out empty lines
        const lines = trimmed.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .slice(0, 3); // Take first 3 non-empty lines
        
        if (lines.length === 0) return 'Empty';
        
        let preview = lines.join(' '); // Join with spaces instead of newlines for compact preview
        
        // Add ellipsis if we truncated lines or if still too long
        const originalLineCount = trimmed.split('\n').filter(line => line.trim().length > 0).length;
        if (originalLineCount > 3 || preview.length > 120) {
            if (preview.length > 120) {
                preview = preview.substring(0, 120);
            }
            preview += '...';
        }
        
        return this.escapeHtml(preview);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
}

// Initialize alternates manager when the main app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to be initialized
    const initAlternates = () => {
        if (window.app) {
            window.alternatesManager = new CharacterAlternatesManager(window.app);
        } else {
            setTimeout(initAlternates, 100);
        }
    };
    setTimeout(initAlternates, 100);
});