import { contentData } from '@data/content';
import { calculateAge, calculateYearsOfExperience } from '@utils/dateUtils';
import { buildSections, checkSectionAvailability } from '@utils/sectionBuilder';

export const useHomeData = () => {
  const { contact } = contentData;
  const sectionChecks = checkSectionAvailability(contentData);
  const sections = buildSections(contentData, sectionChecks);

  return {
    age: calculateAge(contact.birthDate),
    yearsOfExperience: calculateYearsOfExperience(contact.firstJobDate),
    sectionChecks,
    sections,
    firstSection: sections.find((section) => section.id !== 'home'),
  };
};
