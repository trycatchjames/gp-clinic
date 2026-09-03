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

    expect(screen.getByText(/Synthetic fixture · design-system-states/)).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Quiet confidence for busy care.' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Remove draft' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(screen.getAllByText('Ready')).toHaveLength(2);
    expect(screen.getByText('Needs attention')).toBeVisible();
    expect(screen.getByText('Unavailable')).toBeVisible();
    expect(screen.getAllByText('Changes were not saved')).toHaveLength(2);
  });

  it('distinguishes context, summary and truthful data states', () => {
    render(<FoundationsRoute />);

    expect(screen.getByRole('region', { name: 'Amelia Hart' })).toHaveTextContent(
      'Identity checked',
    );
    expect(screen.getAllByText('Patient no.')[0].tagName).toBe('DT');
    expect(screen.getByRole('region', { name: 'Loading appointments' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByRole('alert', { name: 'Changes were not saved' })).toHaveAttribute(
      'data-state',
      'failure',
    );
    expect(screen.getByRole('region', { name: 'No appointments match' })).toHaveAttribute(
      'data-state',
      'empty',
    );
  });

  it('demonstrates named tabs, table data, progress and transient action triggers', () => {
    render(<FoundationsRoute />);

    expect(screen.getByRole('tab', { name: 'Today' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('table', { name: 'Synthetic appointments' })).toBeVisible();
    expect(screen.getByRole('row', { name: /9:20 am Amelia Hart Standard Ready/ })).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'Practice setup progress' })).toHaveAttribute(
      'aria-valuenow',
      '64',
    );
    expect(screen.getByRole('button', { name: 'More actions' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Review removal' })).toBeEnabled();
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
    expect(screen.getByText('Atom')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Pure pattern' })).toBeVisible();
    expect(screen.getByText('components/patterns')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Capability-connected' })).toBeVisible();
    expect(screen.getByText('features/<capability>/components')).toBeVisible();
  });

  it('demonstrates the compact filter and selectable list pattern', () => {
    render(<FoundationsRoute />);

    expect(screen.getByRole('search', { name: 'Example record search' })).toBeVisible();
    expect(screen.getByRole('list', { name: 'Example records' })).toBeVisible();
    const row = screen.getByRole('button', { name: /^Amelia Hart DOB/ });
    expect(row).toHaveAttribute('aria-pressed', 'false');
    expect(row).toHaveTextContent('Brunswick 3056');
    expect(row).toHaveTextContent('Record R000121');
  });
});
