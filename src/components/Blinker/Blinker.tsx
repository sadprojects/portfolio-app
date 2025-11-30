import React, { useEffect, useState } from 'react';

export interface BlinkerProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  cycleInterval?: number; // Time in ms before cycling to next text
  onCycleComplete?: () => void; // Callback when cycle is complete (text fully erased)
}

const Blinker = ({
  text,
  as: Tag = 'span',
  className = '',
  cycleInterval,
  onCycleComplete
}: BlinkerProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    setIsErasing(false);

    let index = 0;
    const totalDuration = 2000;
    const charDelay = totalDuration / text.length;

    // Typing animation
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    if (!isTypingComplete || !cycleInterval || !onCycleComplete) return;

    // Wait before starting to erase
    const waitTimeout = setTimeout(() => {
      setIsErasing(true);

      let eraseIndex = text.length;
      const eraseDuration = 1000;
      const eraseDelay = eraseDuration / text.length;

      // Erasing animation
      const eraseInterval = setInterval(() => {
        if (eraseIndex > 0) {
          eraseIndex--;
          setDisplayedText(text.substring(0, eraseIndex));
        } else {
          clearInterval(eraseInterval);
          setIsErasing(false);
          onCycleComplete();
        }
      }, eraseDelay);

      return () => clearInterval(eraseInterval);
    }, cycleInterval);

    return () => clearTimeout(waitTimeout);
  }, [isTypingComplete, cycleInterval, onCycleComplete, text]);

  return (
    <Tag className={className} style={{ minHeight: '1.2em', display: 'inline-block' }}>
      {displayedText}
      <span
        className="blinker-cursor"
        style={{
          display: 'inline-block',
          width: '2.75rem',
          height: '0.1rem',
          backgroundColor: 'currentColor',
          marginLeft: '0.1em',
          animation: (isTypingComplete && !isErasing) ? 'blink 1s step-end infinite' : 'none',
          verticalAlign: 'baseline',
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @media (max-width: 768px) {
          .blinker-cursor {
            width: 0.75rem !important;
          }
        }
      `}</style>
    </Tag>
  );
};

export default React.memo(Blinker);
