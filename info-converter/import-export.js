// Import and Export Functions with Appearance Support, Hidden Items, Notes Support, Plans Support, Character Tags Support, Subtitle Support, and Overview Title/Image Support

function parseImportedHTML(htmlContent) {
    try {
        console.log('Starting HTML import/parse...');

        // CLEAR LOREBOOK VARIABLES AT THE START OF IMPORT
        linkedLorebookData = null;
        linkedLorebookFilename = null;
        infoData.linkedLorebook = null;
        
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Try to extract from embedded full data first
        const scripts = doc.querySelectorAll('script');
        let foundEmbeddedData = false;
        
        scripts.forEach(script => {
            const scriptContent = script.textContent;
            
            // Try multiple patterns to find the embedded data
            let fullDataMatch = scriptContent.match(/var fullInfoData = (\{[\s\S]*?\});(?:\s|$)/);
            if (!fullDataMatch) {
                // Try alternative pattern with different spacing
                fullDataMatch = scriptContent.match(/fullInfoData\s*=\s*(\{[\s\S]*?\});/);
            }
            
            if (fullDataMatch) {
                try {
                    console.log('Found fullInfoData match, attempting to parse...');
                    const fullData = JSON.parse(fullDataMatch[1]);
                    console.log('Found complete embedded data including hidden items, notes, plans, tags, subtitle, and overview fields!');
                    console.log('Full data structure:', Object.keys(fullData));
                    
                    // Use the embedded data directly
                    if (fullData.basic) {
                        infoData.basic = fullData.basic;
                    }
                    // ADD: Load overview links
                    if (fullData.basic.overviewLinks) {
                        overviewLinksData = [...fullData.basic.overviewLinks];
                        setTimeout(() => {
                            renderOverviewLinks();
                            updateAddButtonState();
                        }, 200);
                    }
                    // ADD: Load custom navigation
                    if (fullData.basic.customNavLinks) {
                        customNavLinksData = [...fullData.basic.customNavLinks];
                        setTimeout(() => {
                            renderCustomNavLinks();
                            updateCustomNavAddButtonState();
                        }, 200);
                    }
                    if (fullData.basic.customNavSettings) {
                        // This will be loaded by initializeCustomNavigation() later
                    }

                    if (fullData.customPages) {
                        infoData.customPages = fullData.customPages;
                        console.log('✅ Loaded custom pages:', fullData.customPages.length);
                    } else {
                        console.log('ℹ️ No custom pages found in embedded data');
                        infoData.customPages = [];
                    }
                    if (fullData.appearance) {
                        infoData.appearance = fullData.appearance;
                    }
                    if (fullData.characters) {
                        infoData.characters = fullData.characters;
                        // Debug log for tags
                        const charactersWithTags = fullData.characters.filter(c => c.tags && c.tags.length > 0);
                    }
                    if (fullData.storylines) {
                        infoData.storylines = fullData.storylines;
                        
                        // NEW: Migrate storylines for backward compatibility
                        infoData.storylines.forEach(storyline => {
                            if (!storyline.hasOwnProperty('isProjectLink')) {
                                if (storyline.link) {
                                    if (storyline.link.startsWith('roleplays/')) {
                                        storyline.isProjectLink = true;
                                        storyline.link = storyline.link.replace('roleplays/', '');
                                    } else if (storyline.link.match(/^[^\/\s]+\.html$/)) {
                                        storyline.isProjectLink = true;
                                    } else {
                                        storyline.isProjectLink = false;
                                    }
                                } else {
                                    storyline.isProjectLink = false;
                                }
                            }
                        });
                        
                    }
                    if (fullData.storylinesOptions) {
                        infoData.storylinesOptions = fullData.storylinesOptions;
                        console.log('✓ Loaded storylines options:', fullData.storylinesOptions);
                    } else {
                        // Set defaults if not present
                        infoData.storylinesOptions = {
                            showTOC: true,
                            showSections: true,
                            showSubsections: true
                        };
                        console.log('⚠ No storylines options found, using defaults');
                    }
                    if (fullData.charactersOptions) {
                        infoData.charactersOptions = fullData.charactersOptions;
                        console.log('✓ Loaded characters options:', fullData.charactersOptions);
                    } else {
                        // Set defaults if not present
                        infoData.charactersOptions = {
                            showByFaction: true,
                            showInfoDisplay: false  // ADD THIS LINE
                        };
                        console.log('⚠ No characters options found, using defaults');
                    }
                    if (fullData.cultureOptions) {
                        infoData.cultureOptions = fullData.cultureOptions;
                        console.log('✓ Loaded culture options:', fullData.cultureOptions);
                    } else {
                        // Set defaults if not present
                        infoData.cultureOptions = {
                            customLabel: 'Culture'
                        };
                        console.log('⚠ No culture options found, using defaults');
                    }
                    if (fullData.cultivationOptions) {
                        infoData.cultivationOptions = fullData.cultivationOptions;
                        console.log('✓ Loaded cultivation options:', fullData.cultivationOptions);
                    } else {
                        // Set defaults if not present
                        infoData.cultivationOptions = {
                            customLabel: 'Cultivation'
                        };
                        console.log('⚠ No cultivation options found, using defaults');
                    }
                    if (fullData.magicOptions) {
                        infoData.magicOptions = fullData.magicOptions;
                        console.log('✓ Loaded magic options:', fullData.magicOptions);
                    } else {
                        // Set defaults if not present
                        infoData.magicOptions = {
                            customLabel: 'Magic'
                        };
                        console.log('⚠ No magic options found, using defaults');
                    }
                    if (fullData.eventsOptions) {
                        infoData.eventsOptions = fullData.eventsOptions;
                        console.log('✓ Loaded events options:', fullData.eventsOptions);
                    } else {
                        // Set defaults if not present
                        infoData.eventsOptions = {
                            customLabel: 'Events'
                        };
                        console.log('⚠ No events options found, using defaults');
                    }
                    if (fullData.plans) {
                        infoData.plans = fullData.plans;
                        console.log('Plans details:', fullData.plans.map(p => ({
                            title: p.title, 
                            events: p.events?.length || 0,
                            characterTags: p.characterTags?.length || 0
                        })));
                    } else {
                        console.log('⚠ No plans found in embedded data');
                        infoData.plans = [];
                    }
                    if (fullData.plansOptions) {
                        infoData.plansOptions = fullData.plansOptions;
                        console.log('✓ Loaded plans options:', fullData.plansOptions);
                    } else {
                        console.log('⚠ No plans options found, using default');
                        infoData.plansOptions = { selectedTimeSystemId: 'default' };
                    }
                    // DON'T import userTimeSystems from project - they should come from backend only!
                    // Projects only need to remember WHICH calendar they use, not the definitions
                    console.log('⚠ Skipping embedded userTimeSystems - calendars always load from backend');
                    if (fullData.playlists) {
                        infoData.playlists = fullData.playlists;
                    } else {
                        console.log('⚠ No playlists found in embedded data');
                        infoData.playlists = [];
                    }
                    if (fullData.world) {
                        infoData.world = fullData.world;
                    }

                    if (fullData.linkedLorebook) {
                        infoData.linkedLorebook = fullData.linkedLorebook;
                        console.log('✓ Loaded linked lorebook:', fullData.linkedLorebook.filename);
                        
                        // Initialize the lorebook data variables
                        if (typeof initializeLinkedLorebook === 'function') {
                            setTimeout(() => {
                                initializeLinkedLorebook();
                            }, 100);
                        }
                    }
                    
                    foundEmbeddedData = true;
                    console.log('Successfully loaded all data including hidden items, notes, plans, tags, subtitle, and overview fields from embedded data');
                    return;
                } catch (e) {
                    console.log('Could not parse embedded full data:', e);
                    console.log('Raw match was:', fullDataMatch[1].substring(0, 200) + '...');
                }
            }
            
            // Fallback: try to extract plans separately if fullInfoData failed
            if (!foundEmbeddedData) {
                const plansMatch = scriptContent.match(/var plansData = (\[[\s\S]*?\]);/);
                if (plansMatch) {
                    try {
                        const plansData = JSON.parse(plansMatch[1]);
                        console.log('Found separate plansData:', plansData.length, 'plans');
                        infoData.plans = plansData;
                    } catch (e) {
                        console.log('Could not parse separate plans data:', e);
                    }
                }
            }
        });
        
        if (!foundEmbeddedData) {
            console.log('No embedded data found, using HTML parsing (hidden items, notes, detailed plans, tags, subtitle, and overview title/image may be lost)');
            
            // Extract basic information
            extractBasicInfo(doc);
            
            // Extract appearance information
            console.log('Extracting appearance info...');
            extractAppearanceInfo(doc);
            console.log('Appearance after extraction:', infoData.appearance);
            
            // Extract characters (notes and tags will be lost without embedded data)
            extractCharacters(doc);
            
            // Extract storylines
            extractStorylines(doc);
            
            // NEW: Extract plans (limited data without embedded source)
            extractPlans(doc);
            
            // Extract world information
            extractWorldInfo(doc);
            } else {
                // Even when using embedded data, we should still extract basic info from HTML
                // in case some fields aren't in the embedded data
                extractBasicInfo(doc);
                console.log('Final appearance settings after embedded data:', infoData.appearance);
            }
        
        // Ensure plans array exists
        if (!infoData.plans) {
            console.log('Initializing empty plans array');
            infoData.plans = [];
        }

        // Ensure playlists array exists
        if (!infoData.playlists) {
            console.log('Initializing empty playlists array');
            infoData.playlists = [];
        }

        // Ensure custom pages array exists
        if (!infoData.customPages) {
            console.log('Initializing empty customPages array for backward compatibility');
            infoData.customPages = [];
        }
        
        // Ensure new overview fields AND subtitle exist
        if (!infoData.basic.hasOwnProperty('overviewTitle')) {
            infoData.basic.overviewTitle = '';
        }
        if (!infoData.basic.hasOwnProperty('overviewImage')) {
            infoData.basic.overviewImage = '';
        }
        if (!infoData.basic.hasOwnProperty('subtitle')) { // NEW: Ensure subtitle exists
            infoData.basic.subtitle = '';
        }

        if (!infoData.basic.hasOwnProperty('subtitle')) { // NEW: Ensure subtitle exists
            infoData.basic.subtitle = '';
        }
        
        // ADD THESE NEW LINES:
        // Ensure header settings exist
        if (!infoData.appearance.hasOwnProperty('worldCategoriesHeader')) {
            infoData.appearance.worldCategoriesHeader = 'default';
        }
        if (!infoData.appearance.hasOwnProperty('pageHeader')) {
            infoData.appearance.pageHeader = 'standard';
        }

        // ADD THESE NEW LINES - Ensure main container background fields exist:
        if (!infoData.basic.hasOwnProperty('mainContainerBgImage')) {
            infoData.basic.mainContainerBgImage = '';
        }
        if (!infoData.basic.hasOwnProperty('mainContainerBgColor')) {
            infoData.basic.mainContainerBgColor = '';
        }
        if (!infoData.basic.hasOwnProperty('mainContainerOpacity')) {
            infoData.basic.mainContainerOpacity = 100;
        }
        if (!infoData.basic.hasOwnProperty('mainContainerBlur')) {
            infoData.basic.mainContainerBlur = 0;
        }
        
        // Ensure all characters have tags array
        if (infoData.characters && Array.isArray(infoData.characters)) {
            infoData.characters.forEach(character => {
                if (!character.hasOwnProperty('tags')) {
                    character.tags = [];
                }
            });
        }
        
        // Load appearance settings into the UI
        if (infoData.appearance && typeof loadAppearanceSettings === 'function') {
            console.log('Loading appearance settings into UI:', infoData.appearance);
            loadAppearanceSettings(infoData.appearance);
        }
        
        // Update all content lists (this will also update appearance controls)
        console.log('Updating all content lists...');
        console.log('Final data before updating lists:');
        console.log('- Characters:', infoData.characters.length);
        console.log('- Storylines:', infoData.storylines.length);
        console.log('- Plans:', infoData.plans.length);
        console.log('- Playlists:', infoData.playlists.length); 
        console.log('- World categories:', Object.keys(infoData.world));
        console.log('- Subtitle:', infoData.basic.subtitle);
        console.log('- Overview title:', infoData.basic.overviewTitle);
        console.log('- Overview image:', infoData.basic.overviewImage);

        // Ensure all required data arrays exist before updating lists
        if (!infoData.characters) infoData.characters = [];
        if (!infoData.storylines) infoData.storylines = [];
        if (!infoData.plans) infoData.plans = [];
        if (!infoData.playlists) infoData.playlists = [];
        if (!infoData.world) infoData.world = {};
        
        window.updateAllContentLists();

        // Reload user's calendars from backend and refresh dropdown
        if (typeof loadUserTimeSystems === 'function') {
            loadUserTimeSystems().then(() => {
                if (typeof populateTimeSystemsDropdown === 'function') {
                    populateTimeSystemsDropdown();
                    // Set the dropdown to show the imported selection
                    const dropdown = document.getElementById('plans-time-system');
                    if (dropdown && infoData.plansOptions?.selectedTimeSystemId) {
                        dropdown.value = infoData.plansOptions.selectedTimeSystemId;
                    }
                }
            });
        }
        
        // Explicitly render custom pages list after loading
        if (typeof renderPagesList === 'function') {
            renderPagesList();
        } else {
            // If the function isn't available yet, try again after a short delay
            setTimeout(() => {
                if (typeof renderPagesList === 'function') {
                    renderPagesList();
                }
            }, 100);
        }

        // Explicitly update appearance controls after a short delay
        setTimeout(() => {
            if (typeof window.populateAppearanceControls === 'function') {
                console.log('Force-updating appearance controls...');
                window.populateAppearanceControls();
            }
            
            // Mark project loading as complete
            if (typeof projectLoading !== 'undefined') {
                projectLoading = false;
                if (typeof updateGenerateButtonState === 'function') {
                    updateGenerateButtonState();
                }
            }
        }, 100);
        
        if (typeof showStatus === 'function') {
        } else {
        }
        
    } catch (error) {
        console.error('Error parsing HTML:', error);
        if (typeof showStatus === 'function') {
            showStatus('error', 'Error importing file. Please make sure it\'s a valid .html file.');
        } else {
            alert('Error importing file. Please make sure it\'s a valid .html file.');
        }
    }
}


