import React from 'react';

function Pixel({ color, x, y, onClick }) {
  return (
    <div 
      className="pixel"
      style={{ backgroundColor: color }}
      onClick={onClick}
      data-x={x}
      data-y={y}
    />
  );
}

export default Pixel;
