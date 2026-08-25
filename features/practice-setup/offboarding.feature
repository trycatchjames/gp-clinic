# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/10-practice-setup/04-team-roles-and-access.md
#   standards: [C3.2, C5.3, GP2.2, C6.4]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @safety-critical
Feature: Offboarding a clinical team member
  As a practice manager
  I want a checklist when a clinician leaves
  So that no result, recall or patient is left without an owner

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"
    And "Dr Tom Nguyen" is leaving on "2026-09-30"

  Scenario: Offboarding surfaces everything that needs a new owner
    When I start offboarding "Dr Tom Nguyen"
    Then the checklist includes:
      | item                                        |
      | Reassign or cancel future appointments      |
      | Reassign unactioned results                 |
      | Reassign open recalls                       |
      | Reassign open tasks                         |
      | Reassign patients who have him as usual GP  |
      | Record last day for billing reconciliation  |

  @safety-critical
  Scenario: Access cannot be removed while results are unactioned
    Given "Dr Tom Nguyen" has 12 unactioned results
    When I try to complete the offboarding
    Then completion is blocked
    And I am told the 12 results must be reassigned to a named practitioner first

  @safety-critical
  Scenario: Open recalls must be reassigned
    Given "Dr Tom Nguyen" is the responsible practitioner on 5 open recalls
    When I reassign them to "Dr Anita Raman"
    Then each recall records the reassignment with date and actor
    And the escalation ladder continues uninterrupted

  Scenario: Completing offboarding revokes access immediately
    Given all checklist items are resolved
    When I complete the offboarding
    Then his sessions are revoked immediately
    And his membership is deactivated
    And his authored records are unchanged