function extractBasicInfo(doc) {
    // Extract title
    const title = doc.title || '';
    const worldTitleElement = document.getElementById('world-title');
    if (worldTitleElement) {
        worldTitleElement.value = title;
    }
    infoData.basic.title = title;
    
    // Extract subtitle from the title overlay
    const subtitleEl = doc.querySelector('.title-overlay .main-subtitle');
    if (subtitleEl) {
        const subtitle = subtitleEl.textContent.trim();
        const worldSubtitleElement = document.getElementById('world-subtitle');
        if (worldSubtitleElement) {
            worldSubtitleElement.value = subtitle;
        }
        infoData.basic.subtitle = subtitle;
    }
    
    // Extract banner image
    const bannerImg = doc.querySelector('.banner-image');
    if (bannerImg) {
        const bannerSrc = bannerImg.getAttribute('src') || '';
        const bannerImageElement = document.getElementById('banner-image');
        if (bannerImageElement) {
            bannerImageElement.value = bannerSrc;
        }
        infoData.basic.banner = bannerSrc;
    }
    
    // Extract overview title
    const overviewTitleEl = doc.querySelector('#overview .overview-title');
    if (overviewTitleEl) {
        const overviewTitle = overviewTitleEl.textContent.trim();
        const overviewTitleElement = document.getElementById('overview-title');
        if (overviewTitleElement) {
            overviewTitleElement.value = overviewTitle;
        }
        infoData.basic.overviewTitle = overviewTitle;
    }
    
    // Extract overview from the overview content
    const overviewContent = doc.querySelector('#overview .overview-content');
    if (overviewContent) {
        // Clone the content to avoid modifying the original
        const clonedContent = overviewContent.cloneNode(true);
        
        // Remove the title and image elements to get just the text content
        const titleElement = clonedContent.querySelector('.overview-title');
        const imageContainer = clonedContent.querySelector('.overview-image-container');
        
        if (titleElement) {
            titleElement.remove();
        }
        if (imageContainer) {
            imageContainer.remove();
        }
        
        // Use the remaining content for the overview text
        let overviewText = clonedContent.innerHTML;
        overviewText = htmlToMarkdown(overviewText);
        
        const overviewTextElement = document.getElementById('overview-text');
        if (overviewTextElement) {
            overviewTextElement.value = overviewText;
        }
        infoData.basic.overview = overviewText;
    }
    
    // Extract overview image
    const overviewImg = doc.querySelector('#overview .overview-image');
    if (overviewImg) {
        const overviewImgSrc = overviewImg.getAttribute('src') || '';
        const overviewImageElement = document.getElementById('overview-image');
        if (overviewImageElement) {
            overviewImageElement.value = overviewImgSrc;
        }
        infoData.basic.overviewImage = overviewImgSrc;
    }
    
    // Extract background settings from CSS in style tag
    const styleTag = doc.querySelector('style');
    if (styleTag) {
        const cssContent = styleTag.textContent;
        
        // Look for body CSS rule
        const bodyRuleMatch = cssContent.match(/body\s*\{([^}]+)\}/i);
        if (bodyRuleMatch) {
            const bodyCSS = bodyRuleMatch[1];
            
            // Try to extract background image first
            const bgImageMatch = bodyCSS.match(/background[^:]*:\s*url\(['"]?([^'")]+)['"]?\)/i);
            if (bgImageMatch) {
                const bgImage = bgImageMatch[1];
                const backgroundImageElement = document.getElementById('background-image');
                if (backgroundImageElement) {
                    backgroundImageElement.value = bgImage;
                }
                infoData.basic.backgroundImage = bgImage;
            } else {
                // Try to extract background color if no image
                const bgColorMatch = bodyCSS.match(/background[^:]*:\s*([^;]+)/i);
                if (bgColorMatch) {
                    const bgColor = bgColorMatch[1].trim();
                    // Don't set default color and filter out any remaining url() references
                    if (bgColor !== '#f5f5f5' && !bgColor.includes('url(')) {
                        const backgroundColorElement = document.getElementById('background-color');
                        if (backgroundColorElement) {
                            backgroundColorElement.value = bgColor;
                        }
                        infoData.basic.backgroundColor = bgColor;
                    }
                }
            }
        }
        
        // Extract main container color from .container rule
        const containerRuleMatch = cssContent.match(/\.container\s*\{([^}]+)\}/i);
        if (containerRuleMatch) {
            const containerCSS = containerRuleMatch[1];
            const containerBgMatch = containerCSS.match(/background[^:]*:\s*([^;]+)/i);
            if (containerBgMatch) {
                const containerBg = containerBgMatch[1].trim();
                // Only extract if it's not a variable reference and not a default theme color
                if (!containerBg.includes('${') && !containerBg.includes('var(') && containerBg !== '#ffffff' && containerBg !== 'white') {
                    const mainContainerColorElement = document.getElementById('main-container-color');
                    if (mainContainerColorElement) {
                        mainContainerColorElement.value = containerBg;
                    }
                    infoData.basic.mainContainerColor = containerBg;
                }
            }
        }
        // Extract modal background from modal CSS rules
        const modalContentRuleMatch = cssContent.match(/\.modal-content[^{]*\{([^}]+)\}/i);
        if (modalContentRuleMatch) {
            const modalCSS = modalContentRuleMatch[1];
            const modalBgImageMatch = modalCSS.match(/background[^:]*:[^;]*url\(['"]?([^'")]+)['"]?\)/i);
            if (modalBgImageMatch) {
                const modalBgImage = modalBgImageMatch[1];
                const modalBgImageElement = document.getElementById('modal-bg-image');
                if (modalBgImageElement) {
                    modalBgImageElement.value = modalBgImage;
                }
                infoData.basic.modalBgImage = modalBgImage;
            } else {
                // Try to extract modal background color if no image
                const modalBgColorMatch = modalCSS.match(/background[^:]*:\s*([^;]+)/i);
                if (modalBgColorMatch) {
                    const modalBgColor = modalBgColorMatch[1].trim();
                    if (!modalBgColor.includes('${') && !modalBgColor.includes('var(') && modalBgColor !== 'white') {
                        const modalBgColorElement = document.getElementById('modal-bg-color');
                        if (modalBgColorElement) {
                            modalBgColorElement.value = modalBgColor;
                        }
                        infoData.basic.modalBgColor = modalBgColor;
                    }
                }
            }
        }
    }
}

