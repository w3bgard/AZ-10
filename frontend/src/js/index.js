/**
 * Track List Management and Display
 * Version: 5.1.0
 * Description: This script handles the display of track cards in grid/list view with view toggles.
 * It utilizes the TrackCard class (from track-card.js) to build each track card.
 *
 * Author: AZ10 Team
 * Last Updated: February 2025
 */

import { TrackCard } from '../components/shared/TrackCard/track-card.js';
import { Carousel } from '../js/components/carousel.js';

// Ensure global state object exists
if (!window.AZ10_STATE) {
    window.AZ10_STATE = {};
}

// Global flags to manage loading state and prevent multiple initializations
window.AZ10_STATE.index = window.AZ10_STATE.index || {
    tracksLoaded: false,
    artistsLoaded: false,
    blogPostsLoaded: false,
    communityLoaded: false,
    isLoading: false
};

// =============================================================================
// Main Functionality
// =============================================================================

/**
 * loadTracks - Main function to fetch and display track data.
 */
async function loadTracks() {
    // Prevent multiple calls from running simultaneously
    if (window.AZ10_STATE.index.isLoading) {
        console.log('Track loading already in progress, skipping duplicate call');
        return;
    }
    
    if (window.AZ10_STATE.index.tracksLoaded) {
        console.log('Tracks already loaded, skipping');
        return;
    }
    
    window.AZ10_STATE.index.isLoading = true;
    
    try {
        console.log('Starting track loading process...');
        showLoadingState();
        
        // Fetch track data from JSON, try multiple paths if needed
        const data = await fetchData('./data/tracks.json', [
            '../src/data/tracks.json',
            '/data/tracks.json'
        ]);
        
        if (!data) {
            throw new Error('Failed to load track data from any path');
        }

        // Sort tracks by release date (newest first)
        const sortedTracks = data.tracks.sort((a, b) => {
            return new Date(b.basicInfo.releaseDate) - new Date(a.basicInfo.releaseDate);
        });

        // Separate tracks by category
        const mainstreamTracks = sortedTracks.filter(track => track.basicInfo.category === 'mainstream');

        // Load tracks into container
        loadTracksIntoContainer('mainstreamTracks', mainstreamTracks);
        window.AZ10_STATE.index.tracksLoaded = true;
        
        // Load other data
        Promise.all([
            loadFeaturedArtists(),
            loadBlogPosts(),
            loadCommunityContent()
        ]).then(() => {
            // Initialize view toggle functionality only when all content is loaded
            initializeViewToggles();
            hideLoadingState();
            
            // Initialize carousels after a short delay to ensure DOM is ready
            setTimeout(() => {
                try {
                    if (typeof refreshCarousels === 'function') {
                        console.log('Refreshing carousels after content load');
                        refreshCarousels();
                    } else {
                        console.log('Carousel refresh function not available, initializing manually');
                        initializeCarousels();
                    }
                } catch (error) {
                    console.error('Error initializing carousels:', error);
                }
            }, 500);
        });

        console.log('Track loading completed successfully');
    } catch (error) {
        console.error('Error loading tracks:', error);
        showError('Error loading content. Please try refreshing the page.');
    } finally {
        window.AZ10_STATE.index.isLoading = false;
    }
}

/**
 * Attempts to fetch data from primary URL, falling back to alternatives if needed
 */
