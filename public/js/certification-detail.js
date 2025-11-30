// ============================================
// Certification Detail Page - Dynamic Loading
// ============================================

// Use the global supabase client from script.js

// Global state
let currentCertification = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Get certification slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const certSlug = urlParams.get('cert');

    if (!certSlug) {
        window.location.href = 'certification.html';
        return;
    }

    // Load certification data
    await loadCertification(certSlug);
});

// ============================================
// Load Certification Data
// ============================================

async function loadCertification(slug) {
    try {
        const { data: cert, error } = await supabase
            .from('certifications')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) throw error;

        if (!cert) {
            alert('Certification not found');
            window.location.href = 'certification.html';
            return;
        }

        currentCertification = cert;
        renderCertification();

    } catch (error) {
        console.error('Error loading certification:', error);
        alert('Failed to load certification. Redirecting back...');
        window.location.href = 'certification.html';
    }
}

// ============================================
// Render Certification Details
// ============================================

function renderCertification() {
    const cert = currentCertification;
    const contentArea = document.getElementById('content-area');

    // Update page title
    document.title = `${cert.title} - KadaSkill`;

    // Build prerequisites HTML
    let prereqsHTML = '<li>No specific prerequisites required</li>';
    if (cert.prerequisites && cert.prerequisites.length > 0) {
        prereqsHTML = cert.prerequisites.map(p =>
            `<li><i class="fas fa-check-circle"></i> ${p}</li>`
        ).join('');
    }

    // Build study resources HTML (if any)
    let resourcesHTML = '';
    if (Array.isArray(cert.study_resources) && cert.study_resources.length > 0) {
        const resourceItems = cert.study_resources.map((res, index) => {
            const type = (res.type || 'documentation').toLowerCase();
            const icon = type === 'video' ? 'fa-video'
                : type === 'practice' ? 'fa-dumbbell'
                : type === 'article' ? 'fa-file-alt'
                : type === 'course' ? 'fa-graduation-cap'
                : 'fa-book';

            const title = res.title || res.url || `Resource ${index + 1}`;
            const url = res.url || '#';

            return `
                <li>
                    <i class="fas ${icon}"></i>
                    ${url !== '#' ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>` : `<span>${title}</span>`}
                    <span style="margin-left: 8px; font-size: 0.875rem; color: #6b7280; text-transform: capitalize;">(${type})</span>
                </li>
            `;
        }).join('');

        resourcesHTML = `
            <div class="section-box">
                <h2>Study Resources</h2>
                <ul class="prereq-list">
                    ${resourceItems}
                </ul>
            </div>
        `;
    }

    // Use icon_url from database
    const imageUrl = cert.icon_url || 'images/certifications/placeholder.png';

    // Build the page content
    const html = `
        <div class="cert-header-box">
            <div class="cert-header-image">
                <img src="${imageUrl}" 
                     alt="${cert.title}" 
                     onerror="this.src='images/certifications/placeholder.png'; this.onerror=null;">
            </div>
            <div class="cert-header-content">
                <h1>${cert.title}</h1>
                <p>${cert.subtitle || cert.level}</p>
                <div class="cert-badges">
                    <span class="cert-badge">${cert.category}</span>
                    <span class="cert-badge">${cert.level}</span>
                    <span class="cert-badge"><i class="fas fa-clock"></i> ${cert.estimated_duration_hours || 0} hours</span>
                </div>
            </div>
        </div>

        <div class="section-box">
            <h2>Overview</h2>
            <p>${cert.overview || cert.description || 'No description available.'}</p>
        </div>

        <div class="section-box">
            <h2>Prerequisites</h2>
            <ul class="prereq-list">
                ${prereqsHTML}
            </ul>
        </div>

        ${resourcesHTML}

        <div class="section-box">
            <h2>How to Get This Certification</h2>
            <p style="margin-bottom: 25px;">Follow these steps to prepare for and obtain this certification:</p>

            <div class="guide-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h3>Review Official Documentation</h3>
                    <p>Start with the official documentation from ${cert.provider || 'the certification provider'}.</p>
                    <p><strong>Exam Code:</strong> ${cert.exam_code || 'N/A'}</p>
                    ${cert.official_url ? `<a href="${cert.official_url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                        Visit Official Site <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                </div>
            </div>

            <div class="guide-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h3>Practice with Exercises</h3>
                    <p>Test your knowledge with practice exercises on KadaSkill to reinforce your learning.</p>
                    <a href="practice.html" class="resource-link">
                        Go to Practice <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>

            <div class="guide-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h3>Schedule Your Exam</h3>
                    <p>Once you feel prepared, schedule your certification exam through the official provider.</p>
                    ${cert.official_url ? `<a href="${cert.official_url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                        Schedule Now <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `;

    contentArea.innerHTML = html;
}
