import type { Locale } from "@/content/portfolio";

const winterIdentityFacts = {
  es: [
    "Winter AI lleva ese nombre por el perrito de Ema, que se llama Winter.",
    "El nombre del perro está inspirado en Game of Thrones.",
    "Ema decidió usar ese mismo nombre para el asistente de su portfolio.",
  ],
  en: [
    "Winter AI is named after Ema's little dog, whose name is Winter.",
    "The dog's name is inspired by Game of Thrones.",
    "Ema decided to use the same name for the assistant in his portfolio.",
  ],
} satisfies Record<Locale, readonly string[]>;

export function serializeWinterIdentity(locale: Locale) {
  return [
    "[WINTER IDENTITY]",
    ...winterIdentityFacts[locale].map(
      (fact, index) => `Fact ${index + 1}: ${fact}`,
    ),
  ].join("\n");
}
