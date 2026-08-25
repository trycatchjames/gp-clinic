# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/02-locations-and-hours.md
#   standards: [C1.1, C2.3, GP1.1, GP5.1]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Practice locations
  As a practice manager
  I want to manage the sites where we deliver care
  So that books, provider numbers and billing are correctly scoped

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"

  Scenario: Adding a second location
    When I add a location:
      | field    | value                        |
      | name     | Coburg Branch                |
      | street   | 12 Sydney Road               |
      | suburb   | Coburg                       |
      | state    | VIC                          |
      | postcode | 3058                         |
      | timezone | Australia/Melbourne          |
    Then the location is created and active
    And it appears in the location selector

  Scenario: Timezone is chosen explicitly, not inferred from the state
    When I add a location in "NSW" with postcode "2880"
    Then I am asked to choose the timezone
    And "Australia/Broken_Hill" is offered as an option

  Scenario: Changing a timezone does not move existing appointments
    Given "Coburg Branch" has appointments booked
    When I change its timezone
    Then I am shown "Existing appointment times are unchanged — only how they are displayed changes"
    And the stored appointment times are unchanged

  Scenario: A location with history is deactivated, never deleted
    Given "Coburg Branch" has recorded encounters
    When I attempt to delete it
    Then deletion is not offered
    And I can deactivate it instead
    And historical records still reference it

  Scenario: Deactivating a location requires future appointments to be resolved
    Given "Coburg Branch" has 14 future appointments
    When I attempt to deactivate it
    Then I am shown the 14 affected appointments
    And deactivation is blocked until each is rebooked or cancelled

  @compliance
  Scenario: Accessibility details are captured for the practice information sheet
    When I record the location facilities
    Then I can record wheelchair access, an accessible toilet, a hearing loop and parking
    And these appear on the patient-facing practice information sheet
