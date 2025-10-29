// Theme Manager for Extractor
class ExtractorThemeManager {
    constructor() {
        this.themes = {};
        this.currentTheme = 'default';
        this.SHARED_THEME_KEY = 'writingTools_currentTheme';
        this.init();
    }

    async init() {
        await this.loadThemes();
        this.loadSharedTheme();
        this.setupStorageListener();
    }

    // Load themes from JSON
    async loadThemes() {
        try {
            // Load themes from shared themes.json in main app
            const response = await fetch('../themes/themes.json');
            this.themes = await response.json();
        } catch (error) {
            console.error('Failed to load themes in Extractor:', error);
            // Fallback to current theme if themes can't be loaded
            this.themes = { default: { name: "Default", colors: {} } };
        }
    }

    // Load theme from shared localStorage
    loadSharedTheme() {
        const savedTheme = localStorage.getItem(this.SHARED_THEME_KEY) || 'default';
        this.applyTheme(savedTheme);
    }

    // Apply theme to Extractor
    applyTheme(themeId) {
        if (!this.themes[themeId]) {
            console.warn(`Theme ${themeId} not found, using default`);
            themeId = 'default';
        }

        const theme = this.themes[themeId];
        const root = document.documentElement;
        
        // Apply theme colors to CSS custom properties
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
        
        this.currentTheme = themeId;
        
        // Show the page now that theme is applied
        document.body.classList.add('theme-loaded');
        console.log(`Extractor theme applied: ${theme.name}`);
    }

    // Listen for theme changes from main app
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.SHARED_THEME_KEY && e.newValue !== e.oldValue) {
                console.log('Theme changed in main app, updating Extractor...');
                this.loadSharedTheme();
            }
        });
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.extractorThemeManager = new ExtractorThemeManager();
});