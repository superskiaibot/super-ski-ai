# Snowline - Complete Setup Guide for Cursor

## 🎿 Welcome to Snowline
**Snowline** is a comprehensive skiing/snowboarding tracking application with mobile app (React Native/Expo), web app (Next.js 14), and backend (FastAPI, PostgreSQL, Redis, Kafka). This setup guide will get you running in Cursor.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Cursor** IDE installed
- **Git** for version control

## 🚀 Quick Start

### 1. Project Setup
```bash
# Clone or create your project directory
mkdir snowline-app
cd snowline-app

# Initialize the project (if starting fresh)
npm init -y

# Install core dependencies
npm install react react-dom @types/react @types/react-dom typescript
```

### 2. Install All Dependencies

```bash
# Core React and TypeScript
npm install react@latest react-dom@latest
npm install -D @types/react @types/react-dom typescript

# UI Framework and Styling
npm install tailwindcss@latest
npm install @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio

# Motion and Animations
npm install motion@latest

# UI Components (Shadcn/UI dependencies)
npm install @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-badge
npm install @radix-ui/react-button @radix-ui/react-card @radix-ui/react-checkbox
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch
npm install @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle
npm install @radix-ui/react-tooltip

# Icons
npm install lucide-react

# Charts and Data Visualization
npm install recharts

# Utilities
npm install clsx tailwind-merge class-variance-authority
npm install date-fns

# Build Tools (if using Vite)
npm install -D vite @vitejs/plugin-react
npm install -D @types/node

# Additional Utilities
npm install uuid
npm install -D @types/uuid
```

### 3. Environment Configuration

Create the necessary configuration files:

```bash
# Create TypeScript config
touch tsconfig.json

# Create Tailwind config  
touch tailwind.config.js

# Create Vite config (if using Vite)
touch vite.config.ts

# Create environment file
touch .env.local
```

## 📁 Critical Configuration Files

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  },
  "include": ["src", "components", "styles", "utils", "supabase"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "./components"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    port: 5173,
    open: true
  }
})
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Snowline Brand Colors
        'ultra-ice-blue': '#004cff',
        'midnight': '#07111a',
        'snow': '#ffffff',
        'avalanche-orange': '#ff5500',
        'glacier-blue': '#e6f3ff',
        'powder-gray': '#f8fafc',
        'mountain-green': '#22c55e',
        
        // Shadcn UI Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### package.json (essential scripts)
```json
{
  "name": "snowline-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

## 🗂️ Essential Missing Files

### index.html (root file)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Snowline - Ski Tracking & Social Platform</title>
    <meta name="description" content="Track your skiing adventures with precision GPS technology and connect with the skiing community." />
    <meta name="theme-color" content="#004cff" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### src/main.tsx (entry point)
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 🔧 Environment Variables

### .env.local
```bash
# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=Snowline
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

## 📦 Additional Required Utils

### lib/utils.ts (Shadcn utilities)
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}
```

## 🎯 Key Features & Architecture

### Core Application Features
- **GPS Tracking**: Real-time ski run tracking with Mapbox integration
- **Social Platform**: TikTok-style user profiles and social feed
- **Event System**: Ski For A Cure charity event with admin controls
- **Admin Console**: Platform and ski field administration
- **Premium System**: Pro vs Basic feature gates
- **NZ Ski Fields**: All 25+ New Zealand ski resorts included
- **3 Account Types**: Normal User, Ski Field Admin, Platform Admin

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Animations**: Motion (formerly Framer Motion)
- **UI Components**: Shadcn/UI with Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Maps**: Mapbox GL JS (requires API key)
- **Build Tool**: Vite

### Application Structure
```
├── App.tsx                 # Main application entry point
├── components/            # All React components
│   ├── ui/               # Shadcn/UI base components
│   ├── tracking/         # GPS and map components
│   ├── social/           # Social features
│   ├── event/            # Ski For A Cure event system
│   ├── admin/            # Admin console components
│   └── layout/           # Layout components
├── src/
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   └── types/            # TypeScript type definitions
└── styles/
    └── globals.css       # Global styles and design system
```

## 🚀 Running the Application

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Building for Production
```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🗺️ Mapbox Setup

### Getting Your Mapbox Token
1. Go to [mapbox.com](https://www.mapbox.com)
2. Create a free account
3. Go to Account → Access Tokens
4. Copy your default public token (starts with `pk.`)
5. Add to `.env.local` as `VITE_MAPBOX_ACCESS_TOKEN`

**Free Tier**: 50,000 map loads per month

## 🎿 User Accounts & Demo

The application includes demo accounts with different roles:
- **Regular Users**: Basic ski tracking and social features
- **Ski Field Admins**: Manage specific ski field operations  
- **Platform Admins**: Full system access and event management

See `DEMO_ACCOUNTS.md` for specific demo credentials.

## 🔧 Troubleshooting

### Common Issues

1. **Missing Dependencies**: Run `npm install` to install all required packages
2. **TypeScript Errors**: Ensure all path aliases are configured in `tsconfig.json`
3. **Build Errors**: Check that all imports use correct relative paths
4. **Map Not Loading**: Verify Mapbox token is correctly set in environment variables
5. **Styling Issues**: Ensure Tailwind CSS is properly configured and globals.css is imported

### Development Tips

- Use **Cursor's AI** to help with component development
- Follow the **8pt spacing grid** defined in globals.css
- Use **Snowline brand colors** defined in the design system
- Implement **mobile-first responsive design**
- Follow **TypeScript best practices** with proper type definitions

## 📚 Additional Resources

- **Guidelines.md**: Comprehensive development guidelines
- **README_GPS_MAPS_LOCATION.md**: GPS and location features
- **Attributions.md**: Third-party library credits
- **Design System**: Defined in `styles/globals.css`

## 🎯 Next Steps

1. **Install Dependencies**: Run the npm install commands above
2. **Configure Environment**: Set up `.env.local` with Mapbox token
3. **Start Development**: Run `npm run dev`
4. **Explore Features**: Test tracking, social features, and admin console
5. **Customize**: Modify components according to your needs

---

**Welcome to Snowline Development!** 🎿
*Building the future of ski tracking technology*

For questions or contributions, refer to the Guidelines.md or explore the comprehensive component library.