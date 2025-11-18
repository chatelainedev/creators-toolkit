// Updated generateGlobalFilterJavaScript function in filter-management.js
function generateGlobalFilterJavaScript() {
    return `
        // Global Filter System with Hidden Tag Support
        window.globalState = {
            activeFilter: null,  // Current filter tag
            filterType: 'tag'    // Type of filter
        };

        // Helper function to strip "!" prefix for filtering comparisons
        function stripHiddenPrefix(tag) {
            return tag.startsWith('!') ? tag.substring(1) : tag;
        }

        // Initialize global filter system
        function initializeGlobalFilters() {
            console.log('🔧 Initializing global filter system with hidden tag support...');
            setupOverviewLinkFilters();
            handleInitialFilter();
            console.log('✅ Global filter system ready');
        }

        // Set up overview link click handlers for filtering
        function setupOverviewLinkFilters() {
            // CHANGE THIS LINE to include both overview and custom nav buttons:
            document.querySelectorAll('.overview-link-btn, .custom-nav-btn').forEach(link => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#filter:')) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const filterValue = href.replace('#filter:', '');
                        setGlobalFilter(filterValue);
                    });
                }
            });
        }

        // Set the global filter and apply it
        function setGlobalFilter(filterValue) {
            console.log(\`🔍 Setting global filter to: \${filterValue}\`);
            
            if (filterValue === 'clear') {
                globalState.activeFilter = null;
            } else {
                globalState.activeFilter = filterValue;
            }
            
            updateFilterButtonStates();
            applyGlobalFilterToCurrentTab();
            
            if (globalState.activeFilter) {
                history.replaceState(null, null, \`#filter:\${globalState.activeFilter}\`);
            } else {
                history.replaceState(null, null, '#');
            }

            // Update body data attribute to trigger CSS filtering
            if (globalState.activeFilter) {
                document.body.setAttribute('data-global-filter', globalState.activeFilter);
            } else {
                document.body.removeAttribute('data-global-filter');
            }
        }

        // Update visual states of overview link buttons
        function updateFilterButtonStates() {
            document.querySelectorAll('.overview-link-btn').forEach(link => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#filter:')) {
                    const filterValue = href.replace('#filter:', '');
                    
                    if (globalState.activeFilter === filterValue || 
                        (globalState.activeFilter === null && filterValue === 'clear')) {
                        link.classList.add('filter-active');
                    } else {
                        link.classList.remove('filter-active');
                    }
                }
            });
        }

        // Apply global filter to whatever tab is currently active
        // Apply global filter to whatever tab is currently active
        function applyGlobalFilterToCurrentTab() {
            const activeTab = document.querySelector('.content.active');
            if (!activeTab) {
                console.log('⚠️ No active tab found');
                return;
            }
            
            const tabId = activeTab.id;
            
            switch (tabId) {
                case 'overview':
                    // No filtering needed for overview
                    break;
                case 'world':                           // ← ADD THIS CASE
                    applyGlobalFilterToWorld();         // ← ADD THIS CASE
                    break;                              // ← ADD THIS CASE
                case 'characters':
                    applyGlobalFilterToCharacters();
                    break;
                case 'storylines':
                    applyGlobalFilterToStorylines();
                    break;
                case 'plans':
                    applyGlobalFilterToPlans();
                    break;
                case 'playlists':
                    applyGlobalFilterToPlaylists();
                    break;
                case 'timeline':
                    applyGlobalFilterToTimeline();
                    break;
                default:
                    console.log(\`ℹ️ No global filter support for \${tabId} tab\`);
            }
        }

        // Apply global filter to Characters tab with hidden tag support
        function applyGlobalFilterToCharacters() {
            
            if (!globalState.activeFilter) {
                if (typeof clearAllCharacterTags === 'function') {
                    clearAllCharacterTags();
                }
                
                const characterCards = document.querySelectorAll('.character-card');
                characterCards.forEach(card => {

                        card.classList.remove('filter-match');
                    
                });
                return;
            }
            
            if (typeof selectedCharacterTags !== 'undefined') {
                selectedCharacterTags.clear();
                selectedCharacterTags.add(globalState.activeFilter);
                
                if (typeof updateCharacterTagStates === 'function') {
                    updateCharacterTagStates();
                }
                
                if (typeof updateClearButtonState === 'function') {
                    updateClearButtonState();
                }
                
                if (typeof applyCharacterFilters === 'function') {
                    applyCharacterFilters();
                }
            }
            
            // Filter character cards directly
            const characterCards = document.querySelectorAll('.character-card');
            characterCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                const matchesFilter = cardTags.some(tag => tag.includes(globalState.activeFilter.toLowerCase()));
                
                if (matchesFilter) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        }

        // Apply global filter to World tab with hidden tag support
        function applyGlobalFilterToWorld() {
            
            if (!globalState.activeFilter) {
                if (typeof clearAllWorldTags === 'function') {
                    clearAllWorldTags();
                }
                
                // Clear any manual filtering when no global filter
                const worldItems = document.querySelectorAll('.world-item');
                worldItems.forEach(item => {
                    item.style.display = '';
                    item.classList.remove('hidden');
                });
                
                // Reset section visibility
                const worldSections = document.querySelectorAll('.world-section');
                worldSections.forEach(section => {
                    section.style.display = 'block';
                    const noResults = section.querySelector('.no-filter-results');
                    if (noResults) noResults.remove();
                });
                
                return;
            }
            
            
            // Set the regular world tag filter
            if (typeof selectedWorldTags !== 'undefined') {
                selectedWorldTags.clear();
                selectedWorldTags.add(globalState.activeFilter);
                
                if (typeof updateWorldTagStates === 'function') {
                    updateWorldTagStates();
                }
                
                if (typeof updateWorldClearButtonState === 'function') {
                    updateWorldClearButtonState();
                }
                
                if (typeof filterWorldItems === 'function') {
                    filterWorldItems();
                }
            }
            
            // Handle direct DOM manipulation as fallback
            const worldItems = document.querySelectorAll('.world-item');
            worldItems.forEach(item => {
                const itemTags = item.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                const matchesFilter = itemTags.some(tag => tag.includes(globalState.activeFilter.toLowerCase()));
                
                if (matchesFilter) {
                    item.style.display = '';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none'; 
                    item.classList.add('hidden');
                }
            });
            
            // Update section visibility after filtering
            // Update section visibility after filtering
            const worldSections = document.querySelectorAll('.world-section');
            worldSections.forEach(section => {
                const visibleItems = section.querySelectorAll('.world-item:not(.hidden)');
                if (visibleItems.length > 0) {
                    section.style.display = 'block';
                    // Clean up any existing no-results messages
                    const noResults = section.querySelector('.no-filter-results');
                    if (noResults) noResults.remove();
                } else {
                    section.style.display = 'none';
                }
            });
        }

        // Apply global filter to Storylines tab with hidden tag support
        function applyGlobalFilterToStorylines() {
            
            if (!globalState.activeFilter) {
                if (typeof clearAllStorylinesTags === 'function') {
                    clearAllStorylinesTags('roleplay');
                    clearAllStorylinesTags('solo');
                }
                
                const storylineCards = document.querySelectorAll('.storyline-card');
                storylineCards.forEach(card => {
                    card.classList.remove('filter-match');
                });
                
                // Show all section headers, subsection headers, and grids when clearing
                const sectionHeaders = document.querySelectorAll('.storyline-section-header');
                const subsectionHeaders = document.querySelectorAll('.storyline-subsection-header');
                const sectionGrids = document.querySelectorAll('.storylines-grid');
                sectionHeaders.forEach(header => header.style.display = '');
                subsectionHeaders.forEach(header => header.style.display = '');
                sectionGrids.forEach(grid => grid.style.display = '');
                
                return;
            }
            
            
            // Apply to BOTH view types, not just the active one
            if (typeof selectedRoleplayTags !== 'undefined') {
                selectedRoleplayTags.clear();
                selectedRoleplayTags.add(globalState.activeFilter);
                
                if (typeof updateStorylinesTagStates === 'function') {
                    updateStorylinesTagStates('roleplay');
                    updateStorylinesClearButtonState('roleplay');
                    applyStorylinesFilters('roleplay');
                }
            }
            
            if (typeof selectedSoloTags !== 'undefined') {
                selectedSoloTags.clear();
                selectedSoloTags.add(globalState.activeFilter);
                
                if (typeof updateStorylinesTagStates === 'function') {
                    updateStorylinesTagStates('solo');
                    updateStorylinesClearButtonState('solo');
                    applyStorylinesFilters('solo');
                }
            }
            
            // Handle all elements for global filtering (fallback for direct DOM manipulation)
            const storylineCards = document.querySelectorAll('.storyline-card');
            storylineCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                const matchesFilter = cardTags.some(tag => tag.includes(globalState.activeFilter.toLowerCase()));
                
                if (matchesFilter) {
                    card.style.display = '';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none'; 
                    card.classList.add('hidden');
                }
            });
            
            // UPDATED: Handle section AND subsection visibility for BOTH views
            const bothViews = document.querySelectorAll('.storylines-view');
            bothViews.forEach(viewContainer => {
                // First, handle all subsection headers and their grids
                const subsectionHeaders = viewContainer.querySelectorAll('.storyline-subsection-header');
                subsectionHeaders.forEach(subsectionHeader => {
                    const nextGrid = subsectionHeader.nextElementSibling;
                    if (nextGrid && nextGrid.classList.contains('storylines-grid')) {
                        const visibleCards = nextGrid.querySelectorAll('.storyline-card:not(.hidden)');
                        
                        if (visibleCards.length > 0) {
                            subsectionHeader.style.display = '';
                            nextGrid.style.display = '';
                        } else {
                            subsectionHeader.style.display = 'none';
                            nextGrid.style.display = 'none';
                        }
                    }
                });
                
                // Then, handle section headers - hide only if ALL their content is hidden
                const sectionHeaders = viewContainer.querySelectorAll('.storyline-section-header');
                sectionHeaders.forEach(sectionHeader => {
                    let currentElement = sectionHeader.nextElementSibling;
                    let hasAnyVisibleContent = false;
                    
                    // Check all grids (main section grid + subsection grids) until next section header
                    while (currentElement && !currentElement.classList.contains('storyline-section-header')) {
                        if (currentElement.classList.contains('storylines-grid')) {
                            const visibleCards = currentElement.querySelectorAll('.storyline-card:not(.hidden)');
                            if (visibleCards.length > 0) {
                                hasAnyVisibleContent = true;
                                break;
                            }
                        }
                        currentElement = currentElement.nextElementSibling;
                    }
                    
                    // Show section header if ANY of its grids (main or subsections) have visible cards
                    if (hasAnyVisibleContent) {
                        sectionHeader.style.display = '';
                        // Also ensure the main section grid is visible
                        const mainGrid = sectionHeader.nextElementSibling;
                        if (mainGrid && mainGrid.classList.contains('storylines-grid')) {
                            mainGrid.style.display = '';
                        }
                    } else {
                        sectionHeader.style.display = 'none';
                        // Also hide the main section grid
                        const mainGrid = sectionHeader.nextElementSibling;
                        if (mainGrid && mainGrid.classList.contains('storylines-grid')) {
                            mainGrid.style.display = 'none';
                        }
                    }
                });
            });
        }

        // Apply global filter to Plans tab with hidden tag support
        function applyGlobalFilterToPlans() {
            
            // Check which view is actually visible (not just CSS classes)
            const cardsView = document.getElementById('cards-view');
            const timelineView = document.getElementById('timeline-view');
            
            // Check computed styles to see what's actually visible
            const cardsVisible = cardsView && window.getComputedStyle(cardsView).display !== 'none';
            const timelineVisible = timelineView && window.getComputedStyle(timelineView).display !== 'none';
            
            console.log('🐛 VISIBILITY DEBUG:', {
                cardsVisible: cardsVisible,
                timelineVisible: timelineVisible,
                cardsDisplay: cardsView ? window.getComputedStyle(cardsView).display : 'not found',
                timelineDisplay: timelineView ? window.getComputedStyle(timelineView).display : 'not found'
            });
            
            if (timelineVisible && !cardsVisible) {
                applyGlobalFilterToTimeline();
            } else {
                applyGlobalFilterToCardsView();
            }
        }

        // NEW: Separate function for Cards view filtering
        function applyGlobalFilterToCardsView() {
            if (!globalState.activeFilter) {
                if (typeof clearAllPlanTags === 'function') {
                    clearAllPlanTags();
                }
                
                const planCards = document.querySelectorAll('.plan-card');
                planCards.forEach(card => {
                    card.classList.remove('hidden');
                    card.style.display = '';
                });
                return;
            }
            
            if (typeof selectedPlanTags !== 'undefined') {
                selectedPlanTags.clear();
                selectedPlanTags.add(globalState.activeFilter);
                
                if (typeof updatePlanTagStates === 'function') {
                    updatePlanTagStates();
                }
                
                if (typeof updatePlanClearButtonState === 'function') {
                    updatePlanClearButtonState();
                }
                
                if (typeof applyPlanFilters === 'function') {
                    applyPlanFilters();
                }
            }
            
            // Filter plan cards directly
            const planCards = document.querySelectorAll('.plan-card');
            planCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                const matchesFilter = cardTags.some(tag => tag.includes(globalState.activeFilter.toLowerCase()));
                
                if (matchesFilter) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        }

        // NEW: Function for Timeline view filtering
        function applyGlobalFilterToTimelineView() {
            if (!globalState.activeFilter) {
                // Clear timeline filters
                if (typeof selectedTimelineTags !== 'undefined') {
                    selectedTimelineTags.clear();
                    if (typeof updateTimelineTagStates === 'function') updateTimelineTagStates();
                    if (typeof updateTimelineClearButtonState === 'function') updateTimelineClearButtonState();
                }
                if (typeof applyTimelineFilters === 'function') {
                    applyTimelineFilters();
                }
                return;
            }
            
            // Set the timeline filtering system to use the global filter
            if (typeof selectedTimelineTags !== 'undefined') {
                selectedTimelineTags.clear();
                selectedTimelineTags.add(globalState.activeFilter);
                
                if (typeof updateTimelineTagStates === 'function') {
                    updateTimelineTagStates();
                }
                
                if (typeof updateTimelineClearButtonState === 'function') {
                    updateTimelineClearButtonState();
                }
                
                if (typeof applyTimelineFilters === 'function') {
                    applyTimelineFilters();
                }
            }
        }

        // Apply global filter to Playlists tab with hidden tag support
        function applyGlobalFilterToPlaylists() {
            
            if (!globalState.activeFilter) {
                console.log('🎵 Clearing all playlist filters');
                if (typeof clearAllPlaylistTags === 'function') {
                    clearAllPlaylistTags();
                }
                
                const playlistCards = document.querySelectorAll('.playlist-card');
                playlistCards.forEach(card => {
                    card.classList.remove('hidden');
                    card.style.display = '';
                });
                return;
            }
            
            if (typeof selectedPlaylistTags !== 'undefined') {
                selectedPlaylistTags.clear();
                selectedPlaylistTags.add(globalState.activeFilter);
                
                if (typeof updatePlaylistTagStates === 'function') {
                    updatePlaylistTagStates();
                }
                
                if (typeof updatePlaylistClearButtonState === 'function') {
                    updatePlaylistClearButtonState();
                }
                
                if (typeof applyPlaylistFilters === 'function') {
                    applyPlaylistFilters();
                }
            }
            
            // Handle pre-hidden elements - tags in data attributes are already stripped
            const playlistCards = document.querySelectorAll('.playlist-card');
            playlistCards.forEach(card => {

                    const cardTags = card.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                    const matchesFilter = cardTags.some(tag => tag.includes(globalState.activeFilter.toLowerCase()));
                    
                    if (matchesFilter) {
                        card.classList.add('filter-match');
                    } else {
                        card.classList.remove('filter-match');
                    }
                
            });
        }

        // Apply global filter to Timeline tab with hidden tag support
        // Apply global filter to Timeline tab with hidden tag support
        function applyGlobalFilterToTimeline() {
            
            // Detect which timeline view is currently active
            const chronoContainer = document.getElementById('tl-chronological-container');
            const arcContainer = document.getElementById('tl-arc-container');
            const chronoActive = chronoContainer && chronoContainer.style.display !== 'none';
            const arcActive = arcContainer && arcContainer.style.display !== 'none';
            
            console.log('⏰ Timeline view detection:', {
                chronoActive: chronoActive,
                arcActive: arcActive,
                chronoDisplay: chronoContainer ? chronoContainer.style.display : 'not found',
                arcDisplay: arcContainer ? arcContainer.style.display : 'not found'
            });
            
            if (!globalState.activeFilter) {
                console.log('⏰ Clearing all timeline filters');
                
                // Clear timeline filtering state
                if (typeof selectedTimelineTags !== 'undefined') {
                    selectedTimelineTags.clear();
                    if (typeof updateTimelineTagStates === 'function') updateTimelineTagStates();
                    if (typeof updateTimelineClearButtonState === 'function') updateTimelineClearButtonState();
                }
                
                // Apply clearing to active view
                if (typeof applyTimelineFilters === 'function') {
                    applyTimelineFilters();
                }
                return;
            }
            
            console.log('⏰ Setting timeline filter to:', globalState.activeFilter);
            
            // Set the timeline filtering system to use the global filter
            if (typeof selectedTimelineTags !== 'undefined') {
                selectedTimelineTags.clear();
                selectedTimelineTags.add(globalState.activeFilter);
                
                if (typeof updateTimelineTagStates === 'function') {
                    updateTimelineTagStates();
                }
                
                if (typeof updateTimelineClearButtonState === 'function') {
                    updateTimelineClearButtonState();
                }
                
                // Use the existing timeline filtering system which detects the active view
                if (typeof applyTimelineFilters === 'function') {
                    applyTimelineFilters();
                }
            }
        }

        // Helper function to check if timeline event matches tags
        function checkTimelineEventMatchesTags(arcTitle) {
            if (!arcTitle || !globalState.activeFilter) {
                return globalState.activeFilter ? false : true;
            }
            
            if (typeof fullInfoData === 'undefined' || !fullInfoData.plans) {
                return false;
            }
            
            // Extract main arc title (before arrow if sub-arc)
            const mainArcTitle = arcTitle.split(' →')[0].trim();
            const plan = fullInfoData.plans.find(p => p.title === mainArcTitle);
            
            if (!plan || !plan.tags) {
                return false;
            }
            
            // Check if plan has the global filter tag
            return plan.tags.some(tag => 
                tag.toLowerCase().includes(globalState.activeFilter.toLowerCase())
            );
        }

        // Handle initial filter from URL on page load
        function handleInitialFilter() {
            const hash = window.location.hash;
            
            if (hash && hash.startsWith('#filter:')) {
                const filterValue = hash.replace('#filter:', '');
                
                if (filterValue === 'clear') {
                    globalState.activeFilter = null;
                } else {
                    globalState.activeFilter = filterValue;
                }
                
                updateFilterButtonStates();
                
                setTimeout(() => {
                    applyGlobalFilterToCurrentTab();
                }, 100);
            }
            
            // Handle initial state of pre-hidden elements
            setTimeout(() => {
                if (!globalState.activeFilter) {
                    const allFilterableElements = document.querySelectorAll('.character-card.pre-hidden, .storyline-card.pre-hidden, .plan-card.pre-hidden, .playlist-card.pre-hidden, .tl-timeline-event.pre-hidden');
                    allFilterableElements.forEach(element => {
                        element.classList.remove('filter-match');
                    });
                }
            }, 200);
        }

        // Override the original showTab function to apply filters when switching tabs
        const originalShowTab = window.showTab;
        window.showTab = function(tabName) {
            originalShowTab(tabName);
            setTimeout(() => {
                applyGlobalFilterToCurrentTab();
            }, 50);
        };

        // Override the switchPlansView function to reapply global filters when switching views
        const originalSwitchPlansView = window.switchPlansView;
        window.switchPlansView = function(view) {
            originalSwitchPlansView(view);
            setTimeout(() => {
                // Reapply global filter to the new view
                applyGlobalFilterToCurrentTab();
            }, 50);
        };

        // Override the switchTimelineView function to reapply global filters when switching timeline types
        const originalSwitchTimelineView = window.switchTimelineView;
        window.switchTimelineView = function(view) {
            originalSwitchTimelineView(view);
            setTimeout(() => {
                // Reapply global filter to the new timeline view
                applyGlobalFilterToCurrentTab();
            }, 50);
        };

        // Add CSS for active filter button states
        function addGlobalFilterCSS() {
            const style = document.createElement('style');
            style.textContent = \`
                .overview-link-btn.filter-active {
                    background-color: var(--primary-color, #B1B695) !important;
                    color: white !important;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transform: translateY(-1px);
                }
                
                .overview-link-btn {
                    transition: all 0.2s ease;
                }
                
                .overview-link-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                
                .overview-link-btn.filter-active:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 3px 12px rgba(0,0,0,0.4);
                }
            \`;
            document.head.appendChild(style);
        }

        // Initialize global filter system
        function initializeGlobalFilterSystem() {
            addGlobalFilterCSS();
            initializeGlobalFilters();

            // Handle initial state of pre-hidden elements
            if (!globalState.activeFilter) {
                const allFilterableElements = document.querySelectorAll('.character-card.pre-hidden, .storyline-card.pre-hidden, .plan-card.pre-hidden, .playlist-card.pre-hidden, .tl-timeline-event.pre-hidden');
                allFilterableElements.forEach(element => {
                    element.classList.remove('filter-match');
                });
            }
            
            console.log('🌐 Global filter system loaded with hidden tag support!');
            console.log('💡 Use #filter:tagname in Overview Links to create filter buttons');
            console.log('💡 Use #filter:clear to create a "show all" button');
            console.log('💡 Use !tagname in tag fields to hide tags from page filters');
            console.log('💡 Hidden tags can still be used in global filters');
        }
    `;
}