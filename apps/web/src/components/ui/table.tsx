import * as React from 'react';
import { cn } from '@/lib/utils';

export type TableAlignment = 'start' | 'center' | 'end';

const alignmentClasses: Record<TableAlignment, string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right tabular-nums',
};

function Table({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<'table'> & { containerClassName?: string }) {
  return (
    <div
      data-slot="table-container"
      className={cn('relative w-full overflow-x-auto', containerClassName)}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm leading-5', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t bg-muted/45 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-accent/45',
        'data-[state=selected]:bg-accent/55 data-[state=selected]:shadow-[inset_2px_0_0_var(--color-primary)]',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  align = 'start',
  ...props
}: Omit<React.ComponentProps<'th'>, 'align'> & { align?: TableAlignment }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-9 px-3 align-middle text-xs font-medium whitespace-nowrap text-muted-foreground',
        alignmentClasses[align],
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  align = 'start',
  ...props
}: Omit<React.ComponentProps<'td'>, 'align'> & { align?: TableAlignment }) {
  return (
    <td
      data-slot="table-cell"
      className={cn('px-3 py-2 align-middle', alignmentClasses[align], className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-3 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
