import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Check, Circle, Loader2, Rocket } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { keys, useOnboarding } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { ChecklistItemDto } from '@gp/sdk';

/** Step 8. Required items block activation; recommended items never do. */
export function StepReview({ practiceId }: { practiceId: string }) {
  const onboarding = useOnboarding(practiceId);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = React.useState(false);

  async function activate() {
    setBusy(true);
    try {
      await api.activatePractice(practiceId);
      await queryClient.invalidateQueries({ queryKey: keys.onboarding(practiceId) });
      await refreshUser();
      toast.success('Your practice is live', {
        description: 'The appointment book is now open for business.',
      });
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Could not activate the practice', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  const data = onboarding.data;
  if (!data) return <Loader2 className="size-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">Setup complete</span>
          <span className="tabular text-muted-foreground text-sm">
            {data.completionPercent}%
          </span>
        </div>
        <Progress value={data.completionPercent} />
      </div>

      <ChecklistSection
        title="Required to activate"
        description="The practice cannot see patients until these are done."
        items={data.required}
      />

      <Separator />

      <ChecklistSection
        title="Recommended before seeing patients"
        description="These do not block activation, but they will keep showing on your dashboard until they are done."
        items={data.recommended}
      />

      {data.canActivate ? (
        <Alert variant="info">
          <Rocket />
          <AlertTitle>Ready to go</AlertTitle>
          <AlertDescription>
            Activating opens the appointment book and lets your team start seeing patients.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning">
          <AlertTitle>Not quite ready</AlertTitle>
          <AlertDescription>
            Finish the required items above and this button will unlock.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button size="lg" onClick={() => void activate()} disabled={busy || !data.canActivate}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
          Activate practice
        </Button>
      </div>
    </div>
  );
}

function ChecklistSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ChecklistItemDto[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-start gap-3 rounded-md border px-3 py-2.5"
          >
            {item.satisfied ? (
              <Check className="text-success mt-0.5 size-4 shrink-0" />
            ) : (
              <Circle className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            )}
            <div className="space-y-0.5">
              <p
                className={
                  item.satisfied ? 'text-muted-foreground text-sm line-through' : 'text-sm font-medium'
                }
              >
                {item.label}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.rationale}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
