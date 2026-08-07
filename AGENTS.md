# Guia permanente para agentes

Idioma de trabajo con el usuario: espanol.

## Proposito del proyecto

Este repositorio contiene el portfolio profesional de Emanuel Marcello.

Objetivo:

- presentar experiencia, proyectos y habilidades como Frontend / Full Stack Developer;
- transmitir criterio profesional, calidad visual y solidez tecnica;
- mantener una base simple, performante, accesible, SEO-friendly y lista para evolucionar;
- mostrar trabajo real con estandares de produccion, no un demo generico.

El portfolio tendra soporte para contenido en espanol e ingles en un hito futuro.

## Stack actual

Tecnologias presentes en este proyecto:

- Next.js 16.2.11;
- React 19.2.4;
- TypeScript;
- Tailwind CSS v4;
- App Router;
- carpeta `src/`;
- ESLint;
- npm;
- alias `@/*`.

No documentar ni asumir tecnologias que no existan en el repositorio.

No asumir APIs de versiones anteriores de Next.js. Antes de usar APIs, convenciones o archivos especiales cuya implementacion pueda haber cambiado, leer la documentacion local en `node_modules/next/dist/docs/`.

## Next.js y React

- Usar App Router bajo `src/app`.
- Mantener Server Components por defecto.
- Usar Client Components solo cuando sean necesarios por estado interactivo, efectos, eventos, browser APIs o animaciones dependientes del cliente.
- Mantener la frontera cliente/servidor lo mas pequena posible.
- No convertir layouts o paginas completas en Client Components sin una razon tecnica clara.
- Usar APIs oficiales de Next.js para metadata, fonts, imagenes y navegacion cuando corresponda.

## TypeScript

- Mantener TypeScript estricto.
- Evitar `any`.
- No debilitar `tsconfig.json` para ocultar errores.
- Preferir tipos claros, locales y cercanos al codigo que los usa.
- No crear abstracciones genericas antes de tener una necesidad real.

## Arquitectura

Principios:

- KISS;
- DRY;
- claridad antes que ingenieria ornamental;
- cohesion por responsabilidad;
- escalabilidad simple e incremental.

Evitar:

- abstracciones prematuras;
- refactors no relacionados;
- componentes gigantes;
- carpetas vacias creadas por anticipacion;
- sistemas genericos para problemas que todavia no existen.

La arquitectura debe crecer por hitos concretos y no por especulacion.

## Dependencias

No instalar dependencias sin justificacion.

Antes de agregar una dependencia, explicar:

- que problema concreto resuelve;
- por que React, Next.js, CSS, Tailwind o APIs nativas no alcanzan;
- impacto aproximado en bundle, complejidad y mantenimiento.

No ejecutar `npm audit fix --force`.

## Accesibilidad

WCAG es requisito del proyecto.

Mantener:

- HTML semantico;
- jerarquia correcta de headings;
- navegacion por teclado;
- focus visible;
- contraste suficiente;
- nombres y labels accesibles;
- targets interactivos adecuados;
- estados que no dependan solo del color;
- respeto por `prefers-reduced-motion`.

Los elementos decorativos deben usar `aria-hidden` cuando corresponda y no deben capturar interacciones si no son interactivos.

## Responsive

Trabajar mobile-first.

Validar el diseno para:

- mobile;
- tablet;
- desktop;
- pantallas amplias.

Evitar overflow horizontal y dependencias rigidas del viewport.

## Performance

Performance es una prioridad.

Evitar:

- JavaScript innecesario;
- rerenders de alta frecuencia;
- trabajo costoso por frame;
- listeners sin cleanup;
- imagenes sin optimizar;
- animaciones de propiedades costosas.

Preferir animar `transform` y `opacity`.

Cuando haya animacion de alta frecuencia, no usar React state por frame; usar refs y browser APIs cuando sea mas apropiado, con cleanup correcto.

## SEO

El portfolio debe terminar con SEO completo.

Usar las APIs de metadata de Next.js para:

- title;
- description;
- canonical cuando corresponda;
- Open Graph;
- Twitter metadata;
- robots;
- sitemap;
- metadata localizada ES/EN cuando exista el hito bilingue.

No dejar metadata placeholder en produccion.

## Contenido ES / EN

El soporte bilingue sera un hito futuro.

No implementar una solucion compleja de internacionalizacion antes de necesitarla. Cuando llegue ese hito, decidir la arquitectura considerando SEO, App Router, URLs localizadas, mantenibilidad y simplicidad.

## Seguridad

- No modificar archivos `.env` sin pedido explicito.
- No exponer secretos.
- No hardcodear tokens, claves o credenciales.
- No imprimir informacion sensible en logs.
- Tratar datos externos como no confiables.

## Workflow con Codex

Trabajar de forma incremental.

Antes de modificar codigo:

1. leer `AGENTS.md`;
2. inspeccionar los archivos relacionados;
3. explicar brevemente el enfoque;
4. enumerar exactamente que archivos se modificaran.

Dividir tareas grandes en hitos pequenos y validables.

No hacer cambios fuera del alcance pedido. No redisenar, recalibrar ni refactorizar partes no solicitadas.

Despues de cada cambio, explicar que cambio, por que y que archivos quedaron modificados.

## Validaciones

Para cambios de codigo, ejecutar cuando corresponda:

```bash
npm run lint
npm run build
git diff --check
git status --short
```

Si en el futuro existen scripts de `typecheck` o tests, incluirlos en las validaciones relevantes.

Para cambios solo de documentacion, no ejecutar build salvo que el usuario lo pida.

## Git

- Mantener cambios acotados.
- No revertir trabajo existente que no pertenezca a la tarea actual.
- No hacer commits automaticos.
- Solo commitear si el usuario lo pide explicitamente.
- Mostrar el estado de Git al cerrar tareas con cambios.

## PortfolioAtmosphere

La carpeta:

`src/components/visual-effects/portfolio-atmosphere/`

contiene las versiones visuales finales aprobadas de:

- Ambient Light;
- Edge Mist;
- Aura Smoke Cursor.

No recalibrar ni modificar colores, tamanos, timings, keyframes, pool, DPR, responsive o `prefers-reduced-motion` salvo que exista un pedido explicito, un bug o un problema real de performance/accesibilidad.

No documentar ni arrastrar experimentos descartados del Background Lab.

Esta feature debe seguir siendo decorativa, sin bloquear clicks ni capturar eventos cuando actue como fondo global.

## Criterio de finalizacion

Una tarea esta terminada solo si:

- responde exactamente al pedido;
- mantiene accesibilidad;
- mantiene responsive design;
- preserva performance;
- no introduce complejidad innecesaria;
- mantiene decisiones visuales aprobadas;
- deja claro que archivos cambiaron y que validaciones se ejecutaron.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
