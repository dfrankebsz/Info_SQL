import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here,'..');
const out = resolve(root,'public/vendor');
await mkdir(out,{recursive:true});
for (const file of ['sql-wasm.js','sql-wasm.wasm']) {
  await copyFile(resolve(root,'node_modules/sql.js/dist',file), resolve(out,file));
}
console.log('sql.js Assets nach public/vendor kopiert.');
