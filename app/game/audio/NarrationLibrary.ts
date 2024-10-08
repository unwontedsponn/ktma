// NarrationLibrary.ts
const narrationBaseURL = '/audio/game/narration/';

export const narration = [
  `${narrationBaseURL}0.mp3`,
  `${narrationBaseURL}1.mp3`,
  `${narrationBaseURL}2.mp3`,
  `${narrationBaseURL}3.mp3`,
  `${narrationBaseURL}4.mp3`,
  `${narrationBaseURL}5.mp3`,
  `${narrationBaseURL}6.mp3`,
  `${narrationBaseURL}7.mp3`,
  `${narrationBaseURL}8.mp3`,
  `${narrationBaseURL}9.mp3`,
  `${narrationBaseURL}10.mp3`,
  `${narrationBaseURL}11.mp3`,
  `${narrationBaseURL}12.mp3`,
  `${narrationBaseURL}13.mp3`,
  `${narrationBaseURL}14.mp3`,
  `${narrationBaseURL}15.mp3`,
  `${narrationBaseURL}16.mp3`
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
  preloadAudioFiles(narration);
}