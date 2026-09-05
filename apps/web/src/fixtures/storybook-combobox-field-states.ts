import type { ComboboxOption } from '@/components/patterns/combobox-field';

export const storybookComboboxFieldStates = {
  id: 'storybook-combobox-field-states',
  label: 'Referral recipient',
  hint: 'Choose the intended service or practitioner from the local directory.',
  placeholder: 'Search by name, service or suburb',
  options: [
    {
      value: 'northside-physio',
      label: 'Northside Physiotherapy',
      detail: 'Physiotherapy · Carlton North VIC 3054',
    },
    {
      value: 'harbour-cardiology',
      label: 'Dr Samira Malik — Harbour Cardiology',
      detail: 'Cardiology · Geelong VIC 3220',
    },
    {
      value: 'community-dietetics',
      label: 'Community Dietetics and Diabetes Education Service',
      detail: 'Dietitian and diabetes educator · Sunshine West VIC 3020',
    },
    {
      value: 'former-provider',
      label: 'Former consulting service',
      detail: 'Unavailable for new referrals',
      disabled: true,
    },
  ] satisfies readonly ComboboxOption[],
  selectedValue: 'harbour-cardiology',
  states: {
    loading: 'Searching the local recipient directory…',
    empty: 'No recipients match “paediatric respiratory”.',
    failure: 'Recipient search failed. The current selection has not changed.',
  },
  error: 'Choose a recipient before previewing the referral.',
} as const;
