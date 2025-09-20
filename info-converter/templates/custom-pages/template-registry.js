// Custom Pages Template Registry
import { universalTemplate } from './universal-template.js';

// Custom Pages Template Registry  
class CustomPageTemplateRegistry {
    constructor() {
        this.templates = new Map();
        this.initialized = false;
    }
    
    // Initialize the registry with available templates
    initialize() {
        if (this.initialized) return;
        
        // Register available templates
        // Register the universal template
        this.registerTemplate(universalTemplate);
        
        this.initialized = true;
        console.log(`Custom Pages Template Registry initialized with ${this.templates.size} templates`);
    }
    
    // Register a new template
    registerTemplate(template) {
        if (!template.id || !template.name) {
            console.error('Invalid template: missing id or name', template);
            return false;
        }
        
        // Validate required methods
        if (!template.generateHTML || !template.generateCSS) {
            console.error(`Template ${template.id} missing required methods`);
            return false;
        }
        
        this.templates.set(template.id, template);
        console.log(`Registered template: ${template.name} (${template.id})`);
        return true;
    }
    
    // Get template by ID
    getTemplate(templateId) {
        return this.templates.get(templateId);
    }
    
    // Get all available templates
    getAllTemplates() {
        return Array.from(this.templates.values());
    }
    
    // Get template options for dropdowns
    getTemplateOptions() {
        return this.getAllTemplates().map(template => ({
            value: template.id,
            label: template.name,
            description: template.description
        }));
    }
    
    // Validate element type against template
    validateElementType(templateId, elementType) {
        const template = this.getTemplate(templateId);
        if (!template) return false;
        
        return template.availableElements.some(element => element.type === elementType);
    }
    
    // Get available elements for a template
    getAvailableElements(templateId) {
        const template = this.getTemplate(templateId);
        if (!template) return [];
        
        return template.availableElements;
    }
    
    // Check if adding element would exceed limit
    canAddElement(templateId, elementType, currentElements) {
        const template = this.getTemplate(templateId);
        if (!template) return false;
        
        const elementDef = template.availableElements.find(el => el.type === elementType);
        if (!elementDef) return false;
        
        // Check max elements per page
        if (currentElements.length >= template.maxElements) return false;
        
        // Check element-specific limits
        if (elementDef.max === -1) return true; // Unlimited
        
        const existingCount = currentElements.filter(el => el.type === elementType).length;
        return existingCount < elementDef.max;
    }
    
    // Generate HTML for a page
    generatePageHTML(page, data) {
        const template = this.getTemplate(page.template);
        if (!template) {
            console.error(`Template not found: ${page.template}`);
            return `<div>Error: Template ${page.template} not found</div>`;
        }
        
        try {
            return template.generateHTML(page, data);
        } catch (error) {
            console.error(`Error generating HTML for page ${page.name}:`, error);
            return `<div>Error generating page content</div>`;
        }
    }
    
    // Generate CSS for all custom pages
    generateAllPagesCSS(pages, appearance, colors, fonts) {
        let css = `
        /* Custom Pages Base Styles */
        .custom-page-content {
            padding: var(--space-xl, 24px);
            margin: var(--space-lg, 20px) 0;
        }
        
        .custom-page-content h1,
        .custom-page-content h2,
        .custom-page-content h3 {
            margin-top: 0;
        }
        
        .custom-page-content p {
            margin: var(--space-md, 16px) 0;
        }
        
        .custom-page-content ul,
        .custom-page-content ol {
            margin: var(--space-md, 16px) 0;
            padding-left: var(--space-xl, 24px);
        }
        
        .custom-page-content hr {
            border: none;
            border-top: 1px solid ${colors.borderPrimary || '#ddd'};
            margin: var(--space-xl, 24px) 0;
        }
        
        .custom-page-content a {
            color: ${colors.accentPrimary || '#007acc'};
            text-decoration: none;
        }
        
        .custom-page-content a:hover {
            text-decoration: underline;
        }
        
        .custom-page-content strong {
            font-weight: 700;
        }
        
        .custom-page-content em {
            font-style: italic;
        }
        
        .custom-page-content del {
            text-decoration: line-through;
            opacity: 0.7;
        }
        `;
        
        // Generate template-specific CSS
        const usedTemplates = new Set(pages.map(page => page.template));
        
        for (const templateId of usedTemplates) {
            const template = this.getTemplate(templateId);
            if (template) {
                try {
                    css += '\n' + template.generateCSS(appearance, colors, fonts);
                } catch (error) {
                    console.error(`Error generating CSS for template ${templateId}:`, error);
                }
            }
        }
        
        return css;
    }
}

// Create global instance
window.customPageTemplates = new CustomPageTemplateRegistry();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.customPageTemplates) {
        window.customPageTemplates.initialize();
    }
});