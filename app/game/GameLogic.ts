// GameLogic.ts
import { useEffect, MutableRefObject, useRef, useState } from 'react';
import { Player, createPlayer, updatePlayer } from '@/app/game/entities/Player';
import { Obstacle, createObstacle, updateObstacles } from '@/app/game/entities/Obstacles';
import { PowerUp, updatePowerUps } from './entities/PowerUps';
import { keyDownHandler, keyUpHandler } from './utils/InputHandlers';

const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  animationFrameIdRef: MutableRefObject<number | null>,
  gameLoopFunctionRef: MutableRefObject<(timestamp: number) => void>,
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: MutableRefObject<HTMLAudioElement | null>,   
  setAudioType: (type: 'normal' | '8bit') => void,
  isPowerUpActive: boolean
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

  updatePlayer(
    player, 
    canvasWidth,
    canvasHeight, 
    isPowerUpActive, 
    gamePaused
  );
  updateObstacles(
    obstacles, 
    player, 
    canvasWidth, 
    canvasHeight, 
    setGamePaused, 
    audio, 
    gamePaused
  );
  updatePowerUps(
    powerUps, 
    player, 
    canvasWidth, 
    canvasHeight, 
    setIsPowerUpActive, 
    audioRef,     
    setAudioType,    
  );
  renderGame(ctx, player, obstacles, powerUps);
  animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
};

const renderGame = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
};

export const useGameLogic = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const player = useRef<Player | null>(null);
  const obstacles = useRef<Obstacle[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isPowerUpActive, setIsPowerUpActive] = useState(false);
  const [, setAudioType] = useState<'normal' | '8bit'>('normal');  

  const resetObstacles = () => { obstacles.current = []; };
  const resetPowerUps = () => { powerUps.current = []; };

  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;    

    if (!player.current) player.current = createPlayer(canvas.height);

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

    // Add event listeners for keydown and keyup
    const handleKeyDown = (event: KeyboardEvent) => keyDownHandler(event, playerInstance);
    const handleKeyUp = (event: KeyboardEvent) => keyUpHandler(event, playerInstance);
    
    // Add event listeners
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
    resetObstacles,
    resetPowerUps,    
    isPowerUpActive
  };
};
