import { Player } from "@/app/game/models/Player";

export type PowerUp = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export const createPowerUp = (canvasWidth: number, canvasHeight: number): PowerUp => ({
  x: canvasWidth,
  y: canvasHeight - 85,  // Ensure this height aligns well with the player's jump height
  width: 20,
  height: 20,
  color: '#5f9251', // green, corrected color code
});

export const updatePowerUps = (
  powerUps: PowerUp[],
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  setIsPowerUpActive: (isActive: boolean) => void,
  audioRef: React.RefObject<HTMLAudioElement>,  // Pass audioRef here to manage the music
  audioType: string, // Keep track of the current audio type ('normal' or '8bit')
  setAudioType: (type: 'normal' | '8bit') => void // Set audio type
) => {
  powerUps.forEach((powerUp, index) => {
    powerUp.x -= 4;

    if (powerUp.x + powerUp.width < 0) powerUps.splice(index, 1); // Remove power-up when it goes off-screen

    // Check for collision between player and power-up
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      // Activate the power-up (invincibility and audio change)
      setIsPowerUpActive(true);
      player.isInvincible = true;

      // Change the music to 8-bit version if not already playing
      if (audioRef && audioRef.current && audioType === 'normal') {
        const audio = audioRef.current;
        const currentTime = audio.currentTime;

        // Pause normal music and switch to 8-bit music at the same timestamp
        audio.pause();
        audio.src = '/audio/game/All Change 8-BIT.wav';
        audio.currentTime = currentTime;
        audio.play();
        setAudioType('8bit'); // Set the audio type to 8bit

        // Schedule to switch back to normal music after 5 seconds
        setTimeout(() => {
          const newCurrentTime = audio.currentTime;
          audio.pause();
          audio.src = '/audio/game/All_Change.wav';
          audio.currentTime = newCurrentTime;
          audio.play();
          setAudioType('normal'); // Set the audio type back to normal
          setIsPowerUpActive(false); // Deactivate the power-up
          player.isInvincible = false; // Turn off invincibility after 5 seconds
        }, 5000);
      }

      // Remove the collected power-up
      powerUps.splice(index, 1);
    }
  });

  // Spawning new power-ups with a controlled probability
  const spawnProbability = 0.002;
  if (Math.random() < spawnProbability) powerUps.push(createPowerUp(canvasWidth, canvasHeight));
};

