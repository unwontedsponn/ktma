export type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createObstacle = (canvasWidth: number, canvasHeight: number): Obstacle => ({
  x: canvasWidth,
  y: canvasHeight - 50,
  width: 20,
  height: 40,
  color: '#c15564', // dark-pink
});

export const updateObstacles = (
  obstacles: Obstacle[],
  player: any,
  setGamePaused: any,
  gameOver: any,
  audio: HTMLAudioElement | null
) => {
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 5;

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }

    // Check for collision
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver.current = true;
      setGamePaused(true);
      if (audio) audio.pause();
    }
  });

  // Add new obstacle if needed (every certain frames or time interval)
  if (Math.random() < 0.01) { // Adjust probability or setInterval timing
    obstacles.push(createObstacle(player.canvasWidth, player.canvasHeight));
  }
};
