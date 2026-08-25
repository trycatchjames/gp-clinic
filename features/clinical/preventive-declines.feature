# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/08-preventive-health.md
#   standards: [C4.1, C1.3, C2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: Declines and exclusions for preventive activities
  As a practice
  I want declines respected
  So that we do not destroy the patient's trust in every other prompt

  Scenario: A decline is recorded with a reason and a review date
    When a patient declines bowel cancer screening
    Then the decline is recorded with a reason and a review date
    And the activity stops appearing on the due register

  Scenario Outline: Clinical exclusions remove the activity
    Given the patient <circumstance>
    When the preventive rules run
    Then <activity> is marked not applicable and does not appear

    Examples:
      | circumstance                     | activity           |
      | has had a total hysterectomy     | cervical screening |
      | is receiving palliative care     | bowel screening    |

  Scenario: A decline is revisited at its review date
    Given a decline was recorded with a review date of today
    Then the activity reappears for a respectful re-offer

  Scenario: No reminder is sent for a declined activity
    Given the patient has declined cervical screening
    When the reminder run executes
    Then no reminder is sent for cervical screening

  Scenario: A practice can turn off an activity with a recorded reason
    When the practice disables an activity from its registers
    Then a reason is required
    And the change is audit-logged
