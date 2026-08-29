import type {
  WinterCertification,
  WinterEducation,
  WinterExperience,
  WinterKnowledge,
  WinterLanguage,
  WinterLiveApiEvidence,
  WinterPeriod,
  WinterProject,
  WinterProjectEvidence,
  WinterProjectLink,
  WinterTechnicalEvidence,
} from "./types";

const projectLinkLabels: Record<WinterProjectLink["type"], string> = {
  backendRepository: "Backend repository",
  certificate: "Certificate",
  demo: "Demo",
  frontendRepository: "Frontend repository",
  linkedinPost: "LinkedIn post",
  live: "Live URL",
  repository: "Repository",
};

const projectSectionLabels: Record<WinterProject["section"], string> = {
  backend: "Backend",
  frontend: "Frontend",
  other: "Other",
};

function hasText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function compactList(items: readonly string[]) {
  const values = items.filter(hasText);

  return values.length > 0 ? values.join(", ") : undefined;
}

function appendLine(
  lines: string[],
  label: string,
  value: number | string | undefined,
) {
  if (typeof value === "number" || hasText(value)) {
    lines.push(`${label}: ${value}`);
  }
}

function appendList(
  lines: string[],
  label: string,
  items: readonly string[],
) {
  const values = items.filter(hasText);

  if (values.length === 0) {
    return;
  }

  lines.push(`${label}:`);
  values.forEach((item) => {
    lines.push(`- ${item}`);
  });
}

function appendPeriod(lines: string[], period: WinterPeriod) {
  appendLine(lines, "Period start", period.start);
  appendLine(lines, "Period end", period.end);
}

function serializeIdentity(knowledge: WinterKnowledge) {
  const lines = ["[IDENTITY]"];

  appendLine(lines, "Name", knowledge.identity.name);
  appendLine(lines, "Locale", knowledge.locale);
  appendLine(lines, "Location", knowledge.location);

  return lines.join("\n");
}

function serializeProfessionalProfile(knowledge: WinterKnowledge) {
  const lines = ["[PROFILE]"];

  appendLine(lines, "Professional title", knowledge.professionalProfile.title);
  appendLine(lines, "Summary", knowledge.professionalProfile.summary);

  return lines.join("\n");
}

function serializeContact(knowledge: WinterKnowledge) {
  const lines = ["[CONTACT]"];

  appendLine(lines, "Email", knowledge.contact.email);
  appendLine(lines, "GitHub", knowledge.contact.links.github);
  appendLine(lines, "LinkedIn", knowledge.contact.links.linkedin);

  return lines.join("\n");
}

function serializeEducationItem(education: WinterEducation) {
  const lines: string[] = [];

  appendLine(lines, "Title", education.title);
  appendLine(lines, "Institution", education.institution);
  appendPeriod(lines, education.period);

  return lines.join("\n");
}

function serializeEducation(education: readonly WinterEducation[]) {
  if (education.length === 0) {
    return undefined;
  }

  return ["[EDUCATION]", ...education.map(serializeEducationItem)].join(
    "\n\n",
  );
}

function serializeCertification(certification: WinterCertification) {
  const lines: string[] = [];

  appendLine(lines, "Name", certification.name);
  appendLine(lines, "Issuer", certification.issuer);
  appendLine(lines, "Year", certification.year);
  appendLine(lines, "Hours", certification.hours);

  return lines.join("\n");
}

function serializeCertifications(
  certifications: readonly WinterCertification[],
) {
  if (certifications.length === 0) {
    return undefined;
  }

  return [
    "[CERTIFICATIONS]",
    ...certifications.map(serializeCertification),
  ].join("\n\n");
}

function serializeLanguage(language: WinterLanguage) {
  const lines: string[] = [];

  appendLine(lines, "Language", language.name);
  appendLine(lines, "Proficiency", language.proficiency);
  appendLine(lines, "Note", language.note);

  return lines.join("\n");
}

function serializeLanguages(languages: readonly WinterLanguage[]) {
  if (languages.length === 0) {
    return undefined;
  }

  return ["[LANGUAGES]", ...languages.map(serializeLanguage)].join("\n\n");
}

