# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/04-dva-workcover-third-party.md
#   standards: [C7.1, C3.1, C5.3]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: Certificate of capacity
  As a GP
  I want certificates issued in sequence on the right form
  So that the worker's entitlements are not interrupted

  Scenario: The jurisdiction determines the form
    Given the claim is under the Victorian scheme
    Then the Victorian certificate of capacity form is used

  Scenario: The certificate records capacity, period, restrictions and review
    When I complete a certificate of capacity
    Then capacity for work, the period covered, any restrictions, the treatment plan and the review date are recorded

  @safety-critical
  Scenario: Gaps in the certificate sequence are flagged
    Given the previous certificate covered up to "2026-08-14"
    And the new certificate starts on "2026-08-18"
    Then a gap of 3 days is flagged before issue

  Scenario: The certificate sequence is visible
    When I open the claim
    Then all certificates issued for it are listed in date order

  Scenario: The certificate is sent to the insurer and logged
    When the certificate is issued
    Then it can be sent to the insurer
    And the delivery is logged
