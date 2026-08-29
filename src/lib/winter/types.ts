import type { Locale, ProjectLinkKey } from "@/content/portfolio";

export type WinterPeriod = {
  start: string;
  end?: string;
};

export type WinterIdentity = {
  name: string;
};

export type WinterProfessionalProfile = {
  summary?: string;
  title: string;
};

export type WinterContact = {
  email?: string;
  links: {
    github?: string;
    linkedin?: string;
  };
};

export type WinterEducation = {
  id: string;
  institution: string;
  period: WinterPeriod;
  title: string;
};

export type WinterCertification = {
  hours?: number;
  id: string;
  issuer: string;
  name: string;
  year: number;
};

export type WinterLanguage = {
  id: string;
  name: string;
  note?: string;
  proficiency: string;
};

export type WinterProjectLink = {
  type: ProjectLinkKey;
  url: string;
};

export type WinterLiveApiOperation = {
  description: string;
  id: string;
  label: string;
  method: "GET";
  path: string;
};

export type WinterLiveApiEvidence = {
  baseUrl?: string;
  label: string;
  operations: readonly WinterLiveApiOperation[];
};

export type WinterTechnicalEvidenceStage = {
  detailText: string;
  detailTitle: string;
  id: string;
  items: readonly string[];
  label: string;
};

export type WinterTechnicalEvidence = {
  description: string;
  label: string;
  stages: readonly WinterTechnicalEvidenceStage[];
};

export type WinterProjectEvidence = {
  liveApi?: WinterLiveApiEvidence;
  technical?: WinterTechnicalEvidence;
};

export type WinterExperience = {
  company: string;
  highlights: readonly string[];
  id: string;
  period: WinterPeriod;
  role: string;
  summary?: string;
  technologies: readonly string[];
};

export type WinterProject = {
  evidence?: WinterProjectEvidence;
  highlights: readonly string[];
  id: string;
  links: readonly WinterProjectLink[];
  role?: string;
  section: "frontend" | "backend" | "other";
  summary?: string;
  technologies: readonly string[];
  title: string;
  year: number;
};

export type WinterTechnologyIndex = {
  all: readonly string[];
  fromExperience: readonly string[];
  fromProjects: readonly string[];
};

export type WinterKnowledge = {
  certifications: readonly WinterCertification[];
  contact: WinterContact;
  education: readonly WinterEducation[];
  experience: readonly WinterExperience[];
  identity: WinterIdentity;
  languages: readonly WinterLanguage[];
  locale: Locale;
  location?: string;
  professionalProfile: WinterProfessionalProfile;
  projects: readonly WinterProject[];
  technologies: WinterTechnologyIndex;
};
