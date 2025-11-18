// Custom Pages Module - Main functionality
let editingPageIndex = -1;
let editingElementIndex = -1;
let customPagesDraggedElement = null;

// Initialize Custom Pages functionality
function initializeCustomPages() {
    console.log('Initializing Custom Pages module');
    
    // Ensure customPages array exists
    if (!infoData.customPages) {
        infoData.customPages = [];
    }
    
    // Migrate existing pages if needed
    migrateExistingPagesToUniversal();
    
    // Initialize event listeners
    initializeCustomPagesEventListeners();
    
    // ADD THIS LINE:
    if (typeof initializeHorizontalLinks === 'function') {
        initializeHorizontalLinks();
    }
    
    // ADD THIS NEW LINE FOR GALLERY INITIALIZATION:
    if (typeof initializeCustomPageGalleries === 'function') {
        // Initialize galleries when custom pages are displayed
        document.addEventListener('DOMContentLoaded', initializeCustomPageGalleries);
    }
    
    // Render initial state
    renderPagesList();
    
    console.log('Custom Pages module initialized');
}

// ===== ELEMENT MODAL FUNCTIONS =====

// Open element edit modal
function openElementEditModal(element) {
    const modal = document.getElementById('edit-element-modal');
    if (!modal) return;
    
    // Set modal title
    const titleElement = document.getElementById('edit-element-title');
    if (titleElement) {
        titleElement.textContent = `Edit ${getElementTypeName(element.type)}`;
    }
    
    // Populate modal content based on element type
    populateElementModalContent(element);
    
    // Show modal
    modal.style.display = 'block';
}

