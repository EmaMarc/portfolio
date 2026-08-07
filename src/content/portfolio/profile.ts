import type { Profile } from "./types";

export const profile = {
  name: "Emanuel Marcello",
  professionalTitle: {
    es: "Desarrollador Frontend / Full Stack",
    en: "Frontend / Full Stack Developer",
  },
  summary: {
    es: "Estudiante de Licenciatura en Sistemas en la UNLP y desarrollador frontend con experiencia en aplicaciones web y móviles utilizando React Native, Expo, Angular y TypeScript. Experiencia en integración de APIs REST, autenticación mediante tokens y roles, navegación, componentes reutilizables y flujos asíncronos. Cuento además con conocimientos de backend en Node.js, Express.js, NestJS, Java, Spring Boot, SQL y PostgreSQL.",
    en: "Systems student at UNLP (Universidad Nacional de La Plata) and Frontend Developer with experience building web and mobile applications using React Native, Expo, Angular, and TypeScript. Experienced in REST API integration, token- and role-based authentication, navigation, reusable components, and asynchronous workflows. Additional backend knowledge includes Node.js, Express.js, NestJS, Java, Spring Boot, SQL, and PostgreSQL.",
  },
  location: "La Plata, Buenos Aires, Argentina",
  email: "Emanuel.Marcello.Dev@gmail.com",
  links: {
    github: "https://github.com/EmaMarc",
    linkedin: "https://www.linkedin.com/in/emamarcello",
  },
  education: [
    {
      id: "unlp-systems-degree",
      institution: "Universidad Nacional de La Plata - Facultad de Informática",
      title: {
        es: "Licenciatura en Sistemas",
        en: "B.Sc. in Computer Science (Licenciatura en Sistemas)",
      },
      period: {
        start: "2022",
      },
    },
    {
      id: "rafael-hernandez-high-school",
      institution:
        "Colegio Nacional “Rafael Hernández”, Universidad Nacional de La Plata",
      title: {
        es: "Bachiller",
        en: "High School Diploma",
      },
      period: {
        start: "2015",
        end: "2021",
      },
    },
  ],
  certifications: [
    {
      id: "talento-tech-backend-node",
      name: {
        es: "Back-End / Node.js",
        en: "Back-End / Node.js",
      },
      issuer: {
        es: "Talento Tech - Ministerio de Educación de la Ciudad de Buenos Aires",
        en: "Talento Tech - Ministry of Education of the City of Buenos Aires",
      },
      year: 2025,
      hours: 80,
    },
    {
      id: "oracle-one-java-spring-g7",
      name: {
        es: "Java y Spring Framework G7",
        en: "Java and Spring Framework G7",
      },
      issuer: {
        es: "ONE - Oracle Next Education / Alura Latam",
        en: "ONE - Oracle Next Education / Alura Latam",
      },
      year: 2025,
      hours: 102,
    },
    {
      id: "talento-tech-frontend-js",
      name: {
        es: "Front-End JS",
        en: "Front-End JS",
      },
      issuer: {
        es: "Talento Tech - Ministerio de Educación de la Ciudad de Buenos Aires",
        en: "Talento Tech - Ministry of Education of the City of Buenos Aires",
      },
      year: 2024,
    },
    {
      id: "english-for-it",
      name: {
        es: "English for IT",
        en: "English for IT",
      },
      issuer: {
        es: "ESP IT - Ministerio de Educación de la Nación Argentina",
        en: "ESP IT - Ministry of Education of Argentina",
      },
      year: 2022,
      hours: 64,
    },
  ],
  languages: [
    {
      id: "spanish",
      name: {
        es: "Español",
        en: "Spanish",
      },
      proficiency: {
        es: "Nativo",
        en: "Native",
      },
    },
    {
      id: "english",
      name: {
        es: "Inglés",
        en: "English",
      },
      proficiency: {
        es: "C1 (avanzado)",
        en: "C1 (advanced)",
      },
      note: {
        es: "Formación especializada en English for IT (ESP IT).",
        en: "Specialized training in English for IT (ESP IT).",
      },
    },
  ],
} satisfies Profile;
