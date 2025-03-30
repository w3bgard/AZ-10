/**
 * HTML Templates
 * 
 * This file contains common HTML templates used across multiple pages
 * to maintain consistency and reduce code duplication.
 */

// Common HTML head content with dynamic title and description
function getHeadContent(title, description) {
    return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="description" content="${description}">
    <title>${title}</title>

    <!-- Styles -->
    <link rel="stylesheet" href="../src/styles/base/variables.css">
    <link rel="stylesheet" href="../src/styles/base/reset.css">
    <link rel="stylesheet" href="../src/styles/base/typography.css">
    <link rel="stylesheet" href="../src/styles/base/global.css">
    <link rel="stylesheet" href="../src/styles/components/panel.css">
    <link rel="stylesheet" href="../src/styles/components/content.css">
    <link rel="stylesheet" href="../src/styles/components/track-card.css">
    <link rel="stylesheet" href="../src/styles/components/animations.css">
    <link rel="stylesheet" href="../src/styles/components/main-header.css">
    <link rel="stylesheet" href="../src/styles/components/search.css">
    <link rel="stylesheet" href="../src/styles/components/fullscreen.css">
    <link rel="stylesheet" href="../src/styles/components/theme-toggle.css">
    <link rel="stylesheet" href="../src/styles/components/carousel.css">
    <link rel="stylesheet" href="../src/styles/components/common.css">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Platform Initialization Script -->
    <script type="module" src="../src/js/core/init.js"></script>
    `;
}

// Page-specific CSS link
function getPageStyleLink(pagePath) {
    return `<link rel="stylesheet" href="../src/styles/pages/${pagePath}.css">`;
}

// Common body start (before main content)
function getBodyStart(pageClass) {
    return `
    <body class="${pageClass}">
        <!-- Side Panel -->
        <div id="side-panel" class="panel"></div>

        <!-- Main Content -->
        <main id="main-content" class="content">
    `;
}

// Common body end (after main content)
function getBodyEnd() {
    return `
        </main>

        <!-- Error Messages -->
        <div id="errorContainer" class="error-container" style="display: none;">
            <p class="error-message"></p>
        </div>

        <!-- Loading Indicator -->
        <div id="loadingIndicator" class="loading-indicator" style="display: none;">
            <div class="spinner"></div>
        </div>

        <!-- Core Scripts -->
        <script src="../src/js/core/components.js"></script>
        <script src="../src/js/core/navigation.js"></script>
        <script src="../src/js/core/border.js"></script>
        <script src="../src/js/core/router.js"></script>
        <script src="../src/js/core/fullscreen.js"></script>

        <!-- Common UI Elements -->
        <script type="module">
            import { initCommonElements } from '../src/components/shared/Layout/common-elements.js';
            document.addEventListener('DOMContentLoaded', initCommonElements);
        </script>
    `;
}

// Filter controls template with ability to customize filters
function getFilterControls(filters, showViewControls = true) {
    let filterHtml = `<div class="filter-section">`;
    
    // Add each filter
    filters.forEach(filter => {
        filterHtml += `
            <div class="filter-group">
                <span class="filter-label">${filter.label}:</span>
                <select class="filter-select" id="${filter.id}" ${filter.disabled ? 'disabled' : ''}>
                    ${filter.options.map(option => 
                        `<option value="${option.value}">${option.label}</option>`
                    ).join('')}
                </select>
                ${filter.comingSoon ? '<span class="coming-soon-tag">Coming Soon</span>' : ''}
            </div>
        `;
    });
    
    // Add view controls if needed
    if (showViewControls) {
        filterHtml += `
            <div class="view-controls">
                <div class="view-options">
                    <button class="view-toggle-btn active" data-view="grid" title="Grid View">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button class="view-toggle-btn" data-view="list" title="List View">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    filterHtml += `</div>`;
    return filterHtml;
}

// Export template functions
export {
    getHeadContent,
    getPageStyleLink,
    getBodyStart,
    getBodyEnd,
    getFilterControls
}; 