const anchorByLegacyPath: Record<string, string> = {
  home: '',
  projects: 'projects',
  certifications: 'skills',
  skills: 'skills',
  experience: 'experience',
  hobbies: 'hobbies',
  contact: 'contact',
};

export const redirectLegacyPath = (): boolean => {
  const path = window.location.pathname.slice(1);
  if (!path) return true;
  const anchor = anchorByLegacyPath[path];
  if (anchor === undefined) return false;
  window.history.replaceState(null, '', anchor ? `/#${anchor}` : '/');
  return true;
};
