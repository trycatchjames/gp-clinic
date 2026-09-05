import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookDateRangeFieldStates } from '@/fixtures/storybook-date-range-field-states';
import type {
  DateBoundaryCallbacks,
  DateBoundaryState,
  DateRangeFieldProps,
} from './date-range-field';
import { DateRangeField } from './date-range-field';

const fixture = storybookDateRangeFieldStates;
const emptyBoundary: DateBoundaryState = {
  textValue: '',
  selectedDate: null,
  open: false,
  month: fixture.month,
};

const meta = {
  title: 'Molecules/Forms/Australian Date Range Field',
  component: DateRangeField,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.dateRangeField),
  args: {
    label: fixture.label,
    today: fixture.today,
    start: emptyBoundary,
    end: emptyBoundary,
    startCallbacks: {
      onTextValueChange: fn(),
      onSelectedDateChange: fn(),
      onOpenChange: fn(),
      onMonthChange: fn(),
    },
    endCallbacks: {
      onTextValueChange: fn(),
      onSelectedDateChange: fn(),
      onOpenChange: fn(),
      onMonthChange: fn(),
    },
  },
} satisfies Meta<typeof DateRangeField>;

export default meta;
type Story = StoryObj<typeof meta>;

type ExampleProps = Partial<
  Omit<DateRangeFieldProps, 'today' | 'start' | 'end' | 'startCallbacks' | 'endCallbacks'>
> & {
  initialStart?: Partial<DateBoundaryState>;
  initialEnd?: Partial<DateBoundaryState>;
};

function ControlledExample({ initialStart, initialEnd, ...props }: ExampleProps) {
  const [start, setStart] = useState<DateBoundaryState>({ ...emptyBoundary, ...initialStart });
  const [end, setEnd] = useState<DateBoundaryState>({ ...emptyBoundary, ...initialEnd });

  function callbacks(
    setBoundary: React.Dispatch<React.SetStateAction<DateBoundaryState>>,
  ): DateBoundaryCallbacks {
    return {
      onTextValueChange: (textValue) => setBoundary((value) => ({ ...value, textValue })),
      onSelectedDateChange: (selectedDate) =>
        setBoundary((value) => ({ ...value, selectedDate })),
      onOpenChange: (open) => setBoundary((value) => ({ ...value, open })),
      onMonthChange: (month) => setBoundary((value) => ({ ...value, month })),
    };
  }

  return (
    <DateRangeField
      label={fixture.label}
      hint={fixture.hint}
      today={fixture.today}
      minDate="2027-04-01"
      maxDate="2027-05-31"
      start={start}
      end={end}
      startCallbacks={callbacks(setStart)}
      endCallbacks={callbacks(setEnd)}
      {...props}
    />
  );
}

const completeStart = {
  textValue: fixture.start.text,
  selectedDate: fixture.start.date,
};
const completeEnd = {
  textValue: fixture.end.text,
  selectedDate: fixture.end.date,
};

export const Default: Story = {
  render: () => (
    <section data-evidence="storybook-australian-date-range" className="min-h-[34rem] max-w-5xl">
      <ControlledExample
        initialStart={completeStart}
        initialEnd={{ ...completeEnd, open: true }}
      />
    </section>
  ),
};

export const Complete: Story = {
  render: () => <ControlledExample initialStart={completeStart} initialEnd={completeEnd} />,
};

export const StartOnly: Story = {
  render: () => <ControlledExample initialStart={completeStart} />,
};

export const InvalidBoundary: Story = {
  render: () => (
    <ControlledExample
      initialStart={completeStart}
      initialEnd={{ textValue: fixture.incompleteEnd }}
      endError={fixture.boundaryError}
    />
  ),
};

export const InvalidOrder: Story = {
  render: () => (
    <ControlledExample
      initialStart={{
        textValue: fixture.reversedStart.text,
        selectedDate: fixture.reversedStart.date,
      }}
      initialEnd={{
        textValue: fixture.reversedEnd.text,
        selectedDate: fixture.reversedEnd.date,
      }}
      error={fixture.orderError}
    />
  ),
};

export const RangeStates: Story = {
  render: () => (
    <section
      data-evidence="storybook-australian-date-range-states"
      aria-label="Australian date range states"
      className="grid max-w-6xl items-start gap-6"
    >
      <ControlledExample
        label="Complete range"
        initialStart={completeStart}
        initialEnd={completeEnd}
      />
      <ControlledExample
        label="Incomplete range"
        initialStart={completeStart}
        initialEnd={{ textValue: fixture.incompleteEnd }}
        endError={fixture.boundaryError}
      />
      <ControlledExample
        label="Range with reversed boundaries"
        initialStart={{
          textValue: fixture.reversedStart.text,
          selectedDate: fixture.reversedStart.date,
        }}
        initialEnd={{
          textValue: fixture.reversedEnd.text,
          selectedDate: fixture.reversedEnd.date,
        }}
        error={fixture.orderError}
      />
    </section>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ControlledExample disabled initialStart={completeStart} initialEnd={completeEnd} />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <ControlledExample readOnly initialStart={completeStart} initialEnd={completeEnd} />
  ),
};

export const LongLegend: Story = {
  render: () => (
    <div className="max-w-xl">
      <ControlledExample label={fixture.longLabel} initialStart={completeStart} />
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section
      data-evidence="storybook-australian-date-range-narrow"
      className="min-h-[55rem] w-full max-w-full"
    >
      <ControlledExample
        label={fixture.longLabel}
        initialStart={{ ...completeStart, open: true }}
        initialEnd={completeEnd}
      />
    </section>
  ),
};

export const KeyboardFlow: Story = {
  render: () => (
    <div
      data-evidence="storybook-australian-date-range-keyboard"
      className="min-h-[34rem] max-w-5xl"
    >
      <ControlledExample initialEnd={completeEnd} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startInput = canvas.getByRole('textbox', { name: 'Start date' });
    const endInput = canvas.getByRole('textbox', { name: 'End date' });

    await userEvent.tab();
    await expect(startInput).toHaveFocus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}{ArrowRight}{Enter}');
    await expect(startInput).toHaveValue('03/04/2027');
    await expect(endInput).toHaveValue(fixture.end.text);
    await expect(startInput).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Choose Start date/ })).toHaveFocus();
    await userEvent.tab();
    await expect(endInput).toHaveFocus();
  },
};
