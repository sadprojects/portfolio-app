import { ComponentType, JSX, LazyExoticComponent } from 'react';
import { RoutesProps } from 'react-router-dom';

export interface Route extends RoutesProps {
  path: string;
  label: string;
  classNames?: string[];
  isIndexRoute: boolean;
  component: ComponentType<JSX.Element> | LazyExoticComponent<ComponentType<JSX.Element>>;
}
