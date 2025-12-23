import { Skeleton } from '@components/ui/Skeleton';
import { contentData } from '@data/content';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: clamp(0.75rem, 2vw, 1rem);
  padding: clamp(1rem, 3vw, 2.5rem);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BarGraphGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Tags = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.75rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
`;

export const SkillsSkeleton = () => {
  const technologiesCount = contentData.technologies?.items?.filter(t => t.enabled !== false).length || 6;
  const languagesCount = contentData.skills?.languages?.length || 4;
  const toolsCount = contentData.skills?.developmentTools?.length || 6;
  const softSkillsCount = contentData.skills?.personal?.length || 6;

  return (
    <Container>
      <Header>
        <Skeleton $width="250px" $height="3.5rem" style={{ margin: '0 auto 1rem' }} />
        <Skeleton $width="450px" $height="1.5rem" style={{ margin: '0 auto' }} />
      </Header>

      <SkillsGrid>
        {/* Technical Skills */}
        {technologiesCount > 0 && (
          <Section>
            <SectionHeader>
              <Skeleton $width="48px" $height="48px" $radius="0.75rem" />
              <Skeleton $width="200px" $height="1.75rem" />
            </SectionHeader>
            <BarGraphGrid>
              {Array.from({ length: technologiesCount }).map((_, i) => (
                <Bar key={i}>
                  <Skeleton $width="80px" $height={`${100 + (i % 3) * 30}px`} />
                  <Skeleton $width="60px" $height="1rem" />
                </Bar>
              ))}
            </BarGraphGrid>
          </Section>
        )}

        {/* Languages */}
        {languagesCount > 0 && (
          <Section>
            <SectionHeader>
              <Skeleton $width="48px" $height="48px" $radius="0.75rem" />
              <Skeleton $width="150px" $height="1.75rem" />
            </SectionHeader>
            <Tags>
              {Array.from({ length: languagesCount }).map((_, i) => (
                <Skeleton key={i} $width="100px" $height="2.5rem" $radius="2rem" />
              ))}
            </Tags>
          </Section>
        )}

        {/* Tools */}
        {toolsCount > 0 && (
          <Section>
            <SectionHeader>
              <Skeleton $width="48px" $height="48px" $radius="0.75rem" />
              <Skeleton $width="200px" $height="1.75rem" />
            </SectionHeader>
            <CardsGrid>
              {Array.from({ length: toolsCount }).map((_, i) => (
                <Card key={i}>
                  <Skeleton $width="40px" $height="40px" style={{ marginBottom: '1rem' }} />
                  <Skeleton $width="70%" $height="1.5rem" />
                </Card>
              ))}
            </CardsGrid>
          </Section>
        )}

        {/* Soft Skills */}
        {softSkillsCount > 0 && (
          <Section>
            <SectionHeader>
              <Skeleton $width="48px" $height="48px" $radius="0.75rem" />
              <Skeleton $width="150px" $height="1.75rem" />
            </SectionHeader>
            <Tags>
              {Array.from({ length: softSkillsCount }).map((_, i) => (
                <Skeleton key={i} $width="120px" $height="2.5rem" $radius="2rem" />
              ))}
            </Tags>
          </Section>
        )}
      </SkillsGrid>
    </Container>
  );
};
