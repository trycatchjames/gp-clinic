import { readdir, readFile } from 'node:fs/promises';
import { posix } from 'node:path';

/** Only the product documentation is bundled; repository instructions and source are excluded. */
export async function readDocuments(root) {
  const paths = ['SPEC.md', 'FLOW.md'];
  async function walk(directory) {
    const entries = await readdir(`${root}/${directory}`, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await walk(path);
      else if (entry.name !== 'AGENTS.md' && /\.(md|feature|yaml)$/.test(entry.name)) paths.push(path);
    }
  }
  await walk('spec');
  const documents = await Promise.all(paths.map(async (path) => {
    const source = await readFile(`${root}/${path}`, 'utf8');
    const title = source.match(/^# (.+)$/m)?.[1] ??
      (path.endsWith('.feature') ? 'Acceptance examples' : 'Review evidence');
    const section = path.startsWith('spec/') ? path.split('/')[1] : 'Start here';
    return { path, title, section, source };
  }));
  const index = documents.find((doc) => doc.path === 'spec/product/core-domains.md');
  if (!index) throw new Error('The core-domain reading order is missing.');
  const groups = index.source.split(/^## /m).slice(1).map((part) => ({
    title: part.split('\n')[0].trim(),
    links: [...part.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)/gm)].map((match) => ({
      title: match[1],
      path: posix.normalize(posix.join('spec/product', match[2])),
    })),
  }));
  const known = new Set(documents.map((doc) => doc.path));
  for (const group of groups) {
    for (const link of group.links) {
      if (!known.has(link.path)) throw new Error(`Unknown core-domain document: ${link.path}`);
    }
  }
  return { documents, groups };
}
