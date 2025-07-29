const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://romantic-countdown-backend.onrender.com/api'
  : 'http://localhost:3001/api';

export interface UserData {
  name: string;
  flippedCards: Record<string, number>;
  isLocked: boolean;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const api = {
  // Get user data from the server
  async getUserData(name: string): Promise<UserData> {
    try {
      const response = await fetch(`${API_BASE_URL}/user-data/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Return default data if server is not available
      return {
        name,
        flippedCards: {},
        isLocked: false,
        isVerified: false
      };
    }
  },

  // Get all users data
  async getAllUsersData(): Promise<UserData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/all-users`);
      if (!response.ok) {
        throw new Error('Failed to fetch all users data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all users data:', error);
      return [];
    }
  },

  // Save user data to the server
  async saveUserData(data: {
    name: string;
    flippedCards: Record<string, number>;
    isLocked: boolean;
    isVerified: boolean;
  }): Promise<UserData> {
    try {
      const response = await fetch(`${API_BASE_URL}/user-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Reset user data
  async resetUserData(name: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/reset/${encodeURIComponent(name)}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset user data');
      }
    } catch (error) {
      console.error('Error resetting user data:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}; 