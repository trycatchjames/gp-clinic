import * as React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { ONBOARDING_STEPS, type OnboardingStep } from '@gp/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { keys, useOnboarding } from '@/lib/queries';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SyncIndicator } from '@/components/sync-indicator';
import { StepIdentity } from './step-identity';
import { StepLocation } from './step-location';
import { StepHours } from './step-hours';
import { StepRegistrations } from './step-registrations';
import { StepTeam } from './step-team';
import { StepBooking } from './step-booking';
import { StepBilling } from './step-billing';
import { StepReview } from './step-review';

/**
 * The onboarding wizard. Resumable at any step — state is saved on every step
 * transition, not at the end, because this is often done at 9pm in pieces.
 */
export function OnboardingRoute() {
  const { user } = useAuth();
  const practiceId = user?.practiceId ?? null;
  const onboarding = useOnboarding(practiceId ?? '');
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState<OnboardingStep>('practice_identity');
  const [resumed, setResumed] = React.useState(false);

  // Resume where they left off, once.
  React.useEffect(() => {
    if (resumed || !onboarding.data) return;
    const next = onboarding.data.steps.find((s) => s.status !== 'complete');
    setCurrent((next?.step as OnboardingStep) ?? 'review');
    setResumed(true);
  }, [onboarding.data, resumed]);

  const complete = React.useCallback(
    async (step: OnboardingStep) => {
      if (practiceId) {
        await api.setOnboardingStep(practiceId, step, { status: 'complete' }).catch(() => {});
        await queryClient.invalidateQueries({ queryKey: keys.onboarding(practiceId) });
      }
      const index = ONBOARDING_STEPS.indexOf(step);
      setCurrent(ONBOARDING_STEPS[Math.min(index + 1, ONBOARDING_STEPS.length - 1)]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [practiceId, queryClient],
  );

  const steps = onboarding.data?.steps ?? [];
  const currentStep = steps.find((s) => s.step === current);

  return (
    <div className="bg-muted/30 min-h-svh">
      <header className="bg-background sticky top-0 z-20 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold">
            GP
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Set up your practice</p>
          </div>
          <SyncIndicator />
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[16rem_1fr]">
        <nav className="space-y-1">
          {ONBOARDING_STEPS.map((step, index) => {
            const state = steps.find((s) => s.step === step);
            const done = state?.status === 'complete';
            const active = step === current;
            const reachable = practiceId !== null || step === 'practice_identity';
            return (
              <button
                key={step}
                type="button"
                disabled={!reachable}
                onClick={() => reachable && setCurrent(step)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50',
                  !reachable && 'cursor-not-allowed opacity-50',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
                    done && 'bg-success border-success text-success-foreground',
                    active && !done && 'border-foreground text-foreground',
                  )}
                >
                  {done ? <Check className="size-3" /> : index + 1}
                </span>
                {state?.label ?? step.replace(/_/g, ' ')}
              </button>
            );
          })}
        </nav>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{currentStep?.label ?? 'Practice identity'}</CardTitle>
                <CardDescription>{currentStep?.description}</CardDescription>
              </div>
              {currentStep?.status === 'complete' && <Badge variant="success">Done</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {!practiceId && current !== 'practice_identity' ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <StepBody practiceId={practiceId} current={current} onDone={complete} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepBody({
  practiceId,
  current,
  onDone,
}: {
  practiceId: string | null;
  current: OnboardingStep;
  onDone: (step: OnboardingStep) => Promise<void>;
}) {
  switch (current) {
    case 'practice_identity':
      return (
        <StepIdentity practiceId={practiceId} onDone={() => void onDone('practice_identity')} />
      );
    case 'primary_location':
      return <StepLocation practiceId={practiceId!} onDone={() => void onDone('primary_location')} />;
    case 'opening_hours':
      return <StepHours practiceId={practiceId!} onDone={() => void onDone('opening_hours')} />;
    case 'registrations':
      return (
        <StepRegistrations practiceId={practiceId!} onDone={() => void onDone('registrations')} />
      );
    case 'team':
      return <StepTeam practiceId={practiceId!} onDone={() => void onDone('team')} />;
    case 'appointment_types':
      return (
        <StepBooking practiceId={practiceId!} onDone={() => void onDone('appointment_types')} />
      );
    case 'billing_setup':
      return <StepBilling practiceId={practiceId!} onDone={() => void onDone('billing_setup')} />;
    case 'review':
      return <StepReview practiceId={practiceId!} />;
  }
}
