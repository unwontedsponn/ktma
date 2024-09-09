// Player.ts
export type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  velocityY: number;
  isJumping: boolean;
  gravity: number;
  jumpStrength: number;
  rotation: number;
  rotationSpeed: number;
};

export const createPlayer = (canvasHeight: number): Player => ({
  x: 50,
  y: canvasHeight - 35,
  width: 25,
  height: 25,
  color: '#acddfb', // light-blue
  velocityY: 0,
  isJumping: false,
  gravity: 0.5,
  jumpStrength: -10,
  rotation: 0,
  rotationSpeed: 0.1,
});

export const updatePlayer = (player: Player, canvasHeight: number) => {
  if (player.isJumping) {
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    player.rotation += player.rotationSpeed;

    if (player.y >= canvasHeight - player.height - 10) {
      player.y = canvasHeight - player.height - 10;
      player.velocityY = 0;
      player.isJumping = false;
      player.rotation = 0;
    }
  }
};