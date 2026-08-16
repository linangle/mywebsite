import type { Metadata } from "next";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = { title: "about me" };

export default function AboutPage() {
  return (
    <main className="page">
      <Nav />
      <div className="page-body">
        <h1>about me</h1>
        <p>forthcoming.</p>
      </div>
    </main>
  );
}
