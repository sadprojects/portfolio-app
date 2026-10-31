import type { Experience } from '@data/types';

import { groupExperience } from './groupExperience';

const job = (over: Partial<Experience>): Experience => ({
  position: 'Dev',
  company: 'Acme',
  city: 'Bucharest',
  startDate: '2020-01-01',
  endDate: '2021-01-01',
  responsibilities: [],
  ...over,
});

describe('groupExperience', () => {
  it('merges consecutive roles at the same company into one tenure', () => {
    const groups = groupExperience([
      job({
        position: 'Lead',
        startDate: '2026-10-01',
        endDate: 'Present',
      }),
      job({
        position: 'Senior',
        startDate: '2024-02-01',
        endDate: '2026-09-30',
      }),
      job({
        position: 'Dev',
        company: 'Other',
        startDate: '2022-01-01',
        endDate: '2024-02-01',
      }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].roles.map((r) => r.position)).toEqual(['Lead', 'Senior']);
    expect(groups[0].startDate).toBe('2024-02-01');
    expect(groups[0].endDate).toBe('Present');
    expect(groups[1].company).toBe('Other');
  });

  it('keeps non-consecutive stints at the same company separate', () => {
    const groups = groupExperience([
      job({ company: 'Acme' }),
      job({ company: 'Other' }),
      job({ company: 'Acme' }),
    ]);
    expect(groups.map((g) => g.company)).toEqual(['Acme', 'Other', 'Acme']);
  });
});
