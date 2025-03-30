/**
 * AZ10 Platform Initialization
 * Version: 1.0.3
 * Description: Simple initialization script
 *
 * Author: AZ10 Team
 * Last Updated: March 2025
 */

// Create a global state object if it doesn't exist
if (!window.AZ10_STATE) {
    window.AZ10_STATE = {};
}

// Simple initialization function
window.initializeAZ10 = function() {
    // Only initialize once
    if (window.AZ10_STATE.initialized) {
        console.log('AZ10 already initialized, skipping');
        return true;
    }
    
    console.log('🚀 Initializing AZ10 application...');
    
    // Initialize theme controller first and ensure it's available
    if (typeof ThemeController !== 'undefined' && !window.themeController) {
        window.themeController = new ThemeController();
        console.log('Theme controller initialized');
    } else if (window.themeController) {
        console.log('Theme controller already initialized');
    } else {
        console.error('ThemeController class not found!');
    }
    
    // Initialize fullscreen controller if available
    if (typeof FullscreenController !== 'undefined' && !window.fullscreenController) {
        window.fullscreenController = new FullscreenController();
    }
    
    // Initialize panel controller if available
    if (typeof PanelController !== 'undefined' && !window.panelController) {
        window.panelController = new PanelController();
        console.log('Panel controller initialized');
    } else if (window.panelController) {
        console.log('Panel controller already initialized');
    }
    
    // Fix theme toggle button if not working already
    setTimeout(() => {
        const submenuThemeToggle = document.getElementById('submenuThemeToggle');
        if (submenuThemeToggle && !submenuThemeToggle.hasAttribute('onclick')) {
            console.log('Adding missing onclick handler to theme toggle');
            submenuThemeToggle.setAttribute('onclick', 'window.toggleTheme(); return false;');
            submenuThemeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.toggleTheme();
                return false;
            });
        }
    }, 500);
    
    // After everything is initialized, ensure panel menu events are working
    setTimeout(() => {
        try {
            initializeMenuEvents();
        } catch (error) {
            console.error('Error initializing menu events:', error);
        }
    }, 300);
    
    // Mark as initialized
    window.AZ10_STATE.initialized = true;
    
    console.log('✅ AZ10 initialization complete');
    return true;
};

/**
 * Manually initialize menu event handlers if needed
 */
function initializeMenuEvents() {
    // Get all expandable menu items
    const expandableItems = document.querySelectorAll('.nav-item.expandable');
    if (!expandableItems || expandableItems.length === 0) {
        console.log('No expandable menu items found');
        return;
    }
    
    console.log(`Found ${expandableItems.length} expandable menu items, ensuring event handlers`);
    
    // Add click handlers directly to ensure they work
    expandableItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const submenu = item.querySelector('.nav-submenu');
        
        if (!link || !submenu) return;
        
        // Remove any existing handlers by cloning and replacing
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add direct click handler
        newLink.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Menu item clicked:', item.textContent.trim());
            
            // Toggle active class
            const isActive = item.classList.contains('active');
            
            // Close any other open menu first
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
        };
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        window.initializeAZ10();
    }, 100);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeAZ10: window.initializeAZ10 };
} 