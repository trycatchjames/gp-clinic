import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import type { PageHeaderAction, PageScopeFact } from './page-header';
import { PageHeader } from './page-header';

const fixture = storybookMoleculeStates.pageHeader;
const scope = fixture.scope as readonly PageScopeFact[];
const actions: PageHeaderAction[] = fixture.actions.map((action) => ({
  ...action,
  onSelect: fn(),
}));

const meta = {
  title: 'Molecules/Context/Page Header',
  component: PageHeader,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.pageHeader),
  args: {
    title: fixture.title,
    level: 2,
    description: fixture.description,
    scope,
    actions,
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({ children, evidence }: { children: React.ReactNode; evidence?: string }) {
  return (
    <div data-evidence={evidence} className="max-w-4xl">
      {children}
    </div>
  );
}

export const Default: Story = {
  args: { scope: undefined, actions: undefined },
  render: (args) => (
    <Frame>
      <PageHeader {...args} />
    </Frame>
  ),
};

export const WithScope: Story = {
  args: {
    freshness: { asOf: fixture.asOf, timeZone: fixture.timeZone },
  },
  render: (args) => (
    <Frame>
      <PageHeader {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: fixture.title })).toBeVisible();
    // The sentence appears twice by design: once visibly and once in the live region.
    await expect(canvas.getAllByText(/Showing the view as at 06\/09\/2026/)).toHaveLength(2);
    // Every scope fact keeps its own label, so one that is not supplied is visibly absent.
    await expect(canvas.getByText('Northside Demo Clinic')).toBeVisible();
  },
};

/** A reload keeps the previous scope and as-of on screen rather than blanking them. */
export const Refreshing: Story = {
  args: {
    freshness: {
      asOf: fixture.asOf,
      timeZone: fixture.timeZone,
      refreshing: true,
      refresh: { label: fixture.refreshLabel, onSelect: fn() },
    },
  },
  render: (args) => (
    <Frame>
      <PageHeader {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(/Refreshing\. Showing the view as at/)).toHaveLength(2);
    await expect(canvas.getByText('Northside Demo Clinic')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Refresh/ })).toBeDisabled();
  },
};

/** The caller has decided the view is behind the record. It says so where the operator acts. */
export const Stale: Story = {
  args: {
    freshness: {
      asOf: fixture.staleAsOf,
      timeZone: fixture.timeZone,
      stale: true,
      refresh: { label: fixture.refreshLabel, onSelect: fn() },
    },
  },
  render: (args) => (
    <Frame evidence="page-header-stale">
      <PageHeader {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(/This view is behind the record/)).toHaveLength(2);
    await expect(canvas.getByRole('button', { name: /Refresh/ })).toBeEnabled();
  },
};

/** Not knowing how fresh a view is must never be rendered as it being current. */
export const UnknownFreshness: Story = {
  args: {
    freshness: {
      asOf: null,
      timeZone: fixture.timeZone,
      refresh: { label: fixture.refreshLabel, onSelect: fn() },
    },
  },
  render: (args) => (
    <Frame>
      <PageHeader {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText('Freshness of this view is not known')).toHaveLength(2);
  },
};

/** Current, refreshing, stale and not known, in one sheet. */
export const AllStates: Story = {
  render: (args) => (
    <Frame evidence="page-header-states">
      <div className="grid gap-8">
        <PageHeader
          {...args}
          title={`${fixture.title}, current`}
          freshness={{ asOf: fixture.asOf, timeZone: fixture.timeZone }}
        />
        <PageHeader
          {...args}
          title={`${fixture.title}, refreshing`}
          freshness={{
            asOf: fixture.asOf,
            timeZone: fixture.timeZone,
            refreshing: true,
            refresh: { label: fixture.refreshLabel, onSelect: fn() },
          }}
        />
        <PageHeader
          {...args}
          title={`${fixture.title}, behind the record`}
          freshness={{
            asOf: fixture.staleAsOf,
            timeZone: fixture.timeZone,
            stale: true,
            refresh: { label: fixture.refreshLabel, onSelect: fn() },
          }}
        />
        <PageHeader
          {...args}
          title={`${fixture.title}, freshness unknown`}
          freshness={{ asOf: null, timeZone: fixture.timeZone }}
        />
      </div>
    </Frame>
  ),
};

export const ContentStress: Story = {
  args: {
    title: fixture.longTitle,
    scope: [
      { key: 'queue', label: 'Queue', value: fixture.longScopeValue },
      ...scope.slice(1),
    ],
    freshness: {
      asOf: fixture.staleAsOf,
      timeZone: fixture.timeZone,
      stale: true,
      refresh: { label: fixture.refreshLabel, onSelect: fn() },
    },
  },
  render: (args) => (
    <Frame>
      <PageHeader {...args} />
    </Frame>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: {
    title: fixture.longTitle,
    freshness: {
      asOf: fixture.staleAsOf,
      timeZone: fixture.timeZone,
      stale: true,
      refresh: { label: fixture.refreshLabel, onSelect: fn() },
    },
  },
  render: (args) => (
    <div data-evidence="page-header-narrow" className="w-full max-w-full">
      <PageHeader {...args} />
    </div>
  ),
};

/**
 * A refresh that changes nothing does not announce again, and refreshing moves no focus. A queue
 * left open on a wall screen must not turn into a screen reader repeating itself.
 */
export const KeyboardFlow: Story = {
  render: function KeyboardStory(args) {
    const [refreshing, setRefreshing] = useState(false);
    const [count, setCount] = useState(0);

    return (
      <Frame evidence="page-header-keyboard">
        <PageHeader
          {...args}
          freshness={{
            asOf: fixture.asOf,
            timeZone: fixture.timeZone,
            refreshing,
            refresh: {
              label: fixture.refreshLabel,
              onSelect: () => {
                setRefreshing(true);
                setCount((current) => current + 1);
                setRefreshing(false);
              },
            },
          }}
        />
        <p data-testid="refreshes" className="text-muted-foreground mt-3 text-xs tabular-nums">
          Refreshes requested: {count}
        </p>
      </Frame>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const refresh = canvas.getByRole('button', { name: /Refresh/ });

    refresh.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('refreshes')).toHaveTextContent('Refreshes requested: 1');
    // The control the operator used still has focus after the view reloads.
    await expect(refresh).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('refreshes')).toHaveTextContent('Refreshes requested: 2');
    await expect(refresh).toHaveFocus();
  },
};
