# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/04-investigations.md
#   standards: [GP2.2, C5.1, C5.3, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Ordering pathology and imaging
  As a GP
  I want every request tracked from the moment I make it
  So that a test I ordered can never quietly go unreturned

  Scenario: A request records indication and urgency
    When I order a full blood count
    Then a clinical indication is required
    And an urgency of routine, urgent or phone result is required

  Scenario: Imaging requires a specific clinical question
    When I order a knee ultrasound
    Then a clinical question is required
    And "sore knee" alone is rejected as insufficient

  @safety-critical
  Scenario: Ordering creates an outstanding investigation record
    When I order any test
    Then an outstanding investigation is created with an expected return window based on the test type

  Scenario: Common panels are grouped for speed
    When I open the pathology ordering screen
    Then common panels are offered as groups
    And I can still order individual tests

  @compliance @medicare
  Scenario: A request that will not attract a rebate says so
    Given the test is not rebatable for this indication
    When I order it
    Then I am told before the request is printed
    And the patient can be informed of the cost

  Scenario: The patient can choose their provider
    Given the practice has preferred providers
    When I generate the request
    Then a preferred provider is suggested
    And the patient's choice of any provider remains available

  @offline
  Scenario: Requests can be created and printed offline
    Given I have no connectivity
    When I create a request
    Then it can be printed
    And the outstanding investigation record is created locally and syncs later
