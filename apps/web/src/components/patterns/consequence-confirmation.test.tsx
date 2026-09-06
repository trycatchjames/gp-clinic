import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConsequenceConfirmation } from './consequence-confirmation';

const base = {
  open: true,
  title: 'Cancel this appointment',
  target: 'Tuesday 9 September 2026, 10:15 am with Dr Rowena Aspinall',
  consequence: 'The appointment is released and the time becomes bookable.',
  confirmLabel: 'Cancel appointment',
};

describe('ConsequenceConfirmation', () => {
  it('states the target, retained history and downstream effect before the operator commits', () => {
    render(
      <ConsequenceConfirmation
        {...base}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        context="Marlee Tran · 14 Mar 1988"
        retained="The booking stays in the appointment history."
        downstream="The patient reminder is withdrawn."
      />,
    );

    const dialog = screen.getByRole('dialog', { name: base.title });
    expect(dialog).toHaveTextContent(base.target);
    expect(dialog).toHaveTextContent('The booking stays in the appointment history.');
    expect(dialog).toHaveTextContent('The patient reminder is withdrawn.');
  });

  it('blocks the action and names the unmet precondition rather than disabling silently', () => {
    const onConfirm = vi.fn();
    render(
      <ConsequenceConfirmation
        {...base}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: 'Reason', value: '   ', onChange: vi.fn() }}
        acknowledgement={{ label: 'I have checked both records', checked: false, onChange: vi.fn() }}
      />,
    );

    const confirm = screen.getByRole('button', { name: /Cancel appointment/ });
    expect(confirm).toBeDisabled();
    expect(
      screen.getByText('To continue, enter a reason and tick the acknowledgement.'),
    ).toBeInTheDocument();

    fireEvent.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('never treats dismissal as confirmation', () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConsequenceConfirmation
        {...base}
        cancelLabel="Keep appointment"
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Keep appointment' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('refuses every dismissal path while the mutation is in flight', () => {
    const onOpenChange = vi.fn();
    render(
      <ConsequenceConfirmation
        {...base}
        cancelLabel="Keep appointment"
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
        submitting
      />,
    );

    expect(screen.getByRole('button', { name: 'Keep appointment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Working/ })).toBeDisabled();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: base.title })).toBeInTheDocument();
  });

  it('keeps a failed submission recoverable and reports what did not happen', () => {
    render(
      <ConsequenceConfirmation
        {...base}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        failure="The appointment was not cancelled. The patient has not been notified."
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('The patient has not been notified.');
    expect(screen.getByRole('button', { name: /Cancel appointment/ })).toBeEnabled();
  });
});
