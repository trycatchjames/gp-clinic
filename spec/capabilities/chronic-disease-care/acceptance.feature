Feature: Chronic disease care plans

  Scenario: Activate a plan with accountability
    Given a draft plan has patient-agreed goals and actions
    And each action has an accountable participant
    And the plan has a responsible practitioner and review disposition
    When the responsible practitioner activates it
    Then the active version is retained with author and time
    And linked tasks or referrals are created explicitly

  Scenario: Billing does not complete a plan
    Given an active care plan has an invoice linked to its encounter
    When the invoice becomes paid
    Then the care plan remains active until its clinical lifecycle is completed or ceased

  Scenario: Review preserves the earlier plan
    Given an active plan reaches review
    When the clinician records outcomes and revises goals
    Then a new plan version is linked to the prior version
    And the prior version remains readable as the plan that applied before review
