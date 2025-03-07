/**
 * Track List Management and Display
 * Version: 5.0.0
 * Description: This script handles the display of track cards in grid/list view with view toggles.
 * It utilizes the TrackCard class (from track-card.js) to build each track card.
 *
 * Author: AZ10 Team
 * Last Updated: February 2025
 */

import { TrackCard } from '../components/shared/TrackCard/track-card.js';

// =============================================================================
// Main Functionality
// =============================================================================

/**
 * loadTracks - Main function to fetch and display track data.
 * Steps:
 *   1. Display the loading state.
 *   2. Fetch track data from the JSON source.
 *   3. Sort tracks by release date (newest first).
 *   4. Separate tracks into categories (mainstream and newWave).
 *   5. Populate the respective track containers.
 *   6. Hide the loading state.
 */
async function loadTracks() {
    try {
        showLoadingState();
        
        // Initialize components manager to load the panel
        await initializeComponents();

        // Fetch track data from JSON
        const response = await fetch('./data/tracks.json');
        if (!response.ok) {
            throw new Error('Error loading tracks data');
        }
        const data = await response.json();

        // Sort tracks by release date (newest first)
        const sortedTracks = data.tracks.sort((a, b) => {
            return new Date(b.basicInfo.releaseDate) - new Date(a.basicInfo.releaseDate);
        });

        // Separate tracks by category
        const mainstreamTracks = sortedTracks.filter(track => track.basicInfo.category === 'mainstream');
        const newWaveTracks = sortedTracks.filter(track => track.basicInfo.category === 'newWave');

        // Load tracks into containers
        loadTracksIntoContainer('mainstreamTracks', mainstreamTracks);
        loadTracksIntoContainer('newWaveTracks', newWaveTracks);

        // Initialize view toggle functionality
        initializeViewToggles();

        hideLoadingState();
    } catch (error) {
        console.error('Error:', error);
        showError('Error loading tracks');
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
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // For each track, create a TrackCard and append it to the container
    tracks.forEach(trackData => {
        const trackCardInstance = new TrackCard(trackData);
        container.appendChild(trackCardInstance.element);
    });
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
// Additional Helper Functions (if needed)
// =============================================================================

// Example helper function for future use:
// function filterTracksByKeyword(tracks, keyword) {
//     return tracks.filter(track => track.basicInfo.title.toLowerCase().includes(keyword.toLowerCase()));
// }

// =============================================================================
// Initialization
// =============================================================================

// Wait for the DOM to be fully loaded before initializing track loading.
document.addEventListener('DOMContentLoaded', () => {
    loadTracks();
});

// =============================================================================
// End of File
// =============================================================================
