// AudioManager.ts
import { CheckpointLine } from "../entities/CheckpointLine";
import { musicSections } from "./MusicLibrary";
import { checkpointSfx } from "@/app/game/audio/SfxLibrary";
import { narration } from "./NarrationLibrary";

type MusicType = 'normal' | '8bit';
type SfxType = 'jump' | 'land' | 'dying' | 'checkpoint' | 'token';
type NarrationType = 'narration';

class AudioManager {
  public audioRef: React.RefObject<HTMLAudioElement>;
  private currentNarration: HTMLAudioElement | null = null;
  private audioType: MusicType;
  private originalMusicVolume: number | null = null;
  private originalSfxVolumes: { [key in SfxType]?: number } = {};
  private mixer = {
    music: { normal: 0.3, '8bit': 0.2 },
    sfx: { jump: 0.3, land: 0.2, dying: 0.5, checkpoint: 0.5, token: 0.5 },
    narration: { narration: 0.6 }
  };
  private lineAddedForSection: number | null = null;

  constructor(audioRef: React.RefObject<HTMLAudioElement>) {
    this.audioRef = audioRef;
    this.audioType = 'normal'; // Set initial type

    if (audioRef.current) {
      audioRef.current.volume = this.getVolume('music', this.audioType);
    }
  }

  switchMusic(
    audioRef: React.RefObject<HTMLAudioElement>,
    currentTime: number,
    newType: MusicType,
    setAudioType: (type: MusicType) => void
  ) {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const src = newType === 'normal' ? '/audio/game/All_Change.mp3' : '/audio/game/All Change 8-BIT.mp3';
    const volume = this.getVolume('music', newType);

    audio.pause();
    audio.src = src;
    audio.volume = volume;
    audio.currentTime = currentTime;
    audio.play();

    setAudioType(newType);
  }

  // Reduce the volume of music and SFX when narration starts
  duckVolumes() {
    if (this.originalMusicVolume === null && this.audioRef.current) {
      this.originalMusicVolume = this.audioRef.current.volume;
      this.audioRef.current.volume *= 0.3; // Reduce music volume to 30% of its current level
    }

    Object.keys(this.mixer.sfx).forEach((key) => {
      const sfxKey = key as SfxType;
      if (!this.originalSfxVolumes[sfxKey]) {
        this.originalSfxVolumes[sfxKey] = this.mixer.sfx[sfxKey];
        this.setVolume('sfx', sfxKey, this.mixer.sfx[sfxKey] * 0.3); // Reduce SFX volume to 30%
      }
    });
  }

  // Restore the original volumes after narration ends
  restoreVolumes() {
    if (this.originalMusicVolume !== null && this.audioRef.current) {
      this.audioRef.current.volume = this.originalMusicVolume;
      this.originalMusicVolume = null;
    }

    Object.keys(this.originalSfxVolumes).forEach((key) => {
      const sfxKey = key as SfxType;
      if (this.originalSfxVolumes[sfxKey]) {
        this.setVolume('sfx', sfxKey, this.originalSfxVolumes[sfxKey]!); // Restore original SFX volume
        delete this.originalSfxVolumes[sfxKey];
      }
    });
  }

  // Modified playRandomAudio to handle ducking for narration
  playRandomAudio(srcArray: string[], type: SfxType | NarrationType, isNarration: boolean = false) {
    const randomIndex = Math.floor(Math.random() * srcArray.length);
    const audio = new Audio(srcArray[randomIndex]);
    audio.volume = this.getVolume(isNarration ? 'narration' : 'sfx', type);
  
    // Stop any existing narration if it's already playing
    if (isNarration && this.currentNarration) {
      this.currentNarration.pause();
      this.currentNarration.currentTime = 0; // Reset the previous narration
    }
  
    // Apply ducking if narration is being played
    if (isNarration) {
      this.duckVolumes();
      this.currentNarration = audio; // Set currentNarration to track the audio instance
  
      audio.onended = () => {
        this.restoreVolumes();
        this.currentNarration = null; // Clear reference when narration ends
      };
    }
  
    audio.playbackRate = isNarration ? 1.0 : 0.9 + Math.random() * 0.2; // Fixed playback rate for narration
    audio.play();
  }  

  playRandomSfx(srcArray: string[], type: SfxType) {this.playRandomAudio(srcArray, type, false);}
  playRandomNarration(srcArray: string[], delay: number = 1000) { // Delay in milliseconds, default is 1000ms (1 second)
    setTimeout(() => {
      this.playRandomAudio(srcArray, 'narration', true);
    }, delay);
  }

  pauseNarration() {
    if (this.currentNarration && !this.currentNarration.paused) {
      this.currentNarration.pause();
    }
  }  

  setVolume(type: 'music' | 'sfx' | 'narration', key: MusicType | SfxType | NarrationType, volume: number) {
    if (type === 'music' && key in this.mixer.music) this.mixer.music[key as MusicType] = volume;
    else if (type === 'sfx' && key in this.mixer.sfx) this.mixer.sfx[key as SfxType] = volume;
    else if (type === 'narration' && key in this.mixer.narration) this.mixer.narration[key as NarrationType] = volume;
  }

  getVolume(type: 'music' | 'sfx' | 'narration', key: MusicType | SfxType | NarrationType): number {
    if (type === 'music' && key in this.mixer.music) return this.mixer.music[key as MusicType];
    else if (type === 'sfx' && key in this.mixer.sfx) return this.mixer.sfx[key as SfxType];
    else if (type === 'narration' && key in this.mixer.narration) return this.mixer.narration[key as NarrationType];
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
      this.playRandomNarration(narration);

      this.lineAddedForSection = upcomingSection;
    }

    if (upcomingSection === undefined) this.lineAddedForSection = null;
  }
}

export default AudioManager;
