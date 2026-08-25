# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/05-cancellations-and-reminders.md
#   standards: [C6.3, C1.2, GP1.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @compliance @safety-critical
Feature: Appointment reminders
  As a practice
  I want reminders that reduce DNAs without disclosing anything private
  So that a message seen by someone else causes no harm

  @compliance @safety-critical
  Scenario: Reminders never disclose the reason for the visit
    Given the appointment reason is "mental health review"
    When the reminder is generated
    Then the message contains only the practice name, date, time, practitioner and location
    And it contains no reason, diagnosis, medication or result

  Scenario: The practitioner name can be omitted for sensitive services
    Given the practice has configured this appointment type to omit the practitioner name
    When the reminder is generated
    Then the message does not name the practitioner

  @compliance
  Scenario: Consent is checked at send time
    Given the patient consented to SMS when the appointment was booked
    And the patient withdrew SMS consent yesterday
    When the reminder run executes today
    Then no SMS is sent

  Scenario: Quiet hours are respected
    Given the reminder would send at 06:30 local time
    Then it is held until 08:00

  Scenario Outline: Reply handling
    When the patient replies "<reply>"
    Then the system "<action>"

    Examples:
      | reply                              | action                                       |
      | YES                                | confirms the appointment                     |
      | NO                                 | cancels and offers the slot to the waitlist  |
      | I might be a bit late, is that ok? | routes the message to reception              |

  @safety-critical
  Scenario: Free-text replies are never discarded
    When a patient replies with anything other than a recognised keyword
    Then the message is routed to reception as an unread item
    And it cannot be auto-dismissed

  Scenario: Opting out of reminders does not opt out of recalls
    Given the patient opts out of appointment reminders
    Then recall communications are still sent
    And the difference is explained to the patient
