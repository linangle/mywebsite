import { Gallery } from "@/components/Gallery";
import { ART } from "@/art";

export default function ArtPage() {
  return (
    <div className="page-body">
      {/* the tab above names the section, so the heading is for readers only */}
      <h1 className="sr-only">art</h1>
      {ART.map(({ title, pieces }, i) => (
        <section key={title} className="subsection" aria-labelledby={`art-set-${i}`}>
          <h2 id={`art-set-${i}`} className="subsection-title">
            {title}
          </h2>
          <Gallery pictures={pieces} noun="piece" />
        </section>
      ))}
    </div>
  );
}
