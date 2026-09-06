import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TriangleAlert } from 'lucide-react';
import { foundationContracts, foundationParameters } from '@/design-system/storybook/define-foundation';
import { storybookMoleculeStates } from '@/fixtures/storybook-molecule-states';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterBar, FilterField } from './filter-bar';

const fixture = storybookMoleculeStates.filterBar;

const meta = {
  title: 'Molecules/Search/Filter Bar',
  component: FilterBar,
  tags: ['autodocs', 'test', 'molecule'],
  parameters: foundationParameters(foundationContracts.filterBar),
  args: {
    label: fixture.label,
    children: null,
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The bar is one compact line above the worklist. The result summary shares that line rather than
 * pushing the records down the page, and it is polite: it reports the count without interrupting
 * whoever is still typing.
 */
function PatientFilterBar({
  idPrefix,
  query = '',
  location = 'all',
  status = 'active',
  summary,
  queryLabel = fixture.queryLabel,
  statusLabel = fixture.statusLabel,
  regionLabel = fixture.label,
}: {
  idPrefix: string;
  query?: string;
  location?: string;
  status?: string;
  summary?: ReactNode;
  queryLabel?: string;
  statusLabel?: string;
  /** Distinguishes stacked instances on the state sheet: two landmarks may not share a name. */
  regionLabel?: string;
}) {
  return (
    <FilterBar label={regionLabel} summary={summary}>
      <FilterField
        label={queryLabel}
        htmlFor={`${idPrefix}-query`}
        hint={fixture.queryHint}
        hideLabel
        grow
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            type="search"
            placeholder={fixture.queryPlaceholder}
            defaultValue={query}
          />
        )}
      </FilterField>

      <FilterField label={fixture.locationLabel} htmlFor={`${idPrefix}-location`}>
        {(controlProps) => (
          <Select defaultValue={location}>
            <SelectTrigger id={controlProps.id} className="w-52" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fixture.locations.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FilterField>

      <FilterField label={statusLabel} htmlFor={`${idPrefix}-status`}>
        {(controlProps) => (
          <Select defaultValue={status}>
            <SelectTrigger id={controlProps.id} className="w-44" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fixture.statuses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FilterField>
    </FilterBar>
  );
}

export const Default: Story = {
  render: () => <PatientFilterBar idPrefix="default" summary={fixture.initialSummary} />,
};

export const ActiveFilters: Story = {
  render: () => (
    <PatientFilterBar
      idPrefix="active"
      query="tran"
      location="northside"
      summary={fixture.activeSummary}
    />
  ),
};

export const Searching: Story = {
  render: () => (
    <PatientFilterBar idPrefix="searching" query="tra" summary={fixture.searchingSummary} />
  ),
};

/**
 * No matches is a successful search that found nothing. It reads differently from a failure, and
 * the filters that produced it stay on screen so they can be relaxed.
 */
export const NoMatches: Story = {
  render: () => (
    <PatientFilterBar
      idPrefix="nomatches"
      query="zzzz"
      location="harbour"
      summary={fixture.noMatchesSummary}
    />
  ),
};

/**
 * A partial result says what is missing and why. Showing seven of twelve patients without saying so
 * would let a clinician conclude a record does not exist.
 */
export const PartialFailure: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-3">
      <PatientFilterBar idPrefix="partial" query="tran" summary={fixture.partialSummary} />
      <Alert variant="warning">
        <TriangleAlert aria-hidden="true" />
        <AlertTitle>Some results are missing</AlertTitle>
        <AlertDescription>{fixture.partialNotice}</AlertDescription>
      </Alert>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <section
      data-evidence="filter-bar-states"
      aria-label="Filter bar states"
      className="grid max-w-4xl gap-4"
    >
      <PatientFilterBar
        idPrefix="s-initial"
        regionLabel={`${fixture.label} — initial`}
        summary={fixture.initialSummary}
      />
      <PatientFilterBar
        idPrefix="s-searching"
        regionLabel={`${fixture.label} — searching`}
        query="tra"
        summary={fixture.searchingSummary}
      />
      <PatientFilterBar
        idPrefix="s-active"
        regionLabel={`${fixture.label} — filters applied`}
        query="tran"
        location="northside"
        summary={fixture.activeSummary}
      />
      <PatientFilterBar
        idPrefix="s-none"
        regionLabel={`${fixture.label} — no matches`}
        query="zzzz"
        summary={fixture.noMatchesSummary}
      />
      <PatientFilterBar
        idPrefix="s-partial"
        regionLabel={`${fixture.label} — partial results`}
        query="tran"
        summary={fixture.partialSummary}
      />
    </section>
  ),
};

export const LongLabels: Story = {
  render: () => (
    <PatientFilterBar
      idPrefix="long"
      queryLabel={fixture.longQueryLabel}
      statusLabel={fixture.longFilterLabel}
      summary={fixture.activeSummary}
    />
  ),
};

/**
 * At 360 pixels the filters wrap in task order, the query keeps the full width, and the summary
 * stays visible below them rather than being clipped.
 */
export const Narrow: Story = {
  globals: {
    viewport: { value: 'clinicalNarrow', isRotated: false },
  },
  render: () => (
    <section data-evidence="filter-bar-narrow" aria-label="Filter bar narrow">
      <PatientFilterBar idPrefix="narrow" query="tran" summary={fixture.activeSummary} />
    </section>
  ),
};

/**
 * The query is the first tab stop, then each filter in task order. A hidden label still names the
 * control, so the search box is never announced as an unlabelled text field.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <section data-evidence="filter-bar-keyboard" aria-label="Filter bar keyboard">
      <PatientFilterBar idPrefix="keyboard" summary={fixture.initialSummary} />
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('search', { name: fixture.label });
    const query = within(region).getByRole('searchbox', { name: fixture.queryLabel });

    await expect(query).toHaveAccessibleDescription(fixture.queryHint);

    await userEvent.tab();
    await expect(query).toHaveFocus();

    await userEvent.tab();
    await expect(within(region).getByLabelText(fixture.locationLabel)).toHaveFocus();

    await userEvent.tab();
    await expect(within(region).getByLabelText(fixture.statusLabel)).toHaveFocus();
  },
};
