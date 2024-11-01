import { Player } from "@/app/game/entities/Player/Player";
import { Obstacle } from "@/app/game/entities/Obstacles/Obstacles";
import { PowerUp } from "@/app/game/entities/PowerUps";
import { FloorPlatform } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { CheckpointLine } from "@/app/game/entities/CheckpointLine";
import { ProgressBar } from "./entities/ProgressBar";
import { musicSections } from "./audio/MusicLibrary";
import AudioManager from "./audio/AudioManager";

let youWinOpacity = 0.0;

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

  // Define positions based on screen height
  const isSmallScreen = canvasHeight <= 702;
  const textOffsetY = isSmallScreen ? 90 : 60; // Offset the text lower for small screens
  const speedOffsetY = isSmallScreen ? 120 : 90;
  const highestSpeedOffsetY = isSmallScreen ? 150 : 120;
  const progressBarY = isSmallScreen ? 40 : 20; // Position progress bar closer to the bottom for small screens

  // Render Death Count
  ctx.fillStyle = '#000000';
  ctx.font = '24px Gopher Mono';
  ctx.fillText(`Deaths: ${deathCount}`, 10, textOffsetY);

  // Render Platform Speed
  ctx.fillStyle = '#000000';
  ctx.font = '18px Gopher Mono';
  ctx.fillText(`Platform Speed: ${platformSpeedRef.current.toFixed(1)}`, 10, speedOffsetY);
  ctx.fillText(`Highest Speed: ${highestSpeedRef.current.toFixed(1)}`, 10, highestSpeedOffsetY);

  // Update the opacity of the narration text
  const narrationTime = performance.now();
  audioManager.updateTextOpacity(narrationTime);

  // Render the current typed narration text with fading opacity
  if (audioManager.currentTypedText) {
    ctx.font = '24px Gopher Mono';
    ctx.fillStyle = `rgba(0, 0, 0, ${audioManager.textOpacity})`;
    const maxWidth = ctx.canvas.width - 100;
    const lineHeight = 30;

    const words = audioManager.currentTypedText.split(' ');
    let line = '';
    let yPos = isSmallScreen ? canvasHeight / 2 + 50 : canvasHeight / 2; // Adjust y position for small screens

    words.forEach(word => {
      const testLine = line + word + ' ';
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth) {
        ctx.fillText(line, 50, yPos);
        line = word + ' ';
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    });

    ctx.fillText(line, 50, yPos);
  }

  // Calculate current progress and the current time
  const totalSections = musicSections.length - 1;
  const currentTime = audioRef?.current?.currentTime || 0;
  const currentSection = musicSections.findIndex(section => section > currentTime);
  const progress = currentSection >= 0 ? currentSection : totalSections;
  const nextSectionTime = musicSections[progress] || musicSections[totalSections - 1];

  // Create and render the ProgressBar
  const progressBar = new ProgressBar(ctx, totalSections, ctx.canvas.width);
  progressBar.render(progress, currentTime, nextSectionTime, progressBarY);

  // Render YOU WIN!!! when reaching the penultimate checkpoint, with fading effect
  if (progress === totalSections) {
    youWinOpacity = Math.min(youWinOpacity + 0.0001, 1.0);
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${youWinOpacity})`;
    ctx.font = '100px Gopher Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`YOU WIN!!!`, canvasWidth / 2, canvasHeight / 2);
    ctx.restore();
  }
};