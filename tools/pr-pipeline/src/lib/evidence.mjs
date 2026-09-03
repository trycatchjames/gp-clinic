import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { repositoryRoot } from './manifests.mjs';

const runtime = path.join(repositoryRoot, 'tools/pr-pipeline/runtime');

/**
 * Maps a Playwright JSON report onto the flow ids a slice manifest declares.
 *
 * Flows are matched by the `[flow-id]` tag a spec carries in its title, so the
 * spec file layout can change without breaking the evidence contract.
 */
export function flowVideos(report, flows) {
  const found = new Map();
  const visit = (suite) => {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        for (const result of test.results ?? []) {
          const video = (result.attachments ?? []).find((item) => item.name === 'video' && item.path);
          if (!video) continue;
          const flow = flows.find((id) => spec.title.includes(`[${id}]`));
          // Keep the last attempt: a retry's video is the one that matches the
          // reported outcome.
          if (flow) found.set(flow, { path: video.path, title: spec.title, ok: spec.ok !== false });
        }
      }
    }
    for (const child of suite.suites ?? []) visit(child);
  };
  for (const suite of report.suites ?? []) visit(suite);
  return found;
}

export function invalidatesFlowEvidence(changedFiles) {
  return changedFiles.some((file) =>
    file.startsWith('apps/') ||
    file.startsWith('packages/') ||
    file.startsWith('e2e/') ||
    file === 'playwright.config.ts',
  );
}

/**
 * Records the slice's declared flows locally and stores each video as slice
 * evidence, so the video travels with the PR instead of being produced by CI.
 *
 * Returns the evidence-relative paths that were written, for the PR body.
 */
export async function captureFlowVideos({ sliceId, flows, env = process.env }) {
  if (!flows || flows.length === 0) return [];
  const reportPath = path.join(runtime, 'flow-report.json');
  await rm(reportPath, { force: true });

  const grep = flows.map((id) => `\\[${id}\\]`).join('|');
  const result = spawnSync('pnpm', ['exec', 'playwright', 'test', '--grep', grep, '--reporter', 'list,json'], {
    cwd: repositoryRoot,
    stdio: 'inherit',
    env: {
      ...env,
      // Video is local-only; force it on even if the caller's shell looks like CI.
      CI: '',
      PLAYWRIGHT_JSON_OUTPUT_NAME: reportPath,
      PW_TEST_HTML_REPORT_OPEN: 'never',
    },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`The slice flows must pass locally before the PR is opened; playwright exited with ${result.status}`);
  }

  const report = JSON.parse(await readFile(reportPath, 'utf8'));
  const videos = flowVideos(report, flows);
  const missing = flows.filter((id) => !videos.has(id));
  if (missing.length > 0) {
    throw new Error(`No Playwright video was recorded for declared flow(s): ${missing.join(', ')}`);
  }

  const destinationDirectory = path.join(repositoryRoot, 'delivery/evidence', sliceId, 'flows');
  await mkdir(destinationDirectory, { recursive: true });
  const written = [];
  for (const [flow, video] of videos) {
    const relative = `delivery/evidence/${sliceId}/flows/${flow}.webm`;
    await copyFile(video.path, path.join(repositoryRoot, `${relative}`));
    written.push({ flow, path: relative });
  }
  return written;
}
