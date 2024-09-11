// useKeyDownHandler.ts
import { MutableRefObject } from 'react';
import { Player } from '@/app/game/models/Player';

type KeyDownHandlerParams = {
  player: MutableRefObject<Player>;
  gamePaused: boolean;
  resumeGame: () => void;
};

export const handleKeyDown = ({ player, gamePaused, resumeGame }: KeyDownHandlerParams) => {
  return (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      if (gamePaused) resumeGame();
      else if (!player.current.isJumping) {
        player.current.velocityY = player.current.jumpStrength;
        player.current.isJumping = true;
      }
    }
  };
};