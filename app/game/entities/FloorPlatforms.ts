
import { Player, calculateJumpDistance } from "@/app/game/entities/Player";

export type FloorPlatform = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

// Function to generate random numbers within a range
export const getRandomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Create floor platform with variable width and height
export const createFloorPlatform = (canvasWidth: number, canvasHeight: number, startX?: number): FloorPlatform => {
  const minWidth = 100;  
  const maxWidth = 600;  
  const minHeight = 30; 
  const maxHeight = 200; 

  const width = getRandomInRange(minWidth, maxWidth);
  const height = getRandomInRange(minHeight, maxHeight);

  return {
    x: startX !== undefined ? startX : canvasWidth, // If startX is provided, use it; otherwise, start off-screen
    y: canvasHeight - height - 5,
    width,
    height,
    color: '#3f423e',
  };
};

export const updateFloorPlatforms = (
  floorPlatforms: FloorPlatform[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,    
  gamePaused: boolean,
  platformSpeed: number,
) => {
  if (gamePaused || player.isDead) return;
  
  const jumpDistance = calculateJumpDistance(player.jumpStrength, player.gravity, platformSpeed);

  // Move each platform to the left
  floorPlatforms.forEach((floorPlatform, index) => {
    floorPlatform.x -= platformSpeed;

    // Remove platform if it goes off the screen
    if (floorPlatform.x + floorPlatform.width < 0) floorPlatforms.splice(index, 1);

    // Player land on platform
    if (
      player.x < floorPlatform.x + floorPlatform.width &&
      player.x + player.width > floorPlatform.x &&
      player.y + player.height >= floorPlatform.y &&
      player.y + player.height <= floorPlatform.y + floorPlatform.height
    ) {
      player.y = floorPlatform.y - player.height; // Position player on top of platform
      player.isGrounded = true; // Mark player as grounded
    } else player.isGrounded = false;
  });

  /// Ensure the gap between platforms is jumpable
  const lastPlatform = floorPlatforms[floorPlatforms.length - 1];
  const maxGap = jumpDistance * 0.85; // Adjust gap slightly smaller than the player's max jump distance
  const minGap = 50; // Ensure there is always some gap, but not too small

  // Only spawn a new platform if there is enough space between the last platform and the right edge of the canvas
  if (!lastPlatform || lastPlatform.x + lastPlatform.width + minGap < canvasWidth) {
    // Control the gap directly based on the player's jump capabilities
    const gap = getRandomInRange(minGap, maxGap); // Random gap between min and max
    floorPlatforms.push(createFloorPlatform(canvasWidth + gap, canvasHeight)); // Spawn a new platform after the gap
  }
};