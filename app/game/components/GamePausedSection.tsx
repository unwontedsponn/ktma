// GamePausedSection.tsx
import React, { useCallback } from 'react';
import { musicSections } from '@/app/game/utils/Music';

interface GamePausedSectionProps {
  setGamePaused: (paused: boolean) => void;
  animationFrameIdRef: React.MutableRefObject<number | null>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>;
  currentSection: number;
}

const GamePausedSection: React.FC<GamePausedSectionProps> = ({ 
  setGamePaused, 
  animationFrameIdRef, 
  audioRef, 
  gameLoopFunctionRef, 
  currentSection 
}) => {

  const resumeGame = useCallback(async () => {
    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

    setGamePaused(false);

    if (audioRef.current) {
      if (!audioRef.current.paused) audioRef.current.pause();
      audioRef.current.currentTime = musicSections[currentSection];
      try {await audioRef.current.play();} 
      catch (error) {console.error('Failed to play audio:', error);}
    }

    gameLoopFunctionRef.current(performance.now()); // Initialize the game loop
  }, [currentSection, setGamePaused, animationFrameIdRef, audioRef, gameLoopFunctionRef]);

  return (
    <button 
      onClick={resumeGame} 
      className="font-gopher-mono border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50"
    >
      Continue from last section...
    </button>
  );
};
export default GamePausedSection;