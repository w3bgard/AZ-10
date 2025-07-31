console.log('Menu.js loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired, starting menu load...');
  
  // Load main menu header
  fetch('./src/components/main-menu.html')
    .then(response => {
      console.log('Fetch response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      console.log('Menu HTML loaded successfully, length:', data.length);
      
      const mainMenuContainer = document.createElement('div');
      mainMenuContainer.id = 'main-menu-container';
      mainMenuContainer.innerHTML = data;
      document.body.insertBefore(mainMenuContainer, document.body.firstChild);
      
      console.log('Menu container inserted into DOM');
      
      // Initialize navigation after menu is loaded
      setTimeout(() => {
        initializeMainNav();
        initializeMobileNav();
        initializeResponsiveNav();
        initializeAccessibility();
        console.log('Navigation initialized');
      }, 100);
    })
    .catch(error => {
      console.error('Error loading menu components:', error);
      
      // Show error message to user
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        right: 10px;
        background: #ff4444;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;
      errorDiv.textContent = 'خطا در لود منو: ' + error.message;
      document.body.appendChild(errorDiv);
    });
});

// Function to initialize main navigation
function initializeMainNav() {
  console.log('Initializing main navigation...');
  const mainNavLinks = document.querySelectorAll('#main-menu-container .main-nav a');
  console.log('Found main nav links:', mainNavLinks.length);
  
  mainNavLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('href').substring(1);
      console.log('Main nav clicked:', section);
      
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
  console.log('Initializing mobile navigation...');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
  console.log('Found mobile nav links:', mobileNavLinks.length);
  
  mobileNavLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      console.log('Mobile nav clicked:', section);
      
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
  console.log('Initializing responsive navigation...');
  let resizeTimer;
  
  // Handle responsive navigation visibility
  function handleResponsiveNav() {
    const glasHeader = document.querySelector('.glass-header');
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    const screenWidth = window.innerWidth;
    
    console.log('Screen width:', screenWidth);
    
    if (screenWidth <= 480) {
      // Mobile: hide desktop nav, show mobile nav
      if (glasHeader) {
        glasHeader.style.display = 'none';
        console.log('Desktop nav hidden');
      }
      if (mobileNav) {
        mobileNav.style.display = 'flex';
        console.log('Mobile nav shown');
      }
    } else {
      // Desktop/Tablet: show desktop nav, hide mobile nav
      if (glasHeader) {
        glasHeader.style.display = 'flex';
        console.log('Desktop nav shown');
      }
      if (mobileNav) {
        mobileNav.style.display = 'none';
        console.log('Mobile nav hidden');
      }
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
  console.log('Initializing accessibility features...');
  
  // Add skip navigation link
  const skipNav = document.createElement('a');
  skipNav.href = '#main-content';
  skipNav.textContent = 'Skip to main content';
  skipNav.className = 'skip-nav';
  
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
  console.log('Updating main nav active state for:', section);
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
function updateMobileNav(section) {
  console.log('Updating mobile nav active state for:', section);
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
  console.log('Hash changed to:', hash);
  if (hash) {
    setActiveNavigation(hash);
  }
});

// Initialize navigation based on current hash
window.addEventListener('load', function() {
  const hash = window.location.hash.substring(1);
  console.log('Page loaded with hash:', hash);
  if (hash) {
    setActiveNavigation(hash);
  } else {
    setActiveNavigation('home');
  }
});

// Export functions for external use
window.updateMainNav = updateMainNav;
window.updateMobileNav = updateMobileNav;
window.setActiveNavigation = setActiveNavigation;

console.log('Menu.js functions defined and ready'); 