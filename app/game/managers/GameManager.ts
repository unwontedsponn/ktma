// The GameManager file serves as the core of the game's rendering and update loop, orchestrating how the game progresses frame by frame.
import { Player, updatePlayer } from '../models/Player';
import { Obstacle, updateObstacles } from '../models/Obstacles';

export const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>,
) => {
  if (gamePaused) return;
  
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  updatePlayer(player, canvasHeight);
  updateObstacles(obstacles, player, canvasWidth, canvasHeight, setGamePaused, audio);
  renderGame(ctx, player, obstacles);

  animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
};

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
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
};
