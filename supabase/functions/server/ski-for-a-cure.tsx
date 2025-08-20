import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logging middleware
app.use('*', logger(console.log));

// Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Event configuration
const EVENT_CONFIG = {
  id: 'ski-for-a-cure-2024',
  title: 'Ski for a Cure Global 2024',
  dateRange: 'Sep 6–14, 2024',
  startDate: '2024-09-06T00:00:00Z',
  endDate: '2024-09-14T23:59:59Z',
  goal: 500000, // $500,000 fundraising goal
  prices: {
    individual: 25,
    team: 100,
    business: 250
  },
  maxTeamSize: 20,
  currency: 'USD'
};

// Utility functions
const generateParticipantId = () => `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateTeamCode = () => `SNOW24${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
const generateReceiptId = () => `SKI${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

// Authentication middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Authorization required' }, 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ error: 'Invalid authorization format' }, 401);
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
    
    c.set('user', user);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// Routes

// GET /event - Get event information
app.get('/event', async (c) => {
  try {
    // Get current stats
    const participantsData = await kv.getByPrefix('participant:');
    const participants = participantsData.map(p => JSON.parse(p));
    
    const totalRaised = participants.reduce((sum, p) => sum + (p.fundraisingAmount || 0), 0);
    const participantCount = participants.length;
    
    // Get recent activity
    const recentJoins = participants
      .filter(p => new Date(p.joinedDate) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .length;

    const eventInfo = {
      ...EVENT_CONFIG,
      stats: {
        participantCount,
        totalRaised,
        recentJoins,
        progressPercentage: Math.min((totalRaised / EVENT_CONFIG.goal) * 100, 100),
        isActive: new Date() >= new Date(EVENT_CONFIG.startDate) && new Date() <= new Date(EVENT_CONFIG.endDate)
      }
    };

    return c.json(eventInfo);
  } catch (error) {
    console.error('Error fetching event info:', error);
    return c.json({ error: 'Failed to fetch event information' }, 500);
  }
});

// POST /join - Join the event
app.post('/join', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const {
      participationType,
      userInfo,
      teamInfo,
      businessInfo,
      paymentCompleted,
      donationAmount,
      skiField
    } = body;

    // Validate required fields
    if (!participationType || !userInfo?.name || !userInfo?.email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user already participated
    const existingParticipant = await kv.get(`participant:${user.id}`);
    if (existingParticipant) {
      return c.json({ error: 'User already participated in this event' }, 409);
    }

    // Generate participant data
    const participantId = generateParticipantId();
    const now = new Date().toISOString();
    
    let teamCode = null;
    let teamName = null;
    
    // Handle team creation/joining
    if (participationType === 'team' && teamInfo) {
      if (teamInfo.action === 'create') {
        teamCode = generateTeamCode();
        teamName = teamInfo.teamName;
        
        // Create team record
        const teamData = {
          id: teamCode,
          name: teamName,
          adminId: user.id,
          adminName: userInfo.name,
          members: [user.id],
          memberCount: 1,
          createdDate: now,
          fundraisingAmount: 0,
          targetAmount: 15000 // Default team target
        };
        
        await kv.set(`team:${teamCode}`, JSON.stringify(teamData));
      } else if (teamInfo.action === 'join') {
        teamCode = teamInfo.joinCode;
        
        // Validate team exists and has space
        const existingTeam = await kv.get(`team:${teamCode}`);
        if (!existingTeam) {
          return c.json({ error: 'Team not found' }, 404);
        }
        
        const team = JSON.parse(existingTeam);
        if (team.members.length >= EVENT_CONFIG.maxTeamSize) {
          return c.json({ error: 'Team is full' }, 409);
        }
        
        // Add user to team
        team.members.push(user.id);
        team.memberCount = team.members.length;
        teamName = team.name;
        
        await kv.set(`team:${teamCode}`, JSON.stringify(team));
      }
    }

    // Generate receipt if payment completed
    let receiptId = null;
    if (paymentCompleted) {
      receiptId = generateReceiptId();
      
      // Store payment record
      const paymentRecord = {
        id: receiptId,
        userId: user.id,
        participantId,
        amount: EVENT_CONFIG.prices[participationType] + (donationAmount || 0),
        participationType,
        donationAmount: donationAmount || 0,
        processedDate: now,
        status: 'completed'
      };
      
      await kv.set(`payment:${receiptId}`, JSON.stringify(paymentRecord));
    }

    // Create participant record
    const participant = {
      id: participantId,
      userId: user.id,
      participationType,
      userInfo,
      teamInfo: teamCode ? { teamCode, teamName, role: teamInfo?.action === 'create' ? 'admin' : 'member' } : null,
      businessInfo: businessInfo || null,
      paymentStatus: paymentCompleted ? 'paid' : 'unpaid',
      receiptId,
      skiField: skiField || null,
      donationAmount: donationAmount || 0,
      joinedDate: now,
      fundraisingAmount: donationAmount || 0,
      targetAmount: participationType === 'individual' ? 5000 : participationType === 'team' ? 15000 : 25000,
      trackingStats: {
        totalVertical: 0,
        totalDistance: 0,
        totalRuns: 0,
        totalTime: 0,
        bestSpeed: 0
      },
      isActive: true
    };

    // Save participant
    await kv.set(`participant:${user.id}`, JSON.stringify(participant));
    
    // Update user's participation reference
    await kv.set(`user_participation:${user.id}`, participantId);

    return c.json({
      success: true,
      participant,
      teamCode: teamCode || undefined,
      receiptId: receiptId || undefined
    });

  } catch (error) {
    console.error('Error joining event:', error);
    return c.json({ error: 'Failed to join event' }, 500);
  }
});

// GET /participation - Get user's participation info
app.get('/participation', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    
    const participantData = await kv.get(`participant:${user.id}`);
    if (!participantData) {
      return c.json({ 
        isJoined: false,
        participant: null 
      });
    }

    const participant = JSON.parse(participantData);
    
    // Get team info if applicable
    let teamDetails = null;
    if (participant.teamInfo?.teamCode) {
      const teamData = await kv.get(`team:${participant.teamInfo.teamCode}`);
      if (teamData) {
        const team = JSON.parse(teamData);
        
        // Get member details
        const memberPromises = team.members.map(async (memberId: string) => {
          const memberParticipant = await kv.get(`participant:${memberId}`);
          if (memberParticipant) {
            const member = JSON.parse(memberParticipant);
            return {
              id: memberId,
              name: member.userInfo.name,
              vertical: member.trackingStats.totalVertical,
              isOnline: Math.random() > 0.3 // Mock online status
            };
          }
          return null;
        });
        
        const members = (await Promise.all(memberPromises)).filter(Boolean);
        
        teamDetails = {
          ...team,
          members
        };
      }
    }

    const response = {
      isJoined: true,
      participant,
      teamInfo: teamDetails,
      eventConfig: EVENT_CONFIG
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching participation:', error);
    return c.json({ error: 'Failed to fetch participation' }, 500);
  }
});

// POST /tracking/update - Update tracking stats
app.post('/tracking/update', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const { vertical, distance, time, speed, runs } = body;

    // Get participant data
    const participantData = await kv.get(`participant:${user.id}`);
    if (!participantData) {
      return c.json({ error: 'Participant not found' }, 404);
    }

    const participant = JSON.parse(participantData);
    
    // Update tracking stats
    participant.trackingStats = {
      totalVertical: (participant.trackingStats.totalVertical || 0) + (vertical || 0),
      totalDistance: (participant.trackingStats.totalDistance || 0) + (distance || 0),
      totalRuns: (participant.trackingStats.totalRuns || 0) + (runs || 0),
      totalTime: (participant.trackingStats.totalTime || 0) + (time || 0),
      bestSpeed: Math.max(participant.trackingStats.bestSpeed || 0, speed || 0)
    };
    
    participant.lastUpdate = new Date().toISOString();

    // Save updated participant
    await kv.set(`participant:${user.id}`, JSON.stringify(participant));

    // Update team stats if applicable
    if (participant.teamInfo?.teamCode) {
      const teamData = await kv.get(`team:${participant.teamInfo.teamCode}`);
      if (teamData) {
        const team = JSON.parse(teamData);
        
        // Recalculate team stats from all members
        const memberPromises = team.members.map(async (memberId: string) => {
          const memberData = await kv.get(`participant:${memberId}`);
          return memberData ? JSON.parse(memberData) : null;
        });
        
        const members = (await Promise.all(memberPromises)).filter(Boolean);
        
        team.totalVertical = members.reduce((sum, m) => sum + (m.trackingStats?.totalVertical || 0), 0);
        team.totalDistance = members.reduce((sum, m) => sum + (m.trackingStats?.totalDistance || 0), 0);
        team.totalRuns = members.reduce((sum, m) => sum + (m.trackingStats?.totalRuns || 0), 0);
        
        await kv.set(`team:${participant.teamInfo.teamCode}`, JSON.stringify(team));
      }
    }

    return c.json({
      success: true,
      stats: participant.trackingStats
    });

  } catch (error) {
    console.error('Error updating tracking:', error);
    return c.json({ error: 'Failed to update tracking' }, 500);
  }
});

// GET /leaderboards - Get leaderboards
app.get('/leaderboards', async (c) => {
  try {
    const type = c.req.query('type') || 'individual'; // individual, team, business
    const skiField = c.req.query('skiField') || 'all';
    
    if (type === 'individual') {
      // Get all participants
      const participantsData = await kv.getByPrefix('participant:');
      let participants = participantsData.map(p => JSON.parse(p));
      
      // Filter by ski field if specified
      if (skiField !== 'all') {
        participants = participants.filter(p => p.skiField === skiField);
      }
      
      // Sort by total vertical
      participants.sort((a, b) => (b.trackingStats?.totalVertical || 0) - (a.trackingStats?.totalVertical || 0));
      
      // Format leaderboard
      const leaderboard = participants.slice(0, 100).map((p, index) => ({
        rank: index + 1,
        name: p.userInfo.name,
        vertical: p.trackingStats?.totalVertical || 0,
        skiField: p.skiField || 'Unknown',
        participationType: p.participationType
      }));
      
      return c.json({ type: 'individual', data: leaderboard });
      
    } else if (type === 'team') {
      // Get all teams
      const teamsData = await kv.getByPrefix('team:');
      const teams = teamsData.map(t => JSON.parse(t));
      
      // Sort by total vertical
      teams.sort((a, b) => (b.totalVertical || 0) - (a.totalVertical || 0));
      
      // Format leaderboard
      const leaderboard = teams.slice(0, 50).map((t, index) => ({
        rank: index + 1,
        name: t.name,
        vertical: t.totalVertical || 0,
        members: t.memberCount || 0,
        skiField: 'Various'
      }));
      
      return c.json({ type: 'team', data: leaderboard });
      
    } else if (type === 'business') {
      // Get business participants
      const participantsData = await kv.getByPrefix('participant:');
      let businesses = participantsData
        .map(p => JSON.parse(p))
        .filter(p => p.participationType === 'business');
      
      // Sort by total vertical
      businesses.sort((a, b) => (b.trackingStats?.totalVertical || 0) - (a.trackingStats?.totalVertical || 0));
      
      // Format leaderboard
      const leaderboard = businesses.slice(0, 50).map((b, index) => ({
        rank: index + 1,
        name: b.businessInfo?.companyName || b.userInfo.name,
        vertical: b.trackingStats?.totalVertical || 0,
        members: b.businessInfo?.teamSize || 1,
        skiField: b.skiField || 'Various'
      }));
      
      return c.json({ type: 'business', data: leaderboard });
    }
    
    return c.json({ error: 'Invalid leaderboard type' }, 400);
    
  } catch (error) {
    console.error('Error fetching leaderboards:', error);
    return c.json({ error: 'Failed to fetch leaderboards' }, 500);
  }
});

// POST /team/invite - Invite member to team (team admin only)
app.post('/team/invite', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { teamCode, email } = await c.req.json();
    
    if (!teamCode || !email) {
      return c.json({ error: 'Team code and email required' }, 400);
    }

    // Verify user is team admin
    const participantData = await kv.get(`participant:${user.id}`);
    if (!participantData) {
      return c.json({ error: 'Participant not found' }, 404);
    }
    
    const participant = JSON.parse(participantData);
    if (participant.teamInfo?.teamCode !== teamCode || participant.teamInfo?.role !== 'admin') {
      return c.json({ error: 'Not authorized to invite to this team' }, 403);
    }

    // Get team data
    const teamData = await kv.get(`team:${teamCode}`);
    if (!teamData) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    const team = JSON.parse(teamData);
    
    // Create invitation record
    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invitation = {
      id: inviteId,
      teamCode,
      teamName: team.name,
      invitedBy: user.id,
      invitedByName: participant.userInfo.name,
      invitedEmail: email,
      status: 'pending',
      createdDate: new Date().toISOString(),
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    await kv.set(`invitation:${inviteId}`, JSON.stringify(invitation));

    // In a real app, you would send an email here
    console.log(`Team invitation sent to ${email} for team ${team.name} (${teamCode})`);
    
    return c.json({
      success: true,
      inviteId,
      message: 'Invitation sent successfully'
    });

  } catch (error) {
    console.error('Error sending team invite:', error);
    return c.json({ error: 'Failed to send invitation' }, 500);
  }
});

// PUT /team/update - Update team information
app.put('/team/update', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { teamCode, updates } = await c.req.json();
    
    if (!teamCode) {
      return c.json({ error: 'Team code required' }, 400);
    }

    // Verify user is team admin
    const participantData = await kv.get(`participant:${user.id}`);
    if (!participantData) {
      return c.json({ error: 'Participant not found' }, 404);
    }
    
    const participant = JSON.parse(participantData);
    if (participant.teamInfo?.teamCode !== teamCode || participant.teamInfo?.role !== 'admin') {
      return c.json({ error: 'Not authorized to update this team' }, 403);
    }

    // Get team data
    const teamData = await kv.get(`team:${teamCode}`);
    if (!teamData) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    const team = JSON.parse(teamData);
    
    // Update allowed fields
    if (updates.name && updates.name !== team.name) {
      team.name = updates.name;
      team.lastUpdated = new Date().toISOString();
      
      // Update team name in all member records
      const memberPromises = team.members.map(async (memberId: string) => {
        const memberData = await kv.get(`participant:${memberId}`);
        if (memberData) {
          const member = JSON.parse(memberData);
          if (member.teamInfo) {
            member.teamInfo.teamName = updates.name;
            await kv.set(`participant:${memberId}`, JSON.stringify(member));
          }
        }
      });
      
      await Promise.all(memberPromises);
    }
    
    if (updates.targetAmount && updates.targetAmount > 0) {
      team.targetAmount = updates.targetAmount;
    }

    // Save updated team
    await kv.set(`team:${teamCode}`, JSON.stringify(team));

    return c.json({
      success: true,
      team
    });

  } catch (error) {
    console.error('Error updating team:', error);
    return c.json({ error: 'Failed to update team' }, 500);
  }
});

// GET /stats - Get comprehensive event statistics
app.get('/stats', async (c) => {
  try {
    // Get all participants
    const participantsData = await kv.getByPrefix('participant:');
    const participants = participantsData.map(p => JSON.parse(p));
    
    // Get all teams
    const teamsData = await kv.getByPrefix('team:');
    const teams = teamsData.map(t => JSON.parse(t));
    
    // Get all payments
    const paymentsData = await kv.getByPrefix('payment:');
    const payments = paymentsData.map(p => JSON.parse(p));

    // Calculate comprehensive stats
    const stats = {
      participants: {
        total: participants.length,
        individual: participants.filter(p => p.participationType === 'individual').length,
        team: participants.filter(p => p.participationType === 'team').length,
        business: participants.filter(p => p.participationType === 'business').length,
        paid: participants.filter(p => p.paymentStatus === 'paid').length,
        unpaid: participants.filter(p => p.paymentStatus === 'unpaid').length
      },
      teams: {
        total: teams.length,
        averageSize: teams.length > 0 ? teams.reduce((sum, t) => sum + t.memberCount, 0) / teams.length : 0
      },
      fundraising: {
        totalRaised: participants.reduce((sum, p) => sum + (p.fundraisingAmount || 0), 0),
        totalDonations: payments.reduce((sum, p) => sum + (p.donationAmount || 0), 0),
        totalRegistrationFees: payments.reduce((sum, p) => sum + (p.amount - (p.donationAmount || 0)), 0),
        goal: EVENT_CONFIG.goal
      },
      tracking: {
        totalVertical: participants.reduce((sum, p) => sum + (p.trackingStats?.totalVertical || 0), 0),
        totalDistance: participants.reduce((sum, p) => sum + (p.trackingStats?.totalDistance || 0), 0),
        totalRuns: participants.reduce((sum, p) => sum + (p.trackingStats?.totalRuns || 0), 0),
        totalTime: participants.reduce((sum, p) => sum + (p.trackingStats?.totalTime || 0), 0)
      },
      skiFields: (() => {
        const fieldCounts: Record<string, number> = {};
        participants.forEach(p => {
          const field = p.skiField || 'Unknown';
          fieldCounts[field] = (fieldCounts[field] || 0) + 1;
        });
        return fieldCounts;
      })()
    };

    return c.json(stats);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found' }, 404);
});

export default app;