import { Player } from "@/app/game/models/Player";

export type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createObstacle = (canvasWidth: number, canvasHeight: number): Obstacle => ({
  x: canvasWidth,
  y: canvasHeight - 40,
  width: 20,
  height: 40,
  color: '#c15564', // dark-pink
});

const calculateJumpDistance = (jumpStrength: number, gravity: number, horizontalSpeed: number) => {
  const timeToPeak = jumpStrength / gravity; // Time to reach the peak of the jump
  const totalTimeInAir = timeToPeak * 2;     // Total air time
  const jumpDistance = horizontalSpeed * totalTimeInAir; // Horizontal distance covered during the jump

  return jumpDistance;
};

export const updateObstacles = (
  obstacles: Obstacle[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null
) => {
  
  const horizontalSpeed = 1.8; // Adjust this to match actual player speed
  // Calculate player's jump distance based on their speed, gravity, and jump strength
  const jumpDistance = calculateJumpDistance(player.jumpStrength, player.gravity, horizontalSpeed); // Replace 2 with actual player speed if variable

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
  
  // Adjust the spawning logic to ensure obstacles are never too close together
  const lastObstacle = obstacles[obstacles.length - 1];

  // Ensure there is enough space for the player to jump over
  if (!lastObstacle || lastObstacle.x < canvasWidth - jumpDistance - 20) { // Adding a buffer of 20 pixels
    // Adjust the probability for obstacle spawning
    const spawnProbability = 0.0010; // Lower this value to reduce frequency (from 0.01 to 0.005)
    if (Math.random() < spawnProbability) {
      obstacles.push(createObstacle(canvasWidth, canvasHeight));
    }
  }
};