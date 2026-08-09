import Image from "next/image";
import Link from "next/link";
import { experiences, profile, projects } from "@/content/portfolio";
import type {
  Certification,
  Education,
  Experience,
  Locale,
  Project,
} from "@/content/portfolio";

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
    depth: "Ver detalles",
    depthClose: "Ocultar detalles",
    depthIntro: "Highlights y stack completo disponibles para profundizar.",
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
    moreContributions: "Más contribuciones",
    moreOnGithub: "Más en GitHub",
    nextMilestone: "Próximo hito estructural",
    otherWork: "Otros proyectos",
    present: "Actualidad",
    primaryCta: "Explorar proyectos",
    portraitAlt: "Retrato de Emanuel Marcello",
    secondaryCta: "Contacto",
    selectedCredentials: "Credenciales seleccionadas",
    selectedContributions: "Contribuciones principales",
    stack: "Stack",
    studies: "Formación",
    technicalPlaceholder: "Superficie reservada para evidencia técnica real",
    work: "Proyectos",
  },
  en: {
    about: "About",
    additionalContributions: "Additional contributions",
    backend: "Backend",
    backendRepository: "Backend repository",
    certificate: "Certificate",
    contact: "Contact",
    depth: "View details",
    depthClose: "Hide details",
    depthIntro: "Highlights and full stack are available for deeper review.",
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
    moreContributions: "More contributions",
    moreOnGithub: "More on GitHub",
    nextMilestone: "Next structural milestone",
    otherWork: "Other Work",
    present: "Present",
    primaryCta: "Explore my work",
    portraitAlt: "Portrait of Emanuel Marcello",
    secondaryCta: "Contact",
    selectedCredentials: "Selected credentials",
    selectedContributions: "Selected contributions",
    stack: "Stack",
    studies: "Education",
    technicalPlaceholder: "Surface reserved for real technical evidence",
    work: "Work",
  },
} satisfies Record<Locale, Record<string, string>>;

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

const selectedCredentialIds = [
  "talento-tech-backend-node",
  "oracle-one-java-spring-g7",
  "english-for-it",
] as const;

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

function formatCredentialMeta(credential: Certification) {
  return [String(credential.year), credential.hours ? `${credential.hours} h` : ""]
    .filter(Boolean)
    .join(" · ");
}

function getSelectedCredentials() {
  return selectedCredentialIds.flatMap((credentialId) => {
    const credential = profile.certifications.find(
      (certification) => certification.id === credentialId,
    );

    return credential ? [credential] : [];
  });
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
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
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
          <h5 className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
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
          <h5 className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
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
        <p className="font-mono text-xs leading-5 text-zinc-600">
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
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
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

function AboutSection({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const selectedCredentials = getSelectedCredentials();

  return (
    <section
      aria-labelledby="about-title"
      className="mx-auto w-full max-w-6xl scroll-mt-28 border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8"
      id="about"
    >
      <h2
        className="text-4xl font-semibold tracking-normal text-zinc-50 sm:text-5xl"
        id="about-title"
      >
        {labels.about}
      </h2>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(17rem,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
        <div className="order-2 lg:order-1 lg:row-span-2">
          <div className="relative aspect-square w-full max-w-[23rem] overflow-hidden rounded-[4px] border border-white/[0.08] shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:max-w-[26rem] lg:max-w-none">
            <Image
              alt={labels.portraitAlt}
              className="object-cover object-center"
              fill
              loading="lazy"
              sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 26rem, 30vw"
              src="/media/profile/emanuel-marcello.png"
            />
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
            {profile.professionalTitle[locale]}
          </p>
          {profile.summary ? (
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9">
              {profile.summary[locale]}
            </p>
          ) : null}
        </div>

        <div className="order-3 min-w-0 space-y-8 lg:order-3">
          <section aria-labelledby="about-education-title">
            <h3
              className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600"
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
                  <p className="mt-2 font-mono text-xs text-zinc-600">
                    {formatYearPeriod(education.period, locale)}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="about-languages-title">
            <h3
              className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600"
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
                    <span className="text-zinc-600"> — </span>
                    <span>{language.proficiency[locale]}</span>
                  </p>
                  {language.note ? (
                    <p className="mt-1 text-zinc-500">{language.note[locale]}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="about-credentials-title">
            <h3
              className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600"
              id="about-credentials-title"
            >
              {labels.selectedCredentials}
            </h3>
            <ol className="mt-4 divide-y divide-white/[0.08] border-t border-white/[0.08]">
              {selectedCredentials.map((credential) => (
                <li className="py-4" key={credential.id}>
                  <p className="text-sm font-medium text-zinc-200">
                    {credential.name[locale]}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    {credential.issuer[locale]}
                  </p>
                  <p className="mt-2 font-mono text-xs text-zinc-600">
                    {formatCredentialMeta(credential)}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}

function SectionMarker({
  id,
  locale,
  title,
}: {
  id: "about" | "contact";
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
      <ExperienceSection locale={locale} />
      <AboutSection locale={locale} />
      <SectionMarker id="contact" locale={locale} title={labels.contact} />
    </main>
  );
}
