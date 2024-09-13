import { Player } from "@/app/game/models/Player";

export type PowerUp = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createPowerUp = (canvasWidth: number, canvasHeight: number): PowerUp => ({
  x: canvasWidth,
  y: canvasHeight - 85,  // Ensure this height aligns well with the player's jump height
  width: 20,
  height: 20,
  color: '#5f9251', // green, corrected color code
});

export const updatePowerUps = (
  powerUps: PowerUp[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
) => {
  powerUps.forEach((powerUp, index) => {
    powerUp.x -= 4;

    if (powerUp.x + powerUp.width < 0) {
      powerUps.splice(index, 1); // Remove power-up when it goes off screen
    }

    // Check for collision between player and power-up
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      // Logic for invincibility or power-up activation
      // e.g., activate invincibility, play 8-bit music, etc.
    }
  });

  // Spawning new power-ups with a controlled probability
  const spawnProbability = 0.0002; // Adjust as needed for desired frequency
  if (Math.random() < spawnProbability) {
    powerUps.push(createPowerUp(canvasWidth, canvasHeight));
  }
};
