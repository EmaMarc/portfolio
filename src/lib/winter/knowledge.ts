import {
  experiences,
  profile,
  projects,
  type Locale,
  type LocalizedText,
  type Project,
  type ProjectLinkKey,
} from "@/content/portfolio";
import type {
  WinterContact,
  WinterKnowledge,
  WinterLiveApiEvidence,
  WinterProject,
  WinterProjectEvidence,
  WinterProjectLink,
  WinterTechnicalEvidence,
  WinterTechnologyIndex,
} from "./types";

const projectLinkKeys = [
  "repository",
  "frontendRepository",
  "backendRepository",
  "live",
  "demo",
  "linkedinPost",
  "certificate",
] as const satisfies readonly ProjectLinkKey[];

function resolveText(text: LocalizedText, locale: Locale) {
  return text[locale];
}

function resolveOptionalText(
  text: LocalizedText | undefined,
  locale: Locale,
) {
  return text ? resolveText(text, locale) : undefined;
}

function getCertificationHours(
  certification: (typeof profile.certifications)[number],
) {
  return "hours" in certification ? certification.hours : undefined;
}

function getLanguageNote(
  language: (typeof profile.languages)[number],
  locale: Locale,
) {
  const note = "note" in language ? language.note : undefined;

  return note ? resolveText(note, locale) : undefined;
}

function buildContact(): WinterContact {
  return {
    email: profile.email,
    links: {
      github: profile.links?.github,
      linkedin: profile.links?.linkedin,
    },
  };
}

function collectUniqueTechnologies(
  groups: readonly (readonly string[])[],
) {
  return Array.from(
    groups.reduce((technologies, group) => {
      group.forEach((technology) => {
        technologies.add(technology);
      });

      return technologies;
    }, new Set<string>()),
  );
}

function buildTechnologyIndex(): WinterTechnologyIndex {
  const fromExperience = collectUniqueTechnologies(
    experiences.map((experience) => experience.technologies),
  );
  const fromProjects = collectUniqueTechnologies(
    projects.map((project) => project.technologies),
  );

  return {
    all: collectUniqueTechnologies([fromExperience, fromProjects]),
    fromExperience,
    fromProjects,
  };
}

function buildProjectLinks(project: Project): readonly WinterProjectLink[] {
  return projectLinkKeys.flatMap((type) => {
    const url = project.links?.[type];

    return url ? [{ type, url }] : [];
  });
}

function buildLiveApiEvidence(
  project: Project,
  locale: Locale,
): WinterLiveApiEvidence | undefined {
  if (!project.liveApiEvidence) {
    return undefined;
  }

  return {
    baseUrl: project.links?.live,
    label: resolveText(project.liveApiEvidence.label, locale),
    operations: project.liveApiEvidence.operations.map((operation) => ({
      description: resolveText(operation.description, locale),
      id: operation.id,
      label: resolveText(operation.label, locale),
      method: operation.method,
      path: operation.path,
    })),
  };
}

function buildTechnicalEvidence(
  project: Project,
  locale: Locale,
): WinterTechnicalEvidence | undefined {
  if (!project.technicalEvidence) {
    return undefined;
  }

  return {
    description: resolveText(project.technicalEvidence.ariaLabel, locale),
    label: resolveText(project.technicalEvidence.label, locale),
    stages: project.technicalEvidence.stages.map((stage) => ({
      detailText: resolveText(stage.detailText, locale),
      detailTitle: resolveText(stage.detailTitle, locale),
      id: stage.id,
      items: stage.items.map((item) => resolveText(item, locale)),
      label: resolveText(stage.label, locale),
    })),
  };
}

function buildProjectEvidence(
  project: Project,
  locale: Locale,
): WinterProjectEvidence | undefined {
  const liveApi = buildLiveApiEvidence(project, locale);
  const technical = buildTechnicalEvidence(project, locale);

  return liveApi || technical ? { liveApi, technical } : undefined;
}

function buildProject(project: Project, locale: Locale): WinterProject {
  return {
    evidence: buildProjectEvidence(project, locale),
    highlights: project.highlights.map((highlight) =>
      resolveText(highlight, locale),
    ),
    id: project.id,
    links: buildProjectLinks(project),
    role: resolveOptionalText(project.role, locale),
    section: project.section,
    summary: resolveOptionalText(project.summary, locale),
    technologies: [...project.technologies],
    title: project.title,
    year: project.year,
  };
}

export function buildWinterKnowledge(locale: Locale): WinterKnowledge {
  return {
    certifications: profile.certifications.map((certification) => ({
      hours: getCertificationHours(certification),
      id: certification.id,
      issuer: resolveText(certification.issuer, locale),
      name: resolveText(certification.name, locale),
      year: certification.year,
    })),
    contact: buildContact(),
    education: profile.education.map((education) => ({
      id: education.id,
      institution: education.institution,
      period: { ...education.period },
      title: resolveText(education.title, locale),
    })),
    experience: experiences.map((experience) => ({
      company: experience.company,
      highlights: experience.highlights.map((highlight) =>
        resolveText(highlight, locale),
      ),
      id: experience.id,
      period: { ...experience.period },
      role: resolveText(experience.role, locale),
      summary: resolveOptionalText(experience.summary, locale),
      technologies: [...experience.technologies],
    })),
    identity: {
      name: profile.name,
    },
    languages: profile.languages.map((language) => ({
      id: language.id,
      name: resolveText(language.name, locale),
      note: getLanguageNote(language, locale),
      proficiency: resolveText(language.proficiency, locale),
    })),
    locale,
    location: profile.location,
    professionalProfile: {
      summary: resolveOptionalText(profile.summary, locale),
      title: resolveText(profile.professionalTitle, locale),
    },
    projects: projects.map((project) => buildProject(project, locale)),
    technologies: buildTechnologyIndex(),
  };
}
