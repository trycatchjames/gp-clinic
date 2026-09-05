import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { StatePanel } from '@/components/patterns/state-panel';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import {
  storybookDataTableStates,
  type StorybookInvoice,
  type StorybookInvoiceLine,
} from '@/fixtures/storybook-data-table-states';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { DataTable, type DataTableColumn, type DataTableSort } from './data-table';

const invoices = storybookDataTableStates;

const invoiceColumns: readonly DataTableColumn<StorybookInvoice>[] = [
  {
    key: 'id',
    header: 'Invoice',
    cell: (invoice) => <span className="font-medium">{invoice.id}</span>,
    sortable: true,
    sortLabel: 'invoice number',
  },
  {
    key: 'issuedOn',
    header: 'Issued',
    cell: (invoice) => formatDate(invoice.issuedOn),
    sortable: true,
    sortLabel: 'issued date',
  },
  {
    key: 'arrangement',
    header: 'Arrangement',
    cell: (invoice) => invoice.arrangement,
    sortable: true,
    sortLabel: 'arrangement',
    cellClassName: 'min-w-56 max-w-80 whitespace-normal',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (invoice) => (
      <span className={invoice.status === 'Owing' ? 'font-medium text-warning-foreground' : undefined}>
        {invoice.status}
      </span>
    ),
    sortable: true,
    sortLabel: 'status',
  },
  {
    key: 'totalCents',
    header: 'Total',
    cell: (invoice) => formatCurrency(invoice.totalCents),
    sortable: true,
    sortLabel: 'total amount',
    align: 'end',
  },
  {
    key: 'owingCents',
    header: 'Owing',
    cell: (invoice) => formatCurrency(invoice.owingCents),
    sortable: true,
    sortLabel: 'amount owing',
    align: 'end',
  },
];

const lineColumns: readonly DataTableColumn<StorybookInvoiceLine>[] = [
  { key: 'code', header: 'Item', cell: (line) => <span className="font-medium">{line.code}</span> },
  {
    key: 'description',
    header: 'Description',
    cell: (line) => line.description,
    cellClassName: 'min-w-56 whitespace-normal',
  },
  { key: 'quantity', header: 'Qty', cell: (line) => line.quantity, align: 'end' },
  { key: 'feeCents', header: 'Amount', cell: (line) => formatCurrency(line.feeCents), align: 'end' },
];

function sortableValue(invoice: StorybookInvoice, key: string): string | number {
  if (key === 'totalCents' || key === 'owingCents') return invoice[key];
  if (key === 'issuedOn' || key === 'arrangement' || key === 'status' || key === 'id') {
    return invoice[key];
  }
  return '';
}

function sortedInvoices(sort: DataTableSort) {
  const direction = sort.direction === 'ascending' ? 1 : -1;
  return [...invoices].sort((left, right) => {
    const leftValue = sortableValue(left, sort.columnKey);
    const rightValue = sortableValue(right, sort.columnKey);
    return String(leftValue).localeCompare(String(rightValue), 'en-AU', { numeric: true }) * direction;
  });
}

function SortablePaginatedExample() {
  const [sort, setSort] = React.useState<DataTableSort>({
    columnKey: 'issuedOn',
    direction: 'descending',
  });
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const ordered = sortedInvoices(sort);
  const pageRows = ordered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DataTable
      caption="Synthetic patient account invoices"
      rows={pageRows}
      columns={invoiceColumns}
      getRowKey={(invoice) => invoice.id}
      sort={sort}
      onSortChange={(nextSort) => {
        setSort(nextSort);
        setPage(1);
      }}
      pagination={{
        page,
        pageSize,
        totalItems: invoices.length,
        pageSizeOptions: [5, 10, 25],
        onPageChange: setPage,
        onPageSizeChange: (nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        },
      }}
    />
  );
}

function HierarchyExample() {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<readonly string[]>(['INV-1049']);
  const visibleInvoices = invoices.slice(0, 5);

  return (
    <DataTable
      caption="Synthetic invoices with line-item details"
      rows={visibleInvoices}
      columns={invoiceColumns}
      getRowKey={(invoice) => invoice.id}
      expandedRowKeys={expandedRowKeys}
      getRowLabel={(invoice) => invoice.id}
      onExpandedChange={(invoice, expanded) =>
        setExpandedRowKeys((current) =>
          expanded ? [...current, invoice.id] : current.filter((key) => key !== invoice.id),
        )
      }
      renderExpandedRow={(invoice) => (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Line snapshot · {invoice.id}
          </p>
          <DataTable
            caption={`Line items for ${invoice.id}`}
            rows={invoice.lines}
            columns={lineColumns}
            getRowKey={(line) => line.id}
            className="rounded-md border-border/80"
          />
        </div>
      )}
    />
  );
}

function StoryHeader({ title, detail }: { title: string; detail: string }) {
  return (
    <header className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b pb-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Data table pattern</p>
        <h1 className="mt-0.5 text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </header>
  );
}

const meta = {
  title: 'Molecules/Data display/Data Table',
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.dataTable),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SortablePaginated: Story = {
  render: () => (
    <section data-evidence="storybook-data-table" className="mx-auto max-w-6xl">
      <StoryHeader title="Patient account history" detail="11 synthetic invoices · AUD" />
      <SortablePaginatedExample />
    </section>
  ),
};

export const Hierarchy: Story = {
  render: () => (
    <section data-evidence="storybook-data-table-hierarchy" className="mx-auto max-w-6xl">
      <StoryHeader title="Invoices and line snapshots" detail="Disclose supporting rows in place" />
      <HierarchyExample />
    </section>
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      caption="Synthetic patient account invoices"
      rows={[]}
      columns={invoiceColumns}
      getRowKey={(invoice) => invoice.id}
      emptyState={
        <StatePanel
          kind="empty"
          title="No invoices in this scope"
          description="Change the account filters to include a wider date range."
          compact
        />
      }
    />
  ),
};

export const ContentStress: Story = {
  render: () => <SortablePaginatedExample />,
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section data-evidence="storybook-data-table-narrow" aria-label="Narrow data table example">
      <StoryHeader title="Account history" detail="All columns remain available" />
      <SortablePaginatedExample />
    </section>
  ),
};

export const KeyboardFlow: Story = {
  render: () => (
    <div data-evidence="storybook-data-table-controls">
      <SortablePaginatedExample />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const issuedSort = canvas.getByRole('button', {
      name: 'Sort by issued date, currently descending',
    });

    issuedSort.focus();
    await expect(issuedSort).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('columnheader', { name: /Issued/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByText('Page 2 of 3')).toBeVisible();
  },
};
