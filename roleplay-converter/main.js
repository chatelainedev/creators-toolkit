// Main initialization for RP Archiver
// Simple version - just shows avatar, no login/logout functionality

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing RP Archiver...');
    
    try {
        // Initialize user system first
        await initializeUserSystem();

        // Initialize avatar context menu
        initializeRPContextMenu();
        
        // Initialize the rest of the app
        initializeEventListeners();
        initializeSidebar();
        initializeFormHandlers();
        // Load CSS templates
        loadCSSTemplates();
        // Initialize RP Archiver About system
        await initializeRPArchiverAbout();
        
        // Initialize any other components
        if (typeof initializeConverter === 'function') {
            initializeConverter();
        }

        // Initialize RP Project Loader after everything else is ready
        if (window.initializeRPProjectLoader) {
            setTimeout(() => {
                window.initializeRPProjectLoader();
            }, 200);
        }

        // Initialize HEX copy/paste functionality AFTER everything else
        setTimeout(() => {
            initializeHexCopyPaste();
        }, 100);
        
        console.log('✅ RP Archiver initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing RP Archiver:', error);
        // Continue with basic functionality even if user system fails
        initializeEventListeners();
        initializeSidebar();
        initializeFormHandlers();
        // Load CSS templates
        loadCSSTemplates();
    }
});

// Initialize user system
async function initializeUserSystem() {
    try {
        console.log('Initializing user session system...');
        
        // Initialize session manager
        const userSessionManager = initializeUserSession();
        
        // Initialize user session
        const hasValidUser = await userSessionManager.initializeUser();
        
        // Update UI with user info
        userSessionManager.updateUserDisplay();
        
        console.log('✅ User system initialized');
        
    } catch (error) {
        console.error('Error initializing user system:', error);
        // Continue with guest mode if something fails
        const userSessionManager = window.userSessionManager || initializeUserSession();
        if (userSessionManager) {
            userSessionManager.setGuestMode();
            userSessionManager.updateUserDisplay();
        }
    }
}

// Initialize avatar context menu for logout
function initializeRPContextMenu() {
    const navAvatarImg = document.getElementById('nav-avatar-img');
    const contextMenu = document.getElementById('rp-context-menu');
    const logoutOption = document.getElementById('rp-logout-option');

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

// Initialize basic event listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');

    // Import button and file handling - CLEAN VERSION
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    if (importBtn && importFile) {
        // Remove any existing event listeners first (just in case)
        importBtn.replaceWith(importBtn.cloneNode(true));
        const newImportBtn = document.getElementById('import-btn');
        
        // Set up clean event listeners
        newImportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Import button clicked');
            importFile.click();
        });
        
        importFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            console.log('File selected:', file ? file.name : 'none');
            
            if (!file) {
                console.log('No file selected');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(readerEvent) {
                const content = readerEvent.target.result;
                console.log('File read successfully, calling parseImportedHTML');
                
                try {
                    parseImportedHTML(content);
                    console.log('Import completed successfully');
                } catch (error) {
                    console.error('Error during import:', error);
                    alert('Error importing file: ' + error.message);
                }
                
                // Clear the input so the same file can be selected again
                importFile.value = '';
            };
            
            reader.onerror = function() {
                console.error('Error reading file');
                alert('Error reading file. Please try again.');
            };
            
            reader.readAsText(file);
        });
    }
    
    // Convert button - use the correct function name
    const convertBtn = document.getElementById('convert-btn');
    if (convertBtn) {
        convertBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Convert button clicked');
            
            // Check if the convertToHTML function exists (from your old working version)
            if (typeof convertToHTML === 'function') {
                convertToHTML();
                // ADD THIS: Enable download button after conversion
                const downloadBtn = document.getElementById('download-btn');
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                }
            } else {
                console.error('convertToHTML function not found');
                alert('Convert function not available. Please check that all scripts are loaded.');
            }
        });
    }

    // Also fix the copy and download buttons while we're at it:
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Copy button clicked');
            
            if (typeof copyHTML === 'function') {
                copyHTML();
            } else {
                console.error('copyHTML function not found');
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Download button clicked');
            
            if (typeof downloadHTML === 'function') {
                downloadHTML();
            } else {
                console.error('downloadHTML function not found');
            }
        });
    }
    
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    console.log('✅ Event listeners initialized');
}

function disableDownloadButton() {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.disabled = true;
    }
}

// Integration with RP Project Loader
function initializeProjectLoader() {
    // Wait for project loader to be ready
    if (window.rpProjectLoader) {
        console.log('✅ RP Project Loader integrated');
        
        // Optional: Add refresh button functionality
        const refreshBtn = document.getElementById('refresh-projects-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                window.rpProjectLoader.refresh();
            });
        }
    } else {
        console.log('⚠️ RP Project Loader not available');
    }
}

