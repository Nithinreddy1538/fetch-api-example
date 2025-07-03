class UserDataFetcher {
    constructor() {
        this.apiUrl = 'https://jsonplaceholder.typicode.com/users';
        this.userContainer = document.getElementById('userContainer');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.reloadBtn = document.getElementById('reloadBtn');
        this.retryBtn = document.getElementById('retryBtn');
        
        this.initEventListeners();
        this.fetchUsers();
    }

    initEventListeners() {
        this.reloadBtn.addEventListener('click', () => this.handleReload());
        this.retryBtn.addEventListener('click', () => this.handleRetry());
    }

    async fetchUsers() {
        try {
            this.showLoading();
            
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const users = await response.json();
            this.displayUsers(users);
            
        } catch (error) {
            this.handleError(error);
        }
    }

    displayUsers(users) {
        this.hideLoading();
        this.hideError();
        
        this.userContainer.innerHTML = '';
        
        users.forEach((user, index) => {
            const userCard = this.createUserCard(user);
            userCard.style.animationDelay = `${index * 0.1}s`;
            this.userContainer.appendChild(userCard);
        });
    }

    createUserCard(user) {
        const card = document.createElement('div');
        card.className = 'user-card fade-in';
        
        const initials = this.getInitials(user.name);
        const address = this.formatAddress(user.address);
        
        card.innerHTML = `
            <div class="user-header">
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <div class="username">@${user.username}</div>
                </div>
            </div>
            
            <div class="user-details">
                <div class="detail-item">
                    <div class="detail-label email-icon">Email</div>
                    <div class="detail-value">${user.email}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label phone-icon">Phone</div>
                    <div class="detail-value">${user.phone}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label address-icon">Address</div>
                    <div class="detail-value">${address}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label website-icon">Website</div>
                    <div class="detail-value">
                        <a href="http://${user.website}" target="_blank" style="color: #667eea; text-decoration: none;">
                            ${user.website}
                        </a>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label company-icon">Company</div>
                    <div class="detail-value">
                        <strong>${user.company.name}</strong><br>
                        <em>"${user.company.catchPhrase}"</em>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    formatAddress(address) {
        return `${address.street}, ${address.suite}<br>
                ${address.city}, ${address.zipcode}`;
    }

    handleError(error) {
        this.hideLoading();
        this.showError(error);
        
        console.error('Error fetching users:', error);
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.userContainer.innerHTML = '';
        this.hideError();
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    showError(error) {
        this.errorMessage.classList.remove('hidden');
        
        let errorMsg = 'Unable to fetch user data. ';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMsg += 'Please check your internet connection and try again.';
        } else if (error.message.includes('HTTP error')) {
            errorMsg += `Server responded with error: ${error.message}`;
        } else {
            errorMsg += error.message;
        }
        
        this.errorText.textContent = errorMsg;
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    handleReload() {
        this.reloadBtn.disabled = true;
        this.reloadBtn.innerHTML = '<span class="reload-icon">↻</span> Loading...';
        
        setTimeout(() => {
            this.fetchUsers();
            this.reloadBtn.disabled = false;
            this.reloadBtn.innerHTML = '<span class="reload-icon">↻</span> Reload Data';
        }, 500);
    }

    handleRetry() {
        this.fetchUsers();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserDataFetcher();
});  