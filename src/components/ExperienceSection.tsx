import { ExperienceArt } from "./art/ExperienceArt";
import { PAPER_VIEWBOX } from "./art/experiencePaths";

function Pending() {
  return <p className="desk-pending">forthcoming.</p>;
}

/**
 * Scrolls on from the landing scene — same background, so the two read as one
 * continuous page. Wide screens get the whole desk with the text sitting on the
 * centre sheet; narrow screens keep just the sheet, stretched to fit the text.
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="desk" aria-label="experience">
      <div className="desk-scene">
        <ExperienceArt className="art" />
        <h2 className="desk-heading">experience</h2>
        <Pending />
      </div>

      <div className="desk-narrow">
        <h2 className="desk-heading">experience</h2>
        <div className="desk-paper">
          {/* front sheet only — the stack edges and clip distort once stretched */}
          <ExperienceArt
            className="art"
            viewBox={PAPER_VIEWBOX}
            preserveAspectRatio="none"
            parts={["paper"]}
          />
          <Pending />
        </div>
      </div>
    </section>
  );
}
