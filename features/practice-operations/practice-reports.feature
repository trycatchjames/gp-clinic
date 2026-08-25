# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/05-reporting-and-dashboards.md
#   standards: [QI1.1, QI1.3, QI2.1, C3.1, C3.2]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations
Feature: Practice reports
  As a practice owner or manager
  I want reports across clinical, access, safety, financial and population views
  So that I can run the practice on evidence

  Scenario Outline: Report areas
    When I open the "<area>" reports
    Then "<example>" is available

    Examples:
      | area       | example                                          |
      | clinical   | health summary completeness                      |
      | access     | third next available appointment                 |
      | safety     | recall closure rate and time to closure          |
      | financial  | revenue by practitioner, payer and item          |
      | population | MyMedicare registration rate                     |

  Scenario: Population reports show the practice's denominator
    When I open the population reports
    Then age and sex distribution, chronic condition prevalence and the Aboriginal and Torres Strait Islander patient count are shown

  Scenario: Reports are exportable and dated
    When I export any report
    Then the export carries the report parameters and the date generated

  @compliance
  Scenario: Report access respects role scope
    Given I am signed in as a receptionist
    Then clinical reports are not available to me

  Scenario: Reports can be filtered by location and date range
    When I filter a report
    Then location and date range filters are available
