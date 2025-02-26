/**
 * Track List Management and Display
 * Version: 4.0.0
 * Description: This script handles the display of track cards and interaction with track data from JSON.
 * It utilizes the TrackCard class (from track-card.js) to build each track card, which includes
 * rating submission functionality.
 *
 * Author: AZ10 Team
 * Last Updated: February 2025
 */

import TrackCard from '../components/shared/TrackCard/track-card.js'; // مسیر را مطابق ساختار پروژه تنظیم کن

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
 *   5. Populate the respective slider containers with track cards.
 *   6. Hide the loading state.
 */
async function loadTracks() {
    try {
        showLoadingState();

        // Fetch track data from JSON
        const response = await fetch('../public/data/tracks.json');
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

        // Load tracks into sliders
        loadTracksIntoSlider('mainstreamSlider', mainstreamTracks);
        loadTracksIntoSlider('newWaveSlider', newWaveTracks);

        hideLoadingState();
    } catch (error) {
        console.error('Error:', error);
        showError('Error loading tracks');
    }
}

// =============================================================================
// Slider Population Function
// =============================================================================

/**
 * loadTracksIntoSlider - Appends track cards to a slider container.
 * @param {string} sliderId - The HTML element ID of the slider.
 * @param {Array} tracks - Array of track objects.
 *
 * This function clears the existing content of the slider and then,
 * for each track, creates a new TrackCard instance and appends its element
 * to the slider.
 */
function loadTracksIntoSlider(sliderId, tracks) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    // Clear previous content in the slider
    slider.innerHTML = '';

    // For each track, create a TrackCard and append it to the slider
    tracks.forEach(trackData => {
        const trackCardInstance = new TrackCard(trackData);
        slider.appendChild(trackCardInstance.element);
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
