"use client";
import React, { useState, useEffect } from 'react';
import Header from './sections/Header';
import Homepage from './sections/Homepage';
import AboutMe from './sections/AboutMe';
import MyBook from './sections/MyBook';
import MyGame from './sections/MyGame';
import Footer from './sections/Footer';
import { GlobalProvider } from './contexts/GlobalContext';

const Home: React.FC = () => {
  const [showFooter, setShowFooter] = useState(true);
  const [isSmallViewport, setIsSmallViewport] = useState(false);

  useEffect(() => {
    const checkViewportWidth = () => {
      setIsSmallViewport(window.innerWidth < 768); // `md` breakpoint in Tailwind is typically 768px
    };

    // Check initial width
    checkViewportWidth();

    // Add resize event listener
    window.addEventListener('resize', checkViewportWidth);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, []);

  const handleGamePlayChange = (playing: boolean) => {
    // Conditionally hide footer based on playing state and viewport width
    setShowFooter(!playing && !isSmallViewport);
  };

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        {/* Use conditional classes to apply different layouts for different viewport sizes */}
        <div
          className={`${
            isSmallViewport
              ? 'overflow-y-auto overflow-x-hidden' // Standard scrolling for smaller viewports
              : 'h-screen overflow-y-auto scroll-snap-y scroll-snap-mandatory' // Single-page scroll for larger viewports
          }`}
        >
          <Header />
          {/* Render components normally without scroll-snap */}
          <Homepage />
          <AboutMe />
          <MyBook />
          <MyGame onPlayChange={handleGamePlayChange} />
          {/* Show the footer unless it's hidden due to gameplay or viewport */}
          {showFooter && <Footer />}
        </div>
      </main>
    </GlobalProvider>
  );
};

export default Home;
