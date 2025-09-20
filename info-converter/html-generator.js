import fontSets from './templates/font-sets.js';
import titleFonts from './templates/titlefonts.js';

// Main HTML Generation Functions - Reduced size version
// CSS generation moved to css-generator.js
// Add this function to check if we need to copy style assets
function getRequiredStyleAssets(data) {
    const assets = [];
    
    // Get appearance settings
    const appearance = data.appearance || {};
    
    // Check if wuxia container style is being used
    if (appearance.containerStyle === 'wuxia') {
        assets.push({
            source: 'images/styles/cloudrecesses.png',
            destination: 'images/styles/cloudrecesses.png'
        });
    }
    
    // Check if wuxia subcontainer style is being used (for mist overlay)
    if (appearance.subcontainerStyle === 'wuxia') {
        assets.push({
            source: 'images/styles/mist.png',
            destination: 'images/styles/mist.png'
        });
    }
    
    // Check if wuxia overview style is being used (for both mist overlay and animated fog)
    if (appearance.overviewStyle === 'wuxia') {
        assets.push({
            source: 'images/styles/mist.png',
            destination: 'images/styles/mist.png'
        });
        assets.push({
            source: 'images/styles/fog.png',
            destination: 'images/styles/fog.png'
        });
    }
    
    return assets;
}

function generateGoogleFontLinks() {
    try {
        let allGoogleFonts = [];
        
        // Get fonts from appearance font set
        if (typeof getAppearanceSettings === 'function' && typeof fontSets !== 'undefined') {
            const appearance = getAppearanceSettings();
            const fontSet = fontSets[appearance.fontSet];
            if (fontSet && fontSet.googleFonts) {
                allGoogleFonts.push(...fontSet.googleFonts);
            }
        }
        
        // Get fonts from title font set
        if (typeof infoData !== 'undefined' && infoData.basic && infoData.basic.titleSettings) {
            const titleFontKey = infoData.basic.titleSettings.font;
            if (titleFontKey && titleFontKey !== 'theme' && typeof titleFonts !== 'undefined') {
                const titleFontSet = titleFonts[titleFontKey];
                if (titleFontSet && titleFontSet.googleFonts) {
                    allGoogleFonts.push(...titleFontSet.googleFonts);
                }
            }
        }
        
        // Remove duplicates and create URL
        if (allGoogleFonts.length > 0) {
            const uniqueFonts = [...new Set(allGoogleFonts)];
            const families = uniqueFonts.join('&family=');
            const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
            return `    <link href="${googleFontsUrl}" rel="stylesheet">`;
        }
        
        return '';
    } catch (error) {
        console.error('Error generating Google Font links:', error);
        return '';
    }
}

// Main HTML generation function - now uses external CSS generator
function generateHTML() {
    console.log('🔄 Starting HTML generation...');
    console.log('Current infoData:', window.infoData || infoData);
    
    // Collect current form data
    const data = collectFormData();
    console.log('Collected form data:', data);

    // Generate Google Font links if needed (with error handling)
    let googleFontLinks = '';
    try {
        googleFontLinks = generateGoogleFontLinks();
    } catch (error) {
        console.error('Error with Google Font links:', error);
        googleFontLinks = ''; // fallback to empty string
    }

    // Add FontAwesome support
    const fontAwesomeLink = `    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">`;
    
    // Generate HTML template
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.basic.title || 'World Information'}</title>
    ${googleFontLinks}
    ${fontAwesomeLink}
    <style>
        ${generateCSS()}
    </style>
</head>
<body>
    ${generateHeader(data)}
    ${generateNavigation(data)}
    ${generateContent(data)}
    ${generateSiteNavigation(data)}
    ${generateModals(data)}
    ${generateJavaScript()}
</body>
</html>`;

    // Display in output
    document.getElementById('html-output').value = html;
    
    // Update state: HTML has been generated and data is now "clean"
    window.htmlGenerated = true;
    window.dataModified = false;

    window.updateQuickOpenState(); // ADD THIS LINE
    updateSaveButtonState();

    return html;
}

// Function to update save button state
function updateSaveButtonState() {
    const saveToSitesBtn = document.getElementById('save-to-sites-btn');
    if (!saveToSitesBtn || !isLocal) return;
    
    const shouldEnable = window.htmlGenerated && !window.dataModified;
    
    saveToSitesBtn.disabled = !shouldEnable;
    
    // Update button appearance and tooltip
    if (shouldEnable) {
        saveToSitesBtn.style.opacity = '1';
        saveToSitesBtn.style.cursor = 'pointer';
        saveToSitesBtn.title = 'Save to Folder';
        saveToSitesBtn.textContent = 'Save to Folder';
    } else {
        saveToSitesBtn.style.opacity = '0.5';
        saveToSitesBtn.style.cursor = 'not-allowed';
        if (!window.htmlGenerated) {
            saveToSitesBtn.title = 'Generate HTML first before saving';
            saveToSitesBtn.textContent = 'Generate HTML First';
        } else if (window.dataModified) {
            saveToSitesBtn.title = 'Regenerate HTML - data has been modified';
            saveToSitesBtn.textContent = 'Regenerate HTML First';
        }
    }
}

// Function to mark data as modified
window.markDataAsModified = function() {
    if (window.htmlGenerated) {
        window.dataModified = true;
        updateSaveButtonState();
    }
}

// Find the generateHeader function and update it:
function generateHeader(data) {
    const titleSettings = data.basic.titleSettings || { show: true, alignment: 'left', position: 'bottom' };
    
    // Generate banner content
    const bannerContent = data.basic.banner 
        ? `<img src="${data.basic.banner}" alt="Banner" class="banner-image">`
        : `<div class="banner-placeholder">
               <span>${data.basic.title || 'World Information'}</span>
           </div>`;

    // Only generate title/subtitle HTML if show is true
    let titleOverlayContent = '';
    if (titleSettings.show) {
        const subtitleHTML = data.basic.subtitle 
            ? `<div class="main-subtitle">${data.basic.subtitle}</div>` 
            : '';
            
        titleOverlayContent = `
            <div class="title-overlay title-alignment-${titleSettings.alignment || 'left'} title-position-${titleSettings.position || 'bottom'}">
                <h1 class="main-title">${data.basic.title || 'World Information'}</h1>
                ${subtitleHTML}
            </div>`;
    }

    // ADD: Generate banner navigation if location is 'banner'
    let bannerNavigationHTML = '';
    if (data.basic.customNavSettings && data.basic.customNavSettings.location === 'banner') {
        bannerNavigationHTML = generateCustomNavigationHTML(data);
    }

    return `
    <div class="container">
        <header class="header">
            ${bannerContent}
            ${titleOverlayContent}
            ${bannerNavigationHTML}
        </header>`;
}

function generateNavigation(data) {
    const includedPages = data.basic.includedPages || {};
    
    let navHTML = `
        <nav class="nav-tabs">
            <button class="nav-tab active" id="overview-tab" data-page="overview" onclick="showTab('overview')">Overview</button>`;
    
    if (includedPages.world !== false) {
        navHTML += `<button class="nav-tab" id="world-tab" data-page="world" onclick="showTab('world')">World</button>`;
    }
    if (includedPages.characters !== false) {
        navHTML += `<button class="nav-tab" id="characters-tab" data-page="characters" onclick="showTab('characters')">Characters</button>`;
    }
    if (includedPages.storylines !== false) {
        navHTML += `<button class="nav-tab" id="storylines-tab" data-page="storylines" onclick="showTab('storylines')">Storylines</button>`;
    }
    if (includedPages.plans !== false) {
        navHTML += `<button class="nav-tab" id="plans-tab" data-page="plans" onclick="showTab('plans')">Plans</button>`;
    }
    if (includedPages.playlists !== false) {
        navHTML += `<button class="nav-tab" id="playlists-tab" data-page="playlists" onclick="showTab('playlists')">Playlists</button>`;
    }
    
    navHTML += `</nav>`;
    return navHTML;
}

function generateContent(data) {
    const includedPages = data.basic.includedPages || {};
    
    let contentHTML = generateOverviewContent(data); // Overview always included
    
    if (includedPages.world !== false) {
        contentHTML += generateWorldContent(data);
    }
    if (includedPages.characters !== false) {
        contentHTML += generateCharactersContent(data);
    }
    if (includedPages.storylines !== false) {
        contentHTML += generateStorylinesContent(data);
    }
    if (includedPages.plans !== false) {
        contentHTML += generatePlansContent(data);
    }
    if (includedPages.playlists !== false) {
        contentHTML += generatePlaylistsContent(data);
    }

    // Custom Pages Content
    // Custom Pages Content
    if (data.customPages && data.customPages.length > 0 && window.customPageTemplates) {
        data.customPages.forEach(page => {
            let pageHTML = window.customPageTemplates.generatePageHTML(page, data);
            // Make sure custom pages are hidden by default
            pageHTML = pageHTML.replace(
                `<div id="${page.name}" class="custom-page-content`,
                `<div id="${page.name}" class="custom-page-content" style="display: none"`
            );
            contentHTML += pageHTML;
        });
    }
    
    return contentHTML;
}

