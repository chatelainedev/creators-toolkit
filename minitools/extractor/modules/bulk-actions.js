// Bulk Actions - Lorebook Entry Management
// Handles bulk editing operations for selected entries

class BulkActions {
    constructor(extractorApp) {
        this.app = extractorApp;
        this.originalTitles = new Map(); // entryId -> original title
        this.hasPendingChanges = false;
        this.setupEventListeners();
        this.setupFilterWatchers();
        this.originalOrders = new Map(); // entryId -> original order
        this.originalPositions = new Map(); // entryId -> original position
        this.originalRoles = new Map(); // entryId -> original role
        this.originalDepths = new Map(); // entryId -> original depth
        this.originalContents = new Map(); // entryId -> original content
        this.originalCategories = new Map(); // entryId -> original categoryId
    }

    setupEventListeners() {
        // Section toggles
        this.app.elements.bulkTitlesToggle.addEventListener('click', () => this.toggleSection('titles'));

        // Select all checkbox
        this.app.elements.bulkSelectAll.addEventListener('change', (e) => this.handleSelectAll(e.target.checked));

        // Header buttons
        this.app.elements.bulkRevertAll.addEventListener('click', () => this.revertAll());
        this.app.elements.bulkSaveAll.addEventListener('click', () => this.saveAll());
        this.app.elements.bulkDeleteAll.addEventListener('click', () => this.deleteAll());

        // Title form changes - apply immediately for preview
        this.app.elements.bulkTitleMode.addEventListener('change', () => this.applyTitleChanges());
        this.app.elements.bulkPrefix.addEventListener('input', () => this.applyTitleChanges());
        this.app.elements.bulkSuffix.addEventListener('input', () => this.applyTitleChanges());
        this.app.elements.bulkRemoveChars.addEventListener('input', () => this.applyTitleChanges());
        this.app.elements.bulkNumbering.addEventListener('input', () => this.applyTitleChanges());
        this.app.elements.bulkNumberingOrder.addEventListener('change', () => this.applyTitleChanges());

        // Section toggles
        this.app.elements.bulkOrderToggle.addEventListener('click', () => this.toggleSection('order'));
        // Order form changes - apply immediately for preview
        this.app.elements.bulkOrderStart.addEventListener('input', () => this.applyOrderChanges());
        this.app.elements.bulkOrderDirection.addEventListener('change', () => this.applyOrderChanges());

        // Section toggle for position
        this.app.elements.bulkPositionToggle.addEventListener('click', () => this.toggleSection('position'));
        // Position form changes - apply immediately for preview
        this.app.elements.bulkPositionSelect.addEventListener('change', () => {
            this.toggleDepthRoleFields();
            this.applyPositionChanges();
        });
        this.app.elements.bulkDepthValue.addEventListener('input', () => this.applyPositionChanges());
        this.app.elements.bulkRoleSelect.addEventListener('change', () => this.applyPositionChanges());

        // Section toggle for content
        this.app.elements.bulkContentToggle.addEventListener('click', () => this.toggleSection('content'));
        // Content form changes - apply immediately for preview
        this.app.elements.bulkContentPrefix.addEventListener('input', () => this.applyContentChanges());
        this.app.elements.bulkContentSuffix.addEventListener('input', () => this.applyContentChanges());
        this.app.elements.bulkContentRemoveChars.addEventListener('input', () => this.applyContentChanges());

        // Section toggle for category
        this.app.elements.bulkCategoryToggle.addEventListener('click', () => this.toggleSection('category'));
        // Category form changes - apply immediately for preview
        this.app.elements.bulkCategorySelect.addEventListener('change', () => this.applyCategoryChanges());

        // Listen for selection changes to update button states and select all checkbox
        // We'll hook into the existing selection system
        this.originalHandleEntrySelection = this.app.handleEntrySelection.bind(this.app);
        this.app.handleEntrySelection = (entryId, isChecked, shiftKey) => {
            this.originalHandleEntrySelection(entryId, isChecked, shiftKey);
            this.updateButtonStates();
            this.updateSelectAllCheckbox();
            this.app.entryHelper?.updateSelectedEntries(this.app.selectedEntries); // ADD THIS LINE
        };

        // Also listen for clear selection
        this.originalClearSelection = this.app.clearSelection.bind(this.app);
        this.app.clearSelection = () => {
            this.originalClearSelection();
            this.updateButtonStates();
            this.updateSelectAllCheckbox();
            this.app.entryHelper?.updateSelectedEntries(this.app.selectedEntries); // ADD THIS LINE
        };
    }

