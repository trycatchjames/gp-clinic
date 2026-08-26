import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('presents the outcome and recovery action', () => {
    render(<EmptyState title="No patients found" description="Try another identifier." action={<button>Clear search</button>} />);
    expect(screen.getByText('No patients found')).toBeVisible();
    expect(screen.getByText('Try another identifier.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeEnabled();
  });
});
