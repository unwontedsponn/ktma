// Paused.tsx
import React, { useCallback, useEffect } from 'react';
import { musicSections } from '@/app/game/utils/Audio';

interface GamePausedSectionProps {
  setGamePaused: (paused: boolean) => void;
  animationFrameIdRef: React.MutableRefObject<number | null>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>;
  currentSection: number;
  setCurrentSection: (section: number) => void;
  resetObstacles: () => void;
  resetPowerUps: () => void;
  resetCheckpointLines: () => void;
}

const GamePausedSection: React.FC<GamePausedSectionProps> = ({ 
  setGamePaused, 
  animationFrameIdRef, 
  audioRef, 
  gameLoopFunctionRef, 
  currentSection, 
  setCurrentSection,
  resetObstacles,
  resetPowerUps,
  resetCheckpointLines
}) => {

  const resumeGame = useCallback(async () => {
    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

    setGamePaused(false);
    resetObstacles();
    resetPowerUps();
    resetCheckpointLines();

    if (audioRef.current) {
      if (!audioRef.current.paused) audioRef.current.pause();

      // Find the nearest section timestamp before the current time
      const currentTime = audioRef.current.currentTime;
      const nearestSection = musicSections.reduce((prev, curr) => 
        curr <= currentTime ? curr : prev, musicSections[0]
      );

      audioRef.current.currentTime = nearestSection;

      // Update the current section state
      const newSectionIndex = musicSections.indexOf(nearestSection);
      setCurrentSection(newSectionIndex);

      try {await audioRef.current.play();} 
      catch (error) {console.error('Failed to play audio:', error);}
    }

    gameLoopFunctionRef.current(performance.now()); // Initialize the game loop
  }, [
    currentSection,
    setGamePaused,
    animationFrameIdRef,
    audioRef,
    gameLoopFunctionRef,
    resetObstacles,
    resetPowerUps,
    resetCheckpointLines,
    setCurrentSection,
  ]);

  // Handle the 'Space' key to resume the game
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') resumeGame();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {document.removeEventListener('keydown', handleKeyDown);};
  }, [resumeGame]);

  return (
    <button 
      onClick={resumeGame} 
      className="font-gopher-mono border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50"
    >
      Continue from last section... 
      <br></br>SPACE BAR
    </button>
  );
};
export default GamePausedSection;