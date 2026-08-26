# Clinical correspondence

## Purpose and actors

Clinicians and authorised staff create, receive, route and action care-related communication while retaining it in the patient record.

## Primary tasks

Author letter from reviewed template; select recipients/content; issue and record manual dispatch; ingest inbound communication; match patient; assign clinical owner; record action/no-action; link to referral/result/encounter.

## Inputs and outputs

Consumes Patient, Practitioner, Documents, local directory and templates. Produces Correspondence, immutable issued documents and tasks/clinical actions.

## Constraints

Clinical communication is part of record; template fields require review; unmatched and failed-dispatch queues; admin metadata access is separated from clinical content.

## Out of scope

Email/secure messaging integration, eFax and automated inbound classification decisions.
