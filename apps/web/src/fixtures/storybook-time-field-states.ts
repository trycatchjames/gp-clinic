import type { TimeFieldOption } from '@/components/patterns/time-field';

export const storybookTimeFieldStates = {
  id: 'storybook-local-time-field-states',
  label: 'Appointment start time',
  hint: 'Type a local time or choose from the configured intervals.',
  timezone: 'Australia/Brisbane (AEST)',
  longTimezone: 'Australia/Lord_Howe (Lord Howe Daylight Time)',
  options12: [
    { value: '09:00', label: '9:00 am', detail: 'First available interval' },
    { value: '09:15', label: '9:15 am', detail: 'Unavailable', disabled: true },
    { value: '09:30', label: '9:30 am' },
    { value: '09:45', label: '9:45 am', detail: 'Long appointment interval' },
  ] satisfies readonly TimeFieldOption[],
  options24: [
    { value: '13:00', label: '13:00' },
    { value: '13:15', label: '13:15', disabled: true, detail: 'Unavailable' },
    { value: '13:30', label: '13:30' },
  ] satisfies readonly TimeFieldOption[],
  selected12: { value: '09:30', label: '9:30 am' },
  selected24: { value: '13:30', label: '13:30' },
  incomplete: '9:',
  error: 'Enter a complete local time.',
  states: {
    loading: 'Loading configured time choices…',
    empty: 'No configured times match “7:”.',
    failure: 'Time choices failed to load. Your typed time is preserved.',
  },
} as const;
