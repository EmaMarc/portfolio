import type { Project } from "./types";

export const projects: readonly Project[] = [
  {
    id: "con-tacto",
    title: "Con=Tacto",
    year: 2026,
    role: {
      es: "Frontend Developer / Líder Frontend",
      en: "Frontend Developer / Frontend Lead",
    },
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Navigation",
      "AsyncStorage",
    ],
    highlights: [],
    links: {
      repository:
        "https://github.com/Juan-Ignacio-Bordignon/Innova-Lav-grupo-5/tree/frontend",
      demo: "https://www.linkedin.com/feed/update/urn:li:activity:7490952228350894080/",
    },
    featured: true,
  },
  {
    id: "manny-maquinarias",
    title: "Manny Maquinarias",
    year: 2025,
    role: {
      es: "Frontend Developer",
      en: "Frontend Developer",
    },
    technologies: [
      "Angular 19",
      "TypeScript",
      "SCSS",
      "RxJS",
      "NestJS",
      "JWT",
      "Mercado Pago",
    ],
    highlights: [],
    links: {
      frontendRepository: "https://github.com/juanmasisti/Alquileres-Front",
      backendRepository: "https://github.com/facu-carri/Alquileres-Back",
      demo: "https://www.linkedin.com/feed/update/urn:li:activity:7491195807241764864/",
    },
    featured: true,
  },
  {
    id: "mythica-books",
    title: "Mythica Books",
    year: 2024,
    technologies: [],
    highlights: [],
    links: {
      repository: "https://github.com/EmaMarc/React_eCommerce",
    },
    featured: true,
  },
  {
    id: "ai-chatbot",
    title: "AI ChatBot",
    year: 2024,
    technologies: [],
    highlights: [],
    links: {
      demo: "https://www.linkedin.com/feed/update/urn:li:activity:7266954231939518465/",
    },
  },
  {
    id: "nutriguia",
    title: "Nutriguía",
    year: 2021,
    technologies: [],
    highlights: [],
    links: {
      repository: "https://github.com/EmaMarc/CaC_Nutriguia.github.io",
    },
  },
  {
    id: "barberhood",
    title: "Barberhood",
    year: 2021,
    technologies: [],
    highlights: [],
    links: {
      demo: "https://www.linkedin.com/feed/update/urn:li:activity:7199908939172392961/",
    },
  },
];

// TODO: Completar role, summary, technologies, highlights, media y links cuando esten confirmados.
