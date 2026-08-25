# Private Billing, Payments and Accounts

**Status:** `modelled`

## Purpose

Charge a fee, collect it, and handle the cases where it isn't collected — while meeting the
practice's obligation to tell patients what things cost before they happen (**C1.5**).

## Who does it

Receptionist mostly; Practice Manager for accounts and debtors.

## The workflow

### Informed financial consent

The obligation is to inform patients of costs associated with care **initiated by the practice**,
before the care happens. In practice:

- The booking screen shows the expected out-of-pocket for the appointment type
- Online booking shows it before confirmation
- The practice information sheet carries the fee policy
- Where a service will attract no rebate at all (a patient without Medicare, a commercial medical,
  a cosmetic procedure), a **written estimate** is produced and the patient acknowledges it

### Raising and paying an invoice

1. Items and fees are resolved from the fee schedule.
2. The **gap** is shown prominently.
3. Payment is taken: EFTPOS, card, cash, or the invoice is placed on account.
4. A receipt is issued. Where the patient will claim from Medicare themselves, the receipt
   contains the item numbers, the provider number, the date of service and the amount paid — which
   is what Medicare requires.
5. Optionally the practice lodges the **patient claim** on the patient's behalf, with the rebate
   paid to the patient's nominated bank account.

### Accounts and debtors

- Invoices on account age into buckets (current, 30, 60, 90+ days).
- Statements are generated per patient.
- A configurable reminder sequence runs; each step is logged.
- Write-offs require a reason and an authorising user.
- **A patient's account status must never affect clinical care.** The software surfaces an
  outstanding balance to reception at arrival, and does not surface it to the clinician during the
  consultation.

### Refunds and adjustments

- An issued invoice is immutable. Corrections are a **credit note** referencing the original, plus
  a new invoice.
- Refunds record the method, the reason and the authoriser.

## Rules and constraints

1. Every invoice has a unique, sequential, per-practice invoice number.
2. Issued invoices are never edited or deleted; corrections are credit notes.
3. Receipts contain everything the patient needs to claim.
4. Write-offs and refunds require authorisation and a reason.
5. Debtor reminders are logged with content and channel.
6. Account status is not shown to clinicians during a consultation.

## Data touched

`invoices`, `invoice_lines`, `payments`, `receipts`, `credit_notes`, `refunds`, `statements`,
`debtor_reminders`, `fee_schedules`.

## Offline behaviour

Invoices can be raised and cash/EFTPOS payments recorded offline. Card processing through an
integrated terminal is online-only. Statements and debtor runs are online-only.

## Standards mapping

C1.5 Costs associated with care initiated by the practice · C1.1 Information about your practice ·
C3.1 Business operation systems · C2.1 Respectful and culturally appropriate care

## Feature files

`features/billing/private-billing.feature`, `features/billing/payments-and-receipts.feature`,
`features/billing/informed-financial-consent.feature`, `features/billing/debtors.feature`
