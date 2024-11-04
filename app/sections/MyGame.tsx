import React, { useState, useRef, useEffect } from 'react';
import { useGameLogic } from '@/app/game/GameLogic';
import IntroSection from '@/app/game/sections/IntroSection';
import InstructionsSection from '@/app/game/sections/InstructionsSection';
import GamePausedSection from '@/app/game/sections/PausedSection';
import CompletedSection from '../game/sections/CompletedSection';
import { stopGameLoop } from '../game/AnimationFrameManager';

interface MyGameProps {
  onPlayChange: (playing: boolean) => void;
}

const MyGame: React.FC<MyGameProps> = ({ onPlayChange }) => {
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

  const [isNarrowViewport, setIsNarrowViewport] = useState(false); // For width check
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameLoopFunctionRef = useRef<(timestamp: number) => void>(() => {});
  const [, setCurrentSection] = useState(0);

  // Track game play status and update onPlayChange only during active gameplay
  useEffect(() => {
    if (gameStarted && !gamePaused) {
      onPlayChange(true); // Actively playing
    } else {
      onPlayChange(false); // Not playing (includes paused, intro, instructions)
    }
  }, [gameStarted, gamePaused, onPlayChange]);

  const handleAudioEnd = () => {
    stopGameLoop(animationFrameIdRef);

    if (player.current) {
      player.current.isDead = true;
      player.current.x = 0;
      player.current.y = 0;
    }

    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    floorPlatforms.current = [];
    obstacles.current = [];
    powerUps.current = [];
    checkpointLines.current = [];

    setGameStarted(false);
    setShowIntro(false);
    setShowInstructions(false);
    setShowCompleted(true);
  };

  // Check for width (used for responsive small device layout)
  useEffect(() => {
    const updateViewportWidth = () => {
      setIsNarrowViewport(window.innerWidth < 768);
    };

    // Check initial width
    updateViewportWidth();

    // Add resize event listener
    window.addEventListener('resize', updateViewportWidth);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return (
    <section id="myGame" className="md:pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-full md:h-screen">

      <div className={`flex flex-col md:flex-row justify-center items-center gap-x-8 px-4 md:px-0 items-center h-auto md:h-screen ${isNarrowViewport ? 'space-y-8 px-4 sm:px-8 bg-darker-green bg-opacity-10 py-16' : 'overflow-hidden'}`}>

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
              onEnded={handleAudioEnd}
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
                audioManager={audioManager || undefined}
                canvasRef={canvasRef}
              />
            )}

            {!showIntro && showInstructions && !gameStarted && audioManager && (
              <InstructionsSection 
                setShowIntro={setShowIntro} 
                setShowInstructions={setShowInstructions}
              />
            )}

            {gameStarted && !gamePaused && (
              <canvas ref={canvasRef} id="gameCanvas" width="800" height="600"></canvas>
            )}

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
