const express = require('express');
const walletController = require('../controllers/wallet');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wallet routes
router.get('/wallet/:publicKey/balance', walletController.getBalance);
router.post('/transfer', walletController.transferSol);
router.get('/transaction/:signature', walletController.getTransaction);

module.exports = router;