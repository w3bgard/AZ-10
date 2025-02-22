/**
 * Components Manager
 * Version: 2.0.0 
 */

class ComponentsManager {
    constructor() {
        this.basePath = '../src/components/layout/';
        this.components = {
            panel: null,
            logo: null,
            mobileNav: null
        };
    }

    /**
     * Initialize components
     */
    async init() {
        try {
            await this.loadPanel();
            this.addLogoToPage();
            this.initializePanelController();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }

    /**
     * Load panel component
     */
    async loadPanel() {
        try {
            const panelResponse = await fetch(`${this.basePath}panel.html`);
            const panelHtml = await panelResponse.text();
            const navContainer = document.querySelector('.nav-container');
            
            if (navContainer) {
                navContainer.innerHTML = panelHtml;
                this.components.panel = document.getElementById('mainPanel');
            }
        } catch (error) {
            console.error('Error loading panel:', error);
        }
    }

    /**
     * Add logo section to page
     */
    addLogoToPage() {
        const logoSection = document.createElement('div');
        logoSection.className = 'logo-section';
        logoSection.innerHTML = `
            <a href="/" class="logo-link" aria-label="Go to AZ10 Homepage">
                <img src="https://az-10-bucket.storage.iran.liara.space/Visual%20Identity/Logo/01%20AZ10-White-Logo.png"
                     alt="AZ10 Logo" 
                     class="logo-img"
                     width="50"
                     height="50"
                     loading="eager">
            </a>
        `;
        document.body.appendChild(logoSection);
        this.components.logo = logoSection;
    }

    /**
     * Initialize panel controller
     */
    initializePanelController() {
        if (this.components.panel) {
            this.components.mobileNav = document.getElementById('mobileNav');
            this.settingsToggle = document.querySelector('.settings-toggle');
            
            if (this.settingsToggle) {
                this.settingsToggle.addEventListener('click', () => {
                    this.togglePanel();
                });
            }
        }
    }

    /**
     * Toggle panel state
     */
    togglePanel() {
        if (this.components.panel) {
            this.components.panel.classList.toggle('expanded');
            
            // Handle body scroll
            if (this.components.panel.classList.contains('expanded')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close panel on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (this.shouldClosePanelOnClick(e)) {
                this.closePanel();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePanel();
            }
        });

        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle network status
        window.addEventListener('offline', () => {
            console.warn('Network connection lost. Some components may not load correctly.');
        });

        window.addEventListener('online', () => {
            console.log('Network connection restored.');
        });
    }

    /**
     * Check if panel should close on click
     */
    shouldClosePanelOnClick(event) {
        return (
            this.components.panel &&
            this.components.panel.classList.contains('expanded') &&
            !this.components.panel.contains(event.target) &&
            !event.target.closest('.mobile-nav')
        );
    }

    /**
     * Close panel
     */
    closePanel() {
        if (this.components.panel) {
            this.components.panel.classList.remove('expanded');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && this.components.panel) {
            this.closePanel();
        }

        // Update logo visibility
        if (this.components.logo) {
            this.components.logo.style.display = isMobile ? 'none' : 'flex';
        }
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.componentsManager = new ComponentsManager();
    window.componentsManager.init();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentsManager;
}