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
      // Initialize main navigation after all components are loaded
      initializeMainNav();
      initializeMobileNav();
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
  });
}

// Function to update main navigation active state
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

// Function to update mobile navigation active state
window.updateMobileNav = function(section) {
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
  mobileNavLinks.forEach(link => {
    if (link.getAttribute('data-section') === section) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

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