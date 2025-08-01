const mongoose = require('mongoose');

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
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Database operations
const saveUserData = async (data) => {
  try {
    console.log('💾 Attempting to save user data:', data);
    
    const userData = await UserData.findOneAndUpdate(
      { name: data.name },
      {
        ...data,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('✅ User data saved successfully:', userData);
    return userData;
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
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

module.exports = {
  connectDB,
  saveUserData,
  getUserData,
  getAllUsersData,
  resetUserData
}; 