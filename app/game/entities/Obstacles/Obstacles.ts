// Obstacles.ts
import { dyingSfx } from "@/app/game/audio/SfxLibrary";
import AudioManager from "../../audio/AudioManager";
import { Player, calculateJumpDistance } from "@/app/game/entities/Player/Player";

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  private audioManager: AudioManager; // Add AudioManager instance

  constructor(x: number, y: number, width: number, height: number, color: string, audioManager: AudioManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.audioManager = audioManager; // Store the audioManager instance
  }

  // Method to update the obstacle's position
  updatePosition(speed: number) {
    this.x -= speed;
  }

  // Method to check if the obstacle is off-screen
  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  // Static method to create a new obstacle
  static createObstacle(canvasWidth: number, canvasHeight: number, audioManager: AudioManager): Obstacle {
    return new Obstacle(
      canvasWidth,
      canvasHeight + 40, // Adjust the y-position as needed
      20, // Width
      40, // Height
      '#c15564', // Color: dark-pink
      audioManager // Pass the audioManager instance
    );
  }

  // Method to check for collision with the player
  checkCollision(player: Player): boolean {
    if (player.isInvincible) return false; // Skip collision if player is invincible

    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

// Function to update obstacles
export const updateObstacles = (
  obstacles: Obstacle[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  gamePaused: boolean,
  audioManager: AudioManager // Add audioManager as a parameter
) => {
  if (gamePaused || player.isDead) return; // Stop updating if the game is paused or player has already collided

  const horizontalSpeed = 1.8; // Adjust this to match actual player speed
  const jumpDistance = calculateJumpDistance(player.jumpStrength, player.gravity, horizontalSpeed);

  obstacles.forEach((obstacle, index) => {
    obstacle.updatePosition(4); // Move the obstacle to the left

    if (obstacle.isOffScreen()) {
      obstacles.splice(index, 1);
    }

    // Check for collision
    if (obstacle.checkCollision(player)) {
      setGamePaused(true);
      audioManager.playRandomSfx(dyingSfx, 'dying'); // Use audioManager to play sound
      if (audio) audio.pause();

      // Mark the player as collided to prevent further sound triggering
      player.isDead = true;
    }
  });

  // Adjust the spawning logic to ensure obstacles are never too close together
  const lastObstacle = obstacles[obstacles.length - 1];

  // Ensure there is enough space for the player to jump over
  if (!lastObstacle || lastObstacle.x < canvasWidth - jumpDistance - 20) {
    const spawnProbability = 0.0010; // Lower this value to reduce frequency
    if (Math.random() < spawnProbability) {
      obstacles.push(Obstacle.createObstacle(canvasWidth, canvasHeight, audioManager)); // Pass audioManager here
    }
  }
};
