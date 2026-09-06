"use client";

import { useEffect, useRef, useState } from "react";
import {
  BAND_BOTTOM,
  BAND_HEIGHT,
  BAND_TOP,
  CurtainArt,
  bandEdge,
} from "./art/CurtainArt";
import { SparklesArt } from "./art/SparklesArt";
import { WindowArt } from "./art/WindowArt";
import { CURTAIN_VIEWBOX, WINDOW_VIEWBOX } from "./art/paths";
import { Nav } from "./Nav";

function HeroText() {
  return (
    <div className="hero">
      <h1>hello, i'm angelina!</h1>
      <p>
        i'm an MIT student studying computer science.
      </p>
      <p>
        this website is a work in progress -- forthcoming content
      </p>
    </div>
  );
}

/**
 * Damped spring, tuned as a hanging curtain rather than a spring doorstop:
 * ~0.8Hz with a long, light decay, so it drifts back over a couple of slow
 * swings. Stiffer or bouncier and it reads as a jiggle instead of cloth.
 */
const SPRING_K = 25; // ω₀ ≈ 5 rad/s
const SPRING_DAMP = 1.6; // ζ ≈ 0.16
/** furthest the cloth is pushed, in drawing units (~1.5% of the scene width) */
const MAX_PUSH = 30;
/** how far up and down the curtain a nudge is felt, in drawing units */
const PUSH_SPREAD = 260;
/** how far below the rod pocket the swing takes to build to full strength */
const ANCHOR_RUN = 170;
/** the hero text is printed on the cloth, so it drifts with it — damped a
    little, since a rigid block can't follow every local ripple */
const TEXT_FOLLOW = 0.7;

/**
 * How much of a nudge is felt at height y, given it landed at hitY. A bell
 * curve around the touch, zeroed above BAND_TOP: the cloth up there hangs on
 * the rod and cannot move.
 */
function pushProfile(y: number, hitY: number) {
  const falloff = Math.exp(-(((y - hitY) / PUSH_SPREAD) ** 2));
  const pinned = Math.min(1, Math.max(0, (y - BAND_TOP) / ANCHOR_RUN));
  return falloff * pinned;
}

/**
 * Lets the curtain be pushed around by the pointer, so it reads as cloth you
 * can touch rather than a picture. The nudge is strongest where the pointer
 * crossed it and eases off above and below, which is why the drape is sliced
 * into bands — one transform could only tilt the whole sheet, never bulge it
 * in the middle. Each band is shifted to match its neighbours at their shared
 * edge, so the outline bends rather than steps. The bands come in two sets —
 * the cloth and its wall-coloured gap outline — so the margin the curtain
 * keeps around itself swings along; data-band says which strip each one is.
 *
 * A damped spring carries the whole shape back, so it overshoots and settles
 * instead of snapping straight.
 */
function useCurtainSway(stageRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const bands = [...stage.querySelectorAll<SVGGElement>(".sway-band")];
    if (!bands.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = stage.querySelector<HTMLElement>(".hero");

    let push = 0; // current displacement at the centre of the bulge
    let velocity = 0;
    let hitY = (BAND_TOP + BAND_BOTTOM) / 2;
    let raf = 0;
    let lastPointerX: number | null = null;
    let lastFrame = 0;
    /** CSS px per drawing unit, and the text's height on the cloth — both
        refreshed from layout whenever the pointer moves */
    let unitScale = 0;
    let heroY = hitY;

    const clear = () => {
      for (const b of bands) b.style.transform = "";
      if (hero) hero.style.transform = "";
    };

    const paint = () => {
      for (const band of bands) {
        const top = bandEdge(Number(band.dataset.band));
        const dTop = push * pushProfile(top, hitY);
        const dBottom = push * pushProfile(top + BAND_HEIGHT, hitY);
        // skew carries the band from its own displacement to its neighbour's,
        // so the two always agree at the edge they share
        const lean = (Math.atan2(dBottom - dTop, BAND_HEIGHT) * 180) / Math.PI;
        band.style.transform = `translateX(${dTop.toFixed(2)}px) skewX(${lean.toFixed(3)}deg)`;
      }
      if (hero) {
        // ride the cloth at the text's own height (a plain div, so CSS px)
        const d = push * pushProfile(heroY, hitY) * unitScale * TEXT_FOLLOW;
        hero.style.transform = `translateX(${d.toFixed(2)}px)`;
      }
    };

    const step = (now: number) => {
      const dt = Math.min(0.032, (now - lastFrame) / 1000 || 0.016);
      lastFrame = now;

      velocity += (-SPRING_K * push - SPRING_DAMP * velocity) * dt;
      push += velocity * dt;
      if (Math.abs(push) > MAX_PUSH) {
        push = Math.sign(push) * MAX_PUSH;
        velocity *= 0.4;
      }

      // sub-pixel from here, so stop rather than burn frames on the tail
      if (Math.abs(push) < 0.2 && Math.abs(velocity) < 1) {
        push = 0;
        clear();
        raf = 0;
        return;
      }
      paint();
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      // Only the hanging curtain sways. "closed" also covers the cloth still
      // sliding back shut — brushing it on the way in is deliberate.
      if (stage.dataset.curtain !== "closed") {
        lastPointerX = null;
        return;
      }
      const r = stage.getBoundingClientRect();
      if (!r.width) return;
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      // the whole hanging curtain, not just its hem
      if (x < 0.06 || x > 0.51 || y < 0.03 || y > 0.93) {
        lastPointerX = null;
        return;
      }

      if (lastPointerX !== null) {
        unitScale = r.width / 1920;
        if (hero) {
          const hr = hero.getBoundingClientRect();
          heroY = ((hr.top + hr.height / 2 - r.top) / r.height) * 1080;
        }
        const travel = ((e.clientX - lastPointerX) / r.width) * 1920;
        hitY = y * 1080;
        velocity += Math.max(-25, Math.min(25, travel * 0.9));
        if (!raf) {
          lastFrame = performance.now();
          raf = requestAnimationFrame(step);
        }
      }
      lastPointerX = e.clientX;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      clear();
    };
  }, [stageRef]);
}

export function LandingScene() {
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  useCurtainSway(stageRef);

  const label = open ? "Close the curtain" : "Open the curtain";

  return (
    <div className="stage-wrap">
      {/* desktop 16:9 landscape */}
      <div
        className="stage"
        data-curtain={open ? "open" : "closed"}
        ref={stageRef}
      >
        {/* Everything the curtain hides is drawn first, at full strength. The
            curtain slides over the top of it, so opening uncovers it gradually
            rather than fading it in. */}
        <SparklesArt className="art sparkles" />
        <WindowArt className="art" />
        <CurtainArt className="art curtain-art" swayable />
        <button
          type="button"
          className="curtain-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-pressed={open}
          aria-label={label}
          title={label}
        />
        <HeroText />
        <Nav />
      </div>

      {/* narrow screen — the curtain holds the text here, so it stays put */}
      <div className="stack">
        <Nav />
        <div className="stack-curtain">
          <CurtainArt
            className="art"
            viewBox={CURTAIN_VIEWBOX}
            preserveAspectRatio="none"
          />
          <HeroText />
        </div>
        <WindowArt className="art window-art" viewBox={WINDOW_VIEWBOX} />
      </div>
    </div>
  );
}
