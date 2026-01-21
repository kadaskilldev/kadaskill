console.log('🚀 KadaSkill script.js loaded - Version 2025-01-22');

const SUPABASE_URL = 'https://kbpbubsnadnhebgdggdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticGJ1YnNuYWRuaGViZ2RnZ2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjA4MTksImV4cCI6MjA3MzU5NjgxOX0.4O8ZLeZ2iR786MZ8JS_55nzhn-5WxqabMtDQuAoZkAA';

// Initialize Supabase client (Singleton Pattern for Performance)
let supabaseClient;

// Performance Optimization: Only create client once
function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabaseClient;
    } else {
        console.error("Supabase client library not found on the window object. Did you include the CDN link in index.html?");
        // Mock for environments without the library loaded, to prevent immediate fatal errors in auth functions
        supabaseClient = {
            auth: {
                signUp: async () => ({ data: { user: { id: 'mock-id' } }, error: { message: 'Supabase Mock' } }),
                signInWithPassword: async () => ({ data: { user: { id: 'mock-id' } }, error: { message: 'Supabase Mock' } }),
                signInWithOAuth: async () => ({ error: { message: 'Supabase Mock: Library not loaded.' } }),
            }
        };
    }
    return supabaseClient;
}

// DON'T use 'const supabase' - it conflicts with the CDN!
// Initialize the Supabase client by calling the function
supabaseClient = getSupabaseClient();
console.log('✓ Supabase client initialized:', supabaseClient ? 'Success' : 'Failed');

// Create alias for backward compatibility
window.supabase = supabaseClient;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Initializing...');

    // Load shared components first
    loadSharedComponents();

    // Then initialize page functionality
    setTimeout(() => {
        console.log('Initializing form handling...');

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

        console.log('Initialization complete');

        // Initialize page-specific functionality
        initializeCertificationPage();
        initializeCertificationDetailPage();
        initializeCalendar();
        initializeLearnPage();
        initializePracticePage();
        initializeProfileCoursesNavigation();
        initializeProfileRobotAnimation();

        const pathname = window.location.pathname;
        let hasStoredProfile = false;
        let hasStoredUser = false;
        try {
            hasStoredProfile = !!sessionStorage.getItem('userProfile');
            hasStoredUser = !!sessionStorage.getItem('authUser');
        } catch (storageError) {
            console.warn('Unable to access sessionStorage for user data:', storageError);
        }

        if (hasStoredProfile && hasStoredUser) {
            console.log(`Loading user data for ${pathname}...`);
            loadDashboardData();
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') {
                    return;
                }
                e.preventDefault();
                const target = document.querySelector(href);
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

        // Ensure header scroll background animation is applied on all pages
        initializeHeaderScrollAnimation();
    }, 100);
});

// Shared Components Functions
function loadSharedComponents() {
    loadNavigation();
    loadFooter();
}

function isLoggedInContentPage(pageName) {
    if (!pageName) return false;
    const normalized = pageName.toLowerCase();
    const staticPages = new Set([
        'home.html',
        'profile.html',
        'edit-profile.html',
        'about.html',
        'about-us.html'
    ]);

    if (staticPages.has(normalized)) {
        return true;
    }

    return (
        normalized.startsWith('learn') ||
        normalized.startsWith('practice') ||
        normalized.startsWith('certification')
    );
}

function initializeUserMenu(scope = document) {
    const avatarToggle = scope.querySelector('.user-profile__toggle');
    const avatarBadge = scope.querySelector('.user-avatar');
    const menu = scope.querySelector('.user-menu');
    const toggleIcon = avatarToggle?.querySelector('.user-profile__icon');
    if (!avatarToggle || !menu) return;

    const closeMenu = () => {
        avatarToggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        menu.classList.remove('is-open');
        avatarToggle.classList.remove('is-open');
        toggleIcon?.classList.remove('is-rotated');
        document.removeEventListener('click', onOutsideClick);
        document.removeEventListener('keydown', onEscape, true);
    };

    const openMenu = () => {
        avatarToggle.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
        requestAnimationFrame(() => menu.classList.add('is-open'));
        avatarToggle.classList.add('is-open');
        toggleIcon?.classList.add('is-rotated');
        setTimeout(() => menu.querySelector('a')?.focus(), 0);
        document.addEventListener('click', onOutsideClick);
        document.addEventListener('keydown', onEscape, true);
    };

    const onOutsideClick = (event) => {
        const isAvatar = avatarBadge?.contains(event.target);
        const isToggle = avatarToggle.contains(event.target);
        if (!menu.contains(event.target) && !isToggle && !isAvatar) {
            closeMenu();
        }
    };

    const onEscape = (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            avatarToggle.focus();
        }
    };

    const handleToggleClick = (event) => {
        event.stopPropagation();
        const isExpanded = avatarToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    avatarToggle.addEventListener('click', handleToggleClick);
    avatarBadge?.addEventListener('click', handleToggleClick);

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('keydown', (event) => {
            if (event.key === 'Tab' && !event.shiftKey && event.target === menu.lastElementChild) {
                closeMenu();
            }
        });
    });
    menu.querySelectorAll('.user-menu__item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            menu.querySelectorAll('.user-menu__item').forEach(el => el.classList.remove('is-active'));
            item.classList.add('is-active');
        });
        item.addEventListener('mouseleave', () => item.classList.remove('is-active'));
    });

    const signOutLink = menu.querySelector('.user-menu__item--danger');
    if (signOutLink && !signOutLink.dataset.signOutBound) {
        signOutLink.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!supabase || !supabase.auth || typeof supabase.auth.signOut !== 'function') {
                showNotification('Sign out is unavailable right now. Please try again later.', 'error');
                return;
            }

            try {
                showNotification('Signing you out...', 'info');
                await supabase.auth.signOut();
                sessionStorage.removeItem('userProfile');
                sessionStorage.removeItem('authUser');
                closeMenu();
                window.location.href = 'index.html';
            } catch (signOutError) {
                console.error('Sign-out failed:', signOutError);
                showNotification('Failed to sign out. Please try again.', 'error');
            }
        });
        signOutLink.dataset.signOutBound = 'true';
    }
}

