/**
 * Track Card Component
 * Version: 13.1.0
 * Description: Added relative time display for release dates.
 */

export class TrackCard {
    constructor(trackData) {
        // Initialize with track data
        this.data = this.initializeData(trackData);

        // Build card structure
        this.element = this.createCard();

        // Setup initial events
        this.setupEventListeners();
        
        // Set innerHTML for date content to render HTML tags
        this.setupDateContent();
    }

    /**
     * Initialize data with default values
     */
    initializeData(data) {
        return {
            id: data.id || '',
            basicInfo: {
                title: data.basicInfo?.title || 'Untitled Track',
                artist: data.basicInfo?.artist || 'Unknown Artist',
                trackType: data.basicInfo?.trackType || 'Single',
                albumTitle: data.basicInfo?.albumTitle || '',
                releaseDate: data.basicInfo?.releaseDate || '',
                label: data.basicInfo?.label || '',
                category: data.basicInfo?.category || 'persian-hiphop'
            },
            stats: {
                communityRating: data.stats?.communityRating || 0,
                numberOfVotes: data.stats?.numberOfVotes || 0
            },
            media: {
                coverArt: data.media?.coverArt || '/images/default-cover.jpg',
                hasVideo: data.media?.hasVideo || false
            },
            metadata: {
                duration: data.metadata?.duration || '',
                explicit: data.metadata?.explicit || false
            },
            productionCredits: data.productionCredits || {},
            streamingLinks: data.streamingLinks || {}
        };
    }

    /**
     * Create the track card with both grid and list layouts
     */
    createCard() {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.setAttribute('data-track-id', this.data.id);

        // Format the release date with relative time
        const releaseDate = this.formatDateWithRelativeTime(this.data.basicInfo.releaseDate);

        // Create inner HTML with both grid and list views
        card.innerHTML = `
            <!-- Grid View (CD-like) -->
            <div class="card-grid-view">
                <div class="card-image">
                    <img src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}" loading="lazy" onerror="this.src='/images/default-cover.jpg'">
                    <div class="card-overlay">
                        <div class="cd-content">
                            <div class="cd-center-hole"></div>
                            
                            <div class="cd-buttons">
                                <button class="cd-btn minimal-btn">
                                    <i class="fas fa-info-circle"></i>
                                    <span>MORE</span>
                                </button>
                                ${this.data.media.hasVideo ? `
                                <button class="cd-btn minimal-btn video-btn">
                                    <i class="fas fa-play-circle"></i>
                                    <span>VIDEO</span>
                                </button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <div class="artist-name">${this.data.basicInfo.artist}</div>
                    <h3 class="track-title">${this.data.basicInfo.title}</h3>
                    <div class="producer-info">Prod. by ${this.createProducerInfo()}</div>
                    
                    ${this.data.media.hasVideo ? `
                    <div class="video-info">
                        <i class="fas fa-play-circle"></i> Music Video
                    </div>` : ''}
                    
                    <div class="release-date">
                        <i class="fa fa-calendar"></i> <span class="date-content">${releaseDate}</span>
                    </div>
                </div>
            </div>

            <!-- List View (Compact Style) -->
            <div class="card-list-view">
                <div class="list-view-image">
                    <img src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}" loading="lazy" onerror="this.src='/images/default-cover.jpg'">
                    <div class="list-view-click-indicator">
                        <div class="click-indicator-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                    </div>
                </div>
                <div class="list-view-content">
                    <div class="list-view-header">
                        <h3 class="track-title">${this.data.basicInfo.title}</h3>
                        <div class="artist-name">${this.data.basicInfo.artist}</div>
                    </div>
                    <div class="list-view-details">
                        <div class="list-view-info">
                            <span class="list-view-producer">Prod. by ${this.createProducerInfo()}</span>
                            ${this.data.media.hasVideo ? `<span class="list-view-video"><i class="fas fa-play-circle"></i> Video</span>` : ''}
                            <span class="list-view-date"><span class="date-content">${releaseDate}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Create producer info text
     */
    createProducerInfo() {
        // Check for different possible producer field structures in the JSON
        const productionCredits = this.data.productionCredits;
        
        if (productionCredits?.music?.beatProducer) {
            return productionCredits.music.beatProducer;
        }
        
        // Handle case where beatProducer might be an array
        if (Array.isArray(productionCredits?.music?.beatProducer)) {
            return productionCredits.music.beatProducer.join(', ');
        }
        
        // Check for other producer fields that might exist in the JSON
        if (productionCredits?.music?.producer) {
            return productionCredits.music.producer;
        }
        
        return 'Unknown';
    }

    /**
     * Calculate relative time from a date
     */
    calculateRelativeTime(dateString) {
        if (!dateString) return '';
        
        try {
            const releaseDate = new Date(dateString);
            const today = new Date();
            
            // Set both dates to midnight for accurate day comparison
            const releaseDateMidnight = new Date(releaseDate.getFullYear(), releaseDate.getMonth(), releaseDate.getDate());
            const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            const diffTime = todayMidnight - releaseDateMidnight;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                return 'today';
            } else if (diffDays === 1) {
                return '1 day ago';
            } else if (diffDays > 1) {
                return `${diffDays} days ago`;
            } else if (diffDays === -1) {
                return 'tomorrow';
            } else if (diffDays < -1) {
                return `in ${Math.abs(diffDays)} days`;
            }
            
            return '';
        } catch (error) {
            console.warn('Error calculating relative time:', error);
            return '';
        }
    }

    /**
     * Format date with relative time in a readable format
     */
    formatDateWithRelativeTime(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const relativeTime = this.calculateRelativeTime(dateString);
            
            if (relativeTime) {
                return `${formattedDate}   <span class="relative-time">${relativeTime}</span>`;
            }
            
            return formattedDate;
        } catch (error) {
            console.warn('Invalid date format:', dateString);
            return dateString; // Return original string if parsing fails
        }
    }

    /**
     * Format date in a readable format (kept for backward compatibility)
     */
    formatDate(dateString) {
        return this.formatDateWithRelativeTime(dateString);
    }

    /**
     * Setup date content with proper HTML rendering
     */
    setupDateContent() {
        const dateElements = this.element.querySelectorAll('.date-content');
        dateElements.forEach(element => {
            const dateString = this.formatDateWithRelativeTime(this.data.basicInfo.releaseDate);
            element.innerHTML = dateString;
        });
    }

    /**
     * Setup event listeners for the card
     */
    setupEventListeners() {
        this.element.addEventListener('click', (event) => {
            // Check if the container is in drag mode
            const container = this.element.closest('.tracks-container');
            if (container && container.classList.contains('active-drag')) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            
            event.preventDefault();
            
            // Navigate to track details page using hash-based routing
            console.log(`Opening track details for: ${this.data.basicInfo.title} by ${this.data.basicInfo.artist}`);
            window.location.hash = `#track/${this.data.id}`;
        });
    }

    /**
     * Create a URL-friendly slug from artist name
     */
    createArtistSlug(artistName) {
        return artistName.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '');
    }

    /**
     * Create a URL-friendly slug from track title
     */
    createTrackSlug(trackTitle) {
        return trackTitle.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '');
    }
} 