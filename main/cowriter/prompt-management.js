// Clean CoWriter Prompt Manager - Only handles dynamic content

class CoWriterPromptManager {
    constructor(coWriterManager) {
        this.coWriter = coWriterManager;
        this.defaultPrompts = {};
        this.customPrompts = {
            main: [],
            tones: [],
            styles: [],
            templates: [],
            quickPrompts: []
        };
        this.activeSelections = {
            main: 'default'
        };
        this.isInitialized = false;
        this.currentEditingPrompt = null;
        
        this.initialize();
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            await this.loadDefaultPrompts();
            await this.loadCustomPrompts();
            await this.loadActiveSelections();
            this.setupEventListeners();
            this.populateAllContent();
            
            this.isInitialized = true;
            console.log('✅ Clean CoWriter Prompt Manager initialized');
        } catch (error) {
            console.error('Error initializing prompt manager:', error);
        }
    }

    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.prompt-tab')) {
                const tab = e.target.closest('.prompt-tab');
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            }
        });

        // Main prompt controls
        this.setupMainPromptListeners();
        
        // Add prompt buttons
        this.setupAddPromptListeners();
        
        // Card action buttons (edit/delete)
        this.setupCardActionListeners();
        
        // Custom prompt modal
        this.setupModalListeners();
    }

    setupMainPromptListeners() {
        // Main prompt dropdown change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'main-prompt-dropdown') {
                this.handleMainPromptSelection(e.target.value);
            }
        });

        // Main prompt action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-main-prompt')) {
                this.addMainPrompt();
            }
            if (e.target.closest('#edit-main-prompt')) {
                this.editMainPrompt();
            }
            if (e.target.closest('#delete-main-prompt')) {
                this.deleteMainPrompt();
            }
        });

        // Auto-save main prompt textarea
        document.addEventListener('input', (e) => {
            if (e.target.id === 'main-prompt-text') {
                this.scheduleMainPromptSave();
            }
        });
    }

    setupAddPromptListeners() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-add-prompt');
            if (!button) return;

            const buttonId = button.id;
            const type = this.getTypeFromButtonId(buttonId);
            if (type) {
                this.addCustomPrompt(type);
            }
        });
    }

    setupCardActionListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-card-action')) {
                const button = e.target.closest('.btn-card-action');
                const card = button.closest('.prompt-card');
                const promptId = card.dataset.promptId;
                const type = card.dataset.type;

                if (button.classList.contains('edit')) {
                    this.editCustomPrompt(type, promptId);
                } else if (button.classList.contains('delete')) {
                    this.deleteCustomPrompt(type, promptId);
                }
            }
        });
    }

    setupModalListeners() {
        // Save custom prompt
        document.addEventListener('click', (e) => {
            if (e.target.closest('#save-custom-prompt')) {
                this.saveCustomPromptFromModal();
            }
            if (e.target.closest('#cancel-custom-prompt')) {
                this.closeCustomPromptModal();
            }
            if (e.target.closest('#close-custom-prompt-edit')) {
                this.closeCustomPromptModal();
            }
        });

        // Close modal on background click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'custom-prompt-edit-modal') {
                this.closeCustomPromptModal();
            }
        });
    }

    // =============================================================================
    // TAB SWITCHING
    // =============================================================================

    switchTab(tabName) {
        // Remove active from all tabs and content
        document.querySelectorAll('.prompt-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.prompt-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activate selected tab and content
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(tabName);

        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeContent.classList.add('active');
        }
    }

    // =============================================================================
    // CONTENT POPULATION (Only dynamic parts)
    // =============================================================================

    populateAllContent() {
        this.populateMainPromptDropdown();
        this.updateMainPromptDisplay();
        this.populateTonesGrid();
        this.populateStylesGrid();
        this.populateTemplatesGrid();
        this.populateQuickPromptsGrid();
    }

    populateMainPromptDropdown() {
        const dropdown = document.getElementById('main-prompt-dropdown');
        if (!dropdown) return;

        const allMainPrompts = this.getAllPromptsForType('main');
        
        dropdown.innerHTML = '';
        allMainPrompts.forEach(prompt => {
            const option = document.createElement('option');
            option.value = prompt.id;
            option.textContent = prompt.name;
            dropdown.appendChild(option);
        });

        // Set current selection
        dropdown.value = this.activeSelections.main;
        this.updateMainPromptControls();
    }

    updateMainPromptDisplay() {
        const textarea = document.getElementById('main-prompt-text');
        if (!textarea) return;

        const activePrompt = this.getActiveMainPrompt();
        if (activePrompt) {
            textarea.value = activePrompt.content;
            textarea.readOnly = activePrompt.isDefault;
        }
    }

    updateMainPromptControls() {
        const editBtn = document.getElementById('edit-main-prompt');
        const deleteBtn = document.getElementById('delete-main-prompt');
        const textarea = document.getElementById('main-prompt-text');

        const isDefault = this.activeSelections.main === 'default';

        if (editBtn) editBtn.disabled = isDefault;
        if (deleteBtn) deleteBtn.disabled = isDefault;
        if (textarea) textarea.readOnly = isDefault;
    }

    populateTonesGrid() {
        this.populateCustomPromptsGrid('tones');
    }

    populateStylesGrid() {
        this.populateCustomPromptsGrid('styles');
    }

    populateTemplatesGrid() {
        this.populateCustomPromptsGrid('templates');
    }

    populateQuickPromptsGrid() {
        this.populateCustomPromptsGrid('quickPrompts');
    }

    populateCustomPromptsGrid(type) {
        const gridId = type === 'quickPrompts' ? 'quick-prompts-list' : `${type}-list`;
        const emptyId = type === 'quickPrompts' ? 'quick-prompts-empty' : `${type}-empty`;
        
        const grid = document.getElementById(gridId);
        const emptyState = document.getElementById(emptyId);
        
        if (!grid) return;

        const prompts = this.customPrompts[type] || [];

        if (prompts.length === 0) {
            grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'flex';
        } else {
            grid.style.display = 'grid';
            if (emptyState) emptyState.style.display = 'none';
            
            // Populate grid
            grid.innerHTML = '';
            prompts.forEach(prompt => {
                const card = this.createPromptCard(prompt, type);
                grid.appendChild(card);
            });
        }
    }

    createPromptCard(prompt, type) {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.dataset.promptId = prompt.id;
        card.dataset.type = type;

        const truncatedContent = prompt.content.length > 100 
            ? prompt.content.substring(0, 100) + '...' 
            : prompt.content;

        const date = new Date(prompt.lastModified || prompt.created).toLocaleDateString();

        card.innerHTML = `
            <div class="prompt-card-header">
                <h5 class="prompt-card-title">${this.escapeHtml(prompt.name)}</h5>
                <div class="prompt-card-actions">
                    <button class="btn-card-action edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-card-action delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="prompt-card-preview">${this.escapeHtml(truncatedContent)}</div>
            <div class="prompt-card-meta">Modified: ${date}</div>
        `;

        return card;
    }

    // =============================================================================
    // MAIN PROMPT OPERATIONS
    // =============================================================================

    async handleMainPromptSelection(promptId) {
        this.activeSelections.main = promptId;
        await this.saveActiveSelections(); // This should now auto-save to server
        this.updateMainPromptDisplay();
        this.updateMainPromptControls();
        
        console.log(`Main prompt changed to: ${promptId}`);
    }

    async addMainPrompt() {
        const name = prompt('Enter name for new main prompt:');
        if (!name || !name.trim()) return;

        const promptData = {
            id: this.generatePromptId(),
            name: name.trim(),
            type: 'main',
            content: this.defaultPrompts.mainPrompt || 'You are a helpful creative writing assistant.',
            created: Date.now(),
            lastModified: Date.now()
        };

        const success = await this.saveCustomPrompt(promptData);
        if (success) {
            this.customPrompts.main.push(promptData);
            this.activeSelections.main = promptData.id;
            await this.saveActiveSelections(); // This will now auto-save to server
            this.populateMainPromptDropdown();
            this.updateMainPromptDisplay();
            this.coWriter.showToast(`Created "${name}"`, 'success');
        }
    }

    editMainPrompt() {
        if (this.activeSelections.main === 'default') return;
        
        const prompt = this.customPrompts.main.find(p => p.id === this.activeSelections.main);
        if (prompt) {
            this.showEditPromptModal(prompt, 'main');
        }
    }

    async deleteMainPrompt() {
        if (this.activeSelections.main === 'default') return;
        
        const prompt = this.customPrompts.main.find(p => p.id === this.activeSelections.main);
        if (!prompt) return;

        if (!confirm(`Delete "${prompt.name}"? This cannot be undone.`)) return;

        const success = await this.deleteCustomPromptFromServer(prompt.id);
        if (success) {
            this.customPrompts.main = this.customPrompts.main.filter(p => p.id !== prompt.id);
            this.activeSelections.main = 'default';
            await this.saveActiveSelections();
            this.populateMainPromptDropdown();
            this.updateMainPromptDisplay();
            this.coWriter.showToast(`Deleted "${prompt.name}"`, 'info');
        }
    }

    scheduleMainPromptSave() {
        if (this.mainPromptSaveTimeout) {
            clearTimeout(this.mainPromptSaveTimeout);
        }
        
        this.mainPromptSaveTimeout = setTimeout(async () => {
            if (this.activeSelections.main !== 'default') {
                const textarea = document.getElementById('main-prompt-text');
                if (textarea) {
                    const prompt = this.customPrompts.main.find(p => p.id === this.activeSelections.main);
                    if (prompt && prompt.content !== textarea.value) {
                        prompt.content = textarea.value;
                        prompt.lastModified = Date.now();
                        await this.saveCustomPrompt(prompt);
                        
                        // ALSO trigger settings auto-save to persist the selection - ADD THIS
                        if (this.coWriter.autoSaveSettings) {
                            this.coWriter.autoSaveSettings();
                        }
                    }
                }
            }
        }, 2000);
    }

    // =============================================================================
    // CUSTOM PROMPT OPERATIONS
    // =============================================================================

    async addCustomPrompt(type) {
        const result = await this.showAddNameModal(type);
        if (!result) return;
        
        const { name, description } = result;

        const promptData = {
            id: this.generatePromptId(),
            name: name.trim(),
            type: type,
            content: this.getDefaultContentForType(type),
            created: Date.now(),
            lastModified: Date.now()
        };

        // For templates, add description if provided
        if (type === 'templates' && description) {
            promptData.description = description.trim();
        }

        const success = await this.saveCustomPrompt(promptData);
        if (success) {
            this.customPrompts[type].push(promptData);
            this.populateCustomPromptsGrid(type);
            this.refreshCoWriterDropdowns();
            this.coWriter.showToast(`Created "${name}"`, 'success');
        }
    }

    showAddNameModal(type) {
        return new Promise((resolve) => {
            const modal = document.getElementById('add-name-modal');
            const title = document.getElementById('add-name-modal-title');
            const nameInput = document.getElementById('new-prompt-name');
            const descriptionGroup = document.getElementById('new-template-description-group');
            const descriptionInput = document.getElementById('new-template-description');
            
            const singularName = this.getTypeSingularName(type);
            title.textContent = `Add New ${singularName}`;
            nameInput.value = '';
            descriptionInput.value = '';
            
            // Show description field only for templates
            if (type === 'templates') {
                descriptionGroup.style.display = 'block';
            } else {
                descriptionGroup.style.display = 'none';
            }
            
            modal.style.display = 'flex';
            nameInput.focus();
            
            // Handle confirm
            const handleConfirm = () => {
                const name = nameInput.value.trim();
                if (!name) {
                    this.coWriter.showToast('Please enter a name', 'warning');
                    nameInput.focus();
                    return;
                }
                
                const description = descriptionInput.value.trim();
                cleanup();
                resolve({ name, description });
            };
            
            // Handle cancel
            const handleCancel = () => {
                cleanup();
                resolve(null);
            };
            
            // Event listeners
            const confirmBtn = document.getElementById('confirm-add-name');
            const cancelBtn = document.getElementById('cancel-add-name');
            const closeBtn = document.getElementById('close-add-name-modal');
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            closeBtn.addEventListener('click', handleCancel);
            
            // Enter key to confirm
            const handleKeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirm();
                } else if (e.key === 'Escape') {
                    handleCancel();
                }
            };
            
            modal.addEventListener('keydown', handleKeydown);
            
            // Close on overlay click
            const handleOverlayClick = (e) => {
                if (e.target === modal) {
                    handleCancel();
                }
            };
            
            modal.addEventListener('click', handleOverlayClick);
            
            // Cleanup function
            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
                closeBtn.removeEventListener('click', handleCancel);
                modal.removeEventListener('keydown', handleKeydown);
                modal.removeEventListener('click', handleOverlayClick);
                modal.style.display = 'none';
            };
        });
    }

    editCustomPrompt(type, promptId) {
        const prompt = this.customPrompts[type].find(p => p.id === promptId);
        if (prompt) {
            this.showEditPromptModal(prompt, type);
        }
    }

    async deleteCustomPrompt(type, promptId) {
        const prompt = this.customPrompts[type].find(p => p.id === promptId);
        if (!prompt) return;

        if (!confirm(`Delete "${prompt.name}"? This cannot be undone.`)) return;

        const success = await this.deleteCustomPromptFromServer(promptId);
        if (success) {
            this.customPrompts[type] = this.customPrompts[type].filter(p => p.id !== promptId);
            this.populateCustomPromptsGrid(type);
            this.refreshCoWriterDropdowns();
            this.coWriter.showToast(`Deleted "${prompt.name}"`, 'info');
        }
    }

    // =============================================================================
    // MODAL OPERATIONS
    // =============================================================================

    showEditPromptModal(prompt, type) {
        const modal = document.getElementById('custom-prompt-edit-modal');
        const titleElement = document.getElementById('custom-prompt-modal-title');
        const nameInput = document.getElementById('custom-prompt-name');
        const contentTextarea = document.getElementById('custom-prompt-content');
        const descriptionGroup = document.getElementById('template-description-group');
        const descriptionInput = document.getElementById('template-description');
        
        if (!modal) {
            this.coWriter.showToast('Edit modal not found', 'error');
            return;
        }
        
        // Set up modal
        titleElement.textContent = `Edit ${this.getTypeSingularName(type)}`;
        nameInput.value = prompt.name;
        contentTextarea.value = prompt.content;
        
        // Show description field for templates
        if (type === 'templates') {
            descriptionGroup.style.display = 'block';
            descriptionInput.value = prompt.description || '';
        } else {
            descriptionGroup.style.display = 'none';
        }
        
        // Store editing info
        this.currentEditingPrompt = { ...prompt, type };
        
        // Show modal
        modal.style.display = 'flex';
        nameInput.focus();
    }

    async saveCustomPromptFromModal() {
        const nameInput = document.getElementById('custom-prompt-name');
        const contentTextarea = document.getElementById('custom-prompt-content');
        const descriptionInput = document.getElementById('template-description');
        
        const name = nameInput.value.trim();
        const content = contentTextarea.value.trim();
        const description = descriptionInput.value.trim();
        
        if (!name || !content) {
            this.coWriter.showToast('Please fill in both name and content', 'warning');
            return;
        }
        
        if (!this.currentEditingPrompt) {
            this.coWriter.showToast('No prompt selected for editing', 'error');
            return;
        }

        // Update the prompt
        const { type } = this.currentEditingPrompt;
        const prompt = this.customPrompts[type].find(p => p.id === this.currentEditingPrompt.id);
        
        if (prompt) {
            prompt.name = name;
            prompt.content = content;
            if (type === 'templates') {
                prompt.description = description;
            }
            prompt.lastModified = Date.now();
            
            const success = await this.saveCustomPrompt(prompt);
            if (success) {
                if (type === 'main') {
                    this.populateMainPromptDropdown();
                    this.updateMainPromptDisplay();
                } else {
                    this.populateCustomPromptsGrid(type);
                }
                this.refreshCoWriterDropdowns();
                this.closeCustomPromptModal();
                this.coWriter.showToast(`Updated "${name}"`, 'success');
            }
        }
    }

    closeCustomPromptModal() {
        const modal = document.getElementById('custom-prompt-edit-modal');
        if (modal) {
            modal.style.display = 'none';
            this.currentEditingPrompt = null;
        }
    }

    // =============================================================================
    // DATA LOADING & SAVING
    // =============================================================================

    async loadDefaultPrompts() {
        try {
            const response = await fetch('/api/cowriter/prompts/defaults');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.defaultPrompts = result.prompts;
                    console.log('✅ Loaded default prompts');
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading default prompts:', error);
        }
        
        // Fallback
        this.defaultPrompts = this.getFallbackDefaults();
    }

    async loadCustomPrompts() {
        if (!this.coWriter.isUserLoggedIn()) {
            this.customPrompts = {
                main: [], tones: [], styles: [], templates: [], quickPrompts: []
            };
            return;
        }

        try {
            const response = await fetch('/api/cowriter/prompts/custom/all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.coWriter.getUserContext()
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Organize by type
                    this.customPrompts = {
                        main: [], tones: [], styles: [], templates: [], quickPrompts: []
                    };

                    result.customPrompts.forEach(prompt => {
                        if (this.customPrompts[prompt.type]) {
                            this.customPrompts[prompt.type].push(prompt);
                        }
                    });

                    console.log('✅ Loaded custom prompts');
                }
            }
        } catch (error) {
            console.error('Error loading custom prompts:', error);
        }
    }

    async loadActiveSelections() {
        // Make sure settings are loaded first
        if (this.coWriter.settings.activeMainPrompt) {
            this.activeSelections.main = this.coWriter.settings.activeMainPrompt;
        } else {
            // Default to 'default' if nothing is saved
            this.activeSelections.main = 'default';
        }
        
        console.log(`Loaded active main prompt: ${this.activeSelections.main}`);
    }

    async saveActiveSelections() {
        this.activeSelections.main = this.activeSelections.main;
        this.coWriter.settings.activeMainPrompt = this.activeSelections.main;
        
        // AUTO-SAVE to server
        if (this.coWriter.autoSaveSettings) {
            this.coWriter.autoSaveSettings();
        }
    }

    async saveCustomPrompt(promptData) {
        if (!this.coWriter.isUserLoggedIn()) {
            this.coWriter.showToast('Please log in to save custom prompts', 'warning');
            return false;
        }

        try {
            const response = await fetch('/api/cowriter/prompts/custom/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.coWriter.getUserContext(),
                    promptData: promptData
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                console.log(`✅ Saved custom ${promptData.type} prompt: ${promptData.name}`);
                return true;
            } else {
                throw new Error(result.error || 'Failed to save custom prompt');
            }
        } catch (error) {
            console.error('Error saving custom prompt:', error);
            this.coWriter.showToast('Failed to save custom prompt', 'error');
            return false;
        }
    }

    async deleteCustomPromptFromServer(promptId) {
        if (!this.coWriter.isUserLoggedIn()) return false;

        try {
            const response = await fetch(`/api/cowriter/prompts/custom/${promptId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.coWriter.getUserContext()
                })
            });

            const result = await response.json();
            return response.ok && result.success;
        } catch (error) {
            console.error('Error deleting custom prompt:', error);
            return false;
        }
    }

    // =============================================================================
    // PUBLIC API FOR COWRITER
    // =============================================================================

    getAllPromptsForType(type) {
        const prompts = [];
        
        if (type === 'main') {
            prompts.push({
                id: 'default',
                name: 'Default Main Prompt',
                content: this.defaultPrompts.mainPrompt || '',
                isDefault: true
            });
        } else {
            const defaults = this.getDefaultPromptsForType(type);
            if (defaults) {
                Object.entries(defaults).forEach(([key, content]) => {
                    prompts.push({
                        id: `default_${key}`,
                        name: `Default: ${this.formatPromptName(key)}`,
                        content: content,
                        isDefault: true,
                        key: key
                    });
                });
            }
        }
        
        if (this.customPrompts[type]) {
            this.customPrompts[type].forEach(prompt => {
                prompts.push({
                    ...prompt,
                    isDefault: false
                });
            });
        }
        
        return prompts;
    }

    getActiveMainPrompt() {
        if (this.activeSelections.main === 'default') {
            return {
                id: 'default',
                content: this.defaultPrompts.mainPrompt || '',
                isDefault: true
            };
        }
        
        return this.customPrompts.main.find(p => p.id === this.activeSelections.main);
    }

    getPromptContent(type, selectionId) {
        if (!selectionId || selectionId === 'default') {
            if (type === 'main') {
                return this.defaultPrompts.mainPrompt || '';
            }
            return this.getDefaultPromptsForType(type) || {};
        }
        
        if (selectionId.startsWith('default_')) {
            const key = selectionId.replace('default_', '');
            const defaults = this.getDefaultPromptsForType(type);
            return defaults[key];
        }
        
        const customPrompt = this.customPrompts[type]?.find(p => p.id === selectionId);
        return customPrompt ? customPrompt.content : null;
    }

    refreshCoWriterDropdowns() {
        if (this.coWriter.refreshDropdowns) {
            this.coWriter.refreshDropdowns();
        }
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    getTypeFromButtonId(buttonId) {
        const typeMap = {
            'add-tone': 'tones',
            'add-style': 'styles',
            'add-template': 'templates',
            'add-quick-prompt': 'quickPrompts'
        };
        return typeMap[buttonId];
    }

    getTypeSingularName(type) {
        const names = {
            main: 'Main Prompt',
            tones: 'Tone',
            styles: 'Style',
            templates: 'Template',
            quickPrompts: 'Quick Prompt'
        };
        return names[type] || type;
    }

    getDefaultPromptsForType(type) {
        return this.defaultPrompts[type] || {};
    }

    getDefaultContentForType(type) {
        switch (type) {
            case 'main':
                return this.defaultPrompts.mainPrompt || 'You are a helpful creative writing assistant.';
            case 'tones':
                return 'Describe your custom conversational tone here. For example: "Be encouraging and supportive, like a mentor helping with creative challenges."';
            case 'styles': 
                return 'Describe your custom writing style here. For example: "Write in a poetic, lyrical style with rich metaphors and imagery."';
            case 'templates':
                return 'Create a template for a specific writing scenario. For example: "Help me develop a character by asking probing questions about their background, motivations, and flaws."';
            case 'quickPrompts':
                return 'Help me with this:';
            default:
                return '';
        }
    }

    formatPromptName(key) {
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }

    generatePromptId() {
        return 'prompt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getFallbackDefaults() {
        return {
            mainPrompt: "You are a helpful creative writing assistant. You work collaboratively with writers to help them develop their ideas, characters, worlds, and stories. Be encouraging, insightful, and creative in your responses.",
            tones: {
                collaborative: "Work together as creative partners, building on each other's ideas",
                encouraging: "Be supportive and motivating, helping overcome creative blocks",
                analytical: "Focus on structure, craft, and technical aspects of writing"
            },
            styles: {
                conversational: "Keep responses natural and friendly, like talking with a writing buddy",
                detailed: "Provide thorough, comprehensive responses with lots of examples",
                concise: "Give focused, to-the-point advice without unnecessary elaboration"
            },
            templates: {
                character_development: "Help me develop this character by exploring their background, motivations, and role in the story",
                world_building: "Guide me through developing this aspect of my fictional world",
                plot_assistance: "Help me work through this plot point or story structure issue"
            },
            quickPrompts: {
                'character-help': 'Help me develop this character:',
                'plot-help': 'Help me work through this plot issue:',
                'world-help': 'Help me develop this aspect of my world:',
                'dialogue-help': 'Help me improve this dialogue:',
                'scene-help': 'Help me write this scene:'
            }
        };
    }

    // User session handlers
    onUserLoggedIn() {
        this.loadCustomPrompts().then(() => {
            this.populateAllContent();
            this.refreshCoWriterDropdowns();
        });
    }

    onUserLoggedOut() {
        this.customPrompts = {
            main: [], tones: [], styles: [], templates: [], quickPrompts: []
        };
        this.activeSelections.main = 'default';
        this.populateAllContent();
        this.refreshCoWriterDropdowns();
    }
}

// Export for use
window.CoWriterPromptManager = CoWriterPromptManager;