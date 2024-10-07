// FloorPlatforms.ts
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
