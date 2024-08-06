import React from 'react';
import TypewriterEffect from '@/app/components/TypewriterEffect';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import Image from 'next/image';

const MyScores: React.FC = () => {

  return (
    <section id="my-scores" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">

      <div className="flex flex-row justify-center gap-x-8 px-0 items-center h-screen overflow-hidden">      
        
        {/* Left Column */}
        <div className="flex flex-col">       
          <SlideFadeIn direction="left" className="color-blue font-gopher-mono-semi leading-none hidden md:block text-11xl">
            <h1 className="opacity-40">aboutMe</h1>
          </SlideFadeIn>

          <SlideFadeIn direction="right" className="color-dark-blue font-gopher-mono underline text-decoration-color hidden text-4xl px-10 md:px-0 md:pl-32 tracking-largep whitespace-nowrap">
            <p className=""><TypewriterEffect text="A little bit about me..." /></p>
          </SlideFadeIn>
              
          <SlideFadeIn direction="up">
            <div className="pt-6 md:pr-2 text-right font-gopher-mono text-3vw md:text-sm text-dark max-w-3xl px-24 md:px-0">
              <p>
                ...I&apos;m Ben, a 34-year-old musician and full stack JS/TS developer. I specialize in sound and tech projects using Next.js, Tailwind CSS, and Vercel. <span className="hidden md:block">My projects include a Snapchat filter, a music podcast platform, and a drumming app. In music I&apos;ve performed with Joy Crookes, toured at the Edinburgh Festival, taught ABRSM, examined for RSL, and composed for short films, such as the award-winning &apos;When We Fell&apos;, which received international acclaim. Currently, I release music independently as Sponn and Green and Pine.</span>
              </p>
              <p className="pt-2 hidden md:block"><span className="font-gopher-mono-semi">Extra Links:</span> 
                <a href="https://github.com/unwontedsponn" className="hover:underline"> GitHub</a> |
                <a href="https://www.linkedin.com/in/ben-spooner-12aab937/" className="hover:underline"> LinkedIn</a> |
                <a href="https://sponn.itch.io/keep-the-music-alive" className="hover:underline"> KTMA</a> |
                <a href="https://medium.com/@benspooner" className="hover:underline"> Blog</a>
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
            height={500}            
            className="opacity-10"
            priority
          />
        </SlideFadeIn>

      </div>

    </section>
  );
}

export default MyScores;