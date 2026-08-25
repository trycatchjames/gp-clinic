# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/14-registrar-supervision.md
#   standards: [GP3.1, C5.2, C3.4, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Registrar supervision in practice
  As a GP supervisor
  I want the supervision arrangement to have runtime effect
  So that it is real rather than a form in a folder

  Background:
    Given "Dr Priya Shah" is a GPT1 registrar supervised by "Dr Anita Raman"

  @safety-critical
  Scenario: Sessions requiring on-site supervision are checked against the roster
    Given her supervision level is "direct"
    And no supervisor is rostered on Friday afternoon
    When her Friday afternoon session is scheduled
    Then the session is flagged before it happens
    And the practice manager is notified

  Scenario: Supervision records are accreditation evidence
    When the practice generates evidence for GP3.1
    Then the supervision relationships and their date ranges are included

  Scenario: Random case analysis
    When Dr Raman requests a random sample of Dr Shah's recent encounters
    Then a sample is returned
    And each reviewed encounter carries a review record with feedback

  Scenario: Teaching sessions are recorded
    When a teaching session is recorded with date, duration, topics and attendees
    Then it is available as training-programme and accreditation evidence
