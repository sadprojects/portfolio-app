import { RevealText } from '@components/motion/RevealText';
import styled from 'styled-components';

const Wrap = styled.header<{ $center?: boolean }>`
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};
`;

const Title = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2rem, 3.6vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.02em;
`;

interface SectionHeadingProps {
  title: string;
  center?: boolean;
}

/** Serif section title whose words rise with the scroll. */
export const SectionHeading = ({ title, center }: SectionHeadingProps) => (
  <Wrap $center={center}>
    <Title tag="h2" text={title} />
  </Wrap>
);
