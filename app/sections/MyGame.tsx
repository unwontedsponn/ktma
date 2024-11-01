import React, { useState, useRef } from 'react';
import { useGameLogic } from '@/app/game/GameLogic';
import IntroSection from '@/app/game/sections/IntroSection';
import InstructionsSection from '@/app/game/sections/InstructionsSection';
import GamePausedSection from '@/app/game/sections/PausedSection';
import CompletedSection from '../game/sections/CompletedSection';
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

  const [loading, setLoading] = useState(false); // Loading state
  const [showIntro, setShowIntro] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false); // New state to manage CompletedSection visibility
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  const [, setCurrentSection] = useState(0);

  // Function to handle the end of the audio
  const handleAudioEnd = () => {
    console.log("Audio track ended. Stopping the game.");

    // Stop the game loop
    stopGameLoop(animationFrameIdRef);

    // Reset player state and position
    if (player.current) {
      player.current.isDead = true;
      player.current.x = 0;
      player.current.y = 0;
    }

    // Pause the audio if it's still playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    // Clear other game entities
    floorPlatforms.current = [];
    obstacles.current = [];
    powerUps.current = [];
    checkpointLines.current = [];

    // Reset game state, hide intro and instructions, and show completed section
    setGameStarted(false);
    setShowIntro(false);
    setShowInstructions(false);
    setShowCompleted(true); // Show the completed section
  };

  return (
    <section id="myGame" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <div className="hidden md:flex flex-col justify-center gap-x-8 px-32 items-center h-screen overflow-hidden">

        {loading && (
          <div className="fixed inset-0 font-gopher-mono flex items-center justify-center color-dark text-2xl">
            Loading...
          </div>
        )}
        
        {!loading && (
          <div className="game-container">
             <audio 
                ref={audioRef} 
                src="/audio/game/All_Change.wav" 
                preload="auto" 
                loop={false}
                onEnded={handleAudioEnd} // Handle the audio end event
              >
                <track kind="captions" srcLang="en" label="English captions" />
              </audio>
              
              {showIntro && (
                <IntroSection 
                  setShowIntro={setShowIntro} 
                  setShowInstructions={setShowInstructions}
                  setGameStarted={setGameStarted} 
                  setGamePaused={setGamePaused} 
                  setLoading={setLoading}
                  audioRef={audioRef}
                  player={player}
                  floorPlatforms={floorPlatforms}
                  audioManager={audioManager || undefined} // Pass audioManager only if defined
                  canvasRef={canvasRef}
                />
              )}

              {!showIntro && showInstructions && !gameStarted && audioManager && (
                <InstructionsSection 
                  setShowIntro={setShowIntro} 
                  setShowInstructions={setShowInstructions}
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

              {showCompleted && (
                <CompletedSection />
              )}
          </div>
        )}       

      </div>
    </section>
  );
};

export default MyGame;
