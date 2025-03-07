/**
 * Components Manager
 * Version: 2.0.0 
 */

class ComponentsManager {
    constructor() {
        // Path to components
        this.basePath = '../src/components/layout/';

        // Components references
        this.components = {
            panel: null,
            logo: null,
            mobileNav: null,
            pageInfoHeader: null,
            headerControls: null
        };

        // Initialize core elements
        this.settingsToggle = null;
    }

    /**
     * Initialize components
     */
    async init() {
        try {
            // Load panel component
            await this.loadPanel();
            
            // Add logo to page
            this.addLogoToPage();

            // Initialize panel controller (for mobile and settings)
            this.initializePanelController();

            // Initialize page info components
            this.initializePageInfo();

            // Set up event listeners
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
            // Try multiple possible paths for the panel HTML
            const possiblePaths = [
                `${this.basePath}panel.html`,
                '../components/layout/panel.html',
                '../../src/components/layout/panel.html'
            ];
            
            let loaded = false;
            
            // Try each path until one works
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load panel from: ${path}`);
                    await loadComponent('side-panel', path);
                    console.log(`Successfully loaded panel from: ${path}`);
                    loaded = true;
                    break;
                } catch (error) {
                    console.warn(`Failed to load panel from ${path}:`, error);
                }
            }
            
            if (!loaded) {
                throw new Error('Failed to load panel from any path');
            }
            
            // Store reference to the panel and initialize controller
            this.components.panel = document.getElementById('mainPanel');
            this.initializePanelController();
        } catch (error) {
            console.error('Error in loadPanel:', error);
            throw error;
        }
    }

    /**
     * Initialize page info components
     */
    initializePageInfo() {
        // Get reference to the page info header
        this.components.pageInfoHeader = document.querySelector('.page-info-header');
        
        // Apply dynamic effects or animations if needed
        if (this.components.pageInfoHeader) {
            this.applyPageInfoEffects();
        }
    }
    
    /**
     * Apply dynamic effects to page info header
     */
    applyPageInfoEffects() {
        // Create subtle parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition <= 600) {
                const opacity = 1 - (scrollPosition / 1000);
                const transform = `translateY(${scrollPosition * 0.15}px)`;
                const header = this.components.pageInfoHeader;
                
                if (header) {
                    header.querySelector('.page-title-area').style.transform = transform;
                    header.querySelector('.page-title-area').style.opacity = opacity;
                }
            }
        });
        
        // Add hover animation classes to stat boxes
        const statBoxes = document.querySelectorAll('.stat-box');
        if (statBoxes.length) {
            statBoxes.forEach((box, index) => {
                // Staggered entrance animation classes
                setTimeout(() => {
                    box.classList.add('animated');
                }, 100 * index);
            });
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
     * Initialize panel controller (handles panel, mobile navigation)
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

            // Handle body overflow
            if (this.components.panel.classList.contains('expanded')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    /**
     * Setup event listeners for various interactions
     */
    setupEventListeners() {
        // Close panel when clicked outside (mobile)
        document.addEventListener('click', (e) => {
            if (this.shouldClosePanelOnClick(e)) {
                this.closePanel();
            }
        });

        // Close panel on 'Escape' key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePanel();
            }
        });

        // Handle window resizing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle network status changes (offline/online)
        window.addEventListener('offline', () => {
            console.warn('Network connection lost. Some components may not load correctly.');
        });

        window.addEventListener('online', () => {
            console.log('Network connection restored.');
        });
    }

    /**
     * Check if panel should close on click (outside the panel)
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
     * Close the panel (for mobile view)
     */
    closePanel() {
        if (this.components.panel) {
            this.components.panel.classList.remove('expanded');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle window resizing
     */
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && this.components.panel) {
            this.closePanel();
        }

        // Update logo visibility based on screen size
        if (this.components.logo) {
            this.components.logo.style.display = isMobile ? 'none' : 'flex';
        }
    }
}

// Initialize components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.componentsManager = new ComponentsManager();
    window.componentsManager.init();
});

// Export ComponentsManager for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentsManager;
}

/**
 * Load HTML component
 */
async function loadComponent(id, path) {
    try {
        console.log(`Loading component ${id} from path: ${path}`);
        
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error(`Failed to load component: ${id} from ${path} (Status: ${response.status})`);
        }
        
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with ID '${id}' not found in the DOM`);
        }
        
        const contentText = await response.text();
        if (!contentText || contentText.trim() === '') {
            throw new Error(`Empty content loaded for component: ${id} from ${path}`);
        }
        
        element.innerHTML = contentText;
        
        // Force reload Font Awesome icons for dynamically loaded content
        if (id === 'side-panel') {
            // Add small delay to ensure DOM is updated before rechecking icons
            setTimeout(() => {
                // Check if Font Awesome icons are properly loaded
                const icons = document.querySelectorAll('.fa-solid, .fa-brands, .fas, .fab');
                if (icons.length > 0 && window.getComputedStyle(icons[0]).fontFamily.indexOf('Font Awesome') === -1) {
                    console.log('Reloading Font Awesome...');
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
                    document.head.appendChild(link);
                }
            }, 200);
        }
        
        console.log(`Successfully loaded ${id} component`);
        return true;
    } catch (error) {
        console.error(`Error loading component ${id} from ${path}:`, error);
        throw error;
    }
}