function extractAppearanceInfo(doc) {
    // Initialize appearance settings with defaults if not present
    if (!infoData.appearance) {
        infoData.appearance = {
            overviewStyle: 'journal',      
            navigationStyle: 'journal', 
            colorScheme: 'current',
            fontSet: 'serif',
            storylineStyle: 'default',
            containerStyle: 'left-border',
            subcontainerStyle: 'soft-bg',
            infodisplayStyle: 'default',
            bannerSize: 'large',
            buttonStyle: 'rounded',
            siteWidth: 'standard' 
        };
    }

    // Migrate old template setting if needed
    if (infoData.appearance.template && (!infoData.appearance.overviewStyle || !infoData.appearance.navigationStyle)) {
        console.log('Migrating old template setting in import:', infoData.appearance.template);
        infoData.appearance.overviewStyle = infoData.appearance.template;
        infoData.appearance.navigationStyle = infoData.appearance.template;
        delete infoData.appearance.template;
    }
    
    // Try to extract from JavaScript data first (more reliable)
    const scripts = doc.querySelectorAll('script');
    let appearanceData = null;
    
    scripts.forEach(script => {
        const scriptContent = script.textContent;
        const match = scriptContent.match(/var appearanceData = (\{.*?\});/s);
        if (match) {
            try {
                appearanceData = JSON.parse(match[1]);
                console.log('Found embedded appearance data:', appearanceData);
            } catch (e) {
                console.log('Could not parse appearance data from script:', e);
            }
        }
    });
    
    if (appearanceData && typeof appearanceData === 'object') {
        // Migrate old template setting if needed
        appearanceData = migrateEmbeddedAppearanceData(appearanceData);
        
        // Use the embedded appearance data
        infoData.appearance = { ...infoData.appearance, ...appearanceData };
        
        // Also try to load it using the appearance system
        if (typeof loadAppearanceSettings === 'function') {
            loadAppearanceSettings(appearanceData);
        }
        return;
    }
    
    // Fallback: try to detect from CSS (less reliable)
    const styleTag = doc.querySelector('style');
    if (!styleTag) return;
    
    const cssContent = styleTag.textContent;
    
    // Try to detect template from CSS comment (legacy support)
    const templateMatch = cssContent.match(/\/\*\s*Info Page Styles - (\w+) Template\s*\*\//i);
    if (templateMatch) {
        const detectedTemplate = templateMatch[1].toLowerCase();
        if (['journal', 'modern', 'classic'].includes(detectedTemplate)) {
            // Convert old template to new split system
            if (!infoData.appearance.overviewStyle && !infoData.appearance.navigationStyle) {
                console.log('Migrating detected template from CSS:', detectedTemplate);
                infoData.appearance.overviewStyle = detectedTemplate;
                infoData.appearance.navigationStyle = detectedTemplate;
            }
        }
    }

    // Try to detect overview style from CSS patterns
    if (cssContent.includes('.overview-banner')) {
        if (cssContent.includes('background: rgba(') && cssContent.includes('.overview-banner')) {
            infoData.appearance.overviewStyle = 'modern';
        } else if (cssContent.includes('.overview-banner') && cssContent.includes('border-bottom:')) {
            infoData.appearance.overviewStyle = 'classic';
        } else {
            infoData.appearance.overviewStyle = 'journal';
        }
    }

    // Try to detect navigation style from CSS patterns  
    if (cssContent.includes('.nav-links')) {
        if (cssContent.includes('.nav-links a') && cssContent.includes('border-radius:') && cssContent.includes('padding: 12px')) {
            infoData.appearance.navigationStyle = 'modern';
        } else if (cssContent.includes('.nav-links') && cssContent.includes('text-decoration: underline')) {
            infoData.appearance.navigationStyle = 'classic';
        } else {
            infoData.appearance.navigationStyle = 'journal';
        }
    }

    // Try to detect card style from CSS patterns
    if (cssContent.includes('.character-card')) {
        if (cssContent.includes('.character-card') && cssContent.includes('box-shadow:') && cssContent.includes('border-radius: 12px')) {
            infoData.appearance.cardStyle = 'modern';
        } else if (cssContent.includes('.character-card') && cssContent.includes('border: 1px solid')) {
            infoData.appearance.cardStyle = 'minimal';
        } else if (cssContent.includes('.character-card') && cssContent.includes('box-shadow:') && cssContent.includes('transform:')) {
            infoData.appearance.cardStyle = 'detailed';
        } else {
            infoData.appearance.cardStyle = 'current';
        }
    }

    // Try to detect site width from CSS
    const siteWidthMatch = cssContent.match(/max-width:\s*(\d+)px/);
    if (siteWidthMatch) {
        const maxWidth = parseInt(siteWidthMatch[1]);
        if (maxWidth <= 800) {
            infoData.appearance.siteWidth = 'narrow';
        } else if (maxWidth >= 1000) {
            infoData.appearance.siteWidth = 'wide';  
        } else {
            infoData.appearance.siteWidth = 'standard';
        }
    }
    
    // Try to detect color scheme by checking for specific color values and patterns
    // Check for coffee theme first (most distinctive new one)
    if (cssContent.includes('bodyBg: \'#F5F1EB\'') || cssContent.includes('background: #F5F1EB') || 
        cssContent.includes('#F5F1EB') || cssContent.includes('#FBF8F2')) {
        infoData.appearance.colorScheme = 'coffee';
    }
    // Check for dark theme
    else if (cssContent.includes('bodyBg: \'#1a1a1a\'') || cssContent.includes('background: #1a1a1a') || 
        cssContent.includes('color: #f0f0f0') || cssContent.includes('#2d2d2d')) {
        infoData.appearance.colorScheme = 'dark';
    }
    // Check for minimalist theme
    else if (cssContent.includes('bodyBg: \'#fafafa\'') || cssContent.includes('background: #fafafa') || 
             cssContent.includes('color: #212529')) {
        infoData.appearance.colorScheme = 'minimalist';
    }
    // Check for imperial theme
    else if (cssContent.includes('bodyBg: \'#F9F5F0\'') || cssContent.includes('background: #F9F5F0') || 
             cssContent.includes('color: #3B2E26')) {
        infoData.appearance.colorScheme = 'imperialAutumn';
    }
    // Check for class trial theme
    else if (cssContent.includes('bodyBg: \'#1c1824\'') || cssContent.includes('background: #1c1824') || 
             cssContent.includes('color: #e5e5e5')) {
        infoData.appearance.colorScheme = 'classTrial';
    }
    // Check for elegant theme (pale pink and jade accents)
    else if (cssContent.includes('#f8f0f5') || cssContent.includes('#f0f4f1') || 
             cssContent.includes('color: #343a40')) {
        infoData.appearance.colorScheme = 'elegant';
    }
    // Default to current
    else {
        infoData.appearance.colorScheme = 'current';
    }
    
    // Try to detect font set by checking font-family declarations
    const bodyFontMatch = cssContent.match(/body\s*\{[^}]*font-family:\s*([^;]+);/i);
    if (bodyFontMatch) {
        const fontFamily = bodyFontMatch[1].toLowerCase();
        
        if (fontFamily.includes('helvetica') || fontFamily.includes('arial')) {
            // Check if it's mixed (UI fonts are different)
            if (cssContent.includes('font-family: \'Inter\'') || cssContent.includes('georgia')) {
                infoData.appearance.fontSet = 'mixed';
            } else {
                infoData.appearance.fontSet = 'sans';
            }
        } else if (fontFamily.includes('georgia')) {
            infoData.appearance.fontSet = 'serif';
        }
    }

    // Try to detect button style by checking button CSS patterns
    // Try to detect button style by checking button CSS patterns
    if (cssContent.includes('border-radius: 0') && cssContent.includes('.overview-link-btn')) {
        infoData.appearance.buttonStyle = 'sharp';
    } else if (cssContent.includes('border-radius: 20px') && cssContent.includes('.overview-link-btn')) {
        infoData.appearance.buttonStyle = 'pill';
    } else if (cssContent.includes('border-radius: 2px') && cssContent.includes('.overview-link-btn')) {
        infoData.appearance.buttonStyle = 'subtle';
    } else {
        infoData.appearance.buttonStyle = 'rounded'; // default
    }
    
    // Try to detect container style by checking world-item CSS patterns
    if (cssContent.includes('border-left: 4px solid') && cssContent.includes('.world-item')) {
        infoData.appearance.containerStyle = 'left-border';
    } else if (cssContent.includes('border: 2px solid') && cssContent.includes('.world-item') && cssContent.includes('border-radius: 8px')) {
        infoData.appearance.containerStyle = 'outlined';
    } else if (cssContent.includes('box-shadow: 0 6px 16px') && cssContent.includes('border-top: 5px solid')) {
        infoData.appearance.containerStyle = 'cards';
    } else if (cssContent.includes('background: transparent') && cssContent.includes('.world-item')) {
        infoData.appearance.containerStyle = 'minimal';
    } else if (cssContent.includes('border-radius: 8px') && cssContent.includes('background:') && cssContent.includes('.world-item.locations')) {
        infoData.appearance.containerStyle = 'outlined-bg';
    } else if (cssContent.includes('border-radius: 0') && cssContent.includes('border: none') && cssContent.includes('.world-item.locations')) {
        infoData.appearance.containerStyle = 'solid-bg';
    }
    
    // Try to detect subcontainer style by checking info-section CSS patterns
    if (cssContent.includes('border-radius: 30px') && cssContent.includes('.info-section')) {
        infoData.appearance.subcontainerStyle = 'pills';
    } else if (cssContent.includes('border-style: solid') && cssContent.includes('border-style: dashed') && cssContent.includes('.info-section')) {
        infoData.appearance.subcontainerStyle = 'outlined';
    } else if (cssContent.includes('border-left: 8px solid') && cssContent.includes('.info-section')) {
        infoData.appearance.subcontainerStyle = 'stripes';
    } else if (cssContent.includes('border-bottom: 1px dotted') && cssContent.includes('.info-section')) {
        infoData.appearance.subcontainerStyle = 'minimal';
    } else {
        infoData.appearance.subcontainerStyle = 'soft-bg';
    }
}

function migrateEmbeddedAppearanceData(appearanceData) {
    // Ensure all new properties exist with defaults
    if (!appearanceData.overviewStyle && !appearanceData.navigationStyle) {
        // If we have the old template, migrate it
        if (appearanceData.template) {
            appearanceData.overviewStyle = appearanceData.template;
            appearanceData.navigationStyle = appearanceData.template;
            delete appearanceData.template;
        }
    }
    if (!appearanceData.cardStyle) {
        appearanceData.cardStyle = 'current';
    }
    // If embedded data has old template but not new styles, migrate it
    if (appearanceData.template && (!appearanceData.overviewStyle || !appearanceData.navigationStyle)) {
        console.log('Migrating embedded appearance data template:', appearanceData.template);
        appearanceData.overviewStyle = appearanceData.template;
        appearanceData.navigationStyle = appearanceData.template;
        delete appearanceData.template;
    }
    
    if (!appearanceData.worldCategoriesHeader) {
        appearanceData.worldCategoriesHeader = 'default';
    }
    if (!appearanceData.pageHeader) {
        appearanceData.pageHeader = 'standard';
    }

    return appearanceData;
}

// Function to handle template migration in any context (ADD this helper)
function migrateTemplateInAnyData(data) {
    if (data && data.appearance && data.appearance.template && (!data.appearance.overviewStyle || !data.appearance.navigationStyle)) {
        console.log('Migrating template setting:', data.appearance.template);
        data.appearance.overviewStyle = data.appearance.template;
        data.appearance.navigationStyle = data.appearance.template;
        delete data.appearance.template;
    }
    return data;
}

function extractCharacters(doc) {
    // Clear existing characters
    infoData.characters = [];
    
    // Try to extract from JavaScript data first (includes notes and tags!)
    const scripts = doc.querySelectorAll('script');
    let charactersData = null;
    
    scripts.forEach(script => {
        const scriptContent = script.textContent;
        const match = scriptContent.match(/var charactersData = (\[.*?\]);/s);
        if (match) {
            try {
                charactersData = JSON.parse(match[1]);
                console.log('Found embedded characters data with notes and tags:', charactersData.map(c => ({
                    name: c.name, 
                    hasNotes: !!c.notes,
                    tagCount: c.tags ? c.tags.length : 0
                })));
            } catch (e) {
                console.log('Could not parse characters data from script');
            }
        }
    });
    
    if (charactersData && Array.isArray(charactersData)) {
        infoData.characters = charactersData;
        console.log('Successfully restored character data including notes and tags from embedded JavaScript');
    } else {
        // Fallback: extract from character cards (notes and most tags will be lost)
        console.log('No embedded character data found, parsing from HTML (notes and full tag lists will be lost)');
        const characterCards = doc.querySelectorAll('.character-card');
        characterCards.forEach((card, index) => {
            const character = extractCharacterFromCard(card, doc, index);
            if (character) {
                infoData.characters.push(character);
            }
        });
    }
}

function extractCharacterFromCard(card, doc, index) {
    const character = {
        name: '',
        fullName: '',
        title: '',
        age: '',
        image: '',
        tags: [], // NEW: Initialize tags array
        faction: '',
        basic: '',
        physical: '',
        personality: '',
        sexuality: '',
        fightingStyle: '',
        background: '',
        equipment: '',
        hobbies: '',
        quirks: '',
        relationships: '',
        notes: '', // Will be empty when parsing from HTML since notes aren't displayed
        gallery: []
    };
    
    // Get character name
    const nameElement = card.querySelector('.character-name');
    if (nameElement) {
        character.name = nameElement.textContent.trim();
    }
    
    // Get main image
    const imageElement = card.querySelector('.character-image');
    if (imageElement && imageElement.tagName === 'IMG') {
        character.image = imageElement.getAttribute('src') || '';
    }
    
    // NEW: Try to extract visible tags from character card
    const tagElements = card.querySelectorAll('.character-card-tag');
    if (tagElements.length > 0) {
        tagElements.forEach(tagEl => {
            const tagText = tagEl.textContent.trim();
            // Skip the "+X" tag that indicates more tags
            if (!tagText.startsWith('+')) {
                character.tags.push(tagText);
            }
        });
        console.log(`Extracted visible tags for ${character.name}:`, character.tags);
    }
    
    // Try to extract detailed info from modal
    const modal = doc.querySelector(`#characterModal${index}`);
    if (modal) {
        character.basic = extractInfoSectionText(modal, 'Basic Information');
        character.physical = extractInfoSectionText(modal, 'Physical Description');
        character.personality = extractInfoSectionText(modal, 'Personality');
        character.sexuality = extractInfoSectionText(modal, 'Sexuality');
        character.fightingStyle = extractInfoSectionText(modal, 'Fighting Style');
        character.background = extractInfoSectionText(modal, 'Background');
        character.equipment = extractInfoSectionText(modal, 'Weapons/Armor/Equipment');
        character.hobbies = extractInfoSectionText(modal, 'Hobbies/Pastimes');
        character.quirks = extractInfoSectionText(modal, 'Quirks/Mannerisms');
        character.relationships = extractInfoSectionText(modal, 'Relationships');
        
        // Note: Tags are no longer displayed in modals, only on character cards
        // Complete tag data can only be recovered from embedded JavaScript data
        
        // Note: Notes section is intentionally not extracted since it doesn't appear in generated HTML
        // Notes can only be recovered from embedded JavaScript data
        
        // Extract gallery images
        const galleryImages = modal.querySelectorAll('.gallery-image');
        character.gallery = Array.from(galleryImages).map(img => img.getAttribute('src')).filter(src => src);
    }
    
    return character.name ? character : null;
}

function extractStorylines(doc) {
    // Clear existing storylines
    infoData.storylines = [];
    
    // Extract from storyline cards
    const storylineCards = doc.querySelectorAll('.storyline-card');
    storylineCards.forEach(card => {
        const storyline = extractStorylineFromCard(card);
        if (storyline) {
            infoData.storylines.push(storyline);
        }
    });
}

function extractStorylineFromCard(card) {
    const storyline = {
        title: '',
        pairing: '',
        type: 'roleplay', // Default type
        wordcount: 0,
        description: '',
        lastUpdated: '',
        link: ''
    };
    
    // Get type from data attribute - this is the key addition
    const typeAttr = card.getAttribute('data-type');
    if (typeAttr) {
        storyline.type = typeAttr;
    }
    
    // Get title - prefer title attribute for accuracy
    const titleElement = card.querySelector('.storyline-title');
    if (titleElement) {
        storyline.title = titleElement.getAttribute('title') || titleElement.textContent.trim();
    }
    
    // Get pairing
    const pairingElement = card.querySelector('.storyline-pairing');
    if (pairingElement) {
        storyline.pairing = pairingElement.textContent.trim();
    }
    
    // Get wordcount
    const wordcountElement = card.querySelector('.storyline-wordcount');
    if (wordcountElement) {
        const wordcountText = wordcountElement.textContent.trim();
        // Extract numbers from text like "123,456 words"
        const wordcountMatch = wordcountText.match(/[\d,]+/);
        if (wordcountMatch) {
            storyline.wordcount = parseInt(wordcountMatch[0].replace(/,/g, '')) || 0;
        }
    }
    
    // Get description - prefer title attribute for full text
    const descElement = card.querySelector('.storyline-description');
    if (descElement) {
        // Try title attribute first (clean text), then fall back to innerHTML
        storyline.description = descElement.getAttribute('title') || htmlToMarkdown(descElement.innerHTML);
    }
    
    // Get last updated
    const updatedElement = card.querySelector('.storyline-updated');
    if (updatedElement) {
        const updatedText = updatedElement.textContent.trim();
        storyline.lastUpdated = updatedText.replace(/^Updated:\s*/, '');
    }
    
    // Get link - extract from onclick attribute
    const cardElement = card.closest ? card : card.parentElement;
    const onclickAttr = cardElement.getAttribute('onclick');
    if (onclickAttr) {
        const linkMatch = onclickAttr.match(/window\.location\.href='([^']+)'/);
        if (linkMatch) {
            storyline.link = linkMatch[1];
        }
    }
    
    // NEW: Auto-detect and migrate project links for backward compatibility
    if (!storyline.hasOwnProperty('isProjectLink')) {
        if (storyline.link) {
            // Auto-detect if it's a project link
            if (storyline.link.startsWith('roleplays/')) {
                storyline.isProjectLink = true;
                // Store just the filename, remove the roleplays/ prefix
                storyline.link = storyline.link.replace('roleplays/', '');
            } else if (storyline.link.match(/^[^\/\s]+\.html$/)) {
                // Looks like just a filename (no slashes, ends with .html)
                storyline.isProjectLink = true;
            } else {
                // Assume external URL
                storyline.isProjectLink = false;
            }
        } else {
            storyline.isProjectLink = false;
        }
    }

    return storyline.title ? storyline : null;
}

