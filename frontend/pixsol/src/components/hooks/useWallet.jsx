import { useState, useEffect } from 'react';
import { connectToWallet, disconnectWallet } from '../services/solanaService';

export function useWallet() {
  const [wallet, setWallet] = useState(null);
  
  useEffect(() => {
    // Check if wallet was previously connected
    const checkWalletConnection = async () => {
      try {
        const savedWallet = localStorage.getItem('walletConnection');
        if (savedWallet) {
          const connectedWallet = await connectToWallet();
          setWallet(connectedWallet);
        }
      } catch (error) {
        console.error('Failed to reconnect wallet:', error);
        localStorage.removeItem('walletConnection');
      }
    };
    
    checkWalletConnection();
  }, []);
  
  const connectWallet = async () => {
    try {
      const connectedWallet = await connectToWallet();
      setWallet(connectedWallet);
      localStorage.setItem('walletConnection', 'true');
      return connectedWallet;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };
  
  const disconnect = () => {
    disconnectWallet();
    setWallet(null);
    localStorage.removeItem('walletConnection');
  };
  
  return { wallet, connectWallet, disconnectWallet: disconnect };
}
