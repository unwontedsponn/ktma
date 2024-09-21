// Audio.ts
export const musicSections = [
  0,    // 00:00
  9,    // 00:09
  33,   // 00:33
  71,   // 01:11
  88,   // 01:28
  104,  // 01:44
  121,  // 02:01
  128,  // 02:08
  140,  // 02:20
  157,  // 02:37
  173,  // 02:53
  190,  // 03:10
  207,  // 03:27
  228   // 03:48
];

// Switch between main track and 8-bit version
export const switchMusic = (
  audioRef: React.RefObject<HTMLAudioElement>, 
  currentTime: number,
  src: string,
  audioType: 'normal' | '8bit',
  setAudioType: (type: 'normal' | '8bit') => void
) => {
  if (audioRef && audioRef.current) {
    const audio = audioRef.current;
    audio.pause();
    audio.src = src;
    audio.currentTime = currentTime;
    audio.play();
    setAudioType(audioType);
  }
};

// Play sound effect with random selection and slight pitch variation
export const playRandomSfx = (srcArray: string[], volume: number = 1.0) => {
  const randomIndex = Math.floor(Math.random() * srcArray.length);
  const audio = new Audio(srcArray[randomIndex]);
  audio.volume = volume;
  
  // Apply slight random pitch variation (playbackRate)
  const pitchVariation = 0.9 + Math.random() * 0.2; // Random playback rate between 0.9 and 1.1
  audio.playbackRate = pitchVariation;

  audio.currentTime = 0;
  audio.play();
};

const sfxBaseURL = '/audio/game/sfx/';

export const jumpSfx = [
  `${sfxBaseURL}1. Jumping/jump1.wav`,
  `${sfxBaseURL}1. Jumping/jump2.wav`,
  `${sfxBaseURL}1. Jumping/jump3.wav`,  
];

export const landSfx = [
  `${sfxBaseURL}2. Landing/land1.wav`,
  `${sfxBaseURL}2. Landing/land2.wav`,
  `${sfxBaseURL}2. Landing/land3.wav`,
  `${sfxBaseURL}2. Landing/land4.wav`,
  `${sfxBaseURL}2. Landing/land5.wav`,
  `${sfxBaseURL}2. Landing/land6.wav`,
];

export const dyingSfx = [
  `${sfxBaseURL}3. Dying/dying1.wav`,
  `${sfxBaseURL}3. Dying/dying2.wav`,
  `${sfxBaseURL}3. Dying/dying3.wav`,
  `${sfxBaseURL}3. Dying/dying4.wav`,
];