// Updated generateOverviewContent function with title and image support
function generateOverviewContent(data) {
    const overviewTitle = data.basic.overviewTitle || '';
    const overview = data.basic.overview || 'No overview provided for this world.';
    const overviewImage = data.basic.overviewImage || '';
    
    const formattedOverview = parseMarkdown(overview);
    
    // Generate overview links if they exist
    const overviewLinksHTML = generateOverviewLinksHTML(data);
    
    // Generate the title HTML if provided
    const titleHTML = overviewTitle ? `<h1 class="overview-title">${overviewTitle}</h1>` : '';
    
    // Generate the image HTML if provided
    const imageHTML = overviewImage ? 
        `<div class="overview-image-container">
            <img src="${overviewImage}" alt="Overview" class="overview-image" onclick="openImageModal('${overviewImage}', 'Overview Image')">
        </div>` : '';
    
    return `
        <div id="overview" class="content active">
            ${overviewLinksHTML}
            <div class="overview-content">
                ${titleHTML}
                ${formattedOverview.split('\n\n').map(para => 
                    para.trim() ? `<p>${para.trim()}</p>` : ''
                ).join('\n                ')}
                ${imageHTML}
            </div>
        </div>`;
}

// ADD this new function to html-generator.js:
// ADD this new function to html-generator.js:
function generateOverviewLinksHTML(data) {
    if (!data.basic.overviewLinks || data.basic.overviewLinks.length === 0) {
        return '';
    }
    
    const validLinks = data.basic.overviewLinks.filter(link => 
        link.label && link.label.trim() && link.url && link.url.trim()
    );
    
    if (validLinks.length === 0) {
        return '';
    }
    
    const linksHTML = validLinks.map(link => {
        // Use custom colors if provided, otherwise use default styling
        const customStyle = (link.color && link.color.trim()) || (link.fontColor && link.fontColor.trim())
            ? `style="--custom-bg: ${link.color || '#B1B695'}; background-color: var(--custom-bg); color: ${link.fontColor || '#ffffff'};"` 
            : '';
        
        return `<a href="${link.url}" class="overview-link-btn" ${customStyle}>${escapeHtml(link.label)}</a>`;
    }).join('\n            ');
    
    return `
        <div class="overview-links-container">
            ${linksHTML}
        </div>`;
}

// Generate Custom Navigation HTML
function generateCustomNavigationHTML(data) {
    const customNavSettings = data.basic.customNavSettings;
    const customNavLinks = data.basic.customNavLinks;
    
    if (!customNavSettings || !customNavSettings.location || !customNavLinks || customNavLinks.length === 0) {
        return '';
    }
    
    const validLinks = customNavLinks.filter(link => 
        link.label && link.label.trim() && link.url && link.url.trim()
    );
    
    if (validLinks.length === 0) {
        return '';
    }
    
    const { location } = customNavSettings;
    
    // Generate the buttons HTML
    const linksHTML = validLinks.map(link => {
        const customStyle = (link.color && link.color.trim()) || (link.fontColor && link.fontColor.trim())
            ? `style="background-color: ${link.color || '#B1B695'}; color: ${link.fontColor || '#ffffff'};"` 
            : '';
        
        return `<a href="${link.url}" class="custom-nav-btn" ${customStyle}>${escapeHtml(link.label)}</a>`;
    }).join('\n            ');
    
    // Return HTML with appropriate container class
    const containerClass = `custom-nav-container ${location}-nav`;
    
    return `
        <div class="${containerClass}">
            ${linksHTML}
        </div>`;
}

// Add this new function to generate site-left/right navigation:
function generateSiteNavigation(data) {
    const customNavSettings = data.basic.customNavSettings;
    
    if (!customNavSettings || !customNavSettings.location) {
        return '';
    }
    
    // Only generate for site-left and site-right locations
    if (customNavSettings.location === 'site-left' || customNavSettings.location === 'site-right') {
        return generateCustomNavigationHTML(data);
    }
    
    return '';
}

// Helper function to filter out hidden tags (starting with "!")
function getVisibleTags(tags) {
    if (!Array.isArray(tags)) return [];
    return tags.filter(tag => !tag.startsWith('!'));
}

