import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import profileService from '../services/profileService';
import { Box, Button, TextField, Typography, Card, CardContent, Avatar, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Layout from '../layout/Layout';

const UserProfile = () => {
  const { wallet, walletAddress, connected } = useWallet();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    avatarUrl: '',
    organization: '',
    school: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (connected && walletAddress) {
        try {
          setLoading(true);
          const data = await profileService.getProfile(walletAddress);
          setProfile(data);
          setFormData({
            username: data.username || '',
            avatarUrl: data.avatarUrl || '',
            organization: data.organization || '',
            school: data.school || '',
          });
        } catch (err) {
          console.error('Error fetching profile:', err);
          if (err.response?.status === 404) {
            // User doesn't exist in Redis, create a new profile
            handleCreateNewProfile();
          } else {
            setError('Failed to load profile. Please try again later.');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [connected, walletAddress]);

  const handleCreateNewProfile = async () => {
    try {
      setLoading(true);
      // Create default profile
      const newProfile = {
        walletId: walletAddress,
        username: `User_${walletAddress.slice(0, 6)}`,
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        organization: '',
        school: '',
      };

      const createdProfile = await profileService.createProfile(newProfile);
      setProfile(createdProfile);
      setFormData({
        username: createdProfile.username || '',
        avatarUrl: createdProfile.avatarUrl || '',
        organization: createdProfile.organization || '',
        school: createdProfile.school || '',
      });
      
      setSnackbar({
        open: true,
        message: 'New profile created successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create new profile. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to create profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = {
        ...profile,
        username: formData.username,
        avatarUrl: formData.avatarUrl,
        organization: formData.organization,
        school: formData.school,
        updatedAt: new Date().toISOString()
      };

      const response = await profileService.updateProfile(walletAddress, updatedProfile);
      setProfile(response);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    setFormData({
      username: profile.username || '',
      avatarUrl: profile.avatarUrl || '',
      organization: profile.organization || '',
      school: profile.school || '',
    });
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!connected) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h5" color="text.secondary">
          Please connect your wallet to view your profile
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                User Profile
              </Typography>
              {!isEditing ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  src={profile?.avatarUrl || ''} 
                  alt={profile?.username || 'User'} 
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {profile?.username || 'Username'}
                </Typography>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Wallet Address
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {walletAddress}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Avatar URL"
                          name="avatarUrl"
                          value={formData.avatarUrl}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="SchoolL"
                          name="school"
                          value={formData.school}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>

                    </Grid>
                  </form>
                ) : (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      RSO
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {profile?.organization || 'ACM'}
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                      School
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {profile?.school || 'No school provided'}
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(profile?.createdAt).toLocaleDateString()}
                      </Typography>
                      {profile?.updatedAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          Last Updated: {new Date(profile?.updatedAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default UserProfile;