import { musicSections } from "../utils/Audio";

export const renderProgressBar = (
  ctx: CanvasRenderingContext2D,
  totalSections: number,
  progress: number,
  canvasWidth: number,
  currentTime: number,
  nextSectionTime: number
) => {
  const barHeight = 20;
  const segmentWidth = canvasWidth / totalSections;

  // Set the bar's position at the top of the canvas
  const yPosition = 10;

  // Calculate how much of the current section is completed (progress within the current section)
  const sectionStartTime = musicSections[progress - 1] || 0; // Start of the current section
  const sectionProgress = (currentTime - sectionStartTime) / (nextSectionTime - sectionStartTime); // Progress in the section (0 to 1)

  // ** First pass: Draw the borders for all segments **
  for (let i = 0; i < totalSections; i++) {
    ctx.beginPath();
    ctx.rect(i * segmentWidth, yPosition, segmentWidth - 5, barHeight);
    ctx.strokeStyle = '#000'; // Border color
    ctx.stroke();
    ctx.closePath();
  }

  // ** Second pass: Fill the segments based on progress **
  for (let i = 0; i < totalSections; i++) {
    ctx.beginPath();

    // For completed sections, fill completely
    if (i < progress - 1) {
      ctx.rect(i * segmentWidth, yPosition, segmentWidth - 5, barHeight);
      ctx.fillStyle = '#407dbf'; // Dark blue for completed sections
      ctx.fill();
    }
    // For the current section, fill according to progress within the section
    else if (i === progress - 1) {
      const filledWidth = sectionProgress * (segmentWidth - 5); // Fill width based on section progress
      ctx.rect(i * segmentWidth, yPosition, filledWidth, barHeight);
      ctx.fillStyle = '#407dbf'; // Dark blue as it fills up
      ctx.fill();
    }

    // Remaining sections stay unfilled
    ctx.closePath();
  }
};
