"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANDING_ONLY } from "@/site";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/creative", label: "creative" },
  { href: "/about", label: "about me" },
] as const;

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();
  // Nothing to navigate to while the site is just the landing page, so the
  // toggle stands alone rather than next to a link back to here.
  const links: readonly { href: string; label: string }[] = LANDING_ONLY
    ? []
    : LINKS;

  return (
    <nav className={["site-nav", className].filter(Boolean).join(" ")} aria-label="Primary">
      {links.length > 0 && (
        <>
          <ul className="nav-links">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link href={href} aria-current={active ? "page" : undefined}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <span className="nav-rule" aria-hidden="true" />
        </>
      )}
      <ThemeToggle />
    </nav>
  );
}
