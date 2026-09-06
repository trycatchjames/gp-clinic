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

  formSection: {
    identity: {
      title: 'Identity',
      description:
        'Record the name the patient uses as well as their legal name where those differ. Check one photographic and one non-photographic document where you can.',
    },
    privacy: {
      title: 'Sex, gender and pronouns',
      description:
        'These questions are optional and can be completed away from reception. Prefer not to say is a valid answer and is recorded as such.',
    },
    payer: {
      title: 'Medicare, concession and payer',
      description:
        'Leave blank where the patient does not hold a card. Blank is not the same as expired.',
    },
    longTitle: 'Next of kin, emergency contact and representative decision-making authority',
    longDescription:
      'A representative with decision-making authority is not the same as an emergency contact. Record the document that establishes the authority, who sighted it and the date. Where the patient has capacity and has not appointed anyone, record that rather than leaving this section blank, because a blank section cannot be told apart from one nobody has reached yet.',
  },

  collapsible: {
    title: 'Health summary',
    summary: '9 items',
    indicators: [
      { id: 'allergy', label: 'Anaphylaxis: amoxicillin' },
      { id: 'interpreter', label: 'Interpreter required — Dari' },
    ],
    items: [
      {
        term: 'Active problems',
        detail: 'Type 2 diabetes, hypertension, osteoarthritis (left knee)',
      },
      { term: 'Current medicines', detail: 'Metformin 1 g twice daily, perindopril 5 mg daily' },
      { term: 'Recent results', detail: 'HbA1c 7.8% on 12 August 2026; eGFR 68 on 12 August 2026' },
      { term: 'Open obligations', detail: 'Diabetes cycle-of-care review due 30 September 2026' },
    ],
    longIndicator:
      'Anaphylaxis: amoxicillin, cefalexin and every other beta-lactam — documented 4 March 2021',
  },
  saveState: {
    label: 'Consultation note',
    timeZone: 'Australia/Sydney',
    savedAt: '2026-09-04T01:42:00.000Z',
    localAt: '2026-09-04T01:39:00.000Z',
    failureReason: 'The connection dropped while the note was being sent. Your text is still here.',
    retryLabel: 'Save again',
    conflictReason:
      'Dr Rowena Aspinall saved a newer version at 11:44 am. Both versions are kept until you choose.',
    reconcileLabel: 'Compare both versions',
    noteValue:
      'Persistent dry cough for eleven days, worse overnight. No fever, no haemoptysis, no chest pain. Ex-smoker, ceased 2011.',
  },

  errorSummary: {
    title: 'There are 4 problems to correct before this can be saved',
    errors: [
      {
        fieldId: 'registration-family-name',
        section: 'Identity',
        label: 'Family name',
        message: 'Enter the family name as it appears on the identity document you checked.',
      },
      {
        fieldId: 'registration-date-of-birth',
        section: 'Identity',
        label: 'Date of birth',
        message: 'Enter a date of birth, or record the precision you were given.',
      },
      {
        fieldId: 'registration-contact',
        section: 'Contact and address',
        label: 'Contact number or address',
        message: 'Record at least one way to reach this patient.',
      },
      {
        fieldId: 'registration-consent',
        section: 'Communication safety and consent',
        label: 'Reminder consent',
        message:
          'Record whether the patient agreed to reminders, or that they were not asked. Leaving it blank is not the same as declining.',
      },
    ],
    singleError: {
      fieldId: 'registration-family-name',
      label: 'Family name',
      message: 'Enter the family name as it appears on the identity document you checked.',
    },
    contentStressError: {
      fieldId: 'registration-representative',
      section: 'Next of kin, emergency contact and representative authority',
      label: 'Representative authority evidence',
      message:
        'A representative with decision-making authority was recorded for Hamish Okonkwo-Delacroix without the evidence that establishes it. Record the document sighted, who sighted it and the date, or remove the representative. The rest of this registration has been kept.',
    },
  },
  toasts: {
    success: {
      id: 'appointment-moved',
      title: 'Appointment moved',
      description:
        'Marlee Tran is now booked with Dr Aroha Duong at 2:30 pm on Friday 4 September 2026.',
    },
    status: {
      id: 'book-refreshed',
      title: 'Appointment book refreshed',
      description: 'Showing changes up to 11:42 am.',
    },
    failure: {
      id: 'referral-send-failed',
      title: 'Referral letter was not sent',
      description:
        'The secure messaging service rejected the delivery. The letter is still a draft on the patient record and nothing has been sent.',
      actionLabel: 'Retry sending',
    },
    withAction: {
      id: 'appointment-cancelled',
      title: 'Appointment cancelled',
      description: 'The 11:15 am consultation for Marlee Tran was cancelled.',
      actionLabel: 'Undo',
    },
    contentStress: {
      id: 'claim-partially-transmitted',
      title:
        'Two of five items on the Wongaburra Community Health bulk-billing batch were not accepted',
      description:
        'Items 23 and 36 for Hamish Okonkwo-Delacroix were accepted. Items 10990 and 10991 were rejected because the concession card number recorded on 2 July 2026 has expired, and item 721 could not be assessed. Nothing has been resubmitted and the account still shows the full balance.',
      actionLabel: 'Open the account for this patient',
    },
    dismiss: 'Dismiss',
  },
  confirmation: {
    cancelAppointment: {
      title: 'Cancel this appointment',
      target: 'Tuesday 9 September 2026, 10:15 am — Standard consultation with Dr Rowena Aspinall',
      context: 'Marlee Tran · 14 Mar 1988 · Northside Demo Clinic',
      consequence:
        'The appointment is released and the time becomes bookable by anyone else in the practice.',
      retained: 'The booking, who cancelled it and when stays in the appointment history.',
      downstream: 'The patient reminder scheduled for Monday 8 September is withdrawn.',
      alternative: 'Reschedule instead if the patient still intends to attend.',
      confirmLabel: 'Cancel appointment',
      cancelLabel: 'Keep appointment',
      failure:
        'The appointment was not cancelled. The booking is unchanged and the patient has not been notified. Try again, or check the day view before telling the patient anything.',
    },
    amendObservation: {
      title: 'Amend the recorded blood pressure',
      target: 'Blood pressure 210/140 mmHg recorded 4 September 2026, 9:02 am',
      context: 'Hamish Okonkwo-Delacroix · 2 Jul 1954 · recorded by Nurse Priya Balasubramanian',
      consequence:
        'The corrected reading becomes the current value everywhere this observation is shown.',
      retained: 'The original reading, its author and its time stay visible in the entry history.',
      downstream: 'Any graph or report that includes this observation is recalculated.',
      reasonLabel: 'Reason for the amendment',
      reasonHint: 'Recorded against the entry and visible to anyone reviewing the history.',
      reasonError: 'Enter the reason this reading is being corrected.',
      confirmLabel: 'Amend reading',
    },
    mergeRecords: {
      title: 'Merge these patient records',
      target: 'Record 0041-882 (Marlee Tran) into record 0041-107 (Marlee Tran)',
      context: 'Both records are active at Northside Demo Clinic',
      consequence:
        'Record 0041-882 stops being usable and every future search resolves to record 0041-107.',
      retained: 'Both source records, their lineage and this decision stay in the merge history.',
      downstream:
        'Appointments, documents, results and account balances held against 0041-882 move to 0041-107.',
      alternative:
        'Mark the duplicate inactive if you are not certain these are the same person. Merging cannot be undone here.',
      reasonLabel: 'Reason for the merge',
      reasonHint: 'Name the identifiers you checked to confirm these are the same person.',
      acknowledgementLabel:
        'I have compared both records with a second authorised person and confirm they are the same person.',
      confirmLabel: 'Merge records',
    },
    contentStress: {
      title: 'Mark this correspondence as filed against the wrong patient',
      target:
        'Specialist letter “Cardiology outpatient review — exercise tolerance, medication reconciliation and follow-up plan” received 28 August 2026, 4:47 pm from Wongaburra Community Health Cardiology Service',
      context:
        'Currently filed to Hamish Okonkwo-Delacroix · 2 Jul 1954 · record 0041-9930 · Harbour Street Rooms',
      consequence:
        'The letter is withdrawn from this record and returned to the unmatched correspondence queue for re-matching.',
      retained:
        'The original filing, the person who filed it, the person withdrawing it and both times stay in the document history. Nothing is erased while the retention period applies.',
      downstream:
        'The review task raised for Dr Rowena Aspinall is cancelled. Any recall created from this letter is left in place and must be reviewed separately, because the pattern cannot know whether the recall is still clinically warranted.',
      alternative:
        'If you are unsure the letter is misfiled, flag it for clinician review instead of withdrawing it.',
      reasonLabel: 'Reason for withdrawing this document from the record',
      confirmLabel: 'Withdraw from this record',
    },
  },
} as const;
