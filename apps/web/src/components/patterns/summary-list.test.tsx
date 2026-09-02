import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryList } from './summary-list';

describe('SummaryList', () => {
  it('preserves label and value semantics at compact density', () => {
    const { container } = render(
      <SummaryList
        density="compact"
        items={[
          { label: 'Appointment', value: '9:20 am', tabular: true },
          { label: 'Practitioner', value: 'Dr Morgan Lee', supportingText: 'Room 3' },
        ]}
      />,
    );

    expect(screen.getByText('Appointment').tagName).toBe('DT');
    expect(screen.getByText('9:20 am').tagName).toBe('DD');
    expect(screen.getByText('Room 3').tagName).toBe('DD');
    expect(container.querySelector('[data-slot="summary-list"]')).toHaveAttribute(
      'data-density',
      'compact',
    );
  });
});
