// Tracks Listing page functionality
export class TracksListingPage {
  constructor() {
    this.isLoaded = false;
    this.allTracks = [];
    this.filteredTracks = [];
    this.displayedTracks = [];
    this.currentCategory = 'all';
    this.itemsPerPage = 12;
    this.currentPage = 1;
    this.searchTerm = '';
    this.currentSort = 'newest';
    this.currentFilter = 'all';
    this.viewMode = 'large'; // Default view mode
  }

  async loadContent() {
    try {
      // Load tracks listing HTML content
      const response = await fetch('../src/components/tracks-listing.html');
      if (!response.ok) {
        throw new Error(`Failed to load tracks listing content: ${response.status}`);
      }
      
      const tracksListingHtml = await response.text();
      return tracksListingHtml;
    } catch (error) {
      console.error('Error loading tracks listing content:', error);
      return this.getFallbackContent();
    }
  }

  getFallbackContent() {
    return `
      <div class="tracks-listing-page">
        <div class="page-header">
          <div class="header-content">
            <h1>All Tracks</h1>
            <p>Failed to load tracks listing. Please refresh the page.</p>
          </div>
        </div>
      </div>
    `;
  }

  async initializeInteractions(category = 'all') {
    this.currentCategory = category;
    await this.loadTracks();
    this.setupEventListeners();
    this.updatePageInfo();
    this.filterAndDisplayTracks();
  }

