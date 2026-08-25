# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/01-consultation-workflow.md
#   standards: [C5.1, C5.2, C7.1, C1.3, QI2.1, GP2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: The consultation
  As a GP
  I want the software to follow the consultation I was trained to conduct
  So that it supports the work instead of interrupting it

  Background:
    Given I am signed in as "Dr Tom Nguyen"
    And "Margaret Doyle" is waiting for me

  Scenario: The pre-consultation summary is absorbable in seconds
    When I open the encounter
    Then I see the reason for today's visit
    And her allergies and adverse reactions before anything else
    And her active problems and current medicines
    And when she last attended, with whom and for what
    And her outstanding items: unactioned results, open recalls, referrals without a reply, care plan review due, screening due

  Scenario: The note is a single document, not a wizard
    When I open the note
    Then reason for encounter, history, examination, assessment, plan and safety-netting are all reachable without navigating between steps

  Scenario: The encounter timer runs from in_consultation to completed
    Given I called the patient in at 10:02
    When I complete the encounter at 10:29
    Then the recorded duration is 27 minutes
    And item "36" is suggested at billing because the duration is at least 20 and under 40 minutes

  Scenario: Actions taken inside the note return to the note
    When I prescribe from within the note
    Then the prescribing panel opens inline
    And on completion I am returned to the note with the prescription recorded in the plan

  @compliance
  Scenario: Every clinical action is bound to the encounter
    When I prescribe, order a test, refer and issue a certificate during this consultation
    Then each is linked to this encounter
    And none can exist without one

  Scenario: A patient seen by someone other than their usual GP is flagged for continuity
    Given "Margaret Doyle"'s usual GP is "Dr Anita Raman"
    And I make a new significant diagnosis during this consultation
    When I sign the note
    Then the encounter appears in Dr Raman's "patients seen by others" list
