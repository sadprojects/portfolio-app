import { RevealMedia } from '@components/motion/RevealMedia';
import { RevealText } from '@components/motion/RevealText';
import { contentData } from '@data/content';
import { Grid, col } from '@styles/grid';
import type { Ref } from 'react';
import styled from 'styled-components';

const PORTRAIT_PARALLAX_PX = 40;

const About = styled(Grid)`
  align-items: center;
  row-gap: 2rem;
  margin-top: clamp(6rem, 12vw, 14rem);
  scroll-margin-top: 2rem;
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

const fillPlaceholders = (text: string, values: Record<string, number>) =>
  text.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(values[key] ?? `{{${key}}}`),
  );

interface AboutSectionProps {
  age: number;
  yearsOfExperience: number;
  ref?: Ref<HTMLDivElement>;
}

export const AboutSection = ({
  age,
  yearsOfExperience,
  ref,
}: AboutSectionProps) => {
  const { introduction, contact, homepage } = contentData;
  const paragraphs = introduction.map((paragraph) =>
    fillPlaceholders(paragraph, { age, years: yearsOfExperience }),
  );

  return (
    <About ref={ref}>
      {contact.profileImage && (
        <Portrait>
          <RevealMedia ratio="4 / 5" parallax={PORTRAIT_PARALLAX_PX}>
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
        {paragraphs.map((text) => (
          <AboutParagraph key={text} text={text} tag="p" />
        ))}
      </AboutText>
    </About>
  );
};