    // Update button states based on selections and pending changes
    updateButtonStates() {
        const hasSelection = this.app.selectedEntries.size > 0;
        const hasPending = this.hasPendingChanges;

        this.app.elements.bulkRevertAll.disabled = !hasPending;
        this.app.elements.bulkSaveAll.disabled = !hasPending;
        this.app.elements.bulkDeleteAll.disabled = !hasSelection;
    }

    // Apply title changes to selected entries (preview mode)
    applyTitleChanges() {
        const selectedEntries = this.getSelectedEntries();
        if (selectedEntries.length === 0) return;

        // Store original titles if this is the first change
        if (!this.hasPendingChanges) {
            selectedEntries.forEach(entry => {
                if (!this.originalTitles.has(entry._internalId)) {
                    this.originalTitles.set(entry._internalId, entry.comment || '');
                }
            });
            this.hasPendingChanges = true;
        }

        // Get form values
        const titleMode = this.app.elements.bulkTitleMode.value;
        const prefix = this.app.elements.bulkPrefix.value;
        const suffix = this.app.elements.bulkSuffix.value;
        const removeChars = parseInt(this.app.elements.bulkRemoveChars.value) || 0;
        const numberingStart = this.app.elements.bulkNumbering.value.trim();
        const numberingOrder = this.app.elements.bulkNumberingOrder.value;

        // Process entries
        const entriesToProcess = this.getEntriesInProcessingOrder(selectedEntries, numberingOrder);
        
        entriesToProcess.forEach((entry, index) => {
            const originalTitle = this.originalTitles.get(entry._internalId);
            entry.comment = this.processTitle(originalTitle, {
                titleMode,
                prefix,
                suffix,
                removeChars,
                numberingStart,
                counterIndex: index
            });
        });

        // Refresh the display
        this.app.refreshEntryList();
        this.updateButtonStates();
    }

    // Apply order changes to selected entries (preview mode)
    applyOrderChanges() {
        const selectedEntries = this.getSelectedEntries();
        if (selectedEntries.length === 0) return;

        // Store original orders if this is the first change
        if (!this.hasPendingChanges) {
            selectedEntries.forEach(entry => {
                if (!this.originalOrders.has(entry._internalId)) {
                    this.originalOrders.set(entry._internalId, entry.order || 100);
                }
            });
        } else {
            // If we already have pending title changes, make sure we store original orders
            selectedEntries.forEach(entry => {
                if (!this.originalOrders.has(entry._internalId)) {
                    this.originalOrders.set(entry._internalId, entry.order || 100);
                }
            });
        }

        this.hasPendingChanges = true;

        // Get form values
        const startOrder = parseInt(this.app.elements.bulkOrderStart.value) || 100;
        const direction = this.app.elements.bulkOrderDirection.value;

        // Process entries in the correct order
        const entriesToProcess = this.getEntriesInProcessingOrder(selectedEntries, direction);
        
        entriesToProcess.forEach((entry, index) => {
            if (direction === 'desc') {
                entry.order = startOrder - index;
            } else {
                entry.order = startOrder + index;
            }
            
            // Clamp to valid range
            entry.order = Math.max(0, Math.min(9999, entry.order));
        });

        // Refresh the display
        this.app.refreshEntryList();
        this.updateButtonStates();
    }

