// Paused.tsx
import React, { useCallback, useEffect } from 'react';
import { FloorPlatform } from '../entities/FloorPlatforms/FloorPlatforms';
import { MutableRefObject } from 'react';
import { resumeGame } from "@/app/game/GameReset"; // Import the resumeGame function
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/notUsed/Obstacles';
import { PowerUp } from '../entities/PowerUps';
import { CheckpointLine } from '../entities/CheckpointLine';
import AudioManager from '../audio/AudioManager';

interface GamePausedSectionProps {
  setGamePaused: (paused: boolean) => void;
  animationFrameIdRef: React.MutableRefObject<number | null>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>;
  setCurrentSection: (section: number) => void;
  player: MutableRefObject<Player | null>;
  obstacles: MutableRefObject<Obstacle[]>;
  powerUps: MutableRefObject<PowerUp[]>;
  floorPlatforms: MutableRefObject<FloorPlatform[]>;
  checkpointLines: MutableRefObject<CheckpointLine[]>;
  platformSpeedRef: MutableRefObject<number>;
  initialPlatformSpeed: number;
  audioManager: AudioManager;
}

const GamePausedSection: React.FC<GamePausedSectionProps> = ({ 
  setGamePaused, 
  animationFrameIdRef, 
  audioRef, 
  gameLoopFunctionRef, 
  setCurrentSection,
  player,
  obstacles,
  powerUps,
  floorPlatforms,
  checkpointLines,
  platformSpeedRef,
  initialPlatformSpeed,
  audioManager
}) => {
  const handleResumeGame = useCallback(() => {
    resumeGame(
      setGamePaused,
      animationFrameIdRef,
      audioRef,
      gameLoopFunctionRef,
      setCurrentSection,
      player,
      obstacles,
      powerUps,
      floorPlatforms,
      checkpointLines,
      platformSpeedRef,
      initialPlatformSpeed,
      audioManager
    );
  }, [    
    setGamePaused,
    animationFrameIdRef,
    audioRef,
    gameLoopFunctionRef,
    setCurrentSection,
    player,
    obstacles,
    powerUps,
    floorPlatforms,
    checkpointLines,
    platformSpeedRef,
    initialPlatformSpeed,
    audioManager
  ]);

  // Handle the 'Space' key to resume the game
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') handleResumeGame();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, [handleResumeGame]);

  return (
    <button 
      onClick={handleResumeGame} 
      className="font-gopher-mono border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50"
    >
      Continue from last section... 
      <br></br>SPACE BAR
    </button>
  );
};
export default GamePausedSection;