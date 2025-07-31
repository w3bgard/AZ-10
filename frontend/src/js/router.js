// Import home page module
import { homePage } from './home.js';
// Import team page module
import { teamPage } from './team.js';
// Import tracks listing page module
import { tracksListingPage } from './tracks-listing.js';
// Import credits listing page module
import { creditsListingPage } from './credits-listing.js';
// Import track details page module
import { trackDetailsPage } from './track-details.js';
// Import scroll utilities
import { scrollToTop } from './scroll-enhancements.js';

// Simple router for handling content loading
document.addEventListener('DOMContentLoaded', function() {
  const contentContainer = document.getElementById('app-content');
  const mainContent = contentContainer?.querySelector('.main-content');
  
  // Function to load content for a specific section and subsection
  window.loadContent = async function(section, subsection) {
    if (!contentContainer || !mainContent) {
      console.error('Content containers not found');
      return;
    }
    
    try {
      // Handle home page specially
      if (section === 'home') {
        document.title = 'AZ10 - Home';
        const homeContent = await homePage.loadContent();
        mainContent.innerHTML = homeContent;
        
        // Initialize home page interactions after content is loaded
        setTimeout(() => {
          homePage.initializeInteractions();
        }, 100);
      } else if (section === 'aboutus' && subsection === 'team') {
        // Handle team section
        document.title = 'AZ10 - About Us - Team';
        const teamContent = await teamPage.loadContent();
        mainContent.innerHTML = teamContent;
        
        // Initialize team page interactions after content is loaded
        setTimeout(() => {
          teamPage.initializeInteractions();
        }, 100);
      } else if (section === 'discover' && (subsection === 'all-tracks' || subsection === 'underground-tracks')) {
        // Handle tracks listing pages
        const category = subsection === 'all-tracks' ? 'persian-hiphop' : 'underground';
        document.title = `AZ10 - ${category === 'persian-hiphop' ? 'Persian HipHop' : 'Underground'} Tracks`;
        
        const tracksContent = await tracksListingPage.loadContent();
        mainContent.innerHTML = tracksContent;
        
        // Initialize tracks listing page interactions after content is loaded
        setTimeout(() => {
          tracksListingPage.initializeInteractions(category);
        }, 100);
      } else if (section === 'discover' && subsection === 'credits') {
        // Handle credits listing page
        document.title = 'AZ10 - Credits & Contributors';
        
        const creditsContent = await creditsListingPage.loadContent();
        mainContent.innerHTML = creditsContent;
        
        // Initialize credits listing page interactions after content is loaded
        setTimeout(() => {
          creditsListingPage.initializeInteractions();
        }, 100);
      } else if (section === 'track' && subsection) {
        // Handle track details page
        console.log('Loading track details for ID:', subsection);
        const trackId = subsection;
        
        const trackDetailsContent = await trackDetailsPage.loadContent();
        mainContent.innerHTML = trackDetailsContent;
        
        // Initialize track details page with specific track ID
        setTimeout(() => {
          trackDetailsPage.initializeTrackDetails(trackId);
        }, 100);
      } else {
        // Update document title with current navigation
        document.title = `AZ10 - ${section.charAt(0).toUpperCase() + section.slice(1)} - ${subsection.charAt(0).toUpperCase() + subsection.slice(1)}`;
        
        // For demonstration, we'll just show a placeholder
        mainContent.innerHTML = `
          <div class="content-container">
            <h1>${section.charAt(0).toUpperCase() + section.slice(1)}</h1>
            <h2>${subsection.charAt(0).toUpperCase() + subsection.slice(1)}</h2>
            <p>Content for ${section} > ${subsection} would be loaded here.</p>
          </div>
        `;
      }
      
      // Scroll to top of the page when new content is loaded
      scrollToTop(false);
      
      // Dispatch event to notify content has changed
      const contentChangedEvent = new CustomEvent('contentChanged', {
        detail: { section, subsection }
      });
      document.dispatchEvent(contentChangedEvent);
    } catch (error) {
      console.error('Error loading content:', error);
      mainContent.innerHTML = `<div class="error-message">Error loading content. Please try again.</div>`;
    }
  };
  
  // Default subsections for each main section
  function getDefaultSubsection(section) {
    const defaults = {
      'home': '',
      'discover': 'projects',
      'blog': 'posts',
      'joinus': 'signin',
      'aboutus': 'vision'
    };
    return defaults[section] || 'projects';
  }
  
  // Check for URL hash on page load
  const checkInitialRoute = () => {
    try {
      const hash = window.location.hash;
      if (hash) {
        const parts = hash.substring(1).split('/');
        const section = parts[0] || 'home';
        const subsection = parts[1] || getDefaultSubsection(section);
        
        // Load the appropriate menu and content
        if (window.loadSubMenu) {
          window.loadSubMenu(section);
          loadContent(section, subsection);
          
          // Set active main menu and submenu items
          updateMainNav(section);
          // Update mobile nav too
          if (window.updateMobileNav) {
            window.updateMobileNav(section);
          }
          setTimeout(() => {
            updateSubMenuNav(subsection);
          }, 100); // Small delay to ensure submenu is loaded
        } else {
          // If no submenu, just load content and update navs
          loadContent(section, subsection);
          updateMainNav(section);
          if (window.updateMobileNav) {
            window.updateMobileNav(section);
          }
        }
      } else {
        // Handle default route when no hash is present - load home page
        const defaultSection = 'home';
        
        // Load home page directly without submenu
        loadContent(defaultSection, '');
        
        // Update URL hash to reflect default route
        window.location.hash = `#${defaultSection}`;
      }
    } catch (error) {
      console.error('Error in route handling:', error);
    }
  };
  
  // Helper function to update main navigation state
  function updateMainNav(section) {
    const mainNavLinks = document.querySelectorAll('#main-menu-container .main-nav a');
    mainNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${section}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Listen for hash changes
  window.addEventListener('hashchange', function() {
    // Scroll to top when navigating via hash changes (back/forward buttons, etc.)
    scrollToTop(false);
    checkInitialRoute();
  });
  
  // Check initial route on page load - use requestAnimationFrame for better performance
  window.requestAnimationFrame(() => {
    // Small delay to ensure menus are loaded
    setTimeout(checkInitialRoute, 300);
  });
}); 