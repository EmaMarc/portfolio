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
  role?: LocalizedText;
  summary?: LocalizedText;
  technologies: readonly string[];
  highlights: readonly LocalizedText[];
  media?: {
    poster?: ImageAsset;
    videoPreview?: VideoAsset;
    screenshots?: readonly ImageAsset[];
  };
  links?: {
    repository?: string;
    frontendRepository?: string;
    backendRepository?: string;
    live?: string;
    demo?: string;
    linkedinPost?: string;
    certificate?: string;
  };
  featured?: boolean;
};
