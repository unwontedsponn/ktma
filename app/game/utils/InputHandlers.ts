import { Player } from "@/app/game/entities/Player";

export const keyDownHandler = (event: KeyboardEvent, player: Player) => {  
  
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) event.preventDefault();
  if (event.code === 'ArrowLeft') player.velocityX = -5;  
  if (event.code === 'ArrowRight') player.velocityX = 5;
  
  if (event.code === 'Space') {        
    if (!player.isJumping) {          
      player.velocityY = player.jumpStrength;
      player.isJumping = true;
    }
  }  
};

export const keyUpHandler = (event: KeyboardEvent, player: Player) => {  
  if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') player.velocityX = 0;
};
