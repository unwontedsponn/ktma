"use client";
import React, { useState } from 'react';
import Header from './sections/Header';
import Homepage from './sections/Homepage';
import AboutMe from './sections/AboutMe';
import MyBook from './sections/MyBook';
import MyGame from './sections/MyGame';
import Footer from './sections/Footer';
import { GlobalProvider } from './contexts/GlobalContext';

const Home: React.FC = () => {
  const [showFooter, setShowFooter] = useState(true);
  // const [showHeader, setShowHeader] = useState(true);

  const handleGamePlayChange = (playing: boolean) => {
    const isSmallViewport = window.innerHeight <= 700;

    // Conditionally hide footer and header when game is actively playing on a small viewport
    setShowFooter(!playing);
    // setShowHeader(!(playing && isSmallViewport));
  };

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className="h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl scroll-snap-y scroll-snap-mandatory">
          {/* {showHeader && <Header />} */}
          <Header />
          <Homepage />
          <AboutMe />
          <MyBook />
          <MyGame onPlayChange={handleGamePlayChange} />
          {showFooter && <Footer />}
        </div>
      </main>
    </GlobalProvider>
  );
};

export default Home;
