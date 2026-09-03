export const designSystemStates = {
  id: 'design-system-states',
  controls: {
    statuses: ['Ready', 'Needs attention', 'Unavailable'],
  },
  list: [
    {
      id: 'record-1',
      name: 'Amelia Hart',
      facts: ['DOB 12 Sep 1984', 'Brunswick 3056', 'Phone •••• ••• 214'],
      reference: 'Record R000121',
      similar: false,
    },
    {
      id: 'record-2',
      name: 'Amelia Harte',
      facts: ['DOB 12 Sep 1984', 'Coburg 3058', 'Phone •••• ••• 907'],
      reference: 'Record R000338',
      similar: true,
    },
    {
      id: 'record-3',
      name: 'Samir Khan',
      facts: ['DOB 3 Feb 1971', 'Preston 3072', 'Phone •••• ••• 441'],
      reference: 'Record R000502',
      similar: false,
    },
  ],
  appointments: [
    { time: '8:40 am', name: 'Sam Reed', kind: 'Review', state: 'Arrived' },
    { time: '9:20 am', name: 'Amelia Hart', kind: 'Standard', state: 'Ready' },
    { time: '10:00 am', name: 'Taylor Chen', kind: 'Long', state: 'Confirmed' },
  ],
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
