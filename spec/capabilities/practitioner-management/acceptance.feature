Feature: Practitioner offboarding

  Scenario: Provider-at-location history is preserved
    Given a practitioner rendered a service at Location A using the effective provider identifier
    When their Location A identifier is later replaced
    Then the historical encounter and invoice retain the former identifier snapshot

  Scenario: Offboarding requires accepted responsibility transfer
    Given a practitioner has future appointments, open results, recalls and tasks
    When a manager starts offboarding
    Then each obligation type and urgency/age is shown
    And account deactivation is blocked until required items are reassigned to and accepted by a practitioner or governed team queue
    And original clinical authorship remains the departing practitioner
