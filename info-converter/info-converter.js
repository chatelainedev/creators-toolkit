
import titleFonts from './templates/titlefonts.js';
// Global variables for Lore Codex
let htmlGenerated = false;
let dataModified = false;
let backupMadeThisSession = false;
let projectLoading = false; 
// Make these variables globally accessible to other script files
window.htmlGenerated = htmlGenerated;
window.dataModified = dataModified;
window.backupMadeThisSession = backupMadeThisSession;
window.projectLoading = projectLoading;
let infoData = {
    basic: {
        title: '',
        subtitle: '',        // NEW: Subtitle field
        banner: '',
        overviewTitle: '',
        overview: '',
        overviewImage: '',
        overviewLinks: [],
        backgroundColor: '',
        backgroundImage: '',
        overviewContentBgImage: '',
        overviewContentBgColor: '',
        overviewContentOpacity: 100,
        overviewContentBlur: 0,
        mainContainerColor: '',
        mainContainerBgImage: '',
        mainContainerBgColor: '',
        // NEW: Title/Subtitle display settings
        titleSettings: {
            show: true,        // Show or hide title/subtitle
            position: 'left',  // 'left', 'center', or 'right'
            font: 'theme',     // Font set to use or 'theme' for default
            color: ''          // Custom color or '' for theme default
        }
    },
    appearance: {
        template: 'journal',
        bannerStyle: 'none', 
        overviewStyle: 'journal',
        navigationStyle: 'journal',
        colorScheme: 'current',
        fontSet: 'serif',
        bannerSize: 'large',
        worldCategoriesHeader: 'default',
        pageHeader: 'standard',
        cardStyle: 'current',
        containerStyle: 'left-border',
        subcontainerStyle: 'soft-bg',
        infodisplayStyle: 'default',
        siteWidth: 'standard'
    },
    characters: [],
    storylines: [],
    storylinesOptions: {
        showTOC: true,
        showSections: true,
        showSubsections: true
    },
    charactersOptions: {              // ADD THIS if it's not there
        showByFaction: true,
        showInfoDisplay: false
    },
    eventsOptions: {       // ADD THIS
        customLabel: 'Events'
    },
    cultureOptions: {       // ADD THIS
        customLabel: 'Culture'
    },
    cultivationOptions: {       // ADD THIS
        customLabel: 'Cultivation'
    },
    magicOptions: {                   // ADD THIS ENTIRE BLOCK
        customLabel: 'Magic'
    },
    plans: [], // NEW: Story arcs/plans with sub-arcs
    plansOptions: {  // ADD THIS
        selectedTimeSystemId: 'default'
    },
    playlists: [], // ADD THIS LINE
    world: {
        locations: [],
        concepts: [],
        events: [],
        creatures: [],
        plants: [],
        items: [],
        factions: [],
        culture: [],
        cultivation: [],
        magic: [],
        general: []     // ADD THIS LINE
    },
    customPages: [],
    linkedLorebook: null,
};
// Make infoData globally accessible to other script files
window.infoData = infoData;
// Environment and server state
let isLocal = false;
let hasFileAccess = false;
let sitesFolder = null;
let currentProject = null;

// Current editing state - make globally accessible
// Current editing state - make globally accessible
window.editingIndex = -1;
window.editingType = '';
window.editingCategory = '';
window.editingEventIndex = -1;
window.editingEventContext = 'main';

// Drag and Drop functionality
let draggedElement = null;

// Ensure all world categories exist
function ensureWorldCategories() {
    const expectedCategories = [
        'general', 'locations', 'concepts', 'events', 'creatures', 
        'plants', 'items', 'factions', 'culture', 'cultivation', 'magic'
    ];
    
    if (!infoData.world) {
        infoData.world = {};
    }
    
    expectedCategories.forEach(category => {
        if (!infoData.world[category]) {
            infoData.world[category] = [];
        }
    });
}

// Tab switching functions
function switchMainTab(tabName) {    
    // Remove active class from all main tabs
    document.querySelectorAll('.main-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.main-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-content`);
    
    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    } else {
        console.error(`Could not find main tab or content for: ${tabName}`);
    }
}

// Save all built icons to project folder
async function saveBuiltIcons(projectName, data) {
    if (!data.world) return;
    
    const userContext = userSessionManager.getUserContext();
    const savePromises = [];
    
    // Go through all world items
    for (const category in data.world) {
        if (Array.isArray(data.world[category])) {
            for (const item of data.world[category]) {
                
                // Only save if it has a builder icon with generated PNG data
                if (item.icon && item.icon.type === 'builder' && item.icon.generatedPNG) {
                    
                    const promise = fetch('/api/save-built-icon', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            projectName: projectName,
                            itemId: item.id,
                            category: category,  // ADD THIS LINE
                            pngData: item.icon.generatedPNG,
                            userContext: userContext
                        })
                    }).then(response => response.json())
                      .then(result => {
                          if (result.success) {
                              console.log(`    ✅ Saved icon: ${result.iconPath}`);
                          } else {
                              console.error(`    ❌ Failed to save icon for ${item.name}`);
                          }
                          return result;
                      })
                      .catch(err => {
                          console.error(`    ❌ Error saving icon for ${item.name}:`, err);
                          return { success: false };
                      });
                    
                    savePromises.push(promise);
                }
            }
        }
    }
    
    if (savePromises.length > 0) {
        const results = await Promise.all(savePromises);
        const successCount = results.filter(r => r.success).length;
    } else {
        console.log('ℹ️ No built icons found to save');
    }
}

// Initialize user avatar context menu
function initializeLoreContextMenu() {
    const navAvatarImg = document.getElementById('nav-avatar-img');
    const contextMenu = document.getElementById('lore-context-menu');
    const logoutOption = document.getElementById('lore-logout-option');

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

// Initialize application
// Replace the existing one with this:
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize environment first
    await initializeEnvironment();
    
    // Initialize user session system
    await initializeUserSystem();

    // Ensure all world categories exist
    ensureWorldCategories();

    // Initialize quick load state
    updateQuickLoadState();
    
    // Initialize the rest of the app
    initializeEventListeners();
    await loadProjects();
    await checkAssetsFolder();
    
    // Initialize appearance system
    // Initialize appearance system
    if (typeof initializeAppearance === 'function') {
        initializeAppearance();
    }
    initializeOverviewLinks();
    // Initialize custom navigation
    initializeCustomNavigation();
    initializeAppearanceColorPickers(); 

    // Initialize custom pages
    if (typeof initializeCustomPages === 'function') {
        initializeCustomPages();
    }

    // Add this where other initialization happens
    if (typeof initializeLinkedLorebook === 'function') {
        initializeLinkedLorebook();
    }

    // Initialize time systems
    if (typeof initializeTimeSystems === 'function') {
        await initializeTimeSystems();
    }
    
    // Ensure first main tab is active by default
    switchMainTab('project');

    // Initialize scroll indicators
    setTimeout(() => {
        initializeScrollIndicators();
    }, 100);
    
    // NEW: Add this for theme support
    // Check for theme changes when navigating back to Lore Codex
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.loreCodexThemeManager) {
            // Check if theme changed while away
            const currentSaved = localStorage.getItem('writingTools_currentTheme');
            if (currentSaved && currentSaved !== window.loreCodexThemeManager.currentTheme) {
                window.loreCodexThemeManager.loadSharedTheme();
            }
        }
    });

    // Initialize Lore Codex About system
    await initializeLoreCodexAbout();

    initializeLoreContextMenu();
    
    console.log('Lore Codex initialized successfully with theme support');
});

// Environment Detection and Setup
async function initializeEnvironment() {
    try {
        const response = await fetch('/api/env');
        const env = await response.json();
        
        isLocal = env.isLocal;
        hasFileAccess = env.hasFileAccess;
        sitesFolder = env.sitesFolder;
        
        // Make these variables globally accessible to other script files
        window.isLocal = isLocal;
        window.hasFileAccess = hasFileAccess;
        window.sitesFolder = sitesFolder;
        
        updateEnvironmentUI();
    } catch (error) {
        console.error('Error detecting environment:', error);
        // Fallback to hosted mode
        isLocal = false;
        hasFileAccess = false;
        
        // Make fallback values globally accessible too
        window.isLocal = false;
        window.hasFileAccess = false;
        
        updateEnvironmentUI();
    }
}

function updateEnvironmentUI() {
    const projectSection = document.getElementById('project-section');
    const importSection = document.getElementById('import-section');
    const saveToSitesBtn = document.getElementById('save-to-sites-btn');
    const navProjectControls = document.querySelector('.nav-project-controls');
    
    if (isLocal && hasFileAccess) {
        if (projectSection) projectSection.style.display = 'block';
        if (saveToSitesBtn) saveToSitesBtn.style.display = 'inline-block';
        if (navProjectControls) navProjectControls.style.display = 'flex';
        
        // Hide the import section entirely in local mode
        if (importSection) importSection.style.display = 'none';
    } else {
        if (projectSection) projectSection.style.display = 'none';
        if (saveToSitesBtn) saveToSitesBtn.style.display = 'none';
        if (navProjectControls) navProjectControls.style.display = 'none';
        
        // Show import section in hosted mode
        if (importSection) importSection.style.display = 'block';
    }
    
    updateOpenProjectButton();
}

// Project Management Functions
// Toast Notification System - Global override
window.showToast = function(type, message, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
};

// Also create a local reference
const showToast = window.showToast;

// Navigation Project Management Functions
function updateNavProjectDisplay(projectName) {
    const nameDisplay = document.getElementById('current-project-name');
    if (nameDisplay) {
        if (projectName) {
            nameDisplay.textContent = projectName;
            nameDisplay.style.display = 'block';
        } else {
            nameDisplay.style.display = 'none';
        }
    }
}

async function loadNavProject() {
    const projectList = document.getElementById('nav-project-list');
    const projectName = projectList.value;
    
    if (!projectName || !userSessionManager) return;
    
    try {
        showToast('info', 'Loading project...', 2000);
        projectLoading = true;  // ADD THIS LINE
        updateGenerateButtonState();  // ADD THIS LINE
        
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/projects/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, userContext })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Parse and populate
            parseImportedHTML(result.content);
            currentProject = projectName;
            window.currentProject = currentProject;

            // UPDATE LOREBOOK UI AFTER IMPORT
            if (typeof updateLorebookLinkUI === 'function') {
                updateLorebookLinkUI();
            }
            
            // Update nav display
            updateNavProjectDisplay(projectName);
            
            // Update appearance controls
            setTimeout(() => {
                if (typeof window.populateAppearanceControls === 'function') {
                    window.populateAppearanceControls();
                }
                if (typeof loadAppearanceSettings === 'function' && infoData.appearance) {
                    loadAppearanceSettings(infoData.appearance);
                }
                loadOverviewLinksSettings();
                loadCustomNavSettings();
            }, 100);
            
            // Check assets and show status
            await checkAssetsFolder(projectName);
            
            showToast('success', `Project "${projectName}" loaded successfully`);

            // Store as last project
            if (userSessionManager) {
                userSessionManager.setLastProject(projectName);
                updateQuickLoadState();
            }

            updateQuickOpenState(); // ADD THIS LINE

        } else {
            throw new Error(result.error || 'Failed to load project');
        }
    } catch (error) {
        console.error('Error loading nav project:', error);
        showToast('error', `Failed to load: ${error.message}`);
    }
}

async function checkNavAssetsStatus(projectName) {
    if (!isLocal || !projectName || !userSessionManager) return;
    
    try {
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/assets/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, userContext })
        });
        
        const result = await response.json();
        
        if (result.exists) {
            showToast('success', `Assets folder exists for '${projectName}'`, 3000);
        } else if (!result.needsProject) {
            showToast('info', `No assets folder for '${projectName}'`, 3000);
        }
    } catch (error) {
        console.error('Error checking nav assets:', error);
    }
}

async function loadProjects() {
    if (!isLocal || !userSessionManager) return;
    
    try {
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userContext })
        });
        
        const projects = await response.json();
        
        // Update both dropdowns if they exist
        const projectList = document.getElementById('project-list');
        const navProjectList = document.getElementById('nav-project-list');
        const loadBtn = document.getElementById('load-project-btn');
        const navLoadBtn = document.getElementById('nav-load-project-btn');
        
        // Handle main project list
        if (projectList && loadBtn) {
            const currentSelection = projectList.value;
            projectList.innerHTML = '<option value="">Select a project...</option>';
            
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.projectName;
                option.textContent = `${project.title} (${new Date(project.lastModified).toLocaleDateString()})`;
                if (!project.hasAssets) {
                    option.textContent += ' - No Assets';
                }
                projectList.appendChild(option);
            });
            
            if (currentSelection && [...projectList.options].some(opt => opt.value === currentSelection)) {
                projectList.value = currentSelection;
                loadBtn.disabled = false;
                if (currentSelection) {
                    checkAssetsFolder(currentSelection);
                }
            } else if (currentProject && [...projectList.options].some(opt => opt.value === currentProject)) {
                projectList.value = currentProject;
                loadBtn.disabled = false;
                checkAssetsFolder(currentProject);
            } else {
                loadBtn.disabled = true;
                checkAssetsFolder();
            }
        }
        
        // Handle nav project list
        if (navProjectList && navLoadBtn) {
            const currentNavSelection = navProjectList.value;
            navProjectList.innerHTML = '<option value="">Select project...</option>';
            
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.projectName;
                option.textContent = project.title;
                if (!project.hasAssets) {
                    option.textContent += ' (No Assets)';
                }
                navProjectList.appendChild(option);
            });
            
            if (currentNavSelection && [...navProjectList.options].some(opt => opt.value === currentNavSelection)) {
                navProjectList.value = currentNavSelection;
                navLoadBtn.disabled = false;
            } else if (currentProject && [...navProjectList.options].some(opt => opt.value === currentProject)) {
                navProjectList.value = currentProject;
                navLoadBtn.disabled = false;
            } else {
                navLoadBtn.disabled = true;
            }
        }
        
        const userDisplay = userSessionManager.isGuest ? 'Guest' : userSessionManager.getCurrentUser().username;
        console.log(`Loaded ${projects.length} projects for ${userDisplay}`);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        projectLoading = false;  // ADD THIS LINE
        updateGenerateButtonState();  // ADD THIS LINE
        showStatus('error', 'Failed to load projects list');
    }
}

// Reset state when loading projects
function resetGenerationState() {
    window.htmlGenerated = false;
    window.dataModified = false;
    backupMadeThisSession = false;
    updateSaveButtonState();
    updateQuickOpenState(); // ADD THIS LINE
    
    // Clear the HTML output
    const htmlOutput = document.getElementById('html-output');
    if (htmlOutput) {
        htmlOutput.value = '';
    }
}

