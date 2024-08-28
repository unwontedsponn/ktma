import React from 'react';

interface ArrowProps {
  direction: 'left' | 'right';
  onClick?: () => void;
  width: number;
  height: number;
  hide?: string;
}

const Arrow: React.FC<ArrowProps> = ({ direction, onClick, width, height, hide }) => {
  // Determine the arrow path based on the direction prop
  const pathD = direction === 'left' ? "M30 10 L10 25 L30 40" : "M20 10 L40 25 L20 40";

  // Optionally, you could add more customization options like color and strokeWidth as props

  return (
    <div 
      className={`flex items-center opacity-10 hover:cursor-pointer hover:opacity-40 ${hide}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') onClick}}
    >
      <svg width={width} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={pathD} stroke="black" strokeWidth="5" fill="none" />
      </svg>
    </div>
  );
};

export default Arrow;