    // Show/hide depth and role fields based on position selection
    toggleDepthRoleFields() {
        const positionValue = this.app.elements.bulkPositionSelect.value;
        const depthGroup = document.getElementById('bulk-depth-group');
        const roleGroup = document.getElementById('bulk-role-group');
        
        const showDepthRole = positionValue === '4'; // At Depth
        depthGroup.style.display = showDepthRole ? 'block' : 'none';
        roleGroup.style.display = showDepthRole ? 'block' : 'none';
    }

    // Apply position changes to selected entries (preview mode)
    applyPositionChanges() {
        const selectedEntries = this.getSelectedEntries();
        if (selectedEntries.length === 0) return;

        const positionValue = this.app.elements.bulkPositionSelect.value;
        
        // If "Current Position" is selected, don't change anything
        if (!positionValue) return;

        // Store original positions if this is the first change
        if (!this.hasPendingChanges) {
            selectedEntries.forEach(entry => {
                if (!this.originalPositions) this.originalPositions = new Map();
                if (!this.originalRoles) this.originalRoles = new Map();
                if (!this.originalDepths) this.originalDepths = new Map();
                
                if (!this.originalPositions.has(entry._internalId)) {
                    this.originalPositions.set(entry._internalId, entry.position || 0);
                }
                if (!this.originalRoles.has(entry._internalId)) {
                    this.originalRoles.set(entry._internalId, entry.role || 0);
                }
                if (!this.originalDepths.has(entry._internalId)) {
                    this.originalDepths.set(entry._internalId, entry.depth || 1);
                }
            });
        } else {
            // If we already have pending changes, make sure we store original positions
            selectedEntries.forEach(entry => {
                if (!this.originalPositions) this.originalPositions = new Map();
                if (!this.originalRoles) this.originalRoles = new Map();
                if (!this.originalDepths) this.originalDepths = new Map();
                
                if (!this.originalPositions.has(entry._internalId)) {
                    this.originalPositions.set(entry._internalId, entry.position || 0);
                }
                if (!this.originalRoles.has(entry._internalId)) {
                    this.originalRoles.set(entry._internalId, entry.role || 0);
                }
                if (!this.originalDepths.has(entry._internalId)) {
                    this.originalDepths.set(entry._internalId, entry.depth || 1);
                }
            });
        }

        this.hasPendingChanges = true;

        // Get form values
        const newPosition = parseInt(positionValue);
        const newRole = parseInt(this.app.elements.bulkRoleSelect.value) || 0;
        const newDepth = parseInt(this.app.elements.bulkDepthValue.value) || 1;

        // Apply changes to selected entries
        selectedEntries.forEach(entry => {
            entry.position = newPosition;
            
            if (newPosition === 4) { // At Depth
                entry.role = newRole;
                entry.depth = newDepth;
            } else {
                // Reset role to 0 when not At Depth (following existing pattern)
                entry.role = 0;
                // Keep existing depth or set to 1
                if (!entry.depth) entry.depth = 1;
            }
        });

        // Refresh the display
        this.app.refreshEntryList();
        this.updateButtonStates();
    }

    // Apply content changes to selected entries (preview mode)
    applyContentChanges() {
        const selectedEntries = this.getSelectedEntries();
        if (selectedEntries.length === 0) return;

        // Store original contents if this is the first change
        if (!this.hasPendingChanges) {
            selectedEntries.forEach(entry => {
                if (!this.originalContents.has(entry._internalId)) {
                    this.originalContents.set(entry._internalId, entry.content || '');
                }
            });
        } else {
            // If we already have pending changes, make sure we store original contents
            selectedEntries.forEach(entry => {
                if (!this.originalContents.has(entry._internalId)) {
                    this.originalContents.set(entry._internalId, entry.content || '');
                }
            });
        }

        this.hasPendingChanges = true;

        // Get form values
        const prefix = this.app.elements.bulkContentPrefix.value;
        const suffix = this.app.elements.bulkContentSuffix.value;
        const removeChars = parseInt(this.app.elements.bulkContentRemoveChars.value) || 0;

        // Process entries
        selectedEntries.forEach(entry => {
            const originalContent = this.originalContents.get(entry._internalId);
            entry.content = this.processContent(originalContent, entry.comment || '', {
                prefix,
                suffix,
                removeChars
            });
        });

        // Refresh the display
        this.app.refreshEntryList();
        this.updateButtonStates();
    }

