import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import RotatingWords from '../components/RotatingWords';
import TypewriterEffect from '../components/TypewriterEffect';

const Homepage: React.FC = () => {
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false); // For width check  

  const [showRotatingWords, setShowRotatingWords] = useState(false);
  const words = ["things", "websites", "music", "books", "films", "games", "sketches"];

  // Check for height (used for detecting bookmark bar presence)
  useEffect(() => {
    const updateViewportHeight = () => {
      setIsSmallViewport(window.innerHeight <= 700);
    };

    // Check initial height
    updateViewportHeight();

    // Add resize event listener
    window.addEventListener('resize', updateViewportHeight);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  // Check for width (used for responsive small device layout)
  useEffect(() => {
    const updateViewportWidth = () => {
      setIsNarrowViewport(window.innerWidth < 768);
    };

    // Check initial width
    updateViewportWidth();

    // Add resize event listener
    window.addEventListener('resize', updateViewportWidth);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return (
    <section id="homepage" className="pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-full md:h-screen">
      <div className={`flex flex-col md:flex-row justify-center items-center md:gap-x-8 items-center h-auto md:h-screen ${isNarrowViewport ? 'space-y-8' : 'overflow-hidden'}`}>
      
        {/* Styling for devices wider than md (768px) */}
        {!isNarrowViewport ? (
          <>
            <div id="title-div" className="flex flex-col">
              <SlideFadeIn direction="down" className="hidden md:block text-sm md:pl-36 color-green font-gopher-mono-semi tracking-mediumphomepage">
                <p>I like to get things done</p>
              </SlideFadeIn>

              <SlideFadeIn direction="left" className="font-gopher-mono-semi color-blue leading-none text-20vw md:text-9xl xl:text-10xl">
                <p className="opacity-40">Hello,</p>
              </SlideFadeIn>

              <SlideFadeIn direction="right" className="hidden md:block text-4xl max-w-2xl color-dark-blue font-gopher-mono underline tracking-largep text-decoration-color md:pl-24">
                <p>and I like making... </p><RotatingWords words={words} />
              </SlideFadeIn>

              <SlideFadeIn direction="left" className="font-gopher-mono-semi color-blue leading-none hidden md:block text-11xl pb-0">
                <p className="opacity-40">I&apos;m Ben</p>
              </SlideFadeIn>

              <SlideFadeIn direction="up" className="hidden md:block pl-28 text-dark-500 font-gopher-mono tracking-smallphomepage text-xs max-w-2xl">
                {`I thrive on bringing ideas to life. From creating books and games to websites and musical pieces, I'm fueled by a passion for creative endeavors, and `}
                <span className="italic">getting things done</span>
              </SlideFadeIn>
            </div>
              <SlideFadeIn className={`${isNarrowViewport ? "max-w-sm": "" } md:hidden xl:block max-w-sm border-3 border-thick-border-gray`} direction="right"> 
              <Image
                src='/images/homepage-pic.jpeg'
                alt="homepage picture"
                width={isSmallViewport ? 300 : 500} // Smaller size for small viewports
                height={isSmallViewport ? 300 : 500}
                priority
              />
            </SlideFadeIn>   
          </>          
        ) : (
          <div className="space-y-6 px-4 sm:px-8 text-center py-16">
            {/* Styling for small devices */}                        
            <p className="font-gopher-mono-semi color-blue leading-tight text-6xl sm:text-7xl opacity-40">Hello,</p>            
                        
            <p className="font-gopher-mono-semi color-blue leading-tight text-7xl sm:text-8xl opacity-40">I&apos;m Ben</p>                                   

            <SlideFadeIn direction="right" className="flex justify-center"> 
              <Image
                src='/images/homepage-pic.jpeg'
                alt="homepage picture"
                width={500}
                height={500}     
                className="border-3 border-thick-border-gray"           
                priority
              />
            </SlideFadeIn>      

            <div className="font-gopher-mono items-center justify-center color-dark-blue font-gopher-mono underline tracking-largep text-decoration-color">
              <p className='text-xl'>and I like making... </p><RotatingWords className="text-4xl" words={words} />
            </div>                     

            <p className="text-sm sm:text-base text-dark-500 font-gopher-mono tracking-tight sm:tracking-normal max-w-full leading-relaxed">
              {`I thrive on bringing ideas to life. From creating books and games to websites and musical pieces, I'm fueled by a passion for creative endeavors, and `}
              <span className="italic color-green">getting things done.</span>
            </p>                  
          </div>          
        )}                      
      </div>         
    </section>
  );
};
export default Homepage;