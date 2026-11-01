import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface SnowfallState {
  enabled: boolean;
  toggle: () => void;
}

const SnowfallContext = createContext<SnowfallState>({
  enabled: false,
  toggle: () => {},
});

const KEY = 'snowfallEnabled';

/** Seasonal snow: on by default in winter, remembered across visits. */
export const SnowfallProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem(KEY);
    const month = new Date().getMonth();
    return stored === null ? month === 11 || month <= 1 : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(KEY, String(enabled));
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((on) => !on), []);

  return (
    <SnowfallContext.Provider value={{ enabled, toggle }}>
      {children}
    </SnowfallContext.Provider>
  );
};

export const useSnowfall = () => useContext(SnowfallContext);