// Helper function to strip "!" prefix for filtering comparisons
function stripHiddenPrefix(tag) {
    return tag.startsWith('!') ? tag.substring(1) : tag;
}

// NEW: Generate Plans content with Sub-Arcs support
function generatePlansContent(data) {
    return generatePlansContentWithTimeline(data);
}

function generateModals(data) {
    let modalsHTML = '';
    
    // Character modals - EXCLUDE NOTES FROM VISIBLE HTML but INCLUDE TAGS
    if (data.characters && data.characters.length > 0) {
        data.characters.forEach((character, index) => {
            modalsHTML += generateCharacterModal(character, index);
        });
    }
    
    // NEW: Plan modals with Sub-Arcs
    if (data.plans && data.plans.length > 0) {
        data.plans.forEach((plan, index) => {
            modalsHTML += generatePlanModal(plan, index, data);
        });
    }
    
    // Image modal
    modalsHTML += `
        <div id="imageModal" class="image-modal">
            <span class="image-close" onclick="closeImageModal()">&times;</span>
            <div class="image-modal-content">
                <img id="modalImage" src="" alt="">
                <button class="image-nav image-prev" onclick="previousImage()" title="Previous image">&lt;</button>
                <button class="image-nav image-next" onclick="nextImage()" title="Next image">&gt;</button>
            </div>
            <div class="image-counter" id="imageCounter"></div>
        </div>`;
    
    return modalsHTML;
}

