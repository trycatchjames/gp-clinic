# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/02-health-summary-and-problem-list.md
#   standards: [QI2.2, C5.3, QI2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Medication reconciliation
  As a GP
  I want reconciliation to be a recorded event
  So that the medicines list is trustworthy after a hospital admission or specialist change

  Scenario Outline: Reconciliation is triggered by a source of change
    Given a <trigger> is received
    Then a medication reconciliation task is created

    Examples:
      | trigger                               |
      | hospital discharge summary            |
      | specialist letter with medication changes |
      | home medicines review report          |
      | aged care admission notification      |

  Scenario: Each discrepancy is resolved explicitly
    Given the source lists 9 medicines and our record lists 7
    When I reconcile
    Then each difference must be resolved as continue, cease, change or "patient not taking"
    And the reconciliation cannot be completed with an unresolved difference

  Scenario: The reconciliation records its source and author
    When reconciliation completes
    Then the source, the date and my name are recorded
    And the resulting medicines list is stored

  Scenario: Staleness is visible
    Given the last reconciliation was 14 months ago
    When I view the medicines list
    Then it shows when it was last reconciled
    And it is flagged as stale

  Scenario: Ceasing a medicine requires a reason and a date
    When I cease a medicine
    Then a reason and a cessation date are required
    And the medicine remains visible in the medication history