// NEW: Extract Plans from HTML
function extractPlans(doc) {
    // Clear existing plans
    infoData.plans = [];
    
    console.log('Extracting plans from HTML...');
    
    // Try to extract from JavaScript data first (includes full event data!)
    const scripts = doc.querySelectorAll('script');
    let plansData = null;
    
    scripts.forEach(script => {
        const scriptContent = script.textContent;
        
        // Try multiple patterns to find the plans data
        let match = scriptContent.match(/var plansData = (\[[\s\S]*?\]);/);
        if (!match) {
            // Try alternative pattern
            match = scriptContent.match(/plansData\s*=\s*(\[[\s\S]*?\]);/);
        }
        
        if (match) {
            try {
                plansData = JSON.parse(match[1]);
                console.log('Found embedded plans data with events:', plansData.map(p => ({title: p.title, events: p.events?.length || 0})));
            } catch (e) {
                console.log('Could not parse plans data from script:', e);
                console.log('Raw match was:', match[1].substring(0, 200) + '...');
            }
        }
    });
    
    if (plansData && Array.isArray(plansData)) {
        infoData.plans = plansData;
        console.log('Successfully restored plans data including events from embedded JavaScript');
    } else {
        // Fallback: extract from plan cards (limited data, events details will be lost)
        console.log('No embedded plans data found, parsing from HTML (event details will be lost)');
        const planCards = doc.querySelectorAll('.plan-card');
        console.log('Found plan cards:', planCards.length);
        
        planCards.forEach((card, index) => {
            const plan = extractPlanFromCard(card, doc, index);
            if (plan) {
                console.log('Extracted plan:', plan.title, 'with', plan.events.length, 'events');
                infoData.plans.push(plan);
            }
        });
    }
    
    console.log('Final plans extracted:', infoData.plans.length);
}

