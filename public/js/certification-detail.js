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

    // Update page title
    document.title = `${cert.title} - KadaSkill`;

    // Header
    document.getElementById('cert-title').textContent = cert.title;
    document.getElementById('cert-subtitle').textContent = cert.subtitle || cert.level;
    document.getElementById('cert-category').textContent = cert.category;
    document.getElementById('cert-duration').textContent = cert.estimated_duration_hours || 0;
    document.getElementById('cert-level').textContent = cert.level;

    // Overview/Description
    document.getElementById('cert-description').textContent = cert.overview || cert.description || 'No description available.';

    // Prerequisites
    renderPrerequisites(cert.prerequisites);

    // Study Guide Steps
    renderGuideSteps(cert.study_resources);
}

// ============================================
// Render Prerequisites
// ============================================

function renderPrerequisites(prerequisites) {
    const listContainer = document.getElementById('prerequisites-list');

    if (!prerequisites || prerequisites.length === 0) {
        listContainer.innerHTML = '<li>No specific prerequisites required</li>';
        return;
    }

    listContainer.innerHTML = prerequisites.map(prereq =>
        `<li><i class="fas fa-check-circle"></i> ${prereq}</li>`
    ).join('');
}

// ============================================
// Render Guide Steps
// ============================================

function renderGuideSteps(studyResources) {
    const stepsContainer = document.getElementById('guide-steps');
    const cert = currentCertification;

    // Simple default guide
    let stepsHTML = `
        <div class="guide-step">
            <div class="step-number">1</div>
            <div class="step-content">
                <h3 class="step-title">Review Official Documentation</h3>
                <p class="step-description">Start with the official documentation from ${cert.provider || 'the certification provider'}.</p>
                <div class="resources-list">
                    <div class="resource-item">
                        <div class="resource-info">
                            <i class="fas fa-book"></i>
                            <div class="resource-details">
                                <h4 class="resource-title">Official ${cert.provider || 'Provider'} Documentation</h4>
                                <p class="resource-desc">Exam Code: ${cert.exam_code || 'N/A'}</p>
                            </div>
                        </div>
                        ${cert.official_url ? `<a href="${cert.official_url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            Visit Resource <i class="fas fa-external-link-alt"></i>
                        </a>` : ''}
                    </div>
                </div>
            </div>
        </div>
        <div class="guide-step">
            <div class="step-number">2</div>
            <div class="step-content">
                <h3 class="step-title">Practice with Exercises</h3>
                <p class="step-description">Test your knowledge with practice exercises on KadaSkill.</p>
                <div class="resources-list">
                    <div class="resource-item">
                        <div class="resource-info">
                            <i class="fas fa-dumbbell"></i>
                            <div class="resource-details">
                                <h4 class="resource-title">Practice Exercises</h4>
                                <p class="resource-desc">Complete practice questions to test your understanding</p>
                            </div>
                        </div>
                        <a href="practice.html" class="resource-link">
                            Go to Practice <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="guide-step">
            <div class="step-number">3</div>
            <div class="step-content">
                <h3 class="step-title">Schedule Your Exam</h3>
                <p class="step-description">Once you feel prepared, schedule your certification exam.</p>
                <div class="resources-list">
                    <div class="resource-item">
                        <div class="resource-info">
                            <i class="fas fa-calendar-check"></i>
                            <div class="resource-details">
                                <h4 class="resource-title">Schedule Exam</h4>
                                <p class="resource-desc">Book your exam through the official provider</p>
                            </div>
                        </div>
                        ${cert.official_url ? `<a href="${cert.official_url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            Schedule Now <i class="fas fa-external-link-alt"></i>
                        </a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    stepsContainer.innerHTML = stepsHTML;
}
