import Blinker from '@components/Blinker/Blinker';
import { RevealMedia } from '@components/motion/RevealMedia';
import { RevealText } from '@components/motion/RevealText';
import { contentData } from '@data/content';
import { EASE, Grid, col } from '@styles/grid';
import {
  fetchWeatherData,
  getCompleteGreeting,
  resetGreetingType,
} from '@utils/greetings';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/* ---------- hero statement ---------- */
const Hero = styled(Grid)`
  min-height: calc(100vh - 4rem);
  align-items: center;
  row-gap: 2.5rem;
  padding-top: 3rem;
  padding-bottom: clamp(3rem, 6vw, 6rem);
`;

const Copy = styled(motion.div)`
  ${col('2 / 10', '1 / 12')}
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  min-width: 0;
`;

const Greeting = styled.p`
  margin: 0;
  min-height: 1.2em;
  font-family: ${({ theme }) => theme.typography.fonts.hand};
  font-weight: 600;
  font-size: clamp(1.5rem, 2.2vw, 2.6rem);
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Title = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2.4rem, 4.8vw, 5.8rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 2.5rem;
`;

const ScrollHint = styled(motion.div)`
  ${col('11 / 13', '11 / 13')}
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};

  @media (max-width: 768px) {
    display: none;
  }
`;

const HintLine = styled(motion.span)`
  display: block;
  width: 1px;
  height: 2.5rem;
  background: currentColor;
  transform-origin: top;
`;

/* Immersive-style underlined text button: the line wipes out on hover and back in from the left. */
export const LineButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0 0.55rem;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: currentColor;
    transform-origin: right;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(0);
    transform-origin: left;
  }

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
`;

/* ---------- about ---------- */

const About = styled(Grid)`
  align-items: center;
  row-gap: 2rem;
  margin-top: clamp(6rem, 12vw, 14rem);
`;

const Portrait = styled.figure`
  ${col('2 / 6', '1 / 6', '1 / 9')}
  margin: 0;
`;

const PortraitCaption = styled.figcaption`
  margin-top: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fonts.hand};
  font-weight: 600;
  font-size: 1.35rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const AboutText = styled.div`
  ${col('7 / 12', '6 / 13')}
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AboutParagraph = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.35rem, 1.95vw, 2.3rem);
  line-height: 1.3;
`;

interface HeroSectionProps {
  age: number;
  yearsOfExperience: number;
  firstSectionId?: string;
  isGeneratingPDF: boolean;
  onViewWork: () => void;
  onDownloadCV: () => void;
}

const fillPlaceholders = (text: string, values: Record<string, number>) =>
  text.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(values[key] ?? `{{${key}}}`),
  );

export const HeroSection = ({
  age,
  yearsOfExperience,
  firstSectionId,
  isGeneratingPDF,
  onViewWork,
  onDownloadCV,
}: HeroSectionProps) => {
  const { homepage, introduction, contact } = contentData;
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    condition: string;
  } | null>(null);
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(true);

  useEffect(() => {
    resetGreetingType();
    getCompleteGreeting(null).then((greeting) => {
      setCurrentGreeting(greeting);
      setIsLoadingGreeting(false);
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => fetchWeatherData().then(setWeatherData),
      2000,
    );
    return () => clearTimeout(timeoutId);
  }, []);

  const handleCycleComplete = useCallback(async () => {
    setCurrentGreeting(await getCompleteGreeting(weatherData));
  }, [weatherData]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(heroProgress, [0, 1], [0, -260]);
  const copyOpacity = useTransform(heroProgress, [0.05, 0.55], [1, 0]);

  const paragraphs = introduction.map((p) =>
    fillPlaceholders(p, { age, years: yearsOfExperience }),
  );

  return (
    <>
      <Hero ref={heroRef}>
        <Copy style={{ y: copyY, opacity: copyOpacity }}>
          <Greeting aria-live="polite">
            <Blinker
              text={currentGreeting || "Hi! I'm Silviu"}
              cycleInterval={10000}
              onCycleComplete={handleCycleComplete}
              startDelay={isLoadingGreeting ? 0 : 2500}
            />
          </Greeting>

          <Title tag="h1" text={homepage.title} delay={0.2} />

          <Actions
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            <LineButton onClick={onViewWork} disabled={!firstSectionId}>
              View My Work
              <ArrowDown size={14} />
            </LineButton>

            <LineButton onClick={onDownloadCV} disabled={isGeneratingPDF}>
              <Download size={14} />
              {isGeneratingPDF ? 'Downloading...' : 'Download CV'}
            </LineButton>
          </Actions>
        </Copy>

        <ScrollHint aria-hidden="true" style={{ opacity: copyOpacity }}>
          Scroll
          <HintLine
            animate={{ scaleY: [0, 1, 1, 0], originY: [0, 0, 1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </ScrollHint>
      </Hero>

      <About>
        {contact.profileImage && (
          <Portrait>
            <RevealMedia ratio="4 / 5" parallax={40}>
              <img
                src={`/media/images/${contact.profileImage}`}
                alt={contact.name}
              />
            </RevealMedia>
            {homepage.portraitCaption && (
              <PortraitCaption>{homepage.portraitCaption}</PortraitCaption>
            )}
          </Portrait>
        )}
        <AboutText>
          {paragraphs.map((text, i) => (
            <AboutParagraph key={text} text={text} tag="p" delay={i * 0.15} />
          ))}
        </AboutText>
      </About>
    </>
  );
};
