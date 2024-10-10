// MusicLibrary.ts
export const musicSections: number[] = [
  0,    // 00:00
  9,    // 00:09
  33,   // 00:33
  50,   // 00:50
  71,   // 01:11
  88,   // 01:28
  104,  // 01:44
  121,  // 02:01
  140,  // 02:20
  157,  // 02:37
  173,  // 02:53
  190,  // 03:10
  207,  // 03:27
  228   // 03:48
];

export const preloadMusicTracks = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  const musicTracks = [
    '/audio/game/All_Change.wav',
    '/audio/game/All Change 8-BIT.wav',
  ];

  const loadTrack = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => resolve(), { once: true });
      audio.addEventListener('error', () => reject(new Error(`Failed to load: ${src}`)), { once: true });
    });
  };

  try {
    // Preload both tracks
    await Promise.all(musicTracks.map((src) => loadTrack(src)));
    console.log('Both tracks are preloaded!');
    // Now you can safely start the game
  } catch (error) {
    console.error('Error preloading tracks:', error);
  }
};

// Call this function only in a browser environment
if (typeof window !== "undefined") preloadMusicTracks();