# Availability lifecycle

Session templates and exceptions use `draft → active → retired`; a draft has no booking effect. Activation validates timezone, dates and conflicts with configuration but does not rewrite appointments. Retirement stops future generation after its effective end.

A practitioner absence uses `planned → active → ended` or `cancelled`. On creation/extension, the system identifies affected appointments and owned clinical obligations. The absence cannot be considered operationally resolved until the worklist is assigned, even though the unavailable interval takes effect immediately.
