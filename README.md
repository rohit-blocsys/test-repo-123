# Romantic Countdown App with MongoDB Integration

A beautiful countdown app for a romantic journey with MongoDB database integration to store user choices permanently.

<!-- Deployment trigger: Updated on $(date) -->
<!-- Triggering deployment with JavaScript build approach -->

## Features

- **MongoDB Integration**: All user data is stored in MongoDB instead of localStorage
- **Countdown Timer**: Countdown to August 2nd, 2025
- **Interactive Cards**: Users can flip cards to make romantic choices
- **Data Persistence**: Choices are saved to MongoDB database
- **Data Reveal**: After countdown ends, all choices are displayed beautifully
- **Admin Panel**: View all user choices with passcode protection
- **Responsive Design**: Beautiful UI that works on all devices

## Database Setup

The app uses MongoDB Atlas with the following connection string:
```
mongodb+srv://admin:Bx4wZ6SX4b6VTpJg@test-cluster.vrss4aa.mongodb.net/
```

### Collections Created:
- **UserData**: Stores user choices and verification status
  - `name`: User name (default: "Divu")
  - `flippedCards`: Record of level numbers to selected card numbers
  - `isLocked`: Boolean to prevent further changes
  - `isVerified`: Boolean for name verification
  - `createdAt`: Timestamp when data was first created
  - `updatedAt`: Timestamp when data was last updated

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd six-month-surprise
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```

This will start both the Express server (port 3001) and the Vite development server (port 8080).

### Development Mode (Frontend Only)
```bash
npm run dev
```

### Development Mode (Backend Only)
```bash
npm run dev:server
```

### Production Build
```bash
npm run build
npm run build:server
```

## API Endpoints

- `GET /api/user-data` - Get user data from MongoDB
- `POST /api/user-data` - Save user data to MongoDB
- `POST /api/reset` - Reset user data
- `GET /api/health` - Health check endpoint

## How It Works

1. **Before August 2nd, 2025**:
   - Users enter their name (must be "Divu")
   - They can flip cards to make romantic choices
   - All choices are saved to MongoDB in real-time
   - Admin panel shows all choices with passcode protection

2. **After August 2nd, 2025**:
   - The app automatically switches to reveal mode
   - All stored choices are displayed beautifully
   - Shows which cards were selected and what they contained
   - Displays completion date and user information

## Data Flow

1. **User Interaction** → React State Update
2. **State Change** → API Call to Express Server
3. **Express Server** → MongoDB Save Operation
4. **Database** → Persistent Storage
5. **On Load** → API Call to Fetch Data
6. **Data Retrieved** → React State Update

## Fallback Mechanism

If the MongoDB server is unavailable:
- The app falls back to localStorage
- Users can still interact with the app
- Data is preserved locally until server is available

## Admin Access

- **Passcode**: `DiyuuuRohuuu`
- **Access**: Click the "Answers" button in the bottom-right corner
- **Features**: View all user choices, see progress through levels

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Development**: tsx, concurrently

## Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3001
MONGODB_URI=mongodb+srv://admin:Bx4wZ6SX4b6VTpJg@test-cluster.vrss4aa.mongodb.net/
```

## Deployment

The app can be deployed to any platform that supports Node.js:

1. **Frontend**: Deploy to Vercel, Netlify, or any static hosting
2. **Backend**: Deploy to Railway, Heroku, or any Node.js hosting
3. **Database**: MongoDB Atlas (already configured)

## Security Notes

- MongoDB connection string is included in the code for this specific project
- In production, use environment variables for sensitive data
- Admin passcode should be stored securely in production

## Support

For any issues or questions, please refer to the project documentation or contact the development team.
