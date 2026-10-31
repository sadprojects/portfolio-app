import { useEffect, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export const useDecodedText = (
  text: string,
  delayMs: number,
  stepMs: number,
) => {
  const [decoded, setDecoded] = useState('');

  useEffect(() => {
    let resolvedCount = 0;
    let ticker: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      ticker = setInterval(() => {
        resolvedCount += 1;
        setDecoded(
          text.replace(/\S/g, (char, index: number) =>
            index < resolvedCount ? char : randomGlyph(),
          ),
        );
        if (resolvedCount >= text.length) clearInterval(ticker);
      }, stepMs);
    }, delayMs);
    return () => {
      clearTimeout(start);
      clearInterval(ticker);
    };
  }, [text, delayMs, stepMs]);

  return decoded;
};
