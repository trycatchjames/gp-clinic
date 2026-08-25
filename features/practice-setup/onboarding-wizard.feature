# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/01-practice-registration-and-onboarding.md
#   standards: [C1.1, C1.5, C2.3, C3.1, GP1.3, GP3.1]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @onboarding
Feature: Practice onboarding wizard
  As a practice owner or manager
  I want a guided setup I can leave and come back to
  So that I can get the practice configured around seeing patients

  Background:
    Given I am signed in as the owner of "Brunswick Family Practice"
    And the practice onboarding status is "in_progress"

  Scenario Outline: The wizard covers every setup step
    When I open the onboarding wizard
    Then step "<step>" is listed with status "<status>"

    Examples:
      | step                        | status      |
      | Practice identity           | complete    |
      | Primary location            | not_started |
      | Opening hours               | not_started |
      | Registrations and identifiers | not_started |
      | Team                        | not_started |
      | Appointment types           | not_started |
      | Billing setup               | not_started |
      | Review and activate         | not_started |

  Scenario: Progress is saved on every step transition
    Given I am on the "Primary location" step
    When I complete the location details and move to the next step
    And I close the browser
    And I sign in again
    Then the wizard resumes on the "Opening hours" step
    And the location details I entered are still present

  @compliance
  Scenario: BBPIP participation requires MyMedicare registration
    Given I am on the "Registrations and identifiers" step
    And the practice is not registered for MyMedicare
    When I try to enable participation in the Bulk Billing Practice Incentive Program
    Then I am told "BBPIP participation requires the practice to be registered for MyMedicare"
    And the BBPIP option remains disabled

  @compliance @medicare
  Scenario: The practice is told what BBPIP obliges before opting in
    Given I am on the "Registrations and identifiers" step
    And the practice is registered for MyMedicare
    When I enable participation in the Bulk Billing Practice Incentive Program
    Then I am shown "You must bulk bill 100% of eligible services to receive the 12.5% incentive"
    And I must confirm before participation is recorded

  Scenario: Appointment types are seeded with Australian general practice defaults
    When I reach the "Appointment types" step
    Then the following appointment types are pre-populated:
      | name                        | minutes | default_mbs_item |
      | Standard consultation       | 15      | 23               |
      | Long consultation           | 30      | 36               |
      | Extended consultation       | 45      | 44               |
      | Brief consultation          | 10      | 3                |
      | Care plan (GPCCMP)          | 45      | 965              |
      | Care plan review            | 30      | 967              |
      | Health assessment           | 45      | 705              |
      | Mental health treatment plan| 45      | 2701             |
    And I can edit or remove any of them
