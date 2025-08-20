# SnowLine - Development Guidelines

## Mapbox Integration Setup

### Step 1: Get Your Mapbox Access Token
1. Go to [https://www.mapbox.com](https://www.mapbox.com)
2. Sign up for a free account or log in
3. Navigate to your Account page
4. Go to the "Access tokens" section
5. Copy your default public token (starts with `pk.`)

### Step 2: ✅ Token Configured
Your Mapbox token is now properly configured in the application:
- **Token**: `snowline-dev` account token is active
- **Location**: `/src/constants/index.ts` in the `MAPBOX_CONFIG` section
- **Status**: Ready for use with 50,000 free map loads per month

### Step 3: Verify Integration
- The map should load automatically when you visit the tracking page
- If you see an error message, double-check your token
- Mapbox free tier includes 50,000 map loads per month

### Map Features
- **3D Terrain**: Enhanced elevation visualization for ski slopes
- **Real-time GPS tracking**: Live location updates and trail recording
- **Resort markers**: Visual indicators for ski areas
- **Multiple styles**: Terrain, satellite, and hybrid views
- **Touch controls**: Pan, zoom, and rotate optimized for mobile

## Brand Identity

### Application Name
**SnowLine** - A premium ski tracking and social platform that connects passionate skiers through precision GPS technology and community features.

### Brand Personality
- **Precision**: Advanced GPS tracking and detailed analytics
- **Community**: Social features that bring skiers together
- **Adventure**: Celebrating the thrill of mountain exploration
- **Safety**: Mountain safety and responsible skiing practices

### Color Palette
```css
/* Primary Brand Colors */
--ultra-ice-blue: #004cff;    /* Primary brand color */
--midnight: #07111a;          /* Dark backgrounds and text */
--snow: #ffffff;              /* Clean backgrounds and text */
--avalanche-orange: #ff5500;  /* Alerts and call-to-action */

/* Extended Palette */
--glacier-blue: #e6f3ff;     /* Light backgrounds */
--powder-gray: #f8fafc;      /* Subtle backgrounds */
--mountain-green: #22c55e;   /* Success states */
--warning-yellow: #f59e0b;   /* Warning states */
--danger-red: #ef4444;       /* Error states */
```

### Typography
- **Primary Font**: Inter Variable
- **Weight Scale**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Spacing Grid**: 8pt base system (8px, 16px, 24px, 32px, etc.)

## Design System

### Component Architecture
```
/components
├── ui/                    # Shadcn/UI base components
├── tracking/             # GPS and map components
├── social/               # Social features
├── radio/               # Ski radio system
└── dashboard/           # Analytics and overview
```

### Design Principles

#### 1. Mobile-First Responsive Design
- Start with mobile layout (320px+)
- Progressive enhancement for tablet (768px+) and desktop (1024px+)
- Touch-friendly interface with 44px minimum tap targets

#### 2. Accessibility Standards
- WCAG 2.1 AA compliance
- Proper semantic HTML structure
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode support

#### 3. Performance Optimization
- Lazy loading for images and components
- Code splitting for route-based optimization
- Efficient GPS data processing
- Battery-conscious background operations

### Component Standards

#### GPS Tracking Components
```typescript
// Standard GPS data structure
interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  timestamp: Date;
  speed?: number;
}

// Tracking state management
interface TrackingState {
  isActive: boolean;
  isPaused: boolean;
  startTime: Date | null;
  currentStats: TrackingStats;
}
```

#### UI Component Guidelines
- Use shadcn/ui components as base
- Extend with ski-specific functionality
- Maintain consistent spacing (8pt grid)
- Follow established color patterns

### Code Quality Standards

#### TypeScript Usage
- Strict TypeScript configuration
- Proper type definitions for all props
- Interface definitions for complex objects
- Generic types for reusable components

#### React Best Practices
- Functional components with hooks
- Proper useEffect dependencies
- Error boundaries for robustness
- Performance optimization with useMemo/useCallback

#### State Management
- Local state with useState for component-specific data
- Context for shared application state
- Persistent storage for user preferences
- Efficient GPS data handling

### User Experience Guidelines

#### Navigation Patterns
- Bottom tab navigation for mobile
- Sidebar navigation for desktop
- Breadcrumb navigation for deep pages
- Clear visual hierarchy

#### Feedback Systems
- Toast notifications for actions
- Loading states for async operations
- Error handling with helpful messages
- Progressive disclosure for complex features

#### Data Visualization
- Clear, readable charts for ski statistics
- Real-time updates during tracking
- Comparative analytics (previous runs, friends)
- Interactive map features

### Development Workflow

#### File Organization
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `TrackingDashboard`)
- **Files**: kebab-case (e.g., `tracking-dashboard.tsx`)
- **Functions**: camelCase (e.g., `calculateDistance`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_TRACKING_POINTS`)

#### Testing Strategy
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for GPS functionality
- End-to-end tests for critical user flows

### Security & Privacy

#### Location Data Protection
- Encrypted local storage for GPS tracks
- User consent for location sharing
- Granular privacy controls
- Data retention policies

#### User Data Security
- Secure authentication practices
- Input validation and sanitization
- Protection against common vulnerabilities
- Regular security audits

### Performance Benchmarks

#### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

#### GPS Performance
- Location updates: ≤ 1 second intervals
- Battery optimization: < 10% drain per hour
- Data compression: 90%+ size reduction
- Offline capability: 24+ hours

### Brand Voice & Messaging

#### Tone of Voice
- **Encouraging**: Motivate users to explore and improve
- **Informative**: Provide clear, actionable insights
- **Adventurous**: Celebrate the excitement of skiing
- **Safety-Conscious**: Promote responsible mountain practices

#### Content Guidelines
- Use active voice and clear language
- Include relevant skiing terminology
- Provide context for technical features
- Celebrate user achievements and milestones

### Internationalization

#### Language Support
- Primary: English (US)
- Planned: French, German, Italian, Japanese
- Measurement units: Metric and Imperial
- Date/time formats: Locale-specific

#### Cultural Considerations
- Respect local skiing traditions
- Adapt content for regional snow conditions
- Include relevant safety information by region
- Support local emergency contact systems

---

**SnowLine Development Team**
*Building the future of ski tracking technology* 🎿

For questions or contributions, please refer to our development documentation or contact the core team.