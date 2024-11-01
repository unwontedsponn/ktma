// ProgressBar.ts
import { musicSections } from "../audio/MusicLibrary";

export class ProgressBar {
  ctx: CanvasRenderingContext2D;
  totalSections: number;
  canvasWidth: number;
  segmentColor: string;
  borderColor: string;
  barHeight: number;
  padding: number;
  barPaddingX: number;
  yPosition: number;

  constructor(ctx: CanvasRenderingContext2D, totalSections: number, canvasWidth: number) {
    this.ctx = ctx;
    this.totalSections = totalSections;
    this.canvasWidth = canvasWidth;
    this.segmentColor = '#acddfb';
    this.borderColor = '#3f423e';
    this.barHeight = 20;
    this.padding = 2;
    this.barPaddingX = 10;
    this.yPosition = 10;
  }

  // Updated render method to accept an optional yPosition
  render(progress: number, currentTime: number, nextSectionTime: number, yPosition: number = this.yPosition) {
    const availableWidth = this.canvasWidth - 2 * this.barPaddingX;
    const segmentWidth = availableWidth / this.totalSections;

    // Ensure the progress does not exceed the total sections
    const clampedProgress = Math.min(progress, this.totalSections);

    // Calculate how much of the current section is completed
    const sectionStartTime = musicSections[clampedProgress - 1] || 0;
    const sectionProgress = Math.min(
      (currentTime - sectionStartTime) / (nextSectionTime - sectionStartTime),
      1
    );

    // ** First pass: Draw the borders for all segments **
    for (let i = 0; i < this.totalSections; i++) {
      this.ctx.beginPath();
      this.ctx.rect(i * segmentWidth + this.barPaddingX, yPosition, segmentWidth, this.barHeight);
      this.ctx.strokeStyle = this.borderColor;
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // ** Second pass: Fill the segments based on progress **
    for (let i = 0; i < clampedProgress - 1; i++) {
      this.ctx.beginPath();
      this.ctx.rect(
        i * segmentWidth + this.barPaddingX + this.padding,
        yPosition + this.padding,
        segmentWidth - 2 * this.padding,
        this.barHeight - 2 * this.padding
      );
      this.ctx.fillStyle = this.segmentColor;
      this.ctx.fill();
      this.ctx.closePath();
    }

    // For the current section, fill according to progress within the section
    if (clampedProgress > 0) {
      this.ctx.beginPath();
      const filledWidth = sectionProgress * (segmentWidth - 2 * this.padding);
      this.ctx.rect(
        (clampedProgress - 1) * segmentWidth + this.barPaddingX + this.padding,
        yPosition + this.padding,
        filledWidth,
        this.barHeight - 2 * this.padding
      );
      this.ctx.fillStyle = this.segmentColor;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}
