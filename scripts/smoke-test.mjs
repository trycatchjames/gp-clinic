#!/usr/bin/env node
/**
 * End-to-end smoke test for the API.
 *
 * Exercises the rules that matter in this domain rather than just CRUD: tenancy
 * isolation, role enforcement, the BBPIP billing-policy lock, per-location provider
 * numbers, the Mental Health Skills Training gate on MBS 2715/2717, the activation
 * checklist, registrar supervision, idempotent replay, and the audit log.
 *
 * Assumes a freshly seeded database (`pnpm db:reset`) and a running API.
 *
 *   pnpm db:reset && pnpm --filter @gp/api start &
 *   pnpm smoke
 */
const BASE = 'http://localhost:3001/api';
let pass = 0, fail = 0;
const ok = (name, cond, extra='') => { cond ? (pass++, console.log(`  ✓ ${name}`)) : (fail++, console.log(`  ✗ ${name} ${extra}`)); };

async function req(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

// wait for boot
for (let i = 0; i < 40; i++) {
  try { const r = await fetch(BASE + '/health'); if (r.ok) break; } catch {}
  await new Promise(r => setTimeout(r, 250));
}

console.log('\nHealth');
const health = await req('GET', '/health');
ok('health returns ok', health.body?.status === 'ok' && health.body?.database === 'ok', JSON.stringify(health.body));

console.log('\nAuth');
const login = await req('POST', '/auth/login', { body: { email: 'anita.raman@example.com', password: 'BrunswickDemo2026' } });
ok('demo owner can sign in', login.status === 200 && !!login.body?.accessToken);
const owner = login.body;
ok('token carries the practice', owner?.user?.practiceId != null);
ok('role is practice_owner', owner?.user?.role === 'practice_owner');

const badLogin = await req('POST', '/auth/login', { body: { email: 'anita.raman@example.com', password: 'wrong-password' } });
ok('bad password rejected', badLogin.status === 401);

const recept = (await req('POST', '/auth/login', { body: { email: 'jess.turner@example.com', password: 'BrunswickDemo2026' } })).body;
ok('receptionist can sign in', recept?.user?.role === 'receptionist');

const pid = owner.user.practiceId;
const T = { token: owner.accessToken };

console.log('\nTenancy and RBAC');
const noAuth = await req('GET', `/practices/${pid}`);
ok('unauthenticated request rejected', noAuth.status === 401);

const otherPractice = await req('GET', `/practices/00000000-0000-7000-8000-000000000000`, T);
ok('cross-tenant read returns 404 (not 403)', otherPractice.status === 404);

const receptWrite = await req('PATCH', `/practices/${pid}`, { token: recept.accessToken, body: { tradingName: 'Hacked' } });
ok('receptionist cannot edit the practice', receptWrite.status === 403);

console.log('\nPractice');
const practice = await req('GET', `/practices/${pid}`, T);
ok('practice reads back', practice.body?.tradingName === 'Brunswick Family Practice');
ok('practice is active', practice.body?.onboardingStatus === 'active');

console.log('\nBBPIP guard');
const regs = await req('GET', `/practices/${pid}/registrations`, T);
ok('MyMedicare registered', regs.body?.myMedicareStatus === 'registered');
ok('BBPIP participating', regs.body?.bbpipParticipating === true);

const bs = await req('GET', `/practices/${pid}/billing-settings`, T);
ok('billing policy locked to bulk_bill_all', bs.body?.billingPolicy === 'bulk_bill_all');
ok('policy reports as locked by BBPIP', bs.body?.policyLockedByBbpip === true);

const tryPrivate = await req('PUT', `/practices/${pid}/billing-settings`, { ...T, body: { billingPolicy: 'private' } });
ok('cannot switch to private while in BBPIP', tryPrivate.status === 422, JSON.stringify(tryPrivate.body));
ok('  error is a problem-details doc', tryPrivate.body?.type?.includes('bbpip-locks-billing-policy'));

console.log('\nLocations');
const locs = await req('GET', `/practices/${pid}/locations`, T);
ok('two locations seeded', (locs.body?.length ?? 0) >= 2);
ok('after-hours arrangement recorded (GP1.3)', locs.body?.[0]?.afterHoursArrangement === 'deputising_service');

const hours = await req('GET', `/practices/${pid}/locations/${locs.body[0].id}/business-hours`, T);
ok('opening hours recorded', hours.body?.length >= 6);

const badHours = await req('PUT', `/practices/${pid}/locations/${locs.body[0].id}/business-hours`, {
  ...T, body: { days: [{ dayOfWeek: 'monday', isOpen: true, opensAt: '18:00', closesAt: '08:00' }] },
});
ok('closing before opening rejected', badHours.status === 422);

console.log('\nPractitioners and provider numbers');
const prac = await req('GET', `/practices/${pid}/practitioners`, T);
ok('seeded practitioners present', (prac.body?.length ?? 0) >= 4);
const anita = prac.body.find(p => p.familyName === 'Raman');
const tom = prac.body.find(p => p.familyName === 'Nguyen');
const priya = prac.body.find(p => p.familyName === 'Shah');
const sarah = prac.body.find(p => p.familyName === 'Kelly');

ok('provider numbers listed per location', anita.providerNumbers.length === 2);
ok('  Brunswick differs from Coburg', anita.providerNumbers[0].providerNumber !== anita.providerNumbers[1].providerNumber);
ok('missing provider number surfaces a warning', tom.warnings.some(w => w.includes('Coburg')), JSON.stringify(tom.warnings));
ok('nurse has no provider number warning too', sarah.warnings.length > 0);

ok('Dr Raman holds MHST', anita.mentalHealthSkillsTraining === true);
ok('Dr Nguyen does not hold MHST', tom.mentalHealthSkillsTraining === false);
ok('registrar has supervision', priya.supervision?.supervisorName?.includes('Raman'));
ok('  direct supervision requires on-site supervisor', priya.supervision?.requiresOnSiteSupervisor === true);

console.log('\nMBS catalogue and the MHST gate');
const mbs = await req('GET', `/mbs-items`, T);
ok('MBS catalogue seeded', (mbs.body?.length ?? 0) === 30);
const i23 = mbs.body.find(i => i.itemNumber === '23');
const i36 = mbs.body.find(i => i.itemNumber === '36');
const i965 = mbs.body.find(i => i.itemNumber === '965');
const i2715 = mbs.body.find(i => i.itemNumber === '2715');
const i2700 = mbs.body.find(i => i.itemNumber === '2700');
ok('item 23 is < 20 minutes', i23.maxMinutes === 20);
ok('item 36 is 20-40 minutes', i36.minMinutes === 20 && i36.maxMinutes === 40);
ok('item 965 is the GPCCMP prepare item', i965.description.includes('Chronic Condition Management'));
ok('item 2715 requires MHST', i2715.requiresMentalHealthSkillsTraining === true);
ok('item 2700 does not', i2700.requiresMentalHealthSkillsTraining === false);

console.log('\nFee schedules');
const sched = await req('GET', `/practices/${pid}/fee-schedules`, T);
ok('five schedules seeded', sched.body?.length === 5);
const bulk = sched.body.find(s => s.kind === 'bulk_bill');
const priv = sched.body.find(s => s.kind === 'private');
ok('bulk bill schedule is locked', bulk.isEditable === false);
ok('private schedule is editable', priv.isEditable === true);

const privItems = await req('GET', `/practices/${pid}/fee-schedules/${priv.id}/items?search=23`, T);
const priv23 = privItems.body.find(i => i.itemCode === '23');
ok('private fee is above the benefit', priv23.feeCents > priv23.benefitCents);
ok('  gap = fee - benefit', priv23.gapCents === priv23.feeCents - priv23.benefitCents);

const bulkItems = await req('GET', `/practices/${pid}/fee-schedules/${bulk.id}/items?search=23`, T);
const bulk23 = bulkItems.body.find(i => i.itemCode === '23');
ok('bulk bill gap is zero', bulk23.gapCents === 0);
const editLocked = await req('PATCH', `/practices/${pid}/fee-schedules/${bulk.id}/items/${bulk23.id}`, { ...T, body: { feeCents: 9999 } });
ok('bulk bill schedule cannot be edited', editLocked.status === 422);

console.log('\nAppointment types and sessions');
const types = await req('GET', `/practices/${pid}/appointment-types`, T);
ok('appointment types seeded', (types.body?.length ?? 0) >= 15);
const std = types.body.find(t => t.shortCode === 'STD');
ok('standard consult suggests item 23', std.defaultMbsItemNumber === '23');
const ccm = types.body.find(t => t.shortCode === 'CCM');
ok('care plan suggests item 965', ccm.defaultMbsItemNumber === '965');
const urgent = types.body.find(t => t.shortCode === 'URG');
ok('urgent type requires a triage prompt', urgent.requiresTriagePrompt === true);
ok('  and is not online bookable', urgent.onlineBookable === false);

const sessions = await req('GET', `/practices/${pid}/session-templates`, T);
ok('session templates seeded', sessions.body?.length > 10);
ok('slot count computed', sessions.body[0].slotCount > 0);

const badSlot = await req('POST', `/practices/${pid}/session-templates`, {
  ...T, body: { practitionerId: tom.id, locationId: locs.body[0].id, dayOfWeek: 'friday', startsAt: '09:00', endsAt: '12:00', slotMinutes: 25 },
});
ok('slot size must divide the session', badSlot.status === 422, JSON.stringify(badSlot.body));

console.log('\nTeam');
const members = await req('GET', `/practices/${pid}/team/members`, T);
ok('seeded members present', (members.body?.length ?? 0) >= 6);
const ownerMember = members.body.find(m => m.role === 'practice_owner');
const demote = await req('PATCH', `/practices/${pid}/team/members/${ownerMember.id}/role`, { ...T, body: { role: 'receptionist' } });
ok('last owner cannot be demoted', demote.status === 422, JSON.stringify(demote.body));

const inviteClinicalNoProfile = await req('POST', `/practices/${pid}/team/invitations`, {
  ...T, body: { email: 'new.gp@example.com', givenName: 'New', familyName: 'GP', role: 'general_practitioner' },
});
ok('clinical role needs a practitioner profile', inviteClinicalNoProfile.status === 422);

const inviteEmail = `new.recept.${Date.now()}@example.com`;
const invite = await req('POST', `/practices/${pid}/team/invitations`, {
  ...T, body: { email: inviteEmail, givenName: 'New', familyName: 'Reception', role: 'receptionist' },
});
ok('receptionist invitation created', invite.status === 201 && !!invite.body?.acceptUrl);
const token = new URL(invite.body.acceptUrl).searchParams.get('token');
const accepted = await req('POST', '/auth/accept-invitation', { body: { token, password: 'AnotherDemo2026!' } });
ok('invitation can be accepted', accepted.status === 200 && accepted.body?.user?.role === 'receptionist');
const reuse = await req('POST', '/auth/accept-invitation', { body: { token, password: 'AnotherDemo2026!' } });
ok('invitation token is single use', reuse.status === 404);

console.log('\nOnboarding — a brand new practice');
const newUser = await req('POST', '/auth/register', {
  body: { email: `demo${Date.now()}@example.com`, password: 'a-very-long-password', givenName: 'New', familyName: 'Owner' },
});
ok('registration succeeds', newUser.status === 201);
const N = { token: newUser.body.accessToken };

const badAbn = await req('POST', '/practices', { ...N, body: { legalName: 'Test Pty Ltd', tradingName: 'Test Practice', entityType: 'company', abn: '51824753557' } });
ok('invalid ABN rejected by checksum', badAbn.status === 422 && badAbn.body?.errors?.[0]?.field === 'abn');

const newPractice = await req('POST', '/practices', { ...N, body: { legalName: 'Test Pty Ltd', tradingName: 'Test Practice', entityType: 'company', abn: '51824753556' } });
ok('valid ABN accepted', newPractice.status === 201);
ok('new practice starts in onboarding', newPractice.body?.onboardingStatus === 'in_progress');
const npid = newPractice.body.id;

// re-login to pick up the new practice claim
const N2 = { token: (await req('POST', '/auth/login', { body: { email: newUser.body.user.email, password: 'a-very-long-password' } })).body.accessToken };

const seededTypes = await req('GET', `/practices/${npid}/appointment-types`, N2);
ok('appointment types auto-seeded on creation', seededTypes.body?.length === 15);
const seededScheds = await req('GET', `/practices/${npid}/fee-schedules`, N2);
ok('fee schedules auto-seeded on creation', seededScheds.body?.length === 5);

const bbpipNoMm = await req('PUT', `/practices/${npid}/registrations`, { ...N2, body: { bbpipParticipating: true } });
ok('BBPIP blocked without MyMedicare', bbpipNoMm.status === 422 && bbpipNoMm.body?.type?.includes('bbpip-requires-mymedicare'));

const onb = await req('GET', `/practices/${npid}/onboarding`, N2);
ok('onboarding has 8 steps', onb.body?.steps?.length === 8);
ok('identity step already complete', onb.body.steps.find(s => s.step === 'practice_identity').status === 'complete');
ok('cannot activate yet', onb.body?.canActivate === false);
ok('required checklist names the provider number', onb.body.required.some(r => r.key === 'provider_number' && !r.satisfied));

const activateEarly = await req('POST', `/practices/${npid}/activate`, N2);
ok('activation blocked while requirements outstanding', activateEarly.status === 422);

// Complete the required path
const newLoc = await req('POST', `/practices/${npid}/locations`, { ...N2, body: { name: 'Main', streetAddress: '1 Test St', suburb: 'Testville', state: 'VIC', postcode: '3000', timezone: 'Australia/Melbourne' } });
ok('location created', newLoc.status === 201);
const newPrac = await req('POST', `/practices/${npid}/practitioners`, { ...N2, body: { givenName: 'Test', familyName: 'Doctor', kind: 'gp', title: 'Dr' } });
ok('practitioner created', newPrac.status === 201);
const pn = await req('PUT', `/practices/${npid}/practitioners/${newPrac.body.id}/provider-numbers`, { ...N2, body: { locationId: newLoc.body.id, providerNumber: '9999991A' } });
ok('provider number set', pn.body?.[0]?.providerNumber === '9999991A');

const onb2 = await req('GET', `/practices/${npid}/onboarding`, N2);
ok('now activatable', onb2.body?.canActivate === true);
ok('completion percent reported', typeof onb2.body?.completionPercent === 'number');
ok('recommended items still outstanding', onb2.body.recommended.some(r => !r.satisfied));

const activated = await req('POST', `/practices/${npid}/activate`, N2);
ok('practice activates', activated.status === 201 && activated.body?.onboardingStatus === 'active');

console.log('\nRegistrar rule');
const reg = await req('POST', `/practices/${npid}/practitioners`, { ...N2, body: { givenName: 'New', familyName: 'Registrar', kind: 'gp_registrar' } });
const regActivate = await req('PATCH', `/practices/${npid}/practitioners/${reg.body.id}`, { ...N2, body: { isActive: true, kind: 'gp_registrar', givenName: 'New', familyName: 'Registrar' } });
ok('registrar cannot be activated without a supervisor', regActivate.status === 422 && regActivate.body?.type?.includes('registrar-requires-supervision'));

console.log('\nIdempotency');
const key = 'smoke-' + Date.now();
const first = await fetch(BASE + `/practices/${npid}/appointment-types`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${N2.token}`, 'Idempotency-Key': key }, body: JSON.stringify({ name: 'Idem Test', shortCode: 'IDEM', durationMinutes: 15, colour: '#000000' }) });
const firstBody = await first.json();
const second = await fetch(BASE + `/practices/${npid}/appointment-types`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${N2.token}`, 'Idempotency-Key': key }, body: JSON.stringify({ name: 'Idem Test', shortCode: 'IDEM', durationMinutes: 15, colour: '#000000' }) });
const secondBody = await second.json();
ok('replayed write returns the same record', firstBody.id === secondBody.id);
const afterTypes = await req('GET', `/practices/${npid}/appointment-types`, N2);
ok('  and does not create a duplicate', afterTypes.body.filter(t => t.shortCode === 'IDEM').length === 1);

console.log('\nAudit log');
// The audit log has no read endpoint by design, so check it directly.
const { createRequire } = await import('node:module');
const requireFromApi = createRequire(new URL('../apps/api/package.json', import.meta.url));
const pgModule = requireFromApi('postgres');
const pg = pgModule.default ?? pgModule;
const sqlc = pg(process.env.DATABASE_URL ?? 'postgres://gp:gp@localhost:5439/gp_prototype');
const [{ count }] = await sqlc`select count(*)::int as count from audit_log_entries`;
ok('audit entries written', count > 20, `count=${count}`);
const [{ count: activations }] = await sqlc`select count(*)::int as count from audit_log_entries where action = 'practice.activated'`;
ok('activation is audit-logged', activations >= 1);
await sqlc.end();

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