function loadNavigation() {
    const navigationElement = document.getElementById('navigation');
    if (!navigationElement) return;

    const pathname = window.location.pathname;
    const currentPage = (pathname === '/' || pathname === '') ? 'home.html' : pathname.split('/').pop();

    const userProfileMarkup = `
                <div class="user-profile">
                    <div class="user-avatar" aria-hidden="true">E</div>
                    <button class="user-profile__toggle" aria-label="Open profile menu" aria-haspopup="true" aria-expanded="false">
                        <img src="images/profile/Vector.svg" alt="" class="user-profile__icon">
                    </button>
                    <div class="user-menu" role="menu" hidden>
                        <a href="profile.html" class="user-menu__item" role="menuitem">
                            <span class="user-menu__icon-wrap">
                                <img src="images/profile/icon-profile.svg" alt="" class="user-menu__icon" />
                            </span>
                            <span class="user-menu__label">Profile</span>
                        </a>
                        <a href="edit_profile.html" class="user-menu__item" role="menuitem">
                            <span class="user-menu__icon-wrap">
                                <img src="images/profile/icon-settings.svg" alt="" class="user-menu__icon" />
                            </span>
                            <span class="user-menu__label">Settings</span>
                        </a>
                        <a href="#" class="user-menu__item user-menu__item--danger" role="menuitem">
                            <span class="user-menu__icon-wrap">
                                <img src="images/profile/icon-signout.svg" alt="" class="user-menu__icon" />
                            </span>
                            <span class="user-menu__label">Sign out</span>
                        </a>
                    </div>
                </div>
        `;

    const nav = `
    <header class="header header--no-bg">
        <div class="container">
            <div class="logo">
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
                ${userProfileMarkup}
            </div>
        </div>
    </header>
    `;

    navigationElement.innerHTML = nav;

    const logoElement = navigationElement.querySelector('.logo');
    if (logoElement && isLoggedInContentPage(currentPage)) {
        logoElement.classList.add('logo--home-link');
        logoElement.setAttribute('role', 'link');
        logoElement.setAttribute('tabindex', '0');

        const navigateHome = () => {
            window.location.href = 'home.html';
        };

        logoElement.addEventListener('click', (event) => {
            event.preventDefault();
            navigateHome();
        });

        logoElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigateHome();
            }
        });
    }

    const headerElement = navigationElement.querySelector('.header');
    if (headerElement) {
        const updateHeaderOffset = () => {
            const headerHeight = headerElement.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        };

        const applyHeaderOffset = () => {
            document.body.classList.add('has-fixed-header');
            updateHeaderOffset();
        };

        applyHeaderOffset();
        window.addEventListener('resize', updateHeaderOffset, { passive: true });
        window.addEventListener('load', updateHeaderOffset, { once: true });
    }

    initializeUserMenu(navigationElement);
    setActiveNavigation();
    if (headerElement) {
        initializeHeaderScrollAnimation();
    }
}

function loadFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) return;

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

        if (currentPage === 'profile.html') {
            // Do not highlight any nav link when on profile page
            return;
        }

        if (href.includes(currentPage) ||
            (currentPage === 'certification.html' && href.includes('certification')) ||
            (currentPage === 'learn.html' && href.includes('learn')) ||
            (currentPage === 'learning.html' && href.includes('learn')) ||
            (currentPage === 'home.html' && href.includes('home')) ||
            (currentPage === 'practice.html' && href.includes('practice'))) {
            link.classList.add('active');
        }
    });
}

// Form Handling
function initializeFormHandling() {
    console.log('initializeFormHandling called');

    const loginForm = document.querySelector('.login-form');
    console.log('Login form found:', loginForm);
    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmit);
        console.log('Submit handler attached to login form');
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    console.log('Social buttons found:', socialButtons.length);
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    console.log('CTA buttons found:', ctaButtons.length);
    ctaButtons.forEach(button => {
        button.addEventListener('click', handleCTAClick);
    });

    console.log('Form handling initialized successfully');
}

//Supabase integrated form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    const loginForm = e.target;
    const email = loginForm.querySelector('#email').value;
    const password = loginForm.querySelector('#password').value;
    // Get state from the data-mode attribute set by initializeLoginToggle
    const isLogin = loginForm.getAttribute('data-mode') === 'login';

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

    showNotification(isLogin ? 'Logging in...' : 'Creating your account...', 'info');

    let response;

    if (isLogin) {
        // Supabase Login
        response = await supabase.auth.signInWithPassword({
            email,
            password,
        });
    } else {
        // Supabase Sign Up
        response = await supabase.auth.signUp({
            email,
            password,
            // Example for metadata: options: { data: { full_name: 'Eijay' } }
        });
    }

    const { data, error } = response;

    if (error) {
        console.error('Auth Error:', error);

        if (!isLogin) {
            // Supabase returns a recognizable message when the email has an existing account
            const message = (error.message || '').toLowerCase();
            const alreadyRegistered = message.includes('already registered') || message.includes('already been registered') || message.includes('already exists');

            if (alreadyRegistered) {
                showNotification('That email is already registered. Please log in instead.', 'error');

                if (loginForm.getAttribute('data-mode') !== 'login') {
                    const loginToggle = document.querySelector('.login-link .login-toggle');
                    if (loginToggle) {
                        loginToggle.click();
                    }
                }
                return;
            }
        }

        showNotification(`Authentication failed: ${error.message}`, 'error');
        return;
    }

    const user = data?.user ?? null;
    const session = data?.session ?? null;

    if (!isLogin) {
        // Supabase returns an empty identities array when the email already exists (even if unconfirmed)
        const duplicatesSuspected = Array.isArray(user?.identities) && user.identities.length === 0;
        if (duplicatesSuspected) {
            showNotification('That email is already registered. Please log in instead.', 'error');

            if (loginForm.getAttribute('data-mode') !== 'login') {
                const loginToggle = document.querySelector('.login-link .login-toggle');
                if (loginToggle) {
                    loginToggle.click();
                }
            }
            return;
        }
    }

    if (!user && !isLogin) {
        // Successful sign-up but user needs to confirm email (if Email Confirmation is ON)
        showNotification('Welcome to KadaSkill! Please check your email to verify your account and complete your sign-up.', 'success');
        loginForm.reset();
        return;
    }

    if (user) {
        // If sign up requires verification
        if (!session) {
            showNotification('Welcome! Please check your email to verify your account.', 'success');
            return;
        }
        // On successful login or signup (with auto-confirm)
        // Supabase automatically handles the session in localStorage.
        // We just need to navigate to the loading page.
        window.location.href = 'loading.html';
    } else {
        showNotification('An unexpected authentication response was received.', 'error');
    }
}


