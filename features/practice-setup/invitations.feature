# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/04-team-roles-and-access.md
#   standards: [C3.2, C6.4]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Inviting team members
  As a practice manager
  I want to invite staff by email
  So that they set their own password and complete their own details

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"

  Scenario: Sending an invitation
    When I invite "sarah.kelly@example.com" as "practice_nurse" at location "Brunswick"
    Then an invitation is created with a single-use token
    And it expires in 14 days
    And an invitation email is sent

  Scenario: Accepting an invitation
    Given Sarah has a valid invitation
    When she opens the invitation link and sets a password
    Then she becomes an active member with role "practice_nurse"
    And the invitation token can no longer be used

  Scenario: An expired invitation cannot be accepted
    Given Sarah's invitation was created 15 days ago
    When she opens the invitation link
    Then she is told the invitation has expired
    And she is offered a way to request a new one

  Scenario: Revoking a pending invitation
    Given Sarah has a pending invitation
    When I revoke it
    Then the token is invalidated immediately
    And opening the link tells her the invitation is no longer valid

  Scenario: Inviting a clinical role links or creates a practitioner profile
    When I invite "tom.nguyen@example.com" as "general_practitioner"
    Then I must either link an existing practitioner profile or create one
    And the invitation cannot be sent until I have
