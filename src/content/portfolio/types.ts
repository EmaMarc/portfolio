export type Locale = "es" | "en";

export type LocalizedText = {
  es: string;
  en: string;
};

export type ImageAsset = {
  src: string;
  alt: LocalizedText;
  width: number;
  height: number;
};

export type VideoAsset = {
  src: string;
  label: LocalizedText;
  width: number;
  height: number;
};

export type ProjectLinkKey =
  | "repository"
  | "frontendRepository"
  | "backendRepository"
  | "live"
  | "demo"
  | "linkedinPost"
  | "certificate";

export type LiveApiEvidence = {
  label: LocalizedText;
  defaultOperationId: string;
  loadingLabel: LocalizedText;
  errorLabel: LocalizedText;
  emptyInputLabel: LocalizedText;
  categoriesLabel: LocalizedText;
  jsonSummaryLabel: LocalizedText;
  liveResponseLabel: LocalizedText;
  searchEmptyTitle: LocalizedText;
  searchEmptyText: LocalizedText;
  suggestionLabel: LocalizedText;
  priceLabel: LocalizedText;
  resultSingularLabel: LocalizedText;
  resultPluralLabel: LocalizedText;
  operations: readonly LiveApiOperation[];
};

export type LiveApiOperation = {
  id: string;
  number: string;
  label: LocalizedText;
  method: "GET";
  path: string;
  description: LocalizedText;
  actionLabel?: LocalizedText;
  idleState: {
    text: LocalizedText;
    title: LocalizedText;
  };
  input?: {
    label: LocalizedText;
    placeholder: LocalizedText;
  };
};

export type TechnicalEvidenceStage = {
  id: string;
  number: string;
  label: LocalizedText;
  items: readonly LocalizedText[];
  detailTitle: LocalizedText;
  detailText: LocalizedText;
};

export type TechnicalEvidence = {
  id: string;
  label: LocalizedText;
  ariaLabel: LocalizedText;
  defaultStageId: string;
  stages: readonly TechnicalEvidenceStage[];
};

export type Education = {
  id: string;
  institution: string;
  title: LocalizedText;
  period: {
    start: string;
    end?: string;
  };
};

export type Certification = {
  id: string;
  name: LocalizedText;
  issuer: LocalizedText;
  year: number;
  hours?: number;
};

export type Language = {
  id: string;
  name: LocalizedText;
  proficiency: LocalizedText;
  note?: LocalizedText;
};

export type Profile = {
  name: string;
  professionalTitle: LocalizedText;
  headline?: LocalizedText;
  summary?: LocalizedText;
  location?: string;
  email?: string;
  links?: {
    github?: string;
    linkedin?: string;
  };
  education: readonly Education[];
  certifications: readonly Certification[];
  languages: readonly Language[];
};

export type Experience = {
  id: string;
  company: string;
  role: LocalizedText;
  period: {
    start: string;
    end?: string;
  };
  summary?: LocalizedText;
  highlights: readonly LocalizedText[];
  technologies: readonly string[];
};

export type Project = {
  id: string;
  title: string;
  year: number;
  section: "frontend" | "backend" | "other";
  role?: LocalizedText;
  summary?: LocalizedText;
  technologies: readonly string[];
  highlights: readonly LocalizedText[];
  liveApiEvidence?: LiveApiEvidence;
  technicalEvidence?: TechnicalEvidence;
  media?: {
    contextualCta?: {
      linkKey: "linkedinPost";
      metadata: LocalizedText;
      label: LocalizedText;
    };
    poster?: ImageAsset;
    videoPreview?: VideoAsset;
    screenshots?: readonly ImageAsset[];
  };
  linkLabels?: Partial<Record<ProjectLinkKey, LocalizedText>>;
  links?: Partial<Record<ProjectLinkKey, string>>;
};
