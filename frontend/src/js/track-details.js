/**
 * Track Details Page Module
 * Version: 3.1.0
 * Description: Handles display and interaction for individual track details with dynamic data loading
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

        // Cover image and basic info
        const trackCover = document.getElementById('track-cover');
        const coverTrackTitle = document.getElementById('cover-track-title');
        const coverTrackArtist = document.getElementById('cover-track-artist');

        // Cover image handling with original dimensions
        if (trackCover) {
            trackCover.src = media.coverArt || '../public/assets/images/tracks/placeholder.svg';
            
            // Ensure image loads with its original dimensions
            trackCover.onload = () => {
                // Log original image dimensions for debugging
                console.log(`Cover Image Dimensions: ${trackCover.naturalWidth} x ${trackCover.naturalHeight}`);
                
                // Optional: Set max-height if image is extremely tall
                const maxHeight = window.innerHeight * 0.7; // 70% of viewport height
                if (trackCover.naturalHeight > maxHeight) {
                    trackCover.style.maxHeight = `${maxHeight}px`;
                }
            };
        }
        if (coverTrackTitle) coverTrackTitle.textContent = basicInfo.title || 'Unknown Title';
        if (coverTrackArtist) coverTrackArtist.textContent = basicInfo.artist || 'Unknown Artist';

        // Metadata fields
        const metaFields = {
            'info-track-title': basicInfo.title,
            'info-track-artist': basicInfo.artist,
            'track-duration': metadata.duration,
            'track-release-date': basicInfo.releaseDate,
            'track-label': basicInfo.label,
            'track-beat-producer': productionCredits.music?.beatProducer,
            'track-sound-engineer': productionCredits.music?.soundEngineer,
            'track-project-manager': productionCredits.music?.projectManager,
            'track-art-direction': productionCredits.music?.artDirection
        };

        // Update all metadata fields
        Object.entries(metaFields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value || 'N/A';
        });

        // Show/hide optional fields
        const optionalFields = [
            'track-release-item', 
            'track-label-item', 
            'track-beat-producer-item', 
            'track-sound-engineer-item', 
            'track-project-manager-item', 
            'track-art-direction-item'
        ];
        optionalFields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = metaFields[id.replace('-item', '')] ? 'flex' : 'none';
            }
        });

        // Rating
        const trackRatingValue = document.getElementById('track-rating-value');
        const trackRatingVotes = document.getElementById('track-rating-votes');
        const trackRatingStars = document.getElementById('track-rating-stars');

        const rating = stats.communityRating || 0;
        const votes = stats.numberOfVotes || 0;

        if (trackRatingValue) trackRatingValue.textContent = rating.toFixed(1);
        if (trackRatingVotes) trackRatingVotes.textContent = `(${votes} votes)`;

        // Update star rating
        if (trackRatingStars) {
            const stars = trackRatingStars.querySelectorAll('i');
            stars.forEach((star, index) => {
                if (index < Math.floor(rating)) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                    star.style.color = 'var(--accent-color)';
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                    star.style.color = '#444';
                }
            });
        }

        // SoundCloud Embed
        const soundcloudEmbed = document.getElementById('track-soundcloud-embed');
        const soundcloudLink = "@https://soundcloud.com/dorcci/h2co3?in=dorcci/sets/young-morvarid&si=c4f66079f3a14117a5477c018dbeeab6&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing";

        if (soundcloudEmbed && soundcloudLink) {
            // Create SoundCloud iframe embed
            soundcloudEmbed.innerHTML = `
                <iframe 
                    width="100%" 
                    height="166" 
                    scrolling="no" 
                    frameborder="no" 
                    allow="autoplay" 
                    src="https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudLink)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
                </iframe>
            `;
        } else {
            // Hide or clear the embed container if no valid link
            soundcloudEmbed.innerHTML = '';
        }
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
                    <p>The requested track could not be found.</p>
                    <button onclick="window.history.back()" class="back-btn">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            `;
        }
    }
}; 