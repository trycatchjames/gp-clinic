import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookComboboxFieldStates } from '@/fixtures/storybook-combobox-field-states';
import type { ComboboxFieldProps, ComboboxOption } from './combobox-field';
import { ComboboxField } from './combobox-field';

const fixture = storybookComboboxFieldStates;

const meta = {
  title: 'Molecules/Forms/Combobox Field',
  component: ComboboxField,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.comboboxField),
  args: {
    label: fixture.label,
    query: '',
    value: null,
    open: false,
    options: fixture.options,
    onQueryChange: fn(),
    onValueChange: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ComboboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

type ExampleProps = Partial<
  Omit<ComboboxFieldProps, 'query' | 'value' | 'open' | 'options' | 'status' | 'statusText'>
> & {
  initialQuery?: string;
  initialValue?: string | null;
  initialOpen?: boolean;
  options?: readonly ComboboxOption[];
  status?: 'ready' | 'loading' | 'empty' | 'failure';
  statusText?: string;
};

function ControlledExample({
  initialQuery = '',
  initialValue = null,
  initialOpen = false,
  options = fixture.options,
  status = 'ready',
  statusText,
  ...props
}: ExampleProps) {
  const [query, setQuery] = useState(initialQuery);
  const [value, setValue] = useState<string | null>(initialValue);
  const [open, setOpen] = useState(initialOpen);

  const combobox = (
    <ComboboxField
      label={fixture.label}
      hint={fixture.hint}
      placeholder={fixture.placeholder}
      query={query}
      value={value}
      open={open}
      options={options}
      onQueryChange={setQuery}
      onValueChange={setValue}
      onOpenChange={setOpen}
      {...props}
    />
  );

  if (status === 'ready') return combobox;
  return (
    <ComboboxField
      label={fixture.label}
      hint={fixture.hint}
      placeholder={fixture.placeholder}
      query={query}
      value={value}
      open={open}
      options={options}
      onQueryChange={setQuery}
      onValueChange={setValue}
      onOpenChange={setOpen}
      status={status}
      statusText={statusText ?? ''}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => (
    <section data-evidence="storybook-combobox-field" className="min-h-80 max-w-lg">
      <ControlledExample initialQuery="service" initialOpen />
    </section>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        initialQuery="Dr Samira Malik — Harbour Cardiology"
        initialValue={fixture.selectedValue}
        initialOpen
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample
        hint={null}
        initialQuery="cardiology"
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
        hint={null}
        initialQuery="paediatric respiratory"
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
        hint={null}
        initialQuery="cardiology"
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
      data-evidence="storybook-combobox-field-states"
      aria-label="Combobox result states"
      className="grid min-h-48 max-w-6xl items-start gap-6 md:grid-cols-3"
    >
      <ControlledExample
        label="Loading recipients"
        hint={null}
        initialQuery="cardiology"
        initialOpen
        status="loading"
        statusText={fixture.states.loading}
      />
      <ControlledExample
        label="No matching recipients"
        hint={null}
        initialQuery="paediatric respiratory"
        initialOpen
        status="empty"
        statusText={fixture.states.empty}
      />
      <ControlledExample
        label="Failed recipient search"
        hint={null}
        initialQuery="cardiology"
        initialOpen
        status="failure"
        statusText={fixture.states.failure}
      />
    </section>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample initialQuery="Recipient unavailable" disabled />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample required error={fixture.error} />
    </div>
  ),
};

export const LongOptions: Story = {
  render: () => (
    <div className="max-w-sm">
      <ControlledExample initialQuery="community" initialOpen />
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section data-evidence="storybook-combobox-field-narrow" className="min-h-80 w-full max-w-full">
      <ControlledExample initialQuery="community" initialOpen />
    </section>
  ),
};

export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="storybook-combobox-field-keyboard" className="max-w-lg">
      <ControlledExample />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: fixture.label });

    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('option', { name: /Dr Samira Malik/ })).toHaveAttribute(
      'data-active',
      'true',
    );
    await expect(canvas.getByRole('option', { name: /Dr Samira Malik/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('Dr Samira Malik — Harbour Cardiology');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveFocus();
  },
};
