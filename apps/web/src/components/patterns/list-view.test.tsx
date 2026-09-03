import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListView, ListViewRow } from './list-view';

type Row = { id: string; name: string };

const rows: Row[] = [
  { id: 'a', name: 'Isla Ngo' },
  { id: 'b', name: 'Mia Ngo' },
  { id: 'c', name: 'Noah Ngo' },
];

function renderList(props: Partial<React.ComponentProps<typeof ListView<Row>>> = {}) {
  const onSelect = vi.fn();
  render(
    <ListView
      label="Matching patients"
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => row.name}
      onSelect={onSelect}
      {...props}
    />,
  );
  return { onSelect };
}

describe('ListView', () => {
  it('names the list and exposes each record as a pressable row', () => {
    renderList({ selectedKey: 'b' });

    expect(screen.getByRole('list', { name: 'Matching patients' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Isla Ngo/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: /Mia Ngo/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the selected row with more than colour', () => {
    renderList({ selectedKey: 'b' });

    const selected = screen.getByRole('button', { name: /Mia Ngo/ });
    expect(selected).toHaveTextContent('Selected');
  });

  it('moves focus with the arrow keys without selecting anything', () => {
    const { onSelect } = renderList();

    const first = screen.getByRole('button', { name: /Isla Ngo/ });
    const second = screen.getByRole('button', { name: /Mia Ngo/ });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'ArrowUp' });
    expect(first).toHaveFocus();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('jumps to the ends and stops there rather than wrapping', () => {
    renderList();

    const first = screen.getByRole('button', { name: /Isla Ngo/ });
    const last = screen.getByRole('button', { name: /Noah Ngo/ });

    first.focus();
    fireEvent.keyDown(first, { key: 'End' });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: 'ArrowDown' });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: 'Home' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'ArrowUp' });
    expect(first).toHaveFocus();
  });

  it('leaves keys it does not own to the browser', () => {
    renderList();

    const first = screen.getByRole('button', { name: /Isla Ngo/ });
    first.focus();
    const event = fireEvent.keyDown(first, { key: 'Tab' });

    // Not prevented, so Tab still performs its normal sequential move and Enter
    // still activates the focused button natively.
    expect(event).toBe(true);
  });

  it('reports the row the user activates', () => {
    const { onSelect } = renderList();

    fireEvent.click(screen.getByRole('button', { name: /Mia Ngo/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(rows[1]);
  });
});

describe('ListViewRow', () => {
  it('separates supporting facts and drops the ones with no value', () => {
    render(
      <ListViewRow
        title="Isla Ngo"
        meta={['2 Apr 2015', null, 'Medicare ••••53', undefined]}
        trailing="R000004"
        footnote="Matched on date of birth, name"
      />,
    );

    const facts = screen.getByText(/2 Apr 2015/);
    expect(facts).toHaveTextContent('2 Apr 2015 · Medicare ••••53');
    expect(screen.getByText('R000004')).toBeInTheDocument();
    expect(screen.getByText('Matched on date of birth, name')).toBeInTheDocument();
  });
});
