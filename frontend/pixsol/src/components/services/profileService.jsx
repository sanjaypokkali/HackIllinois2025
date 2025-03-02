
import axios from 'axios';

// API base URL - update this to match your server configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://6d24-130-126-255-196.ngrok-free.app/api';

/**
 * Profile Service
 * Handles all API calls related to user profiles
 */
const profileService = {
  /**
   * Get a user profile by wallet address
   * @param {string} walletAddress - The wallet address of the user
   * @returns {Promise} - Promise with the user profile data
   */
  getProfile: async (walletAddress) => {
    try {
      const response = await axios.get(`${API_URL}/profile/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Create a new user profile
   * @param {Object} profileData - The profile data to create
   * @param {string} profileData.walletAddress - The wallet address of the user (required)
   * @param {string} profileData.username - The username for the profile
   * @param {string} profileData.bio - User bio or description
   * @param {string} profileData.avatarUrl - URL to user's avatar image
   * @returns {Promise} - Promise with the created profile data
   */
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(`${API_URL}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  /**
   * Update an existing user profile
   * @param {string} walletAddress - The wallet address of the user
   * @param {Object} profileData - The profile data to update
   * @param {string} profileData.username - The username for the profile
   * @param {string} profileData.bio - User bio or description
   * @param {string} profileData.avatarUrl - URL to user's avatar image
   * @returns {Promise} - Promise with the updated profile data
   */
  updateProfile: async (walletAddress, profileData) => {
    try {
      const response = await axios.put(`${API_URL}/profile/${walletAddress}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Delete a user profile
   * @param {string} walletAddress - The wallet address of the user
   * @returns {Promise} - Promise with the operation result
   */
  deleteProfile: async (walletAddress) => {
    try {
      const response = await axios.delete(`${API_URL}/profile/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  /**
   * Check if a profile exists for a given wallet address
   * @param {string} walletAddress - The wallet address to check
   * @returns {Promise<boolean>} - Promise with boolean indicating if profile exists
   */
  checkProfileExists: async (walletAddress) => {
    try {
      const response = await axios.head(`${API_URL}/profile/${walletAddress}`);
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      console.error('Error checking profile existence:', error);
      throw error;
    }
  },

  /**
   * Get or create a profile based on wallet address
   * Used when a user connects their wallet - will return existing profile or create a new one
   * @param {string} walletAddress - The wallet address of the user
   * @param {Object} defaultData - Default data to use if creating a new profile
   * @returns {Promise} - Promise with the profile data
   */
  getOrCreateProfile: async (walletAddress, defaultData = {}) => {
    try {
      // First try to get the existing profile
      try {
        const profile = await profileService.getProfile(walletAddress);
        return profile;
      } catch (error) {
        // If profile doesn't exist (404), create a new one
        if (error.response && error.response.status === 404) {
          const newProfileData = {
            walletAddress,
            username: defaultData.username || `user_${walletAddress.substring(0, 8)}`,
            bio: defaultData.bio || '',
            avatarUrl: defaultData.avatarUrl || '',
            createdAt: new Date().toISOString(),
            // Add any other default fields needed
          };
          return await profileService.createProfile(newProfileData);
        }
        // If it's another error, throw it
        throw error;
      }
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      throw error;
    }
  },

  addMember: async (orgName, walletId) => {
    try {
      const response = await axios.post(`${API_URL}/profile/addMember`, {
        orgName,
        walletId,
      });
      return response.data; // Assuming server returns { success: true, message: ... }
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  removeMember: async (orgName, walletId) => {
    try {
      const response = await axios.post(`${API_URL}/profile/removeMember`, {
        orgName,
        walletId,
      });
      return response.data; // Assuming server returns { success: true, message: ... }
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

};

export default profileService;