function extractPlanFromCard(card, doc, index) {
    const plan = {
        title: '',
        overview: '',
        characterTags: [],
        events: []
    };
    
    // Get title - prefer title attribute for accuracy
    const titleElement = card.querySelector('.plan-title');
    if (titleElement) {
        plan.title = titleElement.getAttribute('title') || titleElement.textContent.trim();
    }
    
    // Get character tags
    const characterTagsElement = card.querySelector('.plan-character-tags');
    if (characterTagsElement) {
        const tags = characterTagsElement.querySelectorAll('.character-tag');
        plan.characterTags = Array.from(tags).map(tag => tag.textContent.trim()).filter(tag => tag);
    }
    
    // Get overview - now extract from title attribute if available for better accuracy
    const overviewElement = card.querySelector('.plan-overview');
    if (overviewElement) {
        // Try to get from title attribute first (clean text), then fall back to innerHTML
        plan.overview = overviewElement.getAttribute('title') || htmlToMarkdown(overviewElement.innerHTML);
    }
    
    // Try to extract events from modal (limited data)
    const modal = doc.querySelector(`#planModal${index}`);
    if (modal) {
        const eventElements = modal.querySelectorAll('.plan-event');
        eventElements.forEach(eventElement => {
            const event = {
                title: '',
                type: 'rising',
                timing: '',
                notes: '',
                visible: true
            };
            
            // Extract event data (this part remains the same as before)
            const titleElement = eventElement.querySelector('.plan-event-title');
            if (titleElement) {
                event.title = titleElement.textContent.trim();
            }
            
            const typeElement = eventElement.querySelector('.plan-event-type');
            if (typeElement) {
                event.type = typeElement.textContent.toLowerCase().trim();
            }
            
            const timingElement = eventElement.querySelector('.plan-event-timing');
            if (timingElement) {
                event.timing = timingElement.textContent.trim();
            }
            
            const notesElement = eventElement.querySelector('.plan-event-notes');
            if (notesElement) {
                event.notes = htmlToMarkdown(notesElement.innerHTML);
            }
            
            if (event.title) {
                plan.events.push(event);
            }
        });
    }
    
    return plan.title ? plan : null;
}

