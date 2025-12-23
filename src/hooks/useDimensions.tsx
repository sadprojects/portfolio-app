import { BREAKPOINTS } from '@constants/breakpoints';
import { debounce } from '@utils/helpers';
import { useEffect, useState } from 'react';

// Get initial dimensions safely (avoid SSR issues)
const getInitialDimensions = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
});

const useDimensions = (): [boolean, number, number] => {
  // Use lazy initialization to avoid reading during render
  const [dimensions, setDimensions] = useState(getInitialDimensions);

  useEffect(() => {
    const debouncedResize = debounce(function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }, 150); // Reduced from 500ms for better responsiveness

    window.addEventListener('resize', debouncedResize, { passive: true });

    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const isMobile = dimensions.width <= BREAKPOINTS.sm;

  return [isMobile, dimensions.width, dimensions.height];
};

export default useDimensions;
