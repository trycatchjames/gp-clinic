import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { TimeFieldOption } from './time-field';
import { TimeField } from './time-field';

const options: TimeFieldOption[] = [
  { value: '09:00', label: '9:00 am' },
  { value: '09:15', label: '9:15 am', disabled: true, detail: 'Unavailable' },
  { value: '09:30', label: '9:30 am' },
];

function ControlledTimeField() {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <TimeField
      label="Appointment start time"
      hourCycle="h12"
      timeZoneLabel="Australia/Brisbane (AEST)"
      query={query}
      value={value}
      open={open}
      options={options}
      onQueryChange={setQuery}
      onValueChange={setValue}
      onOpenChange={setOpen}
    />
  );
}

describe('TimeField', () => {
  it('associates configured clock and timezone context with the field', () => {
    render(<ControlledTimeField />);
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
      '12-hour time · Timezone: Australia/Brisbane (AEST)',
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'e.g. 9:30 am');
  });

  it('preserves incomplete text and clears a mismatched canonical value', () => {
    const onQueryChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <TimeField
        label="Appointment start time"
        hourCycle="h12"
        timeZoneLabel="Australia/Brisbane (AEST)"
        query="9:00 am"
        value="09:00"
        open={false}
        options={options}
        onQueryChange={onQueryChange}
        onValueChange={onValueChange}
        onOpenChange={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '9:' } });
    expect(onQueryChange).toHaveBeenCalledWith('9:');
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('skips unavailable times and selects only after Enter', () => {
    render(<ControlledTimeField />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: '9:30 am' })).toHaveAttribute('data-active', 'true');
    expect(input).toHaveValue('');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('9:30 am');
  });

  it('supports 24-hour entry copy without converting the selected local value', () => {
    render(
      <TimeField
        label="Appointment start time"
        hourCycle="h23"
        timeZoneLabel="Australia/Melbourne (AEDT)"
        query="13:30"
        value="13:30"
        open={false}
        options={[{ value: '13:30', label: '13:30' }]}
        onQueryChange={vi.fn()}
        onValueChange={vi.fn()}
        onOpenChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveValue('13:30');
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(/24-hour time/);
  });

  it('keeps loading, failure, error, and disabled semantics explicit', () => {
    const common = {
      label: 'Appointment start time',
      hourCycle: 'h12' as const,
      timeZoneLabel: 'Australia/Brisbane (AEST)',
      query: '9:',
      value: null,
      open: true,
      options,
      onQueryChange: vi.fn(),
      onValueChange: vi.fn(),
      onOpenChange: vi.fn(),
    };
    const { rerender } = render(
      <TimeField {...common} status="loading" statusText="Loading time choices…" />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading time choices…');

    rerender(
      <TimeField {...common} status="failure" statusText="Time choices failed to load." />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Time choices failed to load.');

    rerender(<TimeField {...common} open={false} error="Enter a complete local time." disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(/complete local time/);
  });
});
