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
  pictures: readonly Picture[];
  noun?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const step = (by: number) =>
    setOpen((i) => (i === null ? i : (i + by + pictures.length) % pictures.length));

  return (
    <>
      <ul className="gallery">
        {pictures.map(({ image, alt }, i) => (
          <li
            key={image.src}
            className="gallery-item"
            style={{ "--ar": (image.width / image.height).toFixed(4) } as React.CSSProperties}
          >
            <button
              type="button"
              className="gallery-thumb"
              onClick={() => setOpen(i)}
              aria-label={`open larger: ${alt}`}
            >
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                placeholder="blur"
                className="gallery-img"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        pictures={pictures}
        noun={noun}
        index={open}
        onClose={() => setOpen(null)}
        onStep={step}
      />
    </>
  );
}

/**
 * One picture, large, over a darkened page. A native dialog, so the browser
 * holds focus inside it, closes it on escape and hands focus back to the
 * thumbnail it came from. Clicking the dark around the picture or the cross
 * closes it; the arrows, the arrow keys and a swipe move along the row.
 */
function Lightbox({
  pictures,
  noun,
  index,
  onClose,
  onStep,
}: {
  pictures: readonly Picture[];
  noun: string;
  index: number | null;
  onClose: () => void;
  onStep: (by: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const picture = index === null ? null : pictures[index];

  // the dialog is only modal when opened by showModal(), so it is driven from
  // here rather than through the `open` attribute
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    else if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onStep]);

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
      {picture && (
        // keyed on the file so a step swaps the picture out cleanly instead of
        // stretching the old one into the new one's shape while it loads
        <figure className="lightbox-figure" key={picture.image.src}>
          <Image
            src={picture.image}
            alt={picture.alt}
            sizes="100vw"
            loading="eager"
            placeholder="blur"
            className="lightbox-img"
          />
          {picture.caption && (
            <figcaption className="lightbox-caption">{picture.caption}</figcaption>
          )}
        </figure>
      )}
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="close"
      >
        ×
      </button>
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
