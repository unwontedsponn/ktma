// IntroSection.tsx
import React from 'react';
import SlideFadeIn from "@/app/components/SlideFadeIn";
import TypewriterEffect from '@/app/components/TypewriterEffect';
import { startGame, resumeGame } from '../GameStateManager';
import { Player } from '../entities/Player/Player';
import { FloorPlatform } from '../entities/FloorPlatforms/FloorPlatforms';
import AudioManager from '../audio/AudioManager';

interface IntroSectionProps {
  setShowIntro: (show: boolean) => void;
  setShowInstructions: (show: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setGamePaused: (paused: boolean) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  player: React.MutableRefObject<Player | null>;
  floorPlatforms: React.MutableRefObject<FloorPlatform[]>;
  audioManager?: AudioManager;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>; // Add canvasRef to props
}

const IntroSection: React.FC<IntroSectionProps> = ({ 
  setShowIntro, setShowInstructions, setGameStarted, setGamePaused, audioRef, player, floorPlatforms, audioManager, canvasRef
}) => {

  const handleStartGame = () => {
    if (!audioManager) {
      console.error("AudioManager is not initialized.");
      return;
    }
    const canvasWidth = canvasRef.current?.width || 0; // Get canvas width
    const canvasHeight = canvasRef.current?.height || 0; // Get canvas height
    startGame(setGameStarted, setGamePaused, audioRef, player, floorPlatforms, audioManager, canvasWidth, canvasHeight);
    setShowIntro(false);
  };
  
  const showHowToPlay = () => {
    setShowIntro(false);
    setShowInstructions(true);
  };

  return (
    <div className="space-y-4">
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
        <p className="w-[40vw]">...tells the story of a budding composer, eager to make his mark. To pass each level he must keep moving and overcome obstacles to finish writing his masterpiece. This retro 2D platform game is music-led, where the player shapes the soundtrack in real-time as they play, blurring the boundaries between being a listener and an active creator of this album.</p>
      </SlideFadeIn>

      <div className="flex flex-col items-center space-y-4">
        <SlideFadeIn direction="right" className="font-gopher-mono">
          <div className="flex space-x-4">
            <button 
              onClick={handleStartGame} 
              className="border-3 border-thick-border-gray py-2 px-4 hover:cursor-pointer hover:opacity-75"
            >
              Level 1: All Change
            </button>
            <button 
              className="border-3 border-thick-border-gray py-2 px-4 text-gray-400 cursor-not-allowed opacity-50"
              disabled
            >
              Level 2: Apprehension
            </button>
            <button 
              className="border-3 border-thick-border-gray py-2 px-4 text-gray-400 cursor-not-allowed opacity-50"
              disabled
            >
              Level 3: Resolve
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={showHowToPlay} 
              className="border-3 border-thick-border-gray py-2 px-4 hover:cursor-pointer hover:opacity-75"
            >
              How To Play
            </button>
          </div>
        </SlideFadeIn>
      </div>

    </div>
  );
};
export default IntroSection;



{/* <div className="flex flex-col items-center">
        <SlideFadeIn direction="right" className="font-gopher-mono">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-[500px]">
            <button className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
              Play All Change
            </button>
            <button className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
              Play Apprehension          </button>
            <button className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
              Play Resolve
            </button>
            <button onClick={showHowToPlay} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
              How To Play
            </button>    
          </div>                
        </SlideFadeIn>
      </div> */}