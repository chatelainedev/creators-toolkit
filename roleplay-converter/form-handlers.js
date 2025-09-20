// Add this function to form-handlers.js to properly collect all image data
function getCompleteImageData() {
    const backgroundContainer = document.getElementById('background-image-display');
    const storyContainer = document.getElementById('images-container');
    
    // Get background - could be a file or existing image path
    const backgroundItem = backgroundContainer.querySelector('.file-item');
    const background = {
        file: backgroundItem?._file || null,
        path: backgroundItem?._imagePath || null,
        exists: backgroundItem?._exists || false
    };
    
    // Get all story items (both files and existing paths)
    const storyItems = Array.from(storyContainer.querySelectorAll('.file-item'));
    const storyData = storyItems.map(item => ({
        file: item._file || null,
        path: item._imagePath || null,
        exists: item._exists || false,
        filename: item._file ? item._file.name : (item._imagePath ? item._imagePath.split('/').pop() : null)
    }));
    
    return {
        background,
        story: storyData,
        hasExistingImages: (background.path && background.exists) || storyData.some(item => item.path && item.exists),
        hasNewFiles: background.file || storyData.some(item => item.file)
    };
}

// Add this helper function to properly generate image HTML that preserves existing paths
function generateImageHTML(imageData) {
    let backgroundImageCSS = '';
    let storyImagesHTML = '';
    
    // Handle background image
    if (imageData.background.file) {
        // New file - use placeholder that will be replaced by server
        backgroundImageCSS = `background-image: url('BACKGROUND_IMAGE_PLACEHOLDER');`;
    } else if (imageData.background.path && imageData.background.exists) {
        // Existing image - use the actual path
        backgroundImageCSS = `background-image: url('${imageData.background.path}');`;
    }
    
    // Handle story images
    const allStoryImages = [];
    
    // First, add existing images that should be preserved
    imageData.story.forEach((item, index) => {
        if (item.path && item.exists) {
            allStoryImages.push({
                type: 'existing',
                path: item.path,
                index: index
            });
        } else if (item.file) {
            allStoryImages.push({
                type: 'new',
                file: item.file,
                index: index
            });
        }
    });
    
    // Generate HTML for all story images
    if (allStoryImages.length > 0) {
        storyImagesHTML = '<div class="story-images-gallery">';
        allStoryImages.forEach((img, index) => {
            if (img.type === 'existing') {
                storyImagesHTML += `<img src="${img.path}" alt="Story Image" class="story-image">`;
            } else {
                storyImagesHTML += `<img src="STORY_IMAGE_${index}_PLACEHOLDER" alt="Story Image" class="story-image">`;
            }
        });
        storyImagesHTML += '</div>';
    }
    
    return {
        backgroundImageCSS,
        storyImagesHTML,
        existingImagePaths: {
            background: imageData.background.path && imageData.background.exists ? imageData.background.path : null,
            story: imageData.story.filter(item => item.path && item.exists).map(item => item.path)
        }
    };
}

// Function to add a new character
function addCharacter(name = '', color = '') {
    const charactersContainer = document.getElementById('characters-container');
    const index = charactersContainer.children.length;
    
    // Get default color if not provided
    if (!color) {
        color = defaultColors[index % defaultColors.length];
    }
    
    const characterDiv = document.createElement('div');
    characterDiv.className = 'character-info';
    
    // Create the main character row
    const mainRow = document.createElement('div');
    mainRow.className = 'character-main-row';
    mainRow.innerHTML = `
        <div class="character-name-section">
            <label for="char-name-${index}">Character ${index + 1}:</label>
            <input type="text" id="char-name-${index}" class="char-name" placeholder="Enter character name (can be multiple words)" value="${name}">
        </div>
        <div class="character-color-section">
            <label for="char-color-${index}">Color:</label>
            <input type="color" id="char-color-${index}" class="char-color" value="${color}">
        </div>
    `;
    
    // Add remove button if not one of the first two characters
    if (index > 1) {
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-character-btn fake-btn-remove';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove character';
        removeBtn.addEventListener('click', function() {
            characterDiv.remove();
            updateCharacterLabels();
        });
        mainRow.appendChild(removeBtn);
    }
    
    characterDiv.appendChild(mainRow);
    
    // Add event listeners
    const nameInput = mainRow.querySelector('.char-name');
    
    const colorInput = mainRow.querySelector('.char-color');
    colorInput.addEventListener('change', function() {
        saveColor(this.value);
    });
    
    // Show saved colors palette if we have any
    if (savedColors.length > 0) {
        const savedColorsDiv = document.createElement('div');
        savedColorsDiv.className = 'saved-colors';
        
        savedColors.forEach(savedColor => {
            const colorButton = document.createElement('div');
            colorButton.className = 'saved-color';
            colorButton.style.backgroundColor = savedColor;
            colorButton.title = savedColor;
            colorButton.addEventListener('click', function() {
                colorInput.value = savedColor;
            });
            savedColorsDiv.appendChild(colorButton);
        });
        
        characterDiv.appendChild(savedColorsDiv);
    }
    
    charactersContainer.appendChild(characterDiv);
}