// Close element edit modal
function closeElementEditModal() {
    const modal = document.getElementById('edit-element-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingElementIndex = -1;
}

// Populate modal content based on element type
function populateElementModalContent(element) {
    const bodyDiv = document.getElementById('edit-element-body');
    if (!bodyDiv) return;
    
    // Get the appropriate template
    const templateId = `template-${element.type}-element`;
    const template = document.getElementById(templateId);
    
    if (!template) {
        console.error(`Template not found for element type: ${element.type}`);
        bodyDiv.innerHTML = `<p>Error: No editor template found for ${element.type}</p>`;
        return;
    }
    
    // Handle template vs div differently
    if (template.tagName === 'TEMPLATE') {
        // Clone template content
        const templateContent = template.content.cloneNode(true);
        bodyDiv.innerHTML = '';
        bodyDiv.appendChild(templateContent);
    } else {
        // Clone regular div content
        bodyDiv.innerHTML = template.innerHTML;
    }
    
    // Populate fields based on element type
    populateElementFields(element);
    
    // Initialize element-specific functionality
    initializeElementSpecificHandlers(element.type);
}

// Populate form fields with element data
function populateElementFields(element) {
    switch (element.type) {
        case 'title':
            const titleInput = document.getElementById('element-title-content');
            if (titleInput) {
                titleInput.value = element.content || '';
            }
            break;
            
        case 'paragraph':
            const paragraphInput = document.getElementById('element-paragraph-content');
            const paragraphBgColor = document.getElementById('element-paragraph-bg-color');
            if (paragraphInput) {
                paragraphInput.value = element.content || '';
            }
            if (paragraphBgColor) {
                paragraphBgColor.value = element.backgroundColor || '';
            }
            break;

        case 'two-column-paragraph':
            const leftColumnInput = document.getElementById('element-twocolumn-left-content');
            const rightColumnInput = document.getElementById('element-twocolumn-right-content');
            if (leftColumnInput) {
                leftColumnInput.value = element.leftContent || '';
            }
            if (rightColumnInput) {
                rightColumnInput.value = element.rightContent || '';
            }
            const twocolumnBgColor = document.getElementById('element-twocolumn-bg-color');
            if (twocolumnBgColor) {
                twocolumnBgColor.value = element.backgroundColor || '';
            }
            break;
            
        case 'subcontainer':
            const subcontainerInput = document.getElementById('element-subcontainer-content');
            if (subcontainerInput) {
                subcontainerInput.value = element.content || '';
            }
            break;

        case 'horizontal-links':
            // Reset modal data
            modalHorizontalLinksData = [];
            
            // Populate with existing data
            if (element.links && Array.isArray(element.links)) {
                modalHorizontalLinksData = element.links.map(link => ({
                    id: Date.now() + Math.random(),
                    text: link.text || '',
                    url: link.url || '',
                    icon: link.icon || ''
                }));
            }
            
            // Set alignment, spacing, and style
            const alignmentSelect = document.getElementById('element-horizontal-alignment');
            const spacingSelect = document.getElementById('element-horizontal-spacing');
            const styleSelect = document.getElementById('element-horizontal-style');
            
            if (alignmentSelect) {
                alignmentSelect.value = element.alignment || 'center';
            }
            if (spacingSelect) {
                spacingSelect.value = element.spacing || 'centered';
            }
            if (styleSelect) {
                styleSelect.value = element.style || 'modern';
            }
            
            // Render links
            renderModalHorizontalLinks();
            break;
            
        case 'single-image':
            const singleImageInput = document.getElementById('element-single-image-url');
            const singleImageAlignment = document.getElementById('element-single-image-alignment');
            if (singleImageInput) {
                singleImageInput.value = element.image || '';
            }
            if (singleImageAlignment) {
                singleImageAlignment.value = element.alignment || 'center';
            }
            break;

        case 'image-set':
            const imageInputs = [
                document.getElementById('element-image-1'),
                document.getElementById('element-image-2'),
                document.getElementById('element-image-3')
            ];
            
            if (element.images && Array.isArray(element.images)) {
                imageInputs.forEach((input, index) => {
                    if (input && element.images[index]) {
                        input.value = element.images[index];
                    }
                });
            }
            break;

        case 'gallery':
            const galleryImagesInput = document.getElementById('element-gallery-images');
            const galleryColumnsInput = document.getElementById('element-gallery-columns');
            const galleryAlignmentInput = document.getElementById('element-gallery-alignment');
            
            if (galleryImagesInput && element.images) {
                galleryImagesInput.value = element.images.join('\n');
            }
            if (galleryColumnsInput) {
                galleryColumnsInput.value = element.columns || 5;
            }
            if (galleryAlignmentInput) {
                galleryAlignmentInput.value = element.alignment || 'center';
            }
            break;
            
        case 'image-text-right':
            const rightContentInput = document.getElementById('element-imagetext-right-content');
            const rightImageInput = document.getElementById('element-imagetext-right-image');
            if (rightContentInput) rightContentInput.value = element.content || '';
            if (rightImageInput) rightImageInput.value = element.image || '';
            const rightBgColor = document.getElementById('element-imagetext-right-bg-color');
            if (rightBgColor) rightBgColor.value = element.backgroundColor || '';
            break;
            
        case 'image-text-left':
            const leftContentInput = document.getElementById('element-imagetext-left-content');
            const leftImageInput = document.getElementById('element-imagetext-left-image');
            if (leftContentInput) leftContentInput.value = element.content || '';
            if (leftImageInput) leftImageInput.value = element.image || '';
            const leftBgColor = document.getElementById('element-imagetext-left-bg-color');
            if (leftBgColor) leftBgColor.value = element.backgroundColor || '';
            break;
    }
}

// Save element changes
function saveElementChanges() {
    if (editingPageIndex < 0 || editingElementIndex < 0) return;
    
    const page = infoData.customPages[editingPageIndex];
    const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
    const element = sortedElements[editingElementIndex];
    
    if (!element) return;
    
    // Extract data from form based on element type
    const updatedElement = extractElementData(element);
    
    if (updatedElement) {
        // Find the element in the original array and update it
        const elementIndex = page.elements.findIndex(el => el.id === element.id);
        if (elementIndex >= 0) {
            page.elements[elementIndex] = updatedElement;
            page.modified = new Date().toISOString();
            
            if (typeof dataModified !== 'undefined') {
                dataModified = true;
            }
            
            // Re-render page elements
            renderPageElements(page);
            
            // Close modal
            closeElementEditModal();
            
            if (typeof showStatus === 'function') {
                showStatus('success', 'Element updated successfully');
            }
        }
    }
}

// Extract element data from form
function extractElementData(element) {
    const updatedElement = { ...element };
    updatedElement.modified = new Date().toISOString();
    
    switch (element.type) {
        case 'title':
            const titleInput = document.getElementById('element-title-content');
            if (titleInput) {
                updatedElement.content = titleInput.value.trim();
            }
            break;
            
        case 'paragraph':
            const paragraphInput = document.getElementById('element-paragraph-content');
            const paragraphBgColor = document.getElementById('element-paragraph-bg-color');
            if (paragraphInput) {
                updatedElement.content = paragraphInput.value.trim();
            }
            if (paragraphBgColor) {
                updatedElement.backgroundColor = paragraphBgColor.value.trim();
            }
            break;

        case 'two-column-paragraph':
            const leftColumnInput = document.getElementById('element-twocolumn-left-content');
            const rightColumnInput = document.getElementById('element-twocolumn-right-content');
            if (leftColumnInput) updatedElement.leftContent = leftColumnInput.value.trim();
            if (rightColumnInput) updatedElement.rightContent = rightColumnInput.value.trim();
            const twocolumnBgColor = document.getElementById('element-twocolumn-bg-color');
            if (twocolumnBgColor) updatedElement.backgroundColor = twocolumnBgColor.value.trim();
            break;
            
        case 'subcontainer':
            const subcontainerInput = document.getElementById('element-subcontainer-content');
            if (subcontainerInput) {
                updatedElement.content = subcontainerInput.value.trim();
            }
            break;  
            
        case 'horizontal-links':
            const alignmentSelect = document.getElementById('element-horizontal-alignment');
            const spacingSelect = document.getElementById('element-horizontal-spacing');
            const styleSelect = document.getElementById('element-horizontal-style');
            
            if (alignmentSelect) updatedElement.alignment = alignmentSelect.value;
            if (spacingSelect) updatedElement.spacing = spacingSelect.value;
            if (styleSelect) updatedElement.style = styleSelect.value;
            
            // Extract links data
            updatedElement.links = modalHorizontalLinksData.map(link => ({
                text: link.text || '',
                url: link.url || '',
                icon: link.icon || ''
            }));
            break;

        case 'single-image':
            const singleImageInput = document.getElementById('element-single-image-url');
            const singleImageAlignment = document.getElementById('element-single-image-alignment');
            if (singleImageInput) updatedElement.image = singleImageInput.value.trim();
            if (singleImageAlignment) updatedElement.alignment = singleImageAlignment.value;
            break;

        case 'image-set':
            const imageInputs = [
                document.getElementById('element-image-1'),
                document.getElementById('element-image-2'),
                document.getElementById('element-image-3')
            ];
            
            updatedElement.images = imageInputs.map(input => 
                input ? input.value.trim() : ''
            );
            break;

        case 'gallery':
            const galleryImagesInput = document.getElementById('element-gallery-images');
            const galleryColumnsInput = document.getElementById('element-gallery-columns');
            const galleryAlignmentInput = document.getElementById('element-gallery-alignment');
            
            if (galleryImagesInput) {
                const imagesText = galleryImagesInput.value.trim();
                updatedElement.images = imagesText ? imagesText.split('\n').map(url => url.trim()).filter(url => url) : [];
            }
            if (galleryColumnsInput) {
                updatedElement.columns = parseInt(galleryColumnsInput.value) || 5;
            }
            if (galleryAlignmentInput) {
                updatedElement.alignment = galleryAlignmentInput.value || 'center';
            }
            break;
            
        case 'image-text-right':
            const rightContentInput = document.getElementById('element-imagetext-right-content');
            const rightImageInput = document.getElementById('element-imagetext-right-image');
            if (rightContentInput) updatedElement.content = rightContentInput.value.trim();
            if (rightImageInput) updatedElement.image = rightImageInput.value.trim();
            const rightBgColor = document.getElementById('element-imagetext-right-bg-color');
            if (rightBgColor) updatedElement.backgroundColor = rightBgColor.value.trim();
            break;
            
        case 'image-text-left':
            const leftContentInput = document.getElementById('element-imagetext-left-content');
            const leftImageInput = document.getElementById('element-imagetext-left-image');
            if (leftContentInput) updatedElement.content = leftContentInput.value.trim();
            if (leftImageInput) updatedElement.image = leftImageInput.value.trim();
            const leftBgColor = document.getElementById('element-imagetext-left-bg-color');
            if (leftBgColor) updatedElement.backgroundColor = leftBgColor.value.trim();
            break;
            
        default:
            console.error(`Unknown element type: ${element.type}`);
            return null;
    }
    
    return updatedElement;
}

// Migration function to update existing pages to universal template
function migrateExistingPagesToUniversal() {
    if (!infoData.customPages) return;
    
    let migrated = false;
    infoData.customPages.forEach(page => {
        if (page.template === 'template1' || page.template === 'template2') {
            // Migrate element types
            if (page.elements) {
                page.elements.forEach(element => {
                    if (element.type === 'images') {
                        element.type = 'image-set';
                    }
                });
            }
            
            page.template = 'universal';
            migrated = true;
        }
    });
    
    if (migrated) {
        console.log('Migrated existing pages to universal template');
        if (typeof dataModified !== 'undefined') {
            dataModified = true;
        }
    }
}

// Set up all event listeners
function initializeCustomPagesEventListeners() {   
    // Create page button
    const createPageBtn = document.getElementById('create-page-btn');
    if (createPageBtn) {
        createPageBtn.addEventListener('click', openCreatePageModal);
    } else {
        console.error('Create page button not found!');
    }
    
    // Create page modal
    const createPageModal = document.getElementById('create-page-modal');
    if (createPageModal) {
        // Close button
        const closeBtn = createPageModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCreatePageModal);
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancel-create-page');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeCreatePageModal);
        }
        
        // Confirm button
        const confirmBtn = document.getElementById('confirm-create-page');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', createPage);
        }
        
        // Template selection change
        const templateSelect = document.getElementById('page-template');
        if (templateSelect) {
            templateSelect.addEventListener('change', function() {
                onTemplateSelectionChange();
                validatePageName(); // Add this line
            });
        }
        
        // Page name validation
        const pageNameInput = document.getElementById('page-name');
        if (pageNameInput) {
            pageNameInput.addEventListener('input', validatePageName);
        }
    }
    
    // Edit page modal
    const editPageModal = document.getElementById('edit-page-modal');
    if (editPageModal) {
        // Close button
        const closeBtn = editPageModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEditPageModal);
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancel-edit-page');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeEditPageModal);
        }
        
        // Save button
        const saveBtn = document.getElementById('save-edit-page');
        if (saveBtn) {
            saveBtn.addEventListener('click', savePageChanges);
        }
        
        // Add element controls
        const addElementBtn = document.getElementById('add-element-btn');
        if (addElementBtn) {
            addElementBtn.addEventListener('click', addElementToPage);
        }
        
        const elementSelect = document.getElementById('element-type-select');
        if (elementSelect) {
            elementSelect.addEventListener('change', onElementTypeChange);
        }
    }

    // Element edit modal
    const editElementModal = document.getElementById('edit-element-modal');
    if (editElementModal) {
        // Close button
        const closeBtn = editElementModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeElementEditModal);
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancel-edit-element');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeElementEditModal);
        }
        
        // Save button
        const saveBtn = document.getElementById('save-edit-element');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveElementChanges);
        }
    }
    
// Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'create-page-modal') {
                closeCreatePageModal();
            } else if (e.target.id === 'edit-page-modal') {
                closeEditPageModal();
            } else if (e.target.id === 'edit-element-modal') {
                closeElementEditModal();
            }
        }
    });
}

// Initialize element-specific handlers after modal content is populated
function initializeElementSpecificHandlers(elementType) {
    if (elementType === 'horizontal-links') {
        // Initialize horizontal links functionality for the modal
        const addButton = document.getElementById('add-modal-horizontal-link');
        if (addButton) {
            addButton.addEventListener('click', addModalHorizontalLink);
        }
        
        // Initialize alignment and spacing change handlers
        const alignmentSelect = document.getElementById('element-horizontal-alignment');
        const spacingSelect = document.getElementById('element-horizontal-spacing');
        
        if (alignmentSelect) {
            alignmentSelect.addEventListener('change', updateModalHorizontalLinksSettings);
        }
        if (spacingSelect) {
            spacingSelect.addEventListener('change', updateModalHorizontalLinksSettings);
        }
    }
    
    // ADD THIS: Initialize color pickers for ALL element types
    if (typeof initializeCustomPageElementColorPickers === 'function') {
        initializeCustomPageElementColorPickers();
    }
}

// Render the pages list
function renderPagesList() {
    const pagesList = document.getElementById('pages-list');
    if (!pagesList) return;
    
    if (!infoData.customPages || infoData.customPages.length === 0) {
        pagesList.innerHTML = '<div class="empty-state">No custom pages created yet</div>';
        return;
    }
    
    let html = '';
    infoData.customPages.forEach((page, index) => {
        const template = window.customPageTemplates?.getTemplate(page.template);
        const templateName = template ? template.name : 'Unknown Template';
        const elementCount = page.elements ? page.elements.length : 0;
        
        // Replace the existing page-item HTML with this:
        html += `
            <div class="page-item">
                <i class="fas fa-file-alt page-item-icon"></i>
                <div class="page-item-info">
                    <div class="page-item-header">
                        <div class="page-item-name">${escapeHtml(page.displayName || page.name)}</div>
                        <div class="page-item-details">${templateName} • ${elementCount} elements</div>
                    </div>
                    ${page.description ? `<div class="page-item-description">${escapeHtml(page.description)}</div>` : ''}
                </div>
                <div class="page-item-actions">
                    <button class="btn-icon btn-edit" onclick="editPage(${index})" title="Edit Page">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deletePage(${index})" title="Delete Page">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
    });
    
    pagesList.innerHTML = html;
}

// Open create page modal
function openCreatePageModal() {
    // Check if project is saved
    if (!currentProject) {
        if (typeof showStatus === 'function') {
            showStatus('error', 'Please save your project first to create custom pages');
        } else {
            alert('Please save your project first to create custom pages');
        }
        return;
    }
    
    const modal = document.getElementById('create-page-modal');
    if (!modal) return;
    
    // Reset form
    document.getElementById('page-name').value = '';
    document.getElementById('page-display-name').value = '';
    
    // Auto-set template to universal and hide template selection
    const templateSelect = document.getElementById('page-template');
    if (templateSelect) {
        templateSelect.value = 'universal';
        templateSelect.style.display = 'none';
        // Hide the template label too
        const templateLabel = templateSelect.previousElementSibling;
        if (templateLabel && templateLabel.tagName === 'LABEL') {
            templateLabel.style.display = 'none';
        }
    }
    
    // Hide template preview
    const previewDiv = document.getElementById('template-preview');
    if (previewDiv) {
        previewDiv.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

// Close create page modal
function closeCreatePageModal() {
    const modal = document.getElementById('create-page-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Populate template dropdown
function populateTemplateOptions() {
    const templateSelect = document.getElementById('page-template');
    if (!templateSelect || !window.customPageTemplates) return;
    
    const templates = window.customPageTemplates.getTemplateOptions();
    let html = '<option value="">Select a template...</option>';
    
    templates.forEach(template => {
        html += `<option value="${template.value}">${template.label}</option>`;
    });
    
    templateSelect.innerHTML = html;
}

// Handle template selection change
function onTemplateSelectionChange() {
    const templateSelect = document.getElementById('page-template');
    const previewDiv = document.getElementById('template-preview');
    
    if (!templateSelect || !previewDiv || !window.customPageTemplates) return;
    
    const templateId = templateSelect.value;
    if (!templateId) {
        previewDiv.innerHTML = '';
        return;
    }
    
    const template = window.customPageTemplates.getTemplate(templateId);
    if (!template) return;
    
    // Show template description and available elements
    let html = `<div class="template-description">${template.description}</div>`;
    html += '<div class="template-elements"><strong>Available Elements:</strong><ul>';
    
    template.availableElements.forEach(element => {
        const limit = element.max === -1 ? 'Unlimited' : element.max;
        html += `<li><strong>${element.name}</strong> (${limit}) - ${element.description}</li>`;
    });
    
    html += '</ul></div>';
    previewDiv.innerHTML = html;
}

// Validate page name
function validatePageName() {
    const nameInput = document.getElementById('page-name');
    const confirmBtn = document.getElementById('confirm-create-page');
    
    if (!nameInput || !confirmBtn) return;
    
    const name = nameInput.value.trim();
    const isValid = /^[a-z0-9-]+$/.test(name) && name.length > 0;
    
    // Check for duplicate names
    const isDuplicate = infoData.customPages.some(page => page.name === name);
    
    // Remove template validation since we auto-set it
    confirmBtn.disabled = !isValid || isDuplicate;
    
    // Update display name automatically if empty
    const displayNameInput = document.getElementById('page-display-name');
    if (displayNameInput && !displayNameInput.value.trim() && name) {
        displayNameInput.value = name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Create new page
function createPage() {
    const nameInput = document.getElementById('page-name');
    const displayNameInput = document.getElementById('page-display-name');
    
    if (!nameInput || !displayNameInput) return;
    
    const name = nameInput.value.trim();
    const displayName = displayNameInput.value.trim();
    const templateId = 'universal'; // Always use universal template
    
    if (!name || !displayName) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate name format
    if (!/^[a-z0-9-]+$/.test(name)) {
        alert('Page name must contain only lowercase letters, numbers, and hyphens');
        return;
    }
    
    // Check for duplicates
    if (infoData.customPages.some(page => page.name === name)) {
        alert('A page with this name already exists');
        return;
    }
    
    // Create new page
    const newPage = {
        id: generateUniqueId(),
        name: name,
        displayName: displayName,
        template: templateId,
        elements: [],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };
    
    infoData.customPages.push(newPage);

    // Create folder structure for the new page
    if (currentProject && userSessionManager) {
        createCustomPageFolder(newPage.id, currentProject);
    }
    
    // Mark data as modified
    if (typeof dataModified !== 'undefined') {
        dataModified = true;
    }
    
    // Re-render list
    renderPagesList();
    
    // Close modal
    closeCreatePageModal();
    
    // Show success message
    if (typeof showStatus === 'function') {
        showStatus('success', `Page "${displayName}" created successfully`);
    }
}

// Generate unique ID for pages
function generateUniqueId() {
    return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Edit page
function editPage(index) {
    if (index < 0 || index >= infoData.customPages.length) return;
    
    editingPageIndex = index;
    const page = infoData.customPages[index];
    
    // Populate edit modal
    document.getElementById('edit-page-title').textContent = `Edit: ${page.displayName}`;
    document.getElementById('edit-page-display-name').value = page.displayName;

    const descriptionInput = document.getElementById('edit-page-description');
    if (descriptionInput) {
        descriptionInput.value = page.description || '';
    }
    
    // Always use universal template now
    populateElementTypeOptions('universal');
    
    // Render current elements
    renderPageElements(page);
    
    // Show modal
    document.getElementById('edit-page-modal').style.display = 'block';
}

// Delete page
function deletePage(index) {
    if (index < 0 || index >= infoData.customPages.length) return;
    
    const page = infoData.customPages[index];
    
    if (confirm(`Are you sure you want to delete the page "${page.displayName}"?`)) {
        infoData.customPages.splice(index, 1);
        
        // Mark data as modified
        if (typeof dataModified !== 'undefined') {
            dataModified = true;
        }
        
        renderPagesList();
        
        if (typeof showStatus === 'function') {
            showStatus('success', 'Page deleted successfully');
        }
    }
}

// Populate element type options for editing
function populateElementTypeOptions(templateId) {
    const elementSelect = document.getElementById('element-type-select');
    if (!elementSelect || !window.customPageTemplates) return;
    
    // Always use universal template now
    const template = window.customPageTemplates.getTemplate('universal');
    if (!template) return;
    
    let html = '<option value="">Choose element to add...</option>';
    
    template.availableElements.forEach(element => {
        html += `<option value="${element.type}">${element.name}</option>`;
    });
    
    elementSelect.innerHTML = html;
}

// Handle element type selection change
function onElementTypeChange() {
    const elementSelect = document.getElementById('element-type-select');
    const addBtn = document.getElementById('add-element-btn');
    
    if (!elementSelect || !addBtn) return;
    
    const selectedType = elementSelect.value;
    const page = infoData.customPages[editingPageIndex];
    
    if (!selectedType || !page) {
        addBtn.disabled = true;
        return;
    }
    
    // Check if element can be added (always use universal template)
    const canAdd = window.customPageTemplates?.canAddElement(
        'universal', 
        selectedType, 
        page.elements || []
    );
    
    addBtn.disabled = !canAdd;
    
    // Update element count display
    updateElementCountDisplay();
}

// Update element count display
function updateElementCountDisplay() {
    const countSpan = document.getElementById('element-count');
    if (!countSpan || editingPageIndex < 0) return;
    
    const page = infoData.customPages[editingPageIndex];
    const template = window.customPageTemplates?.getTemplate(page.template);
    
    if (!template) return;
    
    const currentCount = page.elements ? page.elements.length : 0;
    countSpan.textContent = `${currentCount}/${template.maxElements} elements`;
}

// Add element to page
function addElementToPage() {
    const elementSelect = document.getElementById('element-type-select');
    if (!elementSelect || editingPageIndex < 0) return;
    
    const elementType = elementSelect.value;
    const page = infoData.customPages[editingPageIndex];
    
    if (!elementType || !page) return;
    
    // Create new element
    const newElement = {
        id: generateUniqueId(),
        type: elementType,
        order: (page.elements?.length || 0),
        content: '',
        created: new Date().toISOString()
    };
    
    // Add type-specific properties
    if (elementType === 'image-set') {
        newElement.images = ['', '', ''];
    } else if (elementType === 'single-image') {
        newElement.image = '';
        newElement.alignment = 'center';
    } else if (elementType === 'gallery') {
        newElement.images = [];
        newElement.columns = 5;
        newElement.alignment = 'center';
    } else if (elementType.includes('image-text')) {
        newElement.image = '';
    }
    
    if (!page.elements) {
        page.elements = [];
    }
    page.elements.push(newElement);
    
    // Mark as modified
    page.modified = new Date().toISOString();
    if (typeof dataModified !== 'undefined') {
        dataModified = true;
    }
    
    // Reset dropdown
    elementSelect.value = '';
    
    // Re-render elements
    renderPageElements(page);
    
    // Update controls
    onElementTypeChange();
}

// Render page elements for editing
function renderPageElements(page) {
    const elementsList = document.getElementById('page-elements-list');
    if (!elementsList) return;
    
    if (!page.elements || page.elements.length === 0) {
        elementsList.innerHTML = '<div class="empty-state">No elements added yet</div>';
        return;
    }
    
    // Sort elements by order
    const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
    
    let html = '';
    sortedElements.forEach((element, index) => {
        const preview = getElementPreview(element);
        
        html += `
            <div class="page-element-item" draggable="true" data-element-index="${index}">
                <i class="fas fa-grip-vertical page-element-grip"></i>
                <span class="page-element-type">${getElementTypeName(element.type)}</span>
                <span class="page-element-preview">${preview}</span>
                <div class="page-element-actions">
                    <button class="btn-icon btn-edit" onclick="editPageElement(${index})" title="Edit Element">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deletePageElement(${index})" title="Delete Element">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
    });
    
    elementsList.innerHTML = html;
    
    // Initialize drag and drop for elements
    initializeElementDragAndDrop();
    
    // Update element count
    updateElementCountDisplay();
}

