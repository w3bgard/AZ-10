/**
 * View Toggle Utility
 * 
 * This module handles toggling between grid and list views for content displays.
 */

/**
 * Initialize view toggle functionality
 * @param {string} containerSelector - CSS selector for the container that will have its view toggled
 * @param {string} [buttonsSelector='.view-toggle-btn'] - CSS selector for toggle buttons
 */
function initViewToggle(containerSelector, buttonsSelector = '.view-toggle-btn') {
    document.addEventListener('DOMContentLoaded', function() {
        const viewButtons = document.querySelectorAll(buttonsSelector);
        const container = document.querySelector(containerSelector);
        
        if (!container || viewButtons.length === 0) return;
        
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const viewType = this.getAttribute('data-view');
                
                // Update active button
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update view class on container
                container.classList.remove('view-grid', 'view-list');
                container.classList.add(`view-${viewType}`);
                
                // Save preference to localStorage
                saveViewPreference(containerSelector, viewType);
            });
        });
        
        // Apply saved preference if any
        applyViewPreference(containerSelector, container, viewButtons);
    });
}

/**
 * Save view preference to localStorage
 * @param {string} key - Key to identify this particular view setting
 * @param {string} viewType - Type of view ('grid' or 'list')
 */
function saveViewPreference(key, viewType) {
    // Create a simplified key from the selector
    const storageKey = `view-pref-${key.replace(/[^a-zA-Z0-9]/g, '')}`;
    localStorage.setItem(storageKey, viewType);
}

/**
 * Apply saved view preference from localStorage
 * @param {string} key - Key that identifies this particular view setting
 * @param {Element} container - Container element to apply view class to
 * @param {NodeList} buttons - List of toggle buttons
 */
function applyViewPreference(key, container, buttons) {
    // Create a simplified key from the selector
    const storageKey = `view-pref-${key.replace(/[^a-zA-Z0-9]/g, '')}`;
    const savedView = localStorage.getItem(storageKey);
    
    if (!savedView) return;
    
    // Apply saved view
    container.classList.remove('view-grid', 'view-list');
    container.classList.add(`view-${savedView}`);
    
    // Update button states
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === savedView) {
            btn.classList.add('active');
        }
    });
}

// Export utility functions
export { initViewToggle }; 