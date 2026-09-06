import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActionBar } from './action-bar';

const primary = { label: 'Issue invoice', onSelect: vi.fn() };
const secondary = [{ id: 'preview', label: 'Preview account', onSelect: vi.fn() }];

describe('ActionBar', () => {
  it('names the failed precondition and describes the blocked action with it', () => {
    const reason = 'Item 10990 has no fee for 4 September 2026.';
    render(<ActionBar primary={primary} secondary={secondary} blockedReason={reason} />);

    const action = screen.getByRole('button', { name: 'Issue invoice' });
    expect(action).toBeDisabled();
    expect(action).toHaveAccessibleDescription(reason);
  });

  it('keeps a busy action named and leaves the supporting choices available', () => {
    render(
      <ActionBar
        primary={{ ...primary, busy: true, busyLabel: 'Issuing invoice' }}
        secondary={secondary}
      />,
    );

    const busy = screen.getByRole('button', { name: 'Issuing invoice' });
    expect(busy).toHaveAttribute('aria-busy', 'true');
    expect(busy).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Preview account' })).toBeEnabled();
  });

  it('places the primary action last so a supporting choice is reached first', () => {
    render(<ActionBar primary={primary} secondary={secondary} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[buttons.length - 1]).toHaveAccessibleName('Issue invoice');
  });

  it('reports the primary action to its caller', () => {
    const onSelect = vi.fn();
    render(<ActionBar primary={{ label: 'Issue invoice', onSelect }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Issue invoice' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not offer an overflow control when there is nothing behind it', () => {
    render(<ActionBar primary={primary} secondary={secondary} />);
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
  });

  it('names the region so it can be reached as a landmark', () => {
    render(<ActionBar primary={primary} label="Invoice actions" />);
    expect(screen.getByRole('region', { name: 'Invoice actions' })).toBeInTheDocument();
  });
});
