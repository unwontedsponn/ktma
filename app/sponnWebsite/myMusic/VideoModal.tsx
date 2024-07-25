import React, { useEffect } from 'react';

interface VideoModalProps {
  onClose: () => void;
  videoId: string | null;
}

const VideoModal: React.FC<VideoModalProps> = ({ onClose, videoId }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 shadow-lg max-w-2xl w-full">
        <button onClick={onClose} className="absolute top--2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold z-10">
          &times;
        </button>
        <div className="w-full h-0 pb-[56.25%] relative">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
