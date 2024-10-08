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
  private audioType: MusicType;
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

  playRandomAudio(srcArray: string[], type: SfxType | NarrationType, isNarration: boolean = false) {
    const randomIndex = Math.floor(Math.random() * srcArray.length);
    const audio = new Audio(srcArray[randomIndex]);
    audio.volume = this.getVolume(isNarration ? 'narration' : 'sfx', type);
    audio.playbackRate = isNarration ? 1.0 : 0.9 + Math.random() * 0.2; // Fixed playback rate for narration
    audio.play();
  }

  playRandomSfx(srcArray: string[], type: SfxType) {
    this.playRandomAudio(srcArray, type, false);
  }

  playRandomNarration(srcArray: string[]) {
    this.playRandomAudio(srcArray, 'narration', true);
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
