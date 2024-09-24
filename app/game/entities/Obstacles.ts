// Obstacles.ts
import { playRandomSfx, dyingSfx } from "@/app/game/utils/Audio";
import { Player, calculateJumpDistance } from "@/app/game/entities/Player";

export type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createObstacle = (canvasWidth: number, canvasHeight: number): Obstacle => ({
  x: canvasWidth,
  // y: canvasHeight - 40,
  y: canvasHeight + 40,
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
  audio: HTMLAudioElement | null,
  gamePaused: boolean
) => {
  if (gamePaused || player.isDead) return; // Stop updating if the game is paused or player has already collided
  
  const horizontalSpeed = 1.8; // Adjust this to match actual player speed
  // Calculate player's jump distance based on their speed, gravity, and jump strength
  const jumpDistance = calculateJumpDistance(player.jumpStrength, player.gravity, horizontalSpeed);

  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 4;

    if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
    // Only check for collision if player is NOT invincible
    if (
      !player.isInvincible && // Skip collision if player is invincible
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {      
      setGamePaused(true);
      playRandomSfx(dyingSfx, 'dying');
      if (audio) audio.pause();
      
      // Mark the player as collided to prevent further sound triggering
      player.isDead = true;
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