async function loadProject() {
    const projectList = document.getElementById('project-list');
    const projectName = projectList.value;
    
    if (!projectName || !userSessionManager) return;
    
    try {
        showStatus('info', 'Loading project...');
        projectLoading = true;  // ADD THIS LINE
        updateGenerateButtonState();  // ADD THIS LINE
        
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/projects/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, userContext })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Parse the HTML content and populate form
            parseImportedHTML(result.content);
            currentProject = projectName;
            window.projectFilename = result.filename || 'info';  // ADD THIS
            window.currentProject = currentProject;
            document.getElementById('project-name').value = projectName;

            backupMadeThisSession = false;

            // UPDATE LOREBOOK UI AFTER IMPORT
            if (typeof updateLorebookLinkUI === 'function') {
                updateLorebookLinkUI();
            }

            // Restore linked lorebook state
            setTimeout(async () => {
                await restoreLinkedLorebook(projectName);
                if (typeof initializeLinkedLorebook === 'function') {
                    initializeLinkedLorebook();
                }
            }, 200);
            
            // Multiple attempts to update appearance controls with delays
            setTimeout(() => {
                console.log('First appearance update attempt...');
                if (typeof window.populateAppearanceControls === 'function') {
                    window.populateAppearanceControls();
                }
                if (typeof loadAppearanceSettings === 'function' && infoData.appearance) {
                    loadAppearanceSettings(infoData.appearance);
                }
                loadOverviewLinksSettings();
                loadCustomNavSettings();
            }, 100);
            
            setTimeout(() => {
                console.log('Second appearance update attempt...');
                if (typeof window.populateAppearanceControls === 'function') {
                    window.populateAppearanceControls();
                }
                console.log('Current appearance settings:', infoData.appearance);
                loadOverviewLinksSettings();
                loadCustomNavSettings();
            }, 300);
            
            showStatus('success', `Project "${projectName}" loaded successfully`);

            // Store as last project
            if (userSessionManager) {
                userSessionManager.setLastProject(projectName);
                updateQuickLoadState();
            }
            
            // Show the open project button since we now have a current project
            updateOpenProjectButton();

            // Reset generation state when loading a project
            resetGenerationState();

            updateQuickOpenState(); // ADD THIS LINE
            
            // Check assets for this project
            await checkAssetsFolder(projectName);
        } else {
            throw new Error(result.error || 'Failed to load project');
        }
    } catch (error) {
        console.error('Error loading project:', error);
        projectLoading = false;  // ADD THIS LINE
        updateGenerateButtonState();  // ADD THIS LINE
        showStatus('error', `Failed to load project: ${error.message}`);
    }
}

// Add this function to info-converter.js
async function restoreLinkedLorebook(projectName) {
    if (!isLocal || !userSessionManager || !projectName) return;

    // Don't restore from files if we already have lorebook data from HTML import
    if (infoData.linkedLorebook && infoData.linkedLorebook.data) {
        console.log('Lorebook already restored from HTML data');
        linkedLorebookData = infoData.linkedLorebook.data;
        linkedLorebookFilename = infoData.linkedLorebook.filename;
        return;
    }
    
    try {
        const userContext = userSessionManager.getUserContext();
        
        // Check if lorebook folder exists and get files
        const response = await fetch('/api/assets/check-lorebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, userContext })
        });
        
        const result = await response.json();
        
        if (result.success && result.lorebookFile) {
            // Load the lorebook data
            const lorebookResponse = await fetch(`/projects/${userContext.isGuest ? 'guest' : userContext.userId}/${projectName}/assets/lorebook/${result.lorebookFile}`);
            const lorebookData = await lorebookResponse.json();
            
            // Restore the linked lorebook state
            if (typeof linkedLorebookData !== 'undefined') {
                window.linkedLorebookData = lorebookData;
                window.linkedLorebookFilename = result.lorebookFile;
            }
            
            // Store in infoData
            infoData.linkedLorebook = {
                filename: result.lorebookFile,
                data: lorebookData
            };
            
            console.log('Restored linked lorebook:', result.lorebookFile);
        }
    } catch (error) {
        console.error('Error restoring linked lorebook:', error);
    }
}

// Open current project in new tab
async function openCurrentProject() {
    if (!isLocal || !currentProject || !userSessionManager) {
        showStatus('error', 'No current project to open');
        return;
    }
    
    const userContext = userSessionManager.getUserContext();
    const userPath = userContext.isGuest ? 'guest' : userContext.userId;
    
    // Fetch config to get filename
    try {
        const response = await fetch('/api/projects/load', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectName: currentProject, userContext })
        });
        
        const data = await response.json();
        
        // Extract filename from the loaded project or default to info.html
        let htmlFilename = 'info.html';
        
        // Try to find config in the project folder
        const configResponse = await fetch(`/projects/${userPath}/${currentProject}/project-config.json`);
        if (configResponse.ok) {
            const config = await configResponse.json();
            htmlFilename = config.htmlFilename || 'info.html';
        }
        
        const projectUrl = `/projects/${userPath}/${currentProject}/${htmlFilename}`;
        
        console.log('Opening project URL:', projectUrl);
        window.open(projectUrl, '_blank');
    } catch (error) {
        console.error('Error opening project:', error);
        showStatus('error', 'Failed to open project');
    }
}

// UPDATE existing saveToSitesFolder function to update nav display
// Add this after the successful save, replace existing updateOpenProjectButton() call:
function updateNavAfterSave(projectName) {
    currentProject = projectName;
    window.currentProject = currentProject;
    updateNavProjectDisplay(projectName);
    updateOpenProjectButton();
    
    // Update nav dropdown selection
    const navProjectList = document.getElementById('nav-project-list');
    if (navProjectList && projectName) {
        navProjectList.value = projectName;
        const navLoadBtn = document.getElementById('nav-load-project-btn');
        if (navLoadBtn) navLoadBtn.disabled = false;
    }
    
    // Refresh projects list
    if (isLocal) {
        loadProjects();
    }
}

// Update visibility of open project button
function updateOpenProjectButton() {
    const openProjectBtn = document.getElementById('open-project-btn');
    if (openProjectBtn) {
        if (isLocal && currentProject) {
            openProjectBtn.style.display = 'inline-block';
        } else {
            openProjectBtn.style.display = 'none';
        }
    }
}

// Helper function used by saveToSitesFolder
function checkForGenerationError(html) {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const htmlTitle = titleMatch ? titleMatch[1] : '';
    const hasActualTitle = infoData.basic.title && infoData.basic.title.trim() !== '';
    
    return htmlTitle === 'World Information' && hasActualTitle;
}

// Enhanced saveToSitesFolder with modal for project name and filename
async function saveToSitesFolder() {
    if (!isLocal || !userSessionManager) {
        showStatus('error', 'File system access not available');
        return;
    }
    
    // Enhanced checks
    if (!window.htmlGenerated) {
        showStatus('error', 'Please generate HTML first using the "Create" button');
        return;
    }
    
    if (window.dataModified) {
        showStatus('error', 'Data has been modified. Please regenerate HTML before saving.');
        return;
    }
    
    const html = document.getElementById('html-output').value;
    if (!html) {
        showStatus('error', 'No HTML content found. Please generate HTML first.');
        return;
    }

    const hasError = checkForGenerationError(html);
    
    // Get project name
    const projectNameInput = document.getElementById('project-name');
    const navProjectList = document.getElementById('nav-project-list');

    let projectName = '';
    if (projectNameInput && projectNameInput.value) {
        projectName = projectNameInput.value.trim();
    } else if (currentProject) {
        projectName = currentProject;
    } else if (navProjectList && navProjectList.value) {
        projectName = navProjectList.value.trim();
    } else {
        // Show modal to get both project name and filename
        const modal = document.getElementById('saveProjectModal');
        const modalProjectNameInput = document.getElementById('save-project-name');
        const filenameInput = document.getElementById('save-html-filename');
        const confirmBtn = document.getElementById('confirm-save-project');
        
        // Clear previous values
        modalProjectNameInput.value = '';
        filenameInput.value = 'info';
        
        // Show modal
        modal.classList.add('active');
        modalProjectNameInput.focus();
        
        // Handle confirmation
        const handleConfirm = () => {
            projectName = modalProjectNameInput.value.trim();
            const filename = filenameInput.value.trim();
            
            if (!projectName) {
                showStatus('error', 'Project name is required');
                return;
            }
            if (!filename) {
                showStatus('error', 'Filename is required');
                return;
            }
            
            window.projectFilename = filename;
            modal.classList.remove('active');
            
            // Remove listeners
            confirmBtn.removeEventListener('click', handleConfirm);
            modalProjectNameInput.removeEventListener('keydown', handleEnter);
            filenameInput.removeEventListener('keydown', handleEnter);
            
            // Continue with the save by calling the rest of the function
            continueSaveToFolder(projectName, hasError, html);
        };
        
        // Handle Enter key in inputs
        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
            }
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        modalProjectNameInput.addEventListener('keydown', handleEnter);
        filenameInput.addEventListener('keydown', handleEnter);
        
        return; // Exit and wait for modal
    }
    
    // If we have project name, continue with save
    continueSaveToFolder(projectName, hasError, html);
}

async function continueSaveToFolder(projectName, hasError, html) {
    const projectNameInput = document.getElementById('project-name');
    
    try {
        const userContext = userSessionManager.getUserContext();
        let result; // Declare this at the top
        
        // Get the collected data (needed for saving built icons and style assets)
        const data = collectFormData();
        
        // Save built icons FIRST (before either path)
        showStatus('info', 'Saving built icons...');
        await saveBuiltIcons(projectName, data);
        
        if (hasError) {
            showStatus('info', 'Detected generation error, restoring backup and retrying...');
            
            // First restore the backup
            const restoreResponse = await fetch('/api/restore-backup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectName, userContext })
            });
            
            if (!restoreResponse.ok) {
                showStatus('error', 'Failed to restore backup');
                return;
            }
            
            // Regenerate HTML
            const newHtml = generateHTML();
            const stillHasError = checkForGenerationError(newHtml);
            
            if (stillHasError) {
                showStatus('error', 'Unable to generate valid HTML after backup restoration');
                return;
            }
            
            // Try saving again with skipBackup to preserve the good backup
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    html: newHtml, 
                    projectName,
                    filename: window.projectFilename || 'info',
                    userContext,
                    skipBackup: backupMadeThisSession,
                    styleAssets: getRequiredStyleAssets(data)
                })
            });
            
            result = await response.json(); // Set the shared result variable
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to save after recovery');
            }
            
            showStatus('success', 'Recovered from generation error and saved successfully');
        } else {
            // Normal save process
            showStatus('info', 'Saving to user folder...');
            
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    html, 
                    projectName,
                    filename: window.projectFilename || 'info',
                    userContext,
                    skipBackup: backupMadeThisSession,
                    styleAssets: getRequiredStyleAssets(data)
                })
            });
            
            result = await response.json(); // Set the shared result variable
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to save file');
            }
            
            let statusMessage = result.message;
            if (result.assetsRemoved && result.assetsRemoved > 0) {
                statusMessage += ` 🧹 (${result.assetsRemoved} unused style assets cleaned up)`;
            }
            showStatus('success', statusMessage);
        }
        
        // Common success actions for both paths - now result is defined
        currentProject = result.projectName;
        
        // Set backup flag to true after first successful save
        backupMadeThisSession = true;
        
        if (projectNameInput) {
            projectNameInput.value = result.projectName;
        }
        
        updateNavAfterSave(result.projectName);
        await loadProjects();
        
        const projectList = document.getElementById('project-list');
        if (projectList && currentProject) {
            projectList.value = currentProject;
            document.getElementById('load-project-btn').disabled = false;
        }
        
        await checkAssetsFolder(result.projectName);
    } catch (error) {
        console.error('Error saving to user folder:', error);
        showStatus('error', `Failed to save: ${error.message}`);
    }
}

// Assets Management
// Add this function somewhere near the other helper functions in info-converter.js
function getRequiredStyleAssets(data) {
    const assets = [];
    
    // Check if wuxia container style is being used
    const appearance = data.appearance || {};
    if (appearance.containerStyle === 'wuxia') {
        assets.push({
            source: 'images/styles/cloudrecesses.png',
            destination: 'images/styles/cloudrecesses.png'
        });
    }
    
    return assets;
}
// FIND the checkAssetsFolder function and REPLACE it with this safer version:
async function checkAssetsFolder(projectName) {
    if (!isLocal || !userSessionManager) return;
    
    const assetsStatus = document.getElementById('assets-status');
    const createAssetsBtn = document.getElementById('create-assets-btn');
    
    if (!assetsStatus || !createAssetsBtn) {
        console.log('Assets UI elements not found, skipping visual updates');
        return;
    }
    
    if (!projectName) {
        assetsStatus.textContent = '⚠ Select or create a project first';
        assetsStatus.className = 'assets-status missing';
        createAssetsBtn.style.display = 'none';
        return;
    }
    
    try {
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/assets/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, userContext })
        });
        
        const result = await response.json();
        
        if (result.needsProject) {
            assetsStatus.textContent = result.message;
            assetsStatus.className = 'assets-status missing';
            createAssetsBtn.style.display = 'none';
        } else if (result.exists) {
            assetsStatus.textContent = `✅ Assets folder exists for "${projectName}"`;
            assetsStatus.className = 'assets-status exists';
            createAssetsBtn.style.display = 'none';
        } else {
            assetsStatus.textContent = `⚠ No assets folder for "${projectName}"`;
            assetsStatus.className = 'assets-status missing';
            createAssetsBtn.style.display = 'inline-block';
            createAssetsBtn.setAttribute('data-project', projectName);
        }
    } catch (error) {
        console.error('Error checking assets folder:', error);
    }
}

async function createAssetsFolder() {
    if (!isLocal || !userSessionManager) return;
    
    const createAssetsBtn = document.getElementById('create-assets-btn');
    const projectName = createAssetsBtn.getAttribute('data-project') || document.getElementById('project-name').value.trim();
    
    if (!projectName) {
        showStatus('error', 'Please enter a project name first');
        return;
    }
    
    try {
        showStatus('info', 'Creating assets folder structure...');
        
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/assets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projectName, userContext })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatus('success', result.message);
            await checkAssetsFolder(result.projectName);
        } else {
            throw new Error(result.error || 'Failed to create assets folder');
        }
    } catch (error) {
        console.error('Error creating assets folder:', error);
        showStatus('error', `Failed to create assets folder: ${error.message}`);
    }
}

// Status Display
// Enhanced status display with better messaging
function showStatus(type, message) {
    const statusDiv = document.getElementById('save-status');
    if (!statusDiv) return;
    
    statusDiv.className = `save-status ${type}`;
    statusDiv.textContent = message;
    
    // Auto-hide success/info messages after 3 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'save-status';
        }, 3000);
    }
}

// ===================
// USERS stuff
// ===================
// ADD this helper function to info-converter.js (put it near the top)
function getCorrectAvatarPath(avatarPath) {
    if (!avatarPath) {
        return '../main/images/default-avatar.png';
    }
    
    // If it's a data URL (base64 image), use as-is
    if (avatarPath.startsWith('data:')) {
        return avatarPath;
    }
    
    // If it's an absolute URL, use as-is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }
    
    // If it's the default avatar from main app
    if (avatarPath === 'images/default-avatar.png') {
        return '../main/images/default-avatar.png';
    }
    
    // If it starts with main/, it's already a correct relative path
    if (avatarPath.startsWith('../main/') || avatarPath.startsWith('main/')) {
        return avatarPath;
    }
    
    // If it's just a filename or relative path, assume it's in main/images/
    if (!avatarPath.includes('/')) {
        return `../main/images/${avatarPath}`;
    }
    
    // For any other case, try to use it as-is first, fallback to default if it fails
    return avatarPath;
}

// REPLACE the updateUserAvatar function with this improved version
function updateUserAvatar() {
    const navUserAvatar = document.getElementById('nav-user-avatar');
    const avatarImg = document.getElementById('nav-avatar-img');
    
    if (!navUserAvatar || !avatarImg || !userSessionManager) return;
    
    const currentUser = userSessionManager.getCurrentUser();
    
    if (currentUser) {
        let avatarSrc = currentUser.avatar;
        
        // Convert main app path to info-converter relative path
        if (avatarSrc === 'images/default-avatar.png') {
            avatarSrc = '../images/default-avatar.png';
        }
        
        avatarImg.src = avatarSrc;
        avatarImg.alt = `${currentUser.username} Avatar`;
        navUserAvatar.style.display = 'flex';
    } else {
        navUserAvatar.style.display = 'none';
    }
}

