// Extractor - Lorebook Management Tool
// Main application logic

class ExtractorApp {
    constructor() {
        this.userSessionManager = null;
        this.authUI = null;
        this.entries = []; // Current working entries
        this.filteredEntries = []; // Filtered/sorted entries for display
        this.currentProject = null;
        this.selectedProject = null; 
        this.availableProjects = [];
        this.currentView = 'compact'; // 'compact' or 'expanded'
        this.individuallyExpandedEntries = new Set(); // Track individually expanded entries
        this.nextEntryId = 1;
        this.categories = []; // Global categories
        this.localCategories = []; // ADD THIS LINE - Project-specific categories
        this.nextCategoryId = 1;
        this.nextLocalCategoryId = 1; // ADD THIS LINE
        this.currentTab = 'bulk-actions';
        this.entryHelper = null;
        this.entryListListenersSetup = false;
        this.categoryListenersSetup = false; 
        this.selectedEntries = new Set(); // Track selected entry IDs
        this.lastSelectedIndex = -1; // For shift+click range selection
        this.draggedElement = null;
        this.draggedIndex = -1;
        this.autoScrollTimer = null;
        this.scrollSpeed = 0;
        // Add search debounce timer
        this.searchDebounceTimer = null;        
        // Add refresh batching flag
        this.refreshScheduled = false;
        this.bulkActions = null;
        this.activeCategories = new Set(); // Track which category IDs are active for current project
        // Available category emojis
        this.availableEmojis = [
            '🌸','🍓','🍰','🐾','🍂','💌','🦋','🍄','🌙','⭐️',
            '🌿','👘','⌛️','📜','⚖️','💬','🗡️','✒️','💾','🎵',
            '📌','🦝','❌','🛠️','📦','🏛️','⚜️','💋','✔️','👥',
            '🏚️','🌍','♂️','♀️','🔑','🚩','🗺️','🟥','🟪','🟦',
            '🟩','🟨','🟧','💰','👛','🎲','📚','🩸','📅','📒',
            '🔖','🌈','❤️','💀','☀️','⚡️','🌱','🍨','🍑','♟',
            '🏞','🌆','🏖','🎎','🧪','🎀','📝','🍁','🍎','🍭',
            '🔮','🎮','🧵','🔔','🎬','🔎','📰','❓'
        ];
        
        // DOM elements (will be set on init)
        this.elements = {};
    }

