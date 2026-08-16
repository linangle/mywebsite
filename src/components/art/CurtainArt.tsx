import { CURTAIN, CURTAIN_ROD, SCENE_VIEWBOX } from "./paths";

type Props = {
  viewBox?: string;
  preserveAspectRatio?: string;
  className?: string;
};

export function CurtainArt({
  viewBox = SCENE_VIEWBOX,
  preserveAspectRatio,
  className,
}: Props) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g className="ink">
        {CURTAIN_ROD.map((d, i) => (
          <path key={i} d={d} />
        ))}
        <path d={CURTAIN} />
      </g>
    </svg>
  );
}
