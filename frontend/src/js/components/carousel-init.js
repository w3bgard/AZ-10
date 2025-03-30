/**
 * Carousel Initialization Script
 * Version: 1.1.0
 * Description: This script initializes carousels as soon as the DOM is ready
 * to prevent layout shifts and ensure smooth user experience.
 */

// Create a global state object if it doesn't exist 
if (!window.AZ10_STATE) {
    window.AZ10_STATE = {};
}

// Keep track of initialization status to prevent duplicate initialization
window.AZ10_STATE.carousels = window.AZ10_STATE.carousels || {
    initialized: false,
    sectionsInitialized: {}
};

// Only add the event listener if we haven't initialized carousels yet
if (!window.AZ10_STATE.carousels.initialized) {
    document.addEventListener('DOMContentLoaded', initializeCarousels);
    console.log('DOMContentLoaded event listener added for carousel initialization');
    
    // Also add a fallback initialization for dynamic loading
    setTimeout(initializeCarousels, 1500);
}

/**
 * Initialize carousels when the DOM is ready
 */
function initializeCarousels() {
    // Prevent duplicate initialization
    if (window.AZ10_STATE.carousels.initialized) {
        console.log('Carousels already initialized, skipping initialization');
        return;
    }
    
    console.log('Initializing carousels...');
    
    // Mark as initialized to prevent duplicate calls
    window.AZ10_STATE.carousels.initialized = true;
    
    // Look for containers that need to be prepared for carousel transformation
    const sectionsToCarousel = [
        'mainstreamTracks',  // Mainstream Latest Drops
        'featuredArtists',   // Featured Artists
        'blogPosts'          // Blogs
    ];
    
    // Flag to check if we need a delayed recheck
    let needsRecheck = false;
    
    sectionsToCarousel.forEach(sectionId => {
        const container = document.getElementById(sectionId);
        if (!container) {
            console.log(`Container #${sectionId} not found, will check again later`);
            needsRecheck = true;
            return;
        }
        
        // Skip if already initialized
        if (window.AZ10_STATE.carousels.sectionsInitialized[sectionId]) {
            console.log(`Carousel for #${sectionId} already initialized, skipping`);
            return;
        }
        
        // Add a placeholder class until the actual carousel is initialized
        container.classList.add('carousel-container-placeholder');
        
        // If there's a loading placeholder, update its text to indicate carousel preparation
        const loadingPlaceholder = container.querySelector('.loading-placeholder');
        if (loadingPlaceholder) {
            loadingPlaceholder.innerHTML = 'Preparing carousel...';
        }
        
        // Mark this section as initialized
        window.AZ10_STATE.carousels.sectionsInitialized[sectionId] = true;
    });
    
    // Only schedule a recheck if we need it
    if (needsRecheck) {
        console.log('Some carousel containers were not found, scheduling a recheck');
        // Avoid multiple simultaneous rechecks
        if (!window.carouselRecheckScheduled) {
            window.carouselRecheckScheduled = true;
            setTimeout(() => {
                window.carouselRecheckScheduled = false;
                checkCarouselInitialization();
            }, 1000);
        }
    }
}

/**
 * Check if carousels are properly initialized and fix them if not
 */