// Supabase integrated social login
async function handleSocialLogin(e) {
    const button = e.target.closest('.social-btn');
    let platform = '';
    let provider = '';

    if (button.classList.contains('microsoft')) { platform = 'Microsoft'; provider = 'microsoft'; }
    else if (button.classList.contains('google')) { platform = 'Google'; provider = 'google'; }
    else if (button.classList.contains('linkedin')) { platform = 'LinkedIn'; provider = 'linkedin'; }
    else if (button.classList.contains('facebook')) { platform = 'Facebook'; provider = 'facebook'; }

    // Only allow enabled providers (Google and LinkedIn)
    if (!provider || (provider !== 'google' && provider !== 'linkedin')) {
        showNotification(`${platform} login is not currently supported or enabled.`, 'info');
        return;
    }

    showNotification(`Redirecting to ${platform} login...`, 'info');

    // Dynamically determine redirect URL based on current environment
    // Works for localhost, GitHub Codespaces, and any other deployment
    const redirectUrl = `${window.location.origin}/loading.html`;
    console.log('OAuth redirect URL:', redirectUrl);

    // Supabase OAuth Sign In
    const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            // Redirect to the dashboard after successful login
            redirectTo: redirectUrl,
        },
    });

    if (error) {
        console.error('OAuth Error:', error);
        showNotification(`OAuth failed: ${error.message}`, 'error');
    }
    // A successful OAuth call causes a page redirect, so no success notification here.
}

