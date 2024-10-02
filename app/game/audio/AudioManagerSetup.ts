import AudioManager from "@/app/game/audio/AudioManager";
import { MutableRefObject } from "react";

export const setupAudioManager = (
  audioRef: MutableRefObject<HTMLAudioElement | null>, 
  audioType: 'normal' | '8bit'
): AudioManager => {
  if (!audioRef.current) {
    console.error('Audio element is not available.');
    // Return a default AudioManager to avoid null issues
    return new AudioManager(audioRef, audioType);
  }

  try {
    const audioManager = new AudioManager(audioRef, audioType);
    return audioManager;
  } catch (error) {
    console.error('Failed to initialize audioManager:', error);
    // Return a default AudioManager in case of an error
    return new AudioManager(audioRef, audioType);
  }
};
