/**
 * Common UI Elements
 * 
 * This file contains shared UI elements that are used across multiple pages
 * to maintain consistency and reduce code duplication.
 */

// Initialize common UI elements
function initCommonElements() {
    // Initialize side panel
    initSidePanel();
    
    // Initialize error container
    initErrorContainer();
    
    // Initialize loading indicator
    initLoadingIndicator();
}

// Initialize side panel with common navigation
function initSidePanel() {
    const sidePanel = document.getElementById('side-panel');
    if (!sidePanel) return;
    
    // Common side panel content
    sidePanel.innerHTML = `
        <div class="panel-header">
            <a href="/" class="logo">
                <img src="../src/assets/images/logo.svg" alt="AZ10 Logo">
            </a>
            <button class="close-panel-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <nav class="main-nav">
            <ul>
                <li><a href="/" class="nav-link"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="/new-drops.html" class="nav-link"><i class="fas fa-music"></i> Latest Drops</a></li>
                <li><a href="/artists.html" class="nav-link"><i class="fas fa-user-music"></i> Artists</a></li>
                <li><a href="/blogs.html" class="nav-link"><i class="fas fa-newspaper"></i> Blogs</a></li>
                <li><a href="/community.html" class="nav-link"><i class="fas fa-users"></i> Community</a></li>
            </ul>
        </nav>
        <div class="panel-footer">
            <button class="fullscreen-toggle">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = sidePanel.querySelector('.close-panel-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidePanel.classList.remove('active');
        });
    }
    
    // Highlight active page in navigation
    const currentPath = window.location.pathname;
    const navLinks = sidePanel.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (currentPath === link.getAttribute('href') || 
            (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.classList.add('active');
        }
    });
    
    // Initialize theme toggle button after it's added to the DOM
    if (window.themeController) {
        window.themeController.initThemeToggles();
    }
}

// Initialize error container for displaying messages
function initErrorContainer() {
    const errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) return;
    
    // Global function to show errors
    window.showError = function(message, duration = 5000) {
        const errorMessage = errorContainer.querySelector('.error-message');
        errorMessage.textContent = message;
        errorContainer.style.display = 'flex';
        
        // Auto hide after duration
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, duration);
    };
}

// Initialize loading indicator
function initLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (!loadingIndicator) return;
    
    // Global functions to show/hide loading state
    window.showLoading = function() {
        loadingIndicator.style.display = 'flex';
    };
    
    window.hideLoading = function() {
        loadingIndicator.style.display = 'none';
    };
}

// Generate HTML for page header
function createPageHeader(title, description) {
    return `
        <div class="page-header">
            <h1 class="page-title">${title}</h1>
            <p class="page-description">${description}</p>
        </div>
    `;
}

// Export all functions
export {
    initCommonElements,
    initSidePanel,
    initErrorContainer,
    initLoadingIndicator,
    createPageHeader
}; 