import type { ReactNode } from "react";
import { CURTAIN_1 } from "./curtainPaths";
import { CURTAIN_ROD, SCENE_VIEWBOX } from "./paths";

type Props = {
  viewBox?: string;
  preserveAspectRatio?: string;
  /** slice the cloth into bands so it can be deformed locally (see useCurtainSway) */
  swayable?: boolean;
  className?: string;
};

/**
 * The drawing only has the two ends of the rod — the middle was never needed,
 * because the closed curtain covers it. Once the curtain compresses to the
 * left, that gap shows, so this bar joins the ends up.
 *
 * It starts at 310 rather than at the left cap on purpose: the compressed
 * curtain lands on x 129.6-314.1, so the bar stays tucked behind it and the
 * drawn gap between the cap (ends at 112) and the curtain (starts at 129.6)
 * survives in both states. Running it further left would swallow that gap.
 */
const ROD_BAR = "M310,77.9h672v35.35h-672Z";

/**
 * Horizontal slices of the hanging cloth. Each is clipped to its own strip and
 * shifted independently, which is what lets a nudge peak where the pointer
 * touched instead of only ever at the hem — a single skew can bend one way,
 * not bulge. Neighbouring bands share their edge displacement (see
 * useCurtainSway), so the outline bends rather than steps.
 *
 * The slices start at the waist of the drawn indent (the cloth pinches from
 * 825 units wide down to 792 at y 170, then falls open again): everything
 * above is the pocket gathered onto the rod, so it hangs still while the
 * cloth below swings from that hinge.
 */
export const BAND_TOP = 170;
export const BAND_BOTTOM = 1014;
export const BAND_COUNT = 8;
export const BAND_HEIGHT = (BAND_BOTTOM - BAND_TOP) / BAND_COUNT;
export const bandEdge = (i: number) => BAND_TOP + i * BAND_HEIGHT;

/**
 * One still slice for the rod pocket plus the sway bands below it. Both the
 * cloth and its wall-coloured gap outline are run through this, so the margin
 * the curtain keeps around itself travels with the cloth as it swings
 * (useCurtainSway drives every .sway-band, keyed by data-band).
 */
function sliced(art: ReactNode) {
  return (
    <>
      <g clipPath="url(#curtain-pocket)">{art}</g>
      {Array.from({ length: BAND_COUNT }, (_, i) => (
        <g key={i} clipPath={`url(#curtain-band-${i})`}>
          <g
            className="sway-band"
            data-band={i}
            style={{ transformOrigin: `0px ${bandEdge(i)}px` }}
          >
            {art}
          </g>
        </g>
      ))}
    </>
  );
}

export function CurtainArt({
  viewBox = SCENE_VIEWBOX,
  preserveAspectRatio,
  swayable = false,
  className,
}: Props) {
  const [drape, notch] = CURTAIN_1;

  const drapeArt = (
    <>
      <path className="ink" d={drape.d} />
      <path className="bg notch" d={notch.d} />
    </>
  );

  /* Wall-coloured outline of the cloth itself, holding the log clear of the
     curtain's edge. It follows the drawn shape and travels with it; when the
     curtain compresses, the stroke is fattened to cancel the squeeze (see
     .drape-gap path in globals.css) so the margin stays put. Under the rod,
     so the rod still runs through. */
  const gapArt = <path className="bg" d={drape.d} />;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {swayable && (
        <defs>
          {/* the still pocket above the indent's waist, with room above the
              cloth for the gap outline's stroke at its open-state width */}
          <clipPath id="curtain-pocket" clipPathUnits="userSpaceOnUse">
            <rect x="0" y={BAND_TOP - 300} width="1920" height="302" />
          </clipPath>
          {Array.from({ length: BAND_COUNT }, (_, i) => (
            <clipPath
              key={i}
              id={`curtain-band-${i}`}
              clipPathUnits="userSpaceOnUse"
            >
              {/* overlap the neighbours by two units: the two agree on their
                  shared edge, so this only hides the hairline the antialiased
                  clip would otherwise leave between them. The last band runs
                  long so the hem's stroked outline isn't cut off. */}
              <rect
                x="0"
                y={bandEdge(i) - 2}
                width="1920"
                height={BAND_HEIGHT + (i === BAND_COUNT - 1 ? 62 : 4)}
              />
            </clipPath>
          ))}
        </defs>
      )}

      <g className="drape-gap">{swayable ? sliced(gapArt) : gapArt}</g>

      <g className="ink">
        <path d={ROD_BAR} />
        {CURTAIN_ROD.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g className="drape">{swayable ? sliced(drapeArt) : drapeArt}</g>
    </svg>
  );
}
