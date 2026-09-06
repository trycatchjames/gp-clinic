import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { formatCurrency } from '@/lib/formatters';
import { NumericField, type NumericFieldProps } from './numeric-field';

const fixture = storybookMoleculeStates.numericField;

/** The unit props are a union, so the omission has to distribute over it rather than flatten it. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type ControlledProps = DistributiveOmit<
  NumericFieldProps,
  'text' | 'onTextChange' | 'onValueChange'
> & {
  initialText?: string;
  /** Shows what the caller actually receives, which is the point of the contract. */
  showAccepted?: boolean;
};

/**
 * The field is controlled, so the story owns the text and the accepted value exactly as a billing
 * checkout would. Nothing here calculates: the accepted value is only echoed back.
 */
function Controlled({ initialText = '', showAccepted, ...props }: ControlledProps) {
  const [text, setText] = useState(initialText);
  const [value, setValue] = useState<number | null>(null);

  return (
    <div className="grid gap-2">
      <NumericField {...props} text={text} onTextChange={setText} onValueChange={setValue} />
      {showAccepted && (
        <p className="text-muted-foreground text-xs tabular-nums">
          Caller receives:{' '}
          <span data-testid="accepted">
            {value === null ? 'no value' : `${value} cents · ${formatCurrency(value)}`}
          </span>
        </p>
      )}
    </div>
  );
}

const meta = {
  title: 'Molecules/Forms/Numeric Field',
  component: NumericField,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.numericField),
  args: {
    label: fixture.fee.label,
    hint: fixture.fee.hint,
    decimals: 2,
    prefix: '$',
    unitLabel: 'Australian dollars',
    text: '',
    onTextChange: () => undefined,
    onValueChange: () => undefined,
  },
} satisfies Meta<typeof NumericField>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({ children, evidence }: { children: React.ReactNode; evidence?: string }) {
  return (
    <div data-evidence={evidence} className="grid max-w-sm gap-5">
      {children}
    </div>
  );
}

/** Dollars and cents. The accepted value is whole cents, never a floating-point dollar amount. */
export const Currency: Story = {
  render: () => (
    <Frame>
      <Controlled
        showAccepted
        label={fixture.fee.label}
        hint={fixture.fee.hint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText={fixture.fee.text}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(fixture.fee.label);

    await userEvent.clear(input);
    await userEvent.type(input, '1,234.56');
    // Grouping is accepted on the way in, and the caller receives whole cents.
    await expect(canvas.getByTestId('accepted')).toHaveTextContent('123456 cents');
  },
};

export const Quantity: Story = {
  render: () => (
    <Frame>
      <Controlled
        label={fixture.quantity.label}
        hint={fixture.quantity.hint}
        suffix="services"
        unitLabel="services"
        initialText={fixture.quantity.text}
      />
    </Frame>
  ),
};

/** One decimal place. The accepted value is tenths, so a weight never drifts through a float. */
export const Measurement: Story = {
  render: () => (
    <Frame>
      <Controlled
        label={fixture.weight.label}
        hint={fixture.weight.hint}
        decimals={1}
        suffix="kg"
        unitLabel="kilograms"
        initialText={fixture.weight.text}
      />
    </Frame>
  ),
};

/** A reduction is a different fact from a charge, so a negative value is only ever opt-in. */
export const Negative: Story = {
  render: () => (
    <Frame>
      <Controlled
        showAccepted
        allowNegative
        label={fixture.adjustment.label}
        hint={fixture.adjustment.hint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText={fixture.adjustment.text}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(fixture.adjustment.label);

    await userEvent.clear(input);
    await userEvent.type(input, '-15.00');
    await expect(canvas.getByTestId('accepted')).toHaveTextContent('-1500 cents');
  },
};

/**
 * Text that does not describe an amount yields no value and stays exactly as typed. A mistyped fee
 * is never quietly read as a nearby number.
 */
export const Invalid: Story = {
  args: {
    text: fixture.invalidText,
    error: fixture.invalidError,
  },
  render: (args) => (
    <Frame>
      <NumericField {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(fixture.fee.label);

    await expect(input).toHaveValue(fixture.invalidText);
    await expect(input).toHaveAccessibleDescription(new RegExp(fixture.invalidError));
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

/** More precision than the cent yields no value rather than a silent rounding. */
export const OverPrecision: Story = {
  args: {
    text: fixture.overPreciseText,
    error: fixture.overPreciseError,
  },
  render: (args) => (
    <Frame>
      <NumericField {...args} />
    </Frame>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Frame>
      <Controlled
        disabled
        label={fixture.fee.label}
        hint={fixture.fee.hint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText={fixture.fee.text}
      />
      <Controlled
        readOnly
        label={`${fixture.fee.label} on the issued invoice`}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText="82.30"
      />
    </Frame>
  ),
};

/** Accepted, refused, over-precise and unavailable together, in one sheet. */
export const AllStates: Story = {
  render: () => (
    <Frame evidence="numeric-field-states">
      <Controlled
        label={fixture.fee.label}
        hint={fixture.fee.hint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText={fixture.fee.text}
      />
      <Controlled
        label={fixture.quantity.label}
        hint={fixture.quantity.hint}
        suffix="services"
        unitLabel="services"
        initialText={fixture.quantity.text}
      />
      <Controlled
        allowNegative
        label={fixture.adjustment.label}
        hint={fixture.adjustment.hint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText={fixture.adjustment.text}
      />
      <NumericField
        label={`${fixture.fee.label} for item 44`}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        text={fixture.invalidText}
        error={fixture.invalidError}
        onTextChange={() => undefined}
        onValueChange={() => undefined}
      />
      <NumericField
        label={`${fixture.fee.label} for item 36`}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        text={fixture.overPreciseText}
        error={fixture.overPreciseError}
        onTextChange={() => undefined}
        onValueChange={() => undefined}
      />
    </Frame>
  ),
};

export const ContentStress: Story = {
  render: () => (
    <Frame>
      <Controlled
        label={fixture.longLabel}
        hint={fixture.longHint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText="194.40"
      />
    </Frame>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <div data-evidence="numeric-field-narrow" className="grid w-full max-w-full gap-5">
      <Controlled
        label={fixture.longLabel}
        hint={fixture.longHint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
        initialText="194.40"
      />
      <Controlled
        label={fixture.quantity.label}
        hint={fixture.quantity.hint}
        suffix="services"
        unitLabel="services"
        initialText={fixture.quantity.text}
      />
    </div>
  ),
};

/**
 * The value survives the keys and gestures that would change a native number input, and canonical
 * text is written only on leaving a field that already parses.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <Frame evidence="numeric-field-keyboard">
      <Controlled
        showAccepted
        label={fixture.fee.label}
        hint={fixture.fee.hint}
        decimals={2}
        prefix="$"
        unitLabel="Australian dollars"
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(fixture.fee.label);

    await userEvent.click(input);
    await userEvent.keyboard('82.3');
    await expect(canvas.getByTestId('accepted')).toHaveTextContent('8230 cents');

    // Arrow keys move the caret. They must never change the amount.
    await userEvent.keyboard('{ArrowUp}{ArrowDown}');
    await expect(input).toHaveValue('82.3');

    await userEvent.tab();
    // Leaving a parseable field writes the canonical text, and only then.
    await expect(input).toHaveValue('82.30');
  },
};
