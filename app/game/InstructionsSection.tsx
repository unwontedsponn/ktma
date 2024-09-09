import React from 'react';
import SlideFadeIn from "../components/SlideFadeIn";

interface InstructionsSectionProps {
  onStartGame: () => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ onStartGame }) => (
  <div className="space-y-4">
    <SlideFadeIn direction="down" className="font-gopher-mono">
      <p className="w-[40vw]">
        How To Play: To keep the music alive you must overcome the obstacles in your path, by jumping over them, or moving around them. Simple right? Not really, you'll see...
        <br />
        Jump = SPACE BAR
        <br />
        Left/Right = ARROW KEYS
        <br />
        Tokens transform the music you're creating. Each colour in a different way for you to discover. They also make you invincible against any obstacle. Each time you complete a level, you have completed an entire piece of music.
      </p>
    </SlideFadeIn>

    <div className="flex flex-col items-center">
      <SlideFadeIn direction="right" className="font-gopher-mono">
        <button onClick={onStartGame} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
          Play
        </button>
      </SlideFadeIn>
    </div>
  </div>
);
export default InstructionsSection;