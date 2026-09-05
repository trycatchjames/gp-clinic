import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookTimeFieldStates } from '@/fixtures/storybook-time-field-states';
import type { TimeFieldOption, TimeFieldProps } from './time-field';
import { TimeField } from './time-field';

const fixture = storybookTimeFieldStates;

const meta = {
  title: 'Molecules/Forms/Local Time Field',
  component: TimeField,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.timeField),
  args: {
    label: fixture.label,
    hourCycle: 'h12',
    timeZoneLabel: fixture.timezone,
    query: '',
    value: null,
    open: false,
    options: fixture.options12,
    onQueryChange: fn(),
    onValueChange: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

type ExampleProps = Partial<
  Omit<TimeFieldProps, 'query' | 'value' | 'open' | 'options' | 'status' | 'statusText'>
> & {
  initialQuery?: string;
  initialValue?: string | null;
  initialOpen?: boolean;
  options?: readonly TimeFieldOption[];
  status?: 'ready' | 'loading' | 'empty' | 'failure';
  statusText?: string;
};

function ControlledExample({
  initialQuery = '',
  initialValue = null,
  initialOpen = false,
  options = fixture.options12,
  status = 'ready',
  statusText,
  ...props
}: ExampleProps) {
  const [query, setQuery] = useState(initialQuery);
  const [value, setValue] = useState<string | null>(initialValue);
  const [open, setOpen] = useState(initialOpen);
  const commonProps = {
    label: fixture.label,
    hint: fixture.hint,
    hourCycle: 'h12' as const,
    timeZoneLabel: fixture.timezone,
    query,
    value,
    open,
    options,
    onQueryChange: setQuery,
    onValueChange: setValue,
    onOpenChange: setOpen,
    ...props,
  };

  if (status === 'ready') return <TimeField {...commonProps} />;
  return <TimeField {...commonProps} status={status} statusText={statusText ?? ''} />;
}

export const Default: Story = {
  render: () => (
    <section data-evidence="storybook-local-time-field" className="min-h-80 max-w-lg">
      <ControlledExample initialOpen />
    </section>
  ),
};

export const Selected12Hour: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        initialQuery={fixture.selected12.label}
        initialValue={fixture.selected12.value}
      />
    </div>
  ),
};

export const Selected24Hour: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        hourCycle="h23"
        options={fixture.options24}
        initialQuery={fixture.selected24.label}
        initialValue={fixture.selected24.value}
      />
    </div>
  ),
};

export const Incomplete: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample initialQuery={fixture.incomplete} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        initialQuery={fixture.incomplete}
        initialOpen
        status="loading"
        statusText={fixture.states.loading}
      />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        initialQuery="7:"
        initialOpen
        status="empty"
        statusText={fixture.states.empty}
      />
    </div>
  ),
};

export const Failure: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        initialQuery={fixture.incomplete}
        initialOpen
        status="failure"
        statusText={fixture.states.failure}
      />
    </div>
  ),
};

export const ResultStates: Story = {
  render: () => (
    <section
      data-evidence="storybook-local-time-field-states"
      aria-label="Local time field result states"
      className="grid min-h-56 max-w-6xl items-start gap-6 md:grid-cols-3"
    >
      <ControlledExample
        label="Loading appointment times"
        hint={null}
        initialQuery={fixture.incomplete}
        initialOpen
        status="loading"
        statusText={fixture.states.loading}
      />
      <ControlledExample
        label="No matching appointment times"
        hint={null}
        initialQuery="7:"
        initialOpen
        status="empty"
        statusText={fixture.states.empty}
      />
      <ControlledExample
        label="Failed appointment time choices"
        hint={null}
        initialQuery={fixture.incomplete}
        initialOpen
        status="failure"
        statusText={fixture.states.failure}
      />
    </section>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample required initialQuery={fixture.incomplete} error={fixture.error} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample disabled initialQuery={fixture.selected12.label} />
    </div>
  ),
};

export const LongTimezone: Story = {
  render: () => (
    <div className="max-w-sm">
      <ControlledExample timeZoneLabel={fixture.longTimezone} initialQuery={fixture.incomplete} />
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section data-evidence="storybook-local-time-field-narrow" className="min-h-96 w-full max-w-full">
      <ControlledExample
        timeZoneLabel={fixture.longTimezone}
        initialQuery={fixture.incomplete}
        initialOpen
      />
    </section>
  ),
};

export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="storybook-local-time-field-keyboard" className="min-h-80 max-w-lg">
      <ControlledExample />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: fixture.label });

    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('option', { name: '9:30 am' })).toHaveAttribute(
      'data-active',
      'true',
    );
    await expect(input).toHaveValue('');
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('9:30 am');
    await expect(input).toHaveFocus();
  },
};
