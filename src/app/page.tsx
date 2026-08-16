import { CurtainArt } from "@/components/art/CurtainArt";
import { WindowArt } from "@/components/art/WindowArt";
import { CURTAIN_VIEWBOX, WINDOW_VIEWBOX } from "@/components/art/paths";
import { Nav } from "@/components/Nav";

function HeroText() {
  return (
    <div className="hero">
      <h1>Hello!</h1>
      <p>
        filler text filler text filler text filler text filler text
        filler text filler text filler text filler text filler text
        filler text filler text filler text filler text filler text
      </p>
      <p>
        filler text filler text filler text filler text filler text
        filler text filler text filler text filler text filler text
        filler text filler text filler text filler text filler text
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="home">
      {/* desktop 16:9 landscape */}
      <div className="stage">
        <CurtainArt className="art" />
        <HeroText />
        <WindowArt className="art" />
        <Nav />
      </div>

      {/* narrow screen */}
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
    </main>
  );
}
