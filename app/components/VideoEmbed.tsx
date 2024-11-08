// VideoEmbed.tsx
import React from 'react';

interface VideoEmbedProps {
  src: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ src }) => (
  <div className="video-container">
    <iframe
      width="560"
      height="315"
      src={src}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

export default VideoEmbed;
