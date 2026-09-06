import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { CircleAlert } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookAtomStates } from '@/fixtures/storybook-atom-states';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const fixture = storybookAtomStates.dialog;

const meta = {
  title: 'Atoms/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.dialog),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A destructive dialog names the consequence in its title and keeps the safe choice as the plain
 * dismissal. "Keep appointment" is deliberately the wider target and the last thing in reading
 * order before the destructive button.
 */
function CancelAppointmentDialog({
  defaultOpen,
  failure,
  body,
  evidence,
  onConfirm = fn(),
}: {
  defaultOpen?: boolean;
  failure?: boolean;
  body?: React.ReactNode;
  /** Screenshot target. The content is portalled, so the marker has to live on it. */
  evidence?: string;
  onConfirm?: () => void;
}) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{fixture.trigger}</Button>
      </DialogTrigger>
      <DialogContent data-evidence={evidence}>
        <DialogHeader>
          <DialogTitle>{fixture.title}</DialogTitle>
          <DialogDescription>{fixture.description}</DialogDescription>
        </DialogHeader>
        {body}
        {failure && (
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>Nothing was changed</AlertTitle>
            <AlertDescription>{fixture.failure}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{fixture.dismiss}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            {fixture.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <CancelAppointmentDialog />,
};

export const Open: Story = {
  render: () => <CancelAppointmentDialog defaultOpen />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: fixture.title });
    await expect(dialog).toHaveAccessibleDescription(fixture.description);
    await expect(
      within(dialog).getByRole('button', { name: fixture.confirm }),
    ).toBeVisible();
  },
};

export const LongContent: Story = {
  render: () => (
    <CancelAppointmentDialog
      defaultOpen
      body={<p className="text-sm leading-relaxed">{fixture.longContent}</p>}
    />
  ),
};

/**
 * A failed submit keeps the dialog open with the operator's choices intact and states plainly that
 * nothing changed. Closing on failure would hide the fact that the work was lost.
 */
export const FailedSubmit: Story = {
  render: () => <CancelAppointmentDialog defaultOpen failure evidence="dialog-layout" />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: fixture.title });
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(fixture.failure);
  },
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => <CancelAppointmentDialog defaultOpen />,
};

/**
 * With reduced motion the dialog appears without the zoom, in the same place with the same focus
 * behaviour.
 */
export const ReducedMotion: Story = {
  render: () => <CancelAppointmentDialog defaultOpen />,
};

/**
 * Opening moves focus into the dialog, Tab is trapped inside it, and Escape closes and returns
 * focus to the control that opened it.
 */
export const KeyboardFlow: Story = {
  render: () => <CancelAppointmentDialog evidence="dialog-keyboard" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: fixture.trigger });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    const dialog = await screen.findByRole('dialog', { name: fixture.title });
    await waitFor(async () => {
      await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
};
