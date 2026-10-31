import { Grid, col } from '@styles/grid';
import styled from 'styled-components';

import { RevealMedia } from './RevealMedia';
import { RevealText } from './RevealText';

type Side = 'left' | 'right';

const MediaGrid = styled(Grid).attrs({ as: 'section' })`
  align-items: center;
  grid-auto-flow: dense;
  row-gap: 1.5rem;
  margin: clamp(3rem, 6vw, 8rem) auto;
`;

const Photo = styled.div<{ $align: Side }>`
  ${({ $align }) => ($align === 'left' ? col('2 / 8', '1 / 8') : col('6 / 12', '6 / 13'))}
`;

const Caption = styled(RevealText)<{ $align: Side }>`
  ${({ $align }) => ($align === 'left' ? col('9 / 12', '8 / 13') : col('2 / 5', '1 / 6'))}
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.35rem, 1.95vw, 2.3rem);
  line-height: 1.25;
`;

export interface MediaBlockProps {
  image: string;
  caption?: string;
  alt?: string;
  align?: Side;
}

export const MediaBlock = ({
  image,
  caption,
  alt = '',
  align = 'left',
}: MediaBlockProps) => (
  <MediaGrid data-testid="media-block">
    <Photo $align={align}>
      <RevealMedia ratio="16 / 10">
        <img src={`/media/images/${image}`} alt={alt} loading="lazy" />
      </RevealMedia>
    </Photo>
    {caption && <Caption text={caption} tag="p" $align={align} />}
  </MediaGrid>
);
