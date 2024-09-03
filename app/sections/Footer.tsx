"use client"
import React, { useEffect, useState, useRef } from 'react';

type Song = {
  id: number;
  title: string;
  file: string;
};

const songs: Song[] = [
  { id: 0, title: 'Room of My Own', file: 'Room Of My Own.wav' },
  { id: 1, title: 'Ra Ma', file: 'Ra Ma.wav' },
  { id: 2, title: 'Nature Show', file: 'Nature Show.wav' },
  { id: 3, title: 'I Can\'t Sleep', file: 'I Can\'t Sleep.wav' },
];

const Footer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [responsiveText, setResponsiveText] = useState<string>('listen to green and pine');
  const [volume, setVolume] = useState<number>(0.5); // State for volume
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newAudio = new Audio(`/audio/green-and-pine/${songs[currentSongIndex].file}`);
    newAudio.volume = volume; // Set initial volume
    audioRef.current = newAudio;

    if (isPlaying) newAudio.play();

    // Event listener for when the song ends
    newAudio.addEventListener('ended', handleSongEnd);

    return () => {
      newAudio.removeEventListener('ended', handleSongEnd);
      newAudio.pause();
    };
  }, [currentSongIndex, isPlaying, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play(); 
    else audioRef.current?.pause();    
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      setResponsiveText(songs[currentSongIndex].title);
    } else {
      setResponsiveText('listen to green and pine');
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    const adjustFooterHeight = () => {
      const footerHeight = document.querySelector<HTMLDivElement>('#footer')?.offsetHeight || 0;
      document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    };
    adjustFooterHeight(); // Call initially and on resize
    window.addEventListener('resize', adjustFooterHeight);
    return () => window.removeEventListener('resize', adjustFooterHeight);
  }, []);

  const handleSongEnd = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      setIsPlaying(!isPlaying);
    }
  };

  const skipToNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div id="footer" className="fixed inset-x-0 bottom-0 flex items-center justify-center pb-4">
      <div className="flex items-center justify-between max-w-screen-md py-2 text-xs font-gopher-mono border-t-2 border-custom-border-color">
        <div id="green-and-pine-footer" className="border-r-2 border-custom-border-color px-4 md:px-14">
          <span className={isPlaying ? 'flashing-text' : ''}>{responsiveText}</span>
        </div>
        <div className="flex items-center px-4 md:px-14 space-x-4 md:space-x-6">
          <button onClick={togglePlayPause} className="footer-buttons">
            {isPlaying ? 'pause' : 'play'}
          </button>
          {isPlaying && (
            <button onClick={skipToNext} className="footer-buttons">
              next
            </button>
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="footer-volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
