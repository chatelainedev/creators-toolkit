// =========================
// OVERVIEW buttons
// =========================

// Overview Links Management
let overviewLinksData = []; // Store links data

// Initialize overview links functionality
function initializeOverviewLinks() {
    const addButton = document.getElementById('add-overview-link');
    if (addButton) {
        addButton.addEventListener('click', addOverviewLink);
    }
    
    // NEW: Add event listeners for alignment/spacing controls
    const alignmentSelect = document.getElementById('overview-links-alignment');
    const spacingSelect = document.getElementById('overview-links-spacing');
    
    if (alignmentSelect) {
        alignmentSelect.addEventListener('change', saveOverviewLinksSettings);
    }
    if (spacingSelect) {
        spacingSelect.addEventListener('change', saveOverviewLinksSettings);
    }
    
    // Load existing links if any
    if (window.infoData.basic.overviewLinks) {
        overviewLinksData = [...window.infoData.basic.overviewLinks];
        renderOverviewLinks();
    }
    
    // NEW: Load existing settings
    loadOverviewLinksSettings();
}

// NEW: Save overview links layout settings
function saveOverviewLinksSettings() {
    if (!window.infoData.basic) {
        window.infoData.basic = {};
    }
    
    const alignmentSelect = document.getElementById('overview-links-alignment');
    const spacingSelect = document.getElementById('overview-links-spacing');
    
    window.infoData.basic.overviewLinksAlignment = alignmentSelect ? alignmentSelect.value : 'left';
    window.infoData.basic.overviewLinksSpacing = spacingSelect ? spacingSelect.value : 'centered';
}

// NEW: Load overview links layout settings
function loadOverviewLinksSettings() {
    const alignmentSelect = document.getElementById('overview-links-alignment');
    const spacingSelect = document.getElementById('overview-links-spacing');
    
    if (alignmentSelect && window.infoData.basic.overviewLinksAlignment) {
        alignmentSelect.value = window.infoData.basic.overviewLinksAlignment;
    }
    if (spacingSelect && window.infoData.basic.overviewLinksSpacing) {
        spacingSelect.value = window.infoData.basic.overviewLinksSpacing;
    }
}

// Add new overview link
function addOverviewLink() {
    if (overviewLinksData.length >= 5) {
        showToast('warning', 'Maximum of 5 overview links allowed');
        return;
    }
    
    const newLink = {
        id: Date.now(), // Simple ID generation
        label: '',
        url: '',
        color: '#B1B695', // Background color
        fontColor: '#ffffff' // NEW: Add font color field
    };
    
    overviewLinksData.push(newLink);
    renderOverviewLinks();
    updateAddButtonState();
    
    // Focus on the label input of the new link
    setTimeout(() => {
        const newInputs = document.querySelectorAll('.overview-link-item:last-child input[type="text"]');
        if (newInputs.length > 0) {
            newInputs[0].focus();
        }
    }, 100);
}

// Remove overview link
function removeOverviewLink(linkId) {
    overviewLinksData = overviewLinksData.filter(link => link.id !== linkId);
    renderOverviewLinks();
    updateAddButtonState();
    saveOverviewLinksData();
}

// Render all overview links
// Updated renderOverviewLinks function with drag functionality
function renderOverviewLinks() {
    const container = document.getElementById('overview-links-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (overviewLinksData.length === 0) {
        container.innerHTML = '<div class="overview-links-empty">No overview links added yet</div>';
        return;
    }
    
    overviewLinksData.forEach(link => {
        const linkElement = createOverviewLinkElement(link);
        container.appendChild(linkElement);
    });
    
    // Add drag functionality
    addOverviewLinksDragListeners(container);
}

// New drag functionality for overview links
function addOverviewLinksDragListeners(container) {
    const items = container.querySelectorAll('.overview-link-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            container.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            container.classList.remove('dragging');
            
            const allItems = container.querySelectorAll('.overview-link-item');
            allItems.forEach(item => item.classList.remove('drag-over'));
            
            // Update overview links order
            updateOverviewLinksOrder(container);
            
            draggedElement = null;
        });

        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const siblings = container.querySelectorAll('.overview-link-item');
            siblings.forEach(sibling => sibling.classList.remove('drag-over'));

            if (this !== draggedElement) {
                this.classList.add('drag-over');
            }
        });

        item.addEventListener('drop', function(e) {
            e.preventDefault();
            
            if (this !== draggedElement && draggedElement) {
                const rect = this.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    container.insertBefore(draggedElement, this);
                } else {
                    container.insertBefore(draggedElement, this.nextSibling);
                }
            }
            
            this.classList.remove('drag-over');
        });
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (e.target === container && draggedElement) {
            container.appendChild(draggedElement);
        }
    });
}

