// Notebook JavaScript - FIXED VERSION that actually works

class NotebookManager {
    constructor() {
        this.currentNote = {
            id: null,
            name: 'Untitled Note',
            content: '',
            collection: '',
            created: null,
            lastModified: null
        };
        this.currentNotebookId = 'default';  // ADD THIS
        this.workspaceManager = null; 
        this.savedNotes = [];
        this.snippets = [];
        this.collectionsArray = ['default']; 
        this.collectionsManager = null; 
        this.isPreviewMode = false;
        this.isDirty = false;
        this.autoSaveTimer = null;
        this.wordCountTimer = null;
        
        this.initializeNotebook();
    }

    // Initialize Notebook functionality
    async initializeNotebook() {
        this.setupEventListeners();
        this.setupAutoSave();
        this.setupWordCounter();
        this.setupContextMenuIntegration(); // CRITICAL: This was missing

        // Initialize collections manager - FIXED: No CollectionsUIManager
        if (window.CollectionsManager) {
            this.collectionsManager = new CollectionsManager(this);
        }

        // Initialize export manager
        this.exportManager = new NotebookExportManager(this);

        // Initialize note linking
        if (window.NoteLinkingManager) {
            this.noteLinking = new NoteLinkingManager(this);
        }

        // Link with workspace manager
        if (window.notebookWorkspaceManager) {
            this.workspaceManager = window.notebookWorkspaceManager;
            this.workspaceManager.setNotebookManager(this);
            this.currentNotebookId = this.workspaceManager.currentNotebookId;
            
            // If workspace manager hasn't finished loading notebooks yet, wait for it
            if (!this.workspaceManager.isInitialized) {
                // Don't load user data yet - workspace manager will trigger it when ready
                return;
            }
        }

        await this.loadUserData();        
        console.log('📒 Notebook initialized and WORKING');
    }

