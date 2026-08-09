import Link from "next/link";
import { profile, projects } from "@/content/portfolio";
import type { Locale, Project } from "@/content/portfolio";

const scanTechnologies: Record<string, readonly string[]> = {
  "ai-chatbot": ["Python","Streamlit", "Groq"],
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
    backend: "Backend",
    backendRepository: "Repositorio backend",
    certificate: "Certificado",
    contact: "Contacto",
    depth: "Ver detalles",
    depthIntro: "Highlights y stack completo disponibles para profundizar.",
    experience: "Experiencia",
    externalSuffix: "abre en una nueva pestaña",
    frontend: "Frontend",
    frontendRepository: "Repositorio frontend",
    fullStack: "Stack completo",
    github: "GitHub",
    highlights: "Highlights",
    live: "Live",
    linkedin: "LinkedIn",
    mediaPlaceholder: "Superficie reservada para evidencia visual real",
    moreOnGithub: "Más en GitHub",
    nextMilestone: "Próximo hito estructural",
    otherWork: "Otros proyectos",
    primaryCta: "Explorar proyectos",
    secondaryCta: "Contacto",
    technicalPlaceholder: "Superficie reservada para evidencia técnica real",
    work: "Proyectos",
  },
  en: {
    about: "About",
    backend: "Backend",
    backendRepository: "Backend repository",
    certificate: "Certificate",
    contact: "Contact",
    depth: "View details",
    depthIntro: "Highlights and full stack are available for deeper review.",
    experience: "Experience",
    externalSuffix: "opens in a new tab",
    frontend: "Frontend",
    frontendRepository: "Frontend repository",
    fullStack: "Full stack",
    github: "GitHub",
    highlights: "Highlights",
    live: "Live",
    linkedin: "LinkedIn",
    mediaPlaceholder: "Surface reserved for real visual evidence",
    moreOnGithub: "More on GitHub",
    nextMilestone: "Next structural milestone",
    otherWork: "Other Work",
    primaryCta: "Explore my work",
    secondaryCta: "Contact",
    technicalPlaceholder: "Surface reserved for real technical evidence",
    work: "Work",
  },
} satisfies Record<Locale, Record<string, string>>;

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

type PortfolioHomeProps = {
  locale: Locale;
};

function getText(text: Project["summary"], locale: Locale) {
  return text?.[locale] ?? "";
}

function getScanTechnologies(project: Project) {
  return scanTechnologies[project.id] ?? project.technologies;
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

function TechnologyList({ items }: { items: readonly string[] }) {
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

  return (
    <div
      aria-label={label}
      className={`grid place-items-center rounded-[8px] border border-dashed border-white/15 bg-white/[0.025] px-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 ${
        isAnchor ? "min-h-48 sm:min-h-56 lg:min-h-72" : "min-h-32"
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
            className="inline-flex min-h-10 items-center rounded-full border border-white/10 px-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
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

  return (
    <article
      className={`grid gap-6 rounded-[8px] border border-white/10 bg-black/35 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-6 ${
        anchor ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" : ""
      }`}
    >
      <div className="flex min-w-0 flex-col gap-5">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
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

      <div className="flex min-w-0 flex-col gap-4">
        <EvidenceSurface
          isAnchor={anchor}
          locale={locale}
          section={project.section}
        />
        <ProjectLinks locale={locale} project={project} />
      </div>

      <details className="group border-t border-white/10 pt-4 lg:col-span-full">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-[8px] text-sm font-medium text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100">
          <span>{labels.depth}</span>
          <span
            aria-hidden="true"
            className="text-zinc-500 transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <div className="grid gap-6 pt-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div>
            <p className="mb-3 text-sm text-zinc-500">{labels.depthIntro}</p>
            <h5 className="text-sm font-semibold text-zinc-100">
              {labels.highlights}
            </h5>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-zinc-300">
              {project.highlights.map((highlight) => (
                <li className="border-l border-white/10 pl-3" key={highlight.en}>
                  {highlight[locale]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="mb-3 text-sm font-semibold text-zinc-100">
              {labels.fullStack}
            </h5>
            <TechnologyList items={project.technologies} />
          </div>
        </div>
      </details>
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
        <TechnologyList items={project.technologies} />
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

  return (
    <section
      aria-labelledby={`${section}-title`}
      className="scroll-mt-28 space-y-5"
    >
      <h3
        id={`${section}-title`}
        className="text-3xl font-semibold tracking-normal text-zinc-50 sm:text-4xl"
      >
        {labels[section]}
      </h3>

      <div
        className={
          section === "backend"
            ? "grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            : "grid gap-4 lg:grid-cols-2"
        }
      >
        {projects.map((project) => (
          <div
            className={
              section === "frontend" && isAnchorProject(project)
                ? "lg:col-span-2"
                : isAnchorProject(project)
                  ? "lg:row-span-2"
                  : ""
            }
            key={project.id}
          >
            <PrimaryProjectCard
              locale={locale}
              project={project}
              variant={isAnchorProject(project) ? "anchor" : "compact"}
            />
          </div>
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

function SectionMarker({
  id,
  locale,
  title,
}: {
  id: "experience" | "about" | "contact";
  locale: Locale;
  title: string;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="mx-auto w-full max-w-6xl scroll-mt-28 border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8"
      id={id}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
        {copy[locale].nextMilestone}
      </p>
      <h2
        id={`${id}-title`}
        className="mt-3 text-3xl font-semibold text-zinc-100"
      >
        {title}
      </h2>
    </section>
  );
}

function HeroSection({ locale }: { locale: Locale }) {
  const labels = copy[locale];

  return (
    <section className="mx-auto flex min-h-[72svh] w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-20 sm:min-h-[78svh] sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <p className="text-base font-medium text-zinc-300">
          {profile.professionalTitle[locale]}
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-normal text-zinc-50 sm:text-6xl lg:text-7xl">
          Ema Marc
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
          {profile.summary?.[locale]}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
            href={`/${locale}#work`}
          >
            {labels.primaryCta}
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-zinc-100 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
            href={`/${locale}#contact`}
          >
            {labels.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PortfolioHome({ locale }: PortfolioHomeProps) {
  const labels = copy[locale];

  return (
    <main id="main-content" className="flex w-full flex-1 flex-col">
      <HeroSection locale={locale} />
      <WorkSection locale={locale} />
      <SectionMarker id="experience" locale={locale} title={labels.experience} />
      <SectionMarker id="about" locale={locale} title={labels.about} />
      <SectionMarker id="contact" locale={locale} title={labels.contact} />
    </main>
  );
}
