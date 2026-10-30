import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonSection = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 8rem 2rem 4rem;

  @media (max-width: 768px) {
    padding: 6rem 1.5rem 3rem;
  }
`;

const SkeletonTitle = styled.div`
  height: 3rem;
  width: 300px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.muted} 50%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 0.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 200px;
    height: 2.5rem;
  }
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
`;

const SkeletonCard = styled.div`
  height: 200px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.muted} 50%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 1rem;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

export const SectionSkeleton = () => {
  return (
    <SkeletonSection>
      <SkeletonTitle />
      <SkeletonContent>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </SkeletonContent>
    </SkeletonSection>
  );
};
