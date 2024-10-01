import { MutableRefObject } from 'react';
import { FloorPlatform } from './FloorPlatforms';
import { Player, createPlayer, calculateJumpDistance } from '@/app/game/entities/Player';
import AudioManager from '@/app/game/audio/AudioManager';

export const initializePlatforms = (
  canvasWidth: number,
  canvasHeight: number,
  player: MutableRefObject<Player | null>,
  floorPlatforms: MutableRefObject<FloorPlatform[]>,
  audioManager: AudioManager
) => {
  if (!floorPlatforms.current.length) {
    // Ensure player exists
    if (!player.current) {
      const startingPlatform = FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, 0);
      floorPlatforms.current.push(startingPlatform);
      player.current = createPlayer(startingPlatform, audioManager); // Create player if not already created
    }

    // Position the first platform near the left of the canvas
    if (!floorPlatforms.current.length) {
      floorPlatforms.current.push(FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, 0));
    }

    // Calculate a valid jumpable gap for the second platform
    const horizontalSpeed = 1.8; // Platform movement speed
    const jumpDistance = calculateJumpDistance(player.current!.jumpStrength, player.current!.gravity, horizontalSpeed);

    const maxGap = jumpDistance * 0.85; // Slightly less than player's max jump distance
    const minGap = 50; // Ensure there is always some gap, but not too small
    const gap = FloorPlatform.getRandomInRange(minGap, maxGap); // Random gap within the jumpable range

    // Spawn the second platform after the valid gap
    floorPlatforms.current.push(FloorPlatform.createFloorPlatform(canvasWidth, canvasHeight, floorPlatforms.current[0].width + gap));
  }
};
