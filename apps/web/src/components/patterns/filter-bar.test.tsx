import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '@/components/ui/input';
import { FilterBar, FilterField } from './filter-bar';

describe('FilterBar', () => {
  it('names the search region and reports the result summary politely', () => {
    render(
      <FilterBar label="Patient search" summary="2 of 2 matching">
        <FilterField label="Query" htmlFor="query">
          <Input id="query" />
        </FilterField>
      </FilterBar>,
    );

    expect(screen.getByRole('search', { name: 'Patient search' })).toBeInTheDocument();
    expect(screen.getByText('2 of 2 matching')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('FilterField', () => {
  it('keeps a hidden label as the accessible name and the hint available to assistive tech', () => {
    render(
      <FilterField
        label="Name, phone, Medicare card or record number"
        htmlFor="patient-search-query"
        hint="Try a family name or a mobile number."
        hideLabel
      >
        {(controlProps) => <Input {...controlProps} placeholder="Name, phone…" />}
      </FilterField>,
    );

    const input = screen.getByRole('textbox', { name: /Name, phone, Medicare card/ });
    const hint = screen.getByText('Try a family name or a mobile number.');

    expect(input).toHaveAttribute('id', 'patient-search-query');
    expect(input).toHaveAttribute('aria-describedby', hint.id);
    // Hidden visually, not from the accessibility tree.
    expect(screen.getByText('Name, phone, Medicare card or record number')).toHaveClass('sr-only');
  });

  it('describes the control even when the caller renders it directly', () => {
    render(
      <FilterField label="Date of birth" htmlFor="dob" hint="Narrows similar names.">
        <Input id="dob" type="date" aria-describedby="dob-description" />
      </FilterField>,
    );

    expect(screen.getByLabelText('Date of birth')).toHaveAttribute(
      'aria-describedby',
      'dob-description',
    );
  });
});
