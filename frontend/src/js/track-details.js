/**
 * Track Details Page Module - Redesigned
 * Version: 4.0.0
 * Description: Updated for new circular cover design with centralized layout
 */

export const trackDetailsPage = {
    tracksData: null,

    async loadContent() {
        try {
            const response = await fetch('../src/components/track-details.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading track details content:', error);
            return '<div class="error-state">Error loading track details</div>';
        }
    },

    async loadTracksData() {
        if (this.tracksData) return this.tracksData;

        try {
            const response = await fetch('../public/data/tracks.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.tracksData = await response.json();
            return this.tracksData;
        } catch (error) {
            console.error('Error loading tracks data:', error);
            return { tracks: [] };
        }
    },

    async initializeTrackDetails(trackId) {
        console.log('Initializing track details for ID:', trackId);
        
        // Load tracks data
        await this.loadTracksData();

        // Find the specific track
        const trackData = this.tracksData.tracks.find(track => track.id === trackId);

        if (!trackData) {
            this.showTrackNotFound();
            return;
        }

        // Populate track details
        this.populateTrackDetails(trackData);
        
        // Initialize interactive elements
        this.initializeInteractiveElements();
    },

    populateTrackDetails(trackData) {
        // Destructure track data for easier access
        const {
            basicInfo = {},
            stats = {},
            productionCredits = {},
            media = {},
            metadata = {}
        } = trackData;

        // Update page title
        document.title = `${basicInfo.title} - ${basicInfo.artist} | AZ10`;

        // Header title and artist
        const trackTitle = document.getElementById('track-title');
        const trackArtist = document.getElementById('track-artist');
        
        if (trackTitle) trackTitle.textContent = basicInfo.title || 'Unknown Title';
        if (trackArtist) trackArtist.textContent = basicInfo.artist || 'Unknown Artist';

        // Cover image with circular styling
        const trackCover = document.getElementById('track-cover');
        if (trackCover) {
            trackCover.src = media.coverArt || '../public/assets/images/tracks/placeholder.svg';
            
            // Handle image loading
            trackCover.onload = () => {
                console.log(`Cover Image Loaded: ${trackCover.naturalWidth} x ${trackCover.naturalHeight}`);
                
                // Add loaded class for animations
                trackCover.classList.add('loaded');
            };

            trackCover.onerror = () => {
                console.error('Failed to load cover image');
                trackCover.src = '../public/assets/images/tracks/placeholder.svg';
            };
        }

        // Duration and release date
        const trackDuration = document.getElementById('track-duration');
        const trackReleaseDate = document.getElementById('track-release-date');
        const trackReleaseItem = document.getElementById('track-release-item');

        if (trackDuration) trackDuration.textContent = metadata.duration || 'N/A';
        
        if (trackReleaseDate && basicInfo.releaseDate) {
            trackReleaseDate.textContent = basicInfo.releaseDate;
            if (trackReleaseItem) trackReleaseItem.style.display = 'flex';
        }

        // Rating system
        this.updateRating(stats.communityRating || 0, stats.numberOfVotes || 0);

        // Metadata fields mapping
        const metaFields = {
            'track-label': basicInfo.label,
            'track-beat-producer': productionCredits.music?.beatProducer,
            'track-sound-engineer': productionCredits.music?.soundEngineer,
            'track-project-manager': productionCredits.music?.projectManager,
            'track-art-direction': productionCredits.music?.artDirection
        };

        // Update metadata fields and show/hide containers
        Object.entries(metaFields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            const container = document.getElementById(`${id}-item`);
            
            if (element && container) {
                if (value) {
                    element.textContent = value;
                    container.style.display = 'flex';
                } else {
                    container.style.display = 'none';
                }
            }
        });

        // Streaming links (placeholder - would be populated from data)
        this.populateStreamingLinks(media.streamingLinks || []);

        // SoundCloud embed
        this.setupSoundCloudEmbed(media.soundcloudUrl);
    },

    updateRating(rating, votes) {
        const trackRatingValue = document.getElementById('track-rating-value');
        const trackRatingVotes = document.getElementById('track-rating-votes');
        const trackRatingStars = document.getElementById('track-rating-stars');

        if (trackRatingValue) trackRatingValue.textContent = rating.toFixed(1);
        if (trackRatingVotes) trackRatingVotes.textContent = `(${votes} votes)`;

        // Update star rating display
        if (trackRatingStars) {
            const stars = trackRatingStars.querySelectorAll('i');
            stars.forEach((star, index) => {
                if (index < Math.floor(rating)) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                    star.style.color = 'var(--accent-color)';
                } else if (index === Math.floor(rating) && rating % 1 >= 0.5) {
                    star.classList.remove('far', 'fas');
                    star.classList.add('fas');
                    star.style.color = 'var(--accent-color)';
                    star.style.opacity = '0.5';
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                    star.style.color = '#444';
                    star.style.opacity = '1';
                }
            });
        }
    },

    populateStreamingLinks(links) {
        const streamingContainer = document.getElementById('streaming-links-compact');
        if (!streamingContainer) return;

        // Default streaming platforms if no data provided
        const defaultLinks = [
            { platform: 'spotify', url: '#', icon: 'fab fa-spotify' },
            { platform: 'apple-music', url: '#', icon: 'fab fa-apple' },
            { platform: 'soundcloud', url: '#', icon: 'fab fa-soundcloud' },
            { platform: 'youtube', url: '#', icon: 'fab fa-youtube' }
        ];

        const linksToShow = links.length > 0 ? links : defaultLinks;
        
        streamingContainer.innerHTML = linksToShow.map(link => `
            <a href="${link.url}" class="streaming-link" target="_blank" rel="noopener noreferrer">
                <i class="${link.icon}"></i>
                <span>${this.formatPlatformName(link.platform)}</span>
            </a>
        `).join('');
    },

    formatPlatformName(platform) {
        const names = {
            'spotify': 'Spotify',
            'apple-music': 'Apple Music',
            'soundcloud': 'SoundCloud',
            'youtube': 'YouTube',
            'deezer': 'Deezer',
            'tidal': 'TIDAL'
        };
        return names[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
    },

    setupSoundCloudEmbed(soundcloudUrl) {
        const soundcloudEmbed = document.getElementById('track-soundcloud-embed');
        
        if (!soundcloudEmbed) return;

        // Use provided URL or fallback to demo
        const embedUrl = soundcloudUrl || "https://soundcloud.com/dorcci/h2co3?in=dorcci/sets/young-morvarid&si=c4f66079f3a14117a5477c018dbeeab6&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing";

        if (embedUrl) {
            soundcloudEmbed.innerHTML = `
                <iframe 
                    width="100%" 
                    height="200" 
                    scrolling="no" 
                    frameborder="no" 
                    allow="autoplay" 
                    loading="lazy"
                    src="https://w.soundcloud.com/player/?url=${encodeURIComponent(embedUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
                </iframe>
            `;
        } else {
            soundcloudEmbed.style.display = 'none';
        }
    },

    initializeInteractiveElements() {
        // Cover image click handler for modal/fullscreen view
        const coverContainer = document.querySelector('.cover-container');
        if (coverContainer) {
            coverContainer.addEventListener('click', this.handleCoverClick.bind(this));
        }

        // Play button functionality (placeholder)
        const playIcon = document.querySelector('.play-icon');
        if (playIcon) {
            playIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handlePlayClick();
            });
        }

        // Add hover effects with JavaScript for better performance
        this.addInteractiveHoverEffects();
    },

    handleCoverClick() {
        // Could implement full-screen image view or music player
        console.log('Cover image clicked - implement full-screen view');
        
        // For now, just trigger the play functionality
        this.handlePlayClick();
    },

    handlePlayClick() {
        console.log('Play button clicked - implement music playback');
        
        // Could integrate with music player API
        // For now, scroll to SoundCloud embed
        const soundcloudEmbed = document.getElementById('track-soundcloud-embed');
        if (soundcloudEmbed) {
            soundcloudEmbed.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    },

    addInteractiveHoverEffects() {
        // Add ripple effect on cover hover
        const coverContainer = document.querySelector('.cover-container');
        if (coverContainer) {
            coverContainer.addEventListener('mouseenter', () => {
                coverContainer.style.filter = 'brightness(1.1)';
            });
            
            coverContainer.addEventListener('mouseleave', () => {
                coverContainer.style.filter = 'brightness(1)';
            });
        }

        // Parallax effect on scroll (subtle)
        let ticking = false;
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            const coverCenter = document.querySelector('.track-cover-center');
            if (coverCenter) {
                coverCenter.style.transform = `translateY(${rate}px)`;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    },

    showTrackNotFound() {
        const container = document.querySelector('.track-details-page');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Track Not Found</h2>
                    <p>The requested track could not be found or may have been removed.</p>
                    <button onclick="window.history.back()" class="back-btn">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            `;
        }
    }
}; 