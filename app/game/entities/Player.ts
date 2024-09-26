// Player.ts
import { playRandomSfx, jumpSfx, landSfx, dyingSfx } from "@/app/game/utils/Audio";
import { FloorPlatform } from "./FloorPlatforms";

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  gravity: number;
  jumpStrength: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  isInvincible: boolean;
  isDead: boolean;
  isGrounded: boolean;
  hasLanded: boolean;

  private readonly normalColor = '#acddfb';
  private readonly powerUpColor = '#ffd700';
  private readonly moveSpeed = 5;
  
  constructor(startingPlatform: FloorPlatform) {
    this.x = 100;
    this.y = startingPlatform.y - 100;
    this.width = 25;
    this.height = 25;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.gravity = 0.5;
    this.jumpStrength = -10;
    this.rotation = 0;
    this.rotationSpeed = 0.1;
    this.color = this.normalColor;
    this.isInvincible = false;
    this.isDead = false;
    this.isGrounded = false;
    this.hasLanded = false;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) event.preventDefault();
    if (event.code === 'ArrowLeft') this.moveLeft();
    if (event.code === 'ArrowRight') this.moveRight();
    if (event.code === 'Space') this.jump();
  }
  
  handleKeyUp(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') this.stopMoving();
  }

  moveLeft() {this.velocityX = -this.moveSpeed;}
  moveRight() {this.velocityX = this.moveSpeed;}
  stopMoving() {this.velocityX = 0;}
  
  updatePosition(canvasWidth: number) {
    this.x += this.velocityX;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
  }

  jump() {
    this.velocityY = this.jumpStrength;
    this.isJumping = true;
    this.isGrounded = false;
    this.hasLanded = false;
    playRandomSfx(jumpSfx, 'jump');
  }

  applyGravity() {
    if (!this.isGrounded) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;
      this.rotation += this.rotationSpeed;
    } else {
      this.rotation = 0; // Reset rotation when grounded
    }
  }

  checkPlatformCollision(floorPlatforms: FloorPlatform[]) {
    for (const platform of floorPlatforms) {
      const isPlayerOnPlatform = 
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + platform.height &&
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width;

      // Only reset isGrounded when falling down (velocityY >= 0)
      if (isPlayerOnPlatform && this.velocityY >= 0) {
        this.isGrounded = true;
        this.isJumping = false;
        this.velocityY = 0;
        this.y = platform.y - this.height; // Adjust player's y position to the top of the platform
        this.rotation = 0;

        if (!this.hasLanded) {
          playRandomSfx(landSfx, 'land');
          this.hasLanded = true;
        }

        return;
      }
    }

    // If no platform collision detected, the player is airborne
    this.isGrounded = false;
    this.hasLanded = false; // Reset the flag when the player is airborne
  }

  handleFall(canvasHeight: number, setGamePaused: (paused: boolean) => void, audio: HTMLAudioElement | null) {
    if (this.y >= canvasHeight - this.height) {
      setGamePaused(true);
      playRandomSfx(dyingSfx, 'dying');
      if (audio) audio.pause();
      this.isDead = true;
    }
  }

  applyPowerUp(isPowerUpActive: boolean) {
    this.color = isPowerUpActive ? this.powerUpColor : this.normalColor;
    this.isInvincible = isPowerUpActive;
  }
}

// Utility function to create a player instance
export const createPlayer = (startingPlatform: FloorPlatform): Player => new Player(startingPlatform);

// Utility function to calculate jump distance
export const calculateJumpDistance = (jumpStrength: number, gravity: number, horizontalSpeed: number) => {
  const timeToPeak = jumpStrength / gravity;
  const totalTimeInAir = timeToPeak * 2;
  return horizontalSpeed * totalTimeInAir;
};

// Main update function, simplified
export const updatePlayer = (
  player: Player, 
  canvasWidth: number, 
  canvasHeight: number,
  isPowerUpActive: boolean,
  gamePaused: boolean,
  setGamePaused: (paused: boolean) => void,
  audio: HTMLAudioElement | null,
  floorPlatforms: FloorPlatform[]
) => {
  if (gamePaused || player.isDead) return;

  player.applyPowerUp(isPowerUpActive);
  player.updatePosition(canvasWidth);
  player.applyGravity();
  player.checkPlatformCollision(floorPlatforms);
  
  if (!player.isGrounded) player.handleFall(canvasHeight, setGamePaused, audio);
};
