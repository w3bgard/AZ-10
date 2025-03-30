/**
 * Carousel Component
 * Version: 1.1.0
 * Description: Optimized horizontal sliding gallery for cards
 */

class Carousel {
    constructor(container, options = {}) {
        // Exit early if container is not valid
        if (!container || !(container instanceof HTMLElement)) {
            console.error('Invalid carousel container provided');
            return;
        }
        
        this.container = container;
        this.options = {
            slidesToShow: options.slidesToShow || 4,
            slidesToScroll: options.slidesToScroll || 1,
            infinite: options.infinite !== undefined ? options.infinite : true,
            autoplay: options.autoplay || false,
            autoplaySpeed: options.autoplaySpeed || 3000,
            showIndicators: options.showIndicators !== undefined ? options.showIndicators : true,
            showArrows: options.showArrows !== undefined ? options.showArrows : true,
            ...options
        };

        this.currentSlide = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.track = null;
        this.autoplayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchMoveX = 0;
        this.isDragging = false;
        this.initialTranslateX = 0;
        this.isInitialized = false;
        
        // Defer initialization to avoid blocking main thread
        setTimeout(() => {
            this.init();
        }, 10);
    }

    init() {
        try {
            // Exit if already initialized or container is missing
            if (this.isInitialized || !this.container) return;
            
            console.log(`Initializing carousel for container: ${this.container.id || 'unnamed'}`);
            
            // Create the carousel structure
            this.createCarouselStructure();
            
            // Get all slides
            this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
            this.totalSlides = this.slides.length;
            
            // If no slides, exit early
            if (this.totalSlides === 0) {
                console.warn('No slides found for carousel');
                return;
            }
            
            // Setup responsive behavior
            this.setupResponsive();
            
            // Add event listeners with delay to avoid blocking
            setTimeout(() => {
                this.addEventListeners();
            }, 50);
            
            // Initialize autoplay if enabled
            if (this.options.autoplay) {
                setTimeout(() => {
                    this.startAutoplay();
                }, 100);
            }
            
            // Update UI for initial state
            this.updateUI();
            
            this.isInitialized = true;
            
            console.log(`Carousel initialized with ${this.totalSlides} slides, showing ${this.options.slidesToShow} at a time`);
        } catch (error) {
            console.error('Error initializing carousel:', error);
        }
    }

    // Implementation of refresh method for external calls
    refresh() {
        if (!this.isInitialized) return;
        
        try {
            this.setupResponsive();
            this.updateUI();
            console.log('Carousel refreshed');
        } catch (error) {
            console.error('Error refreshing carousel:', error);
        }
    }
    
    // Simplified version of existing methods

