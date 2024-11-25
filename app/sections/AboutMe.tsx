import React, { useState, useEffect } from 'react';
import TypewriterEffect from '@/app/components/TypewriterEffect';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import Image from 'next/image';

interface AboutMeProps {
  id?: string;
}

const AboutMe: React.FC<AboutMeProps> = ({ id }) => {
  const [isNarrowViewport, setIsNarrowViewport] = useState(false); // For width check

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
    <section id={id} className="md:pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-screen md:h-screen">

      <div className={`flex flex-col md:flex-row justify-center items-center md:gap-x-8  items-center h-auto md:h-screen ${isNarrowViewport ? 'space-y-8' : 'overflow-hidden'}`}>
        
        {/* Styling for devices wider than md (768px) */}
        {!isNarrowViewport ? (
          <>
            <div className="flex flex-col">       
              <SlideFadeIn direction="left" className="hidden md:block text-11xl leading-none font-gopher-mono-semi color-blue">
                <h1 className="opacity-40">aboutMe</h1>
              </SlideFadeIn>

              <SlideFadeIn direction="right" className="hidden md:block text-4xl font-gopher-mono underline tracking-largep whitespace-nowrap px-10 md:px-0 md:pl-32 color-dark-blue text-decoration-color">
                <p className=""><TypewriterEffect text="A little bit about me..." /></p>
              </SlideFadeIn>
                  
              <SlideFadeIn direction="up">
                <div className="pt-6 px-24 md:px-0 md:pr-2 text-right text-3vw md:text-sm font-gopher-mono text-dark max-w-3xl">
                  <p>
                    ...Hello, I&apos;m Ben, a 35-year-old TypeScript/Javascript developer and musician. My tech stack for this website is Next.js, Tailwind CSS, Vercel & Stripe. In music I&apos;ve performed with artists such as Joy Crookes and recorded in venues like Abbey Road. I&apos;ve taught syllabuses such as ABRSM, examined for Yamaha, and composed for short films - such as the award-winning &apos;When We Fell&apos;. Currently, I release music independently as Sponn and Green and Pine.
                  </p>
                  <p className="hidden md:block pt-2"><span className="font-gopher-mono-semi">Extra Links:</span>
                    <a 
                      href="https://github.com/unwontedsponn" 
                      className="hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      > GitHub↑
                    </a> | 
                    <a 
                      href="https://www.linkedin.com/in/ben-spooner-12aab937/" className="hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      > LinkedIn↑
                    </a> | 
                    <a 
                      href="https://www.youtube.com/@BenSpooner" className="hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      > YouTube↑
                    </a>                                
                  </p>
                </div>            
              </SlideFadeIn>              
            </div>
            {/* Right Column */}
            <SlideFadeIn className="md:hidden xl:block" direction="right"> 
              <Image 
                src="/images/piano.png"            
                alt="Piano"
                width={500}
                height={0}            
                className="opacity-10"
                priority
              />
            </SlideFadeIn>
          </>
        ) : (
          <div className="space-y-8 px-4 sm:px-8 text-center bg-pink bg-opacity-10 py-24 border-b-3 border-thick-border-gray">                        
            <h1 className="text-7xl sm:text-9xl leading-none font-gopher-mono-semi color-blue opacity-40">aboutMe</h1>            
                        
            <p className='text-xl sm:text-3xl font-gopher-mono underline tracking-wide sm:tracking-large whitespace-nowrap color-dark-blue text-decoration-color'><TypewriterEffect text="A little bit about me..." /></p>              

            <div className="px-4 text-base font-gopher-mono text-dark max-w-xl sm:max-w-3xl mx-auto leading-relaxed">
              <p>
              ...Hello, I&apos;m Ben, a 35-year-old TypeScript/Javascript developer and musician. My tech stack for this website is Next.js, Tailwind CSS, Vercel & Stripe. In music I&apos;ve performed with artists such as Joy Crookes and recorded in venues like Abbey Road. I&apos;ve taught syllabuses such as ABRSM, examined for Yamaha, and composed for short films - such as the award-winning &apos;When We Fell&apos;. Currently, I release music independently as Sponn and Green and Pine.
              </p>
              <p className="">
                <span className="font-gopher-mono-semi flex flex-col mt-10">Extra Links</span>
                <a 
                  href="https://github.com/unwontedsponn" 
                  className="hover:underline ml-1"
                  target="_blank" 
                  rel="noopener noreferrer"
                > GitHub↑
                </a> | 
                <a 
                  href="https://www.linkedin.com/in/ben-spooner-12aab937/" 
                  className="hover:underline ml-1"
                  target="_blank" 
                  rel="noopener noreferrer"
                > LinkedIn↑
                </a> | 
                <a 
                  href="https://www.youtube.com/@BenSpooner" className="hover:underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                  > YouTube↑
                </a>                  
              </p>
            </div>                        

            {/* Image */}
            <SlideFadeIn direction="left" className="flex justify-center"> 
              <Image 
                src="/images/piano.png"            
                alt="Piano"
                width={500}
                height={500}            
                className="opacity-10"
                priority
              />
            </SlideFadeIn>
          </div>
        )}                                
      </div>
    </section>
  );
}
export default AboutMe;