// REPLACE the initializeUserSystem function in info-converter.js
async function initializeUserSystem() {
    try {
        console.log('Initializing user session system...');
        
        // Initialize session manager
        userSessionManager = initializeUserSession();

        // ADD THIS LINE:
        window.userSessionManager = userSessionManager;
        
        // Initialize auth UI
        infoConverterAuth = initializeAuthUI(userSessionManager);
        
        // Add user info display to UI (this is for the import section login, not nav)
        addUserInfoDisplay();
        
        // Initialize user session
        const hasValidUser = await userSessionManager.initializeUser();
        
        // Update UI with user info
        userSessionManager.updateUserDisplay();
        updateUserAvatar(); // ADD this line
        
        // Set up login button event
        setupUserInfoEvents();
        
        console.log('✅ User system initialized');
        
    } catch (error) {
        console.error('Error initializing user system:', error);
        // Continue with guest mode if something fails
        if (userSessionManager) {
            userSessionManager.setGuestMode();
            userSessionManager.updateUserDisplay();
            updateUserAvatar(); // ADD this line
        }
    }
}

// Add user info display to the interface
function addUserInfoDisplay() {
    // Find the import section or a suitable location
    const importSection = document.getElementById('import-section');
    const navContent = document.querySelector('.nav-content');
    
    let targetElement = navContent || importSection;
    
    if (!targetElement) {
        console.warn('Could not find suitable location for user info display');
        return;
    }
    
    // Create user info display
    const userInfoHTML = `
        <div class="user-info-display" id="user-info-display">
            <img src="../main/images/default-avatar.png" alt="User Avatar" class="user-avatar" id="user-avatar">
            <span class="username" id="current-username">Guest</span>
            <button class="login-btn" id="login-btn">Login</button>
        </div>
    `;
    
    // Insert the user info display
    if (navContent) {
        // If we have a nav, add it there
        navContent.insertAdjacentHTML('beforeend', userInfoHTML);
    } else {
        // Otherwise, add it to the import section
        importSection.insertAdjacentHTML('afterbegin', userInfoHTML);
    }
}

// Set up event listeners for user info controls
function setupUserInfoEvents() {
    const loginBtn = document.getElementById('login-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (userSessionManager && userSessionManager.isLoggedIn()) {
                // User is logged in, show logout confirmation
                infoConverterAuth.showLogoutConfirmation();
            } else {
                // User is guest, show login modal
                infoConverterAuth.showLoginModal();
            }
        });
    }
}

// Debug function for user session
window.debugUserSession = function() {
    if (!userSessionManager) {
        console.log('❌ User session manager not initialized');
        return;
    }
    
    console.log('=== USER SESSION DEBUG ===');
    console.log('Session info:', userSessionManager.getSessionInfo());
    console.log('Current user:', userSessionManager.getCurrentUser());
    console.log('User context:', userSessionManager.getUserContext());
    console.log('Is guest:', userSessionManager.isGuest);
    console.log('Is logged in:', userSessionManager.isLoggedIn());
    
    return userSessionManager.getSessionInfo();
};

// Debug function to check appearance state
window.debugAppearance = function() {
    console.log('=== APPEARANCE DEBUG ===');
    console.log('infoData.appearance:', infoData.appearance);
    
    const controls = {
        template: document.getElementById('appearance-template')?.value,
        colorScheme: document.getElementById('appearance-color-scheme')?.value,
        fontSet: document.getElementById('appearance-font-set')?.value,
        containerStyle: document.getElementById('appearance-container-style')?.value,
        subcontainerStyle: document.getElementById('appearance-subcontainer-style')?.value,
        infodisplayStyle: document.getElementById('appearance-infodisplay-style')?.value
    };
    
    console.log('UI control values:', controls);
    
    const mismatch = Object.keys(controls).filter(key => 
        infoData.appearance && infoData.appearance[key] !== controls[key]
    );
    
    if (mismatch.length > 0) {
        console.log('❌ Mismatches found:', mismatch);
        console.log('Try running: populateAppearanceControls()');
    } else {
        console.log('✅ Data and UI controls match');
    }
    
    return { data: infoData.appearance, controls, mismatch };
};

// Debug function to check hidden items state
window.debugHiddenItems = function() {
    console.log('=== HIDDEN ITEMS DEBUG ===');
    let totalHidden = 0;
    
    Object.keys(infoData.world).forEach(category => {
        const hidden = infoData.world[category].filter(item => item.hidden);
        if (hidden.length > 0) {
            console.log(`${category}: ${hidden.length} hidden items`);
            hidden.forEach(item => {
                console.log(`  - ${item.name} (hidden: ${item.hidden})`);
                totalHidden++;
            });
        }
    });
    
    if (totalHidden === 0) {
        console.log('No hidden items found in any category');
        console.log('Current infoData structure:', infoData);
    } else {
        console.log(`Total hidden items: ${totalHidden}`);
    }
    
    return totalHidden;
};

// Show all hidden items (unhide them)
window.showHidden = function() {
    let count = 0;
    
    // Go through all world categories
    Object.keys(infoData.world).forEach(category => {
        infoData.world[category].forEach(item => {
            if (item.hidden) {
                item.hidden = false;
                count++;
            }
        });
    });
    
    // Update the UI
    updateAllContentLists();
    
    console.log(`✅ Unhid ${count} items. They will now appear in the generated HTML.`);
    return count;
};

// Hide a specific item by name
window.hideItem = function(itemName) {
    if (!itemName || typeof itemName !== 'string') {
        console.error('❌ Please provide an item name as a string');
        return false;
    }
    
    const searchName = itemName.toLowerCase().trim();
    let found = false;
    
    // Search through all world categories
    Object.keys(infoData.world).forEach(category => {
        infoData.world[category].forEach(item => {
            if (item.name && item.name.toLowerCase().includes(searchName)) {
                item.hidden = true;
                found = true;
                console.log(`🙈 Hidden "${item.name}" from ${category}`);
            }
        });
    });
    
    if (found) {
        updateAllContentLists();
        console.log('✅ Item(s) hidden. They will not appear in the generated HTML.');
    } else {
        console.log(`❌ No items found matching "${itemName}"`);
    }
    
    return found;
};

// Show a specific item by name (unhide it)
window.showItem = function(itemName) {
    if (!itemName || typeof itemName !== 'string') {
        console.error('❌ Please provide an item name as a string');
        return false;
    }
    
    const searchName = itemName.toLowerCase().trim();
    let found = false;
    
    // Search through all world categories
    Object.keys(infoData.world).forEach(category => {
        infoData.world[category].forEach(item => {
            if (item.name && item.name.toLowerCase().includes(searchName) && item.hidden) {
                item.hidden = false;
                found = true;
                console.log(`👁️ Showed "${item.name}" from ${category}`);
            }
        });
    });
    
    if (found) {
        updateAllContentLists();
        console.log('✅ Item(s) unhidden. They will now appear in the generated HTML.');
    } else {
        console.log(`❌ No hidden items found matching "${itemName}"`);
    }
    
    return found;
};

// List all currently hidden items
window.listHidden = function() {
    const hiddenItems = [];
    
    // Go through all world categories
    Object.keys(infoData.world).forEach(category => {
        infoData.world[category].forEach(item => {
            if (item.hidden) {
                hiddenItems.push({
                    name: item.name,
                    category: category,
                    type: item.category || item.type || 'Unknown'
                });
            }
        });
    });
    
    if (hiddenItems.length === 0) {
        console.log('✅ No hidden items found');
        return [];
    }
    
    console.log(`🙈 Found ${hiddenItems.length} hidden item(s):`);
    console.table(hiddenItems);
    
    console.log('\nTo unhide an item, use: showItem("item name")');
    console.log('To unhide all items, use: showHidden()');
    
    return hiddenItems;
};

// Batch hide items by category
window.hideCategory = function(categoryName) {
    if (!categoryName || typeof categoryName !== 'string') {
        console.error('❌ Please provide a category name as a string');
        console.log('Available categories:', Object.keys(infoData.world).join(', '));
        return false;
    }
    
    const searchCategory = categoryName.toLowerCase().trim();
    let matchedCategory = null;
    
    // Find matching category (flexible matching)
    Object.keys(infoData.world).forEach(category => {
        if (category.toLowerCase().includes(searchCategory) || searchCategory.includes(category.toLowerCase())) {
            matchedCategory = category;
        }
    });
    
    if (!matchedCategory) {
        console.error(`❌ Category "${categoryName}" not found`);
        console.log('Available categories:', Object.keys(infoData.world).join(', '));
        return false;
    }
    
    let count = 0;
    infoData.world[matchedCategory].forEach(item => {
        if (!item.hidden) {
            item.hidden = true;
            count++;
        }
    });
    
    updateAllContentLists();
    console.log(`🙈 Hidden ${count} items from ${matchedCategory} category`);
    return count;
};

// Batch show items by category
window.showCategory = function(categoryName) {
    if (!categoryName || typeof categoryName !== 'string') {
        console.error('❌ Please provide a category name as a string');
        console.log('Available categories:', Object.keys(infoData.world).join(', '));
        return false;
    }
    
    const searchCategory = categoryName.toLowerCase().trim();
    let matchedCategory = null;
    
    // Find matching category (flexible matching)
    Object.keys(infoData.world).forEach(category => {
        if (category.toLowerCase().includes(searchCategory) || searchCategory.includes(category.toLowerCase())) {
            matchedCategory = category;
        }
    });
    
    if (!matchedCategory) {
        console.error(`❌ Category "${categoryName}" not found`);
        console.log('Available categories:', Object.keys(infoData.world).join(', '));
        return false;
    }
    
    let count = 0;
    infoData.world[matchedCategory].forEach(item => {
        if (item.hidden) {
            item.hidden = false;
            count++;
        }
    });
    
    updateAllContentLists();
    console.log(`👁️ Showed ${count} items from ${matchedCategory} category`);
    return count;
};

// ===============================
// END HIDDEN ITEMS FUNCTIONS
// ===============================

// AUTOSCROLL STUFF

// Auto-scroll variables
let autoScrollInterval = null;
let autoScrollSpeed = 0;
let isDragging = false;

// Auto-scroll configuration
const AUTO_SCROLL_ZONE_HEIGHT = 40; // pixels from edge to trigger scroll
const AUTO_SCROLL_SPEED = 2; // pixels per interval
const AUTO_SCROLL_INTERVAL = 16; // milliseconds (60fps)

// Enhanced drag listeners with auto-scroll
function addDragListeners(element, container) {
    element.draggable = true;
    
    element.addEventListener('dragstart', function(e) {
        draggedElement = this;
        isDragging = true;
        this.classList.add('dragging');
        container.classList.add('dragging');
        
        // Set up auto-scroll monitoring
        setupAutoScroll(container);
        
        e.dataTransfer.effectAllowed = 'move';
    });
    
    element.addEventListener('dragend', function(e) {
        isDragging = false;
        this.classList.remove('dragging');
        container.classList.remove('dragging');
        
        // Clean up auto-scroll
        cleanupAutoScroll();
        
        // Clean up drag-over states
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
        
        draggedElement = null;
    });
    
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        
        if (draggedElement && draggedElement !== this) {
            // Remove existing drag-over classes
            container.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
            
            // Add drag-over to current element
            this.classList.add('drag-over');
            
            // Update auto-scroll based on mouse position
            updateAutoScroll(e, container);
        }
    });
    
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (draggedElement && draggedElement !== this) {
            // Handle the actual reordering
            handleDrop(draggedElement, this, container);
        }
        
        this.classList.remove('drag-over');
    });
}

// Set up auto-scroll monitoring
function setupAutoScroll(container) {
    updateScrollIndicators(container);
    
    // Start monitoring interval
    if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
            if (autoScrollSpeed !== 0 && isDragging) {
                container.scrollTop += autoScrollSpeed;
                updateScrollIndicators(container);
            }
        }, AUTO_SCROLL_INTERVAL);
    }
}

// Update auto-scroll based on mouse position
function updateAutoScroll(e, container) {
    if (!isDragging) return;
    
    const containerRect = container.getBoundingClientRect();
    const mouseY = e.clientY;
    const relativeY = mouseY - containerRect.top;
    const containerHeight = containerRect.height;
    
    // Check if mouse is in auto-scroll zones
    if (relativeY < AUTO_SCROLL_ZONE_HEIGHT && container.scrollTop > 0) {
        // Near top, scroll up
        const intensity = (AUTO_SCROLL_ZONE_HEIGHT - relativeY) / AUTO_SCROLL_ZONE_HEIGHT;
        autoScrollSpeed = -AUTO_SCROLL_SPEED * intensity;
    } else if (relativeY > containerHeight - AUTO_SCROLL_ZONE_HEIGHT && 
               container.scrollTop < container.scrollHeight - container.clientHeight) {
        // Near bottom, scroll down
        const intensity = (relativeY - (containerHeight - AUTO_SCROLL_ZONE_HEIGHT)) / AUTO_SCROLL_ZONE_HEIGHT;
        autoScrollSpeed = AUTO_SCROLL_SPEED * intensity;
    } else {
        // Not in auto-scroll zone
        autoScrollSpeed = 0;
    }
}

// Clean up auto-scroll
function cleanupAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
    autoScrollSpeed = 0;
}

// Update scroll indicators
function updateScrollIndicators(container) {
    if (!container) return;
    
    const canScrollUp = container.scrollTop > 0;
    const canScrollDown = container.scrollTop < container.scrollHeight - container.clientHeight;
    
    container.classList.toggle('can-scroll-up', canScrollUp);
    container.classList.toggle('can-scroll-down', canScrollDown);
}

// Handle actual drop and reordering
function handleDrop(draggedEl, targetEl, container) {
    const draggedIndex = Array.from(container.children).indexOf(draggedEl);
    const targetIndex = Array.from(container.children).indexOf(targetEl);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Determine the content type and update the data
    const contentType = getContentTypeFromContainer(container);
    if (!contentType) return;
    
    // Move the item in the data array
    let items;
    if (contentType === 'characters') {
        items = infoData.characters;
    } else if (contentType === 'storylines') {
        items = infoData.storylines;
    } else if (contentType === 'plans') {
        items = infoData.plans;
    } else if (contentType === 'playlists') {
        items = infoData.playlists;
    } else if (infoData.world[contentType]) {
        items = infoData.world[contentType];
    }
    
    if (items && draggedIndex !== targetIndex) {
        // Move item in array
        const [movedItem] = items.splice(draggedIndex, 1);
        items.splice(targetIndex, 0, movedItem);
        
        // Update the UI
        updateContentList(contentType);
        
        console.log(`Moved ${contentType} item from position ${draggedIndex} to ${targetIndex}`);
    }
}

// Helper function to determine content type from container
function getContentTypeFromContainer(container) {
    const id = container.id;
    if (id.includes('characters')) return 'characters';
    if (id.includes('storylines')) return 'storylines';
    if (id.includes('plans')) return 'plans';
    if (id.includes('playlists')) return 'playlists';
    if (id.includes('general')) return 'general';
    if (id.includes('locations')) return 'locations';
    if (id.includes('concepts')) return 'concepts';
    if (id.includes('events')) return 'events';
    if (id.includes('creatures')) return 'creatures';
    if (id.includes('plants')) return 'plants';
    if (id.includes('items')) return 'items';
    if (id.includes('factions')) return 'factions';
    if (id.includes('culture')) return 'culture';
    if (id.includes('cultivation')) return 'cultivation';
    if (id.includes('magic')) return 'magic';
    return null;
}

// Initialize scroll indicators on all content lists
function initializeScrollIndicators() {
    document.querySelectorAll('.content-list').forEach(container => {
        updateScrollIndicators(container);
        
        // Add scroll event listener to update indicators
        container.addEventListener('scroll', () => {
            updateScrollIndicators(container);
        });
    });
}

// =====================
// END Auto Scroll Stuff
// =====================

