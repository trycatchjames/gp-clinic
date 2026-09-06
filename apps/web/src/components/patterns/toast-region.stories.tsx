import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Button } from '@/components/ui/button';
import type { ToastMessage } from './toast-region';
import { ToastRegion } from './toast-region';

const fixture = storybookMoleculeStates.toasts;

const meta = {
  title: 'Molecules/Feedback/Toast Region',
  component: ToastRegion,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.toastRegion),
  args: { toasts: [], onDismiss: fn() },
} satisfies Meta<typeof ToastRegion>;

export default meta;
type Story = StoryObj<typeof meta>;

const success: ToastMessage = { ...fixture.success, tone: 'success' };
const status: ToastMessage = { ...fixture.status, tone: 'status' };

function failure(onSelect = fn()): ToastMessage {
  return {
    id: fixture.failure.id,
    tone: 'failure',
    title: fixture.failure.title,
    description: fixture.failure.description,
    action: { label: fixture.failure.actionLabel, onSelect },
  };
}

/**
 * The region is controlled, so a story owns the list and the dismissal exactly as a capability
 * would. `data-evidence` sits on a wrapper because the region itself is fixed to the viewport.
 */
function Harness({
  initial,
  evidence,
  trigger,
}: {
  initial: readonly ToastMessage[];
  evidence?: string;
  /** Adds a message after mount, which is the only way to prove the live region announces. */
  trigger?: ToastMessage;
}) {
  const [toasts, setToasts] = useState<readonly ToastMessage[]>(initial);

  return (
    <div data-evidence={evidence} className="min-h-[22rem] w-full max-w-3xl p-4">
      <h2 className="text-base font-semibold">Appointment book</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Friday 4 September 2026 · Northside Demo Clinic
      </p>
      {trigger && (
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setToasts((current) => [...current, trigger])}
        >
          Move appointment
        </Button>
      )}
      <ToastRegion
        toasts={toasts}
        dismissLabel={fixture.dismiss}
        onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness initial={[success]} evidence="toast-keyboard" />,
};

/**
 * Success, routine status and failure are told apart by an icon, a leading word and structure, not
 * by colour alone.
 */
export const Tones: Story = {
  render: () => <Harness initial={[success, status, failure()]} evidence="toast-tones" />,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Notifications' });
    // The tone word shares the title's paragraph so it is announced with it, so match a substring.
    await expect(within(region).getByText(fixture.success.title, { exact: false })).toBeVisible();
    await expect(within(region).getByText(fixture.failure.title, { exact: false })).toBeVisible();
  },
};

/**
 * A failure states what did not happen and what remains unchanged, and carries the safe next step
 * as a control rather than as a sentence telling the operator to go and find one.
 */
export const FailureWithRecovery: Story = {
  render: () => <Harness initial={[failure()]} evidence="toast-failure" />,
  play: async ({ canvasElement }) => {
    // Scoped to the visible landmark: the hidden live region carries the same words, and finding
    // both is the proof that the message was announced as well as shown.
    const region = within(canvasElement).getByRole('region', { name: 'Notifications' });
    await expect(within(region).getByText(/nothing has been sent/i)).toBeVisible();
    await expect(within(region).getByRole('button', { name: fixture.failure.actionLabel })).toBeEnabled();
  },
};

export const WithUndo: Story = {
  render: () => (
    <Harness
      initial={[
        {
          id: fixture.withAction.id,
          tone: 'success',
          title: fixture.withAction.title,
          description: fixture.withAction.description,
          action: { label: fixture.withAction.actionLabel, onSelect: fn() },
        },
      ]}
    />
  ),
};

/**
 * A long partial-failure message wraps in full. Truncating it could leave an operator believing a
 * claim was accepted when two of its items were not.
 */
export const ContentStress: Story = {
  render: () => (
    <Harness
      initial={[
        {
          id: fixture.contentStress.id,
          tone: 'failure',
          title: fixture.contentStress.title,
          description: fixture.contentStress.description,
          action: { label: fixture.contentStress.actionLabel, onSelect: fn() },
        },
      ]}
      evidence="toast-content-stress"
    />
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <Harness
      initial={[
        success,
        {
          id: fixture.contentStress.id,
          tone: 'failure',
          title: fixture.contentStress.title,
          description: fixture.contentStress.description,
          action: { label: fixture.contentStress.actionLabel, onSelect: fn() },
        },
      ]}
      evidence="toast-narrow"
    />
  ),
};

/**
 * Routine confirmation is announced politely, a failure assertively, and neither takes focus away
 * from what the operator was doing. The trigger keeps focus after the message arrives.
 */
export const Announcement: Story = {
  render: () => <Harness initial={[]} trigger={success} evidence="toast-announcement" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Move appointment' });

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Notifications' })).toBeVisible(),
    );

    // The message must not pull the operator out of the appointment book to read it.
    await expect(trigger).toHaveFocus();

    const polite = canvasElement.querySelector('[aria-live="polite"]') as HTMLElement;
    await expect(polite).toHaveTextContent(fixture.success.title);

    const assertive = canvasElement.querySelector('[aria-live="assertive"]') as HTMLElement;
    await expect(assertive).not.toHaveTextContent(fixture.success.title);
  },
};

/**
 * Dismissal removes the message from both the visible stack and the live region, and returns
 * nothing to announce.
 */
export const KeyboardFlow: Story = {
  render: () => <Harness initial={[success]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dismiss = canvas.getByRole('button', {
      name: `${fixture.dismiss}: ${fixture.success.title}`,
    });

    await userEvent.tab();
    await expect(dismiss).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() =>
      expect(canvas.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument(),
    );
    // Dismissal clears the announcement too, so nothing is left for a screen reader to re-read.
    const polite = canvasElement.querySelector('[aria-live="polite"]') as HTMLElement;
    await expect(polite).toBeEmptyDOMElement();
  },
};
