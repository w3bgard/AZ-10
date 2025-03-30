/**
 * Page Generator
 * 
 * This script can be used to generate new pages for the application 
 * based on predefined templates and configurations.
 */

import { createPage } from '../utils/page-builder.js';
import fs from 'fs';
import path from 'path';

/**
 * Generate a new page based on the specified template
 * @param {string} pageName - Name of the page to generate (used for file naming)
 * @param {string} template - Template name from predefined templates
 * @param {Object} customOptions - Custom options to override template defaults
 */
function generatePage(pageName, template, customOptions = {}) {
    const templateConfig = getTemplateConfig(template);
    
    if (!templateConfig) {
        console.error(`Template '${template}' not found.`);
        return;
    }
    
    // Merge template config with custom options
    const pageConfig = { ...templateConfig, ...customOptions };
    
    // Generate HTML
    const html = createPage(pageConfig);
    
    // Ensure directories exist
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write HTML file
    const filePath = path.join(publicDir, `${pageName}.html`);
    fs.writeFileSync(filePath, html);
    
    console.log(`Page '${pageName}.html' generated successfully.`);
    
    // Generate CSS if needed and template contains cssTemplate
    if (templateConfig.cssTemplate) {
        generateCSS(pageName, templateConfig.cssTemplate);
    }
}

/**
 * Generate CSS file for the page
 * @param {string} pageName - Name of the page (used for file naming)
 * @param {string} cssTemplate - CSS template content
 */
function generateCSS(pageName, cssTemplate) {
    const cssDir = path.resolve(process.cwd(), 'src/styles/pages', pageName);
    
    // Ensure directory exists
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir, { recursive: true });
    }
    
    // Write CSS file
    const cssPath = path.join(cssDir, `${pageName}.css`);
    fs.writeFileSync(cssPath, cssTemplate);
    
    console.log(`CSS file for '${pageName}' generated successfully.`);
}

/**
 * Get predefined template configuration
 * @param {string} templateName - Name of the template to retrieve
 * @returns {Object|null} Template configuration or null if not found
 */
function getTemplateConfig(templateName) {
    const templates = {
        'listing-page': {
            title: 'AZ10 | Listing Page',
            description: 'Browse and discover content on AZ10',
            pageClass: 'page-listing',
            headerTitle: 'Content Listing',
            headerDescription: 'Browse and discover the best content',
            pageStylePath: 'listing/listing',
            filters: [
                {
                    label: 'Sort by',
                    id: 'sort-date',
                    options: [
                        { value: 'newest', label: 'Newest First' },
                        { value: 'oldest', label: 'Oldest First' }
                    ]
                },
                {
                    label: 'Rating',
                    id: 'filter-rating',
                    disabled: true,
                    comingSoon: true,
                    options: [
                        { value: 'all', label: 'All Ratings' },
                        { value: 'highest', label: 'Highest First' },
                        { value: 'lowest', label: 'Lowest First' }
                    ]
                }
            ],
            showViewControls: true,
            mainContentId: 'listingContent',
            mainContentClass: 'listing-grid view-grid',
            customScripts: `
            <script type="module">
                import { initViewToggle } from '../src/js/utils/view-toggle.js';
                
                // Initialize view toggle
                initViewToggle('#listingContent');
                
                document.addEventListener('DOMContentLoaded', function() {
                    // Initialize filters
                    const dateFilter = document.getElementById('sort-date');
                    if (dateFilter) {
                        dateFilter.addEventListener('change', function() {
                            console.log('Filter changed:', this.value);
                            window.showLoading();
                            
                            // Simulate API call
                            setTimeout(() => {
                                window.hideLoading();
                                console.log('Content filtered');
                            }, 500);
                        });
                    }
                });
            </script>
            `,
            cssTemplate: `/* Listing page styles */
.listing-grid {
    display: grid;
    gap: 25px;
    margin-bottom: 40px;
}

.view-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.view-list {
    grid-template-columns: 1fr;
}

.loading-placeholder {
    text-align: center;
    color: var(--text-color-secondary);
    padding: 30px;
    font-style: italic;
    grid-column: 1 / -1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .listing-grid.view-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
}`
        },
        
        'detail-page': {
            title: 'AZ10 | Detail Page',
            description: 'Detailed view on AZ10',
            pageClass: 'page-detail',
            headerTitle: 'Content Detail',
            headerDescription: 'Explore detailed information',
            pageStylePath: 'detail/detail',
            showViewControls: false,
            mainContentId: 'detailContent',
            mainContentClass: 'detail-container',
            customScripts: `
            <script type="module">
                document.addEventListener('DOMContentLoaded', function() {
                    // Detail page initialization
                    console.log('Detail page loaded');
                    
                    // Load content details (example)
                    const contentId = new URLSearchParams(window.location.search).get('id');
                    if (contentId) {
                        console.log('Loading content ID:', contentId);
                    } else {
                        window.showError('Content ID not specified');
                    }
                });
            </script>
            `,
            cssTemplate: `/* Detail page styles */
.detail-container {
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    margin-bottom: 30px;
}

.detail-header {
    display: flex;
    margin-bottom: 30px;
}

.detail-cover {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 30px;
}

.detail-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.detail-info {
    flex: 1;
}

.detail-title {
    font-size: 2rem;
    margin-bottom: 10px;
}

.detail-metadata {
    margin-bottom: 20px;
    color: var(--text-color-secondary);
}

.detail-content {
    line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .detail-header {
        flex-direction: column;
    }
    
    .detail-cover {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
        margin-right: 0;
        margin-bottom: 20px;
    }
}`
        }
    };
    
    return templates[templateName] || null;
}

// Export generator functions
export {
    generatePage,
    getTemplateConfig
}; 