import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import {
  APPOINTMENT_TYPE_SEED,
  FEE_SCHEDULE_LABELS,
  LOCKED_FEE_SCHEDULE_KINDS,
  MBS_ITEM_SEED,
  NON_MEDICARE_ITEM_SEED,
  TRIAGE_PROMPT_SEED,
  type FeeScheduleKind,
} from '@gp/contracts';
import { db, sql } from '../client';
import {
  appointmentTypes,
  billingCohortRules,
  feeScheduleItems,
  feeSchedules,
  locationBusinessHours,
  mbsItems,
  onboardingProgress,
  patients,
  practiceBillingSettings,
  practiceLocations,
  practiceMemberships,
  practiceRegistrations,
  practices,
  practitionerLocations,
  practitionerQualifications,
  practitioners,
  sessionTemplates,
  supervisionRelationships,
  triagePrompts,
  users,
} from '../schema';
import { uuidv7 } from '../uuid';

const TODAY = new Date().toISOString().slice(0, 10);
const DEMO_PASSWORD = 'BrunswickDemo2026';

async function seedMbsCatalogue() {
  const existing = await db.select({ id: mbsItems.id }).from(mbsItems).limit(1);
  if (existing.length) {
    console.log('  MBS catalogue already seeded, skipping.');
    return;
  }
  await db.insert(mbsItems).values(
    MBS_ITEM_SEED.map((item) => ({
      id: uuidv7(),
      itemNumber: item.itemNumber,
      description: item.description,
      category: item.category,
      group: item.group,
      scheduleFeeCents: item.scheduleFeeCents,
      benefitPercent: item.benefitPercent,
      minMinutes: item.minMinutes,
      maxMinutes: item.maxMinutes,
      requiresMentalHealthSkillsTraining: item.requiresMentalHealthSkillsTraining ?? false,
      requiresMyMedicare: item.requiresMyMedicare ?? false,
      bulkBillIncentiveEligible: item.bulkBillIncentiveEligible ?? false,
      frequencyLimitMonths: item.frequencyLimitMonths,
      effectiveFrom: item.effectiveFrom,
      effectiveTo: item.effectiveTo,
      notes: item.notes,
    })),
  );
  console.log(`  Seeded ${MBS_ITEM_SEED.length} MBS items.`);
}

/**
 * A demo practice that is far enough along to show the whole onboarding story:
 * two locations, a GP, a registrar with a supervisor, a nurse, a practice manager
 * and a receptionist, MyMedicare registered and participating in BBPIP.
 */
