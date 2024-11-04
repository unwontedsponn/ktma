// IntroSection.tsx
import React, { useState, useEffect } from 'react';
import SlideFadeIn from "@/app/components/SlideFadeIn";
import TypewriterEffect from '@/app/components/TypewriterEffect';
import { startGame } from '../GameStateManager';
import { Player } from '../entities/Player/Player';
import { FloorPlatform } from '../entities/FloorPlatforms/FloorPlatforms';
import AudioManager from '../audio/AudioManager';

interface IntroSectionProps {
  setShowIntro: (show: boolean) => void;
  setShowInstructions: (show: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setGamePaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  player: React.MutableRefObject<Player | null>;
  floorPlatforms: React.MutableRefObject<FloorPlatform[]>;
  audioManager?: AudioManager;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>; // Add canvasRef to props
}

const IntroSection: React.FC<IntroSectionProps> = ({ 
  setShowIntro, setShowInstructions, setGameStarted, setGamePaused, setLoading, audioRef, player, floorPlatforms, audioManager, canvasRef
}) => {

  const [isSmallViewport, setIsSmallViewport] = useState(false);  

  useEffect(() => {
    const updateViewportHeight = () => {
      setIsSmallViewport(window.innerHeight <= 700 || window.innerWidth <= 970);
    };

    // Check initial height
    updateViewportHeight();

    // Add resize event listener
    window.addEventListener('resize', updateViewportHeight);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  const handleStartGame = () => {
    if (!audioManager) {
      console.error("AudioManager is not initialized.");
      return;
    }
    const canvasWidth = canvasRef.current?.width || 0; // Get canvas width
    const canvasHeight = canvasRef.current?.height || 0; // Get canvas height
    startGame(setGameStarted, setGamePaused, setLoading, audioRef, player, floorPlatforms, audioManager, canvasWidth, canvasHeight);
    setShowIntro(false);
  };
  
  const showHowToPlay = () => {
    setShowIntro(false);
    setShowInstructions(true);
  };

  return (
    <div className="space-y-6 md:space-y-4 text-center">
      <SlideFadeIn direction="left" className="font-gopher-mono-semi leading-none text-7xl md:text-11xl relative">
        <h1 className="opacity-40 color-blue ">myGame</h1>
        
        {/* BETA cross-out effect */}
        <span 
          className="absolute text-xl md:text-5xl font-gopher-mono color-pink opacity-70 transform rotate-12" 
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
        <p className={`md:w-[40vw]`}>...tells the story of a budding composer, eager to make his mark. To pass each level he must keep moving and overcome obstacles to finish writing his masterpiece. This retro 2D platform game is music-led, where the player shapes the soundtrack in real-time as they play, blurring the boundaries between being a listener and an active creator of this album.</p>
      </SlideFadeIn>

      {/* This text is only visible on screens smaller than md */}
      <SlideFadeIn direction="down" className="md:hidden text-center font-gopher-mono text-xl color-dark">
        <p>Only playable on larger screens (min-width: 820px)</p>
      </SlideFadeIn>

      <div className="hidden md:flex flex-col items-center space-y-4">
        <SlideFadeIn direction="right" className="font-gopher-mono">
          <div className="flex space-x-4">
            <button 
              onClick={handleStartGame} 
              className={`${isSmallViewport ? 'text-xs' : 'text-base'} border-3 border-thick-border-gray py-2 px-4 hover:cursor-pointer hover:opacity-75`}
            >
              Level 1: All Change
            </button>
            <button 
              className={`${isSmallViewport ? 'text-xs' : 'text-base'} border-3 border-thick-border-gray py-2 px-4 text-gray-400 cursor-not-allowed opacity-50`}
              disabled
            >
              Level 2: Apprehension
            </button>
            <button 
              className={`${isSmallViewport ? 'text-xs' : 'text-base'} border-3 border-thick-border-gray py-2 px-4 text-gray-400 cursor-not-allowed opacity-50`}
              disabled
            >
              Level 3: Resolve
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={showHowToPlay} 
              className={`${isSmallViewport ? 'text-xs' : 'text-base'} border-3 border-thick-border-gray py-2 px-4 hover:cursor-pointer hover:opacity-75`}
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