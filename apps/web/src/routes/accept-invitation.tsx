import * as React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { describeError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field } from '@/components/patterns/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AcceptInvitationRoute() {
  const { acceptInvitation } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { token?: string };
  const [token, setToken] = React.useState(search.token ?? '');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await acceptInvitation(token.trim(), password);
      toast.success('Welcome to the practice');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Could not accept the invitation', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join the practice</CardTitle>
          <CardDescription>
            Set a password to accept your invitation. Invitations are single use and expire
            after 14 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {!search.token && (
              <Alert variant="info">
                <AlertDescription>
                  Paste the invitation token from your email if it is not already filled in.
                </AlertDescription>
              </Alert>
            )}
            <Field label="Invitation token" htmlFor="token" required>
              <Input
                id="token"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono text-xs"
              />
            </Field>
            <Field label="Choose a password" htmlFor="password" required hint="At least 12 characters.">
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              Accept invitation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
