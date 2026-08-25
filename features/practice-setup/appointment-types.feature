# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/05-appointment-types-and-books.md
#   standards: [GP1.1, C1.5]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Appointment types
  As a practice manager
  I want to define what can be booked and for how long
  So that the book reflects how we actually run and billing is pre-filled

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"

  Scenario: Creating an appointment type
    When I create an appointment type:
      | field             | value                |
      | name              | Skin check           |
      | minutes           | 30                   |
      | colour            | #2E7D32              |
      | online_bookable   | true                 |
      | default_mbs_item  | 36                   |
      | allowed_kinds     | gp, gp_registrar     |
    Then it is available in the appointment book

  @compliance @medicare
  Scenario: The default MBS item is a suggestion, never an automatic bill
    Given appointment type "Standard consultation" has default MBS item "23"
    When a consultation of that type is completed
    Then item "23" is suggested at billing
    And nothing is billed until the practitioner confirms

  Scenario: Online booking constraints are enforced
    Given appointment type "Skin check" has minimum notice of 120 minutes
    When a patient tries to book it online for 60 minutes from now
    Then no slot is offered

  Scenario: A type in use is deactivated rather than deleted
    Given appointment type "Skin check" has been used on 300 appointments
    When I remove it
    Then it is deactivated
    And historical appointments still show the type

  Scenario: Types requiring triage cannot be booked online
    Given appointment type "Urgent same-day" requires a triage prompt
    Then it is not offered in online booking
    And selecting the matching reason online shows the practice's contact message
