import { describe, expect, it } from 'vitest';
import { headings, resolveDocumentLink } from './navigation';

describe('documentation links', () => {
  it('resolves a capability dependency and its heading from the current file', () => {
    expect(resolveDocumentLink('spec/capabilities/calendar/spec.md', '../../domain/appointment.md#invariants'))
      .toEqual({ path: 'spec/domain/appointment.md', fragment: 'invariants' });
    expect(resolveDocumentLink('SPEC.md', 'spec/product/')).toEqual({ path: 'spec/product', fragment: '' });
  });
  it('keeps external links out of document routing', () => {
    for (const url of ['https://example.com', 'mailto:person@example.com', '//example.com', 'javascript:alert(1)']) {
      expect(resolveDocumentLink('SPEC.md', url)).toBeNull();
    }
  });
  it('ignores code fences and gives duplicate headings distinct destinations', () => {
    expect(headings('# A\n```md\n## Example\n```\n## Rules\n## Rules')).toEqual([
      { title: 'A', depth: 1, id: 'a', line: 1 },
      { title: 'Rules', depth: 2, id: 'rules', line: 5 },
      { title: 'Rules', depth: 2, id: 'rules-1', line: 6 },
    ]);
  });
});
