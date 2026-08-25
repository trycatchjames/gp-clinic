# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/02-locations-and-hours.md
#   standards: [C1.1, GP1.1, GP1.3]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Opening hours and after-hours arrangements
  As a practice manager
  I want to record when we are open and what patients do when we are not
  So that patients can always get care and we meet our access obligations

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"
    And I am editing the location "Brunswick"

  Scenario: Recording regular opening hours with a midday break
    When I set Monday hours to 08:30-18:00 with a break from 12:30 to 14:00
    Then the appointment book shows the break as unavailable
    And online booking offers no slots during the break

  Scenario Outline: Every location must record an after-hours arrangement
    When I select the after-hours arrangement "<arrangement>"
    Then I am required to supply "<required_detail>"

    Examples:
      | arrangement            | required_detail          |
      | own_practitioners      | contact number           |
      | cooperative            | co-op name and number    |
      | deputising_service     | service name and number  |
      | hospital_ed_referral   | hospital name and address |

  @compliance
  Scenario: The after-hours arrangement feeds the patient information sheet
    Given the after-hours arrangement is "deputising_service" with "Melbourne Medical Deputising Service"
    When the practice information sheet is generated
    Then it states the after-hours arrangement and the contact number

  Scenario: Booking outside opening hours requires an override with a reason
    When I try to book an appointment at 19:30 on a Monday
    Then I am warned that this is outside opening hours
    And I must record a reason to proceed
    And the override and reason are recorded on the appointment

  Scenario: A temporary closure surfaces affected appointments
    When I record a closure from "2026-12-24" to "2027-01-02" for "Christmas shutdown"
    Then all appointments in that range are listed for rebooking
    And online booking shows the closure message for those dates
    And no appointment is cancelled automatically
