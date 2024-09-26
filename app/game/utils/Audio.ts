// Audio.ts
import { CheckpointLine, createCheckpointLine } from "../entities/CheckpointLine";


/**
 * Functions
 * ******************************************************************************************
*/
export const switchMusic = (
  audioRef: React.RefObject<HTMLAudioElement>, 
  currentTime: number,  
  audioType: 'normal' | '8bit',
  setAudioType: (type: 'normal' | '8bit') => void
) => {
  if (!audioRef?.current) return;

  const audio = audioRef.current;
  
  const src = audioType === 'normal' 
  ? '/audio/game/All_Change.wav' 
  : '/audio/game/All Change 8-BIT.wav';

  const volume = AudioMixer.getVolume('music', audioType);  // Get the volume from the mixer

  audio.pause();
  audio.src = src;
  audio.volume = volume;
  audio.currentTime = currentTime;
  audio.play();

  setAudioType(audioType);
};



let lineAddedForSection: number | null = null; // Keeps track of the section where a line was added

export const checkMusicSection = (
  currentTime: number,
  checkpointLines: CheckpointLine[],
  canvasWidth: number,
  canvasHeight: number
) => {
  const upcomingSection = musicSections.find(
    section => section - currentTime <= 1 && section - currentTime > 0
  );
  
  if (upcomingSection && lineAddedForSection !== upcomingSection) {
    // Only add a line if one hasn't been added for this section
    checkpointLines.push(createCheckpointLine(canvasWidth, canvasHeight));
    playRandomSfx(checkpointSfx, 'checkpoint');

    // Set the flag to the current section
    lineAddedForSection = upcomingSection;
  }

  // Optionally reset the flag when a section is far enough behind
  if (upcomingSection === undefined) lineAddedForSection = null;
};

// Play sound effect with random selection and slight pitch variation
export const playRandomSfx = (srcArray: string[], type: keyof typeof AudioMixer['sfx']) => {
  const randomIndex = Math.floor(Math.random() * srcArray.length);
  const audio = new Audio(srcArray[randomIndex]);

  const volume = AudioMixer.getVolume('sfx', type);  // Get the volume from the mixer
  audio.volume = volume;
  
  // Apply slight random pitch variation (playbackRate)
  const pitchVariation = 0.9 + Math.random() * 0.2; // Random playback rate between 0.9 and 1.1
  audio.playbackRate = pitchVariation;

  audio.currentTime = 0;
  audio.play();
};


/**
 * Audio Mixer
 * ******************************************************************************************
*/
type MusicType = 'normal' | '8bit';
type SfxType = 'jump'| 'land' | 'dying' | 'checkpoint' | 'token';

export const AudioMixer = {
  music: {
    normal: 0.4,
    '8bit': 0.3,
  },
  sfx: {
    jump: 0.3,    
    land: 0.2,
    dying: 0.5,
    checkpoint: 0.5,
    token: 0.5,
  },

  // Set volume for either music or sfx
  setVolume(type: 'music' | 'sfx', key: MusicType | SfxType, volume: number) {
    if (type === 'music' && key in this.music) this.music[key as MusicType] = volume;
    else if (type === 'sfx' && key in this.sfx) this.sfx[key as SfxType] = volume;
  },

  // Get volume for either music or sfx
  getVolume(type: 'music' | 'sfx', key: MusicType | SfxType): number {
    if (type === 'music' && key in this.music) return this.music[key as MusicType];
    else if (type === 'sfx' && key in this.sfx) return this.sfx[key as SfxType];
    return 1.0; // Default to 1.0 if no key matches
  }
};

/**
 * Music
 * ******************************************************************************************
*/
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

/**
 * SFX
 * ******************************************************************************************
*/
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