import { Player } from "@/app/game/entities/Player/Player";
import { Obstacle } from "@/app/game/entities/Obstacles/Obstacles";
import { PowerUp } from "@/app/game/entities/PowerUps";
import { FloorPlatform } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { CheckpointLine } from "@/app/game/entities/CheckpointLine";
import { ProgressBar } from "./entities/ProgressBar";
import { musicSections } from "./audio/MusicLibrary";
import AudioManager from "./audio/AudioManager";

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  floorPlatforms: FloorPlatform[],
  checkpointLines: CheckpointLine[],
  audioRef: React.RefObject<HTMLAudioElement | null>,
  deathCount: number,
  audioManager: AudioManager,
  canvasWidth: number,
  canvasHeight: number,
  platformSpeedRef: React.MutableRefObject<number>,
  highestSpeedRef: React.MutableRefObject<number>,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render Player
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.rotation);
  ctx.fillStyle = player.color;
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
  
  powerUps.forEach(powerUp => {
    ctx.fillStyle = powerUp.color;
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  });

  floorPlatforms.forEach(floorPlatform => {
    ctx.fillStyle = floorPlatform.color;
    ctx.fillRect(floorPlatform.x, floorPlatform.y, floorPlatform.width, floorPlatform.height);
  });

  checkpointLines.forEach(checkpointLine => {
    ctx.fillStyle = checkpointLine.color;
    ctx.fillRect(checkpointLine.x, checkpointLine.y, checkpointLine.width, checkpointLine.height);
  });
  
  // Render Death Count
  ctx.fillStyle = '#000000';
  ctx.font = '24px Gopher Mono';
  ctx.fillText(`Deaths: ${deathCount}`, 10, 60);

  // Render Platform Speed
  ctx.fillStyle = '#000000';
  ctx.font = '18px Gopher Mono';
  ctx.fillText(`Platform Speed: ${platformSpeedRef.current.toFixed(1)}`, 10, 90);
  ctx.fillText(`Highest Speed: ${highestSpeedRef.current.toFixed(1)}`, 10, 120);

  // Update the opacity of the narration text
  const narrationTime = performance.now(); // Rename this to avoid conflict
  audioManager.updateTextOpacity(narrationTime); // Update opacity over time

  // Render the current typed narration text with fading opacity
  if (audioManager.currentTypedText) {
    ctx.font = '24px Gopher Mono';
    ctx.fillStyle = `rgba(0, 0, 0, ${audioManager.textOpacity})`; // Apply fading opacity
    const maxWidth = ctx.canvas.width - 100; // Set max width for text before wrapping
    const lineHeight = 30; // Set the line height for wrapped text

    const words = audioManager.currentTypedText.split(' ');
    let line = '';
    let yPos = canvasHeight / 2;

    words.forEach(word => {
      const testLine = line + word + ' ';
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth) {
        ctx.fillText(line, 50, yPos); // Draw the current line
        line = word + ' '; // Start a new line
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    });

    ctx.fillText(line, 50, yPos); // Draw the last line
  }

  // Calculate current progress and the current time
  const totalSections = musicSections.length - 1;
  const currentTime = audioRef?.current?.currentTime || 0;
  const currentSection = musicSections.findIndex(section => section > currentTime);
  const progress = currentSection >= 0 ? currentSection : totalSections;
  const nextSectionTime = musicSections[progress] || musicSections[totalSections - 1]; // Default to the last section end time

  // Create and render the ProgressBar
  const progressBar = new ProgressBar(ctx, totalSections, ctx.canvas.width);
  progressBar.render(progress, currentTime, nextSectionTime);

  // // // Render YOU WIN!!
  // ctx.fillStyle = '#000000';
  // ctx.font = '100px Gopher Mono';
  // ctx.textAlign = 'center'; // Center the text horizontally
  // ctx.fillText(`YOU WIN!`, canvasWidth / 2, canvasHeight / 2);
};
