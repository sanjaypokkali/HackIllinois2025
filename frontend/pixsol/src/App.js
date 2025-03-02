import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import CanvasPage from './components/pages/CanvasPage';
import Profile from './components/pages/Profile';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import MerchStore from './components/pages/MerchStore';
import RSORegister from './components/pages/RSORegister';
// Import the styles
// import MerchStorePage from './components/pages/MerchStorePage';
// import NFTGalleryPage from './pages/NFTGalleryPage';
// import ProfilePage from './pages/ProfilePage';
import './App.css';
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // Define the wallets you want to support
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas/:eventId" element={<CanvasPage />} />
        <Route path="/merch-store" element={<MerchStore/>} /> 
        <Route path="/rso-register" element={<RSORegister />} />
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
    </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
