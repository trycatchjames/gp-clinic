# Non-functional requirements

Targets apply to a correctly sized production deployment and exclude an unavailable future integration.

## Performance

- Patient search SHOULD show the first useful local result within 500 ms at the 95th percentile and MUST progressively disclose that it is still searching if slower.
- Day calendar navigation and patient-summary opening SHOULD show usable cached/primary content within 1 second at the 95th percentile.
- A clinical save MUST acknowledge durable success or explicit failure within 2 seconds at the 95th percentile; it MUST never imply success before durable persistence.
- Lists MUST remain usable with at least 100 practitioners, 1,000 appointments per location/day, 250,000 patients and 20 years of a patient's history through pagination/virtualisation without changing semantics.

## Availability and continuity

- Production service objective: 99.9% monthly availability, excluding notified maintenance.
- Recovery point objective for committed clinical and audit data: 5 minutes. Recovery time objective for core read/write service: 4 hours. Deployments may improve but not silently weaken these targets.
- Backups MUST be encrypted, protected from ordinary administrators, monitored and restoration-tested at least quarterly [ACSC-E8; RACGP-INFOSEC].
- Draft clinical text MUST be recoverable after browser/process interruption. Offline clinical mutation is not a Version 1 requirement; failed connectivity must preserve a local recoverable draft and clearly label it uncommitted.

## Usability and accessibility

- Core workflows MUST conform to WCAG 2.2 Level AA and remain operable by keyboard [WCAG22].
- No safety meaning may rely on colour alone. Focus, selected patient, save state and errors must be perceivable.
- Destructive, clinical and financial confirmation language MUST name the affected object and consequence.

## Security and privacy

- Encrypt sensitive data in transit and at rest; use MFA for privileged and remote access; enforce least privilege; protect secrets and backups separately.
- Security logs and clinical audit records MUST be tamper-evident and access-controlled.
- Data exports MUST be authorised, scoped, attributable and auditable.

## Data quality and operability

- Stable identifiers never encode mutable patient or business information.
- All time-bearing records preserve an instant and relevant Australian timezone context.
- Monitoring MUST detect elevated save failure, queue age, unmatched results, overdue critical work, backup failure and audit-pipeline failure without exposing clinical content in general telemetry.
- Releases changing a lifecycle, permission or clinical record contract require migration and rollback evidence.

## Compatibility

The specification is implementation-neutral. Supported client/platform policy must be published per deployment. Data export must use documented, versioned internal contracts so a practice is not trapped by a UI or database implementation.
