export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const createPlatform = (
  x: number,
  y: number,
  width: number,
  height: number
): Platform => ({
  x,
  y,
  width,
  height,
});

// Function to generate a random platform with some gaps
export const updatePlatforms = (canvasWidth: number, canvasHeight: number): Platform => {
  const platformWidth = Math.random() * 150 + 50; // Varying platform lengths
  const platformX = Math.random() * (canvasWidth - platformWidth); // Random x position
  const platformY = canvasHeight - Math.random() * 200; // Random y position (closer to the bottom)
  
  return createPlatform(platformX, platformY, platformWidth, 20); // Fixed platform height
};
