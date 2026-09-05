import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './data-table';

type Row = { id: string; name: string; amount: string };

const rows: Row[] = [
  { id: 'a', name: 'Invoice 1042', amount: '$82.30' },
  { id: 'b', name: 'Invoice 1043', amount: '$131.80' },
];

const columns: readonly DataTableColumn<Row>[] = [
  { key: 'name', header: 'Invoice', cell: (row) => row.name, sortable: true, sortLabel: 'invoice' },
  { key: 'amount', header: 'Amount', cell: (row) => row.amount, align: 'end' },
];

describe('DataTable', () => {
  it('exposes its caption, scoped headers, sort state and numeric alignment', () => {
    render(
      <DataTable
        caption="Patient invoices"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        sort={{ columnKey: 'name', direction: 'ascending' }}
        onSortChange={() => undefined}
      />,
    );

    expect(screen.getByRole('table', { name: 'Patient invoices' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Invoice/ })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('cell', { name: '$82.30' })).toHaveClass('text-right', 'tabular-nums');
  });

  it('reports a controlled sort request without reordering rows itself', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        caption="Patient invoices"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        sort={{ columnKey: 'name', direction: 'ascending' }}
        onSortChange={onSortChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Sort by invoice, currently ascending/ }));
    expect(onSortChange).toHaveBeenCalledWith({ columnKey: 'name', direction: 'descending' });
    expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Invoice 1042');
  });

  it('exposes page range, boundary states and controlled navigation', () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        caption="Patient invoices"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        pagination={{ page: 1, pageSize: 2, totalItems: 6, onPageChange }}
      />,
    );

    expect(screen.getByText('1–2 of 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    fireEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('controls hierarchical disclosure and associates the detail row', () => {
    const onExpandedChange = vi.fn();
    render(
      <DataTable
        caption="Patient invoices"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        expandedRowKeys={['a']}
        getRowLabel={(row) => row.name}
        onExpandedChange={onExpandedChange}
        renderExpandedRow={(row) => <p>Line items for {row.name}</p>}
      />,
    );

    const expanded = screen.getByRole('button', { name: 'Hide details for Invoice 1042' });
    expect(expanded).toHaveAttribute('aria-expanded', 'true');
    expect(expanded).toHaveAttribute('aria-controls');
    expect(screen.getByText('Line items for Invoice 1042')).toBeInTheDocument();

    fireEvent.click(expanded);
    expect(onExpandedChange).toHaveBeenCalledWith(rows[0], false);
  });

  it('places capability-supplied empty content outside an empty table', () => {
    render(
      <DataTable
        caption="Patient invoices"
        rows={[]}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyState={<p>No invoices in this scope</p>}
      />,
    );

    expect(screen.getByText('No invoices in this scope')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
