import * as React from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableAlignment,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DataTableSort = {
  columnKey: string;
  direction: 'ascending' | 'descending';
};

type BaseColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: TableAlignment;
  headerClassName?: string;
  cellClassName?: string;
};

type StaticColumn<T> = BaseColumn<T> & {
  sortable?: false;
  sortLabel?: never;
};

type SortableColumn<T> = BaseColumn<T> & {
  sortable: true;
  sortLabel: string;
};

export type DataTableColumn<T> = StaticColumn<T> | SortableColumn<T>;

export type DataTablePagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

type DataTableBaseProps<T> = {
  caption: string;
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort) => void;
  pagination?: DataTablePagination;
  emptyState?: React.ReactNode;
  density?: 'compact' | 'comfortable';
  className?: string;
};

type DataTableWithoutExpansion<T> = DataTableBaseProps<T> & {
  renderExpandedRow?: never;
  expandedRowKeys?: never;
  onExpandedChange?: never;
  getRowLabel?: never;
};

type DataTableWithExpansion<T> = DataTableBaseProps<T> & {
  renderExpandedRow: (row: T) => React.ReactNode;
  expandedRowKeys: readonly string[];
  onExpandedChange: (row: T, expanded: boolean) => void;
  getRowLabel: (row: T) => string;
};

export type DataTableProps<T> = DataTableWithoutExpansion<T> | DataTableWithExpansion<T>;

function SortIcon({ direction }: { direction: DataTableSort['direction'] | null }) {
  if (direction === 'ascending') return <ArrowUp aria-hidden="true" className="size-3.5" />;
  if (direction === 'descending') return <ArrowDown aria-hidden="true" className="size-3.5" />;
  return <ChevronsUpDown aria-hidden="true" className="size-3.5 opacity-55" />;
}

function Pagination({ caption, pagination }: { caption: string; pagination: DataTablePagination }) {
  const pageCount = Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize));
  const page = Math.min(Math.max(1, pagination.page), pageCount);
  const firstItem = pagination.totalItems === 0 ? 0 : (page - 1) * pagination.pageSize + 1;
  const lastItem = Math.min(page * pagination.pageSize, pagination.totalItems);
  const pageSizeOptions = pagination.pageSizeOptions ?? [10, 25, 50];

  return (
    <nav
      aria-label={`${caption} pagination`}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-2 py-2"
    >
      <p className="text-xs tabular-nums text-muted-foreground">
        {firstItem}–{lastItem} of {pagination.totalItems}
      </p>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {pagination.onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => pagination.onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger size="sm" className="w-[4.5rem]" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <p className="min-w-20 text-center text-xs tabular-nums text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="First page"
            disabled={page <= 1}
            onClick={() => pagination.onPageChange(1)}
          >
            <ChevronFirst aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => pagination.onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => pagination.onPageChange(page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Last page"
            disabled={page >= pageCount}
            onClick={() => pagination.onPageChange(pageCount)}
          >
            <ChevronLast aria-hidden="true" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    caption,
    rows,
    columns,
    getRowKey,
    sort = null,
    onSortChange,
    pagination,
    emptyState,
    density = 'compact',
    className,
  } = props;
  const tableId = React.useId();
  const expandable = props.renderExpandedRow !== undefined;

  if (rows.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <section aria-label={caption} className={cn('overflow-hidden rounded-lg border bg-white', className)}>
      <Table data-density={density} className="min-w-max">
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="bg-muted/65">
          <TableRow className="hover:bg-transparent">
            {expandable && (
              <TableHead scope="col" className="w-10 px-1">
                <span className="sr-only">Details</span>
              </TableHead>
            )}
            {columns.map((column) => {
              const direction = sort?.columnKey === column.key ? sort.direction : null;
              const sortable = column.sortable && onSortChange !== undefined;
              return (
                <TableHead
                  key={column.key}
                  scope="col"
                  align={column.align}
                  aria-sort={sortable ? direction ?? 'none' : undefined}
                  className={column.headerClassName}
                >
                  {sortable ? (
                    <button
                      type="button"
                      className={cn(
                        'focus-visible:ring-ring -mx-1 inline-flex min-h-7 items-center gap-1 rounded-sm px-1 font-medium hover:text-foreground focus-visible:ring-2 focus-visible:outline-none',
                        column.align === 'end' && 'w-[calc(100%+0.5rem)] justify-end',
                      )}
                      aria-label={`Sort by ${column.sortLabel}${
                        direction ? `, currently ${direction}` : ''
                      }`}
                      onClick={() =>
                        onSortChange?.({
                          columnKey: column.key,
                          direction: direction === 'ascending' ? 'descending' : 'ascending',
                        })
                      }
                    >
                      <span>{column.header}</span>
                      <SortIcon direction={direction} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const rowKey = getRowKey(row);
            const expanded = expandable && props.expandedRowKeys.includes(rowKey);
            const detailId = `${tableId}-${rowKey.replace(/[^a-zA-Z0-9_-]/g, '-')}-details`;
            return (
              <React.Fragment key={rowKey}>
                <TableRow data-expanded={expanded || undefined}>
                  {expandable && (
                    <TableCell className="w-10 px-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        aria-label={`${expanded ? 'Hide' : 'Show'} details for ${props.getRowLabel(row)}`}
                        aria-expanded={expanded}
                        aria-controls={detailId}
                        onClick={() => props.onExpandedChange(row, !expanded)}
                      >
                        {expanded ? (
                          <ChevronDown aria-hidden="true" />
                        ) : (
                          <ChevronRight aria-hidden="true" />
                        )}
                      </Button>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      className={cn(
                        density === 'comfortable' && 'py-3',
                        column.cellClassName,
                      )}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
                {expandable && expanded && (
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell id={detailId} colSpan={columns.length + 1} className="p-0">
                      <div className="border-primary/45 ml-5 border-l-2 px-4 py-3">
                        {props.renderExpandedRow(row)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      {pagination && <Pagination caption={caption} pagination={pagination} />}
    </section>
  );
}