function serializeExperienceItem(experience: WinterExperience) {
  const lines: string[] = [];

  appendLine(lines, "Company", experience.company);
  appendLine(lines, "Role", experience.role);
  appendPeriod(lines, experience.period);
  appendLine(lines, "Summary", experience.summary);
  appendList(lines, "Highlights", experience.highlights);
  appendLine(lines, "Technologies", compactList(experience.technologies));

  return lines.join("\n");
}

function serializeExperience(experience: readonly WinterExperience[]) {
  if (experience.length === 0) {
    return undefined;
  }

  return ["[EXPERIENCE]", ...experience.map(serializeExperienceItem)].join(
    "\n\n",
  );
}

function appendProjectLinks(
  lines: string[],
  links: readonly WinterProjectLink[],
) {
  if (links.length === 0) {
    return;
  }

  lines.push("Links:");
  links.forEach((link) => {
    lines.push(`- ${projectLinkLabels[link.type]}: ${link.url}`);
  });
}

function appendLiveApiEvidence(
  lines: string[],
  evidence: WinterLiveApiEvidence,
) {
  lines.push("Live API evidence:");
  appendLine(lines, "Base URL", evidence.baseUrl);

  if (evidence.operations.length === 0) {
    return;
  }

  lines.push("Operations:");
  evidence.operations.forEach((operation) => {
    lines.push(
      `- ${operation.method} ${operation.path}: ${operation.description}`,
    );
  });
}

function appendTechnicalEvidence(
  lines: string[],
  evidence: WinterTechnicalEvidence,
) {
  lines.push("Technical evidence:");
  appendLine(lines, "Description", evidence.description);

  if (evidence.stages.length === 0) {
    return;
  }

  lines.push("Stages:");
  evidence.stages.forEach((stage) => {
    const items = compactList(stage.items);
    const suffix = items ? ` (${items})` : "";

    lines.push(`- ${stage.detailTitle}: ${stage.detailText}${suffix}`);
  });
}

function appendProjectEvidence(
  lines: string[],
  evidence: WinterProjectEvidence | undefined,
) {
  if (!evidence) {
    return;
  }

  if (evidence.liveApi) {
    appendLiveApiEvidence(lines, evidence.liveApi);
  }

  if (evidence.technical) {
    appendTechnicalEvidence(lines, evidence.technical);
  }
}

function serializeProject(project: WinterProject) {
  const lines: string[] = [];

  appendLine(lines, "Project", project.title);
  appendLine(lines, "Year", project.year);
  appendLine(lines, "Section", projectSectionLabels[project.section]);
  appendLine(lines, "Role", project.role);
  appendLine(lines, "Summary", project.summary);
  appendList(lines, "Highlights", project.highlights);
  appendLine(lines, "Technologies", compactList(project.technologies));
  appendProjectLinks(lines, project.links);
  appendProjectEvidence(lines, project.evidence);

  return lines.join("\n");
}

function serializeProjects(projects: readonly WinterProject[]) {
  if (projects.length === 0) {
    return undefined;
  }

  return ["[PROJECTS]", ...projects.map(serializeProject)].join("\n\n");
}

function serializeTechnologies(knowledge: WinterKnowledge) {
  const lines = ["[TECHNOLOGIES]"];

  appendLine(lines, "All", compactList(knowledge.technologies.all));
  appendLine(
    lines,
    "From professional experience",
    compactList(knowledge.technologies.fromExperience),
  );
  appendLine(
    lines,
    "From projects",
    compactList(knowledge.technologies.fromProjects),
  );

  return lines.join("\n");
}

function isSerializedSection(section: string | undefined): section is string {
  return typeof section === "string" && section.length > 0;
}

export function serializeWinterKnowledge(knowledge: WinterKnowledge) {
  return [
    serializeIdentity(knowledge),
    serializeProfessionalProfile(knowledge),
    serializeContact(knowledge),
    serializeEducation(knowledge.education),
    serializeCertifications(knowledge.certifications),
    serializeLanguages(knowledge.languages),
    serializeExperience(knowledge.experience),
    serializeProjects(knowledge.projects),
    serializeTechnologies(knowledge),
  ]
    .filter(isSerializedSection)
    .join("\n\n");
}
