/**
 * Track Card Component
 * Version: 5.0.0
 * Description: Shows a card for each track with artist, producer and release date information.
 */

class TrackCard {
    constructor(trackData) {
        // داده‌های اصلی ترک + مقادیر پیش‌فرض
        this.data = this.initializeData(trackData);

        // ساخت ساختار کارت
        this.element = this.createCard();

        // تنظیم رویدادهای اولیه (کلیک روی کارت و غیره)
        this.setupEventListeners();
    }

    /**
     * مقداردهی اولیه داده‌ها با مقادیر پیش‌فرض
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
     * ساختار اصلی HTML کارت ترک با افکت هاور سی‌دی
     */
    createCard() {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.setAttribute('data-track-id', this.data.id);

        // تاریخ میلادی
        const releaseDate = this.formatDate(this.data.basicInfo.releaseDate);
        
        // امتیاز از 10
        const rating = this.data.stats.communityRating ? 
            this.data.stats.communityRating.toFixed(1) : 'N/A';

        // ساختار HTML
        card.innerHTML = `
            <div class="card-image">
                <img src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}" loading="lazy">
                <div class="card-overlay">
                    ${this.data.media.hasVideo ? '<div class="video-badge"><i class="fas fa-play-circle"></i></div>' : ''}
                    <div class="track-rating">${rating}<span style="font-size:16px">/10</span></div>
                    ${this.data.metadata.duration ? `<div class="duration-badge">${this.data.metadata.duration}</div>` : ''}
                </div>
            </div>
            <div class="card-info">
                <h3 class="track-title">${this.data.basicInfo.title}</h3>
                <div class="artist-name">${this.data.basicInfo.artist}</div>
                <div class="producer-info">Prod. by ${this.createProducerInfo()}</div>
                <div class="release-date">
                    <i class="fa fa-calendar"></i> ${releaseDate}
                </div>
            </div>
        `;

        return card;
    }

    /**
     * ایجاد اطلاعات تولیدکننده موسیقی
     */
    createProducerInfo() {
        const musicProducer = this.data.productionCredits?.music?.beatProducer;
        return musicProducer || 'Unknown';
    }

    /**
     * فرمت‌بندی تاریخ میلادی
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
     * تنظیم event listeners برای کارت
     */
    setupEventListeners() {
        // کلیک روی هر قسمت کارت - نمایش در lightbox
        this.element.addEventListener('click', (event) => {
            event.preventDefault();
            this.openLightbox();
        });
    }

