import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Label } from './label';
import { Input } from './input';

const fixture = storybookAtomStates.input;

const meta = {
  title: 'Atoms/Forms/Input',
  component: Input,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.input),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The atom is always shown with its label. An input with only a placeholder loses its name as soon
 * as the operator types, which is why the placeholder never stands in for a label here.
 */
function LabelledInput({
  id,
  label,
  describedBy,
  description,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  describedBy?: string;
  description?: string;
}) {
  return (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-describedby={describedBy} {...props} />
      {description && (
        <p
          id={describedBy}
          className={props['aria-invalid'] ? 'text-destructive text-xs' : 'text-muted-foreground text-xs'}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** A caption above each control on a comparison sheet; not part of the atom. */
function StateRow({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <p className="text-muted-foreground text-xs">{caption}</p>
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <LabelledInput id="medicare" label={fixture.label} placeholder={fixture.placeholder} />
  ),
};

/**
 * The keyboard an input summons is part of its contract on a tablet at the front desk, so the
 * type is chosen from the value rather than left as text everywhere.
 */
export const TypedValues: Story = {
  render: () => (
    <div className="grid gap-4">
      {fixture.types.map((entry) => (
        <LabelledInput
          key={entry.label}
          id={`typed-${entry.type}`}
          label={entry.label}
          type={entry.type}
          defaultValue={entry.value}
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <LabelledInput id="disabled" label={fixture.label} defaultValue={fixture.value} disabled />
  ),
};

/**
 * Read-only differs from disabled: the value still reaches the keyboard, screen reader and
 * clipboard, it simply cannot be changed here.
 */
export const ReadOnly: Story = {
  render: () => (
    <LabelledInput id="readonly" label={fixture.label} defaultValue={fixture.readOnlyValue} readOnly />
  ),
};

export const Invalid: Story = {
  render: () => (
    <section data-evidence="input-states" aria-label="Input states" className="grid gap-4">
      <StateRow caption="Empty">
        <LabelledInput id="states-default" label={fixture.label} placeholder={fixture.placeholder} />
      </StateRow>
      <StateRow caption="Filled">
        <LabelledInput id="states-filled" label={fixture.label} defaultValue={fixture.value} />
      </StateRow>
      <StateRow caption="Invalid — the value is kept and the reason is associated">
        <LabelledInput
          id="states-invalid"
          label={fixture.label}
          defaultValue={fixture.invalidValue}
          aria-invalid
          describedBy="states-invalid-error"
          description={fixture.invalidMessage}
        />
      </StateRow>
      <StateRow caption="Read only — still readable and copyable">
        <LabelledInput
          id="states-readonly"
          label={fixture.label}
          defaultValue={fixture.value}
          readOnly
        />
      </StateRow>
      <StateRow caption="Disabled — not available in this context">
        <LabelledInput
          id="states-disabled"
          label={fixture.label}
          defaultValue={fixture.value}
          disabled
        />
      </StateRow>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const invalid = within(canvasElement).getByDisplayValue(fixture.invalidValue);
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription(fixture.invalidMessage);
  },
};

export const LongValue: Story = {
  render: () => (
    <LabelledInput id="long" label="Practice name" defaultValue={fixture.longValue} />
  ),
};

/**
 * Activating the label moves focus into the control, and typing never clears what is already
 * there.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="input-keyboard">
      <LabelledInput id="keyboard" label={fixture.label} placeholder={fixture.placeholder} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(fixture.label);

    await userEvent.click(canvas.getByText(fixture.label));
    await expect(input).toHaveFocus();

    await userEvent.keyboard('2951 47681 1');
    await expect(input).toHaveValue(fixture.value);
  },
};
