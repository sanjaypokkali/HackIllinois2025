import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import profileService from '../services/profileService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment
} from '@mui/material';
import Layout from '../layout/Layout';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganizationManagement = () => {
  const { wallet, connected, connectWallet } = useWallet();
  const [orgName, setOrgName] = useState('');
  const [walletId, setWalletId] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // State for Rent a Space section
  const [spaceCount, setSpaceCount] = useState(1);
  const [solValue, setSolValue] = useState(0.05);

  const handlePurchase = async () => {  
    toast.success("Success!", {
      position: "top-right",
      autoClose: 3000, // Closes after 3s
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  const handleAddMember = async () => {
    if (!connected) {
      setSnackbar({
        open: true,
        message: 'Please connect your wallet first.',
        severity: 'error',
      });
      return;
    }

    if (!orgName.trim() || !walletId.trim()) {
      setSnackbar({
        open: true,
        message: 'Both organization name and wallet ID are required.',
        severity: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      await profileService.addMember(orgName, walletId);
      setSnackbar({
        open: true,
        message: `Successfully added ${walletId} to ${orgName}.`,
        severity: 'success',
      });
      setWalletId(''); // Clear input after success
    } catch (error) {
      console.error('Error adding member:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Successfully added member.',
        severity: 'success',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!connected) {
      setSnackbar({
        open: true,
        message: 'Please connect your wallet first.',
        severity: 'error',
      });
      return;
    }

    if (!orgName.trim() || !walletId.trim()) {
      setSnackbar({
        open: true,
        message: 'Both organization name and wallet ID are required.',
        severity: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      await profileService.removeMember(orgName, walletId);
      setSnackbar({
        open: true,
        message: `Successfully removed ${walletId} from ${orgName}.`,
        severity: 'success',
      });
      setWalletId(''); // Clear input after success
    } catch (error) {
      console.error('Error removing member:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to remove member.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setSnackbar({
        open: true,
        message: 'Failed to connect wallet. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle change of space count
  const handleSpaceCountChange = (event) => {
    const count = event.target.value;
    setSpaceCount(count);
    setSolValue(0.05 * count);  // Set the corresponding SOL value
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Organization Management
        </Typography>

        {!connected ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Please connect your wallet to manage your organization.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              label="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="New Member Wallet ID"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              margin="normal"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddMember}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Member'}
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                onClick={handleRemoveMember}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Remove Member'}
              </Button>
            </Box>

            {/* Rent a Space Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Rent a Space
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Number of Spaces</InputLabel>
                  <Select
                    value={spaceCount}
                    onChange={handleSpaceCountChange}
                    label="Grid Size"
                  >
                    {[...Array(33)].map((_, index) => (
                      <MenuItem key={index} value={index}>
                        {index}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="SOL Value"
                  value={Math.round(solValue * 10000) / 10000}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">SOL</InputAdornment>,
                  }}
                />
                <Button
                variant="contained"
                color="primary"
                onClick={handlePurchase}
                >
                Purchase
              </Button>
              </Box>
            </Box>
          </>
        )}

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
      <ToastContainer />

    </Layout>
  );
};

export default OrganizationManagement;