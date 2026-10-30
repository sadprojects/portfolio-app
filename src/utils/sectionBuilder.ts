import type { ContentData, SectionBanner, SectionIntro } from '@data/types';
import {
  Briefcase,
  Camera,
  FolderGit2,
  Home as HomeIcon,
  Lightbulb,
  User,
} from 'lucide-react';

export interface SectionConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  enabled: boolean;
  order: number;
  useSkeleton?: boolean;
  intro?: SectionIntro;
  banners?: SectionBanner[];
}

export interface SectionChecks {
  hasProjects: boolean;
  hasSkills: boolean;
  hasExperience: boolean;
  hasHobbies: boolean;
  hasContact: boolean;
}

export const checkSectionAvailability = (
  contentData: ContentData,
): SectionChecks => {
  const {
    projects,
    skills,
    experience,
    photography,
    games,
    contact,
    sections,
  } = contentData;

  return {
    hasProjects: sections.projects.enabled && projects.length > 0,
    hasSkills:
      sections.skills.enabled &&
      (skills.professional.length > 0 || skills.languages.length > 0),
    hasExperience: sections.experience.enabled && experience.length > 0,
    hasHobbies:
      sections.hobbies.enabled && (photography.length > 0 || games.length > 0),
    hasContact:
      sections.contact.enabled &&
      !!(contact.email || contact.linkedin || contact.calendly),
  };
};

export const buildSections = (
  contentData: ContentData,
  checks: SectionChecks,
): SectionConfig[] => {
  const { sections } = contentData;
  const meta = [
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      enabled: checks.hasProjects,
      config: sections.projects,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Lightbulb,
      enabled: checks.hasSkills,
      config: sections.skills,
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      enabled: checks.hasExperience,
      config: sections.experience,
    },
    {
      id: 'hobbies',
      label: 'Hobbies',
      icon: Camera,
      enabled: checks.hasHobbies,
      config: sections.hobbies,
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: User,
      enabled: checks.hasContact,
      config: sections.contact,
    },
  ];

  const home: SectionConfig = {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    enabled: true,
    order: 0,
  };
  return [
    home,
    ...meta.map(({ config, ...section }) => ({ ...section, ...config })),
  ]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);
};
