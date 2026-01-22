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
            greetingHighlight.classList.remove('skeleton-text-inline');
            greetingHighlight.textContent = (profile.full_name || profile.username || 'Learner') + '!';
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
        
        // Sort by level: foundational → associate → professional
        allCertifications.sort((a, b) => {
            const levelOrder = { 'foundational': 1, 'associate': 2, 'professional': 3 };
            const levelA = (a.level || 'foundational').toLowerCase();
            const levelB = (b.level || 'foundational').toLowerCase();
            return (levelOrder[levelA] || 1) - (levelOrder[levelB] || 1);
        });
        
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

    // In "My Certification" tab (all filter), group pinned certifications at the top
    if (currentFilter === 'all' && currentUserId) {
        const pinnedCerts = certifications.filter(cert => userCertifications[cert.id]?.is_pinned);
        const unpinnedCerts = certifications.filter(cert => !userCertifications[cert.id]?.is_pinned);

        let html = '';

        // Render pinned section if there are pinned certifications
        if (pinnedCerts.length > 0) {
            html += `
                <div class="pinned-section-header" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <i class="fas fa-star" style="color: #f59e0b; font-size: 18px;"></i>
                    <span style="font-weight: 600; color: #1f2937; font-size: 1.1rem;">Pinned Certifications</span>
                    <div style="flex: 1; height: 1px; background: linear-gradient(to right, #e5e7eb, transparent);"></div>
                </div>
            `;
            html += pinnedCerts.map(cert => createCertificationCard(cert)).join('');

            // Add separator between pinned and unpinned
            if (unpinnedCerts.length > 0) {
                html += `
                    <div class="section-divider" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; margin: 24px 0 8px 0;">
                        <span style="font-weight: 600; color: #6b7280; font-size: 1rem;">All Certifications</span>
                        <div style="flex: 1; height: 1px; background: linear-gradient(to right, #e5e7eb, transparent);"></div>
                    </div>
                `;
            }
        }

        // Render unpinned certifications
        html += unpinnedCerts.map(cert => createCertificationCard(cert)).join('');

        certificationsGrid.innerHTML = html;
    } else {
        // For filtered views (AI, Cybersecurity, Cloud), just render normally
        certificationsGrid.innerHTML = certifications.map(cert => createCertificationCard(cert)).join('');
    }
}

// ============================================
// Create Certification Card HTML
// ============================================

function createCertificationCard(cert) {
    // Use category from database
    const category = cert.category || 'cloud';

    // Fix image URL - handle both relative and absolute paths
    let imageUrl = cert.icon_url || 'images/certifications/placeholder.png';
    // If URL is from database and doesn't start with http/https or /, prepend base path
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('images/')) {
        imageUrl = 'images/certifications/' + imageUrl;
    }

    // Get certification level (foundational, associate, professional)
    const level = cert.level || 'foundational';
    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

    // Check if user has started this certification and if it's pinned
    const userCert = userCertifications[cert.id];
    const isPinned = userCert?.is_pinned || false;
    const hasStarted = !!userCert;

    // Count current pinned certifications
    const pinnedCount = Object.values(userCertifications).filter(uc => uc.is_pinned).length;
    const isPinLimitReached = pinnedCount >= 2;

    // Show pin button in "My Certification" tab (filter === 'all') for logged in users
    const showPinButton = currentFilter === 'all' && currentUserId;

    // Determine button state
    const isDisabled = !isPinned && isPinLimitReached;

    let pinButtonHtml = '';
    if (showPinButton) {
        const disabledClass = isDisabled ? 'is-disabled' : '';
        const pinnedClass = isPinned ? 'is-pinned' : '';
        const notStartedClass = !hasStarted ? 'not-started' : '';

        pinButtonHtml = `
            <button class="pin-button ${pinnedClass} ${disabledClass} ${notStartedClass}" 
                    onclick="togglePin(event, '${cert.id}', '${cert.slug}')" 
                    title="${isDisabled ? 'Pin limit reached (max 2)' : (isPinned ? 'Unpin from profile' : 'Pin to profile')}"
                    aria-label="${isPinned ? 'Unpin certification' : 'Pin certification'}"
                    ${isDisabled ? 'disabled' : ''}>
                <i class="fas fa-star"></i>
            </button>
        `;
    }

    return `
        <div class="certification-card" data-category="${category}" data-cert-id="${cert.id}">
            ${pinButtonHtml}
            <div class="card-image">
                <img src="${imageUrl}" 
                     alt="${cert.title}" 
                     class="cert-image"
                     onerror="this.src='images/certifications/placeholder.png'; this.onerror=null;">
                <div class="cert-level-badge ${level}">${levelLabel}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${cert.title}</h3>
                <p class="card-description">${truncateText(cert.description, 150)}</p>
                <button class="card-button" onclick="startCertification('${cert.id}', '${cert.slug}')">
                    <span>Get Started</span>
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

async function togglePin(event, certId, certSlug) {
    // Prevent card click
    event.stopPropagation();

    if (!currentUserId) {
        alert('Please log in to pin certifications.');
        return;
    }

    let userCert = userCertifications[certId];

    // If user hasn't started this certification, create the record first
    if (!userCert) {
        try {
            const { data: newCert, error: insertError } = await supabase
                .from('user_certifications')
                .insert({
                    user_id: currentUserId,
                    certification_id: certId,
                    status: 'in_progress',
                    is_pinned: true  // Pin it directly
                })
                .select('id, certification_id, is_pinned')
                .single();

            if (insertError) {
                console.error('Error starting certification:', insertError);
                alert('Failed to start certification. Please try again.');
                return;
            }

            // Update local state with new record
            userCertifications[certId] = {
                id: newCert.id,
                is_pinned: true
            };

            // Re-render the grid
            if (currentFilter === 'all') {
                renderCertifications(allCertifications);
            }

            showPinFeedback(true);
            return;

        } catch (error) {
            console.error('Error creating certification record:', error);
            alert('An unexpected error occurred.');
            return;
        }
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

        // Re-render the grid to move the card to/from the pinned section
        // Only re-render if we're in the "My Certification" tab (all filter)
        if (currentFilter === 'all') {
            renderCertifications(allCertifications);
        } else {
            // Just update the button state for filtered views
            const card = document.querySelector(`.certification-card[data-cert-id="${certId}"]`);
            if (card) {
                const pinButton = card.querySelector('.pin-button');
                if (pinButton) {
                    pinButton.classList.toggle('is-pinned', newPinnedState);
                    pinButton.title = newPinnedState ? 'Unpin from profile' : 'Pin to profile';
                    pinButton.setAttribute('aria-label', newPinnedState ? 'Unpin certification' : 'Pin certification');
                }
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
