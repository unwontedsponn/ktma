// GameLogic.ts
import { useEffect, useRef, useState } from 'react';
import { startGameLoop, stopGameLoop } from '@/app/game/AnimationFrameManager';
import { createGameLoopFunction } from '@/app/game/GameLoopManager';
import { addPlayerInputListeners } from './entities/Player/PlayerInputManager';
import { resetPlayer, resetObstacles, resetPowerUps, resetFloorPlatforms, resetCheckpointLines } from "@/app/game/GameStateManager";
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
  const platformSpeedRef = useRef<number>(2.8);
  const highestSpeedRef = useRef<number>(2.8);
  const initialPlatformSpeed = 2.8;
  const deathCountRef = useRef<number>(0);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isPowerUpActive, setIsPowerUpActive] = useState(false);  
  const [, setAudioType] = useState<'normal' | '8bit'>('normal');   
  const [, setIsAudioManagerReady] = useState(false); 

  const speedIncreaseRate = 0.1;
  const maxSpeed = 10;

  useEffect(() => {
    if (audioManagerRef.current || !audioRef.current) return;
    audioManagerRef.current = setupAudioManager(audioRef);
    if (audioManagerRef.current) setIsAudioManagerReady(true);
  }, [audioRef]); // Ensure `audioRef` is the actual dependency, not `audioRef.current`  

  // Separate useEffect to handle platform speed increment
  useEffect(() => {
    if (gameStarted && !gamePaused) {

      const increaseSpeedInterval = setInterval(() => {
        platformSpeedRef.current = Math.min(platformSpeedRef.current + speedIncreaseRate, maxSpeed);
                
        if (platformSpeedRef.current > highestSpeedRef.current) highestSpeedRef.current = platformSpeedRef.current;
      }, 1000); // Increase speed every second
      return () => {clearInterval(increaseSpeedInterval);};
    }
  }, [gameStarted, gamePaused, speedIncreaseRate, maxSpeed]);

  useEffect(() => {
    if (gameStarted && !gamePaused) {     
      if (audioManagerRef.current?.audioRef.current && audioManagerRef.current.audioRef.current.paused) audioManagerRef.current.audioRef.current.play();
    }    

    if (gamePaused) {
      if (audioManagerRef.current?.audioRef.current && !audioManagerRef.current.audioRef.current.paused) audioManagerRef.current.audioRef.current.pause();
    }
  
    if (!gameStarted || gamePaused) return;
  
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    if (audioManagerRef.current) {
      // Initialize the game loop function
      gameLoopFunctionRef.current = createGameLoopFunction(
        ctx,
        player,
        obstacles,
        powerUps,
        floorPlatforms,
        checkpointLines,
        setGamePaused,
        audioRef,
        animationFrameIdRef,
        gameLoopFunctionRef,
        setIsPowerUpActive,        
        setAudioType,
        isPowerUpActive,
        audioManagerRef.current,
        platformSpeedRef,
        highestSpeedRef,
        deathCountRef
      );
  
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
    }
  }, [gameStarted, gamePaused, isPowerUpActive]);
  
  return {
    canvasRef,
    audioRef,
    gameStarted,
    setGameStarted,
    gamePaused,
    setGamePaused,
    setIsPowerUpActive,      
    resetPlayer,
    resetObstacles,
    resetPowerUps,
    resetFloorPlatforms,
    resetCheckpointLines,
    floorPlatforms,
    player,
    obstacles,
    powerUps,
    checkpointLines,
    audioManager: audioManagerRef.current ? audioManagerRef.current : undefined,
    platformSpeedRef,
    highestSpeedRef,
    initialPlatformSpeed,
  };
};
