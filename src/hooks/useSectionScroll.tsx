import { useAccessibility } from '@contexts/AccessibilityContext';
import { useEffect, useRef, useState } from 'react';
import { BREAKPOINTS, FEATURES } from '../constants';

interface UseSectionScrollOptions {
  onSectionChange?: (sectionId: string) => void;
  isDraggingTOC?: boolean;
}

export const useSectionScroll = ({
  onSectionChange,
}: UseSectionScrollOptions = {}) => {
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToHash = useRef(false);
  const { scrollSnapEnabled } = useAccessibility();

  // Scroll to section based on URL hash on mount
  useEffect(() => {
    if (hasScrolledToHash.current) return;

    const hash = window.location.hash.slice(1);
    if (hash) {
      // Wait longer and retry multiple times to ensure lazy-loaded sections are rendered
      let attempts = 0;
      const maxAttempts = 20; // Try for up to 2 seconds

      const tryScroll = () => {
        const element = document.querySelector(`[data-section="${hash}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          hasScrolledToHash.current = true;

          // Remove hash from URL after scrolling
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname);
          }, 1000);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };

      const timeoutId = setTimeout(tryScroll, 300);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
            onSectionChange?.(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const sectionElements = document.querySelectorAll('[data-section]');
    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [onSectionChange]);

  // Handle scroll snapping based on 50% visibility threshold
  useEffect(() => {
    // Don't set up snap behavior if disabled via accessibility setting
    if (!scrollSnapEnabled) {
      return;
    }

    if (
      FEATURES.DISABLE_MOBILE_SCROLL_SNAP &&
      window.innerWidth <= BREAKPOINTS.mobile
    ) {
      return;
    }

    let scrollTimeout: NodeJS.Timeout;
    let currentVisibleSection: string | null = null;
    const sectionVisibility = new Map<string, number>();

    const handleScroll = () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('[data-section]');
        const viewportHeight = window.innerHeight;
        let maxVisibility = 0;
        let mostVisibleSection: HTMLElement | null = null;
        let mostVisibleSectionId: string | null = null;

        sections.forEach((section) => {
          const el = section as HTMLElement;
          const rect = el.getBoundingClientRect();
          const sectionId = el.getAttribute('data-section');

          if (!sectionId) return;

          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const sectionHeight = Math.min(rect.height, viewportHeight);
          const visibilityPercentage = (visibleHeight / sectionHeight) * 100;

          sectionVisibility.set(sectionId, visibilityPercentage);

          if (visibilityPercentage > maxVisibility) {
            maxVisibility = visibilityPercentage;
            mostVisibleSection = el;
            mostVisibleSectionId = sectionId;
          }
        });

        if (currentVisibleSection && mostVisibleSectionId) {
          const currentVisibility =
            sectionVisibility.get(currentVisibleSection) || 0;

          if (
            currentVisibility < 50 &&
            mostVisibleSectionId !== currentVisibleSection
          ) {
            if (mostVisibleSection) {
              const targetSection = mostVisibleSection as HTMLElement;
              targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
              currentVisibleSection = mostVisibleSectionId;
            }
          } else if (currentVisibility >= 50) {
            currentVisibleSection = mostVisibleSectionId;
          }
        } else {
          currentVisibleSection = mostVisibleSectionId;
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [scrollSnapEnabled]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    activeSection,
    containerRef,
    scrollToSection,
  };
};
