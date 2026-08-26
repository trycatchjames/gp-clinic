import { spawn } from 'node:child_process';
import { access, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const providers = new Set(['codex', 'claude']);

export function parseLocalArgs(argv) {
  const options = {
    dryRun: false,
    help: false,
    provider: process.env.AGENT_PROVIDER || 'claude',
    skipReviews: false,
    reviewPull: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--dry-run' || argument === '--status') options.dryRun = true;
    else if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--skip-reviews') options.skipReviews = true;
    else if (argument === '--provider') options.provider = argv[++index];
    else if (argument.startsWith('--provider=')) options.provider = argument.slice('--provider='.length);
    else if (argument === '--review-only') options.reviewPull = Number(argv[++index]);
    else if (argument.startsWith('--review-only=')) options.reviewPull = Number(argument.slice('--review-only='.length));
    else throw new Error(`Unknown option ${argument}`);
  }
  if (!providers.has(options.provider)) throw new Error(`Provider must be one of: ${[...providers].join(', ')}`);
  if (options.reviewPull !== null && (!Number.isInteger(options.reviewPull) || options.reviewPull < 1)) {
    throw new Error('--review-only requires a positive pull request number');
  }
  return options;
}

export function agentCommand({ provider, mode, repositoryRoot, outputPath }) {
  if (provider === 'codex') {
    return {
      command: 'codex',
      args: [
        'exec',
        '--cd', repositoryRoot,
        '--sandbox', mode === 'review' ? 'read-only' : 'workspace-write',
        '--ephemeral',
        '--color', 'never',
        '--output-last-message', outputPath,
        '-',
      ],
    };
  }

  const implementationTools = [
    'Read', 'Edit', 'Write', 'Glob', 'Grep',
    'Bash(pnpm *)', 'Bash(node *)', 'Bash(git status *)', 'Bash(git diff *)',
    'Bash(git log *)', 'Bash(git show *)', 'Bash(mkdir *)',
  ].join(',');
  const reviewTools = [
    'Read', 'Glob', 'Grep', 'Bash(git status *)', 'Bash(git diff *)',
    'Bash(git log *)', 'Bash(git show *)',
  ].join(',');
  return {
    command: 'claude',
    args: [
      '--print',
      '--permission-mode', mode === 'review' ? 'dontAsk' : 'acceptEdits',
      '--no-session-persistence',
      '--allowedTools', mode === 'review' ? reviewTools : implementationTools,
    ],
  };
}

export async function ensureAgentAvailable(provider) {
  const pathEntries = (process.env.PATH ?? '').split(path.delimiter);
  for (const entry of pathEntries) {
    try {
      await access(path.join(entry, provider));
      return;
    } catch {
      // Continue searching PATH.
    }
  }
  throw new Error(`${provider} is not installed or is not on PATH`);
}

export async function runAgent({ provider, mode, repositoryRoot, promptPath, outputPath }) {
  await ensureAgentAvailable(provider);
  const prompt = await readFile(promptPath, 'utf8');
  const invocation = agentCommand({ provider, mode, repositoryRoot, outputPath });
  const capture = provider === 'claude';
  const stdout = [];
  try { await unlink(outputPath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const noGitHubAuth = path.join(repositoryRoot, 'tools/pr-pipeline/runtime/no-gh-auth');
  await mkdir(noGitHubAuth, { recursive: true });
  const environment = { ...process.env, GH_CONFIG_DIR: noGitHubAuth, GIT_ASKPASS: 'false', GIT_SSH_COMMAND: 'false' };
  delete environment.GITHUB_TOKEN;
  delete environment.GH_TOKEN;
  await new Promise((resolve, reject) => {
    const child = spawn(invocation.command, invocation.args, {
      cwd: repositoryRoot,
      env: environment,
      stdio: ['pipe', capture ? 'pipe' : 'inherit', 'inherit'],
    });
    if (capture) {
      child.stdout.on('data', (chunk) => {
        stdout.push(chunk);
        process.stdout.write(chunk);
      });
    }
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${provider} exited with ${signal ? `signal ${signal}` : `status ${code}`}`));
    });
    child.stdin.end(prompt);
  });
  if (capture) await writeFile(outputPath, Buffer.concat(stdout).toString('utf8'));
  const result = await readFile(outputPath, 'utf8');
  if (!result.trim()) throw new Error(`${provider} did not produce a final report`);
}
