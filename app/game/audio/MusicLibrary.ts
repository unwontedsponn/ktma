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

export const preloadMusicTracks = () => {
  if (typeof window !== "undefined") {
    const musicTracks = [
      '/audio/game/All_Change.wav',
      '/audio/game/All Change 8-BIT.wav',
    ];

    musicTracks.forEach((src) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
    });
  }
};

// Call this function only in a browser environment
if (typeof window !== "undefined") preloadMusicTracks();