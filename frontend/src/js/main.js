import './portfolio-timeline.js';

document.addEventListener('DOMContentLoaded', async function() {
  // Update document title
  document.title = 'AZ10';
  
  // Manually trigger contentChanged event to initialize components
  const contentChangedEvent = new CustomEvent('contentChanged', {
    detail: { 
      section: 'home', 
      subsection: '' 
    }
  });
  document.dispatchEvent(contentChangedEvent);
  
  console.log('Application initialized');
}); 