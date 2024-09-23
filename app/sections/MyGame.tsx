// MyGame.tsx
import React, { useState, useRef } from 'react';
import { useGameLogic } from '@/app/game/GameLogic';
import IntroSection from '@/app/game/sections/Intro';
import InstructionsSection from '@/app/game/sections/Instructions';
import GamePausedSection from '@/app/game/sections/Paused';

const MyGame: React.FC = () => {
  const {
    canvasRef,
    audioRef,
    gameStarted,
    setGameStarted,
    gamePaused,
    setGamePaused,
    resetObstacles,
    resetPowerUps,
    resetCheckpointLines 
  } = useGameLogic();

  const [showIntro, setShowIntro] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  const [currentSection, setCurrentSection] = useState(0); // Track the current section

  return (
    <section id="myGame" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">
        
        {showIntro && (
          <IntroSection 
            setShowIntro={setShowIntro} 
            setShowInstructions={setShowInstructions} 
          />
        )}

        {!showIntro && showInstructions && !gameStarted && (
          <InstructionsSection 
            setGameStarted={setGameStarted} 
            setGamePaused={setGamePaused} 
            audioRef={audioRef} 
          />
        )}

        {gameStarted && !gamePaused && <canvas ref={canvasRef} id="gameCanvas" width="800" height="600" className="border-b-4 border-grey-black-brown"></canvas>}

        {gamePaused && (
          <GamePausedSection 
            setGamePaused={setGamePaused}
            animationFrameIdRef={animationFrameIdRef}
            audioRef={audioRef}
            gameLoopFunctionRef={gameLoopFunctionRef}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            resetObstacles={resetObstacles}
            resetPowerUps={resetPowerUps}
            resetCheckpointLines={resetCheckpointLines}
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