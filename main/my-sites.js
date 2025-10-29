// My Sites functionality - Updated for File-Based Auth System with Loading

class MySitesManager {
    constructor() {
        this.sites = [];
        this.currentSort = 'lastModified';
        this.isLoading = false;
        this.showingFavoritesOnly = false;
        this.favorites = new Set();
        this.tags = {};
        this.selectedTags = new Set();
        this.tagFilterMode = 'any';
        
        // ADD these new properties to prevent data loss:
        this.lastValidUserContext = null;
        this.dataLoadAttempts = 0;
        this.maxRetryAttempts = 3;
        this.contextInvalidatedAt = null;
        
        this.initializeEventListeners();
    }

    // Get user context for API calls (compatible with new AuthManager)
    getUserContext() {        
        const currentUser = window.authManager?.getCurrentUser();
        
        // If no current user but we had valid context before, try to preserve it briefly
        if (!currentUser) {
            console.log('   - No current user detected');
            if (this.lastValidUserContext && !this.lastValidUserContext.isGuest) {
                console.log('   - Attempting to preserve last valid context temporarily');
                const now = Date.now();
                if (!this.contextInvalidatedAt) {
                    this.contextInvalidatedAt = now;
                }
                // Give 5 seconds before falling back to guest
                if (now - this.contextInvalidatedAt < 5000) {
                    return this.lastValidUserContext;
                }
            }
            return { isGuest: true };
        }
        
        // Reset invalidation timer if we have a user
        this.contextInvalidatedAt = null;
        
        if (currentUser.isGuest) {
            console.log('   - User is guest, returning guest context');
            this.lastValidUserContext = { isGuest: true };
            return { isGuest: true };
        }        
        
        const context = {
            userId: currentUser.id,
            username: currentUser.username,
            isGuest: false
        };        
        
        // FIXED: More lenient validation - don't immediately fall back to guest
        if (!context.userId || !context.username) {
            console.error('🚨 Invalid user context! Missing userId or username');
            
            // If we had valid context before, try to preserve it temporarily
            if (this.lastValidUserContext && !this.lastValidUserContext.isGuest) {
                console.log('   - Using last valid context while auth resolves');
                return this.lastValidUserContext;
            }
            
            console.log('   - No fallback available, using guest context');
            return { isGuest: true };
        }
        
        // Cache valid context
        this.lastValidUserContext = context;
        return context;
    }

