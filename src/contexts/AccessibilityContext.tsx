import {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

type ToastVariant = 'enabled' | 'disabled' | 'info';

interface ToastState {
  message: string;
  isVisible: boolean;
  icon?: React.ReactNode;
  variant?: ToastVariant;
}

interface AccessibilityContextType {
  scrollSnapEnabled: boolean;
  toggleScrollSnap: () => void;
  snowfallEnabled: boolean;
  toggleSnowfall: () => void;
  toast: ToastState;
  hideToast: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

// Check if current month is winter (December, January, February)
const isWinterSeason = (): boolean => {
  const month = new Date().getMonth();
  return month === 11 || month === 0 || month === 1; // Dec, Jan, Feb
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibility must be used within AccessibilityProvider',
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [scrollSnapEnabled, setScrollSnapEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('scrollSnapEnabled');
    // Default to true (snap enabled) if not set
    return stored === null ? true : stored === 'true';
  });

  const [snowfallEnabled, setSnowfallEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('snowfallEnabled');
    // Default to enabled during winter (Dec, Jan, Feb), disabled otherwise
    return stored === null ? isWinterSeason() : stored === 'true';
  });

  const [toast, setToast] = useState<ToastState>({
    message: '',
    isVisible: false,
  });

  useEffect(() => {
    localStorage.setItem('scrollSnapEnabled', String(scrollSnapEnabled));
  }, [scrollSnapEnabled]);

  useEffect(() => {
    localStorage.setItem('snowfallEnabled', String(snowfallEnabled));
  }, [snowfallEnabled]);

  const showToast = useCallback(
    (
      message: string,
      variant: ToastVariant = 'info',
      icon?: React.ReactNode,
    ) => {
      setToast({ message, isVisible: true, variant, icon });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const toggleScrollSnap = useCallback(() => {
    setScrollSnapEnabled((prev) => {
      const newValue = !prev;
      showToast(
        newValue ? 'Scroll snap enabled' : 'Scroll snap disabled',
        newValue ? 'enabled' : 'disabled',
      );
      return newValue;
    });
  }, [showToast]);

  const toggleSnowfall = useCallback(() => {
    setSnowfallEnabled((prev) => {
      const newValue = !prev;
      showToast(
        newValue ? 'Snowfall enabled' : 'Snowfall disabled',
        newValue ? 'enabled' : 'disabled',
      );
      return newValue;
    });
  }, [showToast]);

  return (
    <AccessibilityContext.Provider
      value={{
        scrollSnapEnabled,
        toggleScrollSnap,
        snowfallEnabled,
        toggleSnowfall,
        toast,
        hideToast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
