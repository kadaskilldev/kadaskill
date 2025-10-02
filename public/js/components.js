// This file is no longer needed - functionality moved to script.js
// You can delete this file
// Load shared navigation
function loadNavigation() {
    const nav = `
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <div class="logo-container">
                    <div class="logo-icon"></div>
                </div>
                <span class="brand-text">KadaSkill</span>
            </div>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="learn.html">Learn</a></li>
                <li><a href="../practice.html">Practice</a></li>
                <li><a href="certification.html">Certification</a></li>
                <li><a href="../about.html">About Us</a></li>
            </ul>
            <div class="nav-right">
                <div class="search-container">
                    <input type="text" placeholder="Search" class="search-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="user-profile">
                    <img src="images/user-avatar.jpg" alt="User" class="user-avatar">
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
        <div class="container">
            <div class="footer-content">
                <div class="footer-section brand">
                    <div class="footer-logo">
                        <div class="logo-container">
                            <div class="logo-icon"></div>
                        </div>
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
                    </div>
                </div>
                <div class="footer-section">
                    <h4>General</h4>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="#">Profile</a></li>
                        <li><a href="learn.html">Learn</a></li>
                        <li><a href="../practice.html">Practice</a></li>
                        <li><a href="certification.html">Certification</a></li>
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
        </div>
    </footer>
    `;
    
    document.getElementById('footer').innerHTML = footer;
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href.includes(currentPage) || 
            (currentPage === 'certification.html' && href.includes('certification')) ||
            (currentPage === 'learn.html' && href.includes('learn'))) {
            link.classList.add('active');
        }
    });
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
    loadFooter();
});
