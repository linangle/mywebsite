/**
 * The art on play → art, set by set, in the order they hang on the page. Each
 * set gets its own heading and its own gallery.
 *
 * To caption a piece, fill in its `caption` — it shows under the piece once it
 * is opened large. An empty caption shows nothing. `alt` is what a screen
 * reader says instead of the picture, so it stays a plain description.
 *
 * To add a piece: drop the JPEG in its set's folder (web-sized — the ones here
 * are 2000px on the long edge, made from the originals in website_art), import
 * it below and add an entry. Its size is read from the file, so tall and wide
 * pieces sort themselves out. To reorder, move the entries; to start a new set,
 * add a folder and another entry to ART.
 */
import type { StaticImageData } from "next/image";

import bunny_hearts from "./hack26/bunny_hearts.jpg";
import cheshire from "./hack26/cheshire.jpg";
import framed_hack from "./hack26/framed_hack.jpg";
import hack_bookmark from "./hack26/hack_bookmark.jpg";
import hacking_mice from "./hack26/hacking_mice.jpg";
import keys from "./hack26/keys.jpg";
import king_mouse from "./hack26/king_mouse.jpg";

export type Piece = {
  image: StaticImageData;
  /** a plain description, for screen readers and for when the file fails to load */
  alt: string;
  /** shown under the piece when it is opened large; leave "" for none */
  caption: string;
};

export type ArtSet = {
  /** the heading over the set */
  title: string;
  pieces: readonly Piece[];
};

export const ART: readonly ArtSet[] = [
  {
    title: "hack26",
    pieces: [
      {
        image: bunny_hearts,
        alt: "Two white rabbits leaping toward each other inside a red heart, music notes swirling around them.",
        caption: "",
      },
      {
        image: cheshire,
        alt: "A smiling lavender-striped Cheshire cat on a starry navy stamp, its tail curling up out of the frame.",
        caption: "",
      },
      {
        image: framed_hack,
        alt: "The word HACK in rounded letters filled with swirling pastel colours, in an orange frame.",
        caption: "",
      },
      {
        image: hack_bookmark,
        alt: "A pink pennant with HACK lettered down it in gold, edged with gold scrollwork.",
        caption: "",
      },
      {
        image: hacking_mice,
        alt: "Two mice typing on laptops labelled HACK and MIT, a tangled scribble above their heads.",
        caption: "",
      },
      {
        image: keys,
        alt: "A ring of keys tied with a pink bow: a heart-shaped padlock, an ornate gold key and a small green charm.",
        caption: "",
      },
      {
        image: king_mouse,
        alt: "A startled yellow mouse with a pink heart on its cheek, in an ornate gold frame.",
        caption: "",
      },
    ],
  },
];
