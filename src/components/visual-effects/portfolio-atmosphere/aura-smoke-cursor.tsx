"use client";

import { useEffect, useRef } from "react";
import styles from "./portfolio-atmosphere.module.css";

const PUFF_COUNT = 16;
const SPRITE_COUNT = 3;
const SPRITE_SIZE = 128;
const CANVAS_DPR = 1;
const MIN_EMISSION_DISTANCE_PX = 10;
const MAX_EMISSION_DISTANCE_PX = 16;
const MIN_EMISSION_INTERVAL_MS = 36;
const MAX_EMISSIONS_PER_MOVE = 2;
const MAX_DT_MS = 48;
const AURA_FADE_MS = 260;
const TWO_PI = Math.PI * 2;

type RgbColor = readonly [number, number, number];

type SpriteStop = {
  alpha: number;
  color: RgbColor;
  stop: number;
};

type SpriteBlob = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  stops: readonly SpriteStop[];
};

type SmokePuff = {
  active: boolean;
  alpha: number;
  aspectX: number;
  aspectY: number;
  birthTime: number;
  driftX: number;
  driftY: number;
  endSize: number;
  lifeMs: number;
  rotation: number;
  rotationDrift: number;
  spriteIndex: number;
  startSize: number;
  turbulencePhase: number;
  turbulenceSpeed: number;
  turbulenceX: number;
  turbulenceY: number;
  x: number;
  y: number;
};

const DARK_WINE: RgbColor = [88, 36, 47];
const BURGUNDY: RgbColor = [109, 41, 55];
const SOFT_BURGUNDY: RgbColor = [127, 48, 64];
const WINE_RED: RgbColor = [146, 55, 71];
const CRIMSON_RED: RgbColor = [166, 64, 80];
const HIGHLIGHT_RED: RgbColor = [179, 74, 91];

