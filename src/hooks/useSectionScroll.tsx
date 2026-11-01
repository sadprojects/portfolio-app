import type { ScrollTo } from '@hooks/useSmoothScroll';
import { useEffect, useRef, useState } from 'react';

const HASH_SCROLL_DELAY_MS = 300;
const HASH_CLEAR_DELAY_MS = 1000;

const sectionElement = (id: string) =>
  document.querySelector<HTMLElement>(`[data-section="${id}"]`);

export const useSectionScroll = (scrollTo: ScrollTo) => {
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sectionElement(window.location.hash.slice(1));
    if (!target) return;
    const timer = setTimeout(() => {
      scrollTo(target);
      setTimeout(
        () => window.history.replaceState(null, '', window.location.pathname),
        HASH_CLEAR_DELAY_MS,
      );
    }, HASH_SCROLL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [scrollTo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section');
          if (entry.isIntersecting && id) setActiveSection(id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('[data-section]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const target = sectionElement(id);
    if (target) scrollTo(target);
  };

  return { activeSection, containerRef, scrollToSection };
};
