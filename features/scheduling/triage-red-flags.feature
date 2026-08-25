# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/03-triage-at-booking.md
#   standards: [GP1.1, C8.1, C3.3, QI3.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @safety-critical
Feature: Red-flag triage prompts at booking
  As a receptionist without clinical training
  I want to be told exactly what to say and do
  So that a seriously unwell patient is never simply given an appointment next Tuesday

  Background:
    Given I am signed in as a receptionist at "Brunswick Family Practice"

  Scenario Outline: Red-flag reasons interrupt the booking with a script
    When I enter the reason for visit "<reason>"
    Then the booking is interrupted
    And I am shown the scripted question "<question>"
    And the default action is "<action>"

    Examples:
      | reason                       | question                                   | action        |
      | chest pain                   | Are you having chest pain right now?       | call 000      |
      | can't breathe properly       | Are you struggling to breathe now?         | call 000      |
      | face has drooped             | When did this start?                       | call 000      |
      | severe bleeding              | Is the bleeding controlled?                | call 000      |
      | thinking about ending my life| Are you safe right now?                    | escalate now  |
      | baby has a fever, 6 weeks old| How old is the baby and what is the temperature? | escalate now  |
      | vomiting blood               | When did this start?                       | escalate now  |

  @safety-critical
  Scenario: Reception is never asked to make the clinical judgement
    When a red-flag prompt fires
    Then the prompt states what to say and what to do
    And no option asks me to decide whether the symptom is serious

  @safety-critical
  Scenario: Escalation reaches a named person in one click
    Given the duty nurse today is "Sarah Kelly"
    When I escalate
    Then an urgent task is created for Sarah Kelly
    And it appears on her screen immediately with an audible alert
    And it is not placed in an unowned queue

  @safety-critical
  Scenario: Unacknowledged escalations escalate further
    Given an escalation has been unacknowledged for 2 minutes
    Then it escalates to the duty GP
    And the practice manager is notified

  @compliance
  Scenario: Every fired prompt is recorded
    When a red-flag prompt fires
    Then the prompt shown, my selection and the outcome are recorded
    And the record is available for quality improvement review

  @offline
  Scenario: Prompts still fire offline but escalation is not queued
    Given the practice has no internet connection
    When a red-flag prompt fires
    Then the prompt is shown from the cached configuration
    And escalating tells me clearly that I must also raise it verbally now
