import { useState, useEffect } from 'react';



const useScreenSize = () => {
    // Function to get screen size based on window width
  const getScreenSize = (width: number) => {
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    return 'sm';
  };

  // Define the initial screen size based on Tailwind CSS class names
  const initialScreenSize = getScreenSize(window.innerWidth);

  // State to store the current screen size
  const [screenSize, setScreenSize] = useState(initialScreenSize);

  // Effect to update the screen size when it changes
  useEffect(() => {
    // Function to update screen size based on window width
    const updateScreenSize = () => {
      const newScreenSize = getScreenSize(window.innerWidth);

      // Check if the screen size has changed
      if (newScreenSize !== screenSize) {
        setScreenSize(newScreenSize);
      }
    };

    // Event listener to update screen size on window resize
    window.addEventListener('resize', updateScreenSize);

    // Initial call to set screen size on component mount
    updateScreenSize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, [screenSize]); // Dependency array to re-run the effect when screenSize changes

  return screenSize;
};

export default useScreenSize;
