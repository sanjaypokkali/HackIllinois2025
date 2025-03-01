const { Connection, clusterApiUrl } = require('@solana/web3.js');
require('dotenv').config();

// Network options: 'mainnet-beta', 'testnet', 'devnet', 'localnet'
const SOLANA_NETWORK = 'devnet';

let connection = null;

/**
 * Setup Solana connection
 * @returns {Connection} Solana connection object
 */
const setupSolanaConnection = () => {
  try {
    // Use custom RPC URL if provided, otherwise use cluster API URL
    const endpoint = clusterApiUrl(SOLANA_NETWORK);
    connection = new Connection(endpoint, 'confirmed');
    console.log(`Connected to Solana ${SOLANA_NETWORK}`);
    return connection;
  } catch (error) {
    console.error('Failed to connect to Solana network:', error);
    throw error;
  }
};

/**
 * Get Solana connection
 * @returns {Connection} Solana connection object
 */
const getConnection = () => {
  if (!connection) {
    return setupSolanaConnection();
  }
  return connection;
};

module.exports = {
  setupSolanaConnection,
  getConnection,
  SOLANA_NETWORK
};