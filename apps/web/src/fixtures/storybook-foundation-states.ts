export const storybookFoundationStates = {
  id: 'storybook-foundation-states',
  button: {
    primary: 'Save changes',
    secondary: 'Review details',
    destructive: 'Remove access',
    long: 'Confirm the selected appointment and return to the morning worklist',
  },
  field: {
    label: 'Notification email',
    hint: 'Receives non-clinical workspace notifications.',
    value: 'front-desk@example.test',
    invalidValue: 'not-an-email',
    error: 'Enter an email address in the format name@example.com.',
    longLabel: 'Email address used for operational notifications when the primary workspace contact is unavailable',
  },
  states: {
    empty: {
      title: 'No appointments match',
      description: 'Change or clear the current filters.',
    },
    loading: {
      title: 'Loading appointments',
      description: 'Checking the current appointment book.',
    },
    unavailable: {
      title: 'Appointments unavailable',
      description: 'The appointment service is not available right now.',
    },
    offline: {
      title: 'Working offline',
      description: 'Showing the most recently available appointment information.',
    },
    restricted: {
      title: 'Appointments restricted',
      description: 'Your current access does not include this appointment book.',
    },
    failure: {
      title: 'Appointments could not be loaded',
      description: 'The request failed. Try again without changing the current filters.',
    },
  },
} as const;