const spriteDefinitions: readonly (readonly SpriteBlob[])[] = [
  [
    {
      centerX: 55,
      centerY: 58,
      radiusX: 58,
      radiusY: 42,
      rotation: -0.28,
      stops: [
        { alpha: 0.86, color: HIGHLIGHT_RED, stop: 0 },
        { alpha: 0.56, color: CRIMSON_RED, stop: 0.32 },
        { alpha: 0.18, color: BURGUNDY, stop: 0.68 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 78,
      centerY: 70,
      radiusX: 38,
      radiusY: 54,
      rotation: 0.45,
      stops: [
        { alpha: 0.46, color: WINE_RED, stop: 0 },
        { alpha: 0.2, color: SOFT_BURGUNDY, stop: 0.58 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 42,
      centerY: 82,
      radiusX: 34,
      radiusY: 24,
      rotation: -0.1,
      stops: [
        { alpha: 0.34, color: CRIMSON_RED, stop: 0 },
        { alpha: 0.12, color: BURGUNDY, stop: 0.56 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 92,
      centerY: 48,
      radiusX: 28,
      radiusY: 18,
      rotation: -0.56,
      stops: [
        { alpha: 0.2, color: WINE_RED, stop: 0 },
        { alpha: 0.08, color: BURGUNDY, stop: 0.62 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
  ],
  [
    {
      centerX: 66,
      centerY: 52,
      radiusX: 44,
      radiusY: 60,
      rotation: 0.2,
      stops: [
        { alpha: 0.78, color: WINE_RED, stop: 0 },
        { alpha: 0.48, color: SOFT_BURGUNDY, stop: 0.36 },
        { alpha: 0.16, color: DARK_WINE, stop: 0.7 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 45,
      centerY: 72,
      radiusX: 50,
      radiusY: 34,
      rotation: -0.48,
      stops: [
        { alpha: 0.44, color: HIGHLIGHT_RED, stop: 0 },
        { alpha: 0.18, color: WINE_RED, stop: 0.62 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 84,
      centerY: 80,
      radiusX: 28,
      radiusY: 38,
      rotation: 0.36,
      stops: [
        { alpha: 0.24, color: BURGUNDY, stop: 0 },
        { alpha: 0.1, color: DARK_WINE, stop: 0.66 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 82,
      centerY: 35,
      radiusX: 34,
      radiusY: 24,
      rotation: 0.68,
      stops: [
        { alpha: 0.2, color: WINE_RED, stop: 0 },
        { alpha: 0.08, color: DARK_WINE, stop: 0.64 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
  ],
  [
    {
      centerX: 55,
      centerY: 66,
      radiusX: 60,
      radiusY: 40,
      rotation: 0.34,
      stops: [
        { alpha: 0.76, color: SOFT_BURGUNDY, stop: 0 },
        { alpha: 0.46, color: WINE_RED, stop: 0.34 },
        { alpha: 0.15, color: DARK_WINE, stop: 0.7 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 78,
      centerY: 48,
      radiusX: 42,
      radiusY: 30,
      rotation: -0.35,
      stops: [
        { alpha: 0.42, color: CRIMSON_RED, stop: 0 },
        { alpha: 0.18, color: WINE_RED, stop: 0.6 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 70,
      centerY: 88,
      radiusX: 48,
      radiusY: 28,
      rotation: 0.18,
      stops: [
        { alpha: 0.28, color: BURGUNDY, stop: 0 },
        { alpha: 0.12, color: DARK_WINE, stop: 0.58 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
    {
      centerX: 38,
      centerY: 44,
      radiusX: 28,
      radiusY: 36,
      rotation: -0.72,
      stops: [
        { alpha: 0.2, color: HIGHLIGHT_RED, stop: 0 },
        { alpha: 0.08, color: BURGUNDY, stop: 0.62 },
        { alpha: 0, color: DARK_WINE, stop: 1 },
      ],
    },
  ],
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value: number) {
  const inverse = 1 - value;

  return 1 - inverse * inverse * inverse;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function rgba(color: RgbColor, alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${clamp(alpha, 0, 1)})`;
}

function createEmptyPuff(): SmokePuff {
  return {
    active: false,
    alpha: 0,
    aspectX: 1,
    aspectY: 1,
    birthTime: 0,
    driftX: 0,
    driftY: 0,
    endSize: 0,
    lifeMs: 0,
    rotation: 0,
    rotationDrift: 0,
    spriteIndex: 0,
    startSize: 0,
    turbulencePhase: 0,
    turbulenceSpeed: 0,
    turbulenceX: 0,
    turbulenceY: 0,
    x: 0,
    y: 0,
  };
}

function drawSpriteBlob(
  context: CanvasRenderingContext2D,
  blob: SpriteBlob,
) {
  context.save();
  context.translate(blob.centerX, blob.centerY);
  context.rotate(blob.rotation);
  context.scale(blob.radiusX / blob.radiusY, 1);

  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, blob.radiusY);

  blob.stops.forEach((stop) => {
    gradient.addColorStop(stop.stop, rgba(stop.color, stop.alpha));
  });

  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, blob.radiusY, 0, TWO_PI);
  context.fill();
  context.restore();
}

function createSmokeSprite(definition: readonly SpriteBlob[]) {
  const sprite = document.createElement("canvas");
  const context = sprite.getContext("2d", { alpha: true });

  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;

  if (!context) {
    return sprite;
  }

  definition.forEach((blob) => {
    drawSpriteBlob(context, blob);
  });

  return sprite;
}

function findReusablePuff(puffs: SmokePuff[], startIndex: number) {
  for (let offset = 0; offset < puffs.length; offset += 1) {
    const index = (startIndex + offset) % puffs.length;

    if (!puffs[index].active) {
      return index;
    }
  }

  let oldestIndex = 0;
  let oldestBirthTime = puffs[0].birthTime;

  for (let index = 1; index < puffs.length; index += 1) {
    if (puffs[index].birthTime < oldestBirthTime) {
      oldestBirthTime = puffs[index].birthTime;
      oldestIndex = index;
    }
  }

  return oldestIndex;
}

function drawPuff(
  context: CanvasRenderingContext2D,
  sprites: readonly HTMLCanvasElement[],
  puff: SmokePuff,
  now: number,
) {
  const age = clamp((now - puff.birthTime) / puff.lifeMs, 0, 1);

  if (age >= 1) {
    puff.active = false;
    return false;
  }

  const grow = easeOutCubic(age);
  const size = puff.startSize + (puff.endSize - puff.startSize) * grow;
  const width = Math.min(size * puff.aspectX, 240);
  const height = Math.min(size * puff.aspectY, 240);
  const fadeIn = clamp(age / 0.12, 0, 1);
  const fadeHold = age < 0.3 ? 1 : 1 - (age - 0.3) / 0.7;
  const fadeOut = Math.pow(clamp(fadeHold, 0, 1), 1.85);
  const alpha = puff.alpha * fadeIn * fadeOut;

  if (alpha <= 0.004) {
    return true;
  }

  const turbulence =
    Math.sin(puff.turbulencePhase + age * puff.turbulenceSpeed) *
    (1 - age) *
    5.8;
  const x = puff.x + puff.driftX * grow + puff.turbulenceX * turbulence;
  const y = puff.y + puff.driftY * grow + puff.turbulenceY * turbulence;

  context.save();
  context.globalAlpha = alpha;
  context.translate(x, y);
  context.rotate(puff.rotation + puff.rotationDrift * grow);
  context.drawImage(
    sprites[puff.spriteIndex],
    -width / 2,
    -height / 2,
    width,
    height,
  );
  context.restore();

  return true;
}

export function AuraSmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const mountedCanvas = canvasRef.current;

    if (!mountedCanvas) {
      return undefined;
    }

    const mountedContext = mountedCanvas.getContext("2d", { alpha: true });

    if (!mountedContext) {
      return undefined;
    }

    const canvas = mountedCanvas;
    const context = mountedContext;

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const sprites = spriteDefinitions.map((definition) =>
      createSmokeSprite(definition),
    );
    const puffs = Array.from({ length: PUFF_COUNT }, createEmptyPuff);

    let auraDirectionX = 0;
    let auraDirectionY = 0;
    let auraOpacity = 0;
    let auraTargetX = 0;
    let auraTargetY = 0;
    let auraX = 0;
    let auraY = 0;
    let canvasHeight = 0;
    let canvasWidth = 0;
    let frameId: number | null = null;
    let hasRuntimeListeners = false;
    let isEnabled = false;
    let lastEmissionTimestamp = 0;
    let lastEmissionX = 0;
    let lastEmissionY = 0;
    let lastFrameTimestamp: number | null = null;
    let lastMoveTimestamp = 0;
    let previousX = 0;
    let previousY = 0;
    let puffIndex = 0;
    let trackingStarted = false;

    const resizeCanvas = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      const scaledWidth = Math.max(1, Math.floor(width * CANVAS_DPR));
      const scaledHeight = Math.max(1, Math.floor(height * CANVAS_DPR));

      if (
        canvas.width === scaledWidth &&
        canvas.height === scaledHeight &&
        canvasWidth === width &&
        canvasHeight === height
      ) {
        return;
      }

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      canvasWidth = width;
      canvasHeight = height;
      context.setTransform(CANVAS_DPR, 0, 0, CANVAS_DPR, 0, 0);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    };

    const clearCanvas = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
    };

    const cancelFrame = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const requestFrame = () => {
      if (frameId === null && isEnabled && !document.hidden) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const resetRuntime = () => {
      cancelFrame();
      puffs.forEach((puff) => {
        puff.active = false;
      });
      auraOpacity = 0;
      lastFrameTimestamp = null;
      lastEmissionTimestamp = 0;
      trackingStarted = false;
      resizeCanvas();
      clearCanvas();
    };

    const emitPuff = (
      x: number,
      y: number,
      directionX: number,
      directionY: number,
      speedFactor: number,
      timestamp: number,
    ) => {
      const reusableIndex = findReusablePuff(puffs, puffIndex);
      const puff = puffs[reusableIndex];
      const perpendicularX = -directionY;
      const perpendicularY = directionX;
      const startSize = randomBetween(76, 96);
      const growth = randomBetween(1.55, 1.78);
      const driftDistance = randomBetween(8, 16) + speedFactor * 6;
      const sideDrift = randomBetween(-6, 6);
      const spawnDistance = randomBetween(12, 22) + speedFactor * 8;
      const perpendicularSpawnOffset = randomBetween(-4, 7);
      const alphaVariation = randomBetween(0.9, 1.1);

      puff.active = true;
      puff.alpha = clamp(
        (randomBetween(0.18, 0.3) + speedFactor * 0.09) * alphaVariation,
        0.18,
        0.42,
      );
      puff.aspectX = randomBetween(0.8, 1.24);
      puff.aspectY = randomBetween(0.76, 1.2);
      puff.birthTime = timestamp;
      puff.driftX = -directionX * driftDistance + perpendicularX * sideDrift;
      puff.driftY = -directionY * driftDistance + perpendicularY * sideDrift;
      puff.endSize = Math.min(startSize * growth, 220);
      puff.lifeMs = randomBetween(700, 980) + speedFactor * 120;
      puff.rotation = randomBetween(-0.7, 0.7);
      puff.rotationDrift = randomBetween(-0.34, 0.34);
      puff.spriteIndex = reusableIndex % SPRITE_COUNT;
      puff.startSize = startSize;
      puff.turbulencePhase = randomBetween(0, TWO_PI);
      puff.turbulenceSpeed = randomBetween(2, 3.6);
      puff.turbulenceX = perpendicularX * randomBetween(0.7, 1.2);
      puff.turbulenceY = perpendicularY * randomBetween(0.7, 1.2);
      puff.x =
        x - directionX * spawnDistance + perpendicularX * perpendicularSpawnOffset;
      puff.y =
        y - directionY * spawnDistance + perpendicularY * perpendicularSpawnOffset;

      puffIndex = (reusableIndex + 1) % PUFF_COUNT;
    };

    const drawAura = (timestamp: number, deltaMs: number) => {
      const auraAge = timestamp - lastMoveTimestamp;

      if (auraAge > AURA_FADE_MS || auraOpacity <= 0.004) {
        auraOpacity = 0;
        return false;
      }

      const smoothing = clamp(deltaMs / 80, 0.12, 0.34);
      const fade = Math.pow(1 - auraAge / AURA_FADE_MS, 1.7);
      const size = 50 + fade * 30;

      auraX += (auraTargetX - auraX) * smoothing;
      auraY += (auraTargetY - auraY) * smoothing;

      context.save();
      context.globalAlpha = auraOpacity * fade;
      context.translate(
        auraX - auraDirectionX * 18,
        auraY - auraDirectionY * 18,
      );
      context.rotate(0.2);
      context.drawImage(sprites[0], -size / 2, -size / 2, size, size * 0.78);
      context.restore();

      return true;
    };

    function renderFrame(timestamp: number) {
      frameId = null;

      if (!isEnabled || document.hidden) {
        return;
      }

      const deltaMs =
        lastFrameTimestamp === null
          ? 16
          : clamp(timestamp - lastFrameTimestamp, 1, MAX_DT_MS);
      lastFrameTimestamp = timestamp;

      clearCanvas();

      let hasLivingPuffs = false;

      puffs.forEach((puff) => {
        if (puff.active) {
          hasLivingPuffs =
            drawPuff(context, sprites, puff, timestamp) || hasLivingPuffs;
        }
      });

      const hasAura = drawAura(timestamp, deltaMs);

      if (hasLivingPuffs || hasAura) {
        requestFrame();
        return;
      }

      lastFrameTimestamp = null;
      clearCanvas();
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isEnabled || document.hidden || event.pointerType === "touch") {
        return;
      }

      const currentX = event.clientX;
      const currentY = event.clientY;
      const timestamp = performance.now();

      if (!trackingStarted) {
        trackingStarted = true;
        previousX = currentX;
        previousY = currentY;
        lastEmissionX = currentX;
        lastEmissionY = currentY;
        auraX = currentX;
        auraY = currentY;
        auraTargetX = currentX;
        auraTargetY = currentY;
        lastMoveTimestamp = timestamp;
        requestFrame();
        return;
      }

      const deltaX = currentX - previousX;
      const deltaY = currentY - previousY;
      const pointerDistance = Math.hypot(deltaX, deltaY);

      if (pointerDistance < 0.5) {
        return;
      }

      const elapsedMs = Math.max(timestamp - lastMoveTimestamp, 16);
      const speedFactor = clamp(pointerDistance / elapsedMs / 1.4, 0, 1);
      const directionX = deltaX / pointerDistance;
      const directionY = deltaY / pointerDistance;
      const emissionDistanceX = currentX - lastEmissionX;
      const emissionDistanceY = currentY - lastEmissionY;
      const emissionDistance = Math.hypot(
        emissionDistanceX,
        emissionDistanceY,
      );
      const emissionThreshold =
        MAX_EMISSION_DISTANCE_PX -
        speedFactor * (MAX_EMISSION_DISTANCE_PX - MIN_EMISSION_DISTANCE_PX);
      const canEmit =
        emissionDistance >= emissionThreshold &&
        timestamp - lastEmissionTimestamp >= MIN_EMISSION_INTERVAL_MS;

      auraDirectionX = directionX;
      auraDirectionY = directionY;
      auraOpacity = 0.17;
      auraTargetX = currentX;
      auraTargetY = currentY;
      lastMoveTimestamp = timestamp;
      previousX = currentX;
      previousY = currentY;

      if (canEmit) {
        const emissionCount = Math.min(
          Math.max(1, Math.floor(emissionDistance / emissionThreshold)),
          MAX_EMISSIONS_PER_MOVE,
        );

        for (let index = 1; index <= emissionCount; index += 1) {
          const progress = index / emissionCount;
          const emitX = lastEmissionX + emissionDistanceX * progress;
          const emitY = lastEmissionY + emissionDistanceY * progress;

          emitPuff(
            emitX,
            emitY,
            directionX,
            directionY,
            speedFactor,
            timestamp,
          );
        }

        lastEmissionX = currentX;
        lastEmissionY = currentY;
        lastEmissionTimestamp = timestamp;
      }

      requestFrame();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetRuntime();
      }
    };

    const bindRuntimeListeners = () => {
      if (hasRuntimeListeners) {
        return;
      }

      hasRuntimeListeners = true;
      resizeCanvas();
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", resetRuntime);
      window.addEventListener("resize", resizeCanvas, { passive: true });
      window.addEventListener("blur", resetRuntime);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    const unbindRuntimeListeners = () => {
      if (!hasRuntimeListeners) {
        return;
      }

      hasRuntimeListeners = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetRuntime);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("blur", resetRuntime);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    const updateAvailability = () => {
      isEnabled = finePointerQuery.matches && !reducedMotionQuery.matches;

      if (isEnabled) {
        bindRuntimeListeners();
      } else {
        unbindRuntimeListeners();
        resetRuntime();
      }
    };

    updateAvailability();
    finePointerQuery.addEventListener("change", updateAvailability);
    reducedMotionQuery.addEventListener("change", updateAvailability);

    return () => {
      finePointerQuery.removeEventListener("change", updateAvailability);
      reducedMotionQuery.removeEventListener("change", updateAvailability);
      unbindRuntimeListeners();
      resetRuntime();
      sprites.length = 0;
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className={styles.auraSmokeCursorCanvas}
      ref={canvasRef}
    />
  );
}
