import Image from "next/image";
import { PortraitContactMotion } from "@/components/sections/portrait-contact-motion";
import { experiences, profile, projects } from "@/content/portfolio";
import type { Education, Experience, Locale, Project } from "@/content/portfolio";

const scanTechnologies: Record<string, readonly string[]> = {
  "ai-chatbot": ["Python", "Streamlit", "Groq"],
  "api-rest-tt": ["Node.js", "Express", "Firebase Firestore", "JWT"],
  barberhood: ["HTML", "CSS", "JavaScript"],
  "con-tacto": ["React Native", "Expo", "TypeScript"],
  forohub: [
    "Java 17",
    "Spring Boot 3.4.1",
    "Spring Security",
    "MySQL",
    "JWT",
  ],
  "manny-maquinarias": ["Angular 19", "TypeScript", "RxJS", "Mercado Pago"],
  "mythica-books": ["React", "Tailwind CSS", "Context API", "LocalStorage"],
  nutriguia: ["HTML", "CSS", "JavaScript"],
  "php-api-rest": ["PHP", "Slim 4", "MySQL 8", "Docker Compose"],
};

const anchorProjectIds = {
  backend: "forohub",
  frontend: "con-tacto",
} as const;

const copy = {
  es: {
    about: "Sobre mí",
    additionalContributions: "Contribuciones adicionales",
    backend: "Backend",
    backendRepository: "Repositorio backend",
    certificate: "Certificado",
    contact: "Contacto",
    contactChannels: "Canales",
    contactHeading: "¿Hablamos?",
    contactIntro:
      "Para conversaciones profesionales u oportunidades, escribime por email o conectemos en LinkedIn.",
    currentLanguage: "Idioma actual",
    depth: "Ver detalles",
    depthClose: "Ocultar detalles",
    depthIntro: "Highlights y stack completo disponibles para profundizar.",
    email: "Email",
    emailCta: "Escribime por email",
    experience: "Experiencia",
    externalSuffix: "abre en una nueva pestaña",
    frontend: "Frontend",
    frontendRepository: "Repositorio frontend",
    fullStack: "Stack completo",
    github: "GitHub",
    highlights: "Highlights",
    hideContributions: "Ocultar contribuciones",
    languages: "Idiomas",
    live: "Live",
    linkedin: "LinkedIn",
    mediaPlaceholder: "Superficie reservada para evidencia visual real",
    moreCertifications: "Más certificaciones y cursos",
    moreContributions: "Más contribuciones",
    moreOnGithub: "Más en GitHub",
    otherWork: "Otros proyectos",
    present: "Actualidad",
    primaryCta: "Explorar proyectos",
    portraitAlt: "Retrato de Emanuel Marcello",
    secondaryCta: "Hablemos",
    selectedCredentials: "Credenciales seleccionadas",
    selectedContributions: "Contribuciones principales",
    stack: "Stack",
    studies: "Formación",
    technicalPlaceholder: "Superficie reservada para evidencia técnica real",
    viewPost: "Ver publicación",
    work: "Proyectos",
  },
  en: {
    about: "About",
    additionalContributions: "Additional contributions",
    backend: "Backend",
    backendRepository: "Backend repository",
    certificate: "Certificate",
    contact: "Contact",
    contactChannels: "Channels",
    contactHeading: "Let's talk.",
    contactIntro:
      "For professional conversations or opportunities, email me or connect on LinkedIn.",
    currentLanguage: "Current language",
    depth: "View details",
    depthClose: "Hide details",
    depthIntro: "Highlights and full stack are available for deeper review.",
    email: "Email",
    emailCta: "Send me an email",
    experience: "Experience",
    externalSuffix: "opens in a new tab",
    frontend: "Frontend",
    frontendRepository: "Frontend repository",
    fullStack: "Full stack",
    github: "GitHub",
    highlights: "Highlights",
    hideContributions: "Hide contributions",
    languages: "Languages",
    live: "Live",
    linkedin: "LinkedIn",
    mediaPlaceholder: "Surface reserved for real visual evidence",
    moreCertifications: "More certifications and courses",
    moreContributions: "More contributions",
    moreOnGithub: "More on GitHub",
    otherWork: "Other Work",
    present: "Present",
    primaryCta: "Explore projects",
    portraitAlt: "Portrait of Emanuel Marcello",
    secondaryCta: "Let's talk",
    selectedCredentials: "Selected credentials",
    selectedContributions: "Selected contributions",
    stack: "Stack",
    studies: "Education",
    technicalPlaceholder: "Surface reserved for real technical evidence",
    viewPost: "View post",
    work: "Work",
  },
} satisfies Record<Locale, Record<string, string>>;

const heroCopy = {
  es: {
    intro:
      "Construyo productos web y mobile que combinan interfaces claras, integraciones sólidas y código mantenible.",
    role: "Frontend / Full Stack Developer",
  },
  en: {
    intro:
      "I build web and mobile products that combine clear interfaces, solid integrations, and maintainable code.",
    role: "Frontend / Full Stack Developer",
  },
} satisfies Record<Locale, Record<"intro" | "role", string>>;

