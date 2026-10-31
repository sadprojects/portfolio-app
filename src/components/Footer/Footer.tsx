import { RevealText } from '@components/motion/RevealText';
import { Scrub } from '@components/motion/Scrub';
import { LineButton } from '@components/ui/LineButton';
import { VersionModal } from '@components/VersionModal/VersionModal';
import { contentData } from '@data/content';
import { useDoubleClick } from '@hooks/useDoubleClick';
import { Grid, col } from '@styles/grid';
import { useState } from 'react';
import styled from 'styled-components';

const SOCIAL_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'X',
  facebook: 'Facebook',
};

const FooterScreen = styled.footer`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  margin-top: auto;
  padding: clamp(6rem, 12vw, 14rem) 0 2rem;
  scroll-margin-top: 4rem;
`;

const ContactGrid = styled(Grid)`
  flex: 1;
  align-content: center;
  row-gap: 2.5rem;
`;

const ContactLabel = styled.p`
  ${col('2 / 12', '1 / -1')}
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const EmailLink = styled.a`
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

const ElsewhereLinks = styled.nav`
  ${col('2 / 12', '1 / -1')}

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 2.25rem;
  }
`;

const LegalRow = styled.div`
  ${col('2 / 12', '1 / -1')}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  margin-top: 4rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const VersionTrigger = styled.span`
  cursor: pointer;
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

export const Footer = () => {
  const { social, footer, contact } = contentData;
  const currentYear = new Date().getFullYear();
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const onNameClick = useDoubleClick(() => setVersionModalOpen(true));

  return (
    <>
      <FooterScreen data-section="contact" aria-label="Contact">
        <ContactGrid>
          <ContactLabel>Say hi</ContactLabel>
          <EmailLink href={`mailto:${contact.email}`}>
            <RevealText tag="span" text={contact.email} />
          </EmailLink>
          <ElsewhereLinks aria-label="Elsewhere">
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
              {social.map(({ name, url }) => (
                <LineButton
                  key={name}
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                >
                  {SOCIAL_LABELS[name] ?? name}
                </LineButton>
              ))}
              <span>{contact.location}</span>
            </Scrub>
          </ElsewhereLinks>
        </ContactGrid>
        <Grid>
          <LegalRow>
            <span>
              © {currentYear}{' '}
              <VersionTrigger
                onClick={onNameClick}
                onTouchEnd={(event) => {
                  event.preventDefault();
                  onNameClick();
                }}
              >
                {footer}
              </VersionTrigger>
            </span>
            <span>{contact.position}</span>
          </LegalRow>
        </Grid>
      </FooterScreen>

      <VersionModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
      />
    </>
  );
};
