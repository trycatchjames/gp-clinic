import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { DataTable, type DataTableColumn } from './data-table';
import type { BulkSelectionAction } from './bulk-selection';
import { BulkSelectionBar } from './bulk-selection';

const fixture = storybookMoleculeStates.bulkSelection;
type QueueRow = (typeof fixture.rows)[number];

const noun = fixture.noun as unknown as readonly [string, string];

const columns: readonly DataTableColumn<QueueRow>[] = [
  { key: 'patient', header: 'Patient', cell: (row) => row.patient },
  { key: 'kind', header: 'Result', cell: (row) => row.kind },
  { key: 'received', header: 'Received', cell: (row) => row.received },
  { key: 'owner', header: 'Responsible', cell: (row) => row.owner },
  { key: 'state', header: 'State', cell: (row) => row.state },
];

const blockedCount = fixture.rows.filter((row) => row.restricted !== null).length;

type QueueProps = {
  /** Each queue on a page needs its own name; two landmarks sharing one are indistinguishable. */
  label?: string;
  caption?: string;
  initialSelection?: readonly string[];
  offPageCount?: number;
  selectAll?: boolean;
  blockDisposition?: boolean;
  longAction?: boolean;
  evidence?: string;
};

/**
 * The bar and the queue it acts on, wired the way a capability would wire them: the selection is
 * caller state, and nothing here decides which results may be reassigned.
 */
function Queue({
  label = fixture.label,
  caption = fixture.caption,
  initialSelection = [],
  offPageCount = 0,
  selectAll,
  blockDisposition,
  longAction,
  evidence,
}: QueueProps) {
  const [selected, setSelected] = useState<readonly string[]>(initialSelection);

  const actions: BulkSelectionAction[] = [
    { id: 'reassign', label: longAction ? fixture.longAction : fixture.reassignLabel, onSelect: fn() },
  ];
  if (blockDisposition) {
    actions.push({
      id: 'disposition',
      label: fixture.dispositionLabel,
      blockedReason: fixture.dispositionBlocked,
      onSelect: fn(),
    });
  }

  return (
    <div data-evidence={evidence} className="grid gap-3">
      <BulkSelectionBar
        label={label}
        selectedCount={selected.length + offPageCount}
        offPageCount={offPageCount}
        noun={noun}
        excluded={{ count: blockedCount, reason: fixture.clearedReason }}
        selectAll={selectAll ? { label: fixture.selectAllLabel, onSelect: fn() } : undefined}
        actions={actions}
        onClear={() => setSelected([])}
      />
      <DataTable
        caption={caption}
        rows={fixture.rows}
        columns={columns}
        getRowKey={(row) => row.id}
        selection={{
          selectedRowKeys: selected,
          pageSelectionLabel: fixture.pageLabel,
          getRowSelectionLabel: (row) => `${row.patient}, ${row.kind}, received ${row.received}`,
          getBlockedReason: (row) => row.restricted ?? undefined,
          onRowSelectedChange: (row, next) =>
            setSelected((current) =>
              next ? [...current, row.id] : current.filter((id) => id !== row.id),
            ),
          onPageSelectedChange: (rows, next) =>
            setSelected((current) => {
              const keys: string[] = rows.map((row) => row.id);
              return next
                ? [...current, ...keys.filter((key) => !current.includes(key))]
                : current.filter((key) => !keys.includes(key));
            }),
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Molecules/Lists/Bulk Selection',
  component: BulkSelectionBar,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.bulkSelection),
  args: {
    label: fixture.label,
    selectedCount: 0,
    noun,
    onClear: fn(),
  },
} satisfies Meta<typeof BulkSelectionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Nothing is selected. The bar keeps its shape and offers no action over the records, so the first
 * tick does not shift the rows beneath it and nothing offers to act on an empty set.
 */
export const Default: Story = {
  render: () => <Queue />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(`No ${noun[1]} selected`)).toBeVisible();
    await expect(canvas.queryByRole('button', { name: fixture.reassignLabel })).toBeNull();
    // Clearing stays put, so it cannot take a keyboard operator's focus with it.
    await expect(canvas.getByRole('button', { name: 'Clear selection' })).toBeVisible();
  },
};

/** Some of the page. The group control reports `mixed`, not checked. */
export const PartialPage: Story = {
  render: () => <Queue initialSelection={[fixture.rows[0].id, fixture.rows[2].id]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('checkbox', { name: `Select ${fixture.pageLabel}` }),
    ).toHaveAttribute('aria-checked', 'mixed');
    await expect(canvas.getByRole('status')).toHaveTextContent(`2 ${noun[1]} selected`);
  },
};

