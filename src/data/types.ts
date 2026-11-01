export interface Certification {
  title: string;
  issuer?: string;
  url: string;
  date: string;
}

export interface Contact {
  email: string;
  name: string;
  position: string;
  location: string;
  birthDate: string;
  firstJobDate: string;
  calendly?: string;
  profileImage?: string;
  /** File name under /media/cv. */
  cv: string;
}

export interface Education {
  position: string;
  company: string;
  city: string;
  period: string;
}

export interface Game {
  title: string;
  icon: string;
}

export interface Greetings {
  timeBasedGreetings: Array<{
    type: 'morning' | 'afternoon' | 'evening';
    message: string;
  }>;
  casualGreetings: string[];
  introductions: string[];
  /** cold is below 5°C, hot above 30°C; the rest follow the sky. */
  weatherGreetings: Record<
    'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'cold' | 'hot',
    string[]
  >;
}

export interface Photography {
  path: string;
  url: string;
  alt: string;
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
  easterEgg?: 'sudoku';
}

export interface Skill {
  name: string;
  /** Groups skills in the filter bar, e.g. 'Frontend'. */
  category: string;
  /** Self-assessed, 0–100. */
  level: number;
}

export interface Skills {
  professional: Skill[];
  languages: string[];
  developmentTools: string[];
}

interface SocialMediaLink {
  name: string;
  url: string;
}

export interface Experience {
  position: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

/** What the camera prints in the corner of a photo in playback; fill in what you know, the rest is left out. */
export interface PhotoExif {
  camera?: string;
  /** e.g. 'ƒ/2.8' */
  aperture?: string;
  /** e.g. '1/250 s' */
  shutter?: string;
  iso?: number;
  /** e.g. '35 mm' */
  focal?: string;
  /** e.g. 'Dec 2020' */
  date?: string;
  /** e.g. 'Bușteni, Romania' */
  location?: string;
}

/** A photo the camera opener plays back, with its handwritten note. */
export interface SectionBanner {
  image: string;
  caption?: string;
  alt?: string;
  exif?: PhotoExif;
}

/** Short centred line shown before a section starts. */
export interface SectionIntro {
  label: string;
  text: string;
}

export type SectionId =
  | 'home'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'hobbies'
  | 'contact';

/** The words for one section; its order, icon and opener live in pages/Home/sections.tsx. */
export interface SectionCopy {
  /** Name in the navigation. */
  label: string;
  /** Heading at the top of the section body, when it has one. */
  title?: string;
  /** Short centred line shown as the section opens. */
  intro?: SectionIntro;
  /** Photos the camera opener plays back. */
  banners?: SectionBanner[];
}

export interface ContentData {
  sections: Record<SectionId, SectionCopy>;
  certifications: Certification[];
  contact: Contact;
  education: Education[];
  games: Game[];
  photography: Photography[];
  introduction: string[];
  footer: string;
  homepage: {
    /** Headline on the hero. */
    title: string;
    /** Handwritten note under the portrait. */
    portraitCaption?: string;
  };
  greetings: Greetings;
  projects: Project[];
  skills: Skills;
  social: SocialMediaLink[];
  experience: Experience[];
  codewars: { username: string };
}
