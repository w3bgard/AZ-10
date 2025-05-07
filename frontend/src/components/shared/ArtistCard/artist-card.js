/**
 * Artist Card Component
 * Version: 1.0.0
 * Description: Component for displaying artist cards with grid and list views.
 */

export class ArtistCard {
    constructor(artistData) {
        // Initialize with artist data
        this.data = this.initializeData(artistData);

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
            name: data.name || 'Unknown Artist',
            image: data.image || '/assets/images/placeholder-artist.jpg',
            genre: data.genre || 'Hip-Hop',
            featured: data.featured || false,
            bio: data.bio || '',
            trackCount: data.trackCount || 0,
            averageRating: data.averageRating || '0.0',
            social: data.social || {}
        };
    }

    /**
     * Create the artist card with both grid and list layouts
     */
    createCard() {
        const card = document.createElement('div');
        card.className = 'artist-card carousel-slide';
        card.setAttribute('data-artist-id', this.data.id);

        // Create inner HTML with both grid and list views
        card.innerHTML = `
            <!-- Grid View (CD-like) -->
            <div class="card-grid-view">
                <div class="card-image">
                    <img src="${this.data.image}" alt="${this.data.name}" loading="lazy">
                    <div class="card-overlay">
                        <div class="cd-content">
                            <div class="cd-buttons">
                                <button class="cd-btn minimal-btn">
                                    <i class="fas fa-info-circle"></i>
                                    <span>MORE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <h3 class="artist-name">${this.data.name}</h3>
                    <p class="artist-genre">${this.data.genre}</p>
                    <div class="artist-stats">
                        <span class="stat"><i class="fas fa-music"></i> ${this.data.trackCount}</span>
                        <span class="stat"><i class="fas fa-star"></i> ${this.data.averageRating}</span>
                    </div>
                </div>
            </div>

            <!-- List View (Compact Style) -->
            <div class="card-list-view">
                <div class="list-view-image">
                    <img src="${this.data.image}" alt="${this.data.name}" loading="lazy">
                    <div class="list-view-click-indicator">
                        <div class="click-indicator-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                    </div>
                </div>
                <div class="list-view-content">
                    <div class="list-view-header">
                        <h3 class="artist-name">${this.data.name}</h3>
                        <div class="artist-genre">${this.data.genre}</div>
                    </div>
                    <div class="list-view-details">
                        <div class="list-view-info">
                            <span class="list-view-tracks"><i class="fas fa-music"></i> ${this.data.trackCount} tracks</span>
                        </div>
                    </div>
                </div>
                <div class="list-view-rating-badge">
                    <div class="rating-pill">
                        <i class="fas fa-star"></i>
                        <span class="rating-value">${this.data.averageRating}</span>
                        <span class="rating-max">AZ10</span>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Set up event listeners for the card
     */
    setupEventListeners() {
        if (!this.element) return;

        this.element.addEventListener('click', () => {
            window.location.href = `./artist/${this.data.id}`;
        });
    }

    /**
     * Get the card HTML element
     */
    getElement() {
        return this.element;
    }
}

// Register as a custom element if web components are used later
if (typeof window !== 'undefined') {
    window.ArtistCard = ArtistCard;
} 