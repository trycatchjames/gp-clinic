import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Label } from './label';
import { Switch } from './switch';

const fixture = storybookAtomStates.switchControl;

const meta = {
  title: 'Atoms/Forms/Switch',
  component: Switch,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.switchControl),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A switch applies immediately, so its row also owns the save state. Showing "Saving…" and a
 * failure beside the control is what stops a rejected change from looking applied.
 */
function SwitchRow({
  id,
  label = fixture.label,
  status,
  statusTone = 'muted',
  ...props
}: React.ComponentProps<typeof Switch> & {
  id: string;
  label?: string;
  status?: string;
  statusTone?: 'muted' | 'destructive';
}) {
  const statusId = status ? `${id}-status` : undefined;
  return (
    <div className="group grid max-w-md gap-1" data-disabled={props.disabled || undefined}>
      <div className="flex items-start justify-between gap-4">
        <Label htmlFor={id} className="items-start leading-snug font-normal">
          {label}
        </Label>
        <Switch id={id} aria-describedby={statusId} className="mt-0.5 shrink-0" {...props} />
      </div>
      {status && (
        <p
          id={statusId}
          className={
            statusTone === 'destructive'
              ? 'text-destructive text-xs font-medium'
              : 'text-muted-foreground text-xs'
          }
        >
          {status}
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

export const Off: Story = {
  render: () => <SwitchRow id="off" status={fixture.description} />,
};

export const On: Story = {
  render: () => <SwitchRow id="on" defaultChecked status={fixture.description} />,
};

export const Disabled: Story = {
  render: () => <SwitchRow id="disabled" label={fixture.disabledLabel} disabled defaultChecked />,
};

/**
 * While the change is in flight the control is busy, not checked. The operator can see the
 * practice has not accepted it yet.
 */
export const Pending: Story = {
  render: () => (
    <SwitchRow id="pending" defaultChecked aria-busy status={fixture.pendingText} />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('switch')).toHaveAttribute('aria-busy', 'true');
  },
};

/**
 * A rejected change returns the control to the value the practice actually holds and says so. The
 * switch must never sit in the new position after the save failed.
 */
export const FailedChange: Story = {
  render: () => (
    <section data-evidence="switch-states" aria-label="Switch states" className="grid gap-5">
      <StateRow caption="Off">
        <SwitchRow id="states-off" status={fixture.description} />
      </StateRow>
      <StateRow caption="On — saved">
        <SwitchRow id="states-on" defaultChecked status={fixture.description} />
      </StateRow>
      <StateRow caption="Pending — the practice has not accepted the change yet">
        <SwitchRow id="states-pending" defaultChecked aria-busy status={fixture.pendingText} />
      </StateRow>
      <StateRow caption="Failed — the control returns to the value the practice holds">
        <SwitchRow
          id="states-failed"
          status={fixture.failureText}
          statusTone="destructive"
          aria-invalid
        />
      </StateRow>
      <StateRow caption="Disabled — set by practice policy">
        <SwitchRow id="states-disabled" label={fixture.disabledLabel} disabled defaultChecked />
      </StateRow>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const failed = within(canvasElement).getByRole('switch', { description: fixture.failureText });
    await expect(failed).not.toBeChecked();
  },
};

export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="switch-keyboard">
      <SwitchRow id="keyboard" status={fixture.description} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch');

    await userEvent.tab();
    await expect(control).toHaveFocus();
    await expect(control).not.toBeChecked();

    await userEvent.keyboard(' ');
    await expect(control).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(control).not.toBeChecked();
  },
};
