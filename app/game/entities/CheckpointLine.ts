// NextLevelLine.ts
import { Player } from "./Player";

export type CheckpointLine = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createCheckpointLine = (canvasWidth: number, canvasHeight: number): CheckpointLine => ({
  x: canvasWidth,
  y: 0,
  width: 5,
  height: canvasHeight,
  color: '#334862', // dark-blue
});

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
    checkpointLine.x -= speed;
    if (checkpointLine.x + checkpointLine.width < 0) checkpointLines.splice(index, 1); // Remove line when off-screen
  });
};