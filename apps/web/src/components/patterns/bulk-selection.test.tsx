import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BulkSelectionBar, SelectionCheckbox } from './bulk-selection';

const noun = ['result', 'results'] as const;

describe('SelectionCheckbox', () => {
  it('names the record it selects rather than relying on its position in a row', () => {
    render(
      <SelectionCheckbox
        name="Marlee Tran, full blood count, received 4 Sep 2026"
        checked={false}
        onCheckedChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Select Marlee Tran, full blood count, received 4 Sep 2026',
      }),
    ).toBeInTheDocument();
  });

  it('refuses a blocked record and carries the reason as its description', () => {
    const onCheckedChange = vi.fn();
    render(
      <SelectionCheckbox
        name="Unmatched cervical screening"
        checked={false}
        blockedReason="Sensitive result. Reassignment needs additional access."
        onCheckedChange={onCheckedChange}
      />,
    );

    const control = screen.getByRole('checkbox');
    expect(control).toBeDisabled();
    expect(control).toHaveAccessibleDescription(
      'Sensitive result. Reassignment needs additional access.',
    );

    fireEvent.click(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('reports a partly selected group as mixed rather than as checked', () => {
    render(
      <SelectionCheckbox
        name="all 10 results on this page"
        checked="indeterminate"
        onCheckedChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });
});

describe('BulkSelectionBar', () => {
  const action = { id: 'reassign', label: 'Reassign to another clinician', onSelect: vi.fn() };

  it('offers no action while nothing is selected', () => {
    render(
      <BulkSelectionBar selectedCount={0} noun={noun} actions={[action]} onClear={vi.fn()} />,
    );

    expect(screen.getByText('No results selected')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: action.label })).not.toBeInTheDocument();
    // Clearing never unmounts: a control that vanishes with the last selection takes focus with it.
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeEnabled();
  });

  it('says when the selection reaches past the rows the operator can see', () => {
    render(
      <BulkSelectionBar
        selectedCount={22}
        offPageCount={17}
        noun={noun}
        actions={[action]}
        onClear={vi.fn()}
      />,
    );

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('22 results selected');
    expect(status).toHaveTextContent('17 not on this page');
  });

  it('counts the rows that cannot be included and states the reason once', () => {
    render(
      <BulkSelectionBar
        selectedCount={2}
        noun={noun}
        excluded={{ count: 1, reason: 'you can see the routing details but not the clinical content' }}
        actions={[action]}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/1 result on this page cannot be included/),
    ).toHaveTextContent('you can see the routing details but not the clinical content');
  });

  it('refuses an action that may never be taken over a selection and names the rule', () => {
    const onSelect = vi.fn();
    render(
      <BulkSelectionBar
        selectedCount={2}
        noun={noun}
        actions={[
          {
            id: 'disposition',
            label: 'Record review outcome',
            blockedReason: 'A review outcome is recorded one result at a time.',
            onSelect,
          },
        ]}
        onClear={vi.fn()}
      />,
    );

    const blocked = screen.getByRole('button', { name: 'Record review outcome' });
    expect(blocked).toBeDisabled();
    expect(blocked).toHaveAccessibleDescription(
      'Record review outcome: A review outcome is recorded one result at a time.',
    );

    fireEvent.click(blocked);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('announces the count politely rather than asserting it', () => {
    render(<BulkSelectionBar selectedCount={1} noun={noun} onClear={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('1 result selected');
  });

  it('hands clearing back to the caller', () => {
    const onClear = vi.fn();
    render(<BulkSelectionBar selectedCount={3} noun={noun} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
