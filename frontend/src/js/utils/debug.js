/**
 * Debug and Diagnostics Utility
 * Version: 1.1.0
 * Description: Enhanced debugging tools for troubleshooting the AZ10 platform
 * 
 * Author: AZ10 Team
 */

// Create global diagnostics object
window.AZ10_DEBUG = {
    isDebugMode: false,
    logs: [],
    errors: [],
    eventListeners: {},
    performanceMarks: {},
    traceEnabled: false
};

/**
 * Enable debug mode with enhanced logging
 */
window.enableDebug = function(traceEnabled = false) {
    window.AZ10_DEBUG.isDebugMode = true;
    window.AZ10_DEBUG.traceEnabled = traceEnabled;
    console.log('%c🔍 DEBUG MODE ENABLED', 'background: #222; color: #bada55; font-size: 14px; padding: 5px;');
    
    // Start performance tracking
    performance.mark('debug-start');
    window.AZ10_DEBUG.performanceMarks.start = performance.now();
    
    return 'Debug mode enabled. Use disableDebug() to turn it off.';
};

/**
 * Disable debug mode
 */
window.disableDebug = function() {
    window.AZ10_DEBUG.isDebugMode = false;
    window.AZ10_DEBUG.traceEnabled = false;
    console.log('%c🚫 DEBUG MODE DISABLED', 'background: #222; color: #ff6b6b; font-size: 14px; padding: 5px;');
    return 'Debug mode disabled.';
};

/**
 * Debug logger with stack trace
 */
window.debugLog = function(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, data };
    
    if (window.AZ10_DEBUG.traceEnabled) {
        try {
            throw new Error('Stack trace');
        } catch (e) {
            logEntry.stack = e.stack.split('\n').slice(2).join('\n');
        }
    }
    
    window.AZ10_DEBUG.logs.push(logEntry);
    
    if (window.AZ10_DEBUG.isDebugMode) {
        console.log(`%c[DEBUG] ${message}`, 'color: #2196F3', data || '');
    }
    
    return message;
};

/**
 * Check all components for proper initialization
 */
window.checkComponents = function() {
    const results = {
        initialized: !!window.AZ10_STATE?.initialized,
        themeController: !!window.themeController,
        panelController: !!window.panelController,
        componentsManager: !!window.componentsManager,
        carousels: []
    };
    
    // Check carousels
    const carouselContainers = document.querySelectorAll('[data-carousel-initialized="true"]');
    carouselContainers.forEach(container => {
        results.carousels.push({
            id: container.id || 'unnamed-carousel',
            initialized: true,
            slideCount: container.querySelectorAll('.carousel-slide').length
        });
    });
    
    console.table(results);
    return results;
};

/**
 * Check for script loading or execution issues
 */
window.checkScripts = function() {
    const scripts = Array.from(document.scripts);
    const results = scripts.map(script => ({
        src: script.src || 'inline',
        loaded: script.readyState ? script.readyState === 'complete' : true,
        async: script.async,
        defer: script.defer,
        type: script.type || 'text/javascript'
    }));
    
    console.table(results);
    return results;
};

/**
 * Check menu functionality
 */
