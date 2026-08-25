CREATE TYPE "public"."accreditation_status" AS ENUM('not_accredited', 'in_progress', 'accredited', 'lapsed');--> statement-breakpoint
CREATE TYPE "public"."after_hours_arrangement" AS ENUM('own_practitioners', 'cooperative', 'deputising_service', 'hospital_ed_referral');--> statement-breakpoint
CREATE TYPE "public"."ahpra_registration_type" AS ENUM('general', 'specialist', 'limited', 'provisional', 'non_practising');--> statement-breakpoint
CREATE TYPE "public"."alert_category" AS ENUM('clinical', 'front_desk');--> statement-breakpoint
CREATE TYPE "public"."alert_severity" AS ENUM('info', 'warning', 'critical');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('booked', 'confirmed', 'arrived', 'with_nurse', 'waiting', 'in_consultation', 'completed', 'cancelled', 'did_not_attend');--> statement-breakpoint
CREATE TYPE "public"."atsi_status" AS ENUM('aboriginal', 'torres_strait_islander', 'both', 'neither', 'not_stated');--> statement-breakpoint
CREATE TYPE "public"."australian_state" AS ENUM('NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT');--> statement-breakpoint
CREATE TYPE "public"."billing_cohort" AS ENUM('commonwealth_concession_card', 'pension_concession_card', 'under_16', 'over_65', 'dva_card_holder', 'aboriginal_or_torres_strait_islander', 'mymedicare_registered');--> statement-breakpoint
CREATE TYPE "public"."billing_policy" AS ENUM('bulk_bill_all', 'mixed', 'private');--> statement-breakpoint
CREATE TYPE "public"."care_plan_type" AS ENUM('chronic_condition_management', 'legacy_gpmp', 'legacy_tca', 'mental_health', 'asthma_action', 'other');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('draft', 'submitted', 'processing', 'accepted', 'rejected', 'resubmitted', 'part_paid', 'paid');--> statement-breakpoint
CREATE TYPE "public"."condition_status" AS ENUM('active', 'inactive', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."consent_type" AS ENUM('privacy_collection_statement', 'my_health_record_upload', 'sms_communication', 'email_communication', 'mymedicare_registration', 'procedure_specific', 'third_party_disclosure', 'research_or_qi_data_use');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."dva_card_colour" AS ENUM('gold', 'white', 'orange');--> statement-breakpoint
CREATE TYPE "public"."encounter_type" AS ENUM('consultation', 'telehealth_video', 'telehealth_phone', 'home_visit', 'residential_aged_care', 'nurse_clinic', 'after_hours', 'emergency');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('sole_trader', 'company', 'partnership', 'trust', 'aboriginal_community_controlled', 'other');--> statement-breakpoint
CREATE TYPE "public"."fee_schedule_kind" AS ENUM('bulk_bill', 'private', 'dva', 'workcover', 'non_medicare');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'issued', 'part_paid', 'paid', 'written_off', 'credited');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'suspended', 'removed');--> statement-breakpoint
CREATE TYPE "public"."mymedicare_status" AS ENUM('not_registered', 'registration_in_progress', 'registered');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('in_progress', 'active', 'suspended', 'closed');--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('practice_identity', 'primary_location', 'opening_hours', 'registrations', 'team', 'appointment_types', 'billing_setup', 'review');--> statement-breakpoint
CREATE TYPE "public"."patient_status" AS ENUM('active', 'inactive', 'deceased', 'transferred_out');--> statement-breakpoint
CREATE TYPE "public"."payer" AS ENUM('medicare_bulk_bill', 'medicare_patient_claim', 'private', 'dva', 'workcover', 'ctp', 'third_party', 'no_charge');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('eftpos', 'card', 'cash', 'direct_deposit', 'account');--> statement-breakpoint
CREATE TYPE "public"."practice_role" AS ENUM('practice_owner', 'practice_manager', 'general_practitioner', 'gp_registrar', 'practice_nurse', 'allied_health', 'receptionist', 'practice_admin');--> statement-breakpoint
CREATE TYPE "public"."practice_type" AS ENUM('general_practice', 'aboriginal_community_controlled_health_service', 'after_hours_service', 'corporate_group');--> statement-breakpoint
CREATE TYPE "public"."practitioner_kind" AS ENUM('gp', 'gp_registrar', 'nurse', 'nurse_practitioner', 'midwife', 'allied_health', 'practice_pharmacist', 'aboriginal_health_practitioner');--> statement-breakpoint
CREATE TYPE "public"."public_holiday_behaviour" AS ENUM('closed', 'open_normal', 'open_reduced');--> statement-breakpoint
CREATE TYPE "public"."qualification_type" AS ENUM('fellowship_racgp', 'fellowship_acrrm', 'mental_health_skills_training', 'focussed_psychological_strategies', 'cpr', 'anaphylaxis', 'immunisation_provider', 'cervical_screening', 'iud_insertion', 'implant_insertion', 'skin_procedures', 'spirometry', 'other');--> statement-breakpoint
CREATE TYPE "public"."recall_priority" AS ENUM('routine', 'urgent', 'critical');--> statement-breakpoint
CREATE TYPE "public"."recall_status" AS ENUM('open', 'contacted', 'attended', 'closed_clinical_decision', 'closed_patient_deceased');--> statement-breakpoint
CREATE TYPE "public"."remuneration_model" AS ENUM('percentage_of_billings', 'salary', 'sessional', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."result_action" AS ENUM('no_action_normal', 'no_action_expected_abnormal', 'inform_patient', 'routine_recall', 'urgent_recall', 'immediate_contact', 'refer');--> statement-breakpoint
CREATE TYPE "public"."step_status" AS ENUM('not_started', 'in_progress', 'complete', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."supervision_level" AS ENUM('direct', 'indirect', 'remote');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('open', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."training_term" AS ENUM('GPT1', 'GPT2', 'GPT3', 'extended_skills', 'other');--> statement-breakpoint
CREATE TYPE "public"."triage_action" AS ENUM('call_000', 'escalate_now', 'same_day');--> statement-breakpoint
CREATE TYPE "public"."working_arrangement" AS ENUM('employee', 'contractor', 'partner', 'locum');--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"email" text NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"role" "practice_role" NOT NULL,
	"practitioner_id" uuid,
	"token_hash" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"invited_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "member_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"membership_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practice_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "practice_role" NOT NULL,
	"status" "membership_status" DEFAULT 'active' NOT NULL,
	"practitioner_id" uuid,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"password_hash" text NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"mobile" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "billing_cohort_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"cohort" text NOT NULL,
	"bulk_bill" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "location_business_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"opens_at" time,
	"closes_at" time,
	"break_starts_at" time,
	"break_ends_at" time,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "location_closures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"reason" text NOT NULL,
	"patient_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "onboarding_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"step" "onboarding_step" NOT NULL,
	"status" "step_status" DEFAULT 'not_started' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practice_billing_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"billing_policy" "billing_policy" DEFAULT 'mixed' NOT NULL,
	"private_fee_multiplier_bp" integer DEFAULT 17500 NOT NULL,
	"private_fee_rounding_cents" integer DEFAULT 500 NOT NULL,
	"suggest_bulk_bill_incentives" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "practice_billing_settings_practice_id_unique" UNIQUE("practice_id")
);
--> statement-breakpoint
CREATE TABLE "practice_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"name" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"street_address" text NOT NULL,
	"suburb" text NOT NULL,
	"state" "australian_state" NOT NULL,
	"postcode" text NOT NULL,
	"postal_address" text,
	"timezone" text NOT NULL,
	"phone" text,
	"after_hours_phone" text,
	"fax" text,
	"email" text,
	"hpi_o" text,
	"medicare_minor_id" text,
	"after_hours_arrangement" "after_hours_arrangement",
	"after_hours_provider_name" text,
	"after_hours_contact" text,
	"after_hours_notes" text,
	"public_holiday_behaviour" "public_holiday_behaviour" DEFAULT 'closed' NOT NULL,
	"wheelchair_access" boolean DEFAULT false NOT NULL,
	"accessible_toilet" boolean DEFAULT false NOT NULL,
	"hearing_loop" boolean DEFAULT false NOT NULL,
	"on_site_parking" boolean DEFAULT false NOT NULL,
	"public_transport_nearby" boolean DEFAULT false NOT NULL,
	"treatment_room" boolean DEFAULT false NOT NULL,
	"procedure_room" boolean DEFAULT false NOT NULL,
	"on_site_pathology_collection" boolean DEFAULT false NOT NULL,
	"default_fee_schedule_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practice_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"proda_organisation_name" text,
	"proda_ra_number" text,
	"mymedicare_status" "mymedicare_status" DEFAULT 'not_registered' NOT NULL,
	"mymedicare_registered_on" date,
	"bbpip_participating" boolean DEFAULT false NOT NULL,
	"bbpip_effective_from" date,
	"bbpip_effective_to" date,
	"accreditation_status" "accreditation_status" DEFAULT 'not_accredited' NOT NULL,
	"accrediting_body" text,
	"accreditation_expires_on" date,
	"pip_participating" boolean DEFAULT false NOT NULL,
	"wip_participating" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "practice_registrations_practice_id_unique" UNIQUE("practice_id")
);
--> statement-breakpoint
CREATE TABLE "practices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legal_name" text NOT NULL,
	"trading_name" text NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"practice_type" "practice_type" DEFAULT 'general_practice' NOT NULL,
	"abn" text,
	"acn" text,
	"contact_email" text,
	"contact_phone" text,
	"website" text,
	"onboarding_status" "onboarding_status" DEFAULT 'in_progress' NOT NULL,
	"activated_at" timestamp with time zone,
	"deactivated_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practitioner_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"provider_number" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practitioner_qualifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"qualification_type" "qualification_type" NOT NULL,
	"description" text,
	"issuing_body" text,
	"obtained_on" date,
	"expires_on" date,
	"evidence_document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practitioner_remuneration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"model" "remuneration_model" NOT NULL,
	"percentage_bp" integer,
	"of_gross" boolean DEFAULT true NOT NULL,
	"service_fee_percentage_bp" integer,
	"session_rate_cents" integer,
	"annual_salary_cents" integer,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "practitioners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"title" text,
	"given_name" text NOT NULL,
	"family_name" text NOT NULL,
	"preferred_name" text,
	"gender" text,
	"date_of_birth" date,
	"email" text,
	"mobile" text,
	"kind" "practitioner_kind" NOT NULL,
	"ahpra_registration_number" text,
	"ahpra_registration_type" "ahpra_registration_type",
	"ahpra_profession" text,
	"ahpra_specialty" text,
	"ahpra_conditions" text,
	"ahpra_expires_on" date,
	"hpi_i" text,
	"prescriber_number" text,
	"vocational_registration" boolean DEFAULT false NOT NULL,
	"mental_health_skills_training" boolean DEFAULT false NOT NULL,
	"is_supervisor" boolean DEFAULT false NOT NULL,
	"working_arrangement" "working_arrangement",
	"indemnity_insurer" text,
	"indemnity_policy_number" text,
	"indemnity_expires_on" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "supervision_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"registrar_id" uuid NOT NULL,
	"supervisor_id" uuid NOT NULL,
	"supervision_level" "supervision_level" NOT NULL,
	"training_term" "training_term",
	"training_organisation" text,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "mbs_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_number" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"group" text NOT NULL,
	"schedule_fee_cents" integer NOT NULL,
	"benefit_percent" integer DEFAULT 100 NOT NULL,
	"min_minutes" integer,
	"max_minutes" integer,
	"requires_mental_health_skills_training" boolean DEFAULT false NOT NULL,
	"requires_mymedicare" boolean DEFAULT false NOT NULL,
	"bulk_bill_incentive_eligible" boolean DEFAULT false NOT NULL,
	"frequency_limit_months" integer,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "claim_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"claim_id" uuid NOT NULL,
	"invoice_line_id" uuid NOT NULL,
	"expected_cents" integer NOT NULL,
	"paid_cents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid,
	"batch_reference" text,
	"payer" "payer" NOT NULL,
	"status" "claim_status" DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"responded_at" timestamp with time zone,
	"rejection_code" text,
	"rejection_reason" text,
	"expected_cents" integer DEFAULT 0 NOT NULL,
	"paid_cents" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "fee_schedule_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"fee_schedule_id" uuid NOT NULL,
	"mbs_item_id" uuid,
	"item_code" text NOT NULL,
	"description" text NOT NULL,
	"fee_cents" integer NOT NULL,
	"benefit_cents" integer DEFAULT 0 NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "fee_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"kind" "fee_schedule_kind" NOT NULL,
	"name" text NOT NULL,
	"is_editable" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"mbs_item_id" uuid,
	"item_code" text NOT NULL,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"fee_cents" integer NOT NULL,
	"benefit_cents" integer DEFAULT 0 NOT NULL,
	"suggestion_reason" text,
	"override_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"encounter_id" uuid,
	"invoice_number" integer NOT NULL,
	"payer" "payer" NOT NULL,
	"payer_reason" text,
	"payer_override_reason" text,
	"provider_number" text,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"service_date" date NOT NULL,
	"issued_at" timestamp with time zone,
	"total_cents" integer DEFAULT 0 NOT NULL,
	"benefit_cents" integer DEFAULT 0 NOT NULL,
	"gap_cents" integer DEFAULT 0 NOT NULL,
	"paid_cents" integer DEFAULT 0 NOT NULL,
	"assignment_of_benefit_captured_at" timestamp with time zone,
	"assignment_signed_by" text,
	"bbpip_exception_reason" text,
	"credits_invoice_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"method" "payment_method" NOT NULL,
	"amount_cents" integer NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "appointment_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"appointment_id" uuid NOT NULL,
	"from_status" "appointment_status",
	"to_status" "appointment_status" NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" uuid,
	"correction_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "appointment_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"name" text NOT NULL,
	"short_code" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"colour" text NOT NULL,
	"description" text,
	"allowed_practitioner_kinds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"online_bookable" boolean DEFAULT false NOT NULL,
	"new_patients_allowed" boolean DEFAULT true NOT NULL,
	"double_booking_allowed" boolean DEFAULT false NOT NULL,
	"requires_triage_prompt" boolean DEFAULT false NOT NULL,
	"min_notice_minutes" integer,
	"max_advance_days" integer,
	"default_mbs_item_number" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"appointment_type_id" uuid NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer NOT NULL,
	"reason_for_visit" text NOT NULL,
	"status" "appointment_status" DEFAULT 'booked' NOT NULL,
	"booked_online" boolean DEFAULT false NOT NULL,
	"is_double_booked" boolean DEFAULT false NOT NULL,
	"overbooking_reason" text,
	"outside_availability_reason" text,
	"non_billable" boolean DEFAULT false NOT NULL,
	"original_starts_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"cancellation_reason" text,
	"is_late_cancellation" boolean DEFAULT false NOT NULL,
	"linked_recall_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "session_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"location_id" uuid,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"adds_availability" boolean DEFAULT false NOT NULL,
	"starts_at" time,
	"ends_at" time,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "session_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"starts_at" time NOT NULL,
	"ends_at" time NOT NULL,
	"slot_minutes" integer DEFAULT 15 NOT NULL,
	"online_bookable" boolean DEFAULT true NOT NULL,
	"allowed_appointment_type_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"outside_opening_hours_reason" text,
	"effective_from" date,
	"effective_to" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "triage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"triage_prompt_id" uuid,
	"patient_id" uuid,
	"appointment_id" uuid,
	"reason_text" text NOT NULL,
	"prompt_shown" text NOT NULL,
	"selected_action" "triage_action" NOT NULL,
	"outcome" text,
	"escalated_to_user_id" uuid,
	"escalated_at" timestamp with time zone,
	"acknowledged_at" timestamp with time zone,
	"actor_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "triage_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"prompt_key" text NOT NULL,
	"label" text NOT NULL,
	"matches" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"question" text NOT NULL,
	"action" "triage_action" NOT NULL,
	"blocks_online_booking" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"consent_type" "consent_type" NOT NULL,
	"granted" boolean NOT NULL,
	"granted_at" timestamp with time zone,
	"withdrawn_at" timestamp with time zone,
	"scope" text,
	"recorded_by_user_id" uuid,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "patient_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"category" "alert_category" NOT NULL,
	"severity" "alert_severity" DEFAULT 'info' NOT NULL,
	"text" text NOT NULL,
	"review_on" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "patient_entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"medicare_number" text,
	"medicare_irn" text,
	"medicare_expires_on" date,
	"medicare_verified_at" timestamp with time zone,
	"medicare_verification_method" text,
	"dva_file_number" text,
	"dva_card_colour" "dva_card_colour",
	"concession_card_type" text,
	"concession_card_number" text,
	"concession_expires_on" date,
	"private_health_fund" text,
	"private_health_membership" text,
	"individual_healthcare_identifier" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "patient_entitlements_patient_id_unique" UNIQUE("patient_id")
);
--> statement-breakpoint
CREATE TABLE "patient_mymedicare_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"status" "mymedicare_status" DEFAULT 'not_registered' NOT NULL,
	"preferred_practitioner_id" uuid,
	"registered_on" date,
	"withdrawn_on" date,
	"consent_recorded_by_user_id" uuid,
	"consent_recorded_at" timestamp with time zone,
	"source" text DEFAULT 'manual_entry' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"title" text,
	"family_name" text NOT NULL,
	"given_names" text NOT NULL,
	"preferred_name" text,
	"date_of_birth" date NOT NULL,
	"sex_at_birth" text,
	"gender_identity" text,
	"pronouns" text,
	"mobile" text,
	"home_phone" text,
	"work_phone" text,
	"email" text,
	"residential_address" text,
	"suburb" text,
	"state" text,
	"postcode" text,
	"postal_address" text,
	"contact_details_confirmed_at" timestamp with time zone,
	"atsi_status" "atsi_status" DEFAULT 'not_stated' NOT NULL,
	"country_of_birth" text,
	"preferred_language" text,
	"interpreter_required" boolean DEFAULT false NOT NULL,
	"usual_practitioner_id" uuid,
	"status" "patient_status" DEFAULT 'active' NOT NULL,
	"deceased_on" date,
	"deceased_source" text,
	"merged_into_patient_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "allergies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"is_nil_known" boolean DEFAULT false NOT NULL,
	"substance" text,
	"reaction" text,
	"severity" text,
	"recorded_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "care_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"plan_type" "care_plan_type" NOT NULL,
	"is_legacy_framework" boolean DEFAULT false NOT NULL,
	"prepared_on" date NOT NULL,
	"review_due_on" date,
	"patient_goals" text,
	"clinical_goals" text,
	"management_actions" text,
	"copy_given_to_patient_at" timestamp with time zone,
	"allied_health_allocation_total" integer,
	"allied_health_allocation_used" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "clinical_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"encounter_id" uuid NOT NULL,
	"reason_for_encounter" text,
	"history" text,
	"examination" text,
	"assessment" text,
	"no_assessment_reason" text,
	"plan" text,
	"safety_netting" text,
	"safety_netting_prompt_declined" boolean DEFAULT false NOT NULL,
	"probability_diagnosis" text,
	"serious_not_to_miss" text,
	"commonly_missed" text,
	"masquerades_considered" jsonb,
	"patient_agenda" text,
	"signed_at" timestamp with time zone,
	"signed_by" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"code" text,
	"code_system" text DEFAULT 'snomed-ct-au',
	"display_text" text NOT NULL,
	"status" "condition_status" DEFAULT 'active' NOT NULL,
	"is_chronic" boolean DEFAULT false NOT NULL,
	"onset_on" date,
	"resolved_on" date,
	"inactive_reason" text,
	"recorded_in_encounter_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"source_name" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"routed_to_practitioner_id" uuid,
	"referral_id" uuid,
	"actioned_at" timestamp with time zone,
	"actioned_by" uuid,
	"action_summary" text,
	"storage_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "encounters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"appointment_id" uuid,
	"encounter_type" "encounter_type" DEFAULT 'consultation' NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"duration_minutes" integer,
	"supervisor_review_requested" boolean DEFAULT false NOT NULL,
	"supervisor_reviewed_at" timestamp with time zone,
	"supervisor_reviewed_by" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "immunisations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"encounter_id" uuid,
	"vaccine_name" text NOT NULL,
	"batch_number" text NOT NULL,
	"expires_on" date,
	"dose_number" integer,
	"route" text,
	"site" text NOT NULL,
	"administered_at" timestamp with time zone NOT NULL,
	"administered_by_practitioner_id" uuid NOT NULL,
	"observation_started_at" timestamp with time zone,
	"observation_completed_at" timestamp with time zone,
	"observation_exception_reason" text,
	"reported_to_register_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "investigation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"encounter_id" uuid,
	"ordering_practitioner_id" uuid NOT NULL,
	"modality" text NOT NULL,
	"tests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"clinical_indication" text NOT NULL,
	"clinical_question" text,
	"urgency" text DEFAULT 'routine' NOT NULL,
	"provider_name" text,
	"expected_return_by_date" date,
	"closed_at" timestamp with time zone,
	"closed_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"name" text NOT NULL,
	"form" text,
	"strength" text,
	"dose" text,
	"frequency" text,
	"route" text,
	"indication" text,
	"started_on" date,
	"ceased_on" date,
	"ceased_reason" text,
	"is_current" boolean DEFAULT true NOT NULL,
	"last_reconciled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "note_amendments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"clinical_note_id" uuid NOT NULL,
	"amendment_text" text NOT NULL,
	"reason" text NOT NULL,
	"author_user_id" uuid NOT NULL,
	"amended_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"encounter_id" uuid,
	"code" text NOT NULL,
	"display_text" text NOT NULL,
	"value_numeric" text,
	"value_text" text,
	"unit" text,
	"observed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "recall_contact_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"recall_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempted_by_user_id" uuid,
	"outcome" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "recalls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"responsible_practitioner_id" uuid NOT NULL,
	"result_id" uuid,
	"reason" text NOT NULL,
	"priority" "recall_priority" DEFAULT 'routine' NOT NULL,
	"due_on" date NOT NULL,
	"status" "recall_status" DEFAULT 'open' NOT NULL,
	"escalation_step" integer DEFAULT 0 NOT NULL,
	"closed_at" timestamp with time zone,
	"closed_by" uuid,
	"closure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"encounter_id" uuid,
	"referring_practitioner_id" uuid NOT NULL,
	"care_plan_id" uuid,
	"recipient_name" text NOT NULL,
	"recipient_specialty" text,
	"reason" text NOT NULL,
	"clinical_question" text NOT NULL,
	"urgency" text DEFAULT 'routine' NOT NULL,
	"is_indefinite" boolean DEFAULT false NOT NULL,
	"valid_until" date,
	"sent_at" timestamp with time zone,
	"receipt_confirmed_at" timestamp with time zone,
	"expected_reply_by" date,
	"closed_at" timestamp with time zone,
	"closure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"activity_key" text NOT NULL,
	"description" text NOT NULL,
	"due_on" date NOT NULL,
	"completed_on" date,
	"declined_on" date,
	"declined_reason" text,
	"not_applicable_reason" text,
	"review_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_id" uuid,
	"investigation_request_id" uuid,
	"ordering_practitioner_id" uuid,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"report_text" text,
	"is_critical_flagged" boolean DEFAULT false NOT NULL,
	"action" "result_action",
	"action_reason" text,
	"actioned_at" timestamp with time zone,
	"actioned_by" uuid,
	"acknowledged_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "accreditation_criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"criterion_code" text NOT NULL,
	"criterion_title" text NOT NULL,
	"module" text NOT NULL,
	"status" text DEFAULT 'not_met' NOT NULL,
	"responsible_user_id" uuid,
	"last_reviewed_on" date,
	"next_review_on" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "audit_log_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid,
	"actor_user_id" uuid,
	"patient_id" uuid,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"break_glass_reason" text,
	"ip_address" text,
	"user_agent" text,
	"context" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cold_chain_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"refrigerator_name" text NOT NULL,
	"min_temp" text NOT NULL,
	"max_temp" text NOT NULL,
	"current_temp" text NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recorded_by_user_id" uuid,
	"is_breach" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid,
	"practitioner_id" uuid,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"serial_number" text,
	"purchased_on" date,
	"service_interval_months" date,
	"last_serviced_on" date,
	"next_service_due_on" date,
	"expires_on" date,
	"is_safety_critical" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"practice_id" uuid,
	"user_id" uuid,
	"method" text NOT NULL,
	"path" text NOT NULL,
	"request_hash" text NOT NULL,
	"response_status" text,
	"response_body" jsonb,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "idempotency_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"category" text NOT NULL,
	"summary" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"reported_by_user_id" uuid,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"patient_affected" boolean DEFAULT false NOT NULL,
	"patient_id" uuid,
	"immediate_actions" text,
	"contributing_factors" text,
	"severity" text,
	"open_disclosure_recorded" boolean DEFAULT false NOT NULL,
	"closed_at" timestamp with time zone,
	"closure_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "sterilisation_loads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"autoclave_name" text NOT NULL,
	"load_number" text NOT NULL,
	"loaded_at" timestamp with time zone NOT NULL,
	"contents" text NOT NULL,
	"cycle_parameters" text,
	"chemical_indicator_result" text,
	"biological_indicator_result" text,
	"cycle_passed" boolean,
	"quarantined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"priority" "task_priority" DEFAULT 'normal' NOT NULL,
	"status" "task_status" DEFAULT 'open' NOT NULL,
	"assigned_to_user_id" uuid,
	"assigned_to_practitioner_id" uuid,
	"patient_id" uuid,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"due_on" date,
	"completed_at" timestamp with time zone,
	"completed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_locations" ADD CONSTRAINT "member_locations_membership_id_practice_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."practice_memberships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_locations" ADD CONSTRAINT "member_locations_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_memberships" ADD CONSTRAINT "practice_memberships_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_memberships" ADD CONSTRAINT "practice_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_cohort_rules" ADD CONSTRAINT "billing_cohort_rules_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_business_hours" ADD CONSTRAINT "location_business_hours_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_business_hours" ADD CONSTRAINT "location_business_hours_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_closures" ADD CONSTRAINT "location_closures_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_closures" ADD CONSTRAINT "location_closures_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_progress" ADD CONSTRAINT "onboarding_progress_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_billing_settings" ADD CONSTRAINT "practice_billing_settings_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_locations" ADD CONSTRAINT "practice_locations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_registrations" ADD CONSTRAINT "practice_registrations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_locations" ADD CONSTRAINT "practitioner_locations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_locations" ADD CONSTRAINT "practitioner_locations_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_locations" ADD CONSTRAINT "practitioner_locations_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_qualifications" ADD CONSTRAINT "practitioner_qualifications_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_qualifications" ADD CONSTRAINT "practitioner_qualifications_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_remuneration" ADD CONSTRAINT "practitioner_remuneration_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner_remuneration" ADD CONSTRAINT "practitioner_remuneration_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supervision_relationships" ADD CONSTRAINT "supervision_relationships_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supervision_relationships" ADD CONSTRAINT "supervision_relationships_registrar_id_practitioners_id_fk" FOREIGN KEY ("registrar_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supervision_relationships" ADD CONSTRAINT "supervision_relationships_supervisor_id_practitioners_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_items" ADD CONSTRAINT "claim_items_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_items" ADD CONSTRAINT "claim_items_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_items" ADD CONSTRAINT "claim_items_invoice_line_id_invoice_lines_id_fk" FOREIGN KEY ("invoice_line_id") REFERENCES "public"."invoice_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_schedule_items" ADD CONSTRAINT "fee_schedule_items_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_schedule_items" ADD CONSTRAINT "fee_schedule_items_fee_schedule_id_fee_schedules_id_fk" FOREIGN KEY ("fee_schedule_id") REFERENCES "public"."fee_schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_schedule_items" ADD CONSTRAINT "fee_schedule_items_mbs_item_id_mbs_items_id_fk" FOREIGN KEY ("mbs_item_id") REFERENCES "public"."mbs_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_schedules" ADD CONSTRAINT "fee_schedules_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_mbs_item_id_mbs_items_id_fk" FOREIGN KEY ("mbs_item_id") REFERENCES "public"."mbs_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_status_history" ADD CONSTRAINT "appointment_status_history_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_status_history" ADD CONSTRAINT "appointment_status_history_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_types" ADD CONSTRAINT "appointment_types_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_appointment_type_id_appointment_types_id_fk" FOREIGN KEY ("appointment_type_id") REFERENCES "public"."appointment_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_overrides" ADD CONSTRAINT "session_overrides_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_overrides" ADD CONSTRAINT "session_overrides_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_overrides" ADD CONSTRAINT "session_overrides_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_templates" ADD CONSTRAINT "session_templates_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_templates" ADD CONSTRAINT "session_templates_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_templates" ADD CONSTRAINT "session_templates_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triage_events" ADD CONSTRAINT "triage_events_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triage_events" ADD CONSTRAINT "triage_events_triage_prompt_id_triage_prompts_id_fk" FOREIGN KEY ("triage_prompt_id") REFERENCES "public"."triage_prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triage_events" ADD CONSTRAINT "triage_events_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triage_prompts" ADD CONSTRAINT "triage_prompts_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_alerts" ADD CONSTRAINT "patient_alerts_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_alerts" ADD CONSTRAINT "patient_alerts_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_entitlements" ADD CONSTRAINT "patient_entitlements_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_entitlements" ADD CONSTRAINT "patient_entitlements_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_mymedicare_registrations" ADD CONSTRAINT "patient_mymedicare_registrations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_mymedicare_registrations" ADD CONSTRAINT "patient_mymedicare_registrations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_mymedicare_registrations" ADD CONSTRAINT "patient_mymedicare_registrations_preferred_practitioner_id_practitioners_id_fk" FOREIGN KEY ("preferred_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_usual_practitioner_id_practitioners_id_fk" FOREIGN KEY ("usual_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_recorded_in_encounter_id_encounters_id_fk" FOREIGN KEY ("recorded_in_encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_routed_to_practitioner_id_practitioners_id_fk" FOREIGN KEY ("routed_to_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_referral_id_referrals_id_fk" FOREIGN KEY ("referral_id") REFERENCES "public"."referrals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_location_id_practice_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."practice_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunisations" ADD CONSTRAINT "immunisations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunisations" ADD CONSTRAINT "immunisations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunisations" ADD CONSTRAINT "immunisations_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunisations" ADD CONSTRAINT "immunisations_administered_by_practitioner_id_practitioners_id_fk" FOREIGN KEY ("administered_by_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation_requests" ADD CONSTRAINT "investigation_requests_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation_requests" ADD CONSTRAINT "investigation_requests_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation_requests" ADD CONSTRAINT "investigation_requests_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation_requests" ADD CONSTRAINT "investigation_requests_ordering_practitioner_id_practitioners_id_fk" FOREIGN KEY ("ordering_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_amendments" ADD CONSTRAINT "note_amendments_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_amendments" ADD CONSTRAINT "note_amendments_clinical_note_id_clinical_notes_id_fk" FOREIGN KEY ("clinical_note_id") REFERENCES "public"."clinical_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observations" ADD CONSTRAINT "observations_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observations" ADD CONSTRAINT "observations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observations" ADD CONSTRAINT "observations_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recall_contact_attempts" ADD CONSTRAINT "recall_contact_attempts_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recall_contact_attempts" ADD CONSTRAINT "recall_contact_attempts_recall_id_recalls_id_fk" FOREIGN KEY ("recall_id") REFERENCES "public"."recalls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recalls" ADD CONSTRAINT "recalls_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recalls" ADD CONSTRAINT "recalls_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recalls" ADD CONSTRAINT "recalls_responsible_practitioner_id_practitioners_id_fk" FOREIGN KEY ("responsible_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recalls" ADD CONSTRAINT "recalls_result_id_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."results"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_encounter_id_encounters_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referring_practitioner_id_practitioners_id_fk" FOREIGN KEY ("referring_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_care_plan_id_care_plans_id_fk" FOREIGN KEY ("care_plan_id") REFERENCES "public"."care_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_investigation_request_id_investigation_requests_id_fk" FOREIGN KEY ("investigation_request_id") REFERENCES "public"."investigation_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_ordering_practitioner_id_practitioners_id_fk" FOREIGN KEY ("ordering_practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accreditation_criteria" ADD CONSTRAINT "accreditation_criteria_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cold_chain_readings" ADD CONSTRAINT "cold_chain_readings_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sterilisation_loads" ADD CONSTRAINT "sterilisation_loads_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_practice_id_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitations_practice_idx" ON "invitations" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "invitations_email_idx" ON "invitations" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "member_locations_unique" ON "member_locations" USING btree ("membership_id","location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "practice_memberships_unique" ON "practice_memberships" USING btree ("practice_id","user_id");--> statement-breakpoint
CREATE INDEX "practice_memberships_practice_idx" ON "practice_memberships" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_family_idx" ON "sessions" USING btree ("family_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_cohort_rules_unique" ON "billing_cohort_rules" USING btree ("practice_id","cohort");--> statement-breakpoint
CREATE UNIQUE INDEX "location_hours_unique" ON "location_business_hours" USING btree ("location_id","day_of_week");--> statement-breakpoint
CREATE INDEX "location_closures_location_idx" ON "location_closures" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "onboarding_progress_unique" ON "onboarding_progress" USING btree ("practice_id","step");--> statement-breakpoint
CREATE INDEX "practice_locations_practice_idx" ON "practice_locations" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "practices_trading_name_idx" ON "practices" USING btree ("trading_name");--> statement-breakpoint
CREATE UNIQUE INDEX "practitioner_locations_unique" ON "practitioner_locations" USING btree ("practitioner_id","location_id");--> statement-breakpoint
CREATE INDEX "practitioner_locations_location_idx" ON "practitioner_locations" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "practitioner_qualifications_practitioner_idx" ON "practitioner_qualifications" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "practitioner_remuneration_practitioner_idx" ON "practitioner_remuneration" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "practitioners_practice_idx" ON "practitioners" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "practitioners_kind_idx" ON "practitioners" USING btree ("practice_id","kind");--> statement-breakpoint
CREATE INDEX "supervision_registrar_idx" ON "supervision_relationships" USING btree ("registrar_id");--> statement-breakpoint
CREATE UNIQUE INDEX "mbs_items_number_from_unique" ON "mbs_items" USING btree ("item_number","effective_from");--> statement-breakpoint
CREATE INDEX "mbs_items_group_idx" ON "mbs_items" USING btree ("group");--> statement-breakpoint
CREATE UNIQUE INDEX "claim_items_line_unique" ON "claim_items" USING btree ("invoice_line_id");--> statement-breakpoint
CREATE INDEX "claims_practice_status_idx" ON "claims" USING btree ("practice_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "fee_schedule_items_unique" ON "fee_schedule_items" USING btree ("fee_schedule_id","item_code","effective_from");--> statement-breakpoint
CREATE INDEX "fee_schedule_items_schedule_idx" ON "fee_schedule_items" USING btree ("fee_schedule_id");--> statement-breakpoint
CREATE INDEX "fee_schedules_practice_idx" ON "fee_schedules" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "invoice_lines_invoice_idx" ON "invoice_lines" USING btree ("invoice_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_number_unique" ON "invoices" USING btree ("practice_id","invoice_number");--> statement-breakpoint
CREATE INDEX "invoices_patient_idx" ON "invoices" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "invoices_service_date_idx" ON "invoices" USING btree ("practice_id","service_date");--> statement-breakpoint
CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "appointment_status_history_appointment_idx" ON "appointment_status_history" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "appointment_types_practice_idx" ON "appointment_types" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "appointments_book_idx" ON "appointments" USING btree ("location_id","starts_at");--> statement-breakpoint
CREATE INDEX "appointments_practitioner_idx" ON "appointments" USING btree ("practitioner_id","starts_at");--> statement-breakpoint
CREATE INDEX "appointments_patient_idx" ON "appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "session_overrides_practitioner_idx" ON "session_overrides" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "session_templates_practitioner_idx" ON "session_templates" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "session_templates_location_day_idx" ON "session_templates" USING btree ("location_id","day_of_week");--> statement-breakpoint
CREATE INDEX "triage_events_practice_idx" ON "triage_events" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "triage_prompts_practice_idx" ON "triage_prompts" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "consents_patient_type_idx" ON "consents" USING btree ("patient_id","consent_type");--> statement-breakpoint
CREATE INDEX "patient_alerts_patient_idx" ON "patient_alerts" USING btree ("patient_id","category");--> statement-breakpoint
CREATE INDEX "patient_entitlements_patient_idx" ON "patient_entitlements" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "mymedicare_patient_idx" ON "patient_mymedicare_registrations" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "patients_practice_idx" ON "patients" USING btree ("practice_id");--> statement-breakpoint
CREATE INDEX "patients_name_dob_idx" ON "patients" USING btree ("practice_id","family_name","date_of_birth");--> statement-breakpoint
CREATE INDEX "allergies_patient_idx" ON "allergies" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "care_plans_patient_idx" ON "care_plans" USING btree ("patient_id","is_active");--> statement-breakpoint
CREATE INDEX "clinical_notes_encounter_idx" ON "clinical_notes" USING btree ("encounter_id");--> statement-breakpoint
CREATE INDEX "conditions_patient_idx" ON "conditions" USING btree ("patient_id","status");--> statement-breakpoint
CREATE INDEX "documents_patient_idx" ON "documents" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "documents_unmatched_idx" ON "documents" USING btree ("practice_id","patient_id");--> statement-breakpoint
CREATE INDEX "encounters_patient_idx" ON "encounters" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "encounters_practitioner_idx" ON "encounters" USING btree ("practitioner_id","started_at");--> statement-breakpoint
CREATE INDEX "immunisations_patient_idx" ON "immunisations" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "immunisations_batch_idx" ON "immunisations" USING btree ("practice_id","batch_number");--> statement-breakpoint
CREATE INDEX "investigation_requests_patient_idx" ON "investigation_requests" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "investigation_requests_outstanding_idx" ON "investigation_requests" USING btree ("practice_id","closed_at");--> statement-breakpoint
CREATE INDEX "medications_patient_idx" ON "medications" USING btree ("patient_id","is_current");--> statement-breakpoint
CREATE INDEX "note_amendments_note_idx" ON "note_amendments" USING btree ("clinical_note_id");--> statement-breakpoint
CREATE INDEX "observations_patient_code_idx" ON "observations" USING btree ("patient_id","code");--> statement-breakpoint
CREATE INDEX "recall_attempts_recall_idx" ON "recall_contact_attempts" USING btree ("recall_id");--> statement-breakpoint
CREATE INDEX "recalls_patient_idx" ON "recalls" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "recalls_open_idx" ON "recalls" USING btree ("practice_id","status","due_on");--> statement-breakpoint
CREATE INDEX "referrals_patient_idx" ON "referrals" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "referrals_open_idx" ON "referrals" USING btree ("practice_id","closed_at");--> statement-breakpoint
CREATE INDEX "reminders_due_idx" ON "reminders" USING btree ("practice_id","due_on");--> statement-breakpoint
CREATE INDEX "results_practitioner_idx" ON "results" USING btree ("ordering_practitioner_id","actioned_at");--> statement-breakpoint
CREATE INDEX "results_unmatched_idx" ON "results" USING btree ("practice_id","patient_id");--> statement-breakpoint
CREATE INDEX "accreditation_criteria_practice_idx" ON "accreditation_criteria" USING btree ("practice_id","criterion_code");--> statement-breakpoint
CREATE INDEX "audit_practice_idx" ON "audit_log_entries" USING btree ("practice_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_patient_idx" ON "audit_log_entries" USING btree ("patient_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_log_entries" USING btree ("actor_user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "cold_chain_location_idx" ON "cold_chain_readings" USING btree ("location_id","recorded_at");--> statement-breakpoint
CREATE INDEX "equipment_practice_idx" ON "equipment" USING btree ("practice_id","category");--> statement-breakpoint
CREATE INDEX "idempotency_keys_expiry_idx" ON "idempotency_keys" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "incidents_practice_idx" ON "incidents" USING btree ("practice_id","category");--> statement-breakpoint
CREATE INDEX "sterilisation_loads_practice_idx" ON "sterilisation_loads" USING btree ("practice_id","load_number");--> statement-breakpoint
CREATE INDEX "tasks_assignee_idx" ON "tasks" USING btree ("practice_id","assigned_to_user_id","status");