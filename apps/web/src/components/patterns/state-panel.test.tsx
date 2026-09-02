import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatePanel } from './state-panel';

describe('StatePanel', () => {
  it('announces loading without presenting a completed empty state', () => {
    render(<StatePanel kind="loading" title="Loading appointments" description="Checking the current book." />);

    const panel = screen.getByRole('region', { name: 'Loading appointments' });
    expect(panel).toHaveAttribute('aria-busy', 'true');
    expect(panel).toHaveAttribute('data-state', 'loading');
  });

  it('announces failure and keeps its recovery action available', () => {
    render(
      <StatePanel
        kind="failure"
        title="Appointments unavailable"
        description="The appointment book could not be loaded."
        action={<button type="button">Try again</button>}
      />,
    );

    expect(screen.getByRole('alert', { name: 'Appointments unavailable' })).toHaveAttribute(
      'data-state',
      'failure',
    );
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
  });
});
