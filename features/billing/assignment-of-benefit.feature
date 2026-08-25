# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/02-medicare-bulk-billing.md
#   standards: [C1.5, C3.1, C6.2]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @compliance @offline
Feature: Assignment of benefit
  As a practice
  I want the patient's assignment captured and retained
  So that our bulk-billed claims are properly supported

  Scenario: Assignment is captured at the point of billing
    When a bulk-billed invoice is issued
    Then the patient signs the assignment digitally
    And the signature is stored with the invoice

  Scenario: Assignment is retained permanently
    Given an invoice from 2026
    Then its assignment of benefit is still retrievable

  Scenario: Assignment for a child is given by the parent or guardian
    Given the patient is 7 years old
    Then the assigning person and their relationship are recorded

  @offline
  Scenario: Assignment can be captured offline
    Given I have no connectivity
    When the patient signs
    Then the signature is stored locally and syncs with the invoice
