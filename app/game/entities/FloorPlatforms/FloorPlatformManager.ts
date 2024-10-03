import { MutableRefObject } from 'react';
import { FloorPlatform } from './FloorPlatforms';
import { Player, calculateJumpDistance } from '@/app/game/entities/Player/Player';

// Platform speed variables
let platformSpeed = 3.5; // Initial platform speed
const speedIncreaseRate = 0.01; // Rate at which the speed increases
const maxSpeed = 10; // Maximum speed cap

// Function to increase platform speed
export const increasePlatformSpeed = () => {
  platformSpeed = Math.min(platformSpeed + speedIncreaseRate, maxSpeed);
};

// Function to reset platform speed
export const resetPlatformSpeed = () => {
  platformSpeed = 3.5;
};

// Function to get the current platform speed
export const getPlatformSpeed = () => {
  return platformSpeed;
};

export const initializePlatforms = (
  canvasWidth: number,
  canvasHeight: number,
  floorPlatforms: MutableRefObject<FloorPlatform[]>
) => {
  // Ensure platforms are reset
  floorPlatforms.current = [];

  // Create an initial platform near the left of the canvas
  const initialPlatform = new FloorPlatform(50, 500, 500, 500, '#3f423e'); // Adjust dimensions as needed
  floorPlatforms.current.push(initialPlatform);

  // Create additional platforms without depending on player properties
  let currentX = initialPlatform.width; // Start after the initial platform  

  const maxGap = 200; // Define default gap range (fixed values)
  const minGap = 50; 

  while (currentX < canvasWidth) {
    const gap = FloorPlatform.getRandomInRange(minGap, maxGap);
    currentX += gap; // Add gap to the current position

    // Create and add a new platform
    const newPlatform = FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, currentX);
    floorPlatforms.current.push(newPlatform);
    currentX += newPlatform.width; // Move past the new platform
  }
};

// Function to update all floor platforms
export const updateFloorPlatforms = (
  floorPlatforms: FloorPlatform[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  gamePaused: boolean
) => {
  if (gamePaused || player.isDead) return;

  // Increase platform speed gradually
  increasePlatformSpeed();
  const currentSpeed = getPlatformSpeed();

  const jumpDistance = calculateJumpDistance(player.jumpStrength, player.gravity, currentSpeed);

  // Determine the max and min gaps based on the player's jump capabilities
  const maxGap = jumpDistance * 0.85; // Slightly smaller than the player's max jump distance
  const minGap = 100; // Set a fixed minimum gap to prevent platforms from being too close

  // Move each platform to the left and remove it if it's off-screen
  floorPlatforms.forEach((floorPlatform, index) => {
    floorPlatform.updatePosition(currentSpeed);
    if (floorPlatform.isOffScreen()) floorPlatforms.splice(index, 1);
  });

  // Check the rightmost edge of the last platform
  const lastPlatform = floorPlatforms[floorPlatforms.length - 1];
  const rightEdgeOfLastPlatform = lastPlatform ? lastPlatform.x + lastPlatform.width : 0;

  // Only spawn a new platform if the last platform is far enough from the screen edge
  if (rightEdgeOfLastPlatform < canvasWidth - minGap) {
    // Calculate a random gap between the minimum and maximum allowed gap
    const gap = FloorPlatform.getRandomInRange(minGap, maxGap);
    
    // Force the new platform to spawn fully off-screen
    const newPlatformX = canvasWidth + gap + 50; // Additional 50 units to ensure it's off-screen

    // Spawn a new platform at the calculated position
    floorPlatforms.push(FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, newPlatformX));
  }
};
