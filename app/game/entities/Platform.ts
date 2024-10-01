export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Static method to create a new platform with random properties
  static createRandomPlatform(canvasWidth: number, canvasHeight: number): Platform {
    const platformWidth = Math.random() * 150 + 50;
    const platformX = Math.random() * (canvasWidth - platformWidth);
    const platformY = canvasHeight - Math.random() * 200;
    
    return new Platform(platformX, platformY, platformWidth, 20); // Fixed platform height
  }
}
