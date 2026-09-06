import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ItemisedOutcome, type ItemisedResultItem } from './itemised-outcome';

const noun = ['result', 'results'] as const;

const partial: readonly ItemisedResultItem[] = [
  { key: 'a', name: 'Marlee Tran · full blood count', status: 'applied' },
  { key: 'b', name: 'Joseph Okafor · chest x-ray', status: 'applied' },
  {
    key: 'c',
    name: 'Unmatched · cervical screening',
    status: 'failed',
    detail: 'The result stayed with Dr Rowena Aspinall and remains unreviewed.',
  },
  { key: 'd', name: 'Hamish Okonkwo-Delacroix · urine culture', status: 'skipped' },
];

describe('ItemisedOutcome', () => {
  it('reports a partial result as partial rather than as success', () => {
    render(
      <ItemisedOutcome
        phase="result"
        heading="Reassigned 4 results to Dr Aroha Duong"
        noun={noun}
        items={partial}
      />,
    );

    const summary = screen.getByRole('alert');
    expect(summary).toHaveTextContent('4 results');
    expect(summary).toHaveTextContent('1 failed');
    expect(summary).toHaveTextContent('1 skipped');
    expect(summary).toHaveTextContent('2 done');
  });

  it('does not interrupt for a preview, because nothing has happened yet', () => {
    render(
      <ItemisedOutcome
        phase="preview"
        heading="Reassign 2 results to Dr Aroha Duong"
        noun={noun}
        items={[
          { key: 'a', name: 'Marlee Tran · full blood count', status: 'ready' },
          {
            key: 'b',
            name: 'Unmatched · cervical screening',
            status: 'blocked',
            detail: 'Dr Aroha Duong does not hold access to this source.',
          },
        ]}
      />,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 ready');
    expect(
      screen.getByText('Dr Aroha Duong does not hold access to this source.'),
    ).toBeInTheDocument();
  });

  it('counts the records it has not reached instead of claiming an outcome for them', () => {
    render(
      <ItemisedOutcome
        phase="result"
        heading="Reassigning 5 results to Dr Aroha Duong"
        noun={noun}
        pending={3}
        items={[
          { key: 'a', name: 'Marlee Tran · full blood count', status: 'applied' },
          { key: 'b', name: 'Joseph Okafor · chest x-ray', status: 'applied' },
        ]}
      />,
    );

    const summary = screen.getByRole('status');
    expect(summary).toHaveTextContent('5 results');
    expect(summary).toHaveTextContent('3 still to do');
  });

  it('keeps every record that did not change visible while the succeeded ones collapse', () => {
    render(
      <ItemisedOutcome
        phase="result"
        heading="Reassigned 4 results to Dr Aroha Duong"
        noun={noun}
        items={partial}
        appliedDisclosure={{ open: false, onOpenChange: vi.fn() }}
      />,
    );

    expect(screen.getByText(/Unmatched · cervical screening/)).toBeInTheDocument();
    expect(screen.getByText(/Hamish Okonkwo-Delacroix/)).toBeInTheDocument();
    expect(screen.queryByText(/Marlee Tran/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /2 results done/ }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('puts the records needing a decision above the ones that are finished', () => {
    render(
      <ItemisedOutcome
        phase="result"
        heading="Reassigned 4 results to Dr Aroha Duong"
        noun={noun}
        items={partial}
      />,
    );

    const entries = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(entries[0]).toHaveTextContent('Failed');
    expect(entries[1]).toHaveTextContent('Skipped');
  });

  it('offers the recovery step beside the record it belongs to', () => {
    const onSelect = vi.fn();
    render(
      <ItemisedOutcome
        phase="result"
        heading="Reassigned 1 result to Dr Aroha Duong"
        noun={noun}
        items={[
          {
            key: 'c',
            name: 'Unmatched · cervical screening',
            status: 'failed',
            action: { label: 'Try again', onSelect },
          },
        ]}
      />,
    );

    const entry = within(screen.getByRole('list')).getByRole('listitem');
    fireEvent.click(within(entry).getByRole('button', { name: 'Try again' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
