import React, { useEffect, useRef, useState } from 'react';
import { createPlayer } from '@/app/game/Player';
import { Obstacle, createObstacle } from '@/app/game/Obstacles';
import { gameLoop } from '@/app/game/GameManager';
import { musicSections } from '../game/Music';
import IntroSection from '@/app/game/IntroSection';
import InstructionsSection from '@/app/game/InstructionsSection';
import GameCanvas from '@/app/game/GameCanvas';

const MyGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  const player = useRef(createPlayer(0));
  const obstacles = useRef<Obstacle[]>([]);
  const gameOver = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    player.current = createPlayer(canvas.height);

    gameLoopFunctionRef.current = () =>
      gameLoop(ctx, player.current, obstacles.current, setGamePaused, gameOver, audio, animationFrameIdRef, gameLoopFunctionRef);

    gameLoopFunctionRef.current();

    // Add obstacles at regular intervals
    const obstacleInterval = setInterval(() => {
      obstacles.current.push(createObstacle(canvas.width, canvas.height));
    }, 2000); // Adjust the interval timing as needed

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        if (gamePaused) resumeGame();
        else if (!player.current.isJumping) {
          player.current.velocityY = player.current.jumpStrength;
          player.current.isJumping = true;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(obstacleInterval); // Clear the interval when component unmounts or game pauses
      document.removeEventListener('keydown', handleKeyDown);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [gameStarted, gamePaused]);

  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(error => console.error("Audio play error:", error));
    }
  };

  const resumeGame = async () => {
    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    
    setGamePaused(false);
  
    if (audioRef.current) {
      // Pause the audio if it is playing to reset
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      // Set current time to the correct section
      audioRef.current.currentTime = musicSections[currentSection];
      try {
        // Play audio and handle potential play interruption
        await audioRef.current.play();
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  
    gameOver.current = false;
    gameLoopFunctionRef.current();
  };  

  const showHowToPlay = () => {
    setShowIntro(false);
    setShowInstructions(true);
  };

  return (
    <section id="myGame" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">

        {/* Initial page content */}
        {showIntro && <IntroSection onShowInstructions={showHowToPlay} />}

        {/* Instructions after clicking the first button */}
        {showInstructions && !gameStarted && <InstructionsSection onStartGame={startGame} />}

        {/* Game starts */}
        {gameStarted && !gamePaused && <GameCanvas canvasRef={canvasRef} />}

        {/* If player dies, this button appears, to continue for last musical section */}
        {gamePaused && (
          <button onClick={resumeGame} className="font-gopher-mono border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            Continue from last section...
          </button>
        )}

        {/* Audio player needs to be here */}
        <audio ref={audioRef} src="/audio/game/All_Change.wav" preload="auto" loop>
          <track kind="captions" srcLang="en" label="English captions" />
        </audio>

      </div>
    </section>
  );
};
export default MyGame;