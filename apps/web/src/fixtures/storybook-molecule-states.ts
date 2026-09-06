/**
 * Deterministic synthetic content for the molecule gallery.
 *
 * Every patient, practitioner, practice and identifier below is invented. Similar names, missing
 * optional facts and long values are deliberate: distinguishing two look-alike records is the job
 * these patterns exist to support.
 */
export const storybookMoleculeStates = {
  id: 'storybook-molecule-states',

  filterBar: {
    label: 'Patient search',
    queryLabel: 'Search by name, date of birth or record number',
    queryPlaceholder: 'Name, date of birth or record number',
    locationLabel: 'Location',
    statusLabel: 'Record status',
    queryHint: 'Enter at least two characters. Results update as you type.',
    initialSummary: 'Enter a search to list patients',
    searchingSummary: 'Searching…',
    activeSummary: '12 patients · filtered by Northside Demo Clinic',
    noMatchesSummary: 'No patients match these filters',
    partialSummary: '7 of 12 patients shown · one location did not respond',
    partialNotice:
      'Wongaburra Community Health did not respond. Patients held only at that location are missing from this list.',
    longQueryLabel:
      'Search by family name, given name, date of birth, Medicare number or practice record number',
    longFilterLabel: 'Include patients marked inactive or deceased in the last twenty-four months',
    locations: [
      { value: 'all', label: 'All locations' },
      { value: 'northside', label: 'Northside Demo Clinic' },
      { value: 'harbour', label: 'Harbour Street Rooms' },
    ],
    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'all', label: 'Active and inactive' },
    ],
  },

  listView: {
    label: 'Matching patients',
    patients: [
      {
        id: 'p-4821',
        name: 'Marlee Tran',
        dateOfBirth: '14/03/1988',
        recordNumber: 'NRT-4821',
        location: 'Northside Demo Clinic',
        lastSeen: '2 days ago',
        badge: null,
        footnote: null,
      },
      {
        id: 'p-4822',
        name: 'Marley Tranh',
        dateOfBirth: '14/03/1988',
        recordNumber: 'NRT-4822',
        location: 'Harbour Street Rooms',
        lastSeen: '6 weeks ago',
        badge: 'Similar details',
        footnote: 'Same date of birth as Marlee Tran. Confirm identity before opening.',
      },
      {
        id: 'p-3907',
        name: 'Joseph Okafor',
        dateOfBirth: '02/11/1954',
        recordNumber: 'NRT-3907',
        location: 'Northside Demo Clinic',
        lastSeen: 'Yesterday',
        badge: null,
        footnote: null,
      },
      {
        id: 'p-5140',
        name: 'Wilhelmina Papadopoulos-Ashworth',
        dateOfBirth: '29/07/1971',
        recordNumber: 'NRT-5140',
        location: 'Wongaburra Community Health and Allied Services',
        lastSeen: '11 months ago',
        badge: 'Inactive',
        footnote:
          'Record marked inactive in March. Reactivate before recording a new consultation, and confirm the current address and contact number with the patient.',
      },
    ],
  },

  contextBanner: {
    contextLabel: 'Selected patient',
    title: 'Marlee Tran',
    description: 'Female · 37 years · Record NRT-4821',
    status: 'Active',
    facts: [
      { label: 'Date of birth', value: '14/03/1988', tabular: true },
      { label: 'Medicare', value: '2951 47681 1', tabular: true },
      { label: 'Usual GP', value: 'Dr Alina Duong' },
      { label: 'Location', value: 'Northside Demo Clinic' },
    ],
    partialFacts: [
      { label: 'Date of birth', value: '14/03/1988', tabular: true },
      { label: 'Medicare', value: 'Not recorded' },
      { label: 'Usual GP', value: 'Not assigned' },
    ],
    notice: 'Documented anaphylaxis to amoxicillin. Confirm before prescribing.',
    primaryAction: 'Open record',
    secondaryAction: 'Start consultation',
    noticeTitle: 'Joseph Okafor',
    noticeDescription: 'Male · 71 years · Record NRT-3907',
    noticeFacts: [
      { label: 'Date of birth', value: '02/11/1954', tabular: true },
      { label: 'Medicare', value: '4180 22947 2', tabular: true },
      { label: 'Usual GP', value: 'Dr Alina Duong' },
      { label: 'Location', value: 'Northside Demo Clinic' },
    ],
    incompleteTitle: 'Priya Raghunathan',
    incompleteDescription: 'Female · 29 years · Record NRT-6015',
    incompleteFacts: [
      { label: 'Date of birth', value: '18/06/1996', tabular: true },
      { label: 'Medicare', value: 'Not recorded' },
      { label: 'Usual GP', value: 'Not assigned' },
    ],
    longTitle: 'Wilhelmina Papadopoulos-Ashworth',
    longDescription:
      'Female · 54 years · Record NRT-5140 · Usually seen at Wongaburra Community Health and Allied Services, visiting practitioner rooms, Thursdays only',
    longNotice:
      'This record was marked inactive in March and has not been reviewed since. Confirm the current address, contact number and Medicare details with the patient before recording a new consultation or raising an invoice.',
  },

  summaryList: {
    account: [
      { label: 'Account balance', value: '$148.60', tabular: true },
      { label: 'Last payment', value: '$89.55 on 12/08/2026', tabular: true },
      { label: 'Payment method', value: 'EFTPOS' },
      { label: 'Concession', value: 'Health Care Card' },
    ],
    withSupport: [
      {
        label: 'Account balance',
        value: '$148.60',
        supportingText: 'Includes one unpaid gap payment from 12/08/2026.',
        tabular: true,
      },
      {
        label: 'Medicare claim',
        value: 'Rejected',
        supportingText: 'Rejected on 13/08/2026: the patient’s Medicare card number has changed.',
      },
    ],
    missingAndUnknown: [
      { label: 'Account balance', value: '$0.00', tabular: true },
      { label: 'Last payment', value: 'No payments recorded' },
      { label: 'Concession', value: 'Not recorded' },
      { label: 'Private health fund', value: 'Unknown — not supplied by the patient' },
      { label: 'Outstanding claims', value: 'Unavailable — claiming service did not respond' },
    ],
    numeric: [
      { label: 'Schedule fee', value: '$41.40', tabular: true },
      { label: 'Practice fee', value: '$89.55', tabular: true },
      { label: 'Benefit paid', value: '$41.40', tabular: true },
      { label: 'Gap', value: '$48.15', tabular: true },
      { label: 'Item', value: '23', tabular: true },
      { label: 'Claims this year', value: '17', tabular: true },
    ],
    contentStress: [
      {
        label: 'Usual practitioner and consulting location',
        value: 'Dr Christabel Nguyen-Fitzgerald — Wongaburra Community Health and Allied Services',
        supportingText:
          'Visiting practitioner rooms, Thursdays only. Referrals addressed to this practitioner are collected weekly.',
      },
      {
        label: 'Practice record number',
        value: 'NRT-5140-ARCHIVE-2019-000418',
        tabular: true,
      },
      { label: 'Concession', value: 'Not recorded' },
    ],
  },

  fileInput: {
    label: 'Attach the referral document',
    hint: 'PDF, JPG or PNG. The document is checked before it reaches the patient record.',
    multipleLabel: 'Attach documents to file',
    error: 'Attach at least one document before sending this referral.',
    items: {
      selected: {
        id: 'f-1',
        name: 'cardiology-referral.pdf',
        sizeLabel: '248 KB',
        statusText: 'Chosen on this device. Not uploaded yet.',
        removable: true,
      },
      uploading: {
        id: 'f-2',
        name: 'ecg-strip-2026-09-02.pdf',
        sizeLabel: '1.4 MB',
        statusText: 'Uploading…',
      },
      failed: {
        id: 'f-3',
        name: 'discharge-summary.pdf',
        sizeLabel: '862 KB',
        statusText: 'Upload failed: the connection dropped. Nothing was filed to the record.',
        removable: true,
        retryable: true,
      },
      complete: {
        id: 'f-4',
        name: 'pathology-request.pdf',
        sizeLabel: '96 KB',
        statusText: 'Uploaded and scanned. Not yet filed to the patient record.',
        removable: true,
      },
      rejected: {
        id: 'f-5',
        name: 'holiday-photo.heic',
        sizeLabel: '4.8 MB',
        statusText: 'Rejected: HEIC files cannot be filed. Convert to PDF or JPG and try again.',
        removable: true,
      },
      longFilename: {
        id: 'f-6',
        name: 'wongaburra-community-health-cardiology-outpatient-discharge-summary-2026-09-02-final-signed.pdf',
        sizeLabel: '3.2 MB',
        statusText:
          'Rejected: the document is larger than the 2 MB limit for this referral. Nothing was uploaded, and the referral has not been sent.',
        removable: true,
        retryable: true,
      },
    },
  },
} as const;
