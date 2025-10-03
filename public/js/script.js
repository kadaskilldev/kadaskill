document.addEventListener('DOMContentLoaded', function() {
    // Load shared components first
    loadSharedComponents();
    
    // Then initialize page functionality
    setTimeout(() => {
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
        
        // Initialize page-specific functionality
        initializeCertificationPage();

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
    }, 100);
});

// Shared Components Functions
function loadSharedComponents() {
    loadNavigation();
    loadFooter();
}

function loadNavigation() {
    const navigationElement = document.getElementById('navigation');
    if (!navigationElement) return;
    
    const nav = `
    <header class="header">
        <div class="container">
            <div class="logo">
                <img src="images/logo.png" alt="KadaSkill" class="logo-img" onerror="this.style.display='none';">
                <span>KadaSkill</span>
            </div>
            <nav class="nav">
                <ul class="nav-links">
                    <li><a href="home.html" class="nav-btn">Home</a></li>
                    <li><a href="learn.html" class="nav-btn">Learn</a></li>
                    <li><a href="practice.html" class="nav-btn">Practice</a></li>
                    <li><a href="certification.html" class="nav-btn">Certification</a></li>
                    <li><a href="about.html" class="nav-btn">About Us</a></li>
                </ul>
            </nav>
            <div class="header-right">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search...">
                </div>
                <div class="user-profile">
                    <div class="user-avatar">E</div>
                </div>
            </div>
        </div>
    </header>
    `;
    
    navigationElement.innerHTML = nav;
    setActiveNavigation();
}

function loadFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) return;
    
    const footer = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section brand">
                    <div class="footer-logo">
                        <img src="images/logo.png" alt="KadaSkill" onerror="this.style.display='none';">
                        <span>KadaSkill</span>
                    </div>
                    <p>By upskilling together, we grow forever, unlocking limitless opportunities as a community.</p>
                </div>
                <div class="footer-section">
                    <h4>Contact Us</h4>
                    <div class="footer-contact">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>kadaskill@gmail.com</span>
                        </div>
                        <div class="contact-item">
                            <i class="fab fa-facebook"></i>
                            <span>kadaskill</span>
                        </div>
                        <div class="contact-item">
                            <i class="fab fa-instagram"></i>
                            <span>@kadaskill</span>
                        </div>
                        <div class="contact-item">
                            <i class="fab fa-linkedin"></i>
                            <span>KadaSkill</span>
                        </div>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>General</h4>
                    <ul>
                        <li><a href="/home.html">Home</a></li>
                        <li><a href="/learn.html">Learn</a></li>
                        <li><a href="/practice.html">Practice</a></li>
                        <li><a href="/certification.html">Certification</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>About Us</h4>
                    <ul>
                        <li><a href="#">Mission & Vision</a></li>
                        <li><a href="#">Meet the Team</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>Copyright © 2025 by KadaSkill. All rights reserved</p>
            </div>
        </div>
    </footer>
    `;
    
    footerElement.innerHTML = footer;
}

function setActiveNavigation() {
    // Normalize current page: if we're at root ('/') treat it as home
    const pathname = window.location.pathname;
    const currentPage = (pathname === '/' || pathname === '') ? 'home.html' : pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-btn');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href.includes(currentPage) ||
            (currentPage === 'certification.html' && href.includes('certification')) ||
            (currentPage === 'learn.html' && href.includes('learn')) ||
            (currentPage === 'home.html' && href.includes('home'))) {
            link.classList.add('active');
        }
    });
}

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
        showNotification('Navigating to Learn page...', 'info');
        setTimeout(() => {
            // Direct navigation to learn.html in public folder
            window.location.href = 'learn.html';
        }, 1000);
    } else if (targetUrl === 'certification.html' || targetUrl === 'public/certification.html') {
        showNotification('Navigating to Certification page...', 'info');
        setTimeout(() => {
            window.location.href = 'certification.html';
        }, 1000);
    } else {
        const heroForm = document.querySelector('.hero-form');
        if (heroForm) {
            heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                const emailInput = heroForm.querySelector('input[type="email"]');
                if (emailInput) emailInput.focus();
            }, 500);
        }
    }
}

// Certification Page Functionality
function initializeCertificationPage() {
    // Only run if we're on the certification page
    if (!document.querySelector('.certifications-grid-section')) return;
    
    initializeFiltering();
    initializeSearch();
    initializeCertificationCards();
    initializeContinueCard();
    updateCertificationCount();
}

function initializeFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const certificationCards = document.querySelectorAll('.certification-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            filterCertifications(filter, certificationCards);
            updateCertificationCount();
        });
    });
}

function filterCertifications(filter, cards) {
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category.includes(filter);
        
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

function initializeSearch() {
    // Handle both search inputs - header search and grid search
    const headerSearchInput = document.querySelector('.search-input');
    const gridSearchInput = document.querySelector('.grid-search-input');
    const certificationCards = document.querySelectorAll('.certification-card');

    function handleSearch(searchInput) {
        if (searchInput && certificationCards.length > 0) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                certificationCards.forEach(card => {
                    const title = card.querySelector('.card-title').textContent.toLowerCase();
                    const description = card.querySelector('.card-description').textContent.toLowerCase();
                    const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                updateCertificationCount();
            });
        }
    }

    handleSearch(headerSearchInput);
    handleSearch(gridSearchInput);
}

function initializeCertificationCards() {
    const certificationCards = document.querySelectorAll('.certification-card');
    
    certificationCards.forEach(card => {
        const button = card.querySelector('.card-button');
        
        if (button) {
            button.addEventListener('click', function() {
                const title = card.querySelector('.card-title').textContent;
                const buttonText = this.textContent.trim();
                
                if (buttonText === 'Resume') {
                    showNotification(`Resuming ${title} course...`, 'info');
                } else {
                    showNotification(`Starting ${title} certification...`, 'info');
                }
            });
        }
    });
}

function initializeContinueCard() {
    const continueBtn = document.querySelector('.continue-btn');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            showNotification('Continuing Data Analyst Track...', 'info');
            // In a real app, this would navigate to the course
        });
    }
}

function updateCertificationCount() {
    const visibleCards = document.querySelectorAll('.certification-card[style*="display: block"], .certification-card:not([style*="display: none"])');
    const countElement = document.getElementById('cert-count');
    
    if (countElement) {
        countElement.textContent = visibleCards.length;
    }
}

// Backend-ready functions for future API integration
async function fetchUserData() {
    try {
        // When backend is ready, replace with actual API call
        // const response = await fetch('/api/user/profile');
        // return await response.json();
        
        // Mock data for now
        return {
            id: 1,
            username: 'eijay',
            level: 143,
            xp: 19319,
            badges: 32,
            streak: 4,
            avatar: 'images/user-avatar.jpg'
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

async function fetchCertifications() {
    try {
        // When backend is ready, replace with actual API call
        // const response = await fetch('/api/certifications');
        // return await response.json();
        
        // Mock data structure that matches expected backend response
        return {
            certifications: [
                {
                    id: 1,
                    title: 'AWS Certified Solutions Architect – Associate',
                    description: 'Validates your ability to design and deploy scalable, highly available systems on AWS...',
                    provider: 'AWS',
                    category: 'cloud',
                    status: 'available',
                    duration: 35,
                    level: 'intermediate',
                    image: 'images/certifications/aws-solutions-architect.png',
                    badge_image: 'images/badges/aws-badge.png'
                },
                {
                    id: 2,
                    title: 'Certified Information Systems Security Professional (CISSP)',
                    description: 'Recognized globally, this ISC² certification demonstrates mastery of security...',
                    provider: 'ISC2',
                    category: 'cybersecurity',
                    status: 'completed',
                    duration: 50,
                    level: 'advanced',
                    image: 'images/certifications/cissp.png',
                    badge_image: 'images/badges/cissp-badge.png'
                }
            ]
        };
    } catch (error) {
        console.error('Error fetching certifications:', error);
        return { certifications: [] };
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