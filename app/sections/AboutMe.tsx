import React, { useState, useEffect } from 'react';
import TypewriterEffect from '@/app/components/TypewriterEffect';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import Image from 'next/image';

const AboutMe: React.FC = () => {
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
    <section id="aboutMe" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full md:h-screen">

      <div className={`flex flex-col md:flex-row justify-center items-center gap-x-8 px-4 md:px-0 items-center h-auto md:h-screen ${isNarrowViewport ? 'space-y-8' : 'overflow-hidden'}`}>
        
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
                    ...I&apos;m Ben, a 34-year-old musician and JavaScript / TypeScript developer. I specialize in sound and tech projects using Next.js, Tailwind CSS, and Vercel. My projects include a Snapchat filter, a music podcast platform, and a drumming app. In music I&apos;ve performed with Joy Crookes, toured at the Edinburgh Festival, taught ABRSM, examined for RSL, and composed for short films, such as the award-winning &apos;When We Fell&apos;, which received international acclaim. Currently, I release music independently as Sponn and Green and Pine.
                  </p>
                  <p className="hidden md:block pt-2"><span className="font-gopher-mono-semi">Extra Links:</span>
                    <a 
                      href="https://github.com/unwontedsponn" 
                      className="hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      > GitHub
                    </a> | 
                    <a 
                      href="https://www.linkedin.com/in/ben-spooner-12aab937/" className="hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      > LinkedIn
                    </a> |                 
                    <a 
                      href="https://medium.com/@benspooner" 
                      className="hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                      > Blog
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
          <div className="space-y-6 px-4 sm:px-8 text-center">
            {/* Heading */}
            <SlideFadeIn direction="left" className="text-5xl sm:text-6xl leading-none font-gopher-mono-semi color-blue mb-2">
              <h1 className="opacity-40">aboutMe</h1>
            </SlideFadeIn>

            {/* Subheading with TypewriterEffect */}
            <SlideFadeIn direction="right" className="text-xl sm:text-2xl font-gopher-mono underline tracking-wide sm:tracking-large whitespace-nowrap px-4 sm:px-10 color-dark-blue text-decoration-color">
              <p><TypewriterEffect text="A little bit about me..." /></p>
            </SlideFadeIn>

            {/* Description */}
            <SlideFadeIn direction="up">
              <div className="pt-4 sm:pt-6 px-4 sm:px-24 text-sm sm:text-base font-gopher-mono text-dark max-w-xl sm:max-w-3xl mx-auto leading-relaxed">
                <p>
                  ...I&apos;m Ben, a 34-year-old musician and JavaScript / TypeScript developer. I specialize in sound and tech projects using Next.js, Tailwind CSS, and Vercel. My projects include a Snapchat filter, a music podcast platform, and a drumming app. In music, I&apos;ve performed with Joy Crookes, toured at the Edinburgh Festival, taught ABRSM, examined for RSL, and composed for short films, such as the award-winning &apos;When We Fell&apos;, which received international acclaim. Currently, I release music independently as Sponn and Green and Pine.
                </p>
                <p className="pt-3">
                  <span className="font-gopher-mono-semi">Extra Links:</span>
                  <a 
                    href="https://github.com/unwontedsponn" 
                    className="hover:underline ml-1"
                    target="_blank" 
                    rel="noopener noreferrer"
                  > GitHub
                  </a> | 
                  <a 
                    href="https://www.linkedin.com/in/ben-spooner-12aab937/" 
                    className="hover:underline ml-1"
                    target="_blank" 
                    rel="noopener noreferrer"
                  > LinkedIn
                  </a> | 
                  <a 
                    href="https://medium.com/@benspooner" 
                    className="hover:underline ml-1"
                    target="_blank" 
                    rel="noopener noreferrer"
                  > Blog
                  </a>
                </p>
              </div>            
            </SlideFadeIn>    

            {/* Image */}
            <SlideFadeIn className="flex justify-center" direction="right"> 
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