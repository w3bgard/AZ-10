// navigation.js
/**
 * This script handles the active state of navigation menu items.
 * It adds the "active" class to the selected menu item and updates the UI accordingly.
 * 
 * Author: AZ10 Team
 * Last Updated: February 2025
 */

// =============================================================================
// Handle Active State for Navigation Items
// =============================================================================

/**
 * updateActiveState - Updates the active state of navigation items
 * @param {Event} e - The event object triggered by the click
 */
function updateActiveState(e) {
    e.preventDefault();  // Prevent default behavior if it's an anchor tag

    // Remove "active" class from all menu items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Add "active" class to the clicked menu item
    const clickedItem = e.target.closest('.nav-item');
    if (clickedItem) {
        clickedItem.classList.add('active');
    }
}

// =============================================================================
// Artist Selection Logic
// =============================================================================

/**
 * handleArtistSelection - Filters the tracks based on the selected artist
 * @param {Event} e - The event object triggered by the artist selection
 */
function handleArtistSelection(e) {
    e.preventDefault();

    // Get the selected artist
    const selectedArtist = e.target.getAttribute('data-artist');
    if (!selectedArtist) return;

    // Add "active" class to the selected artist in the nav
    const artistLinks = document.querySelectorAll('.nav-link.artist-select');
    artistLinks.forEach(link => link.classList.remove('active'));
    
    e.target.classList.add('active');
    
    // Now filter tracks based on the selected artist
    filterTracksByArtist(selectedArtist);
}

/**
 * filterTracksByArtist - Filters the displayed tracks based on the selected artist
 * @param {string} artist - The name of the selected artist
 */
function filterTracksByArtist(artist) {
    // Fetch all tracks from the JSON data (or from existing loaded data)
    const tracks = window.tracksData || []; // Assuming tracksData is already loaded globally

    // Filter the tracks for the selected artist
    const filteredTracks = tracks.filter(track => track.basicInfo.artist.toLowerCase() === artist.toLowerCase());

    // Update the track list UI with filtered tracks
    loadTracksIntoSlider('mainstreamSlider', filteredTracks);
}

// =============================================================================
// Helper Functions for Loading and Displaying Tracks
// =============================================================================

/**
 * loadTracksIntoSlider - Loads the filtered tracks into the appropriate slider
 * @param {string} sliderId - The ID of the slider where tracks will be loaded
 * @param {Array} tracks - The array of track objects to be displayed
 */
function loadTracksIntoSlider(sliderId, tracks) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    // Clear the existing content in the slider
    slider.innerHTML = '';

    // Create and append TrackCard elements for each track
    tracks.forEach(trackData => {
        const trackCard = new TrackCard(trackData); // Assuming TrackCard class is already defined
        slider.appendChild(trackCard.element);
    });
}

// =============================================================================
// Initialization: Setup Event Listeners for Navigation and Artist Selection
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners for the navigation items
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', updateActiveState); // Add active state on click
    });

    // Attach event listeners for the artist selection links
    const artistLinks = document.querySelectorAll('.nav-link.artist-select');
    artistLinks.forEach(link => {
        link.addEventListener('click', handleArtistSelection); // Filter tracks by artist
    });
});

// =============================================================================
// End of File
// =============================================================================