    // Apply category changes to selected entries (preview mode)
    applyCategoryChanges() {
        const selectedEntries = this.getSelectedEntries();
        if (selectedEntries.length === 0) return;

        const categoryValue = this.app.elements.bulkCategorySelect.value;
        
        // If "No Change" is selected, don't change anything
        if (!categoryValue) return;

        // Store original categories if this is the first change
        if (!this.hasPendingChanges) {
            selectedEntries.forEach(entry => {
                if (!this.originalCategories.has(entry._internalId)) {
                    this.originalCategories.set(entry._internalId, entry._categoryId || null);
                }
            });
        } else {
            // If we already have pending changes, make sure we store original categories
            selectedEntries.forEach(entry => {
                if (!this.originalCategories.has(entry._internalId)) {
                    this.originalCategories.set(entry._internalId, entry._categoryId || null);
                }
            });
        }

        this.hasPendingChanges = true;

        // Apply changes to selected entries
        selectedEntries.forEach(entry => {
            if (categoryValue === 'none') {
                // Remove category
                delete entry._categoryId;
            } else {
                // Set category - keep as string if local_, parse as int if global
                entry._categoryId = categoryValue.startsWith('local_') ? categoryValue : parseInt(categoryValue);
            }
        });

        // Refresh the display
        this.app.refreshEntryList();
        this.updateButtonStates();
    }

    // Process a single title based on the current settings
    processTitle(originalTitle, options) {
        const { titleMode, prefix, suffix, removeChars, numberingStart, counterIndex } = options;
        
        let processedTitle = originalTitle;

        // Step 1: Remove characters if specified
        if (removeChars > 0) {
            processedTitle = processedTitle.substring(removeChars);
        }

        // Step 2: Apply title mode logic
        let finalTitle;
        
        if (titleMode === 'replace') {
            // Replace mode: only use prefix and suffix
            finalTitle = '';
        } else {
            // Keep mode: use the processed title
            finalTitle = processedTitle;
        }

        // Step 3: Apply prefix and suffix with syntax replacement
        const processedPrefix = this.processSyntax(prefix, originalTitle, numberingStart, counterIndex);
        const processedSuffix = this.processSyntax(suffix, originalTitle, numberingStart, counterIndex);

        finalTitle = processedPrefix + finalTitle + processedSuffix;

        return finalTitle;
    }

    // Process content based on the current settings
    processContent(originalContent, entryTitle, options) {
        const { prefix, suffix, removeChars } = options;
        
        let processedContent = originalContent;

        // Step 1: Remove characters if specified
        if (removeChars > 0) {
            processedContent = processedContent.substring(removeChars);
        }

        // Step 2: Apply prefix and suffix with syntax replacement
        const processedPrefix = this.processContentSyntax(prefix, originalContent, entryTitle);
        const processedSuffix = this.processContentSyntax(suffix, originalContent, entryTitle);

        const finalContent = processedPrefix + processedContent + processedSuffix;

        return finalContent;
    }

    // Process syntax placeholders in content text
    processContentSyntax(text, originalContent, entryTitle) {
        if (!text) return '';

        let processed = text;

        // Replace {{original}} with the original content
        processed = processed.replace(/\{\{original\}\}/g, originalContent);

        // Replace {{title}} with the entry title
        processed = processed.replace(/\{\{title\}\}/g, entryTitle);

        return processed;
    }

