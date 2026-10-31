import type { Experience } from '@data/types';

export interface CompanyTenure {
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  /** Newest role first, matching the order in content.ts */
  roles: Experience[];
}

/**
 * Groups consecutive roles at the same company into one tenure, so a promotion
 * is just another content entry with the same `company`.
 */
export const groupExperience = (experience: Experience[]): CompanyTenure[] =>
  experience.reduce<CompanyTenure[]>((groups, job) => {
    const last = groups[groups.length - 1];
    if (last && last.company === job.company) {
      last.roles.push(job);
      last.startDate = job.startDate;
    } else {
      groups.push({
        company: job.company,
        city: job.city,
        startDate: job.startDate,
        endDate: job.endDate,
        roles: [job],
      });
    }
    return groups;
  }, []);
