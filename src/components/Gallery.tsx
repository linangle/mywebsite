"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

/** how far a finger has to travel across the open picture to count as a swipe */
const SWIPE_MIN = 48;

/** one thing hung in a gallery — a photo, or a piece of art */
export type Picture = {
  image: StaticImageData;
  alt: string;
  /** shown under it in the lightbox; "" for none */
  caption: string;
};

/**
 * Pictures that hang as one: the first is the thumbnail, and the rest are a
 * step away once it is open, on arrows of their own under the picture.
 */
export type Stack = {
  /** names the stack on its thumbnail and between its arrows */
  title: string;
  pictures: readonly Picture[];
};

const isStack = (item: Picture | Stack): item is Stack => "pictures" in item;

/** which thumbnail is open, and how far into it if it is a stack */
type Open = { at: number; sub: number };

/**
 * Pictures hung in rows that each run the full width: every picture in a row
 * is scaled to the same height, so the portraits stand narrow between the
 * landscapes rather than being cropped to match them. The rows are laid out
 * by CSS from each picture's own proportions (`--ar`), so the page needs no
 * measuring. Clicking one opens it large in the lightbox below.
 *
 * `noun` is what the lightbox calls one of them to a screen reader.
 */
export function Gallery({
  pictures,
  noun = "photo",
}: {
  pictures: readonly (Picture | Stack)[];
  noun?: string;
}) {
  const [open, setOpen] = useState<Open | null>(null);
  // the outer arrows move between thumbnails, and a stack always opens on
  // its first picture
  const step = (by: number) =>
    setOpen((o) => o && { at: (o.at + by + pictures.length) % pictures.length, sub: 0 });
  // the arrows under a stack move within it
  const subStep = (by: number) =>
    setOpen((o) => {
      if (!o) return o;
      const item = pictures[o.at];
      if (!isStack(item)) return o;
      const n = item.pictures.length;
      return { at: o.at, sub: (o.sub + by + n) % n };
    });

  return (
    <>
      <ul className="gallery">
        {pictures.map((item, i) => {
          const stack = isStack(item) ? item : null;
          const { image, alt } = isStack(item) ? item.pictures[0] : item;
          return (
            <li
              key={image.src}
              className={stack ? "gallery-item gallery-stack" : "gallery-item"}
              style={{ "--ar": (image.width / image.height).toFixed(4) } as React.CSSProperties}
            >
              <button
                type="button"
                className="gallery-thumb"
                onClick={() => setOpen({ at: i, sub: 0 })}
                aria-label={
                  stack
                    ? `open larger: ${alt} — first of ${stack.pictures.length} in ${stack.title}`
                    : `open larger: ${alt}`
                }
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  placeholder="blur"
                  className="gallery-img"
                />
                {stack && (
                  <span className="gallery-stack-count" aria-hidden="true">
                    {stack.pictures.length} {stack.title}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <Lightbox
        pictures={pictures}
        noun={noun}
        open={open}
        onClose={() => setOpen(null)}
        onStep={step}
        onSubStep={subStep}
      />
    </>
  );
}

/**
 * One picture, large, over a darkened page. A native dialog, so the browser
 * holds focus inside it, closes it on escape and hands focus back to the
 * thumbnail it came from. Clicking the dark around the picture or the cross
 * closes it; the arrows, the arrow keys and a swipe move along the row. In a
 * stack, the arrows under the picture (or up and down on the keys) move
 * through the stack.
 */
function Lightbox({
  pictures,
  noun,
  open,
  onClose,
  onStep,
  onSubStep,
}: {
  pictures: readonly (Picture | Stack)[];
  noun: string;
  open: Open | null;
  onClose: () => void;
  onStep: (by: number) => void;
  onSubStep: (by: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const isOpen = open !== null;

  let picture: Picture | null = null;
  let stack: Stack | null = null;
  if (open) {
    const item = pictures[open.at];
    if (isStack(item)) {
      stack = item;
      picture = item.pictures[open.sub];
    } else {
      picture = item;
    }
  }

  // the dialog is only modal when opened by showModal(), so it is driven from
  // here rather than through the `open` attribute
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
      // outside a stack these change nothing
      else if (e.key === "ArrowDown") onSubStep(1);
      else if (e.key === "ArrowUp") onSubStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onStep, onSubStep]);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={`${noun}, larger`}
      onClose={onClose}
      // only the dark itself — a click on the picture or a button lands on them
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches.length === 1 ? e.touches[0].clientX : null;
      }}
      onTouchEnd={(e) => {
        const from = touchX.current;
        touchX.current = null;
        if (from === null) return;
        const dx = e.changedTouches[0].clientX - from;
        if (Math.abs(dx) >= SWIPE_MIN) onStep(dx < 0 ? 1 : -1);
      }}
    >
      {/* first, so it is the button that takes focus when the dialog opens */}
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="close"
      >
        ×
      </button>
      {picture && (
        <figure className={stack ? "lightbox-figure lightbox-figure-stack" : "lightbox-figure"}>
          {/* keyed on the file so a step swaps the picture out cleanly instead
              of stretching the old one into the new one's shape while it
              loads — the image alone, so the arrows under it keep focus */}
          <Image
            key={picture.image.src}
            src={picture.image}
            alt={picture.alt}
            sizes="100vw"
            loading="eager"
            placeholder="blur"
            className="lightbox-img"
          />
          {stack && open && (
            <div className="lightbox-sub" role="group" aria-label={stack.title}>
              <button
                type="button"
                className="lightbox-sub-step"
                onClick={() => onSubStep(-1)}
                aria-label={`previous in ${stack.title}`}
              >
                ‹
              </button>
              <span>
                {stack.title}
                <span className="lightbox-sub-count">
                  {open.sub + 1} / {stack.pictures.length}
                </span>
              </span>
              <button
                type="button"
                className="lightbox-sub-step"
                onClick={() => onSubStep(1)}
                aria-label={`next in ${stack.title}`}
              >
                ›
              </button>
            </div>
          )}
          {picture.caption && (
            <figcaption className="lightbox-caption">{picture.caption}</figcaption>
          )}
        </figure>
      )}
      {pictures.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox-step lightbox-prev"
            onClick={() => onStep(-1)}
            aria-label={`previous ${noun}`}
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox-step lightbox-next"
            onClick={() => onStep(1)}
            aria-label={`next ${noun}`}
          >
            ›
          </button>
        </>
      )}
    </dialog>
  );
}
