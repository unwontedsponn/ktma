import { MutableRefObject } from 'react';
import { FloorPlatform } from './FloorPlatforms';
import { Player, calculateJumpDistance } from '@/app/game/entities/Player/Player';

// Makes all floorPlatforms first visible on screen
export const initializePlatforms = (
  canvasWidth: number,
  canvasHeight: number,
  floorPlatforms: MutableRefObject<FloorPlatform[]>,
) => {
  // Ensure platforms are reset
  floorPlatforms.current = [];

  // Create an initial platform near the left of the canvas
  const initialPlatform = new FloorPlatform(50, 500, 600, 500);
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
  gamePaused: boolean,
  platformSpeed: number,
  isPowerUpActive: boolean,  
) => {
  if (gamePaused || player.isDead) return;  

  const jumpDistance = calculateJumpDistance(player.jumpStrength, player.gravity, platformSpeed);

  // Move each platform to the left and remove it if it's off-screen
  floorPlatforms.forEach((floorPlatform, index) => {
    floorPlatform.applyPowerUp(isPowerUpActive);
    floorPlatform.updatePosition(platformSpeed);
    if (floorPlatform.isOffScreen()) floorPlatforms.splice(index, 1);
  });

  // Determine the max and min gaps based on the player's jump capabilities
  const maxGap = jumpDistance * 0.85; // Slightly smaller than the player's max jump distance
  const minGap = 100; // Set a fixed minimum gap to prevent platforms from being too close

  // Check the rightmost edge of the last platform
  const lastPlatform = floorPlatforms[floorPlatforms.length - 1];
  const rightEdgeOfLastPlatform = lastPlatform ? lastPlatform.x + lastPlatform.width : 0;

  // Only spawn a new platform if the last platform is far enough from the screen edge
  if (rightEdgeOfLastPlatform < canvasWidth - minGap) {    
    const gap = FloorPlatform.getRandomInRange(minGap, maxGap);    
    const newPlatformX = canvasWidth + gap + 50; // Additional 50 units to ensure it's off-screen

    // Spawn a new platform at the calculated position
    floorPlatforms.push(FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, newPlatformX));
  }
};

// Function to update all floor platforms
export const updateSafeFloorPlatforms = (
  floorPlatforms: FloorPlatform[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  gamePaused: boolean,
  platformSpeed: number,
  isPowerUpActive: boolean,  
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
) => {
  if (gamePaused || player.isDead) return;  

  // Move each platform to the left and remove it if it's off-screen
  floorPlatforms.forEach((floorPlatform, index) => {
    floorPlatform.applyPowerUp(isPowerUpActive);
    floorPlatform.updatePosition(platformSpeed);
    if (floorPlatform.isOffScreen()) floorPlatforms.splice(index, 1);
  });

  const safeZonePlatformWidth = canvasWidth * 0.8; // Large platform (80% of canvas width)
  
  // Get the rightmost edge of the last platform to ensure we extend it seamlessly
  const lastPlatform = floorPlatforms[floorPlatforms.length - 1];
  const rightEdgeOfLastPlatform = lastPlatform ? lastPlatform.x + lastPlatform.width : 0;

  // Only add another safe zone platform if we haven't reached the end of the track
  const currentTime = audioRef.current?.currentTime || 0;
  const audioDuration = audioRef.current?.duration || 0;

  // Keep adding safe zone platforms until the track ends
  if (rightEdgeOfLastPlatform < canvasWidth && currentTime < audioDuration) {
    const safeZonePlatform = new FloorPlatform(
      rightEdgeOfLastPlatform, // Start right after the last platform
      canvasHeight - 50,       // Adjust height to place near the bottom
      safeZonePlatformWidth,   // Keep the large platform width
      50                       // Fixed height
    );
    floorPlatforms.push(safeZonePlatform);

    // Optionally, you can log the added platforms for debugging
    console.log("Safe Zone Platform Extended:", safeZonePlatform);
  }
  
  // Stop adding platforms once the audio ends
  if (currentTime >= audioDuration) {
    console.log("Reached end of track, no more platforms needed.");
    return;
  }
};
