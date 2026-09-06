import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import type { BarAction } from './action-bar';
import { ActionBar } from './action-bar';

const fixture = storybookMoleculeStates.actionBar;

const secondary: BarAction[] = fixture.secondary.map((action) => ({
  ...action,
  onSelect: fn(),
}));

const overflow: BarAction[] = fixture.overflow.map((action) => ({
  ...action,
  onSelect: fn(),
}));

const meta = {
  title: 'Molecules/Operation states/Action Bar',
  component: ActionBar,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.actionBar),
  args: {
    label: fixture.label,
    primary: { label: fixture.primary, onSelect: fn() },
    secondary,
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({ children, evidence }: { children: React.ReactNode; evidence?: string }) {
  return (
    <div data-evidence={evidence} className="max-w-3xl">
      {children}
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Frame>
      <ActionBar {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Exactly one action carries the filled treatment; the rest stay discoverable and quieter.
    await expect(canvas.getByRole('button', { name: fixture.primary })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Preview account' })).toBeEnabled();
  },
};

export const WithStatus: Story = {
  args: { status: fixture.status },
  render: (args) => (
    <Frame>
      <ActionBar {...args} />
    </Frame>
  ),
};

/**
 * A busy primary keeps its name. A bare spinner leaves a screen-reader user with nothing to hear,
 * and hiding the other actions would strand an operator whose request is still in flight.
 */
export const Busy: Story = {
  args: {
    status: fixture.status,
    primary: { label: fixture.primary, busy: true, busyLabel: fixture.busyLabel, onSelect: fn() },
  },
  render: (args) => (
    <Frame>
      <ActionBar {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const busy = canvas.getByRole('button', { name: fixture.busyLabel });
    await expect(busy).toHaveAttribute('aria-busy', 'true');
    await expect(busy).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Preview account' })).toBeVisible();
  },
};

/**
 * A disabled control with no reason leaves the operator with nothing to act on, so the failed
 * precondition is named beside it and describes it.
 */
export const Blocked: Story = {
  args: { status: fixture.status, blockedReason: fixture.blockedReason },
  render: (args) => (
    <Frame evidence="action-bar-blocked">
      <ActionBar {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primary = canvas.getByRole('button', { name: fixture.primary });

    await expect(primary).toBeDisabled();
    await expect(primary).toHaveAccessibleDescription(fixture.blockedReason);
  },
};

export const Destructive: Story = {
  args: {
    primary: { label: fixture.destructivePrimary, destructive: true, onSelect: fn() },
    secondary: [secondary[0]],
  },
  render: (args) => (
    <Frame>
      <ActionBar {...args} />
    </Frame>
  ),
};

export const WithOverflow: Story = {
  args: { status: fixture.status, overflow },
  render: (args) => (
    <Frame>
      <ActionBar {...args} />
    </Frame>
  ),
};

/**
 * Ready, busy and blocked together. The row keeps the same shape in all three, so a state change
 * does not move the control the operator was reaching for.
 */
export const AllStates: Story = {
  render: (args) => (
    <Frame evidence="action-bar-states">
      {/*
        Each bar is labelled for its own state. Two landmarks sharing a name are indistinguishable
        to anyone navigating by region, which is why the label is a required part of the contract
        rather than a constant inside the component.
      */}
      <div className="grid gap-8">
        <ActionBar
          {...args}
          label="Invoice actions, ready"
          status={fixture.status}
          overflow={overflow}
        />
        <ActionBar
          {...args}
          label="Invoice actions, issuing"
          status={fixture.status}
          primary={{
            label: fixture.primary,
            busy: true,
            busyLabel: fixture.busyLabel,
            onSelect: fn(),
          }}
        />
        <ActionBar
          {...args}
          label="Invoice actions, blocked"
          status={fixture.status}
          blockedReason={fixture.blockedReason}
        />
      </div>
    </Frame>
  ),
};

export const ContentStress: Story = {
  args: { status: fixture.longStatus, overflow, blockedReason: fixture.blockedReason },
  render: (args) => (
    <Frame>
      <ActionBar {...args} />
    </Frame>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: { status: fixture.longStatus, overflow },
  render: (args) => (
    <div data-evidence="action-bar-narrow" className="w-full max-w-full">
      <ActionBar {...args} />
    </div>
  ),
};

/**
 * A supporting choice is reached before the consequential one, and the overflow returns focus to
 * its own trigger rather than dropping the operator at the top of the region.
 */
export const KeyboardFlow: Story = {
  args: { status: fixture.status, overflow },
  render: (args) => (
    <Frame evidence="action-bar-keyboard">
      <ActionBar {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const more = canvas.getByRole('button', { name: 'More actions' });

    await userEvent.tab();
    await expect(more).toHaveFocus();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Preview account' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Save as draft' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: fixture.primary })).toHaveFocus();

    await more.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(async () => {
      await expect(more).toHaveAttribute('aria-expanded', 'true');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(more).toHaveFocus();
    });
  },
};
