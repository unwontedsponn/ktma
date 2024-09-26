// GameLogic.ts
import { useEffect, MutableRefObject, useRef, useState } from 'react';
import { Player, calculateJumpDistance, createPlayer, updatePlayer } from '@/app/game/entities/Player';
import { Obstacle, createObstacle, updateObstacles } from '@/app/game/entities/Obstacles';
import { PowerUp, updatePowerUps } from './entities/PowerUps';
import { FloorPlatform, getRandomInRange, createFloorPlatform, updateFloorPlatforms} from './entities/FloorPlatforms';
import { renderProgressBar } from './entities/ProgressBar';
import { CheckpointLine, updateCheckpointLines } from './entities/CheckpointLine';
import { checkMusicSection, musicSections } from './utils/Audio';

const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  floorPlatforms: FloorPlatform[],
  checkpointLines: CheckpointLine[],
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  animationFrameIdRef: MutableRefObject<number | null>,
  gameLoopFunctionRef: MutableRefObject<(timestamp: number) => void>,
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: MutableRefObject<HTMLAudioElement | null>,   
  setAudioType: (type: 'normal' | '8bit') => void,
  isPowerUpActive: boolean,
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

  checkMusicSection(currentTime, checkpointLines, canvasWidth, canvasHeight); // Use currentTime here

  const upcomingSection = musicSections.find(section => section - currentTime <= 1 && section - currentTime > 0);
  const nextSectionTime = upcomingSection || musicSections[0]; // Default to first section if no upcoming one

  updatePlayer(player, canvasWidth, canvasHeight, isPowerUpActive, gamePaused, setGamePaused, audio, floorPlatforms);
  updateObstacles(obstacles, player, canvasWidth, canvasHeight, setGamePaused, audio, gamePaused);
  updatePowerUps(powerUps, player, canvasWidth, canvasHeight, setIsPowerUpActive, audioRef, setAudioType); 
  updateFloorPlatforms(floorPlatforms, player, canvasWidth, canvasHeight, setGamePaused, audio, gamePaused) ;
  updateCheckpointLines(checkpointLines, player, canvasWidth, currentTime, nextSectionTime, gamePaused);
  renderGame(ctx, player, obstacles, powerUps, floorPlatforms, checkpointLines, audioRef);
  animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
};

const renderGame = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  floorPlatforms: FloorPlatform[],
  checkpointLines: CheckpointLine[],
  audioRef: MutableRefObject<HTMLAudioElement | null>
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render Player
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.rotation);
  ctx.fillStyle = player.color;
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
  
  powerUps.forEach(powerUp => {
    ctx.fillStyle = powerUp.color;
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  });

  floorPlatforms.forEach(floorPlatform => {
    ctx.fillStyle = floorPlatform.color;
    ctx.fillRect(floorPlatform.x, floorPlatform.y, floorPlatform.width, floorPlatform.height);
  });

  checkpointLines.forEach(checkpointLine => {
    ctx.fillStyle = checkpointLine.color;
    ctx.fillRect(checkpointLine.x, checkpointLine.y, checkpointLine.width, checkpointLine.height);
  });

  // Calculate current progress and the current time
  const totalSections = musicSections.length;
  const currentTime = audioRef?.current?.currentTime || 0;
  const currentSection = musicSections.findIndex(section => section > currentTime);
  const progress = currentSection >= 0 ? currentSection : totalSections;
  const nextSectionTime = musicSections[progress] || musicSections[totalSections - 1]; // Default to the last section end time

  // Render the progress bar with the current section filling as the player progresses
  renderProgressBar(ctx, totalSections, progress, ctx.canvas.width, currentTime, nextSectionTime);
};

