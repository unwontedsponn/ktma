// GameLogic.ts
import { useEffect, MutableRefObject, useRef, useState } from 'react';
import { Player, createPlayer, updatePlayer } from '@/app/game/entities/Player';
import { Obstacle, createObstacle, updateObstacles } from '@/app/game/entities/Obstacles';
import { PowerUp, updatePowerUps } from './entities/PowerUps';

// Game loop logic that was previously in GameManager.ts
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
  audioType: string,
  setAudioType: (type: 'normal' | '8bit') => void,
  playerColour: string,
  setPlayerColour: (color: string) => void,
) => {
  if (gamePaused) return;
  
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  updatePlayer(player, canvasHeight, playerColour);
  updateObstacles(obstacles, player, canvasWidth, canvasHeight, setGamePaused, audio);
  updatePowerUps(
    powerUps, 
    player, 
    canvasWidth, 
    canvasHeight, 
    setIsPowerUpActive, 
    audioRef, 
    audioType, 
    setAudioType,
    setPlayerColour
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

// Consolidated useGameLogic
export const useGameLogic = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const player = useRef(createPlayer(0));
  const obstacles = useRef<Obstacle[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isPowerUpActive, setIsPowerUpActive] = useState(false);
  const [audioType, setAudioType] = useState<'normal' | '8bit'>('normal');
  const [playerColour, setPlayerColour] = useState('#acddfb'); // Default color (light-blue)

  const resetObstacles = () => { obstacles.current = []; };
  const resetPowerUps = () => { powerUps.current = []; };

  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    player.current = createPlayer(canvas.height);

    let lastTime = 0;

    // Initialize the game loop function
    gameLoopFunctionRef.current = (timestamp: number) => {
      if (gamePaused) return;
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;

      if (deltaTime > 12) {
        lastTime = timestamp;
        
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
          audioType, 
          setAudioType,   
          playerColour,   
          setPlayerColour
        );
      }
      animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
    };

    animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);

    const obstacleInterval = setInterval(() => {
      obstacles.current.push(createObstacle(canvas.width, canvas.height));
    }, 2000);

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.code === 'Space') {        
        if (!player.current.isJumping) {
          player.current.velocityY = player.current.jumpStrength;
          player.current.isJumping = true;
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      clearInterval(obstacleInterval);
      document.removeEventListener('keydown', keyDownHandler);
      const frameId = animationFrameIdRef.current;
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [gameStarted, gamePaused]);

  return {
    canvasRef,
    audioRef,
    gameStarted,
    setGameStarted,
    gamePaused,
    setGamePaused,
    resetObstacles,
    resetPowerUps,
    playerColour,
    setPlayerColour,
  };
};
