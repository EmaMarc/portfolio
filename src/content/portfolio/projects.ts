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
    summary: {
      es: "Producto educativo móvil para el aprendizaje de Lengua de Señas Argentina (LSA), con una experiencia centrada en contenido, práctica y seguimiento del progreso. Trabajé como Frontend Developer y Frontend Lead, desarrollando flujos clave de la aplicación e integrando el frontend con servicios backend.",
      en: "Mobile educational product focused on learning Argentine Sign Language (LSA), with an experience centered on content, practice, and progress tracking. I worked as a Frontend Developer and Frontend Lead, building key application flows and integrating the frontend with backend services.",
    },
    highlights: [
      {
        es: "Desarrollé flujos para autenticación, onboarding, módulos, lecciones, ejercicios, favoritos, perfil y seguimiento del progreso.",
        en: "Developed flows for authentication, onboarding, modules, lessons, exercises, favorites, profile, and progress tracking.",
      },
      {
        es: "Integré APIs REST y autenticación basada en tokens con manejo de estados de carga, error y respuestas vacías, e implementé navegación tipada con React Navigation y almacenamiento local con AsyncStorage.",
        en: "Integrated REST APIs and token-based authentication with loading, error, and empty-state handling, and implemented typed navigation with React Navigation and local storage using AsyncStorage.",
      },
      {
        es: "Coordiné tareas y criterios técnicos del equipo frontend, colaboré con backend y QA mediante feature branches y pull requests, y validé integraciones con TypeScript y Expo Doctor.",
        en: "Coordinated tasks and technical criteria for the frontend team, collaborated with backend and QA through feature branches and pull requests, and validated integrations using TypeScript and Expo Doctor.",
      },
    ],
    links: {
      repository:
        "https://github.com/Juan-Ignacio-Bordignon/Innova-Lav-grupo-5/tree/frontend",
      linkedinPost:
        "https://www.linkedin.com/feed/update/urn:li:activity:7490952228350894080/",
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
    summary: {
      es: "Aplicación web para la gestión y alquiler de maquinaria desarrollada durante una práctica profesional en la UNLP. Trabajé en el frontend con Angular, construyendo flujos de gestión e integrando la interfaz con un backend REST desarrollado con NestJS.",
      en: "Web application for machinery management and rental developed during a professional internship at UNLP. I worked on the frontend with Angular, building management flows and integrating the interface with a REST backend developed with NestJS.",
    },
    highlights: [
      {
        es: "Desarrollé funcionalidades de autenticación, registro, recuperación de contraseña, perfiles, usuarios, maquinaria, reservas, alquileres y estadísticas.",
        en: "Developed authentication, registration, password recovery, profiles, users, machinery, reservations, rentals, and statistics features.",
      },
      {
        es: "Integré el frontend con APIs REST para flujos protegidos mediante JWT y roles, además de funcionalidades relacionadas con imágenes y pagos mediante Mercado Pago.",
        en: "Integrated the frontend with REST APIs for flows protected by JWT and roles, along with functionality related to images and payments through Mercado Pago.",
      },
      {
        es: "Organicé el frontend mediante páginas, servicios, modelos, guards y componentes reutilizables, utilizando TypeScript, RxJS y un flujo de trabajo colaborativo con Git sobre la rama develop.",
        en: "Structured the frontend using pages, services, models, guards, and reusable components, working with TypeScript, RxJS, and a collaborative Git workflow based on the develop branch.",
      },
    ],
    links: {
      frontendRepository: "https://github.com/juanmasisti/Alquileres-Front",
      backendRepository: "https://github.com/facu-carri/Alquileres-Back",
      linkedinPost:
        "https://www.linkedin.com/feed/update/urn:li:activity:7491195807241764864/",
    },
    featured: true,
  },
  {
    id: "mythica-books",
    title: "Mythica Books",
    year: 2024,
    technologies: [
      "React",
      "Tailwind CSS",
      "Context API",
      "LocalStorage",
    ],
    summary: {
      es: "Proyecto personal de e-commerce de libros desarrollado con React, enfocado en construir una experiencia de catálogo completa y explorar patrones de composición, manejo de estado e interacción en el frontend.",
      en: "Personal book e-commerce project built with React, focused on creating a complete catalog experience and exploring composition, state management, and frontend interaction patterns.",
    },
    highlights: [
      {
        es: "Construí una experiencia de catálogo con búsqueda, filtros por categoría y precio, gestión de productos y un carrito persistente mediante LocalStorage.",
        en: "Built a catalog experience with search, category and price filters, product management, and a shopping cart persisted through LocalStorage.",
      },
      {
        es: "Organicé el estado compartido con Context API y custom hooks, utilizando componentes reutilizables para mantener separadas las distintas responsabilidades de la interfaz.",
        en: "Organized shared state with Context API and custom hooks, using reusable components to keep different interface responsibilities separated.",
      },
      {
        es: "Implementé una interfaz responsive con Tailwind CSS e interacciones como modales y notificaciones, junto con integración de APIs y consideraciones básicas de accesibilidad y SEO.",
        en: "Implemented a responsive interface with Tailwind CSS and interactions such as modals and notifications, along with API integration and basic accessibility and SEO considerations.",
      },
    ],
    links: {
      repository: "https://github.com/EmaMarc/React_eCommerce",
    },
    featured: true,
  },
  {
    id: "api-rest-tt",
    title: "API REST - Gestión de Productos",
    year: 2025,
    role: {
      es: "Desarrollador Backend",
      en: "Backend Developer",
    },
    technologies: ["Node.js", "Express", "Firebase Firestore", "JWT"],
    summary: {
      es: "API REST para la gestión de productos desarrollada como proyecto final integrador de una formación Backend en Node.js. Construí el servicio con Express y Firebase Firestore, cubriendo operaciones de consulta y administración de productos junto con autenticación para las rutas protegidas.",
      en: "REST API for product management developed as the final integrative project of a Backend training program in Node.js. I built the service with Express and Firebase Firestore, covering product querying and management operations together with authentication for protected routes.",
    },
    highlights: [
      {
        es: "Implementé endpoints para listar productos, buscar por nombre, consultar por ID y realizar operaciones de creación, actualización y eliminación.",
        en: "Implemented endpoints to list products, search by name, retrieve products by ID, and perform create, update, and delete operations.",
      },
      {
        es: "Protegí las operaciones de escritura mediante autenticación JWT, utilizando un flujo de login y middleware para validar tokens enviados mediante el header Authorization.",
        en: "Protected write operations with JWT authentication, using a login flow and middleware to validate tokens sent through the Authorization header.",
      },
      {
        es: "Organicé el backend separando controllers, models, services, routes y middlewares, con Firebase Firestore como capa de persistencia de los productos.",
        en: "Structured the backend into controllers, models, services, routes, and middlewares, using Firebase Firestore as the persistence layer for product data.",
      },
    ],
    links: {
      repository: "https://github.com/EmaMarc/api-rest-TT",
      live: "https://api-rest-tt.vercel.app",
    },
  },
  {
    id: "forohub",
    title: "ForoHub",
    year: 2025,
    role: {
      es: "Desarrollador Backend",
      en: "Backend Developer",
    },
    technologies: [
      "Java 17",
      "Spring Boot 3.4.1",
      "Spring Security",
      "Spring Data JPA",
      "MySQL",
      "Flyway",
      "JWT",
      "OpenAPI",
    ],
    highlights: [],
    links: {
      repository: "https://github.com/EmaMarc/forohub",
      certificate: "https://lnkd.in/p/dztk8nU6",
    },
  },
  {
    id: "php-api-rest",
    title: "PHP API REST",
    year: 2025,
    role: {
      es: "Desarrollador Backend",
      en: "Backend Developer",
    },
    technologies: ["PHP", "Slim 4", "MySQL 8", "Docker Compose", "Composer"],
    highlights: [],
    links: {
      repository: "https://github.com/EmaMarc/PHP-API-Rest",
    },
  },
  {
    id: "ai-chatbot",
    title: "AI ChatBot",
    year: 2024,
    technologies: [],
    highlights: [],
    links: {
      linkedinPost:
        "https://www.linkedin.com/feed/update/urn:li:activity:7266954231939518465/",
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
      linkedinPost:
        "https://www.linkedin.com/feed/update/urn:li:activity:7199908939172392961/",
    },
  },
];

// TODO: Completar role, summary, technologies, highlights, media y links cuando esten confirmados.
