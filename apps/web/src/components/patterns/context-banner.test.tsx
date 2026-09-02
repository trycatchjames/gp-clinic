import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContextBanner } from './context-banner';

describe('ContextBanner', () => {
  it('labels the active context and exposes its facts and actions', () => {
    render(
      <ContextBanner
        contextLabel="Current patient"
        title="Alex Nguyen"
        description="Synthetic patient context"
        status={<span>Identity checked</span>}
        facts={[
          { label: 'DOB', value: '14 May 1986', tabular: true },
          { label: 'Location', value: 'Northside' },
        ]}
        actions={<button type="button">Change patient</button>}
      />,
    );

    const region = screen.getByRole('region', { name: 'Alex Nguyen' });
    expect(region).toHaveTextContent('Current patient');
    expect(region).toHaveTextContent('Identity checked');
    expect(screen.getByText('DOB').tagName).toBe('DT');
    expect(screen.getByText('14 May 1986').tagName).toBe('DD');
    expect(screen.getByRole('button', { name: 'Change patient' })).toBeEnabled();
  });
});
