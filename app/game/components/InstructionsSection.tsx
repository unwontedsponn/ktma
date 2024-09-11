import React from 'react';
import SlideFadeIn from "@/app/components/SlideFadeIn";
import TypewriterEffect from '@/app/components/TypewriterEffect';

interface InstructionsSectionProps {
  setGameStarted: (started: boolean) => void;
  setGamePaused: (paused: boolean) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ setGameStarted, setGamePaused, audioRef }) => {
  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(error => console.error("Audio play error:", error));
    }
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
        <p>Jump = SPACE BAR</p>
        <p>Left/Right = ARROW KEYS</p>
        <p>
          Tokens transform the music you&apos;re creating. Each colour in a different way for you to discover. They also make you invincible against any obstacle. Each time you complete a level, you have completed an entire piece of music.
        </p>              
      </SlideFadeIn>

      <div className="flex flex-col items-center">
        <SlideFadeIn direction="right" className="font-gopher-mono">
          <button onClick={startGame} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            Play
          </button>
        </SlideFadeIn>
      </div>
    </div>
  );
};
export default InstructionsSection;