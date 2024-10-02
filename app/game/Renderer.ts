import { Player } from "@/app/game/entities/Player/Player";
import { Obstacle } from "@/app/game/entities/Obstacles/Obstacles";
import { PowerUp } from "@/app/game/entities/PowerUps";
import { FloorPlatform } from "@/app/game/entities/FloorPlatforms/FloorPlatforms";
import { CheckpointLine } from "@/app/game/entities/CheckpointLine";
import { ProgressBar } from "./entities/ProgressBar";
import { musicSections } from "./audio/MusicLibrary";

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  obstacles: Obstacle[],
  powerUps: PowerUp[],
  floorPlatforms: FloorPlatform[],
  checkpointLines: CheckpointLine[],
  audioRef: React.RefObject<HTMLAudioElement | null>
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

  // Calculate current progress and the current time
  const totalSections = musicSections.length;
  const currentTime = audioRef?.current?.currentTime || 0;
  const currentSection = musicSections.findIndex(section => section > currentTime);
  const progress = currentSection >= 0 ? currentSection : totalSections;
  const nextSectionTime = musicSections[progress] || musicSections[totalSections - 1]; // Default to the last section end time

  // Create an instance of ProgressBar
  const progressBar = new ProgressBar(ctx, totalSections, ctx.canvas.width);

  // Render the progress bar
  progressBar.render(progress, currentTime, nextSectionTime);
};
