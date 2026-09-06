import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormErrorSummary } from './form-error-summary';

const errors = [
  {
    fieldId: 'family-name',
    section: 'Identity',
    label: 'Family name',
    message: 'Enter the family name you checked.',
  },
  {
    fieldId: 'contact',
    section: 'Contact and address',
    label: 'Contact number',
    message: 'Record at least one way to reach this patient.',
  },
];

describe('FormErrorSummary', () => {
  it('renders nothing when there is nothing to correct', () => {
    const { container } = render(<FormErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('counts one problem in the singular', () => {
    render(<FormErrorSummary errors={[errors[0]]} />);
    expect(
      screen.getByText('There is 1 problem to correct before this can be saved'),
    ).toBeInTheDocument();
  });

  it('names the section beside the label so an entry is a place to go', () => {
    render(<FormErrorSummary errors={errors} />);
    expect(screen.getByRole('link', { name: /^Identity: Family name/ })).toBeInTheDocument();
  });

  it('moves focus to the control an entry names', () => {
    render(
      <>
        <FormErrorSummary errors={errors} />
        <input id="contact" aria-label="Contact number" />
      </>,
    );

    fireEvent.click(screen.getByRole('link', { name: /^Contact and address: Contact number/ }));
    expect(screen.getByLabelText('Contact number')).toHaveFocus();
  });

  it('announces through a live region when the caller does not manage focus', () => {
    render(<FormErrorSummary errors={errors} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('takes focus for a reported attempt instead of announcing twice', () => {
    const { rerender } = render(<FormErrorSummary errors={errors} attempt={1} />);

    const summary = screen.getByRole('group');
    expect(summary).toHaveFocus();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // A second failing submit is reported again; silence would read as success.
    summary.blur();
    rerender(<FormErrorSummary errors={errors} attempt={2} />);
    expect(screen.getByRole('group')).toHaveFocus();
  });
});
