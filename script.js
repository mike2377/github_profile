// selecting the required HTML elements
const searchForm = document.getElementById('search-form');
const usernameInput = document.getElementById('username-input');
const profileContainer = document.getElementById('profile-container');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading');

// form submission
searchForm.addEventListener('submit', handleSearch);

// function to search a user
async function handleSearch(event) {
    // Prevents the form reloading page
    event.preventDefault(); 
    
    // etrieve what the user typed and remove space
    const username = usernameInput.value.trim();
    
    if (!username) return;

    await fetchGitHubProfile(username);
}

// function to retrieve the profile
async function fetchGitHubProfile(username) {

    showLoading();
    
    try {
        // callAPI GitHub
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error('User not found. Please check the username.');
        }
        
        const userData = await response.json();
        
        displayProfile(userData);
        
    } catch (error) {
        showError(error.message);
    }
}

// Function to generate profile card
function displayProfile(user) {

    hideLoading();
    hideError();
    
    // User does not have a bio
    const bioText = user.bio ? user.bio : 'This user has no bio yet.';

    // Create card with user, balise <a> with target="_blank" 
    const profileHTML = `
        <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="profile-card">
            <img src="${user.avatar_url}" alt="Avatar of ${user.login}" class="profile-avatar">
            <h2 class="profile-name">${user.name || user.login}</h2>
            <p class="profile-username">@${user.login}</p>
            <p class="profile-bio">${bioText}</p>
            
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-number">${user.public_repos}</span>
                    <span class="stat-label">Repos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${user.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${user.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            </div>
        </a>
    `;
    
    // Place the HTML into the empty profile container
    profileContainer.innerHTML = profileHTML;
    
    // clear the search field
    usernameInput.value = '';
}

// --- Utility functions ---

function showLoading() {
    profileContainer.innerHTML = '';
    errorMessage.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    profileContainer.innerHTML = '';
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}