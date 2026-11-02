export function readDocuments(root: string): Promise<{
  documents: { path: string; title: string; section: string; source: string }[];
  groups: { title: string; links: { title: string; path: string }[] }[];
}>;
