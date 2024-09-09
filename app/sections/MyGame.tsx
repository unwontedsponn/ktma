import React, { useEffect, useRef, useState } from 'react';
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

// Define the type for obstacles
type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

// Define music sections (in seconds)
const musicSections = [0, 30, 60, 90];

const MyGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    if (!gameStarted || gamePaused) return; // Only run the effect when the game is started and not paused

    const canvas = canvasRef.current;
    const audio = audioRef.current; 
    if (!canvas || !audio) return;

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
      jumpStrength: -10,
      rotation: 0,
      rotationSpeed: 0.1,
    };

    // Obstacles settings
    const obstacles: Obstacle[] = [];
    const obstacleWidth = 20;
    const obstacleHeight = 40;
    const obstacleSpeed = 5;
    let gameOver = false;

    // Function to add new obstacles
    const addObstacle = () => {
      const obstacle: Obstacle = {
        x: canvas.width,
        y: canvas.height - obstacleHeight - 10,
        width: obstacleWidth,
        height: obstacleHeight,
        color: colours['dark-pink'],
      };
      obstacles.push(obstacle);
    };

    // Spawn obstacles at intervals
    const obstacleInterval = setInterval(addObstacle, 2000);

    // Update game state
    const update = () => {
      if (player.isJumping) {
        player.velocityY += player.gravity;
        player.y += player.velocityY;
        player.rotation += player.rotationSpeed;

        if (player.y >= canvas.height - player.height - 10) {
          player.y = canvas.height - player.height - 10;
          player.velocityY = 0;
          player.isJumping = false;
          player.rotation = 0;
        }
      }

      obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;

        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
        }

        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) {
          gameOver = true;
          setGamePaused(true); // Pause the game
          if (audioRef.current) {
            audioRef.current.pause(); // Pause the audio on collision
          }
        }
      });
    };

    // Render game elements
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px serif';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
      }
    };

    // Game loop
    const gameLoop = () => {
      if (!gameOver && !gamePaused) {
        update();
        render();
        requestAnimationFrame(gameLoop);
      }
    };

    // Start the game loop
    gameLoop();

    // Handle spacebar press for jumping and resuming game
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        if (gamePaused) {
          resumeGame(); // Resume game if paused
        } else if (!player.isJumping) {
          player.velocityY = player.jumpStrength; // Set jump velocity
          player.isJumping = true; // Mark as jumping
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Function to resume the game and restart music from the current section
    const resumeGame = () => {
      setGamePaused(false);
      if (audioRef.current) {
        audioRef.current.currentTime = musicSections[currentSection]; // Restart from current section
        audioRef.current.play();
      }
      gameLoop(); // Resume game loop
    };

    // Function to restart the game and music from the current section
    const restartGame = () => {
      player.x = 50;
      player.y = canvas.height - 35;
      player.velocityY = 0;
      player.isJumping = false;
      player.rotation = 0;
      obstacles.length = 0; // Clear obstacles

      // Restart the music from the current section
      if (audioRef.current) {
        audioRef.current.currentTime = musicSections[currentSection];
        audioRef.current.play();
      }

      gameOver = false;
      gameLoop(); // Restart game loop
    };

    // Function to handle music progression
    const handleMusicProgress = () => {
      if (!audioRef.current) return;

      // Check if the music has reached the next section
      const currentTime = audioRef.current.currentTime;
      const nextSection = currentSection + 1;

      if (nextSection < musicSections.length && currentTime >= musicSections[nextSection]) {
        setCurrentSection(nextSection);
      }

      // End the game when the music reaches the last section
      if (currentSection === musicSections.length - 1 && currentTime >= audioRef.current.duration) {
        ctx.fillStyle = 'green';
        ctx.font = '48px serif';
        ctx.fillText('You Win!', canvas.width / 2 - 100, canvas.height / 2);
        gameOver = true;
      }
    };

    // Set the event listener to track music progress
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleMusicProgress);
    }

    // Cleanup on component unmount
    return () => {
      clearInterval(obstacleInterval);
      document.removeEventListener('keydown', handleKeyDown);
      audio.removeEventListener('timeupdate', handleMusicProgress);
    };
  }, [currentSection, gameStarted, gamePaused]); // Add gamePaused to the dependencies

  // Start the game and music when the Play button is clicked
  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(error => console.error("Audio play error:", error));
    }
  };

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
        {!gameStarted && (
          <button onClick={startGame} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            Play Game
          </button>
        )}
        {gamePaused && (
          <button onClick={startGame} className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            Continue...
          </button>
        )}
        {gameStarted && !gamePaused && (
          <canvas ref={canvasRef} id="gameCanvas" width="800" height="600" className="border-b-4 border-black"></canvas>        
        )}        
        <audio 
          ref={audioRef} 
          src="/audio/game/All_Change.wav" 
          preload="auto" 
          loop 
        >      
          <track kind="captions" srcLang="en" label="English captions" />
        </audio>
      </div>
    </section>
  );
};

export default MyGame;
