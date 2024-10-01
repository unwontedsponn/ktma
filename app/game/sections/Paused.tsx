// Paused.tsx
import React, { useCallback, useEffect } from 'react';
import { musicSections } from '@/app/game/audio/MusicLibrary';
import { FloorPlatform } from '../entities/FloorPlatforms';
import { MutableRefObject } from 'react';

interface GamePausedSectionProps {
  setGamePaused: (paused: boolean) => void;
  animationFrameIdRef: React.MutableRefObject<number | null>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>;
  setCurrentSection: (section: number) => void;
  resetPlayer: (startingPlatform: FloorPlatform) => void;
  resetObstacles: () => void;
  resetPowerUps: () => void;
  resetFloorPlatforms: () => void;
  resetCheckpointLines: () => void;  
  floorPlatforms: MutableRefObject<FloorPlatform[]>;
  resetPlatformSpeed: () => void;
}

const GamePausedSection: React.FC<GamePausedSectionProps> = ({ 
  setGamePaused, 
  animationFrameIdRef, 
  audioRef, 
  gameLoopFunctionRef, 
  setCurrentSection,
  resetPlayer,
  resetObstacles,
  resetPowerUps,
  resetFloorPlatforms,
  resetCheckpointLines,  
  floorPlatforms,
  resetPlatformSpeed
}) => {

  const resumeGame = useCallback(async () => {
    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

    setGamePaused(false);
    
    // Reset all game elements
    const startingPlatform = floorPlatforms.current[0]; // Get the first platform
    resetPlayer(startingPlatform); // Pass the first platform to resetPlayer

    resetObstacles();
    resetPowerUps();
    resetFloorPlatforms();
    resetCheckpointLines(); 
    resetPlatformSpeed();   

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
    setGamePaused,
    animationFrameIdRef,
    audioRef,
    gameLoopFunctionRef,
    resetPlayer,
    resetObstacles,
    resetPowerUps,
    resetFloorPlatforms,
    resetCheckpointLines,    
    setCurrentSection,
    floorPlatforms,
    resetPlatformSpeed
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