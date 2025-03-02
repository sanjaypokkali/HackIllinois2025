// src/routes/index.js
const express = require('express');
const walletController = require('../controllers/wallet');
const profileController = require('../controllers/profile'); // <-- Added this line

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wallet routes
router.get('/wallet/:publicKey/balance', walletController.getBalance);
router.post('/transfer', walletController.transferSol);
router.get('/transaction/:signature', walletController.getTransaction);

// Profile routes
router.get('/profile/:walletId', profileController.getProfile);
router.post('/profile', profileController.createProfile);
router.put('/profile/:walletId', profileController.updateProfile);
router.delete('/profile/:walletId', profileController.deleteProfile);

router.post('/profile/addMember', profileController.addMemberToOrganization);
router.post('/profile/removeMember', profileController.removeMemberFromOrganization);

module.exports = router;