// Event Listeners
function initializeEventListeners() {
    // Project management event listeners
    const loadProjectBtn = document.getElementById('load-project-btn');
    if (loadProjectBtn) {
        loadProjectBtn.addEventListener('click', loadProject);
    }
    
    const refreshProjectsBtn = document.getElementById('refresh-projects-btn');
    if (refreshProjectsBtn) {
        refreshProjectsBtn.addEventListener('click', loadProjects);
    }
    
    const saveToSitesBtn = document.getElementById('save-to-sites-btn');
    if (saveToSitesBtn) {
        saveToSitesBtn.addEventListener('click', saveToSitesFolder);
    }
    
    const createAssetsBtn = document.getElementById('create-assets-btn');
    if (createAssetsBtn) {
        createAssetsBtn.addEventListener('click', createAssetsFolder);
    }
    
    // Project list change handler
    const projectList = document.getElementById('project-list');
    if (projectList) {
        projectList.addEventListener('change', () => {
            const loadBtn = document.getElementById('load-project-btn');
            if (loadBtn) {
                loadBtn.disabled = !projectList.value;
            }
            // Update assets status when project selection changes
            if (projectList.value) {
                checkAssetsFolder(projectList.value);
            } else {
                checkAssetsFolder();
            }
        });
    }

    // Context menu for Generate tab
    const generateTab = document.querySelector('[data-tab="generate"]');
    const contextMenu = document.getElementById('generate-context-menu');

    if (generateTab && contextMenu) {
        // Right-click on Generate tab
        generateTab.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Update Quick Open state before showing menu
            updateQuickOpenState();
            
            // Position context menu
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.style.display = 'block';
        });
        
        // Click Quick Gen option
        document.getElementById('quick-gen-option').addEventListener('click', quickGenerate);

        // ADD THIS: Click Quick Open option
        document.getElementById('quick-open-option').addEventListener('click', quickOpenProject);
        
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
            // ADD: Also hide nav context menu
            if (!navContextMenu.contains(e.target)) {
                navContextMenu.style.display = 'none';
            }
        });

        // ADD: Hide context menus when right-clicking elsewhere
        document.addEventListener('contextmenu', (e) => {
            // Only hide if not right-clicking on the generate tab or nav dropdown
            if (!generateTab.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
            if (!navProjectList.contains(e.target)) {
                navContextMenu.style.display = 'none';
            }
        });
    }

    //Context menu for color pickers
        // Color picker context menu
    let currentColorPicker = null;
    const colorContextMenu = document.getElementById('color-picker-context-menu');
    const hexInput = document.getElementById('color-hex-input');

    if (colorContextMenu && hexInput) {
        // Right-click on any color picker
        document.addEventListener('contextmenu', (e) => {
            if (e.target.type === 'color') {
                e.preventDefault();
                currentColorPicker = e.target;
                
                // Set current value in input
                hexInput.value = e.target.value;
                
                // Position and show menu
                colorContextMenu.style.left = e.pageX + 'px';
                colorContextMenu.style.top = e.pageY + 'px';
                colorContextMenu.style.display = 'block';
                
                // Focus and select the input
                setTimeout(() => hexInput.focus(), 10);
            }
        });
        
        // Apply button click
        document.getElementById('apply-hex-color').addEventListener('click', () => {
            if (currentColorPicker && hexInput.value) {
                const hexValue = hexInput.value.trim();
                if (isValidHexColor(hexValue)) {
                    currentColorPicker.value = hexValue;
                    // Trigger change event to sync with any text inputs
                    currentColorPicker.dispatchEvent(new Event('input'));
                    currentColorPicker.dispatchEvent(new Event('change'));
                }
            }
            colorContextMenu.style.display = 'none';
        });
        
        // Apply on Enter key
        hexInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('apply-hex-color').click();
            }
        });
        
        // Hide menu when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!colorContextMenu.contains(e.target)) {
                colorContextMenu.style.display = 'none';
            }
        });
    }

    // Double-click color picker to copy hex value
    // Double-click color picker to copy hex value (prevent picker opening)
    let colorPickerClicks = new Map();

    document.addEventListener('mousedown', (e) => {
        if (e.target.type === 'color') {
            const now = Date.now();
            const lastClick = colorPickerClicks.get(e.target) || 0;
            
            if (now - lastClick < 400) { // Double-click detected
                // Prevent the color picker from opening
                e.target.style.pointerEvents = 'none';
                e.preventDefault();
                e.stopPropagation();
                
                // Copy the hex value
                const hexValue = e.target.value;
                
                // Add visual feedback
                e.target.classList.add('copied');
                setTimeout(() => e.target.classList.remove('copied'), 300);
                
                // Copy to clipboard
                (async () => {
                    try {
                        await navigator.clipboard.writeText(hexValue);
                        showToast('success', `Copied ${hexValue} to clipboard`, 2000);
                    } catch (error) {
                        const textArea = document.createElement('textarea');
                        textArea.value = hexValue;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showToast('success', `Copied ${hexValue} to clipboard`, 2000);
                    }
                })();
                
                // Re-enable pointer events after a short delay
                setTimeout(() => {
                    e.target.style.pointerEvents = '';
                }, 200);
                
                colorPickerClicks.delete(e.target);
            } else {
                // Single click - record the time
                colorPickerClicks.set(e.target, now);
            }
        }
    });

    // Context menu for nav project dropdown
    const navProjectList = document.getElementById('nav-project-list');
    const navContextMenu = document.getElementById('nav-project-context-menu');

    if (navProjectList && navContextMenu) {
        // Right-click on nav project dropdown
        navProjectList.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Position context menu
            navContextMenu.style.left = e.pageX + 'px';
            navContextMenu.style.top = e.pageY + 'px';
            navContextMenu.style.display = 'block';
        });
        
        // Click Quick Load option
        document.getElementById('quick-load-option').addEventListener('click', quickLoadLastProject);

        // Click Rename option
        document.getElementById('rename-project-option').addEventListener('click', showRenameProjectModal);
        
        // Hide nav context menu when clicking elsewhere (update existing document click handler)
        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
            // Add this line to the existing handler:
            if (!navContextMenu.contains(e.target)) {
                navContextMenu.style.display = 'none';
            }
        });
    }
    
    // Initialize other event listeners
    initializeCollapsibles();
    initializeModals();
    initializeTextEditorModal();
    initializeTabs();
    initializeButtons();
    initializeFormListeners();
    initializeSidebar();
    populateTitleFontDropdown();
    // ADD this line at the very end:
    initializeNavEventListeners();
    initializeOverviewBackgroundControls();
    initializeModalBackgroundControls();
    initializeMainContainerBackgroundControls(); 
}

function initializeNavEventListeners() {
    const navLoadBtn = document.getElementById('nav-load-project-btn');
    if (navLoadBtn) {
        navLoadBtn.addEventListener('click', loadNavProject);
    }
    
    const navProjectList = document.getElementById('nav-project-list');
    if (navProjectList) {
        navProjectList.addEventListener('change', () => {
            const loadBtn = document.getElementById('nav-load-project-btn');
            if (loadBtn) {
                loadBtn.disabled = !navProjectList.value;
            }
        });
    }

    // Add storyline dropdown event listeners
    const storyDropdown = document.getElementById('story-roleplay-dropdown');
    const storyImportBtn = document.getElementById('story-import-btn');

    if (storyDropdown) {
        storyDropdown.addEventListener('change', handleStorylineDropdownChange);
    }

    if (storyImportBtn) {
        storyImportBtn.addEventListener('click', handleStorylineImport);
    }

    initializeImageImportTriggers();
}

function initializeCollapsibles() {
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function() {
            toggleCollapsible(this);
        });
    });
}

function initializeModals() {
    // Close modal when clicking the X button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Close modal when clicking cancel buttons
    document.querySelectorAll('.btn-cancel').forEach(cancelBtn => {
        cancelBtn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function initializeTabs() {
    // Main tabs
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchMainTab(tabName);
        });
    });
    
    // Sub-tabs (Generate/Preview)
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchSubTab(tabName);
        });
    });
}

function initializeButtons() {
    // Main action buttons
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateHTML);
    }
    
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadHTML);
    }

    // ADD THIS: Save to Folder button event listener
    const saveToSitesBtn = document.getElementById('save-to-sites-btn');
    if (saveToSitesBtn) {
        saveToSitesBtn.addEventListener('click', saveToSitesFolder);
        // Initialize disabled state
        updateSaveButtonState();
    }
    
    const openProjectBtn = document.getElementById('open-project-btn');
    if (openProjectBtn) {
        openProjectBtn.addEventListener('click', openCurrentProject);
    }
    
    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
        importBtn.addEventListener('click', importHTML);
    }
    
    // Add content buttons
    const addCharacterBtn = document.getElementById('add-character');
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', addCharacter);
    }
    
    const addStorylineBtn = document.getElementById('add-storyline');
    if (addStorylineBtn) {
        addStorylineBtn.addEventListener('click', addStoryline);
    }

    const storylinesOptionsBtn = document.getElementById('storylines-options');
    if (storylinesOptionsBtn) {
        storylinesOptionsBtn.addEventListener('click', openStorylinesOptionsModal);
    }

    const plansOptionsBtn = document.getElementById('plans-options');
    if (plansOptionsBtn) {
        plansOptionsBtn.addEventListener('click', openPlansOptionsModal);
    }

    const charactersOptionsBtn = document.getElementById('characters-options');
    if (charactersOptionsBtn) {
        charactersOptionsBtn.addEventListener('click', openCharactersOptionsModal);
    }

    const cultivationOptionsBtn = document.getElementById('cultivation-options');
    if (cultivationOptionsBtn) {
        cultivationOptionsBtn.addEventListener('click', openCultivationOptionsModal);
    }

    const magicOptionsBtn = document.getElementById('magic-options');
    if (magicOptionsBtn) {
        magicOptionsBtn.addEventListener('click', openMagicOptionsModal);
    }

    const cultureOptionsBtn = document.getElementById('culture-options');
    if (cultureOptionsBtn) {
        cultureOptionsBtn.addEventListener('click', openCultureOptionsModal);
    }

    const eventsOptionsBtn = document.getElementById('events-options');
    if (eventsOptionsBtn) {
        eventsOptionsBtn.addEventListener('click', openEventsOptionsModal);
    }
    
    // Plan buttons
    const addPlanBtn = document.getElementById('add-plan');
    if (addPlanBtn) {
        addPlanBtn.addEventListener('click', addPlan);
    }

    const addPlaylistBtn = document.getElementById('add-playlist');
    if (addPlaylistBtn) {
        addPlaylistBtn.addEventListener('click', () => {
            editingIndex = -1;
            editingType = 'playlist';
            openPlaylistModal();
        });
    }
    
    // NEW: Sub-arc buttons
    const addSubArcBtn = document.getElementById('add-subarc-btn');
    if (addSubArcBtn) {
        addSubArcBtn.addEventListener('click', addSubArc);
    }
    
    const addSubArcEventBtn = document.getElementById('add-subarc-event-btn');
    if (addSubArcEventBtn) {
        addSubArcEventBtn.addEventListener('click', () => {
            addEventToSubArc();
        });
    }
    
    const addLocationBtn = document.getElementById('add-location');
    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', addLocation);
    }
    
    const addConceptBtn = document.getElementById('add-concept');
    if (addConceptBtn) {
        addConceptBtn.addEventListener('click', addConcept);
    }
    
    const addEventBtn = document.getElementById('add-event');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', addEvent);
    }
    
    const addCreatureBtn = document.getElementById('add-creature');
    if (addCreatureBtn) {
        addCreatureBtn.addEventListener('click', addCreature);
    }
    
    const addPlantBtn = document.getElementById('add-plant');
    if (addPlantBtn) {
        addPlantBtn.addEventListener('click', addPlant);
    }
    
    const addItemBtn = document.getElementById('add-item');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addItem);
    }
    
    const addFactionBtn = document.getElementById('add-faction');
    if (addFactionBtn) {
        addFactionBtn.addEventListener('click', addFaction);
    }
    
    // Add new category buttons
    const addCultureBtn = document.getElementById('add-culture');
    if (addCultureBtn) {
        addCultureBtn.addEventListener('click', addCulture);
    }
    
    const addCultivationBtn = document.getElementById('add-cultivation');
    if (addCultivationBtn) {
        addCultivationBtn.addEventListener('click', addCultivation);
    }

    const addMagicBtn = document.getElementById('add-magic');
    if (addMagicBtn) {
        addMagicBtn.addEventListener('click', addMagic);
    }

    const addGeneralBtn = document.getElementById('add-general');
    if (addGeneralBtn) {
        addGeneralBtn.addEventListener('click', addGeneral);
    }
    
    // Save buttons in modals
    const saveCharacterBtn = document.getElementById('save-character');
    if (saveCharacterBtn) {
        saveCharacterBtn.addEventListener('click', saveCharacter);
    }
    
    const saveStorylineBtn = document.getElementById('save-storyline');
    if (saveStorylineBtn) {
        saveStorylineBtn.addEventListener('click', saveStoryline);
    }

    const saveStorylinesOptionsBtn = document.getElementById('save-storylines-options');
    if (saveStorylinesOptionsBtn) {
        saveStorylinesOptionsBtn.addEventListener('click', saveStorylinesOptions);
    }

    const savePlansOptionsBtn = document.getElementById('save-plans-options');
    if (savePlansOptionsBtn) {
        savePlansOptionsBtn.addEventListener('click', savePlansOptions);
    }

    const saveCharactersOptionsBtn = document.getElementById('save-characters-options');
    if (saveCharactersOptionsBtn) {
        saveCharactersOptionsBtn.addEventListener('click', saveCharactersOptions);
    }

    const saveCultivationOptionsBtn = document.getElementById('save-cultivation-options');
    if (saveCultivationOptionsBtn) {
        saveCultivationOptionsBtn.addEventListener('click', saveCultivationOptions);
    }

    const saveMagicOptionsBtn = document.getElementById('save-magic-options');
    if (saveMagicOptionsBtn) {
        saveMagicOptionsBtn.addEventListener('click', saveMagicOptions);
    }

    const saveCultureOptionsBtn = document.getElementById('save-culture-options');
    if (saveCultureOptionsBtn) {
        saveCultureOptionsBtn.addEventListener('click', saveCultureOptions);
    }

    const saveEventsOptionsBtn = document.getElementById('save-events-options');
    if (saveEventsOptionsBtn) {
        saveEventsOptionsBtn.addEventListener('click', saveEventsOptions);
    }

    const manageFactionOrderBtn = document.getElementById('manage-faction-order-btn');
    if (manageFactionOrderBtn) {
        manageFactionOrderBtn.addEventListener('click', openFactionOrderModal);
    }

    const saveFactionOrderBtn = document.getElementById('save-faction-order');
    if (saveFactionOrderBtn) {
        saveFactionOrderBtn.addEventListener('click', saveFactionOrder);
    }

    const customizeInfoDisplayLabelsBtn = document.getElementById('customize-info-display-labels-btn');
    if (customizeInfoDisplayLabelsBtn) {
        customizeInfoDisplayLabelsBtn.addEventListener('click', openInfoDisplayLabelsModal);
    }

    const saveInfoDisplayLabelsBtn = document.getElementById('save-info-display-labels');
    if (saveInfoDisplayLabelsBtn) {
        saveInfoDisplayLabelsBtn.addEventListener('click', saveInfoDisplayLabels);
    }
    
    // Plan/event save buttons
    const savePlanBtn = document.getElementById('save-plan');
    if (savePlanBtn) {
        savePlanBtn.addEventListener('click', savePlan);
    }
    
    const saveEventBtn = document.getElementById('save-event');
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', saveEvent);
    }
    
    // NEW: Sub-arc save button
    const saveSubArcBtn = document.getElementById('save-subarc');
    if (saveSubArcBtn) {
        saveSubArcBtn.addEventListener('click', saveSubArc);
    }
    
    // Add event within plan button
    const addEventInPlanBtn = document.getElementById('add-event-btn');
    if (addEventInPlanBtn) {
        addEventInPlanBtn.addEventListener('click', () => {
            addEventToPlan('main');
        });
    }
    
    const saveLocationBtn = document.getElementById('save-location');
    if (saveLocationBtn) {
        saveLocationBtn.addEventListener('click', saveLocation);
    }
    
    const saveWorldItemBtn = document.getElementById('save-world-item');
    if (saveWorldItemBtn) {
        saveWorldItemBtn.addEventListener('click', saveWorldItem);
    }
}

