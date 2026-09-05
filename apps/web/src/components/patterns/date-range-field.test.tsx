import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { DateBoundaryState } from './date-range-field';
import { DateRangeField } from './date-range-field';

const emptyBoundary: DateBoundaryState = {
  textValue: '',
  selectedDate: null,
  open: false,
  month: '2027-04',
};

function ControlledRange() {
  const [start, setStart] = useState<DateBoundaryState>({ ...emptyBoundary, open: true });
  const [end, setEnd] = useState<DateBoundaryState>({
    ...emptyBoundary,
    textValue: '10/04/2027',
    selectedDate: '2027-04-10',
  });
  const callbacks = (setBoundary: typeof setStart) => ({
    onTextValueChange: (textValue: string) => setBoundary((value) => ({ ...value, textValue })),
    onSelectedDateChange: (selectedDate: string | null) =>
      setBoundary((value) => ({ ...value, selectedDate })),
    onOpenChange: (open: boolean) => setBoundary((value) => ({ ...value, open })),
    onMonthChange: (month: string) => setBoundary((value) => ({ ...value, month })),
  });
  return (
    <DateRangeField
      label="Availability search dates"
      hint="Search within this date range."
      today="2027-04-02"
      start={start}
      end={end}
      startCallbacks={callbacks(setStart)}
      endCallbacks={callbacks(setEnd)}
    />
  );
}

describe('DateRangeField', () => {
  it('groups two independently labelled date boundaries', () => {
    render(<ControlledRange />);
    const group = screen.getByRole('group', { name: 'Availability search dates' });
    expect(group).toHaveAccessibleDescription('Search within this date range.');
    expect(screen.getByRole('textbox', { name: 'Start date' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'End date' })).toBeInTheDocument();
  });

  it('calendar selection changes only the chosen boundary', () => {
    render(<ControlledRange />);
    fireEvent.click(screen.getByRole('button', { name: 'Saturday 3 April 2027' }));

    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('03/04/2027');
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('10/04/2027');
  });

  it('preserves incomplete text on one boundary without changing the other', () => {
    render(<ControlledRange />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Start date' }), {
      target: { value: '3/4/' },
    });
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('3/4/');
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('10/04/2027');
  });

  it('associates boundary errors and a non-destructive group error precisely', () => {
    const callbacks = {
      onTextValueChange: vi.fn(),
      onSelectedDateChange: vi.fn(),
      onOpenChange: vi.fn(),
      onMonthChange: vi.fn(),
    };
    render(
      <DateRangeField
        label="Availability search dates"
        error="End date must be on or after start date."
        endError="Choose a later end date."
        today="2027-04-02"
        start={{ ...emptyBoundary, textValue: '10/04/2027', selectedDate: '2027-04-10' }}
        end={{ ...emptyBoundary, textValue: '03/04/2027', selectedDate: '2027-04-03' }}
        startCallbacks={callbacks}
        endCallbacks={callbacks}
      />,
    );

    expect(screen.getByRole('group')).toHaveAccessibleDescription(/End date must be/);
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveAccessibleDescription(
      /Choose a later end date/,
    );
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('10/04/2027');
  });

  it('disables the whole group while keeping read-only boundaries readable', () => {
    const callbacks = {
      onTextValueChange: vi.fn(),
      onSelectedDateChange: vi.fn(),
      onOpenChange: vi.fn(),
      onMonthChange: vi.fn(),
    };
    const common = {
      label: 'Availability search dates',
      today: '2027-04-02',
      start: emptyBoundary,
      end: emptyBoundary,
      startCallbacks: callbacks,
      endCallbacks: callbacks,
    } as const;
    const { rerender } = render(<DateRangeField {...common} disabled />);
    expect(screen.getByRole('textbox', { name: 'Start date' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'End date' })).toBeDisabled();

    rerender(<DateRangeField {...common} readOnly />);
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveAttribute('readonly');
  });
});