// Function to update character labels when characters are added/removed
function updateCharacterLabels() {
    const characterDivs = document.querySelectorAll('.character-info');
    characterDivs.forEach((div, index) => {
        const label = div.querySelector('label[for^="char-name-"]');
        label.textContent = `Character ${index + 1}:`;
        label.setAttribute('for', `char-name-${index}`);
        
        const input = div.querySelector('.char-name');
        input.id = `char-name-${index}`;
        
        const colorLabel = div.querySelector('label[for^="char-color-"]');
        colorLabel.setAttribute('for', `char-color-${index}`);
        
        const colorInput = div.querySelector('.char-color');
        colorInput.id = `char-color-${index}`;
    });
}

// Function to update pairing based on character names (FIXED: only first two characters)
function updatePairing() {
    // Don't update pairing if no characters mode is enabled
    const noCharacters = document.getElementById('no-characters').checked;
    if (noCharacters) {
        document.getElementById('pairing').value = '';
        return;
    }
    
    const characterNameInputs = document.querySelectorAll('.char-name');
    const names = Array.from(characterNameInputs)
        .map(input => input.value)
        .filter(name => name.trim() !== '');
    
    if (names.length > 0) {
        // Only use the first two characters for pairing
        const pairingNames = names.slice(0, 2);
        document.getElementById('pairing').value = pairingNames.join('/');
    }
}

// Function to save a color to localStorage
function saveColor(color) {
    if (!savedColors.includes(color)) {
        savedColors.push(color);
        if (savedColors.length > 12) {
            savedColors.shift(); // Remove oldest color if we have more than 12
        }
        localStorage.setItem('savedColors', JSON.stringify(savedColors));
    }
}

// Function to add a new navigation link
function addNavigation(label = '', url = '') {
    const navigationContainer = document.getElementById('navigation-container');
    const navEntry = document.createElement('div');
    navEntry.className = 'nav-entry';
    navEntry.innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
            <input type="text" class="nav-label" placeholder="Link text (e.g., Home)" value="${label}" style="flex: 1;">
            <input type="text" class="nav-url" placeholder="URL (e.g., ../index.html)" value="${url}" style="flex: 2;">
            <span class="remove-nav fake-btn-remove" title="Remove navigation link">×</span>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = navEntry.querySelector('.remove-nav');
    removeBtn.addEventListener('click', function() {
        navEntry.remove();
    });
    
    navigationContainer.appendChild(navEntry);
}

// Function to add a new part
function addPart(title = '') {
    const partsContainer = document.getElementById('parts-container');
    const partEntry = document.createElement('div');
    partEntry.className = 'part-entry';
    partEntry.innerHTML = `
        <input type="text" class="part-title" placeholder="Enter part title" value="${title}">
        <span class="remove-part fake-btn-remove" title="Remove part">×</span>
    `;
    
    // Add event listener to the remove button
    const removeBtn = partEntry.querySelector('.remove-part');
    removeBtn.addEventListener('click', function() {
        partEntry.remove();
    });
    
    partsContainer.appendChild(partEntry);
}

// Function to add an image file to display
function addImageFile(file, isBackground = false) {
    const container = isBackground ? 
        document.getElementById('background-image-display') : 
        document.getElementById('images-container');
    
    if (isBackground) {
        // Clear previous background image
        container.innerHTML = '';
        container.classList.add('has-file');
    }
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <button type="button" class="file-remove" title="Remove image">×</button>
    `;
    
    // Store file reference on the element
    fileItem._file = file;
    
    // Add remove functionality
    const removeBtn = fileItem.querySelector('.file-remove');
    removeBtn.addEventListener('click', function() {
        fileItem.remove();
        if (isBackground) {
            container.classList.remove('has-file');
            container.innerHTML = '<div class="file-display-empty">No background image selected</div>';
        }
        if (container.children.length === 0 && !isBackground) {
            container.innerHTML = '<div class="file-display-empty">No story images selected</div>';
        }
    });
    
    container.appendChild(fileItem);
    
    // Remove empty message if it exists
    const emptyMsg = container.querySelector('.file-display-empty');
    if (emptyMsg) {
        emptyMsg.remove();
    }
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Helper function to validate image file
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Please select a valid image file.`);
    }
    
    if (file.size > maxSize) {
        throw new Error(`File too large: ${formatFileSize(file.size)}. Maximum size is 5MB.`);
    }
    
    return true;
}

