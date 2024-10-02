// PlayerManager.ts
import { MutableRefObject } from 'react';
import { Player, createPlayer } from '@/app/game/entities/Player/Player';
import { FloorPlatform } from '@/app/game/entities/FloorPlatforms/FloorPlatforms';
import AudioManager from '@/app/game/audio/AudioManager';

export const initializePlayer = (
  player: MutableRefObject<Player | null>,
  floorPlatforms: MutableRefObject<FloorPlatform[]>,
  audioManager: AudioManager
) => {
  // Ensure player is created on the first platform
  const startingPlatform = floorPlatforms.current[0];
  if (!player.current) player.current = createPlayer(startingPlatform, audioManager);
  player.current.isDead = false; // Reset player's death state
};
