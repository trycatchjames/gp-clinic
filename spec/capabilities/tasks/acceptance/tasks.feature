Feature: Accountable tasks

  Scenario: Open task always has an accountable destination
    When an authorised user creates a task
    Then the task has an assignee or governed team queue
    And it cannot be saved as silently unowned

  Scenario: Completing a task does not close a recall
    Given a task to call a patient is linked to an open recall
    When the receptionist completes the task with a contact outcome
    Then the task is completed
    And the recall remains open until an authorised clinician resolves or ceases it

  Scenario: Recurrence preserves completed history
    Given a recurring task is completed
    When its recurrence rule creates the next occurrence
    Then a new linked open task is created
    And the completed task remains completed with its original outcome and due date