function initializeFormListeners() {
        // Make sure this gets called in initializeFormListeners
        const mainContainerColorInput = document.getElementById('main-container-color');
        if (mainContainerColorInput) {
            mainContainerColorInput.addEventListener('input', function() {
                if (!infoData.basic) {
                    infoData.basic = {};
                }
                infoData.basic.mainContainerColor = this.value;
                window.markDataAsModified();
            });
        }

    // Auto-save basic information as user types
    const worldTitleInput = document.getElementById('world-title');
    if (worldTitleInput) {
        worldTitleInput.addEventListener('input', function() {
            infoData.basic.title = this.value;
            window.markDataAsModified();
        });
    }
    
    const worldSubtitleInput = document.getElementById('world-subtitle');
    if (worldSubtitleInput) {
        worldSubtitleInput.addEventListener('input', function() {
            infoData.basic.subtitle = this.value;
            window.markDataAsModified();
        });
    }

    // Title Settings - Font dropdown
    const titleFontInput = document.getElementById('world-title-font');
    if (titleFontInput) {
        titleFontInput.addEventListener('change', function() {
            if (!infoData.basic.titleSettings) {
                infoData.basic.titleSettings = { show: true, position: 'left', font: 'theme', color: '' };
            }
            infoData.basic.titleSettings.font = this.value;
            window.markDataAsModified();
        });
    }

    // Title Settings - Color picker synchronization
    const titleColorText = document.getElementById('world-title-color');
    const titleColorPicker = document.getElementById('world-title-color-picker');

    if (titleColorText && titleColorPicker) {
        titleColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && isValidHexColor(color)) {
                titleColorPicker.value = color;
            }
            if (!infoData.basic.titleSettings) {
                infoData.basic.titleSettings = { show: true, alignment: 'left', position: 'bottom', font: 'theme', color: '' };
            }
            infoData.basic.titleSettings.color = this.value;
            window.markDataAsModified();
        });
        
        titleColorPicker.addEventListener('input', function() {
            titleColorText.value = this.value;
            if (!infoData.basic.titleSettings) {
                infoData.basic.titleSettings = { show: true, alignment: 'left', position: 'bottom', font: 'theme', color: '' };
            }
            infoData.basic.titleSettings.color = this.value;
            window.markDataAsModified();
        });
    }

    // FIXED: Title Settings - Show/Hide checkbox (use correct ID)
    const titleShowInput = document.getElementById('world-title-visibility'); // CHANGED from 'title-show'
    if (titleShowInput) {
        titleShowInput.addEventListener('change', function() {
            // Initialize titleSettings if it doesn't exist
            if (!infoData.basic.titleSettings) {
                infoData.basic.titleSettings = { show: true, alignment: 'left', position: 'bottom' };
            }
            infoData.basic.titleSettings.show = this.checked;
            window.markDataAsModified();
        });
    }
    
    // FIXED: Title Settings - Alignment dropdown (horizontal positioning)
    const titleAlignmentInput = document.getElementById('world-title-alignment');
    if (titleAlignmentInput) {
        titleAlignmentInput.addEventListener('change', function() {
            // Initialize titleSettings if it doesn't exist
            if (!infoData.basic.titleSettings) {
                infoData.basic.titleSettings = { show: true, alignment: 'left', position: 'bottom' };
            }
            infoData.basic.titleSettings.alignment = this.value;
            window.markDataAsModified();
        });
    }

    // NEW: Title Settings - Position dropdown (vertical positioning)
    const titlePositionInput = document.getElementById('world-title-position');
    if (titlePositionInput) {
        titlePositionInput.addEventListener('change', function() {
            // Initialize titleSettings if it doesn't exist
            if (!infoData.basic.titleSettings) {
                infoData.basic.titleSettings = { show: true, alignment: 'left', position: 'bottom' };
            }
            infoData.basic.titleSettings.position = this.value;
            window.markDataAsModified();
        });
    }
    
    const bannerImageInput = document.getElementById('banner-image');
    if (bannerImageInput) {
        bannerImageInput.addEventListener('input', function() {
            infoData.basic.banner = this.value;
            window.markDataAsModified();
        });
    }
    
    const overviewTitleInput = document.getElementById('overview-title');
    if (overviewTitleInput) {
        overviewTitleInput.addEventListener('input', function() {
            infoData.basic.overviewTitle = this.value;
            window.markDataAsModified();
        });
    }

    if (infoData.basic.overviewLinks) {
        overviewLinksData = [...infoData.basic.overviewLinks];
        setTimeout(() => {
            renderOverviewLinks();
            updateAddButtonState();
        }, 100);
    }
    
    const overviewInput = document.getElementById('overview-text');
    if (overviewInput) {
        overviewInput.addEventListener('input', function() {
            infoData.basic.overview = this.value;
            window.markDataAsModified();
        });
    }
    
    const overviewImageInput = document.getElementById('overview-image');
    if (overviewImageInput) {
        overviewImageInput.addEventListener('input', function() {
            infoData.basic.overviewImage = this.value;
            window.markDataAsModified();
        });
    }
    
    const backgroundColorInput = document.getElementById('background-color');
    if (backgroundColorInput) {
        backgroundColorInput.addEventListener('input', function() {
            infoData.basic.backgroundColor = this.value;
            window.markDataAsModified();
        });
    }
    
    const backgroundImageInput = document.getElementById('background-image');
    if (backgroundImageInput) {
        backgroundImageInput.addEventListener('input', function() {
            infoData.basic.backgroundImage = this.value;
            window.markDataAsModified();
        });
    }

    // NEW: Add storyline project link checkbox handler
    // NEW: Add storyline project link checkbox handler
    const projectLinkCheckbox = document.getElementById('story-is-project-link');
    const storylinkInput = document.getElementById('story-link');
    const storylinkHelper = document.getElementById('story-link-helper');

    if (projectLinkCheckbox && storylinkInput && storylinkHelper) {
        projectLinkCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Switch to project link mode
                storylinkInput.placeholder = 'story-title.html';
                storylinkInput.title = 'Enter just the HTML filename (roleplays/ will be added automatically)';
                storylinkHelper.textContent = 'Project filename only. Save your HTML files in the roleplays/ folder for this to work.';
                
                // Enable dropdown and populate it
                populateStorylineDropdown();
            } else {
                // Switch to external URL mode  
                storylinkInput.placeholder = 'https://archiveofourown.org/works/123456';
                storylinkInput.title = 'Enter the full URL to the storyline';
                storylinkHelper.textContent = 'External URL (unchecked) or project filename (checked). Project files should be saved in the roleplays/ folder.';
                
                // Disable dropdown
                const dropdown = document.getElementById('story-roleplay-dropdown');
                const importBtn = document.getElementById('story-import-btn');
                if (dropdown) {
                    dropdown.disabled = true;
                    dropdown.value = '';
                }
                if (importBtn) {
                    importBtn.disabled = true;
                }
            }
        });
    }
    
    // Handle Enter key in modal forms to save
    document.querySelectorAll('.modal input').forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const modal = this.closest('.modal');
                const saveButton = modal.querySelector('[id*="save-"]');
                if (saveButton) {
                    saveButton.click();
                }
            }
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl+G or Cmd+G to generate
    if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        generateHTML();
    }
    
    // Ctrl+S or Cmd+S to save (local mode) or download (hosted mode)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (isLocal) {
            saveToSitesFolder();
        } else {
            downloadHTML();
        }
    }
    
    // Ctrl+Shift+I or Cmd+Shift+I to import
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        if (isLocal) {
            document.getElementById('load-project-btn').click();
        } else {
            document.getElementById('import-file').click();
        }
    }
});

// Enhanced download function with Node.js integration
async function downloadHTML() {
    const html = document.getElementById('html-output').value;
    if (!html) {
        showStatus('error', 'Please generate HTML first');
        return;
    }
    
    const projectName = document.getElementById('project-name')?.value.trim() || 'info';
    // Get filename from input or default to project name
    const filenameInput = document.getElementById('html-filename');
    let filename = filenameInput?.value.trim() || projectName || 'info';
    // Ensure .html extension
    if (!filename.endsWith('.html')) {
        filename += '.html';
    }
    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9-_.]/g, '');
    
    if (isLocal) {
        // In local mode, offer choice between download and save to sites
        if (confirm('Save to sites folder instead of downloading?')) {
            await saveToSitesFolder();
            return;
        }
    }
    
    // Fallback to regular download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Import function for the enhanced Node.js version
function importHTML() {
    const fileInput = document.getElementById('import-file');
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to import');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const htmlContent = e.target.result;
        parseImportedHTML(htmlContent);
        
        // Explicitly update appearance controls after import with a slight delay
        setTimeout(() => {
            if (typeof window.populateAppearanceControls === 'function') {
                window.populateAppearanceControls();
            }
        }, 100);
    };
    
    reader.readAsText(file);
}

// Utility functions
function resetForm() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        // Reset data structure - now includes plans, notes, subtitle, and new overview fields
        infoData = {
            basic: {
                title: '',
                subtitle: '',        // Reset subtitle
                banner: '',
                overviewTitle: '',
                overview: '',
                overviewImage: '',
                backgroundColor: '',
                backgroundImage: '', 
                overviewContentBgImage: '',
                overviewContentBgColor: '',
                overviewContentOpacity: 100,
                overviewContentBlur: 0,              
                mainContainerColor: '',
                mainContainerBgImage: '',
                mainContainerBgColor: '',
                // ADD THIS:
                titleSettings: {
                    show: true,        // Show or hide title/subtitle
                    position: 'left',  // 'left', 'center', or 'right'
                    font: 'theme',     // Font set to use or 'theme' for default
                    color: ''          // Custom color or '' for theme default
                }
            },
            appearance: {
                template: 'journal',
                overviewStyle: 'journal',
                navigationStyle: 'journal',
                colorScheme: 'current',
                fontSet: 'serif',
                bannerSize: 'large',
                cardStyle: 'current',
                containerStyle: 'left-border',
                subcontainerStyle: 'soft-bg',
                infodisplayStyle: 'default'
            },
            characters: [],
            storylines: [],
            storylinesOptions: {
                showTOC: true,
                showSections: true,
                showSubsections: true
            },
            charactersOptions: {
                showByFaction: true,
                showInfoDisplay: false  // ADD THIS LINE
            },
            eventsOptions: {       // ADD THIS
                customLabel: 'Events'
            },
            cultureOptions: {       // ADD THIS
                customLabel: 'Culture'
            },
            cultivationOptions: {       // ADD THIS
                customLabel: 'Cultivation'
            },
            magicOptions: {
                customLabel: 'Magic'
            },
            plans: [], // Reset plans
            plansOptions: {  // ADD THIS
                selectedTimeSystemId: 'default'
            },
            world: {
                general: [],
                locations: [],
                concepts: [],
                events: [],
                creatures: [],
                plants: [],
                items: [],
                factions: [],
                culture: [],
                cultivation: [],
                magic: []
            }
        };
        
        // Clear form fields - including new fields
        document.getElementById('world-title').value = '';
        document.getElementById('world-subtitle').value = '';
        document.getElementById('world-title-font').value = '';
        document.getElementById('world-title-color').value = '';
        document.getElementById('banner-image').value = '';
        document.getElementById('overview-title').value = '';
        document.getElementById('overview-text').value = '';
        document.getElementById('overview-image').value = '';
        document.getElementById('background-color').value = '';
        document.getElementById('background-image').value = '';
        document.getElementById('overview-content-bg-image').value = '';
        document.getElementById('overview-content-bg-color').value = '';
        document.getElementById('overview-content-opacity').value = '100';
        document.getElementById('overview-content-blur').value = '0';
        document.getElementById('main-container-bg-image').value = '';
        document.getElementById('main-container-bg-color').value = '';
        document.getElementById('modal-bg-image').value = '';
        document.getElementById('modal-bg-color').value = '';
        document.getElementById('html-output').value = '';
        if (document.getElementById('project-name')) {
            document.getElementById('project-name').value = '';
        }

        // Clear form fields - including new title settings
        document.getElementById('world-title').value = '';
        document.getElementById('world-subtitle').value = '';

        // FIXED: Reset title settings controls (use correct IDs)
        const titleShowCheckbox = document.getElementById('world-title-visibility');
        const titleAlignmentSelect = document.getElementById('world-title-alignment');
        const titlePositionSelect = document.getElementById('world-title-position');
        
        // ADD after the existing title settings form resets:
        const titleFontSelect = document.getElementById('world-title-font');
        const titleColorText = document.getElementById('world-title-color');
        const titleColorPicker = document.getElementById('world-title-color-picker');

        if (titleFontSelect) {
            titleFontSelect.value = 'theme';
        }
        if (titleColorText) {
            titleColorText.value = '';
        }
        if (titleColorPicker) {
            titleColorPicker.value = '#000000';
        }

        if (titleShowCheckbox) {
            titleShowCheckbox.checked = true;
        }
        if (titleAlignmentSelect) {
            titleAlignmentSelect.value = 'left';
        }
        if (titlePositionSelect) {
            titlePositionSelect.value = 'bottom';
        }
        
        // Update all content lists
        updateAllContentLists();
        
        // Reset appearance controls
        window.populateAppearanceControls();
        
        currentProject = null;
        
        // Reset project selection and assets status
        const projectList = document.getElementById('project-list');
        if (projectList) {
            projectList.selectedIndex = 0;
            document.getElementById('load-project-btn').disabled = true;
        }
        checkAssetsFolder();
        
        // Update open project button visibility
        updateOpenProjectButton();
        
        showStatus('success', 'Form reset successfully');
    }
}

// ===== CONTENT SIDEBAR NAVIGATION =====
// Add these functions to info-converter.js

// Current active category
let activeCategory = 'characters';

// Initialize sidebar navigation
function initializeSidebar() {
    // Set up sidebar item click handlers
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchToCategory(category);
        });
    });
    
    // Set up sidebar collapse/expand
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', toggleSidebar);
    }
    
    // Set up search functionality
    const searchInput = document.getElementById('content-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleContentSearch);
    }
    
    // Initialize with first category active
    switchToCategory('characters');
    updateAllItemCounts();
}

// Switch to a specific category
function switchToCategory(category) {
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const sidebarItem = document.querySelector(`[data-category="${category}"]`);
    if (sidebarItem) {
        sidebarItem.classList.add('active');
    }
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const contentSection = document.getElementById(`${category}-section`);
    if (contentSection) {
        contentSection.classList.add('active');
        activeCategory = category;
    }
    
    // Clear search when switching categories
    const searchInput = document.getElementById('content-search');
    if (searchInput) {
        searchInput.value = '';
        clearContentSearch();
    }
}

// Toggle sidebar collapsed state
function toggleSidebar() {
    const sidebar = document.querySelector('.content-sidebar');
    const btn = document.getElementById('sidebar-collapse-btn');
    
    if (sidebar && btn) {
        sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            btn.innerHTML = '›';
            btn.title = 'Expand sidebar';
        } else {
            btn.innerHTML = '‹';
            btn.title = 'Collapse sidebar';
        }
    }
}

