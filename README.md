# 🏏 UCR Cricket Website

A modern, responsive website for the University Cricket Club built with React, Vite, and Tailwind CSS. This single-page application showcases team information, player statistics, achievements, match schedules, and more.

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.545.0-orange)

## ✨ Features

- **📱 Responsive Design** - Fully responsive layout that works seamlessly on all devices
- **🎨 Modern UI** - Clean, professional design with a dark theme and amber accents
- **🏆 Team Roster** - Comprehensive player profiles organized by role (Batsmen, Bowlers, All-Rounders)
- **📊 Statistics** - Detailed team and player statistics including top scorers and wicket takers
- **🎖️ Achievements** - Showcase of previous wins and championships
- **📅 Match Calendar** - Upcoming matches and fixtures
- **👨‍🏫 Coaching Staff** - Meet the coaching and support staff
- **📜 Timeline** - Interactive journey through the club's history
- **💰 Sponsorship Form** - Easy-to-use sponsorship and donation forms
- **📧 Contact Page** - Multiple ways to get in touch with the team
- **🚀 Fast Navigation** - Smooth client-side routing between pages

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) v19.1.1
- **Build Tool**: [Vite](https://vite.dev/) v7.1.7
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4.18
- **Icons**: [Lucide React](https://lucide.dev/) v0.545.0
- **Language**: JavaScript (ES6+)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v20.19+ or v22.12+ (recommended)
- **npm**: v10.0+ (comes with Node.js)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atontalapur/atontalapur.github.io.git
   cd ucr-cricket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173/` to view the application.

### Build for Production

To create a production-optimized build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
ucr-cricket/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── App.jsx         # Main App component
│   ├── CricketWebsite.jsx  # Main website component with all pages
│   ├── index.css       # Global styles and Tailwind imports
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── vite.config.js      # Vite configuration
└── README.md          # Project documentation
```

## 🎯 Available Pages

The website includes the following sections (accessible via the navigation bar):

1. **Home** - Hero section with quick stats and leadership highlights
2. **Roster** - Complete team roster organized by player roles
3. **Stats** - Team statistics and individual player rankings
4. **Achievements** - Historical wins and championships
5. **Calendar** - Upcoming match schedule
6. **Coaching** - Coaching staff and support team
7. **Timeline** - Club history and milestones
8. **Sponsor** - Sponsorship opportunities and donation form
9. **Contact** - Contact information and message form

## 🎨 Customization

### Colors

The website uses a custom color scheme defined in Tailwind CSS:
- **Primary**: Amber (amber-500)
- **Background**: Dark slate (slate-950, slate-900)
- **Text**: White and slate variants

To modify colors, update the Tailwind classes in `src/CricketWebsite.jsx`.

### Content

To update team information, player stats, or other content, edit the data arrays in `src/CricketWebsite.jsx`. Each page component contains its own data that can be easily modified.

## 📦 Dependencies

### Production
- `react`: ^19.1.1
- `react-dom`: ^19.1.1
- `lucide-react`: ^0.545.0

### Development
- `@vitejs/plugin-react`: ^5.0.4
- `tailwindcss`: ^3.4.18
- `postcss`: ^8.5.6
- `autoprefixer`: ^10.4.21
- `vite`: ^7.1.7
- `eslint`: ^9.36.0

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Known Issues

- Node.js version warning with v20.18.0 (functionality not affected)
- To resolve, upgrade to Node.js v20.19+ or v22.12+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Advaith Tontalapur** - [@atontalapur](https://github.com/atontalapur)

## 🙏 Acknowledgments

- Design inspiration from modern sports websites
- Icons provided by [Lucide Icons](https://lucide.dev/)
- Built with [Vite](https://vite.dev/) for optimal performance
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email cricket@university.edu or open an issue in the repository.

---

**Made with ❤️ for the University Cricket Club**
