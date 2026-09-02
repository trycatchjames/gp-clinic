Feature: Internal referrals

  Scenario: Issue only selected relevant content
    Given a clinician has selected a recipient and referral reason
    And has selected specific problems, medicines, results and attachments
    When the clinician issues the referral
    Then the retained rendition contains the selected content and at least three patient identifiers
    And unselected patient-record content is not included
    And recipient/referrer details are snapshotted

  Scenario: Failed manual dispatch remains actionable
    Given a referral has been issued
    When staff record that the manual dispatch attempt failed
    Then the referral is not shown delivered
    And it remains in a failed-dispatch work queue with an accountable owner

  Scenario: Recipient change after issue creates a new version
    Given a referral has been issued to Recipient A
    When an authorised clinician changes the recipient to Recipient B
    Then a superseding referral version is created
    And the issued version to Recipient A remains unchanged in history
