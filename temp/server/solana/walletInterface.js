const {
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
  } = require('@solana/web3.js');
  const { getConnection } = require('../config/solana');
  const bs58 = require('bs58');
  
  /**
   * Get account balance
   * @param {string} publicKey - Account public key
   * @returns {Promise<Object>} Balance information
   */
  const getBalance = async (publicKey) => {
    try {
      const connection = getConnection();
      const pubKey = new PublicKey(publicKey);
      const balance = await connection.getBalance(pubKey);
      
      return {
        lamports: balance,
        sol: balance / LAMPORTS_PER_SOL
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };
  
  /**
   * Send SOL to another account
   * @param {string} fromSecretKey - Sender's secret key
   * @param {string} toPublicKey - Recipient's public key
   * @param {number} amount - Amount in SOL
   * @returns {Promise<string>} Transaction signature
   */
  const transferSol = async (fromSecretKey, toPublicKey, amount) => {
    try {
      const connection = getConnection();
      
      // Convert from secret key to keypair
      const fromKeypair = Keypair.fromSecretKey(
        bs58.decode(fromSecretKey)
      );
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new PublicKey(toPublicKey),
          lamports: amount * LAMPORTS_PER_SOL
        })
      );
      
      // Send transaction
      const signature = await connection.sendTransaction(
        transaction,
        [fromKeypair]
      );
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error('Error transferring SOL:', error);
      throw error;
    }
  };
  
  /**
   * Get transaction details
   * @param {string} signature - Transaction signature
   * @returns {Promise<Object>} Transaction details
   */
  const getTransaction = async (signature) => {
    try {
      const connection = getConnection();
      const transaction = await connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  };
  
  module.exports = {
    getBalance,
    transferSol,
    getTransaction
  };