    // Check if user is logged in (updated for new auth system)
    isUserLoggedIn() {
        const currentUser = window.authManager?.getCurrentUser();
        return currentUser && !currentUser.isGuest;
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Existing sort dropdown code...
        const sortSelect = document.getElementById('sites-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortAndRenderSites();
            });
        }

        // Existing favorites button code...
        const favoritesBtn = document.getElementById('favorites-filter-btn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                this.toggleFavoritesFilter();
            });
        }

        // NEW: Tags modal event listeners
        const closeTagsModal = document.getElementById('close-tags-modal');
        if (closeTagsModal) {
            closeTagsModal.addEventListener('click', () => {
                this.closeTagsModal();
            });
        }

        const saveTagsBtn = document.getElementById('save-tags');
        if (saveTagsBtn) {
            saveTagsBtn.addEventListener('click', () => {
                this.saveTagsFromModal();
            });
        }

        const cancelTagsBtn = document.getElementById('cancel-tags');
        if (cancelTagsBtn) {
            cancelTagsBtn.addEventListener('click', () => {
                this.closeTagsModal();
            });
        }

        // Tags label click for ANY/ALL toggle
        const tagsLabel = document.getElementById('tags-label');
        if (tagsLabel) {
            tagsLabel.addEventListener('click', () => {
                this.toggleTagFilterMode();
            });
            tagsLabel.style.cursor = 'pointer';
        }

        // Close modal when clicking outside
        const tagsModal = document.getElementById('tags-modal');
        if (tagsModal) {
            tagsModal.addEventListener('click', (e) => {
                if (e.target === tagsModal) {
                    this.closeTagsModal();
                }
            });
        }
    }

    // Load user's sites with delayed loading state to prevent flash
    async loadUserSites() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Only show loading if operation takes longer than 200ms
        const loadingTimeout = setTimeout(() => {
            this.showLoadingState();
        }, 200);

        try {
            console.log('🏠 loadUserSites called');
            
            // Check if user is logged in (updated for new auth system)
            const currentUser = window.authManager?.getCurrentUser();
            console.log('🏠 currentUser:', currentUser);
            
            if (!currentUser || currentUser.isGuest) {
                console.log('🏠 User not logged in or is guest');
                clearTimeout(loadingTimeout); // Clear loading timeout
                this.showEmptyState('Please log in to view your sites.');
                return;
            }

            const userContext = this.getUserContext();
            console.log('🏠 My Sites: Loading sites for user context:', userContext);
            
            const response = await fetch('/api/user-sites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userContext })
            });

            console.log('🏠 API response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const sites = await response.json();
            console.log('🏠 My Sites: Received sites:', sites);
            this.sites = sites;
            
            // Clear loading timeout since we have results
            clearTimeout(loadingTimeout);
            
            if (sites.length === 0) {
                console.log('🏠 No sites found in API response');
                this.showEmptyState('No sites found. Create a project in Lore Codex to see it here!');
            } else {
                console.log('🏠 Rendering', sites.length, 'sites');
                this.sortAndRenderSites();
            }

        } catch (error) {
            console.error('🏠 Error loading user sites:', error);
            clearTimeout(loadingTimeout); // Clear loading timeout on error
            this.showEmptyState('Error loading sites. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }

    // Show loading state
    showLoadingState() {
        const loading = document.getElementById('sites-loading');
        const empty = document.getElementById('sites-empty');
        const grid = document.getElementById('sites-grid');

        if (loading) loading.style.display = 'flex';
        if (empty) empty.style.display = 'none';
        if (grid) grid.style.display = 'none';
    }

    // Show empty state
    showEmptyState(message = null) {
        const loading = document.getElementById('sites-loading');
        const empty = document.getElementById('sites-empty');
        const grid = document.getElementById('sites-grid');

        if (loading) loading.style.display = 'none';
        if (empty) {
            empty.style.display = 'flex';
            if (message) {
                // Update both title and message for better UX
                const title = empty.querySelector('#empty-state-title');
                const p = empty.querySelector('#empty-state-message');
                
                if (message.includes('log in')) {
                    if (title) title.textContent = 'Login Required';
                    if (p) p.textContent = message;
                } else if (message.includes('No sites found')) {
                    if (title) title.textContent = 'No Sites Found';
                    if (p) p.textContent = message;
                } else {
                    // Generic message update
                    if (p) p.textContent = message;
                }
            }
        }
        if (grid) grid.style.display = 'none';
    }

    sortAndRenderSites() {
        if (!this.sites || this.sites.length === 0) {
            this.showEmptyState();
            return;
        }

        // Filter for favorites if needed
        let sitesToShow = this.showingFavoritesOnly 
            ? this.sites.filter(site => this.isFavorited(site.projectName))
            : this.sites;

        // Filter for tags if any are selected
        if (this.selectedTags.size > 0) {
            sitesToShow = sitesToShow.filter(site => {
                const siteTags = this.getProjectTags(site.projectName);
                const selectedTagsArray = Array.from(this.selectedTags);
                
                if (this.tagFilterMode === 'all') {
                    // ALL mode: site must have ALL selected tags
                    return selectedTagsArray.every(tag => siteTags.includes(tag));
                } else {
                    // ANY mode: site must have at least one selected tag
                    return selectedTagsArray.some(tag => siteTags.includes(tag));
                }
            });
        }

        // Check if showing favorites but none exist, automatically switch back to all sites
        if (this.showingFavoritesOnly && sitesToShow.length === 0 && this.sites.some(site => this.isFavorited(site.projectName))) {
            // Only switch back if we actually have favorites but they're filtered out by tags
            // Don't switch if we genuinely have no favorites
            const allFavorites = this.sites.filter(site => this.isFavorited(site.projectName));
            if (allFavorites.length > 0) {
                this.showingFavoritesOnly = false;
                this.updateFavoriteButton();
                sitesToShow = this.sites;
                
                // Re-apply tag filtering
                if (this.selectedTags.size > 0) {
                    sitesToShow = sitesToShow.filter(site => {
                        const siteTags = this.getProjectTags(site.projectName);
                        const selectedTagsArray = Array.from(this.selectedTags);
                        
                        if (this.tagFilterMode === 'all') {
                            return selectedTagsArray.every(tag => siteTags.includes(tag));
                        } else {
                            return selectedTagsArray.some(tag => siteTags.includes(tag));
                        }
                    });
                }
            }
        }

        // Sort sites based on current sort option
        const sortedSites = [...sitesToShow].sort((a, b) => {
            switch (this.currentSort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                    return new Date(b.created || b.lastModified) - new Date(a.created || a.lastModified);
                case 'lastModified':
                default:
                    return new Date(b.lastModified) - new Date(a.lastModified);
            }
        });

        this.renderSites(sortedSites);
    }

    // Render sites grid
    renderSites(sites) {
        const loading = document.getElementById('sites-loading');
        const empty = document.getElementById('sites-empty');
        const grid = document.getElementById('sites-grid');

        if (loading) loading.style.display = 'none';
        if (empty) empty.style.display = 'none';
        if (grid) {
            grid.style.display = 'grid';
            grid.innerHTML = '';

            sites.forEach(site => {
                const siteCard = this.createSiteCard(site);
                grid.appendChild(siteCard);
            });
        }
    }

    // Create individual site card
    createSiteCard(site) {
        const card = document.createElement('div');
        card.className = 'site-card';
        card.setAttribute('data-project', site.projectName);
        
        // Check if recently updated (within last 7 days)
        const isRecentlyUpdated = this.isRecentlyUpdated(site.lastModified);
        
        // Create preview content
        const previewContent = site.bannerExists 
            ? this.createBannerPreview(site)
            : this.createPlaceholderPreview(site);

        card.innerHTML = `
            <div class="site-preview">
                ${previewContent}
                <div class="site-preview-overlay"></div>
                ${isRecentlyUpdated ? '<div class="recently-updated-badge">Recently Updated</div>' : ''}
            </div>
            <div class="site-info">
                <h3 class="site-title">${this.escapeHtml(site.title)}</h3>
                <p class="site-meta">Updated ${this.formatDate(site.lastModified)}</p>
                <i class="tags-icon fas fa-tags" title="Manage Tags" 
                onclick="window.mySitesManager.openTagsModal('${site.projectName}', event)"></i>
                <i class="export-icon fas fa-download" title="Export Project" 
                onclick="window.mySitesManager.exportProject('${site.projectName}', event)"></i>
                <i class="favorite-star ${this.isFavorited(site.projectName) ? 'favorited fas' : 'far'} fa-star" 
                onclick="window.mySitesManager.toggleFavorite('${site.projectName}', event)"></i>
            </div>
        `;

        // Add click handler to open site with loading
        card.addEventListener('click', () => {
            this.openSiteWithLoading(site);
        });

        return card;
    }

    // NEW: Open site with loading animation
    async openSiteWithLoading(site) {
        console.log('🏠 Opening site with loading:', site.title);
        
        // Set navigation flag in main manager
        if (window.mainManager) {
            window.mainManager.isNavigating = true;
            console.log('🏠 Set navigation flag to true');
        }

        // Show site loading with custom message and icon
        if (window.authManager) {
            const loadingMessage = `Loading ${site.title}...`;
            console.log('🏠 Showing site loading:', loadingMessage);
            window.authManager.showGlobalLoading(loadingMessage, 'fas fa-globe');
            
            // Wait for loading overlay to appear
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Add visual feedback to the clicked card
        const card = document.querySelector(`[data-project="${site.projectName}"]`);
        if (card) {
            card.style.transform = 'scale(0.98)';
            card.style.opacity = '0.8';
        }

        // Wait for better UX (so user can see the loading)
        console.log('🏠 Waiting 2 seconds before navigation...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Navigate to the site
        this.openSite(site);
    }

    // Original open site method (now called by openSiteWithLoading)
    openSite(site) {
        const userContext = this.getUserContext();
        if (!userContext) {
            console.error('No user context available');
            return;
        }

        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const htmlFilename = site.htmlFilename || 'info.html';
        const siteUrl = `/projects/${userPath}/${site.projectName}/${htmlFilename}`;
        
        console.log('🏠 Navigating to site:', siteUrl);
        
        // Navigate to the site
        window.location.href = siteUrl;
    }

    // Create banner preview
    createBannerPreview(site) {
        const bannerUrl = this.getSiteBannerUrl(site);
        return `<img src="${bannerUrl}" alt="${this.escapeHtml(site.title)} Banner" class="site-preview-image" onerror="this.style.display='none'; this.parentElement.querySelector('.site-placeholder').style.display='flex';">
                <div class="site-placeholder" style="display: none;">
                    <i class="fas fa-globe"></i>
                    <div class="site-placeholder-title">${this.escapeHtml(site.title)}</div>
                </div>`;
    }

    // Create placeholder preview
    createPlaceholderPreview(site) {
        return `
            <div class="site-placeholder">
                <i class="fas fa-globe"></i>
                <div class="site-placeholder-title">${this.escapeHtml(site.title)}</div>
            </div>
        `;
    }

    // Get site banner URL
    getSiteBannerUrl(site) {
        if (!site.bannerPath) return '';
        
        const userContext = this.getUserContext();
        if (!userContext) return '';
        
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        return `/projects/${userPath}/${site.projectName}/${site.bannerPath}`;
    }

    // Check if site was updated recently (within 7 days)
    isRecentlyUpdated(lastModified) {
        const now = new Date();
        const updated = new Date(lastModified);
        const diffTime = Math.abs(now - updated);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Enhanced loadFavorites with detailed logging
    async loadFavorites() {        
        const userContext = this.getUserContext();        
        if (userContext.isGuest) {
            console.log('   - Guest user, clearing favorites');
            this.favorites = new Set();
            return;
        }        
        
        try {
            const response = await fetch('/api/user/preferences/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });                   
            
            if (response.ok) {
                const data = await response.json();                
                const favorites = data.preferences?.favorites || [];
                this.favorites = new Set(favorites);
                this.dataLoadAttempts = 0; // Reset retry counter on success
                console.log(`✅ Loaded ${favorites.length} favorites`);
            } else {
                console.error('   - API call failed:', response.status, response.statusText);
                // DON'T clear data immediately - retry instead
                this.dataLoadAttempts++;
                if (this.dataLoadAttempts < this.maxRetryAttempts) {
                    console.log(`   - Retrying favorites load (attempt ${this.dataLoadAttempts}/${this.maxRetryAttempts})`);
                    setTimeout(() => this.loadFavorites(), 2000 * this.dataLoadAttempts);
                    return; // Don't clear data while retrying
                } else {
                    console.error('   - Max retry attempts reached, keeping existing favorites');
                    // Only clear if we have no existing data AND this is a fresh load
                    if (this.favorites.size === 0) {
                        this.favorites = new Set();
                    }
                }
            }
        } catch (error) {
            console.error('🚨 Error loading favorites:', error);
            // DON'T clear data on network errors - retry instead
            this.dataLoadAttempts++;
            if (this.dataLoadAttempts < this.maxRetryAttempts) {
                console.log(`   - Retrying favorites load after error (attempt ${this.dataLoadAttempts}/${this.maxRetryAttempts})`);
                setTimeout(() => this.loadFavorites(), 2000 * this.dataLoadAttempts);
                return; // Don't clear data while retrying
            } else {
                console.error('   - Max retry attempts reached after errors, keeping existing data');
                // Keep existing data rather than clearing
            }
        }
    }

    // Enhanced saveFavorites with detailed logging
    async saveFavorites() {        
        const userContext = this.getUserContext();        
        if (userContext.isGuest) {
            console.log('   - Guest user, skipping save');
            return;
        }        
        const favoritesToSave = Array.from(this.favorites);        
        try {
            const getResponse = await fetch('/api/user/preferences/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });            
            let currentPreferences = {};
            if (getResponse.ok) {
                const data = await getResponse.json();
                currentPreferences = data.preferences || {};
            } else {
                console.warn('   - Could not load current preferences, using empty object');
            }
            
            // Update favorites in preferences
            currentPreferences.favorites = favoritesToSave;            
            const saveResponse = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, preferences: currentPreferences })
            });
            
            if (saveResponse.ok) {
            } else {
                console.error('🚨 Failed to save favorites:', saveResponse.status, saveResponse.statusText);
            }
        } catch (error) {
            console.error('🚨 Error saving favorites:', error);
        }
    }

    // Toggle favorite status
    async toggleFavorite(projectName, event) {
        event.stopPropagation(); // Prevent site card click
        
        if (this.favorites.has(projectName)) {
            this.favorites.delete(projectName);
        } else {
            this.favorites.add(projectName);
        }
        
        await this.saveFavorites(); // Make it await
        
        // If we just unfavorited the last site while viewing favorites, switch back to all sites
        if (this.showingFavoritesOnly && this.favorites.size === 0) {
            this.showingFavoritesOnly = false;
        }
        
        this.sortAndRenderSites();
        this.updateFavoriteButton();
    }

    // Check if site is favorited
    isFavorited(projectName) {
        return this.favorites.has(projectName);
    }

    // Toggle favorites filter
    toggleFavoritesFilter() {
        this.showingFavoritesOnly = !this.showingFavoritesOnly;
        this.updateFavoriteButton();
        this.sortAndRenderSites();
    }

    // Update favorites button appearance
    updateFavoriteButton() {
        const btn = document.getElementById('favorites-filter-btn');
        if (!btn) return;
        
        const span = btn.querySelector('span');
        const favCount = this.favorites.size;
        
        if (this.showingFavoritesOnly) {
            btn.classList.add('active');
            span.textContent = favCount > 0 ? `Favorites (${favCount})` : 'Favorites';
        } else {
            btn.classList.remove('active');
            span.textContent = favCount > 0 ? `Favorites (${favCount})` : 'Favorites';
        }
    }

    async loadTags() {        
        const userContext = this.getUserContext();        
        if (userContext.isGuest) {
            console.log('   - Guest user, clearing tags');
            this.tags = {};
            return;
        }        
        
        try {
            const response = await fetch('/api/user/preferences/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });           
            
            if (response.ok) {
                const data = await response.json();                
                const tags = data.preferences?.tags || {};                
                this.tags = tags;
                this.dataLoadAttempts = 0; // Reset retry counter on success
                console.log(`✅ Loaded tags for ${Object.keys(tags).length} projects`);
            } else {
                console.error('   - API call failed:', response.status, response.statusText);
                // DON'T clear data immediately - retry instead
                this.dataLoadAttempts++;
                if (this.dataLoadAttempts < this.maxRetryAttempts) {
                    console.log(`   - Retrying tags load (attempt ${this.dataLoadAttempts}/${this.maxRetryAttempts})`);
                    setTimeout(() => this.loadTags(), 2000 * this.dataLoadAttempts);
                    return; // Don't clear data while retrying
                } else {
                    console.error('   - Max retry attempts reached, keeping existing tags');
                    // Only clear if we have no existing data AND this is a fresh load
                    if (Object.keys(this.tags).length === 0) {
                        this.tags = {};
                    }
                }
            }
        } catch (error) {
            console.error('🚨 Error loading tags:', error);
            // DON'T clear data on network errors - retry instead
            this.dataLoadAttempts++;
            if (this.dataLoadAttempts < this.maxRetryAttempts) {
                console.log(`   - Retrying tags load after error (attempt ${this.dataLoadAttempts}/${this.maxRetryAttempts})`);
                setTimeout(() => this.loadTags(), 2000 * this.dataLoadAttempts);
                return; // Don't clear data while retrying
            } else {
                console.error('   - Max retry attempts reached after errors, keeping existing data');
                // Keep existing data rather than clearing
            }
        }        
    }

    // Save tags to user preferences API
    async saveTags() {
        const userContext = this.getUserContext();
        if (userContext.isGuest) return;
        
        try {
            // Get current preferences first
            const getResponse = await fetch('/api/user/preferences/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext })
            });
            
            let currentPreferences = {};
            if (getResponse.ok) {
                const data = await getResponse.json();
                currentPreferences = data.preferences || {};
            }
            
            // Update tags in preferences
            currentPreferences.tags = this.tags;
            
            // Save back to API
            await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userContext, preferences: currentPreferences })
            });
        } catch (error) {
            console.error('Error saving tags:', error);
        }
    }

    // Get all unique tags across all projects
    getAllTags() {
        const allTags = new Set();
        Object.values(this.tags).forEach(projectTags => {
            projectTags.forEach(tag => allTags.add(tag));
        });
        return Array.from(allTags).sort();
    }

    // Get tags for a specific project
    getProjectTags(projectName) {
        return this.tags[projectName] || [];
    }

    // Generate consistent color for a tag
    // Generate consistent color for a tag
    getTagColor(tag) {
        // Simple hash function to generate consistent colors
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Generate HSL color with higher lightness for dark backgrounds
        const hue = hash % 360;
        return `hsl(${hue}, 65%, 70%)`; // Increased lightness from 45% to 70%
    }

    // Open tags editing modal
    openTagsModal(projectName, event) {
        event.stopPropagation();
        
        const modal = document.getElementById('tags-modal');
        const title = document.getElementById('tags-modal-title');
        const input = document.getElementById('tags-input');
        
        this.currentEditingProject = projectName;
        title.textContent = `Manage Tags - ${projectName}`;
        
        // Populate current tags
        const currentTags = this.getProjectTags(projectName);
        input.value = currentTags.join(', ');
        
        // Populate existing tags chips
        this.populateExistingTagsChips();
        
        modal.style.display = 'flex';
    }

    // Populate existing tags chips in modal
    populateExistingTagsChips() {
        const container = document.getElementById('existing-tags-chips');
        const allTags = this.getAllTags();
        
        container.innerHTML = '';
        
        allTags.forEach(tag => {
            const chip = document.createElement('span');
            chip.className = 'existing-tag-chip';
            chip.style.color = this.getTagColor(tag);
            chip.textContent = tag;
            chip.onclick = () => this.addTagToInput(tag);
            container.appendChild(chip);
        });
        
        if (allTags.length === 0) {
            container.innerHTML = '<span class="no-tags">No existing tags</span>';
        }
    }

    // Add tag to input field
    addTagToInput(tag) {
        const input = document.getElementById('tags-input');
        const currentTags = input.value.split(',').map(t => t.trim()).filter(t => t);
        
        if (!currentTags.includes(tag)) {
            currentTags.push(tag);
            input.value = currentTags.join(', ');
        }
    }

    // Save tags from modal
    async saveTagsFromModal() {
        const input = document.getElementById('tags-input');
        const projectName = this.currentEditingProject;
        
        if (!projectName) return;
        
        // Parse tags from input
        const tagStrings = input.value.split(',').map(t => t.trim()).filter(t => t);
        
        // Update tags
        if (tagStrings.length > 0) {
            this.tags[projectName] = tagStrings;
        } else {
            delete this.tags[projectName];
        }
        
        await this.saveTags();
        this.closeTagsModal();
        this.updateTagsDisplay();
        this.sortAndRenderSites();
    }

    // Close tags modal
    closeTagsModal() {
        const modal = document.getElementById('tags-modal');
        modal.style.display = 'none';
        this.currentEditingProject = null;
    }

    // Update tags display in top controls
    updateTagsDisplay() {
        const container = document.getElementById('tags-chips');
        const expandBtn = document.getElementById('tags-expand-btn');
        const allTags = this.getAllTags();
        
        container.innerHTML = '';
        
        if (allTags.length === 0) {
            expandBtn.style.display = 'none';
            return;
        }
        
        // Show most common tags first (up to 5)
        const tagCounts = {};
        Object.values(this.tags).forEach(projectTags => {
            projectTags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        const sortedTags = allTags.sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
        const visibleTags = sortedTags.slice(0, 5);
        const hiddenTags = sortedTags.slice(5);
        
        // Create visible tag chips
        visibleTags.forEach(tag => {
            const chip = this.createTagChip(tag);
            container.appendChild(chip);
        });
        
        // Show expand button if there are hidden tags
        if (hiddenTags.length > 0) {
            expandBtn.style.display = 'block';
            expandBtn.onclick = () => this.toggleTagsDropdown();
        } else {
            expandBtn.style.display = 'none';
        }
    }

    // Create a clickable tag chip
    createTagChip(tag) {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.style.color = this.getTagColor(tag);
        chip.textContent = tag;
        
        if (this.selectedTags.has(tag)) {
            chip.classList.add('selected');
        }
        
        chip.onclick = () => this.toggleTagFilter(tag);
        
        return chip;
    }

    // Toggle tag filter
    toggleTagFilter(tag) {
        if (this.selectedTags.has(tag)) {
            this.selectedTags.delete(tag);
        } else {
            this.selectedTags.add(tag);
        }
        
        this.updateTagsDisplay();
        this.sortAndRenderSites();
    }

    // Toggle between ANY and ALL tag filtering
    toggleTagFilterMode() {
        this.tagFilterMode = this.tagFilterMode === 'any' ? 'all' : 'any';
        
        const label = document.getElementById('tags-label');
        if (this.tagFilterMode === 'all') {
            label.style.color = 'var(--accent-warning)'; // Different color for ALL mode
        } else {
            label.style.color = 'var(--text-secondary)'; // Normal color for ANY mode
        }
        
        this.sortAndRenderSites();
    }

    // Toggle tags expansion dropdown
    toggleTagsDropdown() {
        const dropdown = document.getElementById('tags-dropdown');
        const expandBtn = document.getElementById('tags-expand-btn');
        
        if (dropdown.style.display === 'none' || !dropdown.style.display) {
            // Show dropdown with all tags
            const allTags = this.getAllTags();
            // Only look for chips in the main container, not the dropdown
            const mainContainer = document.getElementById('tags-chips');
            const visibleTags = Array.from(mainContainer.querySelectorAll('.tag-chip')).map(chip => chip.textContent);
            const hiddenTags = allTags.filter(tag => !visibleTags.includes(tag));
            
            // Don't show dropdown if there are no hidden tags
            if (hiddenTags.length === 0) {
                return;
            }
            
            dropdown.innerHTML = '';
            hiddenTags.forEach(tag => {
                const chip = this.createTagChip(tag);
                dropdown.appendChild(chip);
            });
            
            // Position dropdown relative to the button using viewport coordinates
            const btnRect = expandBtn.getBoundingClientRect();
            
            dropdown.style.position = 'fixed';
            dropdown.style.top = (btnRect.bottom + 4) + 'px';
            dropdown.style.left = (btnRect.right - 200) + 'px';
            dropdown.style.zIndex = '1001';
            
            // Check if dropdown would go off the bottom of screen
            dropdown.style.display = 'block';
            dropdown.style.visibility = 'hidden';
            
            const dropdownRect = dropdown.getBoundingClientRect();
            if (dropdownRect.bottom > window.innerHeight) {
                dropdown.style.top = (btnRect.top - dropdownRect.height - 4) + 'px';
            }
            
            dropdown.style.visibility = 'visible';
            expandBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            setTimeout(() => {
                document.addEventListener('click', this.closeTagsDropdownHandler.bind(this), { once: true });
            }, 10);
        } else {
            this.closeTagsDropdown();
        }
    }

    // Close tags dropdown
    closeTagsDropdown() {
        const dropdown = document.getElementById('tags-dropdown');
        const expandBtn = document.getElementById('tags-expand-btn');
        
        dropdown.style.display = 'none';
        expandBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    }

    // Handler for closing dropdown when clicking outside
    closeTagsDropdownHandler(event) {
        const dropdown = document.getElementById('tags-dropdown');
        const expandBtn = document.getElementById('tags-expand-btn');
        
        if (!dropdown.contains(event.target) && event.target !== expandBtn) {
            this.closeTagsDropdown();
        }
    }

    // Export project method
    async exportProject(projectName, event) {
        event.stopPropagation(); // Prevent site card click
        
        console.log('📦 Starting export for:', projectName);
        
        const userContext = this.getUserContext();
        if (!userContext) {
            this.showToast('Please log in to export projects', 'error');
            return;
        }

        // Find the export icon and add loading state
        const card = document.querySelector(`[data-project="${projectName}"]`);
        const exportIcon = event.target;
        
        if (exportIcon) {
            exportIcon.classList.remove('fa-download');
            exportIcon.classList.add('fa-spinner', 'fa-spin');
            exportIcon.style.opacity = '0.6';
        }

        try {
            const response = await fetch('/api/projects/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    projectName,
                    userContext 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Export failed');
            }

            // Get the filename from response headers
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `${projectName}_Export.zip`;
            if (contentDisposition) {
                const matches = /filename="([^"]+)"/.exec(contentDisposition);
                if (matches) filename = matches[1];
            }

            // Download the file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            console.log('✅ Export completed:', filename);
            this.showToast(`Project exported: ${filename}`, 'success');

        } catch (error) {
            console.error('❌ Export error:', error);
            this.showToast(`Export failed: ${error.message}`, 'error');
        } finally {
            // Restore export icon
            if (exportIcon) {
                exportIcon.classList.remove('fa-spinner', 'fa-spin');
                exportIcon.classList.add('fa-download');
                exportIcon.style.opacity = '1';
            }
        }
    }

    // Helper method to show toast notifications
    showToast(message, type = 'info') {
        // You can either implement this locally or use the global toast system
        if (window.mainManager && window.mainManager.showToast) {
            window.mainManager.showToast(message, type);
        } else {
            console.log(`Toast: ${message} (${type})`);
            // Fallback: create simple toast
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                padding: 12px 20px; border-radius: 6px; color: white;
                background: ${type === 'success' ? '#307161' : type === 'error' ? '#C05746' : '#B1B695'};
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 3000);
        }
    }

    // Utility: Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Refresh sites (called when tab becomes active)
    async refresh() {        
        try {
            // Load user data first
            await this.loadFavorites();
            await this.loadTags();
            
            // Then load sites
            await this.loadUserSites();
            
            // Finally update UI
            this.updateFavoriteButton();
            this.updateTagsDisplay();
            
        } catch (error) {
            console.error('🚨 Error during My Sites refresh:', error);
        }
    }

    // Clear sites (called when user logs out)
    clear(reason = 'unknown') {
        console.log(`🗑️ MySitesManager.clear() called - Reason: ${reason}`);
        console.trace('Clear called from:');
        
        // Don't clear if we just have temporary auth issues
        const userContext = this.getUserContext();
        if (!userContext.isGuest && this.lastValidUserContext && !this.lastValidUserContext.isGuest) {
            console.log('   - User appears to still be logged in, not clearing data');
            return;
        }
        
        // Only clear if we're absolutely sure the user is logged out
        if (reason !== 'confirmed_user_logout' && reason !== 'user_logged_out') {
            console.log('   - Unclear logout reason, preserving data for safety');
            return;
        }
        
        console.log('   - Confirmed clear, removing all data');
        this.sites = [];
        this.favorites = new Set();
        this.tags = {};
        this.showingFavoritesOnly = false;
        this.selectedTags = new Set();
        this.lastValidUserContext = null;
        this.contextInvalidatedAt = null;
        this.dataLoadAttempts = 0;
        
        this.updateFavoriteButton();
        this.updateTagsDisplay();
        this.showEmptyState('Please log in to view your sites.');        
    }

    // ADD this new method for manual recovery:
    async forceReload() {
        console.log('🔄 Force reloading My Sites data...');
        this.dataLoadAttempts = 0;
        await this.refresh();
    }

}

// Global tab switching function
function switchToTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate selected tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-content`);

    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');

        // Load sites when My Sites tab becomes active
        if (tabName === 'my-sites' && window.mySitesManager) {
            window.mySitesManager.refresh();
        }
    }
}

// Initialize My Sites functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize My Sites manager
    window.mySitesManager = new MySitesManager();

    // Set up tab switching
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchToTab(tabName);
        });
    });

    // Listen for user login/logout events
    if (window.authManager) {
        console.log('AuthManager detected, My Sites ready for file-based auth');
    }
});

// ADD this recovery function to the global scope for emergency use:
window.recoverMySitesData = function() {
    if (window.mySitesManager) {
        console.log('🆘 Emergency data recovery triggered');
        window.mySitesManager.forceReload();
    }
};

// Make functions globally available
window.switchToTab = switchToTab;