import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';

const fixture = storybookAtomStates.label;

const meta = {
  title: 'Atoms/Forms/Label',
  component: Label,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.label),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="preferred-name">{fixture.text}</Label>
      <Input id="preferred-name" defaultValue="Marlee" />
    </div>
  ),
};

/**
 * A long label wraps onto as many lines as it needs. Truncating a label would remove the only
 * description of what the operator is about to enter.
 */
export const LongLabel: Story = {
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="preferred-name-long" className="items-start">
        {fixture.longText}
      </Label>
      <Input id="preferred-name-long" />
    </div>
  ),
};

/**
 * `group-data-[disabled=true]` dims the label with its control, so a disabled field reads as one
 * unavailable thing rather than an active label above a dead input.
 */
export const DisabledControl: Story = {
  render: () => (
    <div className="group grid max-w-sm gap-1.5" data-disabled="true">
      <Label htmlFor="provider-number">{fixture.disabledText}</Label>
      <Input id="provider-number" defaultValue="243817FX" disabled />
    </div>
  ),
};

/**
 * Activating a label focuses a text input and toggles a checkbox — the whole label is a target,
 * not just the small control beside it.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <section
      data-evidence="label-association"
      aria-label="Label association"
      className="grid max-w-sm gap-4"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="association-input">{fixture.text}</Label>
        <Input id="association-input" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="association-checkbox" />
        <Label htmlFor="association-checkbox">Interpreter required</Label>
      </div>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText(fixture.text));
    await expect(canvas.getByLabelText(fixture.text)).toHaveFocus();

    const checkbox = canvas.getByRole('checkbox', { name: 'Interpreter required' });
    await userEvent.click(canvas.getByText('Interpreter required'));
    await expect(checkbox).toBeChecked();
  },
};
