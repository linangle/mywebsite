import { redirect } from "next/navigation";
import { LANDING_ONLY } from "@/site";

/** play opens on its first section */
export default function PlayPage() {
  if (LANDING_ONLY) redirect("/");
  redirect("/play/art");
}