// Password toggle functionality
function initializePasswordToggle() {
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.querySelector('#password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

// Login/Register toggle to manage form state with 'data-mode'
function initializeLoginToggle() {
    const loginToggle = document.querySelector('.login-toggle');
    const formSubmit = document.querySelector('.form-submit');
    const loginForm = document.querySelector('.login-form');

    if (!loginForm) return;

    // Initialize state on the form element if not present
    if (!loginForm.hasAttribute('data-mode')) {
        loginForm.setAttribute('data-mode', 'signup');
    }

    // function that handles the toggle logic
    const toggleHandler = function (e) {
        e.preventDefault();

        let currentMode = loginForm.getAttribute('data-mode');
        let newMode = currentMode === 'signup' ? 'login' : 'signup';

        loginForm.setAttribute('data-mode', newMode);

        // Get the terms paragraph
        const termsParagraph = document.querySelector('.terms');

        if (newMode === 'login') {
            formSubmit.innerHTML = '<span>Log In</span>';
            // Preserve the inline style from the original HTML
            this.parentElement.innerHTML = '<span>Don\'t have an account? </span><a href="#" class="login-toggle">Sign up</a>';
            // Update terms text for login
            if (termsParagraph) {
                termsParagraph.innerHTML = '<span>By logging in, I agree to KadaSkill </span><a href="#">Terms</a>';
            }
        } else {
            formSubmit.innerHTML = '<span>Sign Up for Free</span>';
            //  Preserve the inline style from the original HTML
            this.parentElement.innerHTML = '<span>Already have an account? </span><a href="#" class="login-toggle">Log in</a>';
            // Update terms text for signup
            if (termsParagraph) {
                termsParagraph.innerHTML = '<span>By signing up, I agree to KadaSkill </span><a href="#">Terms</a>';
            }
        }

        // Re-attach the same listener function to the new anchor tag
        const newToggle = document.querySelector('.login-link .login-toggle');
        if (newToggle) {
            // Re-attach the handler to the newly created element
            newToggle.addEventListener('click', toggleHandler);
        }
    };

    if (loginToggle) {
        // Add the listener to the initial element
        loginToggle.addEventListener('click', toggleHandler);
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
    } else if (targetUrl === 'practice.html' || targetUrl === 'public/practice.html') {
        showNotification('Navigating to Practice page...', 'info');
        setTimeout(() => {
            window.location.href = 'practice.html';
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
    // DISABLED - Certification page now uses js/certification.js for database-driven certifications
    // The old hardcoded certification logic has been replaced with dynamic loading from Supabase
    return;
}

function initializeFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const certificationCards = document.querySelectorAll('.certification-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
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
            searchInput.addEventListener('input', function () {
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

    // Map of certification titles to detail page IDs
    const certIdMap = {
        'Data Scientist': 'data-scientist',
        'Security Analyst (SOC)': 'security-analyst',
        'Cloud Security Engineer': 'cloud-security-engineer',
        'Cybersecurity Analyst': 'cybersecurity-analyst',
        'Cloud Solutions Architect': 'cloud-solutions-architect',
        'AI/ML Engineer': 'ai-ml-engineer',
        'Cloud DevOps Engineer': 'cloud-devops-engineer',
        'Data Analyst': 'data-analyst',
        'Ethical Hacker': 'ethical-hacker'
    };

    certificationCards.forEach(card => {
        const button = card.querySelector('.card-button');

        if (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const title = card.querySelector('.card-title').textContent;
                const buttonText = this.textContent.trim();

                // Get the certification ID from the map
                const certId = certIdMap[title];

                if (certId) {
                    // Redirect to certification detail page with ID
                    showNotification(`Loading ${title}...`, 'info');
                    setTimeout(() => {
                        window.location.href = `certification-detail.html?id=${certId}`;
                    }, 500);
                } else {
                    // Fallback for certifications without detail pages yet
                    if (buttonText === 'Resume') {
                        showNotification(`Resuming ${title} course...`, 'info');
                    } else {
                        showNotification(`Starting ${title} certification...`, 'info');
                    }
                }
            });
        }
    });
}

function initializeContinueCard() {
    const continueBtn = document.querySelector('.continue-btn');

    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
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

/* Calendar: dynamic month/year rendering, preserves existing row classes/structure when possible */
function initializeCalendar() {
    const monthEl = document.querySelector('.text-wrapper-11');
    const yearEl = document.querySelector('.text-wrapper-22');
    let gridEl = document.querySelector('.group-9[role="grid"]');
    let nextBtn = document.querySelector('.vector-2[aria-label="Next month"]');
    let prevBtn = document.querySelector('.vector-3[aria-label="Previous month"]');
    if (!monthEl || !yearEl || !gridEl) return;

    gridEl.classList.add('dynamic-calendar');

    const today = new Date();
    let state = new Date(today.getFullYear(), today.getMonth(), 1);

    function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
    function weekdayLetter(i) { return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]; }

    const activeFlashTimers = new WeakMap();

    function flashNav(button) {
        if (!button) return;
        if (activeFlashTimers.has(button)) {
            clearTimeout(activeFlashTimers.get(button));
        }
        button.classList.add('is-active');
        const timeoutId = setTimeout(() => {
            button.classList.remove('is-active');
            activeFlashTimers.delete(button);
        }, 260);
        activeFlashTimers.set(button, timeoutId);
    }

    function render(date) {
        const y = date.getFullYear(), m = date.getMonth();
        monthEl.textContent = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
        yearEl.textContent = String(y);
        gridEl.setAttribute('aria-label', `${monthEl.textContent} ${y} Calendar`);

        const days = daysInMonth(y, m);
        const firstDayOfWeek = new Date(y, m, 1).getDay();
        const numWeeks = Math.max(5, Math.ceil((firstDayOfWeek + days) / 7));
        const totalCells = numWeeks * 7;
        const weeksMatrix = Array.from({ length: numWeeks }, () => Array(7).fill(null));

        for (let cellIndex = 0; cellIndex < totalCells; cellIndex++) {
            const weekIndex = Math.floor(cellIndex / 7);
            const weekdayIndex = cellIndex % 7;
            const dayNumber = cellIndex - firstDayOfWeek + 1;

            if (dayNumber > 0 && dayNumber <= days) {
                weeksMatrix[weekIndex][weekdayIndex] = dayNumber;
            }
        }

        gridEl.dataset.weeks = String(numWeeks);
        gridEl.style.setProperty('--calendar-gap', numWeeks === 6 ? '12px' : '16px');
        gridEl.style.setProperty('--calendar-header-gap', numWeeks === 6 ? '8px' : '10px');
        const profileContent = gridEl.closest('.profile-content');
        if (profileContent) {
            profileContent.dataset.calendarWeeks = String(numWeeks);
            const profileSection = profileContent.closest('.profile-section-2');
            if (profileSection) {
                profileSection.dataset.calendarWeeks = String(numWeeks);
            }
        }

        // Build new DOM
        const frag = document.createDocumentFragment();
        for (let w = 0; w < 7; w++) {
            const row = document.createElement('div');
            row.classList.add('calendar-column');
            row.setAttribute('role', 'row');

            const header = document.createElement('span');
            header.classList.add('calendar-header');
            header.setAttribute('role', 'columnheader');
            header.textContent = weekdayLetter(w);
            row.appendChild(header);

            for (let week = 0; week < numWeeks; week++) {
                const dayNum = weeksMatrix[week][w];
                const cell = document.createElement('span');
                cell.classList.add('calendar-cell');
                cell.setAttribute('role', 'gridcell');

                if (dayNum !== null && dayNum !== undefined) {
                    cell.textContent = String(dayNum);
                    cell.removeAttribute('aria-hidden');
                    cell.classList.remove('empty');

                    if (y === today.getFullYear() && m === today.getMonth() && dayNum === today.getDate()) {
                        cell.classList.add('is-today');
                        cell.setAttribute('aria-current', 'date');
                    } else {
                        cell.classList.remove('is-today');
                        cell.removeAttribute('aria-current');
                    }
                } else {
                    cell.textContent = '';
                    cell.classList.add('empty');
                    cell.setAttribute('aria-hidden', 'true');
                    cell.classList.remove('is-today');
                    cell.removeAttribute('aria-current');
                }

                row.appendChild(cell);
            }
            frag.appendChild(row);
        }

        // Replace grid content
        gridEl.innerHTML = '';
        gridEl.appendChild(frag);
    }

    function change(offset) {
        state.setMonth(state.getMonth() + offset);
        // Normalize date if month overflowed/underflowed
        state = new Date(state.getFullYear(), state.getMonth(), 1);
        render(state);
    }

    const handleNextClick = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        change(1);
        flashNav(nextBtn);
    };

    const handlePrevClick = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        change(-1);
        flashNav(prevBtn);
    };

    function bindNavButtons() {
        const candidateNext = document.querySelector('.vector-2[aria-label="Next month"]');
        if (candidateNext !== nextBtn) {
            if (nextBtn) {
                nextBtn.removeEventListener('click', handleNextClick);
                delete nextBtn.dataset.calendarBound;
            }
            nextBtn = candidateNext;
        }
        if (nextBtn && !nextBtn.dataset.calendarBound) {
            nextBtn.addEventListener('click', handleNextClick);
            nextBtn.dataset.calendarBound = 'true';
        }

        const candidatePrev = document.querySelector('.vector-3[aria-label="Previous month"]');
        if (candidatePrev !== prevBtn) {
            if (prevBtn) {
                prevBtn.removeEventListener('click', handlePrevClick);
                delete prevBtn.dataset.calendarBound;
            }
            prevBtn = candidatePrev;
        }
        if (prevBtn && !prevBtn.dataset.calendarBound) {
            prevBtn.addEventListener('click', handlePrevClick);
            prevBtn.dataset.calendarBound = 'true';
        }
    }

    render(state);
    bindNavButtons();

    // Keyboard navigation when calendar has focus
    if (!gridEl.hasAttribute('tabindex')) gridEl.setAttribute('tabindex', '0');
    gridEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { change(1); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { change(-1); e.preventDefault(); }
    });

    // Expose simple API for tests/debugging
    gridEl._calendarState = () => ({ year: state.getFullYear(), month: state.getMonth() });

    // Debug: confirm initialization and UI hooks
    try {
        console.debug('initializeCalendar: mounted', { gridEl, nextBtn, prevBtn, state: gridEl._calendarState() });
    } catch (err) {
        console.debug('initializeCalendar: debug log failed', err);
    }

    // Watch for DOM replacements that might remove/replace the grid and re-bind/render
    const calendarObserver = new MutationObserver((mutations) => {
        let navChanged = false;
        for (const m of mutations) {
            // If the grid element was removed or a new one was added, re-query and re-render
            const removed = Array.from(m.removedNodes || []).some(n => n === gridEl || (n.querySelector && n.querySelector('.group-9[role="grid"]')));
            const added = Array.from(m.addedNodes || []).some(n => n.querySelector && n.querySelector('.group-9[role="grid"]'));
            if (removed || added) {
                const newGrid = document.querySelector('.group-9[role="grid"]');
                if (newGrid && newGrid !== gridEl) {
                    console.debug('initializeCalendar: grid replaced — updating reference and re-render');
                    gridEl = newGrid;
                    // Ensure tabindex and keyboard listener remain set
                    if (!gridEl.hasAttribute('tabindex')) gridEl.setAttribute('tabindex', '0');
                    // re-render current state into the new grid
                    render(state);
                    bindNavButtons();
                }
            }

            const navSelectors = ['.vector-2[aria-label="Next month"]', '.vector-3[aria-label="Previous month"]'];
            if (!navChanged) {
                navChanged = navSelectors.some(selector =>
                    Array.from(m.addedNodes || []).some(n => n.matches?.(selector) || n.querySelector?.(selector)) ||
                    Array.from(m.removedNodes || []).some(n => n.matches?.(selector) || n.querySelector?.(selector))
                );
            }
        }
        if (navChanged) {
            bindNavButtons();
        }
    });

    // Observe at body level for subtree changes
    calendarObserver.observe(document.body, { childList: true, subtree: true });
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
            avatar: 'images/profile/default-avatar.svg'
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
            <div class="notification-icon">${getNotificationIcon(type)}</div>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close">&times;</button>
        </div>
    `;

    // Mobile detection
    const isMobile = window.innerWidth <= 768;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: ${isMobile ? '16px' : '24px'};
        right: ${isMobile ? '16px' : '24px'};
        ${isMobile ? 'left: 16px;' : ''}
        background: ${getNotificationColor(type)};
        color: white;
        padding: ${isMobile ? '14px 16px' : '16px 20px'};
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: ${isMobile ? 'translateY(-200px)' : 'translateX(450px)'};
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        ${!isMobile ? 'max-width: 380px;' : ''}
        backdrop-filter: blur(10px);
        font-family: 'Inter', sans-serif;
    `;

    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    // Style icon
    const icon = notification.querySelector('.notification-icon');
    icon.style.cssText = `
        width: ${isMobile ? '28px' : '32px'};
        height: ${isMobile ? '28px' : '32px'};
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isMobile ? '16px' : '18px'};
        font-weight: bold;
        flex-shrink: 0;
    `;

    // Style message
    const messageEl = notification.querySelector('.notification-message');
    messageEl.style.cssText = `
        flex: 1;
        font-size: ${isMobile ? '13px' : '14px'};
        line-height: 1.4;
        font-weight: 500;
    `;

    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s ease;
        line-height: 1;
        padding: 0;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
    }, 100);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = isMobile ? 'translateY(-200px)' : 'translateX(450px)';
        setTimeout(() => notification.remove(), 400);
    });

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = isMobile ? 'translateY(-200px)' : 'translateX(450px)';
            setTimeout(() => notification.remove(), 400);
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
    // Unified Brand Teal/Dark Theme - same background for all types
    return 'linear-gradient(135deg, #0a2838 0%, #11a1a3 100%)';
}

