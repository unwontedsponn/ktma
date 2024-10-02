// ObstacleManager.ts
import { Obstacle } from "@/app/game/entities/Obstacles/Obstacles";
import AudioManager from "@/app/game/audio/AudioManager";

export const startObstacleSpawning = (
  obstacles: React.MutableRefObject<Obstacle[]>,
  canvasWidth: number,
  canvasHeight: number,
  audioManager: AudioManager
) => {
  // Set an interval to spawn obstacles
  const obstacleInterval = setInterval(() => {
    obstacles.current.push(Obstacle.createObstacle(canvasWidth, canvasHeight, audioManager));
  }, 2000);

  // Return a function to clear the interval
  return () => clearInterval(obstacleInterval);
};
