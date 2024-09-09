import React from 'react';
import TypewriterEffect from '@/app/components/TypewriterEffect';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import Image from 'next/image';

const AboutMe: React.FC = () => {

  return (
    <section id="aboutMe" className="flex flex-col w-full h-screen pt-[var(--header-height)] pb-[var(--footer-height)] overflow-hidden">

      <div className="flex flex-row items-center justify-center h-screen overflow-hidden gap-x-8 px-0">
        
        {/* Left Column */}
        <div className="flex flex-col">       
        <SlideFadeIn direction="left" className="hidden md:block text-11xl leading-none font-gopher-mono-semi color-blue">
            <h1 className="opacity-40">aboutMe</h1>
          </SlideFadeIn>

          <SlideFadeIn direction="right" className="hidden text-4xl font-gopher-mono underline tracking-largep whitespace-nowrap px-10 md:px-0 md:pl-32 color-dark-blue text-decoration-color">
            <p className=""><TypewriterEffect text="A little bit about me..." /></p>
          </SlideFadeIn>
              
          <SlideFadeIn direction="up">
            <div className="pt-6 px-24 md:px-0 md:pr-2 text-right text-3vw md:text-sm font-gopher-mono text-dark max-w-3xl">
              <p>
                ...I&apos;m Ben, a 34-year-old musician and full stack JS/TS developer. I specialize in sound and tech projects using Next.js, Tailwind CSS, and Vercel. <span className="hidden md:block">My projects include a Snapchat filter, a music podcast platform, and a drumming app. In music I&apos;ve performed with Joy Crookes, toured at the Edinburgh Festival, taught ABRSM, examined for RSL, and composed for short films, such as the award-winning &apos;When We Fell&apos;, which received international acclaim. Currently, I release music independently as Sponn and Green and Pine.</span>
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
                  href="https://sponn.itch.io/keep-the-music-alive" 
                  className="hover:underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                  > KTMA
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
        <SlideFadeIn className="hidden xl:block" direction="right"> 
          <Image 
            src="/images/piano.png"            
            alt="Piano"
            width={500}
            height={0}            
            className="opacity-10"
            priority
          />
        </SlideFadeIn>

      </div>

    </section>
  );
}

export default AboutMe;