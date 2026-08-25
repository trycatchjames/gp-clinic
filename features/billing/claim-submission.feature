# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/05-claiming-and-reconciliation.md
#   standards: [C3.1, C3.2]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @offline
Feature: Claim submission
  As a practice manager
  I want claims batched and tracked through their lifecycle
  So that I always know what is outstanding and how old it is

  Scenario Outline: The claim lifecycle
    Given a claim with status "<from>"
    When "<event>" occurs
    Then the status becomes "<to>"
    And the change is timestamped

    Examples:
      | from       | event                  | to          |
      | draft      | submitted              | submitted   |
      | submitted  | acknowledged           | processing  |
      | processing | accepted               | accepted    |
      | processing | rejected               | rejected    |
      | accepted   | payment received       | paid        |
      | rejected   | corrected and resent   | resubmitted |

  Scenario: A batch carries its identifying details
    When a batch is created
    Then it has an identifier, a submission timestamp, a service date range and a claim count

  @compliance
  Scenario: Nothing is claimed twice
    Given an invoice line has already been claimed
    When a new batch is generated
    Then that line is not included again

  Scenario: The oldest unpaid claim age is on the dashboard
    Given the oldest unpaid claim was submitted 34 days ago
    Then the practice dashboard shows "Oldest unpaid claim: 34 days"

  @offline
  Scenario: Claiming is online-only
    Given I have no connectivity
    Then claim submission is unavailable
    And the sync indicator shows how many invoices await submission
