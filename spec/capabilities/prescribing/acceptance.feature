Feature: Internal prescribing

  Scenario: Only the prescriber can issue under their identity
    Given a nurse may prepare a prescription draft for Dr Smith
    When the nurse attempts to issue it as Dr Smith
    Then issue is denied
    And the draft remains available for Dr Smith to review
    And no issued prescription or document is created

  Scenario: Issue preserves an immutable snapshot
    Given an authorised prescriber reviews the correct patient, location and allergy state
    And the prescription fields are complete
    When the prescriber issues the prescription
    Then an immutable prescription and rendition are stored with the prescriber and issue time
    And later medicine-catalogue changes do not change that rendition

  Scenario: Cancelling does not imply external revocation
    Given a prescription was issued and printed in Version 1
    When the prescriber records a cancellation
    Then its internal state is cancelled with reason and time
    And the system warns that an external copy may still exist
    And it does not claim a pharmacy or exchange received the cancellation
