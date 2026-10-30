import { scrollToElement } from '@lib/smoothScroll';
import { useEffect, useRef, useState } from 'react';

interface UseSectionScrollOptions {
  onSectionChange?: (sectionId: string) => void;
}

/** Tracks which `[data-section]` is on screen, honours a URL hash on load, and scrolls to sections. */
export const useSectionScroll = ({
  onSectionChange,
}: UseSectionScrollOptions = {}) => {
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToHash = useRef(false);

  useEffect(() => {
    if (hasScrolledToHash.current) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let attempts = 0;
    const tryScroll = () => {
      const element = document.querySelector<HTMLElement>(
        `[data-section="${hash}"]`,
      );
      if (element) {
        scrollToElement(element);
        hasScrolledToHash.current = true;
        setTimeout(
          () => window.history.replaceState(null, '', window.location.pathname),
          1000,
        );
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryScroll, 100);
      }
    };
    const timeoutId = setTimeout(tryScroll, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section');
          if (entry.isIntersecting && sectionId) {
            setActiveSection(sectionId);
            onSectionChange?.(sectionId);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('[data-section]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onSectionChange]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector<HTMLElement>(
      `[data-section="${sectionId}"]`,
    );
    if (element) scrollToElement(element);
  };

  return { activeSection, containerRef, scrollToSection };
};
