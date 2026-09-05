export type StorybookInvoiceLine = {
  id: string;
  code: string;
  description: string;
  quantity: number;
  feeCents: number;
};

export type StorybookInvoice = {
  id: string;
  issuedOn: string;
  arrangement: string;
  status: 'Paid' | 'Part paid' | 'Owing';
  totalCents: number;
  owingCents: number;
  lines: readonly StorybookInvoiceLine[];
};

export const storybookDataTableStates: readonly StorybookInvoice[] = [
  {
    id: 'INV-1052',
    issuedOn: '2026-09-04',
    arrangement: 'Private account',
    status: 'Owing',
    totalCents: 8230,
    owingCents: 8230,
    lines: [
      { id: '1052-1', code: '23', description: 'Standard consultation', quantity: 1, feeCents: 8230 },
    ],
  },
  {
    id: 'INV-1051',
    issuedOn: '2026-08-28',
    arrangement: 'Private account',
    status: 'Part paid',
    totalCents: 13180,
    owingCents: 5000,
    lines: [
      { id: '1051-1', code: '36', description: 'Long consultation', quantity: 1, feeCents: 13180 },
    ],
  },
  {
    id: 'INV-1050',
    issuedOn: '2026-08-20',
    arrangement: 'Bulk billed · manually recorded',
    status: 'Paid',
    totalCents: 4260,
    owingCents: 0,
    lines: [
      { id: '1050-1', code: '23', description: 'Standard consultation', quantity: 1, feeCents: 4260 },
    ],
  },
  {
    id: 'INV-1049',
    issuedOn: '2026-08-13',
    arrangement: 'Private account',
    status: 'Paid',
    totalCents: 9730,
    owingCents: 0,
    lines: [
      { id: '1049-1', code: '23', description: 'Standard consultation', quantity: 1, feeCents: 8230 },
      { id: '1049-2', code: 'DEMO-01', description: 'Practice supply · synthetic', quantity: 1, feeCents: 1500 },
    ],
  },
  {
    id: 'INV-1048',
    issuedOn: '2026-08-05',
    arrangement: 'Third-party account · Community Health Partnership Demonstration Organisation',
    status: 'Owing',
    totalCents: 19440,
    owingCents: 19440,
    lines: [
      { id: '1048-1', code: '44', description: 'Prolonged consultation', quantity: 1, feeCents: 19440 },
    ],
  },
  {
    id: 'INV-1047',
    issuedOn: '2026-07-29',
    arrangement: 'Private account',
    status: 'Paid',
    totalCents: 8230,
    owingCents: 0,
    lines: [
      { id: '1047-1', code: '23', description: 'Standard consultation', quantity: 1, feeCents: 8230 },
    ],
  },
  {
    id: 'INV-1046',
    issuedOn: '2026-07-18',
    arrangement: 'Private account',
    status: 'Paid',
    totalCents: 13180,
    owingCents: 0,
    lines: [
      { id: '1046-1', code: '36', description: 'Long consultation', quantity: 1, feeCents: 13180 },
    ],
  },
  {
    id: 'INV-1045',
    issuedOn: '2026-07-08',
    arrangement: 'Bulk billed · manually recorded',
    status: 'Paid',
    totalCents: 4260,
    owingCents: 0,
    lines: [
      { id: '1045-1', code: '23', description: 'Standard consultation', quantity: 1, feeCents: 4260 },
    ],
  },
  {
    id: 'INV-1044',
    issuedOn: '2026-06-30',
    arrangement: 'Private account',
    status: 'Part paid',
    totalCents: 19440,
    owingCents: 7200,
    lines: [
      { id: '1044-1', code: '44', description: 'Prolonged consultation', quantity: 1, feeCents: 19440 },
    ],
  },
  {
    id: 'INV-1043',
    issuedOn: '2026-06-19',
    arrangement: 'Private account',
    status: 'Paid',
    totalCents: 8230,
    owingCents: 0,
    lines: [
      { id: '1043-1', code: '23', description: 'Standard consultation', quantity: 1, feeCents: 8230 },
    ],
  },
  {
    id: 'INV-1042',
    issuedOn: '2026-06-02',
    arrangement: 'Private account',
    status: 'Paid',
    totalCents: 13180,
    owingCents: 0,
    lines: [
      { id: '1042-1', code: '36', description: 'Long consultation', quantity: 1, feeCents: 13180 },
    ],
  },
] as const;
