import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookFoundationStates } from '@/fixtures/storybook-foundation-states';
import { Button } from '@/components/ui/button';
import { StatePanel, type StatePanelKind } from './state-panel';

const fixture = storybookFoundationStates.states;
const retry = fn();

const meta = {
  title: 'Molecules/Feedback/State Panel',
  component: StatePanel,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.statePanel),
  args: {
    kind: 'empty',
    title: fixture.empty.title,
    description: fixture.empty.description,
  },
} satisfies Meta<typeof StatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
  args: { kind: 'loading', ...fixture.loading },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: fixture.loading.title }),
    ).toHaveAttribute('aria-busy', 'true');
  },
};

export const Unavailable: Story = {
  args: { kind: 'unavailable', ...fixture.unavailable },
};

export const Offline: Story = {
  args: {
    kind: 'offline',
    ...fixture.offline,
    details: 'Last updated today at 8:42 am AEST.',
  },
};

export const Restricted: Story = {
  args: { kind: 'restricted', ...fixture.restricted },
};

export const Failure: Story = {
  args: { kind: 'failure', ...fixture.failure },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('alert', { name: fixture.failure.title }),
    ).toBeVisible();
  },
};

export const WithRecovery: Story = {
  render: function RecoveryStory() {
    return (
      <StatePanel
        kind="failure"
        {...fixture.failure}
        action={<Button onClick={retry}>Try again</Button>}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Try again' });
    await userEvent.click(button);
    await expect(retry).toHaveBeenCalledOnce();
  },
};

export const Compact: Story = {
  args: { compact: true },
};

export const ContentStress: Story = {
  args: {
    kind: 'unavailable',
    title: 'The selected appointment book is temporarily unavailable',
    description:
      'The current filters and selection are preserved. Try again when the appointment service becomes available; no appointment has been created or changed.',
    details: 'Northside Demo Clinic · Consulting room with an intentionally long synthetic name',
  },
};

const allKinds = Object.entries(fixture) as Array<
  [StatePanelKind, { title: string; description: string }]
>;

export const AllStates: Story = {
  render: () => (
    <div data-evidence="storybook-state-panel-states" className="grid max-w-5xl gap-4 md:grid-cols-2">
      {allKinds.map(([kind, state]) => (
        <StatePanel key={kind} kind={kind} compact {...state} />
      ))}
    </div>
  ),
};

export const Narrow: Story = {
  ...ContentStress,
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
};