window.checkMenuFunctionality = function() {
    console.log('========= MENU FUNCTIONALITY CHECK =========');
    
    // Check if panel controller exists
    console.log('Panel controller:', window.panelController ? 'EXISTS' : 'NOT FOUND');
    
    // Check if panel element exists
    const panel = document.getElementById('side-panel');
    console.log('Panel element:', panel ? 'EXISTS' : 'NOT FOUND');
    
    // Check expandable menu items
    const expandableItems = document.querySelectorAll('.nav-item.expandable');
    console.log(`Found ${expandableItems.length} expandable menu items`);
    
    // Check event listeners on menu items
    console.log('Checking event listeners:');
    expandableItems.forEach((item, index) => {
        const link = item.querySelector('.nav-link');
        const submenu = item.querySelector('.nav-submenu');
        console.log(`Item ${index + 1}: ${item.textContent.trim()}`);
        console.log(`  - Link: ${link ? 'Found' : 'Not found'}`);
        console.log(`  - Submenu: ${submenu ? 'Found' : 'Not found'}`);
        
        // Add click listener to force toggle
        console.log(`  - Adding debug click listener to item ${index + 1}`);
        if (link) {
            const debugHandler = function(e) {
                console.log('Debug click triggered on menu item');
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle class manually
                const isActive = item.classList.contains('active');
                console.log('  - Current state:', isActive ? 'active' : 'inactive');
                
                // Remove active class from all other items
                document.querySelectorAll('.nav-item.expandable.active').forEach(activeItem => {
                    if (activeItem !== item) {
                        activeItem.classList.remove('active');
                        const activeLink = activeItem.querySelector('.nav-link');
                        if (activeLink) activeLink.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle this item
                item.classList.toggle('active');
                link.setAttribute('aria-expanded', !isActive);
                console.log('  - New state:', !isActive ? 'active' : 'inactive');
                
                // Call panel controller if it exists
                if (window.panelController) {
                    try {
                        window.panelController.toggleSubmenu(item, submenu);
                    } catch (error) {
                        console.error('Error calling toggleSubmenu:', error);
                    }
                }
                
                return false;
            };
            
            // Clean previous event listeners by cloning
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add debug handler
            newLink.addEventListener('click', debugHandler);
            console.log('  - Debug handler added');
        }
    });
    
    console.log('To test, click on a menu item manually');
    console.log('====== END MENU FUNCTIONALITY CHECK ======');
    
    return {
        panelControllerExists: !!window.panelController,
        panelElementExists: !!panel,
        expandableItemsCount: expandableItems.length
    };
};

/**
 * Fix theme toggle buttons
 */
window.fixThemeButtons = function() {
    console.log('========= FIXING THEME BUTTONS =========');
    
    try {
        // Create fallback theme toggle function if missing
        if (typeof window.toggleTheme !== 'function') {
            console.log('Creating fallback theme toggle function');
            window.toggleTheme = function() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                console.log(`Theme toggled to ${newTheme} (emergency fallback)`);
                return newTheme;
            };
        }
        
        // Fix theme toggle button
        const themeToggle = document.getElementById('submenuThemeToggle');
        if (themeToggle) {
            console.log('Found theme toggle button, initializing...');
            
            // Make sure it has the proper click handler
            themeToggle.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                if (typeof window.toggleTheme === 'function') {
                    window.toggleTheme();
                }
                
                return false;
            };
            
            console.log('Theme toggle button fixed!');
        } else {
            console.warn('Could not find theme toggle button');
        }
        
        console.log('Theme buttons fixed successfully!');
        return true;
    } catch (error) {
        console.error('Error fixing theme buttons:', error);
        return false;
    }
}

/**
 * Auto-fix menu functionality
 */
window.autoFixMenus = function() {
    console.log('========= AUTO-FIX MENUS =========');
    
    // Check if panel element exists
    const panel = document.getElementById('side-panel');
    if (!panel) {
        console.error('Cannot fix menus - side-panel element not found');
        return false;
    }
    
    // Find all expandable menu items
    const expandableItems = document.querySelectorAll('.nav-item.expandable');
    if (expandableItems.length === 0) {
        console.error('No expandable menu items found');
        return false;
    }
    
    console.log(`Found ${expandableItems.length} expandable menu items to fix`);
    
    // Apply fix to each expandable item
    expandableItems.forEach((item, index) => {
        const link = item.querySelector('.nav-link');
        const submenu = item.querySelector('.nav-submenu');
        
        console.log(`Fixing item ${index + 1}: ${item.textContent.trim()}`);
        
        if (!link || !submenu) {
            console.warn(`Item ${index + 1} is missing link or submenu - skipping`);
            return;
        }
        
        // Remove any existing handlers by cloning elements
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add robust click handler
        newLink.addEventListener('click', function(e) {
            // Prevent default action and stop event bubbling
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`Menu item clicked: ${item.textContent.trim()}`);
            
            // Check current state
            const isActive = item.classList.contains('active');
            
            // First close any open menus
            document.querySelectorAll('.nav-item.expandable.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    const activeLink = activeItem.querySelector('.nav-link');
                    if (activeLink) activeLink.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current menu
            item.classList.toggle('active');
            newLink.setAttribute('aria-expanded', !isActive);
            
            return false;
        });
        
        console.log(`  - Fixed click handler for item ${index + 1}`);
    });
    
    // Fix the singleton instance if needed
    if (!window.panelController) {
        console.log('Creating new panel controller');
        
        // If a global implementation exists, use it
        if (typeof PanelController === 'function') {
            try {
                window.panelController = new PanelController();
                console.log('Created new PanelController instance');
            } catch (error) {
                console.error('Error creating PanelController:', error);
            }
        }
    }
    
    console.log('Menu functionality fixed!');
    console.log('====== AUTO-FIX COMPLETE ======');
    
    window.fixThemeButtons();
    return true;
};

/**
 * Fix common issues automatically
 */
window.runAutoFix = function() {
    console.log('%c🔧 Running auto fix...', 'color: #4CAF50; font-weight: bold;');
    
    try {
        // Check if core is initialized, if not initialize it
        if (!window.AZ10_STATE || !window.AZ10_STATE.initialized) {
            console.log('🔧 Initializing core components...');
            if (typeof window.initializeAZ10 === 'function') {
                window.initializeAZ10();
            }
        }
        
        // Check for carousel issues
        const carouselContainers = document.querySelectorAll('.carousel-container, .carousel-container-placeholder');
        carouselContainers.forEach(container => {
            if (!container.getAttribute('data-carousel-initialized') || 
                container.querySelectorAll('.carousel-slide').length === 0) {
                
                console.log(`🔧 Fixing carousel: ${container.id || 'unnamed'}`);
                
                // Remove loading placeholders if any
                const loadingPlaceholders = container.querySelectorAll('.loading-placeholder');
                loadingPlaceholders.forEach(placeholder => placeholder.remove());
                
                // Try to reinitialize carousel
                if (typeof window.refreshCarousels === 'function') {
                    window.refreshCarousels();
                } else {
                    // Trigger resize as fallback
                    const resizeEvent = new Event('resize');
                    window.dispatchEvent(resizeEvent);
                }
            }
        });
        
        // Force theme consistency
        if (window.themeController) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            console.log(`🔧 Ensuring theme consistency: ${currentTheme}`);
            
            // Apply current theme again to fix any inconsistencies
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            // Update theme controller state if needed
            if (window.themeController.state && window.themeController.state.current !== currentTheme) {
                window.themeController.state.current = currentTheme;
            }
        }
        
        // Force refresh UI
        console.log('🔧 Refreshing UI...');
        setTimeout(() => {
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
        }, 100);
        
        console.log('%c✅ Auto fix complete!', 'color: #4CAF50; font-weight: bold;');
        return true;
    } catch (error) {
        console.error('❌ Auto fix failed:', error);
        return false;
    }
};

