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
  public currentNarrationText: string | null = null;
  public currentTypedText: string = ''; // The text being typed letter by letter
  private charIndex: number = 0; // Current character index

  public textOpacity: number = 1.0; // Opacity for fading text
  private fadeOutDuration: number = 3000; // Duration to fade out in milliseconds
  private fadeStartTime: number | null = null; // Track when to start fading out
  private opacityFadeDelay: number = 3000;

  private audioType: MusicType;
  private originalMusicVolume: number | null = null;
  private originalSfxVolumes: { [key in SfxType]?: number } = {};

  private availableNarrations: { src: string, text: string }[] = []; // List of available narrations
  private playedNarrations: { src: string, text: string }[] = []; // List of played narrations
  private isFirstNarrationPlayed: boolean = false;

  private mixer = {
    music: { normal: 0.3, '8bit': 0.2 },
    sfx: { jump: 0.3, land: 0.2, dying: 0.5, checkpoint: 0.5, token: 0.5 },
    narration: { narration: 0.6 }
  };
  private lineAddedForSection: number | null = null;

  constructor(audioRef: React.RefObject<HTMLAudioElement>, narrationArray: { src: string, text: string }[]) {
    this.audioRef = audioRef;
    this.audioType = 'normal'; // Set initial type

    if (audioRef.current) {
      audioRef.current.volume = this.getVolume('music', this.audioType);
    }

    this.availableNarrations = [...narrationArray]; // Initialize available narrations
    this.playedNarrations = []; // Start with an empty list of played narrations
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

  pauseNarration() {
    if (this.currentNarration && !this.currentNarration.paused) {
      this.currentNarration.pause();
    }
  }  

  // Method to clear the text (if you want to hide it after some time)
  clearNarrationText() {
    this.currentNarrationText = null;
  }

  // Reset typing effect when new narration starts
  startTypingEffect(text: string) {
    this.clearTypedText();
    this.currentNarrationText = text;
    this.currentTypedText = '';
    this.charIndex = 0;
    this.textOpacity = 1.0; // Reset opacity to fully visible
    this.fadeStartTime = null; // Don't start fading until after text is fully typed    
  }

  // Progress the typing effect by one letter
  typeNextLetter() {
    if (this.currentNarrationText && this.charIndex < this.currentNarrationText.length) {
      this.currentTypedText += this.currentNarrationText[this.charIndex];
      this.charIndex++;
      // Start fade timer only when typing is fully complete
      if (this.charIndex >= this.currentNarrationText.length) {
        this.fadeStartTime = performance.now(); // Trigger fade after text is fully typed
      }
    }
  }

  // Start the fade-out process after a delay
  startFadeOut() {
    this.fadeStartTime = performance.now(); // Record the time when fading starts
  }

  // Update the opacity of the text over time
  updateTextOpacity(currentTime: number) {
    if (this.fadeStartTime && currentTime - this.fadeStartTime > this.opacityFadeDelay) {
      const elapsed = currentTime - this.fadeStartTime - this.opacityFadeDelay;
      this.textOpacity = Math.max(1 - elapsed / this.fadeOutDuration, 0); // Fade out opacity to 0
    }
  }

  // Clear the current text when the narration ends
  clearTypedText() {
    this.currentTypedText = ''; 
    this.currentNarrationText = null;
    this.charIndex = 0; // Reset char index
    this.textOpacity = 1.0;
  }

  // Select and play a random narration that hasn't been played yet
  playRandomNarration(delay: number = 1000) {
    // If all narrations have been played, reset the available list
    if (this.availableNarrations.length === 0) {
      this.resetNarrations();
    }
    
    // Play the first narration if it hasn't been played yet
    if (!this.isFirstNarrationPlayed) {
      const firstNarration = this.availableNarrations[0]; // Select the first one
      this.isFirstNarrationPlayed = true; // Set flag that the first narration is played
      this.availableNarrations.splice(0, 1); // Remove it from available narrations

      this.clearTypedText();

      setTimeout(() => {
        this.playRandomAudio([firstNarration.src], 'narration', true);
        this.startTypingEffect(firstNarration.text); // Store the selected text
      }, delay);
    } else {      

      // Select a random narration from the available narrations
      const randomIndex = Math.floor(Math.random() * this.availableNarrations.length);
      const selectedNarration = this.availableNarrations[randomIndex];

      // Remove the selected narration from the available list and add it to the played list
      this.availableNarrations.splice(randomIndex, 1); // Remove from available
      this.playedNarrations.push(selectedNarration); // Add to played

      this.clearTypedText();

      setTimeout(() => {
        this.playRandomAudio([selectedNarration.src], 'narration', true);
        this.startTypingEffect(selectedNarration.text); // Store the selected text
      }, delay);
    }
  }

  // Reset the narration pool when all narrations have been played
  resetNarrations() {
    this.availableNarrations = [...this.playedNarrations]; // Move played narrations back to available
    this.playedNarrations = []; // Reset played narrations list
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
      this.playRandomNarration();

      this.lineAddedForSection = upcomingSection;
    }

    if (upcomingSection === undefined) this.lineAddedForSection = null;
  }
}

export default AudioManager;
