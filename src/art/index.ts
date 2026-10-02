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
 *
 * Pieces that belong together, like the trees in blueprint26, can hang as a
 * stack: one thumbnail (the first piece in it) that opens with arrows of its
 * own to step through the rest. Each piece in a stack still has its own alt
 * and caption.
 */
import type { StaticImageData } from "next/image";

import bunny_hearts from "./hack26/bunny_hearts.jpg";
import cheshire from "./hack26/cheshire.jpg";
import framed_hack from "./hack26/framed_hack.jpg";
import hack_bookmark from "./hack26/hack_bookmark.jpg";
import hacking_mice from "./hack26/hacking_mice.jpg";
import keys from "./hack26/keys.jpg";
import king_mouse from "./hack26/king_mouse.jpg";

import butterflies from "./blueprint26/butterflies.jpg";
import frog from "./blueprint26/frog.jpg";
import logo from "./blueprint26/logo.jpg";
import dogwood from "./blueprint26/trees/dogwood.jpg";
import catalpas from "./blueprint26/trees/catalpas.jpg";
import clethra from "./blueprint26/trees/clethra.jpg";
import jade_gingko from "./blueprint26/trees/jade_gingko.jpg";
import waterfallmaple from "./blueprint26/trees/waterfallmaple.jpg";
import waterfallmaple2 from "./blueprint26/trees/waterfallmaple2.jpg";
import willow from "./blueprint26/trees/willow.jpg";
import willow2 from "./blueprint26/trees/willow2.jpg";
import willow3 from "./blueprint26/trees/willow3.jpg";

export type Piece = {
  image: StaticImageData;
  /** a plain description, for screen readers and for when the file fails to load */
  alt: string;
  /** shown under the piece when it is opened large; leave "" for none */
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
  {
    title: "blueprint26",
    pieces: [
      {
        image: butterflies,
        alt: "Two butterflies, one yellow and one pale pink, in a patch of blue sky with small clouds.",
        caption: "",
      },
      {
        image: frog,
        alt: "A green frog on a lily pad in a pond, its long pink tongue stretched out toward a small winged insect.",
        caption: "",
      },
      {
        image: logo,
        alt: "The letters BP shaped from green hedge, dotted with pink and yellow flowers.",
        caption: "",
      },
      {
        title: "trees",
        pictures: [
          {
            image: dogwood,
            alt: "A dogwood in full pink bloom, its wide flat crown over a short brown trunk.",
            caption: "",
          },
          {
            image: catalpas,
            alt: "A catalpa with a tall rounded crown of green and pale yellow leaves.",
            caption: "",
          },
          {
            image: clethra,
            alt: "A clethra shrub thick with spikes of white flowers among green leaves.",
            caption: "",
          },
          {
            image: jade_gingko,
            alt: "A ginkgo with a dense, rounded green crown on a slender trunk.",
            caption: "",
          },
          {
            image: waterfallmaple,
            alt: "A waterfall maple, a low wide mound of fine green leaves.",
            caption: "",
          },
          {
            image: waterfallmaple2,
            alt: "A waterfall maple in autumn, its weeping leaves turned orange and pink.",
            caption: "",
          },
          {
            image: willow,
            alt: "A weeping willow with pale yellow branches trailing to the ground.",
            caption: "",
          },
          {
            image: willow2,
            alt: "A weeping willow drawn in blues, its long branches pouring down.",
            caption: "",
          },
          {
            image: willow3,
            alt: "A green weeping willow, its long branches hanging nearly to the ground.",
            caption: "",
          },
        ],
      },
    ],
  },
];
