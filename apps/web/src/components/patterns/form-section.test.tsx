import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormSection } from './form-section';

describe('FormSection', () => {
  it('associates the description with the group rather than leaving it beside it', () => {
    render(
      <FormSection title="Identity" description="Record the name the patient uses.">
        <p>fields</p>
      </FormSection>,
    );

    expect(screen.getByRole('region', { name: 'Identity' })).toHaveAccessibleDescription(
      'Record the name the patient uses.',
    );
  });

  it('takes the heading level rather than assuming one', () => {
    render(
      <FormSection title="Previous names" level={3}>
        <p>fields</p>
      </FormSection>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Previous names' })).toBeInTheDocument();
  });

  it('marks an optional section as one a role may fill in later', () => {
    render(
      <FormSection title="Sex, gender and pronouns" optional>
        <p>fields</p>
      </FormSection>,
    );

    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('counts one outstanding problem in the singular and shows none at zero', () => {
    const { rerender } = render(
      <FormSection title="Identity" errorCount={1}>
        <p>fields</p>
      </FormSection>,
    );
    expect(screen.getByText('1 problem to correct')).toBeInTheDocument();

    rerender(
      <FormSection title="Identity" errorCount={0}>
        <p>fields</p>
      </FormSection>,
    );
    expect(screen.queryByText(/problem/)).not.toBeInTheDocument();
  });
})
