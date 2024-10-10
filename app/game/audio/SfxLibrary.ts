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

// Preload all SFX files and return a Promise to ensure they're fully loaded
export const preloadSfxFiles = (audioFiles: string[]): Promise<void[]> => {
  if (typeof window === "undefined") return Promise.resolve([]); // Return an empty promise if not in the browser

  const preloadPromises = audioFiles.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => resolve(), { once: true });
      audio.addEventListener('error', () => reject(new Error(`Failed to load: ${src}`)), { once: true });
    });
  });

  return Promise.all(preloadPromises); // Wait until all audio files are preloaded
};

// You can use this function to preload all SFX
export const preloadAllSfx = (): Promise<void[]> => {
  return preloadSfxFiles([...jumpSfx, ...landSfx, ...dyingSfx, ...checkpointSfx, ...tokenSfx]);
};