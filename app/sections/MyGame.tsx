import React, { useEffect, useRef } from 'react';
import SlideFadeIn from "../components/SlideFadeIn";

const colours = {
  'white-ish': '#f5faf9',
  'light-blue': '#acddfb',
  'grey-black-brown': '#3f423e',
  'strong-blue': '#407dbf',
  'dark-blue': '#334862',
  'green': '#5f9251',
  'darker-green': '#4a713f',
  'dark-pink': '#c15564',
  'pink': '#e39ba6',
};

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

const MyGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Player settings
    const player = {
      x: 50,
      y: canvas.height - 35,
      width: 25,
      height: 25,
      color: colours['light-blue'],
      velocityY: 0, 
      isJumping: false,
      gravity: 0.5,
      jumpStrength: -10, // Initial jump velocity
      rotation: 0, 
      rotationSpeed: 0.1,
    };

    // Obstacles settings
    const obstacles: Obstacle[] = []; // Define array with type
    const obstacleWidth = 20;
    const obstacleHeight = 40;
    const obstacleSpeed = 5;
    let gameOver = false;

    // Function to add new obstacles
    const addObstacle = () => {
      const obstacle: Obstacle = {
        x: canvas.width, // Start from the right edge of the canvas
        y: canvas.height - obstacleHeight - 10, // Position near the bottom
        width: obstacleWidth,
        height: obstacleHeight,
        color: colours['dark-pink'],
      };
      obstacles.push(obstacle);
    };

    // Spawn obstacles at intervals
    const obstacleInterval = setInterval(addObstacle, 2000); // Add obstacle every 2 seconds

    // Update game state
    const update = () => {
      // Apply gravity if the player is jumping
      if (player.isJumping) {
        player.velocityY += player.gravity; // Apply gravity
        player.y += player.velocityY; // Update player position based on velocity
        player.rotation += player.rotationSpeed; // Spin player while jumping

        // Check if player has landed (hits the ground)
        if (player.y >= canvas.height - player.height - 10) {
          player.y = canvas.height - player.height - 10; // Reset to ground level
          player.velocityY = 0; // Stop vertical movement
          player.isJumping = false; // Allow jumping again
          player.rotation = 0; // Reset rotation after landing
        }
      }

      // Move obstacles
      obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed; // Move left

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);

        // Check for collision with player
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) gameOver = true;
      });
    };

    // Render game elements
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save the canvas state, apply rotation, and draw the player
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2); // Move origin to player's center
      ctx.rotate(player.rotation); // Rotate around the origin
      ctx.fillStyle = player.color;
      ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height); // Draw the player centered
      ctx.restore(); // Restore the canvas state

      // Draw obstacles
      obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Display game over message
      if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px serif';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
      }
    };

    // Game loop
    const gameLoop = () => {
      if (!gameOver) {
        update();
        render();
        requestAnimationFrame(gameLoop);
      }
    };    
    gameLoop();

    // Handle key press events
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !player.isJumping) {
        // Jump only if the player is not already jumping
        player.velocityY = player.jumpStrength; // Set jump velocity
        player.isJumping = true; // Mark as jumping
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup on component unmount
    return () => {
      clearInterval(obstacleInterval); // Clear obstacle interval on unmount
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section
      id="myGame"
      className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden"
    >
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">
        <SlideFadeIn
          direction="left"
          className="hidden md:block color-blue font-gopher-mono-semi leading-none text-11xl"
        >
          <h1 className="opacity-40">myGame</h1>
        </SlideFadeIn>
        <canvas ref={canvasRef} id="gameCanvas" width="800" height="600" className="border-b-4 border-black"></canvas>
      </div>
    </section>
  );
};
export default MyGame;