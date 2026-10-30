import { VersionModal } from '@components/VersionModal/VersionModal';
import { RevealText } from '@components/motion/RevealText';
import { Scrub } from '@components/motion/Scrub';
import { contentData } from '@data/content';
import { LineButton } from '@pages/Home/HeroSection';
import { Grid, col } from '@styles/grid';
import { useRef, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.footer`
  margin-top: auto;
  padding: clamp(6rem, 12vw, 14rem) 0 2rem;
  scroll-margin-top: 4rem;
`;

const Inner = styled(Grid)`
  row-gap: 2.5rem;
`;

const Label = styled.p`
  ${col('2 / 12', '1 / -1')}
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Email = styled.a`
  ${col('2 / 12', '1 / -1')}
  justify-self: start;
  color: inherit;
  text-decoration: none;
  font-family: ${({ theme }) => theme.typography.fonts.display};
  font-size: clamp(1.75rem, 4.4vw, 5.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
  transition: opacity ${({ theme }) => theme.transitions.normal};

  &:hover {
    opacity: 0.6;
  }
`;

const Links = styled.nav`
  ${col('2 / 12', '1 / -1')}

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 2.25rem;
  }
`;

const Bottom = styled.div`
  ${col('2 / 12', '1 / -1')}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const NameLink = styled.span`
  cursor: pointer;
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

const labels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'X',
  facebook: 'Facebook',
};

export const Footer = () => {
  const { social, footer, contact } = contentData;
  const currentYear = new Date().getFullYear();
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNameClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current === 2) {
      setIsVersionModalOpen(true);
      clickCountRef.current = 0;
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 400);
  };

  return (
    <>
      <Wrap data-section="contact" aria-label="Contact">
        <Inner>
          <Label>Say hi</Label>
          <Email href={`mailto:${contact.email}`}>
            <RevealText tag="span" text={contact.email} />
          </Email>
          <Links aria-label="Elsewhere">
            <Scrub>
              {contact.calendly && (
                <LineButton
                  as="a"
                  href={contact.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a call
                </LineButton>
              )}
              {social
                .filter((link) => link.enabled !== false)
                .map(({ name, url }) => (
                  <LineButton
                    key={name}
                    as="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                  >
                    {labels[name] ?? name}
                  </LineButton>
                ))}
              <span>{contact.location}</span>
            </Scrub>
          </Links>
          <Bottom>
            <span>
              © {currentYear}{' '}
              <NameLink
                onClick={handleNameClick}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleNameClick();
                }}
              >
                {footer}
              </NameLink>
            </span>
            <span>{contact.position}</span>
          </Bottom>
        </Inner>
      </Wrap>

      <VersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />
    </>
  );
};
