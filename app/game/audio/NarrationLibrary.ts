// NarrationLibrary.ts
const narrationBaseURL = '/audio/game/narration/';

export const narration = [
  { src: `${narrationBaseURL}1.mp3`, text: "Oooohh... this is inspired!" },
  { src: `${narrationBaseURL}2.mp3`, text: "Let's go, the creative juices are flowing" },
  { src: `${narrationBaseURL}3.mp3`, text: "Ready, set, go. Today's the day we compose a great work, maybe, the greatest" },
  { src: `${narrationBaseURL}4.mp3`, text: "Ooooohh, tasty! That's sounding sweet!" },
  { src: `${narrationBaseURL}5.mp3`, text: "Mmmmmmmm... so pleasing to the ear" },
  { src: `${narrationBaseURL}6.mp3`, text: "What an earworm... hooky" },
  { src: `${narrationBaseURL}7.mp3`, text: "Alrighty, heeerre we go. It's time to start creating this masterpiece. Yeah baby!" },
  { src: `${narrationBaseURL}8.mp3`, text: "Look out world, here I come... Roll over Beethoven. Mmmmm, yes!" },
  { src: `${narrationBaseURL}9.mp3`, text: "Take that mum and dad... didn't think I had it in me did you. Hah!" },
  { src: `${narrationBaseURL}10.mp3`, text: "To the naysayers, listen and weep. Mozart... who? Bach... what? " },
  { src: `${narrationBaseURL}11.mp3`, text: "I hope you like caviar Freckles.... meow! It's time for fame and fortune." },
  { src: `${narrationBaseURL}12.mp3`, text: "We're going to the top Freckles... Meow... We'll be known the world over. " },
  { src: `${narrationBaseURL}13.mp3`, text: "Hey, Freckles... I'm a genius!" },
  { src: `${narrationBaseURL}14.mp3`, text: "Damn... this is easy... a black key, a white key... add a touch of... bass?" },
  { src: `${narrationBaseURL}15.mp3`, text: "Being a composer is effortless... the chords just come to me... I'm in flow!" },
  { src: `${narrationBaseURL}16.mp3`, text: "So simple, a sharp here, a flat here... this piece just writes itself!" },
];

// Preload all audio files
export const preloadAudioFiles = (narrationArray: { src: string, text: string }[]) => {
  if (typeof window !== "undefined") {
    narrationArray.forEach(({ src }) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
    });
  }  
};

// Call this function only in a browser environment
if (typeof window !== "undefined") {
  preloadAudioFiles(narration);
}