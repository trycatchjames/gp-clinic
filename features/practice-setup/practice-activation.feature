# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/01-practice-registration-and-onboarding.md
#   standards: [C3.1, C3.2, GP3.1]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @onboarding
Feature: Activating a practice
  As a practice owner
  I want to activate the practice once the essentials are in place
  So that we can start booking and seeing patients

  Background:
    Given I am signed in as the owner of "Brunswick Family Practice"

  Scenario: Activation requires the essentials
    Given the practice has no active practitioner with a provider number
    When I open the "Review and activate" step
    Then activation is blocked
    And the outstanding required items include "At least one practitioner with a provider number"

  Scenario: Activation succeeds with the required items complete
    Given the practice has:
      | requirement                                    |
      | practice identity                              |
      | a location with an address and timezone        |
      | a practitioner with a provider number at that location |
      | at least one appointment type                  |
      | at least one fee schedule                      |
    When I activate the practice
    Then the practice onboarding status becomes "active"
    And the appointment book becomes usable
    And an audit entry records the activation

  Scenario: Recommended items do not block activation but stay visible
    Given the practice has no HPI-O recorded
    And all required items are complete
    When I activate the practice
    Then the practice is activated
    And "Add your HPI-O" remains on the dashboard setup list

  Scenario: Deactivating a practice preserves clinical data
    Given the practice is active and has clinical records
    When the practice is deactivated
    Then no clinical record is deleted
    And users can no longer create new clinical records
    And an audit entry records the deactivation and the actor
