# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/05-results-and-recalls.md
#   standards: [GP2.2, C5.3, QI3.1, C6.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical @compliance
Feature: Recalls
  As a practice
  I want recalls pursued and every attempt logged
  So that we can show we discharged our duty to inform the patient

  Scenario: A recall has a reason, priority, due date and responsible practitioner
    When a recall is created
    Then all four are required
    And "the practice" is not acceptable as the responsible practitioner

  @safety-critical
  Scenario Outline: The escalation ladder runs by priority
    Given an urgent recall with no patient response
    When day <day> is reached
    Then the next step is "<step>"

    Examples:
      | day | step                                             |
      | 0   | SMS and phone call                               |
      | 1   | phone call                                       |
      | 3   | registered letter                                |
      | 5   | escalate to the responsible GP for a decision    |

  @compliance @safety-critical
  Scenario: Every contact attempt is logged
    When a contact attempt is made
    Then the channel, timestamp, the staff member and the outcome are recorded
    And failed attempts are logged too

  @compliance @safety-critical
  Scenario: Recall messages never disclose the reason
    When a recall message is generated
    Then it asks the patient to contact the practice
    And it contains no result, diagnosis or reason

  @safety-critical
  Scenario: A recall cannot be closed administratively
    Given I am a receptionist
    When I try to close a recall
    Then closure is not available to me
    And I can only record contact attempts

  @safety-critical
  Scenario: Closure requires attendance or a recorded clinical decision
    When a recall is closed
    Then either the patient attended
    Or a clinician recorded a decision to stop pursuing it, with a reason

  @safety-critical
  Scenario: Recalls survive cancellations and DNAs
    Given a recall appointment is cancelled by the patient
    Then the recall remains open
    And it is escalated

  @safety-critical
  Scenario: Recalls are reassigned when a practitioner leaves
    Given the responsible practitioner is being offboarded
    Then their open recalls must be reassigned before their access is removed