// Update item count for a specific category
function updateItemCount(category) {
    const countElement = document.getElementById(`${category}-count`);
    if (!countElement) return;
    
    let count = 0;
    
    if (category === 'characters') {
        count = infoData.characters.length;
    } else if (category === 'storylines') {
        count = infoData.storylines.length;
    } else if (category === 'plans') {
        count = infoData.plans.length;
    } else if (category === 'playlists') {
        count = infoData.playlists.length;
    } else if (infoData.world[category]) {
        count = infoData.world[category].length;
    }
    
    countElement.textContent = count;
    
    // Update count badge visibility
    if (count > 0) {
        countElement.style.visibility = 'visible';
    } else {
        countElement.style.visibility = 'hidden';
    }
}

// Update all item counts
function updateAllItemCounts() {
    const categories = [
        'characters', 'storylines', 'plans', 'playlists',
        'general', 'locations', 'factions', 'culture', 'cultivation', 'magic',
        'concepts', 'events', 'creatures', 'plants', 'items'
    ];
    
    categories.forEach(category => {
        updateItemCount(category);
    });
}

// Handle content search
function handleContentSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        clearContentSearch();
        return;
    }
    
    // Get current category list
    const currentList = document.getElementById(`${activeCategory}-list`);
    if (!currentList) return;
    
    const items = currentList.querySelectorAll('.content-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const itemName = item.querySelector('.content-item-name');
        const itemType = item.querySelector('.content-item-type');
        
        if (itemName) {
            const nameText = itemName.textContent.toLowerCase();
            const typeText = itemType ? itemType.textContent.toLowerCase() : '';
            
            if (nameText.includes(searchTerm) || typeText.includes(searchTerm)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        }
    });
    
    // Show/hide empty state based on results
    const emptyState = currentList.querySelector('.empty-state');
    if (emptyState) {
        if (visibleCount === 0 && items.length > 0) {
            emptyState.style.display = 'block';
            emptyState.textContent = `No ${activeCategory} match "${searchTerm}"`;
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// Clear content search
function clearContentSearch() {
    const currentList = document.getElementById(`${activeCategory}-list`);
    if (!currentList) return;
    
    // Show all items
    const items = currentList.querySelectorAll('.content-item');
    items.forEach(item => {
        item.style.display = 'flex';
    });
    
    // Reset empty state
    const emptyState = currentList.querySelector('.empty-state');
    if (emptyState) {
        if (items.length === 0) {
            emptyState.style.display = 'block';
            emptyState.textContent = `No ${activeCategory} added yet`;
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// Updated updateContentList function to work with new structure
window.updateContentList = function(category) {
    const container = document.getElementById(`${category}-list`);
    let items;
    
    if (category === 'characters') {
        items = infoData.characters || [];
    } else if (category === 'storylines') {
        items = infoData.storylines || [];
    } else if (category === 'plans') {
        items = infoData.plans || [];
    } else if (category === 'playlists') {
        items = infoData.playlists || [];
    } else {
        // Ensure the category exists before accessing it
        if (!infoData.world[category]) {
            infoData.world[category] = [];
        }
        items = infoData.world[category];
    }
    
    if (items.length === 0) {  // Now items will always be an array
        const emptyText = category === 'plans' ? 'No story arcs added yet' : `No ${category} added yet`;
        container.innerHTML = `<div class="empty-state">${emptyText}</div>`;
    } else {
        container.innerHTML = '';
        items.forEach((item, index) => {
            const name = item.name || item.title || 'Unnamed Item';
            // Handle different type field names for different categories
            let type = '';
            if (category === 'locations') {
                type = item.type || '';
            } else if (category === 'storylines') {
                type = item.pairing || '';
            } else if (category === 'plans') {
                type = '';
            } else {
                type = item.category || '';
            }
            
            const contentItem = createContentItem(name, type, index, category);
            
            // Add drag and drop functionality
            addDragListeners(contentItem, container);
            
            container.appendChild(contentItem);
        });
    }
    
    // Update item count for this category
    updateItemCount(category);
    
    // Clear any active search when content is updated
    const searchInput = document.getElementById('content-search');
    if (searchInput && searchInput.value) {
        // Reapply search if there is an active search term
        handleContentSearch({ target: searchInput });
    }

    // NEW: Add at the end of the function
    setTimeout(() => {
        const container = document.getElementById(`${category}-list`);
        if (container) {
            updateScrollIndicators(container);
        }
    }, 50);
}

// Updated updateAllContentLists to include count updates
window.updateAllContentLists = function() {
    // Update basic info fields with null checks
    const worldTitleElement = document.getElementById('world-title');
    if (worldTitleElement) worldTitleElement.value = infoData.basic.title;
    
    const worldSubtitleElement = document.getElementById('world-subtitle');
    if (worldSubtitleElement) worldSubtitleElement.value = infoData.basic.subtitle || '';

    const titleFontSelect = document.getElementById('world-title-font');        // NEW
    const titleColorText = document.getElementById('world-title-color');        // NEW
    const titleColorPicker = document.getElementById('world-title-color-picker'); // NEW
    
    const bannerImageElement = document.getElementById('banner-image');
    if (bannerImageElement) bannerImageElement.value = infoData.basic.banner;
    
    const overviewTitleElement = document.getElementById('overview-title');
    if (overviewTitleElement) overviewTitleElement.value = infoData.basic.overviewTitle || '';
    
    const overviewTextElement = document.getElementById('overview-text');
    if (overviewTextElement) overviewTextElement.value = infoData.basic.overview;
    
    const overviewImageElement = document.getElementById('overview-image');
    if (overviewImageElement) overviewImageElement.value = infoData.basic.overviewImage || '';
    
    const backgroundColorElement = document.getElementById('background-color');
    if (backgroundColorElement) backgroundColorElement.value = infoData.basic.backgroundColor || '';
    
    const backgroundImageElement = document.getElementById('background-image');
    if (backgroundImageElement) backgroundImageElement.value = infoData.basic.backgroundImage || '';
    
    const overviewContentBgImageElement = document.getElementById('overview-content-bg-image');
    if (overviewContentBgImageElement) overviewContentBgImageElement.value = infoData.basic.overviewContentBgImage || '';
    
    const overviewContentBgColorElement = document.getElementById('overview-content-bg-color');
    if (overviewContentBgColorElement) overviewContentBgColorElement.value = infoData.basic.overviewContentBgColor || '';
    
    const overviewContentOpacityElement = document.getElementById('overview-content-opacity');
    if (overviewContentOpacityElement) overviewContentOpacityElement.value = infoData.basic.overviewContentOpacity || 100;
    
    const overviewContentBlurElement = document.getElementById('overview-content-blur');
    if (overviewContentBlurElement) overviewContentBlurElement.value = infoData.basic.overviewContentBlur || 0;

    const mainContainerBgImageElement = document.getElementById('main-container-bg-image');
    if (mainContainerBgImageElement) mainContainerBgImageElement.value = infoData.basic.mainContainerBgImage || '';
    
    const mainContainerBgColorElement = document.getElementById('main-container-bg-color');
    if (mainContainerBgColorElement) mainContainerBgColorElement.value = infoData.basic.mainContainerBgColor || '';

    const modalBgImageElement = document.getElementById('modal-bg-image');
    if (modalBgImageElement) modalBgImageElement.value = infoData.basic.modalBgImage || '';

    const modalBgColorElement = document.getElementById('modal-bg-color');
    if (modalBgColorElement) modalBgColorElement.value = infoData.basic.modalBgColor || '';

    // Load page inclusion settings
    const includeWorldElement = document.getElementById('include-world');
    if (includeWorldElement) {
        includeWorldElement.checked = infoData.basic.includedPages ? infoData.basic.includedPages.world !== false : true;
    }
    
    const includeCharactersElement = document.getElementById('include-characters');
    if (includeCharactersElement) {
        includeCharactersElement.checked = infoData.basic.includedPages ? infoData.basic.includedPages.characters !== false : true;
    }

    // Also sync the color pickers
    const overviewColorPicker = document.getElementById('overview-content-bg-color-picker');
    if (overviewColorPicker && infoData.basic.overviewContentBgColor && isValidHexColor(infoData.basic.overviewContentBgColor)) {
        overviewColorPicker.value = infoData.basic.overviewContentBgColor;
    }
    
    const mainContainerColorPicker = document.getElementById('main-container-bg-color-picker');
    if (mainContainerColorPicker && infoData.basic.mainContainerBgColor && isValidHexColor(infoData.basic.mainContainerBgColor)) {
        mainContainerColorPicker.value = infoData.basic.mainContainerBgColor;
    }

    // Sync site background color picker
    const backgroundColorPicker = document.getElementById('background-color-picker');
    if (backgroundColorPicker && infoData.basic.backgroundColor && isValidHexColor(infoData.basic.backgroundColor)) {
        backgroundColorPicker.value = infoData.basic.backgroundColor;
    }

    // Sync modal background color picker  
    const modalColorPicker = document.getElementById('modal-bg-color-picker');
    if (modalColorPicker && infoData.basic.modalBgColor && isValidHexColor(infoData.basic.modalBgColor)) {
        modalColorPicker.value = infoData.basic.modalBgColor;
    }

    // NEW: Load banner size setting
    if (infoData.appearance && infoData.appearance.bannerSize) {
        const bannerSizeSelect = document.getElementById('appearance-banner-size');
        if (bannerSizeSelect) {
            bannerSizeSelect.value = infoData.appearance.bannerSize;
        }
    } else {
        // Default to large if no setting exists
        const bannerSizeSelect = document.getElementById('appearance-banner-size');
        if (bannerSizeSelect) {
            bannerSizeSelect.value = 'large';
        }
    }

    // FIXED: Reset title settings controls (use correct IDs)
    const titleShowCheckbox = document.getElementById('world-title-visibility');
    const titleAlignmentSelect = document.getElementById('world-title-alignment');
    const titlePositionSelect = document.getElementById('world-title-position');
    
    // NEW: Load font setting
    if (titleFontSelect && infoData.basic.titleSettings) {
        titleFontSelect.value = infoData.basic.titleSettings.font || 'theme';
    } else if (titleFontSelect) {
        titleFontSelect.value = 'theme'; // default
    }

    // NEW: Load color setting
    if (titleColorText && infoData.basic.titleSettings && infoData.basic.titleSettings.color) {
        titleColorText.value = infoData.basic.titleSettings.color;
    }
    if (titleColorPicker && infoData.basic.titleSettings && infoData.basic.titleSettings.color && isValidHexColor(infoData.basic.titleSettings.color)) {
        titleColorPicker.value = infoData.basic.titleSettings.color;
    }

    if (titleShowCheckbox && infoData.basic.titleSettings) {
        titleShowCheckbox.checked = infoData.basic.titleSettings.show !== false;
    } else if (titleShowCheckbox) {
        titleShowCheckbox.checked = true; // default
    }

    if (titleAlignmentSelect && infoData.basic.titleSettings) {
        titleAlignmentSelect.value = infoData.basic.titleSettings.alignment || 'left';
    } else if (titleAlignmentSelect) {
        titleAlignmentSelect.value = 'left'; // default
    }

    if (titlePositionSelect && infoData.basic.titleSettings) {
        titlePositionSelect.value = infoData.basic.titleSettings.position || 'bottom';
    } else if (titlePositionSelect) {
        titlePositionSelect.value = 'bottom'; // default
    }

    // Background settings
        // Load overview content background image
    const bgImageInput = document.getElementById('overview-content-bg-image');
    if (bgImageInput && infoData.basic && infoData.basic.overviewContentBgImage) {
        bgImageInput.value = infoData.basic.overviewContentBgImage;
    }
    
    // Load overview content background color
    const colorText = document.getElementById('overview-content-bg-color');
    const colorPicker = document.getElementById('overview-content-bg-color-picker');
    if (infoData.basic && infoData.basic.overviewContentBgColor) {
        if (colorText) {
            colorText.value = infoData.basic.overviewContentBgColor;
        }
        if (colorPicker && isValidHexColor(infoData.basic.overviewContentBgColor)) {
            colorPicker.value = infoData.basic.overviewContentBgColor;
        }
    }
    
    // Load opacity settings
    const opacitySlider = document.getElementById('overview-content-opacity-slider');
    const opacityNumber = document.getElementById('overview-content-opacity');
    const opacityValue = infoData.basic && infoData.basic.overviewContentOpacity !== undefined ? infoData.basic.overviewContentOpacity : 100;
    if (opacitySlider) {
        opacitySlider.value = opacityValue;
    }
    if (opacityNumber) {
        opacityNumber.value = opacityValue;
    }
    
    // Load blur settings
    const blurSlider = document.getElementById('overview-content-blur-slider');
    const blurNumber = document.getElementById('overview-content-blur');
    const blurValue = infoData.basic && infoData.basic.overviewContentBlur !== undefined ? infoData.basic.overviewContentBlur : 0;
    if (blurSlider) {
        blurSlider.value = blurValue;
    }
    if (blurNumber) {
        blurNumber.value = blurValue;
    }
    
    // NEW: Load page inclusion settings
    if (infoData.basic.includedPages) {
        document.getElementById('include-world').checked = infoData.basic.includedPages.world !== false;
        document.getElementById('include-characters').checked = infoData.basic.includedPages.characters !== false;
        document.getElementById('include-storylines').checked = infoData.basic.includedPages.storylines !== false;
        document.getElementById('include-plans').checked = infoData.basic.includedPages.plans !== false;
        document.getElementById('include-playlists').checked = infoData.basic.includedPages.playlists !== false;
    } else {
        // Default all to checked if no settings exist
        document.getElementById('include-world').checked = true;
        document.getElementById('include-characters').checked = true;
        document.getElementById('include-storylines').checked = true;
        document.getElementById('include-plans').checked = true;
        document.getElementById('include-playlists').checked = true;
    }

    // Update custom pages list
    if (typeof renderPagesList === 'function') {
        renderPagesList();
    }

    // Update appearance controls
    if (typeof window.populateAppearanceControls === 'function') {
        window.populateAppearanceControls();
    }

    // Load storylines options checkboxes
    if (infoData.storylinesOptions) {
        const tocCheckbox = document.getElementById('storylines-show-toc');
        const sectionsCheckbox = document.getElementById('storylines-show-sections');
        const subsectionsCheckbox = document.getElementById('storylines-show-subsections');
        
        if (tocCheckbox) {
            tocCheckbox.checked = infoData.storylinesOptions.showTOC ?? true;
        }
        if (sectionsCheckbox) {
            sectionsCheckbox.checked = infoData.storylinesOptions.showSections ?? true;
        }
        if (subsectionsCheckbox) {
            subsectionsCheckbox.checked = infoData.storylinesOptions.showSubsections ?? true;
        }
    }

    // Load characters options checkboxes
    if (infoData.charactersOptions) {
        const showByFactionCheckbox = document.getElementById('characters-show-by-faction');
        
        if (showByFactionCheckbox) {
            showByFactionCheckbox.checked = infoData.charactersOptions.showByFaction ?? true;
        }
    }

    // Load events options input field
    if (infoData.eventsOptions) {
        const eventsLabelInput = document.getElementById('events-custom-label');
        
        if (eventsLabelInput) {
            eventsLabelInput.value = infoData.eventsOptions.customLabel || 'Events';
        }
    }

    // Load culture options input field
    if (infoData.cultureOptions) {
        const cultureLabelInput = document.getElementById('culture-custom-label');
        
        if (cultureLabelInput) {
            cultureLabelInput.value = infoData.cultureOptions.customLabel || 'Culture';
        }
    }

    // Load cultivation options input field
    if (infoData.cultivationOptions) {
        const cultivationLabelInput = document.getElementById('cultivation-custom-label');
        
        if (cultivationLabelInput) {
            cultivationLabelInput.value = infoData.cultivationOptions.customLabel || 'Cultivation';
        }
    }

    // Load magic options input field
    if (infoData.magicOptions) {
        const magicLabelInput = document.getElementById('magic-custom-label');
        
        if (magicLabelInput) {
            magicLabelInput.value = infoData.magicOptions.customLabel || 'Magic';
        }
    }
    
    // Update all content lists
    updateContentList('characters');
    updateContentList('storylines');
    updateContentList('plans');
    updateContentList('playlists');
    updateContentList('general');  // Make sure this line exists
    updateContentList('locations');
    updateContentList('concepts');
    updateContentList('events');
    updateContentList('creatures');
    updateContentList('plants');
    updateContentList('items');
    updateContentList('factions');
    updateContentList('culture');
    updateContentList('cultivation');
    updateContentList('magic');
    
    // Update all item counts
    updateAllItemCounts();

    // Update category labels with custom names
    updateCategoryLabels(); 
}

// Keyboard navigation for sidebar
function handleSidebarKeyboard(event) {
    if (!event.target.closest('.content-sidebar')) return;
    
    const sidebarItems = Array.from(document.querySelectorAll('.sidebar-item'));
    const activeItem = document.querySelector('.sidebar-item.active');
    const currentIndex = sidebarItems.indexOf(activeItem);
    
    let nextIndex = currentIndex;
    
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : sidebarItems.length - 1;
            break;
        case 'ArrowDown':
            event.preventDefault();
            nextIndex = currentIndex < sidebarItems.length - 1 ? currentIndex + 1 : 0;
            break;
        case 'Enter':
            event.preventDefault();
            if (activeItem) {
                activeItem.click();
            }
            break;
    }
    
    if (nextIndex !== currentIndex && sidebarItems[nextIndex]) {
        const category = sidebarItems[nextIndex].getAttribute('data-category');
        switchToCategory(category);
    }
}

// FIXED: Initialize overview background controls with proper data saving
function initializeOverviewBackgroundControls() {
    // Color picker synchronization
    const colorText = document.getElementById('overview-content-bg-color');
    const colorPicker = document.getElementById('overview-content-bg-color-picker');
    
    if (colorText && colorPicker) {
        // Sync picker to text input
        colorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && isValidHexColor(color)) {
                colorPicker.value = color;
            }
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentBgColor = this.value;
            window.markDataAsModified();
        });
        
        // Sync text input to picker
        colorPicker.addEventListener('input', function() {
            colorText.value = this.value;
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentBgColor = this.value;
            window.markDataAsModified();
        });
    }
    
    // Background image input
    const bgImageInput = document.getElementById('overview-content-bg-image');
    if (bgImageInput) {
        bgImageInput.addEventListener('input', function() {
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentBgImage = this.value;
            window.markDataAsModified();
        });
    }
    
    // Opacity slider synchronization
    const opacitySlider = document.getElementById('overview-content-opacity-slider');
    const opacityNumber = document.getElementById('overview-content-opacity');
    
    if (opacitySlider && opacityNumber) {
        opacitySlider.addEventListener('input', function() {
            opacityNumber.value = this.value;
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentOpacity = parseInt(this.value);
            window.markDataAsModified();
        });
        
        opacityNumber.addEventListener('input', function() {
            const value = Math.max(0, Math.min(100, parseInt(this.value) || 100));
            this.value = value;
            opacitySlider.value = value;
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentOpacity = value;
            window.markDataAsModified();
        });
    }
    
    // Blur slider synchronization
    const blurSlider = document.getElementById('overview-content-blur-slider');
    const blurNumber = document.getElementById('overview-content-blur');
    
    if (blurSlider && blurNumber) {
        blurSlider.addEventListener('input', function() {
            blurNumber.value = this.value;
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentBlur = parseInt(this.value);
            window.markDataAsModified();
        });
        
        blurNumber.addEventListener('input', function() {
            const value = Math.max(0, parseInt(this.value) || 0);
            this.value = value;
            blurSlider.value = value;
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.overviewContentBlur = value;
            window.markDataAsModified();
        });
    }
}

// Initialize modal background controls with proper data saving
function initializeModalBackgroundControls() {
    // Color picker synchronization
    const colorText = document.getElementById('modal-bg-color');
    const colorPicker = document.getElementById('modal-bg-color-picker');
    
    if (colorText && colorPicker) {
        // Sync picker to text input
        colorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && isValidHexColor(color)) {
                colorPicker.value = color;
            }
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.modalBgColor = this.value;
            window.markDataAsModified();
        });
        
        // Sync text input to picker
        colorPicker.addEventListener('input', function() {
            colorText.value = this.value;
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.modalBgColor = this.value;
            window.markDataAsModified();
        });
    }
    
    // Background image input
    const bgImageInput = document.getElementById('modal-bg-image');
    if (bgImageInput) {
        bgImageInput.addEventListener('input', function() {
            // FIXED: Ensure basic object exists
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.modalBgImage = this.value;
            window.markDataAsModified();
        });
    }
}

function initializeMainContainerBackgroundControls() {
    // Main container background color picker synchronization
    const colorText = document.getElementById('main-container-bg-color');
    const colorPicker = document.getElementById('main-container-bg-color-picker');
    
    if (colorText && colorPicker) {
        // Sync picker to text input
        colorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                colorPicker.value = color;
            }
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.mainContainerBgColor = this.value;
            window.markDataAsModified();
        });
        
        // Sync text input to picker
        colorPicker.addEventListener('input', function() {
            colorText.value = this.value;
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.mainContainerBgColor = this.value;
            window.markDataAsModified();
        });
    }
    
    // Main container background image input
    const bgImageInput = document.getElementById('main-container-bg-image');
    if (bgImageInput) {
        bgImageInput.addEventListener('input', function() {
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.mainContainerBgImage = this.value;
            window.markDataAsModified();
        });
    }

    // Modal background color picker synchronization
    // Modal background color picker synchronization
    const modalColorText = document.getElementById('modal-bg-color');
    const modalColorPicker = document.getElementById('modal-bg-color-picker');

    if (modalColorText && modalColorPicker) {
        // Sync picker to text input
        modalColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                modalColorPicker.value = color;
            }
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.modalBgColor = this.value;
            window.markDataAsModified();
        });
        
        // Sync text input to picker
        modalColorPicker.addEventListener('input', function() {
            modalColorText.value = this.value;
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.modalBgColor = this.value;
            window.markDataAsModified();
        });
    }

    // Modal background image input
    const modalBgImageInput = document.getElementById('modal-bg-image');
    if (modalBgImageInput) {
        modalBgImageInput.addEventListener('input', function() {
            if (!infoData.basic) {
                infoData.basic = {};
            }
            infoData.basic.modalBgImage = this.value;
            window.markDataAsModified();
        });
    }
}

// Initialize color picker synchronization for appearance tab
function initializeAppearanceColorPickers() {
    // Background color picker
    const bgColorText = document.getElementById('background-color');
    const bgColorPicker = document.getElementById('background-color-picker');
    
    if (bgColorText && bgColorPicker) {
        // Sync picker to text input
        bgColorText.addEventListener('input', () => {
            const color = bgColorText.value.trim();
            if (window.isValidHexColor(color)) {
                bgColorPicker.value = color;
            }
        });
        
        // Sync text input to picker
        bgColorPicker.addEventListener('input', () => {
            bgColorText.value = bgColorPicker.value;
        });
    }
    
    // Main container color picker
    const containerColorText = document.getElementById('main-container-color');
    const containerColorPicker = document.getElementById('main-container-color-picker');
    
    if (containerColorText && containerColorPicker) {
        // Sync picker to text input
        containerColorText.addEventListener('input', () => {
            const color = containerColorText.value.trim();
            if (window.isValidHexColor(color)) {
                containerColorPicker.value = color;
            }
        });
        
        // Sync text input to picker
        containerColorPicker.addEventListener('input', () => {
            containerColorText.value = containerColorPicker.value;
        });
    }

    // Modal background color picker
    const modalBgColorText = document.getElementById('modal-bg-color');
    const modalBgColorPicker = document.getElementById('modal-bg-color-picker');

    if (modalBgColorText && modalBgColorPicker) {
        // Sync picker to text input
        modalBgColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                modalBgColorPicker.value = color;
            }
        });
        
        // Sync text input to picker
        modalBgColorPicker.addEventListener('input', function() {
            modalBgColorText.value = this.value;
        });
    }
}

// Utility function to check if a string is a valid hex color
function isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{3,6}$/.test(color);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Populate title font dropdown from titleFonts
function populateTitleFontDropdown() {
    const titleFontSelect = document.getElementById('world-title-font');
    if (titleFontSelect) {
        titleFontSelect.innerHTML = '';
        Object.entries(titleFonts).forEach(([key, fontSet]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = fontSet.name;
            if (fontSet.description) {
                option.title = fontSet.description;
            }
            titleFontSelect.appendChild(option);
        });
    }
}

// Storyline dropdown functionality
async function populateStorylineDropdown() {
    const dropdown = document.getElementById('story-roleplay-dropdown');
    const importBtn = document.getElementById('story-import-btn');
    
    if (!dropdown || !currentProject) {
        if (dropdown) dropdown.disabled = true;
        if (importBtn) importBtn.disabled = true;
        return;
    }

    try {
        const userContext = userSessionManager?.getUserContext();
        const response = await fetch('/api/roleplay/list/' + currentProject, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userContext })
        });

        const files = await response.json();
        
        // Clear and populate dropdown
        dropdown.innerHTML = '<option value="">None</option>';
        
        if (files.length > 0) {
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                dropdown.appendChild(option);
            });
            dropdown.disabled = false;
        } else {
            dropdown.disabled = true;
        }
    } catch (error) {
        console.error('Error loading roleplay files:', error);
        dropdown.disabled = true;
    }
}

function handleStorylineDropdownChange() {
    const dropdown = document.getElementById('story-roleplay-dropdown');
    const linkInput = document.getElementById('story-link');
    const importBtn = document.getElementById('story-import-btn');
    
    if (!dropdown || !linkInput || !importBtn) return;
    
    if (dropdown.value && dropdown.value !== '') {
        // Fill the link field
        linkInput.value = dropdown.value;
        importBtn.disabled = false;
    } else {
        // Clear selection
        linkInput.value = '';
        importBtn.disabled = true;
    }
}

async function handleStorylineImport() {
    const dropdown = document.getElementById('story-roleplay-dropdown');
    const statusSpan = document.getElementById('storyline-import-status');
    
    if (!dropdown || !dropdown.value || !currentProject) return;
    
    const filename = dropdown.value;
    
    try {
        statusSpan.textContent = 'Importing...';
        statusSpan.style.color = '#666';
        
        const userContext = userSessionManager?.getUserContext();
        const response = await fetch('/api/roleplay/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                filename,
                projectName: currentProject,
                userContext 
            })
        });

        const result = await response.json();
        
        if (result.success) {
            statusSpan.textContent = '✓ Imported';
            statusSpan.style.color = '#28a745';
            
            // Open the storyline modal with extracted data
            // Create a storyline object with the imported data
            const importedStoryline = {
                title: result.storylineData?.title || '',
                pairing: result.storylineData?.pairing || '',
                wordcount: result.storylineData?.wordcount || '',
                lastUpdated: result.storylineData?.lastUpdated || '',
                description: result.storylineData?.description || '',
                link: filename, // Set the filename as the link
                isProjectLink: true // Mark as project link
            };
            
            // Open modal and populate with imported data
            openStorylineModal(importedStoryline);
            
            setTimeout(() => {
                statusSpan.textContent = '';
            }, 3000);
        } else {
            statusSpan.textContent = 'Import failed';
            statusSpan.style.color = '#dc3545';
            
            setTimeout(() => {
                statusSpan.textContent = '';
            }, 5000);
        }
    } catch (error) {
        console.error('Error importing roleplay:', error);
        statusSpan.textContent = 'Import failed';
        statusSpan.style.color = '#dc3545';
        
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 5000);
    }
}
    
//Image upload stuff
// Image import functionality
let currentImageImportField = null;
let currentImageImportContext = null;

function initializeImageImportTriggers() {
    document.querySelectorAll('.image-import-trigger').forEach(button => {
        button.addEventListener('click', function() {
            const targetField = this.getAttribute('data-target-field');
            const context = this.getAttribute('data-context');
            openImageImportModal(targetField, context);
        });
    });
    
    // Set up modal event listeners
    const importBtn = document.getElementById('import-image-btn');
    const fileInput = document.getElementById('import-image-file');
    const nameInput = document.getElementById('import-image-name');
    const pathInput = document.getElementById('import-image-path');

    
    if (fileInput) {
        fileInput.addEventListener('change', handleImageFileSelection);
    }
    
    if (nameInput && pathInput) {
        // Update final path when inputs change
        [nameInput, pathInput].forEach(input => {
            input.addEventListener('input', updateFinalImagePath);
        });
    }
}

function openImageImportModal(targetField, context) {
    currentImageImportField = targetField;
    currentImageImportContext = context;
    
    // Set compression settings based on context
    const modal = document.getElementById('imageImportModal');
    modal.setAttribute('data-context', context);
    
    // Clear previous values
    document.getElementById('import-image-file').value = '';
    document.getElementById('import-image-name').value = '';
    
    // Set default path based on context
    const defaultPath = getDefaultImagePath(context);
    document.getElementById('import-image-path').value = defaultPath;
    
    updateFinalImagePath();
    openModal('imageImportModal');
}

function getDefaultImagePath(context) {
    switch(context) {
        case 'banner':
            return 'assets/ui/banners/';
        case 'overview':
            return 'assets/ui/overview/';
        case 'background':
            return 'assets/ui/backgrounds/';
        case 'modal-bg':
            return 'assets/ui/backgrounds/';
        case 'character':
            // Try to get character name for smart path
            const charName = document.getElementById('char-name')?.value.trim();
            return charName ? `assets/characters/${charName}/` : 'assets/characters/';
        case 'location':                        // ADD THIS CASE
            return 'assets/world/locations/';
        case 'world-item':
            // Use the current editing category
            const category = editingCategory || 'items';
            return `assets/world/${category}/`;
        case 'item-icon':
            // Use the current editing category
            const iconcategory = editingCategory || 'items';
            return `assets/world/${iconcategory}/icons/`;
        default:
            return 'assets/';
    }
}