// Learn Page Functionality
function initializeLearnPage() {
    // DISABLED - Learn page now uses js/learn.js for database-driven courses
    // The old hardcoded course logic has been replaced with dynamic loading from Supabase
    return;
}

function initializeCourseFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const filter = this.getAttribute('data-category');

            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter courses
            filterCourses(filter, courseCards);
            updateCourseCount();
        });
    });
}

function filterCourses(filter, cards) {
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => card.classList.add('fade-in'), 10);
        } else {
            card.classList.remove('fade-in');
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

function initializeCourseSearch() {
    const searchInput = document.querySelector('#course-search');
    const courseCards = document.querySelectorAll('.course-card');

    if (searchInput && courseCards.length > 0) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();

            courseCards.forEach(card => {
                const title = card.querySelector('.course-card-title').textContent.toLowerCase();
                const description = card.querySelector('.course-card-description').textContent.toLowerCase();
                const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);

                if (shouldShow) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            updateCourseCount();
        });
    }
}

function initializeCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        const button = card.querySelector('.course-card-btn');

        if (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const title = card.querySelector('.course-card-title').textContent;
                const buttonText = this.textContent.trim();

                if (buttonText === 'Resume') {
                    showNotification(`Resuming "${title}"...`, 'info');
                    setTimeout(() => {
                        showNotification(`Continuing from where you left off in ${title}`, 'success');
                    }, 1500);
                } else {
                    showNotification(`Starting "${title}"...`, 'info');
                    setTimeout(() => {
                        showNotification(`Welcome to ${title}! Let's begin your learning journey.`, 'success');
                    }, 1500);
                }
            });
        }
    });
}

function initializeContinueButton() {
    const continueBtn = document.querySelector('.continue-btn-primary');

    if (continueBtn) {
        continueBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const courseName = document.querySelector('.course-name')?.textContent || 'your course';
            showNotification(`Continuing ${courseName}...`, 'info');
            setTimeout(() => {
                showNotification(`Resuming from Lesson 3: AI Fundamentals`, 'success');
            }, 1500);
        });
    }
}

