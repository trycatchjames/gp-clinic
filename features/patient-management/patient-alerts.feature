# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/01-patient-registration.md
#   standards: [C6.3, C2.1, C7.1, QI3.1]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @safety-critical
Feature: Patient alerts
  As a clinician and as a receptionist
  I want the right alerts visible to the right people
  So that we act safely without disclosing clinical information at the front desk

  Scenario: Clinical alerts are not visible to reception
    Given patient "Margaret Doyle" has a clinical alert "anaphylaxis to penicillin"
    When a receptionist opens her record
    Then the clinical alert is not shown
    And when a GP opens her record the alert is shown prominently

  Scenario: Front-desk alerts are visible to everyone
    Given patient "Margaret Doyle" has a front-desk alert "requires wheelchair access"
    Then the alert is shown to reception, nursing and medical staff

  @safety-critical
  Scenario: Allergy alerts appear before prescribing
    Given the patient has a recorded allergy to penicillin
    When a GP begins prescribing amoxicillin
    Then the allergy is shown before the prescription can be signed

  Scenario: Alerts have an author, a date and an optional review date
    When I create an alert
    Then my name and the date are recorded
    And I may set a review date
    And alerts without a review date are surfaced as stale after 12 months

  Scenario: An aggression risk alert is worded for the front desk
    Given a patient has a recorded aggression risk
    Then reception sees "Aggression risk — see practice protocol"
    And no clinical detail about the incident is shown to reception
