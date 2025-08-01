const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const { connectDB, saveUserData, getUserData, getAllUsersData, resetUserData } = require('./database');

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://six-months-anniversary.onrender.com', 'https://six-month-surprise.onrender.com', 'https://your-frontend-domain.vercel.app']
    : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173']
}));
app.use(express.json());

// Connect to MongoDB
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    dbConnected = false;
  });

// Routes
app.get('/api/user-data/:name', async (req, res) => {
  try {
    if (!dbConnected) {
      console.log('⚠️ Database not connected, returning default data');
      return res.json({
        name: req.params.name,
        flippedCards: {},
        isLocked: false,
        isVerified: false
      });
    }
    
    const { name } = req.params;
    console.log(`🔍 Fetching user data for: ${name}`);
    const userData = await getUserData(name);
    console.log(`✅ User data found:`, userData);
    res.json(userData);
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get('/api/all-users', async (req, res) => {
  try {
    const allUsers = await getAllUsersData();
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching all users data:', error);
    res.status(500).json({ error: 'Failed to fetch all users data' });
  }
});

app.post('/api/user-data', async (req, res) => {
  try {
    const { name, flippedCards, isLocked, isVerified } = req.body;
    const userData = await saveUserData({ name, flippedCards, isLocked, isVerified });
    res.json(userData);
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

app.post('/api/reset/:name', async (req, res) => {
  try {
    const { name } = req.params;
    await resetUserData(name);
    res.json({ message: 'Data reset successfully' });
  } catch (error) {
    console.error('Error resetting user data:', error);
    res.status(500).json({ error: 'Failed to reset user data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 