// Get element type display name
function getElementTypeName(type) {
    const typeNames = {
        'title': 'Page Title',
        'single-image': 'Single Image',
        'image-set': 'Image Set',
        'gallery': 'Image Gallery',
        'paragraph': 'Paragraph',
        'subcontainer': 'Subcontainer',
        'image-text-right': 'Image/Text (Right)',
        'image-text-left': 'Image/Text (Left)'
    };
    
    return typeNames[type] || type;
}

// Get element preview text
function getElementPreview(element) {
    if (element.content && element.content.trim()) {
        const preview = element.content.trim();
        return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
    }

    if (element.type === 'single-image') {
        return element.image && element.image.trim() ? 'Has image' : 'No image';
    }

    if (element.type === 'image-set') {
        const imageCount = element.images ? element.images.filter(img => img && img.trim()).length : 0;
        return imageCount > 0 ? `${imageCount} image(s)` : 'No images';
    }

    if (element.type === 'gallery') {
        const imageCount = element.images ? element.images.filter(img => img && img.trim()).length : 0;
        return imageCount > 0 ? `${imageCount} images (${element.columns || 5} cols)` : 'No images';
    }
    
    return 'Empty';
}

// Initialize drag and drop for page elements
function initializeElementDragAndDrop() {
    const elementItems = document.querySelectorAll('.page-element-item');
    
    elementItems.forEach(item => {
        item.addEventListener('dragstart', handleElementDragStart);
        item.addEventListener('dragover', handleElementDragOver);
        item.addEventListener('drop', handleElementDrop);
        item.addEventListener('dragend', handleElementDragEnd);
    });
}

