"use client";
import React, { useState, useEffect, Suspense } from 'react';
import MyGame from './sections/MyGame';

const Home: React.FC = () => {
  // const [showFooter, setShowFooter] = useState(true);
  const [isSmallViewport, setIsSmallViewport] = useState(false);

  useEffect(() => {
    const checkViewportWidth = () => {
      setIsSmallViewport(window.innerWidth < 768);
    };

    checkViewportWidth();
    window.addEventListener('resize', checkViewportWidth);
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, []);

  const handleGamePlayChange = (playing: boolean) => {
    // setShowFooter(!playing && !isSmallViewport);
  };

  return (    
    <main className="background-light flex justify-center">
      <div
        className={`${
          isSmallViewport
            ? 'overflow-y-auto overflow-x-hidden'
            : 'h-screen overflow-y-auto scroll-snap-y scroll-snap-mandatory'
        }`}
      >          
        <MyGame id="myGame" onPlayChange={handleGamePlayChange} />        
      </div>      
    </main>    
  );
};
export default Home;