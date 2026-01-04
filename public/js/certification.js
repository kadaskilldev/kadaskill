// ============================================
// Certification Page - Database Integration
// Dynamically loads certifications from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let allCertifications = [];
let currentFilter = 'all';
let userCertifications = {}; // Map of certification_id -> { id, is_pinned }
let currentUserId = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    await loadUserCertificationStatus();
    await loadCertifications();
    setupEventListeners();
});

// ============================================
// Load User Profile
// ============================================

async function loadUserProfile() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No user logged in, using default profile');
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error loading profile:', profileError);
            return;
        }

        // Update greeting
        const greetingHighlight = document.querySelector('.greeting-text .highlight');
        if (greetingHighlight) {
            greetingHighlight.textContent = profile.full_name || profile.username || 'Learner!';
        }

        // Update avatar
        const avatarImg = document.querySelector('.avatar-img');
        if (avatarImg && profile.avatar_url) {
            avatarImg.src = profile.avatar_url;
        }

    } catch (error) {
        console.error('Unexpected error loading profile:', error);
    }
}

// ============================================
// Load User Certification Status (for pin state)
// ============================================

async function loadUserCertificationStatus() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No user logged in, pin functionality disabled');
            return;
        }

        currentUserId = user.id;

        const { data: userCerts, error } = await supabase
            .from('user_certifications')
            .select('id, certification_id, is_pinned')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error loading user certifications:', error);
            return;
        }

        // Build a map for quick lookup
        userCertifications = {};
        if (userCerts) {
            userCerts.forEach(uc => {
                userCertifications[uc.certification_id] = {
                    id: uc.id,
                    is_pinned: uc.is_pinned
                };
            });
        }
    } catch (error) {
        console.error('Unexpected error loading user certification status:', error);
    }
}

// ============================================
// Load Certifications from Database
// ============================================

async function loadCertifications() {
    try {
        const { data: certifications, error } = await supabase
            .from('certifications')
            .select('*')
            .eq('is_active', true)
            .order('provider', { ascending: true })
            .order('title', { ascending: true });

        if (error) {
            console.error('Error loading certifications:', error);
            showError('Failed to load certifications. Please refresh the page.');
            return;
        }

        allCertifications = certifications || [];
        renderCertifications(allCertifications);
        updateCertCount(allCertifications.length);

    } catch (error) {
        console.error('Unexpected error loading certifications:', error);
        showError('An unexpected error occurred.');
    }
}

// ============================================
// Render Certifications to Grid
// ============================================

function renderCertifications(certifications) {
    const certificationsGrid = document.getElementById('certifications-grid');

    if (!certificationsGrid) {
        console.error('Certifications grid element not found');
        return;
    }

    if (certifications.length === 0) {
        certificationsGrid.innerHTML = `
            <div class="no-certifications-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-certificate" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 18px;">No certifications found</p>
            </div>
        `;
        return;
    }

    certificationsGrid.innerHTML = certifications.map(cert => createCertificationCard(cert)).join('');
}

// ============================================
// Create Certification Card HTML
// ============================================

function createCertificationCard(cert) {
    // Use category from database
    const category = cert.category || 'cloud';

    // Use icon_url from database, fallback to placeholder
    const imageUrl = cert.icon_url || 'images/certifications/placeholder.png';

    // Check if user has started this certification and if it's pinned
    const userCert = userCertifications[cert.id];
    const isPinned = userCert?.is_pinned || false;
    const hasStarted = !!userCert;

    // Only show pin button in "My Certification" tab (filter === 'all') and if user has started the cert
    const showPinButton = currentFilter === 'all' && hasStarted && currentUserId;

    const pinButtonHtml = showPinButton ? `
        <button class="pin-button ${isPinned ? 'is-pinned' : ''}" 
                onclick="togglePin(event, '${cert.id}')" 
                title="${isPinned ? 'Unpin from profile' : 'Pin to profile'}"
                aria-label="${isPinned ? 'Unpin certification' : 'Pin certification'}">
            <i class="fas fa-star"></i>
        </button>
    ` : '';

    return `
        <div class="certification-card" data-category="${category}" data-cert-id="${cert.id}">
            ${pinButtonHtml}
            <div class="card-image">
                <img src="${imageUrl}" 
                     alt="${cert.title}" 
                     class="cert-image"
                     onerror="this.src='images/certifications/placeholder.png'; this.onerror=null;">
            </div>
            <div class="card-content">
                <h3 class="card-title">${cert.title}</h3>
                <p class="card-description">${truncateText(cert.description, 150)}</p>
                <button class="card-button" onclick="startCertification('${cert.id}', '${cert.slug}')">
                    Get Started
                </button>
            </div>
        </div>
    `;
}

