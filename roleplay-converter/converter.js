// Global variables
let parsedEntries = [];
let savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');

// Default colors for new characters
const defaultColors = ['#0366d6', '#d63603', '#2e7d32', '#9c27b0', '#ff5722', '#607d8b'];

// Drag and Drop functionality
let draggedElement = null;

function addDragListeners(element, container) {
    element.addEventListener('dragstart', function(e) {
        draggedElement = this;
        this.classList.add('dragging');
        container.classList.add('dragging');
        
        // Set drag effect
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    });

    element.addEventListener('dragend', function(e) {
        this.classList.remove('dragging');
        container.classList.remove('dragging');
        
        // Remove drag over indicators from all elements
        const allItems = container.querySelectorAll('.track-entry, .track-heading, .image-entry, .comment-entry, .comment-heading');
        allItems.forEach(item => item.classList.remove('drag-over'));
        
        draggedElement = null;
    });

    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Remove drag-over class from all siblings
        const siblings = container.querySelectorAll('.track-entry, .track-heading, .image-entry, .comment-entry, .comment-heading');
        siblings.forEach(sibling => sibling.classList.remove('drag-over'));

        // Add drag-over class to current element if it's not the dragged element
        if (this !== draggedElement) {
            this.classList.add('drag-over');
        }
    });

    element.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (this !== draggedElement && draggedElement) {
            // Determine if we should insert before or after
            const rect = this.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (e.clientY < midpoint) {
                // Insert before this element
                container.insertBefore(draggedElement, this);
            } else {
                // Insert after this element
                container.insertBefore(draggedElement, this.nextSibling);
            }
        }
        
        // Clean up
        this.classList.remove('drag-over');
    });

    // Handle dragging over the container itself (for empty areas)
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        
        // Only append if dropping in empty space
        if (e.target === container && draggedElement) {
            container.appendChild(draggedElement);
        }
    });
}

// Function to add a track entry
function addTrack(name = '', link = '') {
    const soundtrackContainer = document.getElementById('soundtrack-container');
    const trackEntry = document.createElement('div');
    trackEntry.className = 'track-entry';
    trackEntry.draggable = true;
    trackEntry.innerHTML = `
        <div style="display: flex; gap: 4px; margin-bottom: 0px; align-items: center; width: 100%;">
            <input type="text" class="track-name" placeholder="Track name" value="${name}" style="flex: 2;">
            <input type="text" class="track-link" placeholder="https://youtube.com/..." value="${link}" style="flex: 4;">
            <span class="remove-track fake-btn-remove" title="Remove track">×</span>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = trackEntry.querySelector('.remove-track');
    removeBtn.addEventListener('click', function() {
        trackEntry.remove();
    });
    
    // Add drag and drop event listeners
    addDragListeners(trackEntry, soundtrackContainer);
    
    soundtrackContainer.appendChild(trackEntry);
}

// Function to add a track heading
function addTrackHeading(title = '') {
    const soundtrackContainer = document.getElementById('soundtrack-container');
    const headingEntry = document.createElement('div');
    headingEntry.className = 'track-heading';
    headingEntry.draggable = true;
    headingEntry.innerHTML = `
        <div style="display: flex; gap: 4px; margin-bottom: 0px; align-items: center; background-color: var(--bg-tertiary); padding: 6px; border-radius: 6px; width: 100%;">
            <input type="text" class="track-heading-title" placeholder="Section title" value="${title}" style="flex: 2;">
            <span class="remove-heading fake-btn-remove" title="Remove heading">×</span>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = headingEntry.querySelector('.remove-heading');
    removeBtn.addEventListener('click', function() {
        headingEntry.remove();
    });
    
    // Add drag and drop event listeners
    addDragListeners(headingEntry, soundtrackContainer);
    
    soundtrackContainer.appendChild(headingEntry);
}

// Function to add a comment entry
function addComment(text = '') {
    const commentsContainer = document.getElementById('comments-container');
    const commentEntry = document.createElement('div');
    commentEntry.className = 'comment-entry';
    commentEntry.draggable = true;
    commentEntry.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 0px; padding-bottom:0px; width: 100%;">
            <div style="display: flex; gap: 4px; align-items: flex-start; width: 100%;">
                <textarea class="comment-text" placeholder="comment: Your comment text here..." style="flex: 1; min-height: 80px; resize: vertical; width: 100%;">${text}</textarea>
                <span class="remove-comment fake-btn-remove" style="margin-top: 0; flex-shrink: 0;" title="Remove comment">×</span>
            </div>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = commentEntry.querySelector('.remove-comment');
    removeBtn.addEventListener('click', function() {
        commentEntry.remove();
    });
    
    // Add drag and drop event listeners
    addDragListeners(commentEntry, commentsContainer);
    
    commentsContainer.appendChild(commentEntry);
}

