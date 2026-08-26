const apiVersion = '2026-03-10';

export function repositoryParts(value = process.env.GITHUB_REPOSITORY) {
  const [owner, repo] = (value ?? '').split('/');
  if (!owner || !repo) throw new Error('GITHUB_REPOSITORY must be owner/repository');
  return { owner, repo };
}

export function githubClient({ token = process.env.GITHUB_TOKEN, repository = process.env.GITHUB_REPOSITORY } = {}) {
  if (!token) throw new Error('GITHUB_TOKEN is required');
  const { owner, repo } = repositoryParts(repository);
  const root = `https://api.github.com/repos/${owner}/${repo}`;

  const request = async (method, path, body) => {
    const response = await fetch(path.startsWith('http') ? path : `${root}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': apiVersion,
        'User-Agent': 'gp-pr-pipeline',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`${method} ${path} failed (${response.status}): ${detail}`);
    }
    return response.status === 204 ? null : response.json();
  };

  const paginate = async (path) => {
    const separator = path.includes('?') ? '&' : '?';
    const collected = [];
    for (let page = 1; ; page += 1) {
      const result = await request('GET', `${path}${separator}per_page=100&page=${page}`);
      collected.push(...result);
      if (result.length < 100) return collected;
    }
  };

  return { owner, repo, request, paginate };
}

export async function setLabels(client, issueNumber, labels) {
  return client.request('POST', `/issues/${issueNumber}/labels`, { labels });
}

export async function removeLabel(client, issueNumber, label) {
  try {
    await client.request('DELETE', `/issues/${issueNumber}/labels/${encodeURIComponent(label)}`);
  } catch (error) {
    if (!String(error.message).includes('(404)')) throw error;
  }
}

export async function dispatch(client, eventType, clientPayload) {
  await client.request('POST', '/dispatches', { event_type: eventType, client_payload: clientPayload });
}
