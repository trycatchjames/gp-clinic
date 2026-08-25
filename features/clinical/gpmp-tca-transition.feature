# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/07-chronic-condition-management.md
#   standards: [GP2.1, GP2.3, C3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @medicare @compliance
Feature: GPMP and TCA transition to the new framework
  As a practice
  I want legacy plans handled correctly during the transition
  So that patients keep their allied health access and we bill the right items

  Background:
    Given GP Management Plans and Team Care Arrangements were replaced on 1 July 2025
    And legacy plans remain usable for allied health access until 1 July 2027

  Scenario: A legacy plan is visible and clearly labelled
    Given "Margaret Doyle" had a GP Management Plan and Team Care Arrangements dated "2025-04-12"
    When I open her care plans
    Then the legacy plan is shown and labelled as a pre-July-2025 GPMP/TCA
    And its allied health allocation is still tracked

  Scenario: Allied health referrals under a legacy plan remain valid until 1 July 2027
    Given today is before "2027-07-01"
    When I refer under the legacy plan
    Then the referral is permitted
    And it counts against the legacy plan's allocation

  Scenario: After 1 July 2027 the legacy pathway closes
    Given today is after "2027-07-01"
    When I try to refer under the legacy plan
    Then I am told the legacy pathway has ended
    And I am prompted to prepare a GP Chronic Condition Management Plan

  @medicare
  Scenario: Legacy items are not offered for new plans
    When I prepare a new plan
    Then items "721", "723" and "732" are not offered
    And items "965" and "967" are offered
