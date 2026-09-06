import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const fixture = storybookAtomStates.radioGroup;

const meta = {
  title: 'Atoms/Forms/Radio Group',
  component: RadioGroup,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.radioGroup),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type Option = { value: string; label: string; disabled?: boolean };

/**
 * The group is a `fieldset` with a `legend`: the question being answered has to reach assistive
 * technology, not just the four answers to it.
 */
function AppointmentTypeGroup({
  idPrefix,
  options = fixture.options,
  defaultValue,
  legend = fixture.legend,
}: {
  idPrefix: string;
  options?: readonly Option[];
  defaultValue?: string;
  legend?: string;
}) {
  return (
    <fieldset className="grid max-w-md gap-3 rounded-lg border p-4">
      <legend className="px-1 text-sm font-medium">{legend}</legend>
      <RadioGroup defaultValue={defaultValue} aria-label={legend}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-2">
            <RadioGroupItem
              id={`${idPrefix}-${option.value}`}
              value={option.value}
              disabled={option.disabled}
              className="mt-0.5"
            />
            <Label
              htmlFor={`${idPrefix}-${option.value}`}
              className="items-start leading-snug font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export const Default: Story = {
  render: () => <AppointmentTypeGroup idPrefix="default" defaultValue="standard" />,
};

export const WithSelection: Story = {
  render: () => (
    <section data-evidence="radio-group-states" aria-label="Radio group states" className="grid gap-4">
      <AppointmentTypeGroup idPrefix="selected" defaultValue="long" />
      <AppointmentTypeGroup idPrefix="empty" legend={`${fixture.legend} — nothing chosen yet`} />
    </section>
  ),
};

export const DisabledOption: Story = {
  render: () => <AppointmentTypeGroup idPrefix="disabled" defaultValue="standard" />,
};

/**
 * With no default, nothing is selected. Pre-selecting an option would record a choice the operator
 * never made — for an appointment type or a billing mode that is a real consequence.
 */
export const NoDefault: Story = {
  render: () => <AppointmentTypeGroup idPrefix="nodefault" />,
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole('radio');
    for (const radio of radios) {
      await expect(radio).not.toBeChecked();
    }
  },
};

export const LongLabels: Story = {
  render: () => (
    <div className="max-w-sm">
      <AppointmentTypeGroup
        idPrefix="long"
        options={fixture.longLabels}
        legend="Care plan activity"
      />
    </div>
  ),
};

/**
 * One tab stop reaches the group, then arrows move between options. Reaching an option does not
 * choose it — Space commits the choice — which is the repository invariant that focus movement
 * never implies selection. For an appointment type or a billing mode, arrowing past an option must
 * not record it.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="radio-group-keyboard">
      <AppointmentTypeGroup idPrefix="keyboard" defaultValue="standard" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const standard = canvas.getByRole('radio', { name: fixture.options[0].label });
    const long = canvas.getByRole('radio', { name: fixture.options[1].label });

    await userEvent.tab();
    await expect(standard).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(long).toHaveFocus();
    await expect(long).not.toBeChecked();
    await expect(standard).toBeChecked();

    await userEvent.keyboard(' ');
    await waitFor(async () => {
      await expect(long).toBeChecked();
    });
    await expect(standard).not.toBeChecked();

    // The unavailable option stays visible but cannot be reached or chosen.
    await expect(canvas.getByRole('radio', { name: fixture.options[3].label })).toBeDisabled();
  },
};