function checkCarouselInitialization() {
    const sectionsToCarousel = [
        'mainstreamTracks',
        'featuredArtists',
        'blogPosts'
    ];
    
    let needsAnotherCheck = false;
    
    sectionsToCarousel.forEach(sectionId => {
        const container = document.getElementById(sectionId);
        if (!container) {
            console.log(`Container #${sectionId} still not found`);
            needsAnotherCheck = true;
            return;
        }
        
        // If carousel is not yet initialized or if it seems to be missing content
        if (!container.getAttribute('data-carousel-initialized') || 
            !container.querySelector('.carousel-track') ||
            container.querySelectorAll('.carousel-slide').length === 0) {
            
            console.log(`Carousel for #${sectionId} needs initialization`);
            needsAnotherCheck = true;
            
            // Avoid triggering resize events too frequently
            if (!window.lastResizeEventTime || Date.now() - window.lastResizeEventTime > 500) {
                window.lastResizeEventTime = Date.now();
                
                // Trigger a resize event to help re-render
                try {
                    const resizeEvent = new Event('resize');
                    window.dispatchEvent(resizeEvent);
                } catch (error) {
                    console.error('Error dispatching resize event:', error);
                }
            }
        } else {
            // If carousel is initialized but has issues, fix them
            fixCarouselNavigation(container);
        }
    });
    
    // Schedule another check only if needed and not already scheduled
    if (needsAnotherCheck && !window.carouselRecheckScheduled) {
        window.carouselRecheckScheduled = true;
        setTimeout(() => {
            window.carouselRecheckScheduled = false;
            checkCarouselInitialization();
        }, 1500);
    }
}

/**
 * Check and attempt to fix a single carousel
 */
function checkSingleCarousel(sectionId) {
    const container = document.getElementById(sectionId);
    if (!container) return;
    
    // If carousel indicators are missing, try to recreate them
    if (!container.querySelector('.carousel-indicators') && container.hasAttribute('data-carousel-initialized')) {
        const track = container.querySelector('.carousel-track');
        if (track && track.children.length > 0) {
            // Create indicators container
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            
            // Calculate how many indicators we need
            const slidesCount = track.children.length;
            const slidesToShow = getSlidesToShow();
            const indicatorsCount = Math.max(1, Math.ceil((slidesCount - slidesToShow + 1) / 1));
            
            console.log(`Creating ${indicatorsCount} indicators for ${slidesCount} slides, showing ${slidesToShow} at a time`);
            
            // Create indicators
            for (let i = 0; i < indicatorsCount; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'carousel-indicator';
                if (i === 0) indicator.classList.add('active');
                
                // Add click handler
                indicator.addEventListener('click', () => {
                    // Calculate target slide
                    const targetSlide = i * 1;
                    
                    // Find all slides
                    const slides = Array.from(track.children);
                    
                    // Calculate the new transform value
                    if (slides.length > 0 && slides[0].offsetWidth) {
                        const slideWidth = slides[0].offsetWidth + 20; // 20px for gap
                        const translateX = -1 * targetSlide * slideWidth;
                        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
                        
                        // Update indicators
                        container.querySelectorAll('.carousel-indicator').forEach((ind, idx) => {
                            if (idx === i) {
                                ind.classList.add('active');
                            } else {
                                ind.classList.remove('active');
                            }
                        });
                    }
                });
                
                indicators.appendChild(indicator);
            }
            
            container.appendChild(indicators);
        }
    }
    
    // If navigation buttons are missing, add them
    if (!container.querySelector('.carousel-nav') && container.hasAttribute('data-carousel-initialized')) {
        addNavigationButtons(container);
    } else {
        // If buttons exist but might not be working, fix them
        fixCarouselNavigation(container);
    }
}

/**
 * Add navigation buttons to a carousel
 */
function addNavigationButtons(container) {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-button prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.setAttribute('aria-label', 'Previous');
    prevButton.setAttribute('type', 'button');
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-button next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('aria-label', 'Next');
    nextButton.setAttribute('type', 'button');
    
    nav.appendChild(prevButton);
    nav.appendChild(nextButton);
    container.appendChild(nav);
    
    // Add click handlers for the buttons
    setupButtonHandlers(container, prevButton, nextButton);
}

/**
 * Set up handlers for navigation buttons
 */
function setupButtonHandlers(container, prevButton, nextButton) {
    const track = container.querySelector('.carousel-track');
    if (!track) return;
    
    // For previous button
    prevButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveCarousel(container, track, -1);
        return false;
    };
    
    // For next button
    nextButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveCarousel(container, track, 1);
        return false;
    };
    
    console.log('Button handlers set up for carousel');
}

/**
 * Fix navigation for a carousel that might have issues
 */
