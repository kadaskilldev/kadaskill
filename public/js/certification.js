// ============================================
// Certification Page - Database Integration
// Dynamically loads certifications from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let allCertifications = [];
let currentFilter = 'all';

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
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
    const category = getCategoryFromProvider(cert.provider, cert.title);
    const graphicClass = getGraphicClass(cert.provider, cert.title);
    const graphic = createGraphic(cert.provider, cert.title);

    return `
        <div class="certification-card" data-category="${category}">
            <div class="card-image">
                <div class="cert-graphic ${graphicClass}">
                    ${graphic}
                </div>
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

function getCategoryFromProvider(provider, title) {
    const lowerTitle = title.toLowerCase();
    const lowerProvider = provider.toLowerCase();

    // Check title for keywords
    if (lowerTitle.includes('ai') || lowerTitle.includes('ml') ||
        lowerTitle.includes('data') || lowerTitle.includes('python')) {
        return 'ai';
    }
    if (lowerTitle.includes('security') || lowerTitle.includes('cissp') ||
        lowerTitle.includes('comptia')) {
        return 'cybersecurity';
    }
    if (lowerTitle.includes('cloud') || lowerTitle.includes('aws') ||
        lowerTitle.includes('azure') || lowerTitle.includes('gcp') ||
        lowerProvider.includes('aws') || lowerProvider.includes('azure') ||
        lowerProvider.includes('google cloud')) {
        return 'cloud';
    }

    // Default to cloud if provider is a cloud provider
    if (lowerProvider.includes('aws') || lowerProvider.includes('microsoft') ||
        lowerProvider.includes('google')) {
        return 'cloud';
    }

    return 'ai'; // Default fallback
}

function getGraphicClass(provider, title) {
    const lowerProvider = provider.toLowerCase();
    const lowerTitle = title.toLowerCase();

    if (lowerProvider.includes('aws')) return 'aws-graphic';
    if (lowerProvider.includes('azure')) return 'cloud-graphic';
    if (lowerProvider.includes('google')) return 'cloud-graphic';
    if (lowerTitle.includes('python')) return 'python-graphic';
    if (lowerTitle.includes('security') || lowerTitle.includes('cissp')) return 'security-graphic';
    if (lowerTitle.includes('data')) return 'data-graphic';
    if (lowerTitle.includes('ai') || lowerTitle.includes('ml')) return 'ai-graphic';
    if (lowerTitle.includes('devops')) return 'devops-graphic';

    return 'cloud-graphic'; // Default
}

function createGraphic(provider, title) {
    const lowerProvider = provider.toLowerCase();
    const lowerTitle = title.toLowerCase();

    // AWS specific
    if (lowerProvider.includes('aws')) {
        return `
            <div class="aws-header">aws certification</div>
            <div class="aws-title">${title}</div>
            <div class="aws-badges">
                <div class="aws-badge">${provider}</div>
            </div>
        `;
    }

    // Python
    if (lowerTitle.includes('python')) {
        return `
            <div class="cert-logo">
                <i class="fab fa-python"></i>
            </div>
            <div class="cert-title-medium">python</div>
        `;
    }

    // Security
    if (lowerTitle.includes('security') || lowerTitle.includes('cissp')) {
        return `
            <div class="cert-title-large">Cybersecurity</div>
            <div class="cert-subtitle">Certification</div>
            <div class="cert-badge">OFFICIAL</div>
        `;
    }

    // AI/ML
    if (lowerTitle.includes('ai') || lowerTitle.includes('ml')) {
        return `
            <div class="ai-logo">AI</div>
            <div class="ai-title">Artificial Intelligence</div>
        `;
    }

    // Data
    if (lowerTitle.includes('data')) {
        return `
            <div class="data-title">Data Analyst</div>
            <div class="data-subtitle">Certification</div>
        `;
    }

    // Generic cloud
    return `
        <div class="cert-icon">
            <i class="fas fa-cloud"></i>
        </div>
        <div class="cert-title-medium">${provider}</div>
    `;
}

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
            const category = getCategoryFromProvider(cert.provider, cert.title);
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
            const category = getCategoryFromProvider(cert.provider, cert.title);
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
