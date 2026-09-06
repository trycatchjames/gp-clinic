import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SaveState } from './save-state';

const timeZone = 'Australia/Sydney';
const at = '2026-09-04T01:42:00.000Z';

describe('SaveState', () => {
  it('reserves the word saved for work that is durably on the record', () => {
    const { rerender } = render(
      <SaveState value={{ kind: 'saved', at }} timeZone={timeZone} label="Consultation note" />,
    );
    expect(screen.getByText(/^Saved/)).toBeInTheDocument();

    rerender(
      <SaveState value={{ kind: 'local', at }} timeZone={timeZone} label="Consultation note" />,
    );
    // The invariant: locally recovered work must not look durably saved.
    expect(screen.queryByText(/^Saved/)).not.toBeInTheDocument();
    expect(screen.getByText(/not on the record/)).toBeInTheDocument();
  });

  it('announces the local state in full rather than the abbreviated visible text', () => {
    render(<SaveState value={{ kind: 'local', at }} timeZone={timeZone} label="Consultation note" />);

    expect(screen.getByRole('status')).toHaveTextContent(
      /Consultation note is held on this device only since .*It has not been saved to the record\./,
    );
  });

  it('keeps a failed save distinct from an unsaved edit and offers the recovery action', () => {
    const onSelect = vi.fn();
    render(
      <SaveState
        value={{
          kind: 'failed',
          reason: 'The connection dropped. Your text is still here.',
          retry: { label: 'Save again', onSelect },
        }}
        timeZone={timeZone}
      />,
    );

    expect(screen.getByText(/^Not saved\./)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save again' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('reports a newer version by another author rather than implying a merge', () => {
    render(
      <SaveState
        value={{
          kind: 'conflict',
          reason: 'Both versions are kept until you choose.',
          reconcile: { label: 'Compare both versions', onSelect: vi.fn() },
        }}
        timeZone={timeZone}
      />,
    );

    expect(screen.getByText(/^Changed elsewhere\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Compare both versions' })).toBeInTheDocument();
  });

  it('renders every state with distinct wording', () => {
    const texts = new Set<string>();
    for (const value of [
      { kind: 'unsaved' },
      { kind: 'saving' },
      { kind: 'saved', at },
      { kind: 'local', at },
      { kind: 'failed', reason: 'Nothing was sent.' },
      { kind: 'conflict', reason: 'A newer version exists.' },
    ] as const) {
      const { container, unmount } = render(<SaveState value={value} timeZone={timeZone} />);
      texts.add(container.textContent ?? '');
      unmount();
    }
    expect(texts.size).toBe(6);
  });
});