// New function to update overview links order after drag
function updateOverviewLinksOrder(container) {
    const linkItems = container.querySelectorAll('.overview-link-item');
    const newOrder = [];
    
    linkItems.forEach(item => {
        const linkId = parseInt(item.dataset.linkId);
        const link = overviewLinksData.find(l => l.id === linkId);
        if (link) {
            newOrder.push(link);
        }
    });
    
    // Update the data array with the new order
    overviewLinksData = newOrder;
    saveOverviewLinksData();
}

function createOverviewLinkElement(link) {
    const div = document.createElement('div');
    div.className = 'overview-link-item';
    div.dataset.linkId = link.id;
    div.draggable = true;
    
    div.innerHTML = `
        <div class="overview-link-drag-handle">
            <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="overview-link-inputs">
            <div class="overview-link-field">
                <label></label>
                <input type="text" 
                       class="link-label-input" 
                       value="${escapeHtml(link.label)}" 
                       placeholder="Button text"
                       maxlength="20">
            </div>
            <div class="overview-link-field">
                <label></label>
                <div class="url-color-row">
                    <input type="text" 
                           class="link-url-input" 
                           value="${escapeHtml(link.url)}" 
                           placeholder="#characters or https://...">
                    <input type="color" 
                           class="link-color-input" 
                           value="${link.color || '#B1B695'}" 
                           title="Button background color">
                    <input type="color" 
                           class="link-font-color-input" 
                           value="${link.fontColor || '#ffffff'}" 
                           title="Button text color">
                </div>
            </div>
        </div>
        <button type="button" class="overview-link-remove" title="Remove link">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add event listeners
    const labelInput = div.querySelector('.link-label-input');
    const urlInput = div.querySelector('.link-url-input');
    const colorInput = div.querySelector('.link-color-input');
    const fontColorInput = div.querySelector('.link-font-color-input'); // NEW
    const removeBtn = div.querySelector('.overview-link-remove');
    
    labelInput.addEventListener('input', () => updateLinkData(link.id, 'label', labelInput.value));
    urlInput.addEventListener('input', () => updateLinkData(link.id, 'url', urlInput.value));
    colorInput.addEventListener('input', () => updateLinkData(link.id, 'color', colorInput.value));
    fontColorInput.addEventListener('input', () => updateLinkData(link.id, 'fontColor', fontColorInput.value)); // NEW
    removeBtn.addEventListener('click', () => removeOverviewLink(link.id));
    
    return div;
}

// Update link data
function updateLinkData(linkId, field, value) {
    const link = overviewLinksData.find(l => l.id === linkId);
    if (link) {
        link[field] = value;
        saveOverviewLinksData();
    }
}

// Save overview links data to main data structure
function saveOverviewLinksData() {
    if (!window.infoData.basic) {
        window.infoData.basic = {};
    }
    window.infoData.basic.overviewLinks = [...overviewLinksData];
}

// Update add button state
function updateAddButtonState() {
    const addButton = document.getElementById('add-overview-link');
    if (addButton) {
        addButton.disabled = overviewLinksData.length >= 5;
        
        if (overviewLinksData.length >= 5) {
            addButton.innerHTML = '<i class="fas fa-check"></i> Maximum Links (5/5)';
        } else {
            addButton.innerHTML = `<i class="fas fa-plus"></i> Add Link (${overviewLinksData.length}/5)`;
        }
    }
}

// Update Generate button state based on loading and generation status
function updateGenerateButtonState() {
    const generateBtn = document.getElementById('generate-btn');
    if (!generateBtn) return;
    
    if (projectLoading) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Loading Project...';
    } else {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Create';
    }
}

// =========================
// CUSTOM buttons
// =========================

// Custom Navigation Management
let customNavLinksData = []; // Store custom nav links data

// Initialize custom navigation functionality
// Update the initializeCustomNavigation function you already added:
function initializeCustomNavigation() {
    const addButton = document.getElementById('add-custom-nav-link');
    if (addButton) {
        addButton.addEventListener('click', addCustomNavLink);
    }
    
    // Add event listeners for location checkboxes
    const locationCheckboxes = ['custom-nav-banner', 'custom-nav-site-right', 'custom-nav-site-left'];
    locationCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', handleCustomNavLocationChange);
        }
    });
    
    // Add event listeners for position controls
    const positionControls = ['custom-nav-alignment', 'custom-nav-spacing', 'custom-nav-position'];
    positionControls.forEach(id => {
        const control = document.getElementById(id);
        if (control) {
            control.addEventListener('change', saveCustomNavSettings);
        }
    });

    // Add event listener for sticky checkbox
    const stickyCheckbox = document.getElementById('custom-nav-sticky');
    if (stickyCheckbox) {
        stickyCheckbox.addEventListener('change', saveCustomNavSettings);
    }
    
    // Load existing links if any
    if (window.infoData.basic.customNavLinks) {
        customNavLinksData = [...window.infoData.basic.customNavLinks];
        renderCustomNavLinks();
        updateCustomNavAddButtonState(); // ADD THIS LINE
    }

    // Load existing settings (REPLACE the big manual section with this single call)
    loadCustomNavSettings();
}

// NEW: Load custom navigation settings into UI
function loadCustomNavSettings() {
    if (!window.infoData.basic.customNavSettings) {
        hideCustomNavPositionControls(); // Show but disable controls
        return;
    }
    
    const settings = window.infoData.basic.customNavSettings;
    
    // Clear all checkboxes first
    const locationCheckboxes = ['custom-nav-banner', 'custom-nav-site-right', 'custom-nav-site-left'];
    locationCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = false;
    });
    
    // Hide position controls initially
    hideCustomNavPositionControls();
    
    // Restore location selection
    if (settings.location) {
        const checkbox = document.getElementById(`custom-nav-${settings.location}`);
        if (checkbox) {
            checkbox.checked = true;
            showCustomNavPositionControls(`custom-nav-${settings.location}`);
            
            // Restore position settings with a delay to ensure dropdowns are populated
            setTimeout(() => {
                if (settings.alignment) {
                    const alignmentSelect = document.getElementById('custom-nav-alignment');
                    if (alignmentSelect) alignmentSelect.value = settings.alignment;
                }
                if (settings.spacing) {
                    const spacingSelect = document.getElementById('custom-nav-spacing');
                    if (spacingSelect) spacingSelect.value = settings.spacing;
                }
                if (settings.position) {
                    const positionSelect = document.getElementById('custom-nav-position');
                    if (positionSelect) positionSelect.value = settings.position;
                }
            }, 100);
        }
    }
    
    const stickyCheckbox = document.getElementById('custom-nav-sticky');
    
    if (stickyCheckbox && window.infoData.basic.customNavSettings) {
        stickyCheckbox.checked = window.infoData.basic.customNavSettings.sticky || false;
    }
}

// Handle location checkbox changes (mutual exclusivity)
function handleCustomNavLocationChange(event) {
    const clickedId = event.target.id;
    const locationCheckboxes = ['custom-nav-banner', 'custom-nav-site-right', 'custom-nav-site-left'];
    
    // If this checkbox was checked, uncheck the others
    if (event.target.checked) {
        locationCheckboxes.forEach(id => {
            if (id !== clickedId) {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = false;
            }
        });
        
        // Show position controls and populate dropdowns
        showCustomNavPositionControls(clickedId);
    } else {
        // If unchecked, hide position controls
        hideCustomNavPositionControls();
    }
    
    saveCustomNavSettings();
}

// Show position controls and populate based on location type
function showCustomNavPositionControls(locationId) {
    const controlsContainer = document.querySelector('.custom-nav-position-controls');
    if (controlsContainer) {
        controlsContainer.style.display = 'flex';
        controlsContainer.classList.remove('disabled-controls'); // Remove disabled state
        
        // Re-enable all select elements
        const selects = controlsContainer.querySelectorAll('select');
        selects.forEach(select => {
            select.disabled = false;
        });
    }
    
    const alignmentSelect = document.getElementById('custom-nav-alignment');
    const spacingSelect = document.getElementById('custom-nav-spacing');
    const positionSelect = document.getElementById('custom-nav-position');
    
    // Clear existing options
    [alignmentSelect, spacingSelect, positionSelect].forEach(select => {
        if (select) select.innerHTML = '';
    });
    
    // Populate based on location type
    if (locationId === 'custom-nav-banner') {
        // Banner options (like overview links)
        if (alignmentSelect) {
            alignmentSelect.innerHTML = `
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            `;
        }
        if (spacingSelect) {
            spacingSelect.innerHTML = `
                <option value="centered">Centered</option>
                <option value="flex">Fill Space</option>
            `;
        }
        if (positionSelect) {
            positionSelect.innerHTML = `
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
            `;
        }
    } else if (locationId === 'custom-nav-site-right') {
        // Site Right options
        if (alignmentSelect) {
            alignmentSelect.innerHTML = `
                <option value="left">Left (close to container)</option>
                <option value="center">Center</option>
                <option value="right">Right (close to edge)</option>
            `;
        }
        if (spacingSelect) {
            spacingSelect.innerHTML = `
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            `;
        }
        if (positionSelect) {
            positionSelect.innerHTML = `
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            `;
        }
    } else if (locationId === 'custom-nav-site-left') {
        // Site Left options (alignment reversed)
        if (alignmentSelect) {
            alignmentSelect.innerHTML = `
                <option value="left">Left (close to edge)</option>
                <option value="center">Center</option>
                <option value="right">Right (close to container)</option>
            `;
        }
        if (spacingSelect) {
            spacingSelect.innerHTML = `
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            `;
        }
        if (positionSelect) {
            positionSelect.innerHTML = `
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            `;
        }
    }
}

// Hide position controls
// Disable position controls instead of hiding them
function hideCustomNavPositionControls() {
    const controlsContainer = document.querySelector('.custom-nav-position-controls');
    if (controlsContainer) {
        controlsContainer.style.display = 'flex'; // Keep visible
        controlsContainer.classList.add('disabled-controls');
        
        // Disable all select elements
        const selects = controlsContainer.querySelectorAll('select');
        selects.forEach(select => {
            select.disabled = true;
            select.value = ''; // Clear values
        });
    }
}

// Add new custom nav link
function addCustomNavLink() {
    if (customNavLinksData.length >= 8) {
        showToast('warning', 'Maximum of 8 custom navigation links allowed');
        return;
    }
    
    const newLink = {
        id: Date.now(),
        label: '',
        url: '',
        color: '#B1B695',
        fontColor: '#ffffff'
    };
    
    customNavLinksData.push(newLink);
    renderCustomNavLinks();
    updateCustomNavAddButtonState();
    
    // Focus on the label input of the new link
    setTimeout(() => {
        const newInputs = document.querySelectorAll('.custom-nav-link-item:last-child input[type="text"]');
        if (newInputs.length > 0) {
            newInputs[0].focus();
        }
    }, 100);
}

// Save custom nav settings
function saveCustomNavSettings() {
    if (!window.infoData.basic) {
        window.infoData.basic = {};
    }
    
    // Save location
    const locationCheckboxes = ['custom-nav-banner', 'custom-nav-site-right', 'custom-nav-site-left'];
    let selectedLocation = null;
    locationCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            selectedLocation = id.replace('custom-nav-', '');
        }
    });
    
    // Save position settings
    const alignment = document.getElementById('custom-nav-alignment')?.value;
    const spacing = document.getElementById('custom-nav-spacing')?.value;
    const position = document.getElementById('custom-nav-position')?.value;
    
    // Save sticky setting
    const stickyCheckbox = document.getElementById('custom-nav-sticky');
    const isSticky = stickyCheckbox ? stickyCheckbox.checked : false;

    window.infoData.basic.customNavSettings = {
        location: selectedLocation,
        alignment: alignment,
        spacing: spacing,
        position: position,
        sticky: isSticky  // Add this line
    };
    
    // Save links data
    window.infoData.basic.customNavLinks = [...customNavLinksData];
}

// Render custom nav links
function renderCustomNavLinks() {
    const container = document.getElementById('custom-nav-links-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (customNavLinksData.length === 0) {
        container.innerHTML = '<div class="overview-links-empty">No custom navigation links added yet</div>';
        return;
    }
    
    customNavLinksData.forEach(link => {
        const linkElement = createCustomNavLinkElement(link);
        container.appendChild(linkElement);
    });
    
    // Add drag functionality
    addCustomNavLinksDragListeners(container);
}

// Update add button state
function updateCustomNavAddButtonState() {
    const addButton = document.getElementById('add-custom-nav-link');
    if (addButton) {
        addButton.disabled = customNavLinksData.length >= 8;
        
        if (customNavLinksData.length >= 8) {
            addButton.innerHTML = '<i class="fas fa-check"></i> Maximum Links (8/8)';
        } else {
            addButton.innerHTML = `<i class="fas fa-plus"></i> Add Link (${customNavLinksData.length}/8)`;
        }
    }
}

function createCustomNavLinkElement(link) {
    const div = document.createElement('div');
    div.className = 'overview-link-item'; // Same class, same styling
    div.dataset.linkId = link.id;
    div.draggable = true;
    
    div.innerHTML = `
        <div class="overview-link-drag-handle">
            <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="overview-link-inputs">
            <div class="overview-link-field">
                <label></label>
                <input type="text" 
                       class="link-label-input" 
                       value="${escapeHtml(link.label)}" 
                       placeholder="Button text"
                       maxlength="20">
            </div>
            <div class="overview-link-field">
                <label></label>
                <div class="url-color-row">
                    <input type="text" 
                           class="link-url-input" 
                           value="${escapeHtml(link.url)}" 
                           placeholder="#characters or https://...">
                    <input type="color" 
                           class="link-color-input" 
                           value="${link.color || '#B1B695'}" 
                           title="Button background color">
                    <input type="color" 
                           class="link-font-color-input" 
                           value="${link.fontColor || '#ffffff'}" 
                           title="Button text color">
                </div>
            </div>
        </div>
        <button type="button" class="overview-link-remove" title="Remove link">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add event listeners
    const labelInput = div.querySelector('.link-label-input');
    const urlInput = div.querySelector('.link-url-input');
    const colorInput = div.querySelector('.link-color-input');
    const fontColorInput = div.querySelector('.link-font-color-input');
    const removeBtn = div.querySelector('.overview-link-remove');
    
    labelInput.addEventListener('input', () => updateCustomNavLinkData(link.id, 'label', labelInput.value));
    urlInput.addEventListener('input', () => updateCustomNavLinkData(link.id, 'url', urlInput.value));
    colorInput.addEventListener('input', () => updateCustomNavLinkData(link.id, 'color', colorInput.value));
    fontColorInput.addEventListener('input', () => updateCustomNavLinkData(link.id, 'fontColor', fontColorInput.value));
    removeBtn.addEventListener('click', () => removeCustomNavLink(link.id));
    
    return div;
}

