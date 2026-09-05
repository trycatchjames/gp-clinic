import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookFoundationStates } from '@/fixtures/storybook-foundation-states';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldGroup } from './form-field';

const fixture = storybookFoundationStates.field;

const meta = {
  title: 'Molecules/Forms/Field',
  component: Field,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.field),
  args: {
    label: fixture.label,
    children: <Input />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Field label={fixture.label} htmlFor="field-default">
        <Input defaultValue={fixture.value} />
      </Field>
    </div>
  ),
};

export const WithHint: Story = {
  render: () => (
    <div className="max-w-md">
      <Field label={fixture.label} htmlFor="field-hint" hint={fixture.hint}>
        <Input defaultValue={fixture.value} />
      </Field>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="max-w-md">
      <Field label={fixture.label} htmlFor="field-required" required>
        <Input />
      </Field>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div data-evidence="storybook-field-states" className="max-w-md">
      <Field
        label={fixture.label}
        htmlFor="field-invalid"
        hint={fixture.hint}
        error={fixture.error}
        required
      >
        <Input defaultValue={fixture.invalidValue} />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Notification email/ });
    const error = canvas.getByRole('alert');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-errormessage', error.id);
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <Field label={fixture.label} htmlFor="field-disabled" hint="Unavailable while settings are locked.">
        <Input defaultValue={fixture.value} disabled />
      </Field>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <div className="max-w-3xl">
      <FieldGroup>
        <Field label="Workspace name" htmlFor="workspace-name" required>
          <Input defaultValue="Front desk workspace" />
        </Field>
        <Field label={fixture.label} htmlFor="workspace-email" hint={fixture.hint}>
          <Input defaultValue={fixture.value} />
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const LongMessages: Story = {
  render: () => (
    <div className="max-w-md">
      <Field
        label={fixture.longLabel}
        htmlFor="field-long"
        hint="This address is used only for operational messages and does not receive patient or clinical information."
        error={fixture.error}
      >
        <Textarea defaultValue="The previously entered address could not be verified." />
      </Field>
    </div>
  ),
};

export const Narrow: Story = {
  ...Grouped,
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
};

export const KeyboardFlow: Story = {
  render: () => (
    <div className="max-w-md">
      <Field label={fixture.label} htmlFor="field-keyboard" hint={fixture.hint}>
        <Input />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: fixture.label });

    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.type(input, fixture.value);
    await expect(input).toHaveValue(fixture.value);
  },
};
