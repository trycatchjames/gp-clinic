# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/06-home-visits-aged-care-after-hours.md
#   standards: [GP1.2, GP2.1, C3.5, C5.3]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @offline
Feature: Home visits
  As a GP
  I want home visits triaged, safe and workable offline
  So that I can care for housebound patients without losing the record

  Scenario: A home visit requires a recorded triage decision
    When a home visit is requested
    Then a clinical triage decision must be recorded before it can be scheduled
    And a declined request is also recorded with its reason

  @safety-critical
  Scenario: Practitioner safety flags are shown at scheduling and at departure
    Given the address has a recorded safety flag
    When the visit is scheduled
    Then the flag is shown
    And it is shown again when the visit pack is prepared

  Scenario: Travel time is blocked around the visit
    When a home visit is scheduled
    Then travel time is blocked before and after in the practitioner's book

  @offline
  Scenario: Preparing the offline visit pack
    When I prepare the visit pack
    Then the patient summary, current medicines, allergies, active problems, recent results, care plan and advance care directive are cached
    And the cache freshness timestamp is shown

  @offline
  Scenario: The pack warns when it is stale
    Given the visit pack was synced 30 hours ago
    When I open it
    Then I am warned the data is more than 24 hours old

  @offline
  Scenario: Notes are written offline and sync on return
    Given I am at the patient's home with no connectivity
    When I write and sign the consultation note
    Then it is stored locally and queued
    And it syncs when I return to the practice

  @offline
  Scenario: Prescribing is unavailable offline and says so
    Given I am offline at a home visit
    When I try to issue an electronic prescription
    Then I am told electronic prescribing requires a connection
    And I can record the intent as a task for when I return
