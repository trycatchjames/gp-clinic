import * as React from 'react';
import { Check, CircleDashed, LockKeyhole, Search, TriangleAlert } from 'lucide-react';
import { usePracticeId } from '@/lib/auth';
import { usePatientSearch } from '@/lib/queries';
import { describeError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge, toneClasses } from '@/components/tone';
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

  const summary =
    hasQuery && search.isSuccess
      ? resultSummary(results.length, restricted.length, search.data)
      : hasQuery && search.isError
        ? 'Search failed'
        : undefined;

  return (
    <>
      <PageHeader title="Find a patient" density="compact" />

      <div className="space-y-3">
        {/*
          Filters are a means to the result, not the content of the screen, so
          they get one compact row with the result summary beside them.
        */}
        <div
          role="search"
          aria-label="Patient search"
          className="flex flex-wrap items-end gap-2 rounded-lg border bg-card p-2"
        >
          <Field className="min-w-56 flex-1">
            <FieldLabel htmlFor="patient-search-query" className="sr-only">
              Name, address, postcode, phone or record number
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="patient-search-query"
                ref={queryRef}
                value={q}
                onChange={(event) => updateQuery({ q: event.target.value })}
                placeholder="Name, address, postcode, phone or record no."
                autoComplete="off"
                aria-describedby="patient-search-query-description"
              />
            </InputGroup>
          </Field>
          <Field className="w-auto shrink-0">
            <FieldLabel htmlFor="patient-search-dob" className="text-xs">
              Date of birth
            </FieldLabel>
            <Input
              id="patient-search-dob"
              type="date"
              value={dateOfBirth}
              onChange={(event) => updateQuery({ dateOfBirth: event.target.value })}
              aria-describedby="patient-search-dob-description"
              className="w-44"
            />
          </Field>
          {/* Outside the fields: Field widens a visually hidden child to its text. */}
          <p id="patient-search-query-description" className="sr-only">
            Search names, addresses, postcodes, phone numbers, Medicare cards or local record
            numbers.
          </p>
          <p id="patient-search-dob-description" className="sr-only">
            Combine with a name to tell similar patients apart.
          </p>
          {summary && (
            <p className="text-muted-foreground ml-auto self-center text-xs" aria-live="polite">
              {summary}
            </p>
          )}
        </div>

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
          <Alert variant="destructive" aria-label="Search failed">
            <TriangleAlert />
            <AlertTitle>Search failed</AlertTitle>
            <AlertDescription>
              <p>
                {describeError(search.error)} This is not a result: a matching patient may still
                exist. Do not register a new patient until search is working.
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => search.refetch()}>
                Try the search again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {hasQuery && search.isSuccess && results.length === 0 && (
          <Empty role="region" aria-label="No matches" className="border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleDashed />
              </EmptyMedia>
              <EmptyTitle>No matches</EmptyTitle>
              <EmptyDescription>
                Try another name, date of birth, address or phone before registering.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {hasQuery && search.isSuccess && candidates.length > 0 && (
          <>
            {search.data?.truncated && (
              <Alert className={toneClasses.warning}>
                <AlertTitle>Refine your search</AlertTitle>
                <AlertDescription>
                  Showing the first {results.length} of {search.data.totalMatches} matches.
                </AlertDescription>
              </Alert>
            )}
            <ResultList
              results={candidates}
              selectedId={selectedId}
              onSelect={(result) => setSelectedId(result.id)}
            />
          </>
        )}

        {/*
          Named once for the whole search rather than repeated on every row: the
          restriction is a fact about access, not about any one candidate, and
          the record number is what a request for access is made against.
        */}
        {restricted.length > 0 && (
          <RestrictedMatches restricted={restricted} />
        )}

        {selected && (
          <div
            role="status"
            aria-live="polite"
            className="border-primary flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2"
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

/**
 * Candidates are buttons rather than `role="option"`: choosing a patient is an
 * action with consequences, not a form value, and `aria-pressed` reports the
 * current choice. Arrow keys move focus without choosing, so reaching a record
 * can never open it by accident, and the chosen row carries a tick and a
 * leading rule as well as its tint.
 */
function ResultList({
  results,
  selectedId,
  onSelect,
}: {
  results: readonly PatientSearchResultDto[];
  selectedId: string | null;
  onSelect: (result: PatientSearchResultDto) => void;
}) {
  const rowRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: results.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    rowRefs.current[Math.max(0, Math.min(next, results.length - 1))]?.focus();
  }

  return (
    <ul aria-label="Matching patients" className="divide-y rounded-lg border bg-card">
      {results.map((result, index) => {
        const isSelected = result.id === selectedId;
        return (
          <li key={result.id}>
            <Item
              asChild
              size="sm"
              className={cn(
                'relative rounded-none text-left hover:bg-muted',
                isSelected &&
                  'bg-accent before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary',
              )}
            >
              <button
                ref={(element) => {
                  rowRefs.current[index] = element;
                }}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(result)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <PatientRow result={result} />
                {isSelected && (
                  <>
                    <Check className="text-primary size-4 shrink-0 self-start" aria-hidden="true" />
                    <span className="sr-only">Selected</span>
                  </>
                )}
              </button>
            </Item>
          </li>
        );
      })}
    </ul>
  );
}

function PatientRow({ result }: { result: PatientSearchResultDto }) {
  const place = [result.suburb, result.postcode].filter(Boolean).join(' ');
  const facts = [
    `DOB ${formatDate(result.dateOfBirth)}`,
    place || null,
    result.maskedContact && `Phone ${result.maskedContact}`,
    result.legalName && `Legal name: ${result.legalName}`,
    result.matchedFields.includes('Medicare card number') && result.maskedMedicareNumber
      ? `Medicare ${result.maskedMedicareNumber}${result.medicareIrn ? ` · IRN ${result.medicareIrn}` : ''} · not verified`
      : `Match: ${result.matchedFields.join(' + ')}`,
  ].filter(Boolean);
  return (
    <>
      <ItemContent className="min-w-0 gap-0.5">
        <ItemTitle>
          {result.nameUsed}
          {result.status !== 'active' && (
            <Badge variant="outline">
              {PATIENT_STATUS_LABELS[result.status as PatientStatus] ?? result.status}
            </Badge>
          )}
          {result.similarMatch && <StatusBadge tone="warning">Similar details</StatusBadge>}
        </ItemTitle>
        <ItemDescription className="truncate text-xs">
          {facts.map((fact, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              {fact}
            </React.Fragment>
          ))}
        </ItemDescription>
      </ItemContent>
      <span className="text-muted-foreground tabular shrink-0 self-start text-xs">
        Record {result.localRecordNumber}
      </span>
    </>
  );
}

function RestrictedMatches({ restricted }: { restricted: readonly PatientSearchResultDto[] }) {
  const title =
    restricted.length === 1
      ? 'One matching record is restricted'
      : `${restricted.length} matching records are restricted`;
  return (
    <Empty role="region" aria-label={title} className="border bg-muted/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LockKeyhole />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          You can see that the record exists so you do not create a duplicate, but not its contact
          or Medicare details, and you cannot open it here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="text-muted-foreground max-w-lg text-xs">
        <ul className="space-y-1">
          {restricted.map((result) => (
            <li key={result.id}>
              <span className="text-foreground font-medium">{result.nameUsed}</span> · DOB{' '}
              {formatDate(result.dateOfBirth)} · Record {result.localRecordNumber} · matched on{' '}
              {result.matchedFields.join(' + ').toLowerCase()}
            </li>
          ))}
        </ul>
        <p>
          To act on {restricted.length === 1 ? 'this record' : 'these records'}, ask a treating
          practitioner to open {restricted.length === 1 ? 'it' : 'them'} for you, or request access
          from the practice privacy officer quoting the record number.
        </p>
      </EmptyContent>
    </Empty>
  );
}
