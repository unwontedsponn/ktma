// GameStateManager.ts
import { Player, createPlayer } from "@/app/game/entities/Player/Player";
import { Obstacle } from "@/app/game/entities/Obstacles/Obstacles";
import { PowerUp } from "@/app/game/entities/PowerUps";
import { FloorPlatform } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { CheckpointLine } from "@/app/game/entities/CheckpointLine";
import AudioManager from "@/app/game/audio/AudioManager";
import { musicSections } from "@/app/game/audio/MusicLibrary";
import { MutableRefObject } from 'react';
import { initializePlatforms } from "@/app/game/entities/FloorPlatforms/FloorPlatformManager";
import { initializePlayer } from "@/app/game/entities/Player/PlayerManager";

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
  if (floorPlatforms && floorPlatforms.current) {
    floorPlatforms.current.forEach(platform => platform.hasPowerUp = false); // Reset hasPowerUp
    floorPlatforms.current = []; 
  }
};

export const resetCheckpointLines = (checkpointLines: MutableRefObject<CheckpointLine[]>) => {   
  if (checkpointLines && checkpointLines.current) checkpointLines.current = []; 
};

// Updated startGame function with required parameters
export const startGame = (
  setGameStarted: (started: boolean) => void,
  setGamePaused: (paused: boolean) => void,
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  player: MutableRefObject<Player | null>,
  floorPlatforms: MutableRefObject<FloorPlatform[]>,
  audioManager: AudioManager,
  canvasWidth: number,
  canvasHeight: number
) => {
  // Initialize platforms first to ensure they are available
  initializePlatforms(canvasWidth, canvasHeight, floorPlatforms);
  
  // Now, safely get the starting platform
  const startingPlatform = floorPlatforms.current[0];
  if (startingPlatform) initializePlayer(player, floorPlatforms, audioManager);
  else return;

  setGameStarted(true);
  setGamePaused(false);

  if (audioRef.current) audioRef.current.play().catch(error => console.error("Audio play error:", error));
  audioManager.playRandomNarration(); // Plays narration upon starting the game
};

export const resumeGame = async (
  setGamePaused: (paused: boolean) => void,
  setIsPowerUpActive: (isActive: boolean) => void,
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
  audioManager: AudioManager,
  canvasWidth: number,
  canvasHeight: number
) => {
  // Cancel the current animation frame if it's running
  if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

  // Unpause the game
  setGamePaused(false);

  // Reset power-up state
  setIsPowerUpActive(false);
  
  // Switch music back to default (e.g., normal)
  if (audioRef.current) {
    const currentTime = audioRef.current.currentTime;
    audioManager.switchMusic(audioRef, currentTime, 'normal', () => {});
  }

  // Reset the game state
  resetPlatformSpeed(platformSpeedRef, initialPlatformSpeed);
  resetObstacles(obstacles);
  resetPowerUps(powerUps);
  resetFloorPlatforms(floorPlatforms);
  resetCheckpointLines(checkpointLines);

  // Initialize platforms and set the player on the first platform
  initializePlatforms(canvasWidth, canvasHeight, floorPlatforms);
  const startingPlatform = floorPlatforms.current[0];
  resetPlayer(player, startingPlatform, audioManager);

  // Handle audio
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

    try { 
      await audioRef.current.play(); 
    } catch (error) { 
      console.error('Failed to play audio:', error); 
    }
  }

  // Start the game loop
  gameLoopFunctionRef.current(performance.now());
  audioManager.playRandomNarration(); // Plays narration upon resuming the game after a death
};