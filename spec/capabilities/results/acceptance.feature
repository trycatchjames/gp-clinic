Feature: Results review and follow-up

  Scenario: Opening a result does not review it
    Given a result is assigned and unreviewed
    When the responsible clinician opens and reads it without choosing a disposition
    Then the result remains unreviewed
    And it remains in the responsible review queue

  Scenario: Review and recall creation are atomic
    Given an assigned result requires a clinical recall
    When the clinician records an urgent-recall disposition with due date and responsible clinician
    Then the result becomes reviewed_action_required
    And an open linked recall is created
    And if recall creation fails the result remains unreviewed or under review

  Scenario: Administrative contact cannot set clinical disposition
    Given a receptionist has delegated recall-contact permission but no result.review permission
    When the receptionist records a contact attempt
    Then the contact attempt is retained against the linked obligation
    And the receptionist cannot change the clinical result disposition or read protected report content

  Scenario: Corrected result reopens review
    Given a result was reviewed and closed
    When a corrected source version with changed clinical content is recorded
    Then the original remains linked and readable
    And the corrected version is assigned for fresh clinical review
    And prior patient-contact history is visible but not treated as review of the correction

  Scenario: Practitioner cannot be offboarded with orphaned results
    Given a practitioner owns open results
    When a manager attempts to deactivate the practitioner without accepted reassignment
    Then deactivation is blocked
    And the open results and their urgency/age are listed for reassignment