/**
 * Get detailed performance metrics
 */
window.getPerformanceReport = function() {
    const now = performance.now();
    const startTime = window.AZ10_DEBUG.performanceMarks.start || 0;
    const totalTime = now - startTime;
    
    // Collect performance entries
    const perfEntries = performance.getEntriesByType('resource');
    
    // Group by resource type
    const resourcesByType = perfEntries.reduce((acc, entry) => {
        const type = entry.initiatorType;
        if (!acc[type]) acc[type] = [];
        acc[type].push({
            name: entry.name.split('/').pop(),
            duration: Math.round(entry.duration),
            size: entry.transferSize
        });
        return acc;
    }, {});
    
    // Calculate summary stats
    const summary = {
        totalLoadTime: Math.round(totalTime),
        resourceCount: perfEntries.length,
        slowestResources: perfEntries
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 5)
            .map(entry => ({
                name: entry.name.split('/').pop(),
                duration: Math.round(entry.duration)
            }))
    };
    
    console.log('%c📊 Performance Report', 'font-size: 14px; font-weight: bold;');
    console.log('Summary:', summary);
    console.log('Resources by type:', resourcesByType);
    
    return { summary, resourcesByType };
};

/**
 * Emergency recovery mode - resets all state and refreshes the page
 */
window.emergencyRecovery = function() {
    try {
        console.log('%c🚨 EMERGENCY RECOVERY MODE ACTIVATED', 'background: #ff0000; color: white; font-size: 14px; padding: 5px;');
        
        // Clear all global state
        window.AZ10_STATE = {
            initialized: false
        };
        
        // Clear localStorage for clean start
        if (confirm('Reset all stored preferences?')) {
            localStorage.clear();
            console.log('localStorage cleared');
        }
        
        // Set a flag to indicate we're in recovery mode for the next page load
        sessionStorage.setItem('recoveryMode', 'true');
        
        // Reload the page
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
        
        return 'Emergency recovery initiated. Page will reload...';
    } catch (error) {
        console.error('Recovery failed:', error);
        alert('Recovery failed. Please reload the page manually.');
        return false;
    }
};

