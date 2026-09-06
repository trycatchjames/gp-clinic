import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from './page-header';

const timeZone = 'Australia/Sydney';
const asOf = '2026-09-06T08:42:00+10:00';

describe('PageHeader', () => {
  it('names the screen and every scope fact it is showing', () => {
    render(
      <PageHeader
        title="Results inbox"
        level={2}
        scope={[
          { key: 'queue', label: 'Queue', value: 'Mine and covering' },
          { key: 'location', label: 'Location', value: 'Northside Demo Clinic' },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Results inbox' })).toBeInTheDocument();
    expect(screen.getByText('Queue')).toBeInTheDocument();
    expect(screen.getByText('Mine and covering')).toBeInTheDocument();
  });

  it('claims no landmark, so two headers on one screen stay distinguishable', () => {
    render(
      <>
        <PageHeader title="Results inbox" level={2} />
        <PageHeader title="Selected result" level={2} />
      </>,
    );

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
  });

  it('keeps the previous as-of visible while a refresh is in flight', () => {
    render(
      <PageHeader
        title="Results inbox"
        scope={[{ key: 'location', label: 'Location', value: 'Northside Demo Clinic' }]}
        freshness={{
          asOf,
          timeZone,
          refreshing: true,
          refresh: { label: 'Refresh', onSelect: vi.fn() },
        }}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/Refreshing\. Showing the view as at/);
    expect(screen.getByText('Northside Demo Clinic')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/ })).toBeDisabled();
  });

  it('never renders an unknown freshness as a current one', () => {
    render(
      <PageHeader title="Results inbox" freshness={{ asOf: null, timeZone }} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Freshness of this view is not known');
  });

  it('says a stale view is behind the record rather than only tinting it', () => {
    render(
      <PageHeader
        title="Results inbox"
        freshness={{ asOf, timeZone, stale: true, refresh: { label: 'Refresh', onSelect: vi.fn() } }}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('This view is behind the record');
    expect(screen.getByRole('button', { name: /Refresh/ })).toBeEnabled();
  });

  it('does not announce again when a refresh changes nothing', () => {
    const { rerender } = render(
      <PageHeader title="Results inbox" freshness={{ asOf, timeZone }} />,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Showing the view as at');

    // Re-supplying the same as-of must not re-announce: a queue left open would otherwise repeat
    // itself to a screen reader on every background poll.
    rerender(<PageHeader title="Results inbox" freshness={{ asOf, timeZone }} />);
    expect(screen.getByRole('status')).toBe(status);

    rerender(
      <PageHeader
        title="Results inbox"
        freshness={{ asOf: '2026-09-06T09:10:00+10:00', timeZone }}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('9:10 am');
  });

  it('hands the refresh back to the caller', () => {
    const onSelect = vi.fn();
    render(
      <PageHeader
        title="Results inbox"
        freshness={{ asOf, timeZone, refresh: { label: 'Refresh', onSelect } }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Refresh/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
