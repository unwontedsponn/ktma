import { Player } from "./Player";

export type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createObstacle = (canvasWidth: number, canvasHeight: number): Obstacle => ({
  x: canvasWidth,
  y: canvasHeight - 50,
  width: 20,
  height: 40,
  color: '#c15564', // dark-pink
});

export const updateObstacles = (
  obstacles: Obstacle[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null
) => {
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 2;

    if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      setGamePaused(true);
      if (audio) audio.pause();
    }
  });
  if (Math.random() < 0.01) obstacles.push(createObstacle(canvasWidth, canvasHeight));
};
