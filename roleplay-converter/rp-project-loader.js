// RP Archiver Project Selection System
// Handles universe/story dropdown selection and loading

class RPProjectLoader {
    constructor() {
        this.currentUniverses = [];
        this.currentStories = [];
        this.userSessionManager = null;
        this.initializationAttempts = 0;
        this.maxInitializationAttempts = 10;
        
        // Initialize when DOM is ready, but wait for user session
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.delayedInitialize());
        } else {
            this.delayedInitialize();
        }
    }
    
    delayedInitialize() {
        // Wait for user session manager to be available and functional
        if (window.userSessionManager) {
            // Try to get user context to verify it's working
            try {
                const testContext = window.userSessionManager.getUserContext();
                if (testContext !== null && testContext !== undefined) {
                    // User session manager is working
                    this.initialize();
                    return;
                }
            } catch (error) {
                // User session manager exists but isn't ready yet
                console.log('⏳ User session manager exists but not ready yet...');
            }
        }
        
        this.initializationAttempts++;
        
        if (this.initializationAttempts < this.maxInitializationAttempts) {
            console.log(`⏳ Waiting for user session manager... (attempt ${this.initializationAttempts}/${this.maxInitializationAttempts})`);
            setTimeout(() => this.delayedInitialize(), 200);
        } else {
            console.log('⚠️ User session manager not ready, initializing in fallback mode');
            this.initializeWithoutUserSession();
        }
    }
    
    initialize() {
        console.log('🚀 Initializing RP Project Loader...');
        
        // Get reference to user session manager
        this.userSessionManager = window.userSessionManager;
        
        // Set up UI
        this.setupUI();
        this.setupEventListeners();
        
        // Initial load of universes
        this.loadUniverses();
        
        console.log('✅ RP Project Loader initialized');
    }
    
    initializeWithoutUserSession() {
        console.log('🚀 Initializing RP Project Loader (fallback mode)...');
        
        // Set up UI
        this.setupUI();
        this.setupEventListeners();
        
        // Show fallback mode immediately
        this.showFallbackMode();
        
        console.log('✅ RP Project Loader initialized in fallback mode');
    }
    
    setupUI() {
        // Find the current import controls
        const importControls = document.querySelector('.nav-import-controls');
        if (!importControls) {
            console.error('❌ Could not find import controls container');
            return;
        }
        
        // Hide the original import button but keep it for fallback
        const originalImportBtn = document.getElementById('import-btn');
        if (originalImportBtn) {
            originalImportBtn.style.display = 'none';
        }
        
        // Create new project selection UI
        const projectUI = document.createElement('div');
        projectUI.className = 'project-selection-controls';
        projectUI.innerHTML = `
            <select id="universe-dropdown" class="universe-select" disabled>
                <option value="">Select Universe...</option>
            </select>
            <select id="story-dropdown" class="story-select" disabled>
                <option value="">Select Story...</option>
            </select>
            <button id="load-project-btn" class="btn-secondary" disabled>
                <i class="fas fa-folder-open"></i> Load
            </button>
        `;
        
        // Insert the new UI
        importControls.appendChild(projectUI);
        
        console.log('✅ Project selection UI created');
    }
    
    setupEventListeners() {
        const universeDropdown = document.getElementById('universe-dropdown');
        const storyDropdown = document.getElementById('story-dropdown');
        const loadBtn = document.getElementById('load-project-btn');
        
        if (universeDropdown) {
            universeDropdown.addEventListener('change', () => this.onUniverseChange());
        }
        
        if (storyDropdown) {
            storyDropdown.addEventListener('change', () => this.onStoryChange());
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.onLoadClick());
        }
        
        console.log('✅ Event listeners set up');
    }
    
    async loadUniverses() {
        if (!this.userSessionManager) {
            console.log('⚠️ No user session manager, skipping universe load');
            this.showFallbackMode();
            return;
        }
        
        try {
            console.log('📁 Loading universes...');
            
            // Additional check to make sure userSessionManager is actually functional
            let userContext;
            try {
                userContext = this.userSessionManager.getUserContext();
                if (!userContext) {
                    throw new Error('getUserContext returned null');
                }
            } catch (contextError) {
                console.log('⚠️ User context not available, showing fallback mode');
                this.showFallbackMode();
                return;
            }
            
            const response = await fetch('/api/roleplay/universes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const universes = await response.json();
            this.currentUniverses = universes;
            
            console.log(`📁 Found ${universes.length} universes`);
            
            this.updateUniverseDropdown();
            
        } catch (error) {
            console.error('❌ Error loading universes:', error);
            this.showFallbackMode();
        }
    }
    
    async loadStories(universeName) {
        if (!this.userSessionManager || !universeName) {
            return;
        }
        
        try {
            console.log(`📄 Loading stories for universe: ${universeName}`);
            
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/roleplay/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, universe: universeName })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const stories = await response.json();
            this.currentStories = stories;
            
            console.log(`📄 Found ${stories.length} stories in ${universeName}`);
            
            this.updateStoryDropdown();
            
        } catch (error) {
            console.error('❌ Error loading stories:', error);
            this.currentStories = [];
            this.updateStoryDropdown();
        }
    }
    
    updateUniverseDropdown() {
        const dropdown = document.getElementById('universe-dropdown');
        if (!dropdown) return;
        
        dropdown.innerHTML = '<option value="">Select Universe...</option>';
        
        if (this.currentUniverses.length === 0) {
            dropdown.disabled = true;
            this.updateLoadButton();
            return;
        }
        
        this.currentUniverses.forEach(universe => {
            const option = document.createElement('option');
            option.value = universe;
            option.textContent = universe;
            dropdown.appendChild(option);
        });
        
        dropdown.disabled = false;
        this.updateLoadButton();
    }
    
    updateStoryDropdown() {
        const dropdown = document.getElementById('story-dropdown');
        if (!dropdown) return;
        
        dropdown.innerHTML = '<option value="">Select Story...</option>';
        
        if (this.currentStories.length === 0) {
            dropdown.disabled = true;
            this.updateLoadButton();
            return;
        }
        
        this.currentStories.forEach(story => {
            const option = document.createElement('option');
            option.value = story.filename;
            // Show filename without extension for cleaner display
            const displayName = story.filename.replace(/\.html?$/i, '');
            option.textContent = displayName;
            dropdown.appendChild(option);
        });
        
        dropdown.disabled = false;
        this.updateLoadButton();
    }
    
    updateLoadButton() {
        const loadBtn = document.getElementById('load-project-btn');
        const universeDropdown = document.getElementById('universe-dropdown');
        const storyDropdown = document.getElementById('story-dropdown');
        
        if (!loadBtn || !universeDropdown || !storyDropdown) return;
        
        const hasValidSelection = universeDropdown.value && storyDropdown.value;
        const hasUniverses = this.currentUniverses.length > 0;
        
        if (hasValidSelection) {
            // Valid project selection
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
            loadBtn.title = `Load ${storyDropdown.value} from ${universeDropdown.value}`;
        } else if (hasUniverses) {
            // Has universes but no valid selection
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-upload"></i>';
            loadBtn.title = 'No selection - click to import file manually';
        } else {
            // No universes at all
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-upload"></i>';
            loadBtn.title = 'No projects found - click to import file manually';
        }
    }
    
    onUniverseChange() {
        const universeDropdown = document.getElementById('universe-dropdown');
        const storyDropdown = document.getElementById('story-dropdown');
        
        if (!universeDropdown || !storyDropdown) return;
        
        const selectedUniverse = universeDropdown.value;
        
        if (selectedUniverse) {
            console.log(`🌌 Universe selected: ${selectedUniverse}`);
            this.loadStories(selectedUniverse);
        } else {
            // Clear story dropdown
            storyDropdown.innerHTML = '<option value="">Select Story...</option>';
            storyDropdown.disabled = true;
            this.currentStories = [];
            this.updateLoadButton();
        }
    }
    
    onStoryChange() {
        console.log('📄 Story selection changed');
        this.updateLoadButton();
    }
    
    async onLoadClick() {
        const universeDropdown = document.getElementById('universe-dropdown');
        const storyDropdown = document.getElementById('story-dropdown');
        
        if (!universeDropdown || !storyDropdown) {
            this.fallbackToManualImport();
            return;
        }
        
        const selectedUniverse = universeDropdown.value;
        const selectedStory = storyDropdown.value;
        
        if (selectedUniverse && selectedStory) {
            // Load the selected project
            await this.loadSelectedProject(selectedUniverse, selectedStory);
        } else {
            // Fall back to manual import
            this.fallbackToManualImport();
        }
    }
    
    async loadSelectedProject(universe, storyFilename) {
        if (!this.userSessionManager) {
            console.error('❌ No user session manager available');
            return;
        }
        
        try {
            console.log(`🚀 Loading project: ${universe}/${storyFilename}`);
            
            const userContext = this.userSessionManager.getUserContext();
            const response = await fetch('/api/roleplay/load-story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userContext, 
                    universe, 
                    storyFilename 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                showToast('success', 'Data imported successfully!');
                console.log(`✅ Successfully loaded ${universe}/${storyFilename}`);
                
                // Use the existing parseImportedHTML function
                if (typeof parseImportedHTML === 'function') {
                    parseImportedHTML(result.content);
                    console.log('✅ Project parsed and loaded into form');
                } else {
                    console.error('❌ parseImportedHTML function not found');
                }
            } else {
                throw new Error(result.error || 'Failed to load project');
            }
            
        } catch (error) {
            console.error('❌ Error loading project:', error);
            showToast('error', 'Error importing data');
            alert(`Failed to load project: ${error.message}`);
        }
    }
    
    fallbackToManualImport() {
        console.log('🔄 Falling back to manual import');
        
        const originalImportFile = document.getElementById('import-file');
        if (originalImportFile) {
            originalImportFile.click();
        } else {
            console.error('❌ Manual import file input not found');
        }
    }
    
    showFallbackMode() {
        console.log('⚠️ Showing fallback mode - manual import only');
        
        const universeDropdown = document.getElementById('universe-dropdown');
        const storyDropdown = document.getElementById('story-dropdown');
        const loadBtn = document.getElementById('load-project-btn');
        
        if (universeDropdown) {
            universeDropdown.disabled = true;
            universeDropdown.innerHTML = '<option value="">No projects found</option>';
        }
        
        if (storyDropdown) {
            storyDropdown.disabled = true;
            storyDropdown.innerHTML = '<option value="">No stories found</option>';
        }
        
        if (loadBtn) {
            loadBtn.disabled = false;
            loadBtn.innerHTML = '<i class="fas fa-upload"></i>';
            loadBtn.title = 'No organized projects found - click to import file manually';
        }
        
        // Clear stored data
        this.currentUniverses = [];
        this.currentStories = [];
    }
    
    // Public method to refresh the project list
    refresh() {
        console.log('🔄 Refreshing project list...');
        
        // Reset initialization state
        this.initializationAttempts = 0;
        
        // Try to reinitialize if user session is now available
        if (window.userSessionManager) {
            try {
                const testContext = window.userSessionManager.getUserContext();
                if (testContext !== null && testContext !== undefined) {
                    console.log('✅ User session now available, reinitializing...');
                    this.userSessionManager = window.userSessionManager;
                    this.loadUniverses();
                    return;
                }
            } catch (error) {
                console.log('⚠️ User session still not ready');
            }
        }
        
        // If we have a user session manager, just reload universes
        if (this.userSessionManager) {
            this.loadUniverses();
        } else {
            console.log('⚠️ Still no user session manager available');
            this.showFallbackMode();
        }
    }
    
    // Public method to get current selection info
    getSelection() {
        const universeDropdown = document.getElementById('universe-dropdown');
        const storyDropdown = document.getElementById('story-dropdown');
        
        return {
            universe: universeDropdown?.value || null,
            story: storyDropdown?.value || null,
            hasValidSelection: !!(universeDropdown?.value && storyDropdown?.value)
        };
    }
}

// Initialize the RP Project Loader
window.rpProjectLoader = new RPProjectLoader();

// Export for use in other scripts
window.RPProjectLoader = RPProjectLoader;

// Global function to manually initialize after user system is ready
window.initializeRPProjectLoader = function() {
    if (window.rpProjectLoader) {
        console.log('🔄 Manual initialization of RP Project Loader requested');
        window.rpProjectLoader.refresh();
    } else {
        console.log('🚀 Creating new RP Project Loader instance');
        window.rpProjectLoader = new RPProjectLoader();
    }
};