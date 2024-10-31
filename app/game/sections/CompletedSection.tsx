import React from 'react';
import SlideFadeIn from "@/app/components/SlideFadeIn";
import TypewriterEffect from '@/app/components/TypewriterEffect';

const CompletedSection: React.FC = () => {
  return (
    <div className="space-y-4 relative">
      <SlideFadeIn direction="left" className="font-gopher-mono-semi leading-none text-11xl relative">
        <h1 className="opacity-40 color-blue ">myGame</h1>
        
        {/* BETA cross-out effect */}
        <span 
          className="absolute text-5xl font-gopher-mono color-pink opacity-70 transform rotate-12" 
          style={{
            top: '50%', 
            left: '10%', 
            transform: 'rotate(-12deg) translateY(-50%)'
          }}
        >
          BETA
        </span>
      </SlideFadeIn>

      <SlideFadeIn direction="right" className="color-dark-blue font-gopher-mono underline text-decoration-color tracking-largep text-3vw md:text-3xl md:pl-32">
        <p><TypewriterEffect text="Keep The Music Alive..." /></p>
      </SlideFadeIn>

      <SlideFadeIn direction="down" className="font-gopher-mono">
        <p className="w-[40vw] text-4xl text-center color-green">COMPLETED!</p>        
      </SlideFadeIn> 

      <SlideFadeIn direction="down" className="font-gopher-mono">
        <p className="w-[40vw]">I’d love to hear your feedback on the game—what you enjoyed, what could be improved, and any suggestions you may have. Please don’t hesitate to reach out!</p>
      </SlideFadeIn>       
    </div>
  );
};
export default CompletedSection;
