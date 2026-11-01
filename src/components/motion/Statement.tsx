import type { SectionIntro } from '@data/types';
import { Grid, col } from '@styles/grid';
import styled, { css } from 'styled-components';

import { RevealText } from './RevealText';

const StatementGrid = styled(Grid).attrs({ as: 'section' })`
  padding: clamp(5rem, 11vw, 13rem) 16px;
  row-gap: 1.25rem;

  @media (min-width: 1024px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

const label = css`
  ${col('4 / 10', '3 / 11')}
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const line = css`
  ${col('3 / 11', '2 / 12')}
  margin: 0;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-weight: 400;
  font-size: clamp(1.75rem, 3.1vw, 3.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
`;

const StatementLabel = styled(RevealText)`
  ${label}
`;

const StatementLine = styled(RevealText)`
  ${line}
`;

const StaticLabel = styled.p`
  ${label}
`;

const StaticLine = styled.p`
  ${line}
`;

interface StatementProps extends SectionIntro {
  exitOnScroll?: boolean;
  animate?: boolean;
}

/** The same lines as plain text, for stills that are drawn many times over: no reveal, no hooks. */
export const StaticStatement = ({ label, text }: SectionIntro) => (
  <StatementGrid aria-hidden="true">
    <StaticLabel>{label}</StaticLabel>
    <StaticLine>{text}</StaticLine>
  </StatementGrid>
);

export const Statement = ({
  label,
  text,
  exitOnScroll,
  animate,
}: StatementProps) => (
  <StatementGrid>
    <StatementLabel
      text={label}
      tag="p"
      exitOnScroll={exitOnScroll}
      animate={animate}
    />
    <StatementLine
      text={text}
      tag="p"
      exitOnScroll={exitOnScroll}
      animate={animate}
    />
  </StatementGrid>
);