    /**
     * باز کردن lightbox برای نمایش تصویر و جزئیات ترک
     */
    openLightbox() {
        const lightbox = document.getElementById('imageLightbox');
        if (!lightbox) return;
        
        // Rebuild lightbox content
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        
        // Format rating
        const rating = this.data.stats.communityRating ? 
            this.data.stats.communityRating.toFixed(1) : 'N/A';
        const votes = this.data.stats.numberOfVotes || 0;
        
        lightboxContent.innerHTML = `
            <div class="lightbox-image-container">
                <img id="lightboxImage" class="lightbox-image" src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}">
            </div>
            
            <div class="lightbox-details">
                <div class="lightbox-header">
                    <div class="title-section">
                        <h2 class="lightbox-track-title">${this.data.basicInfo.title}</h2>
                        <p class="lightbox-artist-name">${this.data.basicInfo.artist}</p>
                        
                        <div class="lightbox-rating">
                            <div class="lightbox-rating-score">${rating}</div>
                            <div class="rating-meta">
                                <span>/10</span>
                                <span>(${votes} ${votes === 1 ? 'vote' : 'votes'})</span>
                            </div>
                        </div>
                        
                        <div class="lightbox-action-buttons">
                            <button class="lightbox-action-btn primary rate-track-btn">
                                <i class="fas fa-star"></i> Rate
                            </button>
                            <button class="lightbox-action-btn share-track-btn">
                                <i class="fas fa-share"></i> Share
                            </button>
                        </div>
                    </div>
                    
                    <!-- Listen On Section - Moved to top right as requested -->
                    <div class="lightbox-streaming-top">
                        <a href="#" class="lightbox-platform">
                            <i class="fab fa-spotify"></i> Spotify
                        </a>
                        <a href="#" class="lightbox-platform">
                            <i class="fab fa-apple"></i> Apple Music
                        </a>
                        <a href="#" class="lightbox-platform">
                            <i class="fab fa-youtube"></i> YouTube
                        </a>
                        <a href="#" class="lightbox-platform">
                            <i class="fab fa-soundcloud"></i> SoundCloud
                        </a>
                    </div>
                </div>
                
                <!-- SoundCloud Player - Moved to right side at top -->
                <div class="soundcloud-player-container">
                    <iframe id="soundcloudPlayer" width="100%" height="120" scrolling="no" frameborder="no" allow="autoplay" 
                        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1651111520&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false">
                    </iframe>
                </div>
                
                <div class="lightbox-content-scroll">
                    <div class="lightbox-section track-info-section">
                        <h3>Track Info</h3>
                        <div class="lightbox-track-details">
                            <span class="detail-label">Release Date</span>
                            <span class="detail-value">${this.formatDate(this.data.basicInfo.releaseDate)}</span>
                            
                            <span class="detail-label">Track Type</span>
                            <span class="detail-value">${this.data.basicInfo.trackType}</span>
                            
                            ${this.data.basicInfo.albumTitle ? `
                            <span class="detail-label">Album</span>
                            <span class="detail-value">${this.data.basicInfo.albumTitle}</span>
                            ` : ''}
                            
                            ${this.data.basicInfo.label ? `
                            <span class="detail-label">Label</span>
                            <span class="detail-value">${this.data.basicInfo.label}</span>
                            ` : ''}
                            
                            ${this.data.metadata.duration ? `
                            <span class="detail-label">Duration</span>
                            <span class="detail-value">${this.data.metadata.duration}</span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="lightbox-section">
                        <h3>Credits</h3>
                        <div class="lightbox-track-details">
                            <span class="detail-label">Producer</span>
                            <span class="detail-value">${this.createProducerInfo()}</span>
                            
                            ${this.data.productionCredits?.mixing ? `
                            <span class="detail-label">Mixing</span>
                            <span class="detail-value">${this.data.productionCredits.mixing}</span>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${this.data.lyrics ? `
                    <div class="lightbox-section">
                        <h3>Lyrics</h3>
                        <div class="lyrics-container">
                            ${this.data.lyrics.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            <button class="lightbox-close">&times;</button>
        `;
        
        // Add event listeners
        const closeButton = lightboxContent.querySelector('.lightbox-close');
        closeButton.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Rating event
        const rateButton = lightboxContent.querySelector('.rate-track-btn');
        if (rateButton) {
            rateButton.addEventListener('click', () => {
                this.showRatingDialog();
            });
        }
        
        // Display lightbox
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * نمایش دیالوگ امتیازدهی
     */
    showRatingDialog() {
        // کد مربوط به نمایش دیالوگ امتیازدهی
        alert('این قابلیت در نسخه بعدی اضافه خواهد شد');
    }

    /**
     * ساخت slug برای URL
     */
    createSlug() {
        return `${this.data.basicInfo.title}-${this.data.basicInfo.artist}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Get SoundCloud artist ID for embedding
     * If not specified in track data, use a placeholder
     */
    getSoundCloudArtistId() {
        return this.data.streamingLinks?.soundcloud?.artistId || 
               this.createArtistSlug(this.data.basicInfo.artist);
    }

    /**
     * Get SoundCloud track ID for embedding
     * If not specified in track data, use track title
     */
    getSoundCloudTrackId() {
        return this.data.streamingLinks?.soundcloud?.trackId || 
               this.createTrackSlug(this.data.basicInfo.title);
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

export default TrackCard;
