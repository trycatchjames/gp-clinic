/**
 * Deterministic synthetic content for the atom gallery.
 *
 * Every value is invented demo data for a fictional practice. Long labels, missing optional facts
 * and multi-line failure reasons are deliberate: they are the content stress the catalogue asks
 * each atom to survive.
 */
export const storybookAtomStates = {
  id: 'storybook-atom-states',

  alert: {
    default: {
      title: 'Recall list refreshed',
      description: 'Nine patients are due for a cervical screening reminder this fortnight.',
    },
    information: {
      title: 'Bulk billing incentive applies',
      description: 'Item 10990 has been added automatically for this concession card holder.',
    },
    warning: {
      title: 'Allergy record is unconfirmed',
      description: 'The penicillin entry came from an imported summary and has not been verified.',
    },
    failure: {
      title: 'Referral letter could not be sent',
      description: 'The secure messaging service rejected the delivery. Nothing has been sent.',
      recovery: 'Try again',
    },
    announcement: 'Draft saved locally. It has not been filed to the patient record yet.',
    contentStress: {
      title:
        'The imported discharge summary contains an allergy that conflicts with the recorded allergy list',
      description:
        'The imported document records a documented anaphylaxis to amoxicillin. The patient record currently records a mild rash to penicillin. Confirm the correct entry with the patient before prescribing. No change has been made to the allergy list.',
    },
  },

  progress: {
    label: 'Health assessment completion',
    zero: 0,
    partial: 45,
    complete: 100,
    partialText: '4 of 9 sections complete',
    completeText: '9 of 9 sections complete',
  },

  skeleton: {
    label: 'Loading the appointment book',
  },

  input: {
    label: 'Medicare number',
    placeholder: '0000 00000 0',
    value: '2951 47681 1',
    readOnlyValue: '2951 47681 1',
    invalidValue: '2951 4768',
    invalidMessage: 'Enter all ten digits and the individual reference number.',
    longValue:
      'Wongaburra Community Health and Allied Services Cooperative — Northside consulting suite',
    types: [
      { label: 'Given name', type: 'text', value: 'Marlee' },
      { label: 'Practice email', type: 'email', value: 'reception@northside.example' },
      { label: 'Contact number', type: 'tel', value: '(02) 5550 0134' },
      { label: 'Consultation fee', type: 'number', value: '89.55' },
    ],
  },

  textarea: {
    label: 'Reason for visit',
    placeholder: 'Recorded in the patient’s own words where possible',
    value: 'Persistent cough for eleven days, worse overnight. No fever reported.',
    readOnlyValue: 'Imported from the after-hours service summary. Read only.',
    invalidMessage: 'A reason for visit is required before the consultation can be finalised.',
    longContent:
      'Patient reports a persistent dry cough for eleven days that is worse overnight and disrupts sleep. No fever, no haemoptysis, no chest pain. Has trialled over-the-counter lozenges without benefit. Works night shift at a cold-storage facility. Ex-smoker, ceased 2011, approximately eight pack-years. Requests a certificate covering the last two shifts. Examination and management plan to follow.',
  },

  label: {
    text: 'Preferred name',
    longText:
      'Preferred name to use when calling the patient from the waiting room, including pronunciation notes',
    disabledText: 'Provider number (assigned by the practice)',
  },

  checkbox: {
    legend: 'Appointment preparation',
    options: [
      { id: 'consent', label: 'Consent to share the summary with the referred provider' },
      { id: 'interpreter', label: 'Interpreter required' },
      { id: 'transport', label: 'Practice-arranged transport required' },
    ],
    disabledLabel: 'Bulk bill this consultation (set by the fee schedule)',
    longLabel:
      'Send an SMS reminder to the recorded mobile number two business days before the appointment, and again on the morning of the appointment',
  },

  radioGroup: {
    legend: 'Appointment type',
    options: [
      { value: 'standard', label: 'Standard consultation (15 minutes)' },
      { value: 'long', label: 'Long consultation (30 minutes)' },
      { value: 'telehealth', label: 'Telehealth consultation' },
      { value: 'procedure', label: 'Procedure (not available at this location)', disabled: true },
    ],
    longLabels: [
      {
        value: 'gpmp',
        label: 'GP management plan review including allied health team care arrangements',
      },
      {
        value: 'assessment',
        label: 'Health assessment for a patient aged 75 years and over, conducted at home',
      },
    ],
  },

  switchControl: {
    label: 'Send appointment reminders by SMS',
    description: 'Applies to this patient only.',
    pendingText: 'Saving…',
    failureText: 'Reminder preference could not be saved. The previous setting still applies.',
    disabledLabel: 'Share the record with the after-hours service (practice policy)',
  },

  select: {
    label: 'Consulting location',
    placeholder: 'Select a location',
    options: [
      { value: 'northside', label: 'Northside Demo Clinic' },
      { value: 'harbour', label: 'Harbour Street Rooms' },
      { value: 'wongaburra', label: 'Wongaburra Community Health' },
    ],
    groups: [
      {
        label: 'Metropolitan',
        options: [
          { value: 'northside', label: 'Northside Demo Clinic', disabled: false },
          { value: 'harbour', label: 'Harbour Street Rooms', disabled: false },
        ],
      },
      {
        label: 'Regional',
        options: [
          { value: 'wongaburra', label: 'Wongaburra Community Health', disabled: false },
          { value: 'mallee', label: 'Mallee Ridge Outreach (closed Tuesdays)', disabled: true },
        ],
      },
    ],
    longOptions: [
      {
        value: 'community',
        label: 'Wongaburra Community Health and Allied Services — Consulting suite 4B',
      },
      {
        value: 'outreach',
        label: 'Mallee Ridge Outreach Service — Visiting practitioner rooms, Thursday only',
      },
    ],
    invalidMessage: 'Select the location where this consultation took place.',
  },

  card: {
    title: 'Next appointment',
    description: 'Dr Alina Duong · Northside Demo Clinic',
    body: 'Standard consultation, 15 minutes. The patient has requested an interpreter.',
    primaryAction: 'Open appointment',
    secondaryAction: 'Reschedule',
    denseFacts: [
      { label: 'Starts', value: '11:15 am' },
      { label: 'Room', value: 'Consulting 3' },
      { label: 'Fee', value: 'Bulk billed' },
      { label: 'Status', value: 'Arrived' },
    ],
  },

  avatar: {
    name: 'Dr Alina Duong',
    initials: 'AD',
    longName: 'Dr Christabel Nguyen-Fitzgerald',
    longInitials: 'CN',
    /** Deterministic inline image: no network request during evidence capture. */
    imageSrc:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMWY0ZDVhIi8+PGNpcmNsZSBjeD0iMzIiIGN5PSIyNSIgcj0iMTEiIGZpbGw9IiNlOGQ3YzMiLz48cGF0aCBkPSJNMTAgNjRjMC0xMiAxMC0yMCAyMi0yMHMyMiA4IDIyIDIweiIgZmlsbD0iI2U4ZDdjMyIvPjwvc3ZnPg==',
    brokenSrc: 'https://demo.invalid/not-a-real-portrait.png',
  },

  separator: {
    items: ['Demographics', 'Contact', 'Medicare'],
    semanticHeading: 'Billing history',
  },

  tabs: {
    label: 'Patient record sections',
    items: [
      {
        value: 'summary',
        label: 'Summary',
        body: 'Active problems, allergies and current medicines.',
        disabled: false,
      },
      {
        value: 'notes',
        label: 'Progress notes',
        body: 'Consultation notes in reverse date order.',
        disabled: false,
      },
      {
        value: 'results',
        label: 'Results',
        body: 'Pathology and imaging received for this patient.',
        disabled: false,
      },
      { value: 'billing', label: 'Billing', body: 'Not available for this role.', disabled: true },
    ],
    longLabels: [
      { value: 'chronic', label: 'Chronic disease management plans and reviews' },
      { value: 'immunisation', label: 'Immunisation history and Australian Immunisation Register' },
      { value: 'correspondence', label: 'Clinical correspondence and secure messaging' },
    ],
  },

  dialog: {
    trigger: 'Cancel appointment',
    title: 'Cancel this appointment?',
    description:
      'The 11:15 am standard consultation for Marlee Tran will be cancelled. The patient will not be notified automatically.',
    confirm: 'Cancel appointment',
    dismiss: 'Keep appointment',
    failure: 'The appointment could not be cancelled. It is still booked.',
    longContent:
      'Cancelling removes the reserved time from Dr Duong’s book at Northside Demo Clinic and releases it for online booking. Any linked care-plan review, recall and reminder remains scheduled and must be cancelled separately. The cancellation, the staff member who performed it and the reason recorded below are written to the appointment history and cannot be removed.',
  },

  dropdownMenu: {
    trigger: 'Record actions',
    groupLabel: 'This appointment',
    items: [
      { id: 'open', label: 'Open patient record' },
      { id: 'reschedule', label: 'Reschedule' },
      { id: 'print', label: 'Print appointment slip' },
    ],
    disabledItem: 'Merge duplicate record (requires practice manager)',
    destructiveItem: 'Cancel appointment',
    longLabels: [
      'Send the consultation summary to the nominated allied health provider',
      'Create a GP management plan review reminder for twelve weeks’ time',
    ],
  },

  tooltip: {
    trigger: 'Provider number',
    content: 'The Medicare provider number for this practitioner at this location.',
    longContent:
      'The Medicare provider number identifies this practitioner at this location. A practitioner working at more than one location holds a separate provider number for each of them.',
    edgeTrigger: 'Edge case',
  },
} as const;
