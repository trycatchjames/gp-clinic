# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/03-practitioners-and-credentialing.md
#   standards: [GP3.1, C3.2, C5.2]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Practitioner profiles and credentials
  As a practice manager
  I want to hold each practitioner's registration and credential data
  So that we can show they are qualified and bill correctly for what they do

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"

  Scenario: Creating a GP profile
    When I create a practitioner:
      | field                      | value            |
      | given_name                 | Tom              |
      | family_name                | Nguyen           |
      | kind                       | gp               |
      | ahpra_registration_number  | MED0001234567    |
      | prescriber_number          | 4567891          |
      | vocational_registration    | true             |
    Then the practitioner is created and active
    And they appear in the practitioner list

  @compliance @medicare
  Scenario: Mental Health Skills Training gates MBS items 2715 and 2717
    Given practitioner "Dr Tom Nguyen" does not hold Mental Health Skills Training
    When a mental health treatment plan is billed for one of his encounters
    Then items "2715" and "2717" are not offered
    And items "2700" and "2701" are offered

  @compliance @medicare
  Scenario: An MHST-trained GP is offered the higher items
    Given practitioner "Dr Anita Raman" holds GPMHSC-accredited Mental Health Skills Training
    When a mental health treatment plan is billed for one of her encounters
    Then items "2715" and "2717" are offered

  Scenario: A practitioner can exist without a login
    When I create a locum practitioner without an email address
    Then the practitioner profile is created
    And no user account or invitation is created
    And the locum can be selected for billing

  Scenario: Deactivating a practitioner requires their future appointments to be resolved
    Given "Dr Tom Nguyen" has 23 future appointments
    When I attempt to deactivate him
    Then I am shown the 23 appointments
    And deactivation is blocked until each is reassigned or cancelled

  Scenario: Patient-preference attributes are bookable
    Given "Dr Priya Shah" is recorded as female
    And a patient requires a female practitioner
    When reception books that patient
    Then only practitioners matching the preference are offered by default
    And the reason for the filter is shown
