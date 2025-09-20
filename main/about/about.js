// About JavaScript - Enhanced About Modal with Section Navigation

class AboutManager {
    constructor() {
        this.aboutData = null;
        this.currentSection = null;
        this.studioIconSvg = null;
        this.initializeAbout();
    }

    // Initialize about system
    async initializeAbout() {
        await this.loadAboutData();
        this.setupEventListeners();
    }

    // Load about content from JSON
    async loadAboutData() {
        try {
            const response = await fetch('about/about.json');
            if (!response.ok) {
                throw new Error('Failed to load about data');
            }
            this.aboutData = await response.json();
            console.log('✅ About data loaded successfully');
        } catch (error) {
            console.error('Error loading about data:', error);
            // Fallback data
            this.aboutData = {
                title: "About Creator's Toolkit",
                studio: "Narrative Studios",
                sections: [],
                developer: {
                    name: "Narrative Studios",
                    tagline: "Tools for storytellers, by storytellers",
                    contact: "hello@narrativestudios.dev"
                },
                links: {}
            };
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // About button
        const aboutBtn = document.getElementById('about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this.openAbout();
            });
        }

        // Close about
        const closeBtn = document.getElementById('close-about');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeAbout();
            });
        }

        // Close on overlay click
        const modal = document.getElementById('about-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'about-modal') {
                    this.closeAbout();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('about-modal');
                if (modal && modal.style.display === 'flex') {
                    this.closeAbout();
                }
            }
        });
    }

    // Open about modal
    openAbout() {
        if (!this.aboutData) {
            this.showToast('About information not available', 'error');
            return;
        }

        this.populateAboutModal();
        const modal = document.getElementById('about-modal');
        if (modal) {
            // Force the modal back to body level if it got moved
            if (modal.parentElement !== document.body) {
                console.log('🔧 Moving About modal back to body');
                document.body.appendChild(modal);
            }
            modal.style.display = 'flex';
            
            // Show first section by default
            if (this.aboutData.sections.length > 0) {
                this.showSection(this.aboutData.sections[0].id);
            }
        }
    }

    // Close about modal
    closeAbout() {
        const modal = document.getElementById('about-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentSection = null;
    }

    // Populate modal with content
    populateAboutModal() {
        // Update title
        const title = document.getElementById('about-title');
        if (title) {
            title.textContent = this.aboutData.title;
        }

        // Build table of contents
        this.buildTableOfContents();
        
        // Build main content area
        this.buildMainContent();
    }

    // Build table of contents navigation
    buildTableOfContents() {
        const tocList = document.querySelector('#about-toc .toc-list');
        if (!tocList) return;

        tocList.innerHTML = '';

        this.aboutData.sections.forEach(section => {
            const tocItem = document.createElement('div');
            tocItem.className = 'toc-item';

            // Main section button
            const sectionBtn = document.createElement('button');
            sectionBtn.className = 'toc-link';
            sectionBtn.textContent = section.title;
            sectionBtn.addEventListener('click', () => {
                this.showSection(section.id);
            });

            tocItem.appendChild(sectionBtn);

            // Subsections if any
            if (section.subsections && section.subsections.length > 0) {
                const subsectionsDiv = document.createElement('div');
                subsectionsDiv.className = 'toc-subsections';

                section.subsections.forEach(subsection => {
                    const subBtn = document.createElement('button');
                    subBtn.className = 'toc-sublink';
                    subBtn.textContent = subsection.title;
                    subBtn.addEventListener('click', () => {
                        this.showSection(section.id, subsection.id);
                    });
                    subsectionsDiv.appendChild(subBtn);
                });

                tocItem.appendChild(subsectionsDiv);
            }

            tocList.appendChild(tocItem);
        });
    }

    // Build main content area
    buildMainContent() {
        const mainContent = document.getElementById('about-section-content');
        if (!mainContent) return;

        // Clear existing content
        mainContent.innerHTML = '';

        // Create content for each section
        this.aboutData.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'about-section';
            sectionDiv.id = `section-${section.id}`;
            sectionDiv.style.display = 'none';

            // Section title
            const title = document.createElement('h2');
            title.textContent = section.title;
            sectionDiv.appendChild(title);

            // Section content
            if (section.content) {
                const content = document.createElement('p');
                content.textContent = section.content;
                sectionDiv.appendChild(content);
            }

            // Handle special sections
            if (section.id === 'tools') {
                this.buildToolsSection(sectionDiv, section);
            } else if (section.id === 'about-studio') {
                this.buildStudioSection(sectionDiv, section);
            } else {
                this.buildRegularSection(sectionDiv, section);
            }

            mainContent.appendChild(sectionDiv);
        });
    }

    // Build tools section with cards
    buildToolsSection(container, section) {
        const toolsGrid = document.createElement('div');
        toolsGrid.className = 'tools-grid';

        section.subsections.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';

            // Tool icon
            const iconClass = this.getToolIcon(tool.id);
            const icon = document.createElement('div');
            icon.className = 'tool-icon';
            icon.innerHTML = `<i class="${iconClass}"></i>`;

            // Tool title
            const title = document.createElement('h4');
            title.appendChild(icon);
            title.appendChild(document.createTextNode(tool.title));

            // Tool description
            const description = document.createElement('p');
            description.textContent = tool.content;

            toolCard.appendChild(title);
            toolCard.appendChild(description);
            toolsGrid.appendChild(toolCard);
        });

        container.appendChild(toolsGrid);
    }

    // Build studio section with special styling
    buildStudioSection(container, section) {
        // Studio info card
        const studioInfo = document.createElement('div');
        studioInfo.className = 'studio-info';

        // ADD THIS - Studio icon
        const studioIcon = document.createElement('div');
        studioIcon.className = 'studio-icon';
        
        // You can either use an SVG file or Font Awesome icon
        // For SVG file from images folder:
        const iconImg = document.createElement('img');
        iconImg.src = 'images/studio-icon.svg';  // Replace with your actual SVG filename
        iconImg.alt = 'Studio Icon';
        studioIcon.appendChild(iconImg);
        
        // OR if you want to use Font Awesome instead:
        // studioIcon.innerHTML = '<i class="fas fa-feather-alt"></i>';
        
        studioInfo.appendChild(studioIcon);  // Add this line

        const studioName = document.createElement('div');
        studioName.className = 'studio-name';
        studioName.textContent = this.aboutData.developer.name;

        const studioTagline = document.createElement('div');
        studioTagline.className = 'studio-tagline';
        studioTagline.textContent = this.aboutData.developer.tagline;

        const studioContact = document.createElement('div');
        studioContact.className = 'studio-contact';
        studioContact.textContent = this.aboutData.developer.contact;

        studioInfo.appendChild(studioName);
        studioInfo.appendChild(studioTagline);
        studioInfo.appendChild(studioContact);

        container.appendChild(studioInfo);

        // Regular subsections
        this.buildRegularSection(container, section);

        // Social links
        if (this.aboutData.links && Object.keys(this.aboutData.links).length > 0) {
            const linksTitle = document.createElement('h3');
            linksTitle.textContent = 'Connect With Us';
            container.appendChild(linksTitle);

            const socialLinks = document.createElement('div');
            socialLinks.className = 'social-links';

            Object.entries(this.aboutData.links).forEach(([platform, url]) => {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'social-link';
                
                // Set icon based on platform
                let iconClass = 'fas fa-external-link-alt';
                switch(platform.toLowerCase()) {
                    case 'github':
                        iconClass = 'fab fa-github';
                        break;
                    case 'discord':
                        iconClass = 'fab fa-discord';
                        break;
                    case 'support':
                        iconClass = 'fas fa-heart';
                        break;
                    case 'patreon':
                        iconClass = 'fab fa-patreon';
                        break;
                }
                
                link.innerHTML = `<i class="${iconClass}"></i><span>${platform}</span>`;
                socialLinks.appendChild(link);
            });

            container.appendChild(socialLinks);
        }
    }

    // Build regular section with subsections
    buildRegularSection(container, section) {
        if (section.subsections && section.subsections.length > 0) {
            section.subsections.forEach(subsection => {
                const subsectionDiv = document.createElement('div');
                subsectionDiv.className = 'subsection';
                subsectionDiv.id = `subsection-${section.id}-${subsection.id}`;

                const title = document.createElement('h4');
                title.textContent = subsection.title;

                const content = document.createElement('p');
                content.textContent = subsection.content;

                subsectionDiv.appendChild(title);
                subsectionDiv.appendChild(content);
                container.appendChild(subsectionDiv);
            });
        }
    }

    // Get tool icon class based on tool ID
    getToolIcon(toolId) {
        const icons = {
            'lore-codex': 'fas fa-globe',
            'rp-archiver': 'fas fa-file-alt', 
            'cowriter': 'fas fa-feather-alt',
            'my-sites': 'fas fa-th-large'
        };
        return icons[toolId] || 'fas fa-cog';
    }

    // Show specific section (and optionally subsection)
    showSection(sectionId, subsectionId = null) {
        // Hide all sections
        document.querySelectorAll('.about-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionId;

            // Update TOC active states
            this.updateTocActiveStates(sectionId, subsectionId);

            // If subsection specified, scroll to it
            if (subsectionId) {
                setTimeout(() => {
                    const subsectionElement = document.getElementById(`subsection-${sectionId}-${subsectionId}`);
                    if (subsectionElement) {
                        subsectionElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                }, 100);
            } else {
                // Scroll to top of section
                setTimeout(() => {
                    const aboutMain = document.querySelector('.about-main');
                    if (aboutMain) {
                        aboutMain.scrollTop = 0;
                    }
                }, 100);
            }
        }
    }

    // Update table of contents active states
    updateTocActiveStates(sectionId, subsectionId = null) {
        // Clear all active states
        document.querySelectorAll('.toc-link, .toc-sublink').forEach(link => {
            link.classList.remove('active');
        });

        // Find and activate the correct buttons
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
            const sectionBtn = item.querySelector('.toc-link');
            if (sectionBtn) {
                // Check if this is the active section
                const section = this.aboutData.sections.find(s => s.title === sectionBtn.textContent);
                if (section && section.id === sectionId) {
                    sectionBtn.classList.add('active');
                    
                    // If subsection is specified, activate that too
                    if (subsectionId) {
                        const subLinks = item.querySelectorAll('.toc-sublink');
                        subLinks.forEach(subLink => {
                            const subsection = section.subsections?.find(sub => sub.title === subLink.textContent);
                            if (subsection && subsection.id === subsectionId) {
                                subLink.classList.add('active');
                            }
                        });
                    }
                }
            }
        });
    }

    // Toast notifications (reuse from main system)
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize about system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aboutManager = new AboutManager();
});