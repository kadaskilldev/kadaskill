// This file is no longer needed - functionality moved to script.js
// You can delete this file
// Load shared navigation
function loadNavigation() {
    const nav = `
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <div class="logo-container">
                        <div class="logo-mark" aria-hidden="true">
                            <svg class="vector" width="51" height="40" viewBox="0 0 51 40">
                                <image href="images/loading/Vector-2.svg" width="51" height="40"></image>
                            </svg>
                            <svg class="img" width="30" height="30" viewBox="0 0 44 44">
                                <image href="images/loading/Vector.svg" width="44" height="44"></image>
                            </svg>
                            <svg class="vector-2" width="33" height="32" viewBox="0 0 33 32">
                                <image href="images/loading/Vector-1.svg" width="33" height="32"></image>
                            </svg>
                        </div>
                    </div>
                    <span class="brand-text">KadaSkill</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/home.html">Home</a></li>
                <li><a href="/learn.html">Learn</a></li>
                <li><a href="/practice.html">Practice</a></li>
                <li><a href="/certification.html">Certification</a></li>
                <li><a href="/about.html">About Us</a></li>
            </ul>
            <div class="nav-right">
                <div class="search-container">
                    <input type="text" placeholder="Search" class="search-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="user-profile">
                    <img src="images/profile/default-avatar.svg" alt="User" class="user-avatar">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
        </nav>
    </header>
    `;
    
    document.getElementById('navigation').innerHTML = nav;
    
    // Set active navigation based on current page
    setActiveNavigation();
}

// Load shared footer
function loadFooter() {
    const footer = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <!-- Brand Section -->
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="images/footer/footer-logo.svg" alt="KadaSkill Logo">
                        <span>KadaSkill</span>
                    </div>
                    <p class="footer-tagline">By upskilling together, we grow forever, unlocking limitless opportunities as a community.</p>
                </div>

                <!-- Contact Us Section -->
                <div class="footer-section footer-contact-section">
                    <h4>Contact Us</h4>
                    <div class="footer-contact">
                        <a href="mailto:kadaskill@gmail.com" class="contact-item">
                            <img src="images/footer/email-icon.svg" alt="Email">
                            <span>kadaskill@gmail.com</span>
                        </a>
                        <a href="https://facebook.com/kadaskill" target="_blank" class="contact-item">
                            <img src="images/footer/facebook-icon.svg" alt="Facebook">
                            <span>kadaskill</span>
                        </a>
                        <a href="https://instagram.com/kadaskill" target="_blank" class="contact-item">
                            <img src="images/footer/instagram-icon.svg" alt="Instagram">
                            <span>@kadaskill</span>
                        </a>
                        <a href="https://linkedin.com/company/kadaskill" target="_blank" class="contact-item">
                            <img src="images/footer/linkedin-icon.svg" alt="LinkedIn">
                            <span>KadaSkill</span>
                        </a>
                    </div>
                </div>

                <!-- General Section -->
                <div class="footer-section footer-general">
                    <h4>General</h4>
                    <div class="footer-links-grid">
                        <ul class="footer-links">
                            <li><a href="/home.html">Home</a></li>
                            <li><a href="/learn.html">Learn</a></li>
                            <li><a href="/practice.html">Practice</a></li>
                            <li><a href="/certification.html">Certification</a></li>
                        </ul>
                        <ul class="footer-links">
                            <li><a href="/profile.html">Profile</a></li>
                        </ul>
                    </div>
                </div>

                <!-- About Us Section -->
                <div class="footer-section footer-about">
                    <h4>About Us</h4>
                    <ul class="footer-links">
                        <li><a href="/about.html#mission">Mission & Vision</a></li>
                        <li><a href="/about.html#team">Meet the Team</a></li>
                        <li><a href="/about.html#contact">Contact Us</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>Copyright  © 2025 by KadaSkill, All rights reserved</p>
            </div>
        </div>
    </footer>
    `;
    
    document.getElementById('footer').innerHTML = footer;
}

// Set active navigation based on current page
function setActiveNavigation() {
    const pathname = window.location.pathname;
    const currentPage = (pathname === '/' || pathname === '') ? 'home.html' : pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
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

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
    loadFooter();
});
