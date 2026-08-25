# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/11-health-assessments.md
#   standards: [C2.1, C4.1, QI1.3, GP2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @medicare
Feature: Aboriginal and Torres Strait Islander health assessment
  As a practice
  I want item 715 assessments identified and offered
  So that one of the highest-value preventive activities is not missed

  Scenario: Eligibility depends on recorded status
    Given a patient is recorded as Aboriginal
    And no health assessment has been claimed for them in the last 12 months
    Then they appear on the item 715 eligibility register

  Scenario: Item 715 applies at any age
    Given the patient is 4 years old and recorded as Torres Strait Islander
    Then they are eligible for item "715"

  Scenario: Item 715 is claimable annually
    Given item "715" was claimed 13 months ago
    Then the patient is eligible again

  Scenario: Patients with unrecorded status are surfaced for a respectful re-ask
    Given a patient's Aboriginal and Torres Strait Islander status is "not stated"
    Then they appear on a list for the practice to ask again
    And the list explains why the question matters

  Scenario: The assessment uses the appropriate schedule
    When an item 715 assessment is prepared
    Then the Aboriginal and Torres Strait Islander immunisation schedule is used for due vaccines
