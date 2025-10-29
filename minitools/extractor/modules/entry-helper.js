// Entry Helper - AI-Assisted Lorebook Entry Generation
// Client-side logic

class EntryHelper {
    constructor(extractorApp) {
        this.extractorApp = extractorApp; // Reference to main ExtractorApp
        this.selectedCharacter = null;
        this.characterManagerProjects = [];
        this.availableCharacters = [];
        this.selectedEntriesContext = '';
        this.isGenerating = false;
        
        // DOM elements
        this.elements = {};
        
        this.init();
    }

    init() {
        console.log('🎯 Initializing Entry Helper...');
        this.setupDOMElements();
        this.setupEventListeners();
        this.initializeCollapsibleSections();
        this.loadCharacterManagerProjects();
    }

    setupDOMElements() {
        // Main container
        this.elements.container = document.querySelector('#entry-helper-tab .entry-helper-container');

        // Select All
        this.elements.selectAll = document.getElementById('entry-helper-select-all');
        
        // User prompt
        this.elements.userPromptText = document.getElementById('user-prompt-text');
        
        // Character Manager integration
        this.elements.cmProjectSelect = document.getElementById('cm-project-select');
        this.elements.cmCharacterSelect = document.getElementById('cm-character-select');
        this.elements.selectedCharacterDisplay = document.getElementById('selected-character-display');
        this.elements.selectedCharacterName = document.getElementById('selected-character-name');
        this.elements.removeCharacterBtn = document.getElementById('remove-character-btn');
        
        // Selected entries display
        this.elements.selectedEntriesDisplay = document.getElementById('selected-entries-display');
        this.elements.selectedEntriesSummary = document.getElementById('selected-entries-summary');
        this.elements.selectedEntriesText = document.getElementById('selected-entries-text');
        this.elements.noSelectionText = this.elements.selectedEntriesDisplay.querySelector('.eh-no-selection');
        
        // Response settings
        this.elements.maxContextTokens = document.getElementById('max-context-tokens');
        this.elements.maxResponseTokens = document.getElementById('max-response-tokens');
        this.elements.blacklistedWords = document.getElementById('blacklisted-words');
        
        // Generate button and status
        this.elements.generateBtn = document.getElementById('generate-entries-btn');
        this.elements.generationStatus = document.getElementById('generation-status');
        
        // Modal elements
        this.elements.modal = document.getElementById('entry-helper-modal');
        this.elements.modalClose = document.getElementById('entry-helper-modal-close');
        this.elements.generatedEntriesContainer = document.getElementById('generated-entries-container');
    }

    setupEventListeners() {
        // Select all checkbox
        this.elements.selectAll.addEventListener('change', (e) => {
            this.handleSelectAll(e.target.checked);
        });

        // Collapsible section headers
        document.querySelectorAll('.eh-section-header[data-toggle]').forEach(header => {
            header.addEventListener('click', (e) => {
                const targetId = header.getAttribute('data-toggle');
                this.toggleSection(targetId, header);
            });
        });

        // Character Manager dropdowns
        this.elements.cmProjectSelect.addEventListener('change', () => {
            this.handleProjectSelection();
        });

        this.elements.cmCharacterSelect.addEventListener('change', () => {
            this.handleCharacterSelection();
        });

        // Remove character context
        this.elements.removeCharacterBtn.addEventListener('click', () => {
            this.removeCharacterContext();
        });

        // Generate button
        this.elements.generateBtn.addEventListener('click', () => {
            this.generateEntries();
        });

        // Modal close events
        this.elements.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Update generate button state when user prompt changes
        this.elements.userPromptText.addEventListener('input', () => {
            this.updateGenerateButtonState();
        });
    }

   initializeCollapsibleSections() {
        // Initialize all sections as COLLAPSED by default
        const sectionHeaders = document.querySelectorAll('.eh-section-header[data-toggle]');
        sectionHeaders.forEach(header => {
            const targetId = header.getAttribute('data-toggle');
            const targetElement = document.getElementById(targetId);
            const section = header.closest('.eh-section');
            if (targetElement && section) {
                targetElement.classList.add('collapsed');
                section.classList.add('collapsed');
            }
        });
    }

