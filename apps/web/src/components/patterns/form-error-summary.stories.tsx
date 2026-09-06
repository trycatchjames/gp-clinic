import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from './form-field';
import type { FormError } from './form-error-summary';
import { FormErrorSummary } from './form-error-summary';

const fixture = storybookMoleculeStates.errorSummary;

const meta = {
  title: 'Molecules/Forms/Form Error Summary',
  component: FormErrorSummary,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.formErrorSummary),
  args: { errors: fixture.errors as readonly FormError[] },
} satisfies Meta<typeof FormErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The summary is only half of the contract, so the stories render the fields it points at. An
 * entry that leads nowhere is worse than no summary.
 */
function RegistrationForm({
  errors = fixture.errors as readonly FormError[],
  attempt,
  children,
}: {
  errors?: readonly FormError[];
  attempt?: number;
  children?: ReactNode;
}) {
  return (
    <div className="grid max-w-2xl gap-4">
      {children ?? <FormErrorSummary errors={errors} attempt={attempt} />}
      {errors.map((error) => (
        <Field key={error.fieldId} label={error.label} error={error.message} htmlFor={error.fieldId}>
          <Input id={error.fieldId} defaultValue="" />
        </Field>
      ))}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div data-evidence="error-summary-list">
      <RegistrationForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(fixture.title)).toBeVisible();
    // The summary supplements the per-field error; it never replaces it.
    const field = canvas.getByRole('textbox', { name: fixture.errors[0].label });
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription(
      new RegExp(`Error: ${fixture.errors[0].message}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  },
};

export const SingleError: Story = {
  args: { errors: [fixture.singleError] },
  render: () => (
    <div data-evidence="error-summary-single">
      <RegistrationForm errors={[fixture.singleError]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // One problem is singular. A count that says "1 problems" reads as a bug in the record.
    await expect(
      within(canvasElement).getByText('There is 1 problem to correct before this can be saved'),
    ).toBeVisible();
  },
};

/**
 * A long registration form spans several regions, so each entry names its section. "Family name"
 * alone is not a place to go.
 */
export const Grouped: Story = {
  render: () => <RegistrationForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: /^Identity: Family name/ })).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: /^Communication safety and consent: Reminder consent/ }),
    ).toBeVisible();
  },
};

export const ContentStress: Story = {
  args: { errors: [fixture.contentStressError] },
  render: () => <RegistrationForm errors={[fixture.contentStressError]} />,
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <div data-evidence="error-summary-narrow" className="w-full max-w-full">
      <RegistrationForm errors={[...fixture.errors, fixture.contentStressError]} />
    </div>
  ),
};

/**
 * A failed submit moves focus to the summary, and an entry moves focus to its control. A second
 * failing submit under a new attempt is reported again rather than silently ignored.
 */
export const KeyboardFlow: Story = {
  render: () => {
    function Attempted() {
      const [attempt, setAttempt] = useState(0);
      return (
        <div data-evidence="error-summary-keyboard" className="grid max-w-2xl gap-4">
          <Button className="justify-self-start" onClick={() => setAttempt((n) => n + 1)}>
            Save registration
          </Button>
          {attempt > 0 && (
            <RegistrationForm attempt={attempt}>
              <FormErrorSummary errors={fixture.errors as readonly FormError[]} attempt={attempt} />
            </RegistrationForm>
          )}
        </div>
      );
    }
    return <Attempted />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Save registration' }));

    const summary = await canvas.findByRole('group', { name: fixture.title });
    await waitFor(async () => {
      await expect(summary).toHaveFocus();
    });

    const entry = canvas.getByRole('link', { name: /^Identity: Date of birth/ });
    await userEvent.click(entry);
    await expect(canvas.getByRole('textbox', { name: fixture.errors[1].label })).toHaveFocus();

    // A repeated failing submit is reported again; silence would read as success.
    await userEvent.click(canvas.getByRole('button', { name: 'Save registration' }));
    await waitFor(async () => {
      await expect(summary).toHaveFocus();
    });
  },
};
