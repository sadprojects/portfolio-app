export interface Certification {
  title: string;
  url: string;
  date: string;
  enabled?: boolean;
}

export interface Contact {
  email: string;
  phone: string;
  name: string;
  position: string;
  location: string;
  birthDate: string;
  firstJobDate: string;
  linkedin: string;
  linkedinMessaging: string;
  calendly?: string;
  profileImage?: string;
}

export interface Education {
  position: string;
  company: string;
  city: string;
  period: string;
  responsibilities?: string[];
  enabled?: boolean;
}

export interface Game {
  title: string;
  icon: string;
  enabled?: boolean;
}

export interface Greetings {
  timeBasedGreetings: Array<{
    type: 'morning' | 'afternoon' | 'evening';
    message: string;
  }>;
  casualGreetings: string[];
  introductions: string[];
  weatherGreetings: {
    sunny: string[];
    rainy: string[];
    cloudy: string[];
    snowy: string[];
    cold: string[]; // Below 5°C
    hot: string[]; // Above 30°C
  };
}

export interface Photography {
  path: string;
  width: number;
  height: number;
  url: string;
  alt: string;
  type: string;
  altUrl?: string;
  enabled?: boolean;
}

export interface SpeedSkating {
  title: string;
  description: string[];
  image: {
    path: string;
    alt: string;
  };
}

export interface Project {
  title: string;
  city: string;
  description: string;
  period: string;
  tools: string[];
  website?: string;
  repo: string;
  video?: string;
  publication?: string;
  easterEgg?: 'sudoku'; // Expandable for future easter eggs
  enabled?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  priority: number;
  enabled?: boolean;
}

export interface Skills {
  professional: Skill[];
  languages: string[];
  developmentTools: string[];
  personal: string[];
}

export interface SocialMediaLink {
  name: string;
  url: string;
  icon: string;
  enabled?: boolean;
}

export interface TechnologyItem {
  key: string;
  name: string;
  icon: string;
  enabled?: boolean;
}

export interface Technologies {
  description: string;
  items: TechnologyItem[];
}

export interface Experience {
  position: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  enabled?: boolean;
}

export interface Codewars {
  username: string;
  enabled: boolean;
}

export interface SectionConfig {
  enabled: boolean;
  order: number;
  useSkeleton?: boolean;
}

export interface SectionsConfig {
  projects: SectionConfig;
  certifications: SectionConfig;
  skills: SectionConfig;
  experience: SectionConfig;
  hobbies: SectionConfig;
  contact: SectionConfig;
}

export interface ContentData {
  sections: SectionsConfig;
  certifications: Certification[];
  contact: Contact;
  education: Education[];
  games: Game[];
  photography: Photography[];
  speedSkating: SpeedSkating;
  introduction: string[];
  footer: string;
  homepage: { title: string };
  greetings: Greetings;
  projects: Project[];
  skills: Skills;
  social: SocialMediaLink[];
  technologies: Technologies;
  experience: Experience[];
  codewars: Codewars;
}
