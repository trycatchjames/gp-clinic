import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table', () => {
  it('preserves native table semantics and explicit scopes', () => {
    render(
      <Table>
        <TableCaption>Fee comparison</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Item</TableHead>
            <TableHead scope="col" align="end">Fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>23</TableCell>
            <TableCell align="end">$76.35</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('table', { name: 'Fee comparison' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Item' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('columnheader', { name: 'Fee' })).toHaveClass('text-right', 'tabular-nums');
    expect(screen.getByRole('cell', { name: '$76.35' })).toHaveClass('text-right', 'tabular-nums');
  });

  it('exposes selected row state to assistive technology', () => {
    render(
      <Table>
        <TableCaption>Selected item</TableCaption>
        <TableBody>
          <TableRow aria-selected="true" data-state="selected">
            <TableCell>Selected service</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('row')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('row')).toHaveAttribute('data-state', 'selected');
  });
});
