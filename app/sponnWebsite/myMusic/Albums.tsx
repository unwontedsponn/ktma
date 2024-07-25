import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import Breadcrumb from '@/app/components/Breadcrumb';
import VideoModal from './VideoModal';

interface Track {
  url: string;
  title: string;
}

interface Transcription {
  src: string;
  title: string;
}

interface Media {
  src: string;
  title: string;
}

interface Album {
  src: string;
  alt: string;
  title: string;
  albumType: string;
  summary: string;
  tracks: Track[];
  transcription?: Transcription[] | false;
  shortFilm?: Media[] | false;
  game?: Media[] | false;
}

interface AlbumsProps {
  currentAlbumIndex: number;
  setCurrentAlbumIndex: React.Dispatch<React.SetStateAction<number>>;
  albums: Album[];
  className?: string;
  setActiveView: React.Dispatch<React.SetStateAction<string>>;
  activeView: string;
}

const Albums: React.FC<AlbumsProps> = ({ currentAlbumIndex, setCurrentAlbumIndex, albums, className, setActiveView, activeView }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentAlbum = albums[currentAlbumIndex];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create Audio object only on the client side
      audioRef.current = new Audio();
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsModalOpen(false);
    setCurrentTrack(null);
    setIsPlaying(false);
    setActiveView('listen'); // Reset to the default view
  };

  const togglePlayPause = (track: Track) => {
    if (audioRef.current) {
      if (currentTrack === track) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setIsPlaying(true);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.addEventListener('pause', handlePause);
      audioRef.current.addEventListener('play', handlePlay);

      // Set initial volume
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('play', handlePlay);
      }
    };
  }, [volume]);

  const openVideoModal = (videoId: string) => {
    setCurrentVideoId(videoId);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoId(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`relative group border-3 border-thick-border-gray cursor-pointer overflow-hidden ${className}`}
        onClick={openModal}
      >
        <Image
          src={currentAlbum.src}
          alt={currentAlbum.alt}
          width={500}
          height={500}
          objectFit="cover"
          className={`transition-transform duration-300 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col">
          <p className="text-white text-5xl font-gopher-mono">{`Listen Now`}</p>
        </div>
      </div>

      <Breadcrumb
        currentIndex={currentAlbumIndex}
        itemCount={albums.length}
        onBreadcrumbClick={(index) => {
          setCurrentAlbumIndex(index);
          setActiveView('listen'); // Reset to the default view
        }}
      />

      {isModalOpen && currentAlbum && (
        <Modal onClose={closeModal}>
          <div className="flex justify-center space-x-4 pb-4">
            <button
              onClick={() => setActiveView('listen')}
              className={`text-sm px-4 py-2 font-gopher-mono ${activeView === 'listen' ? 'outline bg-white text-black' : 'bg-black text-white hover:bg-white hover:outline hover:text-black'}`}
            >
              Tracks
            </button>
            {currentAlbum.transcription && currentAlbum.transcription.length > 0 && (
              <button
                onClick={() => setActiveView('transcriptions')}
                className={`text-sm px-4 py-2 font-gopher-mono ${activeView === 'transcriptions' ? 'outline bg-white text-black' : 'bg-black text-white hover:bg-white hover:outline hover:text-black'}`}
              >
                Transcriptions
              </button>
            )}
            {currentAlbum.shortFilm && currentAlbum.shortFilm.length > 0 && (
              <button
                onClick={() => setActiveView('shortFilms')}
                className={`text-sm px-4 py-2 font-gopher-mono ${activeView === 'shortFilms' ? 'outline bg-white text-black' : 'bg-black text-white hover:bg-white hover:outline hover:text-black'}`}
              >
                Short Films
              </button>
            )}
            {currentAlbum.game && currentAlbum.game.length > 0 && (
              <button
                onClick={() => setActiveView('games')}
                className={`text-sm px-4 py-2 font-gopher-mono ${activeView === 'games' ? 'outline bg-white text-black' : 'bg-black text-white hover:bg-white hover:outline hover:text-black'}`}
              >
                Games
              </button>
            )}
          </div>
          <div className="p-4 flex">
            <div className="flex-shrink-0 w-64">
              <Image
                src={currentAlbum.src}
                alt={currentAlbum.alt}
                width={256}
                height={256}
                objectFit="cover"
                className="border-3 border-thick-border-gray"
              />
            </div>
            <div className="flex-1 pl-4">
              <h2 className="text-2xl font-bold mt-4">{currentAlbum.title}</h2>
              <h3 className="text-sm font-bold mb-4">{currentAlbum.albumType}</h3>

              {/* Listen to the Music Tracks */}
              {activeView === 'listen' && (
                <div className="overflow-y-auto" style={{ maxHeight: '11rem' }}>
                  {currentAlbum.tracks.map((track, index) => (
                    <div key={index} className="my-2 flex items-center justify-between">
                      <h3 className="text-lg">{`- ${track.title}`}</h3>
                      <button
                        onClick={() => togglePlayPause(track)}
                        className="text-xs bg-black text-white px-4 py-2 hover:bg-white hover:outline hover:text-black font-gopher-mono mr-2"
                      >
                        {currentTrack === track && isPlaying ? 'pause' : 'play'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Watch the Transcriptions */}
              {activeView === 'transcriptions' && currentAlbum.transcription && (
                <div className="overflow-y-auto" style={{ maxHeight: '10rem' }}>
                  {Array.isArray(currentAlbum.transcription) &&
                    currentAlbum.transcription.map((transcription, index) => (
                      <div key={index} className="my-2 flex items-center justify-between">
                        <h3 className="text-lg">{`- ${transcription.title}`}</h3>
                        <button
                          onClick={() => openVideoModal(transcription.src.split('v=')[1].split('&')[0])}
                          className="mr-2 text-xs bg-black text-white px-4 py-2 hover:bg-white hover:outline hover:text-black font-gopher-mono mr-2"
                        >
                          Watch Video
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {/* Watch the Short Films */}
              {activeView === 'shortFilms' && currentAlbum.shortFilm && (
                <div className="overflow-y-auto" style={{ maxHeight: '10rem' }}>
                  {Array.isArray(currentAlbum.shortFilm) &&
                    currentAlbum.shortFilm.map((shortFilm, index) => (
                      <div key={index} className="my-2 flex items-center justify-between">
                        <h3 className="text-lg">{`- ${shortFilm.title}`}</h3>
                        <button
                          onClick={() => openVideoModal(shortFilm.src.split('v=')[1].split('&')[0])}
                          className="mr-2 text-xs bg-black text-white px-4 py-2 hover:bg-white hover:outline hover:text-black font-gopher-mono mr-2"
                        >
                          Watch Video
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {/* Play the Game */}
              {activeView === 'games' && currentAlbum.game && (
                <div className="overflow-y-auto" style={{ maxHeight: '10rem' }}>
                  {Array.isArray(currentAlbum.game) &&
                    currentAlbum.game.map((game, index) => (
                      <div key={index} className="my-2 flex items-center justify-between">
                        <h3 className="text-lg">{`- ${game.title}`}</h3>
                        <button
                          onClick={() => {
                            console.log(`Opening game URL: ${game.src}`);
                            window.open(game.src, '_blank');
                          }}
                          className="mr-2 text-xs bg-black text-white px-4 py-2 hover:bg-white hover:outline hover:text-black font-gopher-mono mr-2"
                        >
                          Play Game
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <Breadcrumb
            currentIndex={currentAlbumIndex}
            itemCount={albums.length}
            onBreadcrumbClick={(index) => {
              setCurrentAlbumIndex(index);
              setActiveView('listen'); // Reset to the default view
            }}
          />
        </Modal>
      )}

      {isVideoModalOpen && (
        <VideoModal
          videoId={currentVideoId}
          onClose={closeVideoModal}
        />
      )}
    </div>
  );
};

export default Albums;