export const useGameLogic = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasSetInitialVolume = useRef(false);
  const player = useRef<Player | null>(null);
  const obstacles = useRef<Obstacle[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const floorPlatforms = useRef<FloorPlatform[]>([]);
  const checkpointLines = useRef<CheckpointLine[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isPowerUpActive, setIsPowerUpActive] = useState(false);
  const [, setAudioType] = useState<'normal' | '8bit'>('normal');  

  const resetPlayer = (startingPlatform: FloorPlatform) => {
    if (player.current) {
      // Reinitialize player on the provided platform
      player.current = createPlayer(startingPlatform); 
    }
  };
  const resetObstacles = () => { obstacles.current = []; };
  const resetPowerUps = () => { powerUps.current = []; };
  const resetFloorPlatforms = () => { floorPlatforms.current = []; };
  const resetCheckpointLines = () => { checkpointLines.current = []; };

  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    // Only set the initial volume if it hasn't been set yet
    if (!hasSetInitialVolume.current) {
      audio.volume = 0.4;
      hasSetInitialVolume.current = true;  // Mark the initial volume as set
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;    

    if (!floorPlatforms.current.length) {
      // Ensure player exists
      if (!player.current) {
        const startingPlatform = createFloorPlatform(canvas.width, canvas.height, 0);
        floorPlatforms.current.push(startingPlatform);
        player.current = createPlayer(startingPlatform); // Create player if not already created
      }
    
      // Position the first platform near the left of the canvas
      if (!floorPlatforms.current.length) {
        floorPlatforms.current.push(createFloorPlatform(canvas.width, canvas.height, 0));
      }
    
      // Calculate a valid jumpable gap for the second platform
      const horizontalSpeed = 1.8; // Platform movement speed
      const jumpDistance = calculateJumpDistance(player.current!.jumpStrength, player.current!.gravity, horizontalSpeed);
    
      const maxGap = jumpDistance * 0.85; // Slightly less than player's max jump distance
      const minGap = 50; // Ensure there is always some gap, but not too small
      const gap = getRandomInRange(minGap, maxGap); // Random gap within the jumpable range
    
      // Spawn the second platform after the valid gap
      floorPlatforms.current.push(createFloorPlatform(canvas.width, canvas.height, floorPlatforms.current[0].width + gap));
    }

    const startingPlatform = floorPlatforms.current[0]; // First platform
    if (!player.current) player.current = createPlayer(startingPlatform);    
    player.current.isDead = false; // Reset player's death state

    let lastTime = 0;        

    // Initialize the game loop function
    gameLoopFunctionRef.current = (timestamp: number) => {
      if (gamePaused) return;
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;

      if (deltaTime > 12) {
        lastTime = timestamp;
        
        if (player.current) {
          gameLoop(
            ctx,
            player.current,
            obstacles.current,
            powerUps.current,
            floorPlatforms.current,
            checkpointLines.current,
            gamePaused,
            setGamePaused,
            audio,
            animationFrameIdRef,
            gameLoopFunctionRef,
            setIsPowerUpActive,
            audioRef,           
            setAudioType,    
            isPowerUpActive,              
          );
        }        
      }
      animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
    };
    
    // Start the game loop when the game starts or resumes
    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
      player.current.isDead = false;
    }

    // Set the obstacle spawning interval after the game starts
    const obstacleInterval = setInterval(() => {
      obstacles.current.push(createObstacle(canvas.width, canvas.height));
    }, 2000);        

    // Stop obstacles spawning and animation if the game is paused
    if (gamePaused) {
      if (obstacleInterval) clearInterval(obstacleInterval);
      const frameId = animationFrameIdRef.current;
      if (frameId !== null) cancelAnimationFrame(frameId);
      animationFrameIdRef.current = null;
    }

    const playerInstance = player.current;

    // Add event listeners for keydown and keyup, using player's methods
    const handleKeyDown = (event: KeyboardEvent) => playerInstance.handleKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) => playerInstance.handleKeyUp(event);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);    

    return () => {
      clearInterval(obstacleInterval);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      const frameId = animationFrameIdRef.current;
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [gameStarted, gamePaused, isPowerUpActive]);

  return {
    canvasRef,
    audioRef,
    gameStarted,
    setGameStarted,
    gamePaused,
    setGamePaused,
    resetPlayer,
    resetObstacles,
    resetPowerUps,  
    resetFloorPlatforms,  
    resetCheckpointLines,
    isPowerUpActive,
    floorPlatforms
  };
};
