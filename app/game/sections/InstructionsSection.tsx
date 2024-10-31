// InstructionsSection.tsx
import React from 'react';
import SlideFadeIn from "@/app/components/SlideFadeIn";
import TypewriterEffect from '@/app/components/TypewriterEffect';

interface InstructionsSectionProps {
  setShowIntro: (show: boolean) => void;
  setShowInstructions: (show: boolean) => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ 
  setShowIntro, setShowInstructions 
}) => {
  
  const showIntro = () => {
    setShowIntro(true);
    setShowInstructions(false);
  };

  return (
    <div className="space-y-4 w-[40vw]">
      <SlideFadeIn direction="right" className="color-dark-blue font-gopher-mono underline text-decoration-color text-4vw md:text-4xl md:pl-32 tracking-largep whitespace-nowrap">
        <p className=""><TypewriterEffect text="How To Play:" /></p>
      </SlideFadeIn>
      <SlideFadeIn direction="down" className="font-gopher-mono space-y-4 ">
        <p className="">
          To keep the music alive you must overcome the obstacles in your path, by jumping over them, or moving around them. Simple right? Not really, you&apos;ll see...
        </p>
        <p>Jump = SPACE BAR (Player can double jump)</p>                
        {/* <p>Left/Right = ARROW KEYS</p> */}
        <p>
          Tokens transform the music you&apos;re creating. Each colour in a different way for you to discover. They also make you invincible against any obstacle. Each time you complete a level, you have completed an entire piece of music.
        </p>              
      </SlideFadeIn>

      <div className="flex flex-col items-center">
        <SlideFadeIn direction="right" className="font-gopher-mono">
          <button onClick={showIntro} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            Back
          </button>
        </SlideFadeIn>
      </div>
    </div>
  );
};
export default InstructionsSection;