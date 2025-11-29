import { contentData } from '@data/content';
import { Facebook, Github, Linkedin, Twitter } from 'lucide-react';
import { memo } from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.card};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  transition: color ${({ theme }) => theme.transitions.fast},
              transform ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
    transform: translateY(-2px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;


const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
};

export const Footer = memo(() => {
  const { social, footer } = contentData;
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <SocialLinks>
          {social.map(({ name, url }) => {
            const Icon = socialIcons[name];
            return Icon ? (
              <SocialLink
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
              >
                <Icon size={24} />
              </SocialLink>
            ) : null;
          })}
        </SocialLinks>

        <Copyright>
          © {currentYear} {footer}
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
});