function extractInfoSectionText(modal, sectionTitle) {
    const sections = modal.querySelectorAll('.info-section');
    for (const section of sections) {
        const titleElement = section.querySelector('.info-title');
        if (titleElement && titleElement.textContent.trim() === sectionTitle) {
            const contentDiv = section.querySelector('div:not(.info-title)');
            if (contentDiv) {
                // Use the existing htmlToMarkdown function for consistency
                return htmlToMarkdown(contentDiv.innerHTML);
            }
        }
    }
    return '';
}

function extractWorldInfo(doc) {
    // Clear existing world data - now includes new categories
    infoData.world = {
        general: [],
        locations: [],
        concepts: [],
        events: [],
        creatures: [],
        plants: [],
        items: [],
        skills: [], 
        factions: [],
        culture: [],
        cultivation: [],
        magic: []
    };
    
    // Try to extract from embedded JavaScript data first (includes hidden items!)
    const scripts = doc.querySelectorAll('script');
    let worldDataFound = false;
    
    scripts.forEach(script => {
        const scriptContent = script.textContent;
        
        // Look for the full embedded data first
        const fullDataMatch = scriptContent.match(/var fullInfoData = (\{.*?\});/s);
        if (fullDataMatch) {
            try {
                const fullData = JSON.parse(fullDataMatch[1]);
                console.log('Found embedded full data including hidden items:', fullData);
                
                if (fullData.world) {
                    infoData.world = fullData.world;
                    worldDataFound = true;
                    console.log('Successfully restored world data with hidden items from embedded data');
                    return;
                }
            } catch (e) {
                console.log('Could not parse full data from script:', e);
            }
        }
    });
    
    if (worldDataFound) {
        console.log('Used embedded world data including hidden items');
        return;
    }
    
    console.log('No embedded data found, falling back to HTML parsing (hidden items will be lost)');
    
    // Fallback: Extract from visible HTML sections (will lose hidden items)
    const worldSections = doc.querySelectorAll('#world .world-section');
    
    worldSections.forEach(section => {
        const titleElement = section.querySelector('.section-title');
        if (!titleElement) return;
        
        const sectionTitle = titleElement.textContent.trim().toLowerCase();
        let category = '';
        
        // Map section titles to categories - including new ones
        switch (sectionTitle) {
            case 'general':
                category = 'general';
                break;
            case 'locations':
                category = 'locations';
                break;
            case 'concepts':
                category = 'concepts';
                break;
            case 'events':
                category = 'events';
                break;
            case 'creatures':
                category = 'creatures';
                break;
            case 'plants':
                category = 'plants';
                break;
            case 'items':
                category = 'items';
                break;
            case 'factions':
                category = 'factions';
                break;
            case 'culture':
                category = 'culture';
                break;
            case 'cultivation':
                category = 'cultivation';
                break;
            case 'magic':
                category = 'magic';
                break;
            default:
                return; // Skip unknown sections
        }
        
        // Extract items from this section
        const items = section.querySelectorAll('.world-item');
        items.forEach(itemElement => {
            const item = extractWorldItem(itemElement, category);
            if (item) {
                infoData.world[category].push(item);
            }
        });
    });
}

