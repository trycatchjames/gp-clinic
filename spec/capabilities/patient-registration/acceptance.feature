Feature: Patient registration and duplicate handling

  Scenario: Register a patient without Medicare
    Given no existing patient matches the supplied approved identifiers
    When a receptionist registers a patient without a Medicare number
    Then the patient receives an immutable internal identifier and local record number
    And the patient can be booked
    And Medicare absence is not shown as an identity error

  Scenario: Preserve sensitive demographic distinctions
    When an authorised user records a patient's assigned sex at birth, gender and pronouns
    Then each value is stored independently with provenance
    And generated display uses the recorded name and pronouns rather than deriving them from assigned sex at birth

  Scenario: Concurrent registration creates duplicate review instead of auto-merge
    Given two receptionists are registering the same person concurrently
    When both save after their earlier duplicate searches
    Then the system does not combine records automatically
    And the later save is blocked or flagged for potential-duplicate review
    And neither user's entered information is silently lost

  Scenario: Merge retains lineage and authorship
    Given two records are confirmed to represent the same patient
    And an authorised reviewer has selected the survivor and resolved demographic conflicts
    When a second authorised reviewer confirms the merge
    Then searches for either local record resolve to the survivor with a merge notice
    And every clinical and financial record retains its original author and source patient identifier
    And the source patient is not hard-deleted
