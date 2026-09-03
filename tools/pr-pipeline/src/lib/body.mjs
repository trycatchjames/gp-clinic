const sectionMarker = (name, edge) => `<!-- pr-pipeline:${name}:${edge} -->`;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function markedSection(body, name) {
  const start = sectionMarker(name, 'start');
  const end = sectionMarker(name, 'end');
  const match = String(body ?? '').match(
    new RegExp(`${escapeRegExp(start)}\\n?([\\s\\S]*?)\\n?${escapeRegExp(end)}`),
  );
  return match?.[1]?.trim() ?? '';
}

export function replaceMarkedSection(body, name, content) {
  const start = sectionMarker(name, 'start');
  const end = sectionMarker(name, 'end');
  const section = `${start}\n${String(content).trim()}\n${end}`;
  const current = String(body ?? '').trim();
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  if (pattern.test(current)) return `${current.replace(pattern, section).trim()}\n`;
  return `${current ? `${current}\n\n` : ''}${section}\n`;
}

function cleanSummary(value) {
  return String(value ?? '')
    .replace(/<!--.*?-->/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800);
}

export function reviewReportSummary(report) {
  const lines = String(report ?? '')
    .replace(/^VERDICT:.*$/gim, '')
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, ''))
    .filter((line) => line && !line.startsWith('#'));
  return cleanSummary(lines.slice(0, 3).join(' · '));
}

export function updateReviewBody({ body, sha, passed, summary }) {
  const result = passed
    ? '- **Consolidated:** Passed'
    : `- **Consolidated:** Changes required${summary ? ` — ${cleanSummary(summary)}` : ''} <!-- agent-review:slice:${sha} -->`;
  return replaceMarkedSection(body, 'reviews', [
    '## Automated review',
    '',
    `<!-- pr-pipeline:review-head:${sha} -->`,
    result,
  ].join('\n'));
}

export function updatePipelineState(body, state, detail, hiddenMarkers = []) {
  const lines = ['## Pipeline', '', `- **State:** ${state}`];
  if (detail) lines.push(`- ${cleanSummary(detail)}`);
  if (hiddenMarkers.length > 0) lines.push('', ...hiddenMarkers);
  return replaceMarkedSection(body, 'state', lines.join('\n'));
}