    // Process syntax placeholders in text
    processSyntax(text, originalTitle, numberingStart, counterIndex) {
        if (!text) return '';

        let processed = text;

        // Replace {{original}} with the original title
        processed = processed.replace(/\{\{original\}\}/g, originalTitle);

        // Replace {{counter}} with the current counter value
        if (processed.includes('{{counter}}') && numberingStart) {
            const counterValue = this.calculateCounterValue(numberingStart, counterIndex);
            processed = processed.replace(/\{\{counter\}\}/g, counterValue);
        }

        return processed;
    }

    // Calculate the counter value based on starting value and index
    calculateCounterValue(startValue, index) {
        // Try to parse as a number
        const numericValue = parseInt(startValue);
        if (!isNaN(numericValue)) {
            const newValue = numericValue + index;
            
            // Maintain zero-padding if the start value had it
            if (startValue.length > newValue.toString().length && startValue.startsWith('0')) {
                return newValue.toString().padStart(startValue.length, '0');
            }
            
            return newValue.toString();
        }

        // If not numeric, just append the index
        return startValue + index;
    }

    // Get selected entries in the order they should be processed
    getEntriesInProcessingOrder(selectedEntries, order) {
        // Get the display order from filteredEntries
        const displayOrder = this.app.filteredEntries
            .filter(entry => selectedEntries.includes(entry))
            .slice(); // Create a copy

        if (order === 'desc') {
            return displayOrder.reverse();
        }
        
        return displayOrder;
    }

    // Get currently selected entries
    getSelectedEntries() {
        return this.app.entries.filter(entry => 
            this.app.selectedEntries.has(entry._internalId)
        );
    }

    // Revert all changes to original state
    revertAll() {
        if (!this.hasPendingChanges) return;

        // Restore all original titles
        this.originalTitles.forEach((originalTitle, entryId) => {
            const entry = this.app.entries.find(e => e._internalId === entryId);
            if (entry) {
                entry.comment = originalTitle;
            }
        });

        // Restore all original orders
        this.originalOrders.forEach((originalOrder, entryId) => {
            const entry = this.app.entries.find(e => e._internalId === entryId);
            if (entry) {
                entry.order = originalOrder;
            }
        });

        // Restore all original positions
        if (this.originalPositions) {
            this.originalPositions.forEach((originalPosition, entryId) => {
                const entry = this.app.entries.find(e => e._internalId === entryId);
                if (entry) {
                    entry.position = originalPosition;
                }
            });
            this.originalPositions.clear();
        }

        // Restore all original roles
        if (this.originalRoles) {
            this.originalRoles.forEach((originalRole, entryId) => {
                const entry = this.app.entries.find(e => e._internalId === entryId);
                if (entry) {
                    entry.role = originalRole;
                }
            });
            this.originalRoles.clear();
        }

        // Restore all original depths
        if (this.originalDepths) {
            this.originalDepths.forEach((originalDepth, entryId) => {
                const entry = this.app.entries.find(e => e._internalId === entryId);
                if (entry) {
                    entry.depth = originalDepth;
                }
            });
            this.originalDepths.clear();
        }

        // Restore all original contents
        this.originalContents.forEach((originalContent, entryId) => {
            const entry = this.app.entries.find(e => e._internalId === entryId);
            if (entry) {
                entry.content = originalContent;
            }
        });

        // Restore all original categories
        this.originalCategories.forEach((originalCategory, entryId) => {
            const entry = this.app.entries.find(e => e._internalId === entryId);
            if (entry) {
                if (originalCategory === null) {
                    delete entry._categoryId;
                } else {
                    entry._categoryId = originalCategory;
                }
            }
        });

        // Clear tracking
        this.originalOrders.clear();
        this.originalTitles.clear();
        this.originalContents.clear();
        this.originalCategories.clear();
        this.hasPendingChanges = false;

        // Clear form fields
        this.app.elements.bulkTitleMode.value = 'keep';
        this.app.elements.bulkPrefix.value = '';
        this.app.elements.bulkSuffix.value = '';
        this.app.elements.bulkRemoveChars.value = '0';
        this.app.elements.bulkNumbering.value = '';
        this.app.elements.bulkNumberingOrder.value = 'asc';
        this.app.elements.bulkOrderStart.value = '100';
        this.app.elements.bulkOrderDirection.value = 'asc';
        this.app.elements.bulkPositionSelect.value = '';
        this.app.elements.bulkDepthValue.value = '1';
        this.app.elements.bulkRoleSelect.value = '0';
        this.app.elements.bulkContentPrefix.value = '';
        this.app.elements.bulkContentSuffix.value = '';
        this.app.elements.bulkContentRemoveChars.value = '0';
        this.app.elements.bulkCategorySelect.value = '';
        this.toggleDepthRoleFields(); // Hide depth/role fields

        // Clear select all checkbox
        this.app.elements.bulkSelectAll.checked = false;
        this.app.elements.bulkSelectAll.indeterminate = false;

        // Refresh display
        this.app.refreshEntryList();
        this.updateButtonStates();
        this.updateSelectAllCheckbox();

        showToast('info', 'All bulk changes reverted');
    }

