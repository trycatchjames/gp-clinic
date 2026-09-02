export const designSystemStates = {
  id: 'design-system-states',
  controls: {
    statuses: ['Ready', 'Needs attention', 'Unavailable'],
  },
  context: {
    title: 'Amelia Hart',
    description: 'Synthetic record · ordinary consultation context',
    facts: [
      { label: 'DOB', value: '14 May 1986', tabular: true },
      { label: 'Pronouns', value: 'she/her' },
      { label: 'Patient no.', value: 'DEMO-1048', tabular: true },
    ],
  },
  summary: [
    {
      label: 'Appointment',
      value: 'Today · 9:20 am',
      supportingText: 'Standard consultation',
      tabular: true,
    },
    { label: 'Practitioner', value: 'Dr Morgan Lee', supportingText: 'Room 3' },
    {
      label: 'Practice location',
      value: 'Northside Demo Clinic',
      supportingText: 'Brisbane · AEST',
    },
  ],
  form: {
    workspaceLabel: 'Front desk workspace',
    invalidEmail: 'not-an-email',
    defaultLocation: 'Northside Demo Clinic',
    handoverNote: 'Confirm the morning queue owner before opening.',
  },
} as const;
