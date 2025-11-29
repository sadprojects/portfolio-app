export interface Certification {
  title: string;
  url: string;
  date: string;
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
}

export interface Education {
  position: string;
  company: string;
  city: string;
  period: string;
  responsibilities?: string[];
}

export interface Game {
  title: string;
  icon: string;
}

export interface Photography {
  path: string;
  width: number;
  height: number;
  url: string;
  alt: string;
  type: string;
  altUrl?: string;
}

export interface Project {
  title: string;
  city: string;
  description: string;
  period: string;
  tools: string[];
  website?: string;
  repo: string;
  video: string;
}

export interface Skill {
  name: string;
  level: number;
  priority: number;
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
}

export interface TechnologyItem {
  key: string;
  name: string;
  icon: string;
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
}

export interface ContentData {
  certifications: Certification[];
  contact: Contact;
  education: Education[];
  games: Game[];
  photography: Photography[];
  introduction: string[];
  footer: string;
  homepage: { title: string };
  projects: Project[];
  skills: Skills;
  social: SocialMediaLink[];
  technologies: Technologies;
  experience: Experience[];
}
