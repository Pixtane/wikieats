
import { useState, useEffect } from 'react';

const useResize = (percentage: number, dimension: 'width' | 'height', maxWidth: number, maxHeight: number) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calculateSize = () => {
      const newWidth = window.innerWidth / maxWidth * (percentage / 100);
      const newHeight = window.innerHeight / maxHeight * (percentage / 100);

      setSize(prevSize => {
        // Only update state if there's a change to avoid infinite loops
        if (newWidth !== prevSize.width || newHeight !== prevSize.height) {
          return { width: newWidth, height: newHeight };
        }
        return prevSize;
      });
    };

    // Initial calculation
    calculateSize();

    // Recalculate on window resize
    window.addEventListener('resize', calculateSize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', calculateSize);
    };
  }, [percentage, dimension, maxWidth, maxHeight, size]);

  return size;
};

export default useResize;
