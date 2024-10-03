// MyGame.tsx
import React, { useState, useRef } from 'react';
import { useGameLogic } from '@/app/game/GameLogic';
import IntroSection from '@/app/game/sections/IntroSection';
import InstructionsSection from '@/app/game/sections/InstructionsSection';
import GamePausedSection from '@/app/game/sections/PausedSection';

const MyGame: React.FC = () => {
  const {
    canvasRef,
    audioRef,
    gameStarted,
    setGameStarted,
    gamePaused,
    setGamePaused, 
    setIsPowerUpActive,   
    floorPlatforms,    
    player,
    obstacles,
    powerUps,
    checkpointLines,
    audioManager,
    platformSpeedRef,
    initialPlatformSpeed,
  } = useGameLogic();  

  const [showIntro, setShowIntro] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  const [, setCurrentSection] = useState(0); // Track the current section

  return (
    <section id="myGame" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">

        <audio ref={audioRef} src="/audio/game/All Change 8-BIT.wav" preload="auto" loop>
          <track kind="captions" srcLang="en" label="English captions" />
        </audio>
        
        {showIntro && (
          <IntroSection 
            setShowIntro={setShowIntro} 
            setShowInstructions={setShowInstructions} 
          />
        )}

        {!showIntro && showInstructions && !gameStarted && audioManager && (
          <InstructionsSection 
            setGameStarted={setGameStarted} 
            setGamePaused={setGamePaused} 
            audioRef={audioRef}
            player={player}
            floorPlatforms={floorPlatforms}
            audioManager={audioManager}
            canvasRef={canvasRef}
          />
        )}

        {gameStarted && !gamePaused && <canvas ref={canvasRef} id="gameCanvas" width="800" height="600" className=""></canvas>}

        {gamePaused && audioManager && (
          <GamePausedSection
            setGamePaused={setGamePaused}
            setIsPowerUpActive={setIsPowerUpActive}
            animationFrameIdRef={animationFrameIdRef}
            audioRef={audioRef}
            gameLoopFunctionRef={gameLoopFunctionRef}
            setCurrentSection={setCurrentSection}
            player={player}
            obstacles={obstacles}
            powerUps={powerUps}
            floorPlatforms={floorPlatforms}
            checkpointLines={checkpointLines}
            platformSpeedRef={platformSpeedRef}
            initialPlatformSpeed={initialPlatformSpeed}
            audioManager={audioManager}
            canvasWidth={canvasRef.current?.width || 0} 
            canvasHeight={canvasRef.current?.height || 0}
          />             
        )}        

      </div>
    </section>
  );
};
export default MyGame;