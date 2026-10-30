import { Grid, col } from '@styles/grid';
import styled from 'styled-components';
import { RevealText } from './RevealText';

const Wrap = styled(Grid).attrs({ as: 'section' })`
  padding: clamp(5rem, 11vw, 13rem) 16px;
  row-gap: 1.25rem;

  @media (min-width: 1024px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

const Label = styled(RevealText)`
  ${col('4 / 10', '3 / 11')}
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Text = styled(RevealText)`
  ${col('3 / 11', '2 / 12')}
  margin: 0;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.75rem, 3.1vw, 3.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
`;

interface StatementProps {
  label: string;
  text: string;
}

/** A short centred manifesto line that introduces the section after it. */
export const Statement = ({ label, text }: StatementProps) => (
  <Wrap>
    <Label text={label} tag="p" />
    <Text text={text} tag="p" delay={0.15} />
  </Wrap>
);