    // Initialize the application
    async init() {
        console.log('🚀 Initializing Extractor...');
        
        try {
            // Initialize user session
            this.userSessionManager = initializeUserSession();
            await this.userSessionManager.initializeUser();
            
            // Initialize auth UI
            this.authUI = initializeAuthUI(this.userSessionManager);
            
            // Set up DOM elements
            this.setupDOMElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Update user display
            this.userSessionManager.updateUserDisplay();
            
            // Load projects list
            await this.refreshProjects();

            // Load user categories
            await this.loadUserCategories();

            // Initialize bulk actions
            this.bulkActions = new BulkActions(this);

            this.entryHelper = new EntryHelper(this);

            this.initializeContextMenu();

            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.classList.add('show');
            }
            
            console.log('✅ Extractor initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Extractor:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.classList.add('show');
            }
        }
    }

    // Set up DOM element references
    setupDOMElements() {
        this.elements = {
            // Navigation
            importBtn: document.getElementById('import-btn'),
            importFile: document.getElementById('import-file'),
            projectDropdown: document.getElementById('project-dropdown'),
            saveProjectBtn: document.getElementById('save-project-btn'),
            loadProjectBtn: document.getElementById('load-project-btn'),
            viewCompactBtn: document.getElementById('view-compact-btn'),
            viewExpandedBtn: document.getElementById('view-expanded-btn'),

            // Sidebar elements
            sidebarTabs: document.querySelectorAll('.tab-btn'),
            tabPanes: document.querySelectorAll('.tab-pane'),

            // Category elements
            newCategoryName: document.getElementById('new-category-name'),
            categoryIsGlobal: document.getElementById('category-is-global'), 
            addCategoryBtn: document.getElementById('add-category-btn'),
            selectAllCategories: document.getElementById('select-all-categories'),
            categoriesList: document.getElementById('categories-list'),
            iconModal: document.getElementById('icon-modal'),
            iconModalClose: document.getElementById('icon-modal-close'),
            iconGrid: document.getElementById('icon-grid'),
            categoryActivationBtn: document.getElementById('category-activation-btn'),
            categoryActivationOptions: document.getElementById('category-activation-options'),
            categoryActivationText: document.getElementById('category-activation-text'),
            activateCategoriesBtn: document.getElementById('activate-categories-btn'),

            // Bulk action elements
            bulkRevertAll: document.getElementById('bulk-revert-all'),
            bulkSaveAll: document.getElementById('bulk-save-all'),
            bulkDeleteAll: document.getElementById('bulk-delete-all'),
            bulkTitleMode: document.getElementById('bulk-title-mode'),
            bulkPrefix: document.getElementById('bulk-prefix'),
            bulkSuffix: document.getElementById('bulk-suffix'),
            bulkRemoveChars: document.getElementById('bulk-remove-chars'),
            bulkNumbering: document.getElementById('bulk-numbering'),
            bulkNumberingOrder: document.getElementById('bulk-numbering-order'),
            bulkSelectAll: document.getElementById('bulk-select-all'),
            bulkTitlesToggle: document.getElementById('bulk-titles-toggle'),
            bulkTitlesContent: document.getElementById('bulk-titles-content'),
            bulkOrderStart: document.getElementById('bulk-order-start'),
            bulkOrderDirection: document.getElementById('bulk-order-direction'),
            bulkOrderToggle: document.getElementById('bulk-order-toggle'),
            bulkOrderContent: document.getElementById('bulk-order-content'),
            bulkPositionSelect: document.getElementById('bulk-position-select'),
            bulkDepthValue: document.getElementById('bulk-depth-value'),
            bulkRoleSelect: document.getElementById('bulk-role-select'),
            bulkPositionToggle: document.getElementById('bulk-position-toggle'),
            bulkPositionContent: document.getElementById('bulk-position-content'),
            bulkContentPrefix: document.getElementById('bulk-content-prefix'),
            bulkContentSuffix: document.getElementById('bulk-content-suffix'),
            bulkContentRemoveChars: document.getElementById('bulk-content-remove-chars'),
            bulkContentToggle: document.getElementById('bulk-content-toggle'),
            bulkContentContent: document.getElementById('bulk-content-content'),
            bulkCategorySelect: document.getElementById('bulk-category-select'),
            bulkCategoryToggle: document.getElementById('bulk-category-toggle'),
            bulkCategoryContent: document.getElementById('bulk-category-content'),
            
            // Search and controls
            searchInput: document.getElementById('search-input'),
            clearSearch: document.getElementById('clear-search'),
            sortSelect: document.getElementById('sort-select'),
            // Add this line to the elements object:
            addEntryBtn: document.getElementById('add-entry-btn'),
            entryCounterText: document.getElementById('entry-counter-text'),
            
            // Export buttons
            exportTxtBtn: document.getElementById('export-txt-btn'),
            exportMdBtn: document.getElementById('export-md-btn'),
            exportJsonBtn: document.getElementById('export-json-btn'),
            
            // Entry list
            entryList: document.getElementById('entry-list'),
            
            // Modals
            importModal: document.getElementById('import-modal'),
            importModalClose: document.getElementById('import-modal-close'),
            importEntryList: document.getElementById('import-entry-list'),
            selectAllEntries: document.getElementById('select-all-entries'),
            importCancel: document.getElementById('import-cancel'),
            importConfirm: document.getElementById('import-confirm'),
            totalEntries: document.getElementById('total-entries'),
            totalFiles: document.getElementById('total-files'),
            
            editModal: document.getElementById('edit-modal'),
            editModalClose: document.getElementById('edit-modal-close'),
            editName: document.getElementById('edit-name'),
            editContent: document.getElementById('edit-content'),
            editCancel: document.getElementById('edit-cancel'),
            editSave: document.getElementById('edit-save'),
            editDelete: document.getElementById('edit-delete'),
            // Add to the elements object around line 65:
            editKeys: document.getElementById('edit-keys'),
            editSecondaryKeys: document.getElementById('edit-secondary-keys'),
            editLogic: document.getElementById('edit-logic'),

            // Settings modal (add this section)
            settingsBtn: document.getElementById('settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            settingsModalClose: document.getElementById('settings-modal-close'),
            sillyTavernFolderPath: document.getElementById('sillytavern-folder-path'),
            settingsCancel: document.getElementById('settings-cancel'),
            settingsSave: document.getElementById('settings-save'),
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // View controls
        this.elements.viewCompactBtn.addEventListener('click', () => this.setView('compact'));
        this.elements.viewExpandedBtn.addEventListener('click', () => this.setView('expanded'));

        // Import functionality
        this.elements.importBtn.addEventListener('click', () => this.elements.importFile.click());
        this.elements.importFile.addEventListener('change', (e) => this.handleFileImport(e));
        
        // Search functionality
        this.elements.searchInput.addEventListener('input', () => this.handleSearch());
        this.elements.clearSearch.addEventListener('click', () => this.clearSearch());
        this.elements.sortSelect.addEventListener('change', () => this.handleSort());

        // Add entry functionality
        this.elements.addEntryBtn.addEventListener('click', () => this.addNewEntry());
        
        // Export functionality
        this.elements.exportTxtBtn.addEventListener('click', () => this.exportEntries('txt'));
        this.elements.exportMdBtn.addEventListener('click', () => this.exportEntries('md'));
        this.elements.exportJsonBtn.addEventListener('click', () => this.exportEntries('json'));
        
        // Project management
        this.elements.projectDropdown.addEventListener('change', () => this.handleProjectSelection());
        this.elements.saveProjectBtn.addEventListener('click', () => this.saveProject());
        this.elements.loadProjectBtn.addEventListener('click', () => this.handleProjectButton());
        
        // Import modal
        this.elements.importModalClose.addEventListener('click', () => this.closeImportModal());
        this.elements.importCancel.addEventListener('click', () => this.closeImportModal());
        this.elements.importConfirm.addEventListener('click', () => this.confirmImport());
        this.elements.selectAllEntries.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        
        // Edit modal
        this.elements.editModalClose.addEventListener('click', () => this.closeEditModal());
        this.elements.editCancel.addEventListener('click', () => this.closeEditModal());
        this.elements.editSave.addEventListener('click', () => this.saveEntryEdit());
        this.elements.editDelete.addEventListener('click', () => this.deleteEntry());

        // Settings modal (add this section)
        this.elements.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        this.elements.settingsModalClose.addEventListener('click', () => this.closeSettingsModal());
        this.elements.settingsCancel.addEventListener('click', () => this.closeSettingsModal());
        this.elements.settingsSave.addEventListener('click', () => this.saveSettings());

        // Sidebar tab switching
        this.elements.sidebarTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.currentTarget; // Use currentTarget instead of target
                const tabName = button.dataset.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });

        // Category management
        this.elements.newCategoryName.addEventListener('input', () => this.validateCategoryName());
        this.elements.addCategoryBtn.addEventListener('click', () => this.addCategory());
        this.elements.newCategoryName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.elements.addCategoryBtn.disabled) {
                this.addCategory();
            }
        });
        this.elements.selectAllCategories.addEventListener('change', (e) => this.toggleAllCategories(e.target.checked));
        // Category activation
        this.elements.activateCategoriesBtn.addEventListener('click', () => this.activateSelectedCategories());

        // Category activation dropdown
        this.elements.categoryActivationBtn.addEventListener('click', () => {
            const dropdown = this.elements.categoryActivationBtn.parentElement;
            dropdown.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-activation-dropdown')) {
                document.querySelectorAll('.category-activation-dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
        
        // SET UP ENTRY LIST LISTENERS ONLY ONCE
        this.setupEntryListListeners();
        
        // SET UP CATEGORY LISTENERS ONLY ONCE
        this.setupCategoryEventListeners();
        
        // User avatar context menu is handled by initializeExtractorContextMenu()
        // (removed direct click handler - now shows context menu instead)
        
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImportModal();
                this.closeEditModal();
            }
        });

        // Close modals when clicking on overlay
        this.elements.importModal.addEventListener('click', (e) => {
            if (e.target === this.elements.importModal) {
                this.closeImportModal();
            }
        });

        this.elements.editModal.addEventListener('click', (e) => {
            if (e.target === this.elements.editModal) {
                this.closeEditModal();
            }
        });

        // Icon modal
        this.elements.iconModalClose.addEventListener('click', () => this.closeIconModal());
        this.elements.iconModal.addEventListener('click', (e) => {
            if (e.target === this.elements.iconModal) {
                this.closeIconModal();
            }
        });

        // Icon grid clicks - ADD THIS
        this.elements.iconGrid.addEventListener('click', (e) => this.handleIconSelection(e));

        // CLEANUP HANDLERS FOR AUTO-SCROLL TIMER
        // Clean up on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanupAutoScroll();
            }
        });
        
        // Clean up on window blur
        window.addEventListener('blur', () => {
            this.cleanupAutoScroll();
        });
        
        // Clean up before page unload
        window.addEventListener('beforeunload', () => {
            this.cleanupAutoScroll();
        });
    }

    // UPDATED: Entry list event listeners with simple category select
    setupEntryListListeners() {
        if (this.entryListListenersSetup) return; // Prevent multiple setups
        
        // Click handler for entry list (for non-edit interactions)
        this.elements.entryList.addEventListener('click', (e) => {
            // PRIORITY 1: Handle action buttons
            if (e.target.closest('.delete-btn')) {
                e.stopPropagation();
                e.preventDefault();
                const deleteBtn = e.target.closest('.delete-btn');
                const entryId = parseInt(deleteBtn.dataset.entryId);
                this.deleteEntryFromList(entryId);
                return;
            }
            
            // PRIORITY 2: Handle checkbox selection
            if (e.target.closest('.entry-select-checkbox')) {
                const checkbox = e.target.closest('.entry-select-checkbox').querySelector('input[type="checkbox"]');
                if (checkbox) {
                    const entryId = parseInt(checkbox.dataset.entryId);
                    // Toggle the checkbox state
                    checkbox.checked = !checkbox.checked;
                    // Handle the selection with shift key info
                    this.handleEntrySelection(entryId, checkbox.checked, e.shiftKey);
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
            }
            
            // PRIORITY 3: Handle form controls (prevent any other interactions)
            if (e.target.closest('.entry-actions')) {
                // Don't do anything for other actions area clicks
                e.stopPropagation();
                return;
            }

            
            // PRIORITY 4: Handle expand toggle
            if (e.target.closest('.entry-expand-toggle')) {
                e.stopPropagation();
                e.preventDefault();
                const toggleBtn = e.target.closest('.entry-expand-toggle');
                const entryId = parseInt(toggleBtn.dataset.entryId);
                this.toggleIndividualExpand(entryId);
                return;
            }
        });

        // Double-click handler for editing entries
        this.elements.entryList.addEventListener('dblclick', (e) => {
            // Don't trigger on action buttons or checkboxes
            if (e.target.closest('.entry-actions') || e.target.closest('.entry-select-checkbox')) {
                return;
            }
            
            const entryItem = e.target.closest('.entry-item');
            if (entryItem) {
                const entryId = parseInt(entryItem.dataset.entryId);
                this.editEntry(entryId);
                e.stopPropagation();
            }
        });

        // Input handler for order changes
        this.elements.entryList.addEventListener('input', (e) => {
            if (e.target.classList.contains('order-input')) {
                const entryId = parseInt(e.target.dataset.entryId);
                const newOrder = parseInt(e.target.value) || 100;
                this.updateOrder(entryId, newOrder);
            }
        });

        // Change handlers for position, role, constant toggles, AND CATEGORY
        this.elements.entryList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.constant-toggle')) {
                const toggle = e.target.closest('.constant-toggle');
                const entryId = parseInt(toggle.dataset.entryId);
                this.toggleConstant(entryId, e.target.checked);
            }
            
            if (e.target.classList.contains('position-select')) {
                const entryId = parseInt(e.target.dataset.entryId);
                const newPosition = parseInt(e.target.value);
                this.updatePosition(entryId, newPosition);
            }
            
            if (e.target.classList.contains('role-select')) {
                const entryId = parseInt(e.target.dataset.entryId);
                const newRole = parseInt(e.target.value);
                this.updateRole(entryId, newRole);
            }

            if (e.target.classList.contains('depth-input')) {
                const entryId = parseInt(e.target.dataset.entryId);
                const newDepth = parseInt(e.target.value) || 1;
                this.updateDepth(entryId, newDepth);
            }

            // Handle category selection - SIMPLE!
            if (e.target.classList.contains('entry-category-select')) {
                const entryId = parseInt(e.target.dataset.entryId);
                const categoryId = e.target.value ? parseInt(e.target.value) : null;
                this.updateEntryCategory(entryId, categoryId);
            }
        });

        // Drag and drop handlers
        this.elements.entryList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('entry-item')) {
                this.draggedElement = e.target;
                this.draggedIndex = parseInt(e.target.dataset.entryId);
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        this.elements.entryList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('entry-item')) {
                e.target.style.opacity = '';
                this.draggedElement = null;
                this.draggedIndex = -1;
                
                // Remove all drop indicators
                document.querySelectorAll('.entry-item').forEach(item => {
                    item.classList.remove('drag-over-top', 'drag-over-bottom');
                });
                
                // Stop auto-scrolling
                this.stopAutoScroll();
            }
        });

        this.elements.entryList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const targetItem = e.target.closest('.entry-item');
            if (targetItem && targetItem !== this.draggedElement) {
                // Remove existing indicators
                document.querySelectorAll('.entry-item').forEach(item => {
                    item.classList.remove('drag-over-top', 'drag-over-bottom');
                });
                
                // Calculate if we're in the top or bottom half
                const rect = targetItem.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                
                if (e.clientY < midY) {
                    targetItem.classList.add('drag-over-top');
                } else {
                    targetItem.classList.add('drag-over-bottom');
                }
            }
            
            // Handle auto-scrolling
            this.handleAutoScroll(e);
        });

        this.elements.entryList.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const targetItem = e.target.closest('.entry-item');
            if (targetItem && targetItem !== this.draggedElement && this.draggedIndex !== -1) {
                const targetId = parseInt(targetItem.dataset.entryId);
                
                // Calculate drop position
                const rect = targetItem.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                const dropAfter = e.clientY >= midY;
                
                this.reorderEntries(this.draggedIndex, targetId, dropAfter);
            }
            
            // Clean up
            document.querySelectorAll('.entry-item').forEach(item => {
                item.classList.remove('drag-over-top', 'drag-over-bottom');
            });
            
            // Stop auto-scrolling
            this.stopAutoScroll();
        });

        this.entryListListenersSetup = true; // Mark as set up
    }

    // Settings methods
    openSettingsModal() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            this.authUI?.showLoginModal();
            return;
        }
        
        this.elements.settingsModal.style.display = 'flex';
        this.loadSettings();
        setTimeout(() => this.elements.sillyTavernFolderPath.focus(), 100);
    }

    closeSettingsModal() {
        this.elements.settingsModal.style.display = 'none';
    }

    async loadSettings() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/load-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (response.ok) {
                const settings = await response.json();
                this.elements.sillyTavernFolderPath.value = settings.sillyTavernPath || '';
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            this.authUI?.showLoginModal();
            return;
        }
        
        const sillyTavernPath = this.elements.sillyTavernFolderPath.value.trim();
        
        if (!sillyTavernPath) {
            showToast('warning', 'Please enter a SillyTavern folder path');
            return;
        }
        
        const settings = {
            sillyTavernPath: sillyTavernPath
        };
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/save-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, settings })
            });
            
            if (response.ok) {
                showToast('success', 'Settings saved successfully');
                this.closeSettingsModal();
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('error', 'Failed to save settings');
        }
    }

    // Show icon selection modal
    showIconSelectionModal(categoryId) {
        this.currentIconCategoryId = categoryId;
        
        // Check both global and local categories
        const isLocal = categoryId.toString().startsWith('local_');
        const categoryArray = isLocal ? this.localCategories : this.categories;
        const category = categoryArray.find(cat => cat.id === categoryId);
        
        // Populate icon grid
        const html = this.availableEmojis.map(emoji => `
            <div class="icon-option${category?.icon === emoji ? ' selected' : ''}" data-icon="${emoji}">
                ${emoji}
            </div>
        `).join('');
        
        this.elements.iconGrid.innerHTML = html;
        this.elements.iconModal.style.display = 'flex';
        
        // Note: Event listener is set up once in setupCategoryEventListeners()
        // We don't add it here to avoid duplicates
    }

    // Handle icon selection
    handleIconSelection(e) {
        if (e.target.classList.contains('icon-option')) {
            const selectedIcon = e.target.dataset.icon;
            
            // Check both global and local categories
            const isLocal = this.currentIconCategoryId.toString().startsWith('local_');
            const categoryArray = isLocal ? this.localCategories : this.categories;
            const category = categoryArray.find(cat => cat.id === this.currentIconCategoryId);
            
            if (category) {
                category.icon = selectedIcon;
                this.renderCategories();
                this.refreshEntryList(); // Update entry displays
                
                // Only save to file if global
                if (!isLocal) {
                    this.saveUserCategories();
                }
            }
            
            this.closeIconModal();
        }
    }

    // Close icon modal
    closeIconModal() {
        this.elements.iconModal.style.display = 'none';
        this.currentIconCategoryId = null;
    }

    // Reorder entries based on drag and drop
    reorderEntries(draggedEntryId, targetEntryId, dropAfter) {
        // Find the dragged entry in the main entries array
        const draggedIndex = this.entries.findIndex(e => e._internalId === draggedEntryId);
        const targetIndex = this.entries.findIndex(e => e._internalId === targetEntryId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Remove the dragged entry from its current position
        const draggedEntry = this.entries.splice(draggedIndex, 1)[0];
        
        // Calculate the new insertion index
        let newIndex = targetIndex;
        
        // If we removed an item before the target, adjust the target index
        if (draggedIndex < targetIndex) {
            newIndex--;
        }
        
        // If dropping after the target, increment the index
        if (dropAfter) {
            newIndex++;
        }
        
        // Insert the dragged entry at the new position
        this.entries.splice(newIndex, 0, draggedEntry);
        
        // Refresh the display
        this.refreshEntryList();
        
        console.log(`Moved entry "${draggedEntry.comment}" to position ${newIndex + 1}`);
    }

    // Handle auto-scrolling during drag
    handleAutoScroll(e) {
        const container = this.elements.entryList;
        const containerRect = container.getBoundingClientRect();
        const scrollZone = 50; // Pixels from edge to trigger scroll
        const maxScrollSpeed = 10; // Max pixels per frame
        
        // Calculate distance from top and bottom edges
        const distanceFromTop = e.clientY - containerRect.top;
        const distanceFromBottom = containerRect.bottom - e.clientY;
        
        let newScrollSpeed = 0;
        
        // Check if we're in the top scroll zone
        if (distanceFromTop < scrollZone && distanceFromTop > 0) {
            // Closer to edge = faster scroll
            const intensity = (scrollZone - distanceFromTop) / scrollZone;
            newScrollSpeed = -intensity * maxScrollSpeed; // Negative for upward scroll
        }
        // Check if we're in the bottom scroll zone
        else if (distanceFromBottom < scrollZone && distanceFromBottom > 0) {
            // Closer to edge = faster scroll
            const intensity = (scrollZone - distanceFromBottom) / scrollZone;
            newScrollSpeed = intensity * maxScrollSpeed; // Positive for downward scroll
        }
        
        // Update scroll speed and start/continue scrolling
        if (newScrollSpeed !== 0) {
            this.scrollSpeed = newScrollSpeed;
            this.startAutoScroll();
        } else {
            this.stopAutoScroll();
        }
    }

    // Start auto-scrolling
    startAutoScroll() {
        if (this.autoScrollTimer) return; // Already scrolling
        
        this.autoScrollTimer = setInterval(() => {
            if (this.scrollSpeed !== 0) {
                this.elements.entryList.scrollTop += this.scrollSpeed;
            }
        }, 16); // ~60fps
    }

    // Stop auto-scrolling
    stopAutoScroll() {
        if (this.autoScrollTimer) {
            clearInterval(this.autoScrollTimer);
            this.autoScrollTimer = null;
            this.scrollSpeed = 0;
        }
    }

    // Emergency cleanup for auto-scroll timer
    cleanupAutoScroll() {
        this.stopAutoScroll();
        this.draggedElement = null;
        this.draggedIndex = -1;
        
        // Remove all drag indicators
        document.querySelectorAll('.entry-item').forEach(item => {
            item.classList.remove('drag-over-top', 'drag-over-bottom');
            item.style.opacity = '';
        });
    }

    // IMPROVED: Better context menu creation with more robust event handling
    showCategoryContextMenu(e, categoryId) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove any existing context menu
        this.hideCategoryContextMenu();
        
        // Check both global and local categories
        const isLocal = typeof categoryId === 'string' && categoryId.startsWith('local_');
        const categoryArray = isLocal ? this.localCategories : this.categories;
        const category = categoryArray.find(cat => cat.id === categoryId);
        
        if (!category) {
            console.error('Category not found:', categoryId);
            return;
        }
        
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'category-context-menu';
        contextMenu.id = 'category-context-menu';
        
        // Add menu items
        contextMenu.innerHTML = `
            <button class="context-menu-item" data-action="edit">
                <i class="fas fa-edit"></i>
                Rename Category
            </button>
            <div class="context-menu-separator"></div>
            <button class="context-menu-item danger" data-action="delete">
                <i class="fas fa-trash"></i>
                Delete Category
            </button>
        `;
        
        // Add to body first for size calculation
        document.body.appendChild(contextMenu);
        
        // Calculate position to keep menu on screen
        const rect = contextMenu.getBoundingClientRect();
        let x = e.clientX;
        let y = e.clientY;
        
        // Adjust if menu would go off screen
        if (x + rect.width > window.innerWidth) {
            x = window.innerWidth - rect.width - 10;
        }
        if (y + rect.height > window.innerHeight) {
            y = window.innerHeight - rect.height - 10;
        }
        
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.style.display = 'block';
        
        // Store category ID for actions
        contextMenu.dataset.categoryId = categoryId;
        
        // IMPROVED: Add click handlers with better event handling
        contextMenu.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent bubbling
            const menuItem = event.target.closest('.context-menu-item');
            const action = menuItem?.dataset.action;
            
            if (action) {
                this.handleCategoryContextAction(action, categoryId);
            }
        });
        
        // Highlight the target category
        const categoryItem = document.querySelector(`[data-category-id="${categoryId}"]`);
        if (categoryItem) {
            categoryItem.classList.add('context-menu-target');
        }
    }

    // IMPROVED: Better context menu hiding
    hideCategoryContextMenu() {
        const existingMenu = document.getElementById('category-context-menu');
        if (existingMenu) {
            existingMenu.remove();
            console.log('Context menu removed'); // Debug log
        }
        
        // Remove highlight from all categories
        document.querySelectorAll('.category-item.context-menu-target').forEach(item => {
            item.classList.remove('context-menu-target');
        });
    }

    // IMPROVED: Better action handling with more feedback
    async handleCategoryContextAction(action, categoryId) {
        // Check both global and local categories
        const isLocal = typeof categoryId === 'string' && categoryId.startsWith('local_');
        const categoryArray = isLocal ? this.localCategories : this.categories;
        const category = categoryArray.find(cat => cat.id === categoryId);
        
        if (!category) {
            console.error('Category not found for action:', action, categoryId);
            return;
        }
        
        this.hideCategoryContextMenu();
        
        switch (action) {
            case 'edit':
                this.startCategoryEdit(categoryId);
                break;
                
            case 'delete':
                await this.deleteCategory(categoryId);
                break;
                
            default:
                console.warn('Unknown context menu action:', action);
        }
    }

    // Start editing a category name
    startCategoryEdit(categoryId) {
        const categoryNameInput = document.querySelector(`[data-category-id="${categoryId}"].category-name`);
        if (categoryNameInput) {
            categoryNameInput.readOnly = false;
            categoryNameInput.focus();
            categoryNameInput.select();
        }
    }

    // Delete a category
    async deleteCategory(categoryId) {
        // Find in either global or local
        const isGlobal = !categoryId.toString().startsWith('local_');
        const categoryArray = isGlobal ? this.categories : this.localCategories;
        const category = categoryArray.find(cat => cat.id === categoryId);
        
        if (!category) return;
        
        const categoryName = category.name;
        
        // Count entries using this category
        const entriesUsingCategory = this.entries.filter(entry => entry._categoryId === categoryId);
        const entryCount = entriesUsingCategory.length;
        
        // Confirm deletion
        let confirmMessage = `Are you sure you want to delete the category "${categoryName}"?`;
        if (entryCount > 0) {
            confirmMessage += `\n\nThis will remove the category from ${entryCount} entries.`;
        }
        
        if (!confirm(confirmMessage)) {
            return;
        }
        
        try {
            // Remove category from entries
            entriesUsingCategory.forEach(entry => {
                delete entry._categoryId;
            });
            
            // Remove category from appropriate array
            const categoryIndex = categoryArray.findIndex(cat => cat.id === categoryId);
            if (categoryIndex >= 0) {
                categoryArray.splice(categoryIndex, 1);
            }
            
            // Save if global
            if (isGlobal) {
                await this.saveUserCategories();
            }
            
            // Re-render everything
            this.renderCategories();
            this.refreshEntryList();
            
            // Show success message
            let successMessage = `Category "${categoryName}" deleted`;
            if (entryCount > 0) {
                successMessage += ` and removed from ${entryCount} entries`;
            }
            showToast('success', successMessage);
            
        } catch (error) {
            console.error('Error deleting category:', error);
            showToast('error', 'Failed to delete category');
        }
    }

    populateCategoryActivationDropdown() {
        const optionsContainer = this.elements.categoryActivationOptions;
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = '';
        
        // Global categories section
        if (this.categories.length > 0) {
            const globalHeader = document.createElement('div');
            globalHeader.className = 'category-activation-group-header';
            globalHeader.textContent = 'GLOBAL';
            optionsContainer.appendChild(globalHeader);
            
            this.categories.forEach(category => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'category-activation-option';
                optionDiv.innerHTML = `
                    <input type="checkbox" id="cat-${category.id}" value="${category.id}" 
                        ${this.activeCategories.has(category.id) ? 'checked' : ''}>
                    <label for="cat-${category.id}">${category.name}</label>
                `;
                optionsContainer.appendChild(optionDiv);
            });
        }
        
        // Local categories section (always shown, always "active" for their project)
        if (this.localCategories.length > 0) {
            const localHeader = document.createElement('div');
            localHeader.className = 'category-activation-group-header';
            localHeader.textContent = 'PROJECT';
            optionsContainer.appendChild(localHeader);
            
            this.localCategories.forEach(category => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'category-activation-option category-activation-local';
                optionDiv.innerHTML = `
                    <input type="checkbox" id="cat-${category.id}" value="${category.id}" 
                        checked disabled>
                    <label for="cat-${category.id}">${category.name}</label>
                `;
                optionsContainer.appendChild(optionDiv);
            });
        }
        
        this.updateActivationButtonText();
    }

    updateActivationButtonText() {
        const activeCount = this.activeCategories.size;
        const totalCount = this.categories.length;
        
        if (activeCount === 0) {
            this.elements.categoryActivationText.textContent = 'Select categories...';
        } else {
            this.elements.categoryActivationText.textContent = `${activeCount} of ${totalCount} categories active`;
        }
    }

    activateSelectedCategories() {
        const optionsContainer = this.elements.categoryActivationOptions;
        const checkedBoxes = optionsContainer.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
        
        this.activeCategories.clear();
        selectedIds.forEach(id => this.activeCategories.add(id));
        
        // Close the dropdown
        const dropdown = this.elements.categoryActivationBtn.parentElement;
        dropdown.classList.remove('open');
        
        // Update button text
        this.updateActivationButtonText();
        
        this.renderCategories();
        this.refreshEntryList();
        showToast('info', `Activated ${selectedIds.length} categories`);
    }

    // Populate bulk category dropdown
    populateBulkCategoryDropdown() {
        const select = this.elements.bulkCategorySelect;
        if (!select) return;
        
        // Clear existing options except the first two
        while (select.options.length > 2) {
            select.remove(2);
        }
        
        // Get display categories (active globals + all locals)
        const displayCategories = this.getDisplayCategories();
        
        // Group them
        const globalCategories = displayCategories.filter(cat => cat.isGlobal);
        const localCategories = displayCategories.filter(cat => !cat.isGlobal);
        
        // Add global categories
        if (globalCategories.length > 0) {
            const globalGroup = document.createElement('optgroup');
            globalGroup.label = 'Global';
            globalCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                globalGroup.appendChild(option);
            });
            select.appendChild(globalGroup);
        }
        
        // Add local categories
        if (localCategories.length > 0) {
            const localGroup = document.createElement('optgroup');
            localGroup.label = 'Project';
            localCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                localGroup.appendChild(option);
            });
            select.appendChild(localGroup);
        }
    }

    // UPDATED: Enhanced category event listeners with better context menu handling
    setupCategoryEventListeners() {
        if (this.categoryListenersSetup) return; // Prevent multiple setups
        
        // Right-click context menu for categories - IMPROVED
        this.elements.categoriesList.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Prevent browser context menu
            e.stopPropagation(); // Stop event bubbling
            
            const categoryItem = e.target.closest('.category-item');
            if (categoryItem) {
                const categoryIdStr = categoryItem.dataset.categoryId;
                // Keep as string if local, parse as int if global
                const categoryId = categoryIdStr.startsWith('local_') ? categoryIdStr : parseInt(categoryIdStr);
                console.log('Right-click detected on category:', categoryId); // Debug log
                this.showCategoryContextMenu(e, categoryId);
            }
        });
        
        // Icon button clicks
        this.elements.categoriesList.addEventListener('click', (e) => {
            // Hide context menu on any click
            this.hideCategoryContextMenu();
            
            // Handle icon button clicks
            if (e.target.closest('.category-icon-btn')) {
                const button = e.target.closest('.category-icon-btn');
                const categoryIdStr = button.dataset.categoryId;
                // Parse as int if numeric, keep as string if local_
                const categoryId = categoryIdStr.startsWith('local_') ? categoryIdStr : parseInt(categoryIdStr);
                this.showIconSelectionModal(categoryId);
                e.stopPropagation();
            }
        });

        // Other changes (color, visibility)
        this.elements.categoriesList.addEventListener('change', (e) => {
            // Color changes
            if (e.target.classList.contains('category-color-picker')) {
                const categoryIdStr = e.target.dataset.categoryId;
                const isLocal = categoryIdStr.startsWith('local_');
                const categoryId = isLocal ? categoryIdStr : parseInt(categoryIdStr);
                const categoryArray = isLocal ? this.localCategories : this.categories;
                const category = categoryArray.find(cat => cat.id === categoryId);
                
                if (category) {
                    category.color = e.target.value;
                    this.refreshEntryList(); // Update entry overlays
                    
                    // Only save to file if global
                    if (!isLocal) {
                        this.saveUserCategories();
                    }
                }
            }
            
            // Visibility changes
            if (e.target.type === 'checkbox' && e.target.dataset.categoryId) {
                const categoryIdStr = e.target.dataset.categoryId;
                const isLocal = categoryIdStr.startsWith('local_');
                const categoryId = isLocal ? categoryIdStr : parseInt(categoryIdStr);
                const categoryArray = isLocal ? this.localCategories : this.categories;
                const category = categoryArray.find(cat => cat.id === categoryId);
                
                if (category) {
                    category.visible = e.target.checked;
                    this.refreshEntryList(); // Update entry visibility
                    
                    // Only save to file if global
                    if (!isLocal) {
                        this.saveUserCategories();
                    }
                }
            }
        });
        
        // Double-click to edit names
        this.elements.categoriesList.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('category-name')) {
                e.target.readOnly = false;
                e.target.focus();
                e.target.select();
            }
        });
        
        // Save name changes
        this.elements.categoriesList.addEventListener('blur', (e) => {
            if (e.target.classList.contains('category-name')) {
                const categoryIdStr = e.target.dataset.categoryId;
                const isLocal = categoryIdStr.startsWith('local_');
                const categoryId = isLocal ? categoryIdStr : parseInt(categoryIdStr);
                const categoryArray = isLocal ? this.localCategories : this.categories;
                const category = categoryArray.find(cat => cat.id === categoryId);
                
                if (category) {
                    const newName = e.target.value.trim();
                    if (newName && newName !== category.name) {
                        // Check for duplicate names in the same scope
                        const isDuplicate = categoryArray.some(cat => 
                            cat.id !== categoryId && cat.name.toLowerCase() === newName.toLowerCase()
                        );
                        
                        if (isDuplicate) {
                            showToast('error', 'Category name already exists');
                            e.target.value = category.name;
                        } else {
                            category.name = newName;
                            
                            // Only save to file if global
                            if (!isLocal) {
                                this.saveUserCategories();
                            }
                            
                            showToast('success', `Category renamed to "${newName}"`);
                        }
                    } else {
                        e.target.value = category.name; // Restore original name
                    }
                }
                e.target.readOnly = true;
            }
        }, true);
        
        // Handle Enter/Escape keys for name editing
        this.elements.categoriesList.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('category-name')) {
                e.target.blur(); // Trigger the blur event to save
            }
            if (e.key === 'Escape' && e.target.classList.contains('category-name')) {
                const categoryIdStr = e.target.dataset.categoryId;
                const isLocal = categoryIdStr.startsWith('local_');
                const categoryId = isLocal ? categoryIdStr : parseInt(categoryIdStr);
                const categoryArray = isLocal ? this.localCategories : this.categories;
                const category = categoryArray.find(cat => cat.id === categoryId);
                
                if (category) {
                    e.target.value = category.name; // Restore original name
                }
                e.target.readOnly = true;
            }
        });
        
        // IMPROVED: Global click handler to close context menu and dropdowns
        document.addEventListener('click', (e) => {
            // Close category dropdowns if click is outside
            if (!e.target.closest('.category-icon-dropdown')) {
                document.querySelectorAll('.category-icon-dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
            
            // Close context menu if click is outside
            if (!e.target.closest('.category-context-menu')) {
                this.hideCategoryContextMenu();
            }
        });

        this.categoryListenersSetup = true; // Mark as set up
    }

    // Handle file import
    async handleFileImport(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        console.log(`📁 Importing ${files.length} file(s)...`);
        
        try {
            const lorebookData = [];
            
            for (const file of files) {
                if (!file.name.toLowerCase().endsWith('.json')) {
                    showToast('error', `Skipping ${file.name} - not a JSON file`);
                    continue;
                }
                
                const content = await this.readFileAsText(file);
                lorebookData.push({
                    filename: file.name,
                    content: content
                });
            }
            
            if (lorebookData.length === 0) {
                showToast('warning', 'No valid JSON files selected');
                return;
            }
            
            // Send to server for processing
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/import-lorebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    lorebookData
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.entries && result.entries.length > 0) {
                    this.showImportModal(result.entries, files.length);
                } else {
                    showToast('warning', 'No valid entries found in selected files');
                }
            } else {
                throw new Error('Import processing failed');
            }
            
        } catch (error) {
            console.error('Error importing files:', error);
            showToast('error', 'Failed to import files. Please check the file format.');
        }
        
        // Clear file input
        event.target.value = '';
    }

    // Show import preview modal
    showImportModal(importData, fileCount) {
        this.pendingImport = importData;
        
        this.elements.totalEntries.textContent = importData.length;
        this.elements.totalFiles.textContent = fileCount;
        
        // Populate entry list
        const listHtml = importData.map(entry => `
            <div class="import-entry-item">
                <label>
                    <input type="checkbox" checked data-import-id="${entry._importId}">
                    <span class="entry-name">${this.escapeHtml(entry.comment || 'Untitled Entry')}</span>
                </label>
                <div class="import-entry-source">${entry._sourceFile}</div>
            </div>
        `).join('');
        
        this.elements.importEntryList.innerHTML = listHtml;
        this.elements.selectAllEntries.checked = true;
        this.elements.importModal.style.display = 'flex';
    }

    // Close import modal
    closeImportModal() {
        this.elements.importModal.style.display = 'none';
        this.pendingImport = null;
    }

    // Toggle select all in import modal
    toggleSelectAll(checked) {
        const checkboxes = this.elements.importEntryList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = checked);
    }

    // Confirm import
    confirmImport() {
        const checkboxes = this.elements.importEntryList.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.importId);
        
        const selectedEntries = this.pendingImport.filter(entry => 
            selectedIds.includes(entry._importId)
        );
        
        if (selectedEntries.length === 0) {
            showToast('warning', 'No entries selected for import');
            return;
        }
        
        // Add entries to current project
        selectedEntries.forEach(entry => {
            // Assign new internal ID while preserving original fields
            entry._internalId = this.nextEntryId++;
        });
        
        this.entries.push(...selectedEntries);
        this.updateNextEntryId();
        this.refreshEntryList();
        this.updateButtonStates();
        
        showToast('success', `Imported ${selectedEntries.length} entries`);
        this.closeImportModal();
    }

    // Render a single entry item
    renderEntryItem(entry) {
        const name = this.escapeHtml(entry.comment || 'Untitled Entry');
        const content = this.escapeHtml(entry.content || '');
        const source = (entry._sourceFile || 'Unknown').replace(/\.json$/i, '');
        const tokenCount = this.calculateTokenCount(content);
        
        // Get keys
        const keys = entry.key || [];
        const keyString = keys.join(', ');
        
        // Check if this entry has individual override
        const isInOverrideSet = this.individuallyExpandedEntries.has(entry._internalId);
        
        // Determine effective display state
        let showExpanded;
        if (this.currentView === 'compact') {
            // In compact view: expanded if in override set
            showExpanded = isInOverrideSet;
        } else {
            // In expanded view: collapsed if in override set
            showExpanded = !isInOverrideSet;
        }
        
        // Handle keys display based on effective state
        let keyDisplay;
        if (showExpanded) {
            keyDisplay = keyString; // Show all keys when expanded
        } else {
            keyDisplay = keyString.length > 40 ? keyString.substring(0, 40) + '...' : keyString;
        }
        
        // Determine content display based on effective state
        let contentPreview;
        if (showExpanded) {
            contentPreview = content; // Show full content when expanded
        } else {
            contentPreview = content.length > 200 ? content.substring(0, 200) + '...' : content;
        }
        
        // Category styling
        const categoryClass = entry._categoryId ? 'has-category' : '';
        let categoryColor = '';
        if (entry._categoryId) {
            // Check both global and local categories
            const isLocal = entry._categoryId.toString().startsWith('local_');
            const categoryArray = isLocal ? this.localCategories : this.categories;
            const category = categoryArray.find(cat => cat.id === entry._categoryId);
            categoryColor = category?.color || '';
        }
        
        // Build view classes
        let viewClass = this.currentView === 'expanded' ? 'expanded-view' : '';
        let individualExpandClass = '';
        if (this.currentView === 'compact' && isInOverrideSet) {
            individualExpandClass = 'individually-expanded';
        } else if (this.currentView === 'expanded' && isInOverrideSet) {
            individualExpandClass = 'individually-collapsed';
        }

        return `
            <div class="entry-item ${categoryClass} ${viewClass} ${individualExpandClass}" data-entry-id="${entry._internalId}" 
                draggable="true"
                ${categoryColor ? `style="--category-color: ${categoryColor}"` : ''}>
                <div class="entry-header">
                    <div class="entry-title-row">
                        <label class="entry-select-checkbox">
                            <input type="checkbox" ${this.selectedEntries.has(entry._internalId) ? 'checked' : ''} 
                                data-entry-id="${entry._internalId}">
                            <span class="checkmark"></span>
                        </label>
                        <select class="entry-category-select" data-entry-id="${entry._internalId}" title="Category">
                            <option value="">—</option>
                            ${(() => {
                                const displayCategories = this.getDisplayCategories();
                                const globalCats = displayCategories.filter(cat => cat.isGlobal);
                                const localCats = displayCategories.filter(cat => !cat.isGlobal);
                                
                                let html = '';
                                
                                if (globalCats.length > 0) {
                                    html += '<optgroup label="Global">';
                                    globalCats.forEach(cat => {
                                        const isAssigned = entry._categoryId === cat.id;
                                        html += `<option value="${cat.id}" ${isAssigned ? 'selected' : ''}>${cat.icon}</option>`;
                                    });
                                    html += '</optgroup>';
                                }
                                
                                if (localCats.length > 0) {
                                    html += '<optgroup label="Project">';
                                    localCats.forEach(cat => {
                                        const isAssigned = entry._categoryId === cat.id;
                                        html += `<option value="${cat.id}" ${isAssigned ? 'selected' : ''}>${cat.icon}</option>`;
                                    });
                                    html += '</optgroup>';
                                }
                                
                                return html;
                            })()}
                        </select>
                        <h4 class="entry-name">${name}</h4>
                        <div class="entry-source-info">                            
                            ${keyDisplay ? `<span class="entry-keys-inline"><i class="fas fa-key"></i> ${this.escapeHtml(keyDisplay)}</span>` : ''}
                            <span class="entry-source">${source}</span>
                            <span class="entry-length">${tokenCount} tokens</span>
                        </div>
                    </div>
                    <div class="entry-actions">
                        <select class="role-select" title="Role" data-entry-id="${entry._internalId}" 
                                ${(entry.position || 0) !== 4 ? 'disabled' : ''}>
                            <option value="0" ${(entry.role || 0) === 0 ? 'selected' : ''}>⚙️</option>
                            <option value="1" ${(entry.role || 0) === 1 ? 'selected' : ''}>👤</option>
                            <option value="2" ${(entry.role || 0) === 2 ? 'selected' : ''}>🤖</option>
                        </select>
                        <input type="number" class="depth-input" title="Depth" min="1" max="100" 
                            value="${entry.depth || 1}" data-entry-id="${entry._internalId}"
                            ${(entry.position || 0) !== 4 ? 'disabled' : ''}>
                        <select class="position-select" title="Position" data-entry-id="${entry._internalId}">
                            <option value="0" ${(entry.position || 0) === 0 ? 'selected' : ''}>Before</option>
                            <option value="1" ${(entry.position || 0) === 1 ? 'selected' : ''}>After</option>
                            <option value="2" ${(entry.position || 0) === 2 ? 'selected' : ''}>AN Top</option>
                            <option value="3" ${(entry.position || 0) === 3 ? 'selected' : ''}>AN Bot</option>
                            <option value="4" ${(entry.position || 0) === 4 ? 'selected' : ''}>@ D</option>
                            <option value="5" ${(entry.position || 0) === 5 ? 'selected' : ''}>Ex Top</option>
                            <option value="6" ${(entry.position || 0) === 6 ? 'selected' : ''}>Ex Bot</option>
                        </select>
                        <input type="number" class="order-input" title="Order" min="0" max="9999" 
                            value="${entry.order || 100}" data-entry-id="${entry._internalId}">
                        <label class="constant-toggle" title="Constant" data-entry-id="${entry._internalId}">
                            <input type="checkbox" ${entry.constant ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <button class="btn-secondary delete-btn" title="Delete Entry" data-entry-id="${entry._internalId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="entry-content">${contentPreview}</p>
                <button class="entry-expand-toggle ${isInOverrideSet ? 'expanded' : ''}" 
                        data-entry-id="${entry._internalId}" 
                        title="${showExpanded ? 'Collapse' : 'Expand'}">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        `;
    }

    // Tab switching
    switchTab(tabName) {
        console.log('Switching to tab:', tabName); // Debug log
        this.currentTab = tabName;
        
        // Update tab buttons
        this.elements.sidebarTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update tab panes
        this.elements.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });
        
        // Notify Entry Helper
        if (tabName === 'entry-helper') {
            this.entryHelper?.onTabActivated();
        } else {
            this.entryHelper?.onTabDeactivated();
        }
    }

    // Category validation
    validateCategoryName() {
        const name = this.elements.newCategoryName.value.trim();
        const isValid = name.length > 0 && !this.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
        this.elements.addCategoryBtn.disabled = !isValid;
    }

    // Add category
    async addCategory() {
        const name = this.elements.newCategoryName.value.trim();
        if (!name) return;
        
        const isGlobal = this.elements.categoryIsGlobal.checked;
        
        const category = {
            id: isGlobal ? this.nextCategoryId++ : `local_${this.nextLocalCategoryId++}`,
            name: name,
            icon: '🏷️',
            color: '#B8956B',
            visible: true,
            isGlobal: isGlobal  // Track scope
        };
        
        if (isGlobal) {
            this.categories.push(category);
            // Save global categories to user file
            await this.saveUserCategories();
        } else {
            this.localCategories.push(category);
            // Local categories only exist in project, no separate save needed
        }
        
        this.elements.newCategoryName.value = '';
        this.validateCategoryName();
        this.renderCategories();
        this.refreshEntryList();
        
        const scope = isGlobal ? 'global' : 'local';
        showToast('success', `${scope} category "${name}" added`);
    }

    // Get all categories that should be displayed (active globals + all locals)
    getDisplayCategories() {
        const activeGlobals = this.categories.filter(cat => this.activeCategories.has(cat.id));
        return [...activeGlobals, ...this.localCategories];
    }

    // Update entry category
    updateEntryCategory(entryId, categoryId) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        entry._categoryId = categoryId;
        this.refreshEntryList(); // Refresh to apply color overlay
    }

    updateEntryCounter() {
        const visibleCount = this.filteredEntries.length;
        const totalCount = this.entries.length;
        this.elements.entryCounterText.textContent = `${visibleCount}/${totalCount}`;
    }

    // MODIFIED: Remove event listener setup from this method
    refreshEntryList() {
        console.log('refreshEntryList called, entries count:', this.entries.length); // DEBUG
        
        // Apply current search and sort
        this.applyFiltersAndSort();
        
        console.log('After filtering, filtered entries:', this.filteredEntries.length); // DEBUG
        
        if (this.filteredEntries.length === 0) {
            this.showEmptyState();
            this.updateEntryCounter();
            return;
        }
        
        const html = this.filteredEntries.map(entry => this.renderEntryItem(entry)).join('');
        this.elements.entryList.innerHTML = html;
        
        this.updateEntryCounter();
    }

    renderCategories() {
        // Populate activation dropdown with ALL categories
        this.populateCategoryActivationDropdown();
        
        // Get categories to display (active globals + all locals)
        const displayCategories = this.getDisplayCategories();
        
        if (displayCategories.length === 0) {
            this.elements.categoriesList.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; margin: var(--space-lg) 0;">No active categories</p>';
            return;
        }
        
        // Group by scope
        const globalCategories = displayCategories.filter(cat => cat.isGlobal);
        const localCategories = displayCategories.filter(cat => !cat.isGlobal);
        
        let html = '';
        
        // Global categories section
        if (globalCategories.length > 0) {
            html += '<div class="category-group-header">GLOBAL CATEGORIES</div>';
            html += globalCategories.map(category => this.renderCategoryItem(category)).join('');
        }
        
        // Local categories section
        if (localCategories.length > 0) {
            html += '<div class="category-group-header">PROJECT CATEGORIES</div>';
            html += localCategories.map(category => this.renderCategoryItem(category)).join('');
        }
        
        this.elements.categoriesList.innerHTML = html;
        this.populateBulkCategoryDropdown();
    }

    // Extract category item rendering to separate method
    renderCategoryItem(category) {
        return `
            <div class="category-item" data-category-id="${category.id}">
                <div class="category-header">
                    <button class="category-icon-btn" data-category-id="${category.id}" title="Change Icon">
                        ${category.icon || '🏷️'}
                    </button>
                    
                    <input type="color" class="category-color-picker" value="${category.color}" 
                        data-category-id="${category.id}">
                    
                    <input type="text" class="category-name" value="${category.name}" 
                        data-category-id="${category.id}" readonly>
                    
                    <div class="category-visibility">
                        <input type="checkbox" ${category.visible ? 'checked' : ''} 
                            data-category-id="${category.id}">
                        <label></label>
                    </div>
                </div>
            </div>
        `;
    }

    // Toggle all categories
    async toggleAllCategories(checked) {
        this.categories.forEach(category => {
            category.visible = checked;
        });
        this.renderCategories();
        this.refreshEntryList();
        await this.saveUserCategories(); // Auto-save
    }

    showEmptyState() {
        this.elements.entryList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No entries loaded</h3>
                <p>Import lorebook files or add new entries to get started<br>
                <small style="opacity: 0.7;">Double-click entries to edit</small></p>
            </div>
        `;
    }

    // Apply filters and sorting
    applyFiltersAndSort() {
        let filtered = [...this.entries];
        
        // Apply search filter
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(entry => {
                const name = (entry.comment || '').toLowerCase();
                const content = (entry.content || '').toLowerCase();
                const keys = (entry.key || []).join(' ').toLowerCase();
                const secondaryKeys = (entry.keysecondary || []).join(' ').toLowerCase();
                
                return name.includes(searchTerm) || 
                    content.includes(searchTerm) || 
                    keys.includes(searchTerm) || 
                    secondaryKeys.includes(searchTerm);
            });
        }
        
        // Apply category visibility filter
        filtered = filtered.filter(entry => {
            // If entry has no category, always show it
            if (!entry._categoryId) {
                return true;
            }
            
            // Find the category in either global or local arrays
            const isLocal = entry._categoryId.toString().startsWith('local_');
            const categoryArray = isLocal ? this.localCategories : this.categories;
            const category = categoryArray.find(cat => cat.id === entry._categoryId);
            return category ? category.visible : true; // Show if category not found (failsafe)
        });
        
        // Apply sorting
        const sortBy = this.elements.sortSelect.value;
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return (a.comment || '').localeCompare(b.comment || '');
                case 'name-desc':
                    return (b.comment || '').localeCompare(a.comment || '');
                case 'content-length':
                    return (b.content || '').length - (a.content || '').length;
                case 'category':
                    // Get category names for sorting
                    const getCategoryName = (entry) => {
                        if (!entry._categoryId) return 'zzz_no_category'; // Put entries without category at the end
                        const category = this.categories.find(cat => cat.id === entry._categoryId);
                        return category ? category.name.toLowerCase() : 'zzz_unknown';
                    };
                    return getCategoryName(a).localeCompare(getCategoryName(b));
                case 'manual-order':
                    // Respect the order in the main entries array
                    return this.entries.indexOf(a) - this.entries.indexOf(b);
                case 'order':
                default:
                    return a._internalId - b._internalId;
            }
        });
        
        this.filteredEntries = filtered;
    }

    // Handle search
    handleSearch() {
        this.refreshEntryList();
        
        // Show/hide clear button
        const hasSearch = this.elements.searchInput.value.trim().length > 0;
        this.elements.clearSearch.style.opacity = hasSearch ? '1' : '0';
    }

    // Clear search
    clearSearch() {
        this.elements.searchInput.value = '';
        this.handleSearch();
    }

    // Handle sort change
    handleSort() {
        this.refreshEntryList();
    }

    // Add new entry
    addNewEntry() {
        // Create a new entry object
        const newEntry = {
            _internalId: this.nextEntryId++,
            comment: '',
            content: '',
            key: [],
            keysecondary: [],
            selectiveLogic: 0,
            position: 0,
            role: 0,
            order: 100,
            constant: false,
            _sourceFile: 'Manual Entry'
        };
        
        // Set as current edit entry and populate modal
        this.currentEditEntry = newEntry;
        this.elements.editName.value = '';
        this.elements.editContent.value = '';
        this.elements.editKeys.value = '';
        this.elements.editSecondaryKeys.value = '';
        this.elements.editLogic.value = 0;
        
        // Change modal title for creating
        const modalTitle = this.elements.editModal.querySelector('.modal-header h3');
        modalTitle.textContent = 'Add New Entry';
        
        // Show save button, hide delete button for new entries
        this.elements.editSave.style.display = 'inline-flex';
        this.elements.editDelete.style.display = 'none';
        
        this.elements.editModal.style.display = 'flex';
        
        // Focus on name field
        setTimeout(() => this.elements.editName.focus(), 100);
    }

    // Edit entry
    editEntry(entryId) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        this.currentEditEntry = entry;
        this.elements.editName.value = entry.comment || '';
        this.elements.editContent.value = entry.content || '';
        
        // Populate keys fields
        this.elements.editKeys.value = (entry.key || []).join(', ');
        this.elements.editSecondaryKeys.value = (entry.keysecondary || []).join(', ');
        this.elements.editLogic.value = entry.selectiveLogic || 0;
        
        // Restore modal title for editing
        const modalTitle = this.elements.editModal.querySelector('.modal-header h3');
        modalTitle.textContent = 'Edit Entry';
        
        // Show save button for existing entries
        this.elements.editSave.style.display = 'inline-flex';
        
        this.elements.editModal.style.display = 'flex';
        
        // Focus on name field
        setTimeout(() => this.elements.editName.focus(), 100);
    }

    // Delete entry from list view
    deleteEntryFromList(entryId) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        const entryName = entry.comment || 'Untitled Entry';
        if (!confirm(`Are you sure you want to delete "${entryName}"?`)) return;
        
        const index = this.entries.findIndex(e => e._internalId === entryId);
        if (index >= 0) {
            this.entries.splice(index, 1);
            this.refreshEntryList();
            this.updateButtonStates();
            showToast('success', 'Entry deleted');
        }
    }

    // Handle entry selection
    handleEntrySelection(entryId, isChecked, shiftKey) {
        if (shiftKey && this.lastSelectedIndex >= 0) {
            // Range selection
            const currentIndex = this.filteredEntries.findIndex(e => e._internalId === entryId);
            if (currentIndex >= 0) {
                const start = Math.min(this.lastSelectedIndex, currentIndex);
                const end = Math.max(this.lastSelectedIndex, currentIndex);
                
                // Select/deselect the range
                for (let i = start; i <= end; i++) {
                    const entry = this.filteredEntries[i];
                    if (isChecked) {
                        this.selectedEntries.add(entry._internalId);
                    } else {
                        this.selectedEntries.delete(entry._internalId);
                    }
                }
                
                // Update all checkboxes in the range
                this.updateSelectionDisplay();
            }
        } else {
            // Single selection
            if (isChecked) {
                this.selectedEntries.add(entryId);
            } else {
                this.selectedEntries.delete(entryId);
            }
            
            // Update last selected index for shift+click
            this.lastSelectedIndex = this.filteredEntries.findIndex(e => e._internalId === entryId);
        }
        
        console.log('Selected entries:', this.selectedEntries.size);
    }

    // Update selection display for all checkboxes
    updateSelectionDisplay() {
        const checkboxes = this.elements.entryList.querySelectorAll('.entry-select-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const entryId = parseInt(checkbox.dataset.entryId);
            checkbox.checked = this.selectedEntries.has(entryId);
        });
    }

    // Clear all selections
    clearSelection() {
        this.selectedEntries.clear();
        this.lastSelectedIndex = -1;
        this.updateSelectionDisplay();
        this.entryHelper?.updateSelectedEntries(this.selectedEntries);
    }

    // Toggle constant field for entry
    toggleConstant(entryId, isChecked) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        entry.constant = isChecked;
        
        // Show feedback
        const status = isChecked ? 'enabled' : 'disabled';
        showToast('info', `Constant ${status} for "${entry.comment || 'Untitled Entry'}"`);
    }

    // Update order field for entry
    updateOrder(entryId, newOrder) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        // Clamp value between 0-9999
        const clampedOrder = Math.max(0, Math.min(9999, newOrder));
        entry.order = clampedOrder;
        
        // Update the input field if it was clamped
        if (clampedOrder !== newOrder) {
            const input = document.querySelector(`.order-input[data-entry-id="${entryId}"]`);
            if (input) input.value = clampedOrder;
        }
    }

    // Update position field for entry
    updatePosition(entryId, newPosition) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        entry.position = newPosition;
        
        // Enable/disable role dropdown based on position
        const roleSelect = document.querySelector(`.role-select[data-entry-id="${entryId}"]`);
        const depthInput = document.querySelector(`.depth-input[data-entry-id="${entryId}"]`);
        
        if (roleSelect) {
            roleSelect.disabled = newPosition !== 4;
            if (newPosition !== 4) {
                // Reset role to 0 when not at depth
                entry.role = 0;
                roleSelect.value = 0;
            }
        }
        
        if (depthInput) {
            depthInput.disabled = newPosition !== 4;
            if (newPosition !== 4) {
                // Set default depth when not at depth
                if (!entry.depth) entry.depth = 1;
                depthInput.value = entry.depth;
            }
        }
    }

    // Update role field for entry
    updateRole(entryId, newRole) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        entry.role = newRole;
    }

    // Update depth field for entry
    updateDepth(entryId, newDepth) {
        const entry = this.entries.find(e => e._internalId === entryId);
        if (!entry) return;
        
        // Clamp value between 1-100
        const clampedDepth = Math.max(1, Math.min(100, newDepth));
        entry.depth = clampedDepth;
        
        // Update the input field if it was clamped
        if (clampedDepth !== newDepth) {
            const input = document.querySelector(`.depth-input[data-entry-id="${entryId}"]`);
            if (input) input.value = clampedDepth;
        }
    }

    // Close edit modal
    closeEditModal() {
        this.elements.editModal.style.display = 'none';
        this.currentEditEntry = null;
    }

    // Update nextEntryId to be higher than any existing internal ID
    updateNextEntryId() {
        if (this.entries.length > 0) {
            const maxId = Math.max(...this.entries.map(entry => entry._internalId || 0));
            this.nextEntryId = maxId + 1;
        }
    }

    // Save entry edit
    saveEntryEdit() {
        if (!this.currentEditEntry) return;
        
        const newName = this.elements.editName.value.trim();
        const newContent = this.elements.editContent.value.trim();
        const newKeys = this.elements.editKeys.value.trim();
        const newSecondaryKeys = this.elements.editSecondaryKeys.value.trim();
        const newLogic = parseInt(this.elements.editLogic.value);
        
        if (!newName) {
            showToast('error', 'Entry name cannot be empty');
            return;
        }
        
        // Update entry data
        this.currentEditEntry.comment = newName;
        this.currentEditEntry.content = newContent;
        this.currentEditEntry.selectiveLogic = newLogic;
        
        // Parse and update keys arrays
        this.currentEditEntry.key = newKeys 
            ? newKeys.split(',').map(k => k.trim()).filter(k => k.length > 0)
            : [];
        
        this.currentEditEntry.keysecondary = newSecondaryKeys 
            ? newSecondaryKeys.split(',').map(k => k.trim()).filter(k => k.length > 0)
            : [];
        
        console.log('Saving entry:', this.currentEditEntry); // DEBUG
        
        // If this is a new entry (not already in entries array), add it
        const existingIndex = this.entries.findIndex(e => e._internalId === this.currentEditEntry._internalId);
        console.log('Existing index:', existingIndex); // DEBUG
        console.log('Current entries count:', this.entries.length); // DEBUG
        
        if (existingIndex === -1) {
            this.entries.push(this.currentEditEntry);
            console.log('Added new entry. New entries count:', this.entries.length); // DEBUG
            showToast('success', 'New entry created');
        } else {
            showToast('success', 'Entry updated');
        }
        
        console.log('All entries:', this.entries); // DEBUG
        
        this.refreshEntryList();
        
        console.log('Filtered entries after refresh:', this.filteredEntries); // DEBUG
        
        this.updateButtonStates();
        this.closeEditModal();
    }

    // Delete entry
    deleteEntry() {
        if (!this.currentEditEntry) return;
        
        if (!confirm('Are you sure you want to delete this entry?')) return;
        
        const index = this.entries.findIndex(e => e._internalId === this.currentEditEntry._internalId);
        if (index >= 0) {
            this.entries.splice(index, 1);
            this.refreshEntryList();
            this.updateButtonStates();
            this.closeEditModal();
            showToast('success', 'Entry deleted');
        }
    }

    // Export entries
    async exportEntries(format) {
        if (this.filteredEntries.length === 0) {  // Change from this.entries to this.filteredEntries
            showToast('warning', 'No visible entries to export');  // Update message
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const endpoint = `/api/extractor/export-${format}`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    entries: this.filteredEntries,  // Change from this.entries to this.filteredEntries
                    projectName: this.currentProject || 'Untitled Project'
                })
            });
            
            if (response.ok) {
                // Handle file download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                // Extract filename from response headers or generate one
                const contentDisposition = response.headers.get('content-disposition');
                let filename = `extractor_export_${this.getTimestamp()}.${format}`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                    if (filenameMatch) filename = filenameMatch[1];
                }
                
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showToast('success', `Exported ${this.filteredEntries.length} visible entries as ${format.toUpperCase()}`);  // Update message
            } else {
                throw new Error('Export failed');
            }
            
        } catch (error) {
            console.error('Export error:', error);
            showToast('error', 'Failed to export entries');
        }
    }

    // Set view mode
    setView(mode) {
        this.currentView = mode;
        
        // Update button states
        this.elements.viewCompactBtn.classList.toggle('active', mode === 'compact');
        this.elements.viewExpandedBtn.classList.toggle('active', mode === 'expanded');
        
        // Refresh the entry list to apply new view
        this.refreshEntryList();
        
        showToast('info', `Switched to ${mode} view`);
    }

    // Toggle individual entry expansion
    toggleIndividualExpand(entryId) {
        if (this.individuallyExpandedEntries.has(entryId)) {
            this.individuallyExpandedEntries.delete(entryId);
        } else {
            this.individuallyExpandedEntries.add(entryId);
        }
        
        // Update just this entry's display
        const entryElement = document.querySelector(`.entry-item[data-entry-id="${entryId}"]`);
        if (entryElement) {
            const isInSet = this.individuallyExpandedEntries.has(entryId);
            
            // In compact view: set means expanded
            // In expanded view: set means collapsed
            if (this.currentView === 'compact') {
                entryElement.classList.toggle('individually-expanded', isInSet);
                entryElement.classList.remove('individually-collapsed');
            } else {
                entryElement.classList.toggle('individually-collapsed', isInSet);
                entryElement.classList.remove('individually-expanded');
            }
            
            // Update the toggle button
            const toggleBtn = entryElement.querySelector('.entry-expand-toggle');
            if (toggleBtn) {
                // In compact: expanded when in set
                // In expanded: collapsed when in set (so button is "collapsed" state)
                toggleBtn.classList.toggle('expanded', isInSet);
            }
        }
    }

    // Project management
    async refreshProjects() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            this.updateProjectDropdown([]);
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (response.ok) {
                const projects = await response.json();
                this.availableProjects = projects;
                this.updateProjectDropdown(projects);
            } else {
                console.warn('Failed to load projects');
                this.updateProjectDropdown([]);
            }
        } catch (error) {
            console.warn('Error loading projects:', error);
            this.updateProjectDropdown([]);
        }
    }

    // Update project dropdown
    updateProjectDropdown(projects) {
        const dropdown = this.elements.projectDropdown;
        dropdown.innerHTML = '<option value="">New Project</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            dropdown.appendChild(option);
        });
        
        dropdown.disabled = this.userSessionManager?.isGuest !== false;
        this.updateButtonStates();
    }

    // Handle project selection
    handleProjectSelection() {
        this.selectedProject = this.elements.projectDropdown.value || null;
        this.updateProjectButtonState();
    }

    // Update project button state based on selection
    updateProjectButtonState() {
        const loadBtn = this.elements.loadProjectBtn;
        const isLoggedIn = this.userSessionManager?.isLoggedIn();
        
        if (!isLoggedIn) {
            loadBtn.disabled = true;
            loadBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
            loadBtn.title = "Load Project";
            return;
        }
        
        // If no project selected (New Project)
        if (!this.selectedProject) {
            loadBtn.disabled = false; // Change from true to false
            loadBtn.innerHTML = '<i class="fas fa-circle-plus"></i>'; // Change icon
            loadBtn.title = "New Project"; // Change title
            return;
        }
        
        // If selected project is the currently loaded project
        if (this.selectedProject === this.currentProject) {
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-trash"></i>';
            loadBtn.title = "Delete Project";
            return;
        }
        
        // If selected project is different from loaded project
        loadBtn.disabled = false;
        loadBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
        loadBtn.title = "Load Project";
    }

    // Save project
    async saveProject() {
        if (this.userSessionManager?.isGuest !== false) {
            this.authUI?.showLoginModal();
            return;
        }
        
        if (this.entries.length === 0) {
            showToast('warning', 'No entries to save');
            return;
        }
        
        const projectName = this.currentProject || prompt('Enter project name:');
        if (!projectName) return;
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/save-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName,
                    entries: this.entries,
                    activeCategoryIds: Array.from(this.activeCategories),
                    localCategories: this.localCategories,  // ADD THIS LINE
                    selectedEntryIds: Array.from(this.selectedEntries),
                    entryHelperSettings: this.entryHelper ? this.entryHelper.getSettings() : {},
                    currentTab: this.currentTab,
                    currentView: this.currentView
                })
            });
            
            if (response.ok) {
                this.currentProject = projectName;
                this.selectedProject = projectName;
                await this.refreshProjects();
                this.elements.projectDropdown.value = projectName;
                this.updateProjectButtonState();
                showToast('success', `Project "${projectName}" saved`);
            } else {
                throw new Error('Failed to save project');
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast('error', 'Failed to save project');
        }
    }

    // Handle load/delete project button
    async handleProjectButton() {
        const isLoggedIn = this.userSessionManager?.isLoggedIn();
        
        if (!isLoggedIn) {
            this.authUI?.showLoginModal();
            return;
        }
        
        // If no project selected (New Project), create new project
        if (!this.selectedProject) {
            this.createNewProject();
            return;
        }
        
        // If selected project is currently loaded, delete it
        if (this.selectedProject === this.currentProject) {
            await this.deleteProject();
        } else {
            // Otherwise load the selected project
            await this.loadProject();
        }
    }

    // Create/clear to new project state
    createNewProject() {
        // Clear current project state
        this.currentProject = null;
        this.entries = [];
        this.localCategories = []; 
        
        // Clear any selections and bulk actions
        this.clearSelection();
        if (this.bulkActions) {
            this.bulkActions.reset();
        }

        this.activeCategories.clear();
        this.switchTab('bulk-actions');
        
        // ADD THIS: Reset Entry Helper to defaults
        if (this.entryHelper) {
            this.entryHelper.resetToDefaults();
        }
        
        // Refresh displays
        this.refreshEntryList();
        this.updateButtonStates();
        this.updateProjectButtonState();
        
        showToast('info', 'Started new project');
    }

    // Load project
    async loadProject() {
        if (!this.selectedProject) return;
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/load-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName: this.selectedProject
                })
            });
            
        if (response.ok) {
            const data = await response.json();
            this.entries = data.entries || [];
            
            // Ensure internal IDs
            this.entries.forEach((entry, index) => {
                if (!entry._internalId) {
                    entry._internalId = ++this.nextEntryId;
                }
            });
            
            // Load local categories for this project
            this.localCategories = data.localCategories || [];
            
            // Update next local category ID
            if (this.localCategories.length > 0) {
                const maxLocalId = Math.max(...this.localCategories
                    .map(cat => parseInt(cat.id.replace('local_', '')))
                    .filter(id => !isNaN(id)));
                this.nextLocalCategoryId = maxLocalId + 1;
            }
            
            // Clean up entries with non-existent categories
            const allCategoryIds = new Set([
                ...this.categories.map(cat => cat.id),
                ...this.localCategories.map(cat => cat.id)
            ]);
            
            this.entries.forEach(entry => {
                if (entry._categoryId && !allCategoryIds.has(entry._categoryId)) {
                    delete entry._categoryId;
                }
            });
            
            // Restore active categories for this project
            this.activeCategories.clear();
            if (data.activeCategoryIds) {
                data.activeCategoryIds.forEach(id => this.activeCategories.add(id));
            }
                
                // Restore selected entries for this project
                this.selectedEntries.clear();
                if (data.selectedEntryIds) {
                    data.selectedEntryIds.forEach(id => this.selectedEntries.add(id));
                }
                
                // Restore Entry Helper settings for this project
                if (this.entryHelper && data.entryHelperSettings) {
                    this.entryHelper.setSettings(data.entryHelperSettings);
                }
                
                // Restore active tab for this project
                if (data.currentTab) {
                    this.switchTab(data.currentTab);
                } else {
                    this.switchTab('bulk-actions');
                }

                // Restore view mode for this project (silently, without toast)
                if (data.currentView) {
                    this.currentView = data.currentView;
                    this.elements.viewCompactBtn.classList.toggle('active', data.currentView === 'compact');
                    this.elements.viewExpandedBtn.classList.toggle('active', data.currentView === 'expanded');
                } else {
                    this.currentView = 'compact';
                    this.elements.viewCompactBtn.classList.add('active');
                    this.elements.viewExpandedBtn.classList.remove('active');
                }
                
                this.currentProject = this.selectedProject;
                this.updateNextEntryId();
                this.renderCategories();
                this.refreshEntryList();
                
                // Update selection display after loading
                this.updateSelectionDisplay();
                
                // Update bulk select all checkbox state
                if (this.bulkActions) {
                    this.bulkActions.updateSelectAllCheckbox();
                }
                
                this.updateProjectButtonState();
                this.updateButtonStates();
                
                // Save as last project
                this.userSessionManager.setLastProject(this.selectedProject);
                
                showToast('success', `Project "${this.selectedProject}" loaded`);
            } else {
                throw new Error('Failed to load project');
            }
        } catch (error) {
            console.error('Load error:', error);
            showToast('error', 'Failed to load project');
        }
    }

    // Delete project
    async deleteProject() {
        if (!this.currentProject) return;
        
        if (!confirm(`Are you sure you want to delete project "${this.currentProject}"? This cannot be undone.`)) {
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/delete-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName: this.currentProject
                })
            });
            
            if (response.ok) {
                const deletedProject = this.currentProject;
                this.currentProject = null;
                this.selectedProject = null;
                this.elements.projectDropdown.value = '';
                
                // Clear current entries
                this.entries = [];
                this.refreshEntryList();
                
                // Refresh project list
                await this.refreshProjects();
                this.updateProjectButtonState();
                this.updateButtonStates();
                
                showToast('success', `Project "${deletedProject}" deleted`);
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showToast('error', 'Failed to delete project');
        }
    }

    // Load user categories
    async loadUserCategories() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            this.categories = [];
            this.renderCategories();
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/load-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.categories = data.categories || [];
                
                // Ensure we have proper IDs
                if (this.categories.length > 0) {
                    this.nextCategoryId = Math.max(...this.categories.map(cat => cat.id)) + 1;
                }
                
                this.renderCategories();
                this.populateBulkCategoryDropdown();
                console.log('📂 Loaded', this.categories.length, 'user categories');
            } else {
                console.warn('Failed to load user categories');
                this.categories = [];
            }
        } catch (error) {
            console.warn('Error loading user categories:', error);
            this.categories = [];
        }
    }

    // Save user categories
    async saveUserCategories() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/extractor/save-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    categories: this.categories
                })
            });
            
            if (!response.ok) {
                console.warn('Failed to save user categories');
            }
        } catch (error) {
            console.warn('Error saving user categories:', error);
        }
    }

    // Update button states
    updateButtonStates() {
        const hasEntries = this.entries.length > 0;
        const hasVisibleEntries = this.filteredEntries.length > 0;  // Add this line
        const isLoggedIn = this.userSessionManager?.isLoggedIn();
        const hasProject = !!this.currentProject;
        
        this.elements.exportTxtBtn.disabled = !hasVisibleEntries;  // Change from hasEntries
        this.elements.exportMdBtn.disabled = !hasVisibleEntries;   // Change from hasEntries
        this.elements.exportJsonBtn.disabled = !hasVisibleEntries; // Change from hasEntries
        
        this.elements.saveProjectBtn.disabled = !hasEntries || !isLoggedIn;
        this.elements.loadProjectBtn.disabled = !hasProject || !isLoggedIn;
    }

    // Utility functions
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    generateUID() {
        return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Calculate approximate token count (for LLM/RP estimation)
    calculateTokenCount(text) {
        if (!text) return 0;
        
        // Rough estimation: ~4 characters per token for English text
        // This is close to what most LLMs use (GPT, Claude, etc.)
        return Math.ceil(text.length / 4);
    }
// Context menu functionality
    initializeContextMenu() {
        const projectDropdown = document.getElementById('project-dropdown');
        const contextMenu = document.getElementById('project-context-menu');

        if (projectDropdown && contextMenu) {
            // Right-click on project dropdown
            projectDropdown.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                
                // Update context menu options based on whether a project is loaded
                this.updateContextMenuOptions();
                
                // Position context menu
                contextMenu.style.left = e.pageX + 'px';
                contextMenu.style.top = e.pageY + 'px';
                contextMenu.style.display = 'block';
            });

            // Click Quick Load option
            document.getElementById('quick-load-option').addEventListener('click', () => {
                this.quickLoadLastProject();
            });

            // Click Rename option
            document.getElementById('rename-project-option').addEventListener('click', () => {
                this.renameProject();
            });

            // Hide context menu when clicking elsewhere
            document.addEventListener('click', (e) => {
                if (!contextMenu.contains(e.target)) {
                    contextMenu.style.display = 'none';
                }
            });

            // Hide context menu when right-clicking elsewhere
            document.addEventListener('contextmenu', (e) => {
                if (!projectDropdown.contains(e.target)) {
                    contextMenu.style.display = 'none';
                }
            });
        }
    }

    // Update context menu options based on project state
    updateContextMenuOptions() {
        const quickLoadOption = document.getElementById('quick-load-option');
        const renameOption = document.getElementById('rename-project-option');
        
        if (!quickLoadOption || !renameOption) return;
        
        if (this.currentProject) {
            // Project is loaded - show rename option
            quickLoadOption.style.display = 'none';
            renameOption.style.display = 'block';
        } else {
            // No project loaded - show quick load option
            quickLoadOption.style.display = 'block';
            renameOption.style.display = 'none';
            
            // Update Quick Load availability
            const lastProject = this.userSessionManager?.getLastProject();
            if (lastProject) {
                quickLoadOption.classList.remove('disabled');
            } else {
                quickLoadOption.classList.add('disabled');
            }
        }
    }

    // Quick Load last project
    async quickLoadLastProject() {
        // Hide context menu
        document.getElementById('project-context-menu').style.display = 'none';
        
        if (!this.userSessionManager) return;
        
        const lastProject = this.userSessionManager.getLastProject();
        if (!lastProject) {
            showToast('info', 'No last project available');
            return;
        }
        
        // Set the dropdown value and trigger load
        this.elements.projectDropdown.value = lastProject;
        this.handleProjectSelection();
        await this.loadProject();
    }

    // Rename current project
    async renameProject() {
        // Hide context menu
        document.getElementById('project-context-menu').style.display = 'none';
        
        if (!this.currentProject || !this.userSessionManager) {
            showToast('error', 'No project loaded to rename');
            return;
        }
        
        const currentName = this.currentProject;
        const newName = prompt(`Rename project "${currentName}" to:`, currentName);
        
        if (!newName || newName.trim() === '' || newName === currentName) {
            return;
        }
        
        const trimmedNewName = newName.trim();
        
        try {
            showToast('info', 'Renaming project...');
            
            const userContext = this.userSessionManager.getUserContext();
            
            // Check if new name already exists
            const response = await fetch('/api/extractor/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (response.ok) {
                const projects = await response.json();
                const nameExists = projects.includes(trimmedNewName);
                
                if (nameExists) {
                    showToast('error', `Project "${trimmedNewName}" already exists`);
                    return;
                }
            }
            
            // Save with new name (this creates the new project)
            const saveResponse = await fetch('/api/extractor/save-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName: trimmedNewName,
                    entries: this.entries,
                    activeCategoryIds: Array.from(this.activeCategories)
                })
            });
            
            if (saveResponse.ok) {
                // Delete old project
                const deleteResponse = await fetch('/api/extractor/delete-project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userContext, projectName: currentName })
                });
                
                if (!deleteResponse.ok) {
                    console.warn('Failed to delete old project, but rename was successful');
                }
                
                // Update current project reference
                this.currentProject = trimmedNewName;
                this.selectedProject = trimmedNewName;
                
                // Refresh projects and update UI
                await this.refreshProjects();
                this.elements.projectDropdown.value = trimmedNewName;
                this.updateProjectButtonState();
                
                // Update last project
                if (this.userSessionManager) {
                    this.userSessionManager.setLastProject(trimmedNewName);
                }
                
                showToast('success', `Project renamed to "${trimmedNewName}"`);
                
            } else {
                throw new Error('Failed to save project with new name');
            }
            
        } catch (error) {
            console.error('Error renaming project:', error);
            showToast('error', `Failed to rename project: ${error.message}`);
        }
    }
}  // <-- This is the closing brace of the ExtractorApp class

// Toast notification system
function showToast(type, message) {
    const container = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Initialize context menu for avatar
// Initialize context menu for avatar
function initializeExtractorContextMenu() {
    const navAvatarImg = document.getElementById('nav-avatar-img');
    const contextMenu = document.getElementById('extractor-context-menu');
    const logoutOption = document.getElementById('extractor-logout-option');

    if (!navAvatarImg || !contextMenu) return;

    // Show context menu on avatar click
    navAvatarImg.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Position menu below avatar
        const rect = navAvatarImg.getBoundingClientRect();
        contextMenu.style.left = `${rect.left - 60}px`;
        contextMenu.style.top = `${rect.bottom + 5}px`;
        contextMenu.style.display = 'block';
    });

    // Handle logout click
    logoutOption?.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        
        // Clear session completely (don't use logout() because it sets guest mode)
        localStorage.removeItem('writingTools_session');
        localStorage.removeItem('writingTools_guestMode');
        
        // Navigate back to main app which will show login screen
        window.location.href = '../index.html';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) && e.target !== navAvatarImg) {
            contextMenu.style.display = 'none';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            contextMenu.style.display = 'none';
        }
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.extractorApp = new ExtractorApp();
    window.extractorApp.init();
    initializeExtractorContextMenu();

    // Initialize the about system
    window.initializeLorebookManagerAbout();
});

// Export for global access
window.showToast = showToast;