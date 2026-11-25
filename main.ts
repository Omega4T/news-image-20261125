// news-image-20261125 — entrypoint.
//
// Ships the pre-built front-page image (entry.png, beside this file) to the
// output directory. Node 22, standard library only. The copy is byte-for-byte,
// so running this twice always produces identical output bytes.
import { createHash } from 'node:crypto';
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
if (!existsSync(source)) throw new Error(`missing entry image: ${source}`);

const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(source, dest);
chmodSync(dest, 0o644);
// verify the copy is byte-identical before reporting success
const hash = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
if (hash(source) !== hash(dest)) throw new Error(`copy mismatch: ${dest} differs from ${source}`);
console.log(`wrote ${dest} (${statSync(dest).size} bytes)`);
