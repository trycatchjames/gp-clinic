export const storybookBadgeStates = {
  id: 'storybook-badge-states',
  variants: {
    default: 'Selected context',
    secondary: 'Administrative',
    outline: 'Inactive',
    destructive: 'Action failed',
    success: 'Completed',
    warning: 'Similar details',
    information: 'Manual record',
  },
  withIcon: {
    success: 'Identity checked',
    warning: 'Review required',
    information: 'Additional information',
  },
  long: 'Similar demographic details require confirmation before this record is opened',
  surfaces: {
    quiet: 'Inactive',
    strong: 'Administrative',
  },
} as const;
