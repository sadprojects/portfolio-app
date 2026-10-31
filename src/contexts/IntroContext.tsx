import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface IntroState {
  /** True once the intro curtain has lifted (immediately when it never shows). */
  done: boolean;
  /** Called once by the curtain as it starts to lift. */
  finish: () => void;
}

/* Without a provider the page behaves as if the curtain had already lifted. */
const IntroContext = createContext<IntroState>({
  done: true,
  finish: () => {},
});

/** Page-load state shared by the intro curtain and whatever waits for it. */
export const IntroProvider = ({ children }: { children: ReactNode }) => {
  const [done, setDone] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const finish = useCallback(() => setDone(true), []);
  return (
    <IntroContext.Provider value={{ done, finish }}>
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = () => useContext(IntroContext);