function initializeProfileCoursesNavigation() {
    // DISABLED - Profile page courses are now loaded dynamically from Supabase
    // via profile.js loadUserCourses() function.
    // The skeleton loading cards with shimmer effect are shown in the HTML 
    // and replaced with actual data when loaded.
    // Chevron navigation is also handled in profile.js setupCourseNavigation().
    return;
}

// Practice Page Functionality
function initializePracticePage() {
    // DISABLED - Practice page now uses js/practice.js for database-driven exercises
    // The old hardcoded practice card logic has been replaced with dynamic loading from Supabase
    return;
}

function initializeProfileRobotAnimation() {
    const robot = document.querySelector('.profile-skills-illustration__image');
    if (!robot) return;

    let ticking = false;

    const updateRobotTransform = () => {
        const rect = robot.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const robotCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;

        const distanceFromCenter = (robotCenter - viewportCenter) / viewportHeight;

        const tilt = distanceFromCenter * 3;
        const float = Math.sin(distanceFromCenter * Math.PI) * 5;

        robot.style.transform = `translateY(${float}px) rotate(${tilt}deg)`;
        robot.classList.add('is-animated');

        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateRobotTransform);
            ticking = true;
        }
    };

    updateRobotTransform();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initializeHeaderScrollAnimation() {
    const header = document.querySelector('.header');
    if (!header) return;
    if (header.dataset.scrollAnimationInitialized === 'true') return;
    header.dataset.scrollAnimationInitialized = 'true';

    const SCROLL_THRESHOLD = 20;
    let lastKnownScrollY = 0;
    let ticking = false;

    const updateHeaderBackground = () => {
        const shouldShowBackground = lastKnownScrollY > SCROLL_THRESHOLD;
        header.classList.toggle('header--has-bg', shouldShowBackground);
        header.classList.toggle('header--no-bg', !shouldShowBackground);
        ticking = false;
    };

    const onScroll = () => {
        lastKnownScrollY = window.scrollY || window.pageYOffset;
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderBackground);
            ticking = true;
        }
    };

    header.classList.add('header--no-bg');
    updateHeaderBackground();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initializePracticeCards() {
    const practiceCards = document.querySelectorAll('.practice-card');

    practiceCards.forEach(card => {
        const button = card.querySelector('.practice-btn');

        if (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const title = card.querySelector('.practice-card-title').textContent;
                const badge = card.querySelector('.practice-badge').textContent;

                showNotification(`Starting "${title}"...`, 'info');
                setTimeout(() => {
                    showNotification(`Welcome to ${title}! Category: ${badge}`, 'success');
                }, 1500);
            });
        }

        // Add hover animation effect
        card.addEventListener('mouseenter', function () {
            this.style.borderColor = '#fbbf24';
        });

        card.addEventListener('mouseleave', function () {
            this.style.borderColor = '#f59e0b';
        });
    });
}

// Supabase dashboard helpers
function loadDashboardData() {
    let profile = null;
    let user = null;

    try {
        const profileRaw = sessionStorage.getItem('userProfile');
        if (profileRaw) {
            profile = JSON.parse(profileRaw);
        }
    } catch (error) {
        console.warn('Failed to parse stored profile data:', error);
    }

    try {
        const userRaw = sessionStorage.getItem('authUser');
        if (userRaw) {
            user = JSON.parse(userRaw);
        }
    } catch (error) {
        console.warn('Failed to parse stored auth user data:', error);
    }

    if (!profile || !user) {
        console.warn('Supabase profile data not found in sessionStorage.');
        return;
    }

    updateUserUI(user, profile);
}

function getProviderAvatarUrl(user) {
    if (!user || !user.app_metadata || user.app_metadata.provider !== 'google') {
        return null;
    }
    const metadata = user.user_metadata || {};
    if (typeof metadata.avatar_url === 'string' && metadata.avatar_url) {
        return metadata.avatar_url;
    }
    if (typeof metadata.picture === 'string' && metadata.picture) {
        return metadata.picture;
    }
    const identities = Array.isArray(user.identities) ? user.identities : [];
    for (let i = 0; i < identities.length; i++) {
        const identity = identities[i];
        if (identity && identity.provider === 'google' && identity.identity_data) {
            const data = identity.identity_data;
            if (typeof data.avatar_url === 'string' && data.avatar_url) {
                return data.avatar_url;
            }
            if (typeof data.picture === 'string' && data.picture) {
                return data.picture;
            }
        }
    }
    return null;
}