// Drag and drop handlers for elements
function handleElementDragStart(e) {
    customPagesDraggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleElementDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    this.classList.add('drag-over');
    return false;
}

function handleElementDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    
    if (customPagesDraggedElement !== this) {
        const draggedIndex = parseInt(customPagesDraggedElement.dataset.elementIndex);
        const targetIndex = parseInt(this.dataset.elementIndex);
        
        reorderPageElements(draggedIndex, targetIndex);
    }
    
    this.classList.remove('drag-over');
    return false;
}

function handleElementDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.page-element-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    customPagesDraggedElement = null;
}

// Reorder page elements
function reorderPageElements(draggedIndex, targetIndex) {
    if (editingPageIndex < 0) return;
    
    const page = infoData.customPages[editingPageIndex];
    if (!page.elements) return;
    
    const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
    const draggedElement = sortedElements[draggedIndex];
    
    // Remove dragged element and insert at new position
    sortedElements.splice(draggedIndex, 1);
    sortedElements.splice(targetIndex, 0, draggedElement);
    
    // Update order values
    sortedElements.forEach((element, index) => {
        element.order = index;
    });
    
    // Mark as modified
    page.modified = new Date().toISOString();
    if (typeof dataModified !== 'undefined') {
        dataModified = true;
    }
    
    // Re-render
    renderPageElements(page);
}

