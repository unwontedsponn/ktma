// AudioManagerSetup.ts
import AudioManager from "@/app/game/audio/AudioManager";
import { MutableRefObject } from "react";

export const setupAudioManager = (audioRef: MutableRefObject<HTMLAudioElement | null>): AudioManager => {
  return new AudioManager(audioRef);
};
