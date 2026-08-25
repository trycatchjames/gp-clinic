# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/06-referrals.md
#   standards: [GP2.3, C5.3, GP2.2, C1.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Referrals
  As a GP
  I want referrals that carry the right information and a clear question
  So that the specialist can help and the patient is not sent back for more detail

  Scenario: The referral letter is generated with the clinical essentials
    When I create a referral
    Then the letter includes the reason for referral
    And relevant history and examination findings
    And current medicines
    And allergies
    And the specific question being asked

  @compliance
  Scenario: Current medicines and allergies are always included
    When any referral letter is generated
    Then current medicines and allergies are included automatically
    And they cannot be omitted

  @medicare
  Scenario: Referral validity is recorded and re-referral is prompted
    Given a standard GP referral to a specialist is valid for 12 months from the first specialist visit
    When the validity period is approaching its end
    Then the patient's record shows that a re-referral will be needed

  Scenario: An indefinite referral is possible where clinically appropriate
    When I mark a referral as indefinite
    Then no expiry is recorded
    And the reason for the indefinite referral is captured

  @safety-critical
  Scenario: Urgent referrals require confirmation of receipt
    When I mark a referral urgent
    Then a phone call or secure message confirmation of receipt must be recorded
    And the referral stays flagged until it is

  Scenario: The patient is told what the referral is for
    When a referral is created
    Then the patient is given the reason, the recipient and what to expect
    And this is recorded as part of informed decision-making

  @offline
  Scenario: Referrals can be drafted and printed offline
    Given I have no connectivity
    When I create a referral
    Then it can be printed
    And secure transmission queues for when connectivity returns
