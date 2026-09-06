import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import type { ItemisedPreviewItem, ItemisedResultItem } from './itemised-outcome';
import { ItemisedOutcome } from './itemised-outcome';

const fixture = storybookMoleculeStates.itemised;
const noun = fixture.noun as unknown as readonly [string, string];
const [first, second, third, fourth, fifth, sixth] = fixture.names;

const preview: readonly ItemisedPreviewItem[] = fixture.names.map((name, index) => ({
  key: `preview-${index}`,
  name,
  status: 'ready',
}));

const previewBlocked: readonly ItemisedPreviewItem[] = preview.map((item, index) =>
  index === 3 ? { ...item, status: 'blocked', detail: fixture.blockedDetail } : item,
);

const applied: readonly ItemisedResultItem[] = fixture.names.map((name, index) => ({
  key: `result-${index}`,
  name,
  status: 'applied',
}));

const partialFailure: readonly ItemisedResultItem[] = [
  { key: 'result-0', name: first, status: 'applied' },
  { key: 'result-1', name: second, status: 'applied' },
  { key: 'result-2', name: third, status: 'applied' },
  {
    key: 'result-3',
    name: fourth,
    status: 'failed',
    detail: fixture.failedDetail,
    action: { label: fixture.retryLabel, onSelect: fn() },
  },
  { key: 'result-4', name: fifth, status: 'applied' },
  { key: 'result-5', name: sixth, status: 'skipped', detail: fixture.skippedDetail },
];

function Frame({ children, evidence }: { children: React.ReactNode; evidence?: string }) {
  return (
    <div data-evidence={evidence} className="max-w-2xl">
      {children}
    </div>
  );
}

/** The disclosure over the succeeded records is caller state, like every other choice here. */
function WithDisclosure({
  items,
  heading,
  evidence,
  openInitially = false,
}: {
  items: readonly ItemisedResultItem[];
  heading: string;
  evidence?: string;
  openInitially?: boolean;
}) {
  const [open, setOpen] = useState(openInitially);
  return (
    <Frame evidence={evidence}>
      <ItemisedOutcome
        phase="result"
        heading={heading}
        noun={noun}
        items={items}
        appliedDisclosure={{ open, onOpenChange: setOpen }}
      />
    </Frame>
  );
}

const meta = {
  title: 'Molecules/Operation states/Itemised Outcome',
  component: ItemisedOutcome,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.itemisedOutcome),
  args: {
    phase: 'preview',
    heading: fixture.previewHeading,
    noun,
    items: preview,
  },
} satisfies Meta<typeof ItemisedOutcome>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Before anything runs. Every record the operation would touch is named, and no outcome is claimed
 * for any of them — the type will not allow one.
 */
export const Preview: Story = {
  render: (args) => (
    <Frame evidence="itemised-preview">
      <ItemisedOutcome {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByRole('status');
    await expect(summary).toHaveTextContent(`6 ${noun[1]}`);
    await expect(summary).toHaveTextContent('6 ready');
    // A preview interrupts nobody, because nothing has happened yet.
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};

/** A record the operation cannot include is named with its reason before the operator commits. */
export const PreviewBlocked: Story = {
  args: { items: previewBlocked },
  render: (args) => (
    <Frame>
      <ItemisedOutcome {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('1 blocked');
    await expect(canvas.getByText(fixture.blockedDetail)).toBeVisible();
  },
};

/** Everything applied. The records may be put away because none of them needs anything further. */
export const Applied: Story = {
  render: () => <WithDisclosure items={applied} heading={fixture.resultHeading} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('6 done');
    await expect(canvas.getByRole('button', { name: /6 results done/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

/**
 * The reason this contract exists. Four of six results moved; the two that did not keep their name,
 * their reason and their own next step, and the summary cannot be read as complete success.
 */
export const PartialFailure: Story = {
  render: () => (
    <WithDisclosure
      items={partialFailure}
      heading={fixture.resultHeading}
      evidence="itemised-partial-failure"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByRole('alert');

    await expect(summary).toHaveTextContent('1 failed');
    await expect(summary).toHaveTextContent('1 skipped');
    await expect(summary).toHaveTextContent('4 done');
    // The failed record leads, and its recovery action sits beside it rather than in a footer.
    await expect(canvas.getByText(fixture.failedDetail)).toBeVisible();
    await expect(canvas.getByRole('button', { name: fixture.retryLabel })).toBeVisible();
  },
};

/** Nothing moved. This is a failure, not an empty list. */
export const NothingApplied: Story = {
  render: () => (
    <Frame>
      <ItemisedOutcome
        phase="result"
        heading={fixture.nothingHeading}
        noun={noun}
        items={[
          {
            key: 'result-0',
            name: first,
            status: 'failed',
            detail: fixture.failedDetail,
            action: { label: fixture.retryLabel, onSelect: fn() },
          },
          { key: 'result-1', name: second, status: 'failed', detail: fixture.failedDetail },
          { key: 'result-2', name: third, status: 'failed', detail: fixture.failedDetail },
        ]}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('3 failed');
  },
};

/**
 * Still running. The records it has not reached are counted as outstanding rather than being given
 * an outcome they have not earned.
 */
export const InProgress: Story = {
  render: () => (
    <Frame>
      <ItemisedOutcome
        phase="result"
        heading={fixture.runningHeading}
        noun={noun}
        pending={4}
        items={[
          { key: 'result-0', name: first, status: 'applied' },
          { key: 'result-1', name: second, status: 'applied' },
        ]}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByRole('status');
    await expect(summary).toHaveTextContent(`6 ${noun[1]}`);
    await expect(summary).toHaveTextContent('4 still to do');
  },
};

export const ContentStress: Story = {
  render: () => (
    <WithDisclosure
      openInitially
      heading={fixture.resultHeading}
      items={[
        {
          key: 'result-0',
          name: fifth,
          status: 'failed',
          detail: fixture.longDetail,
          action: { label: fixture.retryLabel, onSelect: fn() },
        },
        { key: 'result-1', name: fourth, status: 'skipped', detail: fixture.skippedDetail },
        { key: 'result-2', name: first, status: 'applied' },
        { key: 'result-3', name: second, status: 'applied' },
      ]}
    />
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <div data-evidence="itemised-narrow" className="w-full max-w-full">
      <ItemisedOutcome
        phase="result"
        heading={fixture.resultHeading}
        noun={noun}
        items={partialFailure}
      />
    </div>
  ),
};

/**
 * Reading order puts the records still needing a decision above the disclosure, and opening the
 * succeeded records leaves focus on the control that opened them.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <WithDisclosure
      items={partialFailure}
      heading={fixture.resultHeading}
      evidence="itemised-keyboard"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: fixture.retryLabel })).toHaveFocus();

    await userEvent.tab();
    const disclosure = canvas.getByRole('button', { name: /4 results done/ });
    await expect(disclosure).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure).toHaveFocus();
  },
};
