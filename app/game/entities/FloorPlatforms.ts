
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
  });

  // Determine the max and min gaps based on the player's jump capabilities
  const maxGap = jumpDistance * 0.85; // Slightly smaller than the player's max jump distance
  const minGap = 100; // Set a fixed minimum gap to prevent platforms from being too close

  // Check the rightmost edge of the last platform
  const lastPlatform = floorPlatforms[floorPlatforms.length - 1];
  const rightEdgeOfLastPlatform = lastPlatform ? lastPlatform.x + lastPlatform.width : 0;

  // Only spawn a new platform if the last platform is far enough from the screen edge
  if (rightEdgeOfLastPlatform < canvasWidth - minGap) {
    // Calculate a random gap between the minimum and maximum allowed gap
    const gap = getRandomInRange(minGap, maxGap);
    
    // Force the new platform to spawn fully off-screen
    const newPlatformX = canvasWidth + gap + 50; // Additional 50 units to ensure it's off-screen

    // Spawn a new platform at the calculated position
    floorPlatforms.push(createFloorPlatform(canvasWidth, canvasHeight, newPlatformX));
  }
};
