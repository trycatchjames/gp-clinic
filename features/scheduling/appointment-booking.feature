# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/01-appointment-booking.md
#   standards: [GP1.1, GP2.1, C1.5, C2.3]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling
Feature: Booking an appointment
  As a receptionist
  I want to book patients quickly and correctly
  So that the right patient sees the right practitioner for the right length of time

  Background:
    Given I am signed in as a receptionist at "Brunswick Family Practice"
    And the practice is active

  Scenario: Booking with the patient's usual GP first
    Given "Margaret Doyle" has "Dr Tom Nguyen" as her usual GP
    When I begin booking for her
    Then Dr Nguyen is offered first
    And the reason "Usual GP" is shown

  Scenario: The expected cost is shown at booking
    Given the practice bills privately for "Standard consultation"
    When I select that appointment type
    Then the expected out-of-pocket cost is displayed
    And I can read it to the patient before confirming

  Scenario: Reception is prompted to offer a longer appointment
    Given the patient's reason for visit is "a few things to discuss and my blood pressure"
    When I enter the reason
    Then I am prompted to offer a longer appointment
    And the reason for the prompt is shown

  Scenario Outline: Longer appointment prompts are triggered by patient context
    Given the patient <context>
    When I begin booking
    Then a longer appointment is suggested

    Examples:
      | context                              |
      | is aged over 75                      |
      | has a care plan review due           |
      | has more than 5 active problems      |
      | requests a longer appointment        |

  Scenario: Booking a patient with a preference for a female practitioner
    Given the patient requires a female practitioner
    When I begin booking
    Then only female practitioners are offered by default
    And the preference is displayed as the reason

  @compliance
  Scenario: A practitioner without a provider number at the location
    Given "Dr Tom Nguyen" has no provider number at "Coburg Branch"
    When I try to book him at "Coburg Branch"
    Then I am warned
    And the booking can only proceed if marked non-billable

  Scenario: Booking a deceased or inactive patient is blocked
    Given the patient is recorded as deceased
    When I try to book them
    Then booking is blocked

  Scenario: Booking a follow-up from inside a consultation
    Given I am a GP finishing a consultation with "Margaret Doyle"
    When I book a follow-up in "6 weeks"
    Then the patient, reason and practitioner are pre-filled
    And the nearest matching slot is offered
