export const storybookTableStates = {
  feeRows: [
    { code: '23', description: 'Professional attendance · standard consultation', feeCents: 8230, benefitCents: 4260 },
    { code: '36', description: 'Professional attendance · long consultation', feeCents: 13180, benefitCents: 8270 },
    { code: '44', description: 'Professional attendance · prolonged consultation', feeCents: 19440, benefitCents: 12215 },
    { code: '91891', description: 'Telehealth attendance · standard consultation', feeCents: 8230, benefitCents: 4260 },
  ],
  contentStress: {
    code: 'DEMO-EXTENDED',
    description:
      'A deliberately long synthetic service description that demonstrates wrapping without hiding the comparable values',
    feeCents: 124800,
    benefitCents: 0,
  },
} as const;
