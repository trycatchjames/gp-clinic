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
  const plainText = String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800);
  return plainText
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
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

/**
 * A design-system pull request has to hand the owner something they can open. Preview hosting is a
 * separate delivery decision, so the reviewable candidate is the static build the gate already
 * produced, linked from its own marked section and replaced on every head.
 */
export function updateStorybookCandidate(body, { sha, artifactUrl, artifactName }) {
  // The URL reaches this from workflow output, so it is treated as untrusted: anything that is not
  // an https GitHub address is reported as no candidate rather than rendered as a link.
  let href = '';
  try {
    const parsed = new URL(String(artifactUrl ?? ''));
    if (parsed.protocol === 'https:' && /(^|\.)github\.com$/.test(parsed.hostname)) {
      href = parsed.toString();
    }
  } catch {
    href = '';
  }

  const lines = ['## Storybook candidate', ''];
  if (href) {
    lines.push(
      `- **Build:** [${cleanSummary(artifactName) || 'storybook-candidate'}](${href}) from \`${cleanSummary(sha)}\``,
      '- Download, unzip and serve the folder — for example `npx serve storybook-static`. Opening `index.html` from disk will not work.',
    );
  } else {
    lines.push(
      `- **Build:** unavailable for \`${cleanSummary(sha)}\` — the gate did not reach the Storybook build.`,
    );
  }
  return replaceMarkedSection(body, 'storybook', lines.join('\n'));
}