// Helper function to convert display status text back to internal value
function getStatusInternalValue(displayText) {
    const statusMap = {
        'Idea': 'idea',
        'Tentative': 'tentative', 
        'Brainstorm': 'brainstorm',
        'Draft': 'draft',
        'In Progress': 'in-progress',
        'Developing': 'developing',
        'Canon': 'canon',
        'Established': 'established',
        'Final': 'final',
        'Placeholder': 'placeholder',
        'Needs Work': 'needs-work',
        'Deprecated': 'deprecated',
        'Unused': 'unused',
        'Archived': 'archived'
    };
    
    return statusMap[displayText] || displayText.toLowerCase().replace(/\s+/g, '-');
}

function extractWorldItem(itemElement, category) {
    const item = {
        name: '',
        category: '',
        status: '',
        hidden: false,
        image: '',
        description: '',
        properties: '',
        connections: '',
        tags: []
    };
    
    // Get item name and status
    const nameElement = itemElement.querySelector('.item-name');
    if (nameElement) {
        // Look for the first span element containing the name
        const nameSpan = nameElement.querySelector('span:not(.status-badge)');
        if (nameSpan) {
            item.name = nameSpan.textContent.trim();
        } else {
            // Fallback: get all text but remove status badge text
            const statusBadge = nameElement.querySelector('.status-badge');
            if (statusBadge) {
                const nameText = nameElement.textContent.replace(statusBadge.textContent, '').trim();
                item.name = nameText;
            } else {
                item.name = nameElement.textContent.trim();
            }
        }
        
        // Extract status from status badge and convert to internal value
        const statusBadge = nameElement.querySelector('.status-badge');
        if (statusBadge) {
            const statusDisplayText = statusBadge.textContent.trim();
            item.status = getStatusInternalValue(statusDisplayText);
        }
    }
    
    // Get item type/category
    const typeElement = itemElement.querySelector('.item-type');
    if (typeElement) {
        let typeText = typeElement.textContent.trim();
        // Remove "Type: " prefix if it exists
        if (typeText.startsWith('Type: ')) {
            typeText = typeText.substring(6);
        }
        item.category = typeText;
    }
    
    // Get image
    const imageElement = itemElement.querySelector('.world-item-image');
    if (imageElement) {
        item.image = imageElement.getAttribute('src') || '';
    }
    
    // Get description
    const descElement = itemElement.querySelector('.item-description');
    if (descElement) {
        item.description = htmlToMarkdown(descElement.innerHTML);
    }
    
    // Get properties/features from info sections
    const infoSections = itemElement.querySelectorAll('.info-section');
    infoSections.forEach(section => {
        const labelElement = section.querySelector('.item-label');
        if (labelElement) {
            const labelText = labelElement.textContent.trim();
            const contentElement = section.querySelector('div:not(.item-label)');
            if (contentElement) {
                const content = htmlToMarkdown(contentElement.innerHTML);
                
                if (labelText.includes('Notable Features') || labelText.includes('Properties') || labelText.includes('Characteristics')) {
                    item.properties = content;
                } else if (labelText.includes('Related Information') || labelText.includes('Connections')) {
                    item.connections = content;
                }
            }
        }
    });
    
    // Handle location-specific fields
    if (category === 'locations') {
        // For locations, map properties to features and add type field
        if (item.properties) {
            item.features = item.properties;
            delete item.properties;
        }
        if (item.category) {
            item.type = item.category;
            delete item.category;
        }
    }
    
    return item.name ? item : null;
}

