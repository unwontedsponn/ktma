// PowerUps.ts
import { Player } from "@/app/game/entities/Player";
import { switchMusic, playRandomSfx, tokenSfx } from '@/app/game/utils/Audio';
import { FloorPlatform } from "./FloorPlatforms";

export type PowerUp = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  platform: FloorPlatform;
};

export const createPowerUp = (platform: FloorPlatform): PowerUp => ({
  x: platform.x + 20,
  y: platform.y - 40, // Spawn the power-up slightly above the platform
  width: 20,
  height: 20,
  color: '#5f9251', // green
  platform: platform
});

export const updatePowerUps = (
  powerUps: PowerUp[],
  player: Player,  
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: React.RefObject<HTMLAudioElement>,  
  setAudioType: (type: 'normal' | '8bit') => void,  
  floorPlatforms: FloorPlatform[],
  canvasWidth: number
) => {
  
  powerUps.forEach((powerUp, index) => {   
    
    // Move the power-up with its associated platform
    powerUp.x = powerUp.platform.x + powerUp.width; // Keep it slightly to the right of the platform's x position
    powerUp.y = powerUp.platform.y - powerUp.height * 2; // Keep it slightly above the platform

    if (powerUp.x + powerUp.width < 0) {
      powerUps.splice(index, 1);
      return;
    }
    
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {             
      setIsPowerUpActive(true);  
      powerUps.splice(index, 1);
      
      playRandomSfx(tokenSfx, 'token');
      const currentTime = audioRef?.current?.currentTime || 0;
      switchMusic(audioRef, currentTime, '8bit', setAudioType);
      
      setTimeout(() => {
        const newCurrentTime = audioRef?.current?.currentTime || 0;
        switchMusic(audioRef, newCurrentTime, 'normal', setAudioType);
        setIsPowerUpActive(false);
      }, 5000);
    }
  });
  // Attempt to spawn a new power-up
  const spawnProbability = 0.1;
  if (Math.random() < spawnProbability) {
    // Find the platform that is about to move into the canvas from the right
    const upcomingPlatform = floorPlatforms.find(platform => platform.x > canvasWidth);

    if (upcomingPlatform) {
      powerUps.push(createPowerUp(upcomingPlatform));
    }
  }
}