// Regenerates specification/*/vectors.json by calling the real, built
// implementation (dist/) for every `input` already on file. This never
// hand-writes expected outputs — it keeps existing `input` (and `uf`, for
// IE) values and recomputes `valid`/`normalized`/`formatted`/`keyType`
// from the library itself, so the vectors can't drift from actual behavior.
//
// Run after `npm run build`, whenever a validator's behavior changes or a
// new vector is added by hand (input + uf only) to specification/*/vectors.json.
//
// Usage: npm run build && node scripts/generate-vectors.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { CPF, CNPJ, CEP, Phone, Email, PIX, IE } from "../dist/index.js";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const specDir = path.join(rootDir, "specification");

const generators = {
  cpf: (input) => ({
    input,
    valid: CPF.isValid(input),
    normalized: CPF.normalize(input),
    formatted: CPF.format(input),
  }),
  cnpj: (input) => ({
    input,
    valid: CNPJ.isValid(input),
    normalized: CNPJ.normalize(input),
    formatted: CNPJ.format(input),
  }),
  cep: (input) => ({
    input,
    valid: CEP.isValid(input),
    normalized: CEP.normalize(input),
    formatted: CEP.format(input),
  }),
  phone: (input) => ({
    input,
    valid: Phone.isValid(input),
    normalized: Phone.normalize(input),
    formatted: Phone.format(input),
  }),
  email: (input) => ({
    input,
    valid: Email.isValid(input),
    normalized: Email.normalize(input),
    formatted: Email.format(input),
  }),
  pix: (input) => ({
    input,
    keyType: PIX.getKeyType(input),
    valid: PIX.isValid(input),
    normalized: PIX.normalize(input),
    formatted: PIX.format(input),
  }),
  ie: (input, uf) => ({
    input,
    uf,
    valid: IE.isValid(input, uf),
    normalized: IE.normalize(input, uf),
    formatted: IE.format(input, uf),
  }),
};

async function regenerate(name) {
  const filePath = path.join(specDir, name, "vectors.json");
  const existing = JSON.parse(await readFile(filePath, "utf8"));
  const generate = generators[name];

  const regenerated = existing.map((vector) => generate(vector.input, vector.uf));

  await writeFile(filePath, JSON.stringify(regenerated, null, 2) + "\n", "utf8");
  console.log(`regenerated ${name}/vectors.json (${regenerated.length} vectors)`);
}

for (const name of Object.keys(generators)) {
  await regenerate(name);
}
