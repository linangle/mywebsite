import { SETUP, PROJECTS_VIEWBOX, type SetupPart } from "./projectsPaths";

type Props = {
  viewBox?: string;
  preserveAspectRatio?: string;
  /** draw only these objects — omit for the whole setup */
  parts?: readonly SetupPart[];
  className?: string;
};

/** The work-setup scene: laptop, monitor, drink, wall decorations, cat and mouse. */
export function ProjectsArt({
  viewBox = PROJECTS_VIEWBOX,
  preserveAspectRatio,
  parts,
  className,
}: Props) {
  const shapes = parts ? SETUP.filter((s) => parts.includes(s.part)) : SETUP;

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
