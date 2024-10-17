// GameLoop.tsx
import { Player, updatePlayer } from "@/app/game/entities/Player/Player";
import { Obstacle, updateObstacles } from "@/app/game/entities/Obstacles/Obstacles";
import { PowerUp, updatePowerUps } from "@/app/game/entities/PowerUps";
import { FloorPlatform } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { updateFloorPlatforms, updateSafeFloorPlatforms } from "@/app/game/entities/FloorPlatforms/FloorPlatformManager";
import { CheckpointLine, updateCheckpointLines } from "@/app/game/entities/CheckpointLine";
import { renderGame } from "@/app/game/Renderer";
import AudioManager from "@/app/game/audio/AudioManager";
import { musicSections } from "@/app/game/audio/MusicLibrary";
import { stopGameLoop } from "./AnimationFrameManager";

export const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  floorPlatforms: FloorPlatform[],
  checkpointLines: CheckpointLine[],
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,  
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>,
  setIsPowerUpActive: (isActive: boolean) => void,  
  setAudioType: (type: 'normal' | '8bit') => void,
  isPowerUpActive: boolean,  
  audioManager: AudioManager,
  platformSpeedRef: React.MutableRefObject<number>,
  highestSpeedRef: React.MutableRefObject<number>,
  deathCountRef: React.MutableRefObject<number>,
  isBeyondLastCheckpointRef: React.MutableRefObject<boolean>,
) => {
  if (gamePaused) {
    stopGameLoop(animationFrameIdRef);  // Use stopGameLoop instead of cancelAnimationFrame
    if (audioManager.audioRef.current && !audioManager.audioRef.current.paused) audioManager.audioRef.current.pause();
    return;
  }

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const currentTime = audioRef?.current?.currentTime || 0; // Calculate currentTime once  

  // Check if the player has reached the last section (last checkpoint)
  const totalSections = musicSections.length;
  const currentSection = musicSections.findIndex(section => section > currentTime);

  // Use a strict comparison to ensure we only trigger on the last section
  const isLastCheckpointReached = currentSection === totalSections - 1;

  // If the last checkpoint has been reached, set the flag to `true`
  if (isLastCheckpointReached && !isBeyondLastCheckpointRef.current) {
    console.log("Last checkpoint reached, switching to safe zone platforms.");
    isBeyondLastCheckpointRef.current = true;  // Ensure we don’t switch back
  }

  audioManager.checkMusicSection(currentTime, checkpointLines, canvasWidth, canvasHeight); // Use currentTime here

  const upcomingSection = musicSections.find(section => section - currentTime <= 1 && section - currentTime > 0);
  const nextSectionTime = upcomingSection || musicSections[0]; // Default to first section if no upcoming one

  // Update Player
  const previousPlayerState = player.isDead; // Track the previous state to detect changes
  updatePlayer(player, canvasWidth, canvasHeight, isPowerUpActive, gamePaused, setGamePaused, audioRef.current, floorPlatforms, platformSpeedRef.current);

  // If the player has just died, increase the death count
  if (player.isDead && !previousPlayerState) {
    deathCountRef.current += 1;
    audioManager.pauseNarration();    
  }
  
  updateObstacles(obstacles, player, canvasWidth, canvasHeight, setGamePaused, audioRef.current, gamePaused, audioManager);
  updatePowerUps(powerUps, player, setIsPowerUpActive, audioRef, setAudioType, floorPlatforms, canvasWidth, audioManager, isPowerUpActive);

  // Conditionally update platforms
  if (isBeyondLastCheckpointRef.current) {
    // ** Continue adding safe platforms until the end of the track **
    updateSafeFloorPlatforms(floorPlatforms, player, canvasWidth, canvasHeight, gamePaused, platformSpeedRef.current, isPowerUpActive, audioRef);
  } else {
    // ** Regular platform creation **
    updateFloorPlatforms(floorPlatforms, player, canvasWidth, canvasHeight, gamePaused, platformSpeedRef.current, isPowerUpActive);
  }

  updateCheckpointLines(checkpointLines, player, canvasWidth, currentTime, nextSectionTime, gamePaused);

  // Progress the typing effect for narration
  audioManager.typeNextLetter();

  document.fonts.load('24px Gopher Mono').then(() => {
    // Assuming the `renderGame` function is called after this point
    renderGame(ctx, player, obstacles, powerUps, floorPlatforms, checkpointLines, audioRef, deathCountRef.current, audioManager, canvasWidth, canvasHeight, platformSpeedRef, highestSpeedRef);
  });  

  animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
};
