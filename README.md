# KadaSkill Frontend

A modern, responsive landing page for the KadaSkill learning platform built with vanilla HTML, CSS, and JavaScript, designed to run with Bun.

## 🚀 Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Interactive Elements** - Hover effects, form handling, and scroll animations
- **Team Showcase** - Professional team member profiles with hover effects
- **Contact Integration** - Social media links and contact information
- **Fast Performance** - Optimized for speed with Bun runtime

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

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support

For questions or support regarding this frontend implementation:
- Review the code comments for implementation details
- Check the browser console for any JavaScript errors
- Ensure all image files are properly placed in the images directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for KadaSkill by Dekastrath Solutions Inc.

---

**Note**: This is a frontend-only implementation. For full functionality, you'll need to integrate with a backend service for user authentication, course management, and other dynamic features.