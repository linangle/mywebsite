import type { Metadata } from "next";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = { title: "creative" };

export default function CreativePage() {
  return (
    <main className="page">
      <Nav />
      <div className="page-body">
        <h1>creative</h1>
        <p>forthcoming.</p>
      </div>
    </main>
  );
}
