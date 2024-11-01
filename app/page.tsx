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

  useEffect(() => {
    const checkViewportHeight = () => {
      setShowFooter(window.innerHeight >= 702);
    };

    // Check viewport height on mount
    checkViewportHeight();

    // Add resize event listener
    window.addEventListener('resize', checkViewportHeight);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkViewportHeight);
    };
  }, []);

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className="h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl scroll-snap-y scroll-snap-mandatory">
          <Header />
          <Homepage />
          <AboutMe />
          <MyBook />
          <MyGame />
          {showFooter && <Footer />}
        </div>
      </main>
    </GlobalProvider>
  );
};

export default Home;
