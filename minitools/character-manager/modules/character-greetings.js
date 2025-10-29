// Character Alternate Greetings Manager

class CharacterGreetingsManager {
    constructor() {
        this.currentCharacter = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Alt Greetings button click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('#alt-greetings-btn')) {
                this.openGreetingsModal();
            }
        });

        // Modal event listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('#greetings-modal-close, #greetings-cancel')) {
                this.closeGreetingsModal();
            }
            if (e.target.matches('#add-greeting-btn')) {
                this.addGreeting();
            }
            if (e.target.closest('.greeting-delete-btn')) {
                const index = parseInt(e.target.closest('.greeting-delete-btn').dataset.index);
                this.deleteGreeting(index);
            }
            if (e.target.matches('#save-greetings-btn')) {
                this.saveGreetings();
            }
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.matches('#greetings-modal')) {
                this.closeGreetingsModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGreetingsModal();
            }
        });
    }

    setCurrentCharacter(character) {
        this.currentCharacter = character;
        console.log('Greetings manager set character:', character.name, 'with greetings:', character.alternate_greetings);
        this.updateGreetingsButton();
    }

    updateGreetingsButton() {
        const btn = document.getElementById('alt-greetings-btn');
        const greetingsCount = this.currentCharacter?.alternate_greetings?.length || 0;
        
        if (greetingsCount > 0) {
            btn.innerHTML = `<i class="fas fa-comments"></i> Alternative Greetings (${greetingsCount})`;
            btn.classList.add('has-alternates');
        } else {
            btn.innerHTML = '<i class="fas fa-comments"></i> Alternative Greetings';
            btn.classList.remove('has-alternates');
        }
    }

    openGreetingsModal() {
        if (!this.currentCharacter) {
            showToast('error', 'No character selected');
            return;
        }

        this.createGreetingsModal();
        this.populateGreetings();
        document.getElementById('greetings-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeGreetingsModal() {
        const modal = document.getElementById('greetings-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    createGreetingsModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('greetings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'greetings-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content greetings-modal">
                <div class="modal-header">
                    <h3>Alternative Greetings</h3>
                    <button id="greetings-modal-close" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    
                    <div id="greetings-list" class="greetings-list">
                        <!-- Greetings will be populated here -->
                    </div>
                    
                    <div class="add-greeting-section">
                        <button id="add-greeting-btn" class="btn-secondary">
                            <i class="fas fa-plus"></i> Add Alternative Greeting
                        </button>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button id="greetings-cancel" class="btn-secondary-text">Cancel</button>
                    <button id="save-greetings-btn" class="btn-primary">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    populateGreetings() {
        const greetingsList = document.getElementById('greetings-list');
        const greetings = this.currentCharacter.alternate_greetings || [];

        if (greetings.length === 0) {
            greetingsList.innerHTML = `
                <div class="empty-greetings">
                    <i class="fas fa-comment"></i>
                    <p>No alternative greetings yet</p>
                    <small>Add different ways for your character to start a conversation</small>
                </div>
            `;
            return;
        }

        const html = greetings.map((greeting, index) => {
            const isEmpty = !greeting || greeting.trim() === '';
            const preview = isEmpty ? 'Empty' : this.formatPreview(greeting);
            
            return `
                <div class="greeting-item" data-index="${index}">
                    <div class="greeting-header">
                        <span class="greeting-label">Alternative Greeting ${index + 1}</span>
                        <div style="display: flex; align-items: center; gap: var(--space-sm);">
                            <span class="token-count">${this.calculateTokens(greeting)} tokens</span>
                            <button type="button" class="btn-secondary" onclick="characterGreetingsManager.editGreeting(${index})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="greeting-delete-btn btn-danger" data-index="${index}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="greeting-content ${isEmpty ? 'empty' : ''}">
                        ${preview}
                    </div>
                </div>
            `;
        }).join('');

        greetingsList.innerHTML = html;
    }

    formatPreview(content) {
        if (!content) return 'Empty';
        
        const trimmed = content.trim();
        if (!trimmed) return 'Empty';
        
        const lines = trimmed.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .slice(0, 3);
        
        if (lines.length === 0) return 'Empty';
        
        let preview = lines.join(' ');
        
        const originalLineCount = trimmed.split('\n').filter(line => line.trim().length > 0).length;
        if (originalLineCount > 3 || preview.length > 120) {
            if (preview.length > 120) {
                preview = preview.substring(0, 120);
            }
            preview += '...';
        }
        
        return this.escapeHtml(preview);
    }

    editGreeting(index) {
        if (!this.currentCharacter.alternate_greetings) return;
        
        const greeting = this.currentCharacter.alternate_greetings[index] || '';
        this.createEditGreetingModal(index, greeting);
    }

    createEditGreetingModal(index, content) {
        const existingModal = document.getElementById('edit-greeting-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'edit-greeting-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; width: 90%; height: 70vh; display: flex; flex-direction: column;">
                <div class="modal-header">
                    <h3>Edit Alternative Greeting ${index + 1}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="flex: 1; display: flex; flex-direction: column; padding: var(--space-lg);">
                    <textarea id="edit-greeting-textarea" 
                        style="flex: 1; resize: none; padding: var(--space-md); 
                            background: var(--bg-tertiary); color: var(--text-primary); 
                            border: 1px solid var(--border-secondary); border-radius: var(--radius-sm);
                            font-family: 'JetBrains Mono', monospace; font-size: var(--font-size-sm); line-height: 1.5;"
                        placeholder="Enter alternative greeting...">${this.escapeHtml(content)}</textarea>
                    <div style="margin-top: var(--space-sm); font-size: var(--font-size-xs); 
                                color: var(--text-secondary); text-align: right;">
                        <span id="edit-greeting-token-count">0 tokens</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary-text" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-primary" onclick="characterGreetingsManager.saveGreetingEdit(${index})">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const textarea = modal.querySelector('#edit-greeting-textarea');
        const tokenCount = modal.querySelector('#edit-greeting-token-count');

        const updateTokens = () => {
            const tokens = this.calculateTokens(textarea.value);
            tokenCount.textContent = `${tokens} tokens`;
        };

        textarea.addEventListener('input', updateTokens);
        updateTokens();

        setTimeout(() => textarea.focus(), 100);
    }

    saveGreetingEdit(index) {
        const modal = document.getElementById('edit-greeting-modal');
        const textarea = modal.querySelector('#edit-greeting-textarea');
        const newContent = textarea.value.trim();

        if (!this.currentCharacter.alternate_greetings) return;

        this.currentCharacter.alternate_greetings[index] = newContent;

        this.populateGreetings();
        modal.remove();
        
        showToast('success', `Alternative Greeting ${index + 1} updated`);
    }

    addGreeting() {
        if (!this.currentCharacter.alternate_greetings) {
            this.currentCharacter.alternate_greetings = [];
        }

        this.currentCharacter.alternate_greetings.push('');
        this.populateGreetings();

        // Focus on the new textarea
        const greetingItems = document.querySelectorAll('.greeting-item');
        if (greetingItems.length > 0) {
            const lastItem = greetingItems[greetingItems.length - 1];
            const textarea = lastItem.querySelector('.greeting-textarea');
            textarea.focus();
        }
    }

    deleteGreeting(index) {
        if (!this.currentCharacter.alternate_greetings || index < 0 || index >= this.currentCharacter.alternate_greetings.length) {
            return;
        }

        if (confirm('Are you sure you want to delete this alternative greeting?')) {
            this.currentCharacter.alternate_greetings.splice(index, 1);
            this.populateGreetings();
            this.updateGreetingsButton();
        }
    }

    saveGreetings() {
        // No need to read from textareas anymore since we're using edit modals
        // Just close the modal and update the button
        this.updateGreetingsButton();
        this.closeGreetingsModal();
        showToast('success', 'Alternative greetings saved');
    }

    calculateTokens(text) {
        if (!text || typeof text !== 'string') return 0;
        return Math.ceil(text.length / 4);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
}

// Initialize the greetings manager
const characterGreetingsManager = new CharacterGreetingsManager();

// Make it globally available
window.characterGreetingsManager = characterGreetingsManager;