import React, { useState } from 'react';
import Canvas from '../components/canvas/Canvas';
import CanvasLoader from '../components/canvas/CanvasLoader';
import WalletConnect from '../components/auth/WalletConnect';
import UniversityVerification from '../components/auth/UniversityVerification';
import Layout from '../components/layout/Layout';

function CanvasPage({ eventId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  
  return (
    <Layout>
      <div className="canvas-page">
        <h1>Canvas Event #{eventId}</h1>
        
        {!hasAccess && (
          <div className="access-requirements">
            <h2>To participate in this canvas:</h2>
            <ol>
              <li>Connect your Solana wallet</li>
              <li>Verify your university affiliation</li>
              <li>Purchase a pixel placement slot</li>
            </ol>
            <WalletConnect />
            <UniversityVerification />
            <button 
              onClick={() => setHasAccess(true)}
              className="purchase-button"
            >
              Purchase Pixel Placement (0.1 SOL)
            </button>
          </div>
        )}
        
        {hasAccess && (
          <>
            {isLoading ? (
              <CanvasLoader 
                eventId={eventId} 
                onComplete={handleLoadingComplete} 
              />
            ) : (
              <Canvas eventId={eventId} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default CanvasPage;
