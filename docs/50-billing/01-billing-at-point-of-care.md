# Billing at the Point of Care

**Status:** `modelled`

## Purpose

Turn a completed consultation into a correct invoice, in seconds, without the practitioner
needing to know the MBS by heart and without the practice billing something the record doesn't
support.

## Who does it

GP or nurse selects the items; reception completes payment. In many practices the GP just presses
"bulk bill, standard consult" and moves on.

## The workflow

### 1. Item suggestion

When the encounter is completed, the system proposes items based on what actually happened:

| Signal | Suggestion |
|---|---|
| Encounter duration | The **time tier**: item 3 (brief), 23 (under 20 min), 36 (at least 20, under 40), 44 (40+ min) |
| Encounter type | Face-to-face, telehealth video, telehealth phone, home visit, RACF, after hours |
| Care plan prepared | 965 (GP Chronic Condition Management Plan) |
| Care plan reviewed | 967 |
| Health assessment completed | 701 / 703 / 705 / 707 by duration, or 715 for ATSI patients |
| Mental health plan prepared | 2700 / 2701, or **2715 / 2717 only if the practitioner holds MHST** |
| Procedure performed | The relevant procedural item |
| Immunisation given | Vaccine-associated items where applicable |
| Patient entitlement + practice settings | Bulk-bill incentive items where eligible |

Every suggestion shows **why** it was suggested. Suggestions are never auto-applied — the
practitioner confirms, because claiming an item the record doesn't support is a compliance breach
and software must not create one silently.

### 2. Payer resolution

The system resolves a suggested payer from the patient's entitlements and the practice's billing
policy:

```
DVA card?              ──► DVA
WorkCover/CTP claim?   ──► WorkCover / CTP (claim number required)
Practice policy = bulk_bill_all
  or patient matches a bulk-bill cohort rule
  or BBPIP participation                      ──► Medicare bulk bill
No Medicare entitlement ──► Private, full fee, written estimate required
Otherwise              ──► Practice default (private with gap, or bulk bill)
```

The resolved payer is shown with its reason and can be overridden with a recorded reason.

### 3. The BBPIP guard

If the practice participates in the **Bulk Billing Practice Incentive Program**, it must bulk bill
**100% of eligible services** to receive the 12.5% loading. So when a user attempts to raise a
private invoice for an eligible service at a BBPIP practice, the system:

1. Warns clearly, naming the consequence
2. Requires a reason
3. Records it on an exception report the practice manager reviews

This single guard is worth more to a participating practice than any other billing feature.

### 4. Fee resolution

Fees come from the applicable fee schedule, versioned by effective date. The screen shows: the
schedule fee, the Medicare benefit, the practice fee, and **the gap the patient pays**. The gap is
the number the patient cares about, so it is the largest number on the screen.

### 5. Consent and payment

- Bulk bill: patient assignment of benefit is captured (digital signature in the prototype).
- Private: payment is taken (EFTPOS, card, cash) or the invoice is placed on account. A receipt is
  issued, and where the patient will claim from Medicare themselves, the receipt carries what they
  need.
- Patient claim: the practice can lodge the claim on the patient's behalf.

### 6. Multiple items and co-claiming

Some items can be claimed together and some cannot. The system knows the co-claiming rules for the
common combinations (e.g. an attendance alongside a care plan item) and warns on invalid
combinations before the invoice is raised.

## Rules and constraints

1. An invoice must reference an encounter, a practitioner, a location and a payer.
2. The provider number used is the one for **that practitioner at that location**.
3. Items requiring MHST are not offered to practitioners without it.
4. Time-tiered items are checked against the recorded encounter duration and warn on mismatch.
5. Under BBPIP participation, private billing of an eligible service requires an override reason
   and is reported.
6. Invoices are immutable once issued; corrections are credit notes plus a new invoice.
7. The patient is told the cost before the service wherever possible (C1.5).

## Data touched

`invoices`, `invoice_lines`, `payments`, `receipts`, `mbs_items`, `fee_schedules`,
`fee_schedule_items`, `encounters`, `practitioner_locations`, `billing_exceptions`.

## Offline behaviour

**Supported.** Invoices can be raised and payments recorded offline against the cached fee
schedule and MBS catalogue. Medicare claim submission queues until online. The UI shows clearly
that an invoice is raised but not yet claimed.

## Standards mapping

C1.5 Costs associated with care initiated by the practice · C3.1 Business operation systems ·
C1.1 Information about your practice

## Feature files

`features/billing/point-of-care-billing.feature`, `features/billing/item-suggestion.feature`,
`features/billing/payer-resolution.feature`, `features/billing/bbpip-guard.feature`
