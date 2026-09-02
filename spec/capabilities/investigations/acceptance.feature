Feature: Internal investigation requests

  Scenario: Issue a request with identity and responsibility
    Given an authorised clinician has selected a patient and requested tests
    And the request has a clinical indication and responsible practitioner
    When the clinician issues the request
    Then the retained rendition contains at least three approved patient identifiers
    And the ordering practitioner, location/contact, requested tests and indication
    And the investigation enters issued with immutable content

  Scenario: Printing is not electronic delivery
    Given an investigation request is issued
    When a user records that it was printed
    Then the dispatch method is recorded as manual print
    And the system does not show delivered or accepted by a provider

  Scenario: Outstanding request remains visible
    Given an issued investigation has passed its expected result date
    And no final result is linked
    Then it appears in an outstanding-investigation worklist
    And time passing does not close it
