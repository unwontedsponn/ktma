// ProgressBar.ts
import { musicSections } from "../utils/Audio";

export const renderProgressBar = (
  ctx: CanvasRenderingContext2D,
  totalSections: number,
  progress: number,
  canvasWidth: number,
  currentTime: number,
  nextSectionTime: number,
) => {
  const barHeight = 20;
  const segmentColor = '#acddfb';
  const borderColor = '#3f423e';
  const padding = 2; // Padding inside the segment for the fill
  const barPaddingX = 10; // Horizontal padding for the whole progress bar
  const availableWidth = canvasWidth - 2 * barPaddingX; // Adjust available width based on padding
  const segmentWidth = availableWidth / totalSections; // Recalculate segment width based on the available width
  const yPosition = 10;

  // Calculate how much of the current section is completed
  const sectionStartTime = musicSections[progress - 1] || 0;
  const sectionProgress = (currentTime - sectionStartTime) / (nextSectionTime - sectionStartTime);

  // ** First pass: Draw the borders for all segments **
  for (let i = 0; i < totalSections; i++) {
    ctx.beginPath();
    ctx.rect(i * segmentWidth + barPaddingX, yPosition, segmentWidth, barHeight); // Shift by barPaddingX
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.closePath();
  }

  // ** Second pass: Fill the segments based on progress **
  for (let i = 0; i < totalSections; i++) {
    ctx.beginPath();

    // For completed sections, fill completely but leave padding for borders
    if (i < progress - 1) {
      ctx.rect(
        i * segmentWidth + barPaddingX + padding,      // Add barPaddingX and padding for inner padding
        yPosition + padding,                           // Add padding to top
        segmentWidth - 2 * padding,                    // Subtract padding for both sides
        barHeight - 2 * padding                        // Subtract padding for top and bottom
      );
      ctx.fillStyle = segmentColor;
      ctx.fill();
    }
      
    // For the current section, fill according to progress within the section
    else if (i === progress - 1) {
      const filledWidth = sectionProgress * (segmentWidth - 2 * padding); // Fill width based on progress
      ctx.rect(
        i * segmentWidth + barPaddingX + padding,      // Add barPaddingX and padding
        yPosition + padding,                           // Add padding to top
        filledWidth,
        barHeight - 2 * padding                        // Subtract padding for height
      );
      ctx.fillStyle = segmentColor;
      ctx.fill();
    }

    // Close the path after drawing
    ctx.closePath();
  }
};