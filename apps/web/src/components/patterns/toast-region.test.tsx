import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ToastMessage } from './toast-region';
import { ToastRegion } from './toast-region';

const moved: ToastMessage = {
  id: 'moved',
  tone: 'success',
  title: 'Appointment moved',
  description: 'Marlee Tran is now booked at 2:30 pm.',
};

const failed: ToastMessage = {
  id: 'failed',
  tone: 'failure',
  title: 'Referral letter was not sent',
  description: 'The letter is still a draft. Nothing has been sent.',
};

function liveRegion(container: HTMLElement, politeness: 'polite' | 'assertive') {
  return container.querySelector(`[aria-live="${politeness}"]`) as HTMLElement;
}

describe('ToastRegion', () => {
  it('announces routine confirmation politely and a failed operation assertively', () => {
    const { container } = render(
      <ToastRegion toasts={[moved, failed]} onDismiss={vi.fn()} />,
    );

    expect(liveRegion(container, 'polite')).toHaveTextContent(moved.title);
    expect(liveRegion(container, 'polite')).not.toHaveTextContent(failed.title);
    expect(liveRegion(container, 'assertive')).toHaveTextContent(failed.title);
  });

  it('keeps both live regions mounted when there is nothing to announce', () => {
    // A live region inserted at the same moment as its text is unreliably announced, so the
    // regions have to be waiting before the first message arrives.
    const { container } = render(<ToastRegion toasts={[]} onDismiss={vi.fn()} />);

    expect(liveRegion(container, 'polite')).toBeInTheDocument();
    expect(liveRegion(container, 'assertive')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();
  });

  it('does not replace the announced text when an unchanged message is supplied again', () => {
    const { container, rerender } = render(
      <ToastRegion toasts={[moved]} onDismiss={vi.fn()} />,
    );
    const announced = liveRegion(container, 'polite').firstElementChild;

    rerender(<ToastRegion toasts={[{ ...moved }]} onDismiss={vi.fn()} />);

    // Same node, same text: a background refresh cannot make a screen reader repeat itself.
    expect(liveRegion(container, 'polite').firstElementChild).toBe(announced);
  });

  it('carries tone as a word as well as an icon and colour', () => {
    render(<ToastRegion toasts={[moved, failed]} onDismiss={vi.fn()} />);

    expect(screen.getByText(/^Completed\.$/)).toBeInTheDocument();
    expect(screen.getByText(/^Failed\.$/)).toBeInTheDocument();
  });

  it('names the dismissal with the message it removes', () => {
    const onDismiss = vi.fn();
    render(<ToastRegion toasts={[moved]} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: `Dismiss: ${moved.title}` }));
    expect(onDismiss).toHaveBeenCalledWith('moved');
  });

  it('exposes a recovery action ahead of the dismissal control', () => {
    const onSelect = vi.fn();
    render(
      <ToastRegion
        toasts={[{ ...failed, action: { label: 'Retry sending', onSelect } }]}
        onDismiss={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAccessibleName('Retry sending');
    fireEvent.click(buttons[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
