# Screen contract: Correspondence workspace

## Purpose

Manages inbound/outbound clinical communication from unmatched receipt through clinical action or issued dispatch.

## Layout

Queue/filter; correspondence list; safe preview/document viewer; patient/recipient matching panel; owner/action/status history. In patient context the same content appears in timeline with source state.

## Required information/actions

Direction, sender/recipient snapshot, received/authored/effective times, patient/match state, owner, category/sensitivity, linked source and processing/delivery state. Actions: match/reassign/classify, record clinical action/no action, link task/result/referral, author/preview/issue outbound, record manual dispatch/failure, supersede.

## States/failure/privacy

Unmatched/unassigned remain prominent. Filing does not equal review. Unsafe document is quarantined. Partial viewer failure leaves metadata and prevents clinical action that requires content. Admin routing view masks clinical body. Delivery status is user-recorded in Version 1.