  async loadTracks() {
    try {
      const response = await fetch('../public/data/tracks.json');
      if (!response.ok) {
        throw new Error(`Failed to load tracks: ${response.status}`);
      }
      
      const data = await response.json();
      this.allTracks = data.tracks || [];
      
      // Filter by category if specific category is requested
      if (this.currentCategory !== 'all') {
        this.allTracks = this.allTracks.filter(track => 
          track.basicInfo.category === this.currentCategory
        );
      }
      
    } catch (error) {
      console.error('Error loading tracks:', error);
      this.showError('Failed to load tracks. Please try again later.');
    }
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('tracks-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.filterAndDisplayTracks();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('tracks-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.currentPage = 1;
        this.filterAndDisplayTracks();
      });
    }

    // Filter select
    const filterSelect = document.getElementById('tracks-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.currentPage = 1;
        this.filterAndDisplayTracks();
      });
    }

    // View mode buttons
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    viewModeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-mode');
        this.setViewMode(mode);
      });
    });

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.currentPage++;
        this.filterAndDisplayTracks(true);
      });
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    
    // Update active button
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    viewModeButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      }
    });

    // Update grid data attribute
    const tracksGrid = document.getElementById('tracks-grid');
    if (tracksGrid) {
      tracksGrid.setAttribute('data-view-mode', mode);
    }

    // Update items per page based on view mode
    switch (mode) {
      case 'large':
        this.itemsPerPage = 12;
        break;
      case 'small':
        this.itemsPerPage = 24;
        break;
      default:
        this.itemsPerPage = 12;
    }

    // Re-display tracks with new view mode
    this.currentPage = 1;
    this.filterAndDisplayTracks();
  }

  updatePageInfo() {
    // Update page title and description based on category
    const titleElement = document.getElementById('tracks-page-title');
    const descElement = document.getElementById('tracks-page-description');
    
    if (titleElement && descElement) {
      switch (this.currentCategory) {
        case 'persian-hiphop':
          titleElement.textContent = 'Persian HipHop Tracks';
          descElement.textContent = 'The newest releases from established artists in the Persian hip-hop scene. Discover, listen, and rate the latest tracks.';
          break;
        case 'underground':
          titleElement.textContent = 'Underground Tracks';
          descElement.textContent = 'Discover emerging talent and underground artists pushing the boundaries of Persian hip-hop.';
          break;
        default:
          titleElement.textContent = 'All Tracks';
          descElement.textContent = 'Discover all tracks from our collection';
          break;
      }
    }
  }

  filterAndDisplayTracks(append = false) {
    this.showLoading();
    
    // Filter tracks based on search term (only track titles)
    let filtered = this.allTracks.filter(track => {
      const searchMatch = !this.searchTerm || 
        track.basicInfo.title.toLowerCase().includes(this.searchTerm);
      
      const filterMatch = this.currentFilter === 'all' ||
        (this.currentFilter === 'video' && track.media.hasVideo) ||
        track.basicInfo.trackType === this.currentFilter;
      
      return searchMatch && filterMatch;
    });

    // Sort tracks
    filtered = this.sortTracks(filtered);
    
    this.filteredTracks = filtered;
    
    // Paginate
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    const tracksToShow = filtered.slice(startIndex, endIndex);
    
    if (append) {
      this.displayedTracks = [...this.displayedTracks, ...tracksToShow.slice(this.displayedTracks.length)];
    } else {
      this.displayedTracks = tracksToShow;
    }
    
    this.hideLoading();
    this.displayTracks(append);
    this.updateLoadMoreButton();
  }

  sortTracks(tracks) {
    const sorted = [...tracks];
    
    switch (this.currentSort) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.basicInfo.releaseDate) - new Date(a.basicInfo.releaseDate));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.basicInfo.releaseDate) - new Date(b.basicInfo.releaseDate));

      case 'title':
        return sorted.sort((a, b) => a.basicInfo.title.localeCompare(b.basicInfo.title));
      case 'artist':
        return sorted.sort((a, b) => a.basicInfo.artist.localeCompare(b.basicInfo.artist));
      default:
        return sorted;
    }
  }

  displayTracks(append = false) {
    const grid = document.getElementById('tracks-grid');
    if (!grid) return;

    if (this.displayedTracks.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    
    const tracksHTML = this.displayedTracks.map(track => this.createTrackCardHTML(track)).join('');
    
    if (append) {
      grid.insertAdjacentHTML('beforeend', tracksHTML);
    } else {
      grid.innerHTML = tracksHTML;
    }

    // Setup date content HTML rendering
    this.setupDateContentHTML();

    // Add click handlers to track cards
    this.setupTrackCardHandlers();
  }

  createTrackCardHTML(track) {
    const releaseDate = this.formatDate(track.basicInfo.releaseDate);
    const producer = this.getProducerName(track);

    if (this.viewMode === 'small') {
      return `
        <div class="track-card track-card-small" data-track-id="${track.id}">
          <div class="track-cover">
            <img src="${track.media.coverArt}" alt="${track.basicInfo.title}" 
                 onerror="this.src='/frontend/public/assets/images/default-cover.jpg'">
            <div class="track-overlay">
              <button class="play-btn">
                <i class="fas ${track.media.hasVideo ? 'fa-play' : 'fa-music'}"></i>
              </button>
            </div>
          </div>
          <div class="track-info">
            <div class="track-main-info">
              <div class="track-artist-title-group">
                <div class="track-artist">${track.basicInfo.artist}</div>
                <div class="track-title">${track.basicInfo.title}</div>
              </div>
              <div class="track-producer">Prod. by ${producer}</div>
            </div>
            <div class="track-meta-info">
              <div class="track-type">
                <i class="fas ${track.media.hasVideo ? 'fa-play-circle' : 'fa-music'}"></i>
                <span>${track.media.hasVideo ? 'Music Video' : track.basicInfo.trackType}</span>
              </div>
              <div class="track-date"><span class="date-content">${releaseDate}</span></div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Large view mode
      return `
        <div class="track-card track-card-large" data-track-id="${track.id}">
          <div class="track-cover">
            <img src="${track.media.coverArt}" alt="${track.basicInfo.title}" 
                 onerror="this.src='/frontend/public/assets/images/default-cover.jpg'">
            <div class="track-overlay">
              <button class="play-btn">
                <i class="fas ${track.media.hasVideo ? 'fa-play' : 'fa-music'}"></i>
              </button>
            </div>
          </div>
          <div class="track-info">
            <div class="track-artist">${track.basicInfo.artist}</div>
            <div class="track-title">${track.basicInfo.title}</div>
            <div class="track-producer">Prod. by ${producer}</div>
            <div class="track-type">
              <i class="fas ${track.media.hasVideo ? 'fa-play-circle' : 'fa-music'}"></i>
              <span>${track.media.hasVideo ? 'Music Video' : track.basicInfo.trackType}</span>
            </div>
            <div class="track-date"><span class="date-content">${releaseDate}</span></div>
          </div>
        </div>
      `;
    }
  }

  setupTrackCardHandlers() {
    const trackCards = document.querySelectorAll('.track-card');
    trackCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const trackId = card.dataset.trackId;
        this.handleTrackClick(trackId);
      });
    });
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

  handleTrackClick(trackId) {
    const track = this.allTracks.find(t => t.id === trackId);
    if (track) {
      // Navigate to track details page using hash-based routing
      console.log(`Opening track details for: ${track.basicInfo.title} by ${track.basicInfo.artist}`);
      window.location.hash = `#track/${track.id}`;
    }
  }

  updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('load-more-container');
    if (!loadMoreContainer) return;

    const hasMore = this.displayedTracks.length < this.filteredTracks.length;
    loadMoreContainer.style.display = hasMore ? 'block' : 'none';
  }

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

  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      const relativeTime = this.calculateRelativeTime(dateString);
      
      if (relativeTime) {
        return `<span class="relative-time">${relativeTime}</span><br/><span class="gregorian-date">${formattedDate}</span>`;
      }
      
      return formattedDate;
    } catch (error) {
      return dateString;
    }
  }

  showLoading() {
    const loading = document.getElementById('tracks-loading');
    if (loading) loading.style.display = 'block';
  }

  hideLoading() {
    const loading = document.getElementById('tracks-loading');
    if (loading) loading.style.display = 'none';
  }

  showEmptyState() {
    const empty = document.getElementById('tracks-empty');
    if (empty) empty.style.display = 'block';
  }

  hideEmptyState() {
    const empty = document.getElementById('tracks-empty');
    if (empty) empty.style.display = 'none';
  }

  showError(message) {
    const grid = document.getElementById('tracks-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-state">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Error Loading Tracks</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }
}

// Create and export instance
export const tracksListingPage = new TracksListingPage(); 