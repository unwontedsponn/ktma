// PowerUps.ts
import { Player } from "@/app/game/entities/Player/Player";
import { tokenSfx } from '@/app/game/audio/SfxLibrary';
import AudioManager from "../audio/AudioManager";
import { FloorPlatform } from "./FloorPlatforms/FloorPlatforms";

export class PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  platform: FloorPlatform;
  isActive: boolean;
  private xOffset: number; // Store the randomized offset
  private audioManager: AudioManager; // Add AudioManager instance

  constructor(platform: FloorPlatform, audioManager: AudioManager) {
    this.width = 20;
    this.height = 20;

    // Randomize x within the platform's width
    this.xOffset = Math.random() * (platform.width - this.width);
    this.x = platform.x + this.xOffset;
    this.y = platform.y - 40;
    
    this.color = '#5f9251'; // green
    this.platform = platform;
    this.isActive = false;
    this.audioManager = audioManager; // Store the AudioManager instance
  }

  updatePosition() {
    // Move the power-up with its associated platform
    this.x = this.platform.x + this.xOffset; // Keep the initial randomized position relative to the platform
    this.y = this.platform.y - this.height * 2; // Keep it slightly above the platform
  }

  isOffScreen(): boolean {return this.x + this.width < 0;}

  checkCollision(player: Player): boolean {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  activatePowerUp(
    setIsPowerUpActive: (isActive: boolean) => void,
    audioRef: React.RefObject<HTMLAudioElement>,
    setAudioType: (type: 'normal' | '8bit') => void
  ) {
    setIsPowerUpActive(true);
    this.audioManager.playRandomSfx(tokenSfx, 'token');
    
    const currentTime = audioRef?.current?.currentTime || 0;
    this.audioManager.switchMusic(audioRef, currentTime, '8bit', setAudioType);

    setTimeout(() => {
      const newCurrentTime = audioRef?.current?.currentTime || 0;
      this.audioManager.switchMusic(audioRef, newCurrentTime, 'normal', setAudioType);
      setIsPowerUpActive(false);
    }, 5000);
  }
}

// Utility function to create a new PowerUp
export const createPowerUp = (platform: FloorPlatform, audioManager: AudioManager): PowerUp => {
  return new PowerUp(platform, audioManager);
};

// PowerUp Manager
export const updatePowerUps = (
  powerUps: PowerUp[],
  player: Player,  
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: React.RefObject<HTMLAudioElement>,  
  setAudioType: (type: 'normal' | '8bit') => void,  
  floorPlatforms: FloorPlatform[],
  canvasWidth: number,
  audioManager: AudioManager,
  isPowerUpActive: boolean 
) => {
  if (isPowerUpActive) return;

  powerUps.forEach((powerUp, index) => {   
    powerUp.updatePosition();

    if (powerUp.isOffScreen()) {
      powerUps.splice(index, 1);
      return;
    }
    
    if (powerUp.checkCollision(player)) {
      powerUp.activatePowerUp(setIsPowerUpActive, audioRef, setAudioType);
      
      // Clear all power-ups from the screen when one is activated
      powerUps.length = 0; // This effectively deletes all power-ups
      return; // Exit the loop
    }          
  });

  // Attempt to spawn a new power-up if no power-up is active
  const spawnProbability = 0.1;
  if (Math.random() < spawnProbability) {
    const upcomingPlatform = floorPlatforms.find(platform => platform.x > canvasWidth && !platform.hasPowerUp);
    if (upcomingPlatform) {
      powerUps.push(createPowerUp(upcomingPlatform, audioManager));
      upcomingPlatform.hasPowerUp = true; // Mark the platform as having a power-up
    }
  }
};