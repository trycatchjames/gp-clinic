import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  foundationContracts,
  foundationParameters,
} from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Button } from '@/components/ui/button';
import { ConsequenceConfirmation } from './consequence-confirmation';

const fixture = storybookMoleculeStates.confirmation;

/**
 * The gallery drives the dialog through a trigger rather than rendering it permanently open, so
 * every story also proves the contract that focus returns to the control that opened it.
 */
function Harness({
  triggerLabel = 'Cancel appointment',
  reasonValue,
  acknowledged,
  ...props
}: Omit<
  React.ComponentProps<typeof ConsequenceConfirmation>,
  'open' | 'onOpenChange' | 'reason' | 'acknowledgement'
> & {
  triggerLabel?: string;
  reasonValue?: string;
  acknowledged?: boolean;
  reason?: Omit<
    NonNullable<React.ComponentProps<typeof ConsequenceConfirmation>['reason']>,
    'value' | 'onChange'
  >;
  acknowledgement?: Omit<
    NonNullable<React.ComponentProps<typeof ConsequenceConfirmation>['acknowledgement']>,
    'checked' | 'onChange'
  >;
}) {
  const { reason, acknowledgement, ...rest } = props;
  const [open, setOpen] = React.useState(true);
  const [value, setValue] = React.useState(reasonValue ?? '');
  const [checked, setChecked] = React.useState(acknowledged ?? false);

  return (
    <div data-evidence="confirmation-disclosures" className="p-4">
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <ConsequenceConfirmation
        {...rest}
        open={open}
        onOpenChange={setOpen}
        reason={reason ? { ...reason, value, onChange: setValue } : undefined}
        acknowledgement={
          acknowledgement ? { ...acknowledgement, checked, onChange: setChecked } : undefined
        }
      />
    </div>
  );
}

const cancellation = fixture.cancelAppointment;

const meta = {
  title: 'Molecules/Feedback/Consequence Confirmation',
  component: ConsequenceConfirmation,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.consequenceConfirmation),
  args: {
    open: true,
    onOpenChange: fn(),
    onConfirm: fn(),
    title: cancellation.title,
    target: cancellation.target,
    context: cancellation.context,
    consequence: cancellation.consequence,
    retained: cancellation.retained,
    downstream: cancellation.downstream,
    alternative: cancellation.alternative,
    confirmLabel: cancellation.confirmLabel,
    cancelLabel: cancellation.cancelLabel,
  },
} satisfies Meta<typeof ConsequenceConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every disclosure the destructive-action contract requires is present before the operator can
 * commit: what is affected, whose record it is, what happens, what survives and what else moves.
 */
export const Default: Story = {
  render: (args) => <Harness {...args} triggerLabel={cancellation.confirmLabel} />,
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog');
    const scope = within(dialog);

    await expect(scope.getByRole('heading', { name: cancellation.title })).toBeVisible();
    for (const term of ['Action applies to', 'Context', 'Kept in the record', 'Also changes']) {
      await expect(scope.getByText(term)).toBeVisible();
    }
    await expect(scope.getByText('Safer alternative')).toBeVisible();

    // Opening onto the destructive action would let a held Enter key confirm before anyone has
    // read the consequence, so focus is deliberately elsewhere.
    await expect(
      scope.getByRole('button', { name: new RegExp(cancellation.confirmLabel, 'i') }),
    ).not.toHaveFocus();
  },
};

/**
 * A corrective action is still consequential. It keeps the same disclosure structure and an
 * icon-marked final action, so the difference survives greyscale, but it is not dressed as a
 * deletion when nothing is destroyed.
 */
export const Corrective: Story = {
  args: {
    severity: 'corrective',
    title: fixture.amendObservation.title,
    target: fixture.amendObservation.target,
    context: fixture.amendObservation.context,
    consequence: fixture.amendObservation.consequence,
    retained: fixture.amendObservation.retained,
    downstream: fixture.amendObservation.downstream,
    alternative: undefined,
    confirmLabel: fixture.amendObservation.confirmLabel,
    cancelLabel: 'Cancel',
  },
  render: (args) => <Harness {...args} triggerLabel="Amend reading" />,
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog');
    await expect(dialog).toHaveAttribute('data-severity', 'corrective');
    await expect(within(dialog).queryByText('Safer alternative')).not.toBeInTheDocument();
  },
};

