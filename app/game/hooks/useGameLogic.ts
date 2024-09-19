// The useGameLogic file is a React custom hook that encapsulates the core logic for managing the game's lifecycle and interaction with the player. It serves as a bridge between the game's logic and the React component managing the game.
import { useEffect, MutableRefObject } from 'react';
import { Player, createPlayer } from '@/app/game/models/Player';
import { Obstacle, createObstacle, updateObstacles } from '@/app/game/models/Obstacles';
import { PowerUp, updatePowerUps } from '../models/PowerUps';
import { gameLoop } from '@/app/game/managers/GameManager';

interface UseGameLogicProps {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  player: MutableRefObject<Player>;
  obstacles: MutableRefObject<Obstacle[]>;
  powerUps: MutableRefObject<PowerUp[]>;
  gameStarted: boolean;
  gamePaused: boolean;
  setGamePaused: (paused: boolean) => void;
  resumeGame: () => void;
  animationFrameIdRef: MutableRefObject<number | null>;
  gameLoopFunctionRef: MutableRefObject<(timestamp: number) => void>;
  setIsPowerUpActive: React.Dispatch<React.SetStateAction<boolean>>;
  audioType: string; // Add audioType
  setAudioType: (type: 'normal' | '8bit') => void; // Add setAudioType
}

export const useGameLogic = ({
  canvasRef,
  audioRef,
  player,
  obstacles,
  powerUps,
  gameStarted,
  gamePaused,
  setGamePaused,
  resumeGame,
  animationFrameIdRef,
  gameLoopFunctionRef,
  setIsPowerUpActive,
  audioType,  // Add audioType
  setAudioType  // Add setAudioType
}: UseGameLogicProps) => {
  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    player.current = createPlayer(canvas.height);

    let lastTime = 0; // Track the last frame time

    // Initialize the game loop function
    gameLoopFunctionRef.current = (timestamp: number) => {
      if (gamePaused) return; // Prevent the game loop from continuing if paused
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;

      // Target 60fps (16.67ms per frame)
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
          audioRef, // Pass audioRef to the gameLoop
          audioType, // Pass audioType
          setAudioType // Pass setAudioType
        );

        updateObstacles(
          obstacles.current,
          player.current,
          canvas.width,
          canvas.height,
          setGamePaused,
          audio
        );
        
        updatePowerUps(
          powerUps.current,
          player.current,
          canvas.width,
          canvas.height,
          setIsPowerUpActive,
          audioRef, 
          audioType, 
          setAudioType
        );
      }

      animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
    };

    // Start the first frame
    animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);

    // Add obstacles at regular intervals
    const obstacleInterval = setInterval(() => {
      obstacles.current.push(createObstacle(canvas.width, canvas.height));
    }, 2000);

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        if (gamePaused) resumeGame();
        else if (!player.current.isJumping) {
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
  }, [canvasRef, audioRef, player, obstacles, gameStarted, gamePaused, setGamePaused, resumeGame, animationFrameIdRef, gameLoopFunctionRef]);
};