    // Save all changes (make them permanent)
    saveAll() {
        if (!this.hasPendingChanges) return;

        const changedCount = Math.max(
            this.originalTitles.size, 
            this.originalOrders.size, 
            this.originalContents.size,
            this.originalCategories.size
        );

        // Clear tracking (changes are now permanent)
        this.originalTitles.clear();
        this.originalOrders.clear();
        this.originalContents.clear();
        this.originalCategories.clear();
        this.hasPendingChanges = false;

        // Update button states
        this.updateButtonStates();

        showToast('success', `Saved changes to ${changedCount} entries`);
    }

    // Delete all selected entries
    deleteAll() {
        const selectedEntries = this.getSelectedEntries();
        if (selectedEntries.length === 0) return;

        const entryCount = selectedEntries.length;
        const confirmMessage = `Are you sure you want to delete ${entryCount} selected entries? This cannot be undone.`;
        
        if (!confirm(confirmMessage)) return;

        // Remove selected entries from the main array
        selectedEntries.forEach(entry => {
            const index = this.app.entries.findIndex(e => e._internalId === entry._internalId);
            if (index >= 0) {
                this.app.entries.splice(index, 1);
            }

            // Also remove from tracking if it was being bulk edited
            this.originalTitles.delete(entry._internalId);
            this.originalOrders.delete(entry._internalId);
            this.originalContents.delete(entry._internalId);
        });

        // Clear selection
        this.app.clearSelection();

        // Update state
        if (this.originalTitles.size === 0) {
            this.hasPendingChanges = false;
        }

        // Refresh display
        this.app.refreshEntryList();
        this.app.updateButtonStates();
        this.updateButtonStates();
        this.updateSelectAllCheckbox();

        showToast('success', `Deleted ${entryCount} entries`);
    }

    // Reset bulk actions state (call when loading new project, etc.)
    reset() {
        this.originalTitles.clear();
        this.originalOrders.clear();
        this.originalContents.clear();
        this.originalCategories.clear();
        this.hasPendingChanges = false;
        this.updateButtonStates();
        if (this.originalPositions) this.originalPositions.clear();
        if (this.originalRoles) this.originalRoles.clear();
        if (this.originalDepths) this.originalDepths.clear();

        // Clear form values
        this.app.elements.bulkTitleMode.value = 'keep';
        this.app.elements.bulkPrefix.value = '';
        this.app.elements.bulkSuffix.value = '';
        this.app.elements.bulkRemoveChars.value = '0';
        this.app.elements.bulkNumbering.value = '';
        this.app.elements.bulkNumberingOrder.value = 'asc';
        this.app.elements.bulkOrderStart.value = '100';
        this.app.elements.bulkOrderDirection.value = 'asc';
        this.app.elements.bulkPositionSelect.value = '';
        this.app.elements.bulkDepthValue.value = '1';
        this.app.elements.bulkRoleSelect.value = '0';
        this.app.elements.bulkContentPrefix.value = '';
        this.app.elements.bulkContentSuffix.value = '';
        this.app.elements.bulkContentRemoveChars.value = '0';
        this.app.elements.bulkCategorySelect.value = '';
        this.toggleDepthRoleFields();

        // Clear select all checkbox
        this.app.elements.bulkSelectAll.checked = false;
        this.app.elements.bulkSelectAll.indeterminate = false;
    }

