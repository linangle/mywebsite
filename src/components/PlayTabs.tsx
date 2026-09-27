"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** the sections of play, in the order they read */
const TABS = [
  { href: "/play/art", label: "art" },
  { href: "/play/photos", label: "photos" },
] as const;

/**
 * The switch between the sections of play. It sits in the header's left-hand
 * corner, across from the site links, and the open section is underlined the
 * way the current page is in those links.
 */
export function PlayTabs() {
  const pathname = usePathname();
  return (
    <nav className="page-tabs" aria-label="play sections">
      <ul>
        {TABS.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
