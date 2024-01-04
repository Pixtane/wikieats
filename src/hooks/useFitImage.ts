//TODO: rework or delete
import { useEffect, useRef, useState, CSSProperties } from 'react';

interface UseFitImageProps {
  containerWidth: number;
  containerHeight: number;
  logo: string;
}

const useFitImage = ({ containerWidth, containerHeight, logo }: UseFitImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });

      if (imageRef.current) {
        const containerRatio = width / height;
        const imageRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;

        if (containerRatio > imageRatio) {
          imageRef.current.style.width = '100%';
          imageRef.current.style.height = 'auto';
        } else {
          imageRef.current.style.width = 'auto';
          imageRef.current.style.height = '100%';
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [logo]);

  const generateStyles = (): CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });

  return { containerRef, imageRef, generateStyles, containerSize };
};

export default useFitImage;
