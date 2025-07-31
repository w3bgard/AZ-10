// Home page functionality
export class HomePage {
  constructor() {
    this.isLoaded = false;
  }

  async loadContent() {
    try {
      // Load home page HTML content
      const response = await fetch('../src/components/home.html');
      if (!response.ok) {
        throw new Error(`Failed to load home content: ${response.status}`);
      }
      
      const homeHtml = await response.text();
      return homeHtml;
    } catch (error) {
      console.error('Error loading home content:', error);
      return this.getFallbackContent();
    }
  }

  getFallbackContent() {
    return `
      <div class="home-hero">
        <!-- Simple fallback content -->
      </div>

      <div class="home-content-sections">
        <section class="home-section">
          <div class="section-container">
            <div class="section-header">
              <h2>Welcome to AZ10</h2>
              <p>Failed to load main content. Please refresh the page.</p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  initializeInteractions() {
    // Load persian hiphop tracks
    this.loadPersianHipHopTracks();
    // Load credits & contributors
    this.loadCreditsContributors();
  }





  // Method to handle dynamic content updates
  updateContent() {
    // Content update logic can go here if needed
  }

  /**
   * Load and display persian hiphop tracks
   */
  async loadPersianHipHopTracks() {
    try {
      console.log('Loading persian hiphop tracks...');
      const response = await fetch('/frontend/public/data/tracks.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const persianHipHopTracks = data.tracks
        .filter(track => track.basicInfo.category === 'persian-hiphop')
        .slice(0, 8); // Show only first 8 tracks
      
      this.displayTracks(persianHipHopTracks, 'persian-hiphop-tracks');
      this.setupCarousel('persian-hiphop');
      this.loadFeaturedArtists(data.tracks);
      
    } catch (error) {
      console.error('Error loading tracks:', error);
      this.showTrackLoadError('persian-hiphop-tracks');
    }
  }

  /**
   * Load and display credits & contributors
   */
  async loadCreditsContributors() {
    try {
      console.log('Loading credits & contributors...');
      const response = await fetch('/frontend/public/data/tracks.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const credits = this.processCreditsData(data.tracks);
      
      this.displayCredits(credits.slice(0, 8), 'credits-contributors'); // Show only first 8
      this.setupCarousel('credits');
      
    } catch (error) {
      console.error('Error loading credits & contributors:', error);
      this.showCreditsLoadError('credits-contributors');
    }
  }

  /**
   * Display tracks in the carousel
   */
  displayTracks(tracks, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = tracks.map(track => this.createTrackCardHTML(track)).join('');
    
    // Setup date content HTML rendering
    this.setupDateContentHTML();
    
    // Setup track click handlers for navigation
    this.setupTrackClickHandlers(containerId);
  }

  /**
   * Process tracks data to extract credits information
   */
  processCreditsData(tracks) {
    const creditsMap = new Map();

    // Role definitions for proper display
    const roleDefinitions = {
      'artist': 'Artists',
      'beatProducer': 'Beat Producers', 
      'soundEngineer': 'Sound Engineers',
      'director': 'Directors',
      'projectManager': 'Project Managers',
      'artDirection': 'Art Directors',
      'dop': 'DOP (Directors of Photography)',
      'editor': 'Editors',
      'executiveProducer': 'Executive Producers',
      'visualEffects': 'Visual Effects'
    };

    tracks.forEach(track => {
      // Process artists
      if (track.basicInfo.artist) {
        this.addCreditToMap(creditsMap, track.basicInfo.artist, 'artist', track, roleDefinitions);
      }

      // Process music production credits
      if (track.productionCredits?.music) {
        const musicCredits = track.productionCredits.music;
        
        Object.entries(musicCredits).forEach(([role, contributor]) => {
          if (contributor) {
            if (Array.isArray(contributor)) {
              contributor.forEach(name => this.addCreditToMap(creditsMap, name, role, track, roleDefinitions));
            } else {
              this.addCreditToMap(creditsMap, contributor, role, track, roleDefinitions);
            }
          }
        });
      }

      // Process video production credits
      if (track.productionCredits?.video) {
        const videoCredits = track.productionCredits.video;
        
        Object.entries(videoCredits).forEach(([role, contributor]) => {
          if (contributor) {
            if (Array.isArray(contributor)) {
              contributor.forEach(name => this.addCreditToMap(creditsMap, name, role, track, roleDefinitions));
            } else {
              this.addCreditToMap(creditsMap, contributor, role, track, roleDefinitions);
            }
          }
        });
      }
    });

    // Convert map to array and calculate statistics
    return Array.from(creditsMap.values()).map(credit => ({
      ...credit,
      trackCount: credit.tracks.length,
      roles: [...new Set(credit.roles)],
      primaryRole: this.getPrimaryRole(credit.roles),
      displayRole: this.getPrimaryRoleLabel(credit.roles, roleDefinitions)
    })).sort((a, b) => b.trackCount - a.trackCount); // Sort by track count
  }

  /**
   * Add credit to the credits map
   */
  addCreditToMap(creditsMap, name, role, track, roleDefinitions) {
    const key = name.toLowerCase().trim();
    
    if (!creditsMap.has(key)) {
      creditsMap.set(key, {
        id: `credit-${key.replace(/\s+/g, '-')}`,
        name: name.trim(),
        roles: [],
        tracks: []
      });
    }

    const credit = creditsMap.get(key);
    credit.roles.push(role);
    credit.tracks.push(track);
  }

  /**
   * Get primary role for a credit
   */
  getPrimaryRole(roles) {
    // Priority order for determining primary role
    const rolePriority = [
      'artist', 'director', 'beatProducer', 'soundEngineer', 
      'projectManager', 'artDirection', 'dop', 'editor', 
      'executiveProducer', 'visualEffects'
    ];

    for (const role of rolePriority) {
      if (roles.includes(role)) {
        return role;
      }
    }
    return roles[0] || 'contributor';
  }

  /**
   * Get primary role label for display
   */
  getPrimaryRoleLabel(roles, roleDefinitions) {
    const primaryRole = this.getPrimaryRole(roles);
    return roleDefinitions[primaryRole] || primaryRole;
  }

  /**
   * Display credits in the carousel
   */
  displayCredits(credits, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = credits.map(credit => this.createCreditCardHTML(credit)).join('');
  }

  /**
   * Create HTML for a single credit card
   */
  createCreditCardHTML(credit) {
    // Get a representative cover art from the most recent track
    const recentTrack = credit.tracks[0] || {};
    const coverArt = recentTrack.media?.coverArt || '/frontend/public/assets/images/default-avatar.jpg';

    return `
      <div class="credit-card" data-credit-id="${credit.id}">
        <div class="credit-avatar">
          <img src="${coverArt}" alt="${credit.name}" 
               onerror="this.src='/frontend/public/assets/images/default-avatar.jpg'">
        </div>
        <div class="credit-name">${credit.name}</div>
        <div class="credit-role">${credit.displayRole}</div>
        <div class="credit-track-count">
          <i class="fas fa-music"></i>
          <span>${credit.trackCount} track${credit.trackCount !== 1 ? 's' : ''}</span>
        </div>
        <div class="credit-roles-preview">
          ${credit.roles.length > 1 ? `+${credit.roles.length - 1} more role${credit.roles.length - 1 !== 1 ? 's' : ''}` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Show error message when credits fail to load
   */
  showCreditsLoadError(containerId = 'credits-contributors') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Unable to load credits & contributors. Please try again later.</p>
        </div>
      `;
    }
  }

  /**
   * Create HTML for a single track card
   */
  createTrackCardHTML(track) {
    const releaseDate = this.formatDate(track.basicInfo.releaseDate);
    const producer = this.getProducerName(track);

    return `
      <div class="track-card" data-track-id="${track.id}">
        <div class="track-cover">
          <img src="${track.media.coverArt}" alt="${track.basicInfo.title}" 
               onerror="this.src='/frontend/public/assets/images/default-cover.jpg'">
        </div>
        <div class="track-artist">${track.basicInfo.artist}</div>
        <div class="track-title">${track.basicInfo.title}</div>
        <div class="track-producer">Prod. by ${producer}</div>
        <div class="track-type">
          <i class="fas ${track.media.hasVideo ? 'fa-play-circle' : 'fa-music'}"></i>
          <span>${track.media.hasVideo ? 'Music Video' : track.basicInfo.trackType}</span>
        </div>
        <div class="track-date"><span class="date-content">${releaseDate}</span></div>
      </div>
    `;
  }

  /**
   * Get producer name from track data
   */
  getProducerName(track) {
    const credits = track.productionCredits;
    if (credits?.music?.beatProducer) {
      return Array.isArray(credits.music.beatProducer) 
        ? credits.music.beatProducer.join(', ')
        : credits.music.beatProducer;
    }
    return credits?.music?.producer || 'Unknown';
  }

  /**
   * Setup date content HTML rendering
   */
  setupDateContentHTML() {
    const dateElements = document.querySelectorAll('.date-content');
    dateElements.forEach(element => {
      // The content is already set as HTML from createTrackCardHTML
      // This ensures proper rendering of relative time spans
    });
  }

  /**
   * Setup click handlers for track cards to navigate to track details
   */
  setupTrackClickHandlers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const trackCards = container.querySelectorAll('.track-card');
    trackCards.forEach(card => {
      card.addEventListener('click', (event) => {
        // Check if the container is in drag mode
        const tracksContainer = card.closest('.tracks-container');
        if (tracksContainer && tracksContainer.classList.contains('active-drag')) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        
        event.preventDefault();
        
        const trackId = card.getAttribute('data-track-id');
        if (trackId) {
          // Navigate to track details page using hash-based routing
          console.log(`Opening track details for track ID: ${trackId}`);
          window.location.hash = `#track/${trackId}`;
        }
      });
    });
  }

  /**
   * Calculate relative time from a date
   */
  calculateRelativeTime(dateString) {
    if (!dateString) return '';
    
    try {
      const releaseDate = new Date(dateString);
      const today = new Date();
      
      // Set both dates to midnight for accurate day comparison
      const releaseDateMidnight = new Date(releaseDate.getFullYear(), releaseDate.getMonth(), releaseDate.getDate());
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const diffTime = todayMidnight - releaseDateMidnight;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'today';
      } else if (diffDays === 1) {
        return '1 day ago';
      } else if (diffDays > 1) {
        return `${diffDays} days ago`;
      } else if (diffDays === -1) {
        return 'tomorrow';
      } else if (diffDays < -1) {
        return `in ${Math.abs(diffDays)} days`;
      }
      
      return '';
    } catch (error) {
      console.warn('Error calculating relative time:', error);
      return '';
    }
  }

  /**
   * Format date for display (home page - only relative time)
   */
  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const relativeTime = this.calculateRelativeTime(dateString);
      
      if (relativeTime) {
        return `<span class="relative-time">${relativeTime}</span>`;
      }
      
      // Fallback to formatted date if no relative time
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return formattedDate;
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Setup carousel navigation
   */
  setupCarousel(type) {
    const containerIdMap = {
      'persian-hiphop': 'persian-hiphop-tracks',
      'credits': 'credits-contributors'
    };
    
    const btnIdMap = {
      'persian-hiphop': { prev: 'tracks-prev', next: 'tracks-next' },
      'credits': { prev: 'credits-prev', next: 'credits-next' }
    };
    
    const container = document.getElementById(containerIdMap[type]);
    const prevBtn = document.getElementById(btnIdMap[type].prev);
    const nextBtn = document.getElementById(btnIdMap[type].next);
    
    if (!container || !prevBtn || !nextBtn) return;

    const scrollAmount = 300;

    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Show/hide navigation buttons based on scroll position
    const updateNavButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      prevBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
      nextBtn.style.opacity = scrollLeft < scrollWidth - clientWidth ? '1' : '0.5';
    };

    container.addEventListener('scroll', updateNavButtons);
    updateNavButtons(); // Initial check

    // Add drag scrolling functionality for desktop
    this.setupDragScrolling(container);
  }

  /**
   * Setup drag scrolling for track containers (desktop only)
   */
  setupDragScrolling(container) {
    // Only enable drag scrolling on desktop (devices that support hover)
    if (!window.matchMedia('(hover: hover)').matches) return;

    let isDown = false;
    let isDragging = false;
    let startX;
    let startY;
    let scrollLeft;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let dragThreshold = 5; // Minimum distance to consider it a drag

    // Prevent default drag behavior on images and links
    container.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    container.addEventListener('mousedown', (e) => {
      // Only start potential drag if clicking on the container or track cards, not buttons
      const target = e.target.closest('.track-card, .tracks-container');
      if (!target) return;

      isDown = true;
      isDragging = false;
      startX = e.pageX;
      startY = e.pageY;
      scrollLeft = container.scrollLeft;
      lastX = e.pageX;
      lastTime = Date.now();
      velocity = 0;

      // Don't prevent default here - let it bubble up normally for clicks
    });

    container.addEventListener('mouseleave', () => {
      if (isDown) {
        this.endDrag(container, velocity, isDragging);
        isDown = false;
        isDragging = false;
      }
    });

    container.addEventListener('mouseup', () => {
      if (isDown) {
        this.endDrag(container, velocity, isDragging);
        isDown = false;
        isDragging = false;
      }
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      
      const deltaX = Math.abs(e.pageX - startX);
      const deltaY = Math.abs(e.pageY - startY);
      
      // Start drag mode if we've moved beyond the threshold
      if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
        isDragging = true;
        container.classList.add('active-drag');
        
        // Disable smooth scrolling during drag
        container.style.scrollBehavior = 'auto';
        
        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        
        container.style.cursor = 'grabbing';
      }
      
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        
        const x = e.pageX - container.offsetLeft;
        const walk = (x - (startX - container.offsetLeft)) * 1.5; // Adjust scroll speed
        const newScrollLeft = scrollLeft - walk;
        
        // Calculate velocity for momentum scrolling
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        if (deltaTime > 0) {
          const deltaX = e.pageX - lastX;
          velocity = deltaX / deltaTime * 16; // Convert to pixels per frame (60fps)
        }
        
        container.scrollLeft = newScrollLeft;
        
        lastX = e.pageX;
        lastTime = currentTime;
      }
    });

    // Set initial cursor style
    container.style.cursor = 'grab';
    
    // Add a property to track if dragging for external access
    container._isDragging = () => isDragging;
  }

  /**
   * End drag operation and restore normal state
   */
  endDrag(container, velocity, wasDragging) {
    container.classList.remove('active-drag');
    container.style.scrollBehavior = 'smooth';
    container.style.cursor = 'grab';
    
    if (wasDragging && velocity !== undefined) {
      this.applyMomentumScrolling(container, velocity);
    }
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';
  }

  /**
   * Apply momentum scrolling after drag ends
   */
  applyMomentumScrolling(container, velocity) {
    if (Math.abs(velocity) < 0.5) return; // Don't apply momentum for very slow drags

    const friction = 0.95;
    let currentVelocity = velocity;

    const momentumScroll = () => {
      currentVelocity *= friction;
      
      if (Math.abs(currentVelocity) < 0.1) {
        return; // Stop when velocity is very low
      }

      container.scrollLeft -= currentVelocity;
      requestAnimationFrame(momentumScroll);
    };

    requestAnimationFrame(momentumScroll);
  }

  /**
   * Load and display featured artists
   */
  loadFeaturedArtists(tracks) {
    const artistsContainer = document.getElementById('featured-artists');
    if (!artistsContainer) return;

    // Group tracks by artist and count them
    const artistStats = {};
    tracks.forEach(track => {
      const artist = track.basicInfo.artist;
      if (!artistStats[artist]) {
        artistStats[artist] = {
          name: artist,
          trackCount: 0,
          coverArt: track.media.coverArt
        };
      }
      artistStats[artist].trackCount++;
    });

    // Get top artists (by track count)
    const featuredArtists = Object.values(artistStats)
      .sort((a, b) => b.trackCount - a.trackCount)
      .slice(0, 6);

    artistsContainer.innerHTML = featuredArtists.map(artist => `
      <div class="artist-card" data-artist="${artist.name}">
        <div class="artist-avatar">
          <img src="${artist.coverArt}" alt="${artist.name}" 
               onerror="this.src='/frontend/public/assets/images/default-avatar.jpg'">
        </div>
        <div class="artist-name">${artist.name}</div>
        <div class="artist-tracks-count">${artist.trackCount} track${artist.trackCount !== 1 ? 's' : ''}</div>
      </div>
    `).join('');
  }

  /**
   * Show error message when tracks fail to load
   */
  showTrackLoadError(containerId = 'persian-hiphop-tracks') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Unable to load tracks. Please try again later.</p>
        </div>
      `;
    }
  }
}

// Export singleton instance
export const homePage = new HomePage();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    homePage.initializeInteractions();
  });
} else {
  homePage.initializeInteractions();
} 