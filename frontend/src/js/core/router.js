/**
 * AZ10 Lightweight Client-Side Router
 * Version: 1.0.0
 * Description: A simple client-side router to prevent full page reloads when navigating between pages.
 * This helps maintain the fullscreen state across page transitions.
 *
 * Author: AZ10 Team
 */

class AZ10Router {
    constructor() {
        this.routes = [];
        this.contentContainer = document.getElementById('main-content') || document.body;
        this.currentPath = window.location.pathname;
        this.cache = {}; // Cache for loaded pages
        
        // Initialize router
        this.init();
    }
    
    /**
     * Initialize the router
     */
    init() {
        // Intercept clicks on all internal links
        document.addEventListener('click', (e) => this.handleLinkClick(e));
        
        // Handle browser back/forward navigation
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        
        // Add entry for current page
        this.addCurrentPageToHistory();
        
        console.log('AZ10 Router initialized');
    }
    
    /**
     * Add the current page to browser history
     */
    addCurrentPageToHistory() {
        const pageTitle = document.title;
        const url = window.location.pathname;
        
        // Only add to history if not already the current state
        if (history.state?.path !== url) {
            history.replaceState({ path: url, title: pageTitle }, pageTitle, url);
        }
    }
    
    /**
     * Handle clicks on internal links
     */
    handleLinkClick(e) {
        // Find closest anchor tag
        const link = e.target.closest('a');
        
        // Skip if no link or if it's an external link, has download attribute, or uses target="_blank"
        if (!link || 
            link.hostname !== window.location.hostname || 
            link.hasAttribute('download') ||
            link.target === '_blank' ||
            link.getAttribute('rel') === 'external' ||
            e.ctrlKey || e.metaKey) {
            return;
        }
        
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // Skip if it's a hash link or javascript: link
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
            return;
        }
        
        // Prevent default link behavior
        e.preventDefault();
        
        // Navigate to the page
        this.navigateTo(href);
    }
    
    /**
     * Handle browser back/forward navigation
     */
    handlePopState(e) {
        if (e.state) {
            // Get path from state
            const path = e.state.path;
            
            // Load the page content
            this.loadPage(path, false);
            
            // Update current path
            this.currentPath = path;
        }
    }
    
    /**
     * Navigate to a new page without full page reload
     */
    navigateTo(path) {
        // Skip if already on this page
        if (path === this.currentPath) {
            return;
        }
        
        // Load the page content
        this.loadPage(path, true);
        
        // Update current path
        this.currentPath = path;
    }
    
    /**
     * Load a page content via AJAX
     */
    async loadPage(path, addToHistory = true) {
        try {
            // Show loading indicator
            this.showLoading(true);
            
            // Get page content
            let content;
            if (this.cache[path]) {
                // Use cached content
                content = this.cache[path];
            } else {
                // Fetch the page
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
                }
                
                const html = await response.text();
                
                // Extract content from the loaded page
                content = this.extractContent(html);
                
                // Cache the content
                this.cache[path] = content;
            }
            
            // Update the page content
            this.updateContent(content);
            
            // Update the browser history
            if (addToHistory) {
                history.pushState({ path, title: content.title }, content.title, path);
            }
            
            // Update document title
            document.title = content.title;
            
            // Execute any scripts in the new content
            this.executeScripts(content.scripts);
            
            // Dispatch a page load event
            window.dispatchEvent(new CustomEvent('az10:page-loaded', { 
                detail: { path, isHistoryUpdate: addToHistory } 
            }));
            
            console.log(`Page loaded: ${path}`);
        } catch (error) {
            console.error('Error loading page:', error);
            
            // Show error message to user
            this.showError(`Failed to load page: ${error.message}`);
        } finally {
            // Hide loading indicator
            this.showLoading(false);
        }
    }
    
    /**
     * Extract content from a full HTML page
     */
    extractContent(html) {
        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get the title
        const title = doc.querySelector('title')?.textContent || document.title;
        
        // Get the main content
        const mainContent = doc.querySelector('#main-content') || doc.querySelector('main') || doc.body;
        
        // Get all scripts in the main content
        const scripts = Array.from(mainContent.querySelectorAll('script')).map(script => {
            return {
                src: script.src,
                content: script.textContent,
                type: script.type || 'text/javascript'
            };
        });
        
        // Remove scripts from content to prevent double execution
        mainContent.querySelectorAll('script').forEach(script => script.remove());
        
        return {
            title,
            html: mainContent.innerHTML,
            scripts
        };
    }
    
    /**
     * Update the content of the page
     */
    updateContent(content) {
        // Update the content
        this.contentContainer.innerHTML = content.html;
    }
    
    /**
     * Execute scripts from the loaded page
     */
    executeScripts(scripts) {
        scripts.forEach(script => {
            // Create a new script element
            const newScript = document.createElement('script');
            
            // Copy attributes
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.content;
            }
            
            newScript.type = script.type;
            
            // Add to document
            document.body.appendChild(newScript);
            
            // Clean up
            if (!script.src) {
                document.body.removeChild(newScript);
            }
        });
    }
    
    /**
     * Show or hide loading indicator
     */
    showLoading(isLoading) {
        // Check if there's a loading container
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = isLoading ? 'flex' : 'none';
        }
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // Check if there's an error container
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            errorContainer.style.display = 'flex';
        } else {
            // Fallback to alert
            alert(`Error: ${message}`);
        }
    }
}

// Create router instance when DOM is loaded
let routerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!window.az10Router) {
        routerInstance = new AZ10Router();
        window.az10Router = routerInstance;
    }
});

// Export for module usage
export { AZ10Router }; 