    toggleSection(targetId, headerElement) {
        const targetElement = document.getElementById(targetId);
        const section = headerElement.closest('.eh-section');
        if (!targetElement || !section) return;

        const isCollapsed = section.classList.contains('collapsed');
        
        if (isCollapsed) {
            // ACCORDION BEHAVIOR: Close all other sections first
            const allSections = document.querySelectorAll('.eh-section');
            allSections.forEach(s => {
                if (s !== section) {
                    s.classList.add('collapsed');
                    const content = s.querySelector('.eh-section-content');
                    if (content) content.classList.add('collapsed');
                }
            });
            
            // Open this section
            section.classList.remove('collapsed');
            targetElement.classList.remove('collapsed');
        } else {
            // Close this section
            section.classList.add('collapsed');
            targetElement.classList.add('collapsed');
        }
    }

    async loadCharacterManagerProjects() {
        if (!this.extractorApp.userSessionManager || this.extractorApp.userSessionManager.isGuest) {
            this.elements.cmProjectSelect.disabled = true;
            return;
        }

        try {
            const userContext = this.extractorApp.userSessionManager.getUserContext();
            const response = await fetch('/api/entry-helper/character-manager/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });

            if (response.ok) {
                const projects = await response.json();
                this.characterManagerProjects = projects;
                this.updateProjectDropdown(projects);
                this.elements.cmProjectSelect.disabled = false;
            } else {
                console.warn('Failed to load Character Manager projects');
                this.updateProjectDropdown([]);
            }
        } catch (error) {
            console.warn('Error loading Character Manager projects:', error);
            this.updateProjectDropdown([]);
        }
    }

    updateProjectDropdown(projects) {
        const dropdown = this.elements.cmProjectSelect;
        dropdown.innerHTML = '<option value="">Select a project...</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.displayName;
            dropdown.appendChild(option);
        });
        
        dropdown.disabled = projects.length === 0 || this.extractorApp.userSessionManager?.isGuest;
        