// Handle file import
// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('Starting import of:', file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        console.log('File loaded successfully, length:', content.length);
        
        try {
            // Parse and populate form if parsing function exists
            if (typeof parseImportedHTML === 'function') {
                console.log('Calling parseImportedHTML...');
                parseImportedHTML(content);
                console.log('Import completed successfully');
            } else {
                console.error('parseImportedHTML function not found');
                alert('Import functionality not available. Please check console for errors.');
            }
        } catch (error) {
            console.error('Error during import:', error);
            alert('Error importing file: ' + error.message);
        }
    };
    
    reader.onerror = function(e) {
        console.error('Error reading file:', e);
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
}

// Initialize sidebar functionality
function initializeSidebar() {
    console.log('Initializing sidebar...');
    
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', toggleSidebar);
    }
    
    // Set up sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                switchToSection(category);
            }
        });
    });
    
    // Default to first section
    switchToSection('story-info');
    
    console.log('✅ Sidebar initialized');
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

// Switch to a specific section
function switchToSection(sectionName) {
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const sidebarItem = document.querySelector(`[data-category="${sectionName}"]`);
    if (sidebarItem) {
        sidebarItem.classList.add('active');
    }
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const contentSection = document.getElementById(`${sectionName}-section`);
    if (contentSection) {
        contentSection.classList.add('active');
    }
}

// Switch tabs (HTML/Preview)
function switchTab(tabName) {
    // Update tab buttons - scope to just the .tabs container
    document.querySelectorAll('.tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.tabs [data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-content`).classList.add('active');
    
    // Update preview if switching to preview tab
    if (tabName === 'preview' && typeof updatePreview === 'function') {
        const html = document.getElementById('html-output').value;
        if (html) {
            console.log('Updating preview with HTML content');
            updatePreview(html);
        } else {
            console.log('No HTML content to preview - run Convert first');
            // Optional: show a message in the preview
            const iframe = document.getElementById('preview-frame');
            if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write('<div style="padding: 20px; text-align: center; color: #666;"></div>');
                iframeDoc.close();
            }
        }
    }
}

