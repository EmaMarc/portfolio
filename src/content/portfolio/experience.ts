import type { Experience } from "./types";

export const experiences: readonly Experience[] = [
  {
    id: "innova-lab",
    company: "Innova Lab",
    role: {
      es: "Frontend Developer / Líder Frontend",
      en: "Frontend Developer / Frontend Lead",
    },
    period: {
      start: "2026-02",
      end: "2026-07",
    },
    highlights: [
      {
        es: "Desarrollé pantallas y flujos para autenticación, inicio, módulos, lecciones, ejercicios, favoritos, perfil y progreso.",
        en: "Developed screens and flows for authentication, onboarding, modules, lessons, exercises, favorites, profile, and progress tracking.",
      },
      {
        es: "Integré APIs REST, autenticación basada en tokens y estados de carga, error y respuestas vacías.",
        en: "Integrated REST APIs, token-based authentication, and loading, error, and empty-state handling.",
      },
      {
        es: "Implementé navegación tipada con React Navigation, componentes reutilizables, AsyncStorage y tracking de eventos para QA.",
        en: "Implemented typed navigation with React Navigation, reusable components, AsyncStorage, and event tracking for QA.",
      },
      {
        es: "Coordiné tareas y criterios técnicos del equipo frontend y colaboré con backend y QA mediante ramas feature y pull requests.",
        en: "Coordinated tasks and technical criteria for the frontend team and collaborated with backend and QA through feature branches and pull requests.",
      },
      {
        es: "Validé la calidad técnica con TypeScript, Expo Doctor y revisiones de integración.",
        en: "Validated technical quality using TypeScript, Expo Doctor, and integration reviews.",
      },
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Navigation",
      "AsyncStorage",
    ],
  },
  {
    id: "unlp-professional-practice",
    company: "Universidad Nacional de La Plata",
    role: {
      es: "Práctica Profesional - Frontend Developer",
      en: "Professional Internship - Frontend Developer",
    },
    period: {
      start: "2025-07",
      end: "2025-12",
    },
    highlights: [
      {
        es: "Desarrollé funcionalidades frontend para una aplicación web de gestión y alquiler de maquinarias con Angular 19, TypeScript, SCSS y RxJS.",
        en: "Developed frontend features for a machinery management and rental web application using Angular 19, TypeScript, SCSS, and RxJS.",
      },
      {
        es: "Implementé interfaces para autenticación, registro, recuperación de contraseña, perfiles, usuarios, maquinarias, reservas, alquileres y estadísticas.",
        en: "Implemented interfaces for authentication, registration, password recovery, profiles, users, machinery, reservations, rentals, and statistics.",
      },
      {
        es: "Integré APIs REST de un backend NestJS con autenticación JWT, autorización por roles, gestión de imágenes y pagos mediante Mercado Pago.",
        en: "Integrated REST APIs from a NestJS backend with JWT authentication, role-based authorization, image management, and payments via Mercado Pago.",
      },
      {
        es: "Trabajé con una arquitectura modular basada en páginas, servicios, modelos, guards y componentes reutilizables, colaborando mediante Git en la rama develop.",
        en: "Worked with a modular architecture based on pages, services, models, guards, and reusable components, collaborating via Git on the develop branch.",
      },
    ],
    technologies: [
      "Angular 19",
      "TypeScript",
      "SCSS",
      "RxJS",
      "NestJS",
      "JWT",
      "Mercado Pago",
    ],
  },
];
