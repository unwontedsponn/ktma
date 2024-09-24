// Player.ts
import { playRandomSfx, jumpSfx, landSfx, dyingSfx } from "@/app/game/utils/Audio";
import { FloorPlatform } from "./FloorPlatforms";

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
  isGrounded: boolean;
};

export const createPlayer = (startingPlatform: FloorPlatform): Player => ({
  x: startingPlatform.x + startingPlatform.width / 2 - 12.5, // Center player on the first platform
  y: startingPlatform.y - 100,  // Position player on top of the first platform
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
  isGrounded: true,
});

export const calculateJumpDistance = (jumpStrength: number, gravity: number, horizontalSpeed: number) => {
  const timeToPeak = jumpStrength / gravity;
  const totalTimeInAir = timeToPeak * 2;
  const jumpDistance = horizontalSpeed * totalTimeInAir;

  return jumpDistance;
};

export const updatePlayer = (
  player: Player, 
  canvasWidth: number, 
  canvasHeight: number,
  isPowerUpActive: boolean,
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  floorPlatforms: FloorPlatform[]
) => {    
  if (gamePaused || player.isDead) return;

  // Power-up effects on Player
  if (isPowerUpActive) {
    player.color = '#ffd700'; // Set to gold
    player.isInvincible = true;    
  } else {
    player.color = '#acddfb'; // Back to normal blue
    player.isInvincible = false;
  }

  // Player movement (horizontal movement if needed)
  player.x += player.velocityX;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;

  let isOnPlatform = false; // Flag to check if the player is on a platform

  // Check if the player is standing on a platform
  for (const platform of floorPlatforms) {
    // Check if player is on the platform
    const isPlayerOnPlatform = player.y + player.height === platform.y &&
                               player.x + player.width > platform.x &&
                               player.x < platform.x + platform.width;

    if (isPlayerOnPlatform) {
      isOnPlatform = true; // Player is on a platform
      player.isGrounded = true;
      break; // Exit the loop as the player is on a platform
    }
  }

  // If the player walks off the platform, start falling
  if (!isOnPlatform && !player.isJumping) {
    player.isJumping = true; // Player starts falling
  }

  // Player jumping/falling
  if (player.isJumping) {
    // Apply gravity to velocityY
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    
    // Only apply rotation while in the air
    player.rotation += player.rotationSpeed;

    // Check for platform collision to land
    for (const platform of floorPlatforms) {
      // Check if player is falling onto a platform
      const isFallingOntoPlatform = player.y + player.height <= platform.y &&
                                    player.y + player.height + player.velocityY >= platform.y &&
                                    player.x + player.width > platform.x &&
                                    player.x < platform.x + platform.width;

      if (isFallingOntoPlatform) {
        // Player has landed on the platform
        player.y = platform.y - player.height; // Set player on top of the platform
        player.velocityY = 0; // Stop vertical movement
        player.isJumping = false; // Player is no longer jumping
        player.rotation = 0; // Reset rotation so player lands flat
        player.isGrounded = true; // Player is grounded
        playRandomSfx(landSfx, 'land'); // Play landing sound
        return; // Exit the function since the player landed
      }
    }

    // Check if player falls to the bottom of the canvas
    if (player.y >= canvasHeight - player.height) {
      // Player falls to the bottom (death)
      setGamePaused(true);
      playRandomSfx(dyingSfx, 'dying');
      if (audio) audio.pause();
      player.isDead = true;
      return;
    }
  } else {
    // If the player is grounded, ensure rotation stays at 0 (flat)
    player.rotation = 0;
  }
};