function updateUserUI(user, profile) {
    if (!user || !profile) return;

    const fallbackAvatar = 'images/profile/default-avatar.svg';
    const fallbackProfileAvatar = 'images/profile/default-avatar.svg';

    const userName = (profile.full_name && profile.full_name.trim()) || (user.email ? user.email.split('@')[0] : 'Learner');
    const userInitial = userName.charAt(0).toUpperCase();
    let userHandle = profile.username && profile.username.trim()
        ? profile.username.trim()
        : (user.email
            ? `@${user.email.split('@')[0]}`
            : `@${userName.replace(/\s+/g, '').toLowerCase()}`);
    if (userHandle && !userHandle.startsWith('@')) {
        userHandle = `@${userHandle}`;
    }
    const providerAvatarUrl = getProviderAvatarUrl(user);
    const avatarUrl = profile.avatar_url || providerAvatarUrl || null;
    const nameWithExclamation = userName.endsWith('!') ? userName : `${userName}!`;

    const headerAvatar = document.querySelector('.header-right .user-avatar');
    let resolvedAvatar = avatarUrl;
    if (headerAvatar) {
        if (avatarUrl) {
            headerAvatar.innerHTML = '';
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarUrl;
            avatarImg.alt = `${userName} avatar`;
            avatarImg.className = 'user-avatar-image';
            avatarImg.style.width = '32px';
            avatarImg.style.height = '32px';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.objectFit = 'cover';
            headerAvatar.appendChild(avatarImg);
        } else {
            headerAvatar.textContent = userInitial;
        }
        const headerAvatarImg = headerAvatar.querySelector('img');
        if (!resolvedAvatar && headerAvatarImg?.src) {
            resolvedAvatar = headerAvatarImg.src;
        }
    }

    if (!resolvedAvatar) {
        resolvedAvatar = fallbackAvatar;
    }

    const navProfilePic = document.querySelector('nav .profile-pic');
    if (navProfilePic) {
        navProfilePic.src = resolvedAvatar;
        navProfilePic.alt = `${userName} avatar`;
    }

    const learnHeroAvatar = document.querySelector('.profile-avatar-large img');
    if (learnHeroAvatar) {
        learnHeroAvatar.src = resolvedAvatar;
        learnHeroAvatar.alt = `${userName} avatar`;
        learnHeroAvatar.style.removeProperty('display');
    }

    const greetingHighlightSelectors = [
        '.greeting-text .highlight-name',
        '.greeting-text .highlight',
        '.welcome-section .greeting-text .highlight',
        '.welcome-section .greeting-text .highlight-name',
        '.text-wrapper-37'
    ];
    greetingHighlightSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.textContent = nameWithExclamation;
        });
    });

    document
        .querySelectorAll('[data-placeholder="greeting-name"], .greeting-text .name')
        .forEach(element => {
            element.textContent = userName;
        });

    const learningGreetingAvatar = document.querySelector('.greeting-avatar');
    if (learningGreetingAvatar) {
        learningGreetingAvatar.src = resolvedAvatar;
        learningGreetingAvatar.alt = `${userName} avatar`;
    }

    const certificationAvatar = document.querySelector('.welcome-section .profile-avatar-large img, .welcome-section .avatar-img');
    if (certificationAvatar) {
        certificationAvatar.src = resolvedAvatar;
        certificationAvatar.alt = `${userName} avatar`;
    }

    document
        .querySelectorAll('input[placeholder="Enter your full name"]')
        .forEach(input => {
            if (!input.matches(':focus') && (!input.value || input.value.trim() === '')) {
                input.value = profile.full_name || '';
            }
        });

    const profileHeroName = document.querySelector('.profile-hero__name');
    if (profileHeroName) {
        profileHeroName.textContent = userName;
    }

    const profileHeroHandle = document.querySelector('.profile-hero__handle');
    if (profileHeroHandle) {
        profileHeroHandle.textContent = userHandle;
    }

    const profileHeroAvatar = document.querySelector('.profile-hero__avatar-image');
    if (profileHeroAvatar) {
        profileHeroAvatar.src = avatarUrl || fallbackProfileAvatar;
        profileHeroAvatar.alt = `${userName} avatar`;
    }

    const profileBio = document.querySelector('.profile-bio-card__copy');
    if (profileBio) {
        profileBio.textContent = profile.bio && profile.bio.trim()
            ? profile.bio
            : 'No bio yet. Add one from your profile settings.';
    }

    const homeSidebarHandle = document.querySelector('.profile-section .group-2 .text-wrapper');
    if (homeSidebarHandle) {
        homeSidebarHandle.textContent = userHandle;
    }

    const homeSidebarAvatar = document.querySelector('.profile-section .profile-icon');
    if (homeSidebarAvatar) {
        homeSidebarAvatar.src = resolvedAvatar;
        homeSidebarAvatar.alt = `${userName} avatar`;
        homeSidebarAvatar.style.objectFit = 'cover';
        homeSidebarAvatar.style.borderRadius = '50%';
        homeSidebarAvatar.onerror = () => {
            homeSidebarAvatar.src = fallbackAvatar;
            homeSidebarAvatar.onerror = null;
        };
    }
}


