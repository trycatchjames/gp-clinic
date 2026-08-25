import * as React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
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
import { Field } from '@/components/field';
import { Separator } from '@/components/ui/separator';

const DEMO_ACCOUNTS = [
  { email: 'anita.raman@example.com', label: 'Dr Anita Raman', role: 'Practice Owner' },
  { email: 'michelle.barnes@example.com', label: 'Michelle Barnes', role: 'Practice Manager' },
  { email: 'tom.nguyen@example.com', label: 'Dr Tom Nguyen', role: 'GP' },
  { email: 'jess.turner@example.com', label: 'Jess Turner', role: 'Receptionist' },
];
const DEMO_PASSWORD = 'BrunswickDemo2026';

export function LoginRoute() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const user = await signIn(email.trim(), password);
      navigate({ to: user.practiceId ? '/' : '/onboarding' });
    } catch (error) {
      toast.error('Could not sign in', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1 text-center">
          <div className="bg-primary text-primary-foreground mx-auto flex size-10 items-center justify-center rounded-lg font-bold">
            GP
          </div>
          <h1 className="text-xl font-semibold tracking-tight">GP Practice Management</h1>
          <p className="text-muted-foreground text-sm">
            For Australian general practice.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your practice email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Email" htmlFor="email" required>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Password" htmlFor="password" required>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <Separator className="my-5" />

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">
                Demo accounts — each shows a different role's view.
              </p>
              <div className="grid gap-1.5">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    className="hover:bg-accent flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(DEMO_PASSWORD);
                    }}
                  >
                    <span className="font-medium">{account.label}</span>
                    <span className="text-muted-foreground text-xs">{account.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-center text-sm">
          Setting up a new practice?{' '}
          <Link to="/register" className="text-foreground font-medium underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
