# 🎿 Snowline - Ski Tracking & Social Platform

> **Comprehensive skiing/snowboarding tracking application with GPS technology, social features, and New Zealand ski field integration.**

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Mapbox Account** (free tier: 50,000 map loads/month)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Mapbox token to .env.local
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here

# Start development server
npm run dev
```

**🚀 Application will open at:** `http://localhost:5173`

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Animations**: Motion (formerly Framer Motion)
- **UI Components**: Shadcn/UI + Radix UI
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React

### Core Features
- **🗺️ GPS Tracking**: Real-time ski run tracking with Mapbox
- **👥 Social Platform**: TikTok-style profiles and community
- **🎿 Event System**: Admin-controlled charity events
- **⚡ Premium Features**: Pro vs Basic feature gates
- **🏔️ NZ Ski Fields**: All 25+ New Zealand resorts
- **👨‍💼 Admin Console**: Platform and ski field management

### Project Structure
```
├── App.tsx                    # Main application entry
├── components/               # React components
│   ├── ui/                  # Shadcn/UI base components
│   ├── tracking/            # GPS and map components
│   ├── social/              # Social platform features
│   ├── event/               # Event system components
│   └── admin/               # Admin console components
├── src/
│   ├── components/layout/   # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── constants/           # App constants
│   └── types/               # TypeScript definitions
└── styles/globals.css       # Design system & Tailwind
```

## 🎨 Design System

### Brand Colors
```css
--ultra-ice-blue: #004cff;    /* Primary brand */
--midnight: #07111a;          /* Dark text/backgrounds */
--snow: #ffffff;              /* Light backgrounds */
--avalanche-orange: #ff5500;  /* Alerts & CTAs */
--glacier-blue: #e6f3ff;     /* Light accents */
--powder-gray: #f8fafc;      /* Subtle backgrounds */
```

### Typography
- **Font**: Inter Variable
- **Scale**: Based on 8pt grid system
- **Weights**: 400 (Regular) → 700 (Bold)

### Component Classes
```css
.snowline-card              /* Standard cards */
.snowline-button-primary    /* Primary buttons */
.snowline-metric-display    /* Ski metrics */
.snowline-tracking-active   /* Live indicators */
```

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # TypeScript checking
```

### Environment Variables
```bash
# Required
VITE_MAPBOX_ACCESS_TOKEN=    # Mapbox API key

# Optional
VITE_SUPABASE_URL=           # Supabase backend
VITE_SUPABASE_ANON_KEY=      # Supabase public key
```

### Component Development
```typescript
// Use TypeScript for all components
interface ComponentProps {
  currentUser: User;
  onAction: () => void;
}

export function Component({ currentUser, onAction }: ComponentProps) {
  return (
    <div className="snowline-card p-6">
      <h2 className="text-2xl font-semibold mb-4">{/* Use design system */}</h2>
    </div>
  );
}
```

## 🎯 Key Features

### GPS Tracking System
- **Real-time location**: 1-second intervals
- **Battery optimized**: <10% drain per hour
- **Offline support**: 24+ hour capability
- **Mapbox integration**: 3D terrain visualization

### Social Platform
- **User profiles**: TikTok-style interface
- **Activity feed**: Share runs and achievements
- **Friend system**: Connect with other skiers
- **Privacy controls**: Granular sharing settings

### Admin System
- **Platform Admin**: Full system control
- **Ski Field Admin**: Resort-specific management
- **Event Controls**: Charity event administration
- **Analytics**: Comprehensive usage metrics

### Event System
- **Ski For A Cure**: Integrated charity events
- **Team participation**: Group challenges
- **Payment integration**: Donation processing
- **Live tracking**: Real-time event progress

## 🚀 Deployment

### Build Requirements
- Node.js 18+
- 2GB RAM minimum
- Mapbox API key configured

### Production Checklist
- [ ] Environment variables configured
- [ ] Mapbox token added
- [ ] TypeScript type checking passes
- [ ] Build completes successfully
- [ ] All routes accessible
- [ ] GPS tracking functional

## 📱 Mobile Support

### Progressive Web App (PWA)
- **Offline capability**: Core features work offline
- **App-like experience**: Add to home screen
- **Push notifications**: Event updates (planned)
- **Background sync**: Upload data when online

### Mobile Optimizations
- **Touch targets**: 44px minimum
- **Performance**: Optimized for mobile devices
- **Battery**: GPS power management
- **Network**: Efficient data usage

## 🔒 Security & Privacy

### Location Data
- **Local encryption**: GPS data encrypted at rest
- **User consent**: Explicit location permissions
- **Privacy controls**: Granular sharing settings
- **Data retention**: Configurable retention periods

### User Safety
- **Emergency features**: SOS functionality (planned)
- **Weather integration**: Safety warnings
- **Resort boundaries**: Stay within safe areas
- **Offline maps**: Continue navigation offline

## 📊 Performance

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### GPS Performance
- **Update frequency**: 1 second intervals
- **Accuracy**: ±3 meter average
- **Battery impact**: <10% per hour
- **Data compression**: 90%+ reduction

## 🤝 Contributing

### Development Workflow
1. **Fork & Clone**: Get the code
2. **Install**: `npm install`
3. **Configure**: Add environment variables
4. **Develop**: Make changes
5. **Test**: Ensure functionality
6. **Submit**: Create pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Formatting**: Use Prettier
- **Testing**: Add tests for new features

## 📞 Support

### Getting Help
- **Documentation**: Check SETUP_GUIDE.md
- **Issues**: Create GitHub issue
- **Community**: Join Discord (coming soon)
- **Email**: support@snowline.app (coming soon)

### Troubleshooting
- **Build errors**: Check TypeScript configuration
- **Map not loading**: Verify Mapbox token
- **GPS issues**: Check browser permissions
- **Performance**: Enable hardware acceleration

---

**Built with ❄️ by the Snowline Team**  
*Connecting skiers through technology*

🎿 **Happy Skiing!** 🏂