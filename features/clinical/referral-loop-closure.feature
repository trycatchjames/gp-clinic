# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/06-referrals.md
#   standards: [GP2.2, GP2.3, C5.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Closing the referral loop
  As a GP
  I want to know which referrals never came back
  So that a patient waiting for a specialist appointment is not forgotten

  Scenario: An open referral appears until a reply arrives
    Given I referred a patient 10 weeks ago with an expected reply window of 8 weeks
    Then the referral appears on my open referrals list

  Scenario: A matched specialist letter closes the referral
    When a letter arrives and is matched to the open referral
    Then the referral closes
    And the letter is filed to the patient record

  @safety-critical
  Scenario: A specialist letter must be actioned, not just read
    When I open a specialist letter
    Then I must record what I am doing about it before it is marked actioned
    And medication changes, new diagnoses and further tests are captured explicitly

  Scenario: A letter with no matching referral goes to unmatched correspondence
    Given a specialist letter arrives with no matching open referral
    Then it appears in the unmatched correspondence queue

  Scenario: A referral can be closed without a reply
    Given the patient chose not to attend the specialist
    When I close the referral
    Then a reason is required
    And the closure is recorded with my name and the date
