// MyGame.tsx
import React, { useRef, useState } from 'react';
import { createPlayer } from '@/app/game/models/Player';
import { Obstacle } from '@/app/game/models/Obstacles';
import IntroSection from '@/app/game/components/IntroSection';
import InstructionsSection from '@/app/game/components/InstructionsSection';
import GamePausedSection from '@/app/game/components/GamePausedSection';
import GameCanvas from '@/app/game/components/GameCanvas';
import { useGameLogic } from '@/app/game/hooks/useGameLogic';

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
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});

  // Function to reset obstacles
  const resetObstacles = () => {obstacles.current = [];};

  // Use the custom hook for game logic
  useGameLogic({
    canvasRef,
    audioRef,
    player,
    obstacles,
    gameStarted,
    gamePaused,
    setGamePaused,
    resumeGame: () => {}, // Placeholder, the logic is in the GamePausedSection
    animationFrameIdRef,
    gameLoopFunctionRef,
  }); 

  return (
    <section id="myGame" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">
        
        {showIntro && (
          <IntroSection 
            setShowIntro={setShowIntro} 
            setShowInstructions={setShowInstructions} 
          />
        )}

        {showInstructions && !gameStarted && (
          <InstructionsSection 
            setGameStarted={setGameStarted} 
            setGamePaused={setGamePaused} 
            audioRef={audioRef} 
          />
        )}

        {gameStarted && !gamePaused && <GameCanvas canvasRef={canvasRef} />}

        {gamePaused && (
          <GamePausedSection 
            setGamePaused={setGamePaused} 
            animationFrameIdRef={animationFrameIdRef} 
            audioRef={audioRef} 
            gameLoopFunctionRef={gameLoopFunctionRef} 
            currentSection={currentSection} 
            setCurrentSection={setCurrentSection}
            resetObstacles={resetObstacles}
          />
        )}

        <audio ref={audioRef} src="/audio/game/All_Change.wav" preload="auto" loop>
          <track kind="captions" srcLang="en" label="English captions" />
        </audio>
      </div>
    </section>
  );
};

export default MyGame;