async function fetchData(primaryUrl, fallbackUrls = []) {
    try {
        console.log(`Attempting to fetch data from: ${primaryUrl}`);
        const response = await fetch(primaryUrl);
        if (response.ok) {
            return await response.json();
        }
        
        // If primary URL fails, try fallbacks
        for (const url of fallbackUrls) {
            try {
                console.log(`Trying fallback: ${url}`);
                const fallbackResponse = await fetch(url);
                if (fallbackResponse.ok) {
                    return await fallbackResponse.json();
                }
            } catch (fallbackError) {
                console.warn(`Fallback fetch failed for ${url}:`, fallbackError);
            }
        }
        
        throw new Error('All data fetch attempts failed');
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

/**
 * Initialize the ComponentsManager to ensure the panel is loaded properly
 */
async function initializeComponents() {
    try {
        console.log('Initializing components for index page...');
        
        // Initialize the components manager if needed
        if (!window.componentsManager) {
            console.log('Creating new ComponentsManager instance');
            window.componentsManager = new ComponentsManager();
        }
        
        // Load the panel component
        await window.componentsManager.init();
        console.log('Components initialized successfully');
    } catch (error) {
        console.error('Failed to initialize components:', error);
        // Try direct loading as fallback
        try {
            console.log('Attempting fallback loading of panel...');
            await loadComponent('side-panel', '../components/layout/panel.html');
        } catch (alternativeError) {
            console.error('Failed to load panel using fallback:', alternativeError);
            // Final attempt with different path
            try {
                await loadComponent('side-panel', '../../src/components/layout/panel.html');
            } catch (finalError) {
                console.error('All panel loading attempts failed:', finalError);
            }
        }
    }
}

/**
 * Initialize the Fullscreen Controller
 */
function initializeFullscreen() {
    try {
        console.log('Initializing fullscreen controller...');
        if (!window.fullscreenController) {
            window.fullscreenController = new FullscreenController();
            console.log('Fullscreen controller created and initialized');
        }
    } catch (error) {
        console.error('Failed to initialize fullscreen controller:', error);
    }
}

// =============================================================================
// Track Display Functions
// =============================================================================

/**
 * loadTracksIntoContainer - Appends track cards to a container.
 * @param {string} containerId - The HTML element ID of the container.
 * @param {Array} tracks - Array of track objects.
 */
function loadTracksIntoContainer(containerId, tracks) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container not found: ${containerId}`);
        return;
    }

    // Clear loading placeholders but keep the container
    const loadingPlaceholders = container.querySelectorAll('.loading-placeholder');
    loadingPlaceholders.forEach(placeholder => placeholder.remove());

    // For each track, create a TrackCard and append it to the container
    let successCount = 0;
    tracks.forEach(trackData => {
        try {
            const trackCardInstance = new TrackCard(trackData);
            container.appendChild(trackCardInstance.element);
            successCount++;
        } catch (error) {
            console.error('Error creating track card:', error);
        }
    });
    
    console.log(`Loaded ${successCount} of ${tracks.length} tracks into ${containerId}`);
}

/**
 * initializeViewToggles - Sets up event listeners for view toggle buttons
 */
function initializeViewToggles() {
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the view type from data attribute
            const viewType = this.getAttribute('data-view');
            
            // Only proceed if this button is not already active
            if (!this.classList.contains('active')) {
                // Get the parent section
                const section = this.closest('.content-section');
                
                // Get the track container in this section
                const trackContainer = section.querySelector('.tracks-grid');
                
                // Remove both view classes
                trackContainer.classList.remove('view-grid', 'view-list');
                
                // Add the selected view class
                trackContainer.classList.add(`view-${viewType}`);
                
                // Update active state on buttons
                const toggleButtons = section.querySelectorAll('.view-toggle-btn');
                toggleButtons.forEach(button => {
                    button.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

/**
 * loadFeaturedArtists - Fetches and displays featured artists
 */
async function loadFeaturedArtists() {
    if (window.AZ10_STATE.index.artistsLoaded) {
        console.log('Artists already loaded, skipping');
        return;
    }
    
    try {
        // Fetch artist data (assuming there's an artists.json file)
        const response = await fetch('./data/artists.json');
        if (!response.ok) {
            throw new Error('Error loading artists data');
        }
        const data = await response.json();

        // Get featured artists
        const featuredArtists = data.artists.filter(artist => artist.featured === true);
        
        // Load artists into container
        loadArtistsIntoContainer('featuredArtists', featuredArtists);
        window.AZ10_STATE.index.artistsLoaded = true;
    } catch (error) {
        console.error('Error loading featured artists:', error);
        // Fall back to placeholder data if needed
        const placeholderArtists = generatePlaceholderArtists();
        loadArtistsIntoContainer('featuredArtists', placeholderArtists);
        window.AZ10_STATE.index.artistsLoaded = true;
    }
}

/**
 * loadArtistsIntoContainer - Appends artist cards to a container.
 * @param {string} containerId - The HTML element ID of the container.
 * @param {Array} artists - Array of artist objects.
 */
function loadArtistsIntoContainer(containerId, artists) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear loading placeholders but keep the container
    const loadingPlaceholders = container.querySelectorAll('.loading-placeholder');
    loadingPlaceholders.forEach(placeholder => placeholder.remove());

    // For each artist, create an artist card and append it to the container
    artists.forEach(artistData => {
        const artistCard = createArtistCard(artistData);
        container.appendChild(artistCard);
    });
}

/**
 * createArtistCard - Creates an artist card element
 * @param {Object} artistData - Artist data object
 * @returns {HTMLElement} - Artist card element
 */
function createArtistCard(artistData) {
    const card = document.createElement('div');
    card.className = 'artist-card carousel-slide';
    
    // Create the artist card content based on the artistData
    card.innerHTML = `
        <div class="artist-image">
            <img src="${artistData.image || 'assets/images/placeholder-artist.jpg'}" alt="${artistData.name}">
        </div>
        <div class="artist-info">
            <h3 class="artist-name">${artistData.name}</h3>
            <p class="artist-genre">${artistData.genre || 'Hip-Hop'}</p>
            <div class="artist-stats">
                <span class="stat"><i class="fas fa-music"></i> ${artistData.trackCount || 0}</span>
                <span class="stat"><i class="fas fa-star"></i> ${artistData.averageRating || '0.0'}</span>
            </div>
        </div>
    `;
    
    // Add click event to navigate to artist page
    card.addEventListener('click', () => {
        window.location.href = `./artist/${artistData.id}`;
    });
    
    return card;
}

/**
 * loadBlogPosts - Fetches and displays blog posts
 */
async function loadBlogPosts() {
    if (window.AZ10_STATE.index.blogPostsLoaded) {
        console.log('Blog posts already loaded, skipping');
        return;
    }
    
    try {
        // Fetch blog data (assuming there's a blogs.json file)
        const response = await fetch('./data/blogs.json');
        if (!response.ok) {
            throw new Error('Error loading blogs data');
        }
        const data = await response.json();

        // Sort blog posts by date (newest first)
        const sortedPosts = data.posts.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
        });
        
        // Load blog posts into container
        loadBlogPostsIntoContainer('blogPosts', sortedPosts);
        window.AZ10_STATE.index.blogPostsLoaded = true;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fall back to placeholder data if needed
        const placeholderPosts = generatePlaceholderBlogPosts();
        loadBlogPostsIntoContainer('blogPosts', placeholderPosts);
        window.AZ10_STATE.index.blogPostsLoaded = true;
    }
}

/**
 * loadBlogPostsIntoContainer - Appends blog post cards to a container.
 * @param {string} containerId - The HTML element ID of the container.
 * @param {Array} posts - Array of blog post objects.
 */
function loadBlogPostsIntoContainer(containerId, posts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear loading placeholders but keep the container
    const loadingPlaceholders = container.querySelectorAll('.loading-placeholder');
    loadingPlaceholders.forEach(placeholder => placeholder.remove());

    // For each post, create a blog post card and append it to the container
    posts.forEach(postData => {
        const postCard = createBlogPostCard(postData);
        container.appendChild(postCard);
    });
}

/**
 * createBlogPostCard - Creates a blog post card element
 * @param {Object} postData - Blog post data object
 * @returns {HTMLElement} - Blog post card element
 */
function createBlogPostCard(postData) {
    const card = document.createElement('div');
    card.className = 'blog-post-card carousel-slide';
    
    // Create the blog post card content based on the postData
    card.innerHTML = `
        <div class="post-image">
            <img src="${postData.image || 'assets/images/placeholder-blog.jpg'}" alt="${postData.title}">
        </div>
        <div class="post-info">
            <h3 class="post-title">${postData.title}</h3>
            <p class="post-excerpt">${postData.excerpt || ''}</p>
            <div class="post-meta">
                <span class="post-date">${formatDate(postData.publishDate)}</span>
                <span class="post-author">${postData.author || 'AZ10 Team'}</span>
            </div>
        </div>
    `;
    
    // Add click event to navigate to blog post page
    card.addEventListener('click', () => {
        window.location.href = `./blog/${postData.id}`;
    });
    
    return card;
}

/**
 * loadCommunityContent - Fetches and displays community content
 */
async function loadCommunityContent() {
    if (window.AZ10_STATE.index.communityLoaded) {
        console.log('Community content already loaded, skipping');
        return;
    }
    
    try {
        // Fetch community content data (assuming there's a community.json file)
        const response = await fetch('./data/community.json');
        if (!response.ok) {
            throw new Error('Error loading community data');
        }
        const data = await response.json();

        // Sort community content by date (newest first)
        const sortedContent = data.content.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Load community content into container
        loadCommunityContentIntoContainer('communityContent', sortedContent);
        window.AZ10_STATE.index.communityLoaded = true;
    } catch (error) {
        console.error('Error loading community content:', error);
        // Fall back to placeholder data if needed
        const placeholderContent = generatePlaceholderCommunityContent();
        loadCommunityContentIntoContainer('communityContent', placeholderContent);
        window.AZ10_STATE.index.communityLoaded = true;
    }
}

/**
 * loadCommunityContentIntoContainer - Appends community content cards to a container.
 * @param {string} containerId - The HTML element ID of the container.
 * @param {Array} contentItems - Array of community content objects.
 */
function loadCommunityContentIntoContainer(containerId, contentItems) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear loading placeholders but keep the container
    const loadingPlaceholders = container.querySelectorAll('.loading-placeholder');
    loadingPlaceholders.forEach(placeholder => placeholder.remove());

    // For each content item, create a community content card and append it to the container
    contentItems.forEach(contentData => {
        const contentCard = createCommunityContentCard(contentData);
        container.appendChild(contentCard);
    });
}

/**
 * createCommunityContentCard - Creates a community content card element
 * @param {Object} contentData - Community content data object
 * @returns {HTMLElement} - Community content card element
 */
function createCommunityContentCard(contentData) {
    const card = document.createElement('div');
    card.className = 'community-content-card';
    
    // Create the community content card based on the contentData
    card.innerHTML = `
        <div class="content-header">
            <div class="user-info">
                <img src="${contentData.userAvatar || 'assets/images/placeholder-avatar.jpg'}" alt="User Avatar" class="user-avatar">
                <span class="username">${contentData.username || 'Anonymous'}</span>
            </div>
            <span class="content-date">${formatDate(contentData.date)}</span>
        </div>
        <div class="content-body">
            <p class="content-text">${contentData.text}</p>
            ${contentData.image ? `<img src="${contentData.image}" alt="Content Image" class="content-image">` : ''}
        </div>
        <div class="content-footer">
            <div class="content-actions">
                <button class="action-btn like-btn"><i class="fas fa-heart"></i> ${contentData.likes || 0}</button>
                <button class="action-btn comment-btn"><i class="fas fa-comment"></i> ${contentData.comments || 0}</button>
                <button class="action-btn share-btn"><i class="fas fa-share"></i></button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Helper function to format dates in a human-readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Generate placeholder artist data for fallback
 * @returns {Array} - Array of placeholder artist objects
 */
function generatePlaceholderArtists() {
    return [
        { id: 'artist1', name: 'Hichkas', genre: 'Hip-Hop', trackCount: 25, averageRating: '4.8', image: 'assets/images/artists/hichkas.jpg' },
        { id: 'artist2', name: 'Bahram', genre: 'Hip-Hop', trackCount: 18, averageRating: '4.6', image: 'assets/images/artists/bahram.jpg' },
        { id: 'artist3', name: 'Shayea', genre: 'Hip-Hop', trackCount: 30, averageRating: '4.5', image: 'assets/images/artists/shayea.jpg' },
        { id: 'artist4', name: 'Erfan', genre: 'Hip-Hop', trackCount: 22, averageRating: '4.3', image: 'assets/images/artists/erfan.jpg' }
    ];
}

/**
 * Generate placeholder blog post data for fallback
 * @returns {Array} - Array of placeholder blog post objects
 */
function generatePlaceholderBlogPosts() {
    return [
        { id: 'post1', title: 'The Evolution of Persian Hip-Hop', excerpt: 'A deep dive into how Persian hip-hop has evolved over the years...', publishDate: '2024-03-01', author: 'Ali Reza', image: 'assets/images/blogs/hip-hop-evolution.jpg' },
        { id: 'post2', title: 'Top 10 Persian Rap Battles of All Time', excerpt: 'Counting down the most epic rap battles in Persian hip-hop history...', publishDate: '2024-02-15', author: 'Sara', image: 'assets/images/blogs/rap-battles.jpg' },
        { id: 'post3', title: 'Interview with Rising Star Rapper', excerpt: 'We sat down with one of the most promising new artists in the scene...', publishDate: '2024-02-01', author: 'Mohammad', image: 'assets/images/blogs/interview.jpg' }
    ];
}

/**
 * Generate placeholder community content data for fallback
 * @returns {Array} - Array of placeholder community content objects
 */
function generatePlaceholderCommunityContent() {
    return [
        { username: 'hip_hop_fan', userAvatar: 'assets/images/avatars/user1.jpg', date: '2024-03-05', text: 'Just listened to the new track by Hichkas. Absolute fire! 🔥 What do you all think?', likes: 45, comments: 12 },
        { username: 'rap_lover', userAvatar: 'assets/images/avatars/user2.jpg', date: '2024-03-03', text: 'My top 5 Persian rappers: 1. Hichkas 2. Bahram 3. Shayea 4. Erfan 5. Yas. Who would be in your top 5?', likes: 38, comments: 24 },
        { username: 'music_critic', userAvatar: 'assets/images/avatars/user3.jpg', date: '2024-03-01', text: 'Just posted my review of the latest album. Check it out on my profile!', image: 'assets/images/community/album-review.jpg', likes: 27, comments: 8 }
    ];
}

// =============================================================================
// UI State Management Functions
// =============================================================================

/**
 * showLoadingState - Displays all elements with the class 'loading-placeholder'.
 */
function showLoadingState() {
    const placeholders = document.querySelectorAll('.loading-placeholder');
    placeholders.forEach(el => {
        el.style.display = 'block';
    });
}

/**
 * hideLoadingState - Hides all elements with the class 'loading-placeholder'.
 */
function hideLoadingState() {
    const placeholders = document.querySelectorAll('.loading-placeholder');
    placeholders.forEach(el => {
        el.style.display = 'none';
    });
}

/**
 * showError - Displays an error message in the error container.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        const errorMsgElem = errorContainer.querySelector('.error-message');
        if (errorMsgElem) {
            errorMsgElem.textContent = message;
        }
        errorContainer.style.display = 'block';
    }
}

// =============================================================================
// Initialization
// =============================================================================

/**
 * Safely wait for initialization before loading content
 */
function safelyInitialize() {
    // Check if the page has already been unloaded (to prevent work during page navigation)
    if (document.hidden) {
        console.log('Page is hidden, deferring initialization');
        return;
    }
    
    // Make sure all core components are initialized first
    if (window.AZ10_STATE && window.AZ10_STATE.initialized) {
        console.log('AZ10 core initialized, safe to load content');
        
        // Only start loading tracks if they haven't been loaded yet
        if (!window.AZ10_STATE.index.tracksLoaded && !window.AZ10_STATE.index.isLoading) {
            console.log('Starting main content loading...');
            loadTracks();
        }
    } else {
        // Wait for core initialization to complete
        console.log('Waiting for AZ10 core initialization...');
        setTimeout(safelyInitialize, 300);
    }
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other initialization is complete
    setTimeout(safelyInitialize, 200);
});

/**
 * initializeCarousels - Sets up carousel sliders for the specified sections
 */
function initializeCarousels() {
    if (!window.Carousel) {
        console.error('Carousel component not available');
        return;
    }
    
    // Convert grid displays to carousels for the specified sections
    const sectionsToCarousel = [
        'mainstreamTracks',  // Mainstream Latest Drops
        'featuredArtists',   // Featured Artists
        'blogPosts'          // Blogs
    ];
    
    sectionsToCarousel.forEach(sectionId => {
        const container = document.getElementById(sectionId);
        if (!container) {
            console.warn(`Container for carousel ${sectionId} not found`);
            return;
        }
        
        // Skip if already initialized as carousel
        if (container.getAttribute('data-carousel-initialized') === 'true') {
            console.log(`Carousel ${sectionId} already initialized, skipping`);
            return;
        }
        
        console.log(`Initializing carousel for ${sectionId}`);
        
        // Prepare for carousel transformation
        container.classList.add('carousel-container');
        container.classList.remove('carousel-container-placeholder');
        container.classList.remove('view-grid', 'view-list');
        
        // Add carousel-slide class to child elements if needed
        Array.from(container.children).forEach(child => {
            if (!child.classList.contains('loading-placeholder') && 
                !child.classList.contains('carousel-slide')) {
                child.classList.add('carousel-slide');
            }
        });
        
        try {
            if (typeof window.Carousel === 'function') {
                // Try to use the globally available Carousel class
                new window.Carousel(container, {
                    slidesToShow: getSlidesToShow(),
                    slidesToScroll: 1
                });
                container.setAttribute('data-carousel-initialized', 'true');
            } else if (typeof Carousel === 'function') {
                // Try to use imported Carousel
                new Carousel(container, {
                    slidesToShow: getSlidesToShow(),
                    slidesToScroll: 1
                });
                container.setAttribute('data-carousel-initialized', 'true');
            }
        } catch (error) {
            console.error(`Error initializing carousel for ${sectionId}:`, error);
        }
    });
}

/**
 * Helper function to determine slides to show based on viewport width
 */
function getSlidesToShow() {
    const width = window.innerWidth;
    if (width < 480) return 1;       // Mobile
    if (width < 768) return 2;       // Tablet small
    if (width < 1024) return 3;      // Tablet large
    if (width < 1440) return 4;      // Desktop small
    return 5;                        // Desktop large
}

// =============================================================================
// End of File
// =============================================================================
