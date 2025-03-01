/**
 * Track Details Page
 * Version: 1.0.0
 * Description: Loads and displays track details from tracks.json based on URL
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoading(true);
        
        // 1. Get track ID from URL
        const trackId = getTrackIdFromUrl();
        if (!trackId) {
            showError('Track ID not found in URL');
            return;
        }
        
        // 2. Fetch tracks data
        const trackData = await fetchTrackData(trackId);
        if (!trackData) {
            showError('Track not found');
            return;
        }
        
        // 3. Update page title
        document.title = `${trackData.basicInfo.title} by ${trackData.basicInfo.artist} | AZ10`;
        
        // 4. Populate the template with track data
        populateTrackDetails(trackData);
        
        // 5. Set up lyrics expansion
        setupLyricsExpansion();
        
        // 6. Set up rating functionality
        // setupRatingFunctionality(trackData.id);
        
    } catch (error) {
        console.error('Error loading track details:', error);
        showError('Failed to load track details');
    } finally {
        showLoading(false);
    }
});

/**
 * Gets the track ID from the URL query parameter or path
 */
function getTrackIdFromUrl() {
    // خواندن id از مسیر URL
    const pathSegments = window.location.pathname.split('/');
    const idFromPath = pathSegments[pathSegments.length - 1];
    
    if (idFromPath) {
        return idFromPath;
    }
    
    // اگر در مسیر نبود، از پارامتر URL استخراج می‌کنیم
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * Fetches track data from JSON based on ID
 */
async function fetchTrackData(trackId) {
    try {
        // مسیر صحیح به فایل JSON
        const response = await fetch('/public/data/tracks.json');
        if (!response.ok) {
            throw new Error('Failed to fetch tracks data');
        }
        
        const data = await response.json();
        return data.tracks.find(track => track.id === trackId);
    } catch (error) {
        console.error('Error fetching track data:', error);
        throw error;
    }
}

/**
 * Populates the page with track details
 */
function populateTrackDetails(trackData) {
    // Basic info
    document.getElementById('trackTitle').textContent = trackData.basicInfo.title;
    document.getElementById('artistName').textContent = trackData.basicInfo.artist;
    
    // Cover art
    const coverArt = document.getElementById('coverArt');
    coverArt.src = trackData.media.coverArt;
    coverArt.alt = `${trackData.basicInfo.title} by ${trackData.basicInfo.artist}`;
    
    // Artist avatar (if available, otherwise use default)
    const artistAvatar = document.getElementById('artistAvatar');
    const artistSlug = createArtistSlug(trackData.basicInfo.artist);
    artistAvatar.src = `https://az-10-bucket.storage.iran.liara.space/artists/${artistSlug}/${artistSlug}-Profile.jpg`;
    artistAvatar.alt = trackData.basicInfo.artist;
    
    // Hide rating display elements
    const ratingElements = document.querySelectorAll('.rating-display, .rate-btn');
    ratingElements.forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    // Track info details
    const trackInfoDetails = document.getElementById('trackInfoDetails');
    trackInfoDetails.innerHTML = '';
    
    // Add detail rows
    addDetailRow(trackInfoDetails, 'Release Date', formatDate(trackData.basicInfo.releaseDate));
    addDetailRow(trackInfoDetails, 'Track Type', trackData.basicInfo.trackType);
    if (trackData.basicInfo.albumTitle) {
        addDetailRow(trackInfoDetails, 'Album', trackData.basicInfo.albumTitle);
    }
    if (trackData.basicInfo.label) {
        addDetailRow(trackInfoDetails, 'Label', trackData.basicInfo.label);
    }
    if (trackData.metadata.duration) {
        addDetailRow(trackInfoDetails, 'Duration', trackData.metadata.duration);
    }
    if (trackData.metadata.explicit) {
        addDetailRow(trackInfoDetails, 'Content', 'Explicit');
    }
    
    // Add producer info if available
    const producer = trackData.productionCredits?.music?.beatProducer;
    if (producer) {
        addDetailRow(trackInfoDetails, 'Producer', producer);
    }
    
    // Credits
    populateCredits(trackData.productionCredits);
    
    // Streaming links
    populateStreamingLinks(trackData.streamingLinks);
    
    // Lyrics (if available)
    populateLyrics(trackData.lyrics);
}

/**
 * Populates the credits section
 */
function populateCredits(credits) {
    const creditsSection = document.getElementById('creditsSection');
    const creditsDetails = document.getElementById('creditsDetails');
    
    // Hide section if no credits
    if (!credits || Object.keys(credits).length === 0) {
        creditsSection.style.display = 'none';
        return;
    }
    
    creditsSection.style.display = 'block';
    creditsDetails.innerHTML = '';
    
    // Add music credits
    if (credits.music) {
        Object.entries(credits.music).forEach(([role, name]) => {
            addDetailRow(creditsDetails, formatCreditRole(role), name);
        });
    }
    
    // Add video credits
    if (credits.video) {
        Object.entries(credits.video).forEach(([role, name]) => {
            addDetailRow(creditsDetails, formatCreditRole(role), name);
        });
    }
}

/**
 * Populates streaming links
 */
function populateStreamingLinks(links) {
    const platformLinks = document.getElementById('platformLinks');
    const mobilePlatformLinks = document.getElementById('mobilePlatformLinks');
    
    if (!links || Object.keys(links).length === 0) {
        const parentElements = [
            platformLinks.parentElement,
            mobilePlatformLinks.parentElement
        ];
        
        parentElements.forEach(el => {
            if (el) el.style.display = 'none';
        });
        return;
    }
    
    // Clear existing links
    platformLinks.innerHTML = '';
    mobilePlatformLinks.innerHTML = '';
    
    // Map of platform keys to display names and icons
    const platformInfo = {
        spotify: { name: 'Spotify', icon: 'fab fa-spotify' },
        appleMusic: { name: 'Apple Music', icon: 'fab fa-apple' },
        soundcloud: { name: 'SoundCloud', icon: 'fab fa-soundcloud' },
        youtube: { name: 'YouTube', icon: 'fab fa-youtube' },
        tidal: { name: 'Tidal', icon: 'fas fa-music' }
    };
    
    // Create links for each platform
    Object.entries(links).forEach(([platform, url]) => {
        if (!url || url === 'URL_TO_PLATFORM') return;
        
        const info = platformInfo[platform] || { name: platform, icon: 'fas fa-link' };
        
        // Create link for desktop
        const link = createPlatformLink(info.name, info.icon, url);
        platformLinks.appendChild(link.cloneNode(true));
        
        // Create link for mobile
        mobilePlatformLinks.appendChild(link);
    });
}

/**
 * Creates a platform link element
 */
function createPlatformLink(name, iconClass, url) {
    const link = document.createElement('a');
    link.href = url;
    link.className = 'platform-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    const icon = document.createElement('i');
    icon.className = iconClass;
    
    const span = document.createElement('span');
    span.textContent = name;
    
    link.appendChild(icon);
    link.appendChild(span);
    
    return link;
}

/**
 * Populates lyrics if available
 */
function populateLyrics(lyrics) {
    const lyricsSection = document.getElementById('lyricsSection');
    const lyricsText = document.getElementById('lyricsText');
    
    if (!lyrics) {
        lyricsSection.style.display = 'none';
        return;
    }
    
    lyricsSection.style.display = 'block';
    lyricsText.innerHTML = lyrics.replace(/\n/g, '<br>');
}

/**
 * Sets up lyrics expansion functionality
 */
function setupLyricsExpansion() {
    const expandButton = document.querySelector('.expand-lyrics');
    if (expandButton) {
        expandButton.addEventListener('click', function() {
            const lyricsContent = document.querySelector('.lyrics-content');
            lyricsContent.classList.toggle('expanded');
            
            if (lyricsContent.classList.contains('expanded')) {
                expandButton.textContent = 'Show Less';
            } else {
                expandButton.textContent = 'Read More';
            }
        });
    }
}

/**
 * Creates a slug for the artist name to use in image paths
 */
function createArtistSlug(artistName) {
    return artistName.replace(/\s+/g, '');
}

/**
 * Adds a detail row to a parent element
 */
function addDetailRow(parent, label, value) {
    if (!value) return;
    
    const row = document.createElement('div');
    row.className = 'detail-row';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'detail-label';
    labelSpan.textContent = label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'detail-value';
    valueSpan.textContent = value;
    
    row.appendChild(labelSpan);
    row.appendChild(valueSpan);
    parent.appendChild(row);
}

/**
 * Formats credit role names from camelCase to readable text
 */
function formatCreditRole(role) {
    return role
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}

/**
 * Formats dates from ISO to readable format
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Shows or hides loading indicator
 */
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Shows error message
 */
function showError(message) {
    alert(`Error: ${message}`);
}

// اگر از JavaScript برای ایجاد لینک‌ها استفاده می‌کنید
function createTrackLink(trackId) {
    return `track-template.html?id=${trackId}`;  // مسیر به فایل در ریشه پروژه
} 