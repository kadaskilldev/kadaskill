# Contributing to KadaSkill

Thank you for your interest in contributing to KadaSkill! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Coding Standards](#coding-standards)
7. [Commit Message Guidelines](#commit-message-guidelines)
8. [Pull Request Process](#pull-request-process)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes**:
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report**:
- Check the [issue tracker](https://github.com/your-org/kadaskill/issues) to see if it's already reported
- Try to reproduce the issue with the latest version
- Collect information about the bug

**Bug Report Template**:
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**:
- Browser: [e.g. Chrome 120]
- OS: [e.g. macOS 14]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

### Suggesting Features

**Feature Request Template**:
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

### Contributing Code

1. **Find an Issue**: Look for issues labeled `good first issue` or `help wanted`
2. **Claim the Issue**: Comment on the issue to let others know you're working on it
3. **Fork the Repo**: Create a fork of the repository
4. **Create a Branch**: Create a feature branch for your changes
5. **Make Changes**: Implement your changes following our coding standards
6. **Test**: Ensure all tests pass and add new tests if needed
7. **Submit PR**: Create a pull request with a clear description

---

## Development Setup

### Prerequisites

- Bun v1.0+ or Node.js v18+
- Git
- Code editor (VSCode recommended)

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/kadaskill.git
cd kadaskill

# 2. Add upstream remote
git remote add upstream https://github.com/original-org/kadaskill.git

# 3. Install dependencies
bun install

# 4. Start development server
bun run dev

# 5. Open browser
open http://localhost:3000
```

### Development Workflow

```bash
# 1. Create a new branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... edit files ...

# 3. Test your changes
# Manual testing in browser

# 4. Commit your changes
git add .
git commit -m "feat: add new feature"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Create pull request on GitHub
```

---

## Making Changes

### Branch Naming

Use descriptive branch names:

```bash
# Features
feature/add-dark-mode
feature/implement-notifications

# Bug fixes
fix/course-enrollment-error
fix/profile-avatar-upload

# Documentation
docs/update-api-reference
docs/add-testing-guide

# Refactoring
refactor/optimize-queries
refactor/improve-auth-flow
```

### File Organization

- Place HTML files in `public/`
- Place CSS files in `public/css/`
- Place JavaScript files in `public/js/`
- Place images in `public/images/`

### Code Style

Follow our [coding standards](#coding-standards) below.

---

## Submitting Changes

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Comments added for complex logic
- [ ] No `console.log` statements left in code
- [ ] Changes tested manually in browser
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] No linting errors
- [ ] Commit messages follow conventions

### Pull Request Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done:
- [ ] Manual testing
- [ ] Browser compatibility tested
- [ ] Responsive design tested

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
```

---

## Coding Standards

### HTML

```html
<!-- Use semantic HTML5 elements -->
<header>, <nav>, <main>, <section>, <article>, <footer>

<!-- Use BEM-like class naming -->
<div class="course-card">
    <h3 class="course-card__title">Title</h3>
    <p class="course-card__description">Description</p>
</div>

<!-- Include accessibility attributes -->
<button aria-label="Close" aria-expanded="false">
    Close
</button>
```

### CSS

```css
/* Use BEM methodology */
.block { }
.block__element { }
.block__element--modifier { }

/* Use CSS variables for theming */
:root {
    --color-primary: #4169E1;
    --spacing-unit: 8px;
}

/* Mobile-first responsive design */
.container {
    padding: 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}
```

### JavaScript

```javascript
// Use const/let, never var
const API_URL = 'https://api.example.com';
let currentUser = null;

// Use camelCase for variables and functions
function loadUserProfile() { }

// Use async/await for asynchronous operations
async function fetchData() {
    try {
        const { data, error } = await supabase.from('table').select('*');

        if (error) {
            console.error('Error:', error);
            return;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Document complex functions
/**
 * Calculates user level based on total XP
 * @param {number} totalXp - User's total XP
 * @returns {number} Calculated level
 */
function calculateLevel(totalXp) {
    return Math.floor(Math.sqrt(totalXp / 100));
}

// Use early returns to reduce nesting
function validateUser(user) {
    if (!user) return false;
    if (!user.email) return false;
    return true;
}
```

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
# Good commits
git commit -m "feat(auth): add OAuth login support"
git commit -m "fix(course): resolve enrollment duplication issue"
git commit -m "docs(api): update authentication endpoints"
git commit -m "refactor(home): optimize dashboard loading"

# Bad commits
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

---

## Pull Request Process

### 1. Create Pull Request

- Use our [PR template](#pull-request-template)
- Provide clear title and description
- Link related issues (e.g., "Closes #123")
- Add screenshots for UI changes

### 2. Code Review

- At least one approval required
- Address all review comments
- Make requested changes promptly
- Respond to reviewer questions

### 3. Merge

- **Squash and merge** (preferred for feature branches)
- **Rebase and merge** (for clean history)
- **Merge commit** (for complex features)

### 4. After Merge

- Delete feature branch
- Update related issues
- Celebrate! 🎉

---

## Getting Help

### Where to Ask Questions

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For general questions
- **Pull Request Comments**: For implementation questions
- **Email**: dev@kadaskill.com

### Response Time

- We aim to respond to issues within 2-3 business days
- PRs are typically reviewed within 1 week

---

## Recognition

Contributors will be recognized in:
- [CHANGELOG.md](./CHANGELOG.md) for their contributions
- GitHub contributors page
- Release notes (for significant contributions)

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Additional Resources

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures

---

**Thank you for contributing to KadaSkill!** 🚀

**Last Updated**: 2025-12-18
**Version**: 1.0.0