// Update custom nav link data
function updateCustomNavLinkData(linkId, field, value) {
    const link = customNavLinksData.find(l => l.id === linkId);
    if (link) {
        link[field] = value;
        saveCustomNavSettings(); // This also saves the links data
    }
}

// Remove custom nav link
function removeCustomNavLink(linkId) {
    customNavLinksData = customNavLinksData.filter(link => link.id !== linkId);
    renderCustomNavLinks();
    updateCustomNavAddButtonState();
    saveCustomNavSettings();
}

// Add drag functionality for custom nav links (add this function)
function addCustomNavLinksDragListeners(container) {
    const items = container.querySelectorAll('.overview-link-item'); // Use correct class
    
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = this; // Use the same global variable as overview links
            this.classList.add('dragging');
            container.classList.add('dragging');
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
        });

        item.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            container.classList.remove('dragging');
            
            const allItems = container.querySelectorAll('.overview-link-item');
            allItems.forEach(item => item.classList.remove('drag-over'));
            
            // Update custom nav order after drag ends
            updateCustomNavLinksOrder(container);
            
            draggedElement = null;
        });

        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const siblings = container.querySelectorAll('.overview-link-item');
            siblings.forEach(sibling => sibling.classList.remove('drag-over'));

            if (this !== draggedElement) {
                this.classList.add('drag-over');
            }
        });

        item.addEventListener('drop', function(e) {
            e.preventDefault();
            
            if (this !== draggedElement && draggedElement) {
                const rect = this.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    container.insertBefore(draggedElement, this);
                } else {
                    container.insertBefore(draggedElement, this.nextSibling);
                }
            }
            
            this.classList.remove('drag-over');
        });
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (e.target === container && draggedElement) {
            container.appendChild(draggedElement);
        }
    });
}

// New function to update custom nav links order after drag
function updateCustomNavLinksOrder(container) {
    const linkItems = container.querySelectorAll('.overview-link-item');
    const newOrder = [];
    
    linkItems.forEach(item => {
        const linkId = parseInt(item.dataset.linkId);
        const link = customNavLinksData.find(l => l.id === linkId);
        if (link) {
            newOrder.push(link);
        }
    });
    
    // Update the data array with the new order
    customNavLinksData = newOrder;
    saveCustomNavSettings();
}

