Feature: Medication reconciliation

  Scenario: Record externally prescribed medicine
    When a clinician records a medicine reported by the patient as prescribed elsewhere
    Then its source is patient_reported or external_prescriber as appropriate
    And it appears in the current medication list with that source
    And no practice prescription is fabricated

  Scenario: Prescription does not prove medicine use
    Given a prescription was issued
    When the patient says they never started the medicine
    Then the prescription remains issued in history
    And the medication record can be recorded not started or ceased according to clinical judgement

  Scenario: No current medicines requires assessment
    Given there are no active medication records
    When an authorised clinician records that the list was reconciled and none are current
    Then the summary shows assessed none current with reviewer and time
    And an empty unassessed list would remain distinguishable
