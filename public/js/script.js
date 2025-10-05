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
        initializeCalendar();

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
}

function loadNavigation() {
    const navigationElement = document.getElementById('navigation');
    if (!navigationElement) return;

    const pathname = window.location.pathname;
    const currentPage = (pathname === '/' || pathname === '') ? 'home.html' : pathname.split('/').pop();
    const isCertificationPage = currentPage === 'certification.html';

    const userProfileMarkup = isCertificationPage
        ? `
                <div class="user-profile">
                    <div class="user-avatar" aria-hidden="true">E</div>
                </div>
        `
        : `
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
                        <a href="profile.html" class="user-menu__item" role="menuitem">
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
                ${userProfileMarkup}
            </div>
        </div>
    </header>
    `;

    navigationElement.innerHTML = nav;

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

    if (!isCertificationPage) {
        initializeUserMenu(navigationElement);
    }
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
        
        if (currentPage === 'profile.html') {
            // Do not highlight any nav link when on profile page
            return;
        }

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
    function weekdayLetter(i) { return ['S','M','T','W','T','F','S'][i]; }

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
            row.setAttribute('role','row');

            const header = document.createElement('span');
            header.classList.add('calendar-header');
            header.setAttribute('role','columnheader');
            header.textContent = weekdayLetter(w);
            row.appendChild(header);

            for (let week = 0; week < numWeeks; week++) {
                const dayNum = weeksMatrix[week][w];
                const cell = document.createElement('span');
                cell.classList.add('calendar-cell');
                cell.setAttribute('role','gridcell');

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
    };

    const handlePrevClick = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        change(-1);
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
        // visual click feedback: toggle .is-active briefly
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextBtn.classList.add('is-active');
                setTimeout(() => nextBtn.classList.remove('is-active'), 300);
            });
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
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevBtn.classList.add('is-active');
                setTimeout(() => prevBtn.classList.remove('is-active'), 300);
            });
        }
    }

    render(state);
    bindNavButtons();

    // Keyboard navigation when calendar has focus
    if (!gridEl.hasAttribute('tabindex')) gridEl.setAttribute('tabindex','0');
    gridEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { change(1); e.preventDefault(); }
        if (e.key === 'ArrowLeft')  { change(-1); e.preventDefault(); }
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
                    if (!gridEl.hasAttribute('tabindex')) gridEl.setAttribute('tabindex','0');
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
