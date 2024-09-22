// NextLevelLine.ts
import { Player } from "./Player";

export type NextLevelLine = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createNextLevelLine = (canvasWidth: number, canvasHeight: number): NextLevelLine => ({
  x: canvasWidth,
  y: 0,
  width: 5,
  height: canvasHeight,
  color: '#334862', // dark-blue
});

export const updateNextLevelLines = (
  nextLevelLines: NextLevelLine[],
  player: Player,
  canvasWidth: number,
  currentTime: number,
  nextSectionTime: number, // Time of the next section
  gamePaused: boolean
) => {
  if (gamePaused || player.isDead) return;

  const timeRemaining = nextSectionTime - currentTime;
  const speed = canvasWidth / (timeRemaining * 60); // Speed calculated based on remaining time

  nextLevelLines.forEach((nextLevelLine, index) => {
    nextLevelLine.x -= speed;
    if (nextLevelLine.x + nextLevelLine.width < 0) nextLevelLines.splice(index, 1); // Remove line when off-screen
  });
};