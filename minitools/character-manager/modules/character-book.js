// Character Book Manager

class CharacterBookManager {
    constructor() {
        this.currentCharacter = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Book button click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('#character-book-btn')) {
                this.openBookModal();
            }
        });

        // Modal event listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('#book-modal-close, #book-cancel')) {
                this.closeBookModal();
            }
            if (e.target.matches('#add-entry-btn')) {
                this.addEntry();
            }
            if (e.target.closest('.entry-delete-btn')) {
                const index = parseInt(e.target.closest('.entry-delete-btn').dataset.index);
                this.deleteEntry(index);
            }
            if (e.target.matches('#save-book-btn')) {
                this.saveBook();
            }
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.matches('#book-modal')) {
                this.closeBookModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBookModal();
            }
        });
    }

    setCurrentCharacter(character) {
        this.currentCharacter = character;
        console.log('Book manager set character:', character.name);
        this.updateBookButton();
    }

    updateBookButton() {
        const btn = document.getElementById('character-book-btn');
        const entriesCount = this.currentCharacter?.character_book?.entries?.length || 0;
        
        if (entriesCount > 0) {
            btn.innerHTML = `<i class="fas fa-book"></i> Character Book (${entriesCount})`;
            btn.classList.add('has-entries');
        } else {
            btn.innerHTML = '<i class="fas fa-book"></i> Character Book';
            btn.classList.remove('has-entries');
        }
    }

    openBookModal() {
        if (!this.currentCharacter) {
            showToast('error', 'No character selected');
            return;
        }

        this.createBookModal();
        this.populateEntries();
        document.getElementById('book-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeBookModal() {
        const modal = document.getElementById('book-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    createBookModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('book-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'book-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content book-modal">
                <div class="modal-header">
                    <h3>Character Book</h3>
                    <button id="book-modal-close" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="book-settings">
                        <div class="setting-row">
                            <label for="book-name">Book Name:</label>
                            <input type="text" id="book-name" class="edit-input" placeholder="Character Book Name">
                        </div>
                        <div class="setting-row">
                            <label for="book-description">Description:</label>
                            <input type="text" id="book-description" class="edit-input" placeholder="Optional description">
                        </div>
                    </div>
                    
                    <div id="entries-list" class="entries-list">
                        <!-- Entries will be populated here -->
                    </div>
                    
                    <div class="add-entry-section">
                        <button id="add-entry-btn" class="btn-secondary">
                            <i class="fas fa-plus"></i> Add Entry
                        </button>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button id="book-cancel" class="btn-secondary-text">Cancel</button>
                    <button id="save-book-btn" class="btn-primary">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    populateEntries() {
        const entriesList = document.getElementById('entries-list');
        const bookNameInput = document.getElementById('book-name');
        const bookDescriptionInput = document.getElementById('book-description');
        
        // Populate book settings
        const book = this.currentCharacter.character_book;
        if (book) {
            bookNameInput.value = book.name || '';
            bookDescriptionInput.value = book.description || '';
        }
        
        const entries = book?.entries || [];

        if (entries.length === 0) {
            entriesList.innerHTML = `
                <div class="empty-entries">
                    <i class="fas fa-book-open"></i>
                    <p>No entries yet</p>
                    <small>Add entries to provide context when keywords are mentioned</small>
                </div>
            `;
            return;
        }

        const html = entries.map((entry, index) => `
            <div class="entry-item" data-index="${index}">
                <div class="entry-content">
                    <div class="entry-row">
                        <label>Comment:</label>
                        <input type="text" class="entry-comment edit-input" value="${this.escapeHtml(entry.comment || '')}" placeholder="Entry description">
                    </div>
                    <div class="entry-row">
                        <label>Primary Keys:</label>
                        <input type="text" class="entry-keys edit-input" value="${this.escapeHtml((entry.keys || []).join(', '))}" placeholder="keyword1, keyword2">
                    </div>
                    <div class="entry-row with-logic">
                        <label>Secondary Keys:</label>
                        <input type="text" class="entry-secondary-keys edit-input" value="${this.escapeHtml((entry.secondary_keys || []).join(', '))}" placeholder="optional secondary keywords">
                        <select class="entry-logic edit-select">
                            <option value="0" ${(entry.selective_logic || 0) === 0 ? 'selected' : ''}>AND ANY</option>
                            <option value="1" ${(entry.selective_logic || 0) === 1 ? 'selected' : ''}>NOT ALL</option>
                            <option value="2" ${(entry.selective_logic || 0) === 2 ? 'selected' : ''}>AND ALL</option>
                        </select>
                    </div>
                    <div class="entry-row full-width">
                        <label>Content:</label>
                        <textarea class="entry-text edit-textarea" rows="4" placeholder="Information to inject when keywords are found">${this.escapeHtml(entry.content || '')}</textarea>
                    </div>
                </div>
                <div class="entry-settings">
                    <div class="setting-group">
                        <label>Priority:</label>
                        <input type="number" class="entry-priority edit-input" value="${entry.priority || 100}" min="0">
                    </div>
                    <div class="setting-group">
                        <label>Order:</label>
                        <input type="number" class="entry-order edit-input" value="${entry.insertion_order || 100}" min="0">
                    </div>
                    <div class="setting-group">
                        <label>Position:</label>
                        <select class="entry-position edit-select">
                            <option value="before_char" ${entry.position === 'before_char' ? 'selected' : ''}>Before Character</option>
                            <option value="after_char" ${entry.position === 'after_char' ? 'selected' : ''}>After Character</option>
                        </select>
                    </div>
                    <div class="setting-group toggle-column">
                        <label class="toggle-label">
                            <input type="checkbox" class="entry-constant" ${entry.constant === true ? 'checked' : ''}>
                            Constant
                        </label>
                        <label class="toggle-label">
                            <input type="checkbox" class="entry-enabled" ${entry.enabled !== false ? 'checked' : ''} data-index="${index}">
                            Enabled
                        </label>
                    </div>
                </div>
                <div class="entry-footer">
                    <span class="token-count">${this.calculateTokens(entry.content || '')} tokens</span>
                    <button type="button" class="entry-delete-btn btn-danger" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        entriesList.innerHTML = html;

        // Add input event listeners for token counting
        entriesList.querySelectorAll('.entry-text').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                const footer = e.target.closest('.entry-item').querySelector('.token-count');
                footer.textContent = `${this.calculateTokens(e.target.value)} tokens`;
            });
        });

        // Add event listener for logic dropdown
        entriesList.querySelectorAll('.entry-logic').forEach(select => {
            select.addEventListener('change', (e) => {
                // The logic value will be saved when saveBook() is called
                // No immediate action needed, just ensuring the dropdown works
            });
        });
    }

    addEntry() {
        if (!this.currentCharacter.character_book) {
            this.currentCharacter.character_book = {
                entries: [],
                name: '',
                description: '',
                extensions: {}
            };
        }

        const newEntry = {
            keys: [],
            content: '',
            extensions: {},
            enabled: true,
            insertion_order: 100,
            comment: '',
            priority: 100,
            id: Date.now(),
            secondary_keys: [],
            selective_logic: 0,
            constant: false,
            position: 'after_char'
        };

        this.currentCharacter.character_book.entries.push(newEntry);
        this.populateEntries();

        // Focus on the new entry
        const entryItems = document.querySelectorAll('.entry-item');
        if (entryItems.length > 0) {
            const lastItem = entryItems[entryItems.length - 1];
            const commentInput = lastItem.querySelector('.entry-comment');
            commentInput.focus();
        }
    }

    deleteEntry(index) {
        if (!this.currentCharacter.character_book?.entries || index < 0 || index >= this.currentCharacter.character_book.entries.length) {
            return;
        }

        if (confirm('Are you sure you want to delete this entry?')) {
            this.currentCharacter.character_book.entries.splice(index, 1);
            this.populateEntries();
            this.updateBookButton();
        }
    }

    saveBook() {
        // Update book settings
        const bookName = document.getElementById('book-name').value.trim();
        const bookDescription = document.getElementById('book-description').value.trim();

        if (!this.currentCharacter.character_book) {
            this.currentCharacter.character_book = { 
                entries: [],
                extensions: {}
            };
        }

        this.currentCharacter.character_book.name = bookName;
        this.currentCharacter.character_book.description = bookDescription;

        // Update entries from form
        const entryItems = document.querySelectorAll('.entry-item');
        const entries = [];

        entryItems.forEach((item, index) => {
            const comment = item.querySelector('.entry-comment').value.trim();
            const keysText = item.querySelector('.entry-keys').value.trim();
            const secondaryKeysText = item.querySelector('.entry-secondary-keys').value.trim();
            const logic = parseInt(item.querySelector('.entry-logic').value) || 0;
            const content = item.querySelector('.entry-text').value.trim();
            const enabled = item.querySelector('.entry-enabled').checked;
            const constant = item.querySelector('.entry-constant').checked;
            const priority = parseInt(item.querySelector('.entry-priority').value) || 100;
            const order = parseInt(item.querySelector('.entry-order').value) || 100;
            const position = item.querySelector('.entry-position').value;

            const keys = keysText ? keysText.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];
            const secondaryKeys = secondaryKeysText ? secondaryKeysText.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];

            const originalEntry = this.currentCharacter.character_book.entries[index] || {};

            entries.push({
                keys,
                content,
                extensions: originalEntry.extensions || {},
                enabled,
                insertion_order: order,
                comment: comment || `Entry ${index + 1}`,
                priority,
                id: originalEntry.id || Date.now() + index,
                secondary_keys: secondaryKeys,
                selective_logic: logic,
                constant,
                position
            });
        });

        this.currentCharacter.character_book.entries = entries;
        this.updateBookButton();
        this.closeBookModal();
        showToast('success', 'Character book updated');
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

// Initialize the book manager
const characterBookManager = new CharacterBookManager();

// Make it globally available
window.characterBookManager = characterBookManager;