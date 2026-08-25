# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/01-practice-registration-and-onboarding.md
#   standards: [C3.1, C3.2]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @onboarding
Feature: Registering a general practice
  As a GP setting up my own practice
  I want to create my practice in the system myself
  So that I can start seeing patients without waiting for an implementation consultant

  Background:
    Given I have verified my email address
    And I am not yet a member of any practice

  Scenario: Creating a new practice
    When I choose to create a new practice
    And I enter the practice identity details:
      | field        | value                        |
      | legal_name   | Raman Family Medicine Pty Ltd |
      | trading_name | Brunswick Family Practice     |
      | entity_type  | company                       |
      | abn          | 51824753556                   |
      | practice_type| general_practice              |
    Then the practice is created with onboarding status "in_progress"
    And I am assigned the role "practice_owner"
    And the practice is not yet usable for clinical work

  Scenario: ABN checksum validation rejects a mistyped ABN
    When I enter an ABN of "51824753557"
    Then I see the validation error "This ABN is not valid — please check the digits"
    And the practice is not created

  Scenario: ABN may be deferred for a practice that does not have one yet
    When I choose "I don't have an ABN yet"
    Then the practice is created without an ABN
    And "Add your ABN" appears on the outstanding setup list

  @compliance
  Scenario: The first user of a practice is always the owner
    When I create a new practice
    Then my membership role is "practice_owner"
    And an audit entry records the practice creation with me as the actor

  Scenario: Joining an existing practice instead of creating one
    Given I have been sent an invitation to "Brunswick Family Practice"
    When I accept the invitation
    Then I become a member of "Brunswick Family Practice" with the invited role
    And I am not offered the create-a-practice flow
