import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import type { TimelineEntry } from './record-timeline';
import { RecordTimeline } from './record-timeline';

const fixture = storybookMoleculeStates.timeline;
const entries = fixture.entries as readonly TimelineEntry[];

const meta = {
  title: 'Molecules/Data display/Record Timeline',
  component: RecordTimeline,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.recordTimeline),
  args: {
    label: fixture.label,
    timeZone: fixture.timeZone,
    entries: entries.slice(0, 2),
  },
} satisfies Meta<typeof RecordTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({ children, evidence }: { children: React.ReactNode; evidence?: string }) {
  return (
    <div data-evidence={evidence} className="max-w-2xl">
      {children}
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Frame>
      <RecordTimeline {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Entries in the same day sit under one date heading rather than repeating it.
    await expect(canvas.getByRole('heading', { name: '4 September 2026' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
  },
};

/**
 * An entry recorded days after it applied. Showing one time would let a late entry read as though
 * it happened when it was written down.
 */
export const LateEntry: Story = {
  args: { entries: [entries[2]] },
  render: (args) => (
    <Frame>
      <RecordTimeline {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: '28 August 2026' })).toBeVisible();
    await expect(canvas.getByText(/Recorded 02\/09\/2026/)).toBeVisible();
  },
};

/** Both halves of an amendment chain name the other, so neither can be read alone. */
export const AmendmentChain: Story = {
  args: { entries: entries.slice(3, 5) },
  render: (args) => (
    <Frame evidence="timeline-amendment">
      <RecordTimeline {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Amended since')).toBeVisible();
    await expect(canvas.getByText('Amendment')).toBeVisible();
    await expect(canvas.getByText(/The original text is unchanged/)).toBeVisible();
  },
};

/** A withdrawn entry keeps its place. A gap in a timeline is a different claim from a withdrawal. */
export const EnteredInError: Story = {
  args: { entries: entries.slice(4) },
  render: (args) => (
    <Frame>
      <RecordTimeline {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Entered in error')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
  },
};

export const WithActions: Story = {
  args: {
    entries: entries.map((entry) => ({
      ...entry,
      action: { label: fixture.actionLabel, onSelect: fn() },
    })),
  },
  render: (args) => (
    <Frame evidence="timeline-entries">
      <RecordTimeline {...args} />
    </Frame>
  ),
};

export const ContentStress: Story = {
  args: {
    entries: [{ ...entries[0], summary: fixture.longSummary }, entries[2], entries[5]],
  },
  render: (args) => (
    <Frame>
      <RecordTimeline {...args} />
    </Frame>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: {
    entries: [{ ...entries[2], summary: fixture.longSummary }, entries[3], entries[4]],
  },
  render: (args) => (
    <div data-evidence="timeline-narrow" className="w-full max-w-full">
      <RecordTimeline {...args} />
    </div>
  ),
};

/**
 * An entry is inert unless the caller attaches an action, so reading the timeline cannot change it.
 * Where an action exists it follows the entry it belongs to.
 */
export const KeyboardFlow: Story = {
  args: {
    entries: entries.slice(0, 3).map((entry) => ({
      ...entry,
      action: { label: fixture.actionLabel, onSelect: fn() },
    })),
  },
  render: (args) => (
    <Frame evidence="timeline-keyboard">
      <RecordTimeline {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actions = canvas.getAllByRole('button', { name: fixture.actionLabel });

    await userEvent.tab();
    await expect(actions[0]).toHaveFocus();
    await userEvent.tab();
    await expect(actions[1]).toHaveFocus();

    // Reaching an entry changes nothing about it.
    await expect(canvas.queryByText('Amended since')).toBeNull();
  },
};