    // Handle when entries are externally modified (to preserve bulk edit state)
    onEntriesModified() {
        // If we have pending changes, we might need to handle this carefully
        // For now, just update button states
        this.updateButtonStates();
    }

    // Setup watchers for filter changes
    setupFilterWatchers() {
        // Hook into the app's refreshEntryList method to update select all checkbox when filters change
        const originalRefreshEntryList = this.app.refreshEntryList.bind(this.app);
        this.app.refreshEntryList = () => {
            originalRefreshEntryList();
            this.updateSelectAllCheckbox();
        };
    }

    // Toggle section collapse/expand
    toggleSection(sectionName) {
        if (sectionName === 'titles') {
            const section = this.app.elements.bulkTitlesToggle.parentElement;
            section.classList.toggle('collapsed');
        }
        if (sectionName === 'order') {
            const section = this.app.elements.bulkOrderToggle.parentElement;
            section.classList.toggle('collapsed');
        }
        if (sectionName === 'position') {
            const section = this.app.elements.bulkPositionToggle.parentElement;
            section.classList.toggle('collapsed');
        }
        if (sectionName === 'content') {
            const section = this.app.elements.bulkContentToggle.parentElement;
            section.classList.toggle('collapsed');
        }
        if (sectionName === 'category') {
            const section = this.app.elements.bulkCategoryToggle.parentElement;
            section.classList.toggle('collapsed');
        }
    }

    // Handle select all checkbox
    handleSelectAll(checked) {
        if (checked) {
            // Select all VISIBLE entries only
            this.app.filteredEntries.forEach(entry => {
                this.app.selectedEntries.add(entry._internalId);
            });
        } else {
            // Deselect all VISIBLE entries only
            this.app.filteredEntries.forEach(entry => {
                this.app.selectedEntries.delete(entry._internalId);
            });
            
            // If no visible entries remain selected, clear last selected index
            if (this.app.selectedEntries.size === 0) {
                this.app.lastSelectedIndex = -1;
            }
        }

        // Update the display
        this.app.updateSelectionDisplay();
        this.updateButtonStates();
        
        // ADD THESE LINES - Update the Entry Helper checkbox to match
        if (this.app.entryHelper?.elements.selectAll) {
            this.app.entryHelper.elements.selectAll.checked = checked;
            this.app.entryHelper.elements.selectAll.indeterminate = false;
        }
        
        // Notify Entry Helper of selection change
        this.app.entryHelper?.updateSelectedEntries(this.app.selectedEntries);
    }

    // Update the select all checkbox based on current selection state
    updateSelectAllCheckbox() {
        const visibleEntries = this.app.filteredEntries;
        const totalVisible = visibleEntries.length;
        
        // Count how many visible entries are selected
        const visibleSelected = visibleEntries.filter(entry => 
            this.app.selectedEntries.has(entry._internalId)
        ).length;

        let checked = false;
        let indeterminate = false;

        if (totalVisible === 0) {
            checked = false;
            indeterminate = false;
        } else if (visibleSelected === totalVisible) {
            checked = true;
            indeterminate = false;
        } else if (visibleSelected > 0) {
            checked = false;
            indeterminate = true;
        } else {
            checked = false;
            indeterminate = false;
        }

        // Update bulk actions checkbox
        this.app.elements.bulkSelectAll.checked = checked;
        this.app.elements.bulkSelectAll.indeterminate = indeterminate;
        
        // ADD THESE LINES - Update Entry Helper checkbox to match
        if (this.app.entryHelper?.elements.selectAll) {
            this.app.entryHelper.elements.selectAll.checked = checked;
            this.app.entryHelper.elements.selectAll.indeterminate = indeterminate;
        }
    }
}