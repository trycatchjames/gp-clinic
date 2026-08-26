Feature: Safe document handling

  Scenario: Unmatched clinical document cannot disappear
    Given a document passed malware scanning but has no confident patient match
    When ingestion completes
    Then it appears in the unmatched document queue with received time and source identifiers
    And it is not filed under a guessed patient

  Scenario: Filing does not equal clinical review
    Given a clinical document has been matched and classified
    When an authorised administrator files it to the patient record
    Then the document is available in the record
    And any required clinical correspondence or result review remains open

  Scenario: Wrong-patient correction preserves provenance
    Given a document was matched to Patient A in error
    When an authorised user reassigns it to Patient B with three-identifier evidence and reason
    Then ordinary retrieval links it to Patient B
    And the prior Patient A association, actor, time and reason remain auditable
