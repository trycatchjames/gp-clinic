import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { SummaryList } from './summary-list';

const fixture = storybookMoleculeStates.summaryList;

const meta = {
  title: 'Molecules/Data display/Summary List',
  component: SummaryList,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.summaryList),
  args: {
    items: fixture.account,
    className: 'max-w-3xl',
  },
} satisfies Meta<typeof SummaryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneColumn: Story = {
  args: { columns: 1, items: fixture.withSupport, className: 'max-w-md' },
};

export const ThreeColumns: Story = {
  args: { columns: 3, items: fixture.numeric, className: 'max-w-4xl' },
};

export const Compact: Story = {
  render: () => (
    <section
      data-evidence="summary-list-density"
      aria-label="Summary list density"
      className="grid max-w-3xl gap-4"
    >
      <div className="grid gap-1.5">
        <p className="text-muted-foreground text-xs">Comfortable</p>
        <SummaryList items={fixture.account} />
      </div>
      <div className="grid gap-1.5">
        <p className="text-muted-foreground text-xs">Compact</p>
        <SummaryList items={fixture.account} density="compact" />
      </div>
    </section>
  ),
};

/**
 * Zero, missing, unknown and unavailable are four different facts and the caller supplies each one
 * in words. A blank cell would let "we hold no concession" and "the claiming service is down" look
 * identical.
 */
export const MissingAndUnknown: Story = {
  args: { items: fixture.missingAndUnknown },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('$0.00')).toBeVisible();
    await expect(canvas.getByText('No payments recorded')).toBeVisible();
    await expect(canvas.getByText('Not recorded')).toBeVisible();
    await expect(canvas.getByText(/^Unknown/)).toBeVisible();
    await expect(canvas.getByText(/^Unavailable/)).toBeVisible();
  },
};

/**
 * Money and counts use tabular figures so the digits line up down the column and two amounts can
 * be compared at a glance.
 */
export const NumericValues: Story = {
  args: { items: fixture.numeric, columns: 3, className: 'max-w-4xl' },
};

export const ContentStress: Story = {
  render: () => (
    <section
      data-evidence="summary-list-content-stress"
      aria-label="Summary list content stress"
      className="max-w-3xl"
    >
      <SummaryList items={fixture.contentStress} />
    </section>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: { items: fixture.contentStress, className: undefined },
};
