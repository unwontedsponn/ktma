import { Player, updatePlayer } from './Player';
import { Obstacle, createObstacle, updateObstacles } from './Obstacles';

export const gameLoop = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  setGamePaused: (paused: boolean) => void,
  gameOver: { current: boolean },
  audio: HTMLAudioElement | null,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  gameLoopFunctionRef: React.MutableRefObject<() => void>,
) => {
  if (!gameOver.current) {
    updatePlayer(player, ctx.canvas.height);
    updateObstacles(obstacles, player, setGamePaused, gameOver, audio);
    renderGame(ctx, player, obstacles, gameOver);
    animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
  }
};

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  gameOver: { current: boolean },
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render player
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.rotation);
  ctx.fillStyle = player.color;
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  // Render obstacles
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  if (gameOver.current) {
    ctx.fillStyle = 'red';
    ctx.font = '48px serif';
    ctx.fillText('Game Over', ctx.canvas.width / 2 - 100, ctx.canvas.height / 2);
  }
};
