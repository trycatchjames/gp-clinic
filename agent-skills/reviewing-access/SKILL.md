---
name: reviewing-access
description: Review a GP Clinic pull request for permission, role and practice/account-boundary enforcement, including missing deterministic negative tests. Use for the access review lane; do not treat hidden UI as authorization.
---

# Access-boundary review

Trace every changed read, mutation and projection from authenticated actor to storage/output.
Compare it with the capability permissions and cross-cutting authorization/privacy requirements.

Check that:

- practice scope comes from authenticated context rather than a trusted request identifier;
- cross-practice identifiers are rejected or concealed consistently;
- server-side permission decisions protect every entry point and secondary lookup;
- administrative access does not imply clinical access;
- sensitive-record stubs disclose only approved identity data;
- caches, exports, search, audit and offline data retain the same boundary;
- deterministic tests cover allowed, forbidden and cross-practice cases.

Report only actionable findings with exact locations and a concrete counterexample. An LLM opinion
does not certify access: require missing negative tests or constraints. Do not modify the checkout.

