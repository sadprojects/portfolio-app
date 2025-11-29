import { Route } from '@models/route.model';
import React from 'react';

const HomePage = React.lazy(() => import('@pages/Home'));
const ContactPage = React.lazy(() => import('@pages/Contact'));

const routes: Route[] = [
  {
    label: '/home',
    path: '/home',
    component: HomePage,
    isIndexRoute: true,
  },
  {
    label: '/contact',
    path: '/contact',
    component: ContactPage,
    isIndexRoute: false,
  },
];

export default routes;
