import { notFound } from "next/navigation";
import type { Locale } from "@/content/portfolio";
import { isSupportedLocale } from "@/lib/locale";

const shellCopy = {
  es: {
    eyebrow: "Prototipo estructural",
    intro: "Base localizada del portfolio.",
    pending: "Destino temporal para el proximo micro-hito.",
    sections: {
      work: "Proyectos",
      experience: "Experiencia",
      about: "Sobre mi",
      contact: "Contacto",
    },
  },
  en: {
    eyebrow: "Structural prototype",
    intro: "Localized portfolio base.",
    pending: "Temporary target for the next micro-milestone.",
    sections: {
      work: "Work",
      experience: "Experience",
      about: "About",
      contact: "Contact",
    },
  },
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    intro: string;
    pending: string;
    sections: Record<"work" | "experience" | "about" | "contact", string>;
  }
>;

export default async function LocalizedHomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const copy = shellCopy[locale];
  const sections = Object.entries(copy.sections);

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8"
    >
      <section
        aria-labelledby="shell-title"
        className="flex min-h-[calc(100svh-5rem)] flex-col justify-end pb-16 pt-24"
      >
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
          {copy.eyebrow}
        </p>
        <h1
          id="shell-title"
          className="mt-5 max-w-3xl text-5xl font-semibold tracking-normal text-zinc-50 sm:text-6xl lg:text-7xl"
        >
          Ema Marc
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
          {copy.intro}
        </p>
      </section>

      {sections.map(([id, title]) => (
        <section
          aria-labelledby={`${id}-title`}
          className="min-h-[55svh] scroll-mt-28 border-t border-white/10 py-16"
          id={id}
          key={id}
        >
          <p className="text-sm text-zinc-500">{copy.pending}</p>
          <h2
            id={`${id}-title`}
            className="mt-3 text-2xl font-semibold text-zinc-100"
          >
            {title}
          </h2>
        </section>
      ))}
    </main>
  );
}
