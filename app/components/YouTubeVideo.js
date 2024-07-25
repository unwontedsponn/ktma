import YouTube from 'react-youtube';

export default function YouTubeVideo({ id, height = '390', width = '640' }) {
  const opts = {
    height: height, 
    width: width,  
    playerVars: {
      autoplay: 0,
    },
  };

  // Responsive container with Tailwind CSS
  return (
    <div className={`border-3 border-thick-border-gray flex justify-center items-center overflow-hidden`}>
        <YouTube videoId={id} opts={opts} />
    </div>
  );
}
