# Portfolio Atmosphere

Feature visual portable con:

- Ambient Light en calibracion Showcase.
- Edge Mist en calibracion Cinematic final para Atmosphere.
- Aura Smoke Cursor final en Canvas 2D.

## Requisitos

- React.
- Next.js App Router.
- TypeScript.
- Tailwind CSS v4 no es requerido por esta carpeta; los estilos complejos viven en el CSS Module local.

## Migracion

Copiar esta carpeta completa:

```txt
src/components/visual-effects/portfolio-atmosphere/
```

Importar:

```tsx
import { PortfolioAtmosphere } from "@/components/visual-effects/portfolio-atmosphere";
```

Montar el fondo antes del contenido:

```tsx
<div className="relative isolate min-h-screen bg-[#040304]">
  <PortfolioAtmosphere />
  <main className="relative z-10">{/* contenido */}</main>
</div>
```

`PortfolioAtmosphere` usa `position: fixed`, `z-index: 0`, `pointer-events: none` y `aria-hidden`. El contenido debe quedar por encima con un z-index mayor.

En mobile, Edge Mist se reduce a 4 masas y Aura Smoke no se inicializa en punteros touch/coarse. Con `prefers-reduced-motion: reduce`, Ambient y Edge quedan estaticos y Aura Smoke no se muestra.

No requiere reglas CSS externas: `portfolio-atmosphere.module.css` se importa desde los componentes.
