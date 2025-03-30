/**
 * Theme Toggle Diagnostics
 * Version: 1.0.0
 * 
 * This file provides diagnostic tools to debug theme toggle issues
 * and reports detailed information about the current state of theme toggles.
 */

// Create diagnostics namespace to avoid global pollution
window.AZ10_DIAGNOSTICS = window.AZ10_DIAGNOSTICS || {};

/**
 * Theme toggle diagnostics tool
 */
class ThemeDiagnostics {
    constructor() {
        console.log('🔍 Theme diagnostics initialized');
        
        // Check if we are in debug mode based on URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        this.debugMode = urlParams.has('debug-theme');
        
        if (this.debugMode) {
            console.log('🐞 Theme debug mode enabled');
            this.createDebugOverlay();
        }
    }
    
    /**
     * Run a full diagnostic of theme toggle elements and functionality
     */
    runDiagnostic() {
        console.group('🔍 Theme Toggle Diagnostics');
        
        // Check theme controller
        const hasThemeController = !!window.themeController;
        console.log(`Theme controller exists: ${hasThemeController}`);
        
        const hasToggleFunction = typeof window.toggleTheme === 'function';
        console.log(`Global toggleTheme function exists: ${hasToggleFunction}`);
        
        // Check current theme state
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'default';
        console.log(`Current theme: ${currentTheme}`);
        
        // Check if localStorage theme matches current theme
        const storedTheme = localStorage.getItem('theme');
        console.log(`Theme in localStorage: ${storedTheme || 'not set'}`);
        console.log(`Matches current theme: ${currentTheme === storedTheme}`);
        
        // Check theme toggle elements
        const submenuThemeToggle = document.getElementById('submenuThemeToggle');
        
        console.log(`Submenu toggle exists: ${!!submenuThemeToggle}`);
        
        if (submenuThemeToggle) {
            console.log(`Submenu toggle has onclick: ${!!submenuThemeToggle.getAttribute('onclick')}`);
            console.log(`Submenu toggle classList: ${submenuThemeToggle.className}`);
        }
        
        // Check for theme-specific CSS
        const darkThemeRules = this.findCSSRules('[data-theme="dark"]');
        const lightThemeRules = this.findCSSRules('[data-theme="light"]');
        
        console.log(`Dark theme CSS rules found: ${darkThemeRules > 0 ? 'Yes' : 'No'} (${darkThemeRules} rules)`);
        console.log(`Light theme CSS rules found: ${lightThemeRules > 0 ? 'Yes' : 'No'} (${lightThemeRules} rules)`);
        
        console.log('Theme diagnostics summary:');
        const diagnosticSummary = {
            currentTheme,
            storedTheme: storedTheme || 'not set',
            themeConsistent: currentTheme === storedTheme,
            hasThemeController,
            hasToggleFunction,
            submenuToggleExists: !!submenuThemeToggle,
            hasDarkThemeCSS: darkThemeRules > 0,
            hasLightThemeCSS: lightThemeRules > 0
        };
        
        console.table(diagnosticSummary);
        
        console.groupEnd();
        
        return diagnosticSummary;
    }
    
    /**
     * Create a debug overlay to show theme toggle state in real-time
     */
    createDebugOverlay() {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.bottom = '10px';
        overlay.style.right = '10px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px';
        overlay.style.borderRadius = '5px';
        overlay.style.zIndex = '10000';
        overlay.style.fontSize = '12px';
        overlay.style.fontFamily = 'monospace';
        overlay.style.maxWidth = '300px';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.id = 'theme-debug-overlay';
        
        // Add header
        const header = document.createElement('div');
        header.textContent = 'Theme Debug Info';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '5px';
        overlay.appendChild(header);
        
        // Add content container
        const content = document.createElement('div');
        content.id = 'theme-debug-content';
        overlay.appendChild(content);
        
        // Add to document
        document.body.appendChild(overlay);
        
        // Update content initially and set interval
        this.updateDebugOverlay();
        setInterval(() => this.updateDebugOverlay(), 1000);
        
        // Add toggle button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Fix Theme Toggle';
        toggleButton.style.marginTop = '10px';
        toggleButton.style.padding = '5px';
        toggleButton.style.backgroundColor = '#4CAF50';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.color = 'white';
        toggleButton.style.cursor = 'pointer';
        
        toggleButton.addEventListener('click', () => {
            console.log('Manual theme toggle fix initiated');
            this.fixThemeToggle();
        });
        
        overlay.appendChild(toggleButton);
    }
    
    /**
     * Update the debug overlay with current state information
     */
    updateDebugOverlay() {
        const content = document.getElementById('theme-debug-content');
        if (!content) return;
        
        const diagnostics = this.runDiagnostic();
        
        content.innerHTML = `
            <div>Current theme: ${diagnostics.currentTheme}</div>
            <div>Stored theme: ${diagnostics.storedTheme || 'not set'}</div>
            <div>Controller: ${diagnostics.hasThemeController ? '✅' : '❌'}</div>
            <div>Toggle function: ${diagnostics.hasToggleFunction ? '✅' : '❌'}</div>
            <div>Submenu toggle: ${diagnostics.submenuToggleExists ? '✅' : '❌'}</div>
        `;
    }
    
    /**
     * Fix theme toggle issues
     */
    fixThemeToggle() {
        console.group('🔧 Attempting to fix theme toggle issues');
        
        try {
            // First, ensure we have a valid theme set
            const html = document.documentElement;
            let currentTheme = html.getAttribute('data-theme');
            
            if (!currentTheme || (currentTheme !== 'dark' && currentTheme !== 'light')) {
                console.log('Current theme is invalid, setting to dark');
                currentTheme = 'dark';
                html.setAttribute('data-theme', currentTheme);
                localStorage.setItem('theme', currentTheme);
            }
            
            // Try to fix the theme controller
            if (!window.themeController && typeof ThemeController === 'function') {
                console.log('Creating new theme controller instance');
                window.themeController = new ThemeController();
            } else if (window.themeController) {
                console.log('Re-initializing existing theme controller');
                window.themeController.initThemeToggles();
            }
            
            // Fix theme toggle buttons
            const submenuThemeToggle = document.getElementById('submenuThemeToggle');
            
            if (submenuThemeToggle) {
                submenuThemeToggle.setAttribute('onclick', 'window.toggleTheme(); return false;');
                submenuThemeToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof window.toggleTheme === 'function') {
                        window.toggleTheme();
                    }
                    return false;
                });
                
                // Set correct active state
                if (currentTheme === 'light') {
                    submenuThemeToggle.classList.add('active');
                } else {
                    submenuThemeToggle.classList.remove('active');
                }
                
                console.log('Fixed submenu theme toggle button');
            } else {
                console.log('Submenu theme toggle button not found');
            }
            
            console.log('✅ Theme toggle fix completed');
        } catch (error) {
            console.error('❌ Error fixing theme toggle:', error);
        }
        
        console.groupEnd();
    }
}

// Create instance and expose to global namespace
window.AZ10_DIAGNOSTICS.theme = new ThemeDiagnostics();

// Run initial diagnostics
window.AZ10_DIAGNOSTICS.theme.runDiagnostic();

// Expose fix method globally for console access
window.fixThemeToggle = () => {
    window.AZ10_DIAGNOSTICS.theme.fixThemeToggle();
};

// Export for module use
export const themeDiagnostics = window.AZ10_DIAGNOSTICS.theme; 