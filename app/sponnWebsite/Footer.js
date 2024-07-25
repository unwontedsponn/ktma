import { useEffect, useState } from 'react';

export default function Footer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(() => {
        if (typeof Audio !== 'undefined') {
            const newAudio = new Audio("./audio/room of my own.mp3");
            newAudio.volume = 0.5;
            return newAudio;
        }
    });

    const [responsiveText, setResponsiveText] = useState(isPlaying ? "'Room of My Own'" : "greenAndPine");

    // Toggle play/pause based on isPlaying state and cleanup audio
    useEffect(() => {
        if (audio) isPlaying ? audio.play() : audio.pause();
        return () => audio?.pause(); // Cleanup to pause audio when component unmounts
    }, [isPlaying, audio]);

    useEffect(() => {
        const adjustFooterHeight = () => {
            const footerHeight = document.querySelector('#footer')?.offsetHeight || 0;
            document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
        };
        adjustFooterHeight(); // Call initially and on resize
        window.addEventListener('resize', adjustFooterHeight);
        return () => window.removeEventListener('resize', adjustFooterHeight);
    }, []);

    useEffect(() => {
        const updateResponsiveText = () => {
            const baseText = isPlaying ? "'Room of My Own'" : "greenAndPine";
            setResponsiveText(window.innerWidth <= 768 ? baseText : `Now Playing: ${baseText}`);
        };

        updateResponsiveText();
        window.addEventListener('resize', updateResponsiveText);

        return () => {
            window.removeEventListener('resize', updateResponsiveText);
        };
    }, [isPlaying]); // Include isPlaying in the dependency array to update text when it changes

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    return (
        <div id="footer" className="fixed inset-x-0 bottom-0 hidden lg:flex justify-center items-center pb-4">
            <div className="max-w-screen-md flex justify-center items-center space-x-12 md:space-x-14 text-xs font-gopher-mono border-t-2 border-custom-border-color pt-2 py-2">
                <div id="listen" className="md:pl-14">listenNow:</div>
                <div id="green-and-pine-footer" className="border-x-2 border-custom-border-color px-4 md:px-14">
                    <span className={isPlaying ? 'flashing-text' : ''}>{responsiveText}</span>
                </div>
                <button id="play-footer" onClick={togglePlayPause} className="md:pr-14">
                    {isPlaying ? 'pause' : 'play'}
                </button>
            </div>
        </div>
    );
}
