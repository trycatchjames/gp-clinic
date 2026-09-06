import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Checkbox } from './checkbox';
import { Label } from './label';

const fixture = storybookAtomStates.checkbox;

const meta = {
  title: 'Atoms/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.checkbox),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxRow({
  id,
  label,
  ...props
}: React.ComponentProps<typeof Checkbox> & { id: string; label: string }) {
  return (
    <div className="group flex items-start gap-2" data-disabled={props.disabled || undefined}>
      <Checkbox id={id} className="mt-0.5" {...props} />
      <Label htmlFor={id} className="items-start leading-snug font-normal">
        {label}
      </Label>
    </div>
  );
}

export const Unchecked: Story = {
  render: () => <CheckboxRow id="unchecked" label={fixture.options[1].label} />,
};

export const Checked: Story = {
  render: () => <CheckboxRow id="checked" label={fixture.options[0].label} defaultChecked />,
};

/**
 * Indeterminate is a third state, not a prettier unchecked: it says some but not all of the
 * children below are selected, and it is announced as `mixed`.
 */
export const Indeterminate: Story = {
  render: function IndeterminateStory() {
    return (
      <fieldset className="grid max-w-md gap-2 rounded-lg border p-4">
        <legend className="px-1 text-sm font-medium">{fixture.legend}</legend>
        <CheckboxRow id="all" label="All preparation steps" checked="indeterminate" />
        <div className="grid gap-2 pl-6">
          <CheckboxRow id="child-1" label={fixture.options[0].label} defaultChecked />
          <CheckboxRow id="child-2" label={fixture.options[1].label} />
          <CheckboxRow id="child-3" label={fixture.options[2].label} />
        </div>
      </fieldset>
    );
  },
  play: async ({ canvasElement }) => {
    const parent = within(canvasElement).getByRole('checkbox', { name: 'All preparation steps' });
    await expect(parent).toHaveAttribute('aria-checked', 'mixed');
  },
};

export const Disabled: Story = {
  render: () => (
    <section data-evidence="checkbox-states" aria-label="Checkbox states" className="grid gap-3">
      <CheckboxRow id="state-unchecked" label={fixture.options[1].label} />
      <CheckboxRow id="state-checked" label={fixture.options[0].label} defaultChecked />
      <CheckboxRow id="state-mixed" label="Some steps complete" checked="indeterminate" />
      <CheckboxRow id="state-disabled" label={fixture.disabledLabel} disabled />
      <CheckboxRow
        id="state-disabled-checked"
        label={`${fixture.disabledLabel} — already applied`}
        disabled
        defaultChecked
      />
    </section>
  ),
};

export const LongLabel: Story = {
  render: () => (
    <div className="max-w-sm">
      <CheckboxRow id="long-label" label={fixture.longLabel} />
    </div>
  ),
};

/**
 * Tab reaches the box and Space toggles it. Arrow keys deliberately do nothing: unrelated
 * checkboxes are independent choices, not a single-choice group.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <fieldset data-evidence="checkbox-keyboard" className="grid max-w-md gap-2 rounded-lg border p-4">
      <legend className="px-1 text-sm font-medium">{fixture.legend}</legend>
      {fixture.options.map((option) => (
        <CheckboxRow key={option.id} id={`keyboard-${option.id}`} label={option.label} />
      ))}
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('checkbox', { name: fixture.options[0].label });
    const second = canvas.getByRole('checkbox', { name: fixture.options[1].label });

    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(first).toBeChecked();

    await userEvent.tab();
    await expect(second).toHaveFocus();
    await expect(second).not.toBeChecked();
  },
};
