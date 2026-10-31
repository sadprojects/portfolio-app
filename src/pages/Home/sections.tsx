import { contentData } from '@data/content';
import type { SectionCopy, SectionId } from '@data/types';
import {
  Briefcase,
  Camera,
  FolderGit2,
  Home,
  Lightbulb,
  User,
} from 'lucide-react';
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export interface Section extends SectionCopy {
  id: SectionId;
  icon: ComponentType<{ size?: number }>;
  /** The opener before the section: the statement zoomed bare, on a laptop screen or a resume sheet, or a camera that plays the banners back. */
  transition?: 'zoom' | 'laptop' | 'resume' | 'camera';
  /** Lazy page body. Home and contact render elsewhere, so they have none. */
  Component?: LazyExoticComponent<ComponentType>;
}

const { sections } = contentData;

/** Page order, top to bottom. Labels and copy come from content.ts. */
export const SECTIONS: Section[] = [
  { id: 'home', icon: Home, ...sections.home },
  {
    id: 'experience',
    icon: Briefcase,
    transition: 'zoom',
    Component: lazy(() => import('@sections/Experience/Experience')),
    ...sections.experience,
  },
  {
    id: 'projects',
    icon: FolderGit2,
    transition: 'laptop',
    Component: lazy(() => import('@sections/Projects/Projects')),
    ...sections.projects,
  },
  {
    id: 'skills',
    icon: Lightbulb,
    transition: 'resume',
    Component: lazy(() => import('@sections/Skills/Skills')),
    ...sections.skills,
  },
  {
    id: 'hobbies',
    icon: Camera,
    transition: 'camera',
    Component: lazy(() => import('@sections/Hobbies/Hobbies')),
    ...sections.hobbies,
  },
  { id: 'contact', icon: User, ...sections.contact },
];
