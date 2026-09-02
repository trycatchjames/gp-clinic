/**
 * Default red-flag triage prompts for reception.
 *
 * These are scripts, not decisions. Reception reads the question and follows the
 * instruction; they are never asked to judge whether a symptom is serious.
 * See spec/research/australian-general-practice.md and spec/product/workflows.md.
 */

export const TRIAGE_ACTIONS = ['call_000', 'escalate_now', 'same_day'] as const;
export type TriageAction = (typeof TRIAGE_ACTIONS)[number];

export const TRIAGE_ACTION_LABELS: Record<TriageAction, string> = {
  call_000: 'Tell the patient to call 000 now. Do not book.',
  escalate_now: 'Escalate to the duty nurse or GP now.',
  same_day: 'Book same day and escalate for triage.',
};

export interface TriagePromptSeed {
  key: string;
  label: string;
  /** Lower-cased substrings matched against the reason for visit. */
  matches: string[];
  question: string;
  action: TriageAction;
  blocksOnlineBooking: boolean;
}

export const TRIAGE_PROMPT_SEED: TriagePromptSeed[] = [
  {
    key: 'chest_pain',
    label: 'Chest pain',
    matches: ['chest pain', 'chest tightness', 'pain in my chest', 'arm and jaw pain', 'crushing chest'],
    question: 'Are you having chest pain right now?',
    action: 'call_000',
    blocksOnlineBooking: true,
  },
  {
    key: 'breathing',
    label: 'Difficulty breathing',
    matches: ['cant breathe', "can't breathe", 'difficulty breathing', 'short of breath', 'struggling to breathe'],
    question: 'Are you struggling to breathe now?',
    action: 'call_000',
    blocksOnlineBooking: true,
  },
  {
    key: 'stroke',
    label: 'Stroke symptoms (FAST)',
    matches: ['face drooping', 'face has drooped', 'arm weakness', 'slurred speech', 'cant speak', 'stroke'],
    question: 'When did this start? Is the face, arm or speech affected right now?',
    action: 'call_000',
    blocksOnlineBooking: true,
  },
  {
    key: 'severe_bleeding',
    label: 'Severe bleeding',
    matches: ['severe bleeding', 'bleeding heavily', 'wont stop bleeding', "won't stop bleeding"],
    question: 'Is the bleeding controlled?',
    action: 'call_000',
    blocksOnlineBooking: true,
  },
  {
    key: 'unconscious_seizure',
    label: 'Loss of consciousness or seizure',
    matches: ['unconscious', 'passed out', 'collapsed', 'seizure', 'fitting'],
    question: 'Is the person conscious and breathing now?',
    action: 'call_000',
    blocksOnlineBooking: true,
  },
  {
    key: 'anaphylaxis',
    label: 'Severe allergic reaction',
    matches: ['anaphylaxis', 'severe allergic', 'throat closing', 'face swelling'],
    question: 'Is there swelling of the face, lips or throat, or difficulty breathing?',
    action: 'call_000',
    blocksOnlineBooking: true,
  },
  {
    key: 'mental_health_crisis',
    label: 'Mental health crisis',
    matches: ['suicidal', 'end my life', 'kill myself', 'self harm', 'hurt myself', 'want to die'],
    question: 'Are you safe right now? I am going to put you through to someone straight away.',
    action: 'escalate_now',
    blocksOnlineBooking: true,
  },
  {
    key: 'infant_fever',
    label: 'Fever in an infant under 3 months',
    matches: ['baby has a fever', 'newborn fever', 'infant fever', 'baby temperature'],
    question: 'How old is the baby, and what is the temperature?',
    action: 'escalate_now',
    blocksOnlineBooking: true,
  },
  {
    key: 'gi_bleed',
    label: 'Severe abdominal pain or gastrointestinal bleeding',
    matches: ['vomiting blood', 'black stools', 'severe abdominal pain', 'severe stomach pain'],
    question: 'When did this start, and is the pain severe right now?',
    action: 'escalate_now',
    blocksOnlineBooking: true,
  },
  {
    key: 'head_injury',
    label: 'Head injury with vomiting or drowsiness',
    matches: ['head injury', 'hit my head', 'knocked out'],
    question: 'Has there been any vomiting, drowsiness or confusion since the injury?',
    action: 'escalate_now',
    blocksOnlineBooking: true,
  },
  {
    key: 'pregnancy_bleeding',
    label: 'Pregnancy with bleeding or severe pain',
    matches: ['pregnant and bleeding', 'bleeding in pregnancy', 'pregnancy pain'],
    question: 'How many weeks pregnant are you, and how heavy is the bleeding?',
    action: 'escalate_now',
    blocksOnlineBooking: true,
  },
];