function htmlToMarkdown(html) {
    if (!html) return '';
    
    return html
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<u>(.*?)<\/u>/g, '++$1++')
        .replace(/<span class="spoiler" onclick="toggleSpoiler\(this\)">(.*?)<\/span>/g, '<spoiler>$1</spoiler>')
        .replace(/<del>(.*?)<\/del>/g, '~~$1~~')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<\/p><p>/g, '\n\n')
        .replace(/<\/?p>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

// Export functions for JSON backup/restore (now includes appearance, notes, plans, character tags, subtitle, and overview fields)
function exportData() {
    const data = collectFormData();
    const jsonData = JSON.stringify(data, null, 2);
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData));
    element.setAttribute('download', 'world-data.json');
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function importData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                backupMadeThisSession = false;
                const data = JSON.parse(e.target.result);
                
                // Ensure new overview fields AND subtitle exist with defaults
                if (!data.basic) {
                    data.basic = {};
                }
                if (!data.basic.hasOwnProperty('overviewTitle')) {
                    data.basic.overviewTitle = '';
                }
                if (!data.basic.hasOwnProperty('overviewImage')) {
                    data.basic.overviewImage = '';
                }
                if (!data.basic.hasOwnProperty('subtitle')) {
                    data.basic.subtitle = '';
                }

                // Ensure custom navigation data exists with defaults
                if (!data.basic.hasOwnProperty('customNavLinks')) {
                    data.basic.customNavLinks = [];
                }
                if (!data.basic.hasOwnProperty('customNavSettings')) {
                    data.basic.customNavSettings = {
                        location: null,
                        alignment: null,
                        spacing: null,
                        position: null
                    };
                }
                
                // Ensure appearance data exists
                if (!data.appearance) {
                    data.appearance = {
                        overviewStyle: 'journal',      
                        navigationStyle: 'journal', 
                        colorScheme: 'current',
                        fontSet: 'serif',
                        worldCategoriesHeader: 'default',
                        pageHeader: 'standard',
                        storylineStyle: 'default',
                        containerStyle: 'left-border',
                        subcontainerStyle: 'soft-bg',
                        infodisplayStyle: 'default',
                        bannerSize: 'large',
                        buttonStyle: 'rounded',
                        siteWidth: 'standard' 
                    };
                }
                
                // Ensure plans data exists
                if (!data.plans) {
                    data.plans = [];
                }

                if (!data.playlists) {
                    data.playlists = [];
                }

                // Ensure custom pages exists
                if (!data.customPages) {
                    data.customPages = [];
                }
                
                // Ensure new world categories exist
                // Ensure new world categories exist
                if (!data.world.general) {
                    data.world.general = [];
                }
                if (!data.world.culture) {
                    data.world.culture = [];
                }
                if (!data.world.cultivation) {
                    data.world.cultivation = [];
                }
                if (!data.world.magic) {
                    data.world.magic = [];
                }
                
                // Ensure characters have all required fields including notes and tags
                if (data.characters && Array.isArray(data.characters)) {
                    data.characters.forEach(character => {
                        if (!character.hasOwnProperty('fullName')) {
                            character.fullName = ''; 
                        }
                        if (!character.hasOwnProperty('age')) {
                            character.age = ''; 
                        }
                        if (!character.hasOwnProperty('title')) {
                            character.title = ''; 
                        }
                        if (!character.hasOwnProperty('fightingStyle')) {
                            character.fightingStyle = '';
                        }
                        if (!character.hasOwnProperty('notes')) {
                            character.notes = '';
                        }
                        if (!character.hasOwnProperty('tags')) { // NEW: Ensure tags exist
                            character.tags = [];
                        }
                        // ADD THIS:
                        if (!character.hasOwnProperty('faction')) {
                            character.faction = '';
                        }
                    });
                }
                
                // NEW: Migrate storylines to include isProjectLink boolean
                if (data.storylines && Array.isArray(data.storylines)) {
                    data.storylines.forEach(storyline => {
                        // Ensure storyline has the isProjectLink field
                        if (!storyline.hasOwnProperty('isProjectLink')) {
                            if (storyline.link) {
                                // Auto-detect based on link format
                                if (storyline.link.startsWith('roleplays/')) {
                                    storyline.isProjectLink = true;
                                    // Store just the filename
                                    storyline.link = storyline.link.replace('roleplays/', '');
                                } else if (storyline.link.match(/^[^\/\s]+\.html$/)) {
                                    // Just a filename
                                    storyline.isProjectLink = true;
                                } else {
                                    // External URL
                                    storyline.isProjectLink = false;
                                }
                            } else {
                                storyline.isProjectLink = false;
                            }
                        }
                    });
                }
                
                // Ensure plans have all required fields
                if (data.plans && Array.isArray(data.plans)) {
                    data.plans.forEach(plan => {
                        if (!plan.hasOwnProperty('title')) {
                            plan.title = '';
                        }
                        if (!plan.hasOwnProperty('overview')) {
                            plan.overview = '';
                        }
                        if (!plan.hasOwnProperty('characterTags')) {
                            plan.characterTags = [];
                        }
                        if (!plan.hasOwnProperty('events')) {
                            plan.events = [];
                        }
                        
                        // Ensure all events have required fields
                        if (Array.isArray(plan.events)) {
                            plan.events.forEach(event => {
                                if (!event.hasOwnProperty('title')) {
                                    event.title = '';
                                }
                                if (!event.hasOwnProperty('type')) {
                                    event.type = 'rising';
                                }
                                if (!event.hasOwnProperty('timing')) {
                                    event.timing = '';
                                }
                                if (!event.hasOwnProperty('notes')) {
                                    event.notes = '';
                                }
                                if (!event.hasOwnProperty('visible')) {
                                    event.visible = true;
                                }
                            });
                        }
                    });
                }

                // Ensure all characters have all required fields including new card fields
                if (data.characters && Array.isArray(data.characters)) {
                    data.characters.forEach(character => {
                        // ... existing field checks ...
                        if (!character.hasOwnProperty('cardEnabled')) {
                            character.cardEnabled = false;
                        }
                        if (!character.hasOwnProperty('cardPath')) {
                            character.cardPath = '';
                        }
                    });
                }
                
                // Ensure all world items have hidden field, tags, and IDs
                Object.keys(data.world).forEach(category => {
                    if (Array.isArray(data.world[category])) {
                        data.world[category].forEach(item => {
                            if (!item.hasOwnProperty('hidden')) {
                                item.hidden = false;
                            }
                            if (!item.hasOwnProperty('tags')) {
                                item.tags = [];
                            }
                            // **ADD THIS: Ensure all items have IDs**
                            if (!item.hasOwnProperty('id') || !item.id) {
                                item.id = generateWorldItemIdForImport(category, data.world[category]);
                            }
                            if (!character.hasOwnProperty('skills')) {
                                character.skills = [];
                            }
                        });
                    }
                });

                // Ensure all locations have tags field
                if (data.world && data.world.locations && Array.isArray(data.world.locations)) {
                    data.world.locations.forEach(location => {
                        if (!location.hasOwnProperty('tags')) {
                            location.tags = [];
                        }
                    });
                }
                
                infoData = data;
                // DON'T import userTimeSystems - they should always come from backend
                // if (data.userTimeSystems) {
                //     userTimeSystems = data.userTimeSystems;
                // }
                window.updateAllContentLists();

                // Reload user calendars from backend and refresh dropdown
                if (typeof loadUserTimeSystems === 'function') {
                    loadUserTimeSystems().then(() => {
                        if (typeof populateTimeSystemsDropdown === 'function') {
                            populateTimeSystemsDropdown();
                        }
                    });
                }
                
                if (typeof showStatus === 'function') {
                    showStatus('success', 'Data imported successfully!');
                } else {
                    alert('Data imported successfully!');
                }
            } catch (error) {
                if (typeof showStatus === 'function') {
                    showStatus('error', 'Error importing data: Invalid JSON file');
                } else {
                    alert('Error importing data: Invalid JSON file');
                }
            }
        };
        reader.readAsText(file);
    };
    
    fileInput.click();
}

// Helper to generate IDs during import
function generateWorldItemIdForImport(category, items) {
    const prefixMap = {
        'locations': 'loc',
        'concepts': 'concept',
        'events': 'event',
        'creatures': 'creature',
        'plants': 'plant',
        'items': 'item',
        'factions': 'faction',
        'culture': 'culture',
        'cultivation': 'cultivation',
        'magic': 'magic',
        'general': 'general'
    };
    
    const prefix = prefixMap[category] || category;
    
    const existingIds = items
        .filter(item => item.id)
        .map(item => parseInt(item.id.replace(`${prefix}_`, '')))
        .filter(id => !isNaN(id));
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `${prefix}_${maxId + 1}`;
}

// Make functions globally available
window.parseImportedHTML = parseImportedHTML;
window.exportData = exportData;
window.importData = importData;