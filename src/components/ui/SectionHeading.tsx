import { RevealText } from '@components/motion/RevealText';
import styled from 'styled-components';

const HeadingBlock = styled.header<{ $center?: boolean }>`
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};
`;

const HeadingText = styled(RevealText)`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(2rem, 3.6vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.02em;
`;

interface SectionHeadingProps {
  title?: string;
  center?: boolean;
}

export const SectionHeading = ({ title, center }: SectionHeadingProps) =>
  title ? (
    <HeadingBlock $center={center}>
      <HeadingText tag="h2" text={title} />
    </HeadingBlock>
  ) : null;
