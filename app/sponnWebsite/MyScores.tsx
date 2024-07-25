import React from 'react';
import LargeScreenSection from '@/app/components/LargeScreenSection';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import TypewriterEffect from '@/app/components/TypewriterEffect';

const MyScores: React.FC = () => {

  return (
    <section id="myScores" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">   

        <LargeScreenSection flexDirection='flex-col'>
          
        <SlideFadeIn direction="left" className="color-blue font-gopher-mono-semi text-9xl">
            <h1 className="opacity-40">myScores</h1>
          </SlideFadeIn>

          {/* Typewriter effect to dynamically display the title of the current video */}
          <SlideFadeIn direction="right" className="color-dark-blue font-gopher-mono underline text-decoration-color text-2xl tracking-largep whitespace-nowrap">
            <p>
              <TypewriterEffect text='coming soon' />
            </p>
          </SlideFadeIn>

        </LargeScreenSection>
    </section>
  )
}
export default MyScores;