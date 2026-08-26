# Patient-registration permissions

Registration and demographic edit use `patient.demographics.edit`; representative authority and lifecycle use separate permissions. Duplicate comparison requires access to each displayed data class, and merge requires `patient.merge`, elevated confirmation and a second authorised reviewer. Clinical conflicts require a clinical reviewer. No receptionist role grants clinical content by implication.
