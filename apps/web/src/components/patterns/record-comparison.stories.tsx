import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ComparisonChoice, ComparisonRow } from './record-comparison';
import { RecordComparison } from './record-comparison';

const fixture = storybookMoleculeStates.comparison;
const rows = fixture.rows as readonly ComparisonRow[];

/** Resolution is caller state, exactly as a merge reviewer's decisions would be. */
function Resolving({
  evidence,
  initial = {},
  extraRows = [],
}: {
  evidence?: string;
  initial?: Record<string, ComparisonChoice>;
  extraRows?: readonly ComparisonRow[];
}) {
  const [chosen, setChosen] = useState<Record<string, ComparisonChoice>>(initial);
  const resolvable = [...rows, ...extraRows].map((row) =>
    row.status === 'same'
      ? row
      : {
          ...row,
          choice: {
            value: chosen[row.key] ?? null,
            allowBoth: row.key === 'contact',
            onChange: (value: ComparisonChoice) =>
              setChosen((current) => ({ ...current, [row.key]: value })),
          },
        },
  );

  const unresolved = resolvable.filter((row) => row.choice && row.choice.value === null).length;

  return (
    <div data-evidence={evidence} className="grid max-w-3xl gap-4">
      <p role="status" className="text-sm tabular-nums">
        {unresolved === 0
          ? 'Every difference has been resolved'
          : `${unresolved} of ${resolvable.filter((row) => row.choice).length} differences still to resolve`}
      </p>
      <RecordComparison
        label={fixture.label}
        leftLabel={fixture.leftLabel}
        rightLabel={fixture.rightLabel}
        rows={resolvable}
      />
    </div>
  );
}

const meta = {
  title: 'Molecules/Data display/Record Comparison',
  component: RecordComparison,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.recordComparison),
  args: {
    label: fixture.label,
    leftLabel: fixture.leftLabel,
    rightLabel: fixture.rightLabel,
    rows,
  },
} satisfies Meta<typeof RecordComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div data-evidence="comparison-differences" className="max-w-3xl">
      <RecordComparison {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Every value keeps the name of the side it came from, whatever the layout does.
    await expect(canvas.getAllByText(fixture.leftLabel)).toHaveLength(rows.length);
    await expect(canvas.getAllByText(fixture.rightLabel)).toHaveLength(rows.length);
    await expect(canvas.getByText('Conflict')).toBeVisible();
  },
};

/**
 * A recorded allergy against a statement of no known allergies. The pattern marks it; deciding that
 * it is dangerous, and who may resolve it, stays with the capability.
 */
export const Conflicts: Story = {
  render: (args) => (
    <div className="grid max-w-3xl gap-4">
      <Alert variant="destructive">
        <AlertTitle>A conflict needs a clinical reviewer</AlertTitle>
        <AlertDescription>{fixture.conflictNote}</AlertDescription>
      </Alert>
      <RecordComparison {...args} rows={rows.filter((row) => row.status === 'conflict')} />
    </div>
  ),
};

/** A side that does not hold a fact says so. A blank would read as agreement. */
export const MissingOnOneSide: Story = {
  args: { rows: rows.filter((row) => row.left === null || row.right === null) },
  render: (args) => (
    <div className="max-w-3xl">
      <RecordComparison {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText('Not recorded')).toHaveLength(2);
  },
};

/** One fact resolved, the rest untouched. No option is ever preselected by the pattern. */
export const Resolving_: Story = {
  name: 'Resolving',
  render: () => <Resolving evidence="comparison-resolving" initial={{ name: 'left' }} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groups = canvas.getAllByRole('radiogroup');

    // Only the fact the caller has resolved carries a choice; the others propose nothing.
    await expect(canvas.getAllByRole('radio', { checked: true })).toHaveLength(1);
    await expect(
      within(groups[0]).getByRole('radio', { name: `Keep ${fixture.leftLabel}` }),
    ).toBeChecked();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '4 of 5 differences still to resolve',
    );
  },
};

export const ContentStress: Story = {
  render: () => (
    <Resolving
      extraRows={[
        {
          key: 'postal',
          label: 'Postal address',
          left: fixture.longValue,
          right: null,
          status: 'differs',
        },
      ]}
    />
  ),
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: (args) => (
    <div data-evidence="comparison-narrow" className="w-full max-w-full">
      <RecordComparison {...args} rows={rows.slice(0, 4)} />
    </div>
  ),
};

/**
 * The facts are reached in the order they are read, and choosing one resolves only that one.
 */
export const KeyboardFlow: Story = {
  render: () => <Resolving evidence="comparison-keyboard" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groups = canvas.getAllByRole('radiogroup');

    await expect(groups[0]).toHaveAccessibleName('Name');
    const first = within(groups[0]).getByRole('radio', { name: `Keep ${fixture.leftLabel}` });

    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(first).toBeChecked();

    // Arrows move within one fact's options without choosing one: focus movement never selects.
    await userEvent.keyboard('{ArrowDown}');
    const other = within(groups[0]).getByRole('radio', { name: `Keep ${fixture.rightLabel}` });
    await expect(other).toHaveFocus();
    await expect(other).not.toBeChecked();
    await expect(first).toBeChecked();

    // Resolving one fact leaves every other fact untouched.
    const second = within(groups[1]).getByRole('radio', { name: `Keep ${fixture.leftLabel}` });
    await expect(second).not.toBeChecked();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 of 5 differences still to resolve');
  },
};
