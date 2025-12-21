import { getEnabledSections, getSectionOrder, isSectionEnabled, SECTION_METADATA } from '@utils/sections';

describe('sections utility', () => {
  describe('isSectionEnabled', () => {
    it('should return true for enabled sections', () => {
      expect(isSectionEnabled('projects')).toBe(true);
      expect(isSectionEnabled('certifications')).toBe(true);
      expect(isSectionEnabled('skills')).toBe(true);
    });
  });

  describe('getSectionOrder', () => {
    it('should return the correct order for sections', () => {
      expect(getSectionOrder('experience')).toBe(1);
      expect(getSectionOrder('projects')).toBe(2);
      expect(getSectionOrder('skills')).toBe(3);
      expect(getSectionOrder('certifications')).toBe(4);
      expect(getSectionOrder('hobbies')).toBe(5);
      expect(getSectionOrder('contact')).toBe(6);
    });
  });

  describe('getEnabledSections', () => {
    it('should return an array of enabled sections', () => {
      const enabled = getEnabledSections();
      expect(Array.isArray(enabled)).toBe(true);
      expect(enabled.length).toBeGreaterThan(0);
    });

    it('should return sections in order', () => {
      const enabled = getEnabledSections();
      // Check that each section comes in the correct order
      const orders = enabled.map(id => getSectionOrder(id as keyof typeof import('@data/content').contentData.sections));
      const sortedOrders = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sortedOrders);
    });
  });

  describe('SECTION_METADATA', () => {
    it('should have metadata for all sections', () => {
      expect(SECTION_METADATA.projects).toBeDefined();
      expect(SECTION_METADATA.certifications).toBeDefined();
      expect(SECTION_METADATA.skills).toBeDefined();
      expect(SECTION_METADATA.experience).toBeDefined();
      expect(SECTION_METADATA.hobbies).toBeDefined();
      expect(SECTION_METADATA.contact).toBeDefined();
    });

    it('should have label and description for each section', () => {
      Object.values(SECTION_METADATA).forEach(meta => {
        expect(meta.label).toBeDefined();
        expect(meta.description).toBeDefined();
        expect(typeof meta.label).toBe('string');
        expect(typeof meta.description).toBe('string');
      });
    });
  });
});
