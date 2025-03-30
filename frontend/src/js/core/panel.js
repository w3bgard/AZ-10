// panel.js
/**
 * Panel Component Controller
 * Version: 2.0.0
 * --------------------- */

export class PanelController {
    constructor() {
        // Core Elements
        this.panel = document.getElementById('mainPanel');
        this.mobileNav = document.getElementById('mobileNav');
        this.settingsToggle = document.getElementById('mobileSettings');
        
        // Navigation Elements
        this.navItems = document.querySelectorAll('.nav-item');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // State
        this.isMobile = window.innerWidth <= 768;
        this.isDesktop = window.innerWidth >= 1025;
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
            const link = item.querySelector('.nav-link');
            
            // For expandable items with submenu
            if (item.classList.contains('expandable')) {
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
     * Toggle theme between light and dark
     * Method kept for backwards compatibility but will delegate to global theme controller
     */
    toggleTheme() {
        try {
            console.log('PanelController: toggleTheme called');
            
            // Use global theme toggle function if available
            if (typeof window.toggleTheme === 'function') {
                console.log('PanelController: Using global toggleTheme function');
                window.toggleTheme();
            } else {
                console.warn('PanelController: Global toggleTheme function not available, creating local implementation');
                
                // Fallback implementation
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                // Update theme attribute
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Trigger custom event
                const event = new CustomEvent('az10themechange', {
                    detail: { theme: newTheme }
                });
                document.dispatchEvent(event);
                
                console.log(`PanelController: Theme toggled to ${newTheme}`);
            }
        } catch (error) {
            console.error('PanelController: Error in toggleTheme:', error);
        }
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
        
        // Apply staggered animation to submenu items
        if (isExpanding) {
            const submenuItems = item.querySelectorAll('.submenu-item');
            submenuItems.forEach((subItem, index) => {
                subItem.style.setProperty('--item-index', index);
            });
        }
    }

    /**
     * Close specific submenu
     * @param {HTMLElement} item - Nav item to close
     */
    closeSubmenu(item) {
        item.classList.remove('active');
        const link = item.querySelector('.nav-link');
        link.setAttribute('aria-expanded', 'false');
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
     * Check mobile/desktop state
     */
    checkMobileState() {
        const width = window.innerWidth;
        this.isMobile = width <= 768;
        this.isDesktop = width >= 1025;
        
        // Ensure panel is visible on desktop
        if (this.isDesktop) {
            this.panel.classList.remove('active');
        }
    }

    /**
     * Handle breakpoint changes
     */
    handleBreakpointChange() {
        this.checkMobileState();
        
        if (this.isMobile) {
            document.body.style.overflow = '';
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
    }

    /**
     * Initialize animations for panel elements
     */
    initAnimations() {
        // Pre-set submenu item indexes for staggered animations
        document.querySelectorAll('.nav-item.expandable').forEach(item => {
            const submenuItems = item.querySelectorAll('.submenu-item');
            submenuItems.forEach((subItem, index) => {
                subItem.style.setProperty('--item-index', index);
            });
        });
        
        // Add animation classes once DOM is loaded
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.add('animate-ready');
        });
    }

    /**
     * Focus next navigation item
     * @param {HTMLElement} currentLink - Current navigation link
     */
    focusNextNavItem(currentLink) {
        const currentItem = currentLink.closest('.nav-item');
        const nextItem = currentItem.nextElementSibling;
        
        if (nextItem) {
            const nextLink = nextItem.querySelector('.nav-link');
            if (nextLink) {
                nextLink.focus();
            }
        }
    }

    /**
     * Focus previous navigation item
     * @param {HTMLElement} currentLink - Current navigation link
     */
    focusPreviousNavItem(currentLink) {
        const currentItem = currentLink.closest('.nav-item');
        const prevItem = currentItem.previousElementSibling;
        
        if (prevItem) {
            const prevLink = prevItem.querySelector('.nav-link');
            if (prevLink) {
                prevLink.focus();
            }
        }
    }
}

// Initialize panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PanelController();
});