/**
 * Every selectable row on the page. The blocked row is not part of the group the header control
 * covers, so "all on this page" never quietly includes a result the caller has refused.
 */
export const PageSelected: Story = {
  render: () => (
    <Queue
      initialSelection={fixture.rows.filter((row) => row.restricted === null).map((row) => row.id)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('checkbox', { name: `Select ${fixture.pageLabel}` }),
    ).toBeChecked();
  },
};

/**
 * A selection that reaches past the visible rows says so. Without that sentence the count reads as
 * "what I can see", and the operator commits to records they never looked at.
 */
export const BeyondPage: Story = {
  render: () => (
    <Queue
      evidence="bulk-selection-beyond-page"
      initialSelection={fixture.rows.filter((row) => row.restricted === null).map((row) => row.id)}
      offPageCount={17}
      selectAll
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('17 not on this page');
    await expect(canvas.getByRole('button', { name: fixture.selectAllLabel })).toBeEnabled();
  },
};

/**
 * A result the operator may not act on is disabled and carries its reason, and an action that may
 * never be taken over a selection is refused with the rule that forbids it.
 */
export const BlockedRows: Story = {
  render: () => (
    <Queue
      evidence="bulk-selection-blocked"
      initialSelection={[fixture.rows[0].id, fixture.rows[1].id]}
      blockDisposition
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blocked = fixture.rows.find((row) => row.restricted !== null);
    const control = canvas.getByRole('checkbox', {
      name: `Select ${blocked?.patient}, ${blocked?.kind}, received ${blocked?.received}`,
    });

    await expect(control).toBeDisabled();
    await expect(control).toHaveAccessibleDescription(blocked?.restricted ?? '');

    const disposition = canvas.getByRole('button', { name: fixture.dispositionLabel });
    await expect(disposition).toBeDisabled();
    await expect(disposition).toHaveAccessibleDescription(
      `${fixture.dispositionLabel}: ${fixture.dispositionBlocked}`,
    );
  },
};

/** Resting, partly selected and reaching beyond the page, in the order an operator meets them. */
export const InTable: Story = {
  render: () => (
    <div data-evidence="bulk-selection-states" className="grid gap-8">
      <Queue label="Selected results, none" caption="Results waiting for review, none selected" />
      <Queue
        label="Selected results, part of this page"
        caption="Results waiting for review, part of this page selected"
        initialSelection={[fixture.rows[0].id, fixture.rows[2].id]}
      />
      <Queue
        label="Selected results, beyond this page"
        caption="Results waiting for review, selection beyond this page"
        initialSelection={fixture.rows.filter((row) => row.restricted === null).map((row) => row.id)}
        offPageCount={17}
        selectAll
        blockDisposition
      />
    </div>
  ),
};

export const ContentStress: Story = {
  render: () => (
    <Queue
      initialSelection={[fixture.rows[4].id]}
      offPageCount={233}
      selectAll
      blockDisposition
      longAction
    />
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <div data-evidence="bulk-selection-narrow" className="w-full max-w-full">
      <Queue initialSelection={[fixture.rows[0].id, fixture.rows[2].id]} offPageCount={17} selectAll />
    </div>
  ),
};

/**
 * Space selects; nothing else does. Tab reaches the group control before the rows it covers, and
 * clearing returns to a control that survives the change rather than a row that has just lost its
 * state.
 */
export const KeyboardFlow: Story = {
  render: () => <Queue evidence="bulk-selection-keyboard" initialSelection={[fixture.rows[0].id]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('checkbox', {
      name: `Select ${fixture.rows[0].patient}, ${fixture.rows[0].kind}, received ${fixture.rows[0].received}`,
    });
    const second = canvas.getByRole('checkbox', {
      name: `Select ${fixture.rows[1].patient}, ${fixture.rows[1].kind}, received ${fixture.rows[1].received}`,
    });

    second.focus();
    await expect(second).not.toBeChecked();
    await expect(canvas.getByRole('status')).toHaveTextContent(`1 ${noun[0]} selected`);

    await userEvent.keyboard(' ');
    await expect(second).toBeChecked();
    await expect(canvas.getByRole('status')).toHaveTextContent(`2 ${noun[1]} selected`);

    const clear = canvas.getByRole('button', { name: 'Clear selection' });
    clear.focus();
    await userEvent.keyboard('{Enter}');
    await expect(first).not.toBeChecked();
    await expect(second).not.toBeChecked();
    await expect(canvas.getByText(`No ${noun[1]} selected`)).toBeVisible();
    // The control the operator just used is still there, and still has focus.
    await expect(clear).toHaveFocus();
  },
};
