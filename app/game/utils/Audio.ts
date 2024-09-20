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

// Play sound effect
export const playSfx = (src: string, volume: number = 1.0) => {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.currentTime = 0;
  audio.play();
};