function generateCharacterModal(character, index) {
    const mainImage = character.image 
        ? `<div class="character-main-image">
               <img src="${character.image}" alt="${character.name}">
           </div>`
        : `<div class="character-main-image">No Image</div>`;
    
    let modalHTML = `
        <div id="characterModal${index}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${character.name}</h2>
                    <span class="close" onclick="closeCharacterModal(${index})">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="character-modal-grid">
                        <div class="character-header-section">
                            ${mainImage}
                            <div class="character-basic-info">`;

    if (character.basic) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Basic Information</div>
                                    <div class="info-content">${parseMarkdown(character.basic)}</div>
                                </div>`;
    }
    
    modalHTML += `
                            </div>
                        </div>
                        <div class="character-detailed-sections">
                            <div class="character-info">`;
    
    if (character.physical) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Physical Description</div>
                                    <div class="info-content">${parseMarkdown(character.physical)}</div>
                                </div>`;
    }
    
    if (character.personality) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Personality</div>
                                    <div class="info-content">${parseMarkdown(character.personality)}</div>
                                </div>`;
    }
    
    if (character.sexuality) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Sexuality</div>
                                    <div class="info-content">${parseMarkdown(character.sexuality)}</div>
                                </div>`;
    }
    
    if (character.fightingStyle) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Fighting Style</div>
                                    <div class="info-content">${parseMarkdown(character.fightingStyle)}</div>
                                </div>`;
    }
    
    if (character.background) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Background</div>
                                    <div class="info-content">${parseMarkdown(character.background)}</div>
                                </div>`;
    }
    
    if (character.equipment) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Weapons/Armor/Equipment</div>
                                    <div class="info-content">${parseMarkdown(character.equipment)}</div>
                                </div>`;
    }
    
    if (character.hobbies) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Hobbies/Pastimes</div>
                                    <div class="info-content">${parseMarkdown(character.hobbies)}</div>
                                </div>`;
    }
    
    if (character.quirks) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Quirks/Mannerisms</div>
                                    <div class="info-content">${parseMarkdown(character.quirks)}</div>
                                </div>`;
    }
    
    if (character.relationships) {
        modalHTML += `
                                <div class="info-section">
                                    <div class="info-title">Relationships</div>
                                    <div class="info-content">${parseMarkdown(character.relationships)}</div>
                                </div>`;
    }
    
    // NOTE: We intentionally exclude the notes field from the generated HTML
    // The notes are only for development purposes and should not appear in the final page
    
    modalHTML += `
                            </div>
                        </div>
                    </div>`;
    
    // Add gallery if there are gallery images
    if (character.gallery && character.gallery.length > 0) {
        modalHTML += `
                    <div class="character-gallery" data-character-index="${index}">
                        <div class="gallery-title">Gallery</div>`;
        
        character.gallery.forEach((imagePath, imgIndex) => {
            modalHTML += `<img src="${imagePath}" alt="Gallery image" class="gallery-image" onclick="openCharacterGalleryImage(${imgIndex})">`;
        });
        
        modalHTML += `</div>`;
    }
    
    modalHTML += `
                </div>
            </div>
        </div>`;
    
    return modalHTML;
}

// NEW: Generate Plan Modal with Sub-Arcs and Collapsible Notes
function generatePlanModal(plan, index, data = {}) {
    let characterTagsDisplay = '<span style="color: #999; font-style: italic;">No characters tagged</span>';
    if (plan.characterTags && plan.characterTags.length > 0) {
        const visibleCharacterTags = getVisibleTags(plan.characterTags);
        if (visibleCharacterTags.length > 0) {
            characterTagsDisplay = visibleCharacterTags.map(tag => `<span class="character-tag">${tag}</span>`).join('');
        }
    }
    
    let modalHTML = `
        <div id="planModal${index}" class="modal">
            <div class="modal-content plan-modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${plan.title}</h2>
                    <span class="close" onclick="closePlanModal(${index})">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="plan-character-tags" style="margin-bottom: 15px;">
                        <strong>Characters:</strong> ${characterTagsDisplay}
                    </div>
                    
                    <div class="plan-overview" style="margin-bottom: 20px;">
                        <strong>Overview:</strong><br>
                        ${parseMarkdown(plan.overview || 'No overview provided.')}
                    </div>`;
    
    // Add main events list if there are any
    if (plan.events && plan.events.length > 0) {
        const visibleMainEvents = plan.events.filter(event => event.visible !== false);
        
        if (visibleMainEvents.length > 0) {
            modalHTML += `
                    <div class="plan-events-list">
                        <h3 class="plan-events-title">Main Events</h3>`;
            
            visibleMainEvents.forEach((event, eventIndex) => {
                modalHTML += generatePlanEvent(event, eventIndex, data.storylines || [], 'main', index);
            });
            
            modalHTML += `</div>`;
        }
    }
    
    // Add sub-arcs list if there are any
    if (plan.subArcs && plan.subArcs.length > 0) {
        const visibleSubArcs = plan.subArcs.filter(subArc => subArc.visible !== false);
        
        if (visibleSubArcs.length > 0) {
            modalHTML += `
                    <div class="plan-subarcs-list">
                        <h3 class="plan-subarcs-title">Sub-Arcs</h3>`;
            
            visibleSubArcs.forEach((subArc, subArcIndex) => {
                modalHTML += generatePlanSubArc(subArc, subArcIndex, index);
            });
            
            modalHTML += `</div>`;
        }
    }
    
    modalHTML += `
                </div>
            </div>
        </div>`;
    
    return modalHTML;
}

// NEW: Generate Plan Sub-Arc with collapsible events
function generatePlanSubArc(subArc, subArcIndex, planIndex) {
    let characterTagsDisplay = '';
    if (subArc.characterTags && subArc.characterTags.length > 0) {
        const visibleCharacterTags = getVisibleTags(subArc.characterTags);
        if (visibleCharacterTags.length > 0) {
            const characterTags = visibleCharacterTags.map(tag => `<span class="character-tag">${tag}</span>`).join('');
            characterTagsDisplay = `Characters: ${characterTags}`;
        }
    }
    
    let subArcHTML = `
        <div class="plan-subarc ${subArc.visible === false ? 'hidden-subarc' : ''}">
            <div class="plan-subarc-header" onclick="toggleSubArc(${planIndex}, ${subArcIndex})">
                <div class="plan-subarc-header-left">
                    <div class="plan-subarc-title">${subArc.title || 'Untitled Sub-Arc'}</div>
                    <div class="plan-subarc-description">${subArc.description || ''}</div>
                    <div class="plan-subarc-character-tags">${characterTagsDisplay}</div>
                </div>
                <span class="plan-subarc-toggle">▶</span>
            </div>
            <div class="plan-subarc-content collapsed">
                <div class="plan-subarc-events">`;
    
    // Add sub-arc events
    if (subArc.events && subArc.events.length > 0) {
        const visibleEvents = subArc.events.filter(event => event.visible !== false);
        
        if (visibleEvents.length > 0) {
            const storylinesData = window.currentInfoData?.storylines || [];
            visibleEvents.forEach((event, eventIndex) => {
                subArcHTML += generatePlanEvent(event, eventIndex, storylinesData, `subarc-${subArcIndex}`, planIndex);
            });
        } else {
            subArcHTML += `<div style="color: #999; font-style: italic; text-align: center; padding: 20px;">All events are hidden</div>`;
        }
    } else {
        subArcHTML += `<div style="color: #999; font-style: italic; text-align: center; padding: 20px;">No events in this sub-arc</div>`;
    }
    
    subArcHTML += `
                </div>
            </div>
        </div>`;
    
    return subArcHTML;
}

// UPDATED: Move timing from header to bottom section alongside Notes
// UPDATED: generatePlanEvent function with working storyline links
function generatePlanEvent(event, eventIndex, storylinesData = [], context = 'main', planIndex = 0) {
    const eventClass = event.visible === false ? 'plan-event hidden-event' : 'plan-event';
    const hasNotes = event.notes && event.notes.trim();
    const hasTiming = event.timing && event.timing.trim();
    const hasSubevents = event.subevents && event.subevents.length > 0;
    
    // Character tags display - show only visible tags
    let characterTagsDisplay = '';
    if (event.characterTags && event.characterTags.length > 0) {
        const visibleCharacterTags = getVisibleTags(event.characterTags);
        if (visibleCharacterTags.length > 0) {
            const characterTags = visibleCharacterTags.map(tag => `<span class="character-tag">${tag}</span>`).join('');
            characterTagsDisplay = `<div class="plan-event-characters"><span class="characters-label">Characters:</span> ${characterTags}</div>`;
        }
    }
    
    // FIXED: Storylines display with proper link generation
    let storylinesDisplay = '';
    if (event.storylineLinks && event.storylineLinks.length > 0) {
        const storylineLinks = event.storylineLinks
            .filter(storylineTitle => storylineTitle && storylineTitle.trim())
            .map(storylineTitle => {
                const storyline = storylinesData.find(s => s.title === storylineTitle);
                if (storyline && storyline.link) {
                    // Use the same logic as storyline cards
                    let finalLink = '';
                    if (storyline.isProjectLink) {
                        finalLink = `roleplays/${storyline.link}`;
                    } else {
                        finalLink = storyline.link;
                    }
                    return `<span class="plan-storyline-link" onclick="window.location.href='${finalLink}'" title="Open storyline">${storyline.title}</span>`;
                } else if (storyline) {
                    // Storyline exists but has no link
                    return `<span class="plan-storyline-link-inactive" title="No link available">${storyline.title}</span>`;
                } else {
                    // Storyline not found
                    return `<span class="plan-storyline-link-inactive" title="Storyline not found">${storylineTitle}</span>`;
                }
            })
            .join('');
        
        if (storylineLinks) {
            storylinesDisplay = `<div class="plan-event-storylines">Storylines: ${storylineLinks}</div>`;
        }
    }
    
    // Subevents display with visible character tags only
    let subeventsDisplay = '';
    if (hasSubevents) {
        const uniqueId = `p${planIndex}-${context}-e${eventIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        subeventsDisplay = `
            <div class="plan-event-subevents">
                <div class="plan-event-subevents-toggle" onclick="toggleEventSubevents('${uniqueId}')">
                    <span class="plan-event-subevents-toggle-icon" id="subevents-toggle-${uniqueId}">▶</span>
                    Character Moments (${event.subevents.length})
                </div>
                <div class="plan-event-subevents-content collapsed" id="subevents-content-${uniqueId}">`;
        
        event.subevents.forEach((subevent, subIndex) => {
            let subeventCharTags = '<span class="no-tags">No characters</span>';
            if (subevent.characterTags && subevent.characterTags.length > 0) {
                const visibleSubeventTags = getVisibleTags(subevent.characterTags);
                if (visibleSubeventTags.length > 0) {
                    subeventCharTags = visibleSubeventTags.map(tag => `<span class="character-tag small">${tag}</span>`).join(' ');
                }
            }
            
            subeventsDisplay += `
                <div class="plan-subevent-item">
                    <div class="subevent-description">${subevent.description || 'Untitled moment'}</div>
                    <div class="subevent-character-tags">${subeventCharTags}</div>
                </div>`;
        });
        
        subeventsDisplay += `
                </div>
            </div>`;
    }
    
    const seasonalBg = typeof setSeasonalBackgroundForPlanEvent === 'function' 
        ? setSeasonalBackgroundForPlanEvent(event) 
        : '';
    
    return `
        <div class="${eventClass}" ${seasonalBg}>
            <div class="plan-event-header">
                <span class="plan-event-type ${event.type || 'rising'}">${event.type || 'rising'}</span>
                <div class="plan-event-title">${event.title || 'Untitled Event'}</div>
            </div>
            ${characterTagsDisplay}
            ${storylinesDisplay}
            ${subeventsDisplay}
            <div class="plan-event-bottom">
                ${hasNotes ? `
                    <div class="plan-event-notes-toggle" onclick="toggleEventNotesLocal(this)">
                        <span class="plan-event-notes-toggle-icon">▶</span>
                        Notes
                    </div>
                ` : ''}
                ${hasTiming ? `<div class="plan-event-timing">${event.timing}</div>` : ''}
            </div>
            ${hasNotes ? `
                <div class="plan-event-notes collapsed">
                    <div class="plan-event-notes-content">${parseMarkdown(event.notes)}</div>
                </div>
            ` : ''}
        </div>`;
}

