import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import type { NavigationSection } from './section-navigation';
import { SectionNavigation } from './section-navigation';

const fixture = storybookMoleculeStates.sectionNav;
const sections = fixture.sections as readonly NavigationSection[];
const uncounted = sections.filter((section) => section.count === undefined);

/** Navigation is caller state: the router takes the event, the pattern reports it. */
function Routed({
  evidence,
  items = sections,
  initial = fixture.currentKey,
}: {
  evidence?: string;
  items?: readonly NavigationSection[];
  initial?: string;
}) {
  const [current, setCurrent] = useState(initial);

  return (
    <div data-evidence={evidence} className="grid gap-3">
      <SectionNavigation
        label={fixture.label}
        sections={items}
        currentKey={current}
        onNavigate={(section, event) => {
          event.preventDefault();
          setCurrent(section.key);
        }}
      />
      <p data-testid="current" className="text-muted-foreground text-xs">
        Showing: {items.find((section) => section.key === current)?.label}
      </p>
    </div>
  );
}

const meta = {
  title: 'Molecules/Navigation/Section Navigation',
  component: SectionNavigation,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.sectionNavigation),
  args: {
    label: fixture.label,
    sections,
    currentKey: fixture.currentKey,
  },
} satisfies Meta<typeof SectionNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { sections: uncounted },
  render: (args) => (
    <div className="max-w-4xl">
      <SectionNavigation {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A location, not a tab: `aria-current` rather than `aria-selected`.
    await expect(canvas.getByRole('link', { name: 'Timeline' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.queryByRole('tab')).toBeNull();
  },
};

export const WithCounts: Story = {
  render: () => (
    <div className="max-w-4xl">
      <Routed />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The count belongs to the section's name rather than sitting beside it unspoken.
    await expect(canvas.getByRole('link', { name: 'Medicines, 7 items' })).toBeVisible();
  },
};

/**
 * Every state a section can be in, in one row: current, uncounted, counted, counted zero, and
 * holding overdue work. A section needing attention carries a mark and says so in its name, not
 * only a tint.
 */
export const Attention: Story = {
  render: () => (
    // Narrower than the full workspace list so the whole row is captured rather than scrolled.
    <div data-evidence="section-nav-states" className="max-w-4xl">
      <Routed
        items={sections.filter((section) =>
          ['overview', 'timeline', 'problems', 'observations', 'recalls'].includes(section.key),
        )}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'Recalls and tasks, 2 items, needs attention' }),
    ).toBeVisible();
  },
};

/** Zero is shown as zero. "Nothing there" and "not counted" are different claims. */
export const ZeroCounts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Observations, 0 items' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Overview' })).toBeVisible();
  },
  render: (args) => (
    <div className="max-w-4xl">
      <SectionNavigation {...args} />
    </div>
  ),
};

export const ContentStress: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Routed
        items={sections.map((section) =>
          section.key === 'results' ? { ...section, label: fixture.longLabel } : section,
        )}
      />
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <div data-evidence="section-nav-narrow" className="w-full max-w-full">
      <Routed initial="recalls" />
    </div>
  ),
};

/**
 * Tab reaches each section and Enter follows it. Arrow keys deliberately do nothing: these are
 * links, and the tab model would promise a panel switch that does not happen.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="section-nav-keyboard" className="max-w-4xl">
      <Routed />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('link', { name: 'Overview' });
    const timeline = canvas.getByRole('link', { name: 'Timeline' });

    await userEvent.tab();
    await expect(overview).toHaveFocus();

    // Arrowing does not move between links, and reaching one does not follow it.
    await userEvent.keyboard('{ArrowRight}');
    await expect(overview).toHaveFocus();
    await expect(timeline).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByTestId('current')).toHaveTextContent('Showing: Timeline');

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('current')).toHaveTextContent('Showing: Overview');
    await expect(overview).toHaveAttribute('aria-current', 'page');
  },
};