const aboutStoryCopy = {
  es: {
    currently:
      "Ahora quiero seguir creciendo como desarrollador y profundizar especialmente en automatización y agentes de IA.",
    currentlyLabel: "AHORA",
    lead:
      "Me gusta construir cosas desde cero y ver cómo una idea empieza a tomar forma hasta convertirse en algo útil, funcional y usable. Esa sensación de darle vida a un producto es una de las partes que más disfruto del desarrollo.",
    outside:
      "Fuera del código, disfruto especialmente los libros, las series y las historias de fantasía capaces de transportarme a otros mundos y épocas.",
    outsideLabel: "FUERA DEL CÓDIGO",
    outsideShort: "Lord of Mysteries · Leyendo ahora: Nacidos de la Bruma",
    work:
      "Cuando un problema se complica, suelo alejarme un momento y volver con otra perspectiva antes de insistir sobre la misma solución. En equipo me siento cómodo aportando sin necesidad de ocupar el centro, aunque tampoco tengo problema en asumir responsabilidades o liderar cuando el proyecto lo necesita.",
    workLabel: "CÓMO TRABAJO",
  },
  en: {
    currently:
      "I'm currently looking to keep growing as a developer, with a particular interest in AI agents and automation.",
    currentlyLabel: "CURRENTLY",
    lead:
      "I enjoy building things from scratch and watching an idea gradually take shape until it becomes something useful, functional, and usable. Bringing a product to life is one of the parts of development I enjoy the most.",
    outside:
      "Outside of code, I especially enjoy books, series, and fantasy stories that can transport me to other worlds and eras.",
    outsideLabel: "OUTSIDE OF CODE",
    outsideShort: "Lord of Mysteries · Currently reading: Mistborn",
    work:
      "When a problem gets difficult, I usually step away for a moment and come back with a different perspective instead of forcing the same approach. In a team, I'm comfortable contributing without needing to be at the center, but I'm also willing to take responsibility or lead when the project calls for it.",
    workLabel: "HOW I WORK",
  },
} satisfies Record<
  Locale,
  Record<
    | "currently"
    | "currentlyLabel"
    | "lead"
    | "outside"
    | "outsideLabel"
    | "outsideShort"
    | "work"
    | "workLabel",
    string
  >
>;

const monthLabels = {
  es: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
} satisfies Record<Locale, readonly string[]>;

const visibleExperienceHighlights = 2;

const selectedCredentials = [
  {
    id: "react-js-diploma",
    image: {
      alt: {
        es: "Certificado del Diploma en React JS",
        en: "React JS Diploma certificate",
      },
      filename: "Emanuel - React.jpg",
    },
    institution: {
      es: "Gobierno de la Ciudad de Buenos Aires",
      en: "Gobierno de la Ciudad de Buenos Aires",
    },
    meta: "",
    name: {
      es: "Diploma en React JS",
      en: "React JS Diploma",
    },
    postUrl:
      "https://www.linkedin.com/posts/emamarcello_diploma-en-react-js-activity-7407803317457702913-8nVV?utm_source=share&utm_medium=member_desktop&rcm=ACoAADkx1mMBdhvgk0CTGvXkmy7dupP5qcVwqvc",
  },
  {
    id: "talento-tech-backend-node",
    image: {
      alt: {
        es: "Certificado Back-End / Node.js",
        en: "Back-End / Node.js certificate",
      },
      filename: "Emanuel - Node.jpg",
    },
    institution: {
      es: "Talento Tech / Gobierno de la Ciudad de Buenos Aires",
      en: "Talento Tech / Gobierno de la Ciudad de Buenos Aires",
    },
    meta: "2025 · 80 h",
    name: {
      es: "Back-End / Node.js",
      en: "Back-End / Node.js",
    },
    postUrl:
      "https://www.linkedin.com/posts/emamarcello_estoy-muy-contento-de-compartir-que-finalicé-share-7353832563477483520-KPEz/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADkx1mMBdhvgk0CTGvXkmy7dupP5qcVwqvc",
  },
  {
    id: "oracle-one-java-spring-g7",
    image: {
      alt: {
        es: "Certificado Java & Spring Framework G7",
        en: "Java & Spring Framework G7 certificate",
      },
      filename: "Emanuel - Springboot.jpg",
    },
    institution: {
      es: "ONE · Oracle Next Education / Alura Latam",
      en: "ONE · Oracle Next Education / Alura Latam",
    },
    meta: "2025 · 102 h",
    name: {
      es: "Java & Spring Framework G7",
      en: "Java & Spring Framework G7",
    },
    postUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7287898064621625345/",
  },
] as const;

const moreCertificationsUrl =
  "https://www.linkedin.com/in/emamarcello/details/certifications/";

const linkOrder = [
  "repository",
  "frontendRepository",
  "backendRepository",
  "live",
  "linkedinPost",
  "certificate",
] as const;

type LinkKey = (typeof linkOrder)[number];
type PrimarySection = "frontend" | "backend";
type ProjectVariant = "anchor" | "compact";
type TechnologyListVariant = "inline" | "compact";

type PortfolioHomeProps = {
  locale: Locale;
};

function getText(text: Project["summary"], locale: Locale) {
  return text?.[locale] ?? "";
}

