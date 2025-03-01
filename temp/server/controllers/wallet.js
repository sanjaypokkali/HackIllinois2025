const solanaService = require('../solana/walletInterface');

/**
 * Create a new wallet
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createWallet = (req, res) => {
  try {
    const wallet = solanaService.createWallet();
    res.status(201).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create wallet',
      error: error.message
    });
  }
};

/**
 * Get wallet balance
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getBalance = async (req, res) => {
  try {
    const { publicKey } = req.params;
    
    if (!publicKey) {
      return res.status(400).json({
        success: false,
        message: 'Public key is required'
      });
    }
    
    const balance = await solanaService.getBalance(publicKey);
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get balance',
      error: error.message
    });
  }
};

/**
 * Transfer SOL
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const transferSol = async (req, res) => {
  try {
    const { fromSecretKey, toPublicKey, amount } = req.body;
    
    if (!fromSecretKey || !toPublicKey || !amount) {
      return res.status(400).json({
        success: false,
        message: 'From secret key, to public key, and amount are required'
      });
    }
    
    const signature = await solanaService.transferSol(
      fromSecretKey,
      toPublicKey,
      parseFloat(amount)
    );
    
    res.json({
      success: true,
      data: {
        signature,
        message: `Successfully transferred ${amount} SOL`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to transfer SOL',
      error: error.message
    });
  }
};

/**
 * Get transaction details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getTransaction = async (req, res) => {
  try {
    const { signature } = req.params;
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Transaction signature is required'
      });
    }
    
    const transaction = await solanaService.getTransaction(signature);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction',
      error: error.message
    });
  }
};

module.exports = {
  createWallet,
  getBalance,
  transferSol,
  getTransaction
};