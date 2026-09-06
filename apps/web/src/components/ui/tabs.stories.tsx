import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const fixture = storybookAtomStates.tabs;

const meta = {
  title: 'Atoms/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.tabs),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

type Item = { value: string; label: string; body?: string; disabled?: boolean };

function RecordTabs({
  items = fixture.items,
  defaultValue = fixture.items[0].value,
  className,
}: {
  items?: readonly Item[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue} className={className}>
      <TabsList aria-label={fixture.label}>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="rounded-lg border p-4 text-sm">
          {item.body ?? item.label}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export const Default: Story = {
  render: () => (
    <section data-evidence="tabs-states" aria-label="Tabs states" className="max-w-2xl">
      <RecordTabs />
    </section>
  ),
};

/**
 * Tabs switch a view; they are not navigation and they do not save. A tab that the current role
 * cannot open stays visible and disabled so the operator knows the section exists.
 */
export const Controlled: Story = {
  render: () => <RecordTabs defaultValue="results" className="max-w-2xl" />,
};

export const Disabled: Story = {
  render: () => <RecordTabs className="max-w-2xl" />,
  play: async ({ canvasElement }) => {
    const billing = within(canvasElement).getByRole('tab', { name: 'Billing' });
    await expect(billing).toBeDisabled();
  },
};

export const LongLabels: Story = {
  render: () => (
    <div className="max-w-2xl">
      <RecordTabs
        items={fixture.longLabels}
        defaultValue={fixture.longLabels[0].value}
      />
    </div>
  ),
};

/**
 * At 360 pixels the list scrolls sideways rather than wrapping into an unreadable stack, and the
 * selected tab stays legible.
 */
export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <Tabs defaultValue="summary" className="min-w-0">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList aria-label={fixture.label} className="w-max">
          {fixture.items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {fixture.items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="rounded-lg border p-4 text-sm">
          {item.body}
        </TabsContent>
      ))}
    </Tabs>
  ),
};

/**
 * One tab stop reaches the selected tab; arrows move between tabs and Tab again enters the panel.
 * The disabled tab is skipped.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="tabs-keyboard" className="max-w-2xl">
      <RecordTabs />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByRole('tab', { name: 'Summary' });

    await userEvent.tab();
    await expect(summary).toHaveFocus();
    await expect(summary).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Progress notes' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Results' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Billing is disabled, so the focus wraps past it back to the first tab.
    await userEvent.keyboard('{ArrowRight}');
    await expect(summary).toHaveAttribute('aria-selected', 'true');
  },
};
