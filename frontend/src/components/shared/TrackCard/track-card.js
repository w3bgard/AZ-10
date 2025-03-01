/**
 * Track Card Component
 * Version: 13.0.0
 * Description: Final positioning fixes for CD elements and video icons.
 */

export class TrackCard {
    constructor(trackData) {
        // Initialize with track data
        this.data = this.initializeData(trackData);

        // Build card structure
        this.element = this.createCard();

        // Setup initial events
        this.setupEventListeners();
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
                category: data.basicInfo?.category || 'mainstream'
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

        // Format the release date
        const releaseDate = this.formatDate(this.data.basicInfo.releaseDate);
        
        // Format the rating
        const rating = this.data.stats.communityRating ? 
            this.data.stats.communityRating.toFixed(1) : 'N/A';
        
        // Format votes
        const votes = this.data.stats.numberOfVotes || 0;

        // Create inner HTML with both grid and list views
        card.innerHTML = `
            <!-- Grid View (CD-like) -->
            <div class="card-grid-view">
                <div class="card-image">
                    <img src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="cd-content">
                            <div class="track-rating ${rating === 'N/A' ? 'na-rating' : ''}">${rating}<span>/10</span></div>
                            <div class="cd-center-hole"></div>
                            
                            <div class="cd-buttons">
                                <button class="cd-btn minimal-btn">
                                    <i class="fas fa-info-circle"></i>
                                    <span>MORE INFO</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <h3 class="track-title">${this.data.basicInfo.title}</h3>
                    <div class="artist-name">${this.data.basicInfo.artist}</div>
                    <div class="producer-info">Prod. by ${this.createProducerInfo()}</div>
                    
                    ${this.data.media.hasVideo ? `
                    <div class="video-info">
                        <i class="fas fa-play-circle"></i> Music Video
                    </div>` : ''}
                    
                    <div class="release-date">
                        <i class="fa fa-calendar"></i> ${releaseDate}
                    </div>
                </div>
            </div>

            <!-- List View (Compact Style) -->
            <div class="card-list-view">
                <div class="list-view-image">
                    <img src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}" loading="lazy">
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
                            <span class="list-view-date">${releaseDate}</span>
                            ${this.data.media.hasVideo ? `<span class="list-view-video"><i class="fas fa-play-circle"></i> Video</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="list-view-rating-badge">
                    <div class="rating-pill">
                        <i class="fas fa-star"></i>
                        <span class="rating-value">${rating}</span>
                        <span class="rating-max">/10</span>
                    </div>
                    <div class="votes-pill">
                        <i class="fas fa-users"></i>
                        <span>${votes}</span>
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
        const musicProducer = this.data.productionCredits?.music?.beatProducer;
        return musicProducer || 'Unknown';
    }

    /**
     * Format date in a readable format
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Setup event listeners for the card
     */
    setupEventListeners() {
        this.element.addEventListener('click', (event) => {
            event.preventDefault();
            
            // مسیر صحیح به فایل track-template.html
            window.location.href = `/frontend/src/pages/track-template.html?id=${this.data.id}`;
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
