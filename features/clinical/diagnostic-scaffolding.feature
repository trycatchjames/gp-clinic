# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/01-consultation-workflow.md
#   standards: [C5.1, C5.2, GP3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Diagnostic reasoning scaffolding
  As a GP registrar
  I want the diagnostic model I was taught available in the note
  So that my reasoning is structured and visible without slowing an experienced GP down

  Scenario: The Murtagh scaffold offers the five questions
    When I open the diagnostic scaffold for a presenting problem
    Then I can record the probability diagnosis
    And serious disorders not to be missed
    And commonly missed conditions
    And masquerades considered
    And what else the patient may be trying to tell me

  Scenario: The masquerades list is offered as a checklist
    When I open the masquerades field
    Then I am offered depression, diabetes, drugs, anaemia, thyroid disease, spinal dysfunction and urinary tract infection
    And I can add my own

  Scenario Outline: The scaffold default depends on the practitioner
    Given I am a "<kind>"
    When I open a new note
    Then the diagnostic scaffold is "<default>"

    Examples:
      | kind          | default   |
      | gp_registrar  | expanded  |
      | gp            | collapsed |

  Scenario: A practitioner can change their own default
    Given the scaffold is collapsed by default for me
    When I change my preference to expanded
    Then it opens expanded on my next note
    And no other practitioner's preference changes

  Scenario: The scaffold is never mandatory
    Given the scaffold is empty
    When I sign the note
    Then signing succeeds
