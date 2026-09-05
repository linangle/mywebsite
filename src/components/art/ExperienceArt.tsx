import { DESK, EXPERIENCE_VIEWBOX, type DeskPart } from "./experiencePaths";

type Props = {
  viewBox?: string;
  preserveAspectRatio?: string;
  /** draw only these objects — omit for the whole desk */
  parts?: readonly DeskPart[];
  className?: string;
};

/** The desk scene: bag, pen, scraps, sticky note and two sheets of paper. */
export function ExperienceArt({
  viewBox = EXPERIENCE_VIEWBOX,
  preserveAspectRatio,
  parts,
  className,
}: Props) {
  const shapes = parts ? DESK.filter((s) => parts.includes(s.part)) : DESK;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {shapes.map(({ d, tone }, i) => (
        <path key={i} className={tone} d={d} />
      ))}
    </svg>
  );
}
