# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/05-claiming-and-reconciliation.md
#   standards: [C3.1, C3.2, QI1.3]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @compliance
Feature: Claim rejections
  As a practice manager
  I want rejections grouped by cause
  So that I fix the root cause once instead of forty times

  Scenario: Rejections are grouped by reason code
    Given 40 claims were rejected with the same reason code
    When I open the rejections view
    Then they are grouped as one issue affecting 40 claims

  Scenario: A recurring rejection cause raises a systemic alert
    Given the same rejection cause has occurred in three consecutive batches
    Then a systemic issue alert is raised

  Scenario Outline: Common causes are prevented at source
    Given the risk "<risk>"
    Then the system prevents it by "<prevention>"

    Examples:
      | risk                                     | prevention                                             |
      | wrong provider number for the location   | selecting the provider number for the service location |
      | expired patient Medicare details         | checking entitlement currency at arrival and billing   |
      | item not claimable by that practitioner  | gating items on practitioner qualifications            |
      | invalid item combination                 | checking co-claiming rules before the invoice is issued |
      | duplicate service                        | detecting the same patient, item and date              |
      | frequency limit exceeded                 | showing the next eligible date                          |

  Scenario: Correcting and resubmitting
    When I correct the cause and resubmit
    Then the claim status becomes "resubmitted"
    And the correction history is retained