    // Setup event listeners
    setupEventListeners() {
        // Sidebar buttons
        document.getElementById('new-note-btn')?.addEventListener('click', () => {
            this.createNewNote();
        });

        document.getElementById('save-note-btn')?.addEventListener('click', () => {
            this.saveCurrentNote();
        });

        document.getElementById('snippets-btn')?.addEventListener('click', () => {
            this.openSnippetBrowser();
        });

        document.getElementById('link-notes-btn')?.addEventListener('click', () => {
            this.showNoteLinkHelper();
        });

        // Note title input
        const titleInput = document.getElementById('note-title-input');
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                this.currentNote.name = titleInput.value || 'Untitled Note';
                this.onContentChange();
            });
        }

        // THE ACTUAL TEXT EDITOR - Use textarea, not contentEditable
        const textarea = this.getTextEditor();
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.onContentChange();
            });

            // Handle tab key for indentation
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.insertText('    '); // 4 spaces
                }
            });
        }

        // Formatting toolbar
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                if (format) {
                    this.applyFormatting(format);
                }
            });
        });

        // Preview toggle
        document.getElementById('toggle-preview')?.addEventListener('click', () => {
            this.togglePreview();
        });

        // Double-click preview to return to edit mode
        document.addEventListener('dblclick', (e) => {
            if (this.isPreviewMode && e.target.closest('#preview-content')) {
                this.togglePreview();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('notes-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Snippets panel
        document.getElementById('close-snippets-btn')?.addEventListener('click', () => {
            this.closeSnippetsPanel();
        });

        // Close snippets panel when clicking outside
        this.snippetsPanelClickHandler = (e) => {
            if (e.target.closest('.modal-overlay')) {
                return;
            }
            
            const snippetsPanel = document.querySelector('.snippets-panel');
            const snippetsBtn = document.getElementById('snippets-btn');
            
            if (snippetsPanel && snippetsPanel.classList.contains('open')) {
                if (!snippetsPanel.contains(e.target) && !snippetsBtn.contains(e.target)) {
                    this.closeSnippetsPanel();
                }
            }
        };

        // Remove old listener if exists
        if (this._snippetsPanelListenerAttached) {
            document.removeEventListener('click', this.snippetsPanelClickHandler);
        }

        document.addEventListener('click', this.snippetsPanelClickHandler);
        this._snippetsPanelListenerAttached = true;

        // Snippets search
        const snippetsSearchInput = document.getElementById('snippets-search');
        if (snippetsSearchInput) {
            snippetsSearchInput.addEventListener('input', (e) => {
                this.filterSnippets(e.target.value);
            });
        }

        // Clear tag filter button
        document.getElementById('clear-tag-filter')?.addEventListener('click', () => {
            this.clearTagFilter();
        });

    }

    // Get the actual text editor element
    getTextEditor() {
        // Try the new editor first, fall back to old one
        return document.getElementById('markdown-editor') || 
               document.getElementById('notebook-textarea') ||
               document.querySelector('.editor-content[contenteditable]') ||
               document.querySelector('textarea[placeholder*="Start writing"]');
    }

    setupContextMenuIntegration() {
        // Store handlers so we can remove them later
        this.contextMenuHandler = (e) => {
            const isCoWriterText = e.target.closest('#chat-messages .message-text') ||
                                e.target.closest('.cowriter-content .message-text') ||
                                e.target.closest('#cowriter-content .message-text');
            
            const isNotebookText = e.target.closest('#markdown-editor') ||
                                e.target.closest('#notebook-textarea') ||
                                e.target.closest('.editor-content');
            
            if (isCoWriterText || isNotebookText) {
                const selection = window.getSelection().toString().trim();
                
                if (selection.length > 5) {
                    e.preventDefault();
                    // Pass the context to the menu function
                    const context = isCoWriterText ? 'cowriter' : 'notebook';
                    this.showSnippetContextMenu(e, selection, context);
                }
            }
        };
        
        this.clickOutsideHandler = (e) => {
            const contextMenu = document.getElementById('notebook-context-menu');
            if (contextMenu && !contextMenu.contains(e.target)) {
                this.hideSnippetContextMenu();
            }
        };
        
        // Remove old listeners if they exist
        if (this._listenersAttached) {
            document.removeEventListener('contextmenu', this.contextMenuHandler);
            document.removeEventListener('click', this.clickOutsideHandler);
        }
        
        document.addEventListener('contextmenu', this.contextMenuHandler);
        document.addEventListener('click', this.clickOutsideHandler);
        this._listenersAttached = true;
    }

    // Show snippet context menu - MODIFIED to show different options based on context
    showSnippetContextMenu(event, selectedText, context = 'notebook') {
        this.hideSnippetContextMenu(); // Remove any existing menu
        
        const menu = document.createElement('div');
        menu.id = 'notebook-context-menu';
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            background: var(--bg-secondary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            padding: var(--space-xs) 0;
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            min-width: 180px;
            backdrop-filter: blur(10px);
            display: block;
        `;
        
        // Build menu items based on context
        let menuItems = '';
        
        // Show "Create Snippet" only in CoWriter
        if (context === 'cowriter') {
            menuItems += `
                <div class="context-menu-item primary" data-action="create-snippet" style="padding: var(--space-sm) var(--space-md); cursor: pointer; font-size: var(--font-size-xs); color: var(--text-secondary); display: flex; align-items: center; gap: var(--space-sm); transition: all var(--transition-fast);">
                    <i class="fas fa-magic"></i> Create Snippet
                </div>
            `;
        }
        
        // Show "Send to CoWriter" only in Notebook
        if (context === 'notebook') {
            menuItems += `
                <div class="context-menu-item" data-action="send-to-cowriter" style="padding: var(--space-sm) var(--space-md); cursor: pointer; font-size: var(--font-size-xs); color: var(--text-secondary); display: flex; align-items: center; gap: var(--space-sm); transition: all var(--transition-fast);">
                    <i class="fas fa-paper-plane"></i> Send to CoWriter
                </div>
            `;
        }
        
        // Copy option always available
        menuItems += `
            <div class="context-menu-item" data-action="copy" style="padding: var(--space-sm) var(--space-md); cursor: pointer; font-size: var(--font-size-xs); color: var(--text-secondary); display: flex; align-items: center; gap: var(--space-sm); transition: all var(--transition-fast);">
                <i class="fas fa-copy"></i> Copy
            </div>
        `;
        
        menu.innerHTML = menuItems;
        
        // Position menu near cursor
        const x = Math.min(event.pageX, window.innerWidth - 200);
        const y = Math.min(event.pageY, window.innerHeight - 100);
        
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        
        document.body.appendChild(menu);
        
        // Add hover effects
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(177, 182, 149, 0.1)';
                item.style.color = 'var(--accent-primary)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
                item.style.color = 'var(--text-secondary)';
            });
        });
        
        // Add event listeners
        const createSnippetBtn = menu.querySelector('[data-action="create-snippet"]');
        if (createSnippetBtn) {
            createSnippetBtn.addEventListener('click', () => {
                this.openSnippetModal(selectedText);
                this.hideSnippetContextMenu();
            });
        }
        
        const copyBtn = menu.querySelector('[data-action="copy"]');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(selectedText);
                this.showToast('Text copied to clipboard', 'info');
                this.hideSnippetContextMenu();
            });
        }

        const sendToCoWriterBtn = menu.querySelector('[data-action="send-to-cowriter"]');
        if (sendToCoWriterBtn) {
            sendToCoWriterBtn.addEventListener('click', () => {
                this.sendToCoWriter(selectedText);
                this.hideSnippetContextMenu();
            });
        }
        
        // Store reference to cleanup
        const menuCleanup = () => {
            if (menu.parentNode) {
                menu.remove();
            }
        };

        // Auto-cleanup after 30 seconds if not manually removed
        setTimeout(menuCleanup, 30000);
    }

    // Hide snippet context menu
    hideSnippetContextMenu() {
        const existingMenu = document.getElementById('notebook-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    // Send selected text to CoWriter
    sendToCoWriter(text) {
        // Switch to CoWriter tab
        if (window.mainManager) {
            window.mainManager.switchTab('cowriter');
        }
        
        // Wait a moment for tab switch, then insert text into CoWriter input
        setTimeout(() => {
            const cowriterInput = document.getElementById('chat-input');
            if (cowriterInput) {
                // Add the text to whatever is already in the input
                const currentValue = cowriterInput.value;
                const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
                
                cowriterInput.value = newValue;
                cowriterInput.focus();
                
                // Position cursor at the end
                setTimeout(() => {
                    cowriterInput.setSelectionRange(cowriterInput.value.length, cowriterInput.value.length);
                }, 50);
                
                this.showToast('Text sent to CoWriter', 'success');
            } else {
                this.showToast('CoWriter not available', 'error');
            }
        }, 100);
    }

    // Create new note
    createNewNote() {
        if (this.isDirty) {
            if (!confirm('You have unsaved changes. Create a new note anyway?')) {
                return;
            }
        }

        this.currentNote = {
            id: null,
            name: 'Untitled Note',
            content: '',
            collection: '',
            created: null,
            lastModified: null
        };

        const editor = this.getTextEditor();
        const titleInput = document.getElementById('note-title-input');
        
        if (editor) {
            if (editor.tagName === 'TEXTAREA') {
                editor.value = '';
            } else {
                editor.textContent = '';
            }
        }
        
        if (titleInput) {
            titleInput.value = this.currentNote.name;
        }
        
        this.isDirty = false;
        this.updateStatus();
        this.updatePreview();
        this.updateWordCount();
        this.updateNoteBreadcrumb();
        this._forceRebuild = true;
        this.renderCollectionsTree();

        this.showToast('New note created', 'info');
    }

    // Handle content changes
    onContentChange() {
        const editor = this.getTextEditor();
        if (!editor) return;
        
        // Get content based on editor type
        if (editor.tagName === 'TEXTAREA') {
            this.currentNote.content = editor.value;
        } else {
            this.currentNote.content = editor.textContent || '';
        }
        
        this.isDirty = true;
        this.updateStatus();
        
        // Update preview if in preview mode
        if (this.isPreviewMode) {
            this.updatePreview();
        }

        this.updateWordCount();
        this.resetAutoSave();
    }

    // Apply formatting
    applyFormatting(format) {
        const editor = this.getTextEditor();
        if (!editor) return;

        let selectedText = '';
        let startPos = 0;
        let endPos = 0;

        // Get selection based on editor type
        if (editor.tagName === 'TEXTAREA') {
            startPos = editor.selectionStart;
            endPos = editor.selectionEnd;
            selectedText = editor.value.substring(startPos, endPos);
        } else {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                selectedText = selection.toString();
            }
        }

        let replacement = '';
        
        switch (format) {
            case 'bold':
                replacement = `**${selectedText}**`;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                break;
            case 'code':
                replacement = `\`${selectedText}\``;
                break;
            case 'h1':
                replacement = `# ${selectedText}`;
                break;
            case 'h2':
                replacement = `## ${selectedText}`;
                break;
            case 'h3':
                replacement = `### ${selectedText}`;
                break;
            case 'quote':
                replacement = `> ${selectedText}`;
                break;
            case 'link':
                this.insertLink();
                return;
        }

        if (replacement) {
            if (editor.tagName === 'TEXTAREA') {
                // Textarea method
                const newValue = editor.value.substring(0, startPos) + replacement + editor.value.substring(endPos);
                editor.value = newValue;
                editor.setSelectionRange(startPos + replacement.length, startPos + replacement.length);
                editor.focus();
            } else {
                // ContentEditable method
                this.insertText(replacement);
            }
            this.onContentChange();
        }
    }

    // Insert text
    insertText(text) {
        const editor = this.getTextEditor();
        if (!editor) return;

        if (editor.tagName === 'TEXTAREA') {
            // Textarea method
            const start = editor.selectionStart;
            editor.setRangeText(text);
            editor.setSelectionRange(start + text.length, start + text.length);
            editor.focus();
        } else {
            // ContentEditable method
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        this.onContentChange();
    }

    // Open snippet modal - RESTORED WORKING VERSION
    openSnippetModal(selectedText = '') {        
        // Remove existing modal if any
        const existingModal = document.getElementById('snippet-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'snippet-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 500px; width: 90%; max-height: 80vh; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Create Snippet</h3>
                    <button class="close-btn" id="close-snippet-modal" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Title:</label>
                        <input type="text" id="snippet-title" placeholder="Enter snippet title..." style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Tags (comma-separated):</label>
                        <input type="text" id="snippet-tags" placeholder="worldbuilding, character, plot..." style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Content:</label>
                        <textarea id="snippet-content" rows="6" placeholder="Snippet content..." style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs); resize: vertical;">${selectedText}</textarea>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button id="save-snippet-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-save"></i> Save Snippet
                        </button>
                        <button id="cancel-snippet-btn" class="btn-secondary" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Focus title input
        const titleInput = document.getElementById('snippet-title');
        if (titleInput) {
            titleInput.focus();
        }

        // Add event listeners
        document.getElementById('close-snippet-modal')?.addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('save-snippet-btn')?.addEventListener('click', () => {
            this.saveSnippet();
        });

        document.getElementById('cancel-snippet-btn')?.addEventListener('click', () => {
            modal.remove();
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });        
    }

    // Save snippet - WORKING VERSION
    async saveSnippet() {
        const titleInput = document.getElementById('snippet-title');
        const tagsInput = document.getElementById('snippet-tags');
        const contentTextarea = document.getElementById('snippet-content');
        
        const title = titleInput?.value.trim();
        const content = contentTextarea?.value.trim();
        const tags = tagsInput?.value.split(',').map(t => t.trim()).filter(t => t);
        
        if (!title) {
            this.showToast('Please enter a title for the snippet', 'warning');
            titleInput?.focus();
            return;
        }

        if (!content) {
            this.showToast('Please enter content for the snippet', 'warning');
            contentTextarea?.focus();
            return;
        }

        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to save snippets', 'warning');
            return;
        }

        const snippetData = {
            id: this.generateSnippetId(),
            title: title,
            content: content,
            tags: tags,
            created: Date.now(),
            lastModified: Date.now(),
            chatSessionId: null
        };

        try {
            await this.saveSnippetToServer(snippetData);
            this.snippets.push(snippetData);
            
            // Close modal
            const modal = document.getElementById('snippet-modal');
            if (modal) {
                modal.remove();
            }            
        } catch (error) {
            this.showToast('Failed to save snippet', 'error');
            console.error('❌ Error saving snippet:', error);
        }
    }

    // FIXED: Insert snippet into the TEXT EDITOR, not the file tree
    insertSnippet(snippet) {
        const editor = this.getTextEditor();
        if (!editor) {
            this.showToast('No active editor found', 'error');
            return;
        }
        
        // Create snippet markup
        const snippetMarkup = `\n<div class="snippet-highlight">\n${snippet.content}\n<span class="snippet-tag">${snippet.tags[0] || 'snippet'}</span>\n</div>\n`;
        if (editor.tagName === 'TEXTAREA') {
            // Textarea method
            const cursorPos = editor.selectionStart;
            const currentValue = editor.value;
            const newValue = currentValue.slice(0, cursorPos) + snippetMarkup + currentValue.slice(cursorPos);
            editor.value = newValue;
            
            // Update cursor position
            const newCursorPos = cursorPos + snippetMarkup.length;
            editor.setSelectionRange(newCursorPos, newCursorPos);
        } else {
            // ContentEditable method
            this.insertText(snippetMarkup);
        }
        
        this.onContentChange();
        this.closeSnippetBrowser();
        this.showToast(`Inserted snippet: ${snippet.title}`, 'success');
        
        // Focus back on editor
        editor.focus();
    }

    // Render collections tree - FIXED with proper collections integration
    renderCollectionsTree() {
        const container = document.getElementById('collections-tree');
        if (!container) return;

        // ADD THIS CHECK:
        // Only rebuild if something actually changed
        const currentNoteIds = this.savedNotes.map(n => n.id).sort().join(',');
        if (this._lastRenderedNoteIds === currentNoteIds && !this._forceRebuild) {
            return; // Skip rebuild
        }
        this._lastRenderedNoteIds = currentNoteIds;
        this._forceRebuild = false;

        // ADD THIS: Clean up any existing observers before rebuilding
        if (this._lazyLoadObservers) {
            this._lazyLoadObservers.forEach(observer => {
                try {
                    observer.disconnect();
                } catch (e) {
                    // Observer might already be disconnected
                }
            });
            this._lazyLoadObservers = [];
        }

        container.innerHTML = '';

        // Use collections manager if available
        if (this.collectionsManager) {
            // Rebuild collections from current notes
            this.collectionsManager.rebuildFromNotes(this.savedNotes);
            
            // Render each collection
            const collections = this.collectionsManager.getAllCollections();
            
            // Sort collections: Uncategorized first, then alphabetical
            collections.sort((a, b) => {
                if (a.key === '') return -1; // Uncategorized first
                if (b.key === '') return 1;
                
                // Sort by hierarchy, then alphabetically
                const aLevel = a.level || 1;
                const bLevel = b.level || 1;
                
                if (aLevel !== bLevel) {
                    return aLevel - bLevel;
                }
                
                return a.name.localeCompare(b.name);
            });

            collections.forEach(collection => {
                // Skip rendering if parent is collapsed
                if (collection.parent && this.collectionsManager.collapsedCollections.has(collection.parent)) {
                    return; // Don't render this collection at all
                }
                
                const collectionDiv = this.createCollectionElement(collection);
                container.appendChild(collectionDiv);
            });
        } else {
            // Fallback to simple grouping by collection property
            this.renderSimpleCollections();
        }

        this.updateStats();
    }

    // CREATE NEW METHOD: Create collection element
    createCollectionElement(collection) {
        const collectionDiv = document.createElement('div');
        collectionDiv.className = 'collection-group';
        collectionDiv.dataset.collectionKey = collection.key;
        collectionDiv.dataset.level = collection.level || 1;
        
        // Calculate indentation based on level
        const indentLevel = (collection.level || 1) - 1;
        const indentPx = indentLevel * 20; // 20px per level
        
        // Check if collection is collapsed
        const isCollapsed = this.collectionsManager && this.collectionsManager.collapsedCollections.has(collection.key);
        
        // Check if collection has children
        const hasChildren = this.collectionsManager && this.collectionsManager.hasChildren(collection.key);
        
        // Collection header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'collection-header';
        headerDiv.style.borderLeftColor = collection.color || '#b1b695';
        headerDiv.style.marginLeft = `${indentPx}px`;
        
        const displayName = collection.name || 'Uncategorized';
        
        headerDiv.innerHTML = `
            <span class="collection-toggle ${isCollapsed ? '' : 'expanded'}" data-collection-key="${collection.key}"
                style="${!hasChildren && collection.notes.length === 0 ? 'visibility: hidden;' : ''}">
                <i class="fas fa-chevron-right"></i>
            </span>
            <span class="collection-icon" style="color: ${collection.color || '#b1b695'};">
                <i class="fas fa-folder${isCollapsed ? '' : '-open'}"></i>
            </span>
            <span class="collection-name">${this.escapeHtml(displayName)}</span>
            <span class="collection-count">${collection.notes.length}</span>
            ${collection.key !== '' ? `
                <div class="collection-actions" style="opacity: 0; transition: opacity var(--transition-normal); margin-left: var(--space-xs);">
                    ${(collection.level || 1) < 4 ? `
                        <button class="collection-action-btn" data-action="add-sub" data-collection="${collection.key}" title="Add Subcollection" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 2px 4px; border-radius: var(--radius-sm); font-size: 9px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-plus"></i>
                        </button>
                    ` : ''}
                    <button class="collection-action-btn" data-action="edit" data-collection="${collection.key}" title="Edit Collection" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 2px 4px; border-radius: var(--radius-sm); font-size: 9px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="collection-action-btn" data-action="delete" data-collection="${collection.key}" title="Delete Collection" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 2px 4px; border-radius: var(--radius-sm); font-size: 9px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        `;
        
        // Toggle collapse functionality
        const toggleBtn = headerDiv.querySelector('.collection-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();                
                if (this.collectionsManager) {
                    this.collectionsManager.toggleCollectionCollapse(collection.key);
                    
                    // Update icon immediately
                    const icon = headerDiv.querySelector('.collection-icon i');
                    const isNowCollapsed = this.collectionsManager.collapsedCollections.has(collection.key);
                    
                    toggleBtn.classList.toggle('expanded', !isNowCollapsed);
                    if (icon) {
                        icon.className = `fas fa-folder${isNowCollapsed ? '' : '-open'}`;
                    }
                    
                    // Toggle notes list
                    const notesList = collectionDiv.querySelector('.notes-list');
                    if (notesList) {
                        notesList.style.display = isNowCollapsed ? 'none' : 'block';
                    }
                }
            });
        }

        // Make entire header clickable (except action buttons)
        headerDiv.addEventListener('click', (e) => {
            // Don't toggle if clicking on action buttons
            if (e.target.closest('.collection-action-btn') || e.target.closest('.collection-toggle')) {
                return;
            }            
            
            if (this.collectionsManager) {
                this.collectionsManager.toggleCollectionCollapse(collection.key);
                
                // Update icon immediately
                const icon = headerDiv.querySelector('.collection-icon i');
                const toggleBtn = headerDiv.querySelector('.collection-toggle');
                const isNowCollapsed = this.collectionsManager.collapsedCollections.has(collection.key);
                
                if (toggleBtn) {
                    toggleBtn.classList.toggle('expanded', !isNowCollapsed);
                }
                if (icon) {
                    icon.className = `fas fa-folder${isNowCollapsed ? '' : '-open'}`;
                }
                
                // Toggle notes list
                const notesList = collectionDiv.querySelector('.notes-list');
                if (notesList) {
                    notesList.style.display = isNowCollapsed ? 'none' : 'block';
                }
            }
        });
        
        // Show actions on hover
        headerDiv.addEventListener('mouseenter', () => {
            const actions = headerDiv.querySelector('.collection-actions');
            if (actions) actions.style.opacity = '1';
        });
        
        headerDiv.addEventListener('mouseleave', () => {
            const actions = headerDiv.querySelector('.collection-actions');
            if (actions) actions.style.opacity = '0';
        });
        
        // Add subcollection button handler
        const addSubBtn = headerDiv.querySelector('[data-action="add-sub"]');
        if (addSubBtn) {
            addSubBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collectionsManager.showCreateCollectionModal(collection.key);
            });
        }
        
        // Delete collection handler
        const deleteBtn = headerDiv.querySelector('[data-action="delete"]');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collectionsManager.deleteCollection(collection.key);
            });
        }
        
        // Edit collection handler
        const editBtn = headerDiv.querySelector('[data-action="edit"]');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collectionsManager.editCollection(collection.key);
            });
        }

        collectionDiv.appendChild(headerDiv);
        
        // Notes list with proper indentation
        const notesDiv = document.createElement('div');
        notesDiv.className = 'notes-list';
        notesDiv.style.display = isCollapsed ? 'none' : 'block';
        notesDiv.style.marginLeft = `${indentPx + 24}px`; // Extra indent for notes under collections
        
        // Get actual note objects
        const notes = collection.notes
            .map(noteId => this.savedNotes.find(n => n.id === noteId))
            .filter(note => note) // Remove undefined notes
            .sort((a, b) => b.lastModified - a.lastModified); // Sort by last modified
        
        const INITIAL_NOTE_DISPLAY = 30;
        const notesToShow = notes.slice(0, INITIAL_NOTE_DISPLAY);
        const remainingNotes = notes.slice(INITIAL_NOTE_DISPLAY); // Mutable array for lazy loading

        // Render initial batch
        notesToShow.forEach(note => {
            const noteItem = this.createNoteItem(note);
            notesDiv.appendChild(noteItem);
        });

        // Setup lazy loading if there are more notes
        if (remainingNotes.length > 0) {
            // Create loading sentinel
            const sentinel = document.createElement('div');
            sentinel.className = 'notes-loading-sentinel';
            sentinel.style.cssText = `
                padding: var(--space-sm);
                text-align: center;
                color: var(--text-tertiary);
                font-size: var(--font-size-xs);
                margin: var(--space-xs) 0;
            `;
            sentinel.innerHTML = `<i class="fas fa-ellipsis-h"></i> ${remainingNotes.length} more note${remainingNotes.length !== 1 ? 's' : ''}`;
            notesDiv.appendChild(sentinel);
            
            // Setup intersection observer for lazy loading
            this.setupLazyNoteLoading(notesDiv, remainingNotes, sentinel);
        }
        
        collectionDiv.appendChild(notesDiv);
        
        return collectionDiv;
    }

    // Setup lazy loading for note lists using Intersection Observer
    setupLazyNoteLoading(notesDiv, remainingNotes, sentinel) {
        // Observer to load more when sentinel is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && remainingNotes.length > 0) {
                    // Load next batch
                    const BATCH_SIZE = 30;
                    const batch = remainingNotes.splice(0, BATCH_SIZE);
                    
                    batch.forEach(note => {
                        const noteItem = this.createNoteItem(note);
                        notesDiv.insertBefore(noteItem, sentinel);
                    });
                    
                    // Update or remove sentinel
                    if (remainingNotes.length === 0) {
                        observer.disconnect();
                        sentinel.remove();
                    } else {
                        // Update loading indicator
                        sentinel.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> Loading more notes...`;
                    }
                }
            });
        }, {
            root: document.getElementById('collections-tree'),
            rootMargin: '150px', // Start loading 150px before sentinel is visible
            threshold: 0
        });
        
        observer.observe(sentinel);
        
        // Store observer for cleanup
        if (!this._lazyLoadObservers) {
            this._lazyLoadObservers = [];
        }
        this._lazyLoadObservers.push(observer);
    }

    // ADD THIS NEW METHOD: Fallback simple collections rendering
    renderSimpleCollections() {
        const container = document.getElementById('collections-tree');
        const processedNotes = new Set();
        
        // Group notes by collection
        const notesByCollection = new Map();
        notesByCollection.set('', []); // Uncategorized
        
        this.savedNotes.forEach(note => {
            if (processedNotes.has(note.id)) return;
            processedNotes.add(note.id);
            
            const collection = note.collection || '';
            if (!notesByCollection.has(collection)) {
                notesByCollection.set(collection, []);
            }
            notesByCollection.get(collection).push(note);
        });

        // Render each collection
        for (const [collectionName, notes] of notesByCollection) {
            // Always show Uncategorized, skip other empty collections
            if (notes.length === 0 && collectionName !== '') continue;
            
            const collectionDiv = document.createElement('div');
            collectionDiv.className = 'collection-group';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'collection-header';
            headerDiv.innerHTML = `
                <span class="collection-toggle expanded">
                    <i class="fas fa-chevron-right"></i>
                </span>
                <span class="collection-icon">
                    <i class="fas fa-folder-open"></i>
                </span>
                <span class="collection-name">${this.escapeHtml(collectionName || 'Uncategorized')}</span>
                <span class="collection-count">${notes.length}</span>
            `;
            
            collectionDiv.appendChild(headerDiv);
            
            const notesDiv = document.createElement('div');
            notesDiv.className = 'notes-list';
            
            notes.forEach(note => {
                const noteItem = this.createNoteItem(note);
                notesDiv.appendChild(noteItem);
            });
            
            collectionDiv.appendChild(notesDiv);
            container.appendChild(collectionDiv);
        }
    }

    // Create note item - NO DUPLICATES
    createNoteItem(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        noteDiv.dataset.noteId = note.id;
        
        if (note.id === this.currentNote.id) {
            noteDiv.classList.add('active');
        }

        noteDiv.innerHTML = `
            <span class="note-icon">
                <i class="fas fa-file-alt"></i>
            </span>
            <span class="note-name">${this.escapeHtml(note.name)}</span>
            <div class="note-actions">
                <button class="note-action-btn" data-action="export" title="Export as Markdown">
                    <i class="fas fa-download"></i>
                </button>
                <button class="note-action-btn" data-action="move" title="Move to Collection">
                    <i class="fas fa-arrows-alt"></i>
                </button>
                <button class="note-action-btn" data-action="delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Click anywhere on the note to load it
        noteDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.note-action-btn')) {
                this.loadNote(note.id);
            }
        });

        // Only delete button needed
        const deleteBtn = noteDiv.querySelector('[data-action="delete"]');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteNote(note.id);
            });
        }

        // Export button
        const exportBtn = noteDiv.querySelector('[data-action="export"]');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.exportManager.exportNote(note.id);
            });
        }

        // Move button
        const moveBtn = noteDiv.querySelector('[data-action="move"]');
        if (moveBtn) {
            moveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMoveNoteModal(note);
            });
        }

        return noteDiv;
    }

    // Show move note modal
    showMoveNoteModal(note) {
        if (!this.collectionsManager) {
            this.showToast('Collections not available', 'error');
            return;
        }

        // Remove existing modal if any
        const existingModal = document.getElementById('move-note-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'move-note-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Get all collections
        const collections = this.collectionsManager.getAllCollections();
        const currentCollection = note.collection || '';
        
        const collectionsOptions = collections
            .map(collection => {
                const isSelected = collection.key === currentCollection ? 'selected' : '';
                // Use the full path instead of just the name
                const displayName = collection.key === '' ? 'Uncategorized' : 
                    this.collectionsManager.getCollectionPath(collection.key);
                return `<option value="${collection.key}" ${isSelected}>${this.escapeHtml(displayName)}</option>`;
            })
            .join('');
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 400px; width: 90%; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Move Note</h3>
                    <button class="close-btn" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    <p style="margin-bottom: var(--space-md); color: var(--text-secondary);">Move "${this.escapeHtml(note.name)}" to:</p>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <select id="target-collection" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                            ${collectionsOptions}
                        </select>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button id="move-note-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-arrows-alt"></i> Move Note
                        </button>
                        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Setup functionality
        document.getElementById('move-note-btn').addEventListener('click', () => {
            this.moveNoteToCollection(note, modal);
        });
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Move note to collection
    async moveNoteToCollection(note, modal) {
        const targetSelect = document.getElementById('target-collection');
        const targetCollection = targetSelect.value;
        
        if (targetCollection === note.collection) {
            this.showToast('Note is already in that collection', 'info');
            modal.remove();
            return;
        }
        
        try {
            // Update the note object
            const oldCollection = note.collection || '';
            note.collection = targetCollection;
            note.lastModified = Date.now();
            
            // Update in collections manager
            if (this.collectionsManager) {
                this.collectionsManager.moveNote(note.id, oldCollection, targetCollection);
            }
            
            // Update in saved notes array
            const noteIndex = this.savedNotes.findIndex(n => n.id === note.id);
            if (noteIndex !== -1) {
                this.savedNotes[noteIndex] = note;
            }
            
            // Save to server
            if (this.isUserLoggedIn()) {
                await this.saveNoteToServer(note);
                if (this.collectionsManager) {
                    await this.collectionsManager.saveCollectionsToServer();
                }
            }
            
            // Update current note if it's the one being moved
            if (this.currentNote.id === note.id) {
                this.currentNote.collection = targetCollection;
                this.updateNoteBreadcrumb();
            }
            
            // Refresh UI
            this._forceRebuild = true;  // ADD THIS LINE
            this.renderCollectionsTree();
            
            const targetCollectionName = this.collectionsManager.getCollection(targetCollection)?.name || 'Uncategorized';
            this.showToast(`Moved "${note.name}" to ${targetCollectionName}`, 'success');
            
            modal.remove();
            
        } catch (error) {
            console.error('Error moving note:', error);
            this.showToast('Failed to move note', 'error');
        }
    }

    // Add this new method to NotebookManager class:
    updateNoteBreadcrumb() {
        const breadcrumbEl = document.getElementById('note-breadcrumb');
        if (!breadcrumbEl) return;
        
        const collectionKey = this.currentNote.collection || '';
        let breadcrumbText = 'Uncategorized';
        let breadcrumbColor = '#666666';
        
        if (collectionKey && this.collectionsManager) {
            const collection = this.collectionsManager.getCollection(collectionKey);
            if (collection) {
                breadcrumbText = this.collectionsManager.getCollectionPath(collectionKey);
                breadcrumbColor = collection.color || '#b1b695';
            }
        }
        
        breadcrumbEl.innerHTML = `
            <i class="fas fa-folder" style="color: ${breadcrumbColor};"></i>
            <span>${this.escapeHtml(breadcrumbText)}</span>
        `;
    }

    // Load note
    async loadNote(noteId) {
        if (this.isDirty && !confirm('You have unsaved changes. Load this note anyway?')) {
            return;
        }

        try {
            const note = await this.loadNoteFromServer(noteId);
            this.currentNote = note;
            
            const editor = this.getTextEditor();
            const titleInput = document.getElementById('note-title-input');
            
            if (editor) {
                if (editor.tagName === 'TEXTAREA') {
                    editor.value = note.content;
                } else {
                    editor.textContent = note.content;
                }
            }
            
            if (titleInput) {
                titleInput.value = note.name;
            }
            
            this.isDirty = false;
            this.updateStatus();
            this.updatePreview();
            this.updateWordCount();
            this.updateNoteBreadcrumb();
            this._forceRebuild = true;
            this.renderCollectionsTree(); // Update active state            
        } catch (error) {
            this.showToast('Failed to load note', 'error');
        }
    }

    // Save current note
    async saveCurrentNote() {
        const titleInput = document.getElementById('note-title-input');
        const name = (titleInput?.value || this.currentNote.name || 'Untitled Note').trim();
        
        if (!name) {
            this.showToast('Please enter a name for this note', 'warning');
            titleInput?.focus();
            return;
        }

        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to save notes', 'warning');
            return;
        }

        const noteData = {
            id: this.currentNote.id || this.generateNoteId(),
            name: name,
            content: this.currentNote.content,
            collection: this.currentNote.collection || 'default',
            created: this.currentNote.created || Date.now(),
            lastModified: Date.now()
        };

        try {
            await this.saveNoteToServer(noteData);
            this.currentNote = noteData;
            
            // Update local copy
            const index = this.savedNotes.findIndex(n => n.id === noteData.id);
            if (index !== -1) {
                this.savedNotes[index] = noteData;
            } else {
                this.savedNotes.push(noteData);
            }
            
            this.isDirty = false;
            this.updateStatus();
            this.renderCollectionsTree();
        } catch (error) {
            this.showToast('Failed to save note', 'error');
        }
    }

    // Update word count
    updateWordCount() {
        const content = this.currentNote.content || '';
        const words = this.countWords(content);
        const chars = content.length;

        const wordCountEl = document.getElementById('word-count');
        if (wordCountEl) wordCountEl.textContent = `${words} words`;
        
        const charCountEl = document.getElementById('char-count');
        if (charCountEl) charCountEl.textContent = `${chars} characters`;
    }

    // Update stats
    updateStats() {
        const notesCount = this.savedNotes.length;
        const totalWords = this.savedNotes.reduce((total, note) => total + this.countWords(note.content || ''), 0);

        const notesCountEl = document.getElementById('notes-count');
        if (notesCountEl) notesCountEl.textContent = `${notesCount} note${notesCount !== 1 ? 's' : ''}`;
        
        const wordsCountEl = document.getElementById('words-count');
        if (wordsCountEl) wordsCountEl.textContent = `${totalWords} words`;
    }

    // Toggle preview
    togglePreview() {
        const previewOverlay = document.getElementById('preview-overlay');
        const toggleBtn = document.getElementById('toggle-preview');
        
        if (!previewOverlay || !toggleBtn) return;

        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            previewOverlay.style.display = 'block';
            toggleBtn.classList.add('active');
            this.updatePreview();
        } else {
            previewOverlay.style.display = 'none';
            toggleBtn.classList.remove('active');
        }
    }

    // Update preview
    updatePreview() {
        if (!this.isPreviewMode) return;
        
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;
        
        const content = this.currentNote.content || '';
        const processedContent = this.processNoteLinks(content);
        const renderedContent = this.renderMarkdown(processedContent);
        previewContent.innerHTML = renderedContent;
    }

    // Process note links
    // Process note links
    processNoteLinks(content) {
        // Enhanced syntax: (display text)[[note name]] or [[note name]]
        // Made more restrictive to avoid matching across snippet boundaries
        return content.replace(/(\(([^)\n]+)\))?\[\[([^\]]+)\]\]/g, (match, displayGroup, displayText, noteName) => {
            const noteExists = this.savedNotes.some(note => 
                note.name.toLowerCase() === noteName.trim().toLowerCase()
            );
            
            const className = noteExists ? 'note-link' : 'note-link broken';
            const linkText = displayText ? displayText.trim() : noteName.trim();
            
            return `<a href="#" class="${className}" data-note-name="${this.escapeHtml(noteName.trim())}">${this.escapeHtml(linkText)}</a>`;
        });
    }

    // Render markdown
    renderMarkdown(content) {
        try {
            if (typeof marked !== 'undefined') {
                // Pre-process custom syntax BEFORE marked.js
                let processedContent = content
                    .replace(/==(.*?)==/g, '<mark>$1</mark>')
                    .replace(/!~(.*?)~!/g, '<u>$1</u>');
                
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false,
                    // These should help with checkboxes:
                    pedantic: false,
                    headerIds: false,
                    mangle: false
                });
                
                return marked.parse(processedContent);
            } else {
                return this.basicMarkdownRender(content);
            }
        } catch (error) {
            console.error('Markdown parsing error:', error);
            return this.escapeHtml(content);
        }
    }

    // Basic markdown rendering fallback
    basicMarkdownRender(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // ADD THESE:
            .replace(/==(.*?)==/g, '<mark>$1</mark>')
            .replace(/!~(.*?)~!/g, '<u>$1</u>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\n/g, '<br>');
    }

    // WORKING SNIPPETS FUNCTIONS
    openSnippetBrowser(focusSearch = false) {
        const panel = document.querySelector('.snippets-panel');
        if (!panel) return;

        panel.classList.add('open');
        this.loadSnippetsIntoPanel();
        
        if (focusSearch) {
            const searchInput = document.getElementById('snippets-search');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    }

    closeSnippetsPanel() {
        const panel = document.querySelector('.snippets-panel');
        if (panel) {
            panel.classList.remove('open');
        }
    }

    async loadSnippetsIntoPanel() {
        if (this.snippets.length === 0 && this.isUserLoggedIn()) {
            await this.loadSnippetsFromServer();
        }
        this.renderSnippetsList();
        this.renderTagFilterChips(); // Add this line
    }

    renderSnippetsList() {
        const container = document.getElementById('snippets-list');
        if (!container) return;

        if (this.snippets.length === 0) {
            container.innerHTML = `
                <div class="snippets-empty" style="text-align: center; padding: var(--space-xl); color: var(--text-tertiary);">
                    <i class="fas fa-puzzle-piece" style="font-size: 2rem; margin-bottom: var(--space-md);"></i>
                    <p>No snippets yet</p>
                    <small>Right-click text in CoWriter to create snippets</small>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        this.snippets.forEach(snippet => {
            const snippetEl = this.createSnippetElement(snippet);
            container.appendChild(snippetEl);
        });

        this.renderTagFilterChips();
    }

    createSnippetElement(snippet) {
        const div = document.createElement('div');
        div.className = 'snippet-item';
        div.style.cssText = `
            padding: var(--space-md);
            margin-bottom: var(--space-sm);
            background: var(--bg-tertiary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all var(--transition-normal);
        `;
        
        const contentPreview = snippet.content.substring(0, 100) + (snippet.content.length > 100 ? '...' : '');
        
        div.innerHTML = `
            <div class="snippet-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
                <span class="snippet-title" style="font-weight: 600; color: var(--text-primary);">${this.escapeHtml(snippet.title)}</span>
                <div class="snippet-actions">
                    <button class="snippet-action-btn" data-action="insert" title="Insert" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="snippet-action-btn" data-action="edit" title="Edit" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="snippet-action-btn" data-action="delete" title="Delete" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="snippet-content" style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-xs);">${this.escapeHtml(contentPreview)}</div>
            <div class="snippet-tags" style="display: flex; gap: var(--space-xs);">
                ${snippet.tags.map(tag => `<span class="snippet-tag" style="background: var(--bg-quaternary); color: var(--text-tertiary); padding: 2px 6px; border-radius: var(--radius-sm); font-size: 10px;">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
        `;

        // Hover effects
        div.addEventListener('mouseenter', () => {
            div.style.background = 'var(--bg-quaternary)';
            div.style.borderColor = 'var(--accent-primary)';
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.background = 'var(--bg-tertiary)';
            div.style.borderColor = 'var(--border-primary)';
        });

        // Action buttons
        const insertBtn = div.querySelector('[data-action="insert"]');
        const deleteBtn = div.querySelector('[data-action="delete"]');
        
        if (insertBtn) {
            insertBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.insertSnippet(snippet);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSnippet(snippet);
            });
        }

        // Click to insert
        div.addEventListener('click', () => {
            this.insertSnippet(snippet);
        });

        const editBtn = div.querySelector('[data-action="edit"]');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editSnippet(snippet);
            });
        }

        return div;
    }

    // Placeholder methods
    insertLink() {
        this.showToast('Link insertion coming soon!', 'info');
    }

    showNoteLinkHelper() {
        if (this.noteLinking) {
            this.noteLinking.showNoteLinkModal();
        } else {
            this.showToast('Note linking not available', 'warning');
        }
    }

    handleSearch(query) {
        // Simple search implementation
        if (query.trim()) {
            this.filterNotesBySearch(query);
        } else {
            this.renderCollectionsTree();
        }
    }

    filterNotesBySearch(query) {
        const lowerQuery = query.toLowerCase();
        const matchingNotes = this.savedNotes.filter(note => 
            note.name.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery)
        );

        const container = document.getElementById('collections-tree');
        if (!container) return;

        container.innerHTML = '';

        if (matchingNotes.length === 0) {
            container.innerHTML = `
                <div class="search-no-results" style="text-align: center; padding: var(--space-xl); color: var(--text-tertiary);">
                    <i class="fas fa-search"></i>
                    <p>No notes found for "${this.escapeHtml(query)}"</p>
                </div>
            `;
            return;
        }

        // Show search results
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        
        matchingNotes.forEach(note => {
            const noteItem = this.createNoteItem(note);
            resultsDiv.appendChild(noteItem);
        });
        
        container.appendChild(resultsDiv);
    }

    // Filter snippets by search term
    filterSnippets(searchTerm) {
        const container = document.getElementById('snippets-list');
        if (!container) return;
        
        if (!searchTerm.trim()) {
            this.renderSnippetsList(); // Show all snippets
            return;
        }
        
        const lowerSearch = searchTerm.toLowerCase();
        const filteredSnippets = this.snippets.filter(snippet => 
            snippet.title.toLowerCase().includes(lowerSearch) ||
            snippet.content.toLowerCase().includes(lowerSearch) ||
            snippet.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
        
        container.innerHTML = '';
        
        if (filteredSnippets.length === 0) {
            container.innerHTML = `
                <div class="snippets-empty" style="text-align: center; padding: var(--space-xl); color: var(--text-tertiary);">
                    <i class="fas fa-search"></i>
                    <p>No snippets found for "${this.escapeHtml(searchTerm)}"</p>
                </div>
            `;
            return;
        }
        
        filteredSnippets.forEach(snippet => {
            const snippetEl = this.createSnippetElement(snippet);
            container.appendChild(snippetEl);
        });
    }

    // Get all unique tags from snippets
    getAllSnippetTags() {
        const allTags = new Set();
        this.snippets.forEach(snippet => {
            snippet.tags.forEach(tag => {
                if (tag.trim()) {
                    allTags.add(tag.trim().toLowerCase());
                }
            });
        });
        return Array.from(allTags).sort();
    }

    // Get tag usage count
    getTagUsageCount() {
        const tagCounts = new Map();
        this.snippets.forEach(snippet => {
            snippet.tags.forEach(tag => {
                if (tag.trim()) {
                    const normalizedTag = tag.trim().toLowerCase();
                    tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
                }
            });
        });
        return tagCounts;
    }

    // Render tag filter chips
    renderTagFilterChips() {
        const container = document.getElementById('tags-filter-chips');
        const filterSection = document.getElementById('snippets-tags-filter');
        
        if (!container || !filterSection) return;
        
        const tags = this.getAllSnippetTags();
        const tagCounts = this.getTagUsageCount();
        
        if (tags.length === 0) {
            filterSection.style.display = 'none';
            return;
        }
        
        filterSection.style.display = 'block';
        container.innerHTML = '';
        
        // Sort tags by usage count (most used first)
        const sortedTags = tags.sort((a, b) => (tagCounts.get(b) || 0) - (tagCounts.get(a) || 0));
        
        sortedTags.forEach(tag => {
            const count = tagCounts.get(tag) || 0;
            const chip = document.createElement('button');
            chip.className = 'tag-filter-chip';
            chip.dataset.tag = tag;
            chip.style.cssText = `
                background: var(--bg-tertiary);
                border: 1px solid var(--border-primary);
                color: var(--text-secondary);
                padding: 4px 8px;
                margin: 2px;
                border-radius: var(--radius-sm);
                font-size: 10px;
                cursor: pointer;
                transition: all var(--transition-fast);
                display: inline-flex;
                align-items: center;
                gap: 4px;
            `;
            
            chip.innerHTML = `
                <span>${this.escapeHtml(tag)}</span>
                <span style="background: var(--bg-quaternary); padding: 1px 4px; border-radius: 8px; font-size: 8px;">${count}</span>
            `;
            
            // Click handler
            chip.addEventListener('click', () => {
                this.filterSnippetsByTag(tag);
                this.highlightActiveTagChip(tag);
            });
            
            // Hover effects
            chip.addEventListener('mouseenter', () => {
                chip.style.background = 'var(--accent-primary)';
                chip.style.color = 'var(--bg-primary)';
                chip.style.borderColor = 'var(--accent-primary)';
            });
            
            chip.addEventListener('mouseleave', () => {
                if (!chip.classList.contains('active')) {
                    chip.style.background = 'var(--bg-tertiary)';
                    chip.style.color = 'var(--text-secondary)';
                    chip.style.borderColor = 'var(--border-primary)';
                }
            });
            
            container.appendChild(chip);
        });
    }

    // Filter snippets by tag
    filterSnippetsByTag(selectedTag) {
        const container = document.getElementById('snippets-list');
        if (!container) return;
        
        const filteredSnippets = this.snippets.filter(snippet =>
            snippet.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
        );
        
        container.innerHTML = '';
        
        if (filteredSnippets.length === 0) {
            container.innerHTML = `
                <div class="snippets-empty" style="text-align: center; padding: var(--space-xl); color: var(--text-tertiary);">
                    <i class="fas fa-tag"></i>
                    <p>No snippets with tag "${this.escapeHtml(selectedTag)}"</p>
                </div>
            `;
            return;
        }
        
        filteredSnippets.forEach(snippet => {
            const snippetEl = this.createSnippetElement(snippet);
            container.appendChild(snippetEl);
        });
        
        // Clear search input since we're filtering by tag
        const searchInput = document.getElementById('snippets-search');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    // Highlight active tag chip
    highlightActiveTagChip(activeTag) {
        document.querySelectorAll('.tag-filter-chip').forEach(chip => {
            if (chip.dataset.tag === activeTag.toLowerCase()) {
                chip.classList.add('active');
                chip.style.background = 'var(--accent-primary)';
                chip.style.color = 'var(--bg-primary)';
                chip.style.borderColor = 'var(--accent-primary)';
            } else {
                chip.classList.remove('active');
                chip.style.background = 'var(--bg-tertiary)';
                chip.style.color = 'var(--text-secondary)';
                chip.style.borderColor = 'var(--border-primary)';
            }
        });
    }

    // Clear tag filter
    clearTagFilter() {
        // Remove active state from all chips
        document.querySelectorAll('.tag-filter-chip').forEach(chip => {
            chip.classList.remove('active');
            chip.style.background = 'var(--bg-tertiary)';
            chip.style.color = 'var(--text-secondary)';
            chip.style.borderColor = 'var(--border-primary)';
        });
        
        // Show all snippets
        this.renderSnippetsList();
    }

    // Edit existing snippet
    editSnippet(snippet) {        
        // Remove existing modal if any
        const existingModal = document.getElementById('snippet-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'snippet-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary); box-shadow: var(--shadow-xl); max-width: 500px; width: 90%; max-height: 80vh; overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-primary); background: var(--bg-tertiary);">
                    <h3 style="margin: 0; color: var(--text-primary);">Edit Snippet</h3>
                    <button class="close-btn" id="close-snippet-modal" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: var(--font-size-sm); padding: var(--space-xs); border-radius: var(--radius-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: var(--space-lg);">
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Title:</label>
                        <input type="text" id="snippet-title" placeholder="Enter snippet title..." value="${this.escapeHtml(snippet.title)}" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-md);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Tags (comma-separated):</label>
                        <input type="text" id="snippet-tags" placeholder="worldbuilding, character, plot..." value="${this.escapeHtml(snippet.tags.join(', '))}" style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs);">
                    </div>
                    <div class="form-group" style="margin-bottom: var(--space-lg);">
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--text-primary); font-weight: 500;">Content:</label>
                        <textarea id="snippet-content" rows="6" placeholder="Snippet content..." style="width: 100%; padding: var(--space-sm); background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); color: var(--text-inputs); resize: vertical;">${this.escapeHtml(snippet.content)}</textarea>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                        <button id="update-snippet-btn" class="btn-primary" style="background: var(--accent-primary); color: var(--bg-primary); border: none; padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            <i class="fas fa-save"></i> Update Snippet
                        </button>
                        <button id="cancel-snippet-btn" class="btn-secondary" style="background: var(--bg-quaternary); color: var(--text-secondary); border: 1px solid var(--border-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-md); cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Focus title input
        const titleInput = document.getElementById('snippet-title');
        if (titleInput) {
            titleInput.focus();
            titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
        }

        // Add event listeners
        document.getElementById('close-snippet-modal')?.addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('update-snippet-btn')?.addEventListener('click', () => {
            this.updateSnippet(snippet);
        });

        document.getElementById('cancel-snippet-btn')?.addEventListener('click', () => {
            modal.remove();
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });        
    }

    // Update existing snippet
    async updateSnippet(originalSnippet) {
        const titleInput = document.getElementById('snippet-title');
        const tagsInput = document.getElementById('snippet-tags');
        const contentTextarea = document.getElementById('snippet-content');
        
        const title = titleInput?.value.trim();
        const content = contentTextarea?.value.trim();
        const tags = tagsInput?.value.split(',').map(t => t.trim()).filter(t => t);
        
        if (!title) {
            this.showToast('Please enter a title for the snippet', 'warning');
            titleInput?.focus();
            return;
        }

        if (!content) {
            this.showToast('Please enter content for the snippet', 'warning');
            contentTextarea?.focus();
            return;
        }

        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to update snippets', 'warning');
            return;
        }

        const updatedSnippetData = {
            ...originalSnippet,
            title: title,
            content: content,
            tags: tags,
            lastModified: Date.now()
        };

        try {
            await this.saveSnippetToServer(updatedSnippetData);
            
            // Update in local array
            const snippetIndex = this.snippets.findIndex(s => s.id === originalSnippet.id);
            if (snippetIndex !== -1) {
                this.snippets[snippetIndex] = updatedSnippetData;
            }
            
            // Refresh snippets display
            this.renderSnippetsList();
            
            // Close modal
            const modal = document.getElementById('snippet-modal');
            if (modal) {
                modal.remove();
            }            
        } catch (error) {
            this.showToast('Failed to update snippet', 'error');
            console.error('❌ Error updating snippet:', error);
        }
    }

    async deleteSnippet(snippet) {
        if (!confirm(`Delete snippet "${snippet.title}"?`)) return;

        try {
            await this.deleteSnippetFromServer(snippet.id);
            this.snippets = this.snippets.filter(s => s.id !== snippet.id);
            this.renderSnippetsList();
        } catch (error) {
            this.showToast('Failed to delete snippet', 'error');
        }
    }

    async deleteNote(noteId) {
        const note = this.savedNotes.find(n => n.id === noteId);
        if (!note) return;
        
        if (confirm(`Are you sure you want to delete "${note.name}"? This cannot be undone.`)) {
            try {
                await this.deleteNoteFromServer(noteId);
                this.savedNotes = this.savedNotes.filter(n => n.id !== noteId);
                
                if (this.currentNote.id === noteId) {
                    this.createNewNote();
                }
                
                this.renderCollectionsTree();
            } catch (error) {
                this.showToast('Failed to delete note', 'error');
            }
        }
    }

    // Auto-save functionality
    setupAutoSave() {
        // Clear any existing interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (this.isDirty && this.currentNote.id && this.isUserLoggedIn()) {
                this.autoSaveNote();
            }
        }, 30000);
    }

    async autoSaveNote() {
        try {
            const noteData = {
                ...this.currentNote,
                content: this.currentNote.content,
                lastModified: Date.now()
            };
            
            await this.saveNoteToServer(noteData);
            this.currentNote = noteData;
            this.isDirty = false;
            this.updateStatus('Auto-saved');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    resetAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        this.autoSaveTimer = setTimeout(() => {
            if (this.isDirty && this.currentNote.id && this.isUserLoggedIn()) {
                this.autoSaveNote();
            }
        }, 5000);
    }

    setupWordCounter() {
        // Clear any existing interval
        if (this.wordCountInterval) {
            clearInterval(this.wordCountInterval);
        }
        
        this.wordCountInterval = setInterval(() => {
            this.updateWordCount();
        }, 1000);
    }

    updateStatus(message = null) {
        const statusElement = document.querySelector('#save-status span');
        if (!statusElement) return;
        
        if (message) {
            statusElement.textContent = message;
            setTimeout(() => {
                this.updateStatus(); // Reset to default after 3 seconds
            }, 3000);
        } else if (this.isDirty) {
            statusElement.textContent = 'Unsaved changes';
        } else if (this.currentNote.lastModified) {
            const lastSaved = new Date(this.currentNote.lastModified);
            statusElement.textContent = `Saved ${lastSaved.toLocaleTimeString()}`;
        } else {
            statusElement.textContent = 'Not saved';
        }
    }

    // Utility functions
    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    generateNoteId() {
        return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateSnippetId() {
        return 'snippet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        if (window.authManager && window.authManager.showToast) {
            window.authManager.showToast(message, type);
        } else {
            console.log(`Toast (${type}): ${message}`);
        }
    }

    isUserLoggedIn() {
        const currentUser = window.authManager && window.authManager.getCurrentUser();
        return currentUser && !currentUser.isGuest;
    }

    getUserContext() {
        if (window.authManager) {
            return window.authManager.getUserContext();
        }
        return { isGuest: true };
    }

    // Server communication methods - KEPT FROM WORKING VERSION
    async loadUserData() {
        if (!this.isUserLoggedIn()) {
            this.savedNotes = [];
            this.snippets = [];
            this.renderCollectionsTree();
            this.updateStats();
            return;
        }

        try {
            await Promise.all([
                this.loadNotesFromServer(),
                this.loadSnippetsFromServer(),
                this.collectionsManager ? this.collectionsManager.loadCollectionsFromServer() : Promise.resolve()
            ]);
            
            this.renderCollectionsTree();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading notebook data:', error);
        }
    }

    async loadNotesFromServer() {
        try {
            const response = await fetch('/api/notebook/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                this.savedNotes = result.notes || [];
            } else {
                throw new Error(result.error || 'Failed to load notes');
            }
        } catch (error) {
            console.error('Error loading notes from server:', error);
            this.savedNotes = [];
        }
    }

    async loadSnippetsFromServer() {
        try {
            const response = await fetch('/api/notebook/snippets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                this.snippets = result.snippets || [];
            } else {
                throw new Error(result.error || 'Failed to load snippets');
            }
        } catch (error) {
            console.error('Error loading snippets from server:', error);
            this.snippets = [];
        }
    }

    async saveNoteToServer(noteData) {
        try {
            const response = await fetch('/api/notebook/notes/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId,
                    noteData: noteData
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                return result.note;
            } else {
                throw new Error(result.error || 'Failed to save note');
            }
        } catch (error) {
            console.error('Error saving note to server:', error);
            throw error;
        }
    }

    async loadNoteFromServer(noteId) {
        try {
            const response = await fetch('/api/notebook/notes/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId,
                    noteId: noteId
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                return result.note;
            } else {
                throw new Error(result.error || 'Failed to load note');
            }
        } catch (error) {
            console.error('Error loading note from server:', error);
            throw error;
        }
    }

    async deleteNoteFromServer(noteId) {
        try {
            const response = await fetch(`/api/notebook/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note from server:', error);
            throw error;
        }
    }

    async saveSnippetToServer(snippetData) {
        try {
            const response = await fetch('/api/notebook/snippets/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId,
                    snippetData: snippetData,
                    chatSessionId: null
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                return result.snippet;
            } else {
                throw new Error(result.error || 'Failed to save snippet');
            }
        } catch (error) {
            console.error('Error saving snippet to server:', error);
            throw error;
        }
    }

    async deleteSnippetFromServer(snippetId) {
        try {
            const response = await fetch(`/api/notebook/snippets/${snippetId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    notebookId: this.currentNotebookId
                })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete snippet');
            }
        } catch (error) {
            console.error('Error deleting snippet from server:', error);
            throw error;
        }
    }

    // Public methods for integration
    onUserLoggedIn() {
        console.log('Notebook: User logged in, refreshing data');
        this.loadUserData();
    }

    onUserLoggedOut() {
        console.log('Notebook: User logged out, clearing data');
        this.clearUserData();
    }

    clearUserData() {
        this.savedNotes = [];
        this.snippets = [];
        this.collectionsArray = [''];
        
        // Reset current note if not saved
        if (!this.currentNote.id) {
            this.createNewNote();
        }
        
        this.renderCollectionsTree();
        this.updateStats();
        
        // ADD THIS LINE:
        this.cleanup();
    }

    cleanup() {
        console.log('🧹 Cleaning up Notebook Manager...');
        
        // Clear timers
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
        
        if (this.wordCountInterval) {
            clearInterval(this.wordCountInterval);
            this.wordCountInterval = null;
        }
        
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
        
        if (this.wordCountTimer) {
            clearTimeout(this.wordCountTimer);
            this.wordCountTimer = null;
        }
        
        // Remove document-level listeners
        if (this.contextMenuHandler) {
            document.removeEventListener('contextmenu', this.contextMenuHandler);
        }
        
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler);
        }
        
        if (this.snippetsPanelClickHandler) {
            document.removeEventListener('click', this.snippetsPanelClickHandler);
            this._snippetsPanelListenerAttached = false;
        }

        // Cleanup lazy load observers
        if (this._lazyLoadObservers) {
            this._lazyLoadObservers.forEach(observer => {
                try {
                    observer.disconnect();
                } catch (e) {
                    // Observer might already be disconnected
                }
            });
            this._lazyLoadObservers = [];
        }
        
        console.log('✅ Notebook Manager cleanup complete');
    }
}

// Initialize Notebook when DOM is loaded
// Initialize Notebook when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait longer to ensure all tabs and DOM elements are ready
    setTimeout(() => {        
        // Check if required elements exist
        const newNoteBtn = document.getElementById('new-note-btn');
        const notebookContent = document.getElementById('notebook-content');
        
        if (newNoteBtn && notebookContent) {
            // Wait for workspace manager to be ready
            const initializeNotebook = () => {
                if (window.notebookWorkspaceManager) {
                    const notebookManager = new NotebookManager();
                    window.notebookManager = notebookManager;
                    console.log('✅ Notebook manager initialized successfully');
                } else {
                    // Wait a bit more for workspace manager
                    setTimeout(initializeNotebook, 100);
                }
            };
            
            initializeNotebook();
        } else {
            console.error('❌ Required notebook DOM elements not found');
            
            // Try again after more delay
            setTimeout(() => {
                console.log('🔄 Retrying notebook initialization...');
                const retryBtn = document.getElementById('new-note-btn');
                if (retryBtn) {
                    const initializeNotebook = () => {
                        if (window.notebookWorkspaceManager) {
                            const notebookManager = new NotebookManager();
                            window.notebookManager = notebookManager;
                            console.log('✅ Notebook manager initialized on retry');
                        } else {
                            setTimeout(initializeNotebook, 100);
                        }
                    };
                    initializeNotebook();
                }
            }, 1000);
        }
    }, 500);
});