import type { ContentData } from './types';

/*
 * Everything a visitor reads lives in this file: edit here when a job, skill, project or photo
 * changes. The order of sections, their icons and how each one animates open are design
 * decisions and live in pages/Home/sections.tsx; the shapes are documented in ./types.ts.
 */
export const contentData: ContentData = {
  sections: {
    home: { label: 'Home' },
    experience: {
      label: 'Experience',
      title: 'Experience',
      intro: {
        label: 'Where I work',
        text: 'Eight years of building for the web, from WordPress themes and plugins to the trading tools my team builds today.',
      },
    },
    projects: {
      label: 'Projects',
      intro: {
        label: 'Side projects',
        text: 'Things I built to learn something, mostly after hours.',
      },
    },
    skills: {
      label: 'Skills',
      title: 'Skills & Credentials',
      intro: {
        label: 'Craft',
        text: 'Front-end first, full-stack when the job needs it. The tools I work with, and the credentials behind them.',
      },
    },
    hobbies: {
      label: 'Hobbies',
      title: 'My Hobbies',
      intro: {
        label: 'Off the clock',
        text: 'A camera, a controller, and the occasional long drive somewhere old.',
      },
      banners: [
        {
          image: 'mountains_md.jpg',
          caption: 'Cold air, clear head.',
          alt: 'Snow-dusted mountain peaks behind a spruce tree',
          exif: {
            camera: 'Nikon D3500',
            date: 'Dec 2020',
            location: 'Bușteni, Romania',
          },
        },
        {
          image: 'lake-house_md.jpg',
          caption: 'Still water, loud sky.',
          alt: 'Wooden lake house with a red roof at dusk',
          exif: { camera: 'Nikon D3500', date: 'Dec 2020' },
        },
        {
          image: 'castle_md.jpg',
          caption: 'Weekends are for the camera.',
          alt: 'Aerial view of Tsarevets fortress in Veliko Tarnovo',
          exif: { camera: 'DJI Air 2S', location: 'Veliko Tarnovo, Bulgaria' },
        },
        {
          image: 'nike_md.jpg',
          caption: 'The best frames are a hike away.',
          alt: 'Person standing on a rock over a cliff',
          exif: {
            camera: 'Nikon D3500',
            date: 'Aug 2021',
            location: 'Brașov, Romania',
          },
        },
        {
          image: 'jack_md.jpg',
          caption: 'Kit on the table, week over.',
          alt: 'Jack Daniels glass with a Nikon and AirPods',
          exif: { camera: 'Nikon D3500', date: 'May 2021' },
        },
        {
          image: 'boat_md.jpg',
          caption: 'Slow mornings, quiet shores.',
          alt: 'Green sailing boat on the beach',
          exif: { camera: 'Nikon D3500', date: 'Jul 2022' },
        },
      ],
    },
    contact: { label: 'Contact' },
  },
  certifications: [
    {
      title:
        'Published Research: Neural Network Based System for Disease Prediction',
      url: 'https://www.researchgate.net/publication/357430190_Neural_Network_Based_System_for_Disease_Prediction',
      issuer: 'ResearchGate',
      date: 'Dec 2021',
    },
    {
      title: 'Microsoft Certified - Azure Fundamentals',
      url: 'https://learn.microsoft.com/api/credentials/share/en-gb/SilviuDinu-1202/D2162FE9FCA167E1?sharingId=79B7C1ADC9510DE6',
      issuer: 'Microsoft',
      date: '18 Sep 2023',
    },
    {
      title: 'MongoDB - SI Associate Certification',
      url: 'https://learn.mongodb.com/c/yHhzIyEdQC6KznCAMnlgsg',
      issuer: 'MongoDB University',
      date: '16 Jun 2023',
    },
  ],
  contact: {
    email: 'silviualexd@gmail.com',
    name: 'Silviu Dinu',
    position: 'Lead Software Engineer',
    location: 'Bucharest, Romania',
    birthDate: '1996-09-18',
    firstJobDate: '2018-07-01',
    profileImage: 'me.webp',
    cv: 'Silviu_Alexandru_Dinu_CV_EN.pdf',
  },
  education: [
    {
      position: 'MSc, Advanced Signal Processing in Multimedia Applications',
      company: 'Automatic Control and Computer Science, POLITEHNICA University',
      city: 'Bucharest',
      period: '2020 - 2022',
    },
    {
      position: 'BSc, Systems Engineering',
      company: 'Automatic Control and Computer Science, POLITEHNICA University',
      city: 'Bucharest',
      period: '2016 - 2020',
    },
    {
      position: 'High School',
      company: 'Alexandru Ioan Cuza National College',
      city: 'Ploiești',
      period: '2012 - 2016',
    },
  ],
  games: [
    { title: 'Witcher 3: Wild Hunt', icon: 'witcher3.jpg' },
    { title: 'Elden Ring', icon: 'elden_ring.jpg' },
    { title: 'Red Dead Redemption 2', icon: 'rdr2.jpg' },
    { title: 'The Last Of Us', icon: 'tlou.jpg' },
    { title: 'Serious Sam', icon: 'serious_sam.jpg' },
  ],
  photography: [
    {
      path: 'mountains.jpg',
      url: 'https://unsplash.com/photos/FAekx3o6JSk',
      alt: 'Mountains picture',
    },
    {
      path: 'tree.jpg',
      url: 'https://unsplash.com/photos/qJIgaF44sTg',
      alt: 'Tree picture',
    },
    {
      path: 'lake-house.jpg',
      url: 'https://unsplash.com/photos/qWvKHnu9lyY',
      alt: 'Lake house picture',
    },
    {
      path: 'chicken.jpg',
      url: 'https://unsplash.com/photos/E0UIsf77SkQ',
      alt: 'Chicken picture',
    },
    {
      path: 'nike.jpg',
      url: 'https://unsplash.com/photos/CuxlhYpBsfA',
      alt: 'Person standing on a rock over a cliff',
    },
    {
      path: 'jack.jpg',
      url: 'https://unsplash.com/photos/U172-ZN0Jjg',
      alt: 'Jack Daniels glass with Nikon and Airpods',
    },
    {
      path: 'sunflower.jpg',
      url: 'https://unsplash.com/photos/KvB0Cgz3SSs',
      alt: 'Sunflower picture',
    },
    {
      path: 'boat.jpg',
      url: 'https://unsplash.com/photos/BBYbtPQU9LQ',
      alt: 'Green sailing boat on the beach',
    },
    {
      path: 'drone.jpg',
      url: 'https://unsplash.com/photos/2vajkRGV08E',
      alt: 'Picture of DJI Air 2S drone',
    },
  ],
  introduction: [
    "{{age}} years old, based in Bucharest. I've spent {{years}}+ years building for the web, from WordPress themes and plugins to the trading tools at London Stock Exchange Group, where I now lead a team and still write code every day.",
    'Off the clock I shoot photos and lose evenings to open-world games.',
  ],
  footer: 'Built with ❤️ by Silviu Dinu',
  homepage: {
    title: 'I make software people actually enjoy using.',
    portraitCaption: "that's me",
  },
  greetings: {
    timeBasedGreetings: [
      { type: 'morning', message: 'Good morning!' },
      { type: 'afternoon', message: 'Good afternoon!' },
      { type: 'evening', message: 'Good evening!' },
    ],
    casualGreetings: ['Hi!', 'Hey!', 'Hello!'],
    introductions: ["I'm Silviu"],
    weatherGreetings: {
      sunny: ['Lovely day!', 'Sunshine!', 'Beautiful!'],
      rainy: ['Rainy day!', 'Cozy weather!', 'Perfect for coding!'],
      cloudy: ['Cloudy today!', 'Grey skies!'],
      snowy: ['Winter vibes!', 'Stay warm!', 'Snowy day!'],
      cold: ['Stay warm!', 'Brr! Cold!', 'Cold today!'],
      hot: ['Hot day!', 'Stay cool!', 'Summer heat!'],
    },
  },
  projects: [
    {
      title: 'Sudoku Solver & Game',
      city: 'Bucharest',
      description:
        'Sudoku, built into this site. Puzzles are generated and solved with backtracking; there are four difficulties, live validation, a timer and local best times. Click to play.',
      period: 'Dec 2025',
      tools: [
        'React',
        'TypeScript',
        'Backtracking Algorithm',
        'LocalStorage',
        'Styled Components',
      ],
      repo: 'https://github.com/SilviuDinu/portfolio-app',
      easterEgg: 'sudoku',
    },
    {
      title: 'This Website',
      city: 'Bucharest',
      description:
        'The site you are on. Started as an Angular app in 2021, rebuilt in React with the scroll-driven layout in 2026.',
      period: 'Aug 2021 - Present',
      tools: [
        'React',
        'TypeScript',
        'Styled Components',
        'Framer Motion',
        'Vite+',
      ],
      repo: 'https://github.com/SilviuDinu/portfolio-app',
      video: 'portfolio-app',
    },
    {
      title: 'React Weather App',
      city: 'Ploiești',
      description:
        'A weather app built with React and Express. Search any city in the world, or let it detect your location and show the forecast there.',
      period: 'Jun 2021 - Jul 2021',
      tools: [
        'React Hooks',
        'React Router',
        'Express',
        'REST APIs',
        'Typescript',
        'MongoDB',
      ],
      website: 'https://forecast-report.com/',
      repo: 'https://github.com/SilviuDinu/react-weather-app',
      video: 'react-weather-app',
    },
    {
      title: 'WebSockets Chat',
      city: 'Ploiești',
      description:
        'A real-time chat room built with React and Socket.io. Everyone connected sees each message as it is sent.',
      period: 'Apr 2021',
      tools: [
        'React Hooks',
        'Node.JS',
        'Websockets',
        'Socket.io',
        'Typescript',
      ],
      repo: 'https://github.com/SilviuDinu/web-sockets-chat',
      video: 'web-sockets-chat',
    },
    {
      title: 'URL Shortener',
      city: 'Ploiești',
      description:
        'A URL shortener like bit.ly, built with Vue, Express and MongoDB. Paste a long link and get a short one.',
      period: 'Oct 2020',
      tools: ['VueJS', 'NodeJS', 'Express', 'MongoDB', 'REST APIs'],
      repo: 'https://github.com/SilviuDinu/url-shortener',
      video: 'url-shortener',
    },
    {
      title: 'Disease Predictor',
      city: 'Ploiești',
      description:
        'A neural network that maps symptoms to the most likely disease, served from a Flask API. Published on ResearchGate.',
      period: 'Apr 2021 - May 2021',
      tools: [
        'Python',
        'PyTorch',
        'Machine Learning',
        'Flask',
        'REST APIs',
        'Data Science',
      ],
      repo: 'https://github.com/SilviuDinu/cercetare_sem2_BE',
      video: 'disease-predictor',
      publication:
        'https://www.researchgate.net/publication/357430190_Neural_Network_Based_System_for_Disease_Prediction',
    },
    {
      title: 'Smoke Detector',
      city: 'Bucharest',
      description:
        'A Raspberry Pi with a gas sensor and a Python script. Past a threshold, it emails me the readings.',
      period: 'Nov 2018 – Dec 2018',
      tools: ['Linux', 'Raspberry PI', 'Python', 'Electronics', 'SMTP'],
      repo: 'https://github.com/SilviuDinu/smoke-detector',
      video: 'https://youtu.be/-RQZF3_onj4',
    },
  ],
  skills: {
    professional: [
      { name: 'JavaScript', category: 'Frontend', level: 95 },
      { name: 'TypeScript', category: 'Frontend', level: 90 },
      { name: 'React', category: 'Frontend', level: 95 },
      { name: 'Angular', category: 'Frontend', level: 86 },
      { name: 'AngularJS', category: 'Frontend', level: 75 },
      { name: 'Vue.js', category: 'Frontend', level: 65 },
      { name: 'HTML & CSS', category: 'Frontend', level: 90 },
      { name: 'Node.js & Express', category: 'Backend & data', level: 80 },
      { name: 'REST APIs', category: 'Backend & data', level: 82 },
      {
        name: 'WebSockets & Socket.io',
        category: 'Backend & data',
        level: 68,
      },
      { name: 'MongoDB', category: 'Backend & data', level: 72 },
      { name: 'PHP', category: 'Backend & data', level: 57 },
      { name: 'Python & PyTorch', category: 'AI & data', level: 72 },
      { name: 'Neural networks', category: 'AI & data', level: 68 },
      { name: 'AI agents & MCP', category: 'AI & data', level: 75 },
    ],
    languages: ['English', 'Romanian', 'Japanese (N5)'],
    developmentTools: [
      'Git',
      'Jira',
      'Azure',
      'MongoDB Compass',
      'AWS',
      'Jenkins',
      'SonarQube',
    ],
  },
  social: [
    {
      name: 'github',
      url: 'https://github.com/SilviuDinu',
    },
    {
      name: 'facebook',
      url: 'https://www.facebook.com/slv.alex96',
    },
    {
      name: 'twitter',
      url: 'https://twitter.com/silviualexd',
    },
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/in/silviu-alexandru-dinu-138128151/',
    },
  ],
  experience: [
    {
      position: 'Lead Software Engineer',
      company: 'London Stock Exchange Group',
      city: 'Bucharest',
      startDate: '2026-10-01',
      endDate: 'Present',
      responsibilities: [
        'Lead a team of engineers building the trading and analytics tools our users rely on every day; own technical direction, code quality and delivery',
        'Mentor engineers, run design reviews and keep the team shipping, while staying hands-on in the codebase',
        "Brought AI into the team's daily work: coding agents for everyday tasks, MCP servers connected to our internal tooling, and the same code review for their output as for ours",
        'Stack: React, TypeScript, WebSockets, SharedWorkers, CI/CD, AI agents, MCP',
      ],
    },
    {
      position: 'Senior Software Engineer',
      company: 'London Stock Exchange Group',
      city: 'Bucharest',
      startDate: '2024-02-01',
      endDate: '2026-09-30',
      responsibilities: [
        'Built the front end of trading and analytics tools traders use all day: live data over WebSockets, state shared across tabs with SharedWorkers, and the CI/CD that got it to production',
        'Promoted to Lead Software Engineer in October 2026',
        'Stack: React, TypeScript, WebSockets, SharedWorkers, CI/CD',
      ],
    },
    {
      position: 'Full Stack Developer',
      company: 'Cognizant',
      city: 'Bucharest',
      startDate: '2022-10-01',
      endDate: '2024-02-01',
      responsibilities: [
        'Full-stack delivery on a client platform: React on AEM, Node.js services, MongoDB, Algolia search',
        'Brought product ideas to the table, not just tickets',
        'Stack: React, Node.js, MongoDB, AEM, Algolia',
      ],
    },
    {
      position: 'Full Stack Developer',
      company: 'EPAM Systems',
      city: 'Bucharest',
      startDate: '2021-10-01',
      endDate: '2022-10-01',
      responsibilities: [
        'Shipped web and hybrid-mobile features end to end with Angular, Node.js, Ionic and Cordova',
        'Stack: Angular, AngularJS, Node.js, TypeScript, Ionic, Cordova',
      ],
    },
    {
      position: 'Consultant - Middle Frontend Developer',
      company: 'Deloitte Digital',
      city: 'Bucharest',
      startDate: '2020-02-01',
      endDate: '2021-10-01',
      responsibilities: [
        'Front-end consultant sitting with clients directly: Angular and React builds, and owning the conversations about scope and trade-offs',
        'Stack: Angular, AngularJS, React, SCSS, Node.js, Jira',
      ],
    },
    {
      position: 'Junior Programmer - Technical Support Engineer',
      company: 'Themeisle',
      city: 'Bucharest',
      startDate: '2018-07-01',
      endDate: '2020-02-01',
      responsibilities: [
        'Helped customers build and fix WordPress sites',
        'Debugged and reported issues across PHP, CSS, JavaScript and MySQL',
      ],
    },
  ],
  codewars: {
    username: 'SilviuDinu',
  },
};
