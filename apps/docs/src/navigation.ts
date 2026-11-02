export function documentUrl(path: string, fragment = '') {
  return `?doc=${encodeURIComponent(path)}${fragment ? `#${fragment}` : ''}`;
}

export function resolveDocumentLink(current: string, href: string) {
  if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return null;
  const url = new URL(href, `https://documentation.invalid/${current}`);
  return { path: decodeURIComponent(url.pathname.slice(1)).replace(/\/$/, ''), fragment: url.hash.slice(1) };
}

export function headings(source: string) {
  let fence = '';
  const used = new Map<string, number>();
  return source.split('\n').flatMap((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = '';
      return [];
    }
    const match = !fence && line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (!match) return [];
    const title = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`_]/g, '');
    const base = title.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return [{ title, depth: match[1].length, id: `${base}${count ? `-${count}` : ''}`, line: index + 1 }];
  });
}
