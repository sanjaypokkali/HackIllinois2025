import React from 'react';
import { useWallet } from '../hooks/useWallet';

function WalletConnect() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  
  return (
    <div className="wallet-connect">
      {wallet ? (
        <div>
          <p>Connected: {wallet.publicKey.toString().slice(0, 6)}...{wallet.publicKey.toString().slice(-4)}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnect;
