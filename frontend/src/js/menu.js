document.addEventListener('DOMContentLoaded', function() {
  // Load main menu header
  fetch('../src/components/main-menu.html')
    .then(response => response.text())
    .then(data => {
      const mainMenuContainer = document.createElement('div');
      mainMenuContainer.id = 'main-menu-container';
      mainMenuContainer.innerHTML = data;
      document.body.insertBefore(mainMenuContainer, document.body.firstChild);
      
      // Menu components loaded
    })
    .then(() => {
      // Initialize navigation after all components are loaded
      initializeMainNav();
      initializeMobileNav();
      initializeResponsiveNav();
      initializeAccessibility();
    })
    .catch(error => console.error('Error loading menu components:', error));
});

// Function to initialize main navigation
function initializeMainNav() {
  const mainNavLinks = document.querySelectorAll('#main-menu-container .main-nav a');
  mainNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('href').substring(1);
      
      // Update main nav active state
      updateMainNav(section);
      
      // Load content for the section
      if (window.loadContent) {
        window.loadContent(section, '');
      }
      
      window.location.hash = `#${section}`;
    });

    // Add keyboard navigation support
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Function to initialize mobile navigation
function initializeMobileNav() {
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      
      // Update mobile nav active state
      updateMobileNav(section);
      
      // Update main nav active state too
      updateMainNav(section);
      
      // Load content for the section
      if (window.loadContent) {
        window.loadContent(section, '');
      }
      
      window.location.hash = `#${section}`;
    });

    // Add keyboard navigation support for mobile
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Function to initialize responsive navigation behavior
function initializeResponsiveNav() {
  let resizeTimer;
  
  // Handle responsive navigation visibility
  function handleResponsiveNav() {
    const glasHeader = document.querySelector('.glass-header');
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
      // Mobile: hide desktop nav, show mobile nav
      if (glasHeader) glasHeader.style.display = 'none';
      if (mobileNav) mobileNav.style.display = 'flex';
    } else {
      // Desktop/Tablet: show desktop nav, hide mobile nav
      if (glasHeader) glasHeader.style.display = 'flex';
      if (mobileNav) mobileNav.style.display = 'none';
    }
  }
  
  // Throttled resize handler for better performance
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResponsiveNav, 100);
  });
  
  // Initial call
  handleResponsiveNav();
}

// Function to initialize accessibility features
function initializeAccessibility() {
  // Add skip navigation link
  const skipNav = document.createElement('a');
  skipNav.href = '#main-content';
  skipNav.textContent = 'Skip to main content';
  skipNav.className = 'skip-nav';
  skipNav.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-accent);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `;
  
  skipNav.addEventListener('focus', function() {
    this.style.top = '6px';
  });
  
  skipNav.addEventListener('blur', function() {
    this.style.top = '-40px';
  });
  
  document.body.insertBefore(skipNav, document.body.firstChild);
  
  // Enhanced focus management
  const navElements = document.querySelectorAll('.main-nav a, .mobile-nav-item');
  navElements.forEach((element, index) => {
    element.addEventListener('keydown', function(e) {
      // Arrow key navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (index + 1) % navElements.length;
        navElements[nextIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (index - 1 + navElements.length) % navElements.length;
        navElements[prevIndex].focus();
      }
    });
  });
}

// Function to update main navigation active state
function updateMainNav(section) {
  const mainNavLinks = document.querySelectorAll('#main-menu-container .main-nav a');
  mainNavLinks.forEach(link => {
    if (link.getAttribute('href') === `#${section}`) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// Function to update mobile navigation active state
window.updateMobileNav = function(section) {
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
  mobileNavLinks.forEach(link => {
    if (link.getAttribute('data-section') === section) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// Enhanced menu state management
function setActiveNavigation(section) {
  updateMainNav(section);
  updateMobileNav(section);
}

// Listen for hash changes to update navigation
window.addEventListener('hashchange', function() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    setActiveNavigation(hash);
  }
});

// Initialize navigation based on current hash
window.addEventListener('load', function() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    setActiveNavigation(hash);
  } else {
    setActiveNavigation('home');
  }
});

// Placeholder function for loadSubMenu (currently not implemented)
window.loadSubMenu = function(section) {
  console.log(`Loading submenu for section: ${section}`);
  // This can be implemented later if submenus are needed
}

// Placeholder function for updateSubMenuNav (currently not implemented)
window.updateSubMenuNav = function(subsection) {
  console.log(`Updating submenu nav for subsection: ${subsection}`);
  // This can be implemented later if submenus are needed
}

// Export functions for external use
window.updateMainNav = updateMainNav;
window.updateMobileNav = updateMobileNav;
window.setActiveNavigation = setActiveNavigation; 