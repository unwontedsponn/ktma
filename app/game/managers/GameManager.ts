/* ************************************ */
/* The GameManager file serves as the core of the game's rendering and update loop, orchestrating how the game progresses frame by frame. */
/* ************************************ */

import { Player, updatePlayer } from '../models/Player';
import { Obstacle, updateObstacles } from '../models/Obstacles';
import { PowerUp, updatePowerUps } from '../models/PowerUps';

export const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>,
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: React.RefObject<HTMLAudioElement>, 
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

export const renderGame = (
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
