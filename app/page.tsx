"use client";
import React, { useEffect, useState } from 'react';
import Header from './sections/Header';
import Homepage from './sections/Homepage';
import AboutMe from './sections/AboutMe';
import MyBook from './sections/MyBook';
import MyGame from './sections/MyGame';
import Footer from './sections/Footer';
import { GlobalProvider } from './contexts/GlobalContext';

const Home: React.FC = () => {
  const [showFooter, setShowFooter] = useState(true);  
  const [isGamePlaying, setIsGamePlaying] = useState(false);

  useEffect(() => {
    const isSmallViewport = window.innerHeight <= 702;    
  }, [isGamePlaying]);

  const handleGamePlayChange = (playing: boolean) => {
    setIsGamePlaying(playing);

    // Hide footer when game is actively playing
    setShowFooter(!playing);
  };

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className="h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl scroll-snap-y scroll-snap-mandatory">          
          <Header />
          <Homepage />
          <AboutMe />
          <MyBook />
          <MyGame onPlayChange={handleGamePlayChange} />
          {/* Render footer only if showFooter is true */}
          {showFooter && <Footer />}
        </div>
      </main>
    </GlobalProvider>
  );
};

export default Home;
