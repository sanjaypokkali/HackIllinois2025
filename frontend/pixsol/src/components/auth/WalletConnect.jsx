import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import "../../styles/WalletConnect.css";

function WalletConnect({ onConnect }) {
  const { connect, connected, publicKey } = useWallet();

  const handleConnect = async () => {
    try {
      await connect(); // Trigger wallet connection
      if (connected && publicKey) {
        onConnect(publicKey.toString()); // Pass wallet ID (public key) to parent
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <button onClick={handleConnect} className="connect-wallet-button">
      Connect Wallet
    </button>
  );
}

export default WalletConnect;
