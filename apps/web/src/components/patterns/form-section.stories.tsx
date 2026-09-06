import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Input } from '@/components/ui/input';
import { Field } from './form-field';
import { FormSection } from './form-section';

const fixture = storybookMoleculeStates.formSection;

const meta = {
  title: 'Molecules/Forms/Form Section',
  component: FormSection,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.formSection),
  args: {
    title: fixture.identity.title,
    description: fixture.identity.description,
    children: null,
  },
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

function IdentityFields() {
  return (
    <>
      <Field label="Family name" htmlFor="section-family-name">
        <Input id="section-family-name" defaultValue="Okonkwo-Delacroix" />
      </Field>
      <Field label="Name the patient uses" htmlFor="section-used-name" hint="Where it differs from the legal name.">
        <Input id="section-used-name" defaultValue="Hamish" />
      </Field>
    </>
  );
}

export const Default: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <FormSection {...args}>
        <IdentityFields />
      </FormSection>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvas.getByRole('region', { name: fixture.identity.title });
    // The description belongs to the group, not to the space beside it.
    await expect(section).toHaveAccessibleDescription(fixture.identity.description);
  },
};

/**
 * Optional is a fact about the section. A section a role fills in later must not read as one they
 * failed to complete.
 */
export const Optional: Story = {
  args: { title: fixture.privacy.title, description: fixture.privacy.description, optional: true },
  render: (args) => (
    <div className="max-w-2xl">
      <FormSection {...args}>
        <Field label="Pronouns" htmlFor="section-pronouns" hint="Prefer not to say is recorded as such.">
          <Input id="section-pronouns" defaultValue="" />
        </Field>
      </FormSection>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Optional')).toBeVisible();
  },
};

export const WithProblems: Story = {
  args: { errorCount: 2 },
  render: (args) => (
    <div className="max-w-2xl">
      <FormSection {...args}>
        <IdentityFields />
      </FormSection>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('2 problems to correct')).toBeVisible();
  },
};

/**
 * The three states side by side, and a singular count. "1 problems" reads as a bug in the record.
 */
export const AllStates: Story = {
  render: (args) => (
    <div data-evidence="form-section-states" className="grid max-w-2xl gap-8">
      <FormSection {...args}>
        <IdentityFields />
      </FormSection>
      <FormSection
        title={fixture.privacy.title}
        description={fixture.privacy.description}
        optional
      >
        <Field label="Pronouns" htmlFor="states-pronouns">
          <Input id="states-pronouns" defaultValue="" />
        </Field>
      </FormSection>
      <FormSection title={fixture.payer.title} description={fixture.payer.description} errorCount={1}>
        <Field label="Medicare number" htmlFor="states-medicare" error="Enter all ten digits and the individual reference number.">
          <Input id="states-medicare" defaultValue="2951 4768" />
        </Field>
      </FormSection>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 problem to correct')).toBeVisible();
  },
};

/**
 * A section inside a section takes the next heading level, so the form stays navigable by heading.
 */
export const Nested: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <FormSection {...args}>
        <IdentityFields />
        <FormSection
          level={3}
          title="Previous names"
          description="Recorded so results and correspondence filed under an earlier name still match."
        >
          <Field label="Previous family name" htmlFor="nested-previous">
            <Input id="nested-previous" defaultValue="Delacroix" />
          </Field>
        </FormSection>
      </FormSection>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: fixture.identity.title })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Previous names' })).toBeVisible();
  },
};

export const ContentStress: Story = {
  args: { title: fixture.longTitle, description: fixture.longDescription, optional: true },
  render: (args) => (
    <div className="max-w-2xl">
      <FormSection {...args}>
        <Field label="Representative authority evidence" htmlFor="stress-representative">
          <Input id="stress-representative" defaultValue="" />
        </Field>
      </FormSection>
    </div>
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  args: { title: fixture.longTitle, description: fixture.longDescription, optional: true, errorCount: 3 },
  render: (args) => (
    <div data-evidence="form-section-narrow" className="w-full max-w-full">
      <FormSection {...args}>
        <Field label="Representative authority evidence" htmlFor="narrow-representative">
          <Input id="narrow-representative" defaultValue="" />
        </Field>
      </FormSection>
    </div>
  ),
};
