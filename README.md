# KadaSkill Learning Platform

A modern, full-featured learning management system for AI, Cybersecurity, and Cloud skills, built with vanilla HTML, CSS, JavaScript, and powered by Supabase.

## 🚀 Features

### Core Platform
- **User Authentication** - Email/password and OAuth (Google, Microsoft, Facebook, LinkedIn)
- **Course Management** - Browse, enroll, and complete courses with progress tracking
- **Practice Exercises** - Interactive coding challenges with automated testing
- **Certification Tracking** - Study paths for professional certifications (AWS, Azure, CompTIA, etc.)
- **Gamification System** - XP, levels, badges, streaks, and leaderboards
- **Admin Panel** - Complete content management system for courses, users, and analytics

### Technical Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Real-time Data** - Supabase backend with PostgreSQL database
- **Row Level Security** - Database-enforced access control
- **Fast Performance** - Optimized with Bun runtime
- **Comprehensive Documentation** - Full API, architecture, and developer guides

## 📋 Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Node.js (optional, for additional development tools)

## 🛠️ Installation & Setup

1. **Clone or create the project directory:**
   ```bash
   mkdir kadaskill-frontend
   cd kadaskill-frontend
   ```

2. **Create the project structure:**
   ```
   kadaskill-frontend/
   ├── package.json
   ├── server.js
   ├── README.md
   ├── public/
   │   ├── index.html
   │   ├── css/
   │   │   └── style.css
   │   ├── js/
   │   │   └── script.js
   │   └── images/
   │       ├── logo.png
   │       ├── robot-hero.png
   │       ├── robot-welcome.png
   │       ├── robot-about.png
   │       ├── robot-mission.png
   │       ├── robot-vision.png
   │       ├── robot-contact.png
   │       └── team/
   │           ├── alfred.jpg
   │           ├── dwiniel.jpg
   │           ├── princess.jpg
   │           ├── sophia.jpg
   │           ├── kenn.jpg
   │           ├── chad.jpg
   │           ├── samuel.jpg
   │           └── patrick.jpg
   ```

3. **Install dependencies:**
   ```bash
   bun install
   ```

4. **Add placeholder images:**
   Since the actual images aren't provided, you'll need to add placeholder images to the `public/images/` directory. You can:
   - Create simple colored rectangles as placeholders
   - Use online placeholder services like https://placeholder.com/
   - Add your own images with the specified names

5. **Start the development server:**
   ```bash
   bun run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000` to view the website

## 🎨 Customization

### Colors
The main color scheme can be modified in `public/css/style.css`:
- **Primary Blue**: `#4169E1`
- **Orange Accent**: `#FF6B35`
- **Purple Gradient**: `#667eea` to `#764ba2`
- **Success Green**: `#28a745`

### Content
Update the content by editing `public/index.html`:
- Hero section text and call-to-action
- Team member information
- Contact details
- Company information

### Styling
Modify the appearance by editing `public/css/style.css`:
- Layout and spacing
- Typography and fonts
- Colors and gradients
- Animations and transitions

### Functionality
Enhance interactivity by editing `public/js/script.js`:
- Form validation and submission
- Animation triggers
- User interactions
- API integrations

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔧 Development Commands

```bash
# Start development server
bun run dev

# Start production server
bun run start

# Install new dependencies
bun add package-name

# Remove dependencies
bun remove package-name
```

## 🎯 Key Sections

1. **Hero Section** - Main landing with sign-up form
2. **Welcome Section** - Introduction to KadaSkill
3. **About Section** - Company mission and vision
4. **Team Section** - Team member profiles
5. **Contact Section** - Contact information and social links
6. **Footer** - Additional links and information

## 🚀 Deployment Options

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Drag and drop the `public` folder to Netlify
2. Or connect your Git repository

### Traditional Hosting
1. Upload the `public` folder contents to your web server
2. Ensure your server can serve static files

## 📚 Documentation

Comprehensive documentation is available to help you understand, use, and contribute to KadaSkill:

### For Users
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete guide for learners and administrators
  - Getting started and account creation
  - Browsing and enrolling in courses
  - Practice exercises and certifications
  - Profile management and gamification
  - Admin panel operations

### For Developers
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Developer onboarding and workflows
  - Development environment setup
  - Project structure and organization
  - Coding standards and conventions
  - Common development tasks
  - Debugging tips and troubleshooting

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
  - Authentication API (signup, login, OAuth)
  - Database API patterns and queries
  - Storage API for file uploads
  - Error handling and best practices

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
  - High-level architecture diagrams
  - Technology stack justification
  - Data architecture and database schema
  - Security architecture
  - Scalability considerations

- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - UI component documentation
  - Navigation components
  - Card components (courses, certifications, exercises)
  - Form components and buttons
  - Modal and notification patterns

### Operations & Deployment
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment instructions
  - Environment configuration
  - Deployment options (Vercel, Netlify, VPS)
  - Database migration procedures
  - Monitoring and maintenance

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing strategies and procedures
  - Manual testing checklists
  - Automated testing recommendations
  - Browser and responsive testing
  - Security testing procedures

### Project Management
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and code of conduct
- **[SECURITY.md](./SECURITY.md)** - Security policies and vulnerability reporting

### Database
- **[sql/DATABASE_README.md](./sql/DATABASE_README.md)** - Database documentation
  - Schema overview and ERD
  - Common queries and operations
  - RLS policies and triggers
  - Performance optimization

---

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support

For questions or support:
- **Documentation**: Check the comprehensive guides above
- **Issues**: Report bugs via [GitHub Issues](https://github.com/your-org/kadaskill/issues)
- **Email**: support@kadaskill.com
- **Developer Questions**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

**Quick Start**:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [coding standards](./DEVELOPER_GUIDE.md#coding-standards)
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for KadaSkill by Dekastrath Solutions Inc.

---

## 🔗 Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Server**: Express.js with Bun runtime
- **Database**: PostgreSQL 15 with Row Level Security
- **Deployment**: Vercel/Netlify (recommended) or traditional hosting
- **Version Control**: Git

---

**Built with ❤️ by Dekastrath Solutions Inc.**

For more information, visit our comprehensive [documentation](#-documentation).