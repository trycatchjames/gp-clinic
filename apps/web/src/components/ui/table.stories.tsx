import type { Meta, StoryObj } from '@storybook/react-vite';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookTableStates } from '@/fixtures/storybook-table-states';
import { formatCurrency } from '@/lib/formatters';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const fixture = storybookTableStates;

const meta = {
  title: 'Atoms/Data display/Table',
  component: Table,
  tags: ['autodocs', 'test', 'atom'],
  parameters: foundationParameters(foundationContracts.table),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

function FeeTable({ selectedCode }: { selectedCode?: string }) {
  const rows = [...fixture.feeRows, fixture.contentStress];
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <Table className="min-w-[660px]">
        <TableCaption className="sr-only">Synthetic fee comparison</TableCaption>
        <TableHeader className="bg-muted/65">
          <TableRow>
            <TableHead scope="col">Item</TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col" align="end">Practice fee</TableHead>
            <TableHead scope="col" align="end">Schedule benefit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const selected = row.code === selectedCode;
            return (
              <TableRow
                key={row.code}
                data-state={selected ? 'selected' : undefined}
                aria-selected={selected}
              >
                <TableCell className="font-medium">{row.code}</TableCell>
                <TableCell className="min-w-72 max-w-lg whitespace-normal">{row.description}</TableCell>
                <TableCell align="end">{formatCurrency(row.feeCents)}</TableCell>
                <TableCell align="end" className="text-muted-foreground">
                  {formatCurrency(row.benefitCents)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Five displayed items</TableCell>
            <TableCell align="end">{formatCurrency(rows.reduce((sum, row) => sum + row.feeCents, 0))}</TableCell>
            <TableCell align="end">{formatCurrency(rows.reduce((sum, row) => sum + row.benefitCents, 0))}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export const Default: Story = {
  render: () => <FeeTable />,
};

export const NumericComparison: Story = {
  render: () => (
    <section data-evidence="storybook-table-comparison" aria-labelledby="table-comparison-title" className="mx-auto max-w-5xl">
      <header className="mb-4 flex items-end justify-between gap-4 border-b pb-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Display atom</p>
          <h1 id="table-comparison-title" className="mt-0.5 text-xl font-semibold tracking-tight">
            Compact numeric comparison
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">Synthetic values · AUD</p>
      </header>
      <FeeTable />
    </section>
  ),
};

export const SelectedRow: Story = {
  render: () => <FeeTable selectedCode="36" />,
};

export const DenseContent: Story = {
  render: () => <FeeTable />,
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section data-evidence="storybook-table-narrow" aria-label="Narrow table example">
      <p className="mb-2 text-xs text-muted-foreground">Scroll horizontally to compare every column.</p>
      <FeeTable />
    </section>
  ),
};
