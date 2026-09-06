import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecordComparison, type ComparisonRow } from './record-comparison';

const rows: readonly ComparisonRow[] = [
  { key: 'name', label: 'Name', left: 'Marlee Tran', right: 'Marley Tranh', status: 'differs' },
  { key: 'dob', label: 'Date of birth', left: '14/03/1988', right: '14/03/1988', status: 'same' },
  {
    key: 'allergy',
    label: 'Recorded allergies',
    left: 'Penicillin — anaphylaxis',
    right: 'No known allergies',
    status: 'conflict',
  },
  { key: 'address', label: 'Address', left: '12 Wattle Grove', right: null, status: 'differs' },
];

const sides = { leftLabel: 'Record NRT-4821', rightLabel: 'Record NRT-4822' };

describe('RecordComparison', () => {
  it('keeps every value tied to the side it came from', () => {
    render(<RecordComparison label="Potential duplicate records" {...sides} rows={rows} />);

    expect(screen.getAllByText(sides.leftLabel)).toHaveLength(rows.length);
    expect(screen.getAllByText(sides.rightLabel)).toHaveLength(rows.length);
  });

  it('names a fact one side does not hold rather than leaving a blank that reads as agreement', () => {
    render(<RecordComparison label="Potential duplicate records" {...sides} rows={rows} />);

    const address = screen.getByRole('heading', { name: 'Address' }).closest('li');
    expect(address).not.toBeNull();
    expect(within(address as HTMLElement).getByText('Not recorded')).toBeInTheDocument();
  });

  it('states each difference as a word, not only as a tint', () => {
    render(<RecordComparison label="Potential duplicate records" {...sides} rows={rows} />);

    expect(screen.getByText('Conflict')).toBeInTheDocument();
    expect(screen.getByText('Same')).toBeInTheDocument();
    expect(screen.getAllByText('Differs')).toHaveLength(2);
  });

  it('proposes no survivor', () => {
    render(
      <RecordComparison
        label="Potential duplicate records"
        {...sides}
        rows={rows.map((row) =>
          row.status === 'same'
            ? row
            : { ...row, choice: { value: null, onChange: vi.fn() } },
        )}
      />,
    );

    for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
  });

  it('reports one fact’s decision without touching another', () => {
    const onChange = vi.fn();
    render(
      <RecordComparison
        label="Potential duplicate records"
        {...sides}
        rows={[
          { ...rows[0], choice: { value: null, onChange } },
          { ...rows[2], choice: { value: null, onChange: vi.fn() } },
        ]}
      />,
    );

    const name = screen.getByRole('radiogroup', { name: 'Name' });
    fireEvent.click(within(name).getByRole('radio', { name: `Keep ${sides.leftLabel}` }));

    expect(onChange).toHaveBeenCalledWith('left');
    const allergy = screen.getByRole('radiogroup', { name: 'Recorded allergies' });
    for (const radio of within(allergy).getAllByRole('radio')) expect(radio).not.toBeChecked();
  });

  it('offers keeping both only where the caller permits it', () => {
    render(
      <RecordComparison
        label="Potential duplicate records"
        {...sides}
        rows={[
          { ...rows[0], choice: { value: null, onChange: vi.fn() } },
          { ...rows[3], choice: { value: null, onChange: vi.fn(), allowBoth: true } },
        ]}
      />,
    );

    expect(
      within(screen.getByRole('radiogroup', { name: 'Name' })).queryByRole('radio', {
        name: 'Keep both',
      }),
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('radiogroup', { name: 'Address' })).getByRole('radio', {
        name: 'Keep both',
      }),
    ).toBeInTheDocument();
  });
});