    createCarouselStructure() {
        // Get the original content
        const originalContent = Array.from(this.container.children);
        
        // Create track container
        this.track = document.createElement('div');
        this.track.className = 'carousel-track';
        
        // Remove loading placeholders if any
        const loadingPlaceholders = originalContent.filter(item => 
            item.classList && item.classList.contains('loading-placeholder'));
        loadingPlaceholders.forEach(placeholder => placeholder.remove());
        
        // Get actual content items (excluding placeholders)
        const contentItems = originalContent.filter(item => 
            !item.classList || !item.classList.contains('loading-placeholder'));
        
        // Wrap each item in a slide
        contentItems.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.appendChild(item);
            this.track.appendChild(slide);
        });
        
        // Clear and append the new structure
        this.container.innerHTML = '';
        this.container.appendChild(this.track);
        
        // Add navigation if needed
        if (this.options.showArrows) {
            const nav = document.createElement('div');
            nav.className = 'carousel-nav';
            
            const prevButton = document.createElement('button');
            prevButton.className = 'carousel-button prev';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.setAttribute('aria-label', 'Previous');
            prevButton.type = 'button'; // Prevent form submission
            
            const nextButton = document.createElement('button');
            nextButton.className = 'carousel-button next';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.setAttribute('aria-label', 'Next');
            nextButton.type = 'button'; // Prevent form submission
            
            nav.appendChild(prevButton);
            nav.appendChild(nextButton);
            this.container.appendChild(nav);
        }
        
        // Add indicators if needed
        if (this.options.showIndicators) {
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            this.container.appendChild(indicators);
        }
    }

    setupResponsive() {
        // Get the current viewport width
        const viewportWidth = window.innerWidth;
        
        // Adjust slidesToShow based on viewport width
        if (viewportWidth < 480) {
            this.options.slidesToShow = 1;
        } else if (viewportWidth < 768) {
            this.options.slidesToShow = 2;
        } else if (viewportWidth < 1200) {
            this.options.slidesToShow = 3;
        } else {
            this.options.slidesToShow = 4;
        }
        
        // Update slide widths
        this.updateSlideWidths();
    }

    updateSlideWidths() {
        if (!this.slides.length) return;
        
        const containerWidth = this.container.clientWidth;
        const slideWidth = Math.floor((containerWidth / this.options.slidesToShow) - 20); // 20px for gap
        
        this.slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
    }

    addEventListeners() {
        try {
            // Navigation buttons
            const prevButton = this.container.querySelector('.carousel-button.prev');
            const nextButton = this.container.querySelector('.carousel-button.next');
            
            if (prevButton) {
                prevButton.onclick = (e) => {
                    e.preventDefault();
                    this.goToPrev();
                    return false;
                };
            }
            
            if (nextButton) {
                nextButton.onclick = (e) => {
                    e.preventDefault();
                    this.goToNext();
                    return false;
                };
            }
            
            // Window resize event - debounced
            let resizeTimeout;
            window.addEventListener('resize', () => {
                if (resizeTimeout) clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.setupResponsive();
                    this.updateUI();
                }, 200);
            });
            
            // Update indicators if present
            if (this.options.showIndicators) {
                this.updateIndicators();
            }
        } catch (error) {
            console.error('Error adding carousel event listeners:', error);
        }
    }

    updateIndicators() {
        const indicatorsContainer = this.container.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';
        
        // Calculate how many indicators we need
        const numPages = Math.max(1, Math.ceil((this.totalSlides - this.options.slidesToShow + 1) / this.options.slidesToScroll));
        
        // Create indicators (limit to max 10 indicators)
        const maxIndicators = Math.min(numPages, 10);
        for (let i = 0; i < maxIndicators; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                this.goToSlide(i * this.options.slidesToScroll);
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }

    updateUI() {
        // Update track position
        this.updateTrackPosition();
        
        // Update button states
        this.updateButtonStates();
        
        // Update indicators
        this.updateActiveIndicator();
    }

    updateTrackPosition() {
        if (!this.slides.length || !this.track) return;
        
        try {
            const slideWidth = this.slides[0].offsetWidth + 20; // 20px for gap
            const translateX = -1 * this.currentSlide * slideWidth;
            
            // Apply transform with hardware acceleration
            this.track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        } catch (error) {
            console.error('Error updating track position:', error);
        }
    }

    updateButtonStates() {
        const prevButton = this.container.querySelector('.carousel-button.prev');
        const nextButton = this.container.querySelector('.carousel-button.next');
        
        if (!prevButton || !nextButton) return;
        
        if (this.options.infinite) {
            prevButton.disabled = false;
            nextButton.disabled = false;
            return;
        }
        
        // Handle edge cases for non-infinite carousels
        prevButton.disabled = this.currentSlide <= 0;
        nextButton.disabled = this.currentSlide >= this.totalSlides - this.options.slidesToShow;
    }

    updateActiveIndicator() {
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        if (!indicators.length) return;
        
        // Calculate current page
        const currentPage = Math.floor(this.currentSlide / this.options.slidesToScroll);
        
        // Remove active class from all indicators
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current indicator if it exists
        if (indicators[currentPage]) {
            indicators[currentPage].classList.add('active');
        }
    }

    goToNext() {
        const maxSlide = this.options.infinite ? 
            this.totalSlides - 1 : 
            this.totalSlides - this.options.slidesToShow;
            
        if (this.currentSlide >= maxSlide && !this.options.infinite) {
            return;
        }
        
        if (this.currentSlide >= this.totalSlides - this.options.slidesToShow) {
            if (this.options.infinite) {
                this.currentSlide = 0;
            }
        } else {
            this.currentSlide += this.options.slidesToScroll;
        }
        
        this.updateUI();
    }

    goToPrev() {
        if (this.currentSlide <= 0) {
            if (this.options.infinite) {
                this.currentSlide = this.totalSlides - this.options.slidesToShow;
            }
        } else {
            this.currentSlide -= this.options.slidesToScroll;
        }
        
        if (this.currentSlide < 0) {
            this.currentSlide = 0;
        }
        
        this.updateUI();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        
        // Ensure within bounds
        if (this.currentSlide < 0) {
            this.currentSlide = 0;
        }
        
        const maxSlide = this.totalSlides - this.options.slidesToShow;
        if (this.currentSlide > maxSlide) {
            this.currentSlide = maxSlide;
        }
        
        this.updateUI();
    }

    startAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
        }
        
        this.autoplayTimer = setInterval(() => {
            this.goToNext();
        }, this.options.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
}

// Make it available globally
window.Carousel = Carousel;

// Export for module usage
export { Carousel }; 