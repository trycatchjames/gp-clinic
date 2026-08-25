# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/04-team-roles-and-access.md
#   standards: [C3.2, C3.4, C6.3, C6.4]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Team members and roles
  As a practice owner
  I want each person to have exactly the access their job needs
  So that patient information is protected and we can prove it

  Background:
    Given I am signed in as the owner of "Brunswick Family Practice"

  Scenario Outline: Roles carry defined access
    Given a team member with role "<role>"
    Then their clinical record access is "<clinical_access>"
    And their practice administration access is "<admin_access>"

    Examples:
      | role                  | clinical_access        | admin_access |
      | practice_owner        | full                   | full         |
      | practice_manager      | billing_relevant_only  | full         |
      | general_practitioner  | full                   | own_profile  |
      | gp_registrar          | full                   | own_profile  |
      | practice_nurse        | full                   | own_profile  |
      | receptionist          | demographics_only      | none         |

  @compliance
  Scenario: A practice must always have an active owner
    Given I am the only active practice owner
    When I try to change my own role to "practice_manager"
    Then the change is refused
    And I am told the practice must have at least one active owner

  Scenario: A role change takes effect on the next token refresh
    Given "Jess Turner" has role "receptionist"
    When I change her role to "practice_manager"
    Then the change is recorded with me as the actor
    And her new permissions apply within 15 minutes or immediately if her sessions are revoked

  Scenario: Removing a team member preserves their authored records
    Given "Dr Tom Nguyen" has authored 4,318 consultation notes
    When his membership is deactivated
    Then his user account is not deleted
    And his name remains on every note he authored
    And his active sessions are revoked immediately
