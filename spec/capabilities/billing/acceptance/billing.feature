Feature: Internal billing and invoicing

  Scenario: Issue an itemised private invoice
    Given a completed service has a rendering practitioner, location and service date
    And a private billing item and fee are selected
    When an authorised biller issues the invoice
    Then it snapshots the patient, liable party, service, practitioner/location, item code/description and fee
    And it shows total, paid and owing amounts
    And later fee-schedule changes do not change the invoice

  Scenario: Bulk billing is an explicit arrangement
    Given an authorised user selects a bulk-billing arrangement
    When an invoice/claim record is prepared
    Then the arrangement states that the expected Medicare benefit would be accepted as full payment
    And it is not represented as an unexplained private fee discount
    And no external assignment or claim submission is implied

  Scenario: Payment failure does not settle balance
    Given an issued invoice has an outstanding balance
    When recording a payment fails before durable commit
    Then the outstanding balance is unchanged
    And no receipt is produced
    And retrying with the same idempotency key cannot create duplicate payments

  Scenario: Manual claim rejection preserves invoice
    Given a user recorded a claim as manually submitted
    When they record a payer rejection with reason
    Then the claim becomes rejected
    And the invoice and its issued lines remain unchanged
    And a corrected/resubmitted claim retains the rejection lineage
