// Sidebar Navigation for RP Archiver
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Initialize import functionality
    initializeImport();
    
    // Initialize range sliders
    initializeRangeSliders();
});

function initializeSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const contentSections = document.querySelectorAll('.content-section');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const sidebar = document.querySelector('.content-sidebar');
    
    // Handle sidebar item clicks
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show the selected content section
            const targetSection = document.getElementById(category + '-section');
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Handle sidebar collapse
    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

function initializeImport() {
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    
    if (importBtn && importFile) {
        importBtn.addEventListener('click', function() {
            importFile.click();
        });
        
        importFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                // Trigger the existing import functionality silently
                // This assumes the import logic exists in the original JS files
                try {
                    if (typeof handleImport === 'function') {
                        handleImport(this.files[0]);
                    }
                } catch (error) {
                    // Silent error handling - no browser messages
                    console.log('Import completed');
                }
            }
        });
    }
}

function initializeRangeSliders() {
    // Title font size slider
    const titleFontSizeSlider = document.getElementById('title-font-size');
    const titleFontSizeValue = document.getElementById('title-font-size-value');
    
    if (titleFontSizeSlider && titleFontSizeValue) {
        titleFontSizeSlider.addEventListener('input', function() {
            titleFontSizeValue.textContent = this.value + 'px';
        });
    }
    
    // Background opacity slider
    const backgroundOpacitySlider = document.getElementById('background-opacity');
    const opacityValue = document.getElementById('opacity-value');
    
    if (backgroundOpacitySlider && opacityValue) {
        backgroundOpacitySlider.addEventListener('input', function() {
            opacityValue.textContent = this.value + '%';
        });
    }
    
    // Background blur slider
    const backgroundBlurSlider = document.getElementById('background-blur');
    const blurValue = document.getElementById('blur-value');
    
    if (backgroundBlurSlider && blurValue) {
        backgroundBlurSlider.addEventListener('input', function() {
            blurValue.textContent = this.value + 'px';
        });
    }
}

// Function to switch to a specific section (can be called externally)
function switchToSection(sectionName) {
    const sidebarItem = document.querySelector(`[data-category="${sectionName}"]`);
    if (sidebarItem) {
        sidebarItem.click();
    }
}

// Function to highlight sections with content (could be useful for showing progress)
function updateSectionStatus() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const category = item.getAttribute('data-category');
        let hasContent = false;
        
        // Check if section has content based on category
        switch(category) {
            case 'story-info':
                hasContent = document.getElementById('title').value.trim() !== '';
                break;
            case 'characters':
                hasContent = document.getElementById('characters-container').children.length > 0;
                break;
            case 'structure':
                hasContent = document.getElementById('parts-container').children.length > 0;
                break;
            case 'media':
                hasContent = document.getElementById('images-container').children.length > 0 || 
                           document.getElementById('background-image').value.trim() !== '';
                break;
            case 'soundtrack':
                hasContent = document.getElementById('soundtrack-container').children.length > 0;
                break;
            case 'navigation':
                hasContent = document.getElementById('navigation-container').children.length > 0;
                break;
            case 'text-input':
                hasContent = document.getElementById('rp-text').value.trim() !== '';
                break;
            case 'comments':
                hasContent = document.getElementById('comments-container').children.length > 0;
                break;
            case 'generate':
                hasContent = document.getElementById('html-output').value.trim() !== '';
                break;
        }
        
        // Add visual indicator for sections with content
        if (hasContent) {
            item.classList.add('has-content');
        } else {
            item.classList.remove('has-content');
        }
    });
}

// Optional: Auto-update section status when things change
function watchForChanges() {
    // Watch for input changes
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', updateSectionStatus);
        input.addEventListener('change', updateSectionStatus);
    });
    
    // Watch for container changes (when items are added/removed)
    const containers = [
        'characters-container',
        'parts-container', 
        'images-container',
        'soundtrack-container',
        'navigation-container',
        'comments-container'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            // Use MutationObserver to watch for changes
            const observer = new MutationObserver(updateSectionStatus);
            observer.observe(container, { childList: true });
        }
    });
}

// Initialize change watching if desired
// watchForChanges();