import React, { useEffect, useState } from 'react';
import Pixel from './Pixel';
import useCanvas from '../../hooks/useCanvas';
import { getCanvasState } from '../services/canvasService';

function Canvas({ eventId }) {
  const { canvasState, placePixel } = useCanvas(eventId);
  const [selectedColor, setSelectedColor] = useState('#000000');
  
  const handlePixelClick = (x, y) => {
    placePixel(x, y, selectedColor);
  };
  
  return (
    <div className="canvas-container">
      <div className="canvas-grid">
        {canvasState.map((row, y) => (
          <div key={`row-${y}`} className="canvas-row">
            {row.map((pixel, x) => (
              <Pixel 
                key={`pixel-${x}-${y}`}
                color={pixel.color}
                x={x}
                y={y}
                onClick={() => handlePixelClick(x, y)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="color-picker">
        <input 
          type="color" 
          value={selectedColor} 
          onChange={(e) => setSelectedColor(e.target.value)} 
        />
      </div>
    </div>
  );
}

export default Canvas;
