import { FC, createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  scrollSnapEnabled: boolean;
  toggleScrollSnap: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

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

  useEffect(() => {
    localStorage.setItem('scrollSnapEnabled', String(scrollSnapEnabled));
  }, [scrollSnapEnabled]);

  const toggleScrollSnap = () => {
    setScrollSnapEnabled((prev) => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{ scrollSnapEnabled, toggleScrollSnap }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
