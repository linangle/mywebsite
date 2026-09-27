/**
 * The photos on play → photos, in the order they hang on the page.
 *
 * To caption one, fill in its `caption` — it shows under the photo once it is
 * opened large. An empty caption shows nothing. `alt` is what a screen reader
 * says instead of the picture, so it stays a plain description.
 *
 * To add a photo: drop the JPEG in this folder (web-sized — the ones here are
 * 2000px on the long edge, with the camera's rotation already applied), import
 * it below and add an entry. Its size is read from the file, so portrait and
 * landscape sort themselves out. To reorder, move the entries.
 */
import type { StaticImageData } from "next/image";

import ale_0911 from "./ale_0911.jpg";
import ale_0415 from "./ale_0415.jpg";
import ale_1159 from "./ale_1159.jpg";
import ale_0371 from "./ale_0371.jpg";
import dsc00248 from "./dsc00248.jpg";
import dsc00788 from "./dsc00788.jpg";
import dsc00271 from "./dsc00271.jpg";
import dsc04662 from "./dsc04662.jpg";
import dsc04640 from "./dsc04640.jpg";
import dsc05090 from "./dsc05090.jpg";
import dsc04672 from "./dsc04672.jpg";
import dsc04953 from "./dsc04953.jpg";
import dsc02935 from "./dsc02935.jpg";
import dsc04967 from "./dsc04967.jpg";
import dsc05037 from "./dsc05037.jpg";
import dsc_0521 from "./dsc_0521.jpg";
import dsc03963 from "./dsc03963.jpg";
import dsc02752 from "./dsc02752.jpg";

export type Photo = {
  image: StaticImageData;
  /** a plain description, for screen readers and for when the file fails to load */
  alt: string;
  /** shown under the photo when it is opened large; leave "" for none */
  caption: string;
};

export const PHOTOS: readonly Photo[] = [
  {
    image: ale_0911,
    alt: "A white lighthouse and red-roofed keeper's house on a rocky point under a clear sky.",
    caption: "",
  },
  {
    image: ale_0415,
    alt: "Silhouettes of a group standing on a sand dune under a sky full of small clouds.",
    caption: "",
  },
  {
    image: ale_1159,
    alt: "A grey shingled boathouse on stilts over a rocky shore covered in seaweed.",
    caption: "",
  },
  {
    image: ale_0371,
    alt: "A pink door in a shop front hung with buoys, driftwood and sea ornaments.",
    caption: "",
  },
  {
    image: dsc00248,
    alt: "A flower seller in a conical hat beside a bicycle loaded with bright bouquets.",
    caption: "",
  },
  {
    image: dsc00788,
    alt: "A tunnel strung with coloured paper lanterns, daylight at the far end.",
    caption: "",
  },
  {
    image: dsc00271,
    alt: "A small boat crossing calm water, with islands along the horizon.",
    caption: "",
  },
  {
    image: dsc04662,
    alt: "A river at night with lantern-lit boats and a bright waterfront behind.",
    caption: "",
  },
  {
    image: dsc04640,
    alt: "A temple gate hung with red lanterns under trees, motorbikes parked in front.",
    caption: "",
  },
  {
    image: dsc05090,
    alt: "Bundles of incense sticks fanned out in reds, pinks, greens and yellows.",
    caption: "",
  },
  {
    image: dsc04672,
    alt: "A lily pond with a wooden walkway and a cloud-topped mountain behind.",
    caption: "",
  },
  {
    image: dsc04953,
    alt: "A pond seen from inside a pavilion, past a carved and lettered pillar.",
    caption: "",
  },
  {
    image: dsc02935,
    alt: "Plants inside a glasshouse, reflected in a still pool.",
    caption: "",
  },
  {
    image: dsc04967,
    alt: "A small shrine with a white statue, shaded by trees.",
    caption: "",
  },
  {
    image: dsc05037,
    alt: "An old weathered wall and gate overgrown with pink bougainvillea.",
    caption: "",
  },
  {
    image: dsc_0521,
    alt: "A city skyline at dusk under a red and blue sky.",
    caption: "",
  },
  {
    image: dsc03963,
    alt: "A shaded garden terrace with broad-leafed plants and stone balustrades.",
    caption: "",
  },
  {
    image: dsc02752,
    alt: "Bright lights and soft circles of light against a dark building at night.",
    caption: "",
  },
];
