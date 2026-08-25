# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/05-reporting-and-dashboards.md
#   standards: [QI1.3, C3.1, C3.2, C6.3]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @offline
Feature: Role dashboards
  As each member of the practice team
  I want the few numbers that change what I do today
  So that the dashboard is useful rather than decorative

  Scenario Outline: Each role gets its own dashboard
    Given I am signed in as "<role>"
    Then my dashboard includes "<highlight>"

    Examples:
      | role             | highlight                                    |
      | practice_owner   | bulk billing percentage against the BBPIP threshold |
      | practice_manager | unmatched results and documents with the age of the oldest |
      | general_practitioner | results to action, critical first        |
      | practice_nurse   | recalls to work and cold chain readings due  |
      | gp_registrar     | cases flagged for supervisor review          |
      | receptionist     | today's arrivals and waits                   |

  Scenario: Every number drills through
    When I click any dashboard figure
    Then the list behind it opens

  @safety-critical
  Scenario: Safety numbers are visually distinct from performance numbers
    Then unmatched results, overdue urgent recalls and unacknowledged critical results are visually distinct
    And they are never below the fold

  @compliance
  Scenario: A receptionist dashboard contains no clinical data
    Given I am signed in as a receptionist
    Then my dashboard contains no clinical figures

  @offline
  Scenario: My own dashboard renders offline
    Given I have no connectivity
    When I open my dashboard
    Then it renders from cached data with an "as at" timestamp
