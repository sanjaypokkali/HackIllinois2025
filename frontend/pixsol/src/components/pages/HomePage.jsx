import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { getActiveEvents } from '../services/canvasService';
import "../../styles/HomePage.css";

function HomePage() {
  const [activeEvents, setActiveEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  
  const [walletId, setWalletId] = useState(null);


  const handleWalletConnect = (connectedWalletId) => {
    // Set the wallet ID once the user connects their wallet
    setWalletId(connectedWalletId);
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getActiveEvents();
        setActiveEvents(events);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <Layout>
      <div className="home-container">
        {/* Main Banner */}
        <div className="main-banner">
          <img src="/place.png" alt="Pixsol Banner" />
        </div>
        
        {/* Demo Button - replacing WalletConnect */}
        <div className="connect-wrapper">
          <Link to="/canvas/0" className="demo-btn">Try the Demo!</Link> 
          <p className="connect-tagline">Pixel by Pixel, Campus by Campus—A Digital Legacy for College Communities. Transforming pixels into profits—empowering student organizations to fund their vision, one creative stroke at a time.</p>
        </div>
        
        {/* Active Canvas */}
        {/* <div className="section active-canvas-section">
          <h2>Active Canvas Events</h2>
          
          {isLoading ? (
            <div className="loader">Loading events...</div>
          ) : activeEvents.length > 0 ? (
            <div className="canvas-grid">
              {activeEvents.map((event) => (
                <div key={event.id} className="canvas-card">
                  <div className="canvas-card-content">
                    <h3>{event.name}</h3>
                    <div className="canvas-stats">
                      <span className="time-remaining">
                        <i className="icon-clock"></i> {event.timeRemaining}
                      </span>
                      <span className="pixels-count">
                        <i className="icon-pixel"></i> {event.pixelsPlaced} pixels
                      </span>
                    </div>
                  </div>
                  <Link to={`/canvas/${event.id}`} className="canvas-join-btn">
                    Join Canvas
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No active events at the moment. Check back soon!</p>
            </div>
          )}
        </div> */}
        
        {/* How It Works */}
        <div className="section how-it-works-section">
          <h2>How It Works</h2>
          
          <div className="process-flow">
            <div className="process-step">
              <div className="step-icon wallet-icon"></div>
              <h3>Connect Wallet</h3>
              <p>Link your Solana wallet to participate</p>
            </div>
            
            <div className="process-step">
              <div className="step-icon university-icon"></div>
              <h3>Sign Up As an RSO</h3>
              <p>Confirm your university affiliation</p>
            </div>
            
            <div className="process-step">
              <div className="step-icon purchase-icon"></div>
              <h3>Purchase Pixels</h3>
              <p>Buy space on the canvas</p>
            </div>
            
            <div className="process-step">
              <div className="step-icon create-icon"></div>
              <h3>Create Together</h3>
              <p>Collaborate on amazing pixel art</p>
            </div>

            <div className="process-step">
              <div className="step-icon bank-icon"></div>
              <h3>NFT Minted & Merchandise Creation</h3>
              <p>Mint the canvas as an NFT and sell merch</p>
            </div>

            <div className="process-step">
              <div className="step-icon money-icon"></div>
              <h3>Revenue Sharing</h3>
              <p>Earn a portion of the profits based on NFT ownership!</p>
            </div>
          </div>
        </div>
        
        {/* Past NFTs */}
        {/* <div className="section past-nfts-section">
          <h2>Past Canvas NFTs</h2>
          <NFTGallery limit={3} />
          
          <div className="view-gallery-wrapper">
            <Link to="/gallery" className="view-gallery-btn">
              View All Canvas NFTs
            </Link>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}

export default HomePage;