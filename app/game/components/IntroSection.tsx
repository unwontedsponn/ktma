import React from 'react';
import SlideFadeIn from "@/app/components/SlideFadeIn";

interface IntroSectionProps {
  setShowIntro: (show: boolean) => void;
  setShowInstructions: (show: boolean) => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ setShowIntro, setShowInstructions }) => {
  const showHowToPlay = () => {
    setShowIntro(false);
    setShowInstructions(true);
  };

  return (
    <div className="space-y-4">
      <SlideFadeIn direction="left" className="color-blue font-gopher-mono-semi leading-none text-11xl">
        <h1 className="opacity-40">myGame</h1>
      </SlideFadeIn>

      <SlideFadeIn direction="down" className="font-gopher-mono">
        <p className="w-[40vw]">Keep The Music Alive tells the story of a budding composer, eager to make his mark. To pass each level he must keep moving, overcoming obstacles to finish writing his masterpiece. This retro 2D platform game is music-led, where the player shapes the soundtrack in real-time as they play, blurring the boundaries between being a listener and an active creator of this mini album.</p>
      </SlideFadeIn>

      <div className="flex flex-col items-center">
        <SlideFadeIn direction="right" className="font-gopher-mono">
          <button onClick={showHowToPlay} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            How To Play
          </button>
        </SlideFadeIn>
      </div>
    </div>
  );
};
export default IntroSection;