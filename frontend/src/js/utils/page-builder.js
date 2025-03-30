/**
 * Page Builder Utility
 * 
 * This module provides utility functions for building pages consistently
 * across the application.
 */

import { getHeadContent, getPageStyleLink, getBodyStart, getBodyEnd, getFilterControls } 
    from '../../components/shared/Layout/html-templates.js';
import { createPageHeader } from '../../components/shared/Layout/common-elements.js';

/**
 * Creates a complete HTML page structure
 * 
 * @param {Object} options - Page configuration options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page meta description
 * @param {string} options.pageClass - CSS class for the body
 * @param {string} options.pageStylePath - Path to page-specific CSS (relative to pages directory)
 * @param {string} options.headerTitle - Main header title
 * @param {string} options.headerDescription - Main header description
 * @param {Array} options.filters - Array of filter objects
 * @param {boolean} options.showViewControls - Whether to show grid/list view controls
 * @param {string} options.mainContentId - ID for the main content container
 * @param {string} options.mainContentClass - Class for the main content container
 * @param {string} options.customScripts - Additional custom scripts to include
 */
function createPage(options) {
    // Set defaults for optional parameters
    const defaults = {
        pageClass: 'page',
        showViewControls: true,
        mainContentId: 'contentContainer',
        mainContentClass: 'content-grid view-grid',
        customScripts: ''
    };
    
    const config = { ...defaults, ...options };
    
    // Start building the HTML
    let html = '<!DOCTYPE html>\n<html lang="en" data-theme="dark">\n<head>\n';
    
    // Add head content
    html += getHeadContent(config.title, config.description);
    
    // Add page-specific CSS if provided
    if (config.pageStylePath) {
        html += getPageStyleLink(config.pageStylePath);
    }
    
    // Close head and add body start
    html += '\n</head>\n';
    html += getBodyStart(config.pageClass);
    
    // Add page header if provided
    if (config.headerTitle) {
        html += createPageHeader(config.headerTitle, config.headerDescription || '');
    }
    
    // Add filters if provided
    if (config.filters && config.filters.length > 0) {
        html += getFilterControls(config.filters, config.showViewControls);
    }
    
    // Add main content container
    html += `<div id="${config.mainContentId}" class="${config.mainContentClass}">
        <!-- Content will be loaded dynamically -->
        <div class="loading-placeholder">Loading content...</div>
    </div>`;
    
    // Add body end with standard scripts
    html += getBodyEnd();
    
    // Add custom scripts if provided
    if (config.customScripts) {
        html += config.customScripts;
    }
    
    // Close body and html tags
    html += '\n</body>\n</html>';
    
    return html;
}

// Export the page builder function
export { createPage }; 