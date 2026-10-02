/**
 * The art on play → art, set by set, in the order they hang on the page.
 *
 * Nothing here needs editing to add a piece. Drop the original in its set's
 * folder in website_art (a new folder there is a new set, and a folder inside
 * a set is a stack — one thumbnail that opens with arrows of its own, like the
 * trees in blueprint26) and run `npm run art`. That makes the web copy in this
 * folder and lists the piece at the end of its set in art.json.
 *
 * art.json is the one file to edit by hand:
 * - `alt` is what a screen reader says instead of the picture, so it stays a
 *   plain description. Until one is written, the file name stands in.
 * - `caption` shows under the piece once it is opened large; "" shows nothing.
 * - Moving an entry moves the piece; the first in a stack is its thumbnail.
 *   Sets and stacks take their headings from their folders.
 *
 * images.ts is written by the same command and is not for editing.
 */
import type { StaticImageData } from "next/image";
import list from "./art.json";
import { IMAGES } from "./images";

export type Piece = {
  image: StaticImageData;
  /** a plain description, for screen readers and for when the file fails to load */
  alt: string;
  /** shown under the piece when it is opened large; "" for none */
  caption: string;
};

/** pieces under one thumbnail — the first is the one it shows */
export type Stack = {
  /** names the stack on its thumbnail and between its arrows */
  title: string;
  pictures: readonly Piece[];
};

export type ArtSet = {
  /** the heading over the set */
  title: string;
  pieces: readonly (Piece | Stack)[];
};

/** how art.json writes them */
type ListedPiece = { file: string; alt: string; caption: string };
type ListedGroup = { title: string; pieces: readonly (ListedPiece | ListedGroup)[] };

function piece({ file, alt, caption }: ListedPiece): Piece {
  const image = IMAGES[file];
  if (!image) throw new Error(`art.json lists ${file}, but there is no such image — run npm run art`);
  // "personal/gojo_howl.jpg" → "gojo howl"
  const name = file.replace(/^.*\//, "").replace(/\.jpg$/, "").replace(/_/g, " ");
  return { image, alt: alt || name, caption };
}

export const ART: readonly ArtSet[] = (list as readonly ListedGroup[]).map(({ title, pieces }) => ({
  title,
  pieces: pieces.map((it) =>
    "pieces" in it
      ? { title: it.title, pictures: it.pieces.map((p) => piece(p as ListedPiece)) }
      : piece(it),
  ),
}));
