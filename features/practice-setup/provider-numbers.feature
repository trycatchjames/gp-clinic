# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/03-practitioners-and-credentialing.md
#   standards: [GP3.1, C3.1]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @medicare @compliance
Feature: Medicare provider numbers per location
  As a practice manager
  I want each practitioner's provider number recorded per location
  So that claims are submitted with the right number and are not rejected

  Background:
    Given "Brunswick Family Practice" has locations "Brunswick" and "Coburg Branch"
    And I am signed in as the practice manager

  Scenario: A practitioner working at two sites has two provider numbers
    When I record provider numbers for "Dr Tom Nguyen":
      | location       | provider_number |
      | Brunswick      | 2143567A        |
      | Coburg Branch  | 2143567B        |
    Then both are stored against the practitioner
    And each is scoped to its location

  Scenario: Billing uses the provider number for the location of service
    Given "Dr Tom Nguyen" has provider number "2143567B" at "Coburg Branch"
    When an encounter at "Coburg Branch" is billed
    Then the invoice carries provider number "2143567B"

  Scenario: A practitioner cannot be booked where they have no provider number
    Given "Dr Tom Nguyen" has no provider number at "Coburg Branch"
    When reception tries to book him at "Coburg Branch"
    Then a warning is shown that no provider number exists for that location
    And the booking can only proceed if marked non-billable

  Scenario: Adding a location prompts for provider numbers
    When a new location is added
    Then each active practitioner appears on a list of missing provider numbers
    And the list remains on the setup checklist until resolved