// Certification details data structure with links, hardcoded (fallback) for now, to be fetched from backend later
const certificationDataFallback = {
    'data-scientist': {
        title: 'Data Scientist',
        subtitle: 'Extract insights from data using AI and ML techniques to guide business decisions',
        category: 'Artificial Intelligence',
        duration: 45,
        level: 'intermediate',
        icon: 'fab fa-python',
        description: 'This comprehensive certification program will equip you with the essential skills to become a successful Data Scientist. You\'ll learn to extract meaningful insights from complex datasets using advanced AI and machine learning techniques, statistical analysis, and data visualization tools.',
        prerequisites: [
            'Basic understanding of Python programming',
            'Fundamental knowledge of statistics and probability',
            'Familiarity with data structures and algorithms',
            'Basic SQL knowledge recommended'
        ],
        steps: [
            {
                title: 'Learn Python Programming',
                description: 'Master Python fundamentals and data manipulation libraries.',
                links: [
                    {
                        title: 'Python.org Official Tutorial',
                        url: 'https://docs.python.org/3/tutorial/',
                        icon: 'fas fa-book',
                        description: 'Official Python documentation and tutorials'
                    },
                    {
                        title: 'Codecademy Python Course',
                        url: 'https://www.codecademy.com/learn/learn-python-3',
                        icon: 'fas fa-code',
                        description: 'Interactive Python programming course'
                    },
                    {
                        title: 'NumPy & Pandas Tutorial',
                        url: 'https://numpy.org/doc/stable/user/quickstart.html',
                        icon: 'fas fa-table',
                        description: 'Learn data manipulation with NumPy and Pandas'
                    }
                ]
            },
            {
                title: 'Study Machine Learning',
                description: 'Understand ML algorithms and model training.',
                links: [
                    {
                        title: 'Coursera ML Specialization',
                        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
                        icon: 'fas fa-graduation-cap',
                        description: 'Andrew Ng\'s Machine Learning course'
                    },
                    {
                        title: 'Scikit-learn Documentation',
                        url: 'https://scikit-learn.org/stable/tutorial/index.html',
                        icon: 'fas fa-flask',
                        description: 'Official scikit-learn tutorials'
                    },
                    {
                        title: 'Kaggle Learn',
                        url: 'https://www.kaggle.com/learn',
                        icon: 'fas fa-chart-line',
                        description: 'Hands-on ML practice with real datasets'
                    }
                ]
            },
            {
                title: 'Practice with Projects',
                description: 'Build real-world projects to demonstrate your skills.',
                links: [
                    {
                        title: 'Kaggle Competitions',
                        url: 'https://www.kaggle.com/competitions',
                        icon: 'fas fa-trophy',
                        description: 'Compete in data science challenges'
                    },
                    {
                        title: 'GitHub Data Science Projects',
                        url: 'https://github.com/topics/data-science',
                        icon: 'fab fa-github',
                        description: 'Explore open-source projects'
                    }
                ]
            },
            {
                title: 'Get Certified',
                description: 'Take official certification exams.',
                links: [
                    {
                        title: 'Google Data Analytics Certificate',
                        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
                        icon: 'fab fa-google',
                        description: 'Professional certificate by Google'
                    },
                    {
                        title: 'IBM Data Science Certificate',
                        url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
                        icon: 'fas fa-certificate',
                        description: 'Professional certificate by IBM'
                    }
                ]
            }
        ]
    },
    'security-analyst': {
        title: 'Security Analyst (SOC)',
        subtitle: 'Monitor and analyze real-time threats in a Security Operations Center environment',
        category: 'Cybersecurity',
        duration: 50,
        level: 'intermediate',
        icon: 'fas fa-shield-halved',
        description: 'Become a proficient Security Operations Center (SOC) Analyst. Learn to monitor, detect, analyze, and respond to cybersecurity incidents in real-time.',
        prerequisites: [
            'Basic networking concepts (TCP/IP, DNS, HTTP)',
            'Understanding of operating systems (Windows, Linux)',
            'Familiarity with security concepts',
            'Basic command line experience'
        ],
        steps: [
            {
                title: 'Learn Security Fundamentals',
                description: 'Understand core cybersecurity concepts and principles.',
                links: [
                    {
                        title: 'Cybrary Security+ Course',
                        url: 'https://www.cybrary.it/course/comptia-security-plus',
                        icon: 'fas fa-shield-alt',
                        description: 'CompTIA Security+ preparation'
                    },
                    {
                        title: 'SANS Cyber Aces',
                        url: 'https://www.cyberaces.org/',
                        icon: 'fas fa-book-open',
                        description: 'Free security tutorials by SANS'
                    }
                ]
            },
            {
                title: 'Master Network Security',
                description: 'Learn network protocols and security monitoring.',
                links: [
                    {
                        title: 'Wireshark Tutorial',
                        url: 'https://www.wireshark.org/docs/',
                        icon: 'fas fa-network-wired',
                        description: 'Learn packet analysis with Wireshark'
                    },
                    {
                        title: 'TryHackMe Network Security',
                        url: 'https://tryhackme.com/paths',
                        icon: 'fas fa-server',
                        description: 'Hands-on network security training'
                    }
                ]
            },
            {
                title: 'Practice Threat Detection',
                description: 'Develop skills in identifying and responding to threats.',
                links: [
                    {
                        title: 'Blue Team Labs Online',
                        url: 'https://blueteamlabs.online/',
                        icon: 'fas fa-search',
                        description: 'SOC analyst challenges and labs'
                    },
                    {
                        title: 'CyberDefenders',
                        url: 'https://cyberdefenders.org/',
                        icon: 'fas fa-user-shield',
                        description: 'Blue team CTF challenges'
                    }
                ]
            },
            {
                title: 'Get Certified',
                description: 'Obtain professional certifications.',
                links: [
                    {
                        title: 'CompTIA Security+',
                        url: 'https://www.comptia.org/certifications/security',
                        icon: 'fas fa-certificate',
                        description: 'Industry-standard security certification'
                    },
                    {
                        title: 'Certified SOC Analyst',
                        url: 'https://www.eccouncil.org/programs/certified-soc-analyst-csa/',
                        icon: 'fas fa-award',
                        description: 'EC-Council SOC Analyst certification'
                    }
                ]
            }
        ]
    }
};

// Try Supabase first, fallback to hardcoded data
async function getCertificationData(certId) {
    try {
        const { data, error } = await supabase
            .from('certifications')
            .select('*')
            .eq('slug', certId)
            .single();

        if (data && !error) {
            return data;
        }
    } catch (error) {
        console.warn('Supabase fetch failed, using fallback data:', error);
    }

    return certificationDataFallback[certId];
}

async function initializeCertificationDetailPage() {
    if (!document.querySelector('.cert-header')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');

    if (!certId) {
        window.location.href = 'certification.html';
        return;
    }

    const certData = await getCertificationData(certId);

    if (certData) {
        loadCertificationDetails(certData);
    } else {
        window.location.href = 'certification.html';
    }
}

function loadCertificationDetails(cert) {
    document.getElementById('cert-icon').innerHTML = `<i class="${cert.icon}"></i>`;
    document.getElementById('cert-title').textContent = cert.title;
    document.getElementById('cert-subtitle').textContent = cert.subtitle;
    document.getElementById('cert-category').textContent = cert.category;
    document.getElementById('cert-duration').textContent = cert.duration;
    document.getElementById('cert-level').textContent = cert.level;
    document.getElementById('cert-description').textContent = cert.description;

    const prereqList = document.getElementById('prerequisites-list');
    prereqList.innerHTML = cert.prerequisites.map(prereq =>
        `<li><i class="fas fa-check-circle"></i> ${prereq}</li>`
    ).join('');

    const stepsContainer = document.getElementById('guide-steps');
    stepsContainer.innerHTML = cert.steps.map((step, index) => `
        <div class="guide-step">
            <div class="step-header">
                <div class="step-number">${index + 1}</div>
                <h3 class="step-title">${step.title}</h3>
            </div>
            <p class="step-description">${step.description}</p>
            <div class="step-links">
                ${step.links.map(link => `
                    <a href="${link.url}" class="step-link" target="_blank" rel="noopener noreferrer">
                        <i class="${link.icon}"></i>
                        <div class="step-link-text">
                            <div class="step-link-title">${link.title}</div>
                            <div class="step-link-desc">${link.description}</div>
                        </div>
                        <i class="fas fa-external-link-alt" style="color: #f59e0b; font-size: 0.875rem;"></i>
                    </a>
                `).join('')}
            </div>
        </div>
    `).join('');
}