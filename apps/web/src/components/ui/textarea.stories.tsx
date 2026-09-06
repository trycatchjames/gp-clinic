import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Label } from './label';
import { Textarea } from './textarea';

const fixture = storybookAtomStates.textarea;

const meta = {
  title: 'Atoms/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.textarea),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

function LabelledTextarea({
  id,
  label,
  describedBy,
  description,
  ...props
}: React.ComponentProps<typeof Textarea> & {
  id: string;
  label: string;
  describedBy?: string;
  description?: string;
}) {
  return (
    <div className="grid max-w-xl gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} aria-describedby={describedBy} {...props} />
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
    <LabelledTextarea id="reason" label={fixture.label} placeholder={fixture.placeholder} />
  ),
};

export const Disabled: Story = {
  render: () => (
    <LabelledTextarea id="reason-disabled" label={fixture.label} defaultValue={fixture.value} disabled />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <LabelledTextarea
      id="reason-readonly"
      label="Imported summary"
      defaultValue={fixture.readOnlyValue}
      readOnly
    />
  ),
};

export const Invalid: Story = {
  render: () => (
    <section data-evidence="textarea-states" aria-label="Textarea states" className="grid gap-4">
      <StateRow caption="Empty">
        <LabelledTextarea id="ta-default" label={fixture.label} placeholder={fixture.placeholder} />
      </StateRow>
      <StateRow caption="Filled">
        <LabelledTextarea id="ta-filled" label={fixture.label} defaultValue={fixture.value} />
      </StateRow>
      <StateRow caption="Invalid — the reason is associated with the control">
        <LabelledTextarea
          id="ta-invalid"
          label={fixture.label}
          defaultValue=""
          aria-invalid
          describedBy="ta-invalid-error"
          description={fixture.invalidMessage}
        />
      </StateRow>
      <StateRow caption="Read only — an imported note that cannot be edited here">
        <LabelledTextarea
          id="ta-readonly"
          label={fixture.label}
          defaultValue={fixture.readOnlyValue}
          readOnly
        />
      </StateRow>
      <StateRow caption="Disabled — not available in this context">
        <LabelledTextarea
          id="ta-disabled"
          label={fixture.label}
          defaultValue={fixture.value}
          disabled
        />
      </StateRow>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const invalid = within(canvasElement).getByLabelText(fixture.label, {
      selector: '#ta-invalid',
    });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription(fixture.invalidMessage);
  },
};

/**
 * The control grows with its content instead of hiding a long history behind a scrollbar: a
 * clinician reviewing a note should see what they wrote without scrolling inside a small box.
 */
export const LongContent: Story = {
  render: () => (
    <section
      data-evidence="textarea-content-stress"
      aria-label="Textarea content stress"
      className="max-w-xl"
    >
      <LabelledTextarea id="ta-long" label={fixture.label} defaultValue={fixture.longContent} />
    </section>
  ),
};

export const KeyboardFlow: Story = {
  render: () => <LabelledTextarea id="ta-keyboard" label={fixture.label} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText(fixture.label);

    await userEvent.click(canvas.getByText(fixture.label));
    await expect(textarea).toHaveFocus();

    await userEvent.keyboard('Cough for eleven days.{Enter}No fever reported.');
    await expect(textarea).toHaveValue('Cough for eleven days.\nNo fever reported.');
  },
};
