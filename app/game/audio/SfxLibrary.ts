// SfxLibrary.ts
const sfxBaseURL = '/audio/game/sfx/';

export const jumpSfx = [
  `${sfxBaseURL}1. Jumping/jump1.mp3`,
  `${sfxBaseURL}1. Jumping/jump2.mp3`,
  `${sfxBaseURL}1. Jumping/jump3.mp3`,  
];

export const landSfx = [
  `${sfxBaseURL}2. Landing/land1.mp3`,
  `${sfxBaseURL}2. Landing/land2.mp3`,
  `${sfxBaseURL}2. Landing/land3.mp3`,
  `${sfxBaseURL}2. Landing/land4.mp3`,
  `${sfxBaseURL}2. Landing/land5.mp3`,
  `${sfxBaseURL}2. Landing/land6.wav`,
];

export const dyingSfx = [
  `${sfxBaseURL}3. Dying/dying1.wav`,
  `${sfxBaseURL}3. Dying/dying2.wav`,
  `${sfxBaseURL}3. Dying/dying3.wav`,
  `${sfxBaseURL}3. Dying/dying4.wav`,
];

export const checkpointSfx = [
  `${sfxBaseURL}5. Checkpoint/checkpoint1.wav`,
  `${sfxBaseURL}5. Checkpoint/checkpoint2.wav`,
  `${sfxBaseURL}5. Checkpoint/checkpoint3.wav`,
  `${sfxBaseURL}5. Checkpoint/checkpoint4.wav`,
];

export const tokenSfx = [
  `${sfxBaseURL}7. Token/token1.wav`,
  `${sfxBaseURL}7. Token/token2.wav`,
  `${sfxBaseURL}7. Token/token3.wav`,
  `${sfxBaseURL}7. Token/token4.wav`,
];

// Preload all audio files
export const preloadAudioFiles = (audioFiles: string[]) => {
  if (typeof window !== "undefined") {
    audioFiles.forEach((src) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
    });
  }  
};

// Call this function only in a browser environment
if (typeof window !== "undefined") {
  preloadAudioFiles([...jumpSfx, ...landSfx, ...dyingSfx, ...checkpointSfx, ...tokenSfx]);
}