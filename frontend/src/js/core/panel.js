// panel.js
/**
 * Panel Component Controller
 * Version: 2.0.0
 * --------------------- */

class PanelController {
    constructor() {
        // Core Elements
        this.panel = document.getElementById('mainPanel');
        this.mobileNav = document.getElementById('mobileNav');
        this.settingsToggle = document.getElementById('mobileSettings');
        
        // Navigation Elements
        this.navItems = document.querySelectorAll('.nav-item');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Theme & Language Controls
        this.themeToggle = document.getElementById('themeToggle');
        this.langToggle = document.getElementById('langToggle');
        
        // State
        this.isMobile = window.innerWidth <= 768;
        this.activeSubmenu = null;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize panel functionality
     */
    init() {
        // Bind event handlers
        this.bindEvents();
        
        // Set initial states
        this.checkMobileState();
        this.loadSavedPreferences();
        
        // Initialize features
        this.initAccessibility();
        this.initAnimations();
        
        // Set up observers
        this.setupResizeObserver();
        this.setupIntersectionObserver();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Navigation Events
        this.navItems.forEach(item => {
            if (item.classList.contains('has-submenu')) {
                const link = item.querySelector('.nav-link');
                const submenu = item.querySelector('.nav-submenu');
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleSubmenu(item, submenu);
                });

                // Keyboard Navigation
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleSubmenu(item, submenu);
                    }
                });
            }
        });

        // Mobile Toggle
        if (this.settingsToggle) {
            this.settingsToggle.addEventListener('click', () => {
                this.toggleMobilePanel();
            });
        }

        // Theme Toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Language Toggle
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Close panel on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (this.isMobile && 
                !this.panel.contains(e.target) && 
                !e.target.closest('.mobile-nav')) {
                this.closeMobilePanel();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }

    /**
     * Toggle submenu state
     * @param {HTMLElement} item - Nav item element
     * @param {HTMLElement} submenu - Submenu element
     */
    toggleSubmenu(item, submenu) {
        const isExpanding = !item.classList.contains('active');
        
        // Close currently open submenu if exists
        if (this.activeSubmenu && this.activeSubmenu !== item) {
            this.closeSubmenu(this.activeSubmenu);
        }
        
        // Toggle current submenu
        item.classList.toggle('active');
        const link = item.querySelector('.nav-link');
        link.setAttribute('aria-expanded', isExpanding);
        
        // Update active submenu reference
        this.activeSubmenu = isExpanding ? item : null;
        
        // Handle animation timing
        if (isExpanding) {
            submenu.style.display = 'block';
            requestAnimationFrame(() => {
                submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                submenu.style.opacity = '1';
            });
        } else {
            submenu.style.maxHeight = '0';
            submenu.style.opacity = '0';
            setTimeout(() => {
                submenu.style.display = 'none';
            }, 300); // Match transition duration
        }
    }

    /**
     * Close specific submenu
     * @param {HTMLElement} item - Nav item to close
     */
    closeSubmenu(item) {
        item.classList.remove('active');
        const submenu = item.querySelector('.nav-submenu');
        const link = item.querySelector('.nav-link');
        
        link.setAttribute('aria-expanded', 'false');
        submenu.style.maxHeight = '0';
        submenu.style.opacity = '0';
        
        setTimeout(() => {
            submenu.style.display = 'none';
        }, 300);
    }

    /**
     * Toggle mobile panel state
     */
    toggleMobilePanel() {
        const isOpening = !this.panel.classList.contains('active');
        
        this.panel.classList.toggle('active');
        this.settingsToggle.setAttribute('aria-expanded', isOpening);
        
        if (isOpening) {
            document.body.style.overflow = 'hidden';
            this.trapFocus();
        } else {
            document.body.style.overflow = '';
            this.releaseFocus();
        }
    }

    /**
     * Close mobile panel
     */
    closeMobilePanel() {
        this.panel.classList.remove('active');
        this.settingsToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.releaseFocus();
    }

    /**
     * Handle escape key press
     */
    handleEscapeKey() {
        if (this.isMobile && this.panel.classList.contains('active')) {
            this.closeMobilePanel();
        }
        if (this.activeSubmenu) {
            this.closeSubmenu(this.activeSubmenu);
        }
    }

    /**
     * Toggle theme preference
     */
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button text
        const buttonText = this.themeToggle.querySelector('.button-text');
        buttonText.textContent = buttonText.dataset[`text${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`];
    }

    /**
     * Toggle language preference
     */
    toggleLanguage() {
        const html = document.documentElement;
        const currentLang = html.getAttribute('lang');
        const newLang = currentLang === 'en' ? 'fa' : 'en';
        
        html.setAttribute('lang', newLang);
        html.dir = newLang === 'fa' ? 'rtl' : 'ltr';
        localStorage.setItem('language', newLang);
        
        this.updateTranslations(newLang);
    }

    /**
     * Update translations across the panel
     * @param {string} lang - Language code
     */
    updateTranslations(lang) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[lang]?.[key];
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    /**
     * Check and update mobile state
     */
    checkMobileState() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            this.handleBreakpointChange();
        }
    }

    /**
     * Handle breakpoint changes
     */
    handleBreakpointChange() {
        if (!this.isMobile) {
            // Reset mobile-specific states
            this.closeMobilePanel();
            this.panel.removeAttribute('style');
        }
        // Close any open submenus
        if (this.activeSubmenu) {
            this.closeSubmenu(this.activeSubmenu);
        }
    }

    /**
     * Initialize accessibility features
     */
    initAccessibility() {
        // Add keyboard navigation
        this.navLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusNextNavItem(link);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.focusPreviousNavItem(link);
                }
            });
        });
    }

    /**
     * Focus trap for mobile panel
     */
    trapFocus() {
        const focusableElements = this.panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length) {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            firstFocusable.focus();
            
            this.panel.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        }
    }

    /**
     * Release focus trap
     */
    releaseFocus() {
        this.settingsToggle.focus();
    }

    /**
     * Set up resize observer
     */
    setupResizeObserver() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                this.checkMobileState();
            }, 250);
        });
    }

    /**
     * Set up intersection observer for animations
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe nav items for animation
        this.navItems.forEach(item => observer.observe(item));
    }

    /**
     * Load saved user preferences
     */
    loadSavedPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Load language preference
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            document.documentElement.setAttribute('lang', savedLang);
            document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
            this.updateTranslations(savedLang);
        }
    }

    /**
     * Initialize animations
     */
    initAnimations() {
        // Add entrance animation classes
        this.navItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
            item.classList.add('animate-in');
        });
    }
}

// Initialize panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PanelController();
});
