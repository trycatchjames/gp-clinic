import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NumericField, formatNumericEntry, parseNumericEntry } from './numeric-field';

describe('parseNumericEntry', () => {
  it('reads dollars and cents as whole cents rather than as a floating-point amount', () => {
    expect(parseNumericEntry('82.30', { decimals: 2 })).toBe(8230);
    expect(parseNumericEntry('1,234.56', { decimals: 2 })).toBe(123456);
    expect(parseNumericEntry('0.07', { decimals: 2 })).toBe(7);
    expect(parseNumericEntry('.5', { decimals: 2 })).toBe(50);
    expect(parseNumericEntry('19', { decimals: 2 })).toBe(1900);
  });

  it('refuses more precision than the unit carries instead of rounding it away', () => {
    expect(parseNumericEntry('82.305', { decimals: 2 })).toBeNull();
    expect(parseNumericEntry('2.5', { decimals: 0 })).toBeNull();
  });

  it('refuses a negative value unless the caller permits one', () => {
    expect(parseNumericEntry('-15.00', { decimals: 2 })).toBeNull();
    expect(parseNumericEntry('-15.00', { decimals: 2, allowNegative: true })).toBe(-1500);
  });

  it('yields nothing for text that does not describe an amount', () => {
    for (const text of ['', '  ', '8o.30', '82.30.1', '$82.30', '1e3', '--5', 'abc']) {
      expect(parseNumericEntry(text, { decimals: 2 })).toBeNull();
    }
  });

  it('round-trips through canonical text without changing the value', () => {
    for (const cents of [0, 7, 8230, -1500, 123456]) {
      expect(parseNumericEntry(formatNumericEntry(cents, 2), { decimals: 2, allowNegative: true })).toBe(
        cents,
      );
    }
    expect(formatNumericEntry(746, 1)).toBe('74.6');
    expect(formatNumericEntry(2, 0)).toBe('2');
  });
});

describe('NumericField', () => {
  const base = {
    label: 'Fee',
    decimals: 2,
    prefix: '$',
    unitLabel: 'Australian dollars',
  } as const;

  it('keeps what the operator typed and reports no value for it', () => {
    const onTextChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <NumericField
        {...base}
        text="8o.30"
        onTextChange={onTextChange}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText('Fee');
    expect(input).toHaveValue('8o.30');

    fireEvent.change(input, { target: { value: '8o.3' } });
    expect(onTextChange).toHaveBeenCalledWith('8o.3');
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('does not bring a spinner that a scroll or an arrow key could change', () => {
    render(
      <NumericField {...base} text="82.30" onTextChange={vi.fn()} onValueChange={vi.fn()} />,
    );

    const input = screen.getByLabelText('Fee');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  it('speaks the unit rather than leaving it to the adornment', () => {
    render(
      <NumericField
        {...base}
        hint="Enter dollars and cents."
        text="82.30"
        onTextChange={vi.fn()}
        onValueChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Fee')).toHaveAccessibleDescription(
      /Enter dollars and cents\. Australian dollars/,
    );
  });

  it('writes canonical text only on leaving a field that already parses', () => {
    const onTextChange = vi.fn();
    const { rerender } = render(
      <NumericField {...base} text="82.3" onTextChange={onTextChange} onValueChange={vi.fn()} />,
    );

    fireEvent.blur(screen.getByLabelText('Fee'));
    expect(onTextChange).toHaveBeenCalledWith('82.30');

    onTextChange.mockClear();
    rerender(
      <NumericField {...base} text="8o.3" onTextChange={onTextChange} onValueChange={vi.fn()} />,
    );
    fireEvent.blur(screen.getByLabelText('Fee'));
    expect(onTextChange).not.toHaveBeenCalled();
  });

  it('associates an error with the control without clearing the entry', () => {
    render(
      <NumericField
        {...base}
        text="82.305"
        error="An amount is recorded to the cent."
        onTextChange={vi.fn()}
        onValueChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Fee');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveValue('82.305');
    expect(screen.getByRole('alert')).toHaveTextContent('An amount is recorded to the cent.');
  });
});
