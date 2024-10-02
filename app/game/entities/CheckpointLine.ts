// CheckpointLine.ts
import { Player } from "@/app/game/entities/Player/Player";

export class CheckpointLine {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  // Static method to create a new checkpoint line - this is inside the class as they are the same every time, so don't need to vary like other entities...
  static createCheckpointLine(canvasWidth: number, canvasHeight: number): CheckpointLine {
    return new CheckpointLine(canvasWidth, 0, 5, canvasHeight, '#334862'); // dark-blue
  }

  // Method to update the checkpoint line position
  update(speed: number) {
    this.x -= speed;
  }

  // Check if the checkpoint line is off-screen
  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }
}

// Function to update the checkpoint lines
export const updateCheckpointLines = (
  checkpointLines: CheckpointLine[],
  player: Player,
  canvasWidth: number,
  currentTime: number,
  nextSectionTime: number, // Time of the next section
  gamePaused: boolean
) => {
  if (gamePaused || player.isDead) return;

  const timeRemaining = nextSectionTime - currentTime;
  const speed = canvasWidth / (timeRemaining * 60); // Speed calculated based on remaining time

  checkpointLines.forEach((checkpointLine, index) => {
    checkpointLine.update(speed);
    if (checkpointLine.isOffScreen()) checkpointLines.splice(index, 1); // Remove line when off-screen
  });
};
