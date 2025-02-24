// Theme Management Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Core Elements
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');

    // Theme Variables
    const THEME_KEY = 'theme';
    const THEMES = {
        DARK: 'dark',
        LIGHT: 'light'
    };

    /**
     * Initialize theme functionality
     */
    function initTheme() {
        // Load saved theme or get system preference
        const savedTheme = localStorage.getItem(THEME_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? THEMES.DARK : THEMES.LIGHT);
        
        // Apply initial theme
        applyTheme(initialTheme);
        
        // Set up event listeners
        setupThemeListeners();
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme to apply ('dark' or 'light')
     */
    function applyTheme(theme) {
        // Set theme attribute
        html.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem(THEME_KEY, theme);
        
        // Update icons
        updateThemeIcons(theme);
        
        // Update meta theme color
        updateMetaThemeColor(theme);
        
        // Update button states
        updateThemeButtons(theme);
    }

    /**
     * Set up theme-related event listeners
     */
    function setupThemeListeners() {
        // Desktop theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Mobile theme toggle
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', toggleTheme);
        }

        // System theme change
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
                }
            });

        // Handle keyboard navigation
        if (themeToggle) {
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        applyTheme(newTheme);
    }

    /**
     * Update theme icons visibility
     * @param {string} theme - Current theme
     */
    function updateThemeIcons(theme) {
        if (darkIcon && lightIcon) {
            darkIcon.style.display = theme === THEMES.DARK ? 'block' : 'none';
            lightIcon.style.display = theme === THEMES.LIGHT ? 'block' : 'none';
        }
    }

    /**
     * Update meta theme-color for browser UI
     * @param {string} theme - Current theme
     */
    function updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === THEMES.DARK ? '#000000' : '#ffffff';
        }
    }

    /**
     * Update theme toggle buttons state
     * @param {string} theme - Current theme
     */
    function updateThemeButtons(theme) {
        const buttons = [themeToggle, mobileThemeToggle].filter(Boolean);
        
        buttons.forEach(button => {
            if (button) {
                button.setAttribute('aria-label', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} theme`);
                button.setAttribute('aria-pressed', theme === THEMES.DARK ? 'true' : 'false');
            }
        });
    }

    // Initialize theme system
    initTheme();

    // Export theme functionality for external use
    window.themeManager = {
        toggle: toggleTheme,
        apply: applyTheme,
        current: () => html.getAttribute('data-theme')
    };
});
