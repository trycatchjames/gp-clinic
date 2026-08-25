# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/12-certificates-and-reports.md
#   standards: [C1.1, C3.1, C7.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Document templates
  As a practice manager
  I want configurable templates
  So that our letters look consistent and pre-fill correctly

  Scenario: A template pre-fills patient, practitioner and practice details
    When I create a document from a template
    Then patient details, practitioner details and practice details are pre-filled

  Scenario: Required fields per document type are enforced
    Given the WorkCover certificate of capacity requires a claim number
    When I create one without a claim number
    Then completion is blocked

  Scenario: Templates are versioned
    When a template is edited
    Then a new version is created
    And documents already issued still reflect the version used at the time

  Scenario: Templates are practice-scoped
    Then a template created by one practice is not visible to another
