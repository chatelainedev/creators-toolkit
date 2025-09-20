// notebook-workspace-manager.js - Client-side notebook workspace management

class NotebookWorkspaceManager {
    constructor() {
        this.availableNotebooks = [];
        this.currentNotebookId = 'default';
        this.currentNotebook = null;
        this.isInitialized = false;
        this.notebookManager = null; // Reference to main NotebookManager
        
        this.initializeWorkspaceManager();
    }

    // Initialize workspace manager
    async initializeWorkspaceManager() {
        console.log('📚 Initializing Notebook Workspace Manager...');
        
        this.setupUI();
        
        // Wait for auth manager to be available
        await this.waitForAuthManager();
        
        // Load notebooks if user is logged in
        if (this.isUserLoggedIn()) {
            await this.loadNotebooks();
        }
        
        this.isInitialized = true;
        console.log('✅ Notebook Workspace Manager initialized');
    }

    // Wait for auth manager to be available AND user session to be restored
    async waitForAuthManager() {
        let attempts = 0;
        // First wait for auth manager to exist
        while (attempts < 50 && !window.authManager) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        // Then wait for user session to be fully loaded (if any)
        if (window.authManager) {
            attempts = 0;
            while (attempts < 30) {
                // Check if auth manager has finished initializing
                if (window.authManager.isInitialized) {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }
    }

    // Setup UI elements
    setupUI() {
        this.createNotebookDropdown();
        this.setupEventListeners();
    }

    // Create notebook dropdown in sidebar header
    createNotebookDropdown() {
        const sidebarHeader = document.querySelector('.sidebar-header');
        if (!sidebarHeader) {
            console.warn('Could not find sidebar header for notebook dropdown');
            return;
        }

        // Check if dropdown already exists
        if (document.getElementById('notebook-selector')) {
            return;
        }

        // Create dropdown container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'notebook-selector-container';
        dropdownContainer.style.cssText = `
            position: relative;
            flex: 1;
            margin-right: var(--space-sm);
            margin-left: var(--space-sm);  /* ADD THIS - moves it slightly right */
            margin-top: 2px;               /* ADD THIS - moves it down slightly */
            min-width: 0;
        `;

        dropdownContainer.innerHTML = `
            <select id="notebook-selector" class="notebook-dropdown" style="
                width: 100%;
                background: var(--bg-quaternary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-sm);
                color: var(--text-primary);
                font-size: var(--font-size-xs);
                font-weight: 500;
                padding: var(--space-xs) var(--space-sm);
                cursor: pointer;
                font-family: 'Nunito Sans', sans-serif;
                transition: all var(--transition-normal);
                outline: none;
            ">
                <option value="default">📓 Default Notebook</option>
            </select>
                <div class="notebook-dropdown-actions" style="
                    position: absolute;
                    right: 2px;
                    top: 19px;                    /* ADD THIS - positions above dropdown */
                    display: flex;
                    gap: 2px;
                    pointer-events: none;
                ">
                <button id="create-notebook-btn" class="notebook-action-btn" title="Create Notebook" style="
                    background: none;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    font-size: 9px;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-sm);
                    transition: all var(--transition-fast);
                    pointer-events: all;
                ">
                    <i class="fas fa-plus"></i>
                </button>
                <button id="manage-notebooks-btn" class="notebook-action-btn" title="Manage Notebooks" style="
                    background: none;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    font-size: 9px;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-sm);
                    transition: all var(--transition-fast);
                    pointer-events: all;
                ">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        `;

        // Insert before the actions div
        const sidebarActions = sidebarHeader.querySelector('.sidebar-actions');
        if (sidebarActions) {
            sidebarHeader.insertBefore(dropdownContainer, sidebarActions);
        } else {
            sidebarHeader.appendChild(dropdownContainer);
        }

        // Add hover effects
        const dropdown = document.getElementById('notebook-selector');
        const actionBtns = dropdownContainer.querySelectorAll('.notebook-action-btn');

        dropdown.addEventListener('mouseenter', () => {
            dropdown.style.borderColor = 'var(--accent-primary)';
            actionBtns.forEach(btn => {
                btn.style.color = 'var(--text-secondary)';
            });
        });

        dropdown.addEventListener('mouseleave', () => {
            dropdown.style.borderColor = 'var(--border-primary)';
            actionBtns.forEach(btn => {
                btn.style.color = 'var(--text-tertiary)';
            });
        });

        actionBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.color = 'var(--accent-primary)';
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.color = 'var(--text-secondary)';
                btn.style.background = 'none';
            });
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Notebook selector change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'notebook-selector') {
                const selectedNotebookId = e.target.value;
                if (selectedNotebookId !== this.currentNotebookId) {
                    this.switchNotebook(selectedNotebookId);
                }
            }
        });

        // Create notebook button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#create-notebook-btn')) {
                e.stopPropagation();
                this.showCreateNotebookModal();
            }
        });

        // Manage notebooks button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#manage-notebooks-btn')) {
                e.stopPropagation();
                this.showManageNotebooksModal();
            }
        });
    }

    // Load notebooks from server
    async loadNotebooks() {
        if (!this.isUserLoggedIn()) {
            this.availableNotebooks = [{
                id: 'default',
                name: 'Default Notebook',
                description: 'Your main notebook',
                icon: '📓',
                color: '#b1b695'
            }];
            this.currentNotebookId = 'default';
            this.updateDropdownOptions();
            return;
        }

        try {
            const response = await fetch('/api/notebooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.availableNotebooks = result.notebooks || [];
                this.currentNotebookId = result.activeNotebookId || 'default';
                this.currentNotebook = this.availableNotebooks.find(nb => nb.id === this.currentNotebookId);
                
                this.updateDropdownOptions();
                
                console.log(`📚 Loaded ${this.availableNotebooks.length} notebooks, active: ${this.currentNotebookId}`);
                // Notify notebook manager to reload data for the correct notebook
                if (this.notebookManager) {
                    this.notebookManager.currentNotebookId = this.currentNotebookId;
                    await this.notebookManager.loadUserData();
                }
            } else {
                throw new Error(result.error || 'Failed to load notebooks');
            }
        } catch (error) {
            console.error('Error loading notebooks:', error);
            this.showToast('Failed to load notebooks', 'error');
            
            // Fallback to default
            this.availableNotebooks = [{
                id: 'default',
                name: 'Default Notebook',
                description: 'Your main notebook',
                icon: '📓',
                color: '#b1b695'
            }];
            this.currentNotebookId = 'default';
            this.updateDropdownOptions();
        }
    }

    // Update dropdown options
    updateDropdownOptions() {
        const dropdown = document.getElementById('notebook-selector');
        if (!dropdown) return;

        dropdown.innerHTML = '';

        this.availableNotebooks.forEach(notebook => {
            const option = document.createElement('option');
            option.value = notebook.id;
            option.innerHTML = `<i class="fas fa-${notebook.icon}" style="color: ${notebook.color}; margin-right: var(--space-xs);"></i> ${notebook.name}`;
            if (notebook.id === this.currentNotebookId) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    }

    // Switch to different notebook
    async switchNotebook(notebookId, skipSave = false) {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to switch notebooks', 'warning');
            return false;
        }

        if (notebookId === this.currentNotebookId) {
            return true; // Already on this notebook
        }

        // Save current work if notebook manager exists
        if (!skipSave && this.notebookManager && this.notebookManager.isDirty) {
            const shouldSave = confirm('You have unsaved changes. Save before switching notebooks?');
            if (shouldSave) {
                try {
                    await this.notebookManager.saveCurrentNote();
                } catch (error) {
                    console.error('Error saving before switch:', error);
                    this.showToast('Failed to save current work', 'error');
                    return false;
                }
            }
        }

        try {
            // Notify server of notebook switch
            const response = await fetch('/api/notebooks/switch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: notebookId
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Update local state
                const previousNotebookId = this.currentNotebookId;
                this.currentNotebookId = notebookId;
                this.currentNotebook = this.availableNotebooks.find(nb => nb.id === notebookId);
                
                // Update dropdown
                const dropdown = document.getElementById('notebook-selector');
                if (dropdown) {
                    dropdown.value = notebookId;
                }

                // Clear notebook manager state and reload data
                if (this.notebookManager) {
                    this.notebookManager.currentNotebookId = notebookId;
                    this.notebookManager.createNewNote(); // Clear current note
                    await this.notebookManager.loadUserData(); // Reload data for new notebook
                }

                console.log(`🔄 Switched from "${previousNotebookId}" to "${notebookId}"`);
                this.showToast(`Switched to ${this.currentNotebook?.name || notebookId}`, 'success');
                
                return true;
            } else {
                throw new Error(result.error || 'Failed to switch notebook');
            }
        } catch (error) {
            console.error('Error switching notebook:', error);
            this.showToast('Failed to switch notebook', 'error');
            
            // Revert dropdown selection
            const dropdown = document.getElementById('notebook-selector');
            if (dropdown) {
                dropdown.value = this.currentNotebookId;
            }
            
            return false;
        }
    }

    // Show create notebook modal
    showCreateNotebookModal() {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to create notebooks', 'warning');
            return;
        }

        // Remove existing modal
        const existingModal = document.getElementById('create-notebook-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'create-notebook-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 500px; width: 90%; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Create New Notebook</h3>
                    <button class="close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Notebook Name:</label>
                        <input type="text" id="notebook-name-input" placeholder="e.g., Fantasy Novel, Research Notes" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Description (optional):</label>
                        <textarea id="notebook-description-input" placeholder="Brief description of this notebook's purpose..." rows="2" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs); resize: vertical;"></textarea>
                    </div>
                    <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div class="form-group" style="flex: 0 0 230px;">
                            <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Icon:</label>
                            <select id="notebook-icon-input" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                                <option value="book">Book</option>
                                <option value="book-open">Book Open</option>
                                <option value="sticky-note">Note</option>
                                <option value="file-alt">Document</option>
                                <option value="folder">Folder</option>
                                <option value="folder-open">Folder Open</option>
                                <option value="pen-fancy">Pen</option>
                                <option value="feather-alt">Quill</option>
                                <option value="scroll">Scroll</option>
                                <option value="magic">Magic</option>
                                <option value="dragon">Fantasy</option>
                                <option value="rocket">Sci-Fi</option>
                                <option value="flask">Research</option>
                                <option value="lightbulb">Ideas</option>
                                <option value="users">Characters</option>
                                <option value="globe">World</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 0 0 230px;">
                            <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Color:</label>
                            <select id="notebook-color-input" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                                <option value="#b1b695">Default Green</option>
                                <option value="#8fbc8f">Forest Green</option>
                                <option value="#87ceeb">Sky Blue</option>
                                <option value="#dda0dd">Plum</option>
                                <option value="#f0e68c">Khaki</option>
                                <option value="#ffa07a">Salmon</option>
                                <option value="#dc143c">Crimson</option>
                                <option value="#696969">Gray</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">ID (auto-generated):</label>
                        <input type="text" id="notebook-id-input" readonly style="width: 100%; padding: var(--space-sm); background: var(--bg-quaternary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-tertiary); font-family: monospace; font-size: var(--font-size-xs);">
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button id="create-notebook-confirm-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-plus"></i> Create Notebook
                        </button>
                        <button class="btn-secondary cancel-btn" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal functionality
        this.setupCreateNotebookModal(modal);

        // Focus name input
        const nameInput = document.getElementById('notebook-name-input');
        if (nameInput) {
            nameInput.focus();
        }
    }

    // Setup create notebook modal functionality
    setupCreateNotebookModal(modal) {
        const nameInput = document.getElementById('notebook-name-input');
        const descriptionInput = document.getElementById('notebook-description-input');
        const iconInput = document.getElementById('notebook-icon-input');
        const colorInput = document.getElementById('notebook-color-input');
        const idInput = document.getElementById('notebook-id-input');
        const createBtn = document.getElementById('create-notebook-confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const closeBtn = modal.querySelector('.close-btn');

        // Auto-generate ID from name
        const updateId = () => {
            const name = nameInput.value.trim();
            if (name) {
                const id = name.toLowerCase()
                    .replace(/[^a-z0-9\s\-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 30);
                idInput.value = id || 'notebook-' + Date.now();
            } else {
                idInput.value = '';
            }
        };

        nameInput.addEventListener('input', updateId);

        // Create button handler
        createBtn.addEventListener('click', async () => {
            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();
            const icon = iconInput.value;
            const color = colorInput.value;
            const id = idInput.value.trim();

            if (!name) {
                this.showToast('Please enter a notebook name', 'warning');
                nameInput.focus();
                return;
            }

            if (!id || !this.isValidNotebookId(id)) {
                this.showToast('Invalid notebook ID', 'warning');
                nameInput.focus();
                return;
            }

            // Check if ID already exists
            if (this.availableNotebooks.some(nb => nb.id === id)) {
                this.showToast('A notebook with this ID already exists', 'warning');
                nameInput.focus();
                return;
            }

            try {
                createBtn.disabled = true;
                createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

                const success = await this.createNotebook({
                    id, name, description, icon, color
                });

                if (success) {
                    modal.remove();
                }
            } catch (error) {
                console.error('Error creating notebook:', error);
            } finally {
                createBtn.disabled = false;
                createBtn.innerHTML = '<i class="fas fa-plus"></i> Create Notebook';
            }
        });

        // Cancel and close handlers
        cancelBtn.addEventListener('click', () => modal.remove());
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Enter to create
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                createBtn.click();
            }
        });
    }

    // Create new notebook
    async createNotebook(notebookData) {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to create notebooks', 'warning');
            return false;
        }

        try {
            const response = await fetch('/api/notebooks/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookData: notebookData
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Add to local list
                this.availableNotebooks.push(result.notebook);
                this.updateDropdownOptions();
                
                this.showToast(`Created notebook: ${result.notebook.name}`, 'success');
                
                // Optionally switch to new notebook
                const shouldSwitch = confirm(`Notebook "${result.notebook.name}" created! Switch to it now?`);
                if (shouldSwitch) {
                    await this.switchNotebook(result.notebook.id);
                }
                
                return true;
            } else {
                throw new Error(result.error || 'Failed to create notebook');
            }
        } catch (error) {
            console.error('Error creating notebook:', error);
            this.showToast(error.message || 'Failed to create notebook', 'error');
            return false;
        }
    }

    // Show edit notebook modal
    showEditNotebookModal(notebook) {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to edit notebooks', 'warning');
            return;
        }

        // Remove existing modal
        const existingModal = document.getElementById('edit-notebook-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'edit-notebook-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 500px; width: 90%; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Edit Notebook</h3>
                    <button class="close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Notebook Name:</label>
                        <input type="text" id="edit-notebook-name-input" placeholder="e.g., Fantasy Novel, Research Notes" value="${this.escapeHtml(notebook.name)}" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Description (optional):</label>
                        <textarea id="edit-notebook-description-input" placeholder="Brief description of this notebook's purpose..." rows="2" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs); resize: vertical;">${this.escapeHtml(notebook.description || '')}</textarea>
                    </div>
                    <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div class="form-group" style="flex: 0 0 230px;">
                            <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Icon:</label>
                            <select id="edit-notebook-icon-input" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                                <option value="book" ${notebook.icon === 'book' ? 'selected' : ''}>Book</option>
                                <option value="book-open" ${notebook.icon === 'book-open' ? 'selected' : ''}>Book Open</option>
                                <option value="sticky-note" ${notebook.icon === 'sticky-note' ? 'selected' : ''}>Note</option>
                                <option value="file-alt" ${notebook.icon === 'file-alt' ? 'selected' : ''}>Document</option>
                                <option value="folder" ${notebook.icon === 'folder' ? 'selected' : ''}>Folder</option>
                                <option value="folder-open" ${notebook.icon === 'folder-open' ? 'selected' : ''}>Folder Open</option>
                                <option value="pen-fancy" ${notebook.icon === 'pen-fancy' ? 'selected' : ''}>Pen</option>
                                <option value="feather-alt" ${notebook.icon === 'feather-alt' ? 'selected' : ''}>Quill</option>
                                <option value="scroll" ${notebook.icon === 'scroll' ? 'selected' : ''}>Scroll</option>
                                <option value="magic" ${notebook.icon === 'magic' ? 'selected' : ''}>Magic</option>
                                <option value="dragon" ${notebook.icon === 'dragon' ? 'selected' : ''}>Fantasy</option>
                                <option value="rocket" ${notebook.icon === 'rocket' ? 'selected' : ''}>Sci-Fi</option>
                                <option value="flask" ${notebook.icon === 'flask' ? 'selected' : ''}>Research</option>
                                <option value="lightbulb" ${notebook.icon === 'lightbulb' ? 'selected' : ''}>Ideas</option>
                                <option value="users" ${notebook.icon === 'users' ? 'selected' : ''}>Characters</option>
                                <option value="globe" ${notebook.icon === 'globe' ? 'selected' : ''}>World</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 0 0 230px;">
                            <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Color:</label>
                            <select id="edit-notebook-color-input" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                                <option value="#b1b695" ${notebook.color === '#b1b695' ? 'selected' : ''}>Default Green</option>
                                <option value="#8fbc8f" ${notebook.color === '#8fbc8f' ? 'selected' : ''}>Forest Green</option>
                                <option value="#87ceeb" ${notebook.color === '#87ceeb' ? 'selected' : ''}>Sky Blue</option>
                                <option value="#dda0dd" ${notebook.color === '#dda0dd' ? 'selected' : ''}>Plum</option>
                                <option value="#f0e68c" ${notebook.color === '#f0e68c' ? 'selected' : ''}>Khaki</option>
                                <option value="#ffa07a" ${notebook.color === '#ffa07a' ? 'selected' : ''}>Salmon</option>
                                <option value="#dc143c" ${notebook.color === '#dc143c' ? 'selected' : ''}>Crimson</option>
                                <option value="#696969" ${notebook.color === '#696969' ? 'selected' : ''}>Gray</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">ID (cannot be changed):</label>
                        <input type="text" value="${this.escapeHtml(notebook.id)}" readonly style="width: 100%; padding: var(--space-sm); background: var(--bg-quaternary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-tertiary); font-family: monospace; font-size: var(--font-size-xs);">
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button id="save-notebook-changes-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button class="btn-secondary cancel-btn" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal functionality
        this.setupEditNotebookModal(modal, notebook);

        // Focus name input
        const nameInput = document.getElementById('edit-notebook-name-input');
        if (nameInput) {
            nameInput.focus();
            nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
        }
    }

    // Setup edit notebook modal functionality
    setupEditNotebookModal(modal, originalNotebook) {
        const nameInput = document.getElementById('edit-notebook-name-input');
        const descriptionInput = document.getElementById('edit-notebook-description-input');
        const iconInput = document.getElementById('edit-notebook-icon-input');
        const colorInput = document.getElementById('edit-notebook-color-input');
        const saveBtn = document.getElementById('save-notebook-changes-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const closeBtn = modal.querySelector('.close-btn');

        // Save button handler
        saveBtn.addEventListener('click', async () => {
            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();
            const icon = iconInput.value;
            const color = colorInput.value;

            if (!name) {
                this.showToast('Please enter a notebook name', 'warning');
                nameInput.focus();
                return;
            }

            // Check if anything actually changed
            const hasChanges = (
                name !== originalNotebook.name ||
                description !== (originalNotebook.description || '') ||
                icon !== originalNotebook.icon ||
                color !== originalNotebook.color
            );

            if (!hasChanges) {
                this.showToast('No changes to save', 'info');
                modal.remove();
                return;
            }

            try {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                const success = await this.updateNotebook(originalNotebook.id, {
                    name, description, icon, color
                });

                if (success) {
                    modal.remove();
                }
            } catch (error) {
                console.error('Error updating notebook:', error);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            }
        });

        // Cancel and close handlers
        cancelBtn.addEventListener('click', () => modal.remove());
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Enter to save
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveBtn.click();
            }
        });
    }

    // Update existing notebook
    async updateNotebook(notebookId, notebookData) {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to update notebooks', 'warning');
            return false;
        }

        try {
            const response = await fetch(`/api/notebooks/${notebookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookData: notebookData
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Update local notebook data
                const notebookIndex = this.availableNotebooks.findIndex(nb => nb.id === notebookId);
                if (notebookIndex !== -1) {
                    this.availableNotebooks[notebookIndex] = result.notebook;
                    
                    // Update current notebook if it's the one we edited
                    if (this.currentNotebookId === notebookId) {
                        this.currentNotebook = result.notebook;
                    }
                    
                    this.updateDropdownOptions();
                }
                
                this.showToast(`Updated notebook: ${result.notebook.name}`, 'success');
                return true;
            } else {
                throw new Error(result.error || 'Failed to update notebook');
            }
        } catch (error) {
            console.error('Error updating notebook:', error);
            this.showToast(error.message || 'Failed to update notebook', 'error');
            return false;
        }
    }

    // Show manage notebooks modal
    showManageNotebooksModal() {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to manage notebooks', 'warning');
            return;
        }

        // Remove existing modal
        const existingModal = document.getElementById('manage-notebooks-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'manage-notebooks-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const notebooksList = this.availableNotebooks.map(notebook => {
            const isActive = notebook.id === this.currentNotebookId;
            const canDelete = notebook.id !== 'default';
            
            return `
                <div class="notebook-item" data-notebook-id="${notebook.id}" style="
                    cursor: ${!isActive ? 'pointer' : 'default'};
                    display: flex;
                    align-items: center;
                    padding: var(--space-md);
                    margin-bottom: var(--space-sm);
                    background: ${isActive ? 'rgba(177, 182, 149, 0.1)' : 'var(--bg-tertiary)'};
                    border: 1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-primary)'};
                    border-radius: var(--radius-md);
                    transition: all var(--transition-normal);
                ">
                    <div style="font-size: var(--font-size-lg); margin-right: var(--space-sm); color: ${notebook.color};">
                        <i class="fas fa-${notebook.icon}"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs);">
                            ${this.escapeHtml(notebook.name)}
                            ${isActive ? '<span style="font-size: var(--font-size-xs); color: var(--accent-primary); margin-left: var(--space-sm);">● Active</span>' : ''}
                        </div>
                        <div style="font-size: var(--font-size-xs); color: var(--text-secondary);">
                            ${notebook.description ? this.escapeHtml(notebook.description) : 'No description'}
                        </div>
                        <div style="font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: var(--space-xs);">
                            ID: ${notebook.id} • Created: ${new Date(notebook.created).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="notebook-actions" style="display: flex; gap: var(--space-xs);">
                        <button class="export-notebook-btn" data-notebook-id="${notebook.id}" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--font-size-xs);">Export</button>
                        <button class="edit-notebook-btn" data-notebook-id="${notebook.id}" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-xs);">Edit</button>
                        ${canDelete ? `<button class="delete-notebook-btn" data-notebook-id="${notebook.id}" style="background: var(--accent-danger, #dc3545); color: white; border: none; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--font-size-xs);">Delete</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 700px; width: 90%; max-height: 80vh; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Manage Notebooks</h3>
                    <button class="close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg); max-height: 60vh; overflow-y: auto;">
                    <div class="notebooks-list">
                        ${notebooksList}
                    </div>
                </div>
                <div class="modal-footer" style="padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--border-primary); background: var(--bg-tertiary); display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: var(--text-tertiary); font-size: var(--font-size-xs);">
                        ${this.availableNotebooks.length} notebook${this.availableNotebooks.length !== 1 ? 's' : ''}
                    </div>
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal functionality
        this.setupManageNotebooksModal(modal);
    }

    // Setup manage notebooks modal functionality
    setupManageNotebooksModal(modal) {
        const closeBtn = modal.querySelector('.close-btn');

        // Edit notebook handlers
        modal.querySelectorAll('.edit-notebook-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent notebook item click
                const notebookId = e.target.dataset.notebookId;
                const notebook = this.availableNotebooks.find(nb => nb.id === notebookId);
                if (notebook) {
                    modal.remove();
                    this.showEditNotebookModal(notebook);
                }
            });
        });

        // Export notebook handlers
        modal.querySelectorAll('.export-notebook-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const notebookId = e.target.dataset.notebookId;
                if (this.notebookManager && this.notebookManager.exportManager) {
                    modal.remove();
                    this.notebookManager.exportManager.exportNotebook(notebookId);
                }
            });
        });

        // Click notebook item to switch (but not if it's already active)
        modal.querySelectorAll('.notebook-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                // Don't switch if clicking on action buttons
                if (e.target.closest('.notebook-actions')) {
                    return;
                }
                
                const notebookId = item.dataset.notebookId;
                if (notebookId !== this.currentNotebookId) {
                    const success = await this.switchNotebook(notebookId);
                    if (success) {
                        modal.remove();
                    }
                }
            });
        });

        // Delete notebook handlers
        modal.querySelectorAll('.delete-notebook-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const notebookId = e.target.dataset.notebookId;
                const notebook = this.availableNotebooks.find(nb => nb.id === notebookId);
                
                if (notebook && confirm(`Are you sure you want to delete "${notebook.name}"? This cannot be undone.`)) {
                    const success = await this.deleteNotebook(notebookId);
                    if (success) {
                        modal.remove();
                        this.showManageNotebooksModal(); // Refresh the modal
                    }
                }
            });
        });

        // Close handlers
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Delete notebook
    async deleteNotebook(notebookId) {
        if (notebookId === 'default') {
            this.showToast('Cannot delete default notebook', 'warning');
            return false;
        }

        if (notebookId === this.currentNotebookId) {
            this.showToast('Cannot delete currently active notebook', 'warning');
            return false;
        }

        try {
            const response = await fetch(`/api/notebooks/${notebookId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Remove from local list
                this.availableNotebooks = this.availableNotebooks.filter(nb => nb.id !== notebookId);
                this.updateDropdownOptions();
                
                this.showToast('Notebook deleted successfully', 'success');
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete notebook');
            }
        } catch (error) {
            console.error('Error deleting notebook:', error);
            this.showToast(error.message || 'Failed to delete notebook', 'error');
            return false;
        }
    }

    // Validate notebook ID format
    isValidNotebookId(id) {
        return /^[a-zA-Z0-9\-_]+$/.test(id) && id.length >= 1 && id.length <= 50;
    }

    // Get current notebook context for API calls
    getCurrentNotebookContext() {
        return {
            userContext: this.getUserContext(),
            notebookId: this.currentNotebookId
        };
    }

    // Integration methods for NotebookManager
    setNotebookManager(notebookManager) {
        this.notebookManager = notebookManager;
        console.log('📚 Notebook manager linked to workspace manager');
    }

    // User login/logout handlers
    async onUserLoggedIn() {
        console.log('📚 Workspace manager: User logged in, loading notebooks');
        await this.loadNotebooks();
    }

    onUserLoggedOut() {
        console.log('📚 Workspace manager: User logged out, clearing notebooks');
        this.availableNotebooks = [{
            id: 'default',
            name: 'Default Notebook',
            description: 'Your main notebook',
            icon: '📓',
            color: '#b1b695'
        }];
        this.currentNotebookId = 'default';
        this.currentNotebook = this.availableNotebooks[0];
        this.updateDropdownOptions();
    }

    // Utility methods
    isUserLoggedIn() {
        const currentUser = window.authManager && window.authManager.getCurrentUser();
        return currentUser && !currentUser.isGuest;
    }

    getUserContext() {
        if (window.authManager) {
            return window.authManager.getUserContext();
        }
        return { isGuest: true };
    }

    showToast(message, type = 'info') {
        if (window.authManager && window.authManager.showToast) {
            window.authManager.showToast(message, type);
        } else {
            console.log(`Toast (${type}): ${message}`);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.notebookWorkspaceManager) {
            window.notebookWorkspaceManager = new NotebookWorkspaceManager();
            console.log('✅ Notebook Workspace Manager initialized globally');
        }
    }, 200);
});