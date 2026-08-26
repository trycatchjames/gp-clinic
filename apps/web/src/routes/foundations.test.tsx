import { cleanup, render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { FoundationsRoute } from './foundations';

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterAll(() => vi.unstubAllGlobals());
afterEach(cleanup);

describe('FoundationsRoute', () => {
  it('renders the named synthetic fixture and meaningful foundation states', () => {
    render(<FoundationsRoute />);

    expect(screen.getByText('Synthetic fixture · design-system-states')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Remove draft' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(screen.getByText('Ready')).toBeVisible();
    expect(screen.getByText('Needs attention')).toBeVisible();
    expect(screen.getByText('Unavailable')).toBeVisible();
    expect(screen.getByText('Changes were not saved')).toBeVisible();
  });

  it('exposes labelled, described, invalid and disabled form states', () => {
    render(<FoundationsRoute />);

    const labelledInput = screen.getByRole('textbox', { name: /Workspace label/ });
    const invalidInput = screen.getByRole('textbox', { name: 'Notification email' });
    const disabledInput = screen.getByRole('textbox', { name: 'Default location' });

    expect(labelledInput).toHaveAttribute('aria-describedby', 'workspace-label-description');
    expect(invalidInput).toHaveAttribute('aria-invalid', 'true');
    expect(invalidInput).toHaveAttribute('aria-errormessage', 'notification-email-error');
    expect(disabledInput).toBeDisabled();
    expect(screen.getByText(/Unavailable while this fixture is locked/)).toBeVisible();
  });

  it('documents all three component ownership layers', () => {
    render(<FoundationsRoute />);

    expect(screen.getByRole('heading', { name: 'Primitive' })).toBeVisible();
    expect(screen.getByText('components/ui')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Pure pattern' })).toBeVisible();
    expect(screen.getByText('components/patterns')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Capability-connected' })).toBeVisible();
    expect(screen.getByText('features/<capability>/components')).toBeVisible();
  });
});
