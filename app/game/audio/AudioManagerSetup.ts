import AudioManager from "@/app/game/audio/AudioManager";
import { MutableRefObject } from "react";

export const setupAudioManager = (
  audioRef: MutableRefObject<HTMLAudioElement | null>, 
  audioType: 'normal' | '8bit'
): AudioManager => {
  return new AudioManager(audioRef, audioType);
};