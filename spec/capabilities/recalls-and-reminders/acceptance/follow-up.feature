Feature: Recalls and reminders

  Scenario: Failed recall contacts remain an open obligation
    Given an urgent recall is open
    When staff record two unsuccessful telephone attempts
    Then both attempts are retained with time, actor, destination snapshot and outcome
    And the recall remains open
    And the next escalation action is visible according to approved policy

  Scenario: Recall appointment cancellation resumes pursuit
    Given an open recall has a linked appointment
    When that appointment is cancelled
    Then the recall does not close
    And it returns to contact_in_progress or another open escalation state

  Scenario: Only a clinician closes a recall
    Given a recall-related appointment was attended
    When an administrative user views the recall
    Then attendance is shown as evidence
    But clinical closure is unavailable
    When an authorised clinician records the clinical outcome
    Then the recall becomes clinically_resolved with actor and time

  Scenario: Preventive reminder non-response does not become a recall
    Given a routine preventive reminder was sent-recorded
    And the patient does not respond
    When its response period passes
    Then it remains due or expires according to reminder policy
    And no clinical recall is created unless a clinician separately creates one

  Scenario: Appointment reminder is not a preventive reminder
    Given a patient has a booked appointment
    When staff record an appointment reminder attempt
    Then it is linked to the appointment communication history
    And it does not create or complete a preventive reminder or clinical recall
