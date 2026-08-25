# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/05-results-and-recalls.md
#   standards: [GP2.2, C5.3, QI3.1, QI1.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Results inbox
  As the ordering GP
  I want every result to require a decision
  So that nothing is ever simply marked as read

  Background:
    Given I am signed in as "Dr Tom Nguyen"

  Scenario: A result is presented with the context needed to interpret it
    When I open a result
    Then I see the original clinical indication
    And the patient's relevant history
    And previous values of the same test as a trend

  @safety-critical
  Scenario Outline: Every result requires an explicit action
    When I action a result as "<action>"
    Then "<consequence>"

    Examples:
      | action                        | consequence                                        |
      | no_action_normal              | it is filed and the patient may be told all is normal |
      | no_action_expected_abnormal   | a reason must be recorded before filing            |
      | inform_patient                | a contact task is created                          |
      | routine_recall                | a routine recall is created                        |
      | urgent_recall                 | an urgent recall is created                        |
      | immediate_contact             | it escalates immediately to a named person         |
      | refer                         | the referral workflow opens                        |

  @safety-critical
  Scenario: There is no "mark as read"
    When I view my results inbox
    Then no option files a result without an action

  Scenario: Results are routed to the ordering practitioner
    Given "Dr Anita Raman" ordered the test
    When the result arrives
    Then it appears in her inbox, not mine

  Scenario: Coverage during absence routes results to the covering practitioner
    Given "Dr Anita Raman" is on leave with coverage assigned to me
    When a result for her arrives
    Then it appears in my inbox marked as covering for her

  @offline
  Scenario: Results are readable offline and most actions queue
    Given I have no connectivity
    When I action a result as "routine_recall"
    Then the action queues
    And choosing "immediate_contact" tells me to act by phone now instead
