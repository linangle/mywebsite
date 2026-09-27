import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PlayTabs } from "@/components/PlayTabs";
import { LANDING_ONLY } from "@/site";

export const metadata: Metadata = { title: "play" };

/**
 * The frame every section of play shares: the site links where they sit on
 * the landing scene, and the switch between the sections across from them.
 */
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  // still forthcoming — off the deployed site until there is something here
  if (LANDING_ONLY) redirect("/");

  return (
    <main className="page">
      <header className="page-header page-header-tabs">
        <PlayTabs />
        <Nav />
      </header>
      {children}
    </main>
  );
}
