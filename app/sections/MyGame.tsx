// MyGame.tsx
import React, { useState, useRef } from 'react';
import { useGameLogic } from '@/app/game/GameLogic';
import IntroSection from '@/app/game/sections/IntroSection';
import InstructionsSection from '@/app/game/sections/InstructionsSection';
import GamePausedSection from '@/app/game/sections/PausedSection';
import { stopGameLoop } from '../game/AnimationFrameManager';

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

  // Function to handle the end of the audio
  const handleAudioEnd = () => {
    console.log("Audio track ended. Stopping the game.");

    // Stop the game loop
    stopGameLoop(animationFrameIdRef);

    // Reset the game state and stop player actions
    if (player.current) {
      player.current.isDead = true;  // Prevent further player actions
      player.current.x = 0;          // Reset player position if needed
      player.current.y = 0;          // Reset player position if needed
    }

    // Pause the audio if it's still playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    // Clear or reset other game entities like platforms, obstacles, etc., if needed
    if (floorPlatforms.current) floorPlatforms.current = [];
    if (obstacles.current) obstacles.current = [];
    if (powerUps.current) powerUps.current = [];
    if (checkpointLines.current) checkpointLines.current = [];

    // Reset game state and show the intro again
    setGameStarted(false);
    setShowIntro(true);
    setShowInstructions(false); // Optionally reset instructions view
  };

  return (
    <section id="myGame" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">

        <audio 
          ref={audioRef} 
          src="/audio/game/All_Change.wav" 
          preload="auto" 
          loop={false}  // Ensure looping is off
          onEnded={handleAudioEnd}  // Handle the audio end event
        >
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