// ADD this new function to html-generator.js for subevent toggling
function toggleEventSubevents(eventIndex) {
    const content = document.getElementById(`subevents-content-${eventIndex}`);
    const toggle = document.getElementById(`subevents-toggle-${eventIndex}`);
    
    if (content && toggle) {
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            toggle.innerHTML = '&#9660;';
        } else {
            content.classList.add('collapsed');
            toggle.innerHTML = '&#9654;';
        }
    }
}

// Make sure the function is globally available
if (typeof window !== 'undefined') {
    window.toggleEventSubevents = toggleEventSubevents;
}

function setSeasonalBackgroundForPlanEvent(event) {
    const timing = event.timing || event.parsedTiming?.originalText || '';
    
    // Try to extract month from various timing formats
    let month = null;
    
    if (event.parsedTiming?.month) {
        month = event.parsedTiming.month;
    } else if (timing) {
        // Simple regex patterns to extract month from timing text
        const monthNames = {
            'january': 1, 'jan': 1,
            'february': 2, 'feb': 2,
            'march': 3, 'mar': 3,
            'april': 4, 'apr': 4,
            'may': 5,
            'june': 6, 'jun': 6,
            'july': 7, 'jul': 7,
            'august': 8, 'aug': 8,
            'september': 9, 'sep': 9, 'sept': 9,
            'october': 10, 'oct': 10,
            'november': 11, 'nov': 11,
            'december': 12, 'dec': 12
        };
        
        const timingLower = timing.toLowerCase();
        for (const [monthName, monthNum] of Object.entries(monthNames)) {
            if (timingLower.includes(monthName)) {
                month = monthNum;
                break;
            }
        }
        
        // Also try to match number patterns like "Month 3" or "3rd month"
        const monthMatch = timingLower.match(/month\s+(\d+)|(\d+)\s*(?:st|nd|rd|th)?\s*month/);
        if (monthMatch) {
            month = parseInt(monthMatch[1] || monthMatch[2]);
        }
    }
    
    if (month && month >= 1 && month <= 12) {
        const colors = getColorScheme();
        const seasonalColor = getSeasonalColor(month, colors);
        return `style="--seasonal-bg: ${seasonalColor}"`;
    } else {
        // For events without a month, keep the current background (containerBg)
        const colors = getColorScheme();
        return `style="--seasonal-bg: ${colors.containerBg}"`;
    }
}

function getEventTypeDisplay(type) {
    const typeMap = {
        'rising': 'Rising',
        'setback': 'Setback',
        'climax': 'Climax'
    };
    return typeMap[type] || 'Rising';
}

function generateJavaScript() {
    const appearanceToEmbed = infoData.appearance || {
        overviewStyle: 'journal',     
        navigationStyle: 'journal', 
        colorScheme: 'current',
        fontSet: 'serif',
        containerStyle: 'left-border',
        subcontainerStyle: 'soft-bg'
    };
    
    // Embed ALL data including hidden items, notes, plans with sub-arcs, tags, AND new overview fields AND subtitle for import purposes
    const fullDataToEmbed = {
        basic: infoData.basic,
        appearance: appearanceToEmbed,
        characters: infoData.characters,
        storylines: infoData.storylines,
        plans: infoData.plans,
        playlists: infoData.playlists,
        customPages: infoData.customPages || [], // ADD THIS LINE
        world: infoData.world
    };
    
    console.log('Embedding appearance data in HTML:', appearanceToEmbed);
    console.log('Embedding full data including hidden items, notes, plans with sub-arcs, tags, subtitle, and overview fields:', fullDataToEmbed);
    
    return `
        <script>
            var charactersData = ${JSON.stringify(infoData.characters)};
            var plansData = ${JSON.stringify(infoData.plans)}; // NEW: Embed plans data with sub-arcs
            var appearanceData = ${JSON.stringify(appearanceToEmbed)};
            var fullInfoData = ${JSON.stringify(fullDataToEmbed)};
            console.log('Embedded appearance data:', appearanceData);
            console.log('Embedded full data (including hidden items, notes, plans with sub-arcs, tags, subtitle, and overview fields):', fullInfoData);
            console.log('Embedded appearance in fullInfoData:', fullInfoData.appearance);
            
            // Image modal cycling functionality
            let currentImages = [];
            let currentImageIndex = 0;
            let currentImageContext = '';
            
            // Developer console commands for hidden items
            let devMode = false;
            
            // UPDATED: Compact character filtering state
            let selectedCharacterTags = new Set();
            let characterFilterMode = 'any'; // 'any' or 'all'
            let currentSearchFilter = '';

            function stripHiddenPrefix(tag) {
                return tag.startsWith('!') ? tag.substring(1) : tag;
            }
            
            // Hidden items console functions for the generated HTML
            window.showHidden = function() {
                if (!fullInfoData || !fullInfoData.world) {
                    console.error('âš ï¸ No world data available');
                    return 0;
                }
                
                let count = 0;
                const worldItems = document.querySelectorAll('.world-item');
                
                // This is just for visual feedback in generated HTML
                // The actual data modification would require regenerating
                console.log('â„¹ï¸ showHidden() in generated HTML is read-only');
                console.log('To actually modify hidden status, use the converter interface');
                
                return count;
            };
            
            window.listHidden = function() {
                if (!fullInfoData || !fullInfoData.world) {
                    console.error('âš ï¸ No world data available');
                    return [];
                }
                
                const hiddenItems = [];
                
                Object.keys(fullInfoData.world).forEach(category => {
                    if (Array.isArray(fullInfoData.world[category])) {
                        fullInfoData.world[category].forEach(item => {
                            if (item.hidden) {
                                hiddenItems.push({
                                    name: item.name,
                                    category: category,
                                    type: item.category || item.type || 'Unknown'
                                });
                            }
                        });
                    }
                });
                
                if (hiddenItems.length === 0) {
                    console.log('âœ… No hidden items found');
                    return [];
                }
                
                console.log(\`ðŸ™ˆ Found \${hiddenItems.length} hidden item(s):\`);
                console.table(hiddenItems);
                
                console.log('\\nðŸ’¡ These items are hidden from this page but preserved in the data.');
                console.log('To modify hidden status, use the converter interface and regenerate.');
                
                return hiddenItems;
            };
            
            window.hideItem = function(itemName) {
                console.log('â„¹ï¸ hideItem() in generated HTML is read-only');
                console.log('To hide items, use the converter interface and regenerate the HTML');
                if (itemName) {
                    console.log(\`Searched for: "\${itemName}"\`);
                }
                return false;
            };
            
            window.showItem = function(itemName) {
                console.log('â„¹ï¸ showItem() in generated HTML is read-only');
                console.log('To show items, use the converter interface and regenerate the HTML');
                if (itemName) {
                    console.log(\`Searched for: "\${itemName}"\`);
                }
                return false;
            };
            
            window.hideCategory = function(categoryName) {
                console.log('â„¹ï¸ hideCategory() in generated HTML is read-only');
                console.log('To hide categories, use the converter interface and regenerate the HTML');
                if (categoryName) {
                    console.log(\`Category: "\${categoryName}"\`);
                }
                return false;
            };
            
            window.showCategory = function(categoryName) {
                console.log('â„¹ï¸ showCategory() in generated HTML is read-only');
                console.log('To show categories, use the converter interface and regenerate the HTML');
                if (categoryName) {
                    console.log(\`Category: "\${categoryName}"\`);
                }
                return false;
            };
            
            window.debugHiddenItems = function() {
                if (!fullInfoData || !fullInfoData.world) {
                    console.error('âš ï¸ No world data available');
                    return 0;
                }
                
                console.log('=== HIDDEN ITEMS DEBUG (Generated HTML) ===');
                let totalHidden = 0;
                
                Object.keys(fullInfoData.world).forEach(category => {
                    if (Array.isArray(fullInfoData.world[category])) {
                        const hidden = fullInfoData.world[category].filter(item => item.hidden);
                        if (hidden.length > 0) {
                            console.log(\`\${category}: \${hidden.length} hidden items\`);
                            hidden.forEach(item => {
                                console.log(\`  - \${item.name} (hidden: \${item.hidden})\`);
                                totalHidden++;
                            });
                        }
                    }
                });
                
                if (totalHidden === 0) {
                    console.log('No hidden items found in any category');
                } else {
                    console.log(\`Total hidden items: \${totalHidden}\`);
                }
                
                console.log('=======================================');
                
                return totalHidden;
            };
            
            window.toggleDevMode = function() {
                console.log('â„¹ï¸ toggleDevMode() is not available in generated HTML');
                console.log('Hidden items are embedded in the data but not visually shown');
                console.log('Use listHidden() to see what items are hidden');
                console.log('Use the converter interface to modify hidden status');
                return false;
            };
                        
            function showTab(tabName) {
                // Hide all content
                document.querySelectorAll('.content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // NEW: Hide all custom pages when switching to regular tabs
                document.querySelectorAll('.custom-page-content').forEach(page => {
                    page.style.display = 'none';
                });
                
                // Remove active class from all tabs
                document.querySelectorAll('.nav-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected content
                const targetContent = document.getElementById(tabName);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Activate the corresponding tab button
                const targetTab = document.getElementById(tabName + '-tab');
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            }
            
            function openCharacterGalleryImage(imageIndex) {
                // Find the currently open character modal to get the character data
                    const openModal = document.querySelector('.modal.active');                if (openModal) {
                    const gallery = openModal.querySelector('.character-gallery');
                    if (gallery) {
                        const characterIndex = gallery.getAttribute('data-character-index');
                        const character = charactersData[characterIndex];
                        if (character && character.gallery) {
                            openImageModal(character.gallery[imageIndex], character.name, character.gallery, imageIndex);
                        }
                    }
                }
            }
            
            function openCharacterModal(index) {
                const modal = document.getElementById('characterModal' + index);
                if (modal) {
                    modal.classList.add('active'); // Use flexbox class instead
                    document.body.style.overflow = 'hidden';
                }
            }

            function closeCharacterModal(index) {
                const modal = document.getElementById('characterModal' + index);
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }

            function openPlanModal(index) {
                const modal = document.getElementById('planModal' + index);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }

            function closePlanModal(index) {
                const modal = document.getElementById('planModal' + index);
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
            
            // NEW: Toggle sub-arc expansion
            function toggleSubArc(planIndex, subArcIndex) {
                const planModal = document.getElementById('planModal' + planIndex);
                if (!planModal) return;
                
                const subArcs = planModal.querySelectorAll('.plan-subarc');
                const subArc = subArcs[subArcIndex];
                
                if (subArc) {
                    const content = subArc.querySelector('.plan-subarc-content');
                    const toggle = subArc.querySelector('.plan-subarc-toggle');
                    
                    if (content.classList.contains('collapsed')) {
                        content.classList.remove('collapsed');
                        toggle.classList.add('expanded');
                        toggle.innerHTML = '&#9660;';
                    } else {
                        content.classList.add('collapsed');
                        toggle.classList.remove('expanded');
                        toggle.innerHTML = '&#9654;';
                    }
                }
            }
            
            // NEW: Toggle event notes using DOM traversal (fixes indexing issues with mixed main/sub-arc events)
            function toggleEventNotesLocal(toggleElement) {
                const toggle = toggleElement;
                const icon = toggle.querySelector('.plan-event-notes-toggle-icon');
                
                // FIXED: Find the notes element correctly - it's a sibling of the parent bottom container
                const bottomContainer = toggle.closest('.plan-event-bottom');
                const notes = bottomContainer ? bottomContainer.nextElementSibling : null;
                
                if (notes && notes.classList.contains('plan-event-notes')) {
                    if (notes.classList.contains('collapsed')) {
                        notes.classList.remove('collapsed');
                        toggle.classList.add('expanded');
                        icon.innerHTML = '&#9660;';
                    } else {
                        notes.classList.add('collapsed');
                        toggle.classList.remove('expanded');
                        icon.innerHTML = '&#9654;';
                    }
                } else {
                    console.error('Could not find notes element for toggle', toggle);
                }
            }
            
            // Legacy function for backwards compatibility (though we shouldn't need it anymore)
            function toggleEventNotes(eventIndex) {
                console.warn('toggleEventNotes with index is deprecated, using DOM traversal instead');
                // This function is kept for backwards compatibility but shouldn't be used
                const toggles = document.querySelectorAll('.plan-event-notes-toggle');
                const notes = document.querySelectorAll('.plan-event-notes');
                
                if (toggles[eventIndex] && notes[eventIndex]) {
                    toggleEventNotesLocal(toggles[eventIndex]);
                }
            }        
            
            function openImageModal(imageSrc, altText, imageArray, index) {
                const modal = document.getElementById('imageModal');
                const modalImg = document.getElementById('modalImage');
                const prevBtn = document.querySelector('.image-prev');
                const nextBtn = document.querySelector('.image-next');
                const counter = document.getElementById('imageCounter');
                
                if (modal && modalImg) {
                    // Handle both single images and image arrays
                    if (Array.isArray(imageArray) && imageArray.length > 0) {
                        currentImages = imageArray;
                        currentImageIndex = index || 0;
                        currentImageContext = altText;
                        
                        // Show navigation if there are multiple images
                        if (currentImages.length > 1) {
                            prevBtn.classList.add('visible');
                            nextBtn.classList.add('visible');
                            counter.classList.add('visible');
                            counter.textContent = \`\${currentImageIndex + 1} / \${currentImages.length}\`;
                        } else {
                            prevBtn.classList.remove('visible');
                            nextBtn.classList.remove('visible');
                            counter.classList.remove('visible');
                        }
                        
                        modalImg.src = currentImages[currentImageIndex];
                        modalImg.alt = \`\${currentImageContext} - Image \${currentImageIndex + 1}\`;
                    } else {
                        // Single image mode
                        currentImages = [imageSrc];
                        currentImageIndex = 0;
                        currentImageContext = altText;
                        
                        prevBtn.classList.remove('visible');
                        nextBtn.classList.remove('visible');
                        counter.classList.remove('visible');
                        
                        modalImg.src = imageSrc;
                        modalImg.alt = altText;
                    }
                    
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            }
            
            function nextImage() {
                if (currentImages.length > 1) {
                    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                    updateModalImage();
                }
            }
            
            function previousImage() {
                if (currentImages.length > 1) {
                    currentImageIndex = currentImageIndex === 0 ? currentImages.length - 1 : currentImageIndex - 1;
                    updateModalImage();
                }
            }
            
            function updateModalImage() {
                const modalImg = document.getElementById('modalImage');
                const counter = document.getElementById('imageCounter');
                
                if (modalImg) {
                    modalImg.src = currentImages[currentImageIndex];
                    modalImg.alt = \`\${currentImageContext} - Image \${currentImageIndex + 1}\`;
                }
                
                if (counter) {
                    counter.textContent = \`\${currentImageIndex + 1} / \${currentImages.length}\`;
                }
            }
            
            function closeImageModal() {
                const modal = document.getElementById('imageModal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }
            
            function toggleSpoiler(element) {
                element.classList.toggle('revealed');
            }
            
            // Close modals when clicking outside them
            window.addEventListener('click', function(event) {
                if (event.target.classList.contains('modal') || event.target.classList.contains('image-modal')) {
                    event.target.classList.remove('active');
                    event.target.style.display = 'none'; // Keep for image modal
                    document.body.style.overflow = '';
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function(event) {
                const modal = document.getElementById('imageModal');
                const isModalOpen = modal && modal.style.display === 'block';
                
                if (isModalOpen) {
                    switch(event.key) {
                        case 'Escape':
                            closeImageModal();
                            break;
                        case 'ArrowLeft':
                            event.preventDefault();
                            previousImage();
                            break;
                        case 'ArrowRight':
                            event.preventDefault();
                            nextImage();
                            break;
                    }
                } else if (event.key === 'Escape') {
                    // Close other modals on Escape
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                    document.body.style.overflow = '';
                }
            });
            
            function initializeWorldFeatures() {
                // Search and filter functionality
                const searchInput = document.getElementById('world-search');
                const statusFilter = document.getElementById('status-filter');
            
                
                if (searchInput) {
                    searchInput.addEventListener('input', filterWorldItems);
                }
                
                if (statusFilter) {
                    statusFilter.addEventListener('change', filterWorldItems);
                }

                    // ADD THIS LINE:
                initializeGalleryMode();
                
                // Back to top button
                const backToTopBtn = document.getElementById('world-back-to-top');
                if (backToTopBtn) {
                    window.addEventListener('scroll', function() {
                        if (window.pageYOffset > 300) {
                            backToTopBtn.classList.add('visible');
                        } else {
                            backToTopBtn.classList.remove('visible');
                        }
                    });
                    
                    backToTopBtn.addEventListener('click', function() {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
                
                // Smooth scrolling for navigation links
                const navLinks = document.querySelectorAll('.world-nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Expand navigation if collapsed
                        const navContent = document.querySelector('.world-nav-content');
                        const navToggle = document.querySelector('.world-nav-toggle');
                        if (navContent && navContent.classList.contains('collapsed')) {
                            navContent.classList.remove('collapsed');
                            if (navToggle) {
                                navToggle.classList.add('expanded');
                                navToggle.innerHTML = '&#9660;';
                            }
                        }
                        
                        const targetId = this.getAttribute('href').substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            }
            
            function initializeCharacterFeatures() {
                // Character search functionality
                const searchInput = document.getElementById('character-search');
                
                if (searchInput) {
                    searchInput.addEventListener('input', function() {
                        currentSearchFilter = this.value.toLowerCase().trim();
                        applyCharacterFilters();
                    });
                }
                
                // Initialize display
                updateCharacterTagStates();
                updateClearButtonState();
                
                // Character back to top button
                const backToTopBtn = document.getElementById('character-back-to-top');
                if (backToTopBtn) {
                    window.addEventListener('scroll', function() {
                        if (window.pageYOffset > 300) {
                            backToTopBtn.classList.add('visible');
                        } else {
                            backToTopBtn.classList.remove('visible');
                        }
                    });
                    
                    backToTopBtn.addEventListener('click', function() {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
            }

            function initializePlansFeatures() {
                // Plans back to top button
                const backToTopBtn = document.getElementById('plans-back-to-top');
                if (backToTopBtn) {
                    window.addEventListener('scroll', function() {
                        if (window.pageYOffset > 300) {
                            backToTopBtn.classList.add('visible');
                        } else {
                            backToTopBtn.classList.remove('visible');
                        }
                    });
                    
                    backToTopBtn.addEventListener('click', function() {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
            }

            function initializeStorylinesFeatures() {
                // Storylines back to top button
                const backToTopBtn = document.getElementById('storylines-back-to-top');
                if (backToTopBtn) {
                    window.addEventListener('scroll', function() {
                        if (window.pageYOffset > 300) {
                            backToTopBtn.classList.add('visible');
                        } else {
                            backToTopBtn.classList.remove('visible');
                        }
                    });
                    
                    backToTopBtn.addEventListener('click', function() {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
            }
            
            // Ensure Overview tab is active by default
            document.addEventListener('DOMContentLoaded', function() {
                // showTab('overview'); 

                // Handle direct tab linking via URL hash
                // Handle direct tab linking via URL hash
                function handleTabFromURL() {
                    const hash = window.location.hash.substring(1); // Remove the #
                    const validTabs = ['overview', 'world', 'characters', 'storylines', 'plans', 'playlists'];
                    
                    // Check if it's a custom page
                    const customPageElement = document.getElementById(hash);
                    if (customPageElement && customPageElement.classList.contains('custom-page-content')) {
                        showCustomPage(hash);
                        return;
                    }
                    
                    if (hash && validTabs.includes(hash)) {
                        showTab(hash);
                    } else {
                        showTab('overview'); // Default tab
                    }
                }

                // Show custom page function
                function showCustomPage(pageName) {
                    // Hide all regular content sections
                    document.querySelectorAll('.content').forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    // Hide all custom pages
                    document.querySelectorAll('.custom-page-content').forEach(page => {
                        page.style.display = 'none';
                    });
                    
                    // Show the specific custom page
                    const targetPage = document.getElementById(pageName);
                    if (targetPage) {
                        targetPage.style.display = 'block';
                    }
                    
                    // Remove active class from all nav tabs
                    document.querySelectorAll('.nav-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    // No nav tab gets active state for custom pages since they're accessed directly
                }

                // Initialize custom page navigation handlers
                function initializeCustomPageNavigation() {
                    // Find all navigation links that point to hash URLs
                    const hashLinks = document.querySelectorAll('a[href^="#"]');
                    
                    hashLinks.forEach(link => {
                        link.addEventListener('click', function(e) {
                            const targetHash = this.getAttribute('href').substring(1);
                            
                            // Check if it's a custom page
                            const customPageElement = document.getElementById(targetHash);
                            if (customPageElement && customPageElement.classList.contains('custom-page-content')) {
                                // Prevent default navigation
                                e.preventDefault();
                                
                                // Force show the custom page
                                showCustomPage(targetHash);
                                
                                // Update the URL hash
                                window.history.replaceState(null, null, '#' + targetHash);
                            }
                        });
                    });
                }

                // Initialize custom page back to top buttons
                const customPageBackToTopBtns = document.querySelectorAll('[id^="custom-page-back-to-top-"]');

                // Single scroll listener for all custom page buttons
                if (customPageBackToTopBtns.length > 0) {
                    window.addEventListener('scroll', function() {
                        customPageBackToTopBtns.forEach(backToTopBtn => {
                            if (window.pageYOffset > 300) {
                                backToTopBtn.classList.add('visible');
                            } else {
                                backToTopBtn.classList.remove('visible');
                            }
                        });
                    });
                    
                    // Click listeners for each button
                    customPageBackToTopBtns.forEach(backToTopBtn => {
                        backToTopBtn.addEventListener('click', function() {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        });
                    });
                }

                // Call it on page load
                handleTabFromURL();

                // Also handle hash changes (if someone changes the URL while on the page)
                window.addEventListener('hashchange', handleTabFromURL);

                // Handle custom page navigation buttons
                initializeCustomPageNavigation();
                
                // Initialize world section functionality
                initializeWorldFeatures();
                
                // Initialize character section functionality
                initializeCharacterFeatures();

                // Initialize plans section functionality
                initializePlansFeatures();

                // Initialize storylines section functionality
                initializeStorylinesFeatures();

                // Initialize playlist section functionality
                initializePlaylistFeatures();

                // Initialize timeline features
                initializeTimelineFeatures();
                
                // NEW: Initialize global filter system
                initializeGlobalFilterSystem();
                
                // Auto-run debug if there are hidden items
                setTimeout(() => {
                    const hiddenCount = debugHiddenItems();
                    if (hiddenCount > 0) {
                        console.log(\`\\nâœ… This page has \${hiddenCount} hidden items preserved in the data\`);
                    }
                }, 500);
            });

            // Storylines view switching function
            function switchStorylinesView(viewType) {
                // Remove active class from all tabs and views
                document.querySelectorAll('.storylines-tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.storylines-view').forEach(view => view.classList.remove('active'));
                
                // Add active class to selected tab and view
                const activeTab = document.getElementById(viewType + '-tab');
                const activeView = document.getElementById(viewType + '-view');
                
                if (activeTab && activeView) {
                    activeTab.classList.add('active');
                    activeView.classList.add('active');
                }
            }

            // Helper function to escape HTML for safe tooltips
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            // Make storylines functions globally available
            window.switchStorylinesView = switchStorylinesView;
            window.escapeHtml = escapeHtml;
            
            // Make plan modal functions globally available
            window.openPlanModal = openPlanModal;
            window.closePlanModal = closePlanModal;
            
            // NEW: Make sub-arc and notes functions globally available
            window.toggleSubArc = toggleSubArc;
            window.toggleEventNotes = toggleEventNotes;
            window.toggleEventNotesLocal = toggleEventNotesLocal;

            ${generateStorylinesJavaScript()}
            ${generateTimelineJavaScript()}
            ${generateTimelineFilteringJavaScript()}
            ${generatePlanFilteringJavaScript()}
            ${generatePlaylistJavaScript()}
            ${generateCharactersFilteringJavaScript()}
            ${generateWorldFilteringJavascript()}
            ${generateWorldImageJavascript()}
            ${generateGlobalFilterJavaScript()}
        </script>
    </div>`;
}