// Function to get all selected image files (updated for import support)
function getSelectedImageFiles() {
    const backgroundContainer = document.getElementById('background-image-display');
    const storyContainer = document.getElementById('images-container');
    const bannerContainer = document.getElementById('banner-image-display');
    
    // Get background
    const backgroundItem = backgroundContainer.querySelector('.file-item');
    const backgroundFile = backgroundItem?._file || null;
    const backgroundPath = backgroundItem?._imagePath || null;
    const backgroundExists = backgroundItem?._exists || false;
    
    // Get banner
    const bannerItem = bannerContainer.querySelector('.file-item');
    const bannerFile = bannerItem?._file || null;
    const bannerPath = bannerItem?._imagePath || null;
    const bannerExists = bannerItem?._exists || false;
    
    // Get story files/paths
    const storyItems = Array.from(storyContainer.querySelectorAll('.file-item'));
    const storyFiles = storyItems.map(item => item._file).filter(file => file);
    const storyPaths = storyItems
        .filter(item => item._imagePath && item._exists)
        .map(item => item._imagePath);
    
    return {
        backgroundFile,
        backgroundPath,
        backgroundExists,
        bannerFile,        // ADD this
        bannerPath,        // ADD this  
        bannerExists,      // ADD this
        storyFiles,
        storyPaths,
        hasExistingImages: (backgroundPath && backgroundExists) || 
                          (bannerPath && bannerExists) ||           // ADD this
                          storyPaths.length > 0
    };
}

// Function to update word count display
function updateWordCount() {
    const text = document.getElementById('rp-text').value;
    const wordCount = countWords(text);
    const pageCount = calculatePageCount(wordCount);
    
    document.getElementById('word-count').textContent = `Words: ${wordCount}`;
    document.getElementById('page-count').textContent = `Pages: ${pageCount}`;
}

// Function to toggle collapsible sections
function toggleCollapsible(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        icon.classList.remove('collapsed');
    } else {
        content.classList.add('collapsed');
        icon.classList.add('collapsed');
    }
}

// BANNER stuff
// Function to add a banner image file to display
function addBannerImageFile(file) {
    const container = document.getElementById('banner-image-display');
    
    // Clear previous banner image
    container.innerHTML = '';
    container.classList.add('has-file');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <button type="button" class="file-remove" title="Remove banner image">×</button>
    `;
    
    // Store file reference on the element
    fileItem._file = file;
    
    // Add remove functionality
    const removeBtn = fileItem.querySelector('.file-remove');
    removeBtn.addEventListener('click', function() {
        fileItem.remove();
        container.classList.remove('has-file');
        container.innerHTML = '<div class="file-display-empty">No banner image selected</div>';
    });
    
    container.appendChild(fileItem);
}

// Function to get selected banner image file
function getSelectedBannerImageFile() {
    const bannerContainer = document.getElementById('banner-image-display');
    const bannerItem = bannerContainer.querySelector('.file-item');
    
    return {
        bannerFile: bannerItem?._file || null,
        bannerPath: bannerItem?._imagePath || null,
        bannerExists: bannerItem?._exists || false
    };
}

// Function to display existing banner image placeholder (for import)
// Function to display existing banner image placeholder (for import)
function displayBannerImagePlaceholder(imagePath, exists) {
    const container = document.getElementById('banner-image-display');
    
    // Clear container
    container.innerHTML = '';
    
    // Add safety check for imagePath
    if (imagePath && typeof imagePath === 'string') {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item' + (exists ? '' : ' missing-file');
        
        const filename = imagePath.split('/').pop();
        const statusText = exists ? 'Existing file' : 'Missing file - will be removed on save';
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${filename}</div>
                <div class="file-size">${statusText}</div>
            </div>
            <button type="button" class="file-remove" title="Remove banner image">×</button>
        `;
        
        // Store image path info on the element
        fileItem._imagePath = imagePath;
        fileItem._exists = exists;
        
        // Add remove functionality
        const removeBtn = fileItem.querySelector('.file-remove');
        removeBtn.addEventListener('click', function() {
            fileItem.remove();
            container.classList.remove('has-file');
            container.innerHTML = '<div class="file-display-empty">No banner image selected</div>';
        });
        
        container.appendChild(fileItem);
        if (exists) {
            container.classList.add('has-file');
        }
    } else {
        // Handle null, undefined, or non-string imagePath
        console.log('Banner imagePath is invalid:', imagePath, typeof imagePath);
        container.innerHTML = '<div class="file-display-empty">No banner image selected</div>';
    }
}