        // Reset character dropdown
        this.elements.cmCharacterSelect.innerHTML = '<option value="">Select a character...</option>';
        this.elements.cmCharacterSelect.disabled = true;
    }

    async handleProjectSelection() {
        const selectedProject = this.elements.cmProjectSelect.value;
        
        if (!selectedProject) {
            this.elements.cmCharacterSelect.innerHTML = '<option value="">Select a character...</option>';
            this.elements.cmCharacterSelect.disabled = true;
            this.availableCharacters = [];
            return;
        }

        try {
            const userContext = this.extractorApp.userSessionManager.getUserContext();
            const response = await fetch('/api/entry-helper/character-manager/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userContext,
                    projectName: selectedProject
                })
            });

            if (response.ok) {
                const characters = await response.json();
                this.availableCharacters = characters;
                this.updateCharacterDropdown(characters);
            } else {
                console.warn('Failed to load characters');
                this.updateCharacterDropdown([]);
            }
        } catch (error) {
            console.warn('Error loading characters:', error);
            this.updateCharacterDropdown([]);
        }
    }

    updateCharacterDropdown(characters) {
        const dropdown = this.elements.cmCharacterSelect;
        dropdown.innerHTML = '<option value="">Select a character...</option>';
        
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character.id;
            option.textContent = character.name;
            dropdown.appendChild(option);
        });
        
        dropdown.disabled = characters.length === 0;
    }

    async handleCharacterSelection() {
        const selectedCharacterId = this.elements.cmCharacterSelect.value;
        
        if (!selectedCharacterId) {
            this.removeCharacterContext();
            return;
        }

        const character = this.availableCharacters.find(c => c.id === selectedCharacterId);
        if (character) {
            this.selectedCharacter = character;
            this.displaySelectedCharacter(character);
            this.updateGenerateButtonState();
        }
    }

    displaySelectedCharacter(character) {
        this.elements.selectedCharacterName.textContent = character.name;
        this.elements.selectedCharacterDisplay.style.display = 'flex';
    }

    removeCharacterContext() {
        this.selectedCharacter = null;
        this.elements.selectedCharacterDisplay.style.display = 'none';
        this.elements.cmCharacterSelect.value = '';
        this.updateGenerateButtonState();
    }

    // Called by main ExtractorApp when entries are selected/deselected
    updateSelectedEntries(selectedEntryIds) {
        // Get the selected entries from the main app
        const selectedEntries = this.extractorApp.entries.filter(entry => 
            selectedEntryIds.has(entry._internalId)
        );

        this.displaySelectedEntries(selectedEntries.length);
        this.updateGenerateButtonState();

        // Store for context generation
        this.selectedEntries = selectedEntries;
    }

    // Handle select all checkbox
    handleSelectAll(checked) {
        // Delegate to bulk actions handler which does the actual work
        if (this.extractorApp.bulkActions) {
            this.extractorApp.bulkActions.handleSelectAll(checked);
        }
        
        // Update the bulk actions checkbox to match
        if (this.extractorApp.elements.bulkSelectAll) {
            this.extractorApp.elements.bulkSelectAll.checked = checked;
            this.extractorApp.elements.bulkSelectAll.indeterminate = false;
        }
    }

    displaySelectedEntries(entryCount) {
        if (entryCount === 0) {
            this.elements.noSelectionText.style.display = 'block';
            this.elements.selectedEntriesSummary.style.display = 'none';
            return;
        }

        this.elements.noSelectionText.style.display = 'none';
        this.elements.selectedEntriesSummary.style.display = 'flex';
        this.elements.selectedEntriesText.textContent = `${entryCount} entries selected`;
    }

    updateGenerateButtonState() {
        const hasPrompt = this.elements.userPromptText.value.trim().length > 0;
        
        this.elements.generateBtn.disabled = !hasPrompt || this.isGenerating;
        
        // Update button text based on context availability
        const hasContext = this.selectedCharacter || (this.selectedEntries && this.selectedEntries.length > 0);
        if (hasContext) {
            this.elements.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Entries';
        } else {
            this.elements.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Entries';
        }
    }

    async generateEntries() {
        if (this.isGenerating) return;

        const userPrompt = this.elements.userPromptText.value.trim();
        if (!userPrompt) {
            showToast('error', 'Please enter a prompt describing what entries you want to create');
            return;
        }

        this.isGenerating = true;
        this.elements.generateBtn.disabled = true;
        this.elements.generationStatus.style.display = 'flex';

        try {
            // Gather context data
            let characterContext = '';
            if (this.selectedCharacter) {
                const contextResponse = await fetch('/api/entry-helper/character-context', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userContext: this.extractorApp.userSessionManager.getUserContext(),
                        characterData: this.selectedCharacter.fullData
                    })
                });
                
                if (contextResponse.ok) {
                    const result = await contextResponse.json();
                    characterContext = result.contextText || '';
                }
            }

            let selectedEntriesContext = '';
            if (this.selectedEntries.length > 0) {
                const entriesResponse = await fetch('/api/entry-helper/selected-entries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userContext: this.extractorApp.userSessionManager.getUserContext(),
                        selectedEntryIds: this.selectedEntries.map(e => e._internalId),
                        allEntries: this.extractorApp.entries
                    })
                });
                
                if (entriesResponse.ok) {
                    const result = await entriesResponse.json();
                    selectedEntriesContext = result.contextText || '';
                }
            }

            // Call LLM generation
            const response = await fetch('/api/entry-helper/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.extractorApp.userSessionManager.getUserContext(),
                    userPrompt: userPrompt,
                    characterContext: characterContext,
                    selectedEntriesContext: selectedEntriesContext,
                    settings: this.getSettings() // USE THE getSettings() METHOD
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('🎯 Generation successful:', result); // Add this debug line
                console.log('📝 Entries received:', result.entries); // Add this debug line
                
                if (result.entries && result.entries.length > 0) {
                    console.log('📊 Showing modal with', result.entries.length, 'entries'); // Add this debug line
                    this.showResultsModal(result.entries);
                    showToast('success', `Generated ${result.entries.length} entries`);
                } else {
                    console.log('⚠️ No entries in result'); // Add this debug line
                    showToast('warning', 'No valid entries were generated. Try adjusting your prompt.');
                }
            } else {
                console.log('❌ Response not ok:', result); // Add this debug line
                throw new Error(result.error || 'Failed to generate entries');
            }

        } catch (error) {
            console.error('Error generating entries:', error);
            
            let errorMessage = 'Failed to generate entries. ';
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key in CoWriter settings.';
            } else if (error.message.includes('provider')) {
                errorMessage += 'Please configure your LLM provider in CoWriter settings.';
            } else {
                errorMessage += error.message;
            }
            
            showToast('error', errorMessage);
            
        } finally {
            this.isGenerating = false;
            this.elements.generateBtn.disabled = false;
            this.elements.generationStatus.style.display = 'none';
            this.updateGenerateButtonState();
        }
    }

    showResultsModal(entries) {
        console.log('🔍 showResultsModal called with:', entries); // Add this debug line
        console.log('🔍 Modal element:', this.elements.modal); // Add this debug line
        
        this.renderGeneratedEntries(entries);
        
        console.log('🔍 Setting modal display to flex'); // Add this debug line
        this.elements.modal.style.display = 'flex';
        
        // Add this to verify the modal is actually visible
        setTimeout(() => {
            console.log('🔍 Modal computed style:', window.getComputedStyle(this.elements.modal).display);
        }, 100);
    }

    renderGeneratedEntries(entries) {
        this.elements.generatedEntriesContainer.innerHTML = '';

        entries.forEach((entry, index) => {
            const entryCard = this.createEntryCard(entry, index);
            this.elements.generatedEntriesContainer.appendChild(entryCard);
        });
    }

    createEntryCard(entry, index) {
        const card = document.createElement('div');
        card.className = 'generated-entry-card';
        card.dataset.entryIndex = index;

        const keysHtml = entry.keys.map(key => 
            `<span class="entry-key-tag">${key}</span>`
        ).join('');

        // Debug: Log the content length
        console.log(`🔍 Entry ${index} content length:`, entry.content.length);
        console.log(`🔍 Entry ${index} content:`, entry.content);

        card.innerHTML = `
            <div class="generated-entry-header">
                <h3 class="generated-entry-title">${entry.name}</h3>
                <button class="btn-secondary add-entry-btn" data-entry-index="${index}">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
            <div class="generated-entry-body">
                <div class="generated-entry-keys">
                    <div class="generated-entry-keys-label">Keys:</div>
                    <div class="generated-entry-keys-list">
                        ${keysHtml}
                    </div>
                </div>
                <div class="generated-entry-content">${entry.content}</div>
            </div>
        `;

        // Add event listener for the add button
        const addBtn = card.querySelector('.add-entry-btn');
        addBtn.addEventListener('click', () => {
            this.addEntryToProject(entry, card);
        });

        return card;
    }

    addEntryToProject(entry, cardElement) {
        // Create new entry in the format expected by Extractor
        const newEntry = {
            _internalId: this.extractorApp.nextEntryId++,
            uid: this.extractorApp.nextEntryId - 1,
            key: entry.keys,
            keysecondary: [],
            comment: entry.name,
            content: entry.content,
            constant: false,
            selective: true,
            selectiveLogic: 0,
            addMemo: true,
            order: 100,
            position: 0,
            disable: false,
            excludeRecursion: false,
            probability: 100,
            useProbability: true,
            depth: 4,
            _sourceFile: 'Entry Helper'
        };

        // Add to the main Extractor app
        this.extractorApp.entries.push(newEntry);
        
        // Fix: Call the correct refresh method
        this.extractorApp.refreshEntryList();
        this.extractorApp.updateButtonStates();

        // Mark the card as added
        cardElement.classList.add('entry-added');
        const addBtn = cardElement.querySelector('.add-entry-btn');
        addBtn.disabled = true;
        addBtn.innerHTML = '<i class="fas fa-check"></i> Added';

        showToast('success', `Added "${entry.name}" to project`);
    }

    closeModal() {
        this.elements.modal.style.display = 'none';
    }

    // Public methods called by main ExtractorApp
    onTabActivated() {
        console.log('📝 Entry Helper tab activated');
        
        // Refresh data when tab is activated
        this.loadCharacterManagerProjects();
        
        // Update selected entries from current state
        if (this.extractorApp.selectedEntries) {
            this.updateSelectedEntries(this.extractorApp.selectedEntries);
        }
        
        this.updateGenerateButtonState();
    }

    onTabDeactivated() {
        console.log('📝 Entry Helper tab deactivated');
    }

    // Get current Entry Helper settings
    getSettings() {
        return {
            userPrompt: this.elements.userPromptText.value.trim(),  // ADD THIS LINE
            maxContextTokens: parseInt(this.elements.maxContextTokens.value) || 8000,
            maxResponseTokens: parseInt(this.elements.maxResponseTokens.value) || 2048,
            blacklistedWords: this.elements.blacklistedWords.value.trim()
        };
    }

    // Set Entry Helper settings
    setSettings(settings) {
        if (settings.userPrompt !== undefined) {  // ADD THESE 3 LINES
            this.elements.userPromptText.value = settings.userPrompt;
        }
        if (settings.maxContextTokens !== undefined) {
            this.elements.maxContextTokens.value = settings.maxContextTokens;
        }
        if (settings.maxResponseTokens !== undefined) {
            this.elements.maxResponseTokens.value = settings.maxResponseTokens;
        }
        if (settings.blacklistedWords !== undefined) {
            this.elements.blacklistedWords.value = settings.blacklistedWords;
        }
    }

    // Reset to default settings
    resetToDefaults() {
        this.elements.userPromptText.value = '';  // ADD THIS LINE
        this.elements.maxContextTokens.value = 8000;
        this.elements.maxResponseTokens.value = 2048;
        this.elements.blacklistedWords.value = '';
    }
}

// Export for use in main Extractor app
window.EntryHelper = EntryHelper;