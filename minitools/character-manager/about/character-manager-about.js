// Character Manager About System
// Manages the how-to guide modal

class CharacterManagerAbout {
    constructor() {
        this.aboutData = null;
        this.modalId = 'character-manager-about-modal';
        this.currentSection = null;
        this.isModalOpen = false;
    }

    // Initialize the about system
    async initialize() {
        await this.loadAboutData();
        this.setupEventListeners();
    }

    // Load about content from JSON
    async loadAboutData() {
        try {
            const response = await fetch('about/character-manager-about.json');
            if (!response.ok) {
                throw new Error('Failed to load about data');
            }
            this.aboutData = await response.json();
        } catch (error) {
            console.error('Error loading Character Manager about data:', error);
            // Fallback data
            this.aboutData = {
                title: "Character Manager Guide",
                sections: [
                    {
                        id: "error",
                        title: "Error",
                        content: "Could not load the help guide. Please check your connection and try again."
                    }
                ]
            };
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // About button click
        const aboutBtn = document.getElementById('character-manager-about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal();
            });
        }
    }

    // Open the about modal
    openModal() {
        if (!this.aboutData || this.isModalOpen) return;

        this.createModal();
        this.isModalOpen = true;
        
        // Focus on modal for accessibility
        setTimeout(() => {
            const modal = document.getElementById(this.modalId);
            if (modal) modal.focus();
        }, 100);
    }

    // Close the about modal
    closeModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                this.isModalOpen = false;
                this.currentSection = null;
            }, 300);
        }
    }

    // Create and inject modal into DOM
    createModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById(this.modalId);
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'modal-overlay character-manager-about-overlay';
        modal.innerHTML = this.getModalHTML();

        document.body.appendChild(modal);
        this.attachModalEventListeners();
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Show first section by default
        if (this.aboutData.sections && this.aboutData.sections.length > 0) {
            this.showSection(this.aboutData.sections[0].id);
        }
    }

    // Generate modal HTML
    getModalHTML() {
        const tableOfContents = this.generateTableOfContents();
        
        return `
            <div class="modal-content character-manager-about-content" tabindex="-1">
                <div class="modal-header">
                    <h2>${this.aboutData.title}</h2>
                    <button class="close-btn" id="character-manager-about-close" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="about-body">
                    <div class="about-sidebar">
                        <h3>Contents</h3>
                        ${tableOfContents}
                    </div>
                    
                    <div class="about-main">
                        <div id="about-section-content">
                            <!-- Section content will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate table of contents
    generateTableOfContents() {
        if (!this.aboutData.sections) return '<p>No content available.</p>';

        let html = '<div class="toc-list">';
        
        this.aboutData.sections.forEach(section => {
            html += `
                <div class="toc-item">
                    <button class="toc-link" data-section="${section.id}">
                        ${section.title}
                    </button>
                    ${section.subsections ? this.generateSubsectionTOC(section.subsections) : ''}
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // Generate subsection table of contents
    generateSubsectionTOC(subsections) {
        let html = '<div class="toc-subsections">';
        
        subsections.forEach(subsection => {
            html += `
                <button class="toc-sublink" data-section="${subsection.id}">
                    ${subsection.title}
                </button>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // Show a specific section
    showSection(sectionId) {
        const contentDiv = document.getElementById('about-section-content');
        if (!contentDiv) return;

        // Find the section or subsection
        let section = this.findSectionById(sectionId);
        if (!section) return;

        // Update current section
        this.currentSection = sectionId;

        // Update active states in TOC
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.querySelectorAll('.toc-link, .toc-sublink').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = modal.querySelector(`[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }

        // Generate and display content
        contentDiv.innerHTML = this.generateSectionHTML(section);
        contentDiv.scrollTop = 0;
    }

    // Find section by ID (including subsections)
    findSectionById(sectionId) {
        for (let section of this.aboutData.sections) {
            if (section.id === sectionId) {
                return section;
            }
            
            if (section.subsections) {
                for (let subsection of section.subsections) {
                    if (subsection.id === sectionId) {
                        return subsection;
                    }
                }
            }
        }
        return null;
    }

    // Generate HTML for a section
    generateSectionHTML(section) {
        let html = `<h2>${section.title}</h2>`;
        
        // Convert content with basic markdown-like formatting
        let content = section.content || '';
        content = content.replace(/\n\n/g, '</p><p>');
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/`(.*?)`/g, '<code>$1</code>');
        
        html += `<div class="section-content"><p>${content}</p></div>`;
        
        // Add subsections if they exist
        if (section.subsections) {
            html += '<div class="subsections">';
            section.subsections.forEach(subsection => {
                let subContent = subsection.content || '';
                subContent = subContent.replace(/\n\n/g, '</p><p>');
                subContent = subContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                subContent = subContent.replace(/`(.*?)`/g, '<code>$1</code>');
                
                html += `
                    <div class="subsection">
                        <h3>${subsection.title}</h3>
                        <div class="subsection-content"><p>${subContent}</p></div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        return html;
    }

    // Attach event listeners to modal elements
    attachModalEventListeners() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;

        // Close button
        const closeBtn = modal.querySelector('#character-manager-about-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // ESC key to close
        const handleKeydown = (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // Table of contents links
        modal.querySelectorAll('.toc-link, .toc-sublink').forEach(link => {
            link.addEventListener('click', (e) => {
                const sectionId = e.target.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });
    }
}

// Initialize the about system
let characterManagerAbout = null;

// Export for global use
window.initializeCharacterManagerAbout = async function() {
    if (!characterManagerAbout) {
        characterManagerAbout = new CharacterManagerAbout();
        await characterManagerAbout.initialize();
    }
    return characterManagerAbout;
};