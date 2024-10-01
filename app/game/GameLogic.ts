// GameLogic.ts
import { useEffect, MutableRefObject, useRef, useState } from 'react';
import { renderGame } from '@/app/game/Renderer';
import { gameLoop } from '@/app/game/GameLoop';
import { initializePlatforms } from './entities/FloorPlatforms/FloorPlatformManager';
import { resetPlayer, resetObstacles, resetPowerUps, resetFloorPlatforms, resetCheckpointLines, resetPlatformSpeed } from "@/app/game/GameReset";

import { Player, calculateJumpDistance, createPlayer, updatePlayer } from '@/app/game/entities/Player';
import { Obstacle, updateObstacles } from '@/app/game/entities/notUsed/Obstacles';
import { PowerUp, updatePowerUps } from './entities/PowerUps';
import { FloorPlatform, updateFloorPlatforms} from './entities/FloorPlatforms/FloorPlatforms';
import { CheckpointLine, updateCheckpointLines } from './entities/CheckpointLine';
import { musicSections } from './audio/MusicLibrary';
import AudioManager from './audio/AudioManager';

// Define platform speed and control variables within the hook
const initialPlatformSpeed = 2.8;
const speedIncreaseRate = 0.001; // Rate at which the speed increases
const maxSpeed = 10; // Maximum speed to cap at

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
  const platformSpeedRef = useRef<number>(initialPlatformSpeed); // Use useRef instead of useState
  const [, setAudioType] = useState<'normal' | '8bit'>('normal');  

  // Instantiate the AudioManager
  const audioManager = new AudioManager(audioRef, 'normal');  

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
    
    initializePlatforms(canvas.width, canvas.height, player, floorPlatforms, audioManager);

    const startingPlatform = floorPlatforms.current[0]; // First platform
    if (!player.current) player.current = createPlayer(startingPlatform, audioManager);    
    player.current.isDead = false; // Reset player's death state

    let lastTime = 0;     

    // Initialize the game loop function
    gameLoopFunctionRef.current = (timestamp: number) => {
      if (gamePaused) return;
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;

      if (deltaTime > 12) {
        lastTime = timestamp;

        // Increase platform speed gradually using the ref
        platformSpeedRef.current = Math.min(platformSpeedRef.current + speedIncreaseRate, maxSpeed);
        console.log('Updated platformSpeed:', platformSpeedRef.current); // Debug log
        
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
            platformSpeedRef,
            audioManager 
          );
        }        
      }
      // Increase platform speed gradually in each frame      
      animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
    };
    
    // Start the game loop when the game starts or resumes
    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
      player.current.isDead = false;
    }

    // Set the obstacle spawning interval after the game starts
    const obstacleInterval = setInterval(() => {
      obstacles.current.push(Obstacle.createObstacle(canvas.width, canvas.height, audioManager));
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
    resetPlatformSpeed, // Include resetPlatformSpeed here
    platformSpeed: platformSpeedRef.current, // Provide platformSpeed to be used in other components    
    resetPlayer,
    resetObstacles,
    resetPowerUps,  
    resetFloorPlatforms,  
    resetCheckpointLines,    
    isPowerUpActive,    
    floorPlatforms
  };
};
