import React from 'react';
import LargeScreenSection from '../components/LargeScreenSection';
import TypewriterEffect from '@/app/components/TypewriterEffect';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import Image from 'next/image';

const AboutMe: React.FC = () => {

  return (
    <section id="aboutMe" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">

      <LargeScreenSection paddingX='px-32'>
        
        {/* Left Column */}
        <div className="flex flex-col w-2/3">       
          <SlideFadeIn direction="left" className="color-blue font-gopher-mono-semi leading-none text-11xl">
            <h1 className="opacity-40">aboutMe</h1>
          </SlideFadeIn>

          <SlideFadeIn direction="right" className="color-dark-blue font-gopher-mono underline text-decoration-color text-4xl pl-32 tracking-largep whitespace-nowrap">
            <p className=""><TypewriterEffect text="A little bit about me..." /></p>
            {/* <p className=""><TypewriterEffect text="musician & javascript developer" /></p> */}
          </SlideFadeIn>
              
          <SlideFadeIn direction="up">
            <div className="pt-6 pr-2 text-right font-gopher-mono text-sm text-dark">
              <p>
                Hello there! I&apos;m <span className='font-gopher-mono-semi'>Ben Spooner</span>, a 34-year-old musician and full stack Typescript developer. I specialize in sound and tech projects using Next.js, Tailwind CSS, and Vercel. My projects include a Snapchat filter, a music podcast platform, and a drumming app. In music I&apos;ve performed with Joy Crookes, toured at the Edinburgh Festival, taught ABRSM, examined for RSL, and composed for short films, such as the award-winning &apos;When We Fell&apos;, which received international acclaim. Currently, I release music independently as Sponn and Green and Pine.
              </p>
              <p className="pt-2"><span className="font-gopher-mono-semi">Extra Links:</span> 
                <a href="https://github.com/unwontedsponn" className="hover:underline"> GitHub</a> |
                <a href="https://www.linkedin.com/in/ben-spooner-12aab937/" className="hover:underline"> LinkedIn</a> |
                <a href="https://sponn.itch.io/keep-the-music-alive" className="hover:underline"> KTMA</a> |
                <a href="https://medium.com/@benspooner" className="hover:underline"> Blog</a>
              </p>
            </div>            
          </SlideFadeIn>              

        </div>
                          
        {/* Right Column */}
        <SlideFadeIn className="w-1/3" direction="right"> 
          <Image 
            src="/images/piano.png"            
            alt="Piano"
            width={500}
            height={500}            
            className="opacity-10"
          />
        </SlideFadeIn>

      </LargeScreenSection>

    </section>
  );
}

export default AboutMe;