// Function to add a comment heading
function addCommentHeading(title = '') {
    const commentsContainer = document.getElementById('comments-container');
    const headingEntry = document.createElement('div');
    headingEntry.className = 'comment-heading';
    headingEntry.draggable = true;
    headingEntry.innerHTML = `
        <div style="display: flex; gap: 4px; margin-bottom: 0px; align-items: center; background-color: var(--bg-tertiary); padding: 6px; border-radius: 6px; width: 100%;">
            <input type="text" class="comment-heading-title" placeholder="Section title" value="${title}" style="flex: 2;">
            <span class="remove-comment-heading fake-btn-remove" title="Remove heading">×</span>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeBtn = headingEntry.querySelector('.remove-comment-heading');
    removeBtn.addEventListener('click', function() {
        headingEntry.remove();
    });
    
    // Add drag and drop event listeners
    addDragListeners(headingEntry, commentsContainer);
    
    commentsContainer.appendChild(headingEntry);
}

// Function to generate soundtrack HTML
function generateSoundtrackHTML() {
    const trackEntries = document.querySelectorAll('.track-entry, .track-heading');
    if (trackEntries.length === 0) {
        return '';
    }
    
    let soundtrackHTML = '';
    let currentSection = null;
    let hasTracks = false;
    
    trackEntries.forEach((entry, index) => {
        if (entry.classList.contains('track-heading')) {
            // If we have an open section, close it
            if (currentSection) {
                soundtrackHTML += '\n            </div>';
            }
            
            // Get heading title
            const title = entry.querySelector('.track-heading-title').value.trim();
            if (title) {
                // Start a new section
                soundtrackHTML += `\n            <div class="soundtrack-section">
                <div class="soundtrack-section-title">${title}</div>`;
                currentSection = title;
            } else {
                currentSection = null;
            }
        } else if (entry.classList.contains('track-entry')) {
            // If we don't have an open section and this is the first track, create a default section
            if (!currentSection && !hasTracks) {
                soundtrackHTML += `\n            <div class="soundtrack-section">
                <div class="soundtrack-section-title">Tracks</div>`;
                currentSection = 'Tracks';
            }
            
            // Get track info
            const name = entry.querySelector('.track-name').value.trim();
            const link = entry.querySelector('.track-link').value.trim();
            
            if (name && link) {
                soundtrackHTML += `\n                <div class="soundtrack-track">
                    <a href="${link}" target="_blank">${name}</a>
                </div>`;
                hasTracks = true;
            }
        }
    });
    
    // Close the last section if open
    if (currentSection) {
        soundtrackHTML += '\n            </div>';
    }
    
    return soundtrackHTML;
}

// Function to generate comments HTML
// REPLACE the generateCommentsHTML() function in converter.js with this fixed version:

function generateCommentsHTML() {
    const commentEntries = document.querySelectorAll('.comment-entry, .comment-heading');
    if (commentEntries.length === 0) {
        return '';
    }
    
    console.log('Generating comments HTML for', commentEntries.length, 'entries');
    
    let commentsHTML = '';
    let currentSection = null;
    let hasComments = false;
    
    commentEntries.forEach((entry, index) => {
        console.log(`Processing entry ${index}:`, entry.className);
        
        if (entry.classList.contains('comment-heading')) {
            // If we have an open section, close it
            if (currentSection) {
                commentsHTML += '\n            </div>';
            }
            
            // Get heading title
            const title = entry.querySelector('.comment-heading-title').value.trim();
            console.log('Found comment heading:', title);
            
            if (title) {
                // Start a new section
                commentsHTML += `\n            <div class="comments-section">
                <div class="comments-section-title">${title}</div>`;
                currentSection = title;
            } else {
                currentSection = null;
            }
        } else if (entry.classList.contains('comment-entry')) {
            // If we don't have an open section and this is the first comment, create a default section
            if (!currentSection && !hasComments) {
                commentsHTML += `\n            <div class="comments-section">
                <div class="comments-section-title">Comments</div>`;
                currentSection = 'Comments';
            }
            
            // Get comment text
            const commentTextArea = entry.querySelector('.comment-text');
            const commentText = commentTextArea ? commentTextArea.value.trim() : '';
            
            console.log('Found comment entry with text:', commentText);
            
            if (commentText) {
                // Parse the comment format and create separate blocks for each "comment:" entry
                const lines = commentText.split('\n');
                let currentComment = '';
                
                console.log('Processing comment lines:', lines.length);
                
                for (let line of lines) {
                    line = line.trim();
                    if (line.toLowerCase().startsWith('comment:')) {
                        console.log('Found comment: prefix in line:', line);
                        
                        // If we have a previous comment, process it first
                        if (currentComment.trim()) {
                            const parsedComment = parseMarkdown(currentComment.trim());
                            console.log('Creating comment block for:', currentComment.trim());
                            commentsHTML += `\n                <div class="comment-block">
                    ${parsedComment}
                </div>`;
                            hasComments = true;
                        }
                        
                        // Start a new comment, removing the "comment:" prefix
                        currentComment = line.substring(8).trim();
                        if (currentComment) {
                            currentComment += '\n';
                        }
                    } else if (currentComment !== '') {
                        // Continue multiline comment only if we have started a comment
                        currentComment += line + '\n';
                    } else if (line.toLowerCase().includes('comment:')) {
                        // Handle cases where comment: might not be at the start
                        const commentIndex = line.toLowerCase().indexOf('comment:');
                        currentComment = line.substring(commentIndex + 8).trim() + '\n';
                        console.log('Found comment: in middle of line, extracted:', currentComment);
                    }
                }
                
                // Process the final comment if there is one
                if (currentComment.trim()) {
                    const parsedComment = parseMarkdown(currentComment.trim());
                    console.log('Creating final comment block for:', currentComment.trim());
                    commentsHTML += `\n                <div class="comment-block">
                    ${parsedComment}
                </div>`;
                    hasComments = true;
                }
            } else {
                console.log('Comment entry found but no text content');
            }
        }
    });
    
    // Close the last section if open
    if (currentSection) {
        commentsHTML += '\n            </div>';
    }
    
    console.log('Final comments HTML:', commentsHTML);
    console.log('Has comments:', hasComments);
    
    return commentsHTML;
}