Feature: Clinical correspondence

  Scenario: Inbound clinical correspondence remains assigned until actioned
    Given an inbound clinical letter is matched to a patient and assigned to a practitioner
    When an administrator files the document
    Then the correspondence remains action_required
    And filing alone does not record clinician review

  Scenario: Outbound failure preserves issued content
    Given a clinician issued a letter with selected content and recipient
    When staff record a failed manual dispatch
    Then the exact issued rendition remains in the patient record
    And the correspondence remains actionable with failed delivery status
