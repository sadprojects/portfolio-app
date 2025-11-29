import type { ContentData } from './types';

export const contentData: ContentData = {
  certifications: [
    {
      title: "Microsoft Certified - Azure Fundamentals",
      url: "https://learn.microsoft.com/api/credentials/share/en-gb/SilviuDinu-1202/D2162FE9FCA167E1?sharingId=79B7C1ADC9510DE6",
      date: "18 Sep 2023"
    },
    {
      title: "MongoDB - SI Associate Certification",
      url: "https://learn.mongodb.com/c/yHhzIyEdQC6KznCAMnlgsg",
      date: "16 Jun 2023"
    }
  ],
  contact: {
    email: "silviualexd@gmail.com",
    phone: "+40730799252",
    name: "Silviu Dinu",
    position: "Senior Software Engineer",
    location: "Bucharest, Romania",
    birthDate: "1996-09-18",
    firstJobDate: "2018-07-01",
    linkedin: "https://www.linkedin.com/in/silviu-alexandru-dinu-138128151/",
    linkedinMessaging: "https://www.linkedin.com/messaging/compose/?recipientId=silviu-alexandru-dinu-138128151",
  },
  education: [
    {
      position: "MASTER'S DEGREE IN ADVANCED SIGNAL PROCESSING IN MULTIMEDIA APPs",
      company: "Automatic Control and Computer Science, POLITEHNICA University",
      city: "Bucharest",
      period: "2020 - 2022",
      responsibilities: ["Machine learning research work: https://www.researchgate.net/publication/357430190_Neural_Network_Based_System_for_Disease_Prediction"]
    },
    {
      position: "BACHELOR'S DEGREE IN SYSTEMS ENGINEERING",
      company: "Automatic Control and Computer Science, POLITEHNICA University",
      city: "Bucharest",
      period: "2016 - 2020"
    },
    {
      position: "Highscool",
      company: "Alexandru Ioan Cuza National College",
      city: "Ploiești",
      period: "2012 - 2016"
    }
  ],
  games: [
    { title: "Witcher 3: Wild Hunt", icon: "witcher3.svg" },
    { title: "Elden Ring", icon: "eldenring.png" },
    { title: "Red Dead Redemption 2", icon: "rdr2.svg" },
    { title: "The Last Of Us", icon: "tlou.svg" },
    { title: "Serious Sam", icon: "serious_sam.svg" }
  ],
  photography: [
    { path: "mountains.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/FAekx3o6JSk", alt: "Mountains picture", type: "generic" },
    { path: "tree.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/qJIgaF44sTg", alt: "Tree picture", type: "generic" },
    { path: "lake-house.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/qWvKHnu9lyY", alt: "Lake house picture", type: "generic" },
    { path: "chicken.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/E0UIsf77SkQ", alt: "Chicken picture", type: "generic" },
    { path: "nike.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/CuxlhYpBsfA", alt: "Person standing on a rock over a cliff", type: "generic" },
    { path: "jack.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/U172-ZN0Jjg", alt: "Jack Daniels glass with Nikon and Airpods", type: "generic" },
    { path: "sunflower.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/KvB0Cgz3SSs", alt: "Sunflower picture", type: "generic" },
    { path: "boat.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/BBYbtPQU9LQ", alt: "Green sailing boat on the beach", type: "generic" },
    { path: "drone.jpg", width: 300, height: 300, url: "https://unsplash.com/photos/2vajkRGV08E", alt: "Picture of DJI Air 2S drone", type: "generic" }
  ],
  introduction: [
    "{{age}}-year-old Senior Software Engineer based in Bucharest, Romania. Building exceptional digital experiences with modern web technologies."
  ],
  footer: "Built with ❤️ by Silviu Dinu",
  homepage: { title: "Hello there!" },
  projects: [
    {
      title: "Resume / presentation website",
      city: "Ploiești",
      description: "A presentation app built for myself containing information like: resume, who am I and what I do, hobbies and more.",
      period: "Aug 2021",
      tools: ["Angular 12", "Angular Router", "Angular Material", "Typescript", "RxJS"],
      website: "#",
      repo: "https://github.com/SilviuDinu/portfolio-app",
      video: "portfolio-app"
    },
    {
      title: "React Weather App",
      city: "Ploiești",
      description: "A weather app built with React and Express which enables the user to search the weather in certain cities around the world. The app automatically detects your location and displays the weather information that is most relevant to you.",
      period: "Jun 2021 - Jul 2021",
      tools: ["React Hooks", "React Router", "Express", "REST APIs", "Typescript", "MongoDB"],
      website: "https://forecast-report.com/",
      repo: "https://github.com/SilviuDinu/react-weather-app",
      video: "react-weather-app"
    },
    {
      title: "Web Sockets Chat",
      city: "Ploiești",
      description: "A web chat application built with React on the FE and socket.io running on the BE. Users can connect to the chat room and exchange messages with each other.",
      period: "Apr 2021",
      tools: ["React Hooks", "Node.JS", "Websockets", "Socket.io", "Typescript"],
      repo: "https://github.com/SilviuDinu/web-sockets-chat",
      video: "web-sockets-chat"
    },
    {
      title: "Url Shortener",
      city: "Ploiești",
      description: "A web app created with VueJS and Express that enables the users to create short URLs. (similar to bit.ly). The 'Copy to clipboard' feature might not work due to the fact that the SSL certificate expired (https -> http).",
      period: "Oct 2020",
      tools: ["VueJS", "NodeJS", "Express", "MongoDB", "REST APIs"],
      website: "https://slv.lol/",
      repo: "https://github.com/SilviuDinu/url-shortener",
      video: "url-shortener"
    },
    {
      title: "Disease predictor",
      city: "Ploiești",
      description: "I engineered, fine-tuned, and validated a Neural Network that takes medical symptoms as input and forecasts the most likely corresponding disease. This model serves as the central element of a Flask-based backend server, which I also developed. This server is part of a custom API designed to interact with a frontend, accepting symptom data and returning the predicted disease.",
      period: "Apr 2021 - May 2021",
      tools: ["Python", "PyTorch", "Machine Learning", "Flask", "REST APIs", "Data Science"],
      repo: "https://github.com/SilviuDinu/cercetare_sem2_BE",
      video: "disease-predictor"
    },
    {
      title: "Smoke detector",
      city: "Bucharest",
      description: "A smoke-detection system built using Python. When a certain value of gas or smoke is detected, I'm getting notified via email with a warning containing the details.",
      period: "Nov 2018 – Dec 2018",
      tools: ["Linux", "Raspberry PI", "Python", "Electronics", "SMTP"],
      repo: "https://github.com/SilviuDinu/smoke-detector",
      video: "https://youtu.be/-RQZF3_onj4"
    }
  ],
  skills: {
    professional: [
      { name: "Javascript", level: 90, priority: 1 },
      { name: "Angular", level: 86, priority: 1 },
      { name: "AngularJS", level: 75, priority: 1 },
      { name: "ReactJS", level: 83, priority: 1 },
      { name: "VueJS", level: 65, priority: 2 },
      { name: "NodeJS / Express", level: 80, priority: 1 },
      { name: "Socket.io", level: 68, priority: 2 },
      { name: "HTML / CSS / SCSS / LESS / SASS", level: 90, priority: 2 },
      { name: "MongoDB, PostgreSQL, MySQL", level: 72, priority: 2 },
      { name: "REST APIs", level: 82, priority: 2 },
      { name: "Python / PyTorch for ML", level: 72, priority: 2 },
      { name: "Php", level: 57, priority: 2 }
    ],
    languages: ["English", "Romanian"],
    developmentTools: ["Git", "Jira", "Azure", "MongoDB Compass", "AWS", "Jenkins", "SonarCloud"],
    personal: ["Reliable and professional", "Efficient communicator", "Organised", "Punctual", "Team player", "Fast learner", "Motivated", "Curious"]
  },
  social: [
    { name: "github", url: "https://github.com/SilviuDinu", icon: "github-logo" },
    { name: "facebook", url: "https://www.facebook.com/slv.alex96", icon: "facebook-circle" },
    { name: "twitter", url: "https://twitter.com/silviualexd", icon: "twitter" },
    { name: "linkedin", url: "https://www.linkedin.com/in/silviu-alexandru-dinu-138128151/", icon: "linkedin-circle" }
  ],
  technologies: {
    description: "When it comes to web technologies, I'm very passionate about everything that's out there, and since they are always changing, I try to keep up with the latest and greatest. Here are a few that I've worked with:",
    items: [
      { key: "react", name: "ReactJS", icon: "reactjs.svg" },
      { key: "angular", name: "Angular", icon: "angular.svg" },
      { key: "angularjs", name: "AngularJS", icon: "angularjs.svg" },
      { key: "typescript", name: "Typescript", icon: "typescript.svg" },
      { key: "node", name: "NodeJS", icon: "nodejs.svg" },
      { key: "express", name: "Express", icon: "express.svg" },
      { key: "vue", name: "VueJS", icon: "vuejs.svg" },
      { key: "socket", name: "Socket.io", icon: "socketio.svg" },
      { key: "js", name: "Javascript", icon: "javascript.svg" },
      { key: "rest", name: "REST APIs", icon: "rest.svg" },
      { key: "mongo", name: "MongoDB", icon: "mongodb.svg" },
      { key: "postgres", name: "PostgreSQL", icon: "postgresql.svg" },
      { key: "mysql", name: "MySQL", icon: "mysql.svg" },
      { key: "php", name: "Php", icon: "php.svg" },
      { key: "python", name: "Python", icon: "python.svg" },
      { key: "pytorch", name: "Pytorch", icon: "pytorch.svg" },
      { key: "html", name: "HTML", icon: "html.svg" },
      { key: "css", name: "CSS", icon: "css.svg" },
      { key: "sass", name: "SASS", icon: "sass.svg" }
    ]
  },
  experience: [
    {
      position: "Senior Software Engineer",
      company: "London Stock Exchange Group",
      city: "Bucharest",
      startDate: "2024-02-01",
      endDate: "Present",
      responsibilities: [
        "In my role as a Senior Full Stack Developer, I focus on developing cutting-edge software solutions that simplify financial operations and elevate the user experience. My contributions are central to equipping our users with dependable and effective financial tools",
        "Working with tools like: React, Websockets, SharedWorkers, Gitlab CI/CD"
      ]
    },
    {
      position: "Full Stack Developer",
      company: "Cognizant",
      city: "Bucharest",
      startDate: "2022-10-01",
      endDate: "2024-02-01",
      responsibilities: [
        "As a Full Stack Developer in my current project, I not only engineer scalable and efficient software solutions but also contribute strategic business ideas aimed at boosting customer revenue",
        "Working with tools like: React, NodeJS, MongoDB, AEM, Algolia"
      ]
    },
    {
      position: "Full Stack Developer",
      company: "EPAM Systems",
      city: "Bucharest",
      startDate: "2021-10-01",
      endDate: "2022-10-01",
      responsibilities: [
        "Consistently delivering superior quality services to our valued clients",
        "Working with tools like: AngularJS, Angular, NodeJS, Ionic, Cordova, Typescript"
      ]
    },
    {
      position: "Consultant - Middle Frontend Developer",
      company: "Deloitte Digital",
      city: "Bucharest",
      startDate: "2020-02-01",
      endDate: "2021-10-01",
      responsibilities: [
        "Proactively collaborating with clients to deliver premium services and consultancy, ensuring excellence in my contributions",
        "Working with tools like: AngularJS, Angular, React, SCSS, NodeJS, Jira"
      ]
    },
    {
      position: "Junior Programmer - Technical Support Engineer",
      company: "Themeisle",
      city: "Bucharest",
      startDate: "2018-07-01",
      endDate: "2020-02-01",
      responsibilities: [
        "Assisting clients in developing robust WordPress websites",
        "Solving/reporting bugs and debugging (PHP, CSS, JavaScript, MySQL)"
      ]
    }
  ]
};
