// Team page module
export class TeamPage {
  constructor() {
    this.teamData = null;
  }

  async loadContent() {
    try {
      // Load team component HTML
      const response = await fetch('/frontend/src/components/team.html');
      if (!response.ok) {
        throw new Error('Failed to load team component');
      }
      const html = await response.text();
      return html;
    } catch (error) {
      console.error('Error loading team content:', error);
      return this.getFallbackContent();
    }
  }

  async loadTeamData() {
    try {
      const response = await fetch('/frontend/public/data/team.json');
      if (!response.ok) {
        throw new Error('Failed to load team data');
      }
      this.teamData = await response.json();
      return this.teamData;
    } catch (error) {
      console.error('Error loading team data:', error);
      // Return fallback data
      return [
        {
          id: 1,
          name: "Ahmad Mirjalalian",
          position: "Co-founder & Managing Director",
          description: "Architectural and interior designer with a passion for creative problem-solving.",
          experience: "Sep 2022 – Present",
          image: "assets/images/team/placeholder.svg",

          contact: {
            email: "ahmad@azsolutions.com",
            linkedin: "https://www.linkedin.com/in/ahmad-mirjalalian-416b49268/"
          }
        }
      ];
    }
  }

  async initializeInteractions() {
    // Load team data and render team members
    const teamData = await this.loadTeamData();
    this.renderTeamMembers(teamData);
    
    
  }

  renderTeamMembers(teamData) {
    const container = document.getElementById('team-members-container');
    const template = document.getElementById('team-member-template');
    
    if (!container || !template) {
      console.error('Team container or template not found');
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    teamData.forEach(member => {
      const memberCard = this.createMemberCard(member, template);
      container.appendChild(memberCard);
    });
  }

  createMemberCard(member, template) {
    const clone = template.content.cloneNode(true);
    
    // Fill member information
    const nameEl = clone.querySelector('.member-name');
    const positionEl = clone.querySelector('.member-position');
    const experienceEl = clone.querySelector('.member-experience');
    const descriptionEl = clone.querySelector('.member-description');
    const imageEl = clone.querySelector('.member-image');
    const linkedinLink = clone.querySelector('.social-link.linkedin');
    const emailLink = clone.querySelector('.social-link.email');

    if (nameEl) nameEl.textContent = member.name;
    if (positionEl) positionEl.textContent = member.position;
    if (experienceEl) experienceEl.textContent = member.experience;
    if (descriptionEl) descriptionEl.textContent = member.description;
    
    // Set image with fallback
    if (imageEl) {
      imageEl.src = member.image || 'assets/images/team/placeholder.svg';
      imageEl.alt = member.name;
      imageEl.onerror = function() {
        this.src = 'assets/images/team/placeholder.svg';
      };
    }



    // Set contact links
    if (linkedinLink && member.contact?.linkedin) {
      linkedinLink.href = member.contact.linkedin;
    }
    if (emailLink && member.contact?.email) {
      emailLink.href = `mailto:${member.contact.email}`;
    }

    return clone;
  }

  getFallbackContent() {
    return `
      <div class="team-section">
        <div class="team-header">
          <h1 class="team-title">Our Team</h1>
          <p class="team-subtitle">Meet the passionate individuals behind AZ10</p>
        </div>
        
        <div class="team-grid">
          <div class="team-member-card">
            <div class="member-image-container">
              <img class="member-image" src="assets/images/team/placeholder.svg" alt="Ahmad Mirjalalian" />
              <div class="member-overlay">
                <div class="member-social">
                  <a class="social-link linkedin" href="https://www.linkedin.com/in/ahmad-mirjalalian-416b49268/" target="_blank">
                    <i class="fab fa-linkedin"></i>
                  </a>
                  <a class="social-link email" href="mailto:ahmad@azsolutions.com">
                    <i class="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="member-info">
              <h3 class="member-name">Ahmad Mirjalalian</h3>
              <p class="member-position">Co-founder & Managing Director</p>
              <p class="member-experience">Sep 2022 – Present</p>
              <p class="member-description">Architectural and interior designer with a passion for creative problem-solving. Active and interested in platform development and programming.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Create and export team page instance
export const teamPage = new TeamPage(); 