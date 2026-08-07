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
} satisfies Profile;
