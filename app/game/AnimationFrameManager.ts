// AnimationFrameManager.ts
export const startGameLoop = (
  gameLoopFunctionRef: React.MutableRefObject<(timestamp: number) => void>,
  animationFrameIdRef: React.MutableRefObject<number | null>,
  player: React.MutableRefObject<any>
) => {
  if (animationFrameIdRef.current === null) {
    animationFrameIdRef.current = requestAnimationFrame(gameLoopFunctionRef.current);
    player.current.isDead = false;
  }
};

export const stopGameLoop = (
  animationFrameIdRef: React.MutableRefObject<number | null>
) => {
  const frameId = animationFrameIdRef.current;
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    animationFrameIdRef.current = null;
  }
};
