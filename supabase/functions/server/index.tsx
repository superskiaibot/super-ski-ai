import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import skiForACureApp from './ski-for-a-cure.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logging middleware
app.use('*', logger(console.log));

// Health check endpoint
app.get('/make-server-7c3f937b/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'SnowLine Backend Server'
  });
});

// Mount Ski for a Cure routes
app.route('/make-server-7c3f937b/ski-for-a-cure', skiForACureApp);

// Default route
app.get('/make-server-7c3f937b', (c) => {
  return c.json({ 
    message: 'SnowLine Backend Server',
    version: '1.0.0',
    services: [
      'Ski for a Cure Event Management',
      'User Tracking',
      'Team Management',
      'Fundraising Analytics'
    ],
    endpoints: {
      'GET /health': 'Health check',
      'GET /ski-for-a-cure/event': 'Event information',
      'POST /ski-for-a-cure/join': 'Join event',
      'GET /ski-for-a-cure/participation': 'Get participation info',
      'POST /ski-for-a-cure/tracking/update': 'Update tracking stats',
      'GET /ski-for-a-cure/leaderboards': 'Get leaderboards',
      'POST /ski-for-a-cure/team/invite': 'Invite team member',
      'PUT /ski-for-a-cure/team/update': 'Update team info',
      'GET /ski-for-a-cure/stats': 'Event statistics'
    }
  });
});

// Example user management endpoints (extend as needed)
app.post('/make-server-7c3f937b/users/profile', async (c) => {
  try {
    // Handle user profile updates
    const body = await c.req.json();
    console.log('Profile update request:', body);
    
    return c.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

app.get('/make-server-7c3f937b/users/stats/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Mock user stats - in real app, fetch from database
    const stats = {
      userId,
      totalRuns: Math.floor(Math.random() * 100),
      totalVertical: Math.floor(Math.random() * 50000),
      totalDistance: Math.floor(Math.random() * 500),
      averageSpeed: Math.floor(Math.random() * 60) + 20,
      bestRun: {
        date: new Date().toISOString(),
        vertical: Math.floor(Math.random() * 1000),
        maxSpeed: Math.floor(Math.random() * 80) + 40
      }
    };
    
    return c.json(stats);
  } catch (error) {
    console.error('User stats error:', error);
    return c.json({ error: 'Failed to fetch user stats' }, 500);
  }
});

// Ski field management endpoints
app.get('/make-server-7c3f937b/ski-fields', async (c) => {
  try {
    // Mock ski fields data - in real app, fetch from database
    const skiFields = [
      {
        id: 'coronet-peak',
        name: 'Coronet Peak',
        region: 'Otago',
        status: 'open',
        snowDepth: 145,
        liftsOpen: 8,
        trailsOpen: 42,
        weather: {
          temperature: -2,
          conditions: 'snowing',
          visibility: 'good'
        }
      },
      {
        id: 'the-remarkables',
        name: 'The Remarkables',
        region: 'Otago',
        status: 'open',
        snowDepth: 120,
        liftsOpen: 6,
        trailsOpen: 38,
        weather: {
          temperature: -4,
          conditions: 'clear',
          visibility: 'excellent'
        }
      },
      {
        id: 'mt-hutt',
        name: 'Mt Hutt',
        region: 'Canterbury',
        status: 'open',
        snowDepth: 160,
        liftsOpen: 7,
        trailsOpen: 45,
        weather: {
          temperature: -3,
          conditions: 'partly_cloudy',
          visibility: 'good'
        }
      }
    ];
    
    return c.json(skiFields);
  } catch (error) {
    console.error('Ski fields error:', error);
    return c.json({ error: 'Failed to fetch ski fields' }, 500);
  }
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: 'Endpoint not found',
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString()
  }, 404);
});

Deno.serve(app.fetch);