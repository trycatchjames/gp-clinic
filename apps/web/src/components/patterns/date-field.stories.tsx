import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookDateFieldStates } from '@/fixtures/storybook-date-field-states';
import type { DateFieldProps } from './date-field';
import { DateField } from './date-field';

const fixture = storybookDateFieldStates;

const meta = {
  title: 'Molecules/Forms/Australian Date Field',
  component: DateField,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.dateField),
  args: {
    label: fixture.label,
    textValue: '',
    selectedDate: null,
    open: false,
    month: fixture.month,
    today: fixture.today,
    onTextValueChange: fn(),
    onSelectedDateChange: fn(),
    onOpenChange: fn(),
    onMonthChange: fn(),
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

type ExampleProps = Partial<
  Omit<
    DateFieldProps,
    | 'textValue'
    | 'selectedDate'
    | 'open'
    | 'month'
    | 'today'
    | 'onTextValueChange'
    | 'onSelectedDateChange'
    | 'onOpenChange'
    | 'onMonthChange'
  >
> & {
  initialText?: string;
  initialSelected?: string | null;
  initialOpen?: boolean;
  initialMonth?: string;
};

function ControlledExample({
  initialText = '',
  initialSelected = null,
  initialOpen = false,
  initialMonth = fixture.month,
  ...props
}: ExampleProps) {
  const [textValue, setTextValue] = useState(initialText);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialSelected);
  const [open, setOpen] = useState(initialOpen);
  const [month, setMonth] = useState(initialMonth);

  return (
    <DateField
      label={fixture.label}
      hint={fixture.hint}
      textValue={textValue}
      selectedDate={selectedDate}
      open={open}
      month={month}
      today={fixture.today}
      minDate={fixture.minDate}
      maxDate={fixture.maxDate}
      onTextValueChange={setTextValue}
      onSelectedDateChange={setSelectedDate}
      onOpenChange={setOpen}
      onMonthChange={setMonth}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => (
    <section data-evidence="storybook-australian-date-field" className="min-h-[30rem] max-w-lg">
      <ControlledExample
        initialText={fixture.selectedText}
        initialSelected={fixture.selected}
        initialOpen
        maxDate="2027-04-28"
      />
    </section>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample initialText={fixture.selectedText} initialSelected={fixture.selected} />
    </div>
  ),
};

export const Incomplete: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample initialText={fixture.incompleteText} />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample required initialText={fixture.invalidText} error={fixture.error} />
    </div>
  ),
};

export const FieldStates: Story = {
  render: () => (
    <section
      data-evidence="storybook-australian-date-field-states"
      aria-label="Australian date field states"
      className="grid max-w-6xl items-start gap-6 md:grid-cols-3"
    >
      <ControlledExample
        label="Selected appointment date"
        initialText={fixture.selectedText}
        initialSelected={fixture.selected}
      />
      <ControlledExample label="Incomplete appointment date" initialText={fixture.incompleteText} />
      <ControlledExample
        label="Invalid appointment date"
        initialText={fixture.invalidText}
        error={fixture.error}
      />
    </section>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample disabled initialText={fixture.selectedText} initialSelected={fixture.selected} />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="max-w-lg">
      <ControlledExample readOnly initialText={fixture.selectedText} initialSelected={fixture.selected} />
    </div>
  ),
};

export const LongLabel: Story = {
  render: () => (
    <div className="max-w-sm">
      <ControlledExample label={fixture.longLabel} initialText={fixture.incompleteText} />
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section
      data-evidence="storybook-australian-date-field-narrow"
      className="min-h-[32rem] w-full max-w-full"
    >
      <ControlledExample label={fixture.longLabel} initialOpen />
    </section>
  ),
};

export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="storybook-australian-date-field-keyboard" className="min-h-[30rem] max-w-lg">
      <ControlledExample />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: fixture.label });

    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    const today = await canvas.findByRole('button', { name: 'Friday 2 April 2027' });
    await expect(today).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{PageDown}');
    await expect(canvas.getByRole('button', { name: 'Sunday 9 May 2027' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('09/05/2027');
    await expect(input).toHaveFocus();
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
