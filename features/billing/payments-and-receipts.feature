# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/03-private-billing-and-payments.md
#   standards: [C1.5, C3.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @offline
Feature: Payments and receipts
  As a receptionist
  I want payments taken and receipts issued correctly
  So that the patient can claim their rebate without coming back

  Scenario Outline: Payment methods
    When the patient pays by "<method>"
    Then the payment is recorded against the invoice
    And a receipt is issued

    Examples:
      | method        |
      | eftpos        |
      | card          |
      | cash          |
      | direct deposit|

  @compliance
  Scenario: The receipt contains everything needed to claim
    When a receipt is issued for a privately billed service
    Then it shows the item numbers, the provider number, the date of service and the amount paid

  Scenario: Placing an invoice on account
    When the patient cannot pay today
    Then the invoice can be placed on account
    And it enters the debtor ageing

  Scenario: Lodging a patient claim on the patient's behalf
    When the practice lodges the patient claim
    Then the rebate is directed to the patient's nominated bank account
    And the claim is tracked

  Scenario: Refunds record method, reason and authoriser
    When a refund is issued
    Then the method, the reason and the authorising user are recorded

  @offline
  Scenario: Cash and EFTPOS can be recorded offline
    Given I have no connectivity
    When I record a cash payment
    Then it is stored locally and queued
    And integrated card processing is unavailable and says so
