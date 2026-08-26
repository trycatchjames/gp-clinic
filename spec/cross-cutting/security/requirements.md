# Security requirements

## Baseline

The threat model includes account takeover, curious insiders, privilege misuse, wrong-tenant access, ransomware, stolen devices, malicious documents, data exfiltration, supply-chain compromise and silent loss/corruption. Controls align with RACGP information-security guidance and the ACSC Essential Eight without claiming certification. [RACGP-INFOSEC; ACSC-E8]

## Required controls

- TLS for data in transit; strong managed encryption for databases, files, backups and exports at rest; keys separated from encrypted data and rotated.
- MFA for privileged/remote access, secure session controls and phishing-resistant options where feasible.
- Tenant isolation at every data-access boundary; object identifiers alone never authorise access.
- Least privilege, separate administrative and clinical privileges, just-in-time/time-bounded elevation for exceptional support.
- Secrets outside source code/logs, rotation and breach revocation.
- Dependency, application and operating-system patch policy; supported software only.
- Malware scanning/quarantine and safe rendering for uploaded documents; active content disabled by default.
- Protected, immutable/resilient backups inaccessible to ordinary application administrators and quarterly restoration tests.
- Rate limiting, abuse detection and security monitoring for authentication, search, export and bulk operations.
- Secure development review, automated security testing and independent penetration testing before clinical production and after material exposure changes.

## Application safety

- All mutations validate schema, business rules, permission, tenant and current version server-side.
- Concurrency uses explicit versions/preconditions; last-write-wins is prohibited for clinical, identity, responsibility and financial records.
- Logs/telemetry exclude credentials, tokens and unnecessary clinical text. Error messages do not disclose stack traces or cross-tenant existence.
- Export files are minimised, access-controlled, time-limited where delivered through the system and traceable.

## Incident and continuity behaviour

Security events preserve evidence and support contain, disable credentials/integration boundary, notify accountable roles and recover. Compromise response must not destroy audit/history. Degraded mode is clearly visible and does not bypass authorisation or clinical save confirmation.
