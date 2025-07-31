/**
 * Portfolio Timeline Component
 * Displays a minimalist timeline when portfolio section is active
 */
document.addEventListener('DOMContentLoaded', function() {
  // Timeline data - Years and content
  const timelineData = [
    { year: 2018, label: '2018' },
    { year: 2019, label: '2019' },
    { year: 2020, label: '2020' },
    { year: 2021, label: '2021' },
    { year: 2022, label: '2022' },
    { year: 2023, label: '2023' },
    { year: 2024, label: '2024' }
  ];
  
  let currentYear = null;
  let timelineElement = null;
  
  // Initialize timeline when portfolio section becomes active
  document.addEventListener('contentChanged', function(event) {
    const { section, subsection } = event.detail;
    console.log('Content changed event received:', section, subsection);
    
    // Show timeline ONLY when portfolio section AND projects subsection are active
    if (section === 'portfolio' && (subsection === 'selected-projects' || subsection === 'selectedProjects')) {
      initializeTimeline();
      showTimeline();
    } else {
      hideTimeline();
      
      // Ensure timeline is fully removed if we're not in portfolio/projects
      if (timelineElement) {
        timelineElement.style.display = 'none';
      }
    }
  });
  
  // Also listen for hashchange events to hide the timeline when navigating
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    
    if (hash !== '#portfolio/selected-projects' && hash !== '#portfolio/selectedProjects') {
      hideTimeline();
      
      // Ensure timeline is fully removed if we're not in portfolio/projects
      if (timelineElement) {
        timelineElement.style.display = 'none';
      }
    } else {
      // Re-show if we navigate back to portfolio/projects
      initializeTimeline();
      if (timelineElement) {
        timelineElement.style.display = '';
        showTimeline();
      }
    }
  });
  
  // Check if we need to initialize the timeline immediately
  // This ensures it works on page load when portfolio is the default page
  function checkInitialSection() {
    const hash = window.location.hash;
    console.log('Current hash:', hash);
    if (hash === '#portfolio/selected-projects' || hash === '#portfolio/selectedProjects') {
      // We're on the portfolio/projects section, initialize timeline
      setTimeout(() => {
        initializeTimeline();
        showTimeline();
      }, 500); // Small delay to ensure DOM is ready
    } else {
      // Ensure timeline is hidden on initial load if not on portfolio/projects
      hideTimeline();
    }
  }
  
  // Load the timeline component if it doesn't exist yet
  async function initializeTimeline() {
    if (document.getElementById('portfolio-timeline')) {
      console.log('Timeline already exists, skipping initialization');
      return; // Timeline already exists
    }
    
    try {
      // Create timeline element directly instead of fetching
      const timelineHTML = `
        <div id="portfolio-timeline" class="timeline">
          <div class="timeline-container">
            <div class="timeline-track">
              <!-- Timeline year markers will be dynamically generated here -->
            </div>
            <div class="timeline-indicator"></div>
          </div>
        </div>
      `;
      
      // Create container and add to document
      const timelineContainer = document.createElement('div');
      timelineContainer.innerHTML = timelineHTML;
      timelineElement = timelineContainer.firstElementChild;
      document.body.appendChild(timelineElement);
      
      // Populate timeline with year markers
      populateTimelineYears();
      
      // Add event listeners to year markers
      addTimelineEventListeners();
      
      // Set the initial active year
      setActiveYear(timelineData[timelineData.length - 1].year); // Default to most recent year
      
      console.log('Timeline initialized');
    } catch (error) {
      console.error('Error loading timeline component:', error);
    }
  }
  
  // Populate timeline with year markers
  function populateTimelineYears() {
    const trackElement = document.querySelector('.timeline-track');
    if (!trackElement) {
      console.error('Timeline track element not found');
      return;
    }
    
    // Clear existing markers
    trackElement.innerHTML = '';
    
    // Add year markers
    timelineData.forEach((yearData, index) => {
      const yearElement = document.createElement('div');
      yearElement.className = 'timeline-year';
      yearElement.dataset.year = yearData.year;
      
      // Position each year marker evenly along the track
      yearElement.style.position = 'absolute';
      yearElement.style.left = `${(index / (timelineData.length - 1)) * 100}%`;
      
      const yearLabel = document.createElement('span');
      yearLabel.className = 'timeline-year-label';
      yearLabel.textContent = yearData.label;
      
      yearElement.appendChild(yearLabel);
      trackElement.appendChild(yearElement);
    });
  }
  
  // Add event listeners to timeline elements
  function addTimelineEventListeners() {
    const yearElements = document.querySelectorAll('.timeline-year');
    yearElements.forEach(el => {
      el.addEventListener('click', function() {
        const year = parseInt(this.dataset.year);
        setActiveYear(year);
      });
    });
  }
  
  // Set active year in the timeline
  function setActiveYear(year) {
    if (currentYear === year) return;
    
    currentYear = year;
    console.log('Setting active year:', year);
    
    // Update timeline indicator position
    const indicator = document.querySelector('.timeline-indicator');
    const yearElement = document.querySelector(`.timeline-year[data-year="${year}"]`);
    
    if (indicator && yearElement) {
      const yearRect = yearElement.getBoundingClientRect();
      const trackRect = document.querySelector('.timeline-track').getBoundingClientRect();
      const position = yearRect.left - trackRect.left + (yearRect.width / 2);
      indicator.style.left = `${position}px`;
    }
    
    // Update active class on year elements
    document.querySelectorAll('.timeline-year').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.year) === year);
    });
    
    // Update content for the selected year in the main content area
    updateMainContent(year);
  }
  
  // Update the main content with the selected year's content
  function updateMainContent(year) {
    // Find the main content container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
      console.error('Main content container not found');
      return;
    }
    
    // Generate content for this year
    const content = `
      <div class="year-content">
        <h1>${year}</h1>
        <div class="portfolio-year-content">
          <h2>Highlights of ${year}</h2>
          <p>This section will display portfolio content for ${year}.</p>
          
          <div class="portfolio-items">
            <div class="portfolio-item">
              <h3>Project 1</h3>
              <p>Description of project from ${year}</p>
            </div>
            <div class="portfolio-item">
              <h3>Project 2</h3>
              <p>Description of another project from ${year}</p>
            </div>
            <div class="portfolio-item">
              <h3>Achievement</h3>
              <p>Important achievement from ${year}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Update the main content
    mainContent.innerHTML = content;
  }
  
  // Show the timeline
  function showTimeline() {
    if (timelineElement) {
      console.log('Showing timeline');
      timelineElement.style.display = '';
      timelineElement.classList.add('active');
    } else {
      console.error('Timeline element not available to show');
    }
  }
  
  // Hide the timeline
  function hideTimeline() {
    if (timelineElement) {
      console.log('Hiding timeline');
      timelineElement.classList.remove('active');
      
      // Add a small delay before hiding completely to allow for transition
      setTimeout(() => {
        if (timelineElement && !window.location.hash.includes('selected-projects')) {
          timelineElement.style.display = 'none';
        }
      }, 300); // Match the transition time
    }
  }
  
  // Call checkInitialSection on page load
  checkInitialSection();
  
  // Also force initialize after a short delay as a fallback
  setTimeout(() => {
    const hash = window.location.hash;
    if ((hash === '#portfolio/selected-projects' || hash === '#portfolio/selectedProjects') && !document.getElementById('portfolio-timeline')) {
      console.log('Force initializing timeline as fallback');
      initializeTimeline();
      showTimeline();
    }
  }, 1000);
}); 