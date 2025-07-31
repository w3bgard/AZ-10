// Scroll Enhancement Utilities
// This module provides scroll-related functionality for the AZ10 application

/**
 * Scrolls the main app content container to the top
 * @param {boolean} smooth - Whether to use smooth scrolling animation (default: false for immediate scroll)
 */
export function scrollToTop(smooth = false) {
  const appContent = document.getElementById('app-content');
  
  if (appContent) {
    if (smooth) {
      // Smooth scroll for better UX
      appContent.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Immediate scroll reset for fast response
      appContent.scrollTop = 0;
      appContent.scrollLeft = 0;
    }
  } else {
    // Fallback to window scroll if container not found
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }
}

/**
 * Gets the current scroll position of the main app content container
 * @returns {Object} Object containing scrollTop and scrollLeft values
 */
export function getScrollPosition() {
  const appContent = document.getElementById('app-content');
  
  if (appContent) {
    return {
      scrollTop: appContent.scrollTop,
      scrollLeft: appContent.scrollLeft
    };
  } else {
    return {
      scrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft
    };
  }
}

/**
 * Auto-initializes scroll-to-top on content changes
 */
document.addEventListener('DOMContentLoaded', function() {
  // Listen for content changes and automatically scroll to top
  document.addEventListener('contentChanged', function(event) {
    // Small delay to ensure content is rendered
    setTimeout(() => {
      scrollToTop(false); // Immediate scroll for content changes
    }, 50);
  });
}); 