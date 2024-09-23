// Player.ts
import { playRandomSfx, jumpSfx, landSfx } from "@/app/game/utils/Audio";

export type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
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
  velocityX: 0,
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
  canvasWidth: number, 
  canvasHeight: number,
  isPowerUpActive: boolean,
  gamePaused: boolean
) => {    
  if (gamePaused) return;
  
  // Power-up effects on Player
  if (isPowerUpActive) {
    player.color = '#ffd700'; // Set to gold
    player.isInvincible = true;    
  }  
  else {
    player.color = '#acddfb'; // Back to normal blue
    player.isInvincible = false;
  }

   // Player movement
   player.x += player.velocityX;
   if (player.x < 0) player.x = 0;
   if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;
 
  // Player jumping
  if (player.isJumping) {   
    
    // If the player just started jumping, play the jump sound effect once
    if (player.velocityY === player.jumpStrength) playRandomSfx(jumpSfx, 'jump');

    player.velocityY += player.gravity;
    player.y += player.velocityY;
    player.rotation += player.rotationSpeed;

    // Player landing
    if (player.y >= canvasHeight - player.height) {
      player.y = canvasHeight - player.height;
      player.velocityY = 0;
      player.rotation = 0;
      
      if (player.isJumping) playRandomSfx(landSfx, 'land');
      
      player.isJumping = false;                  
    }
  }  
};