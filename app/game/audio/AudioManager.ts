import { CheckpointLine } from "../entities/CheckpointLine";
import { musicSections } from "./MusicLibrary";
import { checkpointSfx } from "@/app/game/audio/SfxLibrary";

type MusicType = 'normal' | '8bit';
type SfxType = 'jump' | 'land' | 'dying' | 'checkpoint' | 'token';

class AudioManager {
  private audioRef: React.RefObject<HTMLAudioElement>;
  private audioType: MusicType;
  private mixer = {
    music: { normal: 0.3, '8bit': 0.2 },
    sfx: { jump: 0.3, land: 0.2, dying: 0.5, checkpoint: 0.5, token: 0.5 },
  };
  private lineAddedForSection: number | null = null;

  constructor(audioRef: React.RefObject<HTMLAudioElement>) {
    this.audioRef = audioRef;
    this.audioType = 'normal'; // Set initial type

    // Set the initial volume for the audio element
    if (audioRef.current) {
      audioRef.current.volume = this.getVolume('music', this.audioType);
    } 
  }

  // New method to fade the volume
  crossFadeMusic(
    audioRef: React.RefObject<HTMLAudioElement>,
    newType: 'normal' | '8bit',
    setAudioType: (type: 'normal' | '8bit') => void,
    duration: number
  ) {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const initialVolume = audio.volume;
    const targetVolume = this.getVolume('music', newType);
    const step = Math.abs(initialVolume - targetVolume) / (duration / 50); // Ensure step is positive
  
    // Create a new audio element for the new track
    const newAudio = new Audio(newType === 'normal' ? '/audio/game/All_Change.wav' : '/audio/game/All Change 8-BIT.wav');
    newAudio.volume = 0; // Start with volume 0
    newAudio.currentTime = audio.currentTime;
    newAudio.play();
  
    // Crossfade both tracks over the specified duration
    let interval = setInterval(() => {
      // Fade out the current track
      if (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - step, 0); // Ensure volume doesn't go below 0
      }
  
      // Fade in the new track
      if (newAudio.volume < targetVolume) {
        newAudio.volume = Math.min(newAudio.volume + step, targetVolume); // Ensure volume doesn't go above target
      }
  
      // Stop crossfading when both fade-in and fade-out are complete
      if (audio.volume <= 0 && newAudio.volume >= targetVolume) {
        clearInterval(interval);
        audio.pause();
        audio.src = newAudio.src; // Set the audioRef to the new track
        audio.volume = targetVolume; // Set final volume
        setAudioType(newType);
      }
    }, 50); // Adjust interval duration for smoother transitions
  }  

  switchMusic(
    audioRef: React.RefObject<HTMLAudioElement>,
    currentTime: number,
    newType: 'normal' | '8bit',
    setAudioType: (type: 'normal' | '8bit') => void
  ) {
    if (!audioRef.current) return;
  
    const audio = audioRef.current;
    const src = newType === 'normal' ? '/audio/game/All_Change.wav' : '/audio/game/All Change 8-BIT.wav';
    const volume = this.getVolume('music', newType);
  
    audio.pause();
    audio.src = src;
    audio.volume = volume;
    audio.currentTime = currentTime;
    audio.play();
  
    setAudioType(newType);
  }
  

  playRandomSfx(srcArray: string[], type: SfxType) {
    const randomIndex = Math.floor(Math.random() * srcArray.length);
    const audio = new Audio(srcArray[randomIndex]);
    audio.volume = this.getVolume('sfx', type);
    audio.playbackRate = 0.9 + Math.random() * 0.2; // Random playback rate
    audio.play();
  }

  setVolume(type: 'music' | 'sfx', key: MusicType | SfxType, volume: number) {
    if (type === 'music' && key in this.mixer.music) {
      this.mixer.music[key as MusicType] = volume;
    } else if (type === 'sfx' && key in this.mixer.sfx) {
      this.mixer.sfx[key as SfxType] = volume;
    }
  }

  getVolume(type: 'music' | 'sfx', key: MusicType | SfxType): number {
    if (type === 'music' && key in this.mixer.music) {
      return this.mixer.music[key as MusicType];
    } else if (type === 'sfx' && key in this.mixer.sfx) {
      return this.mixer.sfx[key as SfxType];
    }
    return 1.0; // Default volume if no key matches
  }

  checkMusicSection(currentTime: number, checkpointLines: CheckpointLine[], canvasWidth: number, canvasHeight: number) {
    const upcomingSection = musicSections.find(
      section => section - currentTime <= 1 && section - currentTime > 0
    );

    if (upcomingSection && this.lineAddedForSection !== upcomingSection) {
      // Add a checkpoint line and play the SFX
      checkpointLines.push(CheckpointLine.createCheckpointLine(canvasWidth, canvasHeight));
      this.playRandomSfx(checkpointSfx, 'checkpoint');

      // Set the flag to the current section
      this.lineAddedForSection = upcomingSection;
    }

    // Optionally reset the flag when a section is far enough behind
    if (upcomingSection === undefined) this.lineAddedForSection = null;
  }
}

export default AudioManager;
