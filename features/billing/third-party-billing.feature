# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/04-dva-workcover-third-party.md
#   standards: [C1.5, C6.3, C3.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: Third-party billing
  As a practice manager
  I want non-patient payers tracked as receivables
  So that reports and medicals actually get paid for

  Scenario: A third-party invoice goes to the requester
    When an insurance report is completed
    Then the invoice is raised to the insurer
    And it is tracked as a receivable against the insurer, not the patient

  @compliance
  Scenario: Consent precedes any clinical disclosure
    When a third party requests information
    Then recorded patient consent is required before anything is released

  Scenario: Non-Medicare fee schedule is used
    When a commercial drivers' medical is billed
    Then the fee comes from the practice's non-Medicare fee schedule

  Scenario: Outstanding third-party receivables are reported
    When I open the receivables report
    Then third-party balances are shown by payer and by age
