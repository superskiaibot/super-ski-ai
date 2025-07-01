# 🎿 Super Ski AI - Full Stack Ski Tracking App

A comprehensive ski tracking web application with live GPS tracking, weather integration, and session analytics.

## 🚀 Features

- **🗺️ Live GPS Tracking**: Log latitude, longitude, elevation with start/stop session controls
- **❄️ Session Dashboard**: Real-time stats, past sessions, and interactive maps
- **🌦️ Weather Overlay**: Current temperature and snowfall data via OpenWeather API
- **👤 User Authentication**: Secure email/password login with session management
- **📊 Analytics**: Distance, elevation gain, duration tracking per session
- **📱 Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance async API framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and serialization
- **JWT** - Secure authentication tokens

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** - Utility-first styling
- **Leaflet.js** - Interactive maps
- **Recharts** - Data visualization
- **React Hook Form** - Form management

## 🏃‍♂️ Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```
DATABASE_URL=postgresql://username:password@localhost/ski_tracker
SECRET_KEY=your-secret-key-here
OPENWEATHER_API_KEY=your-openweather-api-key
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAPBOX_TOKEN=your-mapbox-token (optional)
```

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set environment variables

## 📱 API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.
