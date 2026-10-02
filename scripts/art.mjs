/**
 * `npm run art` — brings play → art up to date with the originals in
 * website_art, so a new piece only has to be dropped in its folder.
 *
 * website_art holds one folder per set (hack26, personal, …), and a folder
 * inside a set is a stack (blueprint26/trees). For every original this makes a
 * web copy under src/art at the same path: 2000px on the long edge, turned the
 * way the camera meant, colour profile kept, as a lower-case .jpg. A copy is
 * only remade when its original is newer, and a copy whose original is gone is
 * removed.
 *
 * Then it brings src/art/art.json — the order, alt text and captions, the one
 * file to edit by hand — in line with the folders: a new piece goes at the end
 * of its set with its alt and caption blank, a new set or stack at the end, and
 * an entry whose file is gone comes out. Everything already there keeps its
 * place and its words. Last, it writes src/art/images.ts, the imports that hand
 * each file to the page.
 *
 * website_art is not in git, so on a copy of the repo without it this does
 * nothing and leaves src/art as it is.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGINALS = "website_art";
const COPIES = "src/art";
const LIST = path.join(COPIES, "art.json");
const IMPORTS = path.join(COPIES, "images.ts");

const LONG_EDGE = 2000;
const IS_IMAGE = /\.(jpe?g|png|webp|tiff?)$/i;

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

/** where an original's copy lives, relative to src/art */
const copyPath = (dir, name) =>
  path.posix.join(dir, name.replace(/\.[^.]+$/, "").toLowerCase().replace(/\s+/g, "_") + ".jpg");

/**
 * The sets as they stand in website_art: [{ title, pieces }], where a piece is
 * { file, original } and a stack is { title, pieces } of those.
 */
async function readFolders() {
  const seen = new Set();
  const pieces = async (dir, depth) => {
    const out = [];
    for (const entry of (await readdir(path.join(ORIGINALS, dir), { withFileTypes: true })).sort(byName)) {
      const rel = path.posix.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (depth > 0) {
          console.warn(`  skipped ${rel}/ — a stack can't hold another folder`);
          continue;
        }
        const inner = await pieces(rel, depth + 1);
        if (inner.length) out.push({ title: entry.name, pieces: inner });
      } else if (IS_IMAGE.test(entry.name)) {
        const file = copyPath(dir, entry.name);
        if (seen.has(file)) {
          console.warn(`  skipped ${rel} — another original already makes ${file}`);
          continue;
        }
        seen.add(file);
        out.push({ file, original: path.join(ORIGINALS, rel) });
      }
    }
    return out;
  };

  const sets = [];
  for (const entry of (await readdir(ORIGINALS, { withFileTypes: true })).sort(byName)) {
    if (!entry.isDirectory()) continue;
    const inner = await pieces(entry.name, 0);
    if (inner.length) sets.push({ title: entry.name, pieces: inner });
  }
  return sets;
}

const flatten = (items) => items.flatMap((it) => ("pieces" in it ? flatten(it.pieces) : [it]));

/** remakes the copies that are missing or older than their original */
async function makeCopies(found) {
  let made = 0;
  for (const { file, original } of found) {
    const dest = path.join(COPIES, file);
    if (existsSync(dest) && (await stat(dest)).mtimeMs >= (await stat(original)).mtimeMs) continue;
    await mkdir(path.dirname(dest), { recursive: true });
    await sharp(original, { limitInputPixels: false })
      .autoOrient()
      .resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .keepIccProfile()
      .jpeg({ quality: 85, progressive: true })
      .toFile(dest);
    console.log(`  made ${file}`);
    made++;
  }
  return made;
}

/** removes the copies under src/art that no original makes any more */
async function removeStale(found) {
  const wanted = new Set(found.map((p) => p.file));
  let removed = 0;
  const walk = async (dir) => {
    for (const entry of await readdir(path.join(COPIES, dir), { withFileTypes: true })) {
      const rel = path.posix.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(rel);
        // a set or stack whose last piece just went goes with it
        if (!(await readdir(path.join(COPIES, rel))).length) await rm(path.join(COPIES, rel), { recursive: true });
      } else if (IS_IMAGE.test(entry.name) && !wanted.has(rel)) {
        await rm(path.join(COPIES, rel));
        console.log(`  removed ${rel} — its original is gone`);
        removed++;
      }
    }
  };
  await walk("");
  return removed;
}

/**
 * The listed entries, kept in their order and with their words, less the ones
 * whose file is gone, plus the new ones from the folders at the end.
 */
function merge(listed, found, dropped) {
  const key = (it) => ("pieces" in it ? `stack:${it.title}` : it.file);
  const fresh = new Map(found.map((it) => [key(it), it]));
  const out = [];
  for (const it of listed) {
    const match = fresh.get(key(it));
    if (!match) {
      dropped.push(...flatten([it]));
      continue;
    }
    fresh.delete(key(it));
    out.push("pieces" in it ? { ...it, pieces: merge(it.pieces, match.pieces, dropped) } : it);
  }
  for (const it of fresh.values()) out.push(blank(it));
  return out;
}

/** a new entry, with its alt and caption left to fill in */
const blank = (it) =>
  "pieces" in it
    ? { title: it.title, pieces: it.pieces.map(blank) }
    : { file: it.file, alt: "", caption: "" };

/** an import name for a file: its path with the punctuation made underscores */
function importNames(files) {
  const used = new Set();
  return files.map((file) => {
    let name = file.replace(/\.jpg$/, "").replace(/[^A-Za-z0-9]+/g, "_");
    if (/^[0-9]/.test(name)) name = `_${name}`;
    let unique = name;
    for (let n = 2; used.has(unique); n++) unique = `${name}_${n}`;
    used.add(unique);
    return unique;
  });
}

function writeImports(list) {
  const files = flatten(list).map((p) => p.file);
  const names = importNames(files);
  const lines = [
    "// Written by `npm run art` from the files listed in art.json — edit those,",
    "// not this.",
    'import type { StaticImageData } from "next/image";',
    "",
    ...files.map((file, i) => `import ${names[i]} from "./${file}";`),
    "",
    "export const IMAGES: Record<string, StaticImageData> = {",
    ...files.map((file, i) => `  ${JSON.stringify(file)}: ${names[i]},`),
    "};",
    "",
  ];
  writeFileSync(IMPORTS, lines.join("\n"));
}

async function main() {
  if (!existsSync(ORIGINALS)) {
    console.log(`no ${ORIGINALS} folder here, so src/art stays as it is`);
    return;
  }

  const sets = await readFolders();
  const found = flatten(sets);
  const made = await makeCopies(found);
  const removed = await removeStale(found);

  const listed = existsSync(LIST) ? JSON.parse(readFileSync(LIST, "utf8")) : [];
  const dropped = [];
  const list = merge(listed, sets, dropped);
  writeFileSync(LIST, JSON.stringify(list, null, 2) + "\n");
  writeImports(list);

  const before = new Set(flatten(listed).map((p) => p.file));
  const added = flatten(list).filter((p) => !before.has(p.file));
  for (const p of added) console.log(`  listed ${p.file} — its alt and caption are blank in art.json`);
  for (const p of dropped) {
    const words = p.alt || p.caption ? ` (it had: ${JSON.stringify(p.caption || p.alt)})` : "";
    console.log(`  unlisted ${p.file}${words}`);
  }
  console.log(
    `${found.length} pieces: ${made} copies made, ${removed} removed, ` +
      `${added.length} newly listed, ${dropped.length} unlisted`,
  );
}

await main();
