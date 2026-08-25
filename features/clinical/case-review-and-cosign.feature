# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/14-registrar-supervision.md
#   standards: [GP3.1, C5.2, QI3.1, QI1.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Case review and co-signing
  As a GP supervisor
  I want certain registrar actions to require my signature
  So that higher-risk decisions get a second look before they take effect

  Scenario: Co-sign requirements are configured per registrar and term
    When I configure co-sign requirements for "Dr Priya Shah" in term "GPT1"
    Then I can require co-signing for Schedule 8 prescribing and named high-risk medicines

  @safety-critical
  Scenario: A co-sign requirement blocks the action until signed
    Given Schedule 8 prescribing requires co-signing for this registrar
    When Dr Shah tries to issue a Schedule 8 prescription
    Then it is held pending co-sign
    And she is told why

  Scenario: The co-sign request carries full clinical context
    When I open a co-sign request
    Then I see the consultation note, the patient's medicines and the proposed action

  Scenario: Declining a co-sign returns it with feedback
    When I decline a co-sign request
    Then a reason is required
    And it returns to the registrar with the feedback attached

  Scenario: Reviewed encounters carry a review record
    When I review a registrar encounter
    Then a review record is created with my feedback and the date
