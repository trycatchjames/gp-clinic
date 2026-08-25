# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/05-results-and-recalls.md
#   standards: [C4.1, GP2.2, C6.3, C1.2]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: Reminders
  As a practice
  I want population health reminders kept distinct from recalls
  So that a prompt with no duty attached is never confused with one that has

  Scenario: Reminders are generated from rules
    Given a female patient aged 27 with no cervical screening recorded in 5 years
    When the reminder rules run
    Then a cervical screening reminder is generated

  @compliance
  Scenario: Reminders are not recalls
    When a reminder is generated
    Then it has no escalation ladder
    And no duty to pursue is recorded
    And it can be opted out of entirely by the patient

  Scenario: Consent and quiet hours are honoured
    Given the patient has not consented to SMS
    When the reminder run executes
    Then no SMS is sent
    And the reminder is still shown opportunistically at the next visit

  Scenario: Opportunistic display at the point of care
    Given a patient has a reminder due
    When they are arrived
    Then the due activity is shown to reception so it can be offered

  Scenario: A patient can opt out of reminders without opting out of recalls
    When the patient opts out of reminders
    Then reminders stop
    And recall communications continue
