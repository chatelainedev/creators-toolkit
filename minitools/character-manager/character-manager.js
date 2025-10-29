// Character Manager - Main Application Logic

class CharacterManagerApp {
    constructor() {
        this.userSessionManager = null;
        this.authUI = null;
        this.characters = []; // Current working characters
        this.filteredCharacters = []; // Filtered/sorted characters for display
        this.folders = []; // User-defined folders
        this.currentProject = null;
        this.selectedProject = null; 
        this.availableProjects = [];
        this.nextCharacterId = 1;
        this.currentEditCharacter = null;
        this.allTags = new Set(); // All available tags for autocomplete
        this.currentView = 'grid'; // 'grid' or 'folder'
        this.selectedFolder = null;
        this.selectedCharacterIds = new Set(); // Track selected character IDs
        this.lastSelectedId = null; // For shift-click range selection
        this.expandedEditorModal = null;
        this.displayedCount = 24; // Initial load
        this.loadMoreCount = 24; // How many to add each time
        this.currentAvatarIndex = 0; // Track which avatar we're viewing in edit modal
        
        // DOM elements (will be set on init)
        this.elements = {};
        this.currentEditFolder = null;
    }

    // Generate thumbnail from image data
    generateThumbnail(imageDataUri, maxWidth = 160, maxHeight = 200, quality = 0.8) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate dimensions maintaining aspect ratio
                let { width, height } = img;
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const thumbnailDataUri = canvas.toDataURL('image/jpeg', quality);
                resolve(thumbnailDataUri);
            };
            img.src = imageDataUri;
        });
    }

    // Initialize the application
    async init() {
        console.log('🚀 Initializing Character Manager...');
        
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

            // Update character count display
            await this.updateTotalCharacterCount();

            this.initializeContextMenu();

            initializeCharacterContextMenu();

            // Initialize about system
            await window.initializeCharacterManagerAbout();

            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.classList.add('show');
            }
            
            // ADD THIS CLEANUP CODE HERE (before the closing brace):
            window.addEventListener('beforeunload', () => {
                if (this.scrollObserver) {
                    this.scrollObserver.disconnect();
                }
            });
            
            console.log('✅ Character Manager initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Character Manager:', error);
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
            totalCharacterCount: document.getElementById('total-character-count'),

            // Search and controls
            searchInput: document.getElementById('search-input'),
            clearSearch: document.getElementById('clear-search'),
            folderFilter: document.getElementById('folder-filter'),
            tagFilterInput: document.getElementById('tag-filter-input'),
            tagSuggestions: document.getElementById('tag-suggestions'),
            characterCounterText: document.getElementById('character-counter-text'),

            // View controls
            gridViewBtn: document.getElementById('grid-view-btn'),
            folderViewBtn: document.getElementById('folder-view-btn'),
            addCharacterBtn: document.getElementById('add-character-btn'),
            manageFoldersBtn: document.getElementById('manage-folders-btn'),

            // Character grid
            characterGrid: document.getElementById('character-grid'),

            // Import modal
            importModal: document.getElementById('import-modal'),
            importModalClose: document.getElementById('import-modal-close'),
            importCharacterList: document.getElementById('import-character-list'),
            selectAllCharacters: document.getElementById('select-all-characters'),
            importCancel: document.getElementById('import-cancel'),
            importConfirm: document.getElementById('import-confirm'),
            totalCharacters: document.getElementById('total-characters'),
            totalFiles: document.getElementById('total-files'),

            // Edit modal
            editModal: document.getElementById('edit-modal'),
            editModalClose: document.getElementById('edit-modal-close'),
            editModalTitle: document.getElementById('edit-modal-title'),
            editAvatar: document.getElementById('edit-avatar'),
            avatarPreview: document.getElementById('avatar-preview'),
            changeAvatarBtn: document.getElementById('change-avatar-btn'),
            editCardName: document.getElementById('edit-card-name'),
            editName: document.getElementById('edit-name'),
            editDescription: document.getElementById('edit-description'),
            editPersonality: document.getElementById('edit-personality'),
            editScenario: document.getElementById('edit-scenario'),
            editFirstMessage: document.getElementById('edit-first-message'),
            editExampleMessages: document.getElementById('edit-example-messages'),
            editCharacterNote: document.getElementById('edit-character-note'),
            editDepth: document.getElementById('edit-depth'),
            editPostHistory: document.getElementById('edit-post-history'),
            editTags: document.getElementById('edit-tags'),
            editCreatorNotes: document.getElementById('edit-creator-notes'),
            editFolder: document.getElementById('edit-folder'),
            tagChips: document.getElementById('tag-chips'),
            editCancel: document.getElementById('edit-cancel'),
            editSave: document.getElementById('edit-save'),
            editDelete: document.getElementById('edit-delete'),
            characterBookBtn: document.getElementById('character-book-btn'),

            // Token counters
            descriptionTokens: document.getElementById('description-tokens'),
            personalityTokens: document.getElementById('personality-tokens'),
            scenarioTokens: document.getElementById('scenario-tokens'),
            firstMessageTokens: document.getElementById('first-message-tokens'),
            exampleMessagesTokens: document.getElementById('example-messages-tokens'),
            characterNoteTokens: document.getElementById('character-note-tokens'),
            totalTokens: document.getElementById('total-tokens'),
            postHistoryTokens: document.getElementById('post-history-tokens'),

            // Folder modal
            folderModal: document.getElementById('folder-modal'),
            folderModalClose: document.getElementById('folder-modal-close'),
            folderModalCloseBtn: document.getElementById('folder-modal-close-btn'),
            newFolderName: document.getElementById('new-folder-name'),
            createFolderBtn: document.getElementById('create-folder-btn'),
            foldersList: document.getElementById('folders-list'),

            // Folder edit modal
            folderEditModal: document.getElementById('folder-edit-modal'),
            folderEditModalClose: document.getElementById('folder-edit-modal-close'),
            folderEditTitle: document.getElementById('folder-edit-title'),
            folderEditName: document.getElementById('folder-edit-name'),
            folderEditCover: document.getElementById('folder-edit-cover'),
            folderCoverPreview: document.getElementById('folder-cover-preview'),
            changeFolderCoverBtn: document.getElementById('change-folder-cover-btn'),
            removeFolderCoverBtn: document.getElementById('remove-folder-cover-btn'),
            folderEditCancel: document.getElementById('folder-edit-cancel'),
            folderEditSave: document.getElementById('folder-edit-save'),

            // Bulk move modal
            bulkMoveModal: document.getElementById('bulk-move-modal'),
            bulkMoveModalClose: document.getElementById('bulk-move-modal-close'),
            bulkMoveTitle: document.getElementById('bulk-move-title'),
            bulkMoveDescription: document.getElementById('bulk-move-description'),
            bulkMoveFolder: document.getElementById('bulk-move-folder'),
            bulkMoveCancel: document.getElementById('bulk-move-cancel'),
            bulkMoveConfirm: document.getElementById('bulk-move-confirm'),

            // Bulk tags modal
            bulkTagsModal: document.getElementById('bulk-tags-modal'),
            bulkTagsModalClose: document.getElementById('bulk-tags-modal-close'),
            bulkTagsTitle: document.getElementById('bulk-tags-title'),
            bulkTagsDescription: document.getElementById('bulk-tags-description'),
            bulkTagsInput: document.getElementById('bulk-tags-input'),
            bulkTagsCancel: document.getElementById('bulk-tags-cancel'),
            bulkTagsConfirm: document.getElementById('bulk-tags-confirm'),

            // Settings modal
            settingsBtn: document.getElementById('settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            settingsModalClose: document.getElementById('settings-modal-close'),
            sillyTavernFolderPath: document.getElementById('sillytavern-folder-path'),
            settingsCancel: document.getElementById('settings-cancel'),
            settingsSave: document.getElementById('settings-save'),

            // Context menu
            contextMenu: document.getElementById('context-menu'),
            folderContextMenu: document.getElementById('folder-context-menu')  
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // Import functionality
        this.elements.importBtn.addEventListener('click', () => this.elements.importFile.click());
        this.elements.importFile.addEventListener('change', (e) => this.handleFileImport(e));

        // Search functionality
        this.elements.searchInput.addEventListener('input', () => this.handleSearch());
        this.elements.clearSearch.addEventListener('click', () => this.clearSearch());

        // Filter functionality
        this.elements.folderFilter.addEventListener('change', () => this.handleFolderFilter());
        this.elements.tagFilterInput.addEventListener('input', () => this.handleTagFilter());

        // View controls
        this.elements.gridViewBtn.addEventListener('click', () => this.setView('grid'));
        this.elements.folderViewBtn.addEventListener('click', () => this.setView('folder'));
        this.elements.addCharacterBtn.addEventListener('click', () => this.createNewCharacter());
        this.elements.manageFoldersBtn.addEventListener('click', () => this.showFolderModal());

        // Project management
        this.elements.projectDropdown.addEventListener('change', () => this.handleProjectSelection());
        this.elements.saveProjectBtn.addEventListener('click', async () => await this.saveProject());
        this.elements.loadProjectBtn.addEventListener('click', () => this.handleProjectButton());

        // Import modal
        this.elements.importModalClose.addEventListener('click', () => this.closeImportModal());
        this.elements.importCancel.addEventListener('click', () => this.closeImportModal());
        this.elements.importConfirm.addEventListener('click', () => this.confirmImport());
        this.elements.selectAllCharacters.addEventListener('change', (e) => this.toggleSelectAllCharacters(e.target.checked));

        // Edit modal
        this.elements.editModalClose.addEventListener('click', () => this.closeEditModal());
        this.elements.editCancel.addEventListener('click', () => this.closeEditModal());
        this.elements.editDelete.addEventListener('click', () => this.deleteCurrentCharacter());
        this.elements.editSave.addEventListener('click', async () => await this.saveCharacter());
        this.elements.changeAvatarBtn.addEventListener('click', () => this.elements.editAvatar.click());
        // Avatar carousel navigation
        const avatarPrevBtn = document.getElementById('avatar-prev-btn');
        const avatarNextBtn = document.getElementById('avatar-next-btn');
        if (avatarPrevBtn) avatarPrevBtn.addEventListener('click', () => this.previousAvatar());
        if (avatarNextBtn) avatarNextBtn.addEventListener('click', () => this.nextAvatar());
        this.elements.editAvatar.addEventListener('change', (e) => this.handleAvatarChange(e));
        // Add this with the other edit modal event listeners:
        this.elements.characterBookBtn.addEventListener('click', () => this.openCharacterBook());

        // Add expand button functionality for character modal
        document.addEventListener('click', (e) => {
            const expandBtn = e.target.closest('.expand-btn');
            if (expandBtn) {
                const fieldId = expandBtn.getAttribute('data-field');
                if (fieldId) {
                    this.openExpandedEditor(fieldId);
                }
            }
        });

        // Tag handling
        this.elements.editTags.addEventListener('input', () => this.handleTagsInput());
        this.elements.editTags.addEventListener('keydown', (e) => this.handleTagsKeydown(e));

        // Token counting
        this.setupTokenCounters();

        // Folder modal
        this.elements.folderModalClose.addEventListener('click', () => this.closeFolderModal());
        this.elements.folderModalCloseBtn.addEventListener('click', () => this.closeFolderModal());
        this.elements.createFolderBtn.addEventListener('click', () => this.createFolder());
        this.elements.newFolderName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createFolder();
        });

        // Folder edit modal
        this.elements.folderEditModalClose.addEventListener('click', () => this.closeFolderEditModal());
        this.elements.folderEditCancel.addEventListener('click', () => this.closeFolderEditModal());
        this.elements.folderEditSave.addEventListener('click', () => this.saveFolderEdit());
        this.elements.changeFolderCoverBtn.addEventListener('click', () => this.elements.folderEditCover.click());
        this.elements.removeFolderCoverBtn.addEventListener('click', () => this.removeFolderCover());
        this.elements.folderEditCover.addEventListener('change', (e) => this.handleFolderCoverChange(e));

        // Bulk move modal
        this.elements.bulkMoveModalClose.addEventListener('click', () => this.closeBulkMoveModal());
        this.elements.bulkMoveCancel.addEventListener('click', () => this.closeBulkMoveModal());
        this.elements.bulkMoveConfirm.addEventListener('click', () => this.confirmBulkMove());

        // Bulk tags modal
        this.elements.bulkTagsModalClose.addEventListener('click', () => this.closeBulkTagsModal());
        this.elements.bulkTagsCancel.addEventListener('click', () => this.closeBulkTagsModal());
        this.elements.bulkTagsConfirm.addEventListener('click', () => this.confirmBulkAddTags());

        // Settings functionality
        this.elements.settingsBtn.addEventListener('click', () => this.showSettingsModal());
        this.elements.settingsModalClose.addEventListener('click', () => this.closeSettingsModal());
        this.elements.settingsCancel.addEventListener('click', () => this.closeSettingsModal());
        this.elements.settingsSave.addEventListener('click', () => this.saveSettings());

        // Character grid interactions
        this.setupCharacterGridListeners();

        // Context menu
        this.setupContextMenu();

        // User avatar context menu is handled by initializeCharacterContextMenu()
        // (removed direct click handler - now shows context menu instead)

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImportModal();
                this.closeEditModal();
                this.closeFolderModal();
                this.closeFolderEditModal();
                this.closeBulkMoveModal();
                this.closeBulkTagsModal();
                this.closeSettingsModal();
                this.hideContextMenu();
                this.hideFolderContextMenu();  // Add this line
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

        this.elements.folderModal.addEventListener('click', (e) => {
            if (e.target === this.elements.folderModal) {
                this.closeFolderModal();
            }
        });

        this.elements.folderEditModal.addEventListener('click', (e) => {
            if (e.target === this.elements.folderEditModal) {
                this.closeFolderEditModal();
            }
        });

        this.elements.bulkMoveModal.addEventListener('click', (e) => {
            if (e.target === this.elements.bulkMoveModal) {
                this.closeBulkMoveModal();
            }
        });

        this.elements.bulkTagsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.bulkTagsModal) {
                this.closeBulkTagsModal();
            }
        });

        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettingsModal();
            }
        });
    }

    // Settings modal functionality
    async showSettingsModal() {
        await this.loadSettings();
        this.elements.settingsModal.style.display = 'flex';
        // Focus the input for easier typing
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
            const response = await fetch('/api/character-manager/load-settings', {
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
            const response = await fetch('/api/character-manager/save-settings', {
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

    // Debounced token update method
    updateTokenCountersDebounced() {
        if (this.tokenUpdateTimeout) {
            clearTimeout(this.tokenUpdateTimeout);
        }
        
        this.tokenUpdateTimeout = setTimeout(() => {
            this.updateAllTokenCounters();
            this.tokenUpdateTimeout = null;
        }, 150); // Debounce rapid typing
    }

    // Replace the setupTokenCounters method with this optimized version
    setupTokenCounters() {
        const tokenFields = [
            { element: this.elements.editDescription, counter: this.elements.descriptionTokens },
            { element: this.elements.editPersonality, counter: this.elements.personalityTokens },
            { element: this.elements.editScenario, counter: this.elements.scenarioTokens },
            { element: this.elements.editFirstMessage, counter: this.elements.firstMessageTokens },
            { element: this.elements.editExampleMessages, counter: this.elements.exampleMessagesTokens },
            { element: this.elements.editCharacterNote, counter: this.elements.characterNoteTokens },
            { element: this.elements.editPostHistory, counter: this.elements.postHistoryTokens }
        ];

        tokenFields.forEach(({ element, counter }) => {
            // Use input event with debouncing for better performance
            element.addEventListener('input', () => {
                // Update this specific counter immediately for responsiveness
                const tokens = this.calculateTokens(element.value);
                counter.textContent = `${tokens} tokens`;
                
                // Debounce the total token update to reduce flickering
                this.updateTotalTokensDebounced();
            });
        });
    }

    // Debounced total token update
    updateTotalTokensDebounced() {
        if (this.totalTokenUpdateTimeout) {
            clearTimeout(this.totalTokenUpdateTimeout);
        }
        
        this.totalTokenUpdateTimeout = setTimeout(() => {
            this.updateTotalTokens();
            this.totalTokenUpdateTimeout = null;
        }, 100);
    }

    // Calculate tokens for text (approximate)
    calculateTokens(text) {
        if (!text || typeof text !== 'string') return 0;
        return Math.ceil(text.length / 4);
    }

    // Update total token count in edit modal
    updateTotalTokens() {
        const fields = [
            this.elements.editDescription.value,
            this.elements.editPersonality.value,
            this.elements.editScenario.value,
            this.elements.editFirstMessage.value,
            this.elements.editExampleMessages.value,
            this.elements.editCharacterNote.value,
            this.elements.editPostHistory.value
        ];

        let total = 0;
        fields.forEach(field => {
            total += this.calculateTokens(field);
        });

        this.elements.totalTokens.textContent = total;
    }

    // Handle file import
    async handleFileImport(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        console.log(`📥 Importing ${files.length} file(s)...`);
        
        try {
            // Step 1: Process files locally to extract character data
            const characterData = [];
            const uploadFiles = [];
            
            for (const file of files) {
                const isValidFile = file.name.toLowerCase().endsWith('.json') || 
                                file.name.toLowerCase().endsWith('.png');
                                
                if (!isValidFile) {
                    showToast('warning', `Skipping ${file.name} - not a supported file type`);
                    continue;
                }
                
                try {
                    const result = await window.characterImporter.processSingleFile(file);
                    // Initialize avatars array if image file
                    if (result.character._hasImageFile) {
                        result.character.avatars = [{
                            id: `avatar_0_${Date.now()}`,  // This will be replaced by backend avatarId
                            tempOriginalFile: null,
                            tempThumbnailFile: null,
                            thumbnail: null,
                            isActive: true
                        }];
                    }
                    characterData.push(result.character);
                    if (result.file) {
                        uploadFiles.push(result.file);
                    }
                } catch (error) {
                    console.error(`Error processing ${file.name}:`, error);
                    showToast('error', `Failed to process ${file.name}: ${error.message}`);
                }
            }
            
            if (characterData.length === 0) {
                showToast('warning', 'No valid character files found');
                return;
            }
            
            // Step 2: Upload files to temp folder and get file references
            const userContext = this.userSessionManager.getUserContext();
            const formData = new FormData();
            formData.append('userContext', JSON.stringify(userContext));
            
            const characterDataArray = characterData.map((character, index) => ({
                id: character.id,
                name: character.name,
                hasImageFile: character._hasImageFile,
                originalFileName: uploadFiles[index]?.name
            }));
            
            formData.append('charactersData', JSON.stringify(characterDataArray));
            
            uploadFiles.forEach(file => {
                if (file) formData.append('files', file);
            });
            
            // Clear immediately
            uploadFiles.length = 0;
            
            const response = await fetch('/api/character-manager/upload-temp-files', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const tempResult = await response.json();
                
                // Step 3: Update characters with temp file references
                tempResult.characters.forEach(tempChar => {
                    const originalChar = characterData.find(c => c.id === tempChar.id);
                    if (originalChar) {
                        originalChar.tempOriginalFile = tempChar.tempOriginalFile;
                        originalChar.tempThumbnailFile = tempChar.tempThumbnailFile;
                        originalChar.avatarThumbnail = tempChar.avatarThumbnail;
                        originalChar.hasAvatar = tempChar.hasAvatar;
                        delete originalChar._hasImageFile;
                    }
                });
                
                this.showImportModal(characterData, files.length);
            } else {
                throw new Error('Failed to upload files to temp folder');
            }
            
        } catch (error) {
            console.error('Error importing files:', error);
            showToast('error', 'Failed to import files. Please check the file format.');
        }
        
        // Clear file input
        event.target.value = '';
    }

    // Show import preview modal
    showImportModal(characters, fileCount) {
        this.pendingImport = characters;
        
        this.elements.totalCharacters.textContent = characters.length;
        this.elements.totalFiles.textContent = fileCount;
        
        // Populate character list
        const listHtml = characters.map(character => `
            <div class="import-character-item">
                <label>
                    <input type="checkbox" checked data-character-id="${character.id}">
                    <span class="character-name">${this.escapeHtml(character.name || 'Untitled Character')}</span>
                </label>
                <div class="character-info">
                    <small>${character.totalTokens || 0} tokens • ${character.tags?.length || 0} tags</small>
                </div>
            </div>
        `).join('');
        
        this.elements.importCharacterList.innerHTML = listHtml;
        this.elements.selectAllCharacters.checked = true;
        this.elements.importModal.style.display = 'flex';
    }

    // Close import modal
    closeImportModal() {
        this.elements.importModal.style.display = 'none';
        this.pendingImport = null;
    }

    // Toggle select all in import modal
    toggleSelectAllCharacters(checked) {
        const checkboxes = this.elements.importCharacterList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = checked);
    }

    // Confirm import
    confirmImport() {
        const checkboxes = this.elements.importCharacterList.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.characterId);
        
        const selectedCharacters = this.pendingImport.filter(character => 
            selectedIds.includes(character.id)
        );
        
        if (selectedCharacters.length === 0) {
            showToast('warning', 'No characters selected for import');
            return;
        }

        // Finalize avatars array from temp files
        selectedCharacters.forEach(char => {
            if (char.avatars && char.avatars.length > 0 && char.tempOriginalFile) {
                char.avatars[0].id = char.avatarId || char.avatars[0].id;  // ADD THIS LINE
                char.avatars[0].tempOriginalFile = char.tempOriginalFile;
                char.avatars[0].tempThumbnailFile = char.tempThumbnailFile;
                char.avatars[0].thumbnail = char.avatarThumbnail;
            }
        });
        
        // Add characters to current project
        this.characters.push(...selectedCharacters);
        this.updateAllTags();
        this.refreshCharacterGrid();

        // Clean up temp references from imported characters
        selectedCharacters.forEach(char => {
            delete char.tempOriginalFile;
            delete char.tempThumbnailFile;
            // Keep avatarThumbnail for display until next project load
        });

        this.updateTotalCharacterCount();
        this.updateButtonStates();
        
        showToast('success', `Imported ${selectedCharacters.length} characters`);
        this.closeImportModal();
    }

    // Create new character
    createNewCharacter() {
        const newCharacter = {
            id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            cardName: '',
            name: '',
            description: '',
            personality: '',
            scenario: '',
            first_mes: '',
            alternate_greetings: [], // ADD THIS LINE
            mes_example: '',
            creator_notes: '',
            system_prompt: '',
            post_history_instructions: '',
            tags: [],
            character_book: null,
            depth_prompt: {
                prompt: '',
                depth: 4,
                role: 'system'
            },
            avatar: null,
            folderId: null,
            totalTokens: 0,
            _sourceFile: 'New Character'
        };
        
        this.editCharacter(newCharacter, true);
    }

    // Edit character
    editCharacter(character, isNew = false) {
        this.currentEditCharacter = character;
        this.isNewCharacter = isNew;
        
        // Populate form fields
        this.elements.editCardName.value = character.cardName || '';
        this.elements.editName.value = character.name || '';
        this.elements.editDescription.value = character.description || '';
        this.elements.editPersonality.value = character.personality || '';
        this.elements.editScenario.value = character.scenario || '';
        this.elements.editFirstMessage.value = character.first_mes || '';
        this.elements.editExampleMessages.value = character.mes_example || '';
        this.elements.editCharacterNote.value = character.depth_prompt?.prompt || '';
        this.elements.editDepth.value = character.depth_prompt?.depth || 4;
        this.elements.editPostHistory.value = character.post_history_instructions || '';
        this.elements.editTags.value = (character.tags || []).join(', ');
        this.elements.editCreatorNotes.value = character.creator_notes || '';

        // Initialize alternates for this character
        if (window.alternatesManager) {
            window.alternatesManager.initializeCharacterAlternates(character);
            window.alternatesManager.updateAltButtonStates();
        }

        // Set up greetings manager
        if (window.characterGreetingsManager) {
            window.characterGreetingsManager.setCurrentCharacter(character);
        }

        // Set up book manager
        if (window.characterBookManager) {
            window.characterBookManager.setCurrentCharacter(character);
        }
        
        // Initialize avatars if not present (backwards compatibility)
        if (!character.avatars || character.avatars.length === 0) {
            character.avatars = [];
            if (character.avatarThumbnail || character.avatar) {
                character.avatars.push({
                    id: `avatar_0_${Date.now()}`,
                    tempOriginalFile: character.tempOriginalFile || null,
                    tempThumbnailFile: character.tempThumbnailFile || null,
                    thumbnail: character.avatarThumbnail || character.avatar,
                    isActive: true
                });
            }
        }

        // Set to first/active avatar
        this.currentAvatarIndex = character.avatars.findIndex(a => a.isActive);
        if (this.currentAvatarIndex === -1) this.currentAvatarIndex = 0;

        // Update avatar preview
        this.updateAvatarCarousel();  
        // Update folder dropdown
        this.populateFolderDropdown();
        this.elements.editFolder.value = character.folderId || '';
        
        // Update modal title
        this.elements.editModalTitle.textContent = isNew ? 'Create Character' : 'Edit Character';
        
        // Show/hide delete button
        this.elements.editDelete.style.display = isNew ? 'none' : 'inline-flex';
        
        // Update token counters
        this.updateAllTokenCounters();
        
        // Update tag chips
        this.updateTagChips();
        
        this.elements.editModal.style.display = 'flex';
        
        // Focus on name field
        setTimeout(() => this.elements.editName.focus(), 100);
    }

    // Update avatar preview
    updateAvatarPreview(avatarData) {
        const preview = this.elements.avatarPreview;
        
        if (avatarData) {
            preview.innerHTML = `<img src="${avatarData}" alt="Character Avatar">`;
        } else {
            preview.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    // Update avatar carousel display
    updateAvatarCarousel() {
        const character = this.currentEditCharacter;
        if (!character || !character.avatars || character.avatars.length === 0) {
            this.updateAvatarPreview(null);
            document.getElementById('avatar-prev-btn').style.display = 'none';
            document.getElementById('avatar-next-btn').style.display = 'none';
            document.getElementById('avatar-counter').style.display = 'none';
            return;
        }
        
        const currentAvatar = character.avatars[this.currentAvatarIndex];
        this.updateAvatarPreview(currentAvatar.thumbnail);
        
        // Show/hide navigation if multiple avatars
        const showNav = character.avatars.length > 1;
        document.getElementById('avatar-prev-btn').style.display = showNav ? 'flex' : 'none';
        document.getElementById('avatar-next-btn').style.display = showNav ? 'flex' : 'none';
        document.getElementById('avatar-counter').style.display = showNav ? 'block' : 'none';
        document.getElementById('avatar-counter').textContent = 
            `${this.currentAvatarIndex + 1} / ${character.avatars.length}`;
    }

    // Navigate to previous avatar
    previousAvatar() {
        const character = this.currentEditCharacter;
        if (!character || !character.avatars || character.avatars.length === 0) return;
        
        this.currentAvatarIndex--;
        if (this.currentAvatarIndex < 0) {
            this.currentAvatarIndex = character.avatars.length - 1;
        }
        
        this.updateAvatarCarousel();
    }

    // Navigate to next avatar
    nextAvatar() {
        const character = this.currentEditCharacter;
        if (!character || !character.avatars || character.avatars.length === 0) return;
        
        this.currentAvatarIndex++;
        if (this.currentAvatarIndex >= character.avatars.length) {
            this.currentAvatarIndex = 0;
        }
        
        this.updateAvatarCarousel();
    }

    // Set active avatar (called when saving)
    setActiveAvatar(index) {
        const character = this.currentEditCharacter;
        if (!character || !character.avatars) return;
        
        character.avatars.forEach((avatar, i) => {
            avatar.isActive = (i === index);
        });
        
        // Update main character references
        const activeAvatar = character.avatars[index];
        character.tempOriginalFile = activeAvatar.tempOriginalFile;
        character.tempThumbnailFile = activeAvatar.tempThumbnailFile;
        character.avatarThumbnail = activeAvatar.thumbnail;
    }

    // Add new avatar
    async addNewAvatar() {
        this.elements.editAvatar.click();
    }

    // Handle avatar change
    async handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showToast('error', 'Please select an image file');
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const formData = new FormData();
            
            formData.append('userContext', JSON.stringify(userContext));
            formData.append('characterId', this.currentEditCharacter.id);
            formData.append('avatar', file);
            
            const response = await fetch('/api/character-manager/upload-avatar-temp', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                
                // Initialize avatars array if needed
                if (!this.currentEditCharacter.avatars) {
                    this.currentEditCharacter.avatars = [];
                }
                
                // Add new avatar
                const newAvatar = {
                    id: result.avatarId || `avatar_${this.currentEditCharacter.avatars.length}_${Date.now()}`,  // USE BACKEND ID
                    tempOriginalFile: result.tempOriginalFile,
                    tempThumbnailFile: result.tempThumbnailFile,
                    thumbnail: result.avatarThumbnail,
                    isActive: false
                };
                
                this.currentEditCharacter.avatars.push(newAvatar);
                
                // Switch to new avatar
                this.currentAvatarIndex = this.currentEditCharacter.avatars.length - 1;
                this.updateAvatarCarousel();
                
                showToast('success', 'Avatar added successfully');
            } else {
                throw new Error('Failed to upload avatar');
            }
            
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showToast('error', 'Failed to upload avatar');
        }
    }

    // Update all token counters
    updateAllTokenCounters() {
        // In updateAllTokenCounters() method, add Post History to the tokenFields array:
        const tokenFields = [
            { element: this.elements.editDescription, counter: this.elements.descriptionTokens },
            { element: this.elements.editPersonality, counter: this.elements.personalityTokens },
            { element: this.elements.editScenario, counter: this.elements.scenarioTokens },
            { element: this.elements.editFirstMessage, counter: this.elements.firstMessageTokens },
            { element: this.elements.editExampleMessages, counter: this.elements.exampleMessagesTokens },
            { element: this.elements.editCharacterNote, counter: this.elements.characterNoteTokens },
            { element: this.elements.editPostHistory, counter: this.elements.postHistoryTokens } // Add this line
        ];

        tokenFields.forEach(({ element, counter }) => {
            const tokens = this.calculateTokens(element.value);
            counter.textContent = `${tokens} tokens`;
        });

        this.updateTotalTokens();
    }

    // Handle tags input
    handleTagsInput() {
        const value = this.elements.editTags.value;
        // Update tag chips when user types
        this.updateTagChipsFromInput(value);
    }

    // Handle tags keydown
    handleTagsKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.updateTagChipsFromInput(this.elements.editTags.value);
        }
    }

    // Update tag chips from input value
    updateTagChipsFromInput(value) {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        this.currentEditCharacter.tags = tags;
        this.updateTagChips();
    }

    // Update tag chips display
    updateTagChips() {
        const tags = this.currentEditCharacter.tags || [];
        const html = tags.map(tag => `
            <div class="tag-chip">
                ${this.escapeHtml(tag)}
                <span class="remove-tag" data-tag="${this.escapeHtml(tag)}">×</span>
            </div>
        `).join('');
        
        this.elements.tagChips.innerHTML = html;
        
        // Add click handlers for tag removal
        this.elements.tagChips.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tagToRemove = e.target.dataset.tag;
                this.removeTag(tagToRemove);
            });
        });
    }

    // Remove a tag
    removeTag(tagToRemove) {
        this.currentEditCharacter.tags = this.currentEditCharacter.tags.filter(tag => tag !== tagToRemove);
        this.elements.editTags.value = this.currentEditCharacter.tags.join(', ');
        this.updateTagChips();
    }

    // Add this method to the CharacterManager class:
    openCharacterBook() {
        if (window.characterBookManager) {
            window.characterBookManager.openBookModal();
        } else {
            showToast('error', 'Character Book manager not initialized');
        }
    }

    // You might also want to show the button conditionally:
    showCharacterBookButton(show = true) {
        this.elements.characterBookBtn.style.display = show ? 'inline-flex' : 'none';
    }

    // Add this method to handle the expanded text editor:
    openExpandedEditor(fieldId) {
        const originalTextarea = document.getElementById(fieldId);
        if (!originalTextarea) {
            console.error('Original textarea not found:', fieldId);
            return;
        }

        // Create modal once, reuse thereafter
        if (!this.expandedEditorModal) {
            this.expandedEditorModal = this.createExpandedEditorModal();
        }

        // Just update content and show
        this.populateExpandedEditor(fieldId, originalTextarea);
        this.expandedEditorModal.style.display = 'flex';
    }

    // Split the modal creation and population
    // Complete createExpandedEditorModal method with save button - replace your existing method
    createExpandedEditorModal() {
        // Remove any existing expanded editor modal
        const existingModal = document.getElementById('character-expanded-editor-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create the modal
        const modal = document.createElement('div');
        modal.id = 'character-expanded-editor-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            display: none;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            transform: translateZ(0);
            backface-visibility: hidden;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; width: 90%; height: 80vh; display: flex; flex-direction: column;">
                <div class="modal-header">
                    <h3>Edit Text</h3>
                    <button class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="flex: 1; display: flex; flex-direction: column; padding: var(--space-lg);">
                    <textarea id="character-expanded-textarea" 
                        style="flex: 1; resize: none; padding: var(--space-md); 
                            background: var(--bg-primary); color: var(--text-secondary); 
                            border: 1px solid var(--border-secondary); border-radius: var(--radius-sm);
                            font-family: inherit; font-size: var(--font-size-md); line-height: 1.5;
                            transform: translateZ(0); -webkit-overflow-scrolling: touch;
                            margin-bottom: var(--space-md);"></textarea>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span id="character-expanded-token-count" style="font-size: var(--font-size-xs); color: var(--text-secondary);">0 tokens</span>
                        <button id="expanded-save-btn" class="btn-primary" style="padding: var(--space-xs) var(--space-md); font-size: var(--font-size-sm);">
                            <i class="fas fa-save"></i> Update Field
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Set up close handlers
        const closeBtn = modal.querySelector('.close-btn');
        const saveBtn = modal.querySelector('#expanded-save-btn');
        
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        // Close button handler
        closeBtn.addEventListener('click', closeModal);
        
        // Save button handler
        saveBtn.addEventListener('click', () => {
            if (this.currentExpandedField) {
                const expandedTextarea = modal.querySelector('#character-expanded-textarea');
                this.currentExpandedField.originalTextarea.value = expandedTextarea.value;
                
                // Trigger input event to update token counters in main modal
                const inputEvent = new Event('input', { bubbles: true });
                this.currentExpandedField.originalTextarea.dispatchEvent(inputEvent);
                
                closeModal();
            }
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                closeModal();
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modal;
    }

    // Also update your populateExpandedEditor method to work with the save button approach
    populateExpandedEditor(fieldId, originalTextarea) {
        const modal = this.expandedEditorModal;
        const expandedTextarea = modal.querySelector('#character-expanded-textarea');
        const tokenCountElement = modal.querySelector('#character-expanded-token-count');
        const titleElement = modal.querySelector('.modal-header h3');

        // Update content
        titleElement.textContent = this.getFriendlyFieldName(fieldId);
        expandedTextarea.value = originalTextarea.value;
        expandedTextarea.placeholder = originalTextarea.placeholder;
        
        // Update token count
        this.updateExpandedTokenCount(expandedTextarea.value, tokenCountElement);
        
        // Only update token count in expanded modal (no syncing until save)
        expandedTextarea.oninput = () => {
            this.updateExpandedTokenCount(expandedTextarea.value, tokenCountElement);
        };

        // Store reference for saving later
        this.currentExpandedField = { fieldId, originalTextarea };

        // Focus textarea
        setTimeout(() => expandedTextarea.focus(), 100);
    }

    getFriendlyFieldName(fieldId) {
        const fieldNames = {
            'edit-description': 'Description',
            'edit-personality': 'Personality', 
            'edit-scenario': 'Scenario',
            'edit-first-message': 'First Message',
            'edit-example-messages': 'Example Messages',
            'edit-character-note': 'Character Note',
            'edit-post-history': 'Post-History Instructions',
            'edit-creator-notes': 'Creator Notes'
        };
        return fieldNames[fieldId] || 'Edit Text';
    }

    updateExpandedTokenCount(text, element) {
        const tokens = this.calculateTokens(text);
        element.textContent = `${tokens} tokens`;
    }

    // Save character
    async saveCharacter() {
        if (!this.currentEditCharacter) return;
        
        // Validate required fields
        const name = this.elements.editName.value.trim();
        if (!name) {
            showToast('error', 'Character name is required');
            return;
        }

        // SYNC: Save all current textarea values to their active alternates
        if (window.alternatesManager) {
            window.alternatesManager.syncAllFieldsToAlternates();
        }
        
        // Update character data
        this.currentEditCharacter.cardName = this.elements.editCardName.value.trim();
        this.currentEditCharacter.name = name;
        this.currentEditCharacter.description = this.elements.editDescription.value.trim();
        this.currentEditCharacter.personality = this.elements.editPersonality.value.trim();
        this.currentEditCharacter.scenario = this.elements.editScenario.value.trim();
        this.currentEditCharacter.first_mes = this.elements.editFirstMessage.value.trim();
        this.currentEditCharacter.mes_example = this.elements.editExampleMessages.value.trim();
        this.currentEditCharacter.creator_notes = this.elements.editCreatorNotes.value.trim();
        this.currentEditCharacter.post_history_instructions = this.elements.editPostHistory.value.trim();
        this.currentEditCharacter.folderId = this.elements.editFolder.value || null;
        
        // Update depth prompt
        this.currentEditCharacter.depth_prompt = {
            prompt: this.elements.editCharacterNote.value.trim(),
            depth: parseInt(this.elements.editDepth.value) || 4,
            role: 'system'
        };
        
        // Update tags from input
        const tagsValue = this.elements.editTags.value.trim();
        this.currentEditCharacter.tags = tagsValue ? 
            tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

        // Set active avatar based on current view
        if (this.currentEditCharacter.avatars && this.currentEditCharacter.avatars.length > 0) {
            this.setActiveAvatar(this.currentAvatarIndex);
            
            // Update main character references from active avatar
            const activeAvatar = this.currentEditCharacter.avatars.find(a => a.isActive) || 
                                this.currentEditCharacter.avatars[0];
            this.currentEditCharacter.tempOriginalFile = activeAvatar.tempOriginalFile || activeAvatar.originalFile;
            this.currentEditCharacter.tempThumbnailFile = activeAvatar.tempThumbnailFile || activeAvatar.thumbnailFile;
            this.currentEditCharacter.avatarThumbnail = activeAvatar.thumbnail;
        }
        
        // Recalculate tokens
        this.currentEditCharacter.totalTokens = calculateCharacterTokens(this.currentEditCharacter);
        
        // Add to characters array if new
        if (this.isNewCharacter) {
            this.characters.push(this.currentEditCharacter);
            showToast('success', 'Character created successfully');
        } else {
            showToast('success', 'Character updated successfully');
        }
        
        this.updateAllTags();
        this.refreshCharacterGrid();
        this.updateTotalCharacterCount();
        this.updateButtonStates();
        this.closeEditModal();
    }

    // Update the original PNG file with current character data
    async updateOriginalPngFile(character) {
        console.log('🔄 updateOriginalPngFile called with:', {
            characterName: character.name,
            originalFile: character.originalFile,
            project: this.currentProject
        });
        
        if (!character.originalFile || !this.currentProject) {
            console.log('❌ Missing originalFile or project');
            return;
        }
        
        try {
            // Create character data in the format expected by your PNG reader
            // Based on your character-import.js parseCharacterJson function
            const exportData = {
                name: character.name,
                description: character.description,
                personality: character.personality,
                scenario: character.scenario,
                first_mes: character.first_mes,
                mes_example: character.mes_example,
                creator_notes: character.creator_notes,
                system_prompt: character.system_prompt || '',
                post_history_instructions: character.post_history_instructions || '',
                alternate_greetings: character.alternate_greetings || [],
                tags: character.tags || [],
                creator: 'Character Manager',
                character_version: '',
                // Character book data
                character_book: character.character_book || {
                    entries: [],
                    name: character.name + "'s Lorebook",
                    description: '',
                    scan_depth: 100,
                    token_budget: 500,
                    recursive_scanning: false
                },
                // Extensions for depth prompt
                extensions: {
                    depth_prompt: {
                        prompt: character.depth_prompt?.prompt || '',
                        depth: character.depth_prompt?.depth || 4
                    }
                },
                // V2 spec data
                spec: 'chara_card_v2',
                spec_version: '2.0',
                data: {
                    name: character.name,
                    description: character.description,
                    personality: character.personality,
                    scenario: character.scenario,
                    first_mes: character.first_mes,
                    mes_example: character.mes_example,
                    creator_notes: character.creator_notes,
                    system_prompt: character.system_prompt || '',
                    post_history_instructions: character.post_history_instructions || '',
                    alternate_greetings: character.alternate_greetings || [],
                    character_book: character.character_book || null,
                    tags: character.tags || [],
                    creator: 'Character Manager',
                    character_version: '',
                    extensions: {
                        depth_prompt: {
                            prompt: character.depth_prompt?.prompt || '',
                            depth: character.depth_prompt?.depth || 4
                        }
                    }
                }
            };

            console.log('📤 Sending PNG update request...');
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/update-original-png', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName: this.currentProject,
                    characterId: character.id,
                    originalFile: character.originalFile,
                    characterData: exportData
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ PNG update response:', result);
            } else {
                const errorText = await response.text();
                console.error('❌ PNG update failed:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('❌ Error in updateOriginalPngFile:', error);
            throw error;
        }
    }

    // Delete current character
    deleteCurrentCharacter() {
        if (!this.currentEditCharacter || this.isNewCharacter) return;
        
        const characterName = this.currentEditCharacter.name || 'Untitled Character';
        if (!confirm(`Are you sure you want to delete "${characterName}"?`)) return;
        
        const index = this.characters.findIndex(c => c.id === this.currentEditCharacter.id);
        if (index >= 0) {
            this.characters.splice(index, 1);
            this.updateAllTags();
            this.refreshCharacterGrid();
            this.updateButtonStates();
            this.closeEditModal();
            showToast('success', 'Character deleted');
        }
    }

    // Close edit modal
    closeEditModal() {
        this.elements.editModal.style.display = 'none';
        this.currentEditCharacter = null;
        this.isNewCharacter = false;
    }

    // Update all available tags
    updateAllTags() {
        this.allTags.clear();
        this.characters.forEach(character => {
            if (character.tags && Array.isArray(character.tags)) {
                character.tags.forEach(tag => this.allTags.add(tag));
            }
        });
    }

    // Handle search
    handleSearch() {
        this.resetDisplayedCount(); // Add this line
        this.refreshCharacterGrid();
        
        const hasSearch = this.elements.searchInput.value.trim().length > 0;
        this.elements.clearSearch.style.opacity = hasSearch ? '1' : '0';
    }

    // Clear search
    clearSearch() {
        this.elements.searchInput.value = '';
        this.handleSearch();
    }

    // Handle folder filter
    handleFolderFilter() {
        this.selectedFolder = this.elements.folderFilter.value || null;
        this.resetDisplayedCount(); // Add this line
        this.refreshCharacterGrid();
    }

    // Handle tag filter
    handleTagFilter() {
        this.resetDisplayedCount(); // Add this line
        this.refreshCharacterGrid();
    }

    // Set view mode
    setView(viewMode) {
        this.currentView = viewMode;
        
        // Reset folder selection when switching to grid view
        if (viewMode === 'grid') {
            this.selectedFolder = null;
        }
        
        // Update button states
        this.elements.gridViewBtn.classList.toggle('active', viewMode === 'grid');
        this.elements.folderViewBtn.classList.toggle('active', viewMode === 'folder');
        
        // Store current selection before refresh
        const currentSelection = new Set(this.selectedCharacterIds);
        
        // Refresh display
        this.refreshCharacterGrid();
        
        // Ensure selection is maintained
        this.selectedCharacterIds = currentSelection;
    }

    // Refresh character grid display
    refreshCharacterGrid() {
        if (this.currentView === 'folder') {
            this.renderFolderView();
        } else {
            this.renderGridView();
        }
        
        // Ensure selection UI is updated after DOM is fully rendered
        requestAnimationFrame(() => {
            this.updateSelectionUI();
            this.updateBulkActionControls();
        });
    }

    // Render grid view (original behavior)
    renderGridView() {
        this.elements.characterGrid.classList.remove('folder-view-active');
        
        this.applyFiltersAndSort();
        
        if (this.filteredCharacters.length === 0) {
            this.showEmptyState();
            this.updateCharacterCounter();
            return;
        }
        
        // Only render up to displayedCount
        const charactersToShow = this.filteredCharacters.slice(0, this.displayedCount);
        const html = charactersToShow.map(character => this.renderCharacterCard(character)).join('');
        
        // Add "Show More" button if there are more characters
        const showMoreBtn = this.filteredCharacters.length > this.displayedCount ? `
            <div class="show-more-container" style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl);">
                <button id="show-more-btn" class="btn-primary">
                    <i class="fas fa-chevron-down"></i> 
                    Show More (${this.filteredCharacters.length - this.displayedCount} remaining)
                </button>
            </div>
        ` : '';
        
        this.elements.characterGrid.innerHTML = html + showMoreBtn;
        
        // Attach show more handler
        const showMoreButton = document.getElementById('show-more-btn');
        if (showMoreButton) {
            showMoreButton.addEventListener('click', () => this.showMoreCharacters());
        }
        
        // Set up intersection observer for auto-load
        this.setupVirtualScrolling();
        
        this.updateCharacterCounter();
    }

    // Show more characters
    showMoreCharacters() {
        this.displayedCount += this.loadMoreCount;
        this.renderGridView();
        
        // Maintain selection after re-render
        requestAnimationFrame(() => {
            this.updateSelectionUI();
        });
    }

    // Reset displayed count when filters change
    resetDisplayedCount() {
        this.displayedCount = this.loadMoreCount;
    }

    // Virtual scrolling with intersection observer
    setupVirtualScrolling() {
        const showMoreContainer = document.querySelector('.show-more-container');
        if (!showMoreContainer) return;
        
        // Clean up old observer
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        
        // Create observer that triggers when "Show More" comes into view
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.filteredCharacters.length > this.displayedCount) {
                    // Auto-load more when user scrolls near the button
                    this.showMoreCharacters();
                }
            });
        }, {
            root: null,
            rootMargin: '200px', // Trigger 200px before button is visible
            threshold: 0
        });
        
        this.scrollObserver.observe(showMoreContainer);
    }

    // Render folder view
    renderFolderView() {
        // Add folder view class to change grid behavior
        this.elements.characterGrid.classList.add('folder-view-active');
        
        if (this.selectedFolder) {
            // Show characters in selected folder
            this.renderFolderContents(this.selectedFolder);
        } else {
            // Show folder overview
            this.renderFolderOverview();
        }
    }

    // Render folder overview (list of folders)
    renderFolderOverview() {
        let systemFoldersHtml = '';
        let userFoldersHtml = '';

        // Add "All Characters" folder (system)
        const totalCharacters = this.characters.length;
        systemFoldersHtml += `
            <div class="folder-card system-folder" data-folder-id="all">
                <div class="folder-cover">
                    <div class="folder-placeholder">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="folder-overlay"></div>
                </div>
                <div class="folder-info">
                    <h3 class="folder-name">All Characters</h3>
                </div>
            </div>
        `;

        // Add "No Folder" if there are unfoldered characters (system)
        const unfoldereredCount = this.characters.filter(c => !c.folderId).length;
        if (unfoldereredCount > 0) {
            systemFoldersHtml += `
                <div class="folder-card system-folder" data-folder-id="unfoldered">
                    <div class="folder-cover">
                        <div class="folder-placeholder">
                            <i class="fas fa-question"></i>
                        </div>
                        <div class="folder-overlay"></div>
                    </div>
                    <div class="folder-info">
                        <h3 class="folder-name">No Folder</h3>
                    </div>
                </div>
            `;
        }

        // Add user-created folders
        this.folders.forEach(folder => {
            const coverHtml = folder.coverThumbnail ? 
                `<img src="${folder.coverThumbnail}" alt="${folder.name}">` : 
                `<div class="folder-placeholder"><i class="fas fa-folder"></i></div>`;
                
            userFoldersHtml += `
                <div class="folder-card user-folder" data-folder-id="${folder.id}">
                    <div class="folder-cover">
                        ${coverHtml}
                        <div class="folder-overlay"></div>
                    </div>
                    <div class="folder-info">
                        <h3 class="folder-name">${this.escapeHtml(folder.name)}</h3>
                    </div>
                </div>
            `;
        });

        if (systemFoldersHtml === '' && userFoldersHtml === '') {
            this.elements.characterGrid.innerHTML = `
                <div class="folder-view">
                    <div class="folder-breadcrumb">
                        <h2><i class="fas fa-folder-open"></i> Folders</h2>
                    </div>
                    <div class="empty-state" style="margin: var(--space-xl); height: 300px;">
                        <i class="fas fa-folder"></i>
                        <h3>No folders created yet</h3>
                        <p>Create folders to organize your characters</p>
                    </div>
                </div>
            `;
        } else {
            this.elements.characterGrid.innerHTML = `
                <div class="folder-grid">
                    <div class="folder-breadcrumb">
                        <h2><i class="fas fa-folder-open"></i> Folders</h2>
                    </div>
                    ${systemFoldersHtml ? `<div class="system-folders-row">${systemFoldersHtml}</div>` : ''}
                    ${userFoldersHtml}
                </div>
            `;
        }

        this.updateCharacterCounter();
    }

    // Render contents of a specific folder
    renderFolderContents(folderId) {
        let folderCharacters = [];
        let folderName = '';

        if (folderId === 'all') {
            folderCharacters = [...this.characters];
            folderName = 'All Characters';
        } else if (folderId === 'unfoldered') {
            folderCharacters = this.characters.filter(c => !c.folderId);
            folderName = 'No Folder';
        } else {
            folderCharacters = this.characters.filter(c => c.folderId === folderId);
            const folder = this.folders.find(f => f.id === folderId);
            folderName = folder ? folder.name : 'Unknown Folder';
        }

        // Apply search filter to folder characters
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            folderCharacters = folderCharacters.filter(character => {
                const name = (character.name || '').toLowerCase();
                const cardName = (character.cardName || '').toLowerCase();
                const description = (character.description || '').toLowerCase();
                const tags = (character.tags || []).join(' ').toLowerCase();
                
                return name.includes(searchTerm) || 
                    cardName.includes(searchTerm) ||
                    description.includes(searchTerm) || 
                    tags.includes(searchTerm);
            });
        }

        // Sort characters
        folderCharacters.sort((a, b) => {
            const nameA = (a.cardName || a.name || '').toLowerCase();
            const nameB = (b.cardName || b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        if (folderCharacters.length === 0) {
            this.elements.characterGrid.innerHTML = `
                <div class="folder-view">
                    <div class="folder-breadcrumb">
                        <button class="breadcrumb-btn" onclick="app.setSelectedFolder(null)">
                            <i class="fas fa-arrow-left"></i> Back to Folders
                        </button>
                        <h2><i class="fas fa-folder"></i> ${this.escapeHtml(folderName)}</h2>
                    </div>
                    <div class="empty-state" style="margin: var(--space-xl); height: 300px;">
                        <i class="fas fa-users"></i>
                        <h3>No characters in this folder</h3>
                        <p>Characters matching your search criteria were not found</p>
                    </div>
                </div>
            `;
        } else {
            const charactersHtml = folderCharacters.map(character => this.renderCharacterCard(character)).join('');
            this.elements.characterGrid.innerHTML = `
                <div class="folder-view">
                    <div class="folder-breadcrumb">
                        <button class="breadcrumb-btn" onclick="app.setSelectedFolder(null)">
                            <i class="fas fa-arrow-left"></i> Back to Folders
                        </button>
                        <h2><i class="fas fa-folder"></i> ${this.escapeHtml(folderName)} (${folderCharacters.length})</h2>
                    </div>
                    <div class="folder-characters">
                        ${charactersHtml}
                    </div>
                </div>
            `;
        }

        this.filteredCharacters = folderCharacters;
        this.updateCharacterCounter();
    }

    // Set selected folder
    setSelectedFolder(folderId) {
        this.selectedFolder = folderId;
        this.refreshCharacterGrid();
    }

    // Apply filters and sorting
    applyFiltersAndSort() {
        let filtered = [...this.characters];
        
        // Apply search filter
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(character => {
                const name = (character.name || '').toLowerCase();
                const cardName = (character.cardName || '').toLowerCase();
                const description = (character.description || '').toLowerCase();
                const tags = (character.tags || []).join(' ').toLowerCase();
                
                return name.includes(searchTerm) || 
                    cardName.includes(searchTerm) ||
                    description.includes(searchTerm) || 
                    tags.includes(searchTerm);
            });
        }
        
        // Apply folder filter
        if (this.selectedFolder === 'unfoldered') {
            filtered = filtered.filter(character => !character.folderId);
        } else if (this.selectedFolder) {
            filtered = filtered.filter(character => character.folderId === this.selectedFolder);
        }
        
        // Apply tag filter
        const tagFilter = this.elements.tagFilterInput.value.toLowerCase().trim();
        if (tagFilter) {
            filtered = filtered.filter(character => {
                const tags = (character.tags || []).join(' ').toLowerCase();
                return tags.includes(tagFilter);
            });
        }
        
        // Sort alphabetically by name
        filtered.sort((a, b) => {
            const nameA = (a.cardName || a.name || '').toLowerCase();
            const nameB = (b.cardName || b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        this.filteredCharacters = filtered;
    }

    // Render a character card
    renderCharacterCard(character) {
        const displayName = character.cardName || character.name || 'Untitled Character';
        const description = character.description || '';
        console.log('renderCharacterCard - description sample for', character.name + ':', character.description.substring(0, 100));
        const truncatedDescription = description.length > 200 ? 
            description.substring(0, 200) + '...' : description;
        
        // Use avatarThumbnail instead of avatar
        const avatarHtml = character.avatarThumbnail ? 
            `<img src="${character.avatarThumbnail}" alt="${displayName}">` : 
            '<i class="fas fa-user"></i>';
            
        const tagsHtml = (character.tags || []).slice(0, 3).map(tag => 
            `<span class="tag-chip">${this.escapeHtml(tag)}</span>`
        ).join('');
        
        const moreTagsText = character.tags && character.tags.length > 3 ? 
            `<span class="more-tags">+${character.tags.length - 3}</span>` : '';

        return `
            <div class="character-card" data-character-id="${character.id}">
                <div class="character-avatar">
                    ${avatarHtml}
                </div>
                <div class="character-info">
                    ${character.cardName ? `<div class="character-card-name">${this.escapeHtml(character.cardName)}</div>` : ''}
                    <h3 class="character-name">${this.escapeHtml(character.name || 'Untitled Character')}</h3>
                    <p class="character-description">${this.escapeHtml(truncatedDescription)}</p>
                    
                    <div class="character-content">
                        ${tagsHtml || character.tags?.length > 3 ? `<div class="character-tags">${tagsHtml}${moreTagsText}</div>` : ''}
                    </div>
                    
                    <div class="character-meta">
                        <span class="character-tokens">${character.totalTokens || 0} tokens</span>
                        ${character.character_book ? '<i class="fas fa-book" title="Has Character Book"></i>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Show empty state
    showEmptyState() {
        // Ensure we're not in folder view mode for empty state
        this.elements.characterGrid.classList.remove('folder-view-active');
        
        this.elements.characterGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No characters found</h3>
                <p>Import character cards or create new ones to get started</p>
            </div>
        `;
    }

    // Update character counter
    updateCharacterCounter() {
        const visibleCount = this.filteredCharacters.length;
        const totalCount = this.characters.length;
        this.elements.characterCounterText.textContent = `${visibleCount}/${totalCount}`;
    }

    setupCharacterGridListeners() {
        // Use event delegation with a single listener for better performance
        this.elements.characterGrid.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default behavior
            
            // Handle folder card clicks (in folder view)
            const folderCard = e.target.closest('.folder-card');
            if (folderCard) {
                const folderId = folderCard.dataset.folderId;
                this.setSelectedFolder(folderId);
                return;
            }

            // Handle breadcrumb back button clicks
            const breadcrumbBtn = e.target.closest('.breadcrumb-btn');
            if (breadcrumbBtn) {
                return; // Let onclick handle it
            }

            // Handle character card clicks (in grid view)
            const characterCard = e.target.closest('.character-card');
            if (characterCard) {
                const characterId = characterCard.dataset.characterId;
                this.handleCharacterCardClick(characterId, e);
            }
        });

        // Separate double-click handler with debouncing
        let doubleClickTimeout = null;
        this.elements.characterGrid.addEventListener('dblclick', (e) => {
            const characterCard = e.target.closest('.character-card');
            if (characterCard) {
                e.preventDefault();
                
                // Clear any pending single-click actions
                if (doubleClickTimeout) {
                    clearTimeout(doubleClickTimeout);
                    doubleClickTimeout = null;
                }
                
                const characterId = characterCard.dataset.characterId;
                const character = this.characters.find(c => c.id === characterId);
                if (character) {
                    this.editCharacter(character, false);
                }
            }
        });

        // Optimized context menu handler
        this.elements.characterGrid.addEventListener('contextmenu', (e) => {
            // Check for folder cards first
            const folderCard = e.target.closest('.folder-card.user-folder');
            if (folderCard) {
                e.preventDefault();
                const folderId = folderCard.dataset.folderId;
                this.showFolderContextMenu(e, folderId);
                return;
            }

            // Existing character card logic
            const characterCard = e.target.closest('.character-card');
            if (characterCard) {
                const characterId = characterCard.dataset.characterId;
                
                // Disable context menu if multiple characters are selected
                if (this.selectedCharacterIds.size > 1) {
                    e.preventDefault();
                    return;
                }
                
                // Show context menu with proper positioning
                this.showContextMenu(e, characterId);
            }
        });
        
        // Global click handler to hide context menu
        document.addEventListener('click', (e) => {
            if (!this.elements.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
            if (!this.elements.folderContextMenu.contains(e.target)) {
                this.hideFolderContextMenu();
            }
        });
    }

    // Optimized handleCharacterCardClick method
    handleCharacterCardClick(characterId, event) {
        const isCtrlClick = event.ctrlKey || event.metaKey;
        const isShiftClick = event.shiftKey;

        // Batch selection changes to prevent multiple updates
        let selectionChanged = false;

        if (isShiftClick && this.lastSelectedId) {
            // Range selection
            const oldSize = this.selectedCharacterIds.size;
            this.selectRange(this.lastSelectedId, characterId);
            selectionChanged = this.selectedCharacterIds.size !== oldSize;
        } else if (isCtrlClick) {
            // Toggle selection
            if (this.selectedCharacterIds.has(characterId)) {
                this.selectedCharacterIds.delete(characterId);
                if (this.lastSelectedId === characterId) {
                    this.lastSelectedId = this.selectedCharacterIds.size > 0 ? 
                        Array.from(this.selectedCharacterIds)[0] : null;
                }
                selectionChanged = true;
            } else {
                this.selectedCharacterIds.add(characterId);
                this.lastSelectedId = characterId;
                selectionChanged = true;
            }
        } else {
            // Single selection - only update if different
            const wasSelected = this.selectedCharacterIds.has(characterId) && this.selectedCharacterIds.size === 1;
            if (!wasSelected) {
                this.selectedCharacterIds.clear();
                this.selectedCharacterIds.add(characterId);
                this.lastSelectedId = characterId;
                selectionChanged = true;
            }
        }

        // Only update UI if selection actually changed
        if (selectionChanged) {
            // Debounce UI updates to prevent flickering
            this.debouncedUpdateSelectionUI();
            this.debouncedUpdateBulkControls();
        }
    }

    debouncedUpdateSelectionUI() {
        if (this.selectionUIUpdateTimeout) {
            clearTimeout(this.selectionUIUpdateTimeout);
        }
        
        this.selectionUIUpdateTimeout = setTimeout(() => {
            this.updateSelectionUI(); // <- Call the original method name
            this.selectionUIUpdateTimeout = null;
        }, 16);
    }

    debouncedUpdateBulkControls() {
        if (this.bulkControlsUpdateTimeout) {
            clearTimeout(this.bulkControlsUpdateTimeout);
        }
        
        this.bulkControlsUpdateTimeout = setTimeout(() => {
            this.updateBulkActionControls();
            this.bulkControlsUpdateTimeout = null;
        }, 16); // ~60fps
    }

    // Select single character (clear others)
    selectSingleCharacter(characterId) {
        this.selectedCharacterIds.clear();
        this.selectedCharacterIds.add(characterId);
        this.lastSelectedId = characterId;
    }

    // Toggle character selection
    toggleCharacterSelection(characterId) {
        if (this.selectedCharacterIds.has(characterId)) {
            this.selectedCharacterIds.delete(characterId);
            if (this.lastSelectedId === characterId) {
                this.lastSelectedId = this.selectedCharacterIds.size > 0 ? 
                    Array.from(this.selectedCharacterIds)[0] : null;
            }
        } else {
            this.selectedCharacterIds.add(characterId);
            this.lastSelectedId = characterId;
        }
    }

    // Select range of characters
    selectRange(startId, endId) {
        const visibleCards = Array.from(this.elements.characterGrid.querySelectorAll('.character-card'));
        const startIndex = visibleCards.findIndex(card => card.dataset.characterId === startId);
        const endIndex = visibleCards.findIndex(card => card.dataset.characterId === endId);
        
        if (startIndex === -1 || endIndex === -1) return;
        
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);
        
        // Clear current selection
        this.selectedCharacterIds.clear();
        
        // Select range
        for (let i = minIndex; i <= maxIndex; i++) {
            const cardId = visibleCards[i].dataset.characterId;
            this.selectedCharacterIds.add(cardId);
        }
        
        this.lastSelectedId = endId;
    }

    // Clear all selections
    clearSelection() {
        this.selectedCharacterIds.clear();
        this.lastSelectedId = null;
        this.updateSelectionUI();
        this.updateBulkActionControls();
    }

    // Replace the updateSelectionUI method with this optimized version
    updateSelectionUI() {
        // Use requestAnimationFrame for smooth updates
        if (this.selectionUpdatePending) return;
        
        this.selectionUpdatePending = true;
        requestAnimationFrame(() => {
            // Get all cards once
            const cards = this.elements.characterGrid.querySelectorAll('.character-card');
            const selectedIds = this.selectedCharacterIds;
            
            // If no cards found, wait a bit longer for DOM to be ready
            if (cards.length === 0 && selectedIds.size > 0) {
                setTimeout(() => {
                    this.selectionUpdatePending = false;
                    this.updateSelectionUI();
                }, 50);
                return;
            }
            
            // Batch DOM updates using DocumentFragment approach
            const updates = [];
            
            cards.forEach(card => {
                const characterId = card.dataset.characterId;
                const shouldBeSelected = selectedIds.has(characterId);
                const isCurrentlySelected = card.classList.contains('selected');
                
                // Only queue updates for cards that need changes
                if (shouldBeSelected !== isCurrentlySelected) {
                    updates.push({ card, shouldBeSelected });
                }
            });
            
            // Apply all updates at once
            updates.forEach(({ card, shouldBeSelected }) => {
                if (shouldBeSelected) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
            
            // Update grid class only if needed
            const shouldHaveMultiSelect = selectedIds.size > 1;
            const currentlyHasMultiSelect = this.elements.characterGrid.classList.contains('multi-select-active');
            
            if (shouldHaveMultiSelect !== currentlyHasMultiSelect) {
                if (shouldHaveMultiSelect) {
                    this.elements.characterGrid.classList.add('multi-select-active');
                } else {
                    this.elements.characterGrid.classList.remove('multi-select-active');
                }
            }
            
            this.selectionUpdatePending = false;
        });
    }

    // Also add this method to reduce the frequency of character grid refreshes
    refreshCharacterGridDebounced() {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        
        this.refreshTimeout = setTimeout(() => {
            this.refreshCharacterGrid();
            this.refreshTimeout = null;
        }, 100); // Debounce rapid refresh calls
    }

    // Update bulk action controls visibility
    updateBulkActionControls() {
        const bulkControls = document.getElementById('bulk-action-controls');
        const selectedCount = this.selectedCharacterIds.size;
        
        // Only show controls when multiple cards are selected
        if (selectedCount > 1) {
            bulkControls.style.display = 'flex';
            document.getElementById('selected-count').textContent = selectedCount;
        } else {
            bulkControls.style.display = 'none';
        }
    }

    // Bulk delete characters
    async bulkDeleteCharacters() {
        const selectedIds = Array.from(this.selectedCharacterIds);
        if (selectedIds.length === 0) return;
        
        const message = `Are you sure you want to delete ${selectedIds.length} selected character(s)?`;
        if (!confirm(message)) return;
        
        // Remove characters
        this.characters = this.characters.filter(c => !selectedIds.includes(c.id));
        
        this.clearSelection();
        this.updateAllTags();
        this.refreshCharacterGrid();
        this.updateTotalCharacterCount();
        this.updateButtonStates();
        showToast('success', `Deleted ${selectedIds.length} characters`);
    }

    // Bulk move characters to folder
    async bulkMoveToFolder() {
        const selectedIds = Array.from(this.selectedCharacterIds);
        if (selectedIds.length === 0) return;
        
        this.showBulkMoveModal();
    }

    // Show bulk move modal
    showBulkMoveModal() {
        const selectedCount = this.selectedCharacterIds.size;
        this.elements.bulkMoveTitle.textContent = `Move ${selectedCount} Character${selectedCount > 1 ? 's' : ''} to Folder`;
        this.elements.bulkMoveDescription.textContent = `Select a folder to move the ${selectedCount} selected character${selectedCount > 1 ? 's' : ''} to:`;
        
        // Populate folder dropdown
        this.populateBulkMoveFolderDropdown();
        
        this.elements.bulkMoveModal.style.display = 'flex';
    }

    // Close bulk move modal
    closeBulkMoveModal() {
        this.elements.bulkMoveModal.style.display = 'none';
        this.elements.bulkMoveFolder.value = '';
    }

    // Populate bulk move folder dropdown
    populateBulkMoveFolderDropdown() {
        // Clear existing options
        this.elements.bulkMoveFolder.innerHTML = '<option value="">No Folder</option>';
        
        // Add folder options
        this.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.name;
            this.elements.bulkMoveFolder.appendChild(option);
        });
    }

    // Confirm bulk move
    confirmBulkMove() {
        const selectedIds = Array.from(this.selectedCharacterIds);
        const targetFolderId = this.elements.bulkMoveFolder.value || null;
        
        // Get folder name for toast message
        const folderName = targetFolderId ? 
            (this.folders.find(f => f.id === targetFolderId)?.name || 'Unknown Folder') : 
            'No Folder';
        
        // Update characters
        selectedIds.forEach(id => {
            const character = this.characters.find(c => c.id === id);
            if (character) {
                character.folderId = targetFolderId;
            }
        });
        
        this.clearSelection();
        this.refreshCharacterGrid();
        this.closeBulkMoveModal();
        showToast('success', `Moved ${selectedIds.length} characters to "${folderName}"`);
    }

    // Bulk add tags to characters
    async bulkAddTags() {
        const selectedIds = Array.from(this.selectedCharacterIds);
        if (selectedIds.length === 0) return;
        
        this.showBulkTagsModal();
    }

    // Show bulk add tags modal
    showBulkTagsModal() {
        const selectedCount = this.selectedCharacterIds.size;
        this.elements.bulkTagsTitle.textContent = `Add Tags to ${selectedCount} Character${selectedCount > 1 ? 's' : ''}`;
        this.elements.bulkTagsDescription.textContent = `Enter tags to add to the ${selectedCount} selected character${selectedCount > 1 ? 's' : ''}:`;
        
        this.elements.bulkTagsInput.value = '';
        this.elements.bulkTagsModal.style.display = 'flex';
        
        // Focus the input
        setTimeout(() => this.elements.bulkTagsInput.focus(), 100);
    }

    // Close bulk tags modal
    closeBulkTagsModal() {
        this.elements.bulkTagsModal.style.display = 'none';
        this.elements.bulkTagsInput.value = '';
    }

    // Confirm bulk add tags
    confirmBulkAddTags() {
        const selectedIds = Array.from(this.selectedCharacterIds);
        const tagsInput = this.elements.bulkTagsInput.value.trim();
        
        if (!tagsInput) {
            showToast('warning', 'Please enter some tags');
            return;
        }
        
        // Parse tags from input
        const newTags = tagsInput.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        
        if (newTags.length === 0) {
            showToast('warning', 'Please enter valid tags');
            return;
        }
        
        // Add tags to selected characters
        let updatedCount = 0;
        selectedIds.forEach(id => {
            const character = this.characters.find(c => c.id === id);
            if (character) {
                // Initialize tags array if it doesn't exist
                if (!character.tags || !Array.isArray(character.tags)) {
                    character.tags = [];
                }
                
                // Add new tags (avoiding duplicates)
                let addedTags = 0;
                newTags.forEach(newTag => {
                    const normalizedNewTag = newTag.toLowerCase();
                    const exists = character.tags.some(existingTag => 
                        existingTag.toLowerCase() === normalizedNewTag
                    );
                    
                    if (!exists) {
                        character.tags.push(newTag);
                        addedTags++;
                    }
                });
                
                if (addedTags > 0) {
                    updatedCount++;
                }
            }
        });
        
        this.clearSelection();
        this.updateAllTags();
        this.refreshCharacterGrid();
        this.closeBulkTagsModal();
        
        if (updatedCount > 0) {
            const tagText = newTags.length === 1 ? `tag "${newTags[0]}"` : `${newTags.length} tags`;
            showToast('success', `Added ${tagText} to ${updatedCount} character${updatedCount > 1 ? 's' : ''}`);
        } else {
            showToast('info', 'All selected characters already had these tags');
        }
    }

    // Context menu functionality
    setupContextMenu() {
        // Character context menu
        this.elements.contextMenu.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.context-menu-item');
            if (!menuItem) return;
            
            const action = menuItem.dataset.action;
            
            // Handle move-to-folder specifically
            if (action === 'move-to-folder' && this.currentContextCharacterId) {
                const folderId = menuItem.dataset.folderId;
                this.moveCharacterToFolder(this.currentContextCharacterId, folderId);
            } else if (action && this.currentContextCharacterId) {
                this.handleContextAction(action, this.currentContextCharacterId);
            }
            
            this.hideContextMenu();
        });

        // Folder context menu - ADD THIS SECTION
        this.elements.folderContextMenu.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.context-menu-item');
            if (!menuItem) return;
            
            const action = menuItem.dataset.action;
            if (action && this.currentContextFolderId) {
                this.handleFolderContextAction(action, this.currentContextFolderId);
            }
            
            this.hideFolderContextMenu();
        });

        // Add submenu positioning logic
        // Add submenu positioning logic for ALL submenus
        const submenuParents = this.elements.contextMenu.querySelectorAll('.submenu-parent');

        submenuParents.forEach(submenuParent => {
            const submenu = submenuParent.querySelector('.context-submenu');
            
            if (submenu) {
                submenuParent.addEventListener('mouseenter', () => {
                    // Show submenu temporarily to measure it
                    submenu.style.display = 'block';
                    submenu.style.visibility = 'hidden';
                    
                    const submenuRect = submenu.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    
                    // Check if submenu would go off-screen to the right
                    if (submenuRect.right > viewportWidth) {
                        submenu.classList.add('position-left');
                    } else {
                        submenu.classList.remove('position-left');
                    }
                    
                    // Restore visibility
                    submenu.style.visibility = 'visible';
                });
                
                submenuParent.addEventListener('mouseleave', () => {
                    submenu.style.display = 'none';
                });
            }
        });

        // Hide context menu when clicking elsewhere - UPDATE THIS SECTION
        document.addEventListener('click', (e) => {
            if (!this.elements.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
            if (!this.elements.folderContextMenu.contains(e.target)) {
                this.hideFolderContextMenu();
            }
        });
    }

    // Show context menu
    showContextMenu(event, characterId) {
        event.preventDefault();
        
        this.currentContextCharacterId = characterId;
        const contextMenu = this.elements.contextMenu;
        
        // Hide menu first to get accurate measurements
        contextMenu.style.display = 'none';
        
        // Populate the Move to submenu
        this.populateMoveToSubmenu(characterId);

        // Show/hide PNG export based on avatar availability
        const character = this.characters.find(c => c.id === characterId);
        const hasPngFile = character && character.originalFile && character.hasAvatar;
        const pngExportItem = contextMenu.querySelector('[data-action="export-png"]');
        if (pngExportItem) {
            pngExportItem.style.display = hasPngFile ? 'flex' : 'none';
        }

        // Show/hide SillyTavern option
        const stItem = contextMenu.querySelector('[data-action="send-to-st"]');
        if (stItem) {
            const isAvailable = window.sillyTavernIntegration && window.sillyTavernIntegration.isAvailable(character);
            stItem.style.display = isAvailable ? 'block' : 'none';
            console.log('🔍 ST menu item visibility:', isAvailable ? 'visible' : 'hidden');
        }
        
        // Show menu temporarily off-screen to measure
        contextMenu.style.position = 'fixed';
        contextMenu.style.left = '-9999px';
        contextMenu.style.top = '-9999px';
        contextMenu.style.display = 'block';
        
        // Get menu dimensions
        const menuRect = contextMenu.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Use clientX/clientY for proper viewport positioning
        let x = event.clientX;
        let y = event.clientY;
        
        // Horizontal positioning - prevent menu from going off-screen
        if (x + menuWidth > viewportWidth) {
            x = Math.max(0, x - menuWidth);
        }
        
        // Vertical positioning - prevent menu from going off-screen
        if (y + menuHeight > viewportHeight) {
            // Try to position above the cursor
            const spaceAbove = y;
            if (spaceAbove >= menuHeight) {
                y = y - menuHeight;
            } else {
                // Not enough space above, position at bottom with scroll consideration
                y = Math.max(0, viewportHeight - menuHeight - 10);
            }
        }
        
        // Apply final position with bounds checking
        contextMenu.style.left = Math.max(0, Math.min(x, viewportWidth - menuWidth)) + 'px';
        contextMenu.style.top = Math.max(0, Math.min(y, viewportHeight - menuHeight)) + 'px';
        
        // Add a subtle fade-in effect for smoother appearance
        contextMenu.style.opacity = '0';
        requestAnimationFrame(() => {
            contextMenu.style.opacity = '1';
        });
    }

    // Helper method to improve context menu hiding
    hideContextMenu() {
        const contextMenu = this.elements.contextMenu;
        if (contextMenu.style.display !== 'none') {
            // Quick fade out
            contextMenu.style.opacity = '0';
            setTimeout(() => {
                contextMenu.style.display = 'none';
                contextMenu.style.opacity = '1'; // Reset for next show
            }, 100);
        }
        this.currentContextCharacterId = null;
    }

    // Show folder context menu
    showFolderContextMenu(event, folderId) {
        event.preventDefault();
        
        this.currentContextFolderId = folderId;
        const contextMenu = this.elements.folderContextMenu;
        
        // Hide menu first to get accurate measurements
        contextMenu.style.display = 'none';
        
        // Show menu temporarily off-screen to measure
        contextMenu.style.position = 'fixed';
        contextMenu.style.left = '-9999px';
        contextMenu.style.top = '-9999px';
        contextMenu.style.display = 'block';
        
        // Get menu dimensions
        const menuRect = contextMenu.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Use clientX/clientY for proper viewport positioning
        let x = event.clientX;
        let y = event.clientY;
        
        // Horizontal positioning - prevent menu from going off-screen
        if (x + menuWidth > viewportWidth) {
            x = Math.max(0, x - menuWidth);
        }
        
        // Vertical positioning - prevent menu from going off-screen
        if (y + menuHeight > viewportHeight) {
            // Try to position above the cursor
            const spaceAbove = y;
            if (spaceAbove >= menuHeight) {
                y = y - menuHeight;
            } else {
                // Not enough space above, position at bottom with scroll consideration
                y = Math.max(0, viewportHeight - menuHeight - 10);
            }
        }
        
        // Apply final position with bounds checking
        contextMenu.style.left = Math.max(0, Math.min(x, viewportWidth - menuWidth)) + 'px';
        contextMenu.style.top = Math.max(0, Math.min(y, viewportHeight - menuHeight)) + 'px';
        
        // Add a subtle fade-in effect for smoother appearance
        contextMenu.style.opacity = '0';
        requestAnimationFrame(() => {
            contextMenu.style.opacity = '1';
        });
    }

    // Hide folder context menu
    hideFolderContextMenu() {
        const contextMenu = this.elements.folderContextMenu;
        if (contextMenu.style.display !== 'none') {
            // Quick fade out
            contextMenu.style.opacity = '0';
            setTimeout(() => {
                contextMenu.style.display = 'none';
                contextMenu.style.opacity = '1'; // Reset for next show
            }, 100);
        }
        this.currentContextFolderId = null;
    }

    // Handle folder context menu actions
    handleFolderContextAction(action, folderId) {
        switch (action) {
            case 'edit-folder':
                this.editFolder(folderId);
                break;
            case 'delete-folder':
                this.deleteFolder(folderId);
                break;
        }
    }

    // Populate Move to submenu
    populateMoveToSubmenu(characterId) {
        const character = this.characters.find(c => c.id === characterId);
        if (!character) return;
        
        const submenu = document.getElementById('move-to-submenu');
        let html = '';
        
        // Add "No Folder" option
        const isInNoFolder = !character.folderId;
        html += `
            <div class="context-menu-item ${isInNoFolder ? 'disabled' : ''}" data-action="move-to-folder" data-folder-id="">
                <i class="fas fa-times"></i> No Folder
            </div>
        `;
        
        // Add existing folders
        this.folders.forEach(folder => {
            const isCurrentFolder = character.folderId === folder.id;
            html += `
                <div class="context-menu-item ${isCurrentFolder ? 'disabled' : ''}" data-action="move-to-folder" data-folder-id="${folder.id}">
                    <i class="fas fa-folder"></i> ${this.escapeHtml(folder.name)}
                </div>
            `;
        });
        
        // Add separator and "Create New Folder" option
        html += `
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="move-to-new-folder">
                <i class="fas fa-folder-plus"></i> Create New Folder...
            </div>
        `;
        
        submenu.innerHTML = html;
    }

    // Move character to folder
    moveCharacterToFolder(characterId, folderId) {
        const character = this.characters.find(c => c.id === characterId);
        if (!character) return;
        
        const oldFolderId = character.folderId;
        character.folderId = folderId || null;
        
        // Get folder names for toast message
        const oldFolderName = oldFolderId ? 
            (this.folders.find(f => f.id === oldFolderId)?.name || 'Unknown Folder') : 
            'No Folder';
        const newFolderName = folderId ? 
            (this.folders.find(f => f.id === folderId)?.name || 'Unknown Folder') : 
            'No Folder';
        
        this.refreshCharacterGrid();
        showToast('success', `Moved "${character.name}" from "${oldFolderName}" to "${newFolderName}"`);
    }

    // Create new folder and move character
    async createFolderAndMoveCharacter(characterId) {
        const folderName = prompt('Enter new folder name:');
        if (!folderName || !folderName.trim()) return;
        
        const trimmedName = folderName.trim();
        
        // Check for duplicate folder names
        if (this.folders.some(folder => folder.name.toLowerCase() === trimmedName.toLowerCase())) {
            showToast('error', 'Folder name already exists');
            return;
        }
        
        // Create new folder
        const newFolder = {
            id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: trimmedName,
            cover: null,
            created: Date.now()
        };
        
        this.folders.push(newFolder);
        this.updateFolderFilter();
        
        // Move character to new folder
        this.moveCharacterToFolder(characterId, newFolder.id);
        
        showToast('success', `Created folder "${trimmedName}" and moved character`);
    }

    // Hide context menu
    hideContextMenu() {
        this.elements.contextMenu.style.display = 'none';
        this.currentContextCharacterId = null;
    }

    // Handle context menu actions
    async handleContextAction(action, characterId) {    
        const character = this.characters.find(c => c.id === characterId);
        if (!character) return;
        
        switch (action) {
            case 'edit':
                this.editCharacter(character, false);
                break;
            case 'duplicate':
                this.duplicateCharacter(character);
                break;
            case 'move-to-folder':
                // This will be handled by event delegation below
                break;
            case 'move-to-new-folder':
                await this.createFolderAndMoveCharacter(characterId);
                break;
            case 'send-to-st':
                if (window.sillyTavernIntegration) {
                    window.sillyTavernIntegration.showProfileSelector(character);
                }
                break;
            case 'export-json':
                await this.exportCharacter(character, 'json');
                break;
            case 'export-png':
                await this.exportCharacter(character, 'png');
                break;
            case 'export-txt':
                await this.exportCharacter(character, 'txt');
                break;
            case 'delete':
                this.deleteCharacterById(characterId);
                break;
        }
    }

    // Duplicate character
    duplicateCharacter(character) {
        const duplicated = {
            ...character,
            id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${character.name} (Copy)`,
            cardName: character.cardName ? `${character.cardName} (Copy)` : ''
        };
        
        this.characters.push(duplicated);
        this.refreshCharacterGrid();
        this.updateButtonStates();
        showToast('success', `Duplicated "${character.name}"`);
    }

    // Export character
    async exportCharacter(character, format) {
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/export-character', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    character,
                    format,
                    projectName: this.currentProject // Add this line
                })
            });
            
            if (response.ok) {
                // Handle file download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                const contentDisposition = response.headers.get('content-disposition');
                let filename = `${character.name || 'character'}.${format}`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                    if (filenameMatch) filename = filenameMatch[1];
                }
                
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showToast('success', `Exported "${character.name}" as ${format.toUpperCase()}`);
            } else {
                throw new Error('Export failed');
            }
        } catch (error) {
            console.error('Export error:', error);
            showToast('error', 'Failed to export character');
        }
    }

    // Delete character by ID
    deleteCharacterById(characterId) {
        const character = this.characters.find(c => c.id === characterId);
        if (!character) return;
        
        const characterName = character.name || 'Untitled Character';
        if (!confirm(`Are you sure you want to delete "${characterName}"?`)) return;
        
        const index = this.characters.findIndex(c => c.id === characterId);
        if (index >= 0) {
            this.characters.splice(index, 1);
            this.updateAllTags();
            this.refreshCharacterGrid();
            this.updateTotalCharacterCount();
            this.updateButtonStates();
            showToast('success', 'Character deleted');
        }
    }

    // Folder management
    showFolderModal() {
        this.populateFoldersDisplay();
        this.elements.folderModal.style.display = 'flex';
    }

    closeFolderModal() {
        this.elements.folderModal.style.display = 'none';
    }

    createFolder() {
        const name = this.elements.newFolderName.value.trim();
        if (!name) {
            showToast('error', 'Folder name is required');
            return;
        }
        
        if (this.folders.some(folder => folder.name.toLowerCase() === name.toLowerCase())) {
            showToast('error', 'Folder name already exists');
            return;
        }
        
        const newFolder = {
            id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            cover: null, // No cover initially
            created: Date.now()
        };
        
        this.folders.push(newFolder);
        this.elements.newFolderName.value = '';
        this.populateFoldersDisplay();
        this.updateFolderFilter();

        if (this.currentView === 'folder') {
            this.refreshCharacterGrid();
        }

        showToast('success', `Created folder "${name}"`);
    }

    populateFoldersDisplay() {
        const html = this.folders.map(folder => {
            const coverHtml = folder.coverThumbnail ? 
                `<img src="${folder.coverThumbnail}" alt="${folder.name}">` : 
                `<i class="fas fa-folder"></i>`;
                
            return `
                <div class="folder-item">
                    <div class="folder-item-info">
                        <div class="folder-item-cover">${coverHtml}</div>
                        <h4 class="folder-item-name">${this.escapeHtml(folder.name)}</h4>
                    </div>
                    <div class="folder-actions">
                        <button class="btn-secondary" onclick="app.editFolder('${folder.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-danger" onclick="app.deleteFolder('${folder.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        this.elements.foldersList.innerHTML = html || '<p style="color: var(--text-tertiary); text-align: center; margin: var(--space-lg) 0;">No folders created yet</p>';
    }

    // Edit folder
    editFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;
        
        this.currentEditFolder = folder;
        this.elements.folderEditName.value = folder.name;
        // Use coverThumbnail instead of cover
        this.updateFolderCoverPreview(folder.coverThumbnail || folder.cover);
        this.elements.folderEditModal.style.display = 'flex';  // ADD THIS LINE
    }

    // Close folder edit modal
    closeFolderEditModal() {
        this.elements.folderEditModal.style.display = 'none';
        this.currentEditFolder = null;
    }

    // Update folder cover preview
    updateFolderCoverPreview(coverData) {
        const preview = this.elements.folderCoverPreview;
        
        if (coverData) {
            preview.innerHTML = `<img src="${coverData}" alt="Folder Cover">`;
        } else {
            preview.innerHTML = '<i class="fas fa-folder"></i>';
        }
    }

    // Handle folder cover change
    async handleFolderCoverChange(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showToast('error', 'Please select an image file');
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const formData = new FormData();
            
            formData.append('userContext', JSON.stringify(userContext));
            formData.append('folderId', this.currentEditFolder.id);
            formData.append('cover', file);
            
            const response = await fetch('/api/character-manager/upload-folder-cover-temp', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                
                this.currentEditFolder.tempCoverFile = result.tempCoverFile;
                this.currentEditFolder.coverThumbnail = result.coverThumbnail;
                delete this.currentEditFolder.cover; // Remove any old base64
                
                this.updateFolderCoverPreview(result.coverThumbnail);
                showToast('success', 'Folder cover uploaded');
            } else {
                throw new Error('Failed to upload folder cover');
            }
            
        } catch (error) {
            console.error('Error uploading folder cover:', error);
            showToast('error', 'Failed to upload folder cover');
        }
    }

    // Remove folder cover
    removeFolderCover() {
        if (this.currentEditFolder) {
            this.currentEditFolder.coverFile = null;
            this.currentEditFolder.coverThumbnail = null;
            delete this.currentEditFolder.tempCoverFile;
            delete this.currentEditFolder.cover;
            this.updateFolderCoverPreview(null);
        }
    }

    // Save folder edit
    saveFolderEdit() {
        if (!this.currentEditFolder) return;
        
        const newName = this.elements.folderEditName.value.trim();
        if (!newName) {
            showToast('error', 'Folder name is required');
            return;
        }
        
        // Check for duplicate names (excluding current folder)
        if (this.folders.some(f => f.id !== this.currentEditFolder.id && f.name.toLowerCase() === newName.toLowerCase())) {
            showToast('error', 'Folder name already exists');
            return;
        }
        
        this.currentEditFolder.name = newName;
        this.populateFoldersDisplay();
        this.updateFolderFilter();
        
        // Refresh folder view if currently shown
        if (this.currentView === 'folder') {
            this.refreshCharacterGrid();
        }
        
        this.closeFolderEditModal();
        showToast('success', `Folder "${newName}" updated`);
    }

    renameFolder(folderId) {
        // This function is replaced by editFolder
        this.editFolder(folderId);
    }

    deleteFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;
        
        const charactersInFolder = this.characters.filter(c => c.folderId === folderId);
        let confirmMessage = `Are you sure you want to delete the folder "${folder.name}"?`;
        
        if (charactersInFolder.length > 0) {
            confirmMessage += `\n\n${charactersInFolder.length} character(s) will be moved to "No Folder".`;
        }
        
        if (!confirm(confirmMessage)) return;
        
        // Remove folder assignment from characters
        charactersInFolder.forEach(character => {
            character.folderId = null;
        });
        
        // Remove folder
        const index = this.folders.findIndex(f => f.id === folderId);
        if (index >= 0) {
            this.folders.splice(index, 1);
        }
        
        this.populateFoldersDisplay();
        this.updateFolderFilter();
        this.refreshCharacterGrid();
        showToast('success', `Deleted folder "${folder.name}"`);
    }

    updateFolderFilter() {
        const currentValue = this.elements.folderFilter.value;
        
        // Clear existing options except default ones
        this.elements.folderFilter.innerHTML = `
            <option value="">All Characters</option>
            <option value="unfoldered">No Folder</option>
        `;
        
        // Add folder options
        this.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.name;
            this.elements.folderFilter.appendChild(option);
        });
        
        // Restore previous selection if still valid
        if (currentValue && (currentValue === 'unfoldered' || this.folders.some(f => f.id === currentValue))) {
            this.elements.folderFilter.value = currentValue;
        }
    }

    populateFolderDropdown() {
        // Clear existing options
        this.elements.editFolder.innerHTML = '<option value="">No Folder</option>';
        
        // Add folder options
        this.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.name;
            this.elements.editFolder.appendChild(option);
        });
    }

    // Project Management
    async refreshProjects() {
        if (!this.userSessionManager || this.userSessionManager.isGuest) {
            this.updateProjectDropdown([]);
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/projects', {
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

    handleProjectSelection() {
        this.selectedProject = this.elements.projectDropdown.value || null;
        this.updateProjectButtonState();
    }

    updateProjectButtonState() {
        const loadBtn = this.elements.loadProjectBtn;
        const isLoggedIn = this.userSessionManager?.isLoggedIn();
        
        if (!isLoggedIn) {
            loadBtn.disabled = true;
            loadBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
            loadBtn.title = "Load Project";
            return;
        }
        
        if (!this.selectedProject) {
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-circle-plus"></i>';
            loadBtn.title = "New Project";
            return;
        }
        
        if (this.selectedProject === this.currentProject) {
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-trash"></i>';
            loadBtn.title = "Delete Project";
            return;
        }
        
        loadBtn.disabled = false;
        loadBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
        loadBtn.title = "Load Project";
    }

    // Save character
    async saveProject() {
        if (this.userSessionManager?.isGuest !== false) {
            this.authUI?.showLoginModal();
            return;
        }
        
        if (this.characters.length === 0) {
            showToast('warning', 'No characters to save');
            return;
        }
        
        const projectName = this.currentProject || prompt('Enter project name:');
        if (!projectName) return;
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/save-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName,
                    characters: this.characters,
                    folders: this.folders,
                    viewState: {
                        currentView: this.currentView,
                        selectedFolder: this.selectedFolder,
                        selectedCharacterIds: Array.from(this.selectedCharacterIds)
                    }
                })
            });
            
            if (response.ok) {
                this.currentProject = projectName;
                this.selectedProject = projectName;
                await this.refreshProjects();
                this.elements.projectDropdown.value = projectName;
                this.updateProjectButtonState();
                await this.updateTotalCharacterCount();
                showToast('success', `Project "${projectName}" saved`);
                if (this.userSessionManager) {
                    this.userSessionManager.setLastProject(projectName);
                }
            } else {
                throw new Error('Failed to save project');
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast('error', 'Failed to save project');
        }
    }

    async handleProjectButton() {
        const isLoggedIn = this.userSessionManager?.isLoggedIn();
        
        if (!isLoggedIn) {
            this.authUI?.showLoginModal();
            return;
        }
        
        if (!this.selectedProject) {
            this.createNewProject();
            return;
        }
        
        if (this.selectedProject === this.currentProject) {
            await this.deleteProject();
        } else {
            await this.loadProject();
        }
    }

    createNewProject() {
        this.currentProject = null;
        this.characters = [];
        this.folders = [];
        this.currentView = 'grid';
        this.selectedFolder = null;
        this.selectedCharacterIds.clear();
        this.lastSelectedId = null;
        this.pendingImport = null; 
        
        // Update view buttons
        this.elements.gridViewBtn.classList.toggle('active', this.currentView === 'grid');
        this.elements.folderViewBtn.classList.toggle('active', this.currentView === 'folder');
        
        this.refreshCharacterGrid();
        this.updateFolderFilter();
        this.updateButtonStates();
        this.updateProjectButtonState();
        this.updateBulkActionControls();
        showToast('info', 'Started new project');
    }

    async loadProject() {
        if (!this.selectedProject) return;
        
        this.pendingImport = null;
        
        // Clean up any temp folder data
        try {
            const userContext = this.userSessionManager.getUserContext();
            await fetch('/api/character-manager/cleanup-temp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
        } catch (e) {
            console.warn('Failed to cleanup temp:', e);
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/load-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    projectName: this.selectedProject
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.characters = data.characters || [];
                this.folders = data.folders || [];
                
                // Restore view state
                if (data.viewState) {
                    this.currentView = data.viewState.currentView || 'grid';
                    this.selectedFolder = data.viewState.selectedFolder || null;
                    this.selectedCharacterIds = new Set(data.viewState.selectedCharacterIds || []);
                    this.lastSelectedId = this.selectedCharacterIds.size > 0 ? 
                        Array.from(this.selectedCharacterIds)[0] : null;
                } else {
                    // Default values for older projects
                    this.currentView = 'grid';
                    this.selectedFolder = null;
                    this.selectedCharacterIds.clear();
                    this.lastSelectedId = null;
                }
                
                // Update view buttons
                this.elements.gridViewBtn.classList.toggle('active', this.currentView === 'grid');
                this.elements.folderViewBtn.classList.toggle('active', this.currentView === 'folder');
                
                this.currentProject = this.selectedProject;
                this.updateAllTags();
                this.refreshCharacterGrid();
                this.updateTotalCharacterCount();
                this.updateFolderFilter();
                this.updateProjectButtonState();
                this.updateButtonStates();
                this.updateBulkActionControls();
                showToast('success', `Project "${this.selectedProject}" loaded`);
                // Add this:
                if (this.userSessionManager) {
                    this.userSessionManager.setLastProject(this.selectedProject);
                }
            } else {
                throw new Error('Failed to load project');
            }
        } catch (error) {
            console.error('Load error:', error);
            showToast('error', 'Failed to load project');
        }
    }

    async deleteProject() {
        if (!this.currentProject) return;
        
        if (!confirm(`Are you sure you want to delete project "${this.currentProject}"? This cannot be undone.`)) {
            return;
        }
        
        try {
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/character-manager/delete-project', {
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
                
                this.characters = [];
                this.folders = [];
                this.refreshCharacterGrid();
                this.updateFolderFilter();
                
                await this.refreshProjects();
                this.updateProjectButtonState();
                this.updateButtonStates();
                await this.updateTotalCharacterCount();
                
                showToast('success', `Project "${deletedProject}" deleted`);
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showToast('error', 'Failed to delete project');
        }
    }

    async updateTotalCharacterCount() {
        // Show current project character count instead of server total
        this.elements.totalCharacterCount.textContent = this.characters.length;
    }

    updateButtonStates() {
        const hasCharacters = this.characters.length > 0;
        const isLoggedIn = this.userSessionManager?.isLoggedIn();
        
        this.elements.saveProjectBtn.disabled = !hasCharacters || !isLoggedIn;
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
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
        
        // Check if the project still exists in available projects
        if (!this.availableProjects.includes(lastProject)) {
            showToast('warning', 'Last project no longer exists');
            return;
        }
        
        // Set the dropdown value and trigger load
        this.elements.projectDropdown.value = lastProject;
        this.selectedProject = lastProject; // Explicitly set this
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
            
            // Use the dedicated rename API endpoint
            const renameResponse = await fetch('/api/character-manager/rename-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext,
                    oldName: currentName,
                    newName: trimmedNewName
                })
            });
            
            if (renameResponse.ok) {
                const result = await renameResponse.json();
                
                // Update current project reference
                this.currentProject = result.newProjectName;
                this.selectedProject = result.newProjectName;
                
                // Refresh projects and update UI
                await this.refreshProjects();
                this.elements.projectDropdown.value = result.newProjectName;
                this.updateProjectButtonState();
                await this.updateTotalCharacterCount();
                
                // Update last project
                if (this.userSessionManager) {
                    this.userSessionManager.setLastProject(result.newProjectName);
                }
                
                showToast('success', `Project renamed to "${result.newProjectName}"`);
                
            } else {
                const error = await renameResponse.json();
                throw new Error(error.error || 'Failed to rename project');
            }
            
        } catch (error) {
            console.error('Error renaming project:', error);
            showToast('error', `Failed to rename project: ${error.message}`);
        }
    }

    // Toggle tags input visibility
    toggleTagsInput() {
        const tagsInputArea = document.getElementById('tags-input-area');
        const tagsToggle = document.getElementById('tags-toggle');
        
        if (tagsInputArea.classList.contains('collapsed')) {
            tagsInputArea.classList.remove('collapsed');
            tagsToggle.classList.add('expanded');
        } else {
            tagsInputArea.classList.add('collapsed');
            tagsToggle.classList.remove('expanded');
        }
    }
}

// Toast notification system (reuse from extractor)
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
function initializeCharacterContextMenu() {
    const navAvatarImg = document.getElementById('nav-avatar-img');
    const contextMenu = document.getElementById('character-context-menu');
    const logoutOption = document.getElementById('character-logout-option');

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
    window.app = new CharacterManagerApp();
    window.app.init();
});

// Make toggleTagsInput globally accessible for onclick handler
window.toggleTagsInput = function() {
    if (window.app) {
        window.app.toggleTagsInput();
    }
};

// Export for global access
window.showToast = showToast;