// ============================================
// Helper Functions
// ============================================

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function updateCertCount(count) {
    const countElement = document.getElementById('cert-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

function showError(message) {
    const certificationsGrid = document.getElementById('certifications-grid');
    if (certificationsGrid) {
        certificationsGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ff4444; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 18px;">${message}</p>
                <button onclick="location.reload()" class="card-button" style="margin-top: 16px;">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// ============================================
// Start Certification
// ============================================

async function startCertification(certId, certSlug) {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            // Redirect to login if not authenticated
            window.location.href = 'index.html';
            return;
        }

        // Check if user has already started this certification
        const { data: existingProgress, error: checkError } = await supabase
            .from('user_certifications')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('certification_id', certId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking certification progress:', checkError);
        }

        if (existingProgress) {
            // Already started, redirect to certification guide page
            window.location.href = `cert-guide.html?cert=${certSlug}`;
            return;
        }

        // Create new certification progress
        const { error: progressError } = await supabase
            .from('user_certifications')
            .insert({
                user_id: user.id,
                certification_id: certId,
                status: 'in_progress'
            });

        if (progressError) {
            console.error('Error creating certification progress:', progressError);
            alert('Failed to start certification. Please try again.');
            return;
        }

        // Redirect to certification guide page
        window.location.href = `cert-guide.html?cert=${certSlug}`;

    } catch (error) {
        console.error('Unexpected error starting certification:', error);
        alert('An unexpected error occurred.');
    }
}

// Make it global so onclick can access it
window.startCertification = startCertification;

// ============================================
// Toggle Pin Certification
// ============================================

async function togglePin(event, certId) {
    // Prevent card click
    event.stopPropagation();

    if (!currentUserId) {
        alert('Please log in to pin certifications.');
        return;
    }

    const userCert = userCertifications[certId];
    if (!userCert) {
        console.error('User has not started this certification');
        return;
    }

    const newPinnedState = !userCert.is_pinned;

    // Check pin limit (max 2 pinned)
    if (newPinnedState) {
        const pinnedCount = Object.values(userCertifications).filter(uc => uc.is_pinned).length;
        if (pinnedCount >= 2) {
            alert('You can only pin up to 2 certifications. Please unpin one first.');
            return;
        }
    }

    try {
        const { error } = await supabase
            .from('user_certifications')
            .update({ is_pinned: newPinnedState })
            .eq('id', userCert.id);

        if (error) {
            console.error('Error updating pin status:', error);
            alert('Failed to update pin status. Please try again.');
            return;
        }

        // Update local state
        userCertifications[certId].is_pinned = newPinnedState;

        // Update UI
        const card = document.querySelector(`.certification-card[data-cert-id="${certId}"]`);
        if (card) {
            const pinButton = card.querySelector('.pin-button');
            if (pinButton) {
                pinButton.classList.toggle('is-pinned', newPinnedState);
                pinButton.title = newPinnedState ? 'Unpin from profile' : 'Pin to profile';
                pinButton.setAttribute('aria-label', newPinnedState ? 'Unpin certification' : 'Pin certification');
            }
        }

        // Show feedback
        showPinFeedback(newPinnedState);

    } catch (error) {
        console.error('Unexpected error toggling pin:', error);
        alert('An unexpected error occurred.');
    }
}

function showPinFeedback(isPinned) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'pin-toast';
    toast.innerHTML = `
        <i class="fas fa-${isPinned ? 'star' : 'star'}"></i>
        <span>${isPinned ? 'Certification pinned to profile!' : 'Certification unpinned from profile'}</span>
    `;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Make togglePin global
window.togglePin = togglePin;

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter certifications
            const filter = tab.dataset.filter;
            currentFilter = filter;
            filterCertifications(filter);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.grid-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchCertifications(searchTerm);
        });
    }
}

// ============================================
// Filter & Search Functions
// ============================================

function filterCertifications(filter) {
    let filteredCerts = allCertifications;

    if (filter !== 'all') {
        filteredCerts = allCertifications.filter(cert => {
            // Use category from database
            const category = (cert.category || '').toLowerCase();
            return category === filter;
        });
    }

    renderCertifications(filteredCerts);
    updateCertCount(filteredCerts.length);
}

function searchCertifications(searchTerm) {
    if (!searchTerm) {
        filterCertifications(currentFilter);
        return;
    }

    let certsToSearch = allCertifications;

    // Apply category filter first if not 'all'
    if (currentFilter !== 'all') {
        certsToSearch = allCertifications.filter(cert => {
            const category = (cert.category || '').toLowerCase();
            return category === currentFilter;
        });
    }

    // Then apply search
    const searchResults = certsToSearch.filter(cert =>
        cert.title.toLowerCase().includes(searchTerm) ||
        (cert.description && cert.description.toLowerCase().includes(searchTerm)) ||
        (cert.provider && cert.provider.toLowerCase().includes(searchTerm))
    );

    renderCertifications(searchResults);
    updateCertCount(searchResults.length);
}