/**
 * A high-risk action requires a reason. Focus opens on the reason so the operator writes before
 * they commit, and the reason travels with the record rather than living in this dialog.
 */
export const WithReason: Story = {
  args: {
    severity: 'corrective',
    title: fixture.amendObservation.title,
    target: fixture.amendObservation.target,
    context: fixture.amendObservation.context,
    consequence: fixture.amendObservation.consequence,
    retained: fixture.amendObservation.retained,
    downstream: fixture.amendObservation.downstream,
    alternative: undefined,
    confirmLabel: fixture.amendObservation.confirmLabel,
  },
  render: (args) => (
    <Harness
      {...args}
      triggerLabel="Amend reading"
      reason={{
        label: fixture.amendObservation.reasonLabel,
        hint: fixture.amendObservation.reasonHint,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog');
    const scope = within(dialog);
    const reason = scope.getByRole('textbox', { name: /Reason for the amendment/ });

    await waitFor(() => expect(reason).toHaveFocus());
    await expect(reason).toHaveAttribute('aria-required', 'true');

    await userEvent.type(reason, 'Transcription error: the cuff reading was 120/80.');
    await expect(
      scope.getByRole('button', { name: new RegExp(fixture.amendObservation.confirmLabel, 'i') }),
    ).toBeEnabled();
  },
};

/**
 * A merge needs a second authorised person. The molecule owns the deliberate acknowledgement that
 * gates the action; whether a second person actually reviewed it stays with the capability.
 */
export const WithAcknowledgement: Story = {
  args: {
    title: fixture.mergeRecords.title,
    target: fixture.mergeRecords.target,
    context: fixture.mergeRecords.context,
    consequence: fixture.mergeRecords.consequence,
    retained: fixture.mergeRecords.retained,
    downstream: fixture.mergeRecords.downstream,
    alternative: fixture.mergeRecords.alternative,
    confirmLabel: fixture.mergeRecords.confirmLabel,
    cancelLabel: 'Cancel',
  },
  render: (args) => (
    <Harness
      {...args}
      triggerLabel="Merge records"
      reasonValue="Medicare card, date of birth and address match on both records."
      reason={{
        label: fixture.mergeRecords.reasonLabel,
        hint: fixture.mergeRecords.reasonHint,
      }}
      acknowledgement={{ label: fixture.mergeRecords.acknowledgementLabel }}
    />
  ),
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog');
    const scope = within(dialog);
    const confirm = scope.getByRole('button', {
      name: new RegExp(fixture.mergeRecords.confirmLabel, 'i'),
    });

    await expect(confirm).toBeDisabled();
    await userEvent.click(scope.getByRole('checkbox'));
    await expect(confirm).toBeEnabled();
  },
};

/**
 * An unmet precondition is stated beside the action. A disabled button with no explanation leaves
 * the operator guessing which of the two requirements they have missed.
 */
export const Blocked: Story = {
  args: {
    title: fixture.mergeRecords.title,
    target: fixture.mergeRecords.target,
    context: fixture.mergeRecords.context,
    consequence: fixture.mergeRecords.consequence,
    retained: fixture.mergeRecords.retained,
    downstream: fixture.mergeRecords.downstream,
    alternative: fixture.mergeRecords.alternative,
    confirmLabel: fixture.mergeRecords.confirmLabel,
    cancelLabel: 'Cancel',
  },
  render: (args) => (
    <div data-evidence="confirmation-blocked">
      <Harness
        {...args}
        triggerLabel="Merge records"
        reason={{ label: fixture.mergeRecords.reasonLabel }}
        acknowledgement={{ label: fixture.mergeRecords.acknowledgementLabel }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog');
    const scope = within(dialog);

    await expect(
      scope.getByText('To continue, enter a reason and tick the acknowledgement.'),
    ).toBeVisible();
    await expect(
      scope.getByRole('button', { name: new RegExp(fixture.mergeRecords.confirmLabel, 'i') }),
    ).toBeDisabled();
  },
};

/**
 * While the mutation is in flight the disclosures stay readable and every dismissal path is
 * refused, because abandoning the dialog here would leave the outcome unknown.
 */
export const Submitting: Story = {
  args: { submitting: true },
  render: (args) => <Harness {...args} triggerLabel={cancellation.confirmLabel} />,
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const scope = within(within(body).getByRole('dialog'));

    await expect(scope.getByRole('button', { name: /Working/ })).toBeDisabled();
    await expect(scope.getByRole('button', { name: cancellation.cancelLabel })).toBeDisabled();
    await expect(scope.getByText(cancellation.target)).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(within(body).getByRole('dialog')).toBeVisible();
  },
};

/**
 * A failed submission keeps the dialog, says what did not happen and warns against acting on the
 * assumption that it did. Closing on failure would be indistinguishable from success.
 */
export const FailedSubmit: Story = {
  args: { failure: cancellation.failure },
  render: (args) => (
    <div data-evidence="confirmation-failure">
      <Harness {...args} triggerLabel={cancellation.confirmLabel} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scope = within(within(canvasElement.ownerDocument.body).getByRole('dialog'));
    const alert = scope.getByRole('alert');

    await expect(alert).toHaveTextContent('The appointment was not cancelled.');
    await waitFor(() => expect(alert).toHaveFocus());
    await expect(
      scope.getByRole('button', { name: new RegExp(cancellation.confirmLabel, 'i') }),
    ).toBeEnabled();
  },
};

/**
 * Long targets, multi-sentence downstream effects and a long reason label all wrap. Nothing that
 * carries consequence may be truncated to make the dialog tidier.
 */
export const ContentStress: Story = {
  args: {
    title: fixture.contentStress.title,
    target: fixture.contentStress.target,
    context: fixture.contentStress.context,
    consequence: fixture.contentStress.consequence,
    retained: fixture.contentStress.retained,
    downstream: fixture.contentStress.downstream,
    alternative: fixture.contentStress.alternative,
    confirmLabel: fixture.contentStress.confirmLabel,
    cancelLabel: 'Cancel',
  },
  render: (args) => (
    <Harness
      {...args}
      triggerLabel="Withdraw document"
      reason={{ label: fixture.contentStress.reasonLabel }}
    />
  ),
  play: async ({ canvasElement }) => {
    const scope = within(within(canvasElement.ownerDocument.body).getByRole('dialog'));
    await expect(scope.getByText(fixture.contentStress.target)).toBeVisible();
    await expect(scope.getByText(fixture.contentStress.downstream)).toBeVisible();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: (args) => (
    <div data-evidence="confirmation-narrow">
      <Harness {...args} triggerLabel={cancellation.confirmLabel} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scope = within(within(canvasElement.ownerDocument.body).getByRole('dialog'));
    await expect(scope.getByText(cancellation.target)).toBeVisible();
    await expect(
      scope.getByRole('button', { name: new RegExp(cancellation.confirmLabel, 'i') }),
    ).toBeVisible();
  },
};

/**
 * Cancel precedes confirm in the tab order, and dismissing by any route leaves the action
 * untaken. Escape must never read as agreement.
 */
export const KeyboardFlow: Story = {
  render: (args) => (
    <div data-evidence="confirmation-keyboard">
      <Harness {...args} triggerLabel={cancellation.confirmLabel} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const scope = within(within(body).getByRole('dialog'));

    const cancel = scope.getByRole('button', { name: cancellation.cancelLabel });
    const confirm = scope.getByRole('button', {
      name: new RegExp(cancellation.confirmLabel, 'i'),
    });

    cancel.focus();
    await userEvent.tab();
    await expect(confirm).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(body).queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};
