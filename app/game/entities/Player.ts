// Player.ts
import { playRandomSfx, jumpSfx, landSfx } from "@/app/game/utils/Audio";

export type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  gravity: number;
  jumpStrength: number;
  rotation: number;
  rotationSpeed: number;
  color: string;  
  isInvincible: boolean;
  isDead: boolean;
};

export const createPlayer = (canvasHeight: number): Player => ({
  x: 50,
  y: canvasHeight - 25,
  width: 25,
  height: 25,
  color: '#acddfb', // light-blue
  velocityY: 0,
  isJumping: false,
  gravity: 0.5,
  jumpStrength: -10,
  rotation: 0,
  rotationSpeed: 0.1,
  isInvincible: false,
  isDead: false,
});

export const updatePlayer = (
  player: Player, 
  canvasHeight: number, 
  isPowerUpActive: boolean,
  gamePaused: boolean
) => {    
  if (gamePaused) return; // Do not update player if the game is paused
  
  if (isPowerUpActive) {
    player.color = '#ffd700'; // Set to gold
    player.isInvincible = true;    
  }  
  else {
    player.color = '#acddfb'; // Back to normal blue
    player.isInvincible = false;
  }

  // Player jumping
  if (player.isJumping) {   
    
    // If the player just started jumping, play the jump sound effect once
    if (player.velocityY === player.jumpStrength) playRandomSfx(jumpSfx, 0.1);

    player.velocityY += player.gravity;
    player.y += player.velocityY;
    player.rotation += player.rotationSpeed;

    // Player landing
    if (player.y >= canvasHeight - player.height) {
      player.y = canvasHeight - player.height;
      player.velocityY = 0;
      player.rotation = 0;

      // Only play landing sound if the player was jumping
      if (player.isJumping) playRandomSfx(landSfx, 0.1);

      // Mark the player as no longer jumping
      player.isJumping = false;                  
    }
  }  
};