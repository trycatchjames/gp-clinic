# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/00-foundations/06-privacy-security-and-records.md
#   standards: [C6.3, C6.4, C3.2]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @compliance @safety-critical
Feature: Access control and audit
  As a practice
  I want access to patient information restricted and logged
  So that we meet our privacy obligations and can investigate any concern

  Scenario: Reception cannot read clinical notes
    Given I am signed in as "Jess Turner" with role "receptionist"
    When I request the consultation notes for a patient
    Then the API responds 403
    And the user interface offers no way to reach them

  Scenario: Reception can see front-desk alerts only
    Given a patient has a clinical alert "anticoagulated"
    And the same patient has a front-desk alert "interpreter required"
    When "Jess Turner" opens the patient record
    Then she sees "interpreter required"
    And she does not see "anticoagulated"

  @compliance
  Scenario: Viewing a clinical record is audit-logged
    Given I am signed in as "Dr Tom Nguyen"
    When I open the clinical record for patient "Margaret Doyle"
    Then an audit entry is written recording me, the patient, the time and the context
    And no application function can delete or amend that entry

  Scenario: Break-glass access requires a stated reason and is flagged
    Given I am a GP covering a location I do not normally work at
    When I open a record outside my normal scope
    Then I must state a reason
    And access is granted
    And the access is flagged for review by the practice manager

  Scenario: Tenancy is enforced server-side
    Given I am a member of "Brunswick Family Practice" only
    When I request a patient belonging to another practice by id
    Then the API responds 404
    And no data about that patient is disclosed
