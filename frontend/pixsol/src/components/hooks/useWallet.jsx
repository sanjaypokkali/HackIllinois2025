import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';

// Helper function to get wallet ID from public key
const getWalletId = (publicKey) => {
  if (!publicKey) return null;
  return publicKey.toString();
};

export function useWallet() {
  const { 
    publicKey, 
    wallet: solanaWallet,
    connect, 
    disconnect: solanaDisconnect,
    connecting,
    connected
  } = useSolanaWallet();
  
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletId, setWalletId] = useState(null);
  
  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
      localStorage.setItem('walletConnection', 'true');
    } else {
      setWalletAddress(null);
      localStorage.removeItem('walletConnection');
    }
  }, [publicKey]);
  
  useEffect(() => {
    // Check if wallet was previously connected
    const checkWalletConnection = async () => {
      try {
        const savedWallet = localStorage.getItem('walletConnection');
        if (savedWallet && !connected && !connecting) {
          connect().catch(console.error);
        }
      } catch (error) {
        console.error('Failed to reconnect wallet:', error);
        localStorage.removeItem('walletConnection');
      }
    };
    
    checkWalletConnection();
  }, [connect, connected, connecting]);
  
  const connectWallet = async () => {
    try {
      await connect();
      const id = getWalletId(publicKey); // Use the getWalletId function with the publicKey
      setWalletId(id);
      return {
        publicKey,
        wallet: solanaWallet
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };
  
  const disconnectWallet = () => {
    try {
      solanaDisconnect();
      localStorage.removeItem('walletConnection');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };
  
  const wallet = publicKey ? {
    publicKey,
    wallet: solanaWallet
  } : null;
  
  return { 
    wallet, 
    walletAddress,
    connectWallet, 
    disconnectWallet,
    connecting,
    connected,
    walletId
  };
}

// Make useWallet both a named export and a default export
export default useWallet;