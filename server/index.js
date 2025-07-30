const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:Bx4wZ6SX4b6VTpJg@test-cluster.vrss4aa.mongodb.net/';

// User data schema
const userDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  flippedCards: {
    type: Map,
    of: Number,
    default: {}
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create the model
const UserData = mongoose.model('UserData', userDataSchema);

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Database operations
const saveUserData = async (data) => {
  try {
    const userData = await UserData.findOneAndUpdate(
      { name: data.name },
      {
        ...data,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    return userData;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

const getUserData = async (name) => {
  try {
    const userData = await UserData.findOne({ name });
    return userData || {
      name,
      flippedCards: {},
      isLocked: false,
      isVerified: false
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

const getAllUsersData = async () => {
  try {
    const allUsers = await UserData.find({}).sort({ updatedAt: -1 });
    return allUsers;
  } catch (error) {
    console.error('Error getting all users data:', error);
    throw error;
  }
};

const resetUserData = async (name) => {
  try {
    await UserData.findOneAndUpdate(
      { name },
      {
        flippedCards: {},
        isLocked: false,
        isVerified: false,
        updatedAt: new Date()
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error resetting user data:', error);
    throw error;
  }
};

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