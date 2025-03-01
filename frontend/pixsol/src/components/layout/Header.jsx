import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../auth/WalletConnect';

function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">PixelChain</Link>
      </div>
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
      <div className="wallet-section">
        <WalletConnect />
      </div>
    </header>
  );
}

export default Header;
