# 🎯 Chart Dashboard - Advanced Analytics & Visualization Platform

A modern, feature-rich analytics dashboard built with Next.js 15, TypeScript, and cutting-edge visualization libraries. This comprehensive platform combines real-time data visualization, interactive widgets, and seamless user experience across desktop and mobile devices.

> **🚧 Project Status**: This project is currently in active development and is being improved step by step. New components and features are continuously being added, and existing functionality is being refined and optimized.

## 🌟 Live Demo

**Experience the dashboard live at: [kirspeek.dev](https://kirspeek.dev)**

![Dashboard Preview](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Chart+Dashboard+Preview)

## ✨ Key Features

### 📊 **Advanced Data Visualization**

- **Interactive Charts**: Line, Bar, Radar, Chord, Sankey, and Bubble charts
- **Real-time Performance Metrics**: Dynamic radar charts with timeline views
- **Contribution Graphs**: GitHub-style activity heatmaps with analytics
- **Global Migration Flows**: Sankey diagrams for data flow visualization
- **Tech Investment Analysis**: Bubble charts for market cap vs growth analysis

### 🎵 **Spotify Music Integration**

- **Full Spotify Web API Integration**: Search, play, and control music
- **Embedded Player**: Seamless music playback within the dashboard
- **Playlist Management**: Create and manage custom playlists
- **Artist Top Tracks**: Discover trending music from favorite artists
- **Like/Save Functionality**: Save tracks for later listening

### 💰 **Financial & Wallet Management**

- **Multi-Currency Wallet**: Support for various payment methods
- **Spending Analytics**: Visual breakdown of expenses and income
- **Credit Card Integration**: Real-time card validation and processing
- **Aggregated Spending Widget**: Comprehensive financial overview
- **Transaction Timeline**: Visual history of financial activities

### 🌍 **Weather & Location Services**

- **Multi-City Weather**: Real-time weather for multiple locations
- **Interactive Maps**: Mapbox integration with location-based data
- **Weather Animations**: Dynamic weather effects (rain, sun, clouds)
- **Forecast Data**: 7-day weather predictions with detailed metrics

### ⏰ **Time & Productivity Tools**

- **World Clock**: Multiple timezone support with automatic detection
- **Advanced Timer**: Pomodoro-style productivity timer
- **Calendar Integration**: Event management and scheduling
- **Timeline Rings**: Visual project and task management

### 📱 **Responsive Design**

- **Mobile-First Approach**: Optimized for phones, tablets, and desktop
- **Touch Gestures**: Swipe navigation for mobile devices
- **Adaptive Layouts**: Dynamic grid systems that respond to screen size
- **Progressive Web App**: Installable with offline capabilities

### 🎨 **Modern UI/UX**

- **Dark/Light Theme**: Automatic theme switching with system preference
- **Smooth Animations**: Framer Motion powered transitions
- **Glassmorphism Effects**: Modern design with backdrop blur effects
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Technical Implementation

### **Core Technologies**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with custom design system
- **State Management**: React Context API with custom hooks
- **Animations**: Framer Motion for smooth transitions

### **Data Visualization Stack**

- **Charts**: Recharts for standard charts, D3.js for custom visualizations
- **Maps**: Mapbox GL JS for interactive maps
- **3D Graphics**: Three.js for advanced 3D visualizations
- **Real-time Data**: WebSocket connections for live updates

### **API Integrations**

- **Spotify Web API**: Full music streaming integration
- **Weather APIs**: OpenWeatherMap for weather data
- **Payment Processing**: Credit card validation and processing
- **Geolocation**: Browser APIs for location services

### **Performance Optimizations**

- **Code Splitting**: Dynamic imports for optimal bundle sizes
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Strategic caching for API responses and static data
- **Bundle Analysis**: Optimized dependencies and tree shaking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Spotify Developer Account (for music features)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd my-chart-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Add your API keys for Spotify, Weather, etc.
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Widget Showcase

### **Data Visualization Widgets**

- **Line Charts**: Sales performance and trend analysis
- **Bar Charts**: Quarterly overviews and comparisons
- **Radar Charts**: Multi-dimensional performance metrics
- **Sankey Charts**: Global migration and data flow visualization
- **Bubble Charts**: Tech investment and market analysis
- **Chord Charts**: Relationship and connection mapping

### **Utility Widgets**

- **Clock Widget**: World time with multiple timezone support
- **Weather Widget**: Real-time weather with animated backgrounds
- **Timer Widget**: Productivity timer with multiple modes
- **Calendar Widget**: Event management and scheduling
- **Map Widget**: Interactive location-based data

### **Financial Widgets**

- **Wallet Widget**: Multi-currency financial management
- **Spending Widget**: Expense tracking and analytics
- **Contribution Graph**: Financial activity heatmap
- **Timeline Widget**: Transaction history visualization

### **Entertainment Widgets**

- **Music Widget**: Full Spotify integration with search and playback
- **Wheel Widget**: Interactive decision-making tool

## 🔧 Configuration

### **Theme Customization**

The dashboard supports extensive theming through CSS custom properties and Tailwind configuration. Themes can be customized in `src/theme/colorsTheme.ts`.

### **Widget Configuration**

Each widget can be configured through props and context providers. Widget state is managed through React Context for optimal performance.

### **API Configuration**

API endpoints are centralized in `src/apis/constants.ts` for easy configuration and maintenance.

## 📱 Mobile Experience

The dashboard provides a unique mobile experience with:

- **Swipe Navigation**: Touch gestures for widget navigation
- **Full-Screen Widgets**: Optimized layouts for mobile viewing
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Offline Support**: Cached data for offline viewing

## 🎨 Design System

### **Color Palette**

- **Primary**: Modern blue gradients
- **Secondary**: Accent colors for highlights
- **Neutral**: Grayscale for text and backgrounds
- **Semantic**: Success, warning, error states

### **Typography**

- **Primary Font**: Inter (clean, modern)
- **Monospace**: Space Mono (for data display)
- **Responsive**: Fluid typography scaling

### **Components**

- **Glassmorphism**: Backdrop blur effects
- **Micro-interactions**: Subtle hover and focus states
- **Loading States**: Skeleton screens and progress indicators

## 🔒 Security Features

- **API Key Management**: Secure environment variable handling
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Client and server-side validation
- **Rate Limiting**: API request throttling
- **HTTPS Enforcement**: Secure connections only

## 🚀 Deployment

The application is optimized for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

### **Build Commands**

```bash
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify** for the comprehensive Web API
- **Mapbox** for mapping services
- **Recharts** for chart components
- **Tailwind CSS** for the design system
- **Next.js** team for the amazing framework

---

**Built with ❤️ by Kirspeek**

_Experience the future of data visualization at [kirspeek.dev](https://kirspeek.dev)_
