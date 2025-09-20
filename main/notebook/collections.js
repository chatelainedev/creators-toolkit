// notebook/collections-manager.js - FIXED VERSION

class CollectionsManager {
    constructor(notebookManager) {
        this.notebook = notebookManager;
        this.collections = new Map();
        this.collapsedCollections = new Set(); // Track collapsed state
        this.initializeCollections();
        this.setupEventListeners();
    }

    // Initialize with default collection
    initializeCollections() {        
        this.collections.set('', {
            name: 'Uncategorized',
            notes: [],
            color: '#666666',
            created: Date.now()
        });        
    }

    // Setup event listeners
    setupEventListeners() {
        // New collection button
        document.getElementById('new-collection-btn')?.addEventListener('click', () => {
            this.showCreateCollectionModal();
        });
    }

    // Show create collection modal
    showCreateCollectionModal(parentKey = null) {        
        // Remove existing modal if any
        const existingModal = document.getElementById('create-collection-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Check level limit if we have a parent
        if (parentKey) {
            const parentLevel = this.getCollectionLevel(parentKey);
            if (parentLevel >= 4) {
                this.notebook.showToast('Maximum nesting level (4) reached', 'warning');
                return;
            }
        }

        const parentCollection = parentKey ? this.getCollection(parentKey) : null;
        const modalTitle = parentKey ? 
            `New Subcollection in "${parentCollection?.name}"` : 
            'New Collection';
        
        const modal = document.createElement('div');
        modal.id = 'create-collection-modal';
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
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 400px; width: 90%; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">${modalTitle}</h3>
                    <button class="close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    ${parentKey ? `
                        <div class="parent-info" style="margin-bottom: var(--space-md); padding: var(--space-sm); background: var(--bg-tertiary); border-radius: var(--radius-md); border-left: 3px solid ${parentCollection?.color || '#b1b695'};">
                            <small style="color: var(--text-tertiary);">Creating subcollection in:</small>
                            <div style="color: var(--text-primary); font-weight: 500;">${this.getCollectionPath(parentKey)}</div>
                        </div>
                    ` : ''}
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Collection Name:</label>
                        <input type="text" id="collection-name-input" placeholder="e.g., Characters, World Building" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Color:</label>
                        <div class="color-options" style="display: flex; gap: 10px; flex-wrap: wrap; max-width: 100%; margin-bottom: var(--space-sm);">
                            <button type="button" class="color-option" data-color="#b1b695" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #b1b695;" title="Default"></button>
                            <button type="button" class="color-option" data-color="#8fbc8f" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8fbc8f;" title="Forest"></button>
                            <button type="button" class="color-option" data-color="#a0c4a0" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #a0c4a0;" title="Sage"></button>
                            <button type="button" class="color-option" data-color="#d2b48c" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #d2b48c;" title="Earth"></button>
                            <button type="button" class="color-option" data-color="#8b4513" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8b4513;" title="Brown"></button>
                            
                            <button type="button" class="color-option" data-color="#87ceeb" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #87ceeb;" title="Sky"></button>
                            <button type="button" class="color-option" data-color="#4682b4" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #4682b4;" title="Steel Blue"></button>
                            <button type="button" class="color-option" data-color="#6495ed" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #6495ed;" title="Ocean"></button>
                            <button type="button" class="color-option" data-color="#1e90ff" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #1e90ff;" title="Deep Blue"></button>
                            <button type="button" class="color-option" data-color="#2f4f4f" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #2f4f4f;" title="Dark Slate"></button>
                            
                            <button type="button" class="color-option" data-color="#dda0dd" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #dda0dd;" title="Plum"></button>
                            <button type="button" class="color-option" data-color="#9370db" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #9370db;" title="Medium Purple"></button>
                            <button type="button" class="color-option" data-color="#8a2be2" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8a2be2;" title="Blue Violet"></button>
                            <button type="button" class="color-option" data-color="#663399" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #663399;" title="Dark Purple"></button>
                            <button type="button" class="color-option" data-color="#4b0082" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #4b0082;" title="Indigo"></button>
                            
                            <button type="button" class="color-option" data-color="#f0e68c" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #f0e68c;" title="Khaki"></button>
                            <button type="button" class="color-option" data-color="#ffa07a" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #ffa07a;" title="Light Salmon"></button>
                            <button type="button" class="color-option" data-color="#ff6347" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #ff6347;" title="Tomato"></button>
                            <button type="button" class="color-option" data-color="#cd853f" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #cd853f;" title="Peru"></button>
                            <button type="button" class="color-option" data-color="#b8860b" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #b8860b;" title="Dark Goldenrod"></button>
                            
                            <button type="button" class="color-option" data-color="#dc143c" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #dc143c;" title="Crimson"></button>
                            <button type="button" class="color-option" data-color="#b22222" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #b22222;" title="Fire Brick"></button>
                            <button type="button" class="color-option" data-color="#8b0000" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8b0000;" title="Dark Red"></button>
                            <button type="button" class="color-option" data-color="#800080" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #800080;" title="Purple"></button>
                            <button type="button" class="color-option" data-color="#696969" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #696969;" title="Dim Gray"></button>
                        </div>
                        ${parentKey ? `<small style="color: var(--text-tertiary);">Leave default to inherit parent color</small>` : ''}
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button type="button" id="create-collection-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-plus"></i> Create Collection
                        </button>
                        <button type="button" class="btn-secondary cancel-btn" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Setup modal functionality
        this.setupCreateCollectionModal(modal, parentKey);
        
        // Focus name input
        const nameInput = document.getElementById('collection-name-input');
        if (nameInput) {
            nameInput.focus();
        }
    }

    // Setup create collection modal functionality - FIXED
    setupCreateCollectionModal(modal, parentKey = null) {
        const nameInput = document.getElementById('collection-name-input');
        const createBtn = document.getElementById('create-collection-btn');
        const colorOptions = modal.querySelectorAll('.color-option');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const closeBtn = modal.querySelector('.close-btn');
        
        // Default color - inherit from parent if exists
        const parentCollection = parentKey ? this.getCollection(parentKey) : null;
        let selectedColor = parentCollection?.color || '#b1b695';
        
        console.log('🗂️ Setting up modal, found elements:', {
            nameInput: !!nameInput,
            createBtn: !!createBtn,
            colorOptions: colorOptions.length,
            cancelBtn: !!cancelBtn,
            closeBtn: !!closeBtn,
            parentKey: parentKey,
            inheritedColor: selectedColor
        });
        
        // Color selection
        colorOptions.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove previous selection
                colorOptions.forEach(opt => opt.style.border = '2px solid transparent');
                // Select this color
                option.style.border = '2px solid var(--text-primary)';
                selectedColor = option.dataset.color;
            });
        });
        
        // Select initial color
        const initialColorOption = modal.querySelector(`[data-color="${selectedColor}"]`);
        if (initialColorOption) {
            initialColorOption.style.border = '2px solid var(--text-primary)';
        } else if (colorOptions[0]) {
            // Fallback to first color if inherited color not found
            colorOptions[0].style.border = '2px solid var(--text-primary)';
            selectedColor = colorOptions[0].dataset.color;
        }
        
        // Create button handler
        if (createBtn) {
            createBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const name = nameInput?.value?.trim();
                
                if (!name) {
                    this.notebook.showToast('Please enter a collection name', 'warning');
                    nameInput?.focus();
                    return;
                }
                
                // Generate full key to check for conflicts
                const fullKey = parentKey ? 
                    `${parentKey}/${name.toLowerCase().replace(/\s+/g, '-')}` : 
                    name.toLowerCase().replace(/\s+/g, '-');
                
                if (this.collections.has(fullKey)) {
                    this.notebook.showToast('A collection with this name already exists at this level', 'warning');
                    nameInput?.focus();
                    return;
                }
                
                try {
                    await this.createCollection(name, selectedColor, parentKey);
                    modal.remove();
                } catch (error) {
                    console.error('🗂️ Error creating collection:', error);
                    this.notebook.showToast(error.message || 'Failed to create collection', 'error');
                }
            });
        }
        
        // Enter key handler
        if (nameInput) {
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    createBtn?.click();
                }
            });
        }
        
        // Close modal handlers
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.remove();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.remove();
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });        
    }

    // Create new collection - FIXED
    async createCollection(name, color = '#b1b695', parentKey = null) {        
        // Generate the collection key
        const collectionKey = parentKey ? 
            `${parentKey}/${name.toLowerCase().replace(/\s+/g, '-')}` : 
            name.toLowerCase().replace(/\s+/g, '-');
        
        // Check level limit (max 4 levels)
        const level = parentKey ? this.getCollectionLevel(parentKey) + 1 : 1;
        if (level > 4) {
            throw new Error('Maximum nesting level (4) exceeded');
        }
        
        // Check for duplicates at same level
        if (this.collections.has(collectionKey)) {
            throw new Error(`A collection named "${name}" already exists at this level`);
        }
        
        // Get inherited color if not specified
        const finalColor = color === '#b1b695' && parentKey ? 
            this.getCollection(parentKey)?.color || color : color;
        
        const collection = {
            name: name,
            notes: [],
            color: finalColor,
            created: Date.now(),
            parent: parentKey,
            level: level
        };
        
        this.collections.set(collectionKey, collection);
        
        // Save to server if user is logged in
        if (this.notebook.isUserLoggedIn()) {
            try {
                await this.saveCollectionsToServer();
            } catch (error) {
                console.error('📁 Failed to save collection to server:', error);
                // Don't fail the creation, just warn
                this.notebook.showToast('Collection created but failed to save to server', 'warning');
            }
        }
        
        // Refresh the notebook view
        this.notebook.renderCollectionsTree();        
    }

    // Edit existing collection
    editCollection(collectionKey) {
        const collection = this.collections.get(collectionKey);
        if (!collection) {
            this.notebook.showToast('Collection not found', 'error');
            return;
        }
        this.showEditCollectionModal(collection, collectionKey);
    }

    // Get collection level from key
    getCollectionLevel(key) {
        if (!key || key === '') return 0;
        return key.split('/').length;
    }

    // Get all children of a collection
    getCollectionChildren(parentKey) {
        return Array.from(this.collections.entries())
            .filter(([key, collection]) => collection.parent === parentKey)
            .map(([key, collection]) => ({ key, ...collection }));
    }

    // Get collection path for display (e.g., "Characters > Protagonists > Main")
    getCollectionPath(key) {
        if (!key || key === '') return 'Uncategorized';
        
        const parts = key.split('/');
        const pathNames = [];
        
        for (let i = 0; i < parts.length; i++) {
            const partialKey = parts.slice(0, i + 1).join('/');
            const collection = this.getCollection(partialKey);
            if (collection) {
                pathNames.push(collection.name);
            }
        }
        
        return pathNames.join(' > ');
    }

    // Check if collection has children
    hasChildren(key) {
        return Array.from(this.collections.values())
            .some(collection => collection.parent === key);
    }

    // Show edit collection modal
    showEditCollectionModal(collection, collectionKey) {
        // Remove existing modal if any
        const existingModal = document.getElementById('edit-collection-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'edit-collection-modal';
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
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 400px; width: 90%; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Edit Collection</h3>
                    <button class="close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Collection Name:</label>
                        <input type="text" id="edit-collection-name-input" placeholder="e.g., Characters, World Building" value="${this.notebook.escapeHtml(collection.name)}" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Color:</label>
                        <div class="color-options" style="display: flex; gap: 10px; flex-wrap: wrap; max-width: 100%; margin-bottom: var(--space-sm);">
                            <!-- Same color options as create modal -->
                            <button type="button" class="color-option" data-color="#b1b695" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #b1b695;" title="Default"></button>
                            <button type="button" class="color-option" data-color="#8fbc8f" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8fbc8f;" title="Forest"></button>
                            <button type="button" class="color-option" data-color="#a0c4a0" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #a0c4a0;" title="Sage"></button>
                            <button type="button" class="color-option" data-color="#d2b48c" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #d2b48c;" title="Earth"></button>
                            <button type="button" class="color-option" data-color="#8b4513" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8b4513;" title="Brown"></button>
                            
                            <button type="button" class="color-option" data-color="#87ceeb" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #87ceeb;" title="Sky"></button>
                            <button type="button" class="color-option" data-color="#4682b4" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #4682b4;" title="Steel Blue"></button>
                            <button type="button" class="color-option" data-color="#6495ed" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #6495ed;" title="Ocean"></button>
                            <button type="button" class="color-option" data-color="#1e90ff" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #1e90ff;" title="Deep Blue"></button>
                            <button type="button" class="color-option" data-color="#2f4f4f" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #2f4f4f;" title="Dark Slate"></button>
                            
                            <button type="button" class="color-option" data-color="#dda0dd" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #dda0dd;" title="Plum"></button>
                            <button type="button" class="color-option" data-color="#9370db" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #9370db;" title="Medium Purple"></button>
                            <button type="button" class="color-option" data-color="#8a2be2" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8a2be2;" title="Blue Violet"></button>
                            <button type="button" class="color-option" data-color="#663399" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #663399;" title="Dark Purple"></button>
                            <button type="button" class="color-option" data-color="#4b0082" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #4b0082;" title="Indigo"></button>
                            
                            <button type="button" class="color-option" data-color="#f0e68c" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #f0e68c;" title="Khaki"></button>
                            <button type="button" class="color-option" data-color="#ffa07a" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #ffa07a;" title="Light Salmon"></button>
                            <button type="button" class="color-option" data-color="#ff6347" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #ff6347;" title="Tomato"></button>
                            <button type="button" class="color-option" data-color="#cd853f" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #cd853f;" title="Peru"></button>
                            <button type="button" class="color-option" data-color="#b8860b" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #b8860b;" title="Dark Goldenrod"></button>
                            
                            <button type="button" class="color-option" data-color="#dc143c" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #dc143c;" title="Crimson"></button>
                            <button type="button" class="color-option" data-color="#b22222" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #b22222;" title="Fire Brick"></button>
                            <button type="button" class="color-option" data-color="#8b0000" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #8b0000;" title="Dark Red"></button>
                            <button type="button" class="color-option" data-color="#800080" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #800080;" title="Purple"></button>
                            <button type="button" class="color-option" data-color="#696969" style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid transparent; cursor: pointer; background: #696969;" title="Dim Gray"></button>
                        </div>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button type="button" id="update-collection-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-save"></i> Update Collection
                        </button>
                        <button type="button" class="btn-secondary cancel-btn" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Setup modal functionality
        this.setupEditCollectionModal(modal, collection, collectionKey);
        
        // Focus name input and select current color
        const nameInput = document.getElementById('edit-collection-name-input');
        if (nameInput) {
            nameInput.focus();
            nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
        }
        
        // Select current color
        const currentColorBtn = modal.querySelector(`[data-color="${collection.color}"]`);
        if (currentColorBtn) {
            currentColorBtn.style.border = '1px solid var(--text-primary)';
        }
    }

    // Setup edit collection modal functionality
    setupEditCollectionModal(modal, collection, collectionKey) {
        const nameInput = document.getElementById('edit-collection-name-input');
        const updateBtn = document.getElementById('update-collection-btn');
        const colorOptions = modal.querySelectorAll('.color-option');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const closeBtn = modal.querySelector('.close-btn');
        
        let selectedColor = collection.color; // Start with current color
        
        // Color selection
        colorOptions.forEach((option) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove previous selection
                colorOptions.forEach(opt => opt.style.border = '1px solid transparent');
                // Select this color
                option.style.border = '1px solid var(--text-primary)';
                selectedColor = option.dataset.color;
            });
        });
        
        // Update button handler
        if (updateBtn) {
            updateBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const name = nameInput?.value?.trim();
                
                if (!name) {
                    this.notebook.showToast('Please enter a collection name', 'warning');
                    nameInput?.focus();
                    return;
                }
                
                // Check if name changed and if new name conflicts
                if (name.toLowerCase() !== collection.name.toLowerCase()) {
                    const newKey = name.toLowerCase();
                    if (this.collections.has(newKey)) {
                        this.notebook.showToast('A collection with this name already exists', 'warning');
                        nameInput?.focus();
                        return;
                    }
                }
                
                try {
                    await this.updateCollection(collectionKey, name, selectedColor);
                    modal.remove();
                } catch (error) {
                    this.notebook.showToast('Failed to update collection', 'error');
                }
            });
        }
        
        // Enter key handler
        if (nameInput) {
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    updateBtn?.click();
                }
            });
        }
        
        // Close modal handlers
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => modal.remove());
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Update existing collection
    async updateCollection(oldKey, newName, newColor) {        
        const collection = this.collections.get(oldKey);
        if (!collection) {
            throw new Error('Collection not found');
        }
        
        const newKey = newName.toLowerCase();
        
        // Update collection properties
        collection.name = newName;
        collection.color = newColor;
        
        // If name changed, we need to update the key
        if (oldKey !== newKey) {
            // Remove from old key and add to new key
            this.collections.delete(oldKey);
            this.collections.set(newKey, collection);
            
            // Update all notes that reference this collection
            this.notebook.savedNotes.forEach(note => {
                if (note.collection === oldKey) {
                    note.collection = newKey;
                }
            });
            
            // Update current note if it's in this collection
            if (this.notebook.currentNote.collection === oldKey) {
                this.notebook.currentNote.collection = newKey;
            }
        }
        
        // Save to server if user is logged in
        if (this.notebook.isUserLoggedIn()) {
            try {
                await this.saveCollectionsToServer();
                
                // If collection key changed, save all affected notes
                if (oldKey !== newKey) {
                    const affectedNotes = this.notebook.savedNotes.filter(note => note.collection === newKey);
                    for (const note of affectedNotes) {
                        await this.notebook.saveNoteToServer(note);
                    }
                }
            } catch (error) {
                throw error;
            }
        }
        
        // Refresh the notebook view
        this.notebook.renderCollectionsTree();        
    }

    // Add note to collection
    addNoteToCollection(noteId, collectionKey) {
        const collection = this.collections.get(collectionKey);
        if (collection && !collection.notes.includes(noteId)) {
            collection.notes.push(noteId);
        }
    }

    // Remove note from collection
    removeNoteFromCollection(noteId, collectionKey) {
        const collection = this.collections.get(collectionKey);
        if (collection) {
            collection.notes = collection.notes.filter(id => id !== noteId);
        }
    }

    // Move note between collections
    moveNote(noteId, fromCollection, toCollection) {
        this.removeNoteFromCollection(noteId, fromCollection);
        this.addNoteToCollection(noteId, toCollection);
        
        // Update the note object
        const note = this.notebook.savedNotes.find(n => n.id === noteId);
        if (note) {
            note.collection = toCollection;
        }
    }

    // Get collection by key
    getCollection(key) {
        return this.collections.get(key);
    }

    // Get all collections
    getAllCollections() {
        return Array.from(this.collections.entries()).map(([key, collection]) => ({
            key,
            ...collection
        }));
    }

    // Toggle collection collapsed state
    toggleCollectionCollapse(collectionKey) {
        const isCurrentlyCollapsed = this.collapsedCollections.has(collectionKey);
        
        if (isCurrentlyCollapsed) {
            // Expanding - remove from collapsed set
            this.collapsedCollections.delete(collectionKey);
        } else {
            // Collapsing - add to collapsed set AND collapse all children
            this.collapsedCollections.add(collectionKey);
            
            // Also collapse all descendants
            this.getAllDescendantKeys(collectionKey).forEach(childKey => {
                this.collapsedCollections.add(childKey);
            });
        }
        
        // Re-render the entire tree to update all states
        this.notebook.renderCollectionsTree();
    }

    // Update collection toggle state in UI
    updateCollectionToggleState(collectionKey) {
        const collectionElement = document.querySelector(`[data-collection-key="${collectionKey}"]`);
        if (!collectionElement) return;
        
        const toggle = collectionElement.querySelector('.collection-toggle');
        const notesList = collectionElement.querySelector('.notes-list');
        const isCollapsed = this.collapsedCollections.has(collectionKey);
        
        if (toggle) {
            toggle.classList.toggle('expanded', !isCollapsed);
        }
        
        if (notesList) {
            notesList.style.display = isCollapsed ? 'none' : 'block';
        }
    }

    // Delete collection
    async deleteCollection(collectionKey) {
        if (collectionKey === '') {
            this.notebook.showToast('Cannot delete Uncategorized', 'warning');
            return;
        }
        
        const collection = this.collections.get(collectionKey);
        if (!collection) return;
        
        // Check for children
        const children = this.getCollectionChildren(collectionKey);
        let confirmMessage = `Delete collection "${collection.name}"?`;
        
        if (children.length > 0) {
            confirmMessage += ` This will also delete ${children.length} subcollection(s).`;
        }
        
        if (collection.notes.length > 0) {
            confirmMessage += ` ${collection.notes.length} note(s) will be moved to Uncategorized.`;
        }
        
        if (!confirm(confirmMessage)) return;
        
        // Move all notes from this collection AND its children to uncategorized
        const allAffectedKeys = [collectionKey, ...this.getAllDescendantKeys(collectionKey)];
        
        allAffectedKeys.forEach(key => {
            const coll = this.collections.get(key);
            if (coll) {
                coll.notes.forEach(noteId => {
                    this.moveNote(noteId, key, '');
                });
                this.collections.delete(key);
            }
        });
        
        // Save and refresh
        if (this.notebook.isUserLoggedIn()) {
            try {
                await this.saveCollectionsToServer();
            } catch (error) {
                console.error('Failed to save collections to server:', error);
            }
        }
        
        this.notebook.renderCollectionsTree();
        this.notebook.showToast(`Deleted collection: ${collection.name}`, 'info');
    }

    // Helper method to get all descendant keys
    getAllDescendantKeys(parentKey) {
        const descendants = [];
        
        for (const [key, collection] of this.collections) {
            if (collection.parent === parentKey) {
                descendants.push(key);
                descendants.push(...this.getAllDescendantKeys(key)); // Recursive
            }
        }
        
        return descendants;
    }

    // Rebuild collections from notes (for initial load)
    rebuildFromNotes(notes) {        
        // Clear note arrays but keep collection definitions
        for (const collection of this.collections.values()) {
            collection.notes = [];
        }
        
        // Add notes to appropriate collections
        notes.forEach(note => {
            let collectionKey = note.collection || '';
            
            // MIGRATE old "default" collection notes to uncategorized
            if (collectionKey === 'default') {
                collectionKey = '';
                note.collection = ''; // Update the note object too
            }
            
            // Create collection if it doesn't exist
            if (!this.collections.has(collectionKey) && collectionKey) {
                this.collections.set(collectionKey, {
                    name: collectionKey,
                    notes: [],
                    color: '#b1b695',
                    created: Date.now()
                });
            }
            
            this.addNoteToCollection(note.id, collectionKey);
        });        
    }

    // Save collections to server
    async saveCollectionsToServer() {
        if (!this.notebook.isUserLoggedIn()) return;
        
        try {
            const collectionsData = this.getAllCollections();
            
            const response = await fetch('/api/notebook/collections/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.notebook.getUserContext(),
                    notebookId: this.notebook.currentNotebookId, 
                    collections: collectionsData
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
            } else {
                throw new Error(result.error || 'Failed to save collections');
            }
        } catch (error) {
            console.error('Error saving collections to server:', error);
            throw error;
        }
    }

    // Load collections from server
    async loadCollectionsFromServer() {
        if (!this.notebook.isUserLoggedIn()) return;
        
        try {
            const response = await fetch('/api/notebook/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.notebook.getUserContext(),
                    notebookId: this.notebook.currentNotebookId, 
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {                
                // Clear existing collections except for built-in ones, then rebuild from server data
                this.collections.clear();
                this.initializeCollections(); // Re-create Uncategorized

                result.collections.forEach(collectionData => {
                    const key = collectionData.key !== undefined ? collectionData.key : collectionData.name.toLowerCase();
                    
                    // Don't duplicate the built-in Uncategorized collection
                    if (key === '') {
                        // Update existing built-in collection if it has different properties
                        const existing = this.collections.get(key);
                        if (existing && collectionData.color) {
                            existing.color = collectionData.color;
                        }
                    } else {
                        // Add non-built-in collections with all new properties
                        this.collections.set(key, {
                            name: collectionData.name,
                            notes: [], // Will be populated by rebuildFromNotes
                            color: collectionData.color || '#b1b695',
                            created: collectionData.created || Date.now(),
                            parent: collectionData.parent || null,           // NEW
                            level: collectionData.level || 1                // NEW
                        });
                    }
                });
                
            } else {
                console.warn('Failed to load collections from server:', result.error);
            }
        } catch (error) {
            console.error('Error loading collections from server:', error);
        }
    }

        // Debug method - call this in console to see what's happening
    debugCollections() {
        console.log('📁 COLLECTIONS DEBUG INFO:');
        console.log('Collections Map:', this.collections);
        console.log('Collections Array:', this.getAllCollections());
        console.log('Collapsed Collections:', this.collapsedCollections);
        console.log('Notebook saved notes:', this.notebook.savedNotes.length);
        console.log('Collections Manager exists:', !!this.notebook.collectionsManager);
        
        // Check if UI elements exist
        const newBtn = document.getElementById('new-collection-btn');
        const container = document.getElementById('collections-tree');
        console.log('New Collection Button:', !!newBtn);
        console.log('Collections Tree Container:', !!container);
        
        if (container) {
            console.log('Collections in UI:', container.children.length);
        }
        
        return {
            collections: this.getAllCollections(),
            collapsed: Array.from(this.collapsedCollections),
            uiElements: {
                newButton: !!newBtn,
                container: !!container,
                containerChildren: container?.children.length || 0
            }
        };
    }
}

// Make available globally
window.CollectionsManager = CollectionsManager; 