function getScanTechnologies(project: Project) {
  return scanTechnologies[project.id] ?? project.technologies;
}

function formatMonthYear(value: string, locale: Locale) {
  const [year, month] = value.split("-");
  const monthLabel = monthLabels[locale][Number(month) - 1];

  return year && monthLabel ? `${monthLabel} ${year}` : value;
}

function formatExperiencePeriod(
  period: Experience["period"],
  locale: Locale,
) {
  return `${formatMonthYear(period.start, locale)} — ${
    period.end ? formatMonthYear(period.end, locale) : copy[locale].present
  }`;
}

function getExperienceYear(experience: Experience) {
  return experience.period.start.slice(0, 4);
}

function formatYearPeriod(period: Education["period"], locale: Locale) {
  return `${period.start} — ${period.end ?? copy[locale].present}`;
}

function getPortraitLocation() {
  if (!profile.location) {
    return "";
  }

  const [city, , country] = profile.location
    .split(",")
    .map((part) => part.trim());

  return city && country ? `${city} · ${country}` : profile.location;
}

function getLinkLabel(linkKey: LinkKey, locale: Locale) {
  const labels = copy[locale];

  const linkLabels = {
    backendRepository: labels.backendRepository,
    certificate: labels.certificate,
    frontendRepository: labels.frontendRepository,
    linkedinPost: labels.linkedin,
    live: labels.live,
    repository: labels.github,
  } satisfies Record<LinkKey, string>;

  return linkLabels[linkKey];
}

function isAnchorProject(project: Project) {
  return (
    project.id === anchorProjectIds.frontend ||
    project.id === anchorProjectIds.backend
  );
}

function getProjectLinks(project: Project) {
  return linkOrder.flatMap((linkKey) => {
    const href = project.links?.[linkKey];

    return href ? [{ href, key: linkKey }] : [];
  });
}