async function seedDemoPractice() {
  const [existing] = await db
    .select({ id: practices.id })
    .from(practices)
    .where(eq(practices.tradingName, 'Brunswick Family Practice'))
    .limit(1);
  if (existing) {
    console.log('  Demo practice already seeded, skipping.');
    return;
  }

  const passwordHash = await hash(DEMO_PASSWORD);
  const practiceId = uuidv7();

  await db.insert(practices).values({
    id: practiceId,
    legalName: 'Raman Family Medicine Pty Ltd',
    tradingName: 'Brunswick Family Practice',
    entityType: 'company',
    practiceType: 'general_practice',
    abn: '51824753556',
    contactEmail: 'reception@brunswickfamilypractice.example',
    contactPhone: '03 9388 1000',
    onboardingStatus: 'active',
    activatedAt: new Date(),
  });

  await db.insert(practiceRegistrations).values({
    id: uuidv7(),
    practiceId,
    prodaOrganisationName: 'Raman Family Medicine Pty Ltd',
    myMedicareStatus: 'registered',
    myMedicareRegisteredOn: '2025-11-01',
    bbpipParticipating: true,
    bbpipEffectiveFrom: '2025-11-01',
    accreditationStatus: 'accredited',
    accreditingBody: 'AGPAL',
    accreditationExpiresOn: '2028-04-30',
    pipParticipating: true,
    wipParticipating: true,
  });

  await db.insert(practiceBillingSettings).values({
    id: uuidv7(),
    practiceId,
    // BBPIP participation obliges 100% bulk billing of eligible services.
    billingPolicy: 'bulk_bill_all',
  });

  await db.insert(billingCohortRules).values(
    ['commonwealth_concession_card', 'under_16', 'dva_card_holder'].map((cohort) => ({
      id: uuidv7(),
      practiceId,
      cohort,
      bulkBill: true,
    })),
  );

  await db.insert(onboardingProgress).values(
    (
      [
        'practice_identity',
        'primary_location',
        'opening_hours',
        'registrations',
        'team',
        'appointment_types',
        'billing_setup',
        'review',
      ] as const
    ).map((step) => ({
      id: uuidv7(),
      practiceId,
      step,
      status: 'complete' as const,
      completedAt: new Date(),
    })),
  );

  // --- locations -----------------------------------------------------------
  const brunswickId = uuidv7();
  const coburgId = uuidv7();

  await db.insert(practiceLocations).values([
    {
      id: brunswickId,
      practiceId,
      name: 'Brunswick',
      isPrimary: true,
      streetAddress: '142 Sydney Road',
      suburb: 'Brunswick',
      state: 'VIC',
      postcode: '3056',
      timezone: 'Australia/Melbourne',
      phone: '03 9388 1000',
      fax: '03 9388 1001',
      hpiO: '8003628233352180',
      medicareMinorId: 'A12345',
      afterHoursArrangement: 'deputising_service',
      afterHoursProviderName: 'Melbourne Medical Deputising Service',
      afterHoursContact: '13 SICK (13 7425)',
      wheelchairAccess: true,
      accessibleToilet: true,
      onSiteParking: true,
      publicTransportNearby: true,
      treatmentRoom: true,
      procedureRoom: true,
      onSitePathologyCollection: true,
    },
    {
      id: coburgId,
      practiceId,
      name: 'Coburg Branch',
      streetAddress: '12 Bell Street',
      suburb: 'Coburg',
      state: 'VIC',
      postcode: '3058',
      timezone: 'Australia/Melbourne',
      phone: '03 9350 2000',
      hpiO: '8003628233352181',
      medicareMinorId: 'A12346',
      afterHoursArrangement: 'deputising_service',
      afterHoursProviderName: 'Melbourne Medical Deputising Service',
      afterHoursContact: '13 SICK (13 7425)',
      wheelchairAccess: true,
      accessibleToilet: true,
      publicTransportNearby: true,
      treatmentRoom: true,
    },
  ]);

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
  await db.insert(locationBusinessHours).values([
    ...weekdays.map((day) => ({
      id: uuidv7(),
      practiceId,
      locationId: brunswickId,
      dayOfWeek: day,
      isOpen: true,
      opensAt: '08:00',
      closesAt: '18:00',
    })),
    {
      id: uuidv7(),
      practiceId,
      locationId: brunswickId,
      dayOfWeek: 'saturday' as const,
      isOpen: true,
      opensAt: '09:00',
      closesAt: '13:00',
    },
    {
      id: uuidv7(),
      practiceId,
      locationId: brunswickId,
      dayOfWeek: 'sunday' as const,
      isOpen: false,
    },
    ...weekdays.map((day) => ({
      id: uuidv7(),
      practiceId,
      locationId: coburgId,
      dayOfWeek: day,
      isOpen: true,
      opensAt: '08:30',
      closesAt: '17:00',
      breakStartsAt: '12:30',
      breakEndsAt: '13:30',
    })),
  ]);

  // --- practitioners -------------------------------------------------------
  const anitaId = uuidv7();
  const tomId = uuidv7();
  const priyaId = uuidv7();
  const sarahId = uuidv7();

  await db.insert(practitioners).values([
    {
      id: anitaId,
      practiceId,
      title: 'Dr',
      givenName: 'Anita',
      familyName: 'Raman',
      gender: 'female',
      kind: 'gp',
      ahpraRegistrationNumber: 'MED0001234501',
      ahpraRegistrationType: 'specialist',
      ahpraProfession: 'Medical Practitioner',
      ahpraSpecialty: 'General Practice',
      ahpraExpiresOn: '2027-09-30',
      hpiI: '8003611566684001',
      prescriberNumber: '4567891',
      vocationalRegistration: true,
      // Holds GPMHSC-accredited training, so MBS 2715/2717 are available to her.
      mentalHealthSkillsTraining: true,
      isSupervisor: true,
      workingArrangement: 'partner',
      indemnityInsurer: 'Avant',
      indemnityPolicyNumber: 'AV-884213',
      indemnityExpiresOn: '2027-06-30',
    },
    {
      id: tomId,
      practiceId,
      title: 'Dr',
      givenName: 'Tom',
      familyName: 'Nguyen',
      gender: 'male',
      kind: 'gp',
      ahpraRegistrationNumber: 'MED0001234502',
      ahpraRegistrationType: 'specialist',
      ahpraProfession: 'Medical Practitioner',
      ahpraSpecialty: 'General Practice',
      ahpraExpiresOn: '2027-09-30',
      prescriberNumber: '4567892',
      vocationalRegistration: true,
      // No MHST — the billing screen will not offer him items 2715/2717.
      mentalHealthSkillsTraining: false,
      workingArrangement: 'contractor',
      indemnityInsurer: 'MDA National',
      indemnityExpiresOn: '2026-11-30',
    },
    {
      id: priyaId,
      practiceId,
      title: 'Dr',
      givenName: 'Priya',
      familyName: 'Shah',
      gender: 'female',
      kind: 'gp_registrar',
      ahpraRegistrationNumber: 'MED0001234503',
      ahpraRegistrationType: 'general',
      ahpraProfession: 'Medical Practitioner',
      ahpraExpiresOn: '2027-09-30',
      prescriberNumber: '4567893',
      vocationalRegistration: false,
      workingArrangement: 'employee',
    },
    {
      id: sarahId,
      practiceId,
      givenName: 'Sarah',
      familyName: 'Kelly',
      gender: 'female',
      kind: 'nurse',
      ahpraRegistrationNumber: 'NMW0001234504',
      ahpraRegistrationType: 'general',
      ahpraProfession: 'Registered Nurse',
      ahpraExpiresOn: '2027-05-31',
      workingArrangement: 'employee',
    },
  ]);

  // Provider numbers are per practitioner PER LOCATION.
  await db.insert(practitionerLocations).values([
    { id: uuidv7(), practiceId, practitionerId: anitaId, locationId: brunswickId, providerNumber: '2143561A' },
    { id: uuidv7(), practiceId, practitionerId: anitaId, locationId: coburgId, providerNumber: '2143561B' },
    { id: uuidv7(), practiceId, practitionerId: tomId, locationId: brunswickId, providerNumber: '2143562A' },
    { id: uuidv7(), practiceId, practitionerId: priyaId, locationId: brunswickId, providerNumber: '2143563A' },
    { id: uuidv7(), practiceId, practitionerId: sarahId, locationId: brunswickId, providerNumber: null },
  ]);

  await db.insert(practitionerQualifications).values([
    {
      id: uuidv7(),
      practiceId,
      practitionerId: anitaId,
      qualificationType: 'fellowship_racgp',
      issuingBody: 'RACGP',
      obtainedOn: '2011-11-20',
    },
    {
      id: uuidv7(),
      practiceId,
      practitionerId: anitaId,
      qualificationType: 'mental_health_skills_training',
      issuingBody: 'GPMHSC',
      obtainedOn: '2019-03-15',
    },
    {
      id: uuidv7(),
      practiceId,
      practitionerId: anitaId,
      qualificationType: 'cpr',
      obtainedOn: '2026-02-10',
      expiresOn: '2027-02-10',
    },
    {
      id: uuidv7(),
      practiceId,
      practitionerId: tomId,
      qualificationType: 'fellowship_racgp',
      issuingBody: 'RACGP',
      obtainedOn: '2018-05-04',
    },
    {
      id: uuidv7(),
      practiceId,
      practitionerId: tomId,
      qualificationType: 'cpr',
      obtainedOn: '2025-10-01',
      // Deliberately near expiry, so the credential warning is visible in the demo.
      expiresOn: '2026-10-01',
    },
    {
      id: uuidv7(),
      practiceId,
      practitionerId: sarahId,
      qualificationType: 'immunisation_provider',
      obtainedOn: '2021-08-12',
    },
  ]);

  await db.insert(supervisionRelationships).values({
    id: uuidv7(),
    practiceId,
    registrarId: priyaId,
    supervisorId: anitaId,
    supervisionLevel: 'direct',
    trainingTerm: 'GPT1',
    trainingOrganisation: 'Eastern Victoria GP Training',
    effectiveFrom: '2026-02-02',
    effectiveTo: '2026-08-01',
  });

  // --- users ---------------------------------------------------------------
  const team = [
    { given: 'Anita', family: 'Raman', email: 'anita.raman@example.com', role: 'practice_owner' as const, practitionerId: anitaId },
    { given: 'Tom', family: 'Nguyen', email: 'tom.nguyen@example.com', role: 'general_practitioner' as const, practitionerId: tomId },
    { given: 'Priya', family: 'Shah', email: 'priya.shah@example.com', role: 'gp_registrar' as const, practitionerId: priyaId },
    { given: 'Sarah', family: 'Kelly', email: 'sarah.kelly@example.com', role: 'practice_nurse' as const, practitionerId: sarahId },
    { given: 'Michelle', family: 'Barnes', email: 'michelle.barnes@example.com', role: 'practice_manager' as const, practitionerId: null },
    { given: 'Jess', family: 'Turner', email: 'jess.turner@example.com', role: 'receptionist' as const, practitionerId: null },
  ];

  for (const member of team) {
    const userId = uuidv7();
    await db.insert(users).values({
      id: userId,
      email: member.email,
      passwordHash,
      givenName: member.given,
      familyName: member.family,
      emailVerifiedAt: new Date(),
    });
    await db.insert(practiceMemberships).values({
      id: uuidv7(),
      practiceId,
      userId,
      role: member.role,
      practitionerId: member.practitionerId,
    });
  }

  // --- booking configuration ------------------------------------------------
  const typeIds = new Map<string, string>();
  await db.insert(appointmentTypes).values(
    APPOINTMENT_TYPE_SEED.map((seed, index) => {
      const id = uuidv7();
      typeIds.set(seed.shortCode, id);
      return {
        id,
        practiceId,
        name: seed.name,
        shortCode: seed.shortCode,
        durationMinutes: seed.durationMinutes,
        colour: seed.colour,
        description: seed.description,
        allowedPractitionerKinds: seed.allowedPractitionerKinds as string[],
        onlineBookable: seed.onlineBookable,
        requiresTriagePrompt: seed.requiresTriagePrompt ?? false,
        defaultMbsItemNumber: seed.defaultMbsItem,
        sortOrder: index,
      };
    }),
  );

  await db.insert(triagePrompts).values(
    TRIAGE_PROMPT_SEED.map((seed) => ({
      id: uuidv7(),
      practiceId,
      promptKey: seed.key,
      label: seed.label,
      matches: seed.matches,
      question: seed.question,
      action: seed.action,
      blocksOnlineBooking: seed.blocksOnlineBooking,
    })),
  );

  await db.insert(sessionTemplates).values([
    ...(['monday', 'tuesday', 'wednesday', 'thursday'] as const).map((day) => ({
      id: uuidv7(),
      practiceId,
      practitionerId: tomId,
      locationId: brunswickId,
      dayOfWeek: day,
      startsAt: '08:30',
      endsAt: '12:30',
      slotMinutes: 15,
    })),
    ...(['monday', 'wednesday'] as const).map((day) => ({
      id: uuidv7(),
      practiceId,
      practitionerId: anitaId,
      locationId: brunswickId,
      dayOfWeek: day,
      startsAt: '09:00',
      endsAt: '13:00',
      slotMinutes: 15,
    })),
    {
      id: uuidv7(),
      practiceId,
      practitionerId: anitaId,
      locationId: coburgId,
      dayOfWeek: 'friday' as const,
      startsAt: '09:00',
      endsAt: '12:30',
      slotMinutes: 15,
    },
    ...(['tuesday', 'thursday', 'friday'] as const).map((day) => ({
      id: uuidv7(),
      practiceId,
      practitionerId: priyaId,
      locationId: brunswickId,
      dayOfWeek: day,
      startsAt: '09:00',
      endsAt: '12:00',
      slotMinutes: 20,
    })),
    ...(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((day) => ({
      id: uuidv7(),
      practiceId,
      practitionerId: sarahId,
      locationId: brunswickId,
      dayOfWeek: day,
      startsAt: '08:30',
      endsAt: '16:30',
      slotMinutes: 10,
    })),
  ]);

  await seedFeeSchedules(practiceId);
  await seedPatients(practiceId, anitaId, tomId);

  console.log('  Seeded demo practice "Brunswick Family Practice".');
}

async function seedFeeSchedules(practiceId: string) {
  const catalogue = await db.select().from(mbsItems);
  const kinds: FeeScheduleKind[] = ['bulk_bill', 'private', 'dva', 'workcover', 'non_medicare'];
  const multiplierBp = 17500;
  const roundingCents = 500;

  for (const kind of kinds) {
    const [schedule] = await db
      .insert(feeSchedules)
      .values({
        id: uuidv7(),
        practiceId,
        kind,
        name: FEE_SCHEDULE_LABELS[kind],
        isEditable: !LOCKED_FEE_SCHEDULE_KINDS.includes(kind),
        isDefault: kind === 'bulk_bill',
        effectiveFrom: TODAY,
      })
      .returning();

    if (kind === 'non_medicare') {
      await db.insert(feeScheduleItems).values(
        NON_MEDICARE_ITEM_SEED.map((item) => ({
          id: uuidv7(),
          practiceId,
          feeScheduleId: schedule.id,
          itemCode: item.code,
          description: item.description,
          feeCents: item.defaultFeeCents,
          benefitCents: 0,
          effectiveFrom: TODAY,
        })),
      );
      continue;
    }

    await db.insert(feeScheduleItems).values(
      catalogue.map((item) => {
        const benefit = Math.round((item.scheduleFeeCents * item.benefitPercent) / 100);
        const fee =
          kind === 'private'
            ? Math.round((item.scheduleFeeCents * multiplierBp) / 10000 / roundingCents) *
              roundingCents
            : benefit;
        return {
          id: uuidv7(),
          practiceId,
          feeScheduleId: schedule.id,
          mbsItemId: item.id,
          itemCode: item.itemNumber,
          description: item.description,
          feeCents: fee,
          benefitCents: benefit,
          effectiveFrom: TODAY,
        };
      }),
    );
  }
}

/** A handful of patients so the practice does not look empty in a demo. */
async function seedPatients(practiceId: string, anitaId: string, tomId: string) {
  await db.insert(patients).values([
    {
      id: uuidv7(),
      practiceId,
      title: 'Mrs',
      familyName: 'Doyle',
      givenNames: 'Margaret Anne',
      dateOfBirth: '1952-03-14',
      sexAtBirth: 'female',
      mobile: '0412 555 001',
      residentialAddress: '18 Albert Street',
      suburb: 'Brunswick',
      state: 'VIC',
      postcode: '3056',
      atsiStatus: 'neither',
      preferredLanguage: 'English',
      usualPractitionerId: anitaId,
    },
    {
      id: uuidv7(),
      practiceId,
      familyName: 'Tran',
      givenNames: 'Minh',
      dateOfBirth: '1988-11-02',
      sexAtBirth: 'male',
      mobile: '0412 555 002',
      suburb: 'Coburg',
      state: 'VIC',
      postcode: '3058',
      atsiStatus: 'neither',
      preferredLanguage: 'Vietnamese',
      interpreterRequired: true,
      usualPractitionerId: tomId,
    },
    {
      id: uuidv7(),
      practiceId,
      familyName: 'Williams',
      givenNames: 'Jayden',
      dateOfBirth: '2016-06-21',
      sexAtBirth: 'male',
      suburb: 'Brunswick West',
      state: 'VIC',
      postcode: '3055',
      atsiStatus: 'aboriginal',
      preferredLanguage: 'English',
      usualPractitionerId: tomId,
    },
  ]);
}

async function main() {
  console.log('Seeding...');
  await seedMbsCatalogue();
  await seedDemoPractice();
  console.log('');
  console.log('Demo sign-ins (all use the same password):');
  console.log(`  password: ${DEMO_PASSWORD}`);
  console.log('  anita.raman@example.com      Practice Owner (GP, supervisor, MHST)');
  console.log('  tom.nguyen@example.com       GP (no MHST — 2715/2717 not offered)');
  console.log('  priya.shah@example.com       GP Registrar (supervised by Dr Raman)');
  console.log('  sarah.kelly@example.com      Practice Nurse');
  console.log('  michelle.barnes@example.com  Practice Manager');
  console.log('  jess.turner@example.com      Receptionist');
  await sql.end();
}

main().catch(async (error) => {
  console.error('Seed failed:', error);
  await sql.end().catch(() => {});
  process.exit(1);
});