function fixCarouselNavigation(container) {
    const prevButton = container.querySelector('.carousel-button.prev');
    const nextButton = container.querySelector('.carousel-button.next');
    const track = container.querySelector('.carousel-track');
    
    if (prevButton && nextButton && track) {
        // Remove any existing event handlers
        prevButton.removeEventListener('click', null);
        nextButton.removeEventListener('click', null);
        
        // Add direct onclick handlers
        setupButtonHandlers(container, prevButton, nextButton);
    }
}

/**
 * Move the carousel track by a number of slides
 */
function moveCarousel(container, track, direction) {
    if (!track) return;
    
    // Get current transform
    const transform = window.getComputedStyle(track).getPropertyValue('transform');
    let currentTranslateX = 0;
    
    // Parse the transform matrix
    const matrix = transform.match(/^matrix\((.+)\)$/) || transform.match(/^matrix3d\((.+)\)$/);
    if (matrix) {
        const values = matrix[1].split(', ');
        currentTranslateX = parseFloat(values[values.length > 6 ? 12 : 4]);
    }
    
    // Calculate slide width
    const slides = Array.from(track.children);
    if (slides.length === 0) return;
    
    const slideWidth = slides[0].offsetWidth + 20; // 20px for gap
    
    // Calculate slidesToShow based on viewport width
    const slidesToShow = getSlidesToShow();
    
    // Calculate max translation (to prevent scrolling too far)
    const maxTranslateX = -1 * Math.max(0, slides.length - slidesToShow) * slideWidth;
    
    // Calculate new translation
    let newTranslateX = currentTranslateX - (direction * slideWidth);
    
    // Apply bounds or wrap around
    if (newTranslateX > 0) {
        // If we're at the beginning and going back, wrap to the end
        newTranslateX = maxTranslateX;
    } else if (newTranslateX < maxTranslateX) {
        // If we're at the end and going forward, wrap to the beginning
        newTranslateX = 0;
    }
    
    console.log(`Moving carousel: direction=${direction}, from=${currentTranslateX}px, to=${newTranslateX}px, maxTranslate=${maxTranslateX}px`);
    
    // Apply the new transform
    track.style.transform = `translate3d(${newTranslateX}px, 0, 0)`;
    
    // Update indicators
    updateIndicators(container, newTranslateX, slideWidth);
}

/**
 * Get the number of slides to show based on the viewport width
 */
function getSlidesToShow() {
    const width = window.innerWidth;
    if (width < 480) return 1;       // Mobile
    if (width < 768) return 2;       // Tablet small
    if (width < 1024) return 3;      // Tablet large
    if (width < 1440) return 4;      // Desktop small
    return 5;                        // Desktop large
}

/**
 * Update carousel indicators based on current position
 */
function updateIndicators(container, translateX, slideWidth) {
    const indicators = container.querySelectorAll('.carousel-indicator');
    if (!indicators.length) return;
    
    // Calculate active index based on translateX value
    const activeIndex = Math.round(Math.abs(translateX) / slideWidth);
    
    // Update indicator states
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

/**
 * Export function to manually refresh carousels
 * This can be called from other scripts when content changes
 */
export function refreshCarousels() {
    try {
        console.log('Manual carousel refresh requested');
        
        // Reset initialization status for all sections
        if (window.AZ10_STATE && window.AZ10_STATE.carousels) {
            window.AZ10_STATE.carousels.sectionsInitialized = {};
        }
        
        // Re-initialize carousels
        window.AZ10_STATE.carousels.initialized = false;
        initializeCarousels();
        
        return true;
    } catch (error) {
        console.error('Error refreshing carousels:', error);
        return false;
    }
}

// Watch for theme changes which might affect layout
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            // Theme changed, wait a bit for CSS transitions and then refresh carousels
            setTimeout(refreshCarousels, 300);
        }
    });
});

// Start observing theme changes once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    observer.observe(htmlElement, { attributes: true });
}); 