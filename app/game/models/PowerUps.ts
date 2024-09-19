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
  setIsPowerUpActive: (isActive: boolean) => void
) => {
  powerUps.forEach((powerUp, index) => {
    powerUp.x -= 4;

    if (powerUp.x + powerUp.width < 0) powerUps.splice(index, 1);

    // Check for collision between player and power-up
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {      
      setIsPowerUpActive(true);
      player.isInvincible = true;
      powerUps.splice(index, 1);
      setTimeout(() => {
        player.isInvincible = false; // Turn off invincibility after 5 seconds
      }, 5000);
    }
  });

  // Spawning new power-ups with a controlled probability
  const spawnProbability = 0.002;
  if (Math.random() < spawnProbability) powerUps.push(createPowerUp(canvasWidth, canvasHeight));
};
