// CoWriter JavaScript - Chat Interface Logic

class CoWriterManager {
    constructor() {
        this.MESSAGE_BATCH_SIZE = 10; // Load 10 messages at a time
        this.VISIBLE_MESSAGE_LIMIT = 20; // Keep 20 messages in DOM
        this.AUTO_SAVE_INTERVAL = 5; // Auto-save every 5 messages
        this.messagesAddedSinceLastSave = 0;
        this.allMessages = []; // Full message history
        this.visibleMessageStartIndex = 0; // Where visible window starts
        this.messages = [];
        this.currentEditingId = null;
        this.isProcessing = false;
        this.settings = {
            tone: '',           // NEW: default to None
            style: '',          // UPDATED: default to None
            templateId: '', 
            worldContext: '',
            worldContextId: '',
            provider: 'google',
            model: 'gemini-2.0-flash-exp',
            apiKey: '',
            hasApiKey: false
        };
        this.savedWorldContexts = [];
        this.savedChats = [];
        this.currentChatId = null;
        this.currentChatName = null;
        this.promptManager = null;
        
        this.initializeCoWriter(); // This will now be async
    }

    // Initialize CoWriter functionality
    async initializeCoWriter() {
        this.setupEventListeners();
        await this.loadUserSettings();
        await this.loadActiveChat(); // Load any in-progress chat
        // Load templates for header dropdown (after settings are loaded)
        await this.loadTemplates();
        
        // Set up welcome message
        this.addWelcomeMessage();

        this.setupExpandModal();

        // Initialize prompt manager when settings are first accessed
        // Initialize prompt manager immediately
        this.promptManagerReady = false;
        await this.initializePromptManager();
        
        // Add custom prompt styles
        this.addCustomPromptStyles();

        // Initialize CoWriter about system
        await window.initializeCoWriterAbout();
        
        console.log('🤖 CoWriter initialized with custom prompt support');
    }

    // Initialize prompt manager immediately
    async initializePromptManager() {
        if (!this.promptManager && !this.promptManagerReady) {
            this.promptManagerReady = true;
            this.promptManager = new CoWriterPromptManager(this);
            await this.promptManager.initialize();
        }
    }

    // Add welcome message
    addWelcomeMessage() {
        if (this.messages.length === 0) {
            this.messages.push({
                id: this.generateMessageId(),
                type: 'ai',
                content: "Welcome to CoWriter! I'm here to help you brainstorm, develop your worlds, and explore your creative ideas. What would you like to work on today?",
                timestamp: Date.now(),
                isWelcome: true
            });
            this.renderMessages();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Chat input handling
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (chatInput) {
            // Enter key handling
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Quick prompts button
        document.getElementById('quick-prompts-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleQuickPrompts();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            // Don't interfere with other modals
            if (e.target.closest('.modal-overlay')) {
                return;
            }
            
            const dropdown = document.getElementById('quick-prompts-dropdown');
            const button = document.getElementById('quick-prompts-btn');
            
            if (dropdown && !dropdown.contains(e.target) && !button.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Header controls
        this.setupHeaderControls();
        
        // Settings modal
        this.setupSettingsModal();

        // Template selector - ADD auto-save
        document.getElementById('template-select')?.addEventListener('change', (e) => {
            this.settings.templateId = e.target.value;
            console.log('Template changed to:', e.target.value);
            this.autoSaveSettings(); // ADD THIS LINE
        });
        
        // World context modal
        this.setupWorldContextModal();
        
        this.setupSaveChatModal();
        this.setupLoadChatModal(); 
        this.setupOverwriteConfirmModal();
    }

    // Setup header control buttons
    setupHeaderControls() {
        document.getElementById('save-chat-btn')?.addEventListener('click', () => {
            this.openSaveChatModal(); // Changed from openChatManager('save')
        });

        document.getElementById('load-chat-btn')?.addEventListener('click', () => {
            this.openLoadChatModal(); // Changed from openChatManager('load')
        });

        // Clear chat button
        document.getElementById('clear-chat-btn')?.addEventListener('click', () => {
            this.clearChat();
        });

        // Settings button
        document.getElementById('cowriter-settings-btn')?.addEventListener('click', () => {
            this.openSettings();
        });
    }

    // Setup settings modal
    setupSettingsModal() {
        // Close button
        document.getElementById('close-cowriter-settings')?.addEventListener('click', () => {
            this.closeSettings();
        });

        // Settings tabs
        document.querySelectorAll('.cowriter-settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchSettingsTab(tabName);
            });
        });

        // Tone select - ADD auto-save
        document.getElementById('tone-select')?.addEventListener('change', (e) => {
            this.settings.tone = e.target.value;
            this.autoSaveSettings(); // ADD THIS LINE
        });

        // Style select - ADD auto-save  
        document.getElementById('style-select')?.addEventListener('change', (e) => {
            this.settings.style = e.target.value;
            this.autoSaveSettings(); // ADD THIS LINE
        });

        // World context controls
        document.getElementById('world-context-select')?.addEventListener('change', (e) => {
            this.loadWorldContext(e.target.value);
        });

        document.getElementById('edit-world-context-btn')?.addEventListener('click', () => {
            this.editWorldContext();
        });

        document.getElementById('new-world-context-btn')?.addEventListener('click', () => {
            this.newWorldContext();
        });

        // Provider controls
        document.getElementById('provider-select')?.addEventListener('change', (e) => {
            this.settings.provider = e.target.value;
            this.loadModelsForProvider(e.target.value);
        });

        document.getElementById('model-select')?.addEventListener('change', (e) => {
            this.settings.model = e.target.value;
            console.log('Model changed to:', this.settings.model);
        });

        document.getElementById('refresh-models-btn')?.addEventListener('click', () => {
            this.refreshModels();
        });

        // API key handling
        const apiKeyInput = document.getElementById('api-key-input');
        const toggleBtn = document.getElementById('toggle-api-key-btn');
        
        if (apiKeyInput) {
            // Handle API key input changes
            apiKeyInput.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // If they're typing and it's not the masked placeholder, it's a new key
                if (value && value !== '••••••••••••••••') {
                    this.settings.apiKey = value;
                    this.settings.hasApiKey = true;
                } else if (!value) {
                    this.settings.apiKey = '';
                    this.settings.hasApiKey = false;
                }
                
                this.updateApiStatus();
            });

            // Handle focus to clear masked value
            apiKeyInput.addEventListener('focus', (e) => {
                if (e.target.value === '••••••••••••••••') {
                    e.target.value = '';
                    e.target.placeholder = 'Enter your API key...';
                }
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleApiKeyVisibility();
            });
        }

        // Settings actions
        document.getElementById('save-cowriter-settings')?.addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('test-connection-btn')?.addEventListener('click', () => {
            this.testConnection();
        });

