// GameLoopManager.ts
import { gameLoop } from './GameLoop';
import { Player } from '@/app/game/entities/Player/Player';
import { Obstacle } from '@/app/game/entities/Obstacles/Obstacles';
import { PowerUp } from '@/app/game/entities/PowerUps';
import { FloorPlatform } from '@/app/game/entities/FloorPlatforms/FloorPlatforms';
import { CheckpointLine } from '@/app/game/entities/CheckpointLine';
import AudioManager from '@/app/game/audio/AudioManager';

export const createGameLoopFunction = (
  ctx: CanvasRenderingContext2D,
  player: React.MutableRefObject<Player | null>,
  obstacles: React.MutableRefObject<Obstacle[]>,
  powerUps: React.MutableRefObject<PowerUp[]>,
  floorPlatforms: React.MutableRefObject<FloorPlatform[]>,
  checkpointLines: React.MutableRefObject<CheckpointLine[]>,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>,
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setAudioType: (type: 'normal' | '8bit') => void,
  isPowerUpActive: boolean,
  audioManager: AudioManager
) => {
  let lastTime = 0;

  return (timestamp: number) => {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    if (deltaTime > 12) {
      lastTime = timestamp;

      if (player.current) {
        gameLoop(
          ctx,
          player.current,
          obstacles.current,
          powerUps.current,
          floorPlatforms.current,
          checkpointLines.current,
          false, // gamePaused, handled in useEffect now
          setGamePaused,
          audio,
          animationFrameIdRef,
          gameLoopFunctionRef,
          setIsPowerUpActive,
          audioRef,
          setAudioType,
          isPowerUpActive,
          audioManager
        );
      }
    }
    animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
  };
};