// Edit page element
function editPageElement(index) {
    if (editingPageIndex < 0) return;
    
    const page = infoData.customPages[editingPageIndex];
    const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
    const element = sortedElements[index];
    
    if (!element) return;
    
    // Set the editing element index
    editingElementIndex = index;
    
    // Open the element edit modal
    openElementEditModal(element);
}

// Delete page element
function deletePageElement(index) {
    if (editingPageIndex < 0) return;
    
    const page = infoData.customPages[editingPageIndex];
    const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
    const element = sortedElements[index];
    
    if (!element) return;
    
    if (confirm(`Delete this ${getElementTypeName(element.type)}?`)) {
        // Find the element in the original array and remove it
        const elementIndex = page.elements.findIndex(el => el.id === element.id);
        if (elementIndex >= 0) {
            page.elements.splice(elementIndex, 1);
            
            // Reorder remaining elements
            page.elements.forEach((el, idx) => {
                el.order = idx;
            });
            
            page.modified = new Date().toISOString();
            if (typeof dataModified !== 'undefined') {
                dataModified = true;
            }
            
            renderPageElements(page);
            onElementTypeChange(); // Update add button state
        }
    }
}

// Close edit page modal
function closeEditPageModal() {
    const modal = document.getElementById('edit-page-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingPageIndex = -1;
}

// Save page changes
function savePageChanges() {
    if (editingPageIndex < 0) return;
    
    const page = infoData.customPages[editingPageIndex];
    const displayNameInput = document.getElementById('edit-page-display-name');

    const descriptionInput = document.getElementById('edit-page-description');
    if (descriptionInput) {
        page.description = descriptionInput.value.trim();
    }
    
    if (displayNameInput) {
        page.displayName = displayNameInput.value.trim();
    }
    
    page.modified = new Date().toISOString();
    
    // Mark data as modified
    if (typeof dataModified !== 'undefined') {
        dataModified = true;
    }
    
    // Re-render pages list
    renderPagesList();
    
    // Close modal
    closeEditPageModal();
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Page updated successfully');
    }
}

// Create folder structure for custom page
async function createCustomPageFolder(pageId, projectName) {
    try {
        const userContext = userSessionManager.getUserContext();
        const folderPath = `pages/${pageId}`;
        
        const response = await fetch('/api/assets/create-folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                projectName, 
                folderPath,
                userContext 
            })
        });
        
        const result = await response.json();
        if (!result.success) {
            console.warn('Failed to create custom page folder:', result.error);
        }
    } catch (error) {
        console.warn('Error creating custom page folder:', error);
    }
}

// Get current page ID for image import context
window.getCurrentCustomPageId = function() {
    if (editingPageIndex >= 0 && infoData.customPages[editingPageIndex]) {
        return infoData.customPages[editingPageIndex].id;
    }
    return null;
}

// Make functions globally available
window.editPage = editPage;
window.deletePage = deletePage;
window.editPageElement = editPageElement;
window.deletePageElement = deletePageElement;