import { writeFileSync, mkdirSync } from "node:fs";

const LINE =
  'One star: started with a meeting titled "Quick Sync" that lasted 90 minutes, ended with "per my last email" from a man named Todd. Would not recommend.';

const outDir = process.env.OUTPUT_DIR ?? "/output";
const text = LINE.trim();

// Gate tersegel: /output/entry.txt UTF-8, 1-200 karakter, satu baris, tidak hanya spasi.
if (text.length < 1 || text.length > 200) {
  throw new Error(`entry length ${text.length} outside sealed gate 1-200`);
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (text.trim().length === 0) {
  throw new Error("entry must not be whitespace-only");
}

// Guard selaras brief juri: format review bintang (buka "One star:" / tutup
// "Would not recommend.") + momen Senin konkret yang berdiri sendiri.
if (!/^One star: /.test(text) || !/Would not recommend\.$/.test(text)) {
  throw new Error("entry must read as a one-star Monday review");
}
// Sealed gate: exactly one sentence block of review text — no title, no
// second line, no trailing explanation.
if (text !== LINE) {
  throw new Error("entry drifted from the verified final line");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, text, "utf8");
console.log(`entry ok: ${text.length} chars, 1 line`);
