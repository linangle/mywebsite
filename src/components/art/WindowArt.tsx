"use client";

import { useEffect, useRef } from "react";
import {
  CAT_OUTLINE,
  EYES,
  EYE_WHITE_WIDTH,
  FLOWERS,
  PLANT,
  SCENE_VIEWBOX,
  STARS,
  WINDOW_SILL,
} from "./paths";

type Props = {
  viewBox?: string;
  className?: string;
};

/** how far (in SVG units) a pupil may travel from the eye centre */
const MAX_DX = 24;
const MAX_DY = 20;
/** cursor distance (SVG units) at which the pupil reaches full deflection */
const REACH = 160;
/** lerp factor per frame for the smoothing */
const EASE = 0.18;

type EyeState = {
  white: SVGPathElement;
  pupil: SVGGElement;
  /** eye-white centre */
  cx: number;
  cy: number;
  /** resting pupil offset from the eye centre */
  restX: number;
  restY: number;
  /** current / target pupil offset from the eye centre */
  x: number;
  y: number;
  tx: number;
  ty: number;
};

export function WindowArt({ viewBox = SCENE_VIEWBOX, className }: Props) {
  const leftWhite = useRef<SVGPathElement>(null);
  const rightWhite = useRef<SVGPathElement>(null);
  const leftPupil = useRef<SVGGElement>(null);
  const rightPupil = useRef<SVGGElement>(null);

  useEffect(() => {
    if (
      !leftWhite.current ||
      !rightWhite.current ||
      !leftPupil.current ||
      !rightPupil.current
    ) {
      return;
    }

    const makeEye = (
      white: SVGPathElement,
      pupil: SVGGElement,
      { cx, cy, px, py }: { cx: number; cy: number; px: number; py: number },
    ): EyeState => ({
      white,
      pupil,
      cx,
      cy,
      restX: px - cx,
      restY: py - cy,
      x: px - cx,
      y: py - cy,
      tx: px - cx,
      ty: py - cy,
    });
    const eyes: EyeState[] = [
      makeEye(leftWhite.current, leftPupil.current, EYES.left),
      makeEye(rightWhite.current, rightPupil.current, EYES.right),
    ];

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pointer: { x: number; y: number } | null = null;
    let raf = 0;

    const lookAt = () => {
      for (const eye of eyes) {
        if (!pointer) {
          eye.tx = eye.restX;
          eye.ty = eye.restY;
          continue;
        }
        const rect = eye.white.getBoundingClientRect();
        if (!rect.width) continue;
        const unitsPerPx = EYE_WHITE_WIDTH / rect.width;
        const dx = (pointer.x - (rect.left + rect.width / 2)) * unitsPerPx;
        const dy = (pointer.y - (rect.top + rect.height / 2)) * unitsPerPx;
        const dist = Math.hypot(dx, dy) || 1;
        const amount = Math.min(1, dist / REACH);
        eye.tx = (dx / dist) * MAX_DX * amount;
        eye.ty = (dy / dist) * MAX_DY * amount;
      }
    };

    const tick = () => {
      let settled = true;
      for (const eye of eyes) {
        if (reduceMotion) {
          eye.x = eye.tx;
          eye.y = eye.ty;
        } else {
          eye.x += (eye.tx - eye.x) * EASE;
          eye.y += (eye.ty - eye.y) * EASE;
        }
        if (Math.abs(eye.tx - eye.x) > 0.05 || Math.abs(eye.ty - eye.y) > 0.05) {
          settled = false;
        }

        eye.pupil.setAttribute(
          "transform",
          `translate(${(eye.x - eye.restX).toFixed(2)} ${(eye.y - eye.restY).toFixed(2)})`,
        );
      }
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const schedule = () => {
      lookAt();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path className="ink" d={CAT_OUTLINE} />
      <g className="ink">
        {WINDOW_SILL.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g className="leaf">
        {PLANT.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* night sky (dark mode) */}
      <g className="stars">
        {STARS.map(({ d, tone }, i) => (
          <path key={i} className={tone} d={d} />
        ))}
      </g>

      {/* daytime (light mode) */}
      <g className="flowers">
        {FLOWERS.map(({ d, tone }, i) => (
          <path key={i} className={tone} d={d} />
        ))}
      </g>

      {/* awake (dark mode) */}
      <g className="eyes-open">
        <path ref={leftWhite} className="ink" d={EYES.left.white} />
        <path ref={rightWhite} className="ink" d={EYES.right.white} />
        <g ref={leftPupil}>
          <path className="pupil" d={EYES.left.pupil} />
        </g>
        <g ref={rightPupil}>
          <path className="pupil" d={EYES.right.pupil} />
        </g>
      </g>

      {/* asleep (light mode) */}
      <g className="eyes-closed ink">
        <path d={EYES.left.closed} />
        <path d={EYES.right.closed} />
      </g>
    </svg>
  );
}
