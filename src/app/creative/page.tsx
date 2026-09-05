import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { LANDING_ONLY } from "@/site";

export const metadata: Metadata = { title: "creative" };

export default function CreativePage() {
  // still forthcoming — off the deployed site until there is something here
  if (LANDING_ONLY) redirect("/");

  return (
    <main className="page">
      <header className="page-header">
        <Nav />
      </header>
      <div className="page-body">
        <h1>creative</h1>
        <p>forthcoming.</p>
      </div>
    </main>
  );
}
