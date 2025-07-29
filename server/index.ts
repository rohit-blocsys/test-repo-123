import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB, saveUserData, getUserData, getAllUsersData, resetUserData } from '../src/lib/database';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://six-month-surprise.onrender.com', 'https://your-frontend-domain.vercel.app']
    : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173']
}));
app.use(express.json());

// Connect to MongoDB
connectDB().catch(console.error);

// Routes
app.get('/api/user-data/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const userData = await getUserData(name);
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
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
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 