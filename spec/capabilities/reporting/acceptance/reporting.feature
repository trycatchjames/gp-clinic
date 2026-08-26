Feature: Permission-aware reporting

  Scenario: Report exposes its scope and freshness
    Given an authorised practice manager opens the overdue-results report
    When the report is generated
    Then the inclusion criteria, exclusions, filters and as-of time are visible
    And its total reconciles to the permitted overdue-result worklist

  Scenario: Drill-through does not bypass source permissions
    Given a user can view an aggregate count but cannot view a restricted patient's result
    When the user drills into the aggregate
    Then the restricted result detail is not disclosed
    And the displayed detail count explains that access filtering applies

  Scenario: Export is attributable and auditable
    Given a manager has reporting view permission but lacks reporting export permission
    When the manager requests an export
    Then the export is denied
    And no file is created

  Scenario: Reports cannot submit data externally
    Given Version 1 has no external integrations
    When an authorised user views a billing or programme report
    Then no submit or lodge action is available
    And any prepared output is labelled local and not submitted
