# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/01-appointment-booking.md
#   standards: [GP1.1, C6.3]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling
Feature: The appointment book
  As a receptionist
  I want a dense, fast view of the day
  So that I can work the front desk without fighting the software

  Scenario: The book shows practitioners as columns for a day
    When I open the appointment book for today at "Brunswick"
    Then each rostered practitioner has a column
    And appointment types are colour coded
    And unavailable time is visually distinct from empty slots

  Scenario: Appointment cards carry the information reception needs
    Then each appointment shows the patient name, time, type, status and any front-desk alerts
    And no clinical information is shown

  Scenario: Nurse and GP books can be shown side by side
    When I enable the combined view
    Then nurse clinic columns appear alongside GP columns

  Scenario: Double bookings are visibly marked
    Given a slot has two appointments
    Then both are shown with a double-booking marker
    And the practitioner sees the same marker

  Scenario: Switching location switches the book
    When I switch to "Coburg Branch"
    Then the book shows only practitioners rostered at Coburg Branch
    And times are displayed in Coburg Branch's timezone
