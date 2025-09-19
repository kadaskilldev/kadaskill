document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    // Initialize core interactions
    initializeFormHandling();
    initializePasswordToggle();
    initializeLoginToggle();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle Get Started button
    const getStartedButton = document.querySelector('.cta-button[href="learn.html"]');
    if (getStartedButton) {
        getStartedButton.addEventListener('click', handleCTAClick);
    }
});

// Form Handling
function initializeFormHandling() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmit);
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', handleCTAClick);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('#email').value;
    const password = e.target.querySelector('#password').value;

    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    // Simulate API call
    showNotification('Creating your account...', 'info');

    setTimeout(() => {
        showNotification('Welcome to KadaSkill! Please check your email to verify your account.', 'success');
        e.target.reset();
    }, 2000);
}

function handleSocialLogin(e) {
    const button = e.target.closest('.social-btn');
    let platform = '';

    if (button.classList.contains('microsoft')) platform = 'Microsoft';
    else if (button.classList.contains('google')) platform = 'Google';
    else if (button.classList.contains('linkedin')) platform = 'LinkedIn';
    else if (button.classList.contains('facebook')) platform = 'Facebook';

    showNotification(`Redirecting to ${platform} login...`, 'info');

    // In a real app, this would redirect to OAuth provider
    setTimeout(() => {
        showNotification(`${platform} login integration would be implemented here`, 'info');
    }, 1500);
}

// Password toggle functionality
function initializePasswordToggle() {
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.querySelector('#password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

// Login/Register toggle
function initializeLoginToggle() {
    const loginToggle = document.querySelector('.login-toggle');
    const formSubmit = document.querySelector('.form-submit');

    if (loginToggle && formSubmit) {
        let isLogin = false;

        loginToggle.addEventListener('click', function(e) {
            e.preventDefault();
            isLogin = !isLogin;

            if (isLogin) {
                formSubmit.textContent = 'Log In';
                this.parentElement.innerHTML = 'Don\'t have an account? <a href="#" class="login-toggle">Sign up</a>';
            } else {
                formSubmit.textContent = 'Sign Up for Free';
                this.parentElement.innerHTML = 'Already have an account? <a href="#" class="login-toggle">Log in</a>';
            }

            // Re-attach event listener to new element
            const newToggle = document.querySelector('.login-toggle');
            if (newToggle) {
                newToggle.addEventListener('click', arguments.callee);
            }
        });
    }
}

function handleCTAClick(e) {
    e.preventDefault();
    const targetUrl = this.getAttribute('href');
    if (targetUrl === 'learn.html') {
        // Simulate navigation to learn.html (in a real app, use window.location.href)
        showNotification('Navigating to Learn page...', 'info');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 1000);
    } else {
        const heroForm = document.querySelector('.hero-form');
        if (heroForm) {
            heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus on email input
            setTimeout(() => {
                const emailInput = heroForm.querySelector('input[type="email"]');
                if (emailInput) emailInput.focus();
            }, 500);
        }
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}