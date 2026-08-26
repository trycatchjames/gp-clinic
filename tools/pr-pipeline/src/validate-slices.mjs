import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import YAML from 'yaml';
import { loadManifests, repositoryRoot, scenarioExists } from './lib/manifests.mjs';

const errors = [];
const schema = JSON.parse(await readFile(path.join(repositoryRoot, 'delivery/slices/schema.json'), 'utf8'));
const validate = new Ajv({ allErrors: true }).compile(schema);
const manifests = await loadManifests();

for (const slice of Object.values(manifests)) {
  const document = { ...slice };
  delete document.file;
  if (!validate(document)) {
    for (const issue of validate.errors ?? []) errors.push(`${slice.file}${issue.instancePath}: ${issue.message}`);
  }
  for (const reference of slice.spec_refs ?? []) {
    try {
      await access(path.join(repositoryRoot, reference));
    } catch {
      errors.push(`${slice.file}: missing spec reference ${reference}`);
    }
  }
  for (const scenario of slice.acceptance?.scenarios ?? []) {
    try {
      const source = await readFile(path.join(repositoryRoot, scenario.file), 'utf8');
      if (!scenarioExists(source, scenario.name)) errors.push(`${slice.file}: scenario not found: ${scenario.name}`);
    } catch {
      errors.push(`${slice.file}: missing scenario file ${scenario.file}`);
    }
  }
  for (const dependency of slice.depends_on ?? []) {
    if (!manifests[dependency]) errors.push(`${slice.file}: unknown dependency ${dependency}`);
  }
  if (slice.capability) {
    try {
      const review = YAML.parse(await readFile(path.join(repositoryRoot, `spec/capabilities/${slice.capability}/review.yaml`), 'utf8'));
      for (const evidenceType of ['screenshots', 'flows', 'fixtures']) {
        const allowed = new Set(review.review_evidence?.[evidenceType] ?? []);
        for (const id of slice.evidence?.[evidenceType] ?? []) {
          if (!allowed.has(id)) errors.push(`${slice.file}: ${evidenceType} evidence ${id} is not selected by the capability review contract`);
        }
      }
    } catch {
      errors.push(`${slice.file}: missing or invalid review contract for capability ${slice.capability}`);
    }
  }
  if (['in_review', 'accepted', 'delivered'].includes(slice.status)) {
    for (const screenshot of slice.evidence?.screenshots ?? []) {
      try {
        await access(path.join(repositoryRoot, `delivery/evidence/${slice.id}/screenshots/${screenshot}.png`));
      } catch {
        errors.push(`${slice.file}: missing review screenshot delivery/evidence/${slice.id}/screenshots/${screenshot}.png`);
      }
    }
  }
}

const visiting = new Set();
const visited = new Set();
function visit(id) {
  if (visiting.has(id)) {
    errors.push(`dependency cycle includes ${id}`);
    return;
  }
  if (visited.has(id)) return;
  visiting.add(id);
  for (const dependency of manifests[id]?.depends_on ?? []) visit(dependency);
  visiting.delete(id);
  visited.add(id);
}
for (const id of Object.keys(manifests)) visit(id);

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${Object.keys(manifests).length} delivery slice manifests.`);
}
