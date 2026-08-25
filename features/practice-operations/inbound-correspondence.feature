# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/03-correspondence-and-documents.md
#   standards: [C5.3, C6.2, GP2.2, GP2.3]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @safety-critical
Feature: Inbound correspondence
  As a practice
  I want every inbound document matched, routed and actioned
  So that nothing sits in a shared inbox nobody owns

  Scenario: Documents are matched to a patient and a request where possible
    When a document arrives
    Then it is matched to a patient
    And where relevant to an open referral or investigation request

  Scenario Outline: Routing follows the reason the document exists
    Given a "<type>" arrives
    Then it is routed to "<recipient>"

    Examples:
      | type                | recipient                      |
      | pathology result    | the ordering practitioner      |
      | specialist letter   | the referring practitioner     |
      | discharge summary   | the patient's usual GP         |
      | allied health report| the referring practitioner     |

  @safety-critical
  Scenario: Clinically significant documents are tracked to actioned
    When a discharge summary is opened
    Then reading it does not mark it actioned
    And an explicit action must be recorded

  Scenario: Misfiled documents are re-filed with the correction logged
    Given a document was filed to the wrong patient
    When it is re-filed
    Then the correction is logged on both records
    And the document is not deleted

  Scenario: Scanned paper becomes the record
    When paper correspondence is scanned, categorised and matched
    Then the scan is filed to the patient record as the record
