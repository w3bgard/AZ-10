// Credits Listing page functionality
export class CreditsListingPage {
  constructor() {
    this.isLoaded = false;
    this.allTracks = [];
    this.allCredits = [];
    this.filteredCredits = [];
    this.displayedCredits = [];
    this.itemsPerPage = 16;
    this.currentPage = 1;
    this.searchTerm = '';
    this.currentSort = 'name';
    this.currentRoleFilter = 'all';
    this.viewMode = 'grid'; // Default view mode
    
    // Role definitions for proper display
    this.roleDefinitions = {
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
  }

  async loadContent() {
    try {
      // Load credits listing HTML content
      const response = await fetch('../src/components/credits-listing.html');
      if (!response.ok) {
        throw new Error(`Failed to load credits listing content: ${response.status}`);
      }
      
      const creditsListingHtml = await response.text();
      return creditsListingHtml;
    } catch (error) {
      console.error('Error loading credits listing content:', error);
      return this.getFallbackContent();
    }
  }

  getFallbackContent() {
    return `
      <div class="credits-listing-page">
        <div class="page-header">
          <div class="header-content">
            <h1>Credits & Contributors</h1>
            <p>Failed to load credits listing. Please refresh the page.</p>
          </div>
        </div>
      </div>
    `;
  }

  async initializeInteractions() {
    await this.loadTracks();
    this.processCredits();
    this.setupEventListeners();
    this.filterAndDisplayCredits();
  }

  async loadTracks() {
    try {
      const response = await fetch('../public/data/tracks.json');
      if (!response.ok) {
        throw new Error(`Failed to load tracks: ${response.status}`);
      }
      
      const data = await response.json();
      this.allTracks = data.tracks || [];
      
    } catch (error) {
      console.error('Error loading tracks:', error);
      this.showError('Failed to load track data. Please try again later.');
    }
  }

  processCredits() {
    const creditsMap = new Map();

    this.allTracks.forEach(track => {
      // Process artists
      if (track.basicInfo.artist) {
        this.addCredit(creditsMap, track.basicInfo.artist, 'artist', track);
      }

      // Process music production credits
      if (track.productionCredits?.music) {
        const musicCredits = track.productionCredits.music;
        
        Object.entries(musicCredits).forEach(([role, contributor]) => {
          if (contributor) {
            if (Array.isArray(contributor)) {
              contributor.forEach(name => this.addCredit(creditsMap, name, role, track));
            } else {
              this.addCredit(creditsMap, contributor, role, track);
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
              contributor.forEach(name => this.addCredit(creditsMap, name, role, track));
            } else {
              this.addCredit(creditsMap, contributor, role, track);
            }
          }
        });
      }
    });

    // Convert map to array and calculate statistics
    this.allCredits = Array.from(creditsMap.values()).map(credit => ({
      ...credit,
      trackCount: credit.tracks.length,
      roles: [...new Set(credit.roles)],
      primaryRole: this.getPrimaryRole(credit.roles)
    }));
  }

  addCredit(creditsMap, name, role, track) {
    const key = name.toLowerCase().trim();
    
    if (!creditsMap.has(key)) {
      creditsMap.set(key, {
        id: `credit-${key.replace(/\s+/g, '-')}`,
        name: name.trim(),
        roles: [],
        tracks: [],
        roleDetails: {}
      });
    }

    const credit = creditsMap.get(key);
    credit.roles.push(role);
    credit.tracks.push(track);
    
    if (!credit.roleDetails[role]) {
      credit.roleDetails[role] = [];
    }
    credit.roleDetails[role].push(track);
  }

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

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('credits-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.filterAndDisplayCredits();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('credits-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.currentPage = 1;
        this.filterAndDisplayCredits();
      });
    }

    // Role filter select
    const roleFilterSelect = document.getElementById('credits-role-filter');
    if (roleFilterSelect) {
      roleFilterSelect.addEventListener('change', (e) => {
        this.currentRoleFilter = e.target.value;
        this.currentPage = 1;
        this.filterAndDisplayCredits();
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
    const loadMoreBtn = document.getElementById('credits-load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.currentPage++;
        this.filterAndDisplayCredits(true);
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
    const creditsGrid = document.getElementById('credits-grid');
    if (creditsGrid) {
      creditsGrid.setAttribute('data-view-mode', mode);
    }

    // Update items per page based on view mode
    switch (mode) {
      case 'grid':
        this.itemsPerPage = 16;
        break;
      case 'list':
        this.itemsPerPage = 20;
        break;
      default:
        this.itemsPerPage = 16;
    }

    // Re-display credits with new view mode
    this.currentPage = 1;
    this.filterAndDisplayCredits();
  }

  filterAndDisplayCredits(append = false) {
    this.showLoading();
    
    // Filter credits based on search term and role
    let filtered = this.allCredits.filter(credit => {
      const searchMatch = !this.searchTerm || 
        credit.name.toLowerCase().includes(this.searchTerm);
      
      const roleMatch = this.currentRoleFilter === 'all' ||
        credit.roles.includes(this.currentRoleFilter);
      
      return searchMatch && roleMatch;
    });

    // Sort credits
    filtered = this.sortCredits(filtered);
    
    this.filteredCredits = filtered;
    
    // Paginate
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    const creditsToShow = filtered.slice(startIndex, endIndex);
    
    if (append) {
      this.displayedCredits = [...this.displayedCredits, ...creditsToShow.slice(this.displayedCredits.length)];
    } else {
      this.displayedCredits = creditsToShow;
    }
    
    this.hideLoading();
    this.displayCredits(append);
    this.updateLoadMoreButton();
  }

  sortCredits(credits) {
    const sorted = [...credits];
    
    switch (this.currentSort) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'role':
        return sorted.sort((a, b) => {
          const roleA = this.roleDefinitions[a.primaryRole] || a.primaryRole;
          const roleB = this.roleDefinitions[b.primaryRole] || b.primaryRole;
          return roleA.localeCompare(roleB);
        });
      case 'track-count':
        return sorted.sort((a, b) => b.trackCount - a.trackCount);
      default:
        return sorted;
    }
  }

  displayCredits(append = false) {
    const grid = document.getElementById('credits-grid');
    if (!grid) return;

    if (this.displayedCredits.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    
    const creditsHTML = this.displayedCredits.map(credit => this.createCreditCardHTML(credit)).join('');
    
    if (append) {
      grid.insertAdjacentHTML('beforeend', creditsHTML);
    } else {
      grid.innerHTML = creditsHTML;
    }

    // Add click handlers to credit cards
    this.setupCreditCardHandlers();
  }

  createCreditCardHTML(credit) {
    const primaryRoleLabel = this.roleDefinitions[credit.primaryRole] || credit.primaryRole;
    const allRolesLabels = credit.roles.map(role => this.roleDefinitions[role] || role);
    
    if (this.viewMode === 'list') {
      return `
        <div class="credit-card credit-card-list" data-credit-id="${credit.id}">
          <div class="credit-avatar">
            <div class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="credit-info">
            <div class="credit-main-info">
              <div class="credit-name">${credit.name}</div>
              <div class="credit-primary-role">${primaryRoleLabel}</div>
            </div>
            <div class="credit-meta-info">
              <div class="credit-track-count">
                <i class="fas fa-music"></i>
                <span>${credit.trackCount} track${credit.trackCount !== 1 ? 's' : ''}</span>
              </div>
              <div class="credit-all-roles">
                ${allRolesLabels.slice(0, 3).join(', ')}${allRolesLabels.length > 3 ? `... +${allRolesLabels.length - 3} more` : ''}
              </div>
            </div>
          </div>
          <div class="credit-actions">
            <button class="view-tracks-btn" title="View tracks">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      // Grid view mode
      return `
        <div class="credit-card credit-card-grid" data-credit-id="${credit.id}">
          <div class="credit-avatar">
            <div class="avatar-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="credit-info">
            <div class="credit-name">${credit.name}</div>
            <div class="credit-primary-role">${primaryRoleLabel}</div>
            <div class="credit-track-count">
              <i class="fas fa-music"></i>
              <span>${credit.trackCount} track${credit.trackCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="credit-roles-preview">
              ${allRolesLabels.slice(0, 2).join(', ')}${allRolesLabels.length > 2 ? '...' : ''}
            </div>
          </div>
        </div>
      `;
    }
  }

  setupCreditCardHandlers() {
    const creditCards = document.querySelectorAll('.credit-card');
    creditCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const creditId = card.dataset.creditId;
        this.handleCreditClick(creditId);
      });
    });
  }

  handleCreditClick(creditId) {
    const credit = this.allCredits.find(c => c.id === creditId);
    if (credit) {
      // Handle credit click - could show modal with tracks, navigate to detail page, etc.
      console.log('Credit clicked:', credit);
      // You can implement credit detail modal or navigation here
      this.showCreditDetail(credit);
    }
  }

  showCreditDetail(credit) {
    // Simple modal implementation - you can enhance this
    const modal = document.createElement('div');
    modal.className = 'credit-detail-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${credit.name}</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="credit-roles">
            <h3>Roles:</h3>
            <ul>
              ${credit.roles.map(role => `<li>${this.roleDefinitions[role] || role}</li>`).join('')}
            </ul>
          </div>
          <div class="credit-tracks">
            <h3>Tracks (${credit.trackCount}):</h3>
            <ul>
              ${credit.tracks.slice(0, 10).map(track => `<li>${track.basicInfo.artist} - ${track.basicInfo.title}</li>`).join('')}
              ${credit.tracks.length > 10 ? `<li>... and ${credit.tracks.length - 10} more tracks</li>` : ''}
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('credits-load-more-container');
    if (!loadMoreContainer) return;

    const hasMore = this.displayedCredits.length < this.filteredCredits.length;
    loadMoreContainer.style.display = hasMore ? 'block' : 'none';
  }

  showLoading() {
    const loading = document.getElementById('credits-loading');
    if (loading) loading.style.display = 'block';
  }

  hideLoading() {
    const loading = document.getElementById('credits-loading');
    if (loading) loading.style.display = 'none';
  }

  showEmptyState() {
    const empty = document.getElementById('credits-empty');
    if (empty) empty.style.display = 'block';
  }

  hideEmptyState() {
    const empty = document.getElementById('credits-empty');
    if (empty) empty.style.display = 'none';
  }

  showError(message) {
    const grid = document.getElementById('credits-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-state">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Error Loading Credits</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }
}

// Create and export instance
export const creditsListingPage = new CreditsListingPage(); 