function TechnologyList({
  items,
  variant = "inline",
}: {
  items: readonly string[];
  variant?: TechnologyListVariant;
}) {
  if (variant === "compact") {
    return (
      <ul className="flex flex-wrap gap-2" aria-label="Technologies">
        {items.map((technology) => (
          <li
            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-zinc-300"
            key={technology}
          >
            {technology}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500"
      aria-label="Technologies"
    >
      {items.map((technology, index) => (
        <li className="flex items-center gap-2" key={technology}>
          <span>{technology}</span>
          {index < items.length - 1 ? (
            <span aria-hidden="true" className="text-zinc-700">
              ·
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function EvidenceSurface({
  isAnchor,
  section,
  locale,
}: {
  isAnchor: boolean;
  section: Project["section"];
  locale: Locale;
}) {
  const label =
    section === "backend"
      ? copy[locale].technicalPlaceholder
      : copy[locale].mediaPlaceholder;
  const isLargeFrontendAnchor = isAnchor && section === "frontend";

  return (
    <div
      aria-label={label}
      className={`grid place-items-center rounded-[4px] border border-dashed border-white/20 bg-white/[0.035] px-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 shadow-[0_0_28px_rgba(255,255,255,0.025)] ${
        isLargeFrontendAnchor
          ? "min-h-48 sm:min-h-56 lg:min-h-72"
          : "min-h-32 sm:min-h-36"
      }`}
      role="img"
    >
      {label}
    </div>
  );
}

function ProjectLinks({
  locale,
  project,
}: {
  locale: Locale;
  project: Project;
}) {
  const links = getProjectLinks(project);

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={link.key}>
          <a
            className="inline-flex min-h-9 items-center border-b border-white/20 text-sm font-medium text-zinc-200 transition-colors hover:border-white/50 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
            href={link.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>{getLinkLabel(link.key, locale)}</span>
            <span aria-hidden="true" className="ml-1 text-zinc-500">
              ↗
            </span>
            <span className="sr-only">, {copy[locale].externalSuffix}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function PrimaryProjectCard({
  locale,
  project,
  variant,
}: {
  locale: Locale;
  project: Project;
  variant: ProjectVariant;
}) {
  const labels = copy[locale];
  const anchor = variant === "anchor";
  const summary = getText(project.summary, locale);
  const isBackend = project.section === "backend";
  const isFrontend = project.section === "frontend";
  const isFrontendCompact = isFrontend && !anchor;
  const frontendSurface =
    "relative isolate grid gap-6 overflow-hidden rounded-none border border-transparent bg-black/[0.34] px-4 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.46)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-none before:bg-no-repeat before:content-[''] before:[background-position:left_top,left_top,right_bottom,right_bottom] sm:px-5 sm:py-8 [&>*]:relative [&>*]:z-[1]";
  const frontendEdge = anchor
    ? "before:[background-image:linear-gradient(90deg,rgba(244,244,245,0.34)_0%,rgba(244,244,245,0.16)_46%,rgba(244,244,245,0)_100%),linear-gradient(180deg,rgba(244,244,245,0.34)_0%,rgba(244,244,245,0.16)_46%,rgba(244,244,245,0)_100%),linear-gradient(270deg,rgba(244,244,245,0.24)_0%,rgba(127,29,29,0.08)_48%,rgba(244,244,245,0)_100%),linear-gradient(0deg,rgba(244,244,245,0.24)_0%,rgba(127,29,29,0.08)_48%,rgba(244,244,245,0)_100%)] before:[background-size:42%_1px,1px_36%,32%_1px,1px_26%]"
    : "before:[background-image:linear-gradient(90deg,rgba(244,244,245,0.26)_0%,rgba(244,244,245,0.11)_44%,rgba(244,244,245,0)_100%),linear-gradient(180deg,rgba(244,244,245,0.26)_0%,rgba(244,244,245,0.11)_44%,rgba(244,244,245,0)_100%),linear-gradient(270deg,rgba(244,244,245,0.18)_0%,rgba(127,29,29,0.06)_46%,rgba(244,244,245,0)_100%),linear-gradient(0deg,rgba(244,244,245,0.18)_0%,rgba(127,29,29,0.06)_46%,rgba(244,244,245,0)_100%)] before:[background-size:36%_1px,1px_31%,27%_1px,1px_22%]";
  const backendSurface =
    "grid gap-6 border-t border-white/[0.08] bg-transparent py-7 first:border-t-0 sm:py-8";
  const surfaceClass = isFrontend
    ? `${frontendSurface} ${frontendEdge}`
    : backendSurface;
  const layoutClass =
    anchor && !isBackend
      ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
      : isBackend
        ? "lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.78fr)]"
        : "";
  const compactStableRegionClass =
    "grid gap-6 lg:flex lg:min-h-[calc(40rem-9.3125rem)] lg:flex-col";
  const lowerContentClass = isFrontendCompact ? "lg:mt-auto" : "";
  const scanContent = (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          {project.year}
        </p>
        <h4 className="text-2xl font-semibold tracking-normal text-zinc-50 sm:text-3xl">
          {project.title}
        </h4>
        {project.role ? (
          <p className="text-sm font-medium text-zinc-400">
            {project.role[locale]}
          </p>
        ) : null}
      </div>

      {summary ? (
        <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
          {summary}
        </p>
      ) : null}

      <TechnologyList items={getScanTechnologies(project)} />
    </div>
  );
  const evidenceAndLinks = (
    <div className={`flex min-w-0 flex-col gap-4 ${lowerContentClass}`}>
      <EvidenceSurface
        isAnchor={anchor}
        locale={locale}
        section={project.section}
      />
      <ProjectLinks locale={locale} project={project} />
    </div>
  );
  const disclosure = (
    <details className="group border-t border-white/10 pt-4 lg:col-span-full">
      <summary className="flex min-h-11 cursor-pointer list-none items-center border border-white/[0.12] bg-white/[0.025] px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.22] hover:bg-white/[0.045] hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 group-open:border-white/[0.18] group-open:bg-white/[0.035] [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2.5">
          <span className="group-open:hidden">{labels.depth}</span>
          <span className="hidden group-open:inline">{labels.depthClose}</span>
          <span
            aria-hidden="true"
            className="grid size-5 shrink-0 place-items-center rounded-[1px] border border-white/[0.14] text-base leading-none text-zinc-300 transition-colors group-open:border-white/[0.28] group-open:text-zinc-50"
          >
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:block">×</span>
          </span>
        </span>
      </summary>
      <div className="grid gap-7 pt-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <div className="space-y-3">
          <h5 className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            {labels.highlights}
          </h5>
          <ul className="space-y-3 text-sm leading-6 text-zinc-300">
            {project.highlights.map((highlight) => (
              <li className="border-l border-white/10 pl-3" key={highlight.en}>
                {highlight[locale]}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 border-t border-white/[0.08] pt-5 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <h5 className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            {labels.fullStack}
          </h5>
          <TechnologyList items={project.technologies} />
        </div>
      </div>
    </details>
  );

  if (isFrontendCompact) {
    return (
      <article className={`${surfaceClass} ${layoutClass}`}>
        <div className={compactStableRegionClass}>
          {scanContent}
          {evidenceAndLinks}
        </div>
        {disclosure}
      </article>
    );
  }

  return (
    <article className={`${surfaceClass} ${layoutClass}`}>
      {scanContent}
      {evidenceAndLinks}
      {disclosure}
    </article>
  );
}

function OtherProjectCard({
  locale,
  project,
}: {
  locale: Locale;
  project: Project;
}) {
  const summary = getText(project.summary, locale);

  return (
    <article className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-xl font-semibold text-zinc-50">{project.title}</h4>
        <p className="text-sm font-medium text-zinc-500">{project.year}</p>
      </div>
      {summary ? (
        <p className="mt-4 text-sm leading-6 text-zinc-300">{summary}</p>
      ) : null}
      <div className="mt-5">
        <TechnologyList items={project.technologies} variant="compact" />
      </div>
      <div className="mt-5">
        <ProjectLinks locale={locale} project={project} />
      </div>
    </article>
  );
}

function ProjectSection({
  locale,
  projects,
  section,
}: {
  locale: Locale;
  projects: readonly Project[];
  section: PrimarySection;
}) {
  const labels = copy[locale];

  if (section === "frontend") {
    const anchorProject = projects.find(
      (project) => project.id === anchorProjectIds.frontend,
    );
    const compactProjects = projects.filter(
      (project) => project.id !== anchorProjectIds.frontend,
    );

    return (
      <section
        aria-labelledby={`${section}-title`}
        className="scroll-mt-28 space-y-6"
      >
        <h3
          id={`${section}-title`}
          className="text-3xl font-semibold tracking-normal text-zinc-50 sm:text-4xl"
        >
          {labels[section]}
        </h3>

        {anchorProject ? (
          <PrimaryProjectCard
            locale={locale}
            project={anchorProject}
            variant="anchor"
          />
        ) : null}

        <div className="grid items-stretch gap-x-8 gap-y-6 lg:grid-cols-2 lg:[&:has(details[open])]:items-start">
          {compactProjects.map((project) => (
            <PrimaryProjectCard
              key={project.id}
              locale={locale}
              project={project}
              variant="compact"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={`${section}-title`}
      className="scroll-mt-28 space-y-6"
    >
      <h3
        id={`${section}-title`}
        className="text-3xl font-semibold tracking-normal text-zinc-50 sm:text-4xl"
      >
        {labels[section]}
      </h3>

      <div className="space-y-6 lg:space-y-7">
        {projects.map((project) => (
          <PrimaryProjectCard
            key={project.id}
            locale={locale}
            project={project}
            variant={isAnchorProject(project) ? "anchor" : "compact"}
          />
        ))}
      </div>
    </section>
  );
}

function WorkSection({ locale }: { locale: Locale }) {
  const frontendProjects = projects.filter(
    (project) => project.section === "frontend",
  );
  const backendProjects = projects.filter(
    (project) => project.section === "backend",
  );
  const otherProjects = projects.filter((project) => project.section === "other");
  const labels = copy[locale];

  return (
    <section
      aria-labelledby="work-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      id="work"
    >
      <div className="mb-10 max-w-3xl">
        <h2
          id="work-title"
          className="text-4xl font-semibold tracking-normal text-zinc-50 sm:text-5xl"
        >
          {labels.work}
        </h2>
      </div>

      <div className="space-y-16">
        <ProjectSection
          locale={locale}
          projects={frontendProjects}
          section="frontend"
        />
        <ProjectSection
          locale={locale}
          projects={backendProjects}
          section="backend"
        />

        <section aria-labelledby="other-work-title" className="space-y-5">
          <h3
            id="other-work-title"
            className="text-3xl font-semibold tracking-normal text-zinc-50 sm:text-4xl"
          >
            {labels.otherWork}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {otherProjects.map((project) => (
              <OtherProjectCard
                key={project.id}
                locale={locale}
                project={project}
              />
            ))}
          </div>
          {profile.links?.github ? (
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
              href={profile.links.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              {labels.moreOnGithub}
              <span aria-hidden="true" className="ml-1 text-zinc-500">
                ↗
              </span>
              <span className="sr-only">, {labels.externalSuffix}</span>
            </a>
          ) : null}
        </section>
      </div>
    </section>
  );
}

function ExperienceRecord({
  experience,
  locale,
}: {
  experience: Experience;
  locale: Locale;
}) {
  const labels = copy[locale];
  const visibleHighlights = experience.highlights.slice(
    0,
    visibleExperienceHighlights,
  );
  const remainingHighlights = experience.highlights.slice(
    visibleExperienceHighlights,
  );

  return (
    <article
      aria-labelledby={`${experience.id}-title`}
      className="grid gap-6 border-b border-white/10 py-9 last:border-b-0 sm:py-11 lg:grid-cols-[7rem_minmax(0,1fr)_minmax(12rem,0.35fr)] lg:gap-10"
    >
      <div className="space-y-2 lg:pt-1">
        <time
          className="block font-mono text-sm text-zinc-500"
          dateTime={experience.period.start}
        >
          {getExperienceYear(experience)}
        </time>
        <p className="font-mono text-xs leading-5 text-zinc-500">
          {formatExperiencePeriod(experience.period, locale)}
        </p>
      </div>

      <div className="min-w-0">
        <h3
          className="text-2xl font-semibold tracking-normal text-zinc-50 sm:text-3xl"
          id={`${experience.id}-title`}
        >
          {experience.company}
        </h3>
        <p className="mt-2 text-sm font-medium text-zinc-400 sm:text-base">
          {experience.role[locale]}
        </p>

        <ul
          aria-label={labels.selectedContributions}
          className="mt-6 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8"
        >
          {visibleHighlights.map((highlight) => (
            <li className="border-l border-white/10 pl-4" key={highlight.en}>
              {highlight[locale]}
            </li>
          ))}
        </ul>

        {remainingHighlights.length > 0 ? (
          <details className="group mt-5">
            <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-2 border-b border-white/10 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:border-white/30 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">
                {labels.moreContributions}
              </span>
              <span className="hidden group-open:inline">
                {labels.hideContributions}
              </span>
              <span aria-hidden="true" className="text-zinc-600">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">×</span>
              </span>
            </summary>
            <ul
              aria-label={labels.additionalContributions}
              className="mt-4 space-y-3 text-sm leading-7 text-zinc-400"
            >
              {remainingHighlights.map((highlight) => (
                <li
                  className="border-l border-white/[0.08] pl-4"
                  key={highlight.en}
                >
                  {highlight[locale]}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>

      <aside className="min-w-0 border-t border-white/[0.08] pt-5 lg:border-t-0 lg:pt-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
          {labels.stack}
        </p>
        <div className="mt-3">
          <TechnologyList items={experience.technologies} />
        </div>
      </aside>
    </article>
  );
}

function ExperienceSection({ locale }: { locale: Locale }) {
  const labels = copy[locale];

  return (
    <section
      aria-labelledby="experience-title"
      className="mx-auto w-full max-w-6xl scroll-mt-28 border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8"
      id="experience"
    >
      <div className="mb-10 max-w-3xl">
        <h2
          className="text-4xl font-semibold tracking-normal text-zinc-50 sm:text-5xl"
          id="experience-title"
        >
          {labels.experience}
        </h2>
      </div>

      <div className="border-t border-white/10">
        {experiences.map((experience) => (
          <ExperienceRecord
            experience={experience}
            key={experience.id}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

function PortraitPlate({
  locale,
  portraitLocation,
}: {
  locale: Locale;
  portraitLocation: string;
}) {
  const labels = copy[locale];

  return (
    <figure className="relative isolate mx-auto w-[92%] max-w-[21.5rem] border border-white/[0.055] bg-black/[0.08] p-2 shadow-[inset_0_0_0_1px_rgba(244,244,245,0.016)] before:pointer-events-none before:absolute before:-inset-x-2 before:-inset-y-4 before:-z-10 before:[background:radial-gradient(ellipse_at_44%_42%,rgba(127,29,29,0.06)_0%,rgba(63,63,70,0.032)_35%,rgba(3,3,4,0)_72%)] before:content-[''] min-[390px]:w-[86%] sm:w-[78%] sm:max-w-[23rem] sm:p-2.5 md:w-[62%] md:max-w-[24rem] lg:mx-0 lg:ml-3 lg:w-[88%] lg:max-w-[23.5rem] lg:border-white/[0.065] lg:bg-black/[0.11] lg:before:-inset-x-7 lg:before:-inset-y-6 lg:before:[background:radial-gradient(ellipse_at_44%_42%,rgba(127,29,29,0.105)_0%,rgba(63,63,70,0.044)_36%,rgba(3,3,4,0)_74%)] xl:ml-5 xl:max-w-[25rem]">
      <div className="relative before:pointer-events-none before:absolute before:-left-1.5 before:-top-1.5 before:z-[2] before:h-8 before:w-16 before:bg-no-repeat before:content-[''] before:[background-image:linear-gradient(90deg,rgba(244,244,245,0.105)_0%,rgba(244,244,245,0.045)_54%,rgba(244,244,245,0)_100%),linear-gradient(180deg,rgba(244,244,245,0.092)_0%,rgba(244,244,245,0.04)_58%,rgba(244,244,245,0)_100%)] before:[background-position:left_top,left_top] before:[background-size:3.75rem_1px,1px_1.875rem] after:pointer-events-none after:absolute after:-bottom-1.5 after:-right-1.5 after:z-[2] after:h-8 after:w-14 after:bg-no-repeat after:content-[''] after:[background-image:linear-gradient(270deg,rgba(244,244,245,0.09)_0%,rgba(127,29,29,0.04)_48%,rgba(244,244,245,0)_100%),linear-gradient(0deg,rgba(244,244,245,0.082)_0%,rgba(127,29,29,0.035)_52%,rgba(244,244,245,0)_100%)] after:[background-position:right_bottom,right_bottom] after:[background-size:3.25rem_1px,1px_1.75rem]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] border border-white/[0.06] bg-zinc-950 shadow-[0_18px_64px_rgba(0,0,0,0.34)] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-[1] after:h-[31%] after:[background:linear-gradient(180deg,rgba(3,3,4,0)_0%,rgba(3,3,4,0.10)_42%,rgba(3,3,4,0.54)_76%,rgba(3,3,4,0.88)_100%)] after:content-[''] lg:aspect-[5/6]">
          <Image
            alt={labels.portraitAlt}
            className="object-cover object-[50%_50%]"
            fill
            loading="lazy"
            sizes="(max-width: 389px) calc((100vw - 2rem) * 0.92), (max-width: 639px) calc((100vw - 2rem) * 0.86), (max-width: 1023px) 23rem, (max-width: 1279px) 23.5rem, 25rem"
            src="/media/profile/emanuel-marcello.png"
          />
        </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/[0.055] px-1.5 pb-0.5 pt-2.5 font-mono text-[0.6875rem] leading-5 tracking-[0.08em] text-zinc-500 lg:mt-3 lg:px-1 lg:pt-3">
        <span className="text-zinc-400">{profile.name}</span>
        {portraitLocation ? <span>{portraitLocation}</span> : null}
      </figcaption>
    </figure>
  );
}

function AboutContactSection({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const story = aboutStoryCopy[locale];
  const portraitLocation = getPortraitLocation();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[minmax(17rem,0.42fr)_minmax(0,0.58fr)] lg:gap-x-16">
        <section aria-labelledby="about-title" className="contents">
          <div
            className="scroll-mt-28 border-t border-white/10 pt-16 lg:col-span-full"
            id="about"
          >
            <h2
              className="text-4xl font-semibold tracking-normal text-zinc-50 sm:text-5xl"
              id="about-title"
            >
              {labels.about}
            </h2>
          </div>

          <div className="mt-12 min-w-0 lg:col-start-2 lg:row-start-2">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              {profile.professionalTitle[locale]}
            </p>

            <div className="mt-5 max-w-3xl">
              <p className="text-lg leading-9 text-zinc-100 sm:text-xl sm:leading-10">
                {story.lead}
              </p>

              <div className="mt-8 space-y-7 border-t border-white/[0.08] pt-7">
                <div className="space-y-3">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                    {story.workLabel}
                  </p>
                  <p className="text-base leading-8 text-zinc-300">
                    {story.work}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                    {story.currentlyLabel}
                  </p>
                  <p className="text-base leading-8 text-zinc-300">
                    {story.currently}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                    {story.outsideLabel}
                  </p>
                  <div className="space-y-2">
                    <p className="text-base leading-8 text-zinc-300">
                      {story.outside}
                    </p>
                    <p className="font-mono text-xs font-medium tracking-[0.08em] text-zinc-500">
                      {story.outsideShort}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PortraitContactMotion className="mt-14 lg:col-start-1 lg:row-start-2 lg:row-span-3 lg:mt-12 lg:self-stretch">
            <PortraitPlate
              locale={locale}
              portraitLocation={portraitLocation}
            />
          </PortraitContactMotion>

          <div className="mt-14 min-w-0 space-y-8 lg:col-start-2 lg:row-start-3 lg:mt-12 lg:pt-2">
            <section aria-labelledby="about-education-title">
              <h3
                className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
                id="about-education-title"
              >
                {labels.studies}
              </h3>
              <ol className="mt-4 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                {profile.education.map((education, index) => (
                  <li className="py-4" key={education.id}>
                    <p
                      className={
                        index === 0
                          ? "text-lg font-medium text-zinc-100"
                          : "text-sm font-medium text-zinc-400"
                      }
                    >
                      {education.title[locale]}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {education.institution}
                    </p>
                    <p className="mt-2 font-mono text-xs text-zinc-500">
                      {formatYearPeriod(education.period, locale)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="about-languages-title">
              <h3
                className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
                id="about-languages-title"
              >
                {labels.languages}
              </h3>
              <ul className="mt-4 space-y-3 border-t border-white/[0.08] pt-4">
                {profile.languages.map((language) => (
                  <li className="text-sm leading-6" key={language.id}>
                    <p className="text-zinc-300">
                      <span className="font-medium text-zinc-100">
                        {language.name[locale]}
                      </span>
                      <span className="text-zinc-500"> — </span>
                      <span>{language.proficiency[locale]}</span>
                    </p>
                    {language.note ? (
                      <p className="mt-1 text-zinc-500">
                        {language.note[locale]}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="about-credentials-title">
              <h3
                className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
                id="about-credentials-title"
              >
                {labels.selectedCredentials}
              </h3>
              <ol className="mt-4 divide-y divide-white/[0.08] border-t border-white/[0.08]">
                {selectedCredentials.map((credential) => (
                  <li
                    className="flex min-w-0 items-start gap-4 py-4"
                    key={credential.id}
                  >
                    <a
                      aria-label={`${labels.viewPost}: ${credential.name[locale]}`}
                      className="relative h-24 w-28 shrink-0 overflow-hidden rounded-[3px] border border-white/[0.1] bg-white/[0.02] transition hover:border-white/25 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                      href={credential.postUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Image
                        alt={credential.image.alt[locale]}
                        className="object-contain p-1"
                        fill
                        loading="lazy"
                        sizes="7rem"
                        src={`/media/credentials/${credential.image.filename}`}
                      />
                    </a>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-medium text-zinc-200">
                        {credential.name[locale]}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {credential.institution[locale]}
                      </p>
                      {credential.meta ? (
                        <p className="mt-2 font-mono text-xs text-zinc-500">
                          {credential.meta}
                        </p>
                      ) : null}
                      <a
                        aria-label={`${labels.viewPost}: ${credential.name[locale]}, ${labels.externalSuffix}`}
                        className="mt-3 inline-flex min-h-8 items-center border-b border-white/10 text-sm font-medium text-zinc-300 transition-colors hover:border-white/35 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                        href={credential.postUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {labels.viewPost}
                        <span aria-hidden="true" className="ml-1 text-zinc-500">
                          ↗
                        </span>
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
              <a
                className="mt-4 inline-flex min-h-9 items-center border-b border-white/10 text-sm font-medium text-zinc-500 transition-colors hover:border-white/30 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                href={moreCertificationsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {labels.moreCertifications}
                <span aria-hidden="true" className="ml-1 text-zinc-500">
                  ↗
                </span>
                <span className="sr-only">, {labels.externalSuffix}</span>
              </a>
            </section>
          </div>
        </section>

        <ContactSection locale={locale} />
      </div>
    </div>
  );
}

function ContactSection({ locale }: { locale: Locale }) {
  const labels = copy[locale];

  return (
    <section
      aria-labelledby="contact-title"
      className="mt-16 scroll-mt-28 border-t border-white/10 py-24 sm:py-28 lg:col-start-2 lg:row-start-4 lg:mt-20 lg:py-36"
      id="contact"
    >
      <div className="grid gap-14">
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            {labels.contact}
          </p>
          <h2
            className="mt-5 text-5xl font-semibold tracking-normal text-zinc-50 sm:text-6xl lg:text-7xl"
            id="contact-title"
          >
            {labels.contactHeading}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg sm:leading-9">
            {labels.contactIntro}
          </p>

          {profile.email ? (
            <div className="mt-12 min-w-0">
              <a
                aria-label={`${labels.emailCta}: ${profile.email}`}
                className="group inline-block max-w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                href={`mailto:${profile.email}`}
              >
                <span className="inline-flex max-w-full items-baseline gap-3 whitespace-nowrap border-b border-white/[0.18] pb-3 text-[clamp(1.5rem,7vw,1.875rem)] font-medium leading-tight tracking-normal text-zinc-100 transition-colors group-hover:border-white/45 group-hover:text-zinc-50 sm:text-4xl lg:text-5xl">
                  <span>{labels.emailCta}</span>
                  <span aria-hidden="true" className="text-zinc-500">
                    ↗
                  </span>
                </span>
                <span className="mt-3 block max-w-full whitespace-nowrap font-mono text-[0.6875rem] leading-5 tracking-[0.01em] text-zinc-500 transition-colors group-hover:text-zinc-400 sm:text-xs sm:tracking-[0.04em]">
                  {profile.email}
                </span>
              </a>
            </div>
          ) : null}
        </div>

        {profile.links?.linkedin || profile.links?.github ? (
          <aside className="border-t border-white/[0.08] pt-6">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              {labels.contactChannels}
            </p>
            <ul className="mt-5 grid gap-2">
              {profile.links?.linkedin ? (
                <li>
                  <a
                    aria-label={`${labels.linkedin}, ${labels.externalSuffix}`}
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-white/[0.08] py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                    href={profile.links.linkedin}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>{labels.linkedin}</span>
                    <span aria-hidden="true" className="text-zinc-500">
                      ↗
                    </span>
                  </a>
                </li>
              ) : null}
              {profile.links?.github ? (
                <li>
                  <a
                    aria-label={`${labels.github}, ${labels.externalSuffix}`}
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-white/[0.08] py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                    href={profile.links.github}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>{labels.github}</span>
                    <span aria-hidden="true" className="text-zinc-500">
                      ↗
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function PortfolioFooter({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const portraitLocation = getPortraitLocation();
  const copyrightYear = 2026;

  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-white/[0.08] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-normal text-zinc-300">
            Ema Marc
          </p>
          {portraitLocation ? (
            <p className="mt-1 font-mono text-xs tracking-[0.06em] text-zinc-500">
              {portraitLocation}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-[0.06em] text-zinc-500 sm:justify-end">
          <span>
            <span className="sr-only">{labels.currentLanguage}: </span>
            {locale.toUpperCase()}
          </span>
          <span>© {copyrightYear} Emanuel Marcello</span>
        </div>
      </div>
    </footer>
  );
}

function HeroSection({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const hero = heroCopy[locale];

  return (
    <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-20 sm:px-6 lg:grid lg:grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] lg:content-start lg:items-start lg:gap-16 lg:px-8 lg:pb-20 lg:pt-[32svh]">
      <div className="max-w-4xl">
        <p className="text-base font-medium text-zinc-300">
          {hero.role}
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-normal text-zinc-50 sm:text-6xl lg:text-7xl">
          Ema Marc
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
          {hero.intro}
        </p>
        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:gap-8">
          <a
            className="group inline-flex min-h-11 items-center border-b border-white/[0.2] pb-2 text-base font-semibold text-zinc-100 transition-colors hover:border-white/50 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
            href="#work"
          >
            {labels.primaryCta}
            <span
              aria-hidden="true"
              className="ml-2 text-zinc-500 motion-safe:transition-transform motion-safe:duration-200 group-hover:text-zinc-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-safe:group-focus-visible:translate-y-0.5"
            >
              ↘
            </span>
          </a>
          <a
            className="group inline-flex min-h-11 items-center border-b border-white/[0.12] pb-2 text-base font-medium text-zinc-300 transition-colors hover:border-white/35 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
            href="#contact"
          >
            {labels.secondaryCta}
            <span
              aria-hidden="true"
              className="ml-2 text-zinc-500 motion-safe:transition-transform motion-safe:duration-200 group-hover:text-zinc-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function PortfolioHome({ locale }: PortfolioHomeProps) {
  return (
    <main id="main-content" className="flex w-full flex-1 flex-col">
      <HeroSection locale={locale} />
      <WorkSection locale={locale} />
      <ExperienceSection locale={locale} />
      <AboutContactSection locale={locale} />
      <PortfolioFooter locale={locale} />
    </main>
  );
}
