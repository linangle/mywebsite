/**
 * The deployed site is the landing scene on its own while the rest is still
 * being drawn: the sections below it and the other routes stay in the repo but
 * out of the production build. `npm run dev` still shows the whole site.
 *
 * Set NEXT_PUBLIC_LANDING_ONLY to "false" to build the whole site, or "true"
 * to see the trimmed version in dev.
 */
const override = process.env.NEXT_PUBLIC_LANDING_ONLY;

export const LANDING_ONLY =
  override === "true" ||
  (override !== "false" && process.env.NODE_ENV === "production");
