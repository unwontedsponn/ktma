// GameLogic.ts
import { useEffect, useRef, useState } from 'react';
import { startGameLoop, stopGameLoop } from '@/app/game/AnimationFrameManager';
import { createGameLoopFunction } from '@/app/game/GameLoopManager';
import { getPlatformSpeed, resetPlatformSpeed } from './entities/FloorPlatforms/FloorPlatformManager';
import { addPlayerInputListeners } from './entities/Player/PlayerInputManager';
import { resetGame, resetPlayer, resetObstacles, resetPowerUps, resetFloorPlatforms, resetCheckpointLines } from "@/app/game/GameStateManager";
import { setupAudioManager } from './audio/AudioManagerSetup';
import { Player } from '@/app/game/entities/Player/Player';
import { Obstacle } from '@/app/game/entities/Obstacles/Obstacles';
import { startObstacleSpawning } from './entities/Obstacles/ObstacleManager';
import { PowerUp } from './entities/PowerUps';
import { FloorPlatform } from './entities/FloorPlatforms/FloorPlatforms';
import { CheckpointLine } from './entities/CheckpointLine';
import AudioManager from './audio/AudioManager';

export const useGameLogic = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);  
  const audioManagerRef = useRef<AudioManager | null>(null); // Use a ref to store audioManager
  const player = useRef<Player | null>(null);
  const obstacles = useRef<Obstacle[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const floorPlatforms = useRef<FloorPlatform[]>([]);  
  const checkpointLines = useRef<CheckpointLine[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  const platformSpeedRef = useRef<number>(2.8); // Initial platform speed
  const initialPlatformSpeed = 2.8; // Define your initial platform speed
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isPowerUpActive, setIsPowerUpActive] = useState(false);  
  const [, setAudioType] = useState<'normal' | '8bit'>('normal');   
  const [, setIsAudioManagerReady] = useState(false); 

  // New: Try to set up audioManager every time audioRef changes
  useEffect(() => {
    if (!audioManagerRef.current && audioRef.current) {
      console.log('Attempting to set up AudioManager...');
      audioManagerRef.current = setupAudioManager(audioRef, 'normal');
      
      if (audioManagerRef.current) {
        console.log('AudioManager successfully set up.');
        setIsAudioManagerReady(true); // Mark as ready
      } else {
        console.error('Failed to set up AudioManager.');
      }
    }
  }, [audioRef.current]); // Depend directly on audioRef.current

  useEffect(() => {
    if (!gameStarted || gamePaused) {
      console.log('Game is not started or is paused. Exiting useEffect.');
      return;
    }
  
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) {
      console.error('Canvas or audio element is not available. Exiting useEffect.');
      return;
    }        
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context. Exiting useEffect.');
      return;
    }
  
    // Check if audioManagerRef.current is not null before using it
    if (audioManagerRef.current) {
      console.log('Initializing game elements...');      
        
      resetGame(
        player,      
        obstacles,
        powerUps,
        floorPlatforms,
        checkpointLines,
        platformSpeedRef,
        initialPlatformSpeed,
        audioManagerRef.current,
        canvas.width,
        canvas.height
      );
  
      // Initialize the game loop function
      gameLoopFunctionRef.current = createGameLoopFunction(
        ctx,
        player,
        obstacles,
        powerUps,
        floorPlatforms,
        checkpointLines,
        setGamePaused,
        audio,
        animationFrameIdRef,
        gameLoopFunctionRef,
        setIsPowerUpActive,
        audioRef,
        setAudioType,
        isPowerUpActive,
        audioManagerRef.current
      );
  
      console.log('Starting game loop...');
      startGameLoop(gameLoopFunctionRef, animationFrameIdRef, player);
  
      const stopObstacleSpawning = startObstacleSpawning(obstacles, canvas.width, canvas.height, audioManagerRef.current);
  
      if (!player.current) return;
      const playerInstance = player.current;
      const removeInputListeners = addPlayerInputListeners(playerInstance);
  
      return () => {
        stopObstacleSpawning();
        removeInputListeners();
        stopGameLoop(animationFrameIdRef);
      };
    } else {
      console.error('AudioManager is not initialized. Exiting useEffect.');
    }
  }, [gameStarted, gamePaused, isPowerUpActive]);  

  return {
    canvasRef,
    audioRef,
    gameStarted,
    setGameStarted,
    gamePaused,
    setGamePaused,
    resetPlatformSpeed,
    platformSpeed: getPlatformSpeed(),
    resetPlayer,
    resetObstacles,
    resetPowerUps,
    resetFloorPlatforms,
    resetCheckpointLines,
    isPowerUpActive,
    floorPlatforms,
    player,
    obstacles,
    powerUps,
    checkpointLines,
    audioManager: audioManagerRef.current ? audioManagerRef.current : undefined,
    platformSpeedRef,
    initialPlatformSpeed,
  };
};
