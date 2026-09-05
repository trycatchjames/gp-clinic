const AU_LOCALE = 'en-AU';
const DEFAULT_FALLBACK = '—';

type NullableValue<T> = T | null | undefined;

type FallbackOptions = {
  fallback?: string;
};

type DateFormatOptions = FallbackOptions & {
  style?: 'numeric' | 'short' | 'long';
};

type TimeFormatOptions = FallbackOptions & {
  hourCycle?: 'h12' | 'h23';
  includeTimeZone?: boolean;
};

function validDate(value: string | number | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

/** Formats integer minor units as Australian dollars. Calculation remains caller-owned. */
export function formatCurrency(
  cents: NullableValue<number>,
  { fallback = DEFAULT_FALLBACK }: FallbackOptions = {},
): string {
  if (cents == null || !Number.isFinite(cents)) return fallback;
  return new Intl.NumberFormat(AU_LOCALE, {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Formats a calendar date without allowing an ISO date-only value to cross a timezone boundary. */
export function formatDate(
  value: NullableValue<string | number | Date>,
  { fallback = DEFAULT_FALLBACK, style = 'numeric' }: DateFormatOptions = {},
): string {
  if (value == null || value === '') return fallback;
  const isCalendarDate = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsed = isCalendarDate ? dateOnly(value) : validDate(value);
  if (!parsed) return fallback;

  return new Intl.DateTimeFormat(AU_LOCALE, {
    day: style === 'numeric' ? '2-digit' : 'numeric',
    month: style === 'numeric' ? '2-digit' : style,
    year: 'numeric',
    ...(isCalendarDate ? { timeZone: 'UTC' } : {}),
  }).format(parsed);
}

/** Formats an instant in an explicitly supplied IANA timezone. */
export function formatDateTime(
  value: NullableValue<string | number | Date>,
  timeZone: string,
  {
    fallback = DEFAULT_FALLBACK,
    hourCycle = 'h12',
    includeTimeZone = true,
  }: TimeFormatOptions = {},
): string {
  if (value == null || value === '') return fallback;
  const parsed = validDate(value);
  if (!parsed) return fallback;

  return new Intl.DateTimeFormat(AU_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hourCycle,
    timeZone,
    ...(includeTimeZone ? { timeZoneName: 'short' } : {}),
  }).format(parsed);
}

/** Formats a time in an explicitly supplied IANA timezone. */
export function formatTime(
  value: NullableValue<string | number | Date>,
  timeZone: string,
  {
    fallback = DEFAULT_FALLBACK,
    hourCycle = 'h12',
    includeTimeZone = false,
  }: TimeFormatOptions = {},
): string {
  if (value == null || value === '') return fallback;
  const parsed = validDate(value);
  if (!parsed) return fallback;

  return new Intl.DateTimeFormat(AU_LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle,
    timeZone,
    ...(includeTimeZone ? { timeZoneName: 'short' } : {}),
  }).format(parsed);
}

/** Groups common Australian phone-number shapes while preserving unrecognised input. */
export function formatPhoneNumber(
  value: NullableValue<string>,
  { fallback = DEFAULT_FALLBACK }: FallbackOptions = {},
): string {
  if (value == null || value.trim() === '') return fallback;

  const original = value.trim();
  const compact = original.replace(/[\s()-]/g, '');
  const international = compact.startsWith('+61');
  const national = international ? `0${compact.slice(3)}` : compact;

  let grouped: string | null = null;
  if (/^04\d{8}$/.test(national)) {
    grouped = `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
  } else if (/^0[2378]\d{8}$/.test(national)) {
    grouped = `${national.slice(0, 2)} ${national.slice(2, 6)} ${national.slice(6)}`;
  } else if (/^1[38]\d{4}$/.test(national)) {
    grouped = `${national.slice(0, 2)} ${national.slice(2, 4)} ${national.slice(4)}`;
  } else if (/^(1300|1800)\d{6}$/.test(national)) {
    grouped = `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
  }

  if (!grouped) return original;
  if (!international) return grouped;
  return `+61 ${grouped.slice(1)}`;
}

export function formatNumber(
  value: NullableValue<number>,
  { fallback = DEFAULT_FALLBACK }: FallbackOptions = {},
): string {
  if (value == null || !Number.isFinite(value)) return fallback;
  return new Intl.NumberFormat(AU_LOCALE).format(value);
}
