const { v4: uuidv4 } = require('uuid');
const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  userExists,
  addUserToOrganization,
  removeUserFromOrganization
} = require('../config/redis');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { walletId } = req.params;

    if (!walletId) {
      return res.status(400).json({
        success: false,
        message: 'Wallet ID is required'
      });
    }

    const userProfile = await getUserProfile(walletId);

    if (!userProfile || Object.keys(userProfile).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// Create user profile
exports.createProfile = async (req, res) => {
  try {
    const { walletId, ...profileData } = req.body;

    if (!walletId) {
      return res.status(400).json({
        success: false,
        message: 'Wallet ID is required'
      });
    }

    if (await userExists(walletId)) {
      return res.status(409).json({
        success: false,
        message: 'User profile already exists'
      });
    }

    const userProfile = {
      id: uuidv4(),
      walletId,
      username: profileData.username || user_${walletId.substring(0, 8)},
      avatar: profileData.avatar || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      organization: '',
      school: '',
      ...profileData
    };

    await createUserProfile(walletId, userProfile);

    return res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: userProfile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { walletId } = req.params;
    const updates = req.body;

    if (!walletId) {
      return res.status(400).json({
        success: false,
        message: 'Wallet ID is required'
      });
    }

    if (!await userExists(walletId)) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const currentProfile = await getUserProfile(walletId);
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: Date.now()
    };

    await updateUserProfile(walletId, updatedProfile);

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const { walletId } = req.params;

    if (!walletId) {
      return res.status(400).json({
        success: false,
        message: 'Wallet ID is required'
      });
    }

    if (!await userExists(walletId)) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    await deleteUserProfile(walletId);

    return res.status(200).json({
      success: true,
      message: 'User profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user profile',
      error: error.message
    });
  }
};

// Add a user to an organization
exports.addMemberToOrganization = async (req, res) => {
  try {
    const { orgName, walletId } = req.body;
    
    if (!walletId || !orgName) {
      return res.status(400).json({
        success: false,
        message: 'Both wallet ID and organization ID are required'
      });
    }
    
    await addUserToOrganization(walletId, orgName);
    const currentProfile = await getUserProfile(walletId);
    const updates = {organization:orgName};
    const updatedProfile = {
      ...currentProfile,
      organization: orgName,
      updatedAt: Date.now()
    };
    await updateUserProfile(walletId, updatedProfile);

    return res.status(200).json({
      success: true,
      message: Successfully added ${walletId} to organization ${orgName}
    });
  } catch (error) {
    console.error('Error adding member to organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add member to organization',
      error: error.message
    });
  }
};

// Remove a user from an organization
exports.removeMemberFromOrganization = async (req, res) => {
  try {
    const { orgName, walletId } = req.body;

    if (!walletId || !orgName) {
      return res.status(400).json({
        success: false,
        message: 'Both wallet ID and organization ID are required'
      });
    }

    await removeUserFromOrganization(walletId, orgName);

    return res.status(200).json({
      success: true,
      message: Successfully removed ${walletId} from organization ${orgName}
    });
  } catch (error) {
    console.error('Error removing member from organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove member from organization',
      error: error.message
    });
  }
};