// Add this compression utility function
// CHANGE THIS FUNCTION:
async function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85, outputFormat = 'image/jpeg') {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            // Set canvas size and draw image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with specified format
            // For PNG, quality parameter is ignored
            canvas.toBlob(resolve, outputFormat, quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

async function handleImageFileSelection() {
    const fileInput = document.getElementById('import-image-file');
    const nameInput = document.getElementById('import-image-name');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Get context to determine if we should compress
        const modal = document.getElementById('imageImportModal');
        const context = modal.getAttribute('data-context');
        
        // Skip compression for character cards - they must stay PNG
        if (context === 'character-card') {
            updateFinalImagePath();
            return;
        }
        if (context === 'item-icon') {
            updateFinalImagePath();
            return;
        }
        
        // ADD THIS BLOCK: Handle banner and background images (resize only, keep PNG)
        if (context === 'banner' || context === 'background' || context === 'modal-bg') {
            // Only resize if image is very large (over 2000px)
            const img = new Image();
            img.onload = async function() {
                if (img.width > 2000 || img.height > 2000) {
                    // Show resizing status
                    const status = document.createElement('div');
                    status.textContent = 'Resizing image...';
                    status.style.color = '#007bff';
                    fileInput.parentNode.appendChild(status);
                    
                    try {
                        // Resize but keep as PNG
                        const maxDim = context === 'banner' ? 2000 : 1920;
                        const resizedBlob = await compressImage(file, maxDim, maxDim, 1.0, 'image/png');
                        
                        // Get original extension or default to png
                        const originalExt = file.name.split('.').pop().toLowerCase();
                        const ext = originalExt === 'png' || originalExt === 'jpg' || originalExt === 'jpeg' ? originalExt : 'png';
                        const baseName = file.name.replace(/\.[^/.]+$/, '');
                        
                        // Create new file with resized data (keep original extension)
                        const resizedFile = new File([resizedBlob], `${baseName}.${ext}`, {
                            type: `image/${ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png'}`,
                            lastModified: Date.now()
                        });
                        
                        // Replace the file in the input
                        const dt = new DataTransfer();
                        dt.items.add(resizedFile);
                        fileInput.files = dt.files;
                        
                        // Keep original extension in filename
                        nameInput.value = `${baseName}.${ext}`;
                        
                        const originalSize = (file.size / 1024).toFixed(1);
                        const resizedSize = (resizedFile.size / 1024).toFixed(1);
                        
                        status.textContent = `✓ Resized: ${originalSize}KB → ${resizedSize}KB (kept as ${ext.toUpperCase()})`;
                        status.style.color = '#28a745';
                        
                        // Remove status after 3 seconds
                        setTimeout(() => {
                            if (status.parentNode) {
                                status.parentNode.removeChild(status);
                            }
                        }, 3000);
                        
                    } catch (error) {
                        status.textContent = '⚠ Resize failed, using original';
                        status.style.color = '#dc3545';
                        nameInput.value = file.name;
                        setTimeout(() => {
                            if (status.parentNode) {
                                status.parentNode.removeChild(status);
                            }
                        }, 3000);
                    }
                } else {
                    // Image is not too large, use as-is
                    nameInput.value = file.name;
                }
                updateFinalImagePath();
            };
            img.src = URL.createObjectURL(file);
            return;
        }
        
        // REST OF THE FUNCTION CONTINUES AS BEFORE (for JPG compression)
        // Show compression status for other contexts
        const status = document.createElement('div');
        status.textContent = 'Compressing image...';
        status.style.color = '#007bff';
        fileInput.parentNode.appendChild(status);
        
        try {
            // Get context-specific settings
            let maxWidth = 1200, maxHeight = 1200;
            if (context === 'character') {
                maxWidth = maxHeight = 800; // Smaller for character portraits
            } else if (context === 'background') {
                maxWidth = 1920; maxHeight = 1080; // Larger for backgrounds
            } else if (context === 'event') {
                maxWidth = maxHeight = 300; // Smaller for timeline event markers
            } else if (context === 'world-item') {
                maxWidth = maxHeight = 600; // Medium size for world items
            } else if (context === 'location') {
                maxWidth = 800; maxHeight = 600; // Medium size for locations
            }

            const compressedBlob = await compressImage(file, maxWidth, maxHeight);
            
            // Create new file with compressed data
            const compressedFile = new File([compressedBlob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            
            // Replace the file in the input (for when import happens)
            const dt = new DataTransfer();
            dt.items.add(compressedFile);
            fileInput.files = dt.files;
            
            // Change extension to jpg ONLY for non-character-card contexts
            nameInput.value = file.name.replace(/\.[^/.]+$/, '.jpg');
            
            const originalSize = (file.size / 1024).toFixed(1);
            const compressedSize = (compressedFile.size / 1024).toFixed(1);
            const savings = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);
            
            status.textContent = `✓ Compressed: ${originalSize}KB → ${compressedSize}KB (${savings}% smaller)`;
            status.style.color = '#28a745';
            
        } catch (error) {
            status.textContent = '⚠ Compression failed, using original';
            status.style.color = '#dc3545';
            nameInput.value = file.name;
        }
        
        updateFinalImagePath();
        
        // Remove status after 3 seconds
        setTimeout(() => {
            if (status.parentNode) {
                status.parentNode.removeChild(status);
            }
        }, 3000);
    }
}

function updateFinalImagePath() {
    const nameInput = document.getElementById('import-image-name');
    const pathInput = document.getElementById('import-image-path');
    const finalPathSpan = document.getElementById('import-final-path');
    
    if (nameInput && pathInput && finalPathSpan) {
        const name = nameInput.value.trim();
        const path = pathInput.value.trim();
        
        if (name && path) {
            const finalPath = path.endsWith('/') ? path + name : path + '/' + name;
            finalPathSpan.textContent = finalPath;
        } else {
            finalPathSpan.textContent = 'assets/image.jpg';
        }
    }
}

// Initialize universal text editor modal functionality
function initializeTextEditorModal() {
    const modal = document.getElementById('universalTextEditorModal');
    const closeBtn = document.getElementById('closeUniversalTextEditor');
    const expandedTextarea = document.getElementById('universal-expanded-text');
    const modalTitle = document.getElementById('universal-editor-title');
    const modalWordCount = document.getElementById('universal-word-count');
    const modalPageCount = document.getElementById('universal-page-count');
    
    let currentFieldId = null;
    let currentOriginalTextarea = null;

    if (!modal || !closeBtn || !expandedTextarea) {
        console.log('Universal text editor modal elements not found');
        return;
    }

    // Function to update modal word count
    function updateModalWordCount() {
        if (typeof countWords === 'function' && typeof calculatePageCount === 'function') {
            const text = expandedTextarea.value;
            const wordCount = countWords(text);
            const pageCount = calculatePageCount(wordCount);
            
            if (modalWordCount) modalWordCount.textContent = `Words: ${wordCount}`;
            if (modalPageCount) modalPageCount.textContent = `Pages: ${pageCount}`;
        }
    }

    // Get friendly field name for modal title
    function getFriendlyFieldName(fieldId) {
        const fieldNames = {
            'char-basic': 'Basic Information',
            'char-physical': 'Physical Description',
            'char-personality': 'Personality',
            'char-sexuality': 'Sexuality',
            'char-fighting-style': 'Fighting Style',
            'char-background': 'Background',
            'char-equipment': 'Weapons/Armor/Equipment',
            'char-hobbies': 'Hobbies/Pastimes',
            'char-quirks': 'Quirks/Mannerisms',
            'char-relationships': 'Relationships',
            'char-notes': 'Notes',
            'event-notes': 'Event Notes',
            'loc-description': 'Location Description',
            'loc-features': 'Notable Features',
            'loc-connections': 'Inhabitants/Connections',
            'item-description': 'Item Description',
            'item-properties': 'Properties/Characteristics',
            'item-connections': 'Related Information',
            'element-paragraph-content': 'Paragraph Content',
            'element-subcontainer-content': 'Container Content', 
            'element-imagetext-right-content': 'Text Content',
            'element-imagetext-left-content': 'Text Content'
        };
        return fieldNames[fieldId] || 'Edit Text';
    }

    // Open modal for specific field
    function openTextEditor(fieldId) {
        const originalTextarea = document.getElementById(fieldId);
        if (!originalTextarea) {
            console.error('Original textarea not found:', fieldId);
            return;
        }

        currentFieldId = fieldId;
        currentOriginalTextarea = originalTextarea;
        
        // Set modal title
        modalTitle.textContent = getFriendlyFieldName(fieldId);
        
        // Copy content from original textarea
        expandedTextarea.value = originalTextarea.value;
        
        // Show modal
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Focus the expanded textarea
        setTimeout(() => {
            expandedTextarea.focus();
        }, 100);
        
        // Update word count
        updateModalWordCount();
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeTextEditor() {
        if (currentOriginalTextarea && currentFieldId) {
            // Copy content back to original textarea
            currentOriginalTextarea.value = expandedTextarea.value;
            
            // Trigger input event to update any listeners
            const inputEvent = new Event('input', { bubbles: true });
            currentOriginalTextarea.dispatchEvent(inputEvent);
        }
        
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            currentFieldId = null;
            currentOriginalTextarea = null;
        }, 300);
        
        // Restore body scrolling
        document.body.style.overflow = '';
    }

    // Event listeners
    closeBtn.addEventListener('click', closeTextEditor);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTextEditor();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeTextEditor();
        }
    });
    
    // Update word count on input
    expandedTextarea.addEventListener('input', updateModalWordCount);
    
    // Add click listeners to all expand buttons
    // Add click listeners to all expand buttons
    document.addEventListener('click', (e) => {
        // Check if the clicked element or its parent is an expand button
        const expandBtn = e.target.closest('.expand-text-btn');
        if (expandBtn) {
            const fieldId = expandBtn.getAttribute('data-field');
            if (fieldId) {
                openTextEditor(fieldId);
            }
        }
    });
    
    console.log('✅ Universal text editor modal initialized');
}

// Quick Generate function
async function quickGenerate() {
    // Hide context menu
    document.getElementById('generate-context-menu').style.display = 'none';
    
    try {
        showToast('info', 'Quick generating...');
        
        // Generate HTML
        const html = await generateHTML();
        if (!html) {
            showToast('error', 'Failed to generate HTML');
            return;
        }
        
        // Save to folder (only if in local mode)
        if (isLocal) {
            await saveToSitesFolder();
        } else {
            showToast('success', 'HTML generated successfully (download available)');
        }
        
    } catch (error) {
        console.error('Quick generate error:', error);
        showToast('error', `Quick generate failed: ${error.message}`);
    }
}

// Quick Open function
function quickOpenProject() {
    // Hide context menu
    document.getElementById('generate-context-menu').style.display = 'none';
    
    if (!window.isLocal || !window.currentProject || !window.userSessionManager) {
        showToast('error', 'No current project to open');
        return;
    }
    
    if (!window.htmlGenerated) {  // Changed this line
        showToast('error', 'Please generate HTML first');
        return;
    }
    
    openCurrentProject();
}

// Function to update Quick Open availability
function updateQuickOpenState() {
    const quickOpenOption = document.getElementById('quick-open-option');
    if (!quickOpenOption) return;
    
    console.log('Quick Open State Check:', {
        isLocal: window.isLocal,
        currentProject: window.currentProject,
        userSessionManager: !!window.userSessionManager,
        htmlGenerated: window.htmlGenerated
    });
    
    const canOpen = window.isLocal && window.currentProject && window.userSessionManager && window.htmlGenerated;
    
    if (canOpen) {
        quickOpenOption.classList.remove('disabled');
        console.log('Quick Open enabled');
    } else {
        quickOpenOption.classList.add('disabled');
        console.log('Quick Open disabled');
    }
}

// Quick Load function
async function quickLoadLastProject() {
    // Hide context menu
    document.getElementById('nav-project-context-menu').style.display = 'none';
    
    if (!userSessionManager) return;
    
    const lastProject = userSessionManager.getLastProject();
    if (!lastProject) {
        showToast('info', 'No last project available');
        return;
    }
    
    // Set the dropdown value and trigger load
    const navProjectList = document.getElementById('nav-project-list');
    if (navProjectList) {
        navProjectList.value = lastProject;
        await loadNavProject();
    }
}

// Function to update Quick Load availability
function updateQuickLoadState() {
    const quickLoadOption = document.getElementById('quick-load-option');
    if (!quickLoadOption || !userSessionManager) return;
    
    const lastProject = userSessionManager.getLastProject();
    
    if (lastProject) {
        quickLoadOption.classList.remove('disabled');
    } else {
        quickLoadOption.classList.add('disabled');
    }
}

// Show rename project modal
async function showRenameProjectModal() {
    // Hide context menu
    document.getElementById('nav-project-context-menu').style.display = 'none';
    
    if (!isLocal || !currentProject) {
        showToast('error', 'No project selected to rename');
        return;
    }
    
    const modal = document.getElementById('renameProjectModal');
    const projectNameInput = document.getElementById('rename-project-name');
    const filenameInput = document.getElementById('rename-html-filename');
    const confirmBtn = document.getElementById('confirm-rename-project');
    const cancelBtn = document.getElementById('cancel-rename-project');
    
    // Get current filename from config
    let currentFilename = 'info';
    try {
        const userContext = userSessionManager.getUserContext();
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const configResponse = await fetch(`/projects/${userPath}/${currentProject}/project-config.json`);
        if (configResponse.ok) {
            const config = await configResponse.json();
            currentFilename = config.htmlFilename ? config.htmlFilename.replace('.html', '') : 'info';
        }
    } catch (error) {
        console.warn('Could not load current filename:', error);
    }
    
    // Pre-fill with current values
    projectNameInput.value = currentProject;
    filenameInput.value = currentFilename;
    
    // Show modal
    modal.classList.add('active');
    projectNameInput.focus();
    projectNameInput.select();
    
    // Handle confirmation
    const handleConfirm = async () => {
        const newProjectName = projectNameInput.value.trim();
        const newFilename = filenameInput.value.trim();
        
        if (!newProjectName) {
            showToast('error', 'Project name is required');
            return;
        }
        if (!newFilename) {
            showToast('error', 'Filename is required');
            return;
        }
        
        // Check if anything actually changed
        if (newProjectName === currentProject && newFilename === currentFilename) {
            showToast('info', 'No changes made');
            modal.classList.remove('active');
            cleanup();
            return;
        }
        
        modal.classList.remove('active');
        cleanup();
        
        // Perform the rename
        await renameProject(currentProject, newProjectName, currentFilename, newFilename);
    };
    
    // Handle cancel
    const handleCancel = () => {
        modal.classList.remove('active');
        cleanup();
    };
    
    // Handle Enter key
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirm();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };
    
    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
        projectNameInput.removeEventListener('keydown', handleEnter);
        filenameInput.removeEventListener('keydown', handleEnter);
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    projectNameInput.addEventListener('keydown', handleEnter);
    filenameInput.addEventListener('keydown', handleEnter);
}

// Rename project and/or HTML file
async function renameProject(oldProjectName, newProjectName, oldFilename, newFilename) {
    try {
        showToast('info', 'Renaming...');
        
        const userContext = userSessionManager.getUserContext();
        
        const response = await fetch('/api/projects/rename', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                oldProjectName,
                newProjectName,
                oldFilename,
                newFilename,
                userContext
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to rename');
        }
        
        showToast('success', result.message);
        
        // Update current project if project name changed
        if (oldProjectName !== newProjectName) {
            currentProject = newProjectName;
            window.currentProject = newProjectName;
            updateNavProjectDisplay(newProjectName);
        }
        
        // Update filename in memory if it changed
        if (oldFilename !== newFilename) {
            window.projectFilename = newFilename;
        }
        
        // Refresh projects list
        await loadProjects();
        
        // Select the new/renamed project in dropdown
        const navProjectList = document.getElementById('nav-project-list');
        if (navProjectList) {
            navProjectList.value = newProjectName;
        }

        // Reload the project to pick up changes
        await loadNavProject();
        
    } catch (error) {
        console.error('Rename error:', error);
        showToast('error', `Failed to rename: ${error.message}`);
    }
}

// Toggle collapsible sections
function toggleCollapsible(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (content && icon) {
        content.classList.toggle('collapsed');
        icon.classList.toggle('collapsed');
    }
}

// Console helper commands
//console.log('User session commands available:');
//console.log('- debugUserSession() - Show user session debug info');
//console.log('- userSessionManager.login(username, password) - Login user');
//console.log('- userSessionManager.logout() - Logout current user');
//console.log('- userSessionManager.setGuestMode() - Switch to guest mode');

// Add keyboard navigation
document.addEventListener('keydown', handleSidebarKeyboard);

// Make functions globally available
window.toggleCollapsible = toggleCollapsible;
window.initializeSidebar = initializeSidebar;
window.switchToCategory = switchToCategory;
window.updateItemCount = updateItemCount;
window.updateAllItemCounts = updateAllItemCounts;
// Make updateQuickOpenState globally accessible
window.updateQuickOpenState = updateQuickOpenState;
// Make variables globally accessible to other script files
window.currentProject = currentProject;
window.userSessionManager = userSessionManager;

// Make utility functions globally available
window.resetForm = resetForm;
window.loadProjects = loadProjects;
window.saveToSitesFolder = saveToSitesFolder;
window.openCurrentProject = openCurrentProject;
window.updateOpenProjectButton = updateOpenProjectButton;
window.isValidHexColor = isValidHexColor;