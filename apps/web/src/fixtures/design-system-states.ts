export const designSystemStates = {
  id: 'design-system-states',
  controls: {
    statuses: ['Ready', 'Needs attention', 'Unavailable'],
  },
  form: {
    workspaceLabel: 'Front desk workspace',
    invalidEmail: 'not-an-email',
    defaultLocation: 'Northside Demo Clinic',
    handoverNote: 'Confirm the morning queue owner before opening.',
  },
} as const;
