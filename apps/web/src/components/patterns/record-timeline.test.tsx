import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecordTimeline, type TimelineEntry } from './record-timeline';

const timeZone = 'Australia/Sydney';

const entries: readonly TimelineEntry[] = [
  {
    key: 'a',
    effectiveAt: '2026-09-04T09:20:00+10:00',
    type: 'Consultation note',
    author: 'Dr Rowena Aspinall',
    summary: 'Sore throat and fever for three days.',
  },
  {
    key: 'b',
    effectiveAt: '2026-09-04T09:35:00+10:00',
    type: 'Observation',
    author: 'Jules Ferreira-Whitcombe',
    summary: 'Temperature 37.8 °C',
  },
  {
    key: 'c',
    effectiveAt: '2026-08-28T14:05:00+10:00',
    recordedAt: '2026-09-02T08:12:00+10:00',
    type: 'Home visit note',
    author: 'Dr Aroha Duong',
    summary: 'Reviewed at home after discharge.',
  },
];

describe('RecordTimeline', () => {
  it('groups entries under the day they applied in the supplied timezone', () => {
    render(<RecordTimeline label="Record timeline" entries={entries} timeZone={timeZone} />);

    const september = screen.getByRole('heading', { name: '4 September 2026' });
    const august = screen.getByRole('heading', { name: '28 August 2026' });
    expect(september).toBeInTheDocument();
    expect(august).toBeInTheDocument();
    expect(screen.getAllByRole('list')).toHaveLength(2);
  });

  it('names the recorded time when it differs, so a late entry cannot read as a contemporaneous one', () => {
    render(<RecordTimeline label="Record timeline" entries={entries} timeZone={timeZone} />);

    expect(screen.getByText(/Recorded 02\/09\/2026/)).toBeInTheDocument();
    // The two entries recorded as they happened say nothing about a recorded time.
    expect(screen.getAllByText(/Recorded /)).toHaveLength(1);
  });

  it('takes the day from the supplied zone rather than the viewer’s', () => {
    // 11:30 pm in Perth on 4 September is already 5 September in Sydney.
    const lateEvening: TimelineEntry = {
      key: 'd',
      effectiveAt: '2026-09-04T23:30:00+08:00',
      type: 'Telephone note',
      author: 'Dr Aroha Duong',
      summary: 'Called after hours.',
    };

    const { rerender } = render(
      <RecordTimeline label="Record timeline" entries={[lateEvening]} timeZone="Australia/Perth" />,
    );
    expect(screen.getByRole('heading', { name: '4 September 2026' })).toBeInTheDocument();

    rerender(
      <RecordTimeline label="Record timeline" entries={[lateEvening]} timeZone="Australia/Sydney" />,
    );
    expect(screen.getByRole('heading', { name: '5 September 2026' })).toBeInTheDocument();
  });

  it('keeps a withdrawn entry in its place and says what it is', () => {
    render(
      <RecordTimeline
        label="Record timeline"
        timeZone={timeZone}
        entries={[
          { ...entries[0], status: 'entered-in-error', chain: 'Marked entered in error.' },
          entries[1],
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Entered in error')).toBeInTheDocument();
    expect(screen.getByText('Marked entered in error.')).toBeInTheDocument();
  });

  it('names both halves of an amendment chain', () => {
    render(
      <RecordTimeline
        label="Record timeline"
        timeZone={timeZone}
        entries={[
          { ...entries[0], status: 'amended', chain: 'Amended on 22 August 2026.' },
          { ...entries[1], status: 'amendment', chain: 'Amends the note of 20 August 2026.' },
        ]}
      />,
    );

    expect(screen.getByText('Amended since')).toBeInTheDocument();
    expect(screen.getByText('Amendment')).toBeInTheDocument();
  });

  it('leaves an entry inert unless the caller attaches an action', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <RecordTimeline label="Record timeline" entries={[entries[0]]} timeZone={timeZone} />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <RecordTimeline
        label="Record timeline"
        timeZone={timeZone}
        entries={[{ ...entries[0], action: { label: 'Open entry', onSelect } }]}
      />,
    );

    const entry = within(screen.getByRole('list')).getByRole('listitem');
    fireEvent.click(within(entry).getByRole('button', { name: 'Open entry' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
