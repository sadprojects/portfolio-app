import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { contentData } from './content';

const inPublic = (file: string) => existsSync(resolve('public', file));

/*
 * Guards against accidental edits to the words and data on the site. A deliberate change
 * updates the snapshot with `npx vp test -u`; the other checks must always hold.
 */
describe('content', () => {
  it('matches the approved copy', () => {
    expect(contentData).toMatchSnapshot();
  });

  it('only references media files that exist', () => {
    const { contact, projects, photography, games, sections } = contentData;
    const files = [
      `media/cv/${contact.cv}`,
      `media/images/${contact.profileImage}`,
      ...photography.map((photo) => `media/images/${photo.path}`),
      ...games.map((game) => `media/images/${game.icon}`),
      ...Object.values(sections)
        .flatMap((section) => section.banners ?? [])
        .map((banner) => `media/images/${banner.image}`),
      ...projects
        .filter((project) => project.video && !project.video.includes('youtu'))
        .flatMap((project) => [
          `media/videos/${project.video}.mp4`,
          `media/videos/${project.video}.jpg`,
        ]),
    ];
    expect(files.filter((file) => !inPublic(file))).toEqual([]);
  });

  it('lists experience newest first, with only the current role open-ended', () => {
    const { experience } = contentData;
    const starts = experience.map((job) => job.startDate);
    expect(starts).toEqual([...starts].sort().reverse());
    experience.forEach((job, i) => {
      expect(job.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(job.endDate === 'Present').toBe(i === 0);
      expect(job.responsibilities.length).toBeGreaterThan(0);
    });
  });

  it('links out over https only', () => {
    const { projects, certifications, social, photography, contact } =
      contentData;
    const urls = [
      ...projects.flatMap((p) => [p.repo, p.website, p.publication]),
      ...certifications.map((c) => c.url),
      ...social.map((s) => s.url),
      ...photography.map((p) => p.url),
      contact.calendly,
    ].filter(Boolean);
    urls.forEach((url) => expect(url).toMatch(/^https:\/\//));
  });

  it('has no duplicate skills, projects, photos or social links', () => {
    const { skills, projects, photography, social } = contentData;
    [
      skills.professional.map((s) => s.name),
      projects.map((p) => p.title),
      photography.map((p) => p.path),
      social.map((s) => s.name),
    ].forEach((names) => expect(new Set(names).size).toBe(names.length));
  });

  it('gives every section a label and every intro both a label and a line', () => {
    Object.values(contentData.sections).forEach((section) => {
      expect(section.label).toBeTruthy();
      if (section.intro) {
        expect(section.intro.label).toBeTruthy();
        expect(section.intro.text).toBeTruthy();
      }
    });
  });
});
