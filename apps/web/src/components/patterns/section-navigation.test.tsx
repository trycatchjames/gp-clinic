import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SectionNavigation, type NavigationSection } from './section-navigation';

const sections: readonly NavigationSection[] = [
  { key: 'overview', label: 'Overview', href: '#overview' },
  { key: 'timeline', label: 'Timeline', href: '#timeline' },
  { key: 'observations', label: 'Observations', href: '#observations', count: 0 },
  { key: 'recalls', label: 'Recalls and tasks', href: '#recalls', count: 2, attention: true },
];

describe('SectionNavigation', () => {
  it('marks the current section as a location rather than a selected tab', () => {
    render(
      <SectionNavigation
        label="Patient record sections"
        sections={sections}
        currentKey="timeline"
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Patient record sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows a zero count rather than omitting it', () => {
    render(
      <SectionNavigation label="Patient record sections" sections={sections} currentKey="timeline" />,
    );

    // "Nothing there" and "not counted" are different claims, and only one is safe to skip.
    expect(screen.getByRole('link', { name: 'Observations, 0 items' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
  });

  it('puts a count and an attention flag into the section’s accessible name', () => {
    render(
      <SectionNavigation label="Patient record sections" sections={sections} currentKey="timeline" />,
    );

    expect(
      screen.getByRole('link', { name: 'Recalls and tasks, 2 items, needs attention' }),
    ).toBeInTheDocument();
  });

  it('reports navigation to the caller instead of deciding it', () => {
    const onNavigate = vi.fn();
    render(
      <SectionNavigation
        label="Patient record sections"
        sections={sections}
        currentKey="timeline"
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate.mock.calls[0][0]).toMatchObject({ key: 'overview' });
    // The current section has not moved: only the caller can change where the operator is.
    expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders only the sections the caller supplies', () => {
    render(
      <SectionNavigation
        label="Patient record sections"
        sections={sections.slice(0, 2)}
        currentKey="timeline"
      />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByRole('link', { name: /Recalls/ })).not.toBeInTheDocument();
  });
});
