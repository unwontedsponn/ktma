"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MyGame from './sections/MyGame';

const ScrollHandler = () => {
  const searchParams = useSearchParams();
  const scrollToSection = searchParams.get('scrollTo');

  useEffect(() => {
    if (scrollToSection) {
      setTimeout(() => {
        const sectionElement = document.getElementById(scrollToSection);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [scrollToSection]);

  return null;
};

const Home: React.FC = () => {
  const [showFooter, setShowFooter] = useState(true);
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
    setShowFooter(!playing && !isSmallViewport);
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
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
    </main>    
  );
};
export default Home;