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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      // Remove event listener from previous audio element
      audioRef.current.removeEventListener('ended', handleSongEnd);
      audioRef.current.pause();
    }

    const newAudio = new Audio(`/audio/green-and-pine/${songs[currentSongIndex].file}`);
    newAudio.volume = 0.5;
    audioRef.current = newAudio;

    if (isPlaying) newAudio.play();

    // Event listener for when the song ends
    newAudio.addEventListener('ended', handleSongEnd);

    return () => {
      newAudio.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSongIndex]);

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

  return (
    <div id="footer" className="fixed inset-x-0 bottom-0 flex justify-center items-center pb-4">
      <div className="max-w-screen-md flex justify-between items-center text-xs font-gopher-mono border-t-2 border-custom-border-color pt-2 py-2">
        <div id="green-and-pine-footer" className="px-4 md:px-14 border-r-2 border-custom-border-color">
          <span className={isPlaying ? 'flashing-text' : ''}>{responsiveText}</span>
        </div>
        <div className="flex space-x-4 md:space-x-6 px-4 md:px-14">
          <button onClick={togglePlayPause} className="footer-buttons">
            {isPlaying ? 'pause' : 'play'}
          </button>
          {isPlaying && (
            <button onClick={skipToNext} className="footer-buttons">
              next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
