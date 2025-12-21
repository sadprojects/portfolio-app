import { contentData } from '@data/content';
import { motion } from 'framer-motion';
import {
  Calendar,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react';
import { memo } from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ProfileImage = styled(motion.img)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled(motion.a)<{ as?: string }>`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: block;
  cursor: ${({ as }) => (as === motion.div ? 'default' : 'pointer')};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.foreground};
    outline-offset: 2px;
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.foreground};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.foreground};
`;

const CardValue = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.foreground};
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Twitter/X icon component since it's not in lucide-react
const XIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const Contact = memo(() => {
  const { contact, social } = contentData;

  // Find social links
  const githubLink = social?.find((s) => s.name === 'github')?.url;
  const facebookLink = social?.find((s) => s.name === 'facebook')?.url;
  const twitterLink = social?.find((s) => s.name === 'twitter')?.url;

  // Check what contact methods exist
  const hasEmail = !!contact?.email;
  const hasLinkedIn = !!contact?.linkedin;
  const hasCalendly = !!contact?.calendly;
  const hasLocation = !!contact?.location;
  const hasSocialMedia = !!(githubLink || facebookLink || twitterLink);

  return (
    <ContactContainer>
      <Header>
        {contact.profileImage && (
          <ProfileImage
            src={`/src/assets/images/${contact.profileImage}`}
            alt={contact.name}
            loading="lazy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        <div>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get In Touch
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Feel free to reach out! I'm always open to discussing new projects,
            creative ideas, or opportunities.
          </Subtitle>
        </div>
      </Header>

      {(hasEmail || hasLinkedIn || hasCalendly || hasLocation) && (
        <>
          <SectionTitle>Contact Methods</SectionTitle>
          <ContactGrid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {hasEmail && (
              <ContactCard
                href={`mailto:${contact.email}`}
                variants={itemVariants}
                aria-label="Send me an email"
              >
                <IconWrapper>
                  <Mail size={28} />
                </IconWrapper>
                <CardTitle>Email</CardTitle>
                <CardValue>{contact.email}</CardValue>
              </ContactCard>
            )}

            {hasLinkedIn && (
              <ContactCard
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                aria-label="Connect with me on LinkedIn"
              >
                <IconWrapper>
                  <Linkedin size={28} />
                </IconWrapper>
                <CardTitle>LinkedIn</CardTitle>
                <CardValue>Connect on LinkedIn</CardValue>
              </ContactCard>
            )}

            {hasCalendly && (
              <ContactCard
                href={contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                aria-label="Schedule a meeting with me"
              >
                <IconWrapper>
                  <Calendar size={28} />
                </IconWrapper>
                <CardTitle>Schedule a Call</CardTitle>
                <CardValue>Book a Meeting</CardValue>
              </ContactCard>
            )}

            {hasLocation && (
              <ContactCard
                as={motion.div}
                variants={itemVariants}
                aria-label={`I'm located in ${contact.location}`}
              >
                <IconWrapper>
                  <MapPin size={28} />
                </IconWrapper>
                <CardTitle>Location</CardTitle>
                <CardValue>{contact.location}</CardValue>
              </ContactCard>
            )}
          </ContactGrid>
        </>
      )}

      {hasSocialMedia && (
        <>
          <SectionTitle>Social Media</SectionTitle>
          <ContactGrid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {githubLink && (
              <ContactCard
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                aria-label="Visit my GitHub profile"
              >
                <IconWrapper>
                  <Github size={28} />
                </IconWrapper>
                <CardTitle>GitHub</CardTitle>
                <CardValue>View my code</CardValue>
              </ContactCard>
            )}

            {facebookLink && (
              <ContactCard
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                aria-label="Connect with me on Facebook"
              >
                <IconWrapper>
                  <Facebook size={28} />
                </IconWrapper>
                <CardTitle>Facebook</CardTitle>
                <CardValue>Follow me on Facebook</CardValue>
              </ContactCard>
            )}

            {twitterLink && (
              <ContactCard
                href={twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                aria-label="Follow me on X (Twitter)"
              >
                <IconWrapper>
                  <XIcon size={28} />
                </IconWrapper>
                <CardTitle>X (Twitter)</CardTitle>
                <CardValue>Follow me on X</CardValue>
              </ContactCard>
            )}
          </ContactGrid>
        </>
      )}
    </ContactContainer>
  );
});

Contact.displayName = 'Contact';

export default Contact;
