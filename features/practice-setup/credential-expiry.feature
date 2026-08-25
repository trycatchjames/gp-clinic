# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/10-practice-setup/03-practitioners-and-credentialing.md
#   standards: [GP3.1, C3.2, QI3.1]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @compliance
Feature: Credential expiry monitoring
  As a practice manager
  I want to be warned before a practitioner's credentials lapse
  So that nobody practises or bills without current registration or cover

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"

  Scenario Outline: Warnings are raised at intervals before expiry
    Given "Dr Tom Nguyen" has a <credential> expiring in <days> days
    When the daily credential check runs
    Then a task is created for the practice manager
    And the dashboard shows the expiry with severity "<severity>"

    Examples:
      | credential                   | days | severity |
      | AHPRA registration           | 90   | info     |
      | AHPRA registration           | 30   | warning  |
      | AHPRA registration           | 7    | urgent   |
      | professional indemnity policy| 30   | warning  |
      | CPR certification            | 30   | warning  |

  @safety-critical
  Scenario: An expired AHPRA registration blocks new bookings
    Given "Dr Tom Nguyen" has an AHPRA registration that expired yesterday
    When reception tries to book a new appointment with him
    Then the booking is blocked
    And existing appointments with him are flagged for the practice manager

  Scenario: Recording a renewal clears the alert
    Given "Dr Tom Nguyen" has an expiring AHPRA registration
    When I record the renewed registration with a new expiry date
    Then the alert is cleared
    And the previous registration record is retained in the credential history
