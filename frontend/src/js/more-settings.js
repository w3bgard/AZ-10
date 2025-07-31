/**
 * More Settings Module
 * Handles the more settings button functionality including theme switching
 * Optimized and refactored version with enhanced accessibility and performance
 */

class MoreSettings {
    constructor() {
        this.moreButton = null;
        this.settingsWindow = null;
        this.themeToggleBtn = null;
        this.isInitialized = false;
        this.currentTheme = 'dark'; // Default theme
        this.isSettingsOpen = false;
        
        // Bind methods to preserve context
        this.handleMoreButtonClick = this.handleMoreButtonClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleThemeToggle = this.handleThemeToggle.bind(this);
        
        this.init();
    }

    init() {
        // Use DOMContentLoaded or load event for better compatibility
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupMoreButton();
            });
        } else {
            this.setupMoreButton();
        }
    }

    setupMoreButton() {
        try {
            this.moreButton = document.getElementById('more-button');
            
            if (!this.moreButton) {
                console.warn('More button not found in DOM');
                return;
            }

            this.initializeMoreButton();
            this.createSettingsWindow();
            this.bindEvents();
            
            // Apply theme immediately when page loads
            this.applyInitialTheme();
            
            console.log('More Settings initialized successfully');
        } catch (error) {
            console.error('Error setting up More Settings:', error);
        }
    }

    initializeMoreButton() {
        // Set accessibility attributes
        this.moreButton.setAttribute('aria-label', 'More Settings');
        this.moreButton.setAttribute('title', 'More Settings');
        this.moreButton.setAttribute('role', 'button');
        this.moreButton.setAttribute('tabindex', '0');
        this.moreButton.setAttribute('aria-expanded', 'false');
        this.moreButton.setAttribute('aria-haspopup', 'true');

        // Add icon
        this.moreButton.innerHTML = '<i class="fas fa-ellipsis-h"></i>';

        // Create more text element if it doesn't exist
        if (!this.moreButton.parentElement.querySelector('.more-text')) {
            const moreText = document.createElement('span');
            moreText.className = 'more-text';
            moreText.textContent = 'More';
            this.moreButton.parentElement.appendChild(moreText);
        }
    }

    createSettingsWindow() {
        // Remove existing settings window if any
        const existingWindow = document.querySelector('.settings-window');
        if (existingWindow) {
            existingWindow.remove();
        }

        this.settingsWindow = document.createElement('div');
        this.settingsWindow.className = 'settings-window';
        this.settingsWindow.setAttribute('role', 'dialog');
        this.settingsWindow.setAttribute('aria-label', 'Settings Menu');
        this.settingsWindow.setAttribute('aria-modal', 'true');
        this.settingsWindow.setAttribute('aria-hidden', 'true');
        
        this.settingsWindow.innerHTML = `
            <div class="settings-content">
                <div class="settings-item">
                    <span class="settings-label">Theme</span>
                    <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Toggle theme">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
                <div class="settings-divider"></div>
                <div class="footer-info">
                    <div class="footer-header">CONNECT WITH US</div>
                    <div class="social-icons">
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
                        <a href="#" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
                        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                    </div>
                    <div class="copyright">© 2025 AZ10</div>
                    <div class="copyright">All rights reserved</div>
                    <div class="community">By The Community / For The Community</div>
                    <div class="version">MVP / AI-Driven</div>
                </div>
            </div>
        `;

        document.body.appendChild(this.settingsWindow);
    }

    bindEvents() {
        // More button click
        this.moreButton.addEventListener('click', this.handleMoreButtonClick);

        // Keyboard support for more button
        this.moreButton.addEventListener('keydown', this.handleKeydown);

        // Close settings window when clicking outside
        document.addEventListener('click', this.handleOutsideClick);

        // Close on Escape key
        document.addEventListener('keydown', this.handleKeydown);
    }

    handleMoreButtonClick(e) {
        e.stopPropagation();
        this.toggleSettingsWindow();
    }

    handleOutsideClick(e) {
        if (this.settingsWindow && 
            !this.settingsWindow.contains(e.target) && 
            !this.moreButton.contains(e.target)) {
            this.closeSettingsWindow();
        }
    }

    handleKeydown(e) {
        // Handle more button keyboard events
        if (e.target === this.moreButton && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            this.toggleSettingsWindow();
            return;
        }

        // Handle theme toggle keyboard events
        if (e.target === this.themeToggleBtn && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            this.handleThemeToggle(e);
            return;
        }

        // Handle Escape key
        if (e.key === 'Escape' && this.isSettingsOpen) {
            this.closeSettingsWindow();
        }
    }

    handleThemeToggle(e) {
        e.stopPropagation();
        this.toggleTheme();
    }

    toggleSettingsWindow() {
        if (this.isSettingsOpen) {
            this.closeSettingsWindow();
        } else {
            this.openSettingsWindow();
        }
    }

    openSettingsWindow() {
        // Initialize theme functionality
        this.initializeTheme();
        
        // Calculate position
        const position = this.calculateWindowPosition();
        
        // Apply position
        this.settingsWindow.style.left = position.left + 'px';
        this.settingsWindow.style.top = position.top + 'px';
        
        // Show window
        this.settingsWindow.classList.add('active');
        this.settingsWindow.setAttribute('aria-hidden', 'false');
        this.moreButton.setAttribute('aria-expanded', 'true');
        this.isSettingsOpen = true;
        
        // Focus the theme toggle button for accessibility
        setTimeout(() => {
            this.themeToggleBtn?.focus();
        }, 100);

        // Prevent body scroll when settings are open
        document.body.style.overflow = 'hidden';
    }

    closeSettingsWindow() {
        this.settingsWindow.classList.remove('active');
        this.settingsWindow.setAttribute('aria-hidden', 'true');
        this.moreButton.setAttribute('aria-expanded', 'false');
        this.isSettingsOpen = false;
        
        // Return focus to more button
        this.moreButton.focus();

        // Restore body scroll
        document.body.style.overflow = '';
    }

    calculateWindowPosition() {
        const buttonRect = this.moreButton.getBoundingClientRect();
        const windowWidth = 280; // Settings window width
        const windowHeight = 200; // Approximate height
        const margin = 10;
        
        let left = buttonRect.left - windowWidth - margin;
        let top = buttonRect.top + margin;
        
        // Check if window would go off-screen to the left
        if (left < margin) {
            left = buttonRect.right + margin;
        }
        
        // Check if window would go off-screen to the bottom
        if (top + windowHeight > window.innerHeight - margin) {
            top = window.innerHeight - windowHeight - margin;
        }
        
        // Ensure window doesn't go off-screen to the top
        if (top < margin) {
            top = margin;
        }
        
        return { left, top };
    }

    applyInitialTheme() {
        // Load saved theme or use default
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Apply theme immediately
        this.applyTheme(this.currentTheme);
    }

    initializeTheme() {
        if (this.isInitialized) return;
        
        this.themeToggleBtn = document.getElementById('themeToggleBtn');
        if (!this.themeToggleBtn) {
            console.warn('Theme toggle button not found');
            return;
        }

        // Update button state to match current theme
        if (this.currentTheme === 'dark') {
            this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        }
        
        // Bind theme toggle event
        this.themeToggleBtn.addEventListener('click', this.handleThemeToggle);

        this.isInitialized = true;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            body.classList.remove('dark-theme');
            this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        }
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));

        // Add a small animation to the theme toggle button
        this.themeToggleBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.themeToggleBtn.style.transform = 'scale(1)';
        }, 150);
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.applyTheme(theme);
        }
    }

    // Public method to check if settings are open
    isOpen() {
        return this.isSettingsOpen;
    }

    // Cleanup method
    destroy() {
        if (this.moreButton) {
            this.moreButton.removeEventListener('click', this.handleMoreButtonClick);
            this.moreButton.removeEventListener('keydown', this.handleKeydown);
        }
        
        if (this.themeToggleBtn) {
            this.themeToggleBtn.removeEventListener('click', this.handleThemeToggle);
        }
        
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleKeydown);
        
        if (this.settingsWindow) {
            this.settingsWindow.remove();
        }
    }
}

// Initialize the More Settings module
const moreSettings = new MoreSettings();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoreSettings;
}