const profileButton = document.getElementById('profile-button');

document.addEventListener('DOMContentLoaded', () => {
    // Wait until the profile button is potentially loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        const profileBtn = document.getElementById('profile-button');
        if (profileBtn) {
            // Profile button loaded, initialize functionality
            initializeProfile(profileBtn);
            observer.disconnect();
        }
    });

    // Start observing the body for child list changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback in case the button is already present when this script runs
    const initialProfileButton = document.getElementById('profile-button');
    if (initialProfileButton) {
        initializeProfile(initialProfileButton);
        observer.disconnect();
    }
});

function initializeProfile(profileBtn) {
    console.log('Profile.js - Initializing Profile button functionality');
    
    // Set aria-label and title for clarity
    profileBtn.setAttribute('aria-label', 'Profile Menu');
    profileBtn.setAttribute('title', 'Profile Menu');

    // Add icon to the button
    profileBtn.innerHTML = '<i class="fas fa-user"></i>';

    // Create profile text element
    const profileText = document.createElement('span');
    profileText.className = 'profile-text';
    profileText.textContent = 'Profile';
    profileBtn.parentElement.appendChild(profileText);

    // Create profile window as a separate element
    const profileWindow = document.createElement('div');
    profileWindow.className = 'profile-window';
    profileWindow.innerHTML = `
        <div class="profile-content">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-info">
                    <div class="profile-name">Guest User</div>
                    <div class="profile-status">Not signed in</div>
                </div>
            </div>
            
            <div class="profile-divider"></div>
            
            <div class="profile-actions" id="profile-actions">
                <div class="profile-action-item" id="signin-action">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
                </div>
                <div class="profile-action-item" id="signup-action">
                    <i class="fas fa-user-plus"></i>
                    <span>Sign Up</span>
                </div>
            </div>
            
            <div class="profile-divider"></div>
            
            <div class="profile-menu-items">
                <div class="profile-menu-item" id="profile-settings">
                    <i class="fas fa-cog"></i>
                    <span>Profile Settings</span>
                </div>
                <div class="profile-menu-item" id="my-tracks">
                    <i class="fas fa-music"></i>
                    <span>My Tracks</span>
                </div>
                <div class="profile-menu-item" id="favorites">
                    <i class="fas fa-heart"></i>
                    <span>Favorites</span>
                </div>
                <div class="profile-menu-item" id="playlists">
                    <i class="fas fa-list"></i>
                    <span>Playlists</span>
                </div>
            </div>
            
            <div class="profile-divider"></div>
            
            <div class="profile-footer">
                <div class="profile-menu-item" id="logout-action" style="display: none;">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    `;
    
    // Add profile window to body
    document.body.appendChild(profileWindow);
    console.log('Profile window created and added to DOM');

    // Add event listener for the profile button
    profileBtn.addEventListener('click', (e) => {
        console.log('Profile.js - Profile button clicked!');
        e.stopPropagation();
        toggleProfileWindow(profileBtn, profileWindow);
    });

    // Close profile window when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileWindow.contains(e.target) && !profileBtn.contains(e.target)) {
            profileWindow.classList.remove('active');
        }
    });

    // Setup profile menu item event listeners
    setupProfileMenuListeners(profileWindow);

    console.log('Profile.js - Profile button initialization complete');
}

function toggleProfileWindow(button, window) {
    console.log('Toggling profile window');
    const isActive = window.classList.contains('active');
    
    if (isActive) {
        console.log('Closing profile window');
        window.classList.remove('active');
    } else {
        console.log('Opening profile window');
        
        // Get button position
        const buttonRect = button.getBoundingClientRect();
        console.log('Button position:', buttonRect);
        
        // Calculate position - align to the LEFT of the button (since button is on the left)
        let left = buttonRect.right + 10; // Position to the right of button
        let top = buttonRect.top + 10; // Move 10px lower
        
        // Check if window would go off-screen to the right
        if (left + 280 > window.innerWidth - 20) {
            left = buttonRect.left - 280 - 10; // Position to the left of button as fallback
        }
        
        // Check if window would go off-screen to the bottom
        if (top + 400 > window.innerHeight - 20) {
            top = window.innerHeight - 400 - 20;
        }
        
        // Ensure window doesn't go off-screen to the top
        if (top < 20) {
            top = 20;
        }
        
        // Apply position
        window.style.left = left + 'px';
        window.style.top = top + 'px';
        
        console.log('Final window position:', { left, top });
        console.log('Window will be at:', { left: left + 'px', top: top + 'px' });
        
        // Add active class to show the window with animation
        window.classList.add('active');
        console.log('Profile window positioned and activated');
    }
}

function setupProfileMenuListeners(profileWindow) {
    // Sign In action
    const signinAction = profileWindow.querySelector('#signin-action');
    if (signinAction) {
        signinAction.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Sign In clicked');
            // TODO: Implement sign in functionality
            updateProfileState(true); // Simulate sign in
            alert('Sign In functionality - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }

    // Sign Up action
    const signupAction = profileWindow.querySelector('#signup-action');
    if (signupAction) {
        signupAction.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Sign Up clicked');
            // TODO: Implement sign up functionality
            updateProfileState(true); // Simulate sign in after sign up
            alert('Sign Up functionality - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }

    // Profile Settings
    const profileSettings = profileWindow.querySelector('#profile-settings');
    if (profileSettings) {
        profileSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Profile Settings clicked');
            // TODO: Navigate to profile settings page
            alert('Profile Settings - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }

    // My Tracks
    const myTracks = profileWindow.querySelector('#my-tracks');
    if (myTracks) {
        myTracks.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('My Tracks clicked');
            // TODO: Navigate to my tracks page
            alert('My Tracks - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }

    // Favorites
    const favorites = profileWindow.querySelector('#favorites');
    if (favorites) {
        favorites.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Favorites clicked');
            // TODO: Navigate to favorites page
            alert('Favorites - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }

    // Playlists
    const playlists = profileWindow.querySelector('#playlists');
    if (playlists) {
        playlists.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Playlists clicked');
            // TODO: Navigate to playlists page
            alert('Playlists - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }

    // Logout action
    const logoutAction = profileWindow.querySelector('#logout-action');
    if (logoutAction) {
        logoutAction.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Logout clicked');
            // TODO: Implement logout functionality
            updateProfileState(false); // Set to guest mode
            alert('Logout functionality - يمكنك تخصيص هذه الوظيفة حسب احتياجاتك');
        });
    }
}

// Function to update profile state (signed in vs guest)
function updateProfileState(isSignedIn) {
    const profileWindow = document.querySelector('.profile-window');
    if (!profileWindow) return;

    const profileName = profileWindow.querySelector('.profile-name');
    const profileStatus = profileWindow.querySelector('.profile-status');
    const profileActions = profileWindow.querySelector('#profile-actions');
    const logoutAction = profileWindow.querySelector('#logout-action');

    if (isSignedIn) {
        // Signed in state
        profileName.textContent = 'User Name'; // TODO: Get actual user name
        profileStatus.textContent = 'Signed in';
        profileActions.style.display = 'none';
        logoutAction.style.display = 'flex';
    } else {
        // Guest state
        profileName.textContent = 'Guest User';
        profileStatus.textContent = 'Not signed in';
        profileActions.style.display = 'flex';
        logoutAction.style.display = 'none';
    }
}

// Example function to simulate sign in (for testing)
function simulateSignIn() {
    updateProfileState(true);
}

// Example function to simulate sign out (for testing)
function simulateSignOut() {
    updateProfileState(false);
} 