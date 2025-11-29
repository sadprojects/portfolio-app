import { BREAKPOINTS } from '@constants/breakpoints';
import { debounce } from '@utils/helpers';
import { useLayoutEffect, useState } from 'react';

const useDimensions = (): [boolean, number, number] => {
  const [dimensions, setDimensions] = useState({
    width: window?.innerWidth || 0,
    height: window?.innerHeight || 0,
  });

  useLayoutEffect(() => {
    const debouncedResize = debounce(function handleResize() {
      setDimensions({ width: window?.innerWidth, height: window?.innerHeight });
    }, 500);

    window?.addEventListener('resize', debouncedResize);

    return () => window?.removeEventListener('resize', debouncedResize);
  }, []);

  const isMobile = dimensions.width <= BREAKPOINTS.sm;

  return [isMobile, dimensions.width, dimensions.height];
};

export default useDimensions;
