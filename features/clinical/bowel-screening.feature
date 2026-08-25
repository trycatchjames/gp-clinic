# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/08-preventive-health.md
#   standards: [C4.1, GP2.2, QI1.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Bowel cancer screening
  As a practice nurse
  I want kit status tracked
  So that we know who received a kit, who returned it and who needs following up

  Scenario: The register lists patients due
    When the bowel screening register is generated
    Then patients in the eligible age range without a recent screen are listed

  Scenario Outline: Kit status is tracked through its lifecycle
    Given the kit status is "<from>"
    When "<event>" occurs
    Then the status becomes "<to>"

    Examples:
      | from      | event                  | to        |
      | due       | kit issued             | issued    |
      | issued    | kit returned           | returned  |
      | returned  | result received        | completed |
      | issued    | 12 weeks with no return| overdue   |

  Scenario: An overdue kit generates a reminder, not a recall
    Given a kit has been outstanding for 12 weeks
    Then a reminder is generated
    And no recall obligation is created

  @safety-critical
  Scenario: A positive result creates a recall
    Given a positive bowel screening result is received
    When it is actioned
    Then a recall is created with a responsible practitioner
    And the colonoscopy referral pathway is offered
