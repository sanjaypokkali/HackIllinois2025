import React, { useEffect, useState } from 'react';
import { getCanvasHistory } from '../services/canvasService';

function CanvasLoader({ eventId, onComplete }) {
  const [history, setHistory] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadHistory = async () => {
      const canvasHistory = await getCanvasHistory(eventId);
      setHistory(canvasHistory);
      setIsLoading(false);
      
      // Animate through history
      const interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= canvasHistory.length - 1) {
            clearInterval(interval);
            onComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      
      return () => clearInterval(interval);
    };
    
    loadHistory();
  }, [eventId, onComplete]);
  
  if (isLoading) {
    return <div className="canvas-loader">Loading canvas history...</div>;
  }
  
  return (
    <div className="canvas-animation">
      {history[currentFrame] && (
        <div className="canvas-frame">
          {/* Render the current frame of the canvas */}
        </div>
      )}
      <div className="loading-progress">
        {Math.round((currentFrame / (history.length - 1)) * 100)}%
      </div>
    </div>
  );
}

export default CanvasLoader;
