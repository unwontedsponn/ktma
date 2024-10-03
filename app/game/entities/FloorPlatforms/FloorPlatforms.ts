import { Player, calculateJumpDistance } from "@/app/game/entities/Player/Player";

export class FloorPlatform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hasPowerUp: boolean;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.hasPowerUp = false;
  }
  
  updatePosition(speed: number) {this.x -= speed;}
  isOffScreen(): boolean {return this.x + this.width < 0;}

  // Static method to create a new floor platform
  static createFloorPlatform(canvasWidth: number, canvasHeight: number, startX?: number): FloorPlatform {
    const minWidth = 100;
    const maxWidth = 600;
    const minHeight = 30;
    const maxHeight = 200;

    const width = FloorPlatform.getRandomInRange(minWidth, maxWidth);
    const height = FloorPlatform.getRandomInRange(minHeight, maxHeight);

    return new FloorPlatform(
      startX !== undefined ? startX : canvasWidth,
      canvasHeight - height - 5,
      width,
      height,
      '#3f423e'
    );
  }

  // Utility method to generate random numbers within a range
  static getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

// Function to update all floor platforms
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

  // Move each platform to the left and remove it if it's off-screen
  floorPlatforms.forEach((floorPlatform, index) => {
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
    // Calculate a random gap between the minimum and maximum allowed gap
    const gap = FloorPlatform.getRandomInRange(minGap, maxGap);
    
    // Force the new platform to spawn fully off-screen
    const newPlatformX = canvasWidth + gap + 50; // Additional 50 units to ensure it's off-screen

    // Spawn a new platform at the calculated position
    floorPlatforms.push(FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, newPlatformX));
  }
};