        // Close modal on overlay click
        document.getElementById('cowriter-settings-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cowriter-settings-modal') {
                this.closeSettings();
            }
        });
    }

    // Setup world context modal
    setupWorldContextModal() {
        // Close button
        document.getElementById('close-world-context')?.addEventListener('click', () => {
            this.closeWorldContextModal();
        });

        // Action buttons
        document.getElementById('save-world-context')?.addEventListener('click', () => {
            this.saveWorldContext();
        });

        document.getElementById('cancel-world-context')?.addEventListener('click', () => {
            this.closeWorldContextModal();
        });

        document.getElementById('delete-world-context')?.addEventListener('click', () => {
            this.deleteWorldContext();
        });

        // Close on overlay click
        document.getElementById('world-context-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'world-context-modal') {
                this.closeWorldContextModal();
            }
        });
    }

    setupSaveChatModal() {
        // Close button
        document.getElementById('close-save-chat')?.addEventListener('click', () => {
            document.getElementById('save-chat-modal').style.display = 'none';
        });

        // Save button
        document.getElementById('save-current-chat')?.addEventListener('click', () => {
            this.saveCurrentChat();
        });

        // Close on overlay click
        document.getElementById('save-chat-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'save-chat-modal') {
                document.getElementById('save-chat-modal').style.display = 'none';
            }
        });

        // Folder dropdown functionality
        const folderToggle = document.getElementById('folder-dropdown-toggle');
        const folderOptions = document.getElementById('folder-options');
        const folderInput = document.getElementById('chat-save-folder');

        if (folderToggle && folderOptions && folderInput) {
            // Toggle dropdown
            folderToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (folderOptions.classList.contains('show')) {
                    folderOptions.classList.remove('show');
                } else {
                    this.populateFolderDropdown();
                    folderOptions.classList.add('show');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.folder-dropdown')) {
                    folderOptions.classList.remove('show');
                }
            });

            // Handle typing in input (close dropdown when typing)
            folderInput.addEventListener('input', () => {
                folderOptions.classList.remove('show');
            });

            // Handle focus on input (close dropdown)
            folderInput.addEventListener('focus', () => {
                folderOptions.classList.remove('show');
            });
        }
    }

    // REPLACE THE populateFolderDropdown METHOD
    populateFolderDropdown() {
        console.log('🔧 populateFolderDropdown called');
        console.log('📁 savedChats:', this.savedChats);
        
        const folderOptions = document.getElementById('folder-options');
        if (!folderOptions) {
            console.error('❌ folder-options element not found');
            return;
        }
        
        const folders = [...new Set(this.savedChats.map(chat => chat.folder || 'Uncategorized'))];
        
        // Always include 'Uncategorized' as default
        if (!folders.includes('Uncategorized')) {
            folders.push('Uncategorized');
        }
        
        folders.sort();
        console.log('📂 Folders to show:', folders);
        
        folderOptions.innerHTML = '';
        
        folders.forEach(folder => {
            const option = document.createElement('div');
            option.className = 'folder-option';
            option.textContent = folder;
            option.addEventListener('click', () => {
                document.getElementById('chat-save-folder').value = folder;
                folderOptions.classList.remove('show');
            });
            folderOptions.appendChild(option);
        });
        
        console.log('✅ Added', folders.length, 'folder options');
    }

    setupLoadChatModal() {
        document.getElementById('close-load-chat')?.addEventListener('click', () => {
            document.getElementById('load-chat-modal').style.display = 'none';
        });

        document.getElementById('load-chat-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'load-chat-modal') {
                document.getElementById('load-chat-modal').style.display = 'none';
            }
        });
    }

    setupOverwriteConfirmModal() {
        document.getElementById('confirm-overwrite')?.addEventListener('click', () => {
            this.confirmOverwrite();
        });

        document.getElementById('cancel-overwrite')?.addEventListener('click', () => {
            document.getElementById('overwrite-confirm-modal').style.display = 'none';
        });
    }

    // =============================================================================
    // CHAT FUNCTIONALITY
    // =============================================================================

    // Send user message
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (this.isProcessing) {
            return;
        }

        // Add user message (only if there's content)
        if (message) {
            this.addMessage('user', message);
        }
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            this.isProcessing = true;
            this.updateSendButton(true);
            
            // Simulate AI response for now (replace with actual LLM call later)
            await this.simulateAIResponse(message);
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.showToast('Failed to send message', 'error');
            this.removeTypingIndicator();
        } finally {
            this.isProcessing = false;
            this.updateSendButton(false);
        }
    }

    // Add message to chat
    addMessage(type, content, options = {}) {
        const message = {
            id: options.id || this.generateMessageId(),
            type: type,
            content: content,
            timestamp: options.timestamp || Date.now(),
            isWelcome: options.isWelcome || false
        };

        this.allMessages.push(message);
        this.messages = this.allMessages; // Keep reference
        
        // Auto-save every N messages
        if (!message.isWelcome) {
            this.messagesAddedSinceLastSave++;
            if (this.messagesAddedSinceLastSave >= this.AUTO_SAVE_INTERVAL) {
                this.autoSaveActiveChat();
                this.messagesAddedSinceLastSave = 0;
            }
        }
        
        this.updateVisibleMessages();
        this.renderMessages();
        this.scrollToBottom();
        
        return message.id;
    }

    // Update which messages are visible
    updateVisibleMessages() {
        const totalMessages = this.allMessages.length;
        
        // Always show welcome message if it exists
        const welcomeMsg = this.allMessages.find(m => m.isWelcome);
        
        // Calculate start index for non-welcome messages
        const nonWelcomeMessages = this.allMessages.filter(m => !m.isWelcome);
        const visibleStartIndex = Math.max(0, nonWelcomeMessages.length - this.VISIBLE_MESSAGE_LIMIT);
        
        // Build visible messages array
        this.messages = [];
        if (welcomeMsg) {
            this.messages.push(welcomeMsg);
        }
        this.messages.push(...nonWelcomeMessages.slice(visibleStartIndex));
        
        this.visibleMessageStartIndex = visibleStartIndex;
    }

    // Check if there are older messages to load
    hasOlderMessages() {
        const nonWelcomeMessages = this.allMessages.filter(m => !m.isWelcome);
        return this.visibleMessageStartIndex > 0;
    }

    // Load more older messages
    loadOlderMessages() {
        const nonWelcomeMessages = this.allMessages.filter(m => !m.isWelcome);
        const newStartIndex = Math.max(0, this.visibleMessageStartIndex - this.MESSAGE_BATCH_SIZE);
        
        this.visibleMessageStartIndex = newStartIndex;
        this.updateVisibleMessages();
        this.renderMessages();
    }

    // Auto-save active chat to disk
    async autoSaveActiveChat() {
        if (!this.isUserLoggedIn() && !this.getUserContext().isGuest) {
            return;
        }
        
        const activeChatData = {
            messages: this.allMessages.filter(m => !m.isWelcome),
            settings: { ...this.settings },
            lastModified: Date.now()
        };
        
        try {
            const response = await fetch('/api/cowriter/active-chat/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    chatData: activeChatData
                })
            });
            
            if (response.ok) {
                console.log('✅ Auto-saved active chat');
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    // Load active chat from disk
    async loadActiveChat() {
        if (!this.isUserLoggedIn() && !this.getUserContext().isGuest) {
            return;
        }
        
        try {
            const userContext = encodeURIComponent(JSON.stringify(this.getUserContext()));
            const response = await fetch(`/api/cowriter/active-chat?userContext=${userContext}`);
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.chatData) {
                    this.allMessages = [
                        ...this.allMessages.filter(m => m.isWelcome),
                        ...result.chatData.messages
                    ];
                    
                    if (result.chatData.settings) {
                        this.settings = { ...this.settings, ...result.chatData.settings };
                    }
                    
                    this.updateVisibleMessages();
                    this.renderMessages();
                    console.log('✅ Loaded active chat from disk');
                }
            }
        } catch (error) {
            console.error('Failed to load active chat:', error);
        }
    }

    // Clear active chat file
    async clearActiveChat() {
        try {
            await fetch('/api/cowriter/active-chat/clear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });
        } catch (error) {
            console.error('Failed to clear active chat:', error);
        }
    }

    // Simulate AI response (temporary - replace with real LLM call)
    async simulateAIResponse(userMessage) {
        try {
            // Get chat history for context (exclude welcome messages)
            const chatHistory = this.allMessages
                .filter(m => !m.isWelcome)
                .map(m => ({ type: m.type, content: m.content }));

                // Get the active main prompt content if available
                let activeMainPrompt = null;
                if (this.promptManager) {
                    const mainPrompt = this.promptManager.getActiveMainPrompt();
                    activeMainPrompt = mainPrompt ? mainPrompt.content : null;
                }

                // Make API call to LLM - UPDATED to include userContext in settings
                const response = await fetch('/api/llm/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userContext: this.getUserContext(), // Pass user context
                        message: userMessage,
                        chatHistory: chatHistory,
                        settings: {
                            ...this.settings,
                            userContext: this.getUserContext(), // Also include in settings for prompt assembly
                            activeMainPrompt: activeMainPrompt // Pass the main prompt content directly
                        }
                    })
                });

            const result = await response.json();

            if (response.ok && result.success) {
                this.removeTypingIndicator();
                this.addMessage('ai', result.response);
            } else {
                throw new Error(result.error || 'Failed to get AI response');
            }

        } catch (error) {
            console.error('AI response error:', error);
            this.removeTypingIndicator();
            
            // Show user-friendly error message
            let errorMessage = "I'm having trouble responding right now. ";
            
            if (error.message.includes('API key')) {
                errorMessage += "Please check your API key in Settings.";
            } else if (error.message.includes('provider')) {
                errorMessage += "Please check your provider configuration in Settings.";
            } else {
                errorMessage += "Please try again or check your Settings.";
            }
            
            this.addMessage('ai', errorMessage);
            this.showToast(error.message, 'error');
        }
    }

    // Show typing indicator
    showTypingIndicator() {
        const existing = document.querySelector('.ai-typing');
        if (existing) return; // Don't add multiple indicators
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message ai-typing';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
                <span class="typing-text">typing...</span>
            </div>
        `;
        
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    // Remove typing indicator
    removeTypingIndicator() {
        const typingElement = document.querySelector('.ai-typing');
        if (typingElement) {
            typingElement.remove();
        }
    }

    // Render all messages
    renderMessages() {
        const chatMessages = document.getElementById('chat-messages');
        
        // Clear existing messages (except typing indicator)
        const typingIndicator = chatMessages.querySelector('.ai-typing');
        chatMessages.innerHTML = '';

        // Add "Show More" button if there are older messages
        if (this.hasOlderMessages()) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-messages-btn';
            showMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show More Messages';
            showMoreBtn.addEventListener('click', () => {
                this.loadOlderMessages();
            });
            chatMessages.appendChild(showMoreBtn);
        }
        
        // Re-add messages
        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            chatMessages.appendChild(messageElement);
        });
        
        // Re-add typing indicator if it existed
        if (typingIndicator) {
            chatMessages.appendChild(typingIndicator);
        }
        
        this.scrollToBottom();
    }

    // Create message element
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}-message${message.isWelcome ? ' welcome' : ''}`;
        messageDiv.dataset.messageId = message.id;
        
        const actionsHtml = this.createMessageActions(message);
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.renderMarkdown(message.content)}</div>
                <div class="message-edit-form">
                    <textarea class="message-edit-textarea">${this.escapeHtml(message.content)}</textarea>
                    <div class="message-edit-actions">
                        <button class="btn-primary message-edit-btn save-edit" data-message-id="${message.id}">
                            <i class="fas fa-check"></i> Save
                        </button>
                        <button class="btn-secondary message-edit-btn cancel-edit" data-message-id="${message.id}">
                            Cancel
                        </button>
                    </div>
                </div>
                ${actionsHtml}
            </div>
        `;
        
        // Add event listeners for this message
        this.attachMessageEventListeners(messageDiv, message);
        
        return messageDiv;
    }

    // Render markdown content safely
    renderMarkdown(content) {
        try {
            // Configure marked for security
            marked.setOptions({
                breaks: true,
                gfm: true,
                sanitize: false, // We'll handle XSS protection
                smartLists: true,
                smartypants: false
            });
            
            // Parse markdown and sanitize
            const html = marked.parse(content);
            return this.sanitizeHtml(html);
        } catch (error) {
            console.error('Markdown parsing error:', error);
            // Fallback to escaped text if markdown fails
            return this.escapeHtml(content);
        }
    }

    // Basic HTML sanitization (you might want a more robust solution)
    sanitizeHtml(html) {
        // Allow common markdown elements but strip dangerous ones
        const allowedTags = ['p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img'];
        const allowedAttributes = {
            'a': ['href', 'title'],
            'img': ['src', 'alt', 'title']
        };
        
        // This is a basic implementation - consider using DOMPurify for production
        return html; // For now, return as-is. Add proper sanitization if needed.
    }

    // Create message action buttons
    createMessageActions(message) {
        if (message.isWelcome) {
            return ''; // No actions for welcome message
        }
        
        const buttons = [];
        
        if (message.type === 'user') {
            // User messages: edit + delete
            buttons.push(`<button class="message-action-btn edit" data-message-id="${message.id}" title="Edit message">
                <i class="fas fa-edit"></i>
            </button>`);
        } else if (message.type === 'ai') {
            // AI messages: edit + delete + refresh (if most recent)
            const isLastAIMessage = this.isLastAIMessage(message.id);
            
            buttons.push(`<button class="message-action-btn edit" data-message-id="${message.id}" title="Edit message">
                <i class="fas fa-edit"></i>
            </button>`);
            
            if (isLastAIMessage) {
                buttons.push(`<button class="message-action-btn refresh" data-message-id="${message.id}" title="Regenerate response">
                    <i class="fas fa-sync-alt"></i>
                </button>`);
            }
        }
        
        // Delete button (for both user and AI messages)
        buttons.push(`<button class="message-action-btn delete" data-message-id="${message.id}" title="Delete message">
            <i class="fas fa-trash"></i>
        </button>`);
        
        return `<div class="message-actions">${buttons.join('')}</div>`;
    }

    // Attach event listeners to message element
    attachMessageEventListeners(messageElement, message) {
        // Edit button
        const editBtn = messageElement.querySelector('.edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.startEditMessage(message.id);
            });
        }

        // Delete button
        const deleteBtn = messageElement.querySelector('.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteMessage(message.id);
            });
        }

        // Refresh button (AI messages only)
        const refreshBtn = messageElement.querySelector('.refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAIMessage(message.id);
            });
        }

        // Edit form buttons
        const saveEditBtn = messageElement.querySelector('.save-edit');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', () => {
                this.saveMessageEdit(message.id);
            });
        }

        const cancelEditBtn = messageElement.querySelector('.cancel-edit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.cancelMessageEdit(message.id);
            });
        }
    }

    // Start editing a message
    startEditMessage(messageId) {
        // Cancel any existing edit
        this.cancelMessageEdit(this.currentEditingId);
        
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            const messageContent = messageElement.querySelector('.message-content');
            
            // Only lock the WIDTH to prevent horizontal resizing
            if (messageContent) {
                const rect = messageContent.getBoundingClientRect();
                messageContent.style.setProperty('--locked-width', rect.width + 'px');
            }
            
            messageElement.classList.add('editing');
            this.currentEditingId = messageId;
            
            const textarea = messageElement.querySelector('.message-edit-textarea');
            if (textarea) {
                // Auto-resize textarea to fit content
                textarea.style.height = 'auto';
                textarea.style.height = Math.max(40, Math.min(textarea.scrollHeight, 300)) + 'px';
                
                textarea.focus();
                // Place cursor at end without selecting
                setTimeout(() => {
                    const length = textarea.value.length;
                    textarea.setSelectionRange(length, length);
                }, 0);
                
                // Add input listener for auto-resize
                textarea.addEventListener('input', this.autoResizeTextarea);
            }
        }
    }

    // Auto-resize textarea as user types
    autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(40, Math.min(textarea.scrollHeight, 300)) + 'px';
    }

    // Save message edit
    saveMessageEdit(messageId) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        const textarea = messageElement?.querySelector('.message-edit-textarea');
        
        if (textarea) {
            const newContent = textarea.value.trim();
            if (newContent) {
                // Update message in array
                const message = this.messages.find(m => m.id === messageId);
                if (message) {
                    message.content = newContent;
                    this.renderMessages();
                    this.showToast('Message updated', 'success');
                }
            }
        }
        
        this.cancelMessageEdit(messageId);
    }

    // Cancel message edit
    cancelMessageEdit(messageId) {
        if (!messageId) return;
        
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.classList.remove('editing');
            
            // Remove the locked width
            const messageContent = messageElement.querySelector('.message-content');
            if (messageContent) {
                messageContent.style.removeProperty('--locked-width');
            }
            
            // Remove auto-resize listener
            const textarea = messageElement.querySelector('.message-edit-textarea');
            if (textarea) {
                textarea.removeEventListener('input', this.autoResizeTextarea);
            }
        }
        
        this.currentEditingId = null;
    }

    // Delete message
    deleteMessage(messageId) {
        this.messages = this.messages.filter(m => m.id !== messageId);
        this.renderMessages();
        this.showToast('Message deleted', 'info');
    }

    // Check if this is the last AI message (for refresh button)
    isLastAIMessage(messageId) {
        const aiMessages = this.messages.filter(m => m.type === 'ai' && !m.isWelcome);
        if (aiMessages.length === 0) return false;
        
        const lastAIMessage = aiMessages[aiMessages.length - 1];
        return lastAIMessage.id === messageId;
    }

    // Refresh the AI's response (regenerate last AI message)
    async refreshAIMessage(messageId) {
        if (this.isProcessing) {
            this.showToast('Please wait for current response to finish', 'warning');
            return;
        }

        // Find the AI message to refresh in allMessages
        const aiMessageIndex = this.allMessages.findIndex(m => m.id === messageId);
        if (aiMessageIndex === -1) {
            this.showToast('Message not found', 'error');
            return;
        }

        const aiMessage = this.allMessages[aiMessageIndex];
        if (aiMessage.type !== 'ai') {
            this.showToast('Can only refresh AI messages', 'error');
            return;
        }

        // Find the user message that prompted this AI response
        let userMessage = '';
        for (let i = aiMessageIndex - 1; i >= 0; i--) {
            if (this.allMessages[i].type === 'user') {
                userMessage = this.allMessages[i].content;
                break;
            }
        }

        if (!userMessage) {
            this.showToast('No user message found to regenerate from', 'error');
            return;
        }

        // Remove the current AI message from allMessages
        this.allMessages.splice(aiMessageIndex, 1);
        this.updateVisibleMessages();
        this.renderMessages();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            this.isProcessing = true;
            
            // Get chat history up to the point before this AI message (from allMessages)
            const chatHistory = this.allMessages
                .slice(0, aiMessageIndex)
                .filter(m => !m.isWelcome)
                .map(m => ({ type: m.type, content: m.content }));

            // Get the active main prompt content if available
            let activeMainPrompt = null;
            if (this.promptManager) {
                const mainPrompt = this.promptManager.getActiveMainPrompt();
                activeMainPrompt = mainPrompt ? mainPrompt.content : null;
            }

            const response = await fetch('/api/llm/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    message: userMessage,
                    chatHistory: chatHistory,
                    settings: {
                        ...this.settings,
                        userContext: this.getUserContext(),
                        activeMainPrompt: activeMainPrompt
                    }
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.removeTypingIndicator();
                this.addMessage('ai', result.response);
                this.showToast('Response regenerated', 'success');
            } else {
                throw new Error(result.error || 'Failed to regenerate response');
            }

        } catch (error) {
            console.error('Error refreshing AI message:', error);
            this.removeTypingIndicator();
            
            // Show user-friendly error message
            let errorMessage = "I'm having trouble regenerating the response. ";
            
            if (error.message.includes('API key')) {
                errorMessage += "Please check your API key in Settings.";
            } else if (error.message.includes('provider')) {
                errorMessage += "Please check your provider configuration in Settings.";
            } else {
                errorMessage += "Please try again or check your Settings.";
            }
            
            this.addMessage('ai', errorMessage);
            this.showToast(error.message, 'error');
        } finally {
            this.isProcessing = false;
        }
    }

    // Clear entire chat
    async clearChat() {
        if (this.messages.length <= 1) { // Only welcome message
            return;
        }
        
        if (confirm('Are you sure you want to clear the entire chat? This cannot be undone.')) {
            // Keep only welcome message
            this.allMessages = this.allMessages.filter(m => m.isWelcome);
            this.messages = this.messages.filter(m => m.isWelcome);
            
            // Reset current chat tracking
            this.resetCurrentChat();
            
            // Clear active chat file
            await this.clearActiveChat();
            
            this.renderMessages();
            this.showToast('Chat cleared', 'info');
        }
    }

    // Toggle quick prompts dropdown
    toggleQuickPrompts() {
        const dropdown = document.getElementById('quick-prompts-dropdown');
        
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        } else {
            this.populateQuickPrompts();
            dropdown.classList.add('show');
        }
    }

    // Load quick prompts from server (add this method)
    async loadQuickPrompts() {
        try {
            // Use prompt manager if available to get both default and custom prompts
            if (this.promptManager) {
                const allPrompts = this.promptManager.getAllPromptsForType('quickPrompts');
                const quickPromptsObj = {};
                
                allPrompts.forEach(prompt => {
                    // Use the prompt content as both key and value for compatibility
                    quickPromptsObj[prompt.id] = prompt.content;
                });
                
                return quickPromptsObj;
            }
            
            // Fallback to server call for default prompts only
            const response = await fetch('/api/cowriter/quick-prompts');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.quickPrompts = result.quickPrompts;
                    return this.quickPrompts;
                }
            }
        } catch (error) {
            console.error('Error loading quick prompts:', error);
        }
        
        // Fallback - empty object
        return {};
    }

    // Populate quick prompts dropdown  
    async populateQuickPrompts() {
        const dropdown = document.getElementById('quick-prompts-dropdown');
        if (!dropdown) return;
        
        const quickPrompts = await this.loadQuickPrompts();
        
        dropdown.innerHTML = '';
        
        Object.entries(quickPrompts).forEach(([key, prompt]) => {
            const item = document.createElement('div');
            item.className = 'quick-prompt-item';
            item.textContent = prompt;
            item.addEventListener('click', () => {
                this.insertQuickPrompt(prompt);
            });
            dropdown.appendChild(item);
        });
}

    // Insert selected quick prompt into input
    insertQuickPrompt(prompt) {
        const input = document.getElementById('chat-input');
        if (input) {
            const currentValue = input.value;
            const newValue = currentValue ? `${currentValue}\n\n${prompt} ` : `${prompt} `;
            
            input.value = newValue;
            input.focus();
            
            // Position cursor at the end
            setTimeout(() => {
                input.setSelectionRange(input.value.length, input.value.length);
            }, 0);
        }
        
        // Close dropdown
        document.getElementById('quick-prompts-dropdown').classList.remove('show');
    }

    // =============================================================================
    // SETTINGS FUNCTIONALITY
    // =============================================================================

    // Open settings modal
    openSettings() {
        // Show modal immediately
        document.getElementById('cowriter-settings-modal').style.display = 'flex';
        
        // Load content asynchronously without blocking
        this.populateSettings();
    }

    // Close settings modal
    closeSettings() {
        document.getElementById('cowriter-settings-modal').style.display = 'none';
    }

    // Switch settings tabs
    switchSettingsTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.cowriter-settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.cowriter-settings-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activate selected tab
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}-content`);

        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeContent.classList.add('active');
        }
    }

    // Populate settings with current values
    async populateSettings() {
        // Set immediate values first (no async needed)
        this.setImmediateSettings();
        
        // Load everything else in parallel
        await Promise.all([
            this.loadTonesAndStyles(),
            this.loadProviders(),
            this.populateWorldContextDropdown(),
            this.initializePromptManager().then(() => {
                if (this.promptManager) {
                    return this.promptManager.loadActiveSelections().then(() => {
                        this.promptManager.populateMainPromptDropdown();
                        this.promptManager.updateMainPromptDisplay();
                    });
                }
            })
        ]);
        
        // Load models AFTER providers are loaded (keep this separate since it's slow)
        // But don't await it - let it load in background
        this.loadModelsForProvider(this.settings.provider);
        
        // Update API status
        this.updateApiStatus();
    }

    // Set immediate settings that don't require async operations
    setImmediateSettings() {
        // Set current selections for dropdowns (they might be empty until data loads)
        const toneSelect = document.getElementById('tone-select');
        if (toneSelect) {
            toneSelect.value = this.settings.tone || '';
        }

        const styleSelect = document.getElementById('style-select');
        if (styleSelect) {
            styleSelect.value = this.settings.style || '';
        }

        const templateSelect = document.getElementById('template-select');
        if (templateSelect) {
            templateSelect.value = this.settings.templateId || '';
        }

        // API key handling
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) {
            apiKeyInput.value = this.settings.hasApiKey ? '••••••••••••••••' : '';
            apiKeyInput.placeholder = this.settings.hasApiKey ? 'API key configured (enter new key to change)' : 'Enter your API key...';
        }
        
        // Set provider dropdown
        const providerSelect = document.getElementById('provider-select');
        if (providerSelect) {
            providerSelect.value = this.settings.provider;
        }
        
        // Set loading state for models dropdown
        const modelSelect = document.getElementById('model-select');
        if (modelSelect) {
            modelSelect.innerHTML = '<option value="">Loading models...</option>';
        }
    }

    refreshDropdowns() {
        console.log('🔄 Refreshing CoWriter dropdowns with custom prompts...');
        this.loadTonesAndStyles();
        this.loadTemplates();
    }

        // Load available providers from server and populate dropdown
    async loadProviders() {
        try {
            const response = await fetch('/api/llm/providers');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const providerSelect = document.getElementById('provider-select');
                    if (providerSelect) {
                        // Clear existing options
                        providerSelect.innerHTML = '';
                        
                        // Add provider options
                        result.providers.forEach(provider => {
                            const option = document.createElement('option');
                            option.value = provider.id;
                            option.textContent = provider.name;
                            providerSelect.appendChild(option);
                        });
                        
                        // Set current selection
                        providerSelect.value = this.settings.provider;
                    }
                    
                    console.log(`✅ Loaded ${result.providers.length} providers`);
                    return result.providers;
                }
            }
        } catch (error) {
            console.error('Error loading providers:', error);
            // Fallback to hardcoded providers if API fails
            this.populateHardcodedProviders();
        }
    }

    // Fallback method for hardcoded providers
    populateHardcodedProviders() {
        const providerSelect = document.getElementById('provider-select');
        if (providerSelect) {
            providerSelect.innerHTML = `
                <option value="google">Google Gemini</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="openai">OpenAI GPT</option>
            `;
            providerSelect.value = this.settings.provider;
        }
    }

    // Handle model selection change
    handleModelSelection() {
        const modelSelect = document.getElementById('model-select');
        if (modelSelect && modelSelect.value) {
            this.settings.model = modelSelect.value;
            console.log('Model selected:', this.settings.model);
        }
    }

    // Load available tones and styles from server
   async loadTonesAndStyles() {
        try {
            // Load tones (including custom ones)
            const userContext = encodeURIComponent(JSON.stringify(this.getUserContext()));
            const tonesResponse = await fetch(`/api/cowriter/tones?userContext=${userContext}`);
            if (tonesResponse.ok) {
                const tonesResult = await tonesResponse.json();
                if (tonesResult.success) {
                    const toneSelect = document.getElementById('tone-select');
                    if (toneSelect) {
                        toneSelect.innerHTML = '<option value="">None</option>';
                        tonesResult.tones.forEach(tone => {
                            const option = document.createElement('option');
                            option.value = tone.value;
                            option.textContent = tone.label;
                            option.title = tone.description;
                            option.className = tone.isDefault ? 'default-option' : 'custom-option';
                            toneSelect.appendChild(option);
                        });
                    }
                }
            }

            // Load styles (including custom ones)
            const stylesResponse = await fetch(`/api/cowriter/styles?userContext=${userContext}`);
            if (stylesResponse.ok) {
                const stylesResult = await stylesResponse.json();
                if (stylesResult.success) {
                    const styleSelect = document.getElementById('style-select');
                    if (styleSelect) {
                        styleSelect.innerHTML = '<option value="">None</option>';
                        stylesResult.styles.forEach(style => {
                            const option = document.createElement('option');
                            option.value = style.value;
                            option.textContent = style.label;
                            option.title = style.description;
                            option.className = style.isDefault ? 'default-option' : 'custom-option';
                            styleSelect.appendChild(option);
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error loading tones and styles:', error);
        }
    }

    // Load available templates from server
       async loadTemplates() {
        try {
            const userContext = encodeURIComponent(JSON.stringify(this.getUserContext()));
            const response = await fetch(`/api/cowriter/templates?userContext=${userContext}`);
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const templateSelect = document.getElementById('template-select');
                    if (templateSelect) {
                        templateSelect.innerHTML = '<option value="">None</option>';
                        
                        result.templates.forEach(template => {
                            const option = document.createElement('option');
                            option.value = template.id;
                            option.textContent = template.name;
                            option.title = template.description;
                            option.className = template.isDefault ? 'default-option' : 'custom-option';
                            templateSelect.appendChild(option);
                        });
                        
                        // Set current selection
                        templateSelect.value = this.settings.templateId || '';
                    }
                }
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    // =============================================================================
    // WORLD CONTEXT FUNCTIONALITY
    // =============================================================================

    // Open world context modal for editing
    editWorldContext() {
        const selectedContext = document.getElementById('world-context-select').value;
        
        if (selectedContext) {
            // Load existing context
            const context = this.savedWorldContexts.find(c => c.id === selectedContext);
            if (context) {
                this.openWorldContextModal('edit', context);
            }
        } else {
            this.showToast('Please select a world context to edit', 'warning');
        }
    }

    // Open world context modal for new context
    newWorldContext() {
        this.openWorldContextModal('new');
    }

    // Open world context modal
    openWorldContextModal(mode, context = null) {
        const modal = document.getElementById('world-context-modal');
        const title = document.getElementById('world-context-modal-title');
        const nameInput = document.getElementById('context-name');
        const contentTextarea = document.getElementById('context-content');
        const deleteBtn = document.getElementById('delete-world-context');
        
        if (mode === 'edit' && context) {
            title.textContent = 'Edit World Context';
            nameInput.value = context.name;
            contentTextarea.value = context.content;
            deleteBtn.style.display = 'block';
            modal.dataset.editingId = context.id;
        } else {
            title.textContent = 'New World Context';
            nameInput.value = '';
            contentTextarea.value = '';
            deleteBtn.style.display = 'none';
            delete modal.dataset.editingId;
        }
        
        modal.style.display = 'flex';
        nameInput.focus();
    }

    // Close world context modal
    closeWorldContextModal() {
        document.getElementById('world-context-modal').style.display = 'none';
    }

    // Save world context
    async saveWorldContext() {
        const nameInput = document.getElementById('context-name');
        const contentTextarea = document.getElementById('context-content');
        const modal = document.getElementById('world-context-modal');
        
        const name = nameInput.value.trim();
        const content = contentTextarea.value.trim();
        
        if (!name) {
            this.showToast('Please enter a name for this context', 'warning');
            nameInput.focus();
            return;
        }

        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to save world contexts', 'warning');
            return;
        }

        const isEditing = modal.dataset.editingId;
        let worldContext;
        
        if (isEditing) {
            // Update existing context
            worldContext = this.savedWorldContexts.find(c => c.id === isEditing);
            if (worldContext) {
                worldContext.name = name;
                worldContext.content = content;
                worldContext.lastModified = Date.now();
            }
        } else {
            // Create new context
            worldContext = {
                id: this.generateContextId(),
                name: name,
                content: content,
                created: Date.now(),
                lastModified: Date.now()
            };
            this.savedWorldContexts.push(worldContext);
        }

        try {
            // Save to server
            const response = await fetch('/api/cowriter/prompts/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    worldContext: worldContext
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.populateWorldContextDropdown();
                this.closeWorldContextModal();
                this.showToast(`World context ${isEditing ? 'updated' : 'saved'}`, 'success');
            } else {
                throw new Error(result.error || 'Failed to save world context');
            }
        } catch (error) {
            console.error('Error saving world context:', error);
            this.showToast('Failed to save world context', 'error');
        }
    }

    // Delete world context
    async deleteWorldContext() {
        const modal = document.getElementById('world-context-modal');
        const contextId = modal.dataset.editingId;
        
        if (!contextId) return;
        
        if (confirm('Are you sure you want to delete this world context? This cannot be undone.')) {
            try {
                const response = await fetch(`/api/cowriter/prompts/${contextId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userContext: this.getUserContext()
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Remove from local array
                    this.savedWorldContexts = this.savedWorldContexts.filter(c => c.id !== contextId);
                    
                    this.populateWorldContextDropdown();
                    this.closeWorldContextModal();
                    this.showToast('World context deleted', 'info');
                } else {
                    throw new Error(result.error || 'Failed to delete world context');
                }
            } catch (error) {
                console.error('Error deleting world context:', error);
                this.showToast('Failed to delete world context', 'error');
            }
        }
    }

    // Populate world context dropdown
    async populateWorldContextDropdown() {
        const select = document.getElementById('world-context-select');
        if (!select) return;
        
        select.innerHTML = '<option value="">None Selected</option>';
        
        this.savedWorldContexts.forEach(context => {
            const option = document.createElement('option');
            option.value = context.id;
            option.textContent = context.name;
            select.appendChild(option);
        });
        
        // Set current selection if we have a worldContextId in settings
        if (this.settings.worldContextId) {
            select.value = this.settings.worldContextId;
            this.loadWorldContext(this.settings.worldContextId);
        }
        
        // Update preview
        this.updateContextPreview();
    }

    // Load selected world context
    loadWorldContext(contextId) {
        this.settings.worldContextId = contextId;
        
        if (!contextId) {
            this.settings.worldContext = '';
        } else {
            const context = this.savedWorldContexts.find(c => c.id === contextId);
            if (context) {
                this.settings.worldContext = context.content;
            }
        }
        
        this.updateContextPreview();
    }

    // Update context preview text
    updateContextPreview() {
        const preview = document.getElementById('context-preview-text');
        if (preview) {
            if (this.settings.worldContext) {
                const truncated = this.settings.worldContext.length > 200 
                    ? this.settings.worldContext.substring(0, 200) + '...'
                    : this.settings.worldContext;
                preview.textContent = truncated;
            } else {
                preview.textContent = 'No world context selected';
            }
        }
    }

    // =============================================================================
    // CHAT MANAGEMENT
    // =============================================================================

    // Open chat manager modal
    // REPLACE THIS ENTIRE METHOD
    async openSaveChatModal() {
        const modal = document.getElementById('save-chat-modal');
        const nameInput = document.getElementById('chat-save-name');
        
        if (nameInput) {
            if (this.currentChatId && this.currentChatName) {
                nameInput.value = this.currentChatName;
            } else {
                const date = new Date().toLocaleDateString();
                nameInput.value = `Chat Session - ${date}`;
            }
        }
        
        // FIXED: Load chats first so we have folder data
        try {
            await this.loadChatsFromServer();
        } catch (error) {
            console.error('Error loading chats for folder dropdown:', error);
            // Continue anyway - user can still type a folder name
        }
        
        modal.style.display = 'flex';
    }

    openLoadChatModal() {
        const modal = document.getElementById('load-chat-modal');
        modal.style.display = 'flex';
        this.loadSavedChats();
    }

    // Save current chat
    async saveCurrentChat() {
        if (!this.isUserLoggedIn()) {
            this.showToast('Please log in to save chats', 'warning');
            return;
        }

        const nameInput = document.getElementById('chat-save-name');
        const folderInput = document.getElementById('chat-save-folder');
        const name = nameInput.value.trim();
        const folder = folderInput.value.trim() || 'Uncategorized';
        
        if (!name) {
            this.showToast('Please enter a name for this chat', 'warning');
            nameInput.focus();
            return;
        }

        if (this.messages.length <= 1) { // Only welcome message
            this.showToast('No messages to save', 'warning');
            return;
        }

        // Check if we're overwriting (same name + same folder)
        const existingChat = this.savedChats.find(c => c.name === name && c.folder === folder);
        
        if (existingChat) {
            // Show confirmation dialog and return early
            const chatData = {
                ...existingChat,
                messages: this.messages.filter(m => !m.isWelcome),
                lastModified: Date.now(),
                settings: { ...this.settings }
                // Keep original created date, id, and folder
            };
            this.showOverwriteConfirmation(name, folder, chatData);
            return;
        }

        // No conflict - proceed with new chat save
        const chatData = this.createNewChatData(name, folder);

        try {
            await this.saveChatToServer(chatData, false);
            
            // Update current tracking
            this.currentChatId = chatData.id;
            this.currentChatName = chatData.name;
            
            document.getElementById('save-chat-modal').style.display = 'none';
            this.showToast('Chat saved', 'success');
        } catch (error) {
            this.showToast('Failed to save chat', 'error');
        }
    }

    showOverwriteConfirmation(chatName, folderName, chatData) {
        document.getElementById('overwrite-message').textContent = 
            `A chat named "${chatName}" already exists in "${folderName}". Do you want to overwrite it?`;
        
        this.pendingOverwriteData = chatData;
        document.getElementById('overwrite-confirm-modal').style.display = 'flex';
    }

    async confirmOverwrite() {
        if (this.pendingOverwriteData) {
            try {
                await this.saveChatToServer(this.pendingOverwriteData, true);
                this.currentChatId = this.pendingOverwriteData.id;
                this.currentChatName = this.pendingOverwriteData.name;
                document.getElementById('overwrite-confirm-modal').style.display = 'none';
                document.getElementById('save-chat-modal').style.display = 'none';
                this.showToast('Chat updated', 'success');
            } catch (error) {
                this.showToast('Failed to save chat', 'error');
            }
            this.pendingOverwriteData = null;
        }
    }

    // Create new chat data object
    createNewChatData(name, folder = 'Uncategorized') {
        return {
            id: this.generateChatId(),
            name: name,
            folder: folder,  // ADD THIS LINE
            messages: this.messages.filter(m => !m.isWelcome),
            created: Date.now(),
            lastModified: Date.now(),
            settings: { ...this.settings }
        };
    }

    // Load saved chats list
    async loadSavedChats() {
        const container = document.getElementById('chats-by-folder');
        
        // Show loading
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading saved chats...</p>
            </div>
        `;
        
        try {
            await this.loadChatsFromServer();
            
            if (this.savedChats.length === 0) {
                container.innerHTML = `
                    <div class="chat-empty">
                        <i class="fas fa-comments"></i>
                        <h3>No Saved Chats</h3>
                        <p>Your saved conversations will appear here.</p>
                    </div>
                `;
                return;
            }
            
            // Group chats by folder
            this.renderChatsByFolder(container);
            
        } catch (error) {
            console.error('Error loading saved chats:', error);
            container.innerHTML = `
                <div class="chat-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Chats</h3>
                    <p>Unable to load saved chats. Please try again.</p>
                </div>
            `;
        }
    }

    // Render chats grouped by folder
    renderChatsByFolder(container) {
        // Group chats by folder
        const chatsByFolder = {};
        
        this.savedChats.forEach(chat => {
            const folder = chat.folder || 'Uncategorized';
            if (!chatsByFolder[folder]) {
                chatsByFolder[folder] = [];
            }
            chatsByFolder[folder].push(chat);
        });
        
        // Sort each folder's chats by last modified
        Object.keys(chatsByFolder).forEach(folder => {
            chatsByFolder[folder].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        });
        
        // Sort folders: Uncategorized first, then alphabetically
        const sortedFolders = Object.keys(chatsByFolder).sort((a, b) => {
            if (a === 'Uncategorized') return -1;
            if (b === 'Uncategorized') return 1;
            return a.localeCompare(b);
        });
        
        container.innerHTML = '';
        
        sortedFolders.forEach(folder => {
            const folderElement = this.createFolderElement(folder, chatsByFolder[folder]);
            container.appendChild(folderElement);
        });
    }

    // Create folder element with chats
    createFolderElement(folderName, chats) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'chat-folder';
        
        const isUncategorized = folderName === 'Uncategorized';
        const chatCount = chats.length;
        
        folderDiv.innerHTML = `
            <div class="folder-header" data-folder="${folderName}">
                <div class="folder-info">
                    <i class="fas fa-chevron-down folder-toggle"></i>
                    <i class="fas fa-folder folder-icon"></i>
                    <span class="folder-name">${folderName}</span>
                    <span class="chat-count">(${chatCount})</span>
                </div>
                <div class="folder-actions">
                    ${!isUncategorized ? '<button class="folder-action-btn rename-folder" title="Rename folder"><i class="fas fa-edit"></i></button>' : ''}
                </div>
            </div>
            <div class="folder-content expanded">
                <div class="folder-chats"></div>
            </div>
        `;
        
        // Add chats to folder
        const chatsContainer = folderDiv.querySelector('.folder-chats');
        chats.forEach(chat => {
            const chatElement = this.createChatListItem(chat);
            chatsContainer.appendChild(chatElement);
        });
        
        // Add folder toggle functionality
        const folderHeader = folderDiv.querySelector('.folder-header');
        const folderContent = folderDiv.querySelector('.folder-content');
        const toggleIcon = folderDiv.querySelector('.folder-toggle');
        
        folderHeader.addEventListener('click', (e) => {
            if (e.target.closest('.folder-action-btn')) return; // Don't toggle when clicking action buttons
            
            folderContent.classList.toggle('expanded');
            toggleIcon.classList.toggle('fa-chevron-down');
            toggleIcon.classList.toggle('fa-chevron-right');
        });
        
        return folderDiv;
    }

    // Create chat list item
    createChatListItem(chat) {
        const chatDiv = document.createElement('div');
        chatDiv.className = 'chat-item';
        chatDiv.dataset.chatId = chat.id;
        
        const lastModified = new Date(chat.lastModified).toLocaleDateString();
        const messageCount = chat.messages?.length || 0;
        
        chatDiv.innerHTML = `
            <div class="chat-item-info">
                <div class="chat-item-name">${this.escapeHtml(chat.name)}</div>
                <div class="chat-item-meta">${messageCount} messages • ${lastModified}</div>
            </div>
            <div class="chat-item-actions">
                <button class="chat-item-btn load" data-chat-id="${chat.id}" title="Load chat">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button class="chat-item-btn delete" data-chat-id="${chat.id}" title="Delete chat">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const loadBtn = chatDiv.querySelector('.load');
        const deleteBtn = chatDiv.querySelector('.delete');
        
        if (loadBtn) {
            loadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.loadChat(chat.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSavedChat(chat.id);
            });
        }
        
        // Make entire item clickable to load
        chatDiv.addEventListener('click', () => {
            this.loadChat(chat.id);
        });
        
        return chatDiv;
    }

    // Load a saved chat
    async loadChat(chatId) {
        try {
            if (this.messages.length > 1) { // More than just welcome message
                if (!confirm('Loading this chat will replace your current conversation. Continue?')) {
                    return;
                }
            }

            // Fetch full chat data from server
            const userContext = encodeURIComponent(JSON.stringify(this.getUserContext()));
            const response = await fetch(`/api/cowriter/chats/${chatId}?userContext=${userContext}`);

            if (!response.ok) {
                throw new Error('Failed to load chat');
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to load chat');
            }

            const chat = result.chat;

            // Load chat messages
            this.messages = [
                ...this.messages.filter(m => m.isWelcome), // Keep welcome message
                ...chat.messages
            ];

            // Load chat settings if available
            if (chat.settings) {
                this.settings = { ...this.settings, ...chat.settings };
            }

            // Track the currently loaded chat
            this.currentChatId = chatId;
            this.currentChatName = chat.name;

            this.renderMessages();
            
            // Close the LOAD modal instead of the old combined one
            document.getElementById('load-chat-modal').style.display = 'none';
            
            this.showToast(`Loaded "${chat.name}"`, 'success');

        } catch (error) {
            console.error('Error loading chat:', error);
            this.showToast('Failed to load chat', 'error');
        }
    }

    // Delete saved chat
    async deleteSavedChat(chatId) {
        const chat = this.savedChats.find(c => c.id === chatId);
        if (!chat) return;
        
        if (confirm(`Are you sure you want to delete "${chat.name}"? This cannot be undone.`)) {
            this.savedChats = this.savedChats.filter(c => c.id !== chatId);
            
            // TODO: Delete from server
            await this.deleteChatFromServer(chatId);
            
            this.loadSavedChats(); // Refresh list
            this.showToast('Chat deleted', 'info');
        }
    }

    // =============================================================================
    // PROVIDER & API FUNCTIONALITY (Placeholder for now)
    // =============================================================================

    // Load models for selected provider
    async loadModelsForProvider(provider) {
        const modelSelect = document.getElementById('model-select');
        if (!modelSelect) return;
        
        modelSelect.innerHTML = '<option value="">Loading models...</option>';
        
        // ALSO LOAD THE API KEY FOR THIS PROVIDER
        await this.loadApiKeyForProvider(provider);
        
        try {
            const models = await this.fetchModelsFromProvider(provider);
            
            modelSelect.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.value;
                option.textContent = model.label;
                modelSelect.appendChild(option);
            });
            
            if (models.some(m => m.value === this.settings.model)) {
                modelSelect.value = this.settings.model;
            } else if (models.length > 0) {
                this.settings.model = models[0].value;
                modelSelect.value = this.settings.model;
            }
            
        } catch (error) {
            console.error('Error loading models:', error);
            this.showFallbackModels(provider);
        }
    }

    // Load API key for specific provider
    async loadApiKeyForProvider(provider) {
        try {
            const response = await fetch('/api/cowriter/api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    provider: provider
                })
            });

            const result = await response.json();
            
            const apiKeyInput = document.getElementById('api-key-input');
            if (apiKeyInput) {
                if (result.success && result.hasApiKey) {
                    // Show masked value for existing key
                    apiKeyInput.value = '••••••••••••••••';
                    apiKeyInput.placeholder = 'API key configured (enter new key to change)';
                    this.settings.hasApiKey = true;
                    this.settings.apiKey = ''; // Don't store the actual key in memory
                } else {
                    // No key found for this provider
                    apiKeyInput.value = '';
                    apiKeyInput.placeholder = 'Enter your API key...';
                    this.settings.hasApiKey = false;
                    this.settings.apiKey = '';
                }
            }
            
            // Update the provider in settings
            this.settings.provider = provider;
            
            // Update API status
            this.updateApiStatus();
            
        } catch (error) {
            console.error('Error loading API key for provider:', error);
            // Clear the field on error
            const apiKeyInput = document.getElementById('api-key-input');
            if (apiKeyInput) {
                apiKeyInput.value = '';
                apiKeyInput.placeholder = 'Enter your API key...';
            }
            this.settings.hasApiKey = false;
        }
    }

    // Fetch models from provider (real API call)
    async fetchModelsFromProvider(provider) {
        try {
            const userContext = encodeURIComponent(JSON.stringify(this.getUserContext()));
            const response = await fetch(`/api/llm/models/${provider}?userContext=${userContext}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log(`✅ Fetched ${result.models.length} models for ${provider}${result.fromAPI ? ' from API' : ' (fallback)'}`);
                return result.models;
            } else {
                throw new Error(result.error || 'Failed to get models');
            }
        } catch (error) {
            console.error(`Error fetching models for ${provider}:`, error);
            // Return fallback models
            return this.getFallbackModels(provider);
        }
    }

    // Get fallback models when API fails
    getFallbackModels(provider) {
        const fallbackModels = {
            'google': [
                { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
                { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
                { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
            ],
            'anthropic': [
                { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
                { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' }
            ],
            'openai': [  // <-- Add this
                { value: 'gpt-4o', label: 'GPT-4o' },
                { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
            ]
        };
        
        return fallbackModels[provider] || [];
    }

    // Show fallback models when API fails
    showFallbackModels(provider) {
        const modelSelect = document.getElementById('model-select');
        const models = this.getFallbackModels(provider);
        
        modelSelect.innerHTML = '';
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.label;
            modelSelect.appendChild(option);
        });
        
        if (models.length > 0) {
            // Try to keep current model if it exists in fallback list
            if (models.some(m => m.value === this.settings.model)) {
                modelSelect.value = this.settings.model;
            } else {
                this.settings.model = models[0].value;
                modelSelect.value = this.settings.model;
            }
        }
        
        this.showToast('Using cached model list (API unavailable)', 'info');
    }

    // Refresh models list
    async refreshModels() {
        await this.loadModelsForProvider(this.settings.provider);
    }

    // Toggle API key visibility
    toggleApiKeyVisibility() {
        const input = document.getElementById('api-key-input');
        const icon = document.querySelector('#toggle-api-key-btn i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // Update API status indicator
    updateApiStatus() {
        const indicator = document.getElementById('status-indicator');
        const text = document.getElementById('status-text');
        
        if (!this.settings.hasApiKey && !this.settings.apiKey) {
            indicator.className = 'status-indicator';
            text.textContent = 'No API key configured';
        } else {
            indicator.className = 'status-indicator'; // Will be 'connected' after test
            text.textContent = 'API key configured (click Test to verify)';
        }
    }

    // Test API connection
    async testConnection() {
        if (!this.settings.hasApiKey) {
            this.showToast('Please enter an API key first', 'warning');
            return;
        }
        
        const testBtn = document.getElementById('test-connection-btn');
        const originalText = testBtn.innerHTML;
        
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        testBtn.disabled = true;
        
        try {
            const response = await fetch('/api/llm/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    provider: this.settings.provider,
                    model: this.settings.model
                })
            });

            const result = await response.json();
            
            const indicator = document.getElementById('status-indicator');
            const text = document.getElementById('status-text');

            if (response.ok && result.success) {
                indicator.className = 'status-indicator connected';
                text.textContent = 'Connection successful';
                this.showToast('Connection test successful!', 'success');
            } else {
                indicator.className = 'status-indicator error';
                text.textContent = result.error || 'Connection failed';
                this.showToast(result.error || 'Connection test failed', 'error');
            }
        } catch (error) {
            console.error('Connection test error:', error);
            
            const indicator = document.getElementById('status-indicator');
            const text = document.getElementById('status-text');
            
            indicator.className = 'status-indicator error';
            text.textContent = 'Connection failed';
            
            this.showToast('Connection test failed', 'error');
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    // =============================================================================
    // SERVER COMMUNICATION (Placeholder methods)
    // =============================================================================

    // Load user settings from server
    async loadUserSettings() {
        try {
            if (!this.isUserLoggedIn()) {
                console.log('CoWriter: Guest user, using default settings');
                // Still load world contexts and chats as empty for UI consistency
                this.savedWorldContexts = [];
                this.savedChats = [];
                return;
            }

            console.log('🔧 Loading CoWriter settings from server...');

            const response = await fetch('/api/cowriter/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Merge with current settings, keeping any runtime values
                    this.settings = { ...this.settings, ...result.settings };
                    console.log('✅ Loaded CoWriter settings:', this.settings);
                }
            } else {
                console.warn('Settings not found, using defaults');
            }
            
            // Always try to load world contexts and chats for logged-in users
            await this.loadWorldContextsFromServer();
            // Note: We don't auto-load chats list unless user opens the modal

        } catch (error) {
            console.error('Error loading CoWriter settings:', error);
            // Continue with defaults on error
        }
    }

    // Auto-save settings with debouncing to avoid too many requests
    autoSaveSettings() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        this.autoSaveTimeout = setTimeout(async () => {
            if (this.isUserLoggedIn()) {
                try {
                    await this.saveSettingsToServer();
                    console.log('✅ CoWriter settings auto-saved');
                } catch (error) {
                    console.error('Auto-save failed:', error);
                }
            }
        }, 1000); // Save after 1 second of no changes
    }

    // Extract the server save logic to reuse
    async saveSettingsToServer() {
        const response = await fetch('/api/cowriter/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userContext: this.getUserContext(),
                settings: this.settings
            })
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Failed to save settings');
        }
    }

    async saveSettings() {
        try {
            if (!this.isUserLoggedIn()) {
                this.showToast('Please log in to save settings', 'warning');
                return;
            }

            await this.saveSettingsToServer(); // Use the extracted method
            this.showToast('Settings saved', 'success');
            console.log('✅ CoWriter settings saved');
            
            // Refresh models after successful save, especially if API key changed
            await this.loadModelsForProvider(this.settings.provider);
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast('Failed to save settings', 'error');
        }
    }

    // Save world contexts to server
    async saveWorldContextsToServer() {
        // This method is called after individual context saves
        // The actual saving is handled by saveWorldContext()
        console.log('World contexts updated on server');
    }

    // Load world contexts from server
    async loadWorldContextsFromServer() {
        try {
            if (!this.isUserLoggedIn()) {
                this.savedWorldContexts = [];
                return;
            }

            const response = await fetch('/api/cowriter/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.savedWorldContexts = result.worldContexts || [];
                    console.log(`✅ Loaded ${this.savedWorldContexts.length} world contexts`);
                }
            }
        } catch (error) {
            console.error('Error loading world contexts:', error);
            this.savedWorldContexts = [];
        }
    }

    // Populate folder suggestions for save dropdown
    populateFolderSuggestions() {
        const datalist = document.getElementById('folder-suggestions');
        if (!datalist) return;
        
        // Get unique folders from saved chats
        const folders = [...new Set(this.savedChats.map(chat => chat.folder || 'Uncategorized'))];
        folders.sort();
        
        datalist.innerHTML = '';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            datalist.appendChild(option);
        });
    }

    // Save chat to server
    async saveChatToServer(chatData, isOverwrite = false) {
        try {
            if (!this.isUserLoggedIn()) {
                throw new Error('Please log in to save chats');
            }

            const response = await fetch('/api/cowriter/chats/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext(),
                    chatData: chatData,
                    isOverwrite: isOverwrite
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                if (isOverwrite) {
                    // Update existing chat in local array
                    const index = this.savedChats.findIndex(c => c.id === chatData.id);
                    if (index !== -1) {
                        this.savedChats[index] = chatData;
                    }
                } else {
                    // Add new chat to local array
                    this.savedChats.push(chatData);
                }
                console.log(`✅ ${isOverwrite ? 'Updated' : 'Saved'} chat:`, chatData.name, `(folder: ${chatData.folder})`);
            } else {
                throw new Error(result.error || 'Failed to save chat');
            }
        } catch (error) {
            console.error('Error saving chat:', error);
            throw error;
        }
    }

    // Reset current chat tracking (call when starting fresh)
    resetCurrentChat() {
        this.currentChatId = null;
        this.currentChatName = null;
    }

    // Load chats from server
    async loadChatsFromServer() {
        try {
            if (!this.isUserLoggedIn()) {
                this.savedChats = [];
                return;
            }

            const response = await fetch('/api/cowriter/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Ensure all chats have a folder field
                    this.savedChats = (result.chats || []).map(chat => ({
                        ...chat,
                        folder: chat.folder || 'Uncategorized' // Add default folder if missing
                    }));
                    console.log(`✅ Loaded ${this.savedChats.length} saved chats`);
                    console.log('📂 Chat data with folders:', this.savedChats.map(chat => ({ 
                        name: chat.name, 
                        folder: chat.folder 
                    })));
                }
            }
        } catch (error) {
            console.error('Error loading chats:', error);
            this.savedChats = [];
            throw error;
        }
    }

    // Delete chat from server
    async deleteChatFromServer(chatId) {
        try {
            const response = await fetch(`/api/cowriter/chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userContext: this.getUserContext()
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('✅ Deleted chat from server:', chatId);
            } else {
                throw new Error(result.error || 'Failed to delete chat');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            throw error;
        }
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    // Update send button state
    updateSendButton(isLoading) {
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            if (isLoading) {
                sendBtn.classList.add('loading');
                sendBtn.disabled = true;
            } else {
                sendBtn.classList.remove('loading');
                sendBtn.disabled = false;
            }
        }
    }

    // Scroll chat to bottom
    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 50);
        }
    }

    // Generate unique IDs
    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateContextId() {
        return 'ctx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Toast notifications (uses existing system)
    showToast(message, type = 'info') {
        if (window.authManager && window.authManager.showToast) {
            window.authManager.showToast(message, type);
        } else {
            // Fallback toast implementation
            console.log(`Toast (${type}): ${message}`);
        }
    }

    // =============================================================================
    // PUBLIC METHODS (Called from main.js)
    // =============================================================================

    // Called when user logs in
    onUserLoggedIn() {
        console.log('CoWriter: User logged in, refreshing data');
        if (this.promptManager) {
            this.promptManager.onUserLoggedIn();
        }
        this.loadUserSettings().then(() => {
            // Refresh dropdowns to include user's custom prompts
            this.refreshDropdowns();
        });
    }

    // Called when user logs out  
    onUserLoggedOut() {
        console.log('CoWriter: User logged out, clearing data');
        if (this.promptManager) {
            this.promptManager.onUserLoggedOut();
        }
        this.clearUserData();
        // Refresh dropdowns to remove custom prompts
        this.refreshDropdowns();
    }

    // Called when accessing as guest
    onGuestAccess() {
        console.log('CoWriter: Guest access - limited functionality');
        this.showGuestLimitationsMessage();
    }

    // Show guest limitations message
    showGuestLimitationsMessage() {
        // Only show if chat is empty (just welcome message)
        if (this.messages.length <= 1) {
            const guestMessage = `You're using CoWriter as a guest! 🎭

You can chat with me and use all the creative writing features, but:
• Your conversations won't be saved between sessions
• You can't save world contexts or settings
• You'll need to re-enter your API key each time

Log in to unlock the full CoWriter experience with persistent chats, world contexts, and saved settings!`;

            this.addMessage('ai', guestMessage);
        }
    }

    // Clear user-specific data
    clearUserData() {
        this.savedWorldContexts = [];
        this.savedChats = [];
        this.settings = {
            style: 'collaborative',
            worldContext: '',
            worldContextId: '',
            provider: 'google',
            model: 'gemini-2.0-flash-exp',
            apiKey: '',
            hasApiKey: false
        };
        
        // Reset to welcome message only
        this.messages = this.messages.filter(m => m.isWelcome);
        this.renderMessages();
        
        // Clear any open modal state
        this.currentEditingId = null;
    }

    // Check if user is logged in
    isUserLoggedIn() {
        const currentUser = window.authManager?.getCurrentUser();
        return currentUser && !currentUser.isGuest;
    }

    // Get user context for API calls
    getUserContext() {
        if (window.authManager) {
            return window.authManager.getUserContext();
        }
        return { isGuest: true };
    }

    // Setup expand text functionality
    setupExpandModal() {
        let currentTargetField = null;

        // Function to close modal and sync content
        const closeModal = () => {
            if (currentTargetField) {
                // Copy content back to original field
                currentTargetField.value = document.getElementById('cowriter-expanded-textarea').value;
                
                // Trigger input event to update any listeners
                const inputEvent = new Event('input', { bubbles: true });
                currentTargetField.dispatchEvent(inputEvent);
            }
            
            document.getElementById('cowriter-text-expand-modal').style.display = 'none';
            currentTargetField = null;
        };

        // Handle expand button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.expand-text-btn')) {
                const fieldId = e.target.closest('.expand-text-btn').getAttribute('data-field');
                const targetField = document.getElementById(fieldId);
                
                if (targetField) {
                    currentTargetField = targetField;
                    
                    // Populate modal with current content
                    document.getElementById('cowriter-expanded-textarea').value = targetField.value;
                    
                    // Show modal
                    document.getElementById('cowriter-text-expand-modal').style.display = 'flex';
                    
                    // Focus and select all text in expanded textarea
                    setTimeout(() => {
                        const expandedTextarea = document.getElementById('cowriter-expanded-textarea');
                        expandedTextarea.focus();
                        expandedTextarea.select();
                    }, 100);
                }
            }
        });

        // Close button
        document.getElementById('close-cowriter-expand')?.addEventListener('click', closeModal);

        // Close on background click
        document.getElementById('cowriter-text-expand-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cowriter-text-expand-modal') {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('cowriter-text-expand-modal').style.display === 'flex') {
                closeModal();
            }
        });
    }

    // Add custom prompt styles
    addCustomPromptStyles() {
        // Add styles for custom prompt management UI
        const style = document.createElement('style');
        style.textContent = `
            .prompt-controls {
                display: flex;
                gap: var(--space-sm);
                align-items: center;
                margin-bottom: var(--space-md);
            }
            
            .prompt-btn {
                padding: var(--space-xs) var(--space-sm);
                border: 1px solid var(--border-primary);
                background: var(--bg-secondary);
                color: var(--text-primary);
                border-radius: var(--radius-sm);
                cursor: pointer;
            }
            
            .prompt-btn:hover {
                background: var(--bg-tertiary);
            }
            
            .prompt-btn.delete {
                color: var(--danger-color);
            }
            
            .prompt-select {
                flex: 1;
                padding: var(--space-xs);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-sm);
                background: var(--bg-tertiary);
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize CoWriter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other managers are ready
    setTimeout(() => {
        const coWriterManager = new CoWriterManager();
        
        // Make available globally
        window.coWriterManager = coWriterManager;
        
        console.log('✅ CoWriter manager initialized');
    }, 200);
});

// Make CoWriter integration available to main.js
window.initializeCoWriter = function() {
    if (!window.coWriterManager) {
        window.coWriterManager = new CoWriterManager();
    }
};

// Handle user session changes (integrate with existing auth system)
window.addEventListener('cowriter-user-login', () => {
    if (window.coWriterManager) {
        window.coWriterManager.onUserLoggedIn();
    }
});

window.addEventListener('cowriter-user-logout', () => {
    if (window.coWriterManager) {
        window.coWriterManager.onUserLoggedOut();
    }
});