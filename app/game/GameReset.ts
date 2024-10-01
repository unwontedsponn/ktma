// GameReset.ts
import { Player, createPlayer } from "@/app/game/entities/Player";
import { Obstacle } from "@/app/game/entities/notUsed/Obstacles";
import { PowerUp } from "@/app/game/entities/PowerUps";
import { FloorPlatform } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { CheckpointLine } from "@/app/game/entities/CheckpointLine";
import AudioManager from "@/app/game/audio/AudioManager";
import { musicSections } from "@/app/game/audio/MusicLibrary";
import { MutableRefObject } from 'react';

// Function to reset the platform speed
export const resetPlatformSpeed = (platformSpeedRef: MutableRefObject<number>, initialPlatformSpeed: number) => {
  if (platformSpeedRef && platformSpeedRef.current !== undefined) platformSpeedRef.current = initialPlatformSpeed;
};

export const resetPlayer = (player: MutableRefObject<Player | null>, startingPlatform: FloorPlatform, audioManager: AudioManager) => {
  if (player && player.current) player.current = createPlayer(startingPlatform, audioManager);
};

export const resetObstacles = (obstacles: MutableRefObject<Obstacle[]>) => { 
  if (obstacles && obstacles.current) obstacles.current = []; 
};

export const resetPowerUps = (powerUps: MutableRefObject<PowerUp[]>) => {   
  if (powerUps && powerUps.current) powerUps.current = []; 
};

export const resetFloorPlatforms = (floorPlatforms: MutableRefObject<FloorPlatform[]>) => {   
  if (floorPlatforms && floorPlatforms.current) floorPlatforms.current = []; 
};

export const resetCheckpointLines = (checkpointLines: MutableRefObject<CheckpointLine[]>) => {   
  if (checkpointLines && checkpointLines.current) checkpointLines.current = []; 
};

// Centralized function to reset the game
export const resetGame = (
  player: MutableRefObject<Player | null>,
  startingPlatform: FloorPlatform,
  obstacles: MutableRefObject<Obstacle[]>,
  powerUps: MutableRefObject<PowerUp[]>,
  floorPlatforms: MutableRefObject<FloorPlatform[]>,
  checkpointLines: MutableRefObject<CheckpointLine[]>,
  platformSpeedRef: MutableRefObject<number>,
  initialPlatformSpeed: number,
  audioManager: AudioManager
) => {
  resetPlatformSpeed(platformSpeedRef, initialPlatformSpeed);
  resetPlayer(player, startingPlatform, audioManager);
  resetObstacles(obstacles);
  resetPowerUps(powerUps);
  resetFloorPlatforms(floorPlatforms);
  resetCheckpointLines(checkpointLines);
};

// Function to resume the game
export const resumeGame = async (
  setGamePaused: (paused: boolean) => void,
  animationFrameIdRef: MutableRefObject<number | null>,
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  gameLoopFunctionRef: MutableRefObject<(timestamp: number) => void>,
  setCurrentSection: (section: number) => void,
  player: MutableRefObject<Player | null>,
  obstacles: MutableRefObject<Obstacle[]>,
  powerUps: MutableRefObject<PowerUp[]>,
  floorPlatforms: MutableRefObject<FloorPlatform[]>,
  checkpointLines: MutableRefObject<CheckpointLine[]>,
  platformSpeedRef: MutableRefObject<number>,
  initialPlatformSpeed: number,
  audioManager: AudioManager
) => {
  if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

  setGamePaused(false);
  
  // Get the first platform to reset the player
  const startingPlatform = floorPlatforms.current[0]; 
  resetGame(player, startingPlatform, obstacles, powerUps, floorPlatforms, checkpointLines, platformSpeedRef, initialPlatformSpeed, audioManager);

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

    try { await audioRef.current.play(); } 
    catch (error) { console.error('Failed to play audio:', error); }
  }

  gameLoopFunctionRef.current(performance.now()); // Initialize the game loop
};
