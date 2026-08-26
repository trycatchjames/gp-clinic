import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export const repositoryRoot = path.resolve(import.meta.dirname, '../../../..');
export const slicesDirectory = path.join(repositoryRoot, 'delivery/slices');

export async function loadManifests() {
  const files = (await readdir(slicesDirectory)).filter((file) => file.endsWith('.yaml')).sort();
  const entries = await Promise.all(files.map(async (file) => {
    const source = await readFile(path.join(slicesDirectory, file), 'utf8');
    const slice = YAML.parse(source);
    return [slice.id, { ...slice, file }];
  }));
  return Object.fromEntries(entries);
}

export function sliceIdFromIssue(issue) {
  const match = issue.title.match(/\[([A-Z][A-Z0-9-]+)\]/);
  return match?.[1] ?? null;
}

export function scenarioExists(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*Scenario(?: Outline)?:\\s*${escaped}\\s*$`, 'm').test(source);
}
