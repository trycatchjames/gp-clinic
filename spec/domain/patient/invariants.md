# Patient invariants

1. Every patient has one immutable internal identifier. Local record numbers are unique within a practice and never reused.
2. No two active records may knowingly represent the same person after a confirmed merge; potential duplicates remain separate until authorised resolution.
3. A merge never deletes source history or rewrites authorship. Every linked record can be traced to its pre-merge patient identifier.
4. The surviving patient in a merge cannot itself be a non-surviving merged record.
5. A patient cannot be both operationally active and merged. A deceased patient may be retained as inactive/deceased but never deleted merely because of death.
6. Medicare card number is optional and never counts as one of the minimum approved identifiers used to record identity verification.
7. Date of birth supports exact, estimated/partial or unknown states; display must not fabricate missing day/month.
8. Name used, legal/current name, previous name, assigned sex at birth, gender and pronouns are not derived from one another.
9. Aboriginal and/or Torres Strait Islander status, gender and cultural attributes are self-described; the system must not infer them from appearance, name, address or payer data.
10. A contact marked unsafe or do-not-use cannot be selected by automated/default communication.
11. A representative's access/consent authority is scoped and time-bounded; relationship alone does not confer authority.
12. Updating a mutable demographic fact preserves its change history, source, actor and time.
13. Inactivation, deceased marking and merge are lifecycle operations, not deletion operations.
14. Clinical and financial records linked to a patient remain accessible according to retention and authorisation policy after inactivation, death or merge.
15. Any screen from which clinical, prescription, result, referral or billing action can occur displays enough identity context to distinguish similar patients.
