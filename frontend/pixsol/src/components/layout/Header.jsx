import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { MdMenu, MdClose } from "react-icons/md";
import "../../styles/Header.css";
function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">Pixsol</Link>
      </div>
      
      <div className="right-section">
        <WalletMultiButton />
        <button className="hamburger" onClick={toggleMenu}>
          {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="mobile-nav">
          <ul>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/merch-store" onClick={toggleMenu}>Merch Store</Link></li>
            <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
            <li><Link to="/rso-register" onClick={toggleMenu}>RSO Register</Link></li>

          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
