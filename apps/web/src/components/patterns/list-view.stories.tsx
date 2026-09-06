import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Badge } from '@/components/ui/badge';
import { ListView, ListViewRow } from './list-view';

const fixture = storybookMoleculeStates.listView;
type Patient = (typeof fixture.patients)[number];

const meta = {
  title: 'Molecules/Lists/List View',
  component: ListView,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.listView),
  args: {
    label: fixture.label,
    items: fixture.patients.slice(0, 3),
    getKey: (patient) => patient.id,
    renderItem: renderPatient,
  },
} satisfies Meta<typeof ListView<Patient>>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderPatient(patient: Patient) {
  return (
    <ListViewRow
      title={patient.name}
      badges={
        patient.badge ? (
          <Badge variant={patient.badge === 'Inactive' ? 'outline' : 'warning'}>
            {patient.badge}
          </Badge>
        ) : null
      }
      meta={[`Born ${patient.dateOfBirth}`, patient.recordNumber, patient.location]}
      trailing={patient.lastSeen}
      footnote={patient.footnote}
    />
  );
}

/**
 * Selection is controlled by the caller. The list reports the choice with `aria-pressed`, a tick
 * and an accent rule — never colour alone — and reaching a row never chooses it.
 */
function PatientList({
  items = fixture.patients.slice(0, 3),
  initialSelected = null,
  density,
  onSelect = fn(),
}: {
  items?: readonly Patient[];
  initialSelected?: string | null;
  density?: 'compact' | 'comfortable';
  onSelect?: (patient: Patient) => void;
}) {
  const [selectedKey, setSelectedKey] = React.useState<string | null>(initialSelected);
  return (
    <ListView
      items={items}
      getKey={(patient) => patient.id}
      renderItem={renderPatient}
      label={fixture.label}
      selectedKey={selectedKey}
      density={density}
      onSelect={(patient) => {
        setSelectedKey(patient.id);
        onSelect(patient);
      }}
      className="max-w-2xl"
    />
  );
}

export const Default: Story = {
  render: () => <PatientList />,
};

export const Selected: Story = {
  render: () => (
    <section
      data-evidence="list-view-selection"
      aria-label="List view selection"
      className="max-w-2xl"
    >
      <PatientList initialSelected="p-4822" />
    </section>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('button');
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'true');
    await expect(rows[0]).toHaveAttribute('aria-pressed', 'false');
    await expect(within(rows[1]).getByText('Selected')).toBeInTheDocument();
  },
};

/**
 * The invariant this pattern exists to protect: arrowing down through candidate records moves
 * focus and nothing else. Opening the wrong patient record because the keyboard passed over it is
 * a clinical safety problem, not a nuisance.
 */
export const FocusWithoutSelection: Story = {
  render: () => <PatientList initialSelected="p-4821" />,
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('button');

    await userEvent.tab();
    await expect(rows[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(rows[1]).toHaveFocus();
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'false');
    await expect(rows[0]).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Comfortable: Story = {
  render: () => <PatientList density="comfortable" initialSelected="p-4821" />,
};

export const Compact: Story = {
  render: () => (
    <section
      data-evidence="list-view-density"
      aria-label="List view density"
      className="grid max-w-2xl gap-4"
    >
      <div className="grid gap-1.5">
        <p className="text-muted-foreground text-xs">Compact — the worklist default</p>
        <PatientList density="compact" initialSelected="p-4821" />
      </div>
      <div className="grid gap-1.5">
        <p className="text-muted-foreground text-xs">Comfortable</p>
        <PatientList density="comfortable" initialSelected="p-4821" />
      </div>
    </section>
  ),
};

/**
 * Two patients with the same date of birth, a long hyphenated name and a multi-line safety
 * footnote. The footnote wraps rather than truncating: a warning that has to be hovered to read is
 * not a warning.
 */
export const ContentStress: Story = {
  render: () => <PatientList items={fixture.patients} initialSelected="p-4822" />,
};

export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => <PatientList items={fixture.patients} initialSelected="p-4822" />,
};

/**
 * Arrows and Home/End move focus; Enter and Space select. Selection stays where the operator put
 * it when focus moves on.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <section data-evidence="list-view-keyboard" aria-label="List view keyboard">
      <PatientList />
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByRole('button');

    await userEvent.tab();
    await expect(rows[0]).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(rows[2]).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(rows[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'true');

    await userEvent.keyboard('{ArrowUp}');
    await expect(rows[0]).toHaveFocus();
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'true');
  },
};
