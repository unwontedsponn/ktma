// PlayerInputManager.ts
import { Player } from "@/app/game/entities/Player/Player";

export const addPlayerInputListeners = (playerInstance: Player) => {
  const handleKeyDown = (event: KeyboardEvent) => playerInstance.handleKeyDown(event);
  const handleKeyUp = (event: KeyboardEvent) => playerInstance.handleKeyUp(event);

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Return a function to remove the listeners
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };
};
