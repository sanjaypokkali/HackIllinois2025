import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { getCanvasState, placePixelOnCanvas } from '../services/canvasService';

function useCanvas(eventId) {
  const [canvasState, setCanvasState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { wallet } = useWallet();
  
  useEffect(() => {
    const loadCanvas = async () => {
      setIsLoading(true);
      const state = await getCanvasState(eventId);
      setCanvasState(state);
      setIsLoading(false);
    };
    
    loadCanvas();
    
    // Set up real-time updates
    const interval = setInterval(loadCanvas, 5000);
    return () => clearInterval(interval);
  }, [eventId]);
  
  const placePixel = async (x, y, color) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    
    try {
      await placePixelOnCanvas(wallet, eventId, x, y, color);
      // Update local state optimistically
      const newState = [...canvasState];
      newState[y][x] = { color, walletAddress: wallet.publicKey.toString() };
      setCanvasState(newState);
    } catch (error) {
      console.error('Failed to place pixel:', error);
      throw error;
    }
  };
  
  return { canvasState, isLoading, placePixel };
}

export default useCanvas;
