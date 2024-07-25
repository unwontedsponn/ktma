import { useState, useEffect } from 'react';

const useScreenHeight = () => {
  // Initialize height with a default value that can be server-side rendered safely
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // Define a function that updates the height state to the current window inner height
    const handleResize = () => setHeight(window.innerHeight);

    // Set the initial height when the component mounts on the client side
    handleResize();

    // Add an event listener for window resize
    window.addEventListener('resize', handleResize);

    // Return a cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
};

export default useScreenHeight;
