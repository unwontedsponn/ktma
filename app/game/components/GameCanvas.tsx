import React from 'react';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ canvasRef }) => (
  <canvas ref={canvasRef} id="gameCanvas" width="800" height="600" className="border-b-4 border-grey-black-brown"></canvas>
);
export default GameCanvas;