// Check if we're in recovery mode from previous session
if (sessionStorage.getItem('recoveryMode') === 'true') {
    console.log('%c🚨 RECOVERY MODE: Page reloaded after emergency recovery', 'background: #ff9800; color: white;');
    sessionStorage.removeItem('recoveryMode');
}

/**
 * Set theme directly to light or dark
 * @param {string} theme - 'light' or 'dark'
 */
window.setTheme = function(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        console.error('Invalid theme specified. Use "light" or "dark"');
        return false;
    }
    
    console.log(`Setting theme directly to ${theme}`);
    
    // Apply theme to HTML element
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update any theme controller if available
    if (window.themeController && typeof window.themeController.updateToggleStates === 'function') {
        window.themeController.updateToggleStates(theme);
        window.themeController.state.current = theme;
    }
    
    // Trigger custom event for other components
    const event = new CustomEvent('az10themechange', {
        detail: { theme: theme }
    });
    document.dispatchEvent(event);
    
    return true;
};

// Direct theme toggle function that bypasses controllers
window.forceToggleTheme = function() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    return window.setTheme(newTheme);
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enableDebug: window.enableDebug,
        disableDebug: window.disableDebug,
        debugLog: window.debugLog,
        checkComponents: window.checkComponents,
        runAutoFix: window.runAutoFix
    };
}

// Diagnostic information about the current environment
function diagnoseEnvironment() {
    return {
        // Browser information
        userAgent: navigator.userAgent,
        browserLanguage: navigator.language,
        screenSize: {
            width: window.screen.width,
            height: window.screen.height
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        devicePixelRatio: window.devicePixelRatio,
        
        // Theme information
        currentTheme: document.documentElement.getAttribute('data-theme') || 'default',
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        
        // Component availability
        components: {
            themeController: !!window.themeController,
            navigationHandler: !!window.navigationHandler,
            router: !!window.router,
            borderController: !!window.borderController
        },
        
        // Timing information
        performance: {
            navigationStart: performance && performance.timing ? performance.timing.navigationStart : 'Not available',
            domComplete: performance && performance.timing ? performance.timing.domComplete : 'Not available',
            loadEventEnd: performance && performance.timing ? performance.timing.loadEventEnd : 'Not available'
        }
    };
}

/**
 * Fix UI components that aren't working properly
 * @param {Object} options - Configuration options
 */
function fixUI(options = {}) {
    const fixes = [];
    
    try {
        if (options.theme || options.all) {
            fixThemeButtons();
            fixes.push('Theme Toggle');
        }
        
        if (options.navigation || options.all) {
            fixNavigation();
            fixes.push('Navigation');
        }
        
        if (options.panel || options.all) {
            fixPanel();
            fixes.push('Panel');
        }
        
        if (fixes.length > 0) {
            console.log(`Fixed UI components: ${fixes.join(', ')}`);
        } else {
            console.log('No UI components were fixed');
        }
    } catch (error) {
        console.error('Error fixing UI components:', error);
    }
} 