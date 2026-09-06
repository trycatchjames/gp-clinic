import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

export type SheetSide = 'right' | 'bottom';

/**
 * A sheet is a modal panel anchored to an edge of the viewport. It exists alongside the dialog
 * rather than replacing it: a dialog is sized to a bounded decision, while a sheet holds a working
 * region — a record's detail and its actions — that is too tall and too long-lived to centre.
 *
 * The structural promise is that the header and the footer do not scroll. The header carries the
 * identity of whatever is on screen and the footer carries the actions, and neither may be pushed
 * out of view by a long body. Only `SheetBody` scrolls.
 */
const sideClasses: Record<SheetSide, string> = {
  right:
    'inset-y-0 right-0 h-full w-full border-l sm:max-w-md data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
  bottom:
    'inset-x-0 bottom-0 max-h-[85vh] w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
};

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  closeLabel = 'Close',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide;
  /** Named for the panel when "Close" alone would be ambiguous among several open regions. */
  closeLabel?: string;
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-0 shadow-lg duration-200',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden">
          <XIcon className="size-4" />
          <span className="sr-only">{closeLabel}</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex shrink-0 flex-col gap-1.5 border-b p-6 pr-12 text-left', className)}
      {...props}
    />
  );
}

/**
 * The scrolling region. It is focusable so a keyboard operator who cannot reach the overflowed
 * content through a control can still scroll it, which is a WCAG requirement for any scrollable
 * region that is not otherwise keyboard operable.
 */
function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      tabIndex={0}
      className={cn('min-h-0 flex-1 overflow-y-auto p-6 outline-hidden', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col-reverse gap-2 border-t p-6 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn('text-lg leading-tight font-semibold', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
