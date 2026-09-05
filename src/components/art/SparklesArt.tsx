import { DAY_SPARKLES, NIGHT_SPARKLES } from "./curtainPaths";
import { SCENE_VIEWBOX } from "./paths";

/**
 * What the window shows once the curtain is out of the way. Drawn under the
 * curtain, and picked by theme the same way the stars and flowers are.
 */
export function SparklesArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox={SCENE_VIEWBOX}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g className="sparkles-night">
        {NIGHT_SPARKLES.map(({ d, tone }, i) => (
          <path key={i} className={tone} d={d} />
        ))}
      </g>
      <g className="sparkles-day">
        {DAY_SPARKLES.map(({ d, tone }, i) => (
          <path key={i} className={tone} d={d} />
        ))}
      </g>
    </svg>
  );
}
