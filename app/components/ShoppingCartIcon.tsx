import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';

const ShoppingCartIcon: React.FC = () => {  
  const { cartCount } = useGlobalContext();

  return (
    <>      
      <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="#3f423e">
        <path d="M7 4h-2c-.55 0-1 .45-1 1s.45 1 1 1h2l1.68 8.59c.09.46.48.79.95.79h7.5c.47 0 .86-.33.95-.79L20 6H8.25L7 4zm0 2h11.24l-1.31 6.5H9.06L7 6zm0 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        {cartCount > 0 && (
          <>
            <circle className='cart-icon-circle' cx="18" cy="6" r="6" fill="#c15564" />
            <text x="18" y="7" fontFamily="Gopher Mono" fontSize="8" fill="white" textAnchor="middle" alignmentBaseline="middle" dominantBaseline="middle">{cartCount}</text>
          </>
        )}
        <line x1="2" y1="22" x2="22" y2="22" stroke="#c15564" strokeWidth="3" className="cart-underline" />
      </svg>
    </>    
  );
};
export default ShoppingCartIcon;