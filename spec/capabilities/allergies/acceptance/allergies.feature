Feature: Allergy and adverse-reaction assessment

  Scenario: Empty list is unassessed
    Given a patient has no allergy assessment and no recorded reactions
    When a clinician views the patient summary
    Then it shows allergies not assessed
    And it does not show no known allergies

  Scenario: Adding a reaction supersedes none-known assessment
    Given the current assessment is asked_none_known
    When an authorised clinician records an active adverse reaction with source
    Then the assessment becomes known_reactions_present
    And the earlier none-known assessment remains in history

  Scenario: None-known cannot hide an active reaction
    Given a patient has an active recorded reaction
    When a clinician attempts to record asked_none_known without resolving the active reaction
    Then the action is blocked
    And the active reaction remains visible
