import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

function AppointmentSheet({ onOpenChange = vi.fn() }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetTrigger>Open appointment</SheetTrigger>
      <SheetContent closeLabel="Close appointment detail">
        <SheetHeader>
          <SheetTitle>Marlee Tran · 11:15 am</SheetTitle>
          <SheetDescription>Standard consultation with Dr Aroha Duong.</SheetDescription>
        </SheetHeader>
        <SheetBody>Arrived 11:07 am.</SheetBody>
        <SheetFooter>
          <button type="button">Start consultation</button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('labels and describes the panel from its own header', () => {
    render(<AppointmentSheet />);

    const sheet = screen.getByRole('dialog', { name: 'Marlee Tran · 11:15 am' });
    expect(sheet).toHaveAccessibleDescription('Standard consultation with Dr Aroha Duong.');
  });

  it('names the close control for the panel it closes', () => {
    render(<AppointmentSheet />);

    expect(
      screen.getByRole('button', { name: 'Close appointment detail' }),
    ).toBeInTheDocument();
  });

  it('makes the scrolling body reachable by keyboard', () => {
    // Content that overflows must be readable without a pointer, so the scroll container itself
    // is the fallback when nothing inside it is focusable.
    render(<AppointmentSheet />);

    const body = screen.getByText('Arrived 11:07 am.');
    expect(body).toHaveAttribute('tabindex', '0');
  });

  it('reports dismissal without treating it as a completed action', () => {
    const onOpenChange = vi.fn();
    render(<AppointmentSheet onOpenChange={onOpenChange} />);

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
