import React, { useEffect, useState } from 'react';

export interface BlinkerProps {
  text: string;
  as?: React.ElementType;
  className?: string;
}

const Blinker = ({ text, as: Tag = 'span', className = '' }: BlinkerProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);

    let index = 0;
    const totalDuration = 2000;
    const charDelay = totalDuration / text.length;

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

  return (
    <Tag className={className}>
      {displayedText}
      <span
        style={{
          display: 'inline-block',
          width: '2.75rem',
          height: '0.1rem',
          backgroundColor: 'currentColor',
          marginLeft: '0.1em',
          animation: isTypingComplete ? 'blink 1s step-end infinite' : 'none',
          verticalAlign: 'baseline',
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </Tag>
  );
};

export default React.memo(Blinker);