// Basic markdown parsing for descriptions
window.parseMarkdown = function(text) {
    if (!text) return '';
    
    let parsed = text.toString();
    
    // Bold
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Underline
    parsed = parsed.replace(/\+\+(.*?)\+\+/g, '<u>$1</u>');
    
    // Spoiler tags
    parsed = parsed.replace(/<spoiler>(.*?)<\/spoiler>/g, '<span class="spoiler" onclick="toggleSpoiler(this)">$1</span>');
    
    // Strikethrough
    parsed = parsed.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Line breaks
    parsed = parsed.replace(/\n/g, '<br>');
    
    return parsed;
}

// Update preview
// Update preview
window.updatePreview = function(html) {
    const iframe = document.getElementById('preview-frame');
    const previewContainer = document.querySelector('.preview-container');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    // Add 'has-content' class to hide the empty state placeholder
    if (previewContainer && html && html.trim()) {
        previewContainer.classList.add('has-content');
    } else if (previewContainer) {
        previewContainer.classList.remove('has-content');
    }
}

// Export functions globally when loaded as module
window.generateHTML = generateHTML;
window.updateSaveButtonState = updateSaveButtonState;
window.getVisibleTags = getVisibleTags;
window.stripHiddenPrefix = stripHiddenPrefix;
window.markDataAsModified - markDataAsModified;