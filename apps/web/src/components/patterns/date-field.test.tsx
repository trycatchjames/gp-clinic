import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DateField } from './date-field';

function ControlledDateField({
  initialText = '',
  initialSelected = null,
  initialOpen = false,
  minDate,
  maxDate,
}: {
  initialText?: string;
  initialSelected?: string | null;
  initialOpen?: boolean;
  minDate?: string;
  maxDate?: string;
}) {
  const [textValue, setTextValue] = useState(initialText);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialSelected);
  const [open, setOpen] = useState(initialOpen);
  const [month, setMonth] = useState('2027-04');
  return (
    <DateField
      label="Appointment date"
      textValue={textValue}
      selectedDate={selectedDate}
      open={open}
      month={month}
      today="2027-04-02"
      minDate={minDate}
      maxDate={maxDate}
      onTextValueChange={setTextValue}
      onSelectedDateChange={setSelectedDate}
      onOpenChange={setOpen}
      onMonthChange={setMonth}
    />
  );
}

describe('DateField', () => {
  it('preserves incomplete Australian text without treating it as a selected date', () => {
    const onTextValueChange = vi.fn();
    const onSelectedDateChange = vi.fn();
    render(
      <DateField
        label="Appointment date"
        textValue="03/04/2027"
        selectedDate="2027-04-03"
        open={false}
        month="2027-04"
        today="2027-04-02"
        onTextValueChange={onTextValueChange}
        onSelectedDateChange={onSelectedDateChange}
        onOpenChange={vi.fn()}
        onMonthChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Appointment date' }), {
      target: { value: '3/4/' },
    });
    expect(onTextValueChange).toHaveBeenCalledWith('3/4/');
    expect(onSelectedDateChange).toHaveBeenCalledWith(null);
  });

  it('chooses a calendar date as ISO date-only and Australian display text', () => {
    render(<ControlledDateField initialOpen />);

    fireEvent.click(screen.getByRole('button', { name: 'Saturday 3 April 2027' }));
    expect(screen.getByRole('textbox', { name: 'Appointment date' })).toHaveValue('03/04/2027');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves by week and month without selecting until Enter', () => {
    render(<ControlledDateField initialOpen />);
    const today = screen.getByRole('button', { name: 'Friday 2 April 2027' });

    fireEvent.keyDown(today, { key: 'ArrowDown' });
    const nextWeek = screen.getByRole('button', { name: 'Friday 9 April 2027' });
    expect(nextWeek).toHaveAttribute('tabindex', '0');
    expect(nextWeek.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');

    fireEvent.keyDown(nextWeek, { key: 'PageDown' });
    expect(screen.getByRole('heading', { name: 'May 2027' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('button', { name: 'Sunday 9 May 2027' }), { key: 'Enter' });
    expect(screen.getByRole('textbox')).toHaveValue('09/05/2027');
  });

  it('marks today, selected, and unavailable days independently', () => {
    render(
      <ControlledDateField
        initialText="03/04/2027"
        initialSelected="2027-04-03"
        initialOpen
        minDate="2027-04-02"
        maxDate="2027-04-04"
      />,
    );

    expect(screen.getByRole('button', { name: 'Friday 2 April 2027' })).toHaveAttribute(
      'aria-current',
      'date',
    );
    expect(
      screen.getByRole('button', { name: 'Saturday 3 April 2027' }).closest('[role="gridcell"]'),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Monday 5 April 2027' })).toBeDisabled();
  });

  it('connects errors and prevents disabled or read-only calendar interaction', () => {
    const commonProps = {
      label: 'Appointment date',
      textValue: '31/02/27',
      selectedDate: null,
      open: false,
      month: '2027-04',
      today: '2027-04-02',
      onTextValueChange: vi.fn(),
      onSelectedDateChange: vi.fn(),
      onOpenChange: vi.fn(),
      onMonthChange: vi.fn(),
    } as const;
    const { rerender } = render(
      <DateField {...commonProps} error="Enter a complete date with a four-digit year." disabled />,
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(/four-digit year/);
    expect(screen.getByRole('button', { name: /Choose Appointment date/ })).toBeDisabled();

    rerender(<DateField {...commonProps} readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: /Choose Appointment date/ })).toBeDisabled();
  });
});
