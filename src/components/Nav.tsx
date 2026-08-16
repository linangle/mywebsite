"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/creative", label: "creative" },
  { href: "/about", label: "about me" },
] as const;

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={["site-nav", className].filter(Boolean).join(" ")} aria-label="Primary">
      <ul className="nav-links">
        {LINKS.map(({ href, label }) => {
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
      <ThemeToggle />
    </nav>
  );
}
