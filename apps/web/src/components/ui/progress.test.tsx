import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './progress';

describe('Progress', () => {
  it('exposes its current value to assistive technology', () => {
    render(<Progress aria-label="Practice setup" value={64} />);

    expect(screen.getByRole('progressbar', { name: 'Practice setup' })).toHaveAttribute(
      'aria-valuenow',
      '64',
    );
  });
});
