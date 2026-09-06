import * as React from 'react';
import { Search } from 'lucide-react';
import { usePracticeId } from '@/lib/auth';
import { usePatientSearch } from '@/lib/queries';
import { describeError } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { StatePanel } from '@/components/patterns/state-panel';
import { FilterBar, FilterField } from '@/components/patterns/filter-bar';
import { ListView, ListViewRow } from '@/components/patterns/list-view';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatters';
import type { PatientSearchResultDto } from '@gp/sdk';
import { PATIENT_STATUS_LABELS, type PatientStatus } from '@gp/contracts';

export function PatientSearchRoute() {
  const practiceId = usePracticeId();
  const [q, setQ] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const queryRef = React.useRef<HTMLInputElement>(null);

  const hasQuery = Boolean(q.trim() || dateOfBirth);
  const search = usePatientSearch(practiceId, q, dateOfBirth);
  const results = search.data?.results ?? [];
  // A restricted record is not a candidate the receptionist may choose. It is
  // shown so a duplicate is not created, so it is kept out of the list whose
  // whole contract is that Enter selects a row.
  const candidates = results.filter((result) => !result.restricted);
  const restricted = results.filter((result) => result.restricted);
  const selected = candidates.find((result) => result.id === selectedId) ?? null;

  // A fresh search is a fresh decision — the previous selection cannot linger
  // and be mistaken for a match against the new identifiers.
  function updateQuery(next: { q?: string; dateOfBirth?: string }) {
    setSelectedId(null);
    if (next.q !== undefined) setQ(next.q);
    if (next.dateOfBirth !== undefined) setDateOfBirth(next.dateOfBirth);
  }

  // Clearing the selection unmounts the button that was just pressed, so send
  // focus somewhere deliberate rather than letting it fall back to the body.
  function clearSelection() {
    setSelectedId(null);
    queryRef.current?.focus();
  }

  return (
    <>
      <PageHeader title="Find a patient" density="compact" />

      <div className="space-y-3">
        <FilterBar
          label="Patient search"
          summary={
            hasQuery && search.isSuccess
              ? resultSummary(results.length, restricted.length, search.data)
              : hasQuery && search.isError
                ? 'Search failed'
                : undefined
          }
        >
          <FilterField
            label="Name, address, postcode, phone or record number"
            htmlFor="patient-search-query"
            hint="Search names, addresses, postcodes, phone numbers, Medicare cards or local record numbers."
            hideLabel
            grow
          >
            {(controlProps) => (
              <div className="relative">
                <Search
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  {...controlProps}
                  ref={queryRef}
                  value={q}
                  onChange={(event) => updateQuery({ q: event.target.value })}
                  placeholder="Name, address, postcode, phone or record no."
                  autoComplete="off"
                  className="pl-8"
                />
              </div>
            )}
          </FilterField>
          <FilterField
            label="Date of birth"
            htmlFor="patient-search-dob"
            hint="Combine with a name to tell similar patients apart."
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                type="date"
                value={dateOfBirth}
                onChange={(event) => updateQuery({ dateOfBirth: event.target.value })}
                className="w-44"
              />
            )}
          </FilterField>
        </FilterBar>

        {!hasQuery && (
          <p className="text-muted-foreground px-1 text-xs">
            Search by name, date of birth, address, phone or record number.
          </p>
        )}

        {hasQuery && search.isLoading && (
          <div className="space-y-2" aria-busy="true">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {/*
          A failure is not a result. The wording has to close the inference the
          screen would otherwise invite — search returned nothing, therefore this
          person is new — because acting on it registers a duplicate of someone
          the practice already holds a record for.
        */}
        {hasQuery && search.isError && (
          <StatePanel
            kind="failure"
            title="Search failed"
            description={
              <>
                {describeError(search.error)} This is not a result: a matching patient may still
                exist. Do not register a new patient until search is working.
              </>
            }
            action={
              <Button type="button" variant="outline" size="sm" onClick={() => search.refetch()}>
                Try the search again
              </Button>
            }
          />
        )}

        {hasQuery && search.isSuccess && results.length === 0 && (
          <StatePanel
            kind="empty"
            compact
            title="No matches"
            description="Try another name, date of birth, address or phone before registering."
          />
        )}

        {hasQuery && search.isSuccess && candidates.length > 0 && (
          <>
            {search.data?.truncated && (
              <Alert variant="warning">
                <AlertTitle>Refine your search</AlertTitle>
                <AlertDescription>
                  Showing the first {results.length} of {search.data.totalMatches} matches.
                </AlertDescription>
              </Alert>
            )}
            <ListView
              label="Matching patients"
              items={candidates}
              getKey={(result) => result.id}
              selectedKey={selectedId}
              onSelect={(result) => setSelectedId(result.id)}
              renderItem={(result) => <PatientRow result={result} />}
            />
          </>
        )}

        {/*
          Named once for the whole search rather than repeated on every row: the
          restriction is a fact about access, not about any one candidate, and
          the record number is what a request for access is made against.
        */}
        {restricted.length > 0 && (
          <StatePanel
            kind="restricted"
            compact
            title={
              restricted.length === 1
                ? 'One matching record is restricted'
                : `${restricted.length} matching records are restricted`
            }
            description="You can see that the record exists so you do not create a duplicate, but not its contact or Medicare details, and you cannot open it here."
            details={
              <ul className="space-y-1">
                {restricted.map((result) => (
                  <li key={result.id}>
                    <span className="text-foreground font-medium">{result.nameUsed}</span> · DOB{' '}
                    {formatDate(result.dateOfBirth)} · Record {result.localRecordNumber} · matched on{' '}
                    {result.matchedFields.join(' + ').toLowerCase()}
                  </li>
                ))}
              </ul>
            }
            action={
              <p className="text-muted-foreground max-w-lg text-xs">
                To act on {restricted.length === 1 ? 'this record' : 'these records'}, ask a treating
                practitioner to open {restricted.length === 1 ? 'it' : 'them'} for you, or request
                access from the practice privacy officer quoting the record number.
              </p>
            }
          />
        )}

        {selected && (
          <div
            role="status"
            aria-live="polite"
            className="border-primary flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
          >
            <p className="text-sm">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-medium">{selected.nameUsed}</span>
              <span className="text-muted-foreground">
                {' '}
                · {formatDate(selected.dateOfBirth)}
                {[selected.suburb, selected.postcode].filter(Boolean).length > 0
                  ? ` · ${[selected.suburb, selected.postcode].filter(Boolean).join(' ')}`
                  : ''}
              </span>
            </p>
            <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * A restricted match is counted, because it is a record the practice holds, but
 * it is named separately: a bare "3 results" above two rows reads as a screen
 * that has lost one.
 */
function resultSummary(
  total: number,
  restricted: number,
  data: { truncated: boolean; totalMatches: number } | undefined,
): string {
  const head = data?.truncated
    ? `${total} of ${data.totalMatches} results`
    : `${total} result${total === 1 ? '' : 's'}`;
  return restricted > 0 ? `${head}, ${restricted} restricted` : head;
}

function PatientRow({ result }: { result: PatientSearchResultDto }) {
  const place = [result.suburb, result.postcode].filter(Boolean).join(' ');
  return (
    <ListViewRow
      title={result.nameUsed}
      badges={
        <>
          {result.status !== 'active' && (
            <Badge variant="outline">
              {PATIENT_STATUS_LABELS[result.status as PatientStatus] ?? result.status}
            </Badge>
          )}
          {result.similarMatch && <Badge variant="warning">Similar details</Badge>}
        </>
      }
      meta={[
        `DOB ${formatDate(result.dateOfBirth)}`,
        place || null,
        result.maskedContact && `Phone ${result.maskedContact}`,
        result.legalName && `Legal name: ${result.legalName}`,
        result.matchedFields.includes('Medicare card number') && result.maskedMedicareNumber
          ? `Medicare ${result.maskedMedicareNumber}${result.medicareIrn ? ` · IRN ${result.medicareIrn}` : ''} · not verified`
          : `Match: ${result.matchedFields.join(' + ')}`,
      ]}
      trailing={`Record ${result.localRecordNumber}`}
    />
  );
}
