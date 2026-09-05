import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { ComboboxOption } from './combobox-field';
import { ComboboxField } from './combobox-field';

const options: ComboboxOption[] = [
  { value: 'one', label: 'First service', detail: 'General practice' },
  { value: 'disabled', label: 'Unavailable service', disabled: true },
  { value: 'two', label: 'Second service', detail: 'Allied health' },
];

function ControlledCombobox({ onSelection }: { onSelection: (value: string | null) => void }) {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <ComboboxField
      label="Referral recipient"
      query={query}
      value={value}
      open={open}
      options={options}
      onQueryChange={setQuery}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        onSelection(nextValue);
      }}
      onOpenChange={setOpen}
    />
  );
}

describe('ComboboxField', () => {
  it('moves the active option without selecting and skips disabled options', () => {
    const onSelection = vi.fn();
    render(<ControlledCombobox onSelection={onSelection} />);
    const input = screen.getByRole('combobox', { name: 'Referral recipient' });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-activedescendant');
    expect(screen.getByRole('option', { name: /First service/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: /Second service/ })).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(onSelection).not.toHaveBeenCalled();
  });

  it('selects only after Enter and returns the chosen label to the input', () => {
    const onSelection = vi.fn();
    render(<ControlledCombobox onSelection={onSelection} />);
    const input = screen.getByRole('combobox', { name: 'Referral recipient' });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelection).toHaveBeenCalledWith('one');
    expect(input).toHaveValue('First service');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveFocus();
  });

  it('clears a mismatched selected value when the query changes', () => {
    const onValueChange = vi.fn();
    render(
      <ComboboxField
        label="Referral recipient"
        query="First service"
        value="one"
        open={false}
        options={options}
        onQueryChange={vi.fn()}
        onValueChange={onValueChange}
        onOpenChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Different' } });
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('keeps empty and failed results semantically distinct', () => {
    const commonProps = {
      label: 'Referral recipient',
      query: 'respiratory',
      value: null,
      open: true,
      options,
      onQueryChange: vi.fn(),
      onValueChange: vi.fn(),
      onOpenChange: vi.fn(),
    } as const;
    const { rerender } = render(
      <ComboboxField {...commonProps} status="empty" statusText="No matching recipients." />,
    );
    expect(screen.getByRole('listbox', { name: 'Referral recipient options' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No matching recipients.');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(
      <ComboboxField {...commonProps} status="failure" statusText="Recipient search failed." />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Recipient search failed.');
    expect(screen.queryByText('No matching recipients.')).not.toBeInTheDocument();
  });

  it('associates invalid state and disables interaction', () => {
    const onOpenChange = vi.fn();
    render(
      <ComboboxField
        label="Referral recipient"
        error="Choose a recipient."
        disabled
        query=""
        value={null}
        open={false}
        options={options}
        onQueryChange={vi.fn()}
        onValueChange={vi.fn()}
        onOpenChange={onOpenChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Referral recipient' });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Choose a recipient/);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
