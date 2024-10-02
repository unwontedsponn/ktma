import { Player, updatePlayer } from "@/app/game/entities/Player/Player";
import { Obstacle, updateObstacles } from "@/app/game/entities/Obstacles/Obstacles";
import { PowerUp, updatePowerUps } from "@/app/game/entities/PowerUps";
import { FloorPlatform, updateFloorPlatforms } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { CheckpointLine, updateCheckpointLines } from "@/app/game/entities/CheckpointLine";
import { renderGame } from "@/app/game/Renderer";
import AudioManager from "@/app/game/audio/AudioManager";
import { musicSections } from "@/app/game/audio/MusicLibrary";
import { getPlatformSpeed } from "./entities/FloorPlatforms/FloorPlatformManager";

export const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  floorPlatforms: FloorPlatform[],
  checkpointLines: CheckpointLine[],
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>,
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setAudioType: (type: 'normal' | '8bit') => void,
  isPowerUpActive: boolean,  
  audioManager: AudioManager
) => {
  if (gamePaused) {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null; // Clear the frame ID to fully stop the loop
    }
    return;
  }

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const currentTime = audioRef?.current?.currentTime || 0; // Calculate currentTime once

  audioManager.checkMusicSection(currentTime, checkpointLines, canvasWidth, canvasHeight); // Use currentTime here

  const upcomingSection = musicSections.find(section => section - currentTime <= 1 && section - currentTime > 0);
  const nextSectionTime = upcomingSection || musicSections[0]; // Default to first section if no upcoming one

  updatePlayer(player, canvasWidth, canvasHeight, isPowerUpActive, gamePaused, setGamePaused, audio, floorPlatforms, getPlatformSpeed());
  updateObstacles(obstacles, player, canvasWidth, canvasHeight, setGamePaused, audio, gamePaused, audioManager);
  updatePowerUps(powerUps, player, setIsPowerUpActive, audioRef, setAudioType, floorPlatforms, canvasWidth, audioManager, isPowerUpActive);
  updateFloorPlatforms(floorPlatforms, player, canvasWidth, canvasHeight, gamePaused, getPlatformSpeed());
  updateCheckpointLines(checkpointLines, player, canvasWidth, currentTime, nextSectionTime, gamePaused);

  renderGame(ctx, player, obstacles, powerUps, floorPlatforms, checkpointLines, audioRef);

  animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
};
