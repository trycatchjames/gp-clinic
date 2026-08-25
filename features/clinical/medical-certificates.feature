# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/12-certificates-and-reports.md
#   standards: [C7.1, C1.5, C3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance @offline
Feature: Medical certificates
  As a GP
  I want the basis of a certificate recorded
  So that the certificate is accurate and defensible

  @compliance
  Scenario: The basis of the certificate must be recorded
    When I issue a medical certificate
    Then I must record whether it is based on examination today, examination on a prior date, or the patient's report

  Scenario: A certificate based on the patient's report says so
    Given the certificate is based on the patient's report
    When it is printed
    Then the certificate states that it is based on the patient's report

  @compliance
  Scenario: Backdating requires a reason and is flagged
    When I issue a certificate covering dates before today
    Then a reason is required
    And the certificate is flagged as backdated for practice review

  Scenario: Issued certificates are immutable
    Given a certificate was issued yesterday
    When a correction is needed
    Then a new certificate referencing the original is issued
    And the original is retained

  Scenario: Certificates are stored and reprintable
    When a certificate is issued
    Then it is stored in the patient record
    And it can be reprinted without being re-created

  @offline
  Scenario: Certificates can be created offline
    Given I am on a home visit with no connectivity
    When I issue a certificate
    Then it can be printed
    And the record queues for sync