// Initialize form handlers
function initializeFormHandlers() {
    console.log('Initializing form handlers...');
    
    // Character management - FIXED VERSION
    const addCharacterBtn = document.getElementById('add-character');
    if (addCharacterBtn && typeof addCharacter === 'function') {
        addCharacterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addCharacter(); // Call with no parameters to use defaults
        });
    }
    
    // Track management  
    const addTrackBtn = document.getElementById('add-track');
    const addTrackHeadingBtn = document.getElementById('add-track-heading');
    
    if (addTrackBtn && typeof addTrack === 'function') {
        addTrackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addTrack(); // Call without parameters to use defaults
        });
    }

    if (addTrackHeadingBtn && typeof addTrackHeading === 'function') {
        addTrackHeadingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addTrackHeading(); // Call without parameters
        });
    }
        
    // Comments management
    const addCommentBtn = document.getElementById('add-comment');
    const addCommentHeadingBtn = document.getElementById('add-comment-heading');
    
    if (addCommentBtn && typeof addComment === 'function') {
        addCommentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addComment(); // Call without parameters
        });
    }

    if (addCommentHeadingBtn && typeof addCommentHeading === 'function') {
        addCommentHeadingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addCommentHeading(); // Call without parameters
        });
    }
    
    // Parts management - FIXED VERSION
    const addPartBtn = document.getElementById('add-part');
    if (addPartBtn && typeof addPart === 'function') {
        addPartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addPart(); // Call with no parameters to use defaults
        });
    }
    
    // Images management
    // Images management - updated for file-based system
    const storyImagesBrowse = document.getElementById('story-images-browse');
    const storyImagesFile = document.getElementById('story-images-file');
    const backgroundImageBrowse = document.getElementById('background-image-browse');
    const backgroundImageFile = document.getElementById('background-image-file');

    if (storyImagesBrowse && storyImagesFile) {
        storyImagesBrowse.addEventListener('click', () => {
            storyImagesFile.click();
        });
        
        storyImagesFile.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                try {
                    validateImageFile(file);
                    addImageFile(file, false);
                } catch (error) {
                    alert(`Error with file "${file.name}": ${error.message}`);
                }
            });
            
            // Clear the input so same files can be selected again
            e.target.value = '';
        });
    }

    if (backgroundImageBrowse && backgroundImageFile) {
        backgroundImageBrowse.addEventListener('click', () => {
            backgroundImageFile.click();
        });
        
        backgroundImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    validateImageFile(file);
                    addImageFile(file, true);
                } catch (error) {
                    alert(`Error with background image: ${error.message}`);
                }
            }
            
            // Clear the input
            e.target.value = '';
        });
    }

    // Initialize empty states
    const backgroundDisplay = document.getElementById('background-image-display');
    const imagesContainer = document.getElementById('images-container');

    if (backgroundDisplay) {
        backgroundDisplay.innerHTML = '<div class="file-display-empty">No background image selected</div>';
    }

    if (imagesContainer) {
        imagesContainer.innerHTML = '<div class="file-display-empty">No story images selected</div>';
    }

    // Disable download when key fields change
    const keyInputs = ['title', 'rp-text', 'characters-container', 'parts-container'];
    keyInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', disableDownloadButton);
            input.addEventListener('change', disableDownloadButton);
        }
    });
    
    // Navigation management - FIXED VERSION
    const addNavigationBtn = document.getElementById('add-navigation');
    if (addNavigationBtn && typeof addNavigation === 'function') {
        addNavigationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addNavigation(); // Call with no parameters to use defaults
        });
    }
    
    // Word count updates
    const rpTextArea = document.getElementById('rp-text');
    if (rpTextArea && typeof updateWordCount === 'function') {
        rpTextArea.addEventListener('input', updateWordCount);
        // Initial count
        updateWordCount();
    }
    
    // Background controls
    const backgroundOpacity = document.getElementById('background-opacity');
    const opacityValue = document.getElementById('opacity-value');
    
    if (backgroundOpacity && opacityValue) {
        backgroundOpacity.addEventListener('input', function() {
            opacityValue.textContent = this.value + '%';
        });
    }
    
    const backgroundBlur = document.getElementById('background-blur');
    const blurValue = document.getElementById('blur-value');
    
    if (backgroundBlur && blurValue) {
        backgroundBlur.addEventListener('input', function() {
            blurValue.textContent = this.value + 'px';
        });
    }

    // Banner image management
    const bannerImageBrowse = document.getElementById('banner-image-browse');
    const bannerImageFile = document.getElementById('banner-image-file');

    if (bannerImageBrowse && bannerImageFile) {
        bannerImageBrowse.addEventListener('click', () => {
            bannerImageFile.click();
        });
        
        bannerImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    validateImageFile(file);
                    addBannerImageFile(file);
                } catch (error) {
                    alert(`Error with banner image: ${error.message}`);
                }
            }
            
            // Clear the input
            e.target.value = '';
        });
    }

    // Initialize empty state for banner
    const bannerDisplay = document.getElementById('banner-image-display');
    if (bannerDisplay) {
        bannerDisplay.innerHTML = '<div class="file-display-empty">No banner image selected</div>';
    }

    // Banner title font size slider
    const titleFontSizeBannerSlider = document.getElementById('title-font-size-banner');
    const titleFontSizeBannerValue = document.getElementById('title-font-size-banner-value');

    if (titleFontSizeBannerSlider && titleFontSizeBannerValue) {
        titleFontSizeBannerSlider.addEventListener('input', function() {
            titleFontSizeBannerValue.textContent = this.value + 'px';
        });
    }

    initializeTextEditorModal();
    
    console.log('✅ Form handlers initialized');
}

// Initialize text editor modal functionality
function initializeTextEditorModal() {
    const expandBtn = document.getElementById('expand-text-btn');
    const modal = document.getElementById('textEditorModal');
    const closeBtn = document.getElementById('closeTextEditor');
    const originalTextarea = document.getElementById('rp-text');
    const expandedTextarea = document.getElementById('expanded-rp-text');
    const modalWordCount = document.getElementById('modal-word-count');
    const modalPageCount = document.getElementById('modal-page-count');

    if (!expandBtn || !modal || !closeBtn || !originalTextarea || !expandedTextarea) {
        console.log('Text editor modal elements not found');
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

    // Open modal
    function openTextEditor() {
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
        // Copy content back to original textarea
        originalTextarea.value = expandedTextarea.value;
        
        // Update the main word count if the function exists
        if (typeof updateWordCount === 'function') {
            updateWordCount();
        }
        
        // Hide modal
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }

    // Event listeners
    expandBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openTextEditor();
    });

    closeBtn.addEventListener('click', closeTextEditor);

    // Close when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeTextEditor();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeTextEditor();
        }
    });

    // Update word count as user types
    expandedTextarea.addEventListener('input', updateModalWordCount);

    console.log('✅ Text editor modal initialized');
}

// Debug functions for user session
window.debugUserSession = function() {
    const userSessionManager = window.userSessionManager;
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

// Console helper
console.log('Available commands:');
console